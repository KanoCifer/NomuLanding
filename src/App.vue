<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { RouterView } from 'vue-router';
import { readLocale } from '@/lib/locale';

const { locale } = useI18n();

// 首帧必须和水合产物（SSG 烤出来的中文）一致，否则 Vue 判定不匹配、整块重渲染，
// SSG 的收益归零。所以语言切换放在挂载之后，代价只是英文用户看到一瞬中文。
onMounted(() => {
  const saved = readLocale();
  if (saved !== locale.value) locale.value = saved;
});
</script>

<template>
  <RouterView />
</template>
