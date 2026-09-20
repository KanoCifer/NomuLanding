<script setup lang="ts">
/**
 * NomuLoginView — Nomu 无密码登录回调页（/nomu/login）。
 *
 * 流程（nomu 接法 B，契约见 ReadingList 仓库
 * frontend/apps/vue-app/src/features/noontool/README.md）：
 *  1. 用户在邮件里点 https://nomu.kanocifer.chat/nomu/login?token=<64-hex>:nomu
 *  2. 本页从 query.token 读出参数（mode 段已嵌在 token 里）
 *  3. 调 consumeNomuMagicLink → POST /v3/nomu/magic-login
 *  4. 后端确认后把登录结果写回 device 槽位，Nomu 扩展侧轮询拿到最终结果
 *  5. 本页只负责「转发成功 / 失败」的反馈，不落任何会话态
 *
 * 文案跟随 app 语言（vue-i18n，缺省英文）；来自后端的 err.message 保留原文。
 */
import { useHead } from '@vueuse/head';
import { Check, LoaderCircle, TriangleAlert } from '@lucide/vue';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { consumeNomuMagicLink } from '@/lib/nomuLogin';

const { t } = useI18n();
const route = useRoute();

useHead({ title: 'Nomu — Login' });

type Status = 'pending' | 'success' | 'error';
const status = ref<Status>('pending');
const message = ref('');

const headline = computed(() => {
  if (status.value === 'pending') return t('noonTool.login.headlinePending');
  if (status.value === 'success') return t('noonTool.login.headlineSuccess');
  return t('noonTool.login.headlineError');
});

const subline = computed(() => {
  if (status.value === 'pending') return t('noonTool.login.sublinePending');
  if (status.value === 'success') return t('noonTool.login.sublineSuccess');
  return message.value || t('noonTool.login.sublineFallbackError');
});

onMounted(async () => {
  const rawToken = route.query.token;
  const token = typeof rawToken === 'string' ? rawToken : '';

  if (!token) {
    status.value = 'error';
    message.value = t('noonTool.login.missingTokenError');
    return;
  }

  try {
    await consumeNomuMagicLink(token);
    status.value = 'success';
  } catch (err) {
    status.value = 'error';
    message.value = err instanceof Error && err.message ? err.message : '';
  }
});

/**
 * 用户已经在 Nomu 扩展内走完流程，关掉这个确认 tab 即可。
 * window.close() 在由脚本而非用户手势打开的窗口上会被浏览器拒绝，
 * 这里只对扩展侧 chrome.tabs 打开的回调 tab 调用，确保行为一致。
 */
function closePage(): void {
  window.close();
}

/** 失败时允许用户重试，直接刷新当前路由。 */
function retry(): void {
  location.reload();
}
</script>

