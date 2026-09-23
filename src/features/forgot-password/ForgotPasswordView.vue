<script setup lang="ts">
/**
 * ForgotPasswordView — /forgot-password
 *
 * Nomu 账号密码重置（mode='nomu'）。与后端契约（POST /password/reset
 * + POST /password/reset/confirm）严格对齐；落地页不落任何会话态。
 *
 * 流程：
 *   1. 步骤 1：邮箱 → 调 requestPasswordReset，后端始终 200，响应 body 带回 challenge
 *      前端一律切到步骤 2 + 固定话术「若该邮箱已注册，重置邮件已发送」，防枚举
 *   2. 步骤 2：验证码 + 新密码 + challenge → 调 confirmPasswordReset
 *      404「用户不存在」文案化成「验证码错误或邮箱未注册」，防枚举
 *   3. 成功：去安装 Nomu / 返回首页
 *
 * challenge 由步骤 1 拿到、只活在本页 ref 里，步骤 2 提交时回带给后端做会话绑定。
 */
import { useHead } from '@vueuse/head';
import axios from 'axios';
import { Check, LoaderCircle, Mail, ShieldUser, TriangleAlert, X } from '@lucide/vue';
import { motion, useReducedMotion } from 'motion-v';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { EASE_OUT, SPRING_SNUG } from '@/constants/motionPresets';
import { confirmPasswordReset, requestPasswordReset } from '@/lib/nomuPasswordReset';

const { t } = useI18n();

const SITE_URL = 'https://nomu.kanocifer.chat';
const INSTALL_HREF = 'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';
const PRIVACY_POLICY_HREF = 'https://nomu.kanocifer.chat/docs/privacy';

useHead({
  title: () => `${t('noonTool.forgotPassword.meta.title')} · Nomu`,
  meta: () => [
    { name: 'description', content: t('noonTool.forgotPassword.meta.description') },
    { property: 'og:title', content: t('noonTool.forgotPassword.meta.title') },
    { property: 'og:description', content: t('noonTool.forgotPassword.meta.description') },
    { property: 'og:url', content: `${SITE_URL}/forgot-password` },
  ],
});

const reduceMotion = useReducedMotion();

type Step = 'request' | 'confirm' | 'success';
const step = ref<Step>('request');

/* ---------- 步骤 1 表单状态 ---------- */

interface RequestErrors {
  email: string;
  submit: string;
}
const emailInput = ref('');
const requestErrors = ref<RequestErrors>({ email: '', submit: '' });
const isRequesting = ref(false);

/* 步骤 1 拿到的会话 challenge：只在内存里活到步骤 2，步骤 2 提交后随 confirm 上送。
   不持久化、不进 sessionStorage，刷新页面就让用户回到步骤 1 重新申请。 */
const challenge = ref<string>('');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function handleRequest() {
  requestErrors.value = { email: '', submit: '' };

  if (!emailInput.value) {
    requestErrors.value.email = t('noonTool.forgotPassword.errors.emailRequired');
    return;
  }
  if (!EMAIL_RE.test(emailInput.value)) {
    requestErrors.value.email = t('noonTool.forgotPassword.errors.emailInvalid');
    return;
  }

  isRequesting.value = true;
  try {
    /* 不管后端返什么（200 / 400 / 500），前端都按「邮件已发送」处理 ——
       防止 404「用户不存在」泄露邮箱注册状态。
       后端响应形态固定为 { data: { challenge: string } }，challenge 在第二层。 */
    const res = await requestPasswordReset(emailInput.value);
    challenge.value = pickChallenge(res);
    step.value = 'confirm';
  } catch {
    /* 网络错也按「邮件已发送」处理（用户拿不到错误就无能为力，文案一致即可）。
       真要排查可以看浏览器 network。 */
    step.value = 'confirm';
  } finally {
    isRequesting.value = false;
  }
}

/** 后端 reset 响应固定为 { data: { challenge: string } }，取第二层 challenge；缺失留空。 */
function pickChallenge(res: unknown): string {
  const inner = (res as { data?: { data?: unknown } } | undefined)?.data?.data;
  if (!inner || typeof inner !== 'object') return '';
  const v = (inner as Record<string, unknown>).challenge;
  return typeof v === 'string' && v.length > 0 ? v : '';
}

function backToRequest() {
  confirmErrors.value = { emailCode: '', newPassword: '', confirmPassword: '', submit: '' };
  codeInput.value = '';
  passwordInput.value = '';
  confirmPasswordInput.value = '';
  challenge.value = '';
  step.value = 'request';
}

