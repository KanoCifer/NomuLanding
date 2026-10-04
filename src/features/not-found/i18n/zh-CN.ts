export default {
  notFound: {
    meta: {
      title: '没找到这页 · Nomu',
      description: 'Nomu 落地页 · 你访问的页面不在这里。',
    },
    quiet: {
      eyebrow: '404',
      title: '没找到这页',
      body: '也许是链接拼错了，或者页面已经搬走。',
      cta: '回到首页',
      ctaHint: '返回 Nomu 落地页',
      docsLabel: '查看文档',
      supportLabel: '获取支持',
    },
    spatial: {
      eyebrow: '404 · 标签飘走了',
      title: '这页不在这儿',
      body: '点击本来要打开的标签页已经离开这片屏幕，回到首页或去文档站都行。',
      cta: '回到首页',
      ctaHint: '返回 Nomu 落地页',
      docsLabel: '查看文档',
      supportLabel: '获取支持',
    },
    editorial: {
      eyebrow: '404',
      title: '没找到的，也可能是商品图没贴上。',
      body: '链接失效的可能性大于 0。回到首页、装上 Nomu 或翻翻文档都行。',
      cta: '回到首页',
      ctaHint: '返回 Nomu 落地页',
      docsLabel: '查看文档',
      supportLabel: '获取支持',
    },
  },
} as const;
