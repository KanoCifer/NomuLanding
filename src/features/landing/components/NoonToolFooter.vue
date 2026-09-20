<script setup lang="ts">
/**
 * Footer — glass container, Spatial language.
 * Wider shadow than a card; same material as the floating nav. Inset light edge.
 */
import { useI18n } from 'vue-i18n';
import { ICONS } from '../icons';

const { t } = useI18n();

const year = new Date().getFullYear();

const DOCS_URL = 'https://nomu.kanocifer.chat/docs/';
</script>

<template>
  <footer
    class="text-muted flex flex-col items-center justify-between gap-4 rounded-2xl border border-white/50 bg-white/55 px-6 py-5 text-xs shadow-[0_8px_24px_-12px_rgba(0,0,0,0.08),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 md:flex-row"
  >
    <div class="flex items-center gap-2">
      <img src="/icon/32.png" alt="Nomu" class="h-4 w-4 rounded-sm" />
      <span>{{ t('noonTool.footer.tagline') }}</span>
    </div>
    <nav class="flex flex-wrap items-center gap-4">
      <a :href="DOCS_URL + 'privacy/'" class="hover:text-ink inline-flex items-center gap-1 transition-colors">
        <component :is="ICONS.privacy" :size="12" />
        {{ t('noonTool.footer.links.privacy') }}
      </a>
      <a :href="DOCS_URL + 'guide/changelog'" class="hover:text-ink inline-flex items-center gap-1 transition-colors">
        <component :is="ICONS.faq" :size="12" />
        {{ t('noonTool.footer.links.changelog') }}
      </a>
      <a :href="DOCS_URL + 'guide/support'" class="hover:text-ink inline-flex items-center gap-1 transition-colors">
        <component :is="ICONS.support" :size="12" />
        {{ t('noonTool.footer.links.support') }}
      </a>
      <a :href="DOCS_URL" class="hover:text-ink inline-flex items-center gap-1 transition-colors">
        <component :is="ICONS.docs" :size="12" />
        {{ t('noonTool.footer.links.docs') }}
      </a>
    </nav>
    <p>{{ t('noonTool.footer.license') }} · © {{ year }}</p>
  </footer>
</template>