/* ---------- 步骤 2 表单状态 ---------- */

interface ConfirmErrors {
  emailCode: string;
  newPassword: string;
  confirmPassword: string;
  submit: string;
}

const codeInput = ref('');
const passwordInput = ref('');
const confirmPasswordInput = ref('');
const confirmErrors = ref<ConfirmErrors>({
  emailCode: '',
  newPassword: '',
  confirmPassword: '',
  submit: '',
});
const isConfirming = ref(false);

const submitDisabled = computed(() => isConfirming.value || step.value === 'success');

function validateConfirm(): boolean {
  const e: ConfirmErrors = { emailCode: '', newPassword: '', confirmPassword: '', submit: '' };
  if (!codeInput.value) e.emailCode = t('noonTool.forgotPassword.errors.emailCodeRequired');
  if (!passwordInput.value) e.newPassword = t('noonTool.forgotPassword.errors.newPasswordRequired');
  else if (passwordInput.value.length < 6) e.newPassword = t('noonTool.forgotPassword.errors.newPasswordTooShort');
  if (!confirmPasswordInput.value) {
    e.confirmPassword = t('noonTool.forgotPassword.errors.confirmPasswordRequired');
  } else if (passwordInput.value !== confirmPasswordInput.value) {
    e.confirmPassword = t('noonTool.forgotPassword.errors.passwordMismatch');
  }
  confirmErrors.value = e;
  return !Object.values(e).some((v) => v);
}

async function handleConfirm() {
  if (!validateConfirm()) return;

  /* challenge 没拿到（步骤 1 catch 路径 / 字段名不匹配）——
     不要发空字符串过去让后端返 400，直接引导用户回步骤 1 重申请。 */
  if (!challenge.value) {
    confirmErrors.value.submit = t('noonTool.forgotPassword.errors.sessionExpired');
    return;
  }

  isConfirming.value = true;
  try {
    await confirmPasswordReset({
      email: emailInput.value,
      email_code: codeInput.value,
      new_password: passwordInput.value,
      challenge: challenge.value,
    });
    step.value = 'success';
    window.scrollTo({ top: 0, behavior: reduceMotion.value ? 'auto' : 'smooth' });
  } catch (err) {
    /* 错误码 → 文案映射：
       - 404「用户不存在」→ invalidCodeOrEmail（防枚举）
       - 400「密码必须与之前的不同」→ passwordSameAsOld
       - 400 binding 字段错 → 字段映射
       - 其它（500 / 网络）→ submitFailed / networkError */
    const data = axios.isAxiosError(err) ? err.response?.data : undefined;
    const status = axios.isAxiosError(err) ? err.response?.status : undefined;

    if (status === 404) {
      confirmErrors.value.submit = t('noonTool.forgotPassword.errors.invalidCodeOrEmail');
      return;
    }

    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>;
      const codeMsg = Array.isArray(obj.email_code) ? (obj.email_code[0] as string | undefined) : undefined;
      const newPwdMsg = Array.isArray(obj.new_password)
        ? (obj.new_password[0] as string | undefined)
        : undefined;
      const topMsg =
        typeof obj.message === 'string'
          ? obj.message
          : typeof obj.error === 'string'
            ? obj.error
            : undefined;
      if (codeMsg) confirmErrors.value.emailCode = codeMsg;
      if (newPwdMsg) confirmErrors.value.newPassword = newPwdMsg;
      if (topMsg) {
        /* 后端 400「密码必须与之前的不同」原文是中文「密码必须与之前的不同」，
           英文译本里也是 "password ... same as ...",为了不绑死 i18n 文案，简单包含判断。 */
        if (/不同|same as/i.test(topMsg)) {
          confirmErrors.value.submit = t('noonTool.forgotPassword.errors.passwordSameAsOld');
        } else {
          confirmErrors.value.submit = topMsg;
        }
      }
    }

    if (!confirmErrors.value.submit && !confirmErrors.value.emailCode && !confirmErrors.value.newPassword) {
      confirmErrors.value.submit = axios.isAxiosError(err)
        ? t('noonTool.forgotPassword.errors.networkError')
        : t('noonTool.forgotPassword.errors.submitFailed');
    }
  } finally {
    isConfirming.value = false;
  }
}

/* ---------- 入场动画 ---------- */

function fadeUp() {
  return reduceMotion.value
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 16, filter: 'blur(8px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
        transition: { duration: 0.55, ease: EASE_OUT },
      };
}
</script>

