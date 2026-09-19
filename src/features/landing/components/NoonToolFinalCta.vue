<script setup lang="ts">
/**
 * FinalCta — Spatial closer:
 * Big translucent container with the yellow accent inside. The accent stays the
 * call-to-action moment; the surrounding glass makes it feel intentional instead
 * of abrupt. Apple closer pattern: title + body on the left, single CTA right.
 */
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';
import * as LucideIcons from '@lucide/vue';
import { icons } from '../icons';

const { t } = useI18n();

const installHref =
  'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';

const reduceMotion = useReducedMotion();

function sectionFadeUp() {
  return reduceMotion.value
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '0px 0px -15% 0px' },
        transition: { duration: 0.45, ease: 'var(--ease-out)' as string },
      };
}
</script>

<template>
  <motion.section
    v-bind="sectionFadeUp()"
    aria-labelledby="final-cta-heading"
  >
    <div
      class="flex flex-col items-center justify-between gap-8 rounded-[28px] border border-white/50 bg-white/55 px-8 py-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 md:flex-row md:items-center md:px-12 md:py-16"
    >
      <div
        class="flex flex-col items-center gap-4 text-center md:items-start md:text-left"
      >
        <div class="flex items-center gap-2">
          <img src="/icon/48.png" alt="Nomu" class="h-6 w-6 rounded-md" />
          <span class="text-ink text-base font-semibold tracking-tight"
            >Nomu</span
          >
        </div>
        <h2
          id="final-cta-heading"
          class="text-ink text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[52px] md:tracking-[-0.035em]"
        >
          {{ t('noonTool.finalCta.title') }}
        </h2>
        <p class="text-muted max-w-md text-[15px] leading-[1.55]">
          {{ t('noonTool.finalCta.body') }}
        </p>
      </div>
      <a
        :href="installHref"
        target="_blank"
        rel="noopener"
        class="focus-visible:ring-ring bg-accent text-contrast inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold shadow-[0_4px_18px_rgba(254,238,0,0.45)] transition-all hover:brightness-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
        :title="t('noonTool.finalCta.hint')"
      >
        <component :is="(LucideIcons as any)[icons.cta]" :size="16" />
        {{ t('noonTool.finalCta.button') }}
      </a>
    </div>
  </motion.section>
</template>
