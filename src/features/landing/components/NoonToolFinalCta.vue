<script setup lang="ts">
/**
 * FinalCta — Spatial closer:
 * Big translucent container with the yellow accent inside. The accent stays the
 * call-to-action moment; the surrounding glass makes it feel intentional instead
 * of abrupt. Apple closer pattern: title + body on the left, single CTA right.
 */
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';
import { EASE_OUT } from '@/constants/motionPresets';
import { Share2, Check } from '@lucide/vue';
import { useShare } from '@/composables/useShare';
import { ICONS } from '../icons';

const { t } = useI18n();

const installHref = 'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';
const shareUrl = 'https://nomu.kanocifer.chat/';
const shareTitle = 'Nomu — Tool for Noon Sellers';
const { copied, share } = useShare();
function onShare() {
  return share(shareUrl, shareTitle);
}

const reduceMotion = useReducedMotion();

function sectionFadeUp() {
  return reduceMotion.value
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
      }
    : {
        initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
        viewport: { once: true, margin: '0px 0px -15% 0px' },
        transition: { duration: 0.7, ease: EASE_OUT },
      };
}
</script>

<template>
  <motion.section v-bind="sectionFadeUp()" aria-labelledby="final-cta-heading">
    <div
      class="flex flex-col items-center justify-between gap-8 rounded-[28px] border border-white/50 bg-white/55 px-8 py-12 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 md:flex-row md:items-center md:px-12 md:py-16"
    >
      <div class="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <div class="flex items-center gap-2">
          <img src="/icon/48.png" alt="Nomu" class="h-6 w-6 rounded-md" />
          <span class="text-ink text-base font-semibold tracking-tight">Nomu</span>
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
      <div class="flex shrink-0 flex-col items-center gap-3 md:mt-5 md:items-end">
        <a
          :href="installHref"
          target="_blank"
          rel="noopener"
          class="group/cta focus-visible:ring-ring bg-accent text-contrast inline-flex items-center justify-center gap-2 overflow-hidden rounded-full px-7 py-4 text-[15px] font-semibold shadow-[0_4px_18px_rgba(254,238,0,0.45)] transition-all hover:brightness-105 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.98]"
          :title="t('noonTool.finalCta.hint')"
        >
          <span class="grid size-4 shrink-0 place-items-center overflow-hidden [grid-template-areas:'stack']">
            <component
              :is="ICONS.cta"
              class="size-4 transition-transform duration-200 ease-[var(--ease-out)] [grid-area:stack] motion-safe:group-hover/cta:translate-x-[1.35em] motion-safe:group-hover/cta:-translate-y-[1.35em] motion-reduce:transition-none"
            />
            <component
              :is="ICONS.external"
              class="size-4 -translate-x-[1.35em] translate-y-[1.35em] transition-transform duration-200 ease-[var(--ease-out)] [grid-area:stack] motion-safe:group-hover/cta:translate-x-0 motion-safe:group-hover/cta:translate-y-0 motion-reduce:transition-none"
            />
          </span>
          {{ t('noonTool.finalCta.button') }}
        </a>
        <button
          type="button"
          class="text-muted hover:text-ink inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-white/45 focus-visible:ring-2 focus-visible:ring-[var(--accent-slate)] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
          :aria-label="copied ? t('noonTool.share.copied') : t('noonTool.share.label')"
          @click="onShare"
        >
          <Share2 v-if="!copied" :size="14" :stroke-width="1.75" aria-hidden="true" />
          <Check v-else :size="14" :stroke-width="2" class="text-[var(--accent-slate)]" aria-hidden="true" />
          <span>{{ copied ? t('noonTool.share.copied') : t('noonTool.finalCta.shareHint') }}</span>
        </button>
      </div>
    </div>
  </motion.section>
</template>
