import type { RouteRecordRaw, RouterScrollBehavior } from 'vue-router';

/**
 * 路由表是 dev、ViteSSG 预渲染、客户端三方共用的唯一来源。
 *
 * 以前路由和 router 实例焊在 `src/router/index.ts` 里，router 一旦创建就带着
 * 固定的 history 实现，Node 里没法复用。vite-ssg 预渲染时要自己建一份
 * memory history 的 router 逐路由渲染，所以这里只导出「表」和「滚动行为」，
 * 实例交给 ViteSSG 造。
 */

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/features/landing/LandingView.vue'),
  },
  {
    // Nomu 无密码登录回调页：邮件里点的回调地址落到这里，
    // 读取 query.token 转发给后端，扩展侧轮询取最终登录结果。
    // 路径与后端 magicLoginLinkPathFor("nomu") 拼出的链接对齐。
    path: '/nomu/login',
    name: 'nomu-login',
    component: () => import('@/features/login/NomuLoginView.vue'),
  },
  {
    // 注册页 — 把 vue-app packages/api 的 register / sendRegisterEmailCode
    // 端点（POST /v3/register、POST /v3/email/code）直接搬到落地页，mode 强制 'nomu'。
    // 落地页只承担 UI，会话态走 /nomu/login 的魔法链接，与本路由正交。
    path: '/register',
    name: 'register',
    component: () => import('@/features/register/RegisterView.vue'),
  },
  {
    // Nomu 密码重置页 — 公开路由 POST /password/reset / POST /password/reset/confirm，
    // mode 强制 'nomu'，落地页只承担 UI 不写会话态。
    // 步骤 1（邮箱）+ 步骤 2（验证码 + 新密码）在同一路由内部切换，详见 ForgotPasswordView 顶部注释。
    path: '/forgot-password',
    name: 'forgot-password',
    component: () => import('@/features/forgot-password/ForgotPasswordView.vue'),
  },
  // 积分说明 — 各 AI 功能消耗多少积分、怎么扣（数字镜像后端 creditPriceSeeds）。
  {
    path: '/credits',
    name: 'credits',
    component: () => import('@/features/credits/CreditsView.vue'),
  },
  // 公告归档 — 站点级通知，按 type 分组。数据源 GET /v3/announcements（公开，
  // 无鉴权：落地页没有会话态）。
  {
    path: '/announcements',
    name: 'announcements',
    component: () => import('@/features/announcements/AnnouncementsView.vue'),
  },
  {
    // 404 catch-all — 兜底未匹配的 URL，详见 features/not-found/NotFoundView.vue 顶部注释。
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/features/not-found/NotFoundView.vue'),
  },
];

export const scrollBehavior: RouterScrollBehavior = (to) => {
  if (to.hash) return { el: to.hash, behavior: 'smooth' };
  return { top: 0 };
};
