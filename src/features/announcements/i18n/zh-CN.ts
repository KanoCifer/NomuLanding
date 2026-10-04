export default {
  announcements: {
    meta: {
      title: '公告',
      description: 'Nomu 的功能更新、版本变化、维护停机与安全公告，按时间倒序集中查看。',
    },
    eyebrow: '公告',
    title: 'Nomu 的公告',
    subheadline:
      '新功能上线、版本更新、维护停机和安全公告都发在这里。按类别分组，时间新的在前；扩展内的总览台也会同步显示需要留意的几条。',
    loading: '正在读取公告…',
    loadFailed: '暂时读不到公告，稍后再来看看。',
    empty: '暂时没有公告。',
    /** 键名与后端 API 的 type 取值一致，不另造枚举。 */
    types: {
      general: '通知',
      feature: '新功能',
      update: '更新',
      maintenance: '维护',
      security: '安全',
      credit: '积分',
    },
  },
} as const;
