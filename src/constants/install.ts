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
