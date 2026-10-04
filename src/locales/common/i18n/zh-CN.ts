export default {
  common: {
    nav: {
      sections: {
        features: '功能',
        support: '支持',
        faq: '常见疑问',
      },
      docs: '文档',
      install: 'Add to Chrome',
      credits: '积分',
      announcements: '公告',
      register: '注册',
      forgotPassword: '忘记密码',
      menu: '菜单',
      menuOpen: '打开菜单',
      menuClose: '关闭菜单',
    },
    share: {
      label: '分享',
      copied: '链接已复制',
    },
    /* 注册页与忘记密码页共用的法务提示，两处文案必须一致，故归共享层 */
    bottomHint: '注册即代表你同意 Nomu 的{terms}与{privacy}。',
    terms: '用户协议',
    privacy: '隐私政策',
  },
} as const;
