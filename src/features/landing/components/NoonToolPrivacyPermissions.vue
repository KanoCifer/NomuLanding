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
import { motion } from 'motion-v';
import { useReveal } from '@/composables/useReveal';
import { ICONS } from '../icons';
import NoonToolOrnament from './NoonToolOrnament.vue';

const { t } = useI18n();

/** Row/pill key → icon component. Keys double as the i18n leaf names. */
const ROW_ICONS = {
  settings: ICONS.settings,
  database: ICONS.dataStore,
  package: ICONS.batches,
  history: ICONS.list,
  zap: ICONS.zap,
  shoppingBag: ICONS.productDetails,
  image: ICONS.image,
  link: ICONS.link,
  mousePointer: ICONS.activeTab,
  code: ICONS.scripting,
  keyRound: ICONS.keyRound,
  search: ICONS.analytics,
  cookie: ICONS.browsingHistory,
  bell: ICONS.notifications,
  menu: ICONS.contextMenus,
  user: ICONS.account,
  cloud: ICONS.cloudPool,
  sparkles: ICONS.assistant,
} as const;

type Dest = 'yours' | 'nomu' | 'noon' | 'nowhere';

type ItemRow = {
  key: string;
  dest: Dest;
  icon: keyof typeof ROW_ICONS;
};

const ROWS: ItemRow[] = [
  // Yours — local
  { key: 'storeSettings', dest: 'yours', icon: 'settings' },
  { key: 'storeRecords', dest: 'yours', icon: 'database' },
  { key: 'batches', dest: 'yours', icon: 'package' },
  { key: 'storage', dest: 'yours', icon: 'history' },
  { key: 'alarms', dest: 'yours', icon: 'zap' },
  // Nomu 自有服务 — 登录后必然发生，不是可选项
  { key: 'nomuAccount', dest: 'nomu', icon: 'user' },
  { key: 'nomuCloud', dest: 'nomu', icon: 'cloud' },
  { key: 'nomuAi', dest: 'nomu', icon: 'sparkles' },
  { key: 'analytics', dest: 'nomu', icon: 'search' },
  // Noon — sent on action
  { key: 'productDetails', dest: 'noon', icon: 'shoppingBag' },
  { key: 'productImages', dest: 'noon', icon: 'image' },
  { key: 'warranty', dest: 'noon', icon: 'link' },
  { key: 'activeTab', dest: 'noon', icon: 'mousePointer' },
  { key: 'scripting', dest: 'noon', icon: 'code' },
  // Nowhere — explicitly excluded
  { key: 'password', dest: 'nowhere', icon: 'keyRound' },
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
} as const satisfies Record<string, keyof typeof ROW_ICONS>;

const PERM_KEYS: PermKey[] = ['storage', 'alarms', 'notifications', 'activeTab', 'scripting', 'contextMenus'];

// Host codes are URLs / domain names — not localizable.
const HOST_CODES = ['noon-partners.com', 'noon-cdn.com', 'alicdn.com', 'jdimg.com', 'api.nomu.kanocifer.chat'];

const reveal = useReveal();

const COL_META: Record<Dest, { chipClass: string }> = {
  // 三个"数据会去的地方"共用品牌黄；nowhere 是唯一到不了的，留在中性灰里。
  yours: { chipClass: 'bg-accent-wash text-accent-slate' },
  nomu: { chipClass: 'bg-accent-wash text-accent-slate' },
  noon: { chipClass: 'bg-accent-wash text-accent-slate' },
  nowhere: { chipClass: 'bg-ink/[0.06] text-muted' },
};
</script>

