<script setup lang="ts">
/**
 * PrivacyPermissions — Spatial language, single fused section.
 *
 * Privacy and Permissions treated as a single data-destination table:
 * three columns ("Yours / Noon / Nowhere") each holding the items
 * that live in that destination. Permissions sit beneath as an inline
 * pill row (all visible, not collapsible) — replaces the old accordion.
 *
 * Material hierarchy: cards use heavy blur + deep shadow on the page;
 * permission pills use lighter blur (smaller surface, lower weight).
 * Apple §12 — never stack a light translucent surface on another.
 */
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';
import { EASE_OUT } from '@/constants/motionPresets';
import * as LucideIcons from '@lucide/vue';

const { t } = useI18n();

const ICONS = {
  settings: 'Settings',
  database: 'Database',
  package: 'Package',
  history: 'History',
  zap: 'Zap',
  shoppingBag: 'ShoppingBag',
  image: 'Image',
  link: 'Link',
  mousePointer: 'MousePointerClick',
  code: 'Code',
  keyRound: 'KeyRound',
  search: 'Search',
  cookie: 'Cookie',
  bell: 'Bell',
  menu: 'MenuSquare',
} as const;

type Dest = 'yours' | 'noon' | 'nowhere';

type ItemRow = {
  key: string;
  dest: Dest;
  icon: keyof typeof ICONS;
};

const ROWS: ItemRow[] = [
  // Yours — local
  { key: 'storeSettings', dest: 'yours', icon: 'settings' },
  { key: 'storeRecords', dest: 'yours', icon: 'database' },
  { key: 'batches', dest: 'yours', icon: 'package' },
  { key: 'storage', dest: 'yours', icon: 'history' },
  { key: 'alarms', dest: 'yours', icon: 'zap' },
  // Noon — sent on action
  { key: 'productDetails', dest: 'noon', icon: 'shoppingBag' },
  { key: 'productImages', dest: 'noon', icon: 'image' },
  { key: 'warranty', dest: 'noon', icon: 'link' },
  { key: 'activeTab', dest: 'noon', icon: 'mousePointer' },
  { key: 'scripting', dest: 'noon', icon: 'code' },
  // Nowhere — explicitly excluded
  { key: 'password', dest: 'nowhere', icon: 'keyRound' },
  { key: 'analytics', dest: 'nowhere', icon: 'search' },
  { key: 'browsingHistory', dest: 'nowhere', icon: 'cookie' },
  { key: 'notifications', dest: 'nowhere', icon: 'bell' },
  { key: 'contextMenus', dest: 'nowhere', icon: 'menu' },
];

type PermKey = keyof typeof PERM_ICONS;
const PERM_ICONS = {
  storage: 'database',
  alarms: 'zap',
  notifications: 'bell',
  activeTab: 'mousePointer',
  scripting: 'code',
  contextMenus: 'menu',
} as const satisfies Record<string, keyof typeof ICONS>;

const PERM_KEYS: PermKey[] = [
  'storage',
  'alarms',
  'notifications',
  'activeTab',
  'scripting',
  'contextMenus',
];

// Host codes are URLs / domain names — not localizable.
const HOST_CODES = [
  'noon-partners.com',
  'noon-cdn.com',
  'alicdn.com',
  'jdimg.com',
  'api.nomu.kanocifer.chat',
];

const reduceMotion = useReducedMotion();

function fade(delay = 0) {
  return reduceMotion.value
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true }, transition: { duration: 0.2, delay } }
    : {
        initial: { opacity: 0, y: 12, filter: 'blur(8px)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
        viewport: { once: true, margin: '0px 0px -10% 0px' },
        transition: { duration: 0.6, ease: EASE_OUT, delay },
      };
}

const COL_META: Record<Dest, { chipClass: string }> = {
  yours: { chipClass: 'bg-success/15 text-success' },
  noon: { chipClass: 'bg-accent/30 text-accent-text' },
  nowhere: { chipClass: 'bg-muted/15 text-muted' },
};
</script>

