<script setup lang="ts">
import { computed, nextTick, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useHead } from '@vueuse/head';
import NoonToolNav from './components/NoonToolNav.vue';
import NoonToolHero from './components/NoonToolHero.vue';
import NoonToolFeatureGrid from './components/NoonToolFeatureGrid.vue';
import NoonToolPrivacyPermissions from './components/NoonToolPrivacyPermissions.vue';
import NoonToolSupport from './components/NoonToolSupport.vue';
import NoonToolFaq from './components/NoonToolFaq.vue';
import NoonToolFinalCta from './components/NoonToolFinalCta.vue';
import NoonToolFooter from './components/NoonToolFooter.vue';

const { t, tm } = useI18n();

const meta = computed(() => ({
  title: t('noonTool.meta.title'),
  description: t('noonTool.meta.description'),
  keywords: (tm('noonTool.meta.keywords') as string[]).join(', '),
}));

useHead({
  title: () => meta.value.title,
  meta: () => [
    { name: 'description', content: meta.value.description },
    { name: 'keywords', content: meta.value.keywords },
    { property: 'og:title', content: meta.value.title },
    { property: 'og:description', content: meta.value.description },
    { property: 'og:type', content: 'website' },
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
  <div class="bg-page min-h-screen">
    <!-- Floating translucent chrome (Spatial design) — sticks to the top of viewport,
         stays above content as the user scrolls. Apple "vibrancy" feel. -->
    <NoonToolNav />

    <!-- Sections stack with generous spacing; max-width keeps reading measure tight. -->
    <main class="mx-auto max-w-[1180px] space-y-24 px-4 pt-32 pb-16 md:px-8 md:pt-40 md:space-y-32">
      <NoonToolHero />
      <NoonToolFeatureGrid id="features" />
      <NoonToolPrivacyPermissions />
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
}
</style>

