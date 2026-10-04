<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useHead } from '@unhead/vue';
import NoonToolNav from './components/NoonToolNav.vue';
import NoonToolHero from './components/NoonToolHero.vue';
import NoonToolFeatureGrid from './components/NoonToolFeatureGrid.vue';
import NoonToolPrivacyPermissions from './components/NoonToolPrivacyPermissions.vue';
import NoonToolServices from './components/NoonToolServices.vue';
import NoonToolSupport from './components/NoonToolSupport.vue';
import NoonToolFaq from './components/NoonToolFaq.vue';
import NoonToolFinalCta from './components/NoonToolFinalCta.vue';
import NoonToolFooter from './components/NoonToolFooter.vue';
import { FAQ_KEYS } from './docsLinks';
import { APP_VERSION } from '@/constants/version';

const { t, tm } = useI18n();

const meta = computed(() => ({
  title: t('landing.meta.title'),
  description: t('landing.meta.description'),
  keywords: (tm('landing.meta.keywords') as string[]).join(', '),
}));

const SITE_URL = 'https://nomu.kanocifer.chat';
/** 1200×630 的分享图，和 index.html 模板里的是同一张。 */
const OG_IMAGE = `${SITE_URL}/screens/og-1200x630.jpg`;

/**
 * 结构化数据只描述 Nomu 这个软件本身，所以只在 / 输出。
 *
 * 原先这段 JSON-LD 写在 index.html 模板里，SSG 会把模板复制到每个预渲染页面，
 * 于是 /announcements、/credits 的 JSON-LD `url` 也指向首页 —— 三个不同的页面
 * 声明自己是同一个实体，正是「自相矛盾的信号」那一类。
 */
const appSchema = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nomu',
  description: meta.value.description,
  url: `${SITE_URL}/`,
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Chrome',
  softwareVersion: APP_VERSION,
  image: OG_IMAGE,
  inLanguage: ['zh-CN', 'en'],
  // 扩展本体免费，AI 翻译 / 生图 / 助手按积分计费（见 FAQ free 条）。Google 的
  // SoftwareApplication 富媒体结果要 offers 才有星级卡。
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD',
    availability: 'https://schema.org/InStock',
  },
  author: { '@type': 'Organization', name: 'Nomu', url: `${SITE_URL}/` },
  publisher: { '@type': 'Organization', name: 'Nomu', url: `${SITE_URL}/` },
}));

/**
 * FAQPage —— 8 条问答是这个站最像长尾资产的正文（免费吗 / 要不要密钥 / 紫鸟怎么装
 * / 翻译准不准），每条都是能拿排名的问句。取 FAQ_KEYS 而不是自己再列一遍：schema 里
 * 出现、页面上没渲染的问答属于声明与内容不符，比不加更糟。
 */
const faqSchema = computed(() => {
  const items = tm('landing.faq.items') as Record<string, { q: string; a: string }>;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ_KEYS.map((key) => ({
      '@type': 'Question',
      name: items[key].q,
      acceptedAnswer: { '@type': 'Answer', text: items[key].a },
    })),
  };
});

/** JSON-LD 会被原样塞进 <script>，转义 < 防文案里的尖括号提前闭合标签。 */
function ldJson(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

useHead({
  title: () => meta.value.title,
  link: () => [
    { rel: 'canonical', href: `${SITE_URL}/` },
    // 只声明真实存在的语言版本。原来这里还挂着 hreflang="en" → /en/，但 /en/ 没有
    // 真页面：它返回首页内容，canonical 又指回首页，等于让 Google 拿到一对互相否认的
    // URL，整组标记直接作废。文档站确实有 /docs/en/ 英文版，但那是另一批 URL，
    // 等落地页真做了 /en/ 再把这条加回来（记得两页互相引用 + 统一用 en-US）。
    { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/` },
  ],
  meta: () => [
    { name: 'description', content: meta.value.description },
    { name: 'keywords', content: meta.value.keywords },
    { property: 'og:title', content: meta.value.title },
    { property: 'og:description', content: meta.value.description },
    { property: 'og:type', content: 'website' },
    // 带尾斜杠，和 canonical 完全一致：社交平台把 og:url 当页面身份标识，
    // 两种写法会被当成两个页面。
    { property: 'og:url', content: `${SITE_URL}/` },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { property: 'og:image:alt', content: meta.value.title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.value.title },
    { name: 'twitter:description', content: meta.value.description },
    { name: 'twitter:image', content: OG_IMAGE },
  ],
  script: () => [
    // id 不能省：unhead 对 script 的去重键是 `src|type+id`，两块 JSON-LD 同为
    // application/ld+json、都没有 src，不给 id 的话客户端水合时会被当成同一个标签
    // 合并掉一块（SSR 那一步侥幸两个都输出了，水合后就未必）。
    { id: 'ld-software-app', type: 'application/ld+json', innerHTML: ldJson(appSchema.value) },
    { id: 'ld-faq', type: 'application/ld+json', innerHTML: ldJson(faqSchema.value) },
  ],
});

// Chrome's initial fragment scroll ignores scroll-padding-top on <html> when a
// sticky element is in the way, so the section lands flush with the viewport
// top and ends up under the glass nav. Re-run the jump once the page has
// rendered, then listen for further hash changes.
function honorFragmentScroll() {
  const id = window.location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ block: 'start' });
}

onMounted(async () => {
  await nextTick();
  honorFragmentScroll();
  window.addEventListener('hashchange', honorFragmentScroll);
});
</script>

<template>
  <!-- grain = 极淡噪点(纸感)；page-glow = 两团径向光，给纯白底一点前后景 -->
  <div class="bg-page grain page-glow min-h-screen">
    <!-- Floating translucent chrome (Spatial design) — sticks to the top of viewport,
         stays above content as the user scrolls. Apple "vibrancy" feel. -->
    <NoonToolNav />

    <!-- Sections stack with generous spacing; max-width keeps reading measure tight. -->
    <main class="mx-auto max-w-[1180px] space-y-24 px-4 pt-32 pb-16 md:space-y-32 md:px-8 md:pt-40">
      <NoonToolHero />
      <NoonToolFeatureGrid id="features" />
      <NoonToolPrivacyPermissions />
      <NoonToolServices />
      <NoonToolSupport id="support" />
      <NoonToolFaq id="faq" />
      <NoonToolFinalCta />
      <NoonToolFooter />
    </main>
  </div>
</template>

<style>
/* Apple Design §14 — frost up translucent chrome when user opts out of transparency.
   Applied globally so every glass surface stays legible. */
@media (prefers-reduced-transparency: reduce) {
  .glass,
  [class*='bg-white/'][class*='backdrop-blur'] {
    background-color: rgb(255 255 255 / 0.96) !important;
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
}

/* Anchor links in the floating nav would otherwise land the section flush with
   the viewport top, sliding the heading under the 56px-tall glass bar.
   scroll-padding-top on the html element clears that bar for *every* kind of
   fragment scroll — initial URL hash, anchor clicks and scrollIntoView —
   unlike scroll-margin-top which only affects programmatic jumps. */
html {
  scroll-padding-top: 80px;
  /* Every in-page jump glides — anchor clicks, the mobile sheet's scrollIntoView,
     and the initial URL hash. Timing/easing match the design system. */
  scroll-behavior: smooth;
}

/* Users who opt out of motion get instant jumps. This also covers the explicit
   scrollIntoView calls, which would otherwise need `behavior: 'smooth'` each. */
@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}
</style>
