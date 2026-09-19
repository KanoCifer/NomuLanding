<script setup lang="ts">
/**
 * Story-style usage:
 *   <NoonToolPlaceholder aspect="16/10" />
 *   <NoonToolPlaceholder aspect="3/2" label="Feature card screenshot" />
 *   <NoonToolPlaceholder aspect="2/1" caption="Replace with /screens/01.png" />
 */
type Aspect = '16/10' | '3/2' | '2/1';

const props = withDefaults(
  defineProps<{
    aspect?: Aspect;
    label?: string;
    caption?: string;
  }>(),
  {
    aspect: '16/10',
    label: '📷 Place screenshot here',
    caption: '',
  },
);

const aspectClass = {
  '16/10': 'aspect-[16/10]',
  '3/2': 'aspect-[3/2]',
  '2/1': 'aspect-[2/1]',
}[props.aspect];
</script>

<template>
  <figure
    class="group border-border bg-card/40 text-muted relative flex w-full items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed shadow-md transition-shadow motion-safe:hover:shadow-lg"
    :class="aspectClass"
    role="img"
    :aria-label="label"
  >
    <div class="flex flex-col items-center gap-1 px-4 text-center">
      <span class="text-ink/80 text-sm font-medium">{{ label }}</span>
      <span v-if="caption" class="text-muted text-xs">{{ caption }}</span>
    </div>
    <span
      class="bg-card/70 text-muted pointer-events-none absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] tracking-wider uppercase"
    >
      {{ aspect }}
    </span>
  </figure>
</template>
