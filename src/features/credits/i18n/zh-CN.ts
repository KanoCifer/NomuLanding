export default {
  credits: {
    meta: {
      title: '积分说明',
      description:
        'Nomu 的 AI 功能使用积分：通用翻译、AI 提示词优化、AI 商品解析、知识库问答与 AI 生图各消耗多少积分，积分怎么扣，采集与发布不消耗积分。',
    },
    eyebrow: '积分',
    title: '一次 AI 操作，消耗多少积分。',
    subtitle:
      '只有 AI 功能消耗积分，采集、编辑、发布主流程不消耗。下面按功能列出每次操作的积分消耗；余额和每一笔消耗，扩展内「账户」里都能查到。',
    unitFen: '分',
    back: '返回首页',
    updatedAt: '规则如有调整，会在这页和更新日志同步。',
    table: {
      title: '各功能的积分消耗',
      feature: '功能',
      unit: '每次操作',
      amount: '消耗积分',
      caption: '积分余额与流水都在扩展内「账户」里查看，扣了多少、为什么扣，逐条都有记录。',
      loading: '正在读取积分消耗表…',
      failed: '暂时读不到积分消耗表，请稍后刷新或到扩展内「账户」查看。',
    },
    units: {
      perCall: '每次调用',
      perKToken: '每 1K tokens',
      perImage: '每张图',
    },
    items: {
      translate: {
        name: '通用翻译',
        desc: '商品信息中译英 / 中译阿',
      },
      promptOptimize: {
        name: 'AI 提示词优化',
        desc: '把一句话扩成可用的生图、上架提示词',
      },
      productParse: {
        name: 'AI 商品解析',
        desc: '右键「用 AI 解析」从任意源页解析商品',
      },
      knowledgeAsk: {
        name: '知识库问答',
        desc: '扩展内 AI 助手，上架规则随问随答（按 token 向上取整）',
      },
      designLite: {
        name: 'AI 生图 · 标准档',
        desc: 'Seedream 5.0 / GPT-Image 2 系列',
      },
      designPro: {
        name: 'AI 生图 · 高清档',
        desc: 'Seedream 5.0 Pro，画质优先',
      },
    },
    rulesTitle: '积分怎么扣',
    rules: {
      preconsume: {
        title: '先预扣，多退少补',
        body: '生图这类任务开始时按张数预扣积分，任务结束后按实际张数核对，多扣的部分自动退回。',
      },
      idempotent: {
        title: '重复请求不重复扣',
        body: '每次调用都带唯一幂等键，网络重试或重复点击只会扣一次。',
      },
      insufficient: {
        title: '积分用完直接拦下',
        body: '积分不够时请求会被当场拒绝，余额不会扣成负数；补充积分后立即恢复。',
      },
      records: {
        title: '每一笔都有明细',
        body: '扩展内「账户 · 消费记录」可逐条查看来源、消耗与时间，退回的积分也会单独列出。',
      },
    },
  },
} as const;
