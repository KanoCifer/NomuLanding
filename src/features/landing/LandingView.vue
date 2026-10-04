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

const { t, tm } = useI18n();

const meta = computed(() => ({
  title: t('landing.meta.title'),
  description: t('landing.meta.description'),
  keywords: (tm('landing.meta.keywords') as string[]).join(', '),
}));

const SITE_URL = 'https://nomu.kanocifer.chat';
const OG_IMAGE = `${SITE_URL}/screens/poster.png`;

useHead({
  title: () => meta.value.title,
  link: () => [
    { rel: 'canonical', href: `${SITE_URL}/` },
    // hreflang 告诉搜索引擎 / 与 /en/ 是同一页面的两种语言版本。
    // 目前只落地了中文：/en/ 还没有真页面（线上是首页的软 404），搜索引擎会
    // 自行忽略这条指向无效 URL 的标注。等 /en/ 真的做出来，这三条才算数。
    { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}/` },
    { rel: 'alternate', hreflang: 'en', href: `${SITE_URL}/en/` },
    { rel: 'alternate', hreflang: 'x-default', href: `${SITE_URL}/` },
  ],
  meta: () => [
    { name: 'description', content: meta.value.description },
    { name: 'keywords', content: meta.value.keywords },
    { property: 'og:title', content: meta.value.title },
    { property: 'og:description', content: meta.value.description },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: SITE_URL },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1400' },
    { property: 'og:image:height', content: '560' },
    { property: 'og:image:alt', content: meta.value.title },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: meta.value.title },
    { name: 'twitter:description', content: meta.value.description },
    { name: 'twitter:image', content: OG_IMAGE },
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