<template>
  <main class="bg-page min-h-screen px-4 pt-12 pb-20 sm:px-6 md:pt-16">
    <motion.div v-bind="fadeUp()" class="mx-auto flex w-full max-w-md flex-col items-stretch">
      <!-- 顶部：logo + 标题 -->
      <header class="mb-8 flex flex-col items-center text-center md:items-start md:text-left">
        <a href="/" class="mb-6 inline-flex items-center gap-2">
          <img src="/icon/32.png" alt="Nomu" class="size-7 rounded-md" />
          <span class="text-ink text-[15px] font-semibold tracking-tight">Nomu</span>
        </a>
        <h1
          class="text-ink text-[34px] leading-[1.08] font-semibold tracking-[-0.025em] md:text-[42px] md:tracking-[-0.035em]"
        >
          {{ t('noonTool.forgotPassword.headline') }}
        </h1>
        <p class="text-muted mt-3 max-w-md text-[15px] leading-[1.55]">
          {{ t('noonTool.forgotPassword.subheadline') }}
        </p>
      </header>

      <!-- 成功卡 -->
      <motion.section
        v-if="step === 'success'"
        :initial="reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }"
        :animate="reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }"
        :transition="SPRING_SNUG"
        class="flex flex-col items-center gap-5 rounded-[28px] border border-white/55 bg-white/60 px-6 py-10 text-center shadow-[0_24px_64px_-24px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
        role="status"
        aria-live="polite"
      >
        <div
          class="grid size-16 place-items-center rounded-2xl bg-white/85 text-[var(--shadow-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_18px_40px_-16px_rgba(254,238,0,0.45)]"
        >
          <Check :size="36" :stroke-width="2.2" />
        </div>
        <div class="flex flex-col gap-2">
          <h2 class="text-ink text-[22px] font-semibold tracking-[-0.02em]">
            {{ t('noonTool.forgotPassword.success.title') }}
          </h2>
          <p class="text-muted max-w-sm text-[14px] leading-[1.55]">
            {{ t('noonTool.forgotPassword.success.body') }}
          </p>
        </div>
        <div class="flex w-full flex-col gap-2 pt-2">
          <a
            :href="INSTALL_HREF"
            target="_blank"
            rel="noopener"
            class="bg-accent text-contrast inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium shadow-[0_4px_18px_rgba(254,238,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            {{ t('noonTool.forgotPassword.success.cta') }}
          </a>
          <a
            href="/"
            class="text-muted hover:text-ink inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] transition-colors hover:bg-white/55"
          >
            {{ t('noonTool.forgotPassword.success.back') }}
          </a>
        </div>
      </motion.section>

      <!-- 表单卡：步骤 1 或步骤 2 -->
      <section
        v-else
        class="rounded-[28px] border border-white/55 bg-white/55 px-6 py-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 sm:px-8"
        aria-labelledby="forgot-form-heading"
      >
        <h2 id="forgot-form-heading" class="sr-only">
          {{ t('noonTool.forgotPassword.headline') }}
        </h2>

        <!-- 步骤 1：邮箱 -->
        <form v-if="step === 'request'" class="flex flex-col gap-4" novalidate @submit.prevent="handleRequest">
          <div class="flex flex-col gap-1.5">
            <label for="forgot-email" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.forgotPassword.stepRequest.email') }}
            </label>
            <div class="relative">
              <Mail
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="forgot-email"
                v-model="emailInput"
                type="email"
                autocomplete="email"
                :placeholder="t('noonTool.forgotPassword.stepRequest.email')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{ '!border-destructive focus:!border-destructive focus:!ring-destructive/30': requestErrors.email }"
                required
              />
            </div>
            <p v-if="requestErrors.email" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ requestErrors.email }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="isRequesting"
            class="bg-accent text-contrast mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold shadow-[0_4px_18px_rgba(254,238,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LoaderCircle v-if="isRequesting" :size="16" :stroke-width="2.2" class="animate-spin" />
            <span>{{
              isRequesting
                ? t('noonTool.forgotPassword.stepRequest.submitting')
                : t('noonTool.forgotPassword.stepRequest.submit')
            }}</span>
          </button>

          <p v-if="requestErrors.submit" class="text-destructive flex items-center gap-1 text-[12px]">
            <TriangleAlert :size="12" :stroke-width="2" aria-hidden="true" />
            {{ requestErrors.submit }}
          </p>
        </form>

        <!-- 步骤 2：验证码 + 新密码 -->
        <form v-else class="flex flex-col gap-4" novalidate @submit.prevent="handleConfirm">
          <!-- 邮箱（只读显示 + 改邮箱） -->
          <div class="flex items-center justify-between gap-3 rounded-xl bg-white/40 px-3 py-2 text-[13px]">
            <span class="text-muted truncate">{{ t('noonTool.forgotPassword.stepConfirm.emailLabel') }}</span>
            <span class="text-ink truncate font-medium">{{ emailInput }}</span>
            <button
              type="button"
              class="text-muted hover:text-ink cursor-pointer text-[12px] underline decoration-current/35 underline-offset-[3px] transition-colors"
              @click="backToRequest"
            >
              {{ t('noonTool.forgotPassword.stepConfirm.changeEmail') }}
            </button>
          </div>

          <!-- 邮件已发送提示 -->
          <div
            class="bg-card text-muted border-border/60 rounded-xl border px-3 py-2 text-[12px] leading-[1.5]"
          >
            <p>{{ t('noonTool.forgotPassword.requestedHint') }}</p>
            <p>{{ t('noonTool.forgotPassword.requestedHintDetail') }}</p>
          </div>

          <!-- 验证码 -->
          <div class="flex flex-col gap-1.5">
            <label for="forgot-code" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.forgotPassword.stepConfirm.emailCode') }}
            </label>
            <div class="relative">
              <Mail
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="forgot-code"
                v-model="codeInput"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                maxlength="6"
                :placeholder="t('noonTool.forgotPassword.stepConfirm.emailCode')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] tracking-wider transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{
                  '!border-destructive focus:!border-destructive focus:!ring-destructive/30': confirmErrors.emailCode,
                }"
                required
              />
            </div>
            <p v-if="confirmErrors.emailCode" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ confirmErrors.emailCode }}
            </p>
          </div>

          <!-- 新密码 -->
          <div class="flex flex-col gap-1.5">
            <label for="forgot-new-password" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.forgotPassword.stepConfirm.newPassword') }}
            </label>
            <div class="relative">
              <ShieldUser
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="forgot-new-password"
                v-model="passwordInput"
                type="password"
                autocomplete="new-password"
                :placeholder="t('noonTool.forgotPassword.stepConfirm.newPassword')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{
                  '!border-destructive focus:!border-destructive focus:!ring-destructive/30': confirmErrors.newPassword,
                }"
                required
              />
            </div>
            <p v-if="confirmErrors.newPassword" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ confirmErrors.newPassword }}
            </p>
          </div>

          <!-- 确认新密码 -->
          <div class="flex flex-col gap-1.5">
            <label for="forgot-confirm" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.forgotPassword.stepConfirm.confirmPassword') }}
            </label>
            <div class="relative">
              <ShieldUser
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="forgot-confirm"
                v-model="confirmPasswordInput"
                type="password"
                autocomplete="new-password"
                :placeholder="t('noonTool.forgotPassword.stepConfirm.confirmPassword')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{
                  '!border-destructive focus:!border-destructive focus:!ring-destructive/30':
                    confirmErrors.confirmPassword,
                }"
                required
              />
            </div>
            <p v-if="confirmErrors.confirmPassword" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ confirmErrors.confirmPassword }}
            </p>
          </div>

          <button
            type="submit"
            :disabled="submitDisabled"
            class="bg-accent text-contrast mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold shadow-[0_4px_18px_rgba(254,238,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LoaderCircle v-if="isConfirming" :size="16" :stroke-width="2.2" class="animate-spin" />
            <span>{{
              isConfirming
                ? t('noonTool.forgotPassword.stepConfirm.submitting')
                : t('noonTool.forgotPassword.stepConfirm.submit')
            }}</span>
          </button>

          <p
            v-if="confirmErrors.submit"
            class="text-destructive bg-destructive-soft mt-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]"
            role="alert"
          >
            <TriangleAlert :size="14" :stroke-width="2" class="shrink-0" aria-hidden="true" />
            <span>{{ confirmErrors.submit }}</span>
          </p>
        </form>
      </section>

      <!-- 底部提示 — 隐私政策（忘记密码入口已上 nav，这里不放二级入口） -->
      <p class="text-muted/85 mt-6 text-center text-[12px] leading-[1.55]">
        <i18n-t keypath="noonTool.register.bottomHint">
          <template #privacy>
            <a
              :href="PRIVACY_POLICY_HREF"
              target="_blank"
              rel="noopener"
              class="text-muted hover:text-ink hover:decoration-ink/55 underline decoration-current/35 underline-offset-[3px] transition-colors"
              >{{ t('noonTool.register.privacy') }}</a
            >
          </template>
        </i18n-t>
      </p>
    </motion.div>
  </main>
</template>