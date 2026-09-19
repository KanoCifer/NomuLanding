<script setup lang="ts">
/**
 * Permissions — Spatial language:
 * Top: 3 frosted-glass cards summarizing core permissions with their icons.
 * Below: a single glass container housing the collapsible full list (permissions
 * and host permissions in two columns when expanded). Spatial preference: heavy
 * blur + deep shadow on the big container; subtle inset border for material.
 */
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import * as LucideIcons from '@lucide/vue';
import Card from '@/components/Card.vue';
import { icons, type IconKey } from '../icons';

const { t } = useI18n();

type PermKey = Extract<IconKey, `perm${string}`>;

const topKeys = ['activeTab', 'scripting', 'storage'] as const;
const allPerms = [
  'storage',
  'alarms',
  'notifications',
  'activeTab',
  'scripting',
  'contextMenus',
] as const;

const permIcon: Record<(typeof allPerms)[number], PermKey> = {
  storage: 'permStorage',
  alarms: 'permAlarms',
  notifications: 'permNotifications',
  activeTab: 'permActiveTab',
  scripting: 'permScripting',
  contextMenus: 'permContextMenus',
};

const hostKeys = [
  'noonPartners',
  'noonCdn',
  'alicdn',
  'jdimg',
  'backend',
] as const;

const showFull = ref(false);
</script>

<template>
  <section aria-labelledby="permissions-heading" class="space-y-8">
    <header class="space-y-3 text-center">
      <h2
        id="permissions-heading"
        class="text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] text-ink md:text-[52px] md:tracking-[-0.035em]"
      >
        {{ t('noonTool.permissions.sectionTitle') }}
      </h2>
      <p class="text-muted mx-auto max-w-xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('noonTool.permissions.sectionSubtitle') }}
      </p>
    </header>

    <div class="grid gap-4 md:grid-cols-3">
      <Card
        v-for="key in topKeys"
        :key="key"
        class="gap-2 overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
      >
        <span
          class="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-accent-text shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
        >
          <component
            :is="(LucideIcons as any)[icons[permIcon[key]]]"
            :size="14"
            :stroke-width="1.75"
          />
        </span>
        <span class="text-ink text-[15px] font-semibold tracking-[-0.01em]">
          {{ t(`noonTool.permissions.top.${key}.name`) }}
        </span>
        <p class="text-muted text-[13px] leading-[1.5]">
          {{ t(`noonTool.permissions.top.${key}.reason`) }}
        </p>
      </Card>
    </div>

    <div
      class="overflow-hidden rounded-2xl border border-white/50 bg-white/55 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
    >
      <button
        type="button"
        class="text-ink flex w-full items-center gap-2 px-6 py-4 text-left text-sm font-medium transition-colors hover:bg-white/40"
        :aria-expanded="showFull"
        aria-controls="full-permissions-panel"
        @click="showFull = !showFull"
      >
        <svg
          class="text-muted h-4 w-4 shrink-0 transition-transform duration-200"
          :class="{ 'rotate-180': showFull }"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
        <span>{{ t('noonTool.permissions.fullTitle') }}</span>
      </button>
      <div
        id="full-permissions-panel"
        class="grid transition-[grid-template-rows] duration-200 ease-out"
        :class="[showFull ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]']"
      >
        <div class="min-h-0 overflow-hidden">
          <div class="grid gap-6 border-t border-white/40 p-6 md:grid-cols-2">
            <div>
              <h4
                class="text-accent-text mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
              >
                {{ t('noonTool.permissions.sectionTitle') }}
              </h4>
              <dl class="space-y-3">
                <div v-for="p in allPerms" :key="p" class="flex gap-3">
                  <dt class="text-ink shrink-0 text-[13px] font-semibold">
                    {{ t(`noonTool.permissions.full.permissions.${p}.name`) }}
                  </dt>
                  <dd class="text-muted text-[13px] leading-[1.5]">
                    {{ t(`noonTool.permissions.full.permissions.${p}.reason`) }}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h4
                class="text-accent-text mb-3 text-[11px] font-semibold tracking-[0.18em] uppercase"
              >
                {{ t('noonTool.permissions.full.hostsTitle') }}
              </h4>
              <dl class="space-y-3">
                <div v-for="h in hostKeys" :key="h" class="flex gap-3">
                  <dt class="text-ink shrink-0 text-[13px] font-semibold">
                    {{ t(`noonTool.permissions.full.hosts.${h}.name`) }}
                  </dt>
                  <dd class="text-muted text-[13px] leading-[1.5]">
                    {{ t(`noonTool.permissions.full.hosts.${h}.reason`) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
