<script setup lang="ts">
/**
 * Floating translucent chrome (Apple "vibrancy") — sticks to the top of the viewport.
 * Material hierarchy: heavier blur on this bigger surface; light-edge highlight on top
 * reads as light catching the material. Anchor links smooth-scroll to section ids;
 * the docs link opens the docs site in a new tab (mirrors the footer DOCS_URL).
 */
import { useI18n } from 'vue-i18n';
import NoonToolLocaleSwitch from './NoonToolLocaleSwitch.vue';

const { t } = useI18n();

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
    class="sticky top-3 z-40 mx-auto grid max-w-[1180px] grid-cols-[1fr_auto_1fr] items-center rounded-full border border-white/40 bg-white/65 px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.6)] backdrop-blur-xl backdrop-saturate-150"
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
  <!-- Anchor target so the logo in the nav can return to the top. -->
  <span id="top" class="sr-only">Top</span>
</template>