<template>
  <div class="bloom-root">
    <div class="bloom-stage">
      <!-- 巨幅 glyph，带柔和径向光晕 -->
      <div class="bloom-glyph-wrap" :data-phase="status">
        <div class="bloom-glyph">
          <LoaderCircle v-if="status === 'pending'" class="bloom-icon bloom-icon-spin" />
          <Check v-else-if="status === 'success'" class="bloom-icon" />
          <TriangleAlert v-else class="bloom-icon" />
        </div>
        <div class="bloom-glow"></div>
      </div>

      <h1 class="bloom-headline">{{ headline }}</h1>
      <p class="bloom-subline">{{ subline }}</p>

      <!-- success：用户回扩展继续 -->
      <button v-if="status === 'success'" class="bloom-btn bloom-btn-secondary" type="button" @click="closePage">
        {{ t('noonTool.login.closePage') }}
      </button>

      <!-- error：重试 -->
      <button v-else-if="status === 'error'" class="bloom-btn bloom-btn-primary" type="button" @click="retry">
        {{ t('noonTool.login.retry') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 颜色刻意写死：这是扩展登录流程的确认页，与 Nomu 品牌色（Noon 黄）
   解耦，用系统蓝/绿/红三态语义色，与 ReadingList 里的同款页面一致。 */
.bloom-root {
  min-height: 100dvh;
  display: grid;
  place-items: center;
  padding: 48px 24px;
  background: var(--page);
}

.bloom-stage {
  width: min(480px, 100%);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* Glyph */
.bloom-glyph-wrap {
  position: relative;
  width: 160px;
  height: 160px;
  display: grid;
  place-items: center;
  margin-bottom: 40px;
  animation: bloom-glyph-in 760ms var(--ease-out) both;
}
.bloom-glyph-wrap[data-phase='success'] {
  animation: bloom-glyph-pop 720ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.bloom-glyph {
  width: 120px;
  height: 120px;
  border-radius: 32px;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 1;
  color: #007aff;
  background: radial-gradient(
    circle at 30% 28%,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85) 40%,
    rgba(235, 240, 255, 0.9) 100%
  );
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 -2px 8px rgba(0, 0, 0, 0.04) inset,
    0 30px 60px -20px rgba(0, 122, 255, 0.32),
    0 12px 32px -8px rgba(0, 122, 255, 0.18);
}
.bloom-glyph-wrap[data-phase='success'] .bloom-glyph {
  color: #34c759;
  background: radial-gradient(
    circle at 30% 28%,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85) 40%,
    rgba(225, 245, 230, 0.9) 100%
  );
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 -2px 8px rgba(0, 0, 0, 0.04) inset,
    0 30px 60px -20px rgba(52, 199, 89, 0.34),
    0 12px 32px -8px rgba(52, 199, 89, 0.18);
}
.bloom-glyph-wrap[data-phase='error'] .bloom-glyph {
  color: #ff3b30;
  background: radial-gradient(
    circle at 30% 28%,
    rgba(255, 255, 255, 0.95),
    rgba(255, 255, 255, 0.85) 40%,
    rgba(255, 230, 228, 0.9) 100%
  );
  box-shadow:
    0 1px 0 rgba(255, 255, 255, 0.9) inset,
    0 -2px 8px rgba(0, 0, 0, 0.04) inset,
    0 30px 60px -20px rgba(255, 59, 48, 0.34),
    0 12px 32px -8px rgba(255, 59, 48, 0.18);
}

/* 背后柔光 */
.bloom-glow {
  position: absolute;
  inset: -40px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 122, 255, 0.18), transparent 65%);
  filter: blur(28px);
  z-index: 0;
  opacity: 0;
  animation: bloom-glow-in 1200ms cubic-bezier(0.4, 0, 0.2, 1) 200ms forwards;
}
.bloom-glyph-wrap[data-phase='success'] .bloom-glow {
  background: radial-gradient(circle, rgba(52, 199, 89, 0.18), transparent 65%);
}
.bloom-glyph-wrap[data-phase='error'] .bloom-glow {
  background: radial-gradient(circle, rgba(255, 59, 48, 0.18), transparent 65%);
}

.bloom-icon {
  width: 72px;
  height: 72px;
  stroke-width: 1.6;
}
.bloom-icon-spin {
  animation: bloom-spin 1.4s linear infinite;
}

@keyframes bloom-spin {
  to {
    transform: rotate(360deg);
  }
}
@keyframes bloom-glyph-in {
  from {
    opacity: 0;
    transform: translateY(8px) scale(0.94);
    filter: blur(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
}
@keyframes bloom-glyph-pop {
  0% {
    opacity: 0;
    transform: scale(0.7) rotate(-6deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.06) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0);
  }
}
@keyframes bloom-glow-in {
  from {
    opacity: 0;
    transform: scale(0.85);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 标题 / 副标 */
.bloom-headline {
  margin: 0;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: -0.024em;
  line-height: 1.18;
  color: var(--ink);
  animation: bloom-fade-up 600ms var(--ease-out) 160ms both;
}
.bloom-subline {
  margin: 12px 0 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.45;
  letter-spacing: -0.005em;
  color: var(--muted-text);
  max-width: 380px;
  animation: bloom-fade-up 600ms var(--ease-out) 240ms both;
}
@keyframes bloom-fade-up {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 按钮 */
.bloom-btn {
  margin-top: 36px;
  font: inherit;
  font-size: 15px;
  font-weight: 500;
  padding: 11px 22px;
  border-radius: 999px;
  border: 0;
  cursor: pointer;
  transition:
    background-color 180ms ease-out,
    transform 120ms ease-out;
  animation: bloom-fade-up 600ms var(--ease-out) 360ms both;
}
.bloom-btn:active {
  transform: scale(0.985);
}
.bloom-btn-primary {
  background: #007aff;
  color: white;
  font-weight: 600;
}
.bloom-btn-primary:hover {
  background: #0a84ff;
}
.bloom-btn-secondary {
  background: var(--secondary);
  color: var(--ink);
}
.bloom-btn-secondary:hover {
  background: var(--card);
}

@media (prefers-reduced-motion: reduce) {
  .bloom-glyph-wrap,
  .bloom-glyph,
  .bloom-glow,
  .bloom-icon-spin,
  .bloom-headline,
  .bloom-subline,
  .bloom-btn {
    animation: none !important;
  }
}
</style>
