<script setup lang="ts">
/**
 * 404 — Quiet variant (chosen direction).
 *
 * Of three candidates prototyped on /prototypes/404, this won. Rationale:
 * the product is a daily-use tool for Noon sellers, so a 404 should settle
 * in, give the answer, and move on — no fanfare, no illustration. The
 * competitor directions are Spatial (glass card mirroring the landing
 * vibrancy) and Editorial (massive 404 with a Noon-yellow dot replacing
 * the missing 0).
 *
 * Apple Design notes:
 * - Critically damped stagger (EASE_OUT, 0.55s each) — the page reads as
 *   settling in, not animating. Each item lands well under the sub-300ms
 *   per-item ceiling.
 * - Tracking -0.04em → -0.05em on the 120px headline per §15: large type
 *   wants negative tracking because letters read too far apart as they
 *   grow. Body proportions are unchanged.
 * - prefers-reduced-motion: drops the y/filter offsets and switches to a
 *   0.2s opacity cross-fade, so the settle-in doesn't become a vestibular
 *   trigger.
 * - prefers-reduced-transparency: the floating Nav already frosts up via
 *   the global `.glass` selector in LandingView, so this surface inherits.
 */
import { motion, useReducedMotion } from 'motion-v';
import { useI18n } from 'vue-i18n';
import { useHead } from '@vueuse/head';
import { EASE_OUT } from '@/constants/motionPresets';
import NoonToolNav from '@/features/landing/components/NoonToolNav.vue';
import NoonToolFooter from '@/features/landing/components/NoonToolFooter.vue';

const { t } = useI18n();
const reduceMotion = useReducedMotion();

useHead({
  title: () => t('noonTool.notFound.meta.title'),
  meta: () => [
    { name: 'description', content: t('noonTool.notFound.meta.description') },
    { name: 'robots', content: 'noindex,nofollow' },
  ],
});

const introContainer = {
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: reduceMotion.value ? 0 : 0.12,
        delayChildren: reduceMotion.value ? 0 : 0.08,
      },
    },
  },
};

const introItem = {
  variants: {
    hidden: reduceMotion.value
      ? { opacity: 0 }
      : { opacity: 0, y: 12, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: reduceMotion.value ? 0.2 : 0.55, ease: EASE_OUT },
    },
  },
};

const docsHref = 'https://nomu.kanocifer.chat/docs/';
const supportHref = 'https://nomu.kanocifer.chat/docs/guide/support';
</script>

<template>
  <div class="bg-page min-h-screen">
    <NoonToolNav />

    <main class="mx-auto max-w-[1180px] space-y-24 px-4 pt-32 pb-16 md:space-y-32 md:px-8 md:pt-40">
      <section
        aria-labelledby="not-found-title"
        class="flex min-h-[60vh] flex-col items-center justify-center px-6 py-20 text-center"
      >
        <motion.div v-bind="introContainer" class="flex max-w-xl flex-col items-center">
          <motion.p
            v-bind="introItem"
            class="text-muted text-[11px] font-medium tracking-[0.22em] uppercase"
          >
            {{ t('noonTool.notFound.quiet.eyebrow') }}
          </motion.p>

          <motion.h1
            v-bind="introItem"
            class="text-ink mt-5 text-[64px] leading-none font-semibold tracking-[-0.04em] md:text-[120px] md:tracking-[-0.05em]"
          >
            404
          </motion.h1>

          <motion.h2
            v-bind="introItem"
            id="not-found-title"
            class="text-ink mt-6 text-[22px] font-semibold tracking-[-0.01em] md:text-[26px]"
          >
            {{ t('noonTool.notFound.quiet.title') }}
          </motion.h2>

          <motion.p
            v-bind="introItem"
            class="text-muted mt-3 max-w-md text-[15px] leading-[1.55]"
          >
            {{ t('noonTool.notFound.quiet.body') }}
          </motion.p>

          <motion.div
            v-bind="introItem"
            class="mt-9 flex flex-wrap items-center justify-center gap-2"
          >
            <RouterLink
              to="/"
              :aria-label="t('noonTool.notFound.quiet.ctaHint')"
              class="bg-ink text-surface hover:bg-ink/90 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-[background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none"
            >
              {{ t('noonTool.notFound.quiet.cta') }}
            </RouterLink>
            <a
              :href="docsHref"
              target="_blank"
              rel="noopener"
              class="text-muted hover:text-ink inline-flex items-center rounded-full px-3 py-3 text-[14px] font-medium transition-colors"
            >
              {{ t('noonTool.notFound.quiet.docsLabel') }}
            </a>
            <a
              :href="supportHref"
              target="_blank"
              rel="noopener"
              class="text-muted hover:text-ink inline-flex items-center rounded-full px-3 py-3 text-[14px] font-medium transition-colors"
            >
              {{ t('noonTool.notFound.quiet.supportLabel') }}
            </a>
          </motion.div>
        </motion.div>
      </section>

      <NoonToolFooter />
    </main>
  </div>
</template>