<template>
  <motion.section v-bind="reveal()" aria-labelledby="privacy-permissions-heading" class="space-y-12">
    <header class="max-w-3xl space-y-3">
      <p class="text-muted rule-glyph text-[11px] font-medium tracking-[0.22em] uppercase">
        <NoonToolOrnament />
        {{ t('landing.privacyPermissions.eyebrow') }}
      </p>
      <h2
        id="privacy-permissions-heading"
        class="text-ink text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[48px] md:tracking-[-0.035em]"
      >
        {{ t('landing.privacyPermissions.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-2xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('landing.privacyPermissions.sectionSubtitle') }}
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <motion.div
        v-for="(dest, i) in ['yours', 'nomu', 'noon', 'nowhere'] as const"
        :key="dest"
        v-bind="reveal(0.06 + i * 0.05)"
        class="panel flex flex-col overflow-hidden rounded-[22px]"
      >
        <header class="flex items-center justify-between gap-2 border-b border-[var(--hairline)] px-5 py-4">
          <h3 class="text-ink text-[15px] font-semibold tracking-[-0.01em]">
            {{ t(`landing.privacyPermissions.cols.${dest}.name`) }}
          </h3>
          <span
            :class="COL_META[dest].chipClass"
            class="rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.12em] uppercase"
          >
            {{ t(`landing.privacyPermissions.cols.${dest}.chip`) }}
          </span>
        </header>
        <p class="text-muted border-b border-[var(--hairline)] px-5 py-3 text-[12px] leading-[1.45]">
          {{ t(`landing.privacyPermissions.cols.${dest}.tagline`) }}
        </p>
        <ul class="space-y-3 px-5 py-4">
          <li v-for="row in ROWS.filter((r) => r.dest === dest)" :key="row.key" class="flex gap-3">
            <span
              class="bg-accent-wash text-accent-slate inline-flex size-7 shrink-0 items-center justify-center rounded-[10px]"
              aria-hidden="true"
            >
              <component :is="ROW_ICONS[row.icon]" :size="13" :stroke-width="1.75" />
            </span>
            <div class="min-w-0 flex-1">
              <div class="text-ink text-[13px] leading-[1.4] font-semibold">
                {{ t(`landing.privacyPermissions.items.${row.key}.name`) }}
              </div>
              <div class="text-muted mt-0.5 text-[12px] leading-[1.5]">
                {{ t(`landing.privacyPermissions.items.${row.key}.detail`) }}
              </div>
            </div>
          </li>
        </ul>
      </motion.div>
    </div>

    <motion.div v-bind="reveal(0.24)" class="space-y-4">
      <header class="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h3 class="text-ink text-[20px] font-semibold tracking-[-0.015em]">
          {{ t('landing.privacyPermissions.permissionsStrip.title') }}
        </h3>
        <p class="text-muted text-[12px]">
          {{ t('landing.privacyPermissions.permissionsStrip.subtitle') }}
        </p>
      </header>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="(pk, i) in PERM_KEYS"
          :key="pk"
          v-bind="reveal(0.26 + i * 0.03)"
          class="group/pill panel inline-flex items-center gap-2 rounded-full px-3 py-2 text-[12px] font-medium"
        >
          <component
            :is="ROW_ICONS[PERM_ICONS[pk]]"
            :size="13"
            :stroke-width="1.75"
            class="text-accent-slate"
            aria-hidden="true"
          />
          <span class="text-ink">{{ t(`landing.privacyPermissions.permissionsStrip.perms.${pk}.label`) }}</span>
          <span
            class="text-muted max-w-0 overflow-hidden text-[11px] whitespace-nowrap opacity-0 transition-all duration-200 ease-[var(--ease-out)] group-hover/pill:max-w-[280px] group-hover/pill:opacity-100"
            aria-hidden="true"
          >
            &nbsp;— {{ t(`landing.privacyPermissions.permissionsStrip.perms.${pk}.detail`) }}
          </span>
        </div>
      </div>

      <div class="text-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px]">
        <span>{{ t('landing.privacyPermissions.hostsTitle') }}</span>
        <code
          v-for="h in HOST_CODES"
          :key="h"
          class="text-ink/80 bg-card/70 rounded-md border border-[var(--hairline)] px-2 py-0.5 font-mono text-[11px]"
          >{{ h }}</code
        >
      </div>
    </motion.div>
  </motion.section>
</template>
