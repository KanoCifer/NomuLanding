<script setup lang="ts">
/**
 * FAQ — Spatial accordion. Each item is a glass container; expanded state
 * shows the answer below. Apple's "compactly stacked" feel — narrow column,
 * generous top spacing, no decorative icons inside the row.
 */
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';

const { t } = useI18n();

defineProps<{ id?: string }>();

const items = [
  'free',
  'apiKey',
  'regions',
  'sources',
  'data',
  'ai',
  'translation',
  'failure',
] as const;

const openKeys = ref<string[]>([]);

function toggle(key: string) {
  openKeys.value = openKeys.value.includes(key)
    ? openKeys.value.filter((k) => k !== key)
    : [...openKeys.value, key];
}

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
    :id="id"
    aria-labelledby="faq-heading"
    class="space-y-8"
  >
    <header class="text-center">
      <h2
        id="faq-heading"
        class="text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] text-ink md:text-[44px] md:tracking-[-0.03em]"
      >
        {{ t('noonTool.faq.sectionTitle') }}
      </h2>
    </header>

    <div class="mx-auto max-w-3xl space-y-2.5">
      <div
        v-for="key in items"
        :key="key"
        class="overflow-hidden rounded-2xl border border-white/50 bg-white/55 shadow-[0_4px_24px_-12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 transition-shadow hover:shadow-[0_8px_32px_-12px_rgba(0,0,0,0.12)]"
        :class="{ 'shadow-[0_8px_32px_-12px_rgba(0,0,0,0.14)]': openKeys.includes(key) }"
      >
        <button
          type="button"
          class="text-ink flex w-full items-center gap-3 px-5 py-4 text-left text-[14px] font-medium transition-colors hover:bg-white/40"
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
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
          <span>{{ t(`noonTool.faq.items.${key}.q`) }}</span>
        </button>
        <div
          :id="`faq-${key}-panel`"
          class="grid transition-[grid-template-rows] duration-200 ease-out"
          :class="[
            openKeys.includes(key) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
          ]"
        >
          <div class="min-h-0 overflow-hidden">
            <p class="text-muted px-5 pb-5 text-[14px] leading-[1.55]">
              {{ t(`noonTool.faq.items.${key}.a`) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.section>
</template>
