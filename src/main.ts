import { createI18n } from 'vue-i18n';
import { ViteSSG } from 'vite-ssg';
import { reportVisitorData } from '@/lib/reportVisitor';
import { messages } from '@/locales';
import { routes, scrollBehavior } from '@/router/routes';
import App from './App.vue';
import './styles/tailwind.css';
import './styles/theme.css';

/**
 * ViteSSG 入口。dev（vite）和生产构建（vite-ssg build）共用这一个文件：
 * vite-ssg 返回的 createApp 在浏览器里自动 mount，在 Node 里被构建步骤调用，
 * 逐条路由渲染出静态 HTML。所以这里只能导出 createApp，不能自己 mount。
 *
 * 语言是唯一要小心的点：SSG 一次只能烤出一份 HTML，这里固定烤中文。
 * 用户实际语言（localStorage / navigator）改由 App.vue 在水合完成后切，
 * 否则英文用户会拿英文首帧去水合中文 HTML，Vue 直接判定不匹配整块重渲染，
 * SSG 攒下的首屏全白费。
 */
export const createApp = ViteSSG(App, { routes, base: import.meta.env.BASE_URL, scrollBehavior }, ({ app, router }) => {
  app.use(createI18n({ legacy: false, locale: 'zh-CN', fallbackLocale: 'en', messages }));

  // 访客上报与滚动复位都碰 window，只在浏览器里挂。
  // SSG 渲染时跳过，否则每次构建都会朝 /v3/track 打一串假流量。
  if (!import.meta.env.SSR) {
    let reportTimer: ReturnType<typeof setTimeout> | undefined;

    router.afterEach((to, from) => {
      // 锚点跳转（带 hash）由 scrollBehavior 接管，复位反而会把它打飞到顶部
      if (to.path !== from.path && !to.hash) {
        window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      }

      // 防抖：避免短时间内多次跳转重复上报
      clearTimeout(reportTimer);
      reportTimer = setTimeout(() => {
        reportVisitorData();
      }, 500);
    });
  }
});
