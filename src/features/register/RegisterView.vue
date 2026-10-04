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
 *
 * 这一层只排版。两步状态机、每步校验、倒计时、后端错误映射、动效参数全在
 * `useRegisterForm` 里 —— 视图不该知道「验证码要等 60 秒」或「第 2 步从右侧
 * 滑入」这类事，改它们不用来翻这个 400 行的模板。
 *
 * 视觉：单栏窄列（25rem）浮在 RegisterScene 铺开的画面上。画是整片页面底色，
 * 不再是一块带边框的面板；表单用磨砂材质承住背后的光。黄色在这一页当**光**用 ——
 * CTA 与画里那张发光的验证码卡是仅有的两处，其余全是中性色。
 */
import { useHead } from '@unhead/vue';
import { ArrowRight, LoaderCircle, TriangleAlert } from '@lucide/vue';
import { AnimatePresence, motion } from 'motion-v';
import { useI18n } from 'vue-i18n';
import { installUrl } from '@/constants/install';
import NoonToolLocaleSwitch from '../landing/components/NoonToolLocaleSwitch.vue';
import RegisterScene from './RegisterScene.vue';
import TextField from './TextField.vue';
import { useRegisterForm } from './useRegisterForm';

const { t } = useI18n();

const SITE_URL = 'https://nomu.kanocifer.chat';
const INSTALL_HREF = installUrl('register');
const PRIVACY_POLICY_HREF = 'https://nomu.kanocifer.chat/docs/privacy';
const TERMS_HREF = 'https://nomu.kanocifer.chat/docs/terms';

useHead({
  title: () => `${t('noonTool.register.meta.title')} · Nomu`,
  meta: () => [
    { name: 'description', content: t('noonTool.register.meta.description') },
    { property: 'og:title', content: t('noonTool.register.meta.title') },
    { property: 'og:description', content: t('noonTool.register.meta.description') },
    { property: 'og:url', content: `${SITE_URL}/register` },
  ],
});

const {
  form,
  errors,
  step,
  stepLabel,
  stepMotion,
  enter,
  successMotion,
  showPassword,
  toggleReveal,
  isSendingCode,
  codeSent,
  canSendCode,
  sendCode,
  sendCodeLabel,
  isSubmitting,
  isSuccess,
  submitDisabled,
  submitLabel,
  submit,
  goBack,
} = useRegisterForm();
</script>

