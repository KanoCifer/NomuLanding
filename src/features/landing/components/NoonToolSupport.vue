<script setup lang="ts">
/**
 * Support — two glass cards (WeChat / Docs) as the contact surface.
 * Spatial language: glass chips for icons, frosted background with surface highlight.
 */
import { useI18n } from 'vue-i18n';
import * as LucideIcons from '@lucide/vue';
import { icons } from '../icons';

const { t } = useI18n();

const DOCS_URL = 'https://nomu.kanocifer.chat/docs/';

const channelKeys = ['wechat', 'docs'] as const;
</script>

<template>
  <section
    :id="$attrs.id as string"
    aria-labelledby="support-heading"
    class="space-y-8"
  >
    <header class="max-w-3xl space-y-3">
      <p class="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
        {{ t('noonTool.support.eyebrow') }}
      </p>
      <h2
        id="support-heading"
        class="text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] text-ink md:text-[52px] md:tracking-[-0.035em]"
      >
        {{ t('noonTool.support.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('noonTool.support.sectionSubtitle') }}
      </p>
    </header>

    <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <li
        v-for="key in channelKeys"
        :key="key"
        class="flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
      >
        <span
          class="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-accent-text shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        >
          <component
            :is="(LucideIcons as any)[icons[key]]"
            :size="16"
            :stroke-width="1.75"
          />
        </span>
        <h3 class="text-ink text-lg font-semibold tracking-[-0.01em]">
          {{ t(`noonTool.support.channels.${key}.title`) }}
        </h3>
        <p class="text-muted text-[14px] leading-[1.55]">
          {{ t(`noonTool.support.channels.${key}.body`) }}
        </p>
        <a
          v-if="key === 'wechat'"
          :href="DOCS_URL + 'guide/support'"
          class="text-accent-text inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          {{ t('noonTool.support.viewQr') }}
          <component :is="(LucideIcons as any)[icons.footerLink]" :size="14" />
        </a>
      </li>
    </ul>
  </section>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>
