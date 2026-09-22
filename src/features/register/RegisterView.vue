<script setup lang="ts">
/**
 * RegisterView — /register
 *
 * 落地页（nomu.kanocifer.chat）的注册表单。把 ReadingList 主站
 * （frontend/packages/api/src/gateways/auth.ts）的 register / sendRegisterEmailCode
 * 端点（POST /v3/register、POST /v3/email/code）直接复制到落地页的 lib 里，
 * mode 强制 'nomu'，让邮件走 Nomu 模板、redis 走 nomu 命名空间。
 *
 * 落地页不承担会话态：注册成功只显示成功卡 + 跳转安装链接，不落 cookie / token；
 * 已注册账号后续登录走 /nomu/login 的魔法链接（NomuLoginView），与本页正交。
 */
import { useHead } from '@vueuse/head';
import axios from 'axios';
import { Check, LoaderCircle, Mail, ShieldUser, TriangleAlert, X } from '@lucide/vue';
import { motion, useReducedMotion } from 'motion-v';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { EASE_OUT, SPRING_SNUG } from '@/constants/motionPresets';
import { sendRegisterEmailCode, submitRegistration } from '@/lib/nomuRegister';

const { t } = useI18n();

const SITE_URL = 'https://nomu.kanocifer.chat';
const INSTALL_HREF = 'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';
const PRIVACY_POLICY_HREF = 'https://nomu.kanocifer.chat/docs/privacy';

useHead({
  title: () => `${t('noonTool.register.meta.title')} · Nomu`,
  meta: () => [
    { name: 'description', content: t('noonTool.register.meta.description') },
    { property: 'og:title', content: t('noonTool.register.meta.title') },
    { property: 'og:description', content: t('noonTool.register.meta.description') },
    { property: 'og:url', content: `${SITE_URL}/register` },
  ],
});

const reduceMotion = useReducedMotion();

/* ---------- 表单状态 ---------- */

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
}

interface ErrorState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  emailCode: string;
  submit: string;
}

const form = ref<FormState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  emailCode: '',
});

const errors = ref<ErrorState>({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  emailCode: '',
  submit: '',
});

const isSubmitting = ref(false);
const isSendingCode = ref(false);
const codeCountdown = ref(0);
const codeSent = ref(false);
const isSuccess = ref(false);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const submitDisabled = computed(() => isSubmitting.value || isSuccess.value || !form.value.emailCode);

/* ---------- 倒计时（setInterval 句柄挂在 module-scoped 闭包） ---------- */

let countdownTimer: ReturnType<typeof setInterval> | null = null;

function startCountdown(seconds: number) {
  codeCountdown.value = seconds;
  countdownTimer = setInterval(() => {
    codeCountdown.value--;
    if (codeCountdown.value <= 0) {
      if (countdownTimer) clearInterval(countdownTimer);
      countdownTimer = null;
      codeSent.value = false;
    }
  }, 1000);
}

onMounted(() => {
  return () => {
    if (countdownTimer) clearInterval(countdownTimer);
  };
});

/* ---------- 发送验证码 ---------- */

const sendCodeLabel = computed(() => {
  if (isSendingCode.value) return t('noonTool.register.form.sending');
  if (codeCountdown.value > 0) return t('noonTool.register.form.resendIn', { n: codeCountdown.value });
  if (codeSent.value) return t('noonTool.register.form.sent');
  return t('noonTool.register.form.sendCode');
});

async function handleSendCode() {
  errors.value.email = '';
  errors.value.submit = '';

  if (!form.value.email) {
    errors.value.email = t('noonTool.register.errors.emailRequired');
    return;
  }
  if (!EMAIL_RE.test(form.value.email)) {
    errors.value.email = t('noonTool.register.errors.emailInvalid');
    return;
  }

  isSendingCode.value = true;
  try {
    await sendRegisterEmailCode(form.value.email);
    codeSent.value = true;
    startCountdown(60);
  } catch (err) {
    errors.value.email = extractAxiosFieldError(err, 'email') || t('noonTool.register.errors.sendCodeFailed');
  } finally {
    isSendingCode.value = false;
  }
}

/* ---------- 提交注册 ---------- */

function clearErrors() {
  errors.value = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    emailCode: '',
    submit: '',
  };
}