<template>
  <motion.section
    v-bind="fade(0.05)"
    aria-labelledby="privacy-permissions-heading"
    class="space-y-12"
  >
    <header class="max-w-3xl space-y-3">
      <p class="text-muted text-[11px] font-medium tracking-[0.22em] uppercase">
        {{ t('noonTool.privacyPermissions.eyebrow') }}
      </p>
      <h2
        id="privacy-permissions-heading"
        class="text-ink text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[52px] md:tracking-[-0.035em]"
      >
        {{ t('noonTool.privacyPermissions.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-2xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('noonTool.privacyPermissions.sectionSubtitle') }}
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <div
        v-for="(dest, i) in (['yours', 'noon', 'nowhere'] as const)"
        :key="dest"
        v-bind="fade(0.1 + i * 0.08)"
        class="flex flex-col overflow-hidden rounded-2xl border border-white/50 bg-white/55 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
      >
        <header class="flex items-center justify-between gap-2 border-b border-white/40 px-5 py-4">
          <h3 class="text-ink text-[15px] font-semibold tracking-[-0.01em]">
            {{ t(`noonTool.privacyPermissions.cols.${dest}.name`) }}
          </h3>
          <span
            :class="COL_META[dest].chipClass"
            class="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
          >
            {{ t(`noonTool.privacyPermissions.cols.${dest}.chip`) }}
          </span>
        </header>
        <p class="text-muted border-b border-white/40 px-5 py-3 text-[12px] leading-[1.45]">
          {{ t(`noonTool.privacyPermissions.cols.${dest}.tagline`) }}
        </p>
        <ul class="space-y-3 px-5 py-4">
          <li
            v-for="row in ROWS.filter((r) => r.dest === dest)"
            :key="row.key"
            class="flex gap-3"
          >
            <span
              class="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-white/70 text-accent-text shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
              aria-hidden="true"
            >
              <component
                :is="(LucideIcons as any)[ICONS[row.icon]]"
                :size="13"
                :stroke-width="1.75"
              />
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-ink text-[13px] font-semibold leading-[1.4]">
                {{ t(`noonTool.privacyPermissions.items.${row.key}.name`) }}
              </div>
              <div class="text-muted mt-0.5 text-[12px] leading-[1.5]">
                {{ t(`noonTool.privacyPermissions.items.${row.key}.detail`) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <motion.div v-bind="fade(0.3)" class="space-y-4">
      <header class="flex items-baseline justify-between gap-4">
        <h3 class="text-ink text-[20px] font-semibold tracking-[-0.015em]">
          {{ t('noonTool.privacyPermissions.permissionsStrip.title') }}
        </h3>
        <p class="text-muted text-[12px]">
          {{ t('noonTool.privacyPermissions.permissionsStrip.subtitle') }}
        </p>
      </header>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(pk, i) in PERM_KEYS"
          :key="pk"
          v-bind="fade(0.32 + i * 0.04)"
          class="group/pill inline-flex items-center gap-2 rounded-full border border-white/50 bg-white/55 px-3 py-2 text-[12px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md backdrop-saturate-150 transition-all hover:bg-white/75"
        >
          <component
            :is="(LucideIcons as any)[ICONS[PERM_ICONS[pk]]]"
            :size="13"
            :stroke-width="1.75"
            class="text-accent-text"
            aria-hidden="true"
          />
          <span>{{ t(`noonTool.privacyPermissions.permissionsStrip.perms.${pk}.label`) }}</span>
          <span
            class="text-muted max-w-0 overflow-hidden whitespace-nowrap text-[11px] opacity-0 transition-all duration-200 ease-out group-hover/pill:max-w-[280px] group-hover/pill:opacity-100"
            aria-hidden="true"
          >
            &nbsp;— {{ t(`noonTool.privacyPermissions.permissionsStrip.perms.${pk}.detail`) }}
          </span>
        </div>
      </div>

      <div class="text-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        <span>{{ t('noonTool.privacyPermissions.hostsTitle') }}</span>
        <code
          v-for="h in HOST_CODES"
          :key="h"
          class="rounded-md border border-white/40 bg-white/40 px-2 py-0.5 font-mono text-[11px] text-ink/80"
        >{{ h }}</code>
      </div>
    </motion.div>
  </motion.section>
</template>