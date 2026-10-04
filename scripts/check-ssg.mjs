/**
 * 预渲染产物自检 —— SSG 最贵的失败模式是「构建绿了，爬虫看到的还是空 div」，
 * 那种错不会在 CI 里报错，只会让收录一直没动静。所以每条预渲染路由都必须验：
 * 1. index.html 真的产出了（nested 目录索引）
 * 2. HTML 里有正文（h1），不是空壳
 * 3. sitemap 在，且列出的 URL 都有对应产物
 *
 * 不引测试框架，跑法就是 `node scripts/check-ssg.mjs`（已挂在 build 末尾）。
 */
import { readFileSync, existsSync, globSync } from 'node:fs';
import { resolve } from 'node:path';

const DIST = resolve(import.meta.dirname, '../dist');
const SITEMAP = resolve(DIST, 'sitemap.xml');
const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

const pages = globSync('**/index.html', { cwd: DIST });
const SITEMAP_HTML = existsSync(SITEMAP) ? readFileSync(SITEMAP, 'utf-8') : '';
const locs = [...SITEMAP_HTML.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

check(pages.length > 0, `dist/ 下没有任何 index.html，SSG 没跑起来（找到 ${pages.length} 个）`);

for (const page of pages) {
  const html = readFileSync(resolve(DIST, page), 'utf-8');
  check(/<h1[\s>]/i.test(html), `${page} 里没有 h1 —— 正文没渲染进 HTML，爬虫看到的还是空 div`);
  check(!/<div id="app"><\/div>/i.test(html), `${page} 的 #app 是空的 —— 预渲染没把内容塞进去`);
}

check(existsSync(SITEMAP), 'dist/sitemap.xml 不存在');
check(locs.length > 0, 'dist/sitemap.xml 里没有 <loc>');

for (const loc of locs) {
  const { pathname } = new URL(loc);
  const file = pathname === '/' ? 'index.html' : `${pathname.replace(/^\/|\/$/g, '')}/index.html`;
  check(existsSync(resolve(DIST, file)), `sitemap 里的 ${pathname} 在 dist 里没有对应产物`);
}

if (failures.length > 0) {
  console.error(`\n[vite-ssg 自检] ${failures.length} 项不通过：`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log(`[vite-ssg 自检] 通过：${pages.length} 个预渲染页面 + sitemap ${locs.length} 条 URL`);
