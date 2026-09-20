<script setup lang="ts">
/**
 * Locale toggle — a single text button that flips between zh-CN and en.
 * The label always shows the *current* locale so the user sees what they have;
 * the title hint reveals what clicking will switch to (current → next).
 *
 * Kept as a separate component so other entry points (docs site footer,
 * extension settings panel) can reuse it. The active code is sourced from
 * vue-i18n's `locale` ref and labels come from existing noonTool.hero.* keys.
 */
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

type LocaleCode = 'zh-CN' | 'en';

const { t, locale } = useI18n();

function labelFor(code: LocaleCode): string {
  return code === 'zh-CN' ? t('noonTool.hero.localeZh') : t('noonTool.hero.localeEn');
}

const currentLabel = computed(() => labelFor(locale.value as LocaleCode));
const nextCode = computed<LocaleCode>(() => (locale.value === 'zh-CN' ? 'en' : 'zh-CN'));
const nextLabel = computed(() => labelFor(nextCode.value));

function toggle() {
  locale.value = nextCode.value as typeof locale.value;
}
</script>

<template>
  <button
    type="button"
    :title="`${currentLabel} → ${nextLabel}`"
    class="text-muted hover:text-ink focus-visible:ring-ring cursor-pointer rounded-full px-3 py-1.5 text-[12px] font-medium transition-colors hover:bg-white/40 focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:outline-none active:scale-[0.97]"
    @click="toggle"
  >
    {{ currentLabel }}
  </button>
</template>
