<script setup lang="ts">
/**
 * Hero — Spatial language: centered display type, frosted glass CTA pair,
 * product moment framed in a glass card. The chrome already lives in NoonToolNav.
 */
import { useI18n } from 'vue-i18n';
import { motion } from 'motion-v';
import * as LucideIcons from '@lucide/vue';
import { icons } from '../icons';
import NoonToolScreenshot from './NoonToolScreenshot.vue';

const { t } = useI18n();

const installHref =
  'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';
const DOCS_URL = 'https://nomu.kanocifer.chat/docs/';

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.55,
    ease: 'var(--ease-out)' as string,
    delay,
  },
});
</script>

<template>
  <section aria-labelledby="hero-heading" class="text-center">
    <motion.p
      v-bind="fade(0.05)"
      class="text-muted text-[11px] font-medium tracking-[0.22em] uppercase"
    >
      {{ t('noonTool.hero.eyebrow') }}
    </motion.p>

    <motion.h1
      v-bind="fade(0.15)"
      id="hero-heading"
      class="text-ink mx-auto mt-5 max-w-[16ch] text-[48px] leading-[1.02] font-semibold tracking-[-0.03em] md:text-[96px] md:leading-[0.98] md:tracking-[-0.05em]"
    >
      {{ t('noonTool.hero.headline') }}
      <br />
      <span class="text-accent">{{ t('noonTool.hero.headlineTail') }}</span>
    </motion.h1>

    <motion.p
      v-bind="fade(0.25)"
      class="text-muted mx-auto mt-7 max-w-[58ch] text-[17px] leading-[1.55] md:text-[19px]"
    >
      {{ t('noonTool.hero.subheadline') }}
    </motion.p>

    <motion.div
      v-bind="fade(0.34)"
      class="mt-9 flex flex-wrap items-center justify-center gap-3"
    >
      <a
        :href="installHref"
        target="_blank"
        rel="noopener"
        class="bg-accent text-contrast inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold shadow-[0_4px_18px_rgba(254,238,0,0.45)] transition-all hover:brightness-105 active:scale-[0.98]"
      >
        <component :is="(LucideIcons as any)[icons.cta]" :size="16" />
        {{ t('noonTool.hero.ctaPrimary') }}
      </a>
      <a
        href="#features"
        class="text-ink inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/60 px-5 py-3.5 text-[14px] font-medium backdrop-blur-md backdrop-saturate-150 transition-colors hover:bg-white/80"
      >
        {{ t('noonTool.hero.ctaSecondary') }}
      </a>
      <a
        :href="DOCS_URL"
        target="_blank"
        rel="noopener"
        class="text-muted hover:text-ink inline-flex items-center gap-1.5 rounded-full px-3 py-3.5 text-[14px] font-medium transition-colors"
      >
        <component :is="(LucideIcons as any)[icons.docs]" :size="14" />
        {{ t('noonTool.hero.ctaDocs') }}
      </a>
    </motion.div>

    <motion.div v-bind="fade(0.5)" class="mt-14">
      <NoonToolScreenshot
        video-src="/screens/01-hero.mp4"
        :alt="t('noonTool.hero.screenshotAlt')"
        aspect="16/10"
        :caption="t('noonTool.hero.screenshotCaption')"
      />
    </motion.div>
  </section>
</template>
