/**
 * IndexNow 提交 —— 通知 Bing / Edge 等参与方「这些 URL 变了，去重抓」。
 *
 * 两件事必须成对，缺一个都会被 403：
 *   1. 站点根目录有 `public/<key>.txt`（内容就是 key），build 时会随 dist/ 一起部署；
 *   2. key 与该文件一致。
 * 所以顺序是：改完内容 → pnpm build → 部署 → 跑本脚本。
 *
 * 范围要说清楚：IndexNow 只覆盖参与方（Bing、Edge 及 Yandex/Naver/Seznam 等），
 * **不包含 Google**。Google 只能走 Search Console 的 URL 检查 / sitemap，
 * 本脚本对 Google 收录没有任何作用。
 *
 * 用法：pnpm indexnow（依赖 dist/sitemap.xml，没 build 过会直接报错而不是提交空列表）
 */
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '..');
const ENDPOINT = 'https://api.indexnow.org/indexnow';

/** 官方文档的响应码。200 只代表「收到了」，不代表已收录。 */
const MEANING = {
  200: '已接收',
  202: '已接收，key 校验中（key 文件还没到根目录时就是这个；IndexNow 会继续重试）',
  400: '请求格式错',
  403: 'key 无效：多半是站点根目录还访问不到 <key>.txt，先 build + 部署',
  422: 'URL 不属于该 host，或 key 不符合协议格式',
  429: '提交太频繁，被限流',
};

function readKey() {
  // key 文件名就是 key，public/ 下除 robots.txt 之外的那个 .txt 即是。不额外存一份常量。
  const files = readdirSync(resolve(ROOT, 'public')).filter((f) => f.endsWith('.txt') && f !== 'robots.txt');
  if (files.length !== 1) {
    throw new Error(
      `public/ 下应有且仅有一个 IndexNow key 文件，实际找到 ${files.length} 个：${files.join(', ') || '无'}`,
    );
  }
  const name = files[0].replace(/\.txt$/, '');
  const key = readFileSync(resolve(ROOT, 'public', files[0]), 'utf-8').trim();
  if (key !== name) {
    throw new Error(`key 文件名 (${name}) 与文件内容 (${key}) 不一致，IndexNow 会判 403`);
  }
  return key;
}

function readUrls() {
  // 读的是 landing-sitemap.xml 而不是 sitemap.xml：后者是 sitemapindex，里面是
  // sitemap 自身的地址，提交它们等于让 IndexNow 去抓两个 xml 文件。
  const sitemap = resolve(ROOT, 'dist/landing-sitemap.xml');
  if (!existsSync(sitemap)) {
    throw new Error('dist/landing-sitemap.xml 不存在 —— 先跑 pnpm build');
  }
  return [...readFileSync(sitemap, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const key = readKey();
const urlList = readUrls();
if (urlList.length === 0) throw new Error('sitemap 里没有 <loc>，不提交空列表');
if (urlList.length > 10_000) throw new Error(`一次最多 10,000 条，当前 ${urlList.length} 条，需要分批`);

// host 取自第一条 URL，避免再手写一遍域名和 URL 对不上
const host = new URL(urlList[0]).host;

console.log(`[indexnow] host=${host}  key=${key}  ${urlList.length} 条 URL`);
for (const u of urlList) console.log(`  ${u}`);

const res = await fetch(ENDPOINT, {
  method: 'POST',
  headers: { 'content-type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, urlList }),
});

const body = (await res.text()).trim();
console.log(`\n[indexnow] HTTP ${res.status} ${res.statusText} — ${MEANING[res.status] ?? '未文档化的状态码'}`);
if (body) console.log(`[indexnow] 响应体：${body}`);

if (![200, 202].includes(res.status)) process.exit(1);
