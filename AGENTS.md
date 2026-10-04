# Nomu Landing

Nomu Chrome 扩展的对外落地页,Vue 3 + Vite + Tailwind v4 + **vite-ssg 预渲染**,线上 `https://nomu.kanocifer.chat`。

## 起点

- 包管理 `pnpm`;脚本 `dev / build / preview / typecheck / lint / format` 在 `package.json`
- 别名 `@` → `src/`(`vite.config.ts`)
- 格式/lint:oxfmt + oxlint,配置 `.oxfmtrc.json` / `.oxlintrc.json`
- **ReadingList 父项目的规则优先**:`~/Code/ReadingList/AGENTS.md`(尤其是「Tailwind 不要硬编码颜色」「用户没确认不跑 `pnpm build`」)与 `~/Code/ReadingList/docs/rules/code-style.md` 优先于本文,改样式或打包前先回那里看

## 写作与同步

**事实以 NoonToolv1 为准**。`src/locales/*.ts` 的 `noonTool.*` 描述的功能、能力、数字,凡涉及 Nomu 本体的,只能来源 `/Users/liudetao/Code/NoonToolv1` 的当前实现。**禁止虚构功能描述、性能数字、客户证言**。

**双语镜像**:`src/locales/zh-CN.ts` 与 `src/locales/en.ts` 同构,任何 `noonTool.<key>` 改动都要同步另一份。

**Footer 联动**:`src/features/landing/components/NoonToolFooter.vue` 里 `DOCS_URL` 拼出 NomuDocs(`~/Code/NomuDocs`)的 `/docs/`、`/docs/privacy/`、`/docs/guide/changelog`、`/docs/guide/support`。本站 footer 改了要去 NomuDocs 对应路由同步,反过来也成立。

## 预渲染(SSG)

`/announcements` `/credits` `/prototype`(别名 /credits)之外的落地页正文**不是**运行时渲染的:`pnpm build` 走 `vite-ssg build`,在 Node 里逐条路由渲染出 `dist/<path>/index.html`(`dirStyle: 'nested'`),爬虫拿到的是成品 HTML。

- 入口是 `src/main.ts` 的 `ViteSSG(App, { routes, base, scrollBehavior }, setup)`,**只导出 `createApp`,不能自己 mount**。`dev`(`vite`)和生产构建共用这个文件,浏览器里自动 mount,Node 里被构建步骤调。
- 路由表在 `src/router/routes.ts`(只导出表 + 滚动行为,router 实例由 ViteSSG 造 —— 旧的 `src/router/index.ts` 已删)。**dev、预渲染、客户端三方共用这一张表**。
- 增删预渲染页面只改 `vite.config.ts` 的 `PRERENDER_ROUTES`:sitemap 由同一个数组生成(`sitemapPlugin`),`scripts/check-ssg.mjs` 按产物反向校验,漏改会在 build 里直接失败。
- 页面级 head 用 **`@unhead/vue` v2**(不是 `@vueuse/head`,后者是 unhead v1,SSR 抓不到)。函数式 `useHead({ title: () => ..., meta: () => [...] })` 客户端和 SSR 都成立。
- **canonical / hreflang 不能写在 `index.html` 里**:那份模板会被复制到每个预渲染页面,等于告诉搜索引擎「公告页的规范版本是首页」。它们随页面走,在各 view 的 `useHead.link` 里。
- 内容来自接口的页面(`/announcements`、`/credits`)用 `onServerPrefetch` 在构建期取数,否则烤进 HTML 的只有「加载中」。客户端 `onMounted` 照常再拉一次保证新鲜 —— **构建机需要能连上 `api.kanocifer.chat`**,接口挂了会烤出空态(页面自身有兜底,不会崩)。
- SSR 阶段没有 `document` / `window` / `localStorage`。碰浏览器 API 的代码要么放进 `onMounted`(SSR 不执行),要么显式守卫 —— `src/components/Modal.vue` 那个 `immediate: true` 的 watch 就是现成的例子。
- **语言**:`SSG` 一次只烤得出中文这一份 HTML,i18n 固定 `locale: 'zh-CN'` 起;用户实际语言由 `src/App.vue` 在 `onMounted` 后切。首帧必须跟着水合产物走,否则英文用户拿英文首帧去水合中文 HTML,Vue 判定不匹配会整块重渲染,SSG 收益归零。代价是英文用户会看到一瞬中文。

## 路由

- `/` → `src/features/landing/LandingView.vue`(主落地页)
- `/nomu/login` → `src/features/login/NomuLoginView.vue`(无密码登录回调):读 `query.token`,调 `consumeNomuMagicLink` 转发到 `POST /v3/nomu/magic-login`,登录结果由 Nomu 扩展侧轮询拿走,**本页不写会话态**。完整契约写在 `~/Code/ReadingList/frontend/apps/vue-app/src/features/noontool/README.md`,改这一页必须同步更新那份 README
- `/register` → `src/features/register/RegisterView.vue`(Nomu 注册页):mode 强制 'nomu',调 `POST /v3/register` + `POST /v3/email/code`,落 `src/lib/nomuRegister.ts`,**不写会话态**
- `/forgot-password` → `src/features/forgot-password/ForgotPasswordView.vue`(Nomu 密码重置):单路由内步骤 1(邮箱)→ 步骤 2(验证码 + 新密码)切换,调 `POST /password/reset` + `POST /password/reset/confirm`(公开路由),mode 强制 'nomu',落 `src/lib/nomuPasswordReset.ts`,**不写会话态**。404「用户不存在」必须统一文案化成「验证码错误或邮箱未注册」防枚举
- `/prototype`(别名 `/credits`)→ `src/features/credits/CreditsView.vue`:各 AI 功能消耗多少积分、积分怎么扣。**数字不硬编码**,由 `src/lib/creditPrices.ts` 拉 Server-Go 公开接口 `GET /v3/credits/prices`(credit_price 表的镜像,无鉴权)——调价在后端改表,这页自动跟着变。`CreditsView.vue` 里的 `PRESET` 只决定**展示哪几行 + 每行叫什么**(文案),不含任何金额。刻意不谈钱:**不出现人民币、单价、计费、付费等字眼**,也不标注等值货币。该页不用 `NoonToolNav`(那条导航的锚点指向首页分栏,在本页会落空),自己拼 header

## 完成态

- 改文案或组件:`pnpm typecheck` 通过,`pnpm lint` 0 error
- 改路由或 footer:`pnpm build`(末尾自动跑 `scripts/check-ssg.mjs` 校验预渲染产物),浏览器肉眼抽查新路径未 404
- 部署:`bash deploy.sh`(默认 rsync `dist/` 到 `kano@114.132.156.53:/home/kano/Nomu/Landing`);`SKIP_BUILD=1` 跳过 build,`DRY_RUN=1` 仅打印。**部署是线上行为,用户没确认不跑**
- 线上 nginx 片段在 `deploy/nginx-nomu.conf`,**用户自己上服务器合**,合完必须让不存在的路径真 404,否则 SSG 白做