<template>
  <!-- w-full 而不是 w-screen：100vw 含滚动条宽度，页面一纵向滚动就横向溢出。
       overflow-x-clip 裁掉画里任何越界的一截（clip 不创建滚动容器，纵向照常滚）。 -->
  <div class="bg-page grain relative min-h-screen w-full overflow-x-clip">
    <!-- 桌面：两列 grid，表单一列、画一列，各自垂直居中。画不再绝对定位，
         所以两列有共同的中线，不会再有一高一低。
         header 跨两列单独一行：语言切换落到版心右端，不压在画的光晕上。 -->
    <main
      class="relative z-10 mx-auto grid w-full max-w-[64rem] grid-cols-1 px-5 pt-7 pb-24 sm:px-8 lg:min-h-screen lg:grid-cols-[minmax(0,25rem)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:items-center lg:gap-x-10 lg:px-10 lg:pt-10"
    >
      <!-- 顶部：logo + 品牌 + 语言切换。不用落地页的浮动导航，锚点在本页会落空 -->
      <header class="mb-9 flex items-center justify-between gap-3 lg:col-span-2 lg:row-start-1">
        <a href="/" class="focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-1 py-1">
          <img src="/icon/32.png" alt="Nomu" class="size-7 rounded-md" />
          <span class="text-ink text-[15px] font-semibold tracking-[-0.01em]">Nomu</span>
        </a>
        <NoonToolLocaleSwitch />
      </header>

      <!-- 表单列：z-10 保证浮在画上面（两者同层时 DOM 顺序会让画盖住表单） -->
      <div class="relative z-10 max-w-[25rem] lg:col-start-1 lg:row-start-2">
        <motion.div v-bind="enter">
          <!-- 标题：注册成功后整块让位给成功卡 —— 留着这行 40px 大字说
               「注册 Nomu 账号」会和卡里的「注册成功」互相打架，
               而且全页最大字号在说一件已经做完的事。 -->
          <div v-if="!isSuccess" class="mb-7">
            <h1
              class="text-ink text-[34px] leading-[1.14] font-semibold tracking-[-0.035em] text-balance md:text-[40px] md:tracking-[-0.04em]"
            >
              {{ t('noonTool.register.headline') }}
            </h1>
            <p class="text-muted mt-3 text-[15px] leading-[1.6] text-pretty">
              {{ t('noonTool.register.subheadline') }}
            </p>
            <!-- 分步了就得让人看见还剩几步：没有这条，「下一步」看起来像
                 多余的一层，用户会以为漏了字段，或者干脆不点。 -->
            <p class="text-muted/70 mt-2 text-[12.5px] tracking-[0.01em]">
              {{ stepLabel }}
            </p>
          </div>

          <!-- 成功态：替换表单，是这一页唯一的另一个状态 -->
          <motion.section
            v-if="isSuccess"
            v-bind="successMotion"
            class="[@media(prefers-reduced-transparency:reduce)]:bg-surface flex flex-col items-center gap-4 rounded-[26px] border border-[color-mix(in_oklch,var(--ink)_7%,transparent)] bg-[color-mix(in_oklch,var(--surface)_78%,transparent)] px-6 py-10 text-center shadow-[0_1px_1px_color-mix(in_oklch,var(--ink)_4%,transparent),0_24px_60px_-24px_color-mix(in_oklch,var(--ink)_22%,transparent)] backdrop-blur-[30px] backdrop-saturate-180 xl:min-h-[calc(100dvh-9rem)] xl:justify-center"
            role="status"
            aria-live="polite"
          >
            <!-- 画里的验证码卡同步换成对勾：这幅画跟着页面状态走完 -->
            <div class="bg-accent flex size-16 items-center justify-center rounded-full">
              <svg viewBox="0 0 24 24" class="size-8" aria-hidden="true">
                <path
                  d="m5 13 4.5 4.5L19 7"
                  fill="none"
                  stroke="var(--contrast)"
                  stroke-width="2.2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div class="flex flex-col gap-2">
              <h2 class="text-ink text-[21px] font-semibold tracking-[-0.02em]">
                {{ t('noonTool.register.success.title') }}
              </h2>
              <p class="text-muted max-w-[19rem] text-[14px] leading-[1.6] text-pretty">
                {{ t('noonTool.register.success.body') }}
              </p>
            </div>
            <div class="flex w-full flex-col gap-2 pt-1">
              <a
                :href="INSTALL_HREF"
                target="_blank"
                rel="noopener"
                class="bg-accent text-contrast inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold shadow-[var(--shadow-accent)] transition-[filter,transform] duration-200 ease-[var(--ease-out)] hover:-translate-y-px hover:brightness-105 active:scale-[0.99]"
              >
                {{ t('noonTool.register.success.cta') }}
                <ArrowRight :size="16" :stroke-width="2" aria-hidden="true" />
              </a>
              <a
                href="/"
                class="text-muted hover:text-ink inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[14px] transition-colors duration-200 hover:bg-[color-mix(in_oklch,var(--ink)_4%,transparent)]"
              >
                {{ t('noonTool.register.success.back') }}
              </a>
            </div>
          </motion.section>

          <!-- 表单卡：磨砂面承住背后的光。透明度只到 78% —— 再低透出来的光
               会把文字压到读不清（浅色材质不能叠浅色材质）。 -->
          <form
            v-else
            class="[@media(prefers-reduced-transparency:reduce)]:bg-surface rounded-[26px] border border-[color-mix(in_oklch,var(--ink)_7%,transparent)] bg-[color-mix(in_oklch,var(--surface)_78%,transparent)] px-6 py-7 shadow-[0_1px_1px_color-mix(in_oklch,var(--ink)_4%,transparent),0_24px_60px_-24px_color-mix(in_oklch,var(--ink)_22%,transparent)] backdrop-blur-[30px] backdrop-saturate-180"
            novalidate
            aria-labelledby="register-form-heading"
            @submit.prevent="submit"
          >
            <h2 id="register-form-heading" class="sr-only">{{ t('noonTool.register.headline') }}</h2>

            <!-- 第 1 步：账户信息。第 2 步：确认密码 + 邮箱验证码。
                 mode="wait" 让旧的一步先退干净再进下一步 —— 同步交叉的话两个
                 表单会在同一位置叠着退场，容器高度翻倍，页面跟着抖一下。 -->
            <AnimatePresence mode="wait" :initial="false">
              <motion.div v-if="step === 1" :key="1" class="flex flex-col gap-5" v-bind="stepMotion">
                <TextField
                  v-model="form.username"
                  id="reg-username"
                  :label="t('noonTool.register.form.username')"
                  autocomplete="username"
                  :error="errors.username"
                />
                <TextField
                  v-model="form.email"
                  id="reg-email"
                  type="email"
                  :label="t('noonTool.register.form.email')"
                  autocomplete="email"
                  :error="errors.email"
                />
                <TextField
                  v-model="form.password"
                  id="reg-password"
                  :type="showPassword ? 'text' : 'password'"
                  :label="t('noonTool.register.form.password')"
                  autocomplete="new-password"
                  :error="errors.password"
                  revealable
                  :reveal-label="
                    showPassword ? t('noonTool.register.form.hidePassword') : t('noonTool.register.form.showPassword')
                  "
                  @toggle-reveal="toggleReveal"
                />
              </motion.div>

              <motion.div v-else :key="2" class="flex flex-col gap-5" v-bind="stepMotion">
                <TextField
                  v-model="form.confirmPassword"
                  id="reg-confirm"
                  :type="showPassword ? 'text' : 'password'"
                  :label="t('noonTool.register.form.confirmPassword')"
                  autocomplete="new-password"
                  :error="errors.confirmPassword"
                  revealable
                  :reveal-label="
                    showPassword ? t('noonTool.register.form.hidePassword') : t('noonTool.register.form.showPassword')
                  "
                  @toggle-reveal="toggleReveal"
                />

                <!-- 验证码：和其余字段同一种长相，不再单独垫一块黄底。
                     这一页里「要去邮箱收信」那一步由画面上那张发光的卡在讲，
                     表单这边保持安静；黄色留给 CTA 和那张卡。 -->
                <div>
                  <label for="reg-code" class="text-ink text-[13px] font-medium">
                    {{ t('noonTool.register.form.emailCode') }}
                  </label>
                  <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
                    <input
                      id="reg-code"
                      v-model="form.emailCode"
                      type="text"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      :placeholder="t('noonTool.register.form.emailCodeHint')"
                      :aria-invalid="errors.emailCode ? 'true' : undefined"
                      class="text-ink placeholder:text-muted/55 focus:border-accent-slate focus:bg-surface focus:ring-accent-slate/26 [@media(prefers-reduced-transparency:reduce)]:bg-surface w-full flex-1 rounded-[13px] border border-[color-mix(in_oklch,var(--ink)_10%,transparent)] bg-[color-mix(in_oklch,var(--surface)_66%,transparent)] px-[0.85rem] py-[0.7rem] text-[15px] tracking-[0.2em] transition-[border-color,background-color,box-shadow] duration-200 ease-[var(--ease-out)] placeholder:tracking-normal hover:bg-[color-mix(in_oklch,var(--surface)_82%,transparent)] focus:ring-2 focus:outline-none"
                      :class="{
                        '!border-destructive focus:!border-destructive focus:!ring-destructive/30': errors.emailCode,
                      }"
                    />
                    <button
                      type="button"
                      :disabled="!canSendCode"
                      :aria-label="sendCodeLabel"
                      class="text-ink bg-surface inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-[13px] border border-[color-mix(in_oklch,var(--ink)_22%,transparent)] px-4 py-[0.7rem] text-[14px] font-semibold transition-[background-color,transform] duration-200 ease-[var(--ease-out)] enabled:hover:bg-[color-mix(in_oklch,var(--ink)_6%,var(--surface))] enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-55"
                      @click="sendCode"
                    >
                      <LoaderCircle
                        v-if="isSendingCode"
                        :size="14"
                        :stroke-width="2.2"
                        class="animate-spin"
                        aria-hidden="true"
                      />
                      <span>{{ sendCodeLabel }}</span>
                    </button>
                  </div>
                  <p v-if="codeSent" class="text-muted mt-2.5 text-[12.5px] leading-[1.5]">
                    {{ t('noonTool.register.form.codeSentTo', { email: form.email }) }}
                  </p>
                  <p v-if="errors.emailCode" class="text-destructive mt-2 flex items-center gap-1 text-[12.5px]">
                    <TriangleAlert :size="13" :stroke-width="2" class="shrink-0" aria-hidden="true" />
                    {{ errors.emailCode }}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>

            <!-- 整体错误（后端 error/message） -->
            <p
              v-if="errors.submit"
              class="bg-destructive-soft text-destructive mt-4 flex items-center gap-1.5 rounded-lg px-3 py-2 text-[13px]"
              role="alert"
            >
              <TriangleAlert :size="14" :stroke-width="2" class="shrink-0" aria-hidden="true" />
              <span>{{ errors.submit }}</span>
            </p>

            <!-- CTA 行：DOM 顺序 = 视觉顺序 = 重要性顺序，主操作「注册」在最前
                 （键盘 Tab 和读屏先碰到它）。sm+ 用 row-reverse 把次要的「上一步」
                 翻到左侧；窄屏不需要 reverse，「注册」本来就在「上一步」上方。 -->
            <div class="mt-6 flex flex-col gap-4 sm:flex-row-reverse sm:items-center">
              <button
                type="submit"
                :disabled="submitDisabled"
                class="bg-accent text-contrast inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full px-6 py-3 text-[15px] font-semibold shadow-[var(--shadow-accent)] transition-[filter,transform] duration-200 ease-[var(--ease-out)] enabled:hover:-translate-y-px enabled:hover:brightness-105 enabled:active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LoaderCircle
                  v-if="isSubmitting"
                  :size="16"
                  :stroke-width="2.2"
                  class="animate-spin"
                  aria-hidden="true"
                />
                <span>{{ submitLabel }}</span>
              </button>
              <button
                v-if="step === 2"
                type="button"
                class="text-muted hover:text-ink inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full px-5 py-3 text-[15px] font-medium transition-colors duration-200 hover:bg-[color-mix(in_oklch,var(--ink)_5%,transparent)]"
                @click="goBack"
              >
                {{ t('noonTool.register.form.back') }}
              </button>
            </div>

            <!-- 法务提示跟着它约束的那个动作走。用 text-balance 而不是 text-pretty：
                 这是一句固定长度的声明，pretty 只会避免单词孤行，结果把
                 「privacy policy.」整段甩到第二行；balance 让两行长度相当。 -->
            <p class="text-muted/80 mt-4 text-[12px] leading-[1.6] text-balance">
              <i18n-t keypath="noonTool.register.bottomHint">
                <template #terms>
                  <a
                    :href="TERMS_HREF"
                    target="_blank"
                    rel="noopener"
                    class="text-muted hover:text-ink underline decoration-current/35 underline-offset-[3px] transition-colors"
                    >{{ t('noonTool.register.terms') }}</a
                  >
                </template>
                <template #privacy>
                  <a
                    :href="PRIVACY_POLICY_HREF"
                    target="_blank"
                    rel="noopener"
                    class="text-muted hover:text-ink underline decoration-current/35 underline-offset-[3px] transition-colors"
                    >{{ t('noonTool.register.privacy') }}</a
                  >
                </template>
              </i18n-t>
            </p>
          </form>
        </motion.div>
      </div>

      <RegisterScene :done="isSuccess" class="mt-10 lg:col-start-2 lg:row-start-2 lg:mt-0" />
    </main>
  </div>
</template>
