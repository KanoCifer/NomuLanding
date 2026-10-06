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
import { motion } from 'motion-v';
import { useReveal } from '@/composables/useReveal';
import { ICONS, type IconKey } from '../icons';
import { DOCS_ORIGIN, DOC_HREF, type DocKey } from '../docsLinks';
import NoonToolOrnament from './NoonToolOrnament.vue';

const { t } = useI18n();

/** Pillar → ordered feature keys (iconKey = FeatureKey).
 *  The order mirrors the poster's table-of-contents so the four chapters
 *  read in the same direction as the four pillar icons in the poster. */
type FeatureKey = Extract<
  IconKey,
  | 'pipeline'
  | 'sources'
  | 'multiAccount'
  | 'browse'
  | 'translate'
  | 'image'
  | 'design'
  | 'category'
  | 'variants'
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
  | 'barcode'
  | 'overview'
  | 'status'
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
    featureKeys: ['pipeline', 'multiAccount', 'sources', 'browse', 'account'],
  },
  {
    key: 'list',
    number: '02',
    featureKeys: ['translate', 'design', 'image', 'category', 'variants', 'price', 'serial'],
  },
  {
    key: 'track',
    number: '03',
    featureKeys: ['tasks', 'engine', 'duplicate', 'cloudPool', 'sync'],
  },
  {
    key: 'insights',
    number: '04',
    featureKeys: ['overview', 'status', 'assistant', 'barcode', 'export'],
  },
];

/** Pillar → pose 图，源文件在 `NoonToolv1/logo/ip-mascot/intro/`。
 *  Each pose matches the chapter's skill per PROFILE.md §4:
 *  - manage  → 浏览挑选店铺 (browsing with magnifier)
 *  - list    → 抓货上架 (carrying noon box)
 *  - track   → 跟踪订单 (peeking curiously)
 *  - insights → 复盘导出 (holding checklist, done)
 *  宽高一起存：HTML 里不写 width/height 浏览器就没法预留位置，滚动时会跳。 */
const POSE_MAP: Record<PillarKey, { src: string; w: number; h: number }> = {
  manage: { src: '/screens/pose-browsing.webp', w: 1000, h: 1000 },
  list: { src: '/screens/pose-collecting.jpg', w: 256, h: 256 },
  track: { src: '/screens/pose-curious.jpg', w: 256, h: 256 },
  insights: { src: '/screens/pose-done.jpg', w: 256, h: 256 },
};

/**
 * 能力卡 → 文档页。取值跟着 NomuDocs 的 `features.md` 走 —— 那张表已经把
 * 「采集 → 上架」主线上每一环指到了详细说明，这里是它的镜像。
 * 20 张卡覆盖 13 个文档页，是站内权重流向文档站的主要通道。
 */
const FEATURE_DOC: Partial<Record<FeatureKey, DocKey>> = {
  pipeline: 'quickStart',
  multiAccount: 'stores',
  sources: 'quickStart',
  browse: 'catalogBrowse',
  account: 'account',
  translate: 'quickStart',
  image: 'quickStart',
  serial: 'quickStart',
  category: 'quickStart',
  variants: 'groupAndSizes',
  price: 'quickStart',
  export: 'features',
  design: 'nomuDesign',
  tasks: 'tasks',
  engine: 'tasks',
  duplicate: 'duplicate',
  cloudPool: 'cloudPool',
  sync: 'configSync',
  assistant: 'nomuAssistant',
  barcode: 'barcode',
  overview: 'features',
  status: 'configSync',
};

function LucideIcon(name: FeatureKey) {
  return ICONS[name];
}

const reveal = useReveal();
</script>

