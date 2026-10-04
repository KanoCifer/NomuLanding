<script setup lang="ts">
/**
 * TextField — /register 的普通文本字段
 *
 * 注册表单里四个纯文本字段（用户名 / 邮箱 / 密码 / 确认密码）结构完全一样：
 * label + input + 错误行。把它们收在一处，输入框那一长串 class 只写一遍 ——
 * 之前每处各抄一遍，正是它们各自漂移、最后落回旧玻璃拟态的来处。
 *
 * 刻意不带前导图标。图标只在能加快识别时用；这里标签已经把字段说清楚了，
 * 而五个装饰图标只挤占了输入区的横向空间。
 *
 * 输入面是**半透的**：表单浮在 RegisterScene 的光场上，字段要能透出背后那点光，
 * 否则整块面板会沉成一块死白。但透明度只到 66% —— 再低透出来的光会把文字压到
 * 读不清（浅色材质不能叠浅色材质）。用户要求降低透明度时退成实心，靠不透明度
 * 而不是模糊来撑层级。
 */
import { Eye, EyeOff, TriangleAlert } from '@lucide/vue';

withDefaults(
  defineProps<{
    id: string;
    label: string;
    modelValue: string;
    type?: string;
    autocomplete?: string;
    placeholder?: string;
    error?: string;
    /** 密码类字段：右侧显示 / 隐藏切换 */
    revealable?: boolean;
    revealLabel?: string;
  }>(),
  { type: 'text', placeholder: '', error: '', revealable: false, revealLabel: '' },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  'toggle-reveal': [];
}>();

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="flex flex-col gap-[0.4rem]">
    <label :for="id" class="text-ink text-[13px] font-medium">{{ label }}</label>
    <div class="relative">
      <input
        :id="id"
        :type="type"
        :value="modelValue"
        :autocomplete="autocomplete"
        :placeholder="placeholder"
        :aria-invalid="error ? 'true' : undefined"
        class="text-ink placeholder:text-muted/55 focus:border-accent-slate focus:bg-surface focus:ring-accent-slate/26 [@media(prefers-reduced-transparency:reduce)]:bg-surface w-full rounded-[13px] border border-[color-mix(in_oklch,var(--ink)_10%,transparent)] bg-[color-mix(in_oklch,var(--surface)_66%,transparent)] px-[0.85rem] py-[0.7rem] text-[15px] transition-[border-color,background-color,box-shadow] duration-200 ease-[var(--ease-out)] hover:bg-[color-mix(in_oklch,var(--surface)_82%,transparent)] focus:ring-2 focus:outline-none"
        :class="[
          revealable ? 'pr-11' : 'pr-3',
          error ? '!border-destructive focus:!border-destructive focus:!ring-destructive/30' : '',
        ]"
        @input="onInput"
      />
      <button
        v-if="revealable"
        type="button"
        class="text-muted hover:text-ink focus-visible:ring-ring absolute top-1/2 right-[0.3rem] -translate-y-1/2 cursor-pointer rounded-lg p-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none"
        :aria-label="revealLabel"
        :title="revealLabel"
        @click="emit('toggle-reveal')"
      >
        <EyeOff v-if="type === 'text'" :size="17" :stroke-width="1.75" aria-hidden="true" />
        <Eye v-else :size="17" :stroke-width="1.75" aria-hidden="true" />
      </button>
    </div>
    <p v-if="error" class="text-destructive flex items-center gap-1 text-[12.5px]">
      <TriangleAlert :size="13" :stroke-width="2" class="shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
  </div>
</template>
