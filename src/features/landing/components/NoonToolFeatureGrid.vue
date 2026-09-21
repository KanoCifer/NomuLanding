<script setup lang="ts">
/**
 * FeatureGrid — Editorial / paired narrative.
 * The promotional poster is the section's hero banner; below it the features
 * read as four chapters, alternating text and feature grids so the page
 * feels like a product page rather than a card dump.
 *
 * Apple design applied:
 *   - Display type uses negative tracking as it grows.
 *   - Translucent material + inset top edge for "light catching glass".
 *   - Spring entrance; reduced motion falls back to a cross-fade.
 *   - The four chapter numbers are the dominant visual, not the body text —
 *     hierarchy through size + weight.
 */
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';
import { EASE_OUT } from '@/constants/motionPresets';
import { ICONS, type IconKey } from '../icons';

const { t } = useI18n();

/** Pillar → ordered feature keys (iconKey = FeatureKey).
 *  The order mirrors the poster's table-of-contents so the four chapters
 *  read in the same direction as the four pillar icons in the poster. */
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

type PillarKey = 'manage' | 'list' | 'track' | 'insights';

interface Pillar {
  key: PillarKey;
  number: string;
  featureKeys: FeatureKey[];
}

const pillars: Pillar[] = [
  {
    key: 'manage',
    number: '01',
    featureKeys: ['pipeline', 'multiAccount', 'sources', 'account'],
  },
  {
    key: 'list',
    number: '02',
    featureKeys: ['translate', 'image', 'category', 'price', 'serial'],
  },
  {
    key: 'track',
    number: '03',
    featureKeys: ['tasks', 'engine', 'duplicate', 'cloudPool', 'sync'],
  },
  { key: 'insights', number: '04', featureKeys: ['assistant', 'export'] },
];

/** Pillar → pose JPG, sourced from `NoonToolv1/logo/ip-mascot/intro/`.
 *  Each pose matches the chapter's skill per PROFILE.md §4:
 *  - manage  → 浏览挑选店铺 (browsing with magnifier)
 *  - list    → 抓货上架 (carrying noon box)
 *  - track   → 跟踪订单 (peeking curiously)
 *  - insights → 复盘导出 (holding checklist, done) */
const POSE_MAP: Record<PillarKey, string> = {
  manage: '/screens/pose-browsing.png',
  list: '/screens/pose-collecting.jpg',
  track: '/screens/pose-curious.jpg',
  insights: '/screens/pose-done.jpg',
};

function LucideIcon(name: FeatureKey) {
  return ICONS[name];
}

const reduceMotion = useReducedMotion();

const headerIn = reduceMotion.value
  ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.25 },
    }
  : {
      initial: { opacity: 0, y: 10, filter: 'blur(8px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
      transition: { duration: 0.6, ease: EASE_OUT },
    };

const bannerIn = reduceMotion.value
  ? {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.3, delay: 0.1 },
    }
  : {
      initial: { opacity: 0, y: 16, filter: 'blur(10px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
      transition: { duration: 0.8, ease: EASE_OUT, delay: 0.1 },
    };

const chapterIn = reduceMotion.value
  ? {
      initial: { opacity: 0 },
      whileInView: { opacity: 1 },
      viewport: { once: true, margin: '0px 0px -8% 0px' },
    }
  : {
      initial: { opacity: 0, y: 18, filter: 'blur(10px)' },
      whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
      viewport: { once: true, margin: '0px 0px -8% 0px' },
      transition: { duration: 0.65, ease: EASE_OUT },
    };

const featureItem = reduceMotion.value
  ? {}
  : {
      variants: {
        hidden: { opacity: 0, y: 6 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.4, ease: EASE_OUT },
        },
      },
      viewport: { once: true },
    };
</script>

