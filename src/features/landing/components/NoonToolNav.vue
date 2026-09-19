<script setup lang="ts">
/**
 * Floating translucent chrome (Apple "vibrancy") — sticks to the top of the viewport.
 * Material hierarchy: heavier blur on this bigger surface; light-edge highlight on top
 * reads as light catching the material. Anchor links smooth-scroll to section ids;
 * the docs link opens the docs site in a new tab (mirrors the footer DOCS_URL).
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import NoonToolLocaleSwitch from './NoonToolLocaleSwitch.vue';

const { t } = useI18n();

const scrolled = ref(false);
let observer: IntersectionObserver | null = null;

onMounted(() => {
  // 1px-tall sentinel inserted just below the resting chrome height.
  // When the sentinel scrolls above the viewport, the user has moved past
  // the hero and the chrome should firm up.
  const sentinel = document.getElementById('nav-scroll-sentinel');
  if (!sentinel || typeof IntersectionObserver === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      // boundingClientRect.bottom < 0 means the sentinel has scrolled up out of view.
      scrolled.value = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
    },
    { threshold: 0 },
  );
  observer.observe(sentinel);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

const installHref =
  'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';
const docsHref = 'https://nomu.kanocifer.chat/docs/';

// Anchor links use the existing section ids (set on each <Component id="..."/> in
// LandingView). Labels come from i18n so the nav tracks the active language.
const sections = [
  { id: 'features', key: 'noonTool.nav.sections.features' },
  { id: 'support', key: 'noonTool.nav.sections.support' },
  { id: 'faq', key: 'noonTool.nav.sections.faq' },
];
</script>

<template>
  <header
    class="sticky top-3 z-40 mx-auto grid max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center rounded-full border border-white/40 bg-white/65 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-200 ease-[var(--ease-out)] motion-safe:data-[scrolled=true]:shadow-[0_8px_30px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.7)] motion-safe:data-[scrolled=true]:bg-white/80"
    :data-scrolled="scrolled ? 'true' : 'false'"
  >
    <a href="#top" class="flex items-center justify-self-start gap-2">
      <img src="/icon/32.png" alt="Nomu" class="size-5 rounded" />
      <span class="text-[13px] font-semibold tracking-tight text-ink">Nomu</span>
    </a>
    <nav class="hidden items-center justify-center gap-1 text-[12px] md:flex">
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        class="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-white/40 hover:text-ink"
      >
        {{ t(s.key) }}
      </a>
      <a
        :href="docsHref"
        target="_blank"
        rel="noopener"
        class="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-white/40 hover:text-ink"
      >
        {{ t('noonTool.nav.docs') }}
        <span aria-hidden="true" class="text-[10px] leading-none">↗</span>
      </a>
    </nav>
    <div class="flex items-center justify-self-end gap-2">
      <NoonToolLocaleSwitch />
      <a
        :href="installHref"
        target="_blank"
        rel="noopener"
        class="rounded-full bg-ink px-4 py-2 text-[12px] font-medium text-surface transition-transform active:scale-[0.98] hover:bg-ink/90"
      >
        Add to Chrome →
      </a>
    </div>
  </header>
  <div
    id="nav-scroll-sentinel"
    aria-hidden="true"
    class="pointer-events-none absolute h-px w-px"
    style="top: calc(100vh - 80px);"
  ></div>
  <!-- Anchor target so the logo in the nav can return to the top. -->
  <span id="top" class="sr-only">Top</span>
</template>