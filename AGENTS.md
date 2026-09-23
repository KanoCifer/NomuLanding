# Nomu Landing

Nomu Chrome 扩展的对外落地页 SPA,Vue 3 + Vite + Tailwind v4,线上 `https://nomu.kanocifer.chat`。

## 起点

- 包管理 `pnpm`;脚本 `dev / build / preview / typecheck / lint / format` 在 `package.json`
- 别名 `@` → `src/`(`vite.config.ts`)
- 格式/lint:oxfmt + oxlint,配置 `.oxfmtrc.json` / `.oxlintrc.json`
- **ReadingList 父项目的规则优先**:`~/Code/ReadingList/AGENTS.md`(尤其是「Tailwind 不要硬编码颜色」「用户没确认不跑 `pnpm build`」)与 `~/Code/ReadingList/docs/rules/code-style.md` 优先于本文,改样式或打包前先回那里看

## 写作与同步

**事实以 NoonToolv1 为准**。`src/locales/*.ts` 的 `noonTool.*` 描述的功能、能力、数字,凡涉及 Nomu 本体的,只能来源 `/Users/liudetao/Code/NoonToolv1` 的当前实现。**禁止虚构功能描述、性能数字、客户证言**。

**双语镜像**:`src/locales/zh-CN.ts` 与 `src/locales/en.ts` 同构,任何 `noonTool.<key>` 改动都要同步另一份。

**Footer 联动**:`src/features/landing/components/NoonToolFooter.vue` 里 `DOCS_URL` 拼出 NomuDocs(`~/Code/NomuDocs`)的 `/docs/`、`/docs/privacy/`、`/docs/guide/changelog`、`/docs/guide/support`。本站 footer 改了要去 NomuDocs 对应路由同步,反过来也成立。

## 路由

- `/` → `src/features/landing/LandingView.vue`(主落地页)
- `/nomu/login` → `src/features/login/NomuLoginView.vue`(无密码登录回调):读 `query.token`,调 `consumeNomuMagicLink` 转发到 `POST /v3/nomu/magic-login`,登录结果由 Nomu 扩展侧轮询拿走,**本页不写会话态**。完整契约写在 `~/Code/ReadingList/frontend/apps/vue-app/src/features/noontool/README.md`,改这一页必须同步更新那份 README
- `/register` → `src/features/register/RegisterView.vue`(Nomu 注册页):mode 强制 'nomu',调 `POST /v3/register` + `POST /v3/email/code`,落 `src/lib/nomuRegister.ts`,**不写会话态**
- `/forgot-password` → `src/features/forgot-password/ForgotPasswordView.vue`(Nomu 密码重置):单路由内步骤 1(邮箱)→ 步骤 2(验证码 + 新密码)切换,调 `POST /password/reset` + `POST /password/reset/confirm`(公开路由),mode 强制 'nomu',落 `src/lib/nomuPasswordReset.ts`,**不写会话态**。404「用户不存在」必须统一文案化成「验证码错误或邮箱未注册」防枚举

## 完成态

- 改文案或组件:`pnpm typecheck` 通过,`pnpm lint` 0 error
- 改路由或 footer:`pnpm build`,浏览器肉眼抽查新路径未 404
- 部署:`bash deploy.sh`(默认 rsync `dist/` 到 `kano@114.132.156.53:/home/kano/Nomu/Landing`);`SKIP_BUILD=1` 跳过 build,`DRY_RUN=1` 仅打印。**部署是线上行为,用户没确认不跑**
