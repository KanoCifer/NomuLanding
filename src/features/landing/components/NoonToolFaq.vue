<script setup lang="ts">
/**
 * FAQ — Spatial accordion. Each item is a glass container; expanded state
 * shows the answer below. Apple's "compactly stacked" feel — narrow column,
 * generous top spacing, no decorative icons inside the row.
 */
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { motion } from 'motion-v';
import { useReveal } from '@/composables/useReveal';

const { t } = useI18n();

defineProps<{ id?: string }>();

const items = ['free', 'apiKey', 'regions', 'sources', 'data', 'ai', 'translation', 'failure'] as const;

const openKeys = ref<string[]>([]);

function toggle(key: string) {
  openKeys.value = openKeys.value.includes(key) ? openKeys.value.filter((k) => k !== key) : [...openKeys.value, key];
}

const reveal = useReveal();
</script>

<template>
  <motion.section v-bind="reveal()" :id="id" aria-labelledby="faq-heading" class="space-y-8">
    <header class="text-center">
      <h2
        id="faq-heading"
        class="text-ink text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[44px] md:tracking-[-0.03em]"
      >
        {{ t('landing.faq.sectionTitle') }}
      </h2>
    </header>

    <div class="mx-auto max-w-3xl space-y-2.5">
      <div
        v-for="key in items"
        :key="key"
        class="panel overflow-hidden rounded-[18px]"
        :class="{ 'shadow-[var(--shadow-panel-hover)]': openKeys.includes(key) }"
      >
        <button
          type="button"
          class="text-ink hover:bg-accent-wash flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] font-medium transition-colors duration-150"
          :aria-expanded="openKeys.includes(key)"
          :aria-controls="`faq-${key}-panel`"
          @click="toggle(key)"
        >
          <svg
            class="text-muted h-4 w-4 shrink-0 transition-transform duration-200"
            :class="{ 'rotate-180': openKeys.includes(key) }"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
          <span>{{ t(`landing.faq.items.${key}.q`) }}</span>
        </button>
        <div
          :id="`faq-${key}-panel`"
          class="grid transition-[grid-template-rows] duration-250 ease-[var(--ease-out)]"
          :class="[openKeys.includes(key) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
        >
          <div class="min-h-0 overflow-hidden">
            <p class="text-muted px-5 pb-5 text-[14px] leading-[1.6]">
              {{ t(`landing.faq.items.${key}.a`) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
</template>
