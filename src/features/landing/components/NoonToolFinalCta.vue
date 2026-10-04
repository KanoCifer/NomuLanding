<script setup lang="ts">
/**
 * FinalCta — Spatial closer:
 * Big translucent container with the yellow accent inside. The accent stays the
 * call-to-action moment; the surrounding glass makes it feel intentional instead
 * of abrupt. Apple closer pattern: title + body on the left, single CTA right.
 */
import { useI18n } from 'vue-i18n';
import { motion } from 'motion-v';
import { useReveal } from '@/composables/useReveal';
import { installUrl } from '@/constants/install';
import { Share2, Check } from '@lucide/vue';
import { useShare } from '@/composables/useShare';
import { ICONS } from '../icons';
import NoonToolOrnament from './NoonToolOrnament.vue';

const { t } = useI18n();

const installHref = installUrl('final_cta');
const shareUrl = 'https://nomu.kanocifer.chat/';
const shareTitle = 'Nomu — Tool for Noon Sellers';
const { copied, share } = useShare();
function onShare() {
  return share(shareUrl, shareTitle);
}

const reveal = useReveal();
</script>

<template>
  <motion.section v-bind="reveal()" aria-labelledby="final-cta-heading">
    <div
      class="bg-surface flex flex-col items-center justify-between gap-8 rounded-[32px] border border-[var(--hairline)] px-8 py-12 shadow-[var(--shadow-float)] md:flex-row md:items-center md:px-14 md:py-16"
    >
      <div class="flex flex-col items-center gap-4 text-center md:items-start md:text-left">
        <p class="text-muted rule-glyph text-[11px] font-medium tracking-[0.22em] uppercase">
          <NoonToolOrnament tone="accent" />
          {{ t('landing.finalCta.eyebrow') }}
        </p>
        <h2
          id="final-cta-heading"
          class="text-ink text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[48px] md:tracking-[-0.035em]"
        >
          {{ t('landing.finalCta.title') }}
        </h2>
        <p class="text-muted max-w-md text-[15px] leading-[1.55]">
          {{ t('landing.finalCta.body') }}
        </p>
      </div>
      <div class="flex shrink-0 flex-col items-center gap-3 md:mt-5 md:items-end">
        <a
          :href="installHref"
          target="_blank"
          rel="noopener"
          class="group/cta focus-visible:ring-ring bg-accent text-contrast inline-flex items-center justify-center gap-2 rounded-full px-7 py-4 text-[15px] font-semibold shadow-[var(--shadow-accent)] transition-[transform,box-shadow,filter] duration-200 ease-[var(--ease-out)] hover:-translate-y-px hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 active:scale-[0.98]"
          :title="t('landing.finalCta.hint')"
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
          {{ t('landing.finalCta.button') }}
        </a>
        <button
          type="button"
          class="text-muted hover:text-ink hover:bg-accent-wash inline-flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] transition-colors duration-150 ease-[var(--ease-out)] focus-visible:ring-2 focus-visible:ring-[var(--accent-slate)] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.97]"
          :aria-label="copied ? t('common.share.copied') : t('common.share.label')"
          @click="onShare"
        >
          <Share2 v-if="!copied" :size="14" :stroke-width="1.75" aria-hidden="true" />
          <Check v-else :size="14" :stroke-width="2" class="text-[var(--accent-slate)]" aria-hidden="true" />
          <span>{{ copied ? t('common.share.copied') : t('landing.finalCta.shareHint') }}</span>
        </button>
      </div>
    </div>
  </motion.section>
</template>
