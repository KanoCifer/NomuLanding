<script setup lang="ts">
/**
 * Floating translucent chrome (Apple "vibrancy") — sticks to the top of viewport.
 *
 * Layout across breakpoints:
 * - ≥ md:  [logo] [anchor links + docs] [locale + CTA]
 * - < md:  [logo] [hamburger that opens a sheet with links + locale + CTA]
 *
 * Material hierarchy: heavier blur on this bigger surface; light-edge highlight on top
 * reads as light catching the material. Anchor links smooth-scroll to section ids;
 * the docs link opens the docs site in a new tab (mirrors the footer DOCS_URL).
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { AnimatePresence, motion, useReducedMotion } from 'motion-v';
import { EASE_OUT, EASE_IN_OUT } from '@/constants/motionPresets';
import { ArrowRight, ArrowUpRight, ChevronDown, ExternalLink, Menu, X } from '@lucide/vue';
import NoonToolLocaleSwitch from './NoonToolLocaleSwitch.vue';

const { t } = useI18n();

const scrolled = ref(false);
const mobileOpen = ref(false);
const sheetPanelRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;
const reduceMotion = useReducedMotion();

const installHref = 'https://chromewebstore.google.com/detail/nomu/idfojgkppleknejhenmggcnnnmdglaik';
const docsHref = 'https://nomu.kanocifer.chat/docs/';

const sections = [
  { id: 'features', key: 'noonTool.nav.sections.features' },
  { id: 'support', key: 'noonTool.nav.sections.support' },
  { id: 'faq', key: 'noonTool.nav.sections.faq' },
] as const;

onMounted(() => {
  const sentinel = document.getElementById('nav-scroll-sentinel');
  if (!sentinel || typeof IntersectionObserver === 'undefined') return;
  observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      scrolled.value = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
    },
    { threshold: 0 },
  );
  observer.observe(sentinel);
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
  document.body.style.overflow = '';
});

const sheetTransition = computed(() =>
  reduceMotion.value ? { duration: 0.18 } : { type: 'spring' as const, stiffness: 360, damping: 32, mass: 0.8 },
);

function openSheet() {
  mobileOpen.value = true;
}

function closeSheet() {
  mobileOpen.value = false;
}

function jumpToSection(id: string) {
  closeSheet();
  // Wait for the sheet to start collapsing before scrolling so the anchor target
  // is positioned correctly under the now-fixed-height chrome.
  nextTick(() => {
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ block: 'start' });
    });
  });
}

watch(mobileOpen, (open) => {
  // Lock body scroll while the sheet is open so the page behind doesn't move
  // when the user swipes over the dim layer.
  document.body.style.overflow = open ? 'hidden' : '';
});

function onSheetKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closeSheet();
}
</script>

<template>
  <header
    class="sticky top-3 z-40 mx-auto flex max-w-[1180px] items-center justify-between rounded-full border border-white/45 bg-white/50 px-3 py-2 shadow-[0_10px_32px_-8px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.65)] backdrop-blur-xl backdrop-saturate-150 transition-[background-color,box-shadow] duration-200 ease-[var(--ease-out)] motion-safe:data-[scrolled=true]:bg-white/82 motion-safe:data-[scrolled=true]:shadow-[0_12px_36px_-10px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.75)] md:px-4"
    :data-scrolled="scrolled ? 'true' : 'false'"
  >
    <!-- Left: logo -->
    <a href="#top" class="flex items-center gap-2 rounded-full px-1 py-1">
      <img src="/icon/32.png" alt="Nomu" class="size-6 rounded" />
      <span class="text-ink text-[13px] font-semibold tracking-tight">Nomu</span>
    </a>

    <!-- Desktop center: section anchors + docs -->
    <nav class="hidden items-center md:flex">
      <a
        v-for="s in sections"
        :key="s.id"
        :href="`#${s.id}`"
        class="text-muted hover:text-ink inline-flex h-9 items-center rounded-full px-3 text-[13px] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-white/45"
      >
        {{ t(s.key) }}
      </a>
      <span aria-hidden="true" class="text-muted/40 mx-1 inline-block h-3 w-px bg-current"></span>
      <a
        :href="docsHref"
        target="_blank"
        rel="noopener"
        class="text-muted/80 hover:text-ink inline-flex h-9 items-center gap-1 rounded-full px-3 text-[13px] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-white/45"
      >
        {{ t('noonTool.nav.docs') }}
        <span aria-hidden="true" class="text-[10px] leading-none">↗</span>
      </a>
      <!-- 注册：站内 SPA 路由，跟 docs 平级但不开新 tab（站内跳转同窗口即可） -->
      <RouterLink
        to="/register"
        class="text-muted/80 hover:text-ink inline-flex h-9 items-center rounded-full px-3 text-[13px] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-white/45"
        active-class="text-ink bg-white/45"
      >
        {{ t('noonTool.nav.register') }}
      </RouterLink>
      <!-- 忘记密码：跟 register 平级，recovery 操作；active 时跟 register 视觉一致 -->
      <RouterLink
        to="/forgot-password"
        class="text-muted/80 hover:text-ink inline-flex h-9 items-center rounded-full px-3 text-[13px] transition-colors duration-150 ease-[var(--ease-out)] hover:bg-white/45"
        active-class="text-ink bg-white/45"
      >
        {{ t('noonTool.nav.forgotPassword') }}
      </RouterLink>
    </nav>

    <!-- Right cluster -->
    <div class="flex items-center gap-1.5">
      <!-- Locale + CTA: desktop only inline; mobile moves into the sheet -->
      <div class="hidden items-center gap-2 md:flex">
        <NoonToolLocaleSwitch />
        <a
          :href="installHref"
          target="_blank"
          rel="noopener"
          class="bg-ink group/cta text-surface hover:bg-ink/90 inline-flex items-center gap-1 overflow-hidden rounded-full px-4 py-2 text-[12.5px] font-medium transition-[background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96]"
        >
          Add to Chrome
          <!-- Morph: the resting arrow slides out and the external-link arrow slides in,
               stacked in a one-line grid. Transform transitions are motion-safe, so
               reduced motion lands straight on the swapped icon. -->
          <span class="grid overflow-hidden [grid-template-areas:'stack']">
            <ArrowRight
              class="text-surface [grid-area:stack] size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover/cta:-translate-y-[1.35em] group-hover/cta:translate-x-[1.35em] motion-reduce:transition-none"
            />
            <ExternalLink
              class="text-surface [grid-area:stack] size-4 -translate-x-[1.35em] translate-y-[1.35em] transition-transform duration-200 ease-[var(--ease-out)] group-hover/cta:translate-x-0 group-hover/cta:translate-y-0 motion-reduce:transition-none"
            />
          </span>
        </a>
      </div>

      <!-- Mobile: hamburger -->
      <button
        type="button"
        class="text-ink inline-flex size-10 items-center justify-center rounded-full transition-colors duration-150 ease-[var(--ease-out)] hover:bg-white/55 focus-visible:ring-2 focus-visible:ring-[var(--accent-slate)] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.96] md:hidden"
        :aria-label="mobileOpen ? t('noonTool.nav.menuClose') : t('noonTool.nav.menuOpen')"
        :aria-expanded="mobileOpen"
        aria-controls="nav-mobile-sheet"
        @click="openSheet"
      >
        <Menu :size="20" :stroke-width="1.75" aria-hidden="true" />
      </button>
    </div>
  </header>

  <!-- Mobile sheet -->
  <AnimatePresence :initial="false">
    <template v-if="mobileOpen">
      <!-- Dim layer -->
      <motion.div
        key="nav-dim"
        :initial="{ opacity: 0 }"
        :animate="{ opacity: 1 }"
        :exit="{ opacity: 0 }"
        :transition="sheetTransition"
        class="fixed inset-0 z-30 bg-[var(--scrim)]/35 backdrop-blur-sm md:hidden"
        @click="closeSheet"
      />

      <!-- Panel -->
      <motion.div
        key="nav-sheet"
        id="nav-mobile-sheet"
        ref="sheetPanelRef"
        role="dialog"
        aria-modal="true"
        :aria-label="t('noonTool.nav.menu')"
        :initial="{ opacity: 0, y: -12 }"
        :animate="{ opacity: 1, y: 0 }"
        :exit="{ opacity: 0, y: -12 }"
        :transition="sheetTransition"
        class="fixed inset-x-3 top-[70px] z-40 origin-top overflow-hidden rounded-2xl border border-white/55 bg-white/85 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.22),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 md:hidden"
        @keydown="onSheetKeydown"
      >
        <header class="flex items-center justify-between border-b border-white/40 px-4 py-2.5">
          <span class="text-muted text-[11px] font-medium tracking-[0.22em] uppercase">
            {{ t('noonTool.nav.menu') }}
          </span>
          <button
            type="button"
            class="text-muted hover:text-ink inline-flex size-8 items-center justify-center rounded-full transition-colors hover:bg-white/55 focus-visible:ring-2 focus-visible:ring-[var(--accent-slate)] focus-visible:ring-offset-2 focus-visible:outline-none active:scale-[0.96]"
            :aria-label="t('noonTool.nav.menuClose')"
            @click="closeSheet"
          >
            <X :size="18" :stroke-width="1.75" aria-hidden="true" />
          </button>
        </header>

        <nav class="flex flex-col gap-0.5 p-2">
          <a
            v-for="s in sections"
            :key="s.id"
            :href="`#${s.id}`"
            class="text-ink flex h-12 items-center justify-between rounded-xl px-3 text-[15px] font-medium transition-colors hover:bg-white/55 active:bg-white/70"
            @click.prevent="jumpToSection(s.id)"
          >
            <span>{{ t(s.key) }}</span>
            <ChevronDown :size="16" :stroke-width="1.75" class="text-muted" aria-hidden="true" />
          </a>
          <a
            :href="docsHref"
            target="_blank"
            rel="noopener"
            class="text-ink/85 mt-1 flex h-12 items-center justify-between rounded-xl px-3 text-[15px] font-medium transition-colors hover:bg-white/55"
          >
            <span>{{ t('noonTool.nav.docs') }}</span>
            <ArrowUpRight :size="16" :stroke-width="1.75" class="text-muted" aria-hidden="true" />
          </a>
          <RouterLink
            to="/register"
            class="text-ink mt-0.5 flex h-12 items-center justify-between rounded-xl px-3 text-[15px] font-medium transition-colors hover:bg-white/55 active:bg-white/70"
            @click="closeSheet"
          >
            <span>{{ t('noonTool.nav.register') }}</span>
          </RouterLink>
          <RouterLink
            to="/forgot-password"
            class="text-ink/85 mt-0.5 flex h-12 items-center justify-between rounded-xl px-3 text-[15px] font-medium transition-colors hover:bg-white/55 active:bg-white/70"
            @click="closeSheet"
          >
            <span>{{ t('noonTool.nav.forgotPassword') }}</span>
          </RouterLink>
        </nav>

        <div class="flex items-center justify-between gap-2 border-t border-white/40 px-3 py-3">
          <NoonToolLocaleSwitch />
          <a
            :href="installHref"
            target="_blank"
            rel="noopener"
            class="bg-ink group/cta text-surface hover:bg-ink/90 inline-flex items-center gap-1 overflow-hidden rounded-full px-4 py-2.5 text-[13px] font-medium transition-[background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96]"
          >
            Add to Chrome
            <span class="grid overflow-hidden [grid-template-areas:'stack']">
              <ArrowRight
                class="text-surface [grid-area:stack] size-4 transition-transform duration-200 ease-[var(--ease-out)] group-hover/cta:-translate-y-[1.35em] group-hover/cta:translate-x-[1.35em] motion-reduce:transition-none"
              />
              <ExternalLink
                class="text-surface [grid-area:stack] size-4 -translate-x-[1.35em] translate-y-[1.35em] transition-transform duration-200 ease-[var(--ease-out)] group-hover/cta:translate-x-0 group-hover/cta:translate-y-0 motion-reduce:transition-none"
              />
            </span>
          </a>
        </div>
      </motion.div>
    </template>
  </AnimatePresence>

  <div
    id="nav-scroll-sentinel"
    aria-hidden="true"
    class="pointer-events-none absolute h-px w-px"
    style="top: calc(100vh - 80px)"
  ></div>
  <!-- Anchor target so the logo in the nav can return to the top. -->
  <span id="top" class="sr-only">Top</span>
</template>
