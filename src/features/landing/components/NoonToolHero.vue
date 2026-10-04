<script setup lang="ts">
/**
 * Hero — 编辑式双栏：左文右图，下面一条通栏产品实录。
 *
 * 交互克制：入场只做一次淡入上移（0.08s 步进），悬停只升不跳
 * （-1px + 一档阴影），没有视差、没有跟随、没有循环动画。
 * 插图里的两条装饰动效在 FlowScene 内部，且都在 reduced-motion 下停。
 */
import { useI18n } from 'vue-i18n';
import { motion, useReducedMotion } from 'motion-v';
import { EASE_OUT } from '@/constants/motionPresets';
import { installUrl } from '@/constants/install';
import { ICONS } from '../icons';
import NoonToolFlowScene from './NoonToolFlowScene.vue';
import NoonToolOrnament from './NoonToolOrnament.vue';
import NoonToolScreenshot from './NoonToolScreenshot.vue';

const { t } = useI18n();

const installHref = installUrl('hero');
const DOCS_URL = 'https://nomu.kanocifer.chat/docs/';

const reduceMotion = useReducedMotion();

/** 容器只负责排节奏，真正的位移在子项上，子项之间 0.08s 步进。 */
const heroContainer = {
  initial: 'hidden',
  animate: 'visible',
  variants: {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  },
};

const heroItem = {
  variants: {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: reduceMotion.value ? { duration: 0.2 } : { duration: 0.6, ease: EASE_OUT },
    },
  },
};

/** 标题尾词下那枚 marker 高亮块：从左抹开，晚了 0.3s，让文字先落位。
 *  走 variants 而不是 initial/animate，是让它跟着 h1 的 stagger 走 —— stagger 一改
 *  这里自动跟上，写死 delay 就会和标题脱拍。 */
const highlightItem = {
  variants: reduceMotion.value
    ? { hidden: { scaleX: 1 }, visible: { scaleX: 1 } }
    : {
        hidden: { scaleX: 0 },
        visible: { scaleX: 1, transition: { duration: 0.5, delay: 0.3, ease: EASE_OUT } },
      },
};
</script>

<template>
  <motion.section aria-labelledby="hero-heading" v-bind="heroContainer">
    <div class="grid items-center gap-14 lg:grid-cols-12 lg:gap-10 xl:gap-16">
      <!-- 左：文案 -->
      <div class="lg:col-span-6 xl:col-span-5">
        <motion.p v-bind="heroItem" class="text-muted rule-glyph text-[11px] font-medium tracking-[0.22em] uppercase">
          <NoonToolOrnament tone="accent" />
          {{ t('noonTool.hero.eyebrow') }}
        </motion.p>

        <motion.h1
          v-bind="heroItem"
          id="hero-heading"
          class="text-ink mt-6 max-w-[15ch] text-[42px] leading-[1.04] font-semibold tracking-[-0.035em] sm:text-[52px] lg:text-[54px] lg:leading-[1.0] xl:text-[64px] xl:tracking-[-0.04em]"
        >
          {{ t('noonTool.hero.headline') }}
          <span class="relative inline-block">
            <motion.span
              aria-hidden="true"
              v-bind="highlightItem"
              class="bg-accent/55 absolute inset-x-[-0.05em] bottom-[0.04em] z-0 h-[0.28em] origin-left rounded-full"
            ></motion.span>
            <span class="relative z-10">{{ t('noonTool.hero.headlineTail') }}</span>
          </span>
        </motion.h1>

        <motion.p v-bind="heroItem" class="text-muted mt-7 max-w-[46ch] text-[16px] leading-[1.6] md:text-[18px]">
          {{ t('noonTool.hero.subheadline') }}
        </motion.p>

        <motion.div v-bind="heroItem" class="mt-9 flex flex-wrap items-center gap-3">
          <a
            :href="installHref"
            target="_blank"
            rel="noopener"
            class="group/cta bg-accent text-contrast focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-[14px] font-semibold shadow-[var(--shadow-accent)] transition-[transform,box-shadow,filter] duration-200 ease-[var(--ease-out)] hover:-translate-y-px hover:brightness-[1.03] focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none active:translate-y-0 active:scale-[0.98]"
          >
            <!-- Morph: 下载箭头滑出、外链箭头滑入，叠在同一个 grid area 上 -->
            <span class="grid size-4 shrink-0 place-items-center overflow-hidden [grid-template-areas:'stack']">
              <component
                :is="ICONS.cta"
                class="size-4 transition-transform duration-200 ease-[var(--ease-out)] [grid-area:stack] motion-safe:group-hover/cta:translate-x-[1.35em] motion-safe:group-hover/cta:-translate-y-[1.35em] motion-reduce:transition-none"
              />
              <component
                :is="ICONS.external"
                class="size-4 -translate-x-[1.35em] translate-y-[1.35em] transition-transform duration-200 ease-[var(--ease-out)] [grid-area:stack] motion-safe:group-hover/cta:translate-x-0 motion-safe:group-hover/cta:translate-y-0 motion-reduce:transition-none"
              />
            </span>
            {{ t('noonTool.hero.ctaPrimary') }}
          </a>
          <a
            href="#features"
            class="text-ink inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-white px-5 py-3.5 text-[14px] font-medium transition-[transform,box-shadow] duration-200 ease-[var(--ease-out)] hover:-translate-y-px hover:shadow-[var(--shadow-panel)]"
          >
            {{ t('noonTool.hero.ctaSecondary') }}
          </a>
          <a
            :href="DOCS_URL"
            target="_blank"
            rel="noopener"
            class="text-muted hover:text-ink inline-flex items-center gap-1.5 rounded-full px-3 py-3.5 text-[14px] font-medium transition-colors duration-150"
          >
            <component :is="ICONS.docs" :size="14" />
            {{ t('noonTool.hero.ctaDocs') }}
          </a>
        </motion.div>
      </div>

      <!-- 右：插图 -->
      <motion.div v-bind="heroItem" class="lg:col-span-6 lg:pl-4 xl:col-span-7">
        <NoonToolFlowScene />
      </motion.div>
    </div>

    <!-- 通栏产品实录 -->
    <motion.div v-bind="heroItem" class="mt-20 md:mt-24">
      <NoonToolScreenshot
        video-src="/screens/01-hero.mp4"
        :alt="t('noonTool.hero.screenshotAlt')"
        aspect="5/2"
        :caption="t('noonTool.hero.screenshotCaption')"
      />
    </motion.div>
  </motion.section>
</template>
