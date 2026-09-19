<script setup lang="ts">
/**
 * Privacy — three frosted-glass cards in a row (Local / Egress / Never).
 * Same content, glass material. Apple-style heavy blur for navigation-grade surfaces.
 */
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';
import * as LucideIcons from '@lucide/vue';
import { icons } from '../icons';

const { t, tm } = useI18n();

const columns = [
  { key: 'local', labelKey: 'colLocal', icon: 'privacy' },
  { key: 'egress', labelKey: 'colEgress', icon: 'cta' },
  { key: 'never', labelKey: 'colNever', icon: 'faq' },
] as const;

function lines(key: string): string[] {
  return tm(`noonTool.privacy.${key}`) as string[];
}

const reduceMotion = useReducedMotion();

function sectionFadeUp() {
  return reduceMotion.value
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { opacity: 0, y: 12, filter: 'blur(6px)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
        viewport: { once: true, margin: '0px 0px -15% 0px' },
        transition: { duration: 0.45, ease: 'var(--ease-out)' as string },
      };
}
</script>

<template>
  <motion.section
    v-bind="sectionFadeUp()"
    aria-labelledby="privacy-heading"
    class="space-y-8"
  >
    <header class="max-w-3xl space-y-3">
      <p class="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
        {{ t('noonTool.privacy.eyebrow') }}
      </p>
      <h2
        id="privacy-heading"
        class="text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] text-ink md:text-[52px] md:tracking-[-0.035em]"
      >
        {{ t('noonTool.privacy.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('noonTool.privacy.sectionSubtitle') }}
      </p>
    </header>

    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <article
        v-for="col in columns"
        :key="col.key"
        class="flex flex-col gap-4 overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
      >
        <h3
          class="text-accent-text flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase"
        >
          <span class="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-white/70 text-accent-text shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
            <component
              :is="(LucideIcons as any)[icons[col.icon]]"
              :size="14"
              :stroke-width="1.75"
            />
          </span>
          {{ t(`noonTool.privacy.${col.labelKey}`) }}
        </h3>
        <ul class="space-y-3 text-[14px] leading-[1.5]">
          <li
            v-for="(line, i) in lines(col.key)"
            :key="i"
            class="text-ink flex gap-2"
          >
            <span
              aria-hidden="true"
              class="bg-accent mt-2 inline-block size-1.5 shrink-0 rounded-full"
            />
            <span>{{ line }}</span>
          </li>
        </ul>
      </article>
    </div>
  </motion.section>
</template>
