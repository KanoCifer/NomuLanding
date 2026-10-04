<script setup lang="ts">
/**
 * CreditsView — /credits
 *
 * 积分消耗说明。刻意不谈钱：只写「做什么动作、扣多少积分、怎么扣」。
 * 数字来自 Server-Go 公开接口 GET /v3/credits/prices（credit_price 表的镜像），
 * 组件里没有硬编码单价 —— 调价在后端改表，这页自动跟着变。
 *
 * 前端只负责「展示哪几行 + 每行叫什么」，这两件事属于文案，不属于数据。
 */
import { useHead } from '@unhead/vue';
import { motion, useReducedMotion } from 'motion-v';
import { computed, onMounted, onServerPrefetch, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import NoonToolFooter from '../landing/components/NoonToolFooter.vue';
import NoonToolLocaleSwitch from '../landing/components/NoonToolLocaleSwitch.vue';
import NoonToolSupport from '../landing/components/NoonToolSupport.vue';
import { EASE_OUT } from '@/constants/motionPresets';
import { installUrl } from '@/constants/install';
import { fetchCreditPrices, type CreditPrice } from '@/lib/creditPrices';

const { t } = useI18n();

const SITE_URL = 'https://nomu.kanocifer.chat';
const DOCS_SUPPORT_URL = `${SITE_URL}/docs/guide/support`;
const installHref = installUrl('credits');

useHead({
  title: () => `${t('noonTool.credits.meta.title')} · Nomu`,
  link: () => [{ rel: 'canonical', href: `${SITE_URL}/credits` }],
  meta: () => [
    { name: 'description', content: t('noonTool.credits.meta.description') },
    { property: 'og:title', content: `${t('noonTool.credits.meta.title')} · Nomu` },
    { property: 'og:description', content: t('noonTool.credits.meta.description') },
    { property: 'og:url', content: `${SITE_URL}/credits` },
  ],
});

type UnitKey = 'perCall' | 'perKToken' | 'perImage';

interface Preset {
  /** 该展示行覆盖的定价项，按顺序取第一个后端确实有的 */
  variants: { source: string; variant: string }[];
  /** i18n key，点号路径 */
  nameKey: string;
  /** 非 token 型时这条价格的计量单位（次数 / 张数） */
  unit: Exclude<UnitKey, 'perKToken'>;
}

/**
 * 展示哪几行。金额不在这里 —— 全部从接口取。
 *
 * 一个展示行可以覆盖多个 variant：同一档位的多个上游模型（ark:seedream-5.0 /
 * apiyi:gpt-image-2-all / apiyi:gpt-image-2.5-all 同为标准档、同价）只出一行。
 * 取 variants 里第一个后端确实有的，所以顺序 = 优先级。
 *
 * ponytail: 生产库曾并存旧命名（lite / pro）的重复行，已清掉，这里不再列别名。
 * 若哪天又出现没被认领的 variant，它会掉进末尾的原始标识兜底行（丑，但不会
 * 静默漏掉一个会被扣积分的动作）；那时应该补进 variants，而不是删掉兜底。
 * 另一个已知上限：若这些 variant 将来差价，页面只显示 variants 里的第一个，
 * 升级路径是拆成多行并各给一份 i18n。
 */
const PRESET: Preset[] = [
  { variants: [{ source: 'translate', variant: '' }], nameKey: 'translate', unit: 'perCall' },
  {
    variants: [{ source: 'nomu_prompt_optimize', variant: '' }],
    nameKey: 'promptOptimize',
    unit: 'perCall',
  },
  { variants: [{ source: 'nomu_product_parse', variant: '' }], nameKey: 'productParse', unit: 'perCall' },
  {
    variants: [{ source: 'knowledge_ask', variant: 'deepseek:deepseek-flash' }],
    nameKey: 'knowledgeAsk',
    unit: 'perCall',
  },
  {
    variants: [
      { source: 'design_generate', variant: 'ark:seedream-5.0' },
      { source: 'design_generate', variant: 'apiyi:gpt-image-2-all' },
      { source: 'design_generate', variant: 'apiyi:gpt-image-2.5-all' },
    ],
    nameKey: 'designLite',
    unit: 'perImage',
  },
  {
    variants: [{ source: 'design_generate', variant: 'ark:seedream-5.0-pro' }],
    nameKey: 'designPro',
    unit: 'perImage',
  },
];

interface Row {
  id: string;
  /** 展示名与说明的 i18n key 前缀；raw 非空时改用原始标识 */
  nameKey: string;
  raw: string;
  unit: UnitKey;
  amount: number;
}

const prices = ref<CreditPrice[] | null>(null);
const loadFailed = ref(false);

async function load() {
  try {
    prices.value = await fetchCreditPrices();
  } catch (err) {
    console.error('[Nomu] credit prices request failed:', err);
    loadFailed.value = true;
  }
}

// 数字只在接口里，SSG 预渲染时 onMounted 不跑，所以构建期得先取一次，
// 否则烤进 HTML 的只有「正在加载…」，这一页对搜索引擎就等于空页。
// 客户端挂载后再拉一次，调价不需要重新部署。
onServerPrefetch(load);
onMounted(load);

const rows = computed<Row[]>(() => {
  const items = prices.value;
  if (!items) return [];

  const byKey = new Map(items.map((p) => [`${p.source}|${p.variant}`, p]));
  const out: Row[] = [];
  const covered = new Set<string>();

  for (const p of PRESET) {
    const hit = p.variants.map((v) => byKey.get(`${v.source}|${v.variant}`)).find((x) => x !== undefined);
    // 后端一条都没有就不展示 —— 宁可少一行，也不要显示后端并不认可的数字
    if (!hit) continue;
    p.variants.forEach((v) => covered.add(`${v.source}|${v.variant}`));
    out.push({
      id: `${hit.source}|${hit.variant}`,
      nameKey: p.nameKey,
      raw: '',
      // 量纲由后端说了算（token 型价格不能当按次单价展示）
      unit: hit.per_token ? 'perKToken' : p.unit,
      amount: hit.amount,
    });
  }

  for (const item of items) {
    const id = `${item.source}|${item.variant}`;
    if (covered.has(id)) continue;
    out.push({
      id,
      nameKey: '',
      raw: item.variant ? `${item.source} · ${item.variant}` : item.source,
      unit: item.per_token ? 'perKToken' : 'perCall',
      amount: item.amount,
    });
  }
  return out;
});

const ruleKeys = ['preconsume', 'idempotent', 'insufficient', 'records'] as const;

const reduceMotion = useReducedMotion();

function sectionFadeUp() {
  return reduceMotion.value
    ? { initial: { opacity: 0 }, whileInView: { opacity: 1 }, viewport: { once: true } }
    : {
        initial: { opacity: 0, y: 20, filter: 'blur(10px)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px)' },
        viewport: { once: true, margin: '0px 0px -15% 0px' },
        transition: { duration: 0.7, ease: EASE_OUT },
      };
}
</script>

<template>
  <div class="bg-page min-h-screen">
    <div class="mx-auto max-w-[1180px] space-y-20 px-4 pt-10 pb-16 md:space-y-24 md:px-8 md:pt-14">
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

      <main class="space-y-20 md:space-y-24">
        <motion.section v-bind="sectionFadeUp()" aria-labelledby="credits-heading" class="space-y-4">
          <p class="text-muted text-[11px] font-medium tracking-[0.22em] uppercase">
            {{ t('noonTool.credits.eyebrow') }}
          </p>
          <h1
            id="credits-heading"
            class="text-ink max-w-3xl text-[36px] leading-[1.05] font-semibold tracking-[-0.025em] md:text-[52px] md:tracking-[-0.035em]"
          >
            {{ t('noonTool.credits.title') }}
          </h1>
          <p class="text-muted max-w-2xl text-[15px] leading-[1.55] md:text-[17px]">
            {{ t('noonTool.credits.subtitle') }}
          </p>
        </motion.section>

        <!-- 消耗表。窄屏每行折成一块，宽屏三列对齐 —— 同一份标记，grid 断点换布局。 -->
        <motion.section v-bind="sectionFadeUp()" aria-labelledby="credits-table-heading" class="space-y-4">
          <h2 id="credits-table-heading" class="sr-only">{{ t('noonTool.credits.table.title') }}</h2>
          <div
            class="overflow-hidden rounded-3xl border border-white/50 bg-white/55 shadow-[0_24px_64px_-24px_rgba(0,0,0,0.16),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
          >
            <div
              class="text-muted hidden grid-cols-[minmax(0,1fr)_9rem_8rem] gap-4 border-b border-white/50 px-6 py-3 text-[12px] font-medium tracking-wide md:grid"
            >
              <span>{{ t('noonTool.credits.table.feature') }}</span>
              <span>{{ t('noonTool.credits.table.unit') }}</span>
              <span class="text-right">{{ t('noonTool.credits.table.amount') }}</span>
            </div>

            <p v-if="prices === null && !loadFailed" class="text-muted px-6 py-10 text-center text-[14px]">
              {{ t('noonTool.credits.table.loading') }}
            </p>
            <p v-else-if="loadFailed" class="text-muted px-6 py-10 text-center text-[14px]">
              {{ t('noonTool.credits.table.failed') }}
            </p>

            <ul v-else>
              <li
                v-for="(row, i) in rows"
                :key="row.id"
                class="grid grid-cols-1 gap-1.5 px-6 py-5 md:grid-cols-[minmax(0,1fr)_9rem_8rem] md:items-baseline md:gap-4"
                :class="i < rows.length - 1 ? 'border-b border-white/40' : ''"
              >
                <div>
                  <p class="text-ink text-[15px] font-semibold tracking-[-0.01em]">
                    <template v-if="row.nameKey">
                      {{ t(`noonTool.credits.items.${row.nameKey}.name`) }}
                    </template>
                    <template v-else>
                      <code class="text-[13px] font-normal">{{ row.raw }}</code>
                    </template>
                  </p>
                  <p v-if="row.nameKey" class="text-muted text-[13px] leading-[1.5]">
                    {{ t(`noonTool.credits.items.${row.nameKey}.desc`) }}
                  </p>
                </div>
                <p class="text-muted text-[13px] md:text-[14px]">
                  {{ t(`noonTool.credits.units.${row.unit}`) }}
                </p>
                <p class="text-ink text-[17px] font-semibold tabular-nums md:text-right">
                  {{ row.amount }} {{ t('noonTool.credits.unitFen') }}
                </p>
              </li>
            </ul>
          </div>
          <p v-if="rows.length" class="text-muted text-[12.5px] leading-[1.5]">
            {{ t('noonTool.credits.table.caption') }}
          </p>
        </motion.section>

        <motion.section v-bind="sectionFadeUp()" aria-labelledby="credits-rules-heading" class="space-y-8">
          <header class="max-w-2xl">
            <h2
              id="credits-rules-heading"
              class="text-ink text-[28px] leading-[1.1] font-semibold tracking-[-0.02em] md:text-[36px]"
            >
              {{ t('noonTool.credits.rulesTitle') }}
            </h2>
          </header>
          <ul class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <li
              v-for="key in ruleKeys"
              :key="key"
              class="flex flex-col gap-2 rounded-2xl border border-white/50 bg-white/55 p-6 shadow-[0_8px_32px_-12px_rgba(0,0,0,0.10),inset_0_1px_0_rgba(255,255,255,0.7)] backdrop-blur-xl backdrop-saturate-150"
            >
              <h3 class="text-ink text-[15px] font-semibold">
                {{ t(`noonTool.credits.rules.${key}.title`) }}
              </h3>
              <p class="text-muted text-[14px] leading-[1.55]">
                {{ t(`noonTool.credits.rules.${key}.body`) }}
              </p>
            </li>
          </ul>
        </motion.section>

        <NoonToolSupport />
      </main>

      <NoonToolFooter />
    </div>
  </div>
</template>
