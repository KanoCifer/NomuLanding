import { createRouter, createWebHistory } from 'vue-router';
import { reportVisitorData } from '@/lib/reportVisitor';

// 防抖计时器（模块级，不挂 window）
let reportTimer: ReturnType<typeof setTimeout> | undefined;

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
  ],
  scrollBehavior(to) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' };
    return { top: 0 };
  },
});

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

export default router;
