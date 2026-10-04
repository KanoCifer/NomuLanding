<script setup lang="ts">
/**
 * Ornament — 分节 eyebrow 前面的小标记。
 *
 * 全站分节开头原本是一行纯文字（Features / Privacy / Services…），
 * 七个分节七种语气，滚到中段就分不清自己在哪一节。加一个 20px 的标记
 * 后，节奏统一，而且它复用 Hero 航线插图里"虚线 + 包裹"这套语言，
 * 整页的图形语汇是连着的。
 *
 * 纯装饰，默认对读屏隐藏。
 */
withDefaults(defineProps<{ tone?: 'ink' | 'accent' }>(), { tone: 'ink' });
</script>

<template>
  <svg
    viewBox="0 0 22 12"
    aria-hidden="true"
    class="h-[12px] w-[22px] shrink-0 overflow-visible"
    fill="none"
    stroke-linecap="round"
  >
    <!-- 航线 -->
    <path
      d="M1 6h11"
      :stroke="tone === 'accent' ? 'var(--accent)' : 'var(--ink)'"
      stroke-opacity="0.55"
      stroke-width="1.8"
      stroke-dasharray="2 3.2"
    />
    <!-- 包裹 -->
    <rect
      x="12"
      y="1"
      width="10"
      height="10"
      rx="3.6"
      :fill="tone === 'accent' ? 'var(--accent)' : 'var(--ink)'"
      fill-opacity="0.9"
    />
    <path
      d="M14.8 4.2h4.4v3.6h-4.4z"
      :stroke="tone === 'accent' ? 'var(--ink)' : 'var(--surface)'"
      stroke-opacity="0.55"
      stroke-width="1.3"
    />
  </svg>
</template>
