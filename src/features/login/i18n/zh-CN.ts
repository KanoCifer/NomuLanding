export default {
  login: {
    /* 与 ReadingList 的 noonTool.nomuLogin 文案保持一致 */
    headlinePending: '欢迎回来',
    headlineSuccess: '登录已同步',
    headlineError: '无法继续',
    sublinePending: '正在和 Nomu 服务确认这次登录…',
    sublineSuccess: '现在可以回到 Nomu 扩展继续你的工作。',
    sublineFallbackError: 'Nomu 没有在有效时间内确认这个链接，可能已过期。',
    missingTokenError: '缺少 token，链接无效。',
    closePage: '关闭此页',
    retry: '再试一次',
  },
} as const;
