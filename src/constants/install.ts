const STORE_ID = 'idfojgkppleknejhenmggcnnnmdglaik';

/**
 * Chrome 商店安装链接。带 UTM 才能在自家分析里分清是哪个位置带来的安装 ——
 * 商店不认这些参数，但落地页的 outgoing link 会带上，GA/统计侧能归因。
 *
 * @param placement 链接所在位置，用于区分落地页各处的安装转化
 */
export function installUrl(placement: string): string {
  return `https://chromewebstore.google.com/detail/nomu/${STORE_ID}?utm_source=nomu_site&utm_medium=referral&utm_campaign=install&utm_content=${placement}`;
}

/**
 * 紫鸟浏览器插件中心的 Nomu 详情页。和 STORE_ID 同一类东西 —— 外部事实的本地镜像，
 * 紫鸟那边改 slug（plugin/detail/<id>/<slug>.html）要回来改这一处。
 *
 * 与商店链接不同：这里没有 UTM 归因，紫鸟的页面路径也不接受自定义参数。
 * 紫鸟用户的安装路径（插件中心搜索 → 安装 → 分配店铺）写在 NomuDocs 的
 * `docs/guide/install.md`，落地页只负责把人送过去。
 */
export const ZINIAO_PLUGIN_URL = 'https://appstore.ziniao.com/plugin/detail/16312716825135/Nomu-Tool-for-Noon.html';