async function handleSubmit() {
  clearErrors();

  /* 前端校验：必填 + 密码一致性 */
  if (!form.value.username) errors.value.username = t('noonTool.register.errors.usernameRequired');
  if (!form.value.email) errors.value.email = t('noonTool.register.errors.emailRequired');
  else if (!EMAIL_RE.test(form.value.email)) errors.value.email = t('noonTool.register.errors.emailInvalid');
  if (!form.value.password) errors.value.password = t('noonTool.register.errors.passwordRequired');
  if (!form.value.confirmPassword) {
    errors.value.confirmPassword = t('noonTool.register.errors.confirmPasswordRequired');
  } else if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = t('noonTool.register.errors.passwordMismatch');
  }
  if (!form.value.emailCode) errors.value.emailCode = t('noonTool.register.errors.emailCodeRequired');

  if (Object.values(errors.value).some((v) => v)) return;

  isSubmitting.value = true;
  try {
    await submitRegistration({
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      confirm_password: form.value.confirmPassword,
      email_code: form.value.emailCode,
    });
    isSuccess.value = true;
    /* 滚动到顶部，让成功卡可见（移动端键盘可能遮住） */
    window.scrollTo({ top: 0, behavior: reduceMotion.value ? 'auto' : 'smooth' });
  } catch (err) {
    /* 后端按字段返回错误数组（{field: [msg, ...]}），逐字段映射；其它错误归到 submit。 */
    const data = axios.isAxiosError(err) ? err.response?.data : undefined;
    if (data && typeof data === 'object') {
      if (Array.isArray(data.username) && data.username[0]) errors.value.username = data.username[0];
      if (Array.isArray(data.email) && data.email[0]) errors.value.email = data.email[0];
      if (Array.isArray(data.password) && data.password[0]) errors.value.password = data.password[0];
      if (Array.isArray(data.confirm_password) && data.confirm_password[0]) {
        errors.value.confirmPassword = data.confirm_password[0];
      }
      if (Array.isArray(data.email_code) && data.email_code[0]) errors.value.emailCode = data.email_code[0];
      if (typeof data.error === 'string') errors.value.submit = data.error;
      if (typeof data.message === 'string' && !errors.value.submit) errors.value.submit = data.message;
    }
    if (!Object.values(errors.value).some((v) => v)) {
      errors.value.submit = (err instanceof Error && err.message) || t('noonTool.register.errors.submitFailed');
    }
  } finally {
    isSubmitting.value = false;
  }
}

function extractAxiosFieldError(err: unknown, field: string): string {
  if (!axios.isAxiosError(err)) return '';
  const data = err.response?.data;
  if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>)[field])) {
    const arr = (data as Record<string, string[]>)[field];
    return arr[0] ?? '';
  }
  if (data && typeof data === 'object' && typeof (data as Record<string, unknown>).message === 'string') {
    return (data as Record<string, string>).message;
  }
  return '';
}

