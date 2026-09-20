export default {
  noonTool: {
    meta: {
      title: 'Nomu：一款易用的 Noon 插件',
      description:
        'Nomu 是一款 Chrome 浏览器扩展，帮你从 1688、淘宝/天猫、京东采集商品，自动整理标题、价格和图片，翻译成英文和阿拉伯语，再逐件发布到 Noon 阿联酋和沙特站。多店铺集中管理、任务面板、店铺间复制、AI 类目推荐均已内置；店铺设置默认保存在本地。',
      keywords: [
        'Nomu',
        '1688',
        '淘宝上架',
        '京东上架',
        'Noon 上架',
        'Noon UAE',
        'Noon Saudi',
        '浏览器扩展',
      ],
    },
    hero: {
      eyebrow: 'Nomu · Chrome 浏览器扩展',
      headline: '一款易用的',
      headlineTail: 'Noon Chrome 插件',
      subheadline:
        '还是熟悉的采购页面，还是你的 Noon 店铺。Nomu 加速采集、翻译、图片处理和逐件发布，方便你的运营工作。',
      ctaPrimary: '添加到 Chrome',
      ctaPrimaryHint: '跳转到 Chrome 网上应用商店，一键安装 Nomu',
      ctaSecondary: '看看Nomu能做什么',
      ctaDocs: '查看文档',
      localeZh: '中文',
      localeEn: 'EN',
      pipeline: {
        capture: '采集',
        translate: '翻译',
        image: '图片',
        category: '类目',
        publish: '发布',
      },
      screenshotAlt:
        'Nomu 宣传海报 —— 面向 Noon 卖家的工具。在 Noon 上管理、上架、跟踪、增长。',
      screenshotCaption: 'Nomu · 面向 Noon 卖家的工具 · 2026',
    },
    splash: {
      eyebrow: 'Nomu',
    },
    nav: {
      sections: {
        features: '功能',
        support: '支持',
        faq: '常见疑问',
      },
      docs: '文档',
    },
    features: {
      eyebrow: '功能',
      sectionTitle: '采集商品，剩下的交给插件。',
      sectionSubtitle: '翻译、图片生成、类目 AI 预测',
      poster: {
        alt: 'Nomu 宣传海报 —— 面向 Noon 卖家的工具。在 Noon 上管理、上架、跟踪、增长。',
        caption: 'Nomu · 面向 Noon 卖家的工具 · 2026',
      },
      chapter: '章节',
      pillars: {
        manage: {
          title: '商品管理',
          tagline:
            '把所有店铺、所有采集源、所有账号集中在一处 —— 让每一次上架都从已知状态开始。',
        },
        list: {
          title: '批量上架',
          tagline:
            '翻译、重做图片、重算价格、重选类目，一次批量搞定 —— 一百份草稿不必耗一百天。',
        },
        track: {
          title: '任务跟踪',
          tagline:
            '每一次发布、每一次复制都在同一面板里，耗时、失败、重试都看得见 —— 没有在暗处跑的事。',
        },
        insights: {
          title: '业绩洞察',
          tagline:
            '上架规则随便问，已经发出去的随时能导出 —— 让数据该离开浏览器时离开。',
        },
      },
      items: {
        pipeline: {
          title: '把源页商品发到 Noon',
          imageAlt: '采集到发布全流程的截图',
          body: '采集源页、加入待发布列表、提交上架、激活并登记质保，一次走完。',
        },
        multiAccount: {
          title: '店铺集中管理',
          imageAlt: '侧栏多店铺列表与切换的截图',
          body: '在同一个面板里管理多家 Noon 店铺，切换店铺时自动填好上架设置。',
        },
        translate: {
          title: '中译英 / 阿拉伯语 自动翻译',
          imageAlt: '翻译结果的截图',
          body: '标题、卖点与商品属性自动翻译，覆盖阿联酋与沙特两个站点。',
        },
        image: {
          title: '图片自动处理成可上架',
          imageAlt: '商品图按 660×900 规格处理的截图',
          body: '商品图自动调整为 Noon 要求的尺寸和白底。规格不符的图片也能处理到位，不会让上架被卡。',
        },
        serial: {
          title: '逐件发布，出错即停',
          imageAlt: '逐件独立发布的商品截图',
          body: '每件商品独立发布。第一件失败就停止整个批次，不会留下一半上架、一半漏发的乱摊子。',
        },
        category: {
          title: '自动推荐 Noon 类目',
          imageAlt: '自动推荐的 Noon 类目截图',
          body: '根据源页信息自动推荐 Noon 类目，不用手动挑选。',
        },
        sources: {
          title: '采集源不止 1688',
          imageAlt: '从不同源站采集商品的截图',
          body: '1688、淘宝/天猫、京东商品页可直接采集，noon.com 商品页也能作为源；其它站点可按需临时采集，不用等新版本。',
        },
        tasks: {
          title: '任务面板盯全程',
          imageAlt: '任务面板列出上架与复制任务的截图',
          body: '上架与复制任务集中在一个面板：进度、每一步耗时、失败原因都在行内展开，失败的可以单独重试。',
        },
        duplicate: {
          title: '跨设备复制商品',
          imageAlt: '把已有商品复制到另一台设备的截图',
          body: '把已上架商品复制到同账号的另一台设备上继续上架，Partner SKU、条码和品牌可批量改写；复制走独立队列，不占上架通道。本机复制直接落目标店铺，跨设备复制走云同步总线，对端上线即可领取。',
        },
        engine: {
          title: '并发与重试自己定',
          imageAlt: '任务引擎并发与重试设置截图',
          body: '上架与复制各自配置并发数和失败自动重试上限，默认保守；改完立即生效，不用重启浏览器。',
        },
        price: {
          title: '人民币价格自动换算',
          imageAlt: '汇率换算后填入价格的截图',
          body: '源页价格按实时汇率换算成店铺币种，填入时同时保留人民币对照，报价不用再切计算器。',
        },
        export: {
          title: '商品表可导出',
          imageAlt: '导出 SKU 到表格的截图',
          body: '待发布清单可导出成 Excel 表格，用来对账或交给同事，不必在网页上一条条抄。',
        },
        account: {
          title: '免密码登录',
          imageAlt: '邮箱魔法链接登录界面截图',
          body: '用邮箱收一封登录链接即可，不用记密码；登录态跟着账号走，换台电脑不用重新配置店铺。',
        },
        cloudPool: {
          title: '采集结果多设备流转',
          imageAlt: '云端共享池里领取采集结果的截图',
          body: '采集好的商品可以推到云端池，同账号的其它设备实时可见，一键领取到本地继续上架。',
        },
        sync: {
          title: '配置多机同步',
          imageAlt: '上传与下载云端配置的截图',
          body: '店铺配置可以上传到云端、在另一台电脑上拉回来，换设备不用把设置再填一遍。',
        },
        assistant: {
          title: 'AI 助手与右键解析',
          imageAlt: '在页面上向 AI 助手提问的截图',
          body: '上架规则可以直接问内置的 AI 助手；遇到没适配的页面，右键「用 AI 解析」就能把商品信息转成草稿。',
        },
      },
      placeholder: {
        caption: '截图待补',
      },
    },
    audience: {
      motto:
        '为在 1688 / 淘宝 / 京东采购、在 Noon 阿联酋和沙特站上架的卖家而做',
    },
    privacyPermissions: {
      eyebrow: '隐私 & 权限',
      sectionTitle: '你的数据，有清楚的去向。',
      sectionSubtitle: '你的数据保存在本地，商品数据来自Noon',
      cols: {
        yours: {
          name: '你的设备',
          chip: '本地',
          tagline: '保存在浏览器里，你不动手就不会上传。',
        },
        noon: {
          name: 'Noon',
          chip: '发出',
          tagline: '只在你点击发布商品时才会发出。',
        },
        nowhere: {
          name: 'Nowhere',
          chip: '不看',
          tagline: '设计上就排除，扩展永远不接收。',
        },
      },
      items: {
        storeSettings: {
          name: '店铺设置',
          detail: '国家、合作方代码、仓库、数量、质保、品牌。',
        },
        storeRecords: {
          name: '店铺记录与当前店铺',
          detail: '记录所有店铺与正在使用的那一家。',
        },
        batches: {
          name: '批次、草稿、历史',
          detail: '保存在本地，浏览器重启后可继续。',
        },
        storage: {
          name: '本地存储权限',
          detail: '把店铺记录、设置与批次草稿保存在浏览器里。',
        },
        alarms: {
          name: '定时任务权限',
          detail: '定时扫描待处理的上架与复制任务，可自动续跑。',
        },
        productDetails: {
          name: '商品信息',
          detail: '标题、描述、属性、价格、库存，仅在发布时发出。',
        },
        productImages: {
          name: '商品图片',
          detail: '已重新裁切、去背景，处理到合规规格。',
        },
        warranty: {
          name: '质保与复制请求',
          detail: '在你点击「发布」时提交给 Noon。',
        },
        activeTab: {
          name: '当前标签页权限',
          detail: '只在你点击扩展时读取该页面。',
        },
        scripting: {
          name: '脚本注入权限',
          detail: '把采集界面注入到匹配的站点页面里。',
        },
        password: {
          name: 'Noon 账号密码',
          detail: '你直接登录 Noon，扩展看不到密码。',
        },
        analytics: {
          name: '埋点与统计',
          detail: '没有追踪像素、事件上报或埋点。',
        },
        browsingHistory: {
          name: '浏览历史',
          detail: 'Cookie 只在匹配的站点、点击时才读取。',
        },
        notifications: {
          name: '通知（默认关闭）',
          detail: '只有你主动开启批次完成提醒时才会启用。',
        },
        contextMenus: {
          name: '右键菜单（默认关闭）',
          detail: '只有你主动启用后，才会出现右键入口。',
        },
      },
      permissionsStrip: {
        title: '权限一览',
        subtitle: '共 6 项',
        perms: {
          storage: {
            label: '本地存储',
            detail: '在本地保存店铺记录与设置。',
          },
          alarms: {
            label: '定时任务',
            detail: '浏览器重启后继续执行待处理任务。',
          },
          notifications: {
            label: '通知',
            detail: '批次完成或失败时提醒你。',
          },
          activeTab: {
            label: '当前标签页',
            detail: '只在你点击扩展时读取当前页面。',
          },
          scripting: {
            label: '脚本注入',
            detail: '在匹配的站点页面注入采集界面。',
          },
          contextMenus: {
            label: '右键菜单',
            detail: '类似「用 AI 解析」的右键入口。',
          },
        },
      },
      hosts: {
        noonPartners: 'Noon 合作伙伴后台',
        noonCdn: 'Noon 图片CDN服务',
        alicdn: '1688 / 淘宝图片CDN服务',
        jdimg: '京东图片CDN服务',
        backend: '工具自有服务',
      },
      hostsTitle: 'Nomu请求的Hosts',
    },
    faq: {
      sectionTitle: '常见疑问',
      items: {
        free: {
          q: 'Nomu 是免费的吗？',
          a: '工具部分功能免费使用。设置与登录信息都留在你自己的浏览器里。',
        },
        apiKey: {
          q: '我需要提供任何密钥或登录授权吗？',
          a: '不需要。Nomu 通过你已登录的 Noon 会话直接操作，你完全不用输入密码或密钥。',
        },
        regions: {
          q: '紫鸟浏览器怎么安装？',
          a: '紫鸟浏览器暂未上架，请自行同步或联系我获取支持。',
        },
        sources: {
          q: '除了 1688 还支持其它源吗？',
          a: '支持 1688、淘宝/天猫、京东的商品页，noon.com 商品页也能作为源；其它站点可以用右键「用 AI 解析」临时采集。',
        },
        data: {
          q: '我的数据存放在哪里？',
          a: '店铺配置、批次草稿和任务记录默认都存在本地浏览器。只有你主动使用云端共享池、配置同步或导出功能时，相关数据才会经扩展自带服务中转；这些功能都不需要也能正常上架。',
        },
        ai: {
          q: 'AI 功能要另外付费吗？',
          a: 'AI 助手、类目推荐和右键解析需要登录 Nomu 账户，按积分计费；采集、上架等主流程不需要登录。',
        },
        translation: {
          q: '翻译质量如何？是否需要二次校对？',
          a: '翻译自动完成（中译英 / 阿）。贵重或品牌商品建议发布前抽检一下，自动翻译不保证母语水平。',
        },
        failure: {
          q: '上架失败的商品会怎样？',
          a: '批量发布中第一件失败即停止；失败的商品会在列表中标出，可单独重试或手动修改后再发布。',
        },
      },
    },
    support: {
      eyebrow: '支持',
      sectionTitle: '遇到问题？',
      sectionSubtitle:
        '安装、采集、发布任何一步遇到问题，或者想提功能建议，都可以联系。',
      viewQr: '查看微信二维码',
      channels: {
        wechat: {
          title: '微信（推荐）',
          body: '扫码添加好友，备注「Nomu」。日常使用问题、功能建议都在这里聊。',
        },
        docs: {
          title: '先问助手，再查文档',
          body: '上架规则、字段要求可以直接问扩展内的 AI 助手；安装、更新与常见问题见文档站 nomu.kanocifer.chat/docs',
        },
      },
    },
    finalCta: {
      title: '让上架变得更简单',
      body: '采集、翻译、建图、发布、复制、盯任务。',
      button: '添加到 Chrome',
      hint: '在 Chrome 网上应用商店一键安装 Nomu',
    },
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
    footer: {
      tagline: 'Nomu：一款易用的 Noon 插件',
      links: {
        privacy: '隐私',
        changelog: '更新日志',
        support: '获取支持',
        docs: '文档',
      },
      license: '保留所有权利',
    },
  },
} as const;
