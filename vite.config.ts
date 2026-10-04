import { fileURLToPath, URL } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';

import { defineConfig, type Plugin } from 'vite';
import type { ViteSSGOptions } from 'vite-ssg';

// vite-ssg 28 自带 vite 配置的构建期读取，但不发布 `declare module 'vite'` 增补，
// 所以 ssgOptions 得自己挂到 UserConfig 上，否则 defineConfig 不认这个键。
declare module 'vite' {
  interface UserConfig {
    ssgOptions?: Partial<ViteSSGOptions>;
  }
}

const SITE_URL = 'https://nomu.kanocifer.chat';

/**
 * 要烤成静态 HTML 的路径。构建时逐条路由在 Node 里渲染，产出
 * dist/<path>/index.html（dirStyle: 'nested'），nginx 用
 * `try_files $uri $uri/ =404` 直接命中目录索引。
 *
 * 增删预渲染页面只改这一处：sitemap 由它生成，`scripts/check-ssg.mjs`
 * 按产物反向校验，所以漏改会直接在 build 里炸，不会静默漏收录。
 *
 * 不在这里的路径（/register、/forgot-password、/nomu/login）是有意留给 CSR 的
 * —— 它们要么依赖 query 参数，要么是交易页，静态化没有收益。
 */
const PRERENDER_ROUTES = ['/', '/announcements', '/credits'];

/**
 * 一个站点两个构建：落地页在本仓库，文档站是 NomuDocs（VitePress，自带
 * /docs/sitemap.xml）。搜索引擎要一份能覆盖两边的站点地图，标准做法是
 * **sitemap index**——把各子 sitemap 挂在一个 index 下面，而不是互相合并
 * （两边各自构建，合并就得复制一份别人的 URL 列表，必然漂移）。
 *
 *   /sitemap.xml            sitemapindex，robots.txt 只认这一个
 *     ├── /landing-sitemap.xml   本仓库产出，PRERENDER_ROUTES 逐条
 *     └── /docs/sitemap.xml      NomuDocs 产出，由它自己的构建维护
 *
 * index 里只放 sitemap 自身的 URL（页面的 URL 在子 sitemap 里），所以
 * scripts/indexnow.mjs 读的是 landing-sitemap.xml，不是 index。
 */
function sitemapPlugin(routes: string[]): Plugin {
  return {
    name: 'nomu-sitemap',
    apply: 'build',
    generateBundle() {
      const lastmod = new Date().toISOString().slice(0, 10);
      const urls = routes
        .map((route) => {
          // 不带尾斜杠：要和各页面 useHead 里的 canonical 完全一致，站内链接也是这个形式。
          // 两种写法 Google 视为不同 URL，sitemap 与 canonical 对不上的话等于自己跟自己打架。
          const loc = `${SITE_URL}${route === '/' ? '/' : route}`;
          return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
        })
        .join('\n');

      const children = [`${SITE_URL}/landing-sitemap.xml`, `${SITE_URL}/docs/sitemap.xml`];

      this.emitFile({
        type: 'asset',
        fileName: 'landing-sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
      });

      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source:
          `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
          children.map((loc) => `  <sitemap>\n    <loc>${loc}</loc>\n  </sitemap>`).join('\n') +
          `\n</sitemapindex>\n`,
      });
    },
  };
}

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [vue(), tailwindcss(), vueDevTools({ launchEditor: 'zed' }), sitemapPlugin(PRERENDER_ROUTES)],
  ssgOptions: {
    // nested → /announcements/index.html。flat 会产出 /announcements.html，
    // nginx 的 `$uri/` 目录索引匹配不到，静态资源也拿不到干净的路径。
    dirStyle: 'nested',
    includedRoutes: () => PRERENDER_ROUTES,
  },
});
