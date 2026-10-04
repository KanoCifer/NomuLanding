/**
 * 落地页 → 文档站的内链表。
 *
 * 为什么要有这张表：文档站（NomuDocs）有 23 个中文页 + 23 个英文页，覆盖安装、店铺
 * 配置、采集发布、任务面板这些真正的长尾词，但落地页原先只链了 `/docs/` 和
 * `/docs/guide/support` 两处，其余 44 页收不到任何内链权重。文档站自己的
 * `features.md` 已经是能力索引，这里是它的镜像 —— 每条能力指向它对应的那一页。
 *
 * 两条规矩：
 *   1. **href 只在这里写**，slug 对应 NomuDocs 的 `docs/guide/<slug>.md`；
 *      目录页（`docs/`、`docs/privacy/`）直接写完整路径。
 *   2. **锚文本走 i18n**（`landing.docsLinks.<key>`），因为页面运行时能切英文；
 *      锚文本用文档自己的标题，不要写「点击这里」这种无信息量的词。
 */
export const DOC_HREF = {
  quickStart: '/docs/guide/quick-start',
  account: '/docs/guide/account',
  stores: '/docs/guide/stores',
  catalogBrowse: '/docs/guide/catalog-browse',
  quickSearch: '/docs/guide/quick-search',
  nomuDesign: '/docs/guide/nomu-design',
  nomuAssistant: '/docs/guide/nomu-assistant',
  groupAndSizes: '/docs/guide/group-and-sizes',
  tasks: '/docs/guide/tasks',
  duplicate: '/docs/guide/duplicate',
  cloudPool: '/docs/guide/cloud-pool',
  configSync: '/docs/guide/config-sync',
  barcode: '/docs/guide/barcode-labels',
  install: '/docs/guide/install',
  features: '/docs/guide/features',
  privacy: '/docs/privacy/',
} as const;

export type DocKey = keyof typeof DOC_HREF;

/** 文档站的绝对地址。站内其它地方也是这个拼法（footer / FAQ 支持渠道）。 */
export const DOCS_ORIGIN = 'https://nomu.kanocifer.chat';

export function docHref(key: DocKey): string {
  return `${DOCS_ORIGIN}${DOC_HREF[key]}`;
}

/**
 * FAQ 展示与渲染的条目。**这份列表就是 FAQPage 结构化数据的来源** ——
 * schema 里出现、页面上没渲染的问答属于声明与内容不符，比不加更糟，所以两边共用它。
 */
export const FAQ_KEYS = ['free', 'apiKey', 'regions', 'sources', 'data', 'ai', 'translation', 'failure'] as const;

export type FaqKey = (typeof FAQ_KEYS)[number];

/** FAQ 条目 → 对应文档页。8 条里 8 条都有落点。 */
export const FAQ_DOC: Record<FaqKey, DocKey> = {
  free: 'account',
  apiKey: 'account',
  regions: 'install',
  sources: 'quickStart',
  data: 'privacy',
  ai: 'account',
  translation: 'quickStart',
  failure: 'tasks',
};