<template>
  <section :id="$attrs.id as string" aria-labelledby="features-heading" class="space-y-16 md:space-y-24">
    <!-- Section header -->
    <motion.header v-bind="reveal()" class="max-w-3xl space-y-4">
      <p class="text-muted rule-glyph text-[11px] font-medium tracking-[0.22em] uppercase">
        <NoonToolOrnament tone="accent" />
        {{ t('landing.features.eyebrow') }}
      </p>
      <h2
        id="features-heading"
        class="text-ink text-[40px] leading-[1.02] font-semibold tracking-[-0.03em] md:text-[64px] md:leading-[1.0] md:tracking-[-0.04em]"
      >
        {{ t('landing.features.sectionTitle') }}
      </h2>
      <p class="text-muted max-w-xl text-[15px] leading-[1.55] md:text-[17px]">
        {{ t('landing.features.sectionSubtitle') }}
      </p>
    </motion.header>

    <!-- Poster banner — full-width hero -->
    <motion.figure v-bind="reveal(0.08)" class="relative">
      <div class="panel overflow-hidden rounded-[28px]">
        <!-- WebP：同一张海报 1MB PNG → 43KB。首屏最大的一块就靠这一行 -->
        <img
          src="/screens/poster.webp"
          :alt="t('landing.features.poster.alt')"
          class="block h-auto w-full"
          width="1400"
          height="560"
          loading="eager"
          fetchpriority="high"
          decoding="async"
        />
      </div>
      <figcaption class="text-muted mt-3 px-1 text-[12px] tracking-[0.04em] uppercase">
        {{ t('landing.features.poster.caption') }}
      </figcaption>
    </motion.figure>

    <!-- Chapters — alternating left/right -->
    <div class="space-y-16 md:space-y-24">
      <motion.section
        v-for="(pillar, idx) in pillars"
        :key="pillar.key"
        v-bind="reveal()"
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
                :src="POSE_MAP[pillar.key].src"
                :width="POSE_MAP[pillar.key].w"
                :height="POSE_MAP[pillar.key].h"
                alt=""
                aria-hidden="true"
                class="size-14 shrink-0 self-end rounded-xl md:size-16"
                loading="lazy"
                decoding="async"
              />
              <span
                class="text-ink font-mono text-[44px] leading-none tracking-[-0.04em] md:text-[60px]"
                aria-hidden="true"
              >
                {{ pillar.number }}
              </span>
              <span class="text-muted pb-1 text-[11px] font-medium tracking-[0.22em] uppercase md:pb-2">
                {{ t('landing.features.chapter') }}
              </span>
            </div>
            <h3
              :class="[
                'text-ink text-[28px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[40px] md:tracking-[-0.035em]',
                idx % 2 === 1 ? 'md:text-right' : 'md:text-left',
              ]"
            >
              {{ t(`landing.features.pillars.${pillar.key}.title`) }}
            </h3>
            <p
              :class="[
                'text-muted max-w-md text-[14px] leading-[1.6] md:text-[16px]',
                idx % 2 === 1 ? 'md:ml-auto md:text-right' : 'md:mr-auto md:text-left',
              ]"
            >
              {{ t(`landing.features.pillars.${pillar.key}.tagline`) }}
            </p>
          </div>
        </div>

        <!-- Visual column — feature cards -->
        <div :class="['md:col-span-7', idx % 2 === 1 ? 'md:order-1 md:col-start-1' : 'md:order-2 md:col-start-6']">
          <ul class="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li
              v-for="featKey in pillar.featureKeys"
              :key="featKey"
              class="panel panel-hover group flex flex-col gap-2 rounded-[18px] p-4"
            >
              <span
                class="bg-accent-wash text-accent-slate inline-flex size-8 shrink-0 items-center justify-center rounded-[11px]"
              >
                <component :is="LucideIcon(featKey)" :size="14" :stroke-width="1.75" />
              </span>
              <h4 class="text-ink text-[13.5px] leading-[1.35] font-semibold tracking-[-0.005em]">
                {{ t(`landing.features.items.${featKey}.title`) }}
              </h4>
              <p class="text-muted text-[12px] leading-[1.5]">
                {{ t(`landing.features.items.${featKey}.body`) }}
              </p>
              <!-- 指向文档站的上下文内链。锚文本用文档页自己的标题，Google 靠它判断
                   目标页主题；写「点击这里」等于没给信息。 -->
              <a
                v-if="FEATURE_DOC[featKey]"
                :href="`${DOCS_ORIGIN}${DOC_HREF[FEATURE_DOC[featKey]!]}`"
                class="text-accent-slate mt-auto inline-flex items-center gap-1 pt-1 text-[12px] font-medium hover:underline"
              >
                {{ t('landing.docsCta') }}{{ t(`landing.docsLinks.${FEATURE_DOC[featKey]}`) }}
              </a>
            </li>
          </ul>
        </div>
      </motion.section>
    </div>
  </section>
</template>

<script lang="ts">
export default { inheritAttrs: false };
</script>
