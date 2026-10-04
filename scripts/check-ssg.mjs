/**
 * 预渲染产物自检 —— SSG 最贵的失败模式是「构建绿了，爬虫看到的还是空 div」，
 * 那种错不会在 CI 里报错，只会让收录一直没动静。所以每条预渲染路由都必须验：
 * 1. index.html 真的产出了（nested 目录索引）
 * 2. HTML 里有正文（h1），不是空壳
 * 3. sitemap index 挂上了落地页与文档站两份子 sitemap
 * 4. 落地页子 sitemap 列出的 URL 都有对应产物
 *
 * 不引测试框架，跑法就是 `node scripts/check-ssg.mjs`（已挂在 build 末尾）。
 */
import { readFileSync, existsSync, globSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../dist');
const INDEX_SITEMAP = resolve(DIST, 'sitemap.xml');
const LANDING_SITEMAP = resolve(DIST, 'landing-sitemap.xml');
const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

function locsOf(file) {
  return existsSync(file) ? [...readFileSync(file, 'utf-8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]) : [];
}

const pages = globSync('**/index.html', { cwd: DIST });
const childSitemaps = locsOf(INDEX_SITEMAP);
const pageUrls = locsOf(LANDING_SITEMAP);

check(pages.length > 0, `dist/ 下没有任何 index.html，SSG 没跑起来（找到 ${pages.length} 个）`);

for (const page of pages) {
  const html = readFileSync(resolve(DIST, page), 'utf-8');
  check(/<h1[\s>]/i.test(html), `${page} 里没有 h1 —— 正文没渲染进 HTML，爬虫看到的还是空 div`);
  check(!/<div id="app"><\/div>/i.test(html), `${page} 的 #app 是空的 —— 预渲染没把内容塞进去`);
}

check(existsSync(INDEX_SITEMAP), 'dist/sitemap.xml 不存在');
check(existsSync(LANDING_SITEMAP), 'dist/landing-sitemap.xml 不存在');
check(childSitemaps.length > 0, 'dist/sitemap.xml 里没有 <loc>，它得是 sitemapindex');
check(
  childSitemaps.some((loc) => loc.endsWith('/landing-sitemap.xml')),
  'sitemap index 里没有挂 /landing-sitemap.xml',
);
check(
  childSitemaps.some((loc) => loc.endsWith('/docs/sitemap.xml')),
  'sitemap index 里没有挂 /docs/sitemap.xml —— 文档站不在索引里，等于没被收录',
);
check(pageUrls.length > 0, 'dist/landing-sitemap.xml 里没有 <loc>');

for (const loc of pageUrls) {
  const { pathname } = new URL(loc);
  const file = pathname === '/' ? 'index.html' : `${pathname.replace(/^\/|\/$/g, '')}/index.html`;
  check(existsSync(resolve(DIST, file)), `landing-sitemap 里的 ${pathname} 在 dist 里没有对应产物`);
}

if (failures.length > 0) {
  console.error(`\n[vite-ssg 自检] ${failures.length} 项不通过：`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log(
  `[vite-ssg 自检] 通过：${pages.length} 个预渲染页面 + sitemap index ${childSitemaps.length} 份子 sitemap + ${pageUrls.length} 条落地页 URL`,
);