/* ---------- 页面入场动画 ---------- */

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
          {{ t('noonTool.register.headline') }}
        </h1>
        <p class="text-muted mt-3 max-w-md text-[15px] leading-[1.55]">
          {{ t('noonTool.register.subheadline') }}
        </p>
      </header>

      <!-- 成功状态卡（替换表单） -->
      <motion.section
        v-if="isSuccess"
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
            {{ t('noonTool.register.success.title') }}
          </h2>
          <p class="text-muted max-w-sm text-[14px] leading-[1.55]">
            {{ t('noonTool.register.success.body') }}
          </p>
        </div>
        <div class="flex w-full flex-col gap-2 pt-2">
          <a
            :href="INSTALL_HREF"
            target="_blank"
            rel="noopener"
            class="bg-accent text-contrast inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-medium shadow-[0_4px_18px_rgba(254,238,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98]"
          >
            {{ t('noonTool.register.success.cta') }}
          </a>
          <a
            href="/"
            class="text-muted hover:text-ink inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] transition-colors hover:bg-white/55"
          >
            {{ t('noonTool.register.success.back') }}
          </a>
        </div>
      </motion.section>

      <!-- 注册表单卡（玻璃质感，Apple "vibrancy"） -->
      <section
        v-else
        class="rounded-[28px] border border-white/55 bg-white/55 px-6 py-7 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 sm:px-8"
        aria-labelledby="register-form-heading"
      >
        <h2 id="register-form-heading" class="sr-only">
          {{ t('noonTool.register.headline') }}
        </h2>

        <form class="flex flex-col gap-4" novalidate @submit.prevent="handleSubmit">
          <!-- 用户名 -->
          <div class="flex flex-col gap-1.5">
            <label for="reg-username" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.register.form.username') }}
            </label>
            <div class="relative">
              <ShieldUser
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="reg-username"
                v-model="form.username"
                type="text"
                autocomplete="username"
                :placeholder="t('noonTool.register.form.username')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{ '!border-destructive focus:!border-destructive focus:!ring-destructive/30': errors.username }"
                required
              />
            </div>
            <p v-if="errors.username" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ errors.username }}
            </p>
          </div>

          <!-- 邮箱 -->
          <div class="flex flex-col gap-1.5">
            <label for="reg-email" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.register.form.email') }}
            </label>
            <div class="relative">
              <Mail
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="reg-email"
                v-model="form.email"
                type="email"
                autocomplete="email"
                :placeholder="t('noonTool.register.form.email')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{ '!border-destructive focus:!border-destructive focus:!ring-destructive/30': errors.email }"
                required
              />
            </div>
            <p v-if="errors.email" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ errors.email }}
            </p>
          </div>

          <!-- 密码 -->
          <div class="flex flex-col gap-1.5">
            <label for="reg-password" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.register.form.password') }}
            </label>
            <div class="relative">
              <ShieldUser
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="reg-password"
                v-model="form.password"
                type="password"
                autocomplete="new-password"
                :placeholder="t('noonTool.register.form.password')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{ '!border-destructive focus:!border-destructive focus:!ring-destructive/30': errors.password }"
                required
              />
            </div>
            <p v-if="errors.password" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ errors.password }}
            </p>
          </div>

          <!-- 确认密码 -->
          <div class="flex flex-col gap-1.5">
            <label for="reg-confirm" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.register.form.confirmPassword') }}
            </label>
            <div class="relative">
              <ShieldUser
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="reg-confirm"
                v-model="form.confirmPassword"
                type="password"
                autocomplete="new-password"
                :placeholder="t('noonTool.register.form.confirmPassword')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-3 pl-10 text-[15px] transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{
                  '!border-destructive focus:!border-destructive focus:!ring-destructive/30': errors.confirmPassword,
                }"
                required
              />
            </div>
            <p v-if="errors.confirmPassword" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ errors.confirmPassword }}
            </p>
          </div>

          <!-- 邮箱验证码 -->
          <div class="flex flex-col gap-1.5">
            <label for="reg-code" class="text-ink text-[13px] font-medium">
              {{ t('noonTool.register.form.emailCode') }}
            </label>
            <div class="relative">
              <Mail
                :size="18"
                :stroke-width="1.75"
                class="text-muted/70 pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
                aria-hidden="true"
              />
              <input
                id="reg-code"
                v-model="form.emailCode"
                type="text"
                inputmode="numeric"
                autocomplete="one-time-code"
                :placeholder="t('noonTool.register.form.emailCode')"
                class="border-border/60 bg-surface/70 text-ink placeholder:text-muted/55 focus:border-accent-slate focus:ring-accent-slate/30 w-full rounded-xl border py-2.5 pr-28 pl-10 text-[15px] tracking-wider transition-[border-color,box-shadow] duration-150 ease-[var(--ease-out)] focus:ring-2 focus:outline-none"
                :class="{
                  '!border-destructive focus:!border-destructive focus:!ring-destructive/30': errors.emailCode,
                }"
                required
              />
              <button
                type="button"
                :disabled="isSendingCode || codeCountdown > 0"
                class="text-ink absolute top-1/2 right-1.5 -translate-y-1/2 cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors duration-150 ease-[var(--ease-out)] enabled:hover:bg-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                :aria-label="sendCodeLabel"
                @click="handleSendCode"
              >
                <LoaderCircle v-if="isSendingCode" :size="14" :stroke-width="2.2" class="animate-spin" />
                <span v-else>{{ sendCodeLabel }}</span>
              </button>
            </div>
            <p v-if="errors.emailCode" class="text-destructive flex items-center gap-1 text-[12px]">
              <X :size="12" :stroke-width="2" aria-hidden="true" />
              {{ errors.emailCode }}
            </p>
          </div>

          <!-- 提交 -->
          <button
            type="submit"
            :disabled="submitDisabled"
            class="bg-accent text-contrast mt-2 inline-flex cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold shadow-[0_4px_18px_rgba(254,238,0,0.4)] transition-all hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LoaderCircle v-if="isSubmitting" :size="16" :stroke-width="2.2" class="animate-spin" />
            <span>{{
              isSubmitting ? t('noonTool.register.form.submitting') : t('noonTool.register.form.submit')
            }}</span>
          </button>

          <!-- 整体错误（后端 error/message） -->
          <p
            v-if="errors.submit"
            class="text-destructive bg-destructive-soft mt-1 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]"
            role="alert"
          >
            <TriangleAlert :size="14" :stroke-width="2" class="shrink-0" aria-hidden="true" />
            <span>{{ errors.submit }}</span>
          </p>
        </form>
      </section>

      <!-- 底部提示 — 「隐私政策」用插槽内嵌链接到 NomuDocs 的 /docs/privacy -->
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
