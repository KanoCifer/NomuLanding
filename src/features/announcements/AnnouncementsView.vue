<script setup lang="ts">
/**
 * AnnouncementsView — /announcements
 *
 * 公告归档页。**不做已读状态**：这一页是「一次看完」的入口，没有和轨道抢注意力
 * 的问题；已读那套 id 列表只对扩展总览台有意义（两边也存不到同一处 —— 落地页
 * 是 https 源，扩展是 chrome-extension:// 源，localStorage 不互通）。
 *
 * 内容全部来自 `GET /v3/announcements`，页面上没有硬编码公告。
 */
import { useHead } from '@vueuse/head';
import { motion, useReducedMotion } from 'motion-v';
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import NoonToolFooter from '../landing/components/NoonToolFooter.vue';
import NoonToolLocaleSwitch from '../landing/components/NoonToolLocaleSwitch.vue';
import NoonToolSupport from '../landing/components/NoonToolSupport.vue';
import { EASE_OUT } from '@/constants/motionPresets';
import { installUrl } from '@/constants/install';
import { fetchAnnouncements, type Announcement, type AnnouncementType } from '@/lib/announcements';

const { t } = useI18n();
const SITE_URL = 'https://nomu.kanocifer.chat';
const installHref = installUrl('announcements');

useHead({
  title: () => `${t('noonTool.announcements.meta.title')} · Nomu`,
  meta: () => [
    { name: 'description', content: t('noonTool.announcements.meta.description') },
    { property: 'og:title', content: `${t('noonTool.announcements.meta.title')} · Nomu` },
    { property: 'og:description', content: t('noonTool.announcements.meta.description') },
    { property: 'og:url', content: `${SITE_URL}/announcements` },
  ],
});

const items = ref<Announcement[]>([]);
const loading = ref(true);
const failed = ref(false);
const reduced = useReducedMotion();

onMounted(async () => {
  try {
    items.value = await fetchAnnouncements();
  } catch {
    // 拉不到就摆空态，不显示错误码：公告是附属信息，页面其它部分仍然可用。
    failed.value = true;
  } finally {
    loading.value = false;
  }
});

/** 按 type 分组，组内保持时间倒序。组序按接口白名单固定，不随数据量抖动。 */
const GROUPS: AnnouncementType[] = ['maintenance', 'security', 'feature', 'update', 'credit', 'general'];

const grouped = computed(() =>
  GROUPS.map((type) => ({ type, rows: items.value.filter((a) => a.type === type) })).filter((g) => g.rows.length > 0),
);

function sectionFadeUp() {
  return {
    initial: reduced.value ? false : { opacity: 0, y: 16 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, ease: EASE_OUT },
  };
}

/** 维护 / 安全是警示，feature 是强调，其余中性。色值走 Tailwind 语义类，不硬编码主题色。 */
const TYPE_TONE: Record<AnnouncementType, string> = {
  maintenance: 'text-[#8a5320]',
  security: 'text-[#9c2f2f]',
  feature: 'text-[#7a6410]',
  update: 'text-[#2f5d9c]',
  credit: 'text-[#2f6b4f]',
  general: 'text-muted',
};

const TYPE_DOT: Record<AnnouncementType, string> = {
  maintenance: 'bg-[#d99425]',
  security: 'bg-[#c8443f]',
  feature: 'bg-[#e0bb1f]',
  update: 'bg-[#3f7fd0]',
  credit: 'bg-[#3d9a70]',
  general: 'bg-[#8a8378]',
};

/** 绝对日期。格式与扩展总览台同一套口径（那边今天给 HH:mm，这里给完整年月日，
 *  因为归档页一行放得下完整日期，扫读时也不需要猜年份）。 */
function stamp(iso: string): string {
  if (!iso) return '';
  const d = dayjs(iso);
  return d.isValid() ? d.format('YYYY-MM-DD') : '';
}
</script>

<template>
  <div class="bg-page min-h-screen">
    <div class="mx-auto max-w-[900px] space-y-16 px-4 pt-10 pb-16 md:px-8 md:pt-14">
      <!-- 顶部：logo 回首页 + 语言切换 + 安装。不用落地页的浮动导航，
           那条导航的锚点指向首页分栏，在本页会落空。 -->
      <header class="flex items-center justify-between gap-3">
        <RouterLink to="/" class="focus-visible:ring-ring inline-flex items-center gap-2 rounded-full px-1 py-1">
          <img src="/icon/32.png" alt="Nomu" class="size-7 rounded-md" />
          <span class="text-ink text-[15px] font-semibold tracking-tight">Nomu</span>
        </RouterLink>
        <div class="flex items-center gap-2">
          <NoonToolLocaleSwitch />
          <a
            :href="installHref"
            target="_blank"
            rel="noopener"
            class="bg-ink text-surface hover:bg-ink/90 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-[12.5px] font-medium transition-[background-color,transform] duration-150 ease-[var(--ease-out)] active:scale-[0.96]"
          >
            {{ t('noonTool.nav.install') }}
          </a>
        </div>
      </header>

      <motion.header v-bind="sectionFadeUp()">
        <p class="text-muted text-[11px] tracking-[0.12em] uppercase">
          {{ t('noonTool.announcements.eyebrow') }}
        </p>
        <h1 class="text-ink mt-3 text-[32px] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[42px]">
          {{ t('noonTool.announcements.title') }}
        </h1>
        <p class="text-muted mt-4 max-w-2xl text-[15px] leading-[1.6]">
          {{ t('noonTool.announcements.subheadline') }}
        </p>
      </motion.header>

      <p v-if="loading" class="text-muted text-[14px]">{{ t('noonTool.announcements.loading') }}</p>

      <p v-else-if="failed" class="text-muted text-[14px]">
        {{ t('noonTool.announcements.loadFailed') }}
      </p>

      <p v-else-if="!items.length" class="text-muted text-[14px]">
        {{ t('noonTool.announcements.empty') }}
      </p>

      <div v-else class="flex flex-col gap-16">
        <motion.section
          v-for="group in grouped"
          :key="group.type"
          v-bind="sectionFadeUp()"
          :aria-labelledby="`ann-${group.type}`"
        >
          <h2
            :id="`ann-${group.type}`"
            class="flex items-center gap-2 text-[12px] tracking-[0.12em] uppercase"
            :class="TYPE_TONE[group.type]"
          >
            <span class="h-1.5 w-1.5 rounded-full" :class="TYPE_DOT[group.type]" aria-hidden />
            {{ t(`noonTool.announcements.types.${group.type}`) }}
            <span class="text-muted font-normal tabular-nums">{{ group.rows.length }}</span>
          </h2>

          <ul class="mt-5 flex flex-col gap-4">
            <li
              v-for="item in group.rows"
              :key="item.id"
              class="rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
            >
              <div class="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 class="text-ink text-[16px] leading-[1.35] font-semibold">{{ item.title }}</h3>
                <time class="text-muted ml-auto text-[12px] tabular-nums" :datetime="item.created_at">
                  {{ stamp(item.created_at) }}
                </time>
              </div>
              <p class="text-muted mt-2 text-[14px] leading-[1.6] whitespace-pre-line">
                {{ item.content }}
              </p>
            </li>
          </ul>
        </motion.section>
      </div>

      <NoonToolSupport />
    </div>

    <NoonToolFooter />
  </div>
</template>
