<script setup lang="ts">
/**
 * FeatureGrid — Spatial language.
 * Each feature is a frosted glass card. Same 3-col grid, denser typography,
 * icon gets its own glass chip. Material hierarchy: cards sit on the warm page,
 * float via translucency + shadow + inset light edge.
 */
import { useI18n } from 'vue-i18n';
import * as LucideIcons from '@lucide/vue';
import { motion, useReducedMotion } from 'motion-v';
import { EASE_OUT } from '@/constants/motionPresets';
import { icons, type IconKey } from '../icons';
import NoonToolScreenshot from './NoonToolScreenshot.vue';
import NoonToolPlaceholder from './NoonToolPlaceholder.vue';

const { t } = useI18n();

type FeatureKey = Extract<
  IconKey,
  | 'pipeline'
  | 'sources'
  | 'multiAccount'
  | 'translate'
  | 'image'
  | 'category'
  | 'serial'
  | 'tasks'
  | 'duplicate'
  | 'engine'
  | 'price'
  | 'export'
  | 'account'
  | 'cloudPool'
  | 'sync'
  | 'assistant'
>;

const featureKeys: FeatureKey[] = [
  'pipeline',
  'sources',
  'multiAccount',
  'translate',
  'image',
  'category',
  'serial',
  'tasks',
  'duplicate',
  'engine',
  'price',
  'export',
  'account',
  'cloudPool',
  'sync',
  'assistant',
];

const featureImages: Partial<Record<FeatureKey, string>> = {
  pipeline: '/screens/02-feature-pipeline.png',
  multiAccount: '/screens/03-feature-multiAccount.png',
  translate: '/screens/04-feature-translate.png',
  image: '/screens/05-feature-image.png',
  serial: '/screens/06-feature-serial.png',
  category: '/screens/07-feature-ai.png',
  tasks: '/screens/08-feature-post.png',
  duplicate: '/screens/09-feature-post-right.png',
};

const reduceMotion = useReducedMotion();
const gridContainer = () =>
  reduceMotion.value
    ? { initial: 'hidden', whileInView: 'visible', viewport: { once: true, margin: '0px 0px -10% 0px' } }
    : {
        initial: 'hidden',
        whileInView: 'visible',
        viewport: { once: true, margin: '0px 0px -10% 0px' },
        variants: {
          hidden: {},
          visible: { transition: { staggerChildren: 0.05, delayChildren: 0 } },
        },
      };
const cardItem = () =>
  reduceMotion.value
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true },
      }
    : {
        initial: { opacity: 0, y: 14, filter: 'blur(8px)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
        viewport: { once: true },
        transition: { duration: 0.55, ease: EASE_OUT },
      };
</script>

<template>
  <section
    :id="$attrs.id as string"
    aria-labelledby="features-heading"
    class="space-y-10"
  >
    <header class="max-w-3xl space-y-3">
      <p class="text-[11px] font-medium tracking-[0.22em] text-muted uppercase">
        {{ t('noonTool.features.eyebrow') }}
      </p>
      <h2
        id="features-heading"
        class="text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] text-ink md:text-[56px] md:tracking-[-0.035em]"
      >
        {{ t('noonTool.features.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-xl text-[15px] leading-[1.5] md:text-[17px]">
        {{ t('noonTool.features.sectionSubtitle') }}
      </p>
    </header>

    <motion.ul
      v-bind="gridContainer()"
      class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3"
    >
      <motion.li
        v-for="(key, idx) in featureKeys"
        v-bind="cardItem()"
        :key="key"
        class="group relative flex flex-col gap-3 overflow-hidden rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150 transition-shadow hover:shadow-[0_20px_50px_-16px_rgba(0,0,0,0.18),inset_0_1px_0_rgba(255,255,255,0.8)]"
      >
        <div class="flex items-center gap-2.5">
          <span
            class="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-white/60 bg-white/70 text-accent-text shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
          >
            <component
              :is="(LucideIcons as any)[icons[key]]"
              :size="16"
              :stroke-width="1.75"
            />
          </span>
          <h3 class="text-ink text-base font-semibold tracking-[-0.005em]">
            {{ t(`noonTool.features.items.${key}.title`) }}
          </h3>
          <span class="text-muted ml-auto font-mono text-[11px] tabular-nums">
            {{ String(idx + 1).padStart(2, '0') }}
          </span>
        </div>
        <p class="text-muted text-[14px] leading-[1.5]">
          {{ t(`noonTool.features.items.${key}.body`) }}
        </p>
        <NoonToolScreenshot
          v-if="featureImages[key]"
          class="mt-auto"
          :src="featureImages[key]"
          :alt="t('noonTool.features.items.' + key + '.imageAlt')"
          aspect="3/2"
        />
        <NoonToolPlaceholder
          v-else
          class="mt-auto"
          aspect="3/2"
          :label="t('noonTool.features.items.' + key + '.title')"
          :caption="t('noonTool.features.placeholder.caption')"
        />
      </motion.li>
    </motion.ul>
  </section>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>