<template>
  <section :id="$attrs.id as string" aria-labelledby="features-heading" class="space-y-16 md:space-y-24">
    <!-- Section header -->
    <motion.header v-bind="headerIn" class="max-w-3xl space-y-4">
      <p class="text-muted text-[11px] font-medium tracking-[0.22em] uppercase">
        {{ t('noonTool.features.eyebrow') }}
      </p>
      <h2
        id="features-heading"
        class="text-ink text-[40px] leading-[1.02] font-semibold tracking-[-0.03em] md:text-[72px] md:leading-[1.0] md:tracking-[-0.045em]"
      >
        {{ t('noonTool.features.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('noonTool.features.sectionSubtitle') }}
      </p>
    </motion.header>

    <!-- Poster banner — full-width hero -->
    <motion.figure v-bind="bannerIn" class="relative">
      <div
        class="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/45 shadow-[0_24px_60px_-18px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.85)] backdrop-blur-xl backdrop-saturate-150"
      >
        <span
          aria-hidden="true"
          class="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/80 to-transparent"
        />
        <img
          src="/screens/poster.png"
          :alt="t('noonTool.features.poster.alt')"
          class="block h-auto w-full"
          loading="eager"
          decoding="async"
        />
      </div>
      <figcaption class="text-muted mt-3 px-1 text-[12px] tracking-[0.04em] uppercase">
        {{ t('noonTool.features.poster.caption') }}
      </figcaption>
    </motion.figure>

    <!-- Chapters — alternating left/right -->
    <div class="space-y-16 md:space-y-24">
      <motion.section
        v-for="(pillar, idx) in pillars"
        :key="pillar.key"
        v-bind="chapterIn"
        class="grid grid-cols-1 items-start gap-8 md:grid-cols-12 md:gap-10 lg:gap-14"
      >
        <!-- Text column — alternates side -->
        <div :class="['md:col-span-5', idx % 2 === 1 ? 'md:order-2 md:col-start-8' : 'md:order-1 md:col-start-1']">
          <div class="space-y-5 md:sticky md:top-24">
            <div
              :class="[
                'flex items-baseline gap-3 md:gap-4',
                idx % 2 === 1 ? 'md:flex-row-reverse md:justify-end' : 'md:justify-start',
              ]"
            >
              <!-- Nomu pose sigil — small accent next to the chapter number.
                   Sits on the outer edge of the column (left for left-aligned
                   chapters, right for right-aligned) so it reads as a chapter
                   mascot rather than a centered decoration. -->
              <img
                :src="POSE_MAP[pillar.key]"
                alt=""
                aria-hidden="true"
                class="size-14 shrink-0 self-end rounded-xl md:size-16"
              />
              <span
                class="text-accent-text font-mono text-[44px] leading-none tracking-[-0.04em] md:text-[64px]"
                aria-hidden="true"
              >
                {{ pillar.number }}
              </span>
              <span class="text-muted pb-1 text-[11px] font-medium tracking-[0.22em] uppercase md:pb-2">
                {{ t('noonTool.features.chapter') }}
              </span>
            </div>
            <h3
              :class="[
                'text-ink text-[28px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[44px] md:tracking-[-0.035em]',
                idx % 2 === 1 ? 'md:text-right' : 'md:text-left',
              ]"
            >
              {{ t(`noonTool.features.pillars.${pillar.key}.title`) }}
            </h3>
            <p
              :class="[
                'text-muted max-w-md text-[14px] leading-[1.6] md:text-[16px]',
                idx % 2 === 1 ? 'md:ml-auto md:text-right' : 'md:mr-auto md:text-left',
              ]"
            >
              {{ t(`noonTool.features.pillars.${pillar.key}.tagline`) }}
            </p>
          </div>
        </div>

        <!-- Visual column — feature cards -->
        <div :class="['md:col-span-7', idx % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:order-2 md:col-start-6']">
          <motion.ul v-bind="featureItem" class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <motion.li
              v-for="(featKey, i) in pillar.featureKeys"
              :key="featKey"
              :style="{
                transitionDelay: reduceMotion ? undefined : `${i * 0.05}s`,
              }"
              class="group flex flex-col gap-2 rounded-xl border border-white/55 bg-white/55 p-4 shadow-[0_4px_18px_-8px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-md backdrop-saturate-150 transition-shadow hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.16)]"
            >
              <span
                class="text-accent-text inline-flex size-8 shrink-0 items-center justify-center rounded-lg border border-white/60 bg-white/70 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]"
              >
                <component :is="LucideIcon(featKey)" :size="14" :stroke-width="1.75" />
              </span>
              <h4 class="text-ink text-[13.5px] leading-[1.35] font-semibold tracking-[-0.005em]">
                {{ t(`noonTool.features.items.${featKey}.title`) }}
              </h4>
              <p class="text-muted text-[12px] leading-[1.5]">
                {{ t(`noonTool.features.items.${featKey}.body`) }}
              </p>
            </motion.li>
          </motion.ul>
        </div>
      </motion.section>
    </div>
  </section>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>
