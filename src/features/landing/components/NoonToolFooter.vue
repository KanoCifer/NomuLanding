<script setup lang="ts">
/**
 * Footer — glass container, Spatial language.
 * Wider shadow than a card; same material as the floating nav. Inset light edge.
 */
import { useI18n } from 'vue-i18n';
import { ICONS, type IconKey } from '../icons';

const { t } = useI18n();

const year = new Date().getFullYear();

const DOCS_URL = 'https://nomu.kanocifer.chat/docs/';

/** footer 五条链接：i18n key + 站内路径后缀 + 图标。
 *  五条逐个手写 <a> 时，hover 态改一次要改五处；收成数组后只改这一处。 */
const FOOTER_LINKS: { key: string; path: string; icon: IconKey }[] = [
  { key: 'landing.footer.links.privacy', path: 'privacy/', icon: 'privacy' },
  { key: 'landing.footer.links.terms', path: 'terms/', icon: 'terms' },
  { key: 'landing.footer.links.changelog', path: 'guide/changelog', icon: 'faq' },
  { key: 'landing.footer.links.support', path: 'guide/support', icon: 'support' },
  { key: 'landing.footer.links.docs', path: '', icon: 'docs' },
];

// 备案号固定不变,不进 i18n;工信部要求备案号跳转查询站点
const ICP_URL = 'https://beian.miit.gov.cn/';
const ICP_NUMBER = '粤ICP备2026018113号';
</script>

<template>
  <footer class="panel text-muted flex flex-col items-center justify-between gap-4 px-6 py-5 text-xs md:flex-row">
    <div class="flex items-center gap-2">
      <img src="/icon/32.png" alt="Nomu" class="h-4 w-4 rounded-sm" />
      <span>{{ t('landing.footer.tagline') }}</span>
    </div>
    <nav class="flex flex-wrap items-center gap-1">
      <a
        v-for="l in FOOTER_LINKS"
        :key="l.key"
        :href="DOCS_URL + l.path"
        class="hover:bg-accent-wash hover:text-ink inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 transition-colors duration-150"
      >
        <component :is="ICONS[l.icon]" :size="12" />
        {{ t(l.key) }}
      </a>
    </nav>
    <div class="flex flex-col items-center gap-1">
      <p>{{ t('landing.footer.license') }} · © {{ year }}</p>
      <a :href="ICP_URL" target="_blank" rel="noopener noreferrer" class="hover:text-ink transition-colors">
        {{ ICP_NUMBER }}
      </a>
    </div>
  </footer>
</template>
