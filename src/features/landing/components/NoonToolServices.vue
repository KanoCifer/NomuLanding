<script setup lang="ts">
/**
 * Services — VAT 与 Noon 开店两个代办服务的玻璃圆角卡，咨询跳文档站的支持页。
 * 结构与 NoonToolSupport 一致（section 头 + 两张玻璃卡）。
 */
import { useI18n } from 'vue-i18n';
import { motion } from 'motion-v';
import { useReveal } from '@/composables/useReveal';
import { ICONS, type IconKey } from '../icons';
import NoonToolOrnament from './NoonToolOrnament.vue';

const { t } = useI18n();

const DOCS_URL = 'https://nomu.kanocifer.chat/docs/';

const serviceKeys = ['vat', 'storeSetup'] as const satisfies readonly IconKey[];

const reveal = useReveal();
</script>

<template>
  <motion.section v-bind="reveal()" :id="$attrs.id as string" aria-labelledby="services-heading" class="space-y-8">
    <header class="max-w-3xl space-y-3">
      <p class="text-muted rule-glyph text-[11px] font-medium tracking-[0.22em] uppercase">
        <NoonToolOrnament />
        {{ t('landing.services.eyebrow') }}
      </p>
      <h2
        id="services-heading"
        class="text-ink text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[48px] md:tracking-[-0.035em]"
      >
        {{ t('landing.services.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('landing.services.sectionSubtitle') }}
      </p>
    </header>

    <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <li v-for="key in serviceKeys" :key="key" class="panel panel-hover flex flex-col gap-3 rounded-[22px] p-6">
        <span
          class="bg-accent-wash text-accent-slate inline-flex size-10 shrink-0 items-center justify-center rounded-[13px]"
        >
          <component :is="ICONS[key]" :size="16" :stroke-width="1.75" />
        </span>
        <h3 class="text-ink text-lg font-semibold tracking-[-0.01em]">
          {{ t(`landing.services.items.${key}.title`) }}
        </h3>
        <p class="text-muted text-[14px] leading-[1.55]">
          {{ t(`landing.services.items.${key}.body`) }}
        </p>
        <a
          :href="DOCS_URL + 'guide/support'"
          class="text-accent-slate hover:text-ink mt-auto inline-flex items-center gap-1 pt-1 text-sm font-medium transition-colors"
        >
          {{ t('landing.services.cta') }}
          <component :is="ICONS.footerLink" :size="14" />
        </a>
      </li>
    </ul>
  </motion.section>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>
