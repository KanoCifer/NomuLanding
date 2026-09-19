# Nomu Landing

Nomu(Chrome 扩展)的对外落地页站点。

技术栈:Vue 3 + Vite + Tailwind v4。

## 开发

```bash
pnpm install
pnpm dev      # 本地开发
pnpm build    # 生产构建
pnpm preview  # 预览构建产物
```

## 环境变量

复制 `.env.example` 为 `.env` 并按需修改:

```
VITE_API_BASE=https://api.kanocifer.chat
```

`VITE_API_BASE` 为公开的 API base,用于访客埋点上报。
