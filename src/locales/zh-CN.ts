export default {
  noonTool: {
    meta: {
      title: 'Nomu：一款易用的 Noon 插件',
      description:
        'Nomu 是一款 Chrome 浏览器扩展，帮你从 1688、淘宝/天猫、京东采集商品，自动整理标题、价格和图片，翻译成英文和阿拉伯语，再逐件发布到 Noon 阿联酋和沙特站。多店铺集中管理、任务面板、店铺间复制、AI 类目推荐均已内置；注册一个免费账号即可登录使用，店铺设置默认保存在本地。',
      keywords: ['Nomu', '1688', '淘宝上架', '京东上架', 'Noon 上架', 'Noon UAE', 'Noon Saudi', '浏览器扩展'],
    },
    hero: {
      eyebrow: 'Nomu · Chrome 浏览器扩展',
      headline: '一款易用的',
      headlineTail: 'Noon Chrome 插件',
      subheadline:
        '还是熟悉的采购页面，还是你的 Noon 店铺。Nomu 加速采集、翻译、图片处理和逐件发布，方便你的运营工作。',
      ctaPrimary: '添加到 Chrome',
      ctaPrimaryHint: '跳转到 Chrome 网上应用商店一键安装，安装免费，用邮箱登录即可开始',
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
      screenshotAlt: 'Nomu 宣传海报 —— 面向 Noon 卖家的工具。在 Noon 上管理、上架、跟踪、增长。',
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
    features: {
      eyebrow: '功能',
      sectionTitle: '采集商品，剩下的交给插件。',
      sectionSubtitle: '翻译、AI 生图、类目预测、条码标签',
      poster: {
        alt: 'Nomu 宣传海报 —— 面向 Noon 卖家的工具。在 Noon 上管理、上架、跟踪、增长。',
        caption: 'Nomu · 面向 Noon 卖家的工具 · 2026',
      },
      chapter: '章节',
      pillars: {
        manage: {
          title: '商品管理',
          tagline: '把所有店铺、所有采集源、所有账号集中在一处 —— 让每一次上架都从已知状态开始。',
        },
        list: {
          title: '批量上架',
          tagline: '翻译、重做图片、重算价格、重选类目，一次批量搞定 —— 一百份草稿不必耗一百天。',
        },
        track: {
          title: '任务跟踪',
          tagline: '每一次发布、每一次复制都在同一面板里，耗时、失败、重试都看得见 —— 没有在暗处跑的事。',
        },
        insights: {
          title: '业绩洞察',
          tagline: '问题随时问，条码随手打，发出去的随时能导出 —— 该离开浏览器的数据，工具都给你备好了。',
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
        browse: {
          title: '目录浏览与快捷搜索',
          imageAlt: '侧栏浏览店铺商品目录与搜索浮层的截图',
          body: '侧栏直接浏览当前店铺的在售与隐藏商品，任意页面按 Ctrl/⌘ + Shift + S 唤起搜索浮层，跳详情、改在售状态都在浮层里完成。',
        },
        design: {
          title: 'AI 重做商品图',
          imageAlt: 'NomuDesign 画布生成商品图的截图',
          body: '独立画布 NomuDesign 跑商品图：提示词模板、AI 提示词优化、模型档位与历史回看都有，生成结果一键应用回商品图集。',
        },
        variants: {
          title: '归组发布，尺码一次提交',
          imageAlt: '归组与尺码变体设置界面的截图',
          body: '同品牌的多件商品可按尺码 / 型号 / 颜色归成一组发布；标准尺码直接在单商品表单里加变体，父品和子品一次提交，不用先建父品再回头补子品。',
        },
        barcode: {
          title: '条码标签随手打印',
          imageAlt: '条码标签生成与打印界面的截图',
          body: '给自己的 SKU 打标签，Code 128 / EAN-13 / UPC-A 都能选，单张或批量都行，直接打印或导出 SVG / PNG / ZPL 喂给标签打印机。手上要是一列 SKU，也可以直接在助手里说出来，一整批标签打包成 zip 下载。',
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
          body: '用一个邮箱收一封登录链接即可，不用记密码。登录后才能打开扩展的各个功能页；同一账号最多 5 台设备，换台电脑登录不用重新配置店铺。',
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
          title: 'Nomu 助手随时问',
          imageAlt: 'Nomu 助手流式回答的截图',
          body: '内置助手不只是查规则：问答和商品解析都逐字流式给回，扩展弹窗和操作菜单都能进；给它一列 SKU 就能批量生成条码标签打包下载；遇到没适配的页面，右键「用 AI 解析」也能把商品转成草稿。',
        },
      },
      placeholder: {
        caption: '截图待补',
      },
    },
    audience: {
      motto: '为在 1688 / 淘宝 / 京东采购、在 Noon 阿联酋和沙特站上架的卖家而做',
    },
    privacyPermissions: {
      eyebrow: '隐私 & 权限',
      sectionTitle: '你的数据，有清楚的去向。',
      sectionSubtitle: '店铺与草稿留在本地，账号与积分走 Nomu 服务，商品数据发往 Noon',
      cols: {
        yours: {
          name: '你的设备',
          chip: '本地',
          tagline: '保存在浏览器里，你不动手就不会上传。',
        },
        nomu: {
          name: 'Nomu 服务',
          chip: '经我们',
          tagline: '登录后必经：账号、积分与 AI 调用走这里，AI 内容再转交模型服务商。',
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
        nomuAccount: {
          name: '账号与令牌',
          detail: '邮箱、用户名，以及登录后用于鉴权的访问令牌与积分余额记录。',
        },
        nomuCloud: {
          name: '云端共享池',
          detail: '你主动推送的商品草稿，供你同账号下的其他设备领取。',
        },
        nomuAi: {
          name: 'AI 调用内容',
          detail: '翻译文本、生图提示词与助手提问，按次转交第三方模型服务商执行；账户令牌不外发。',
        },
        productDetails: {
          name: '商品信息',
          detail: '标题、描述、属性、价格、库存。发布时发给 Noon；用 AI 商品解析或提示词优化时，发给 Nomu 服务。',
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
          detail: '扩展内没有追踪像素或第三方分析脚本。',
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
          a: '扩展本体免费使用，不按功能收费。AI 翻译、生图与助手按积分计费；设置与登录信息都留在你自己的浏览器里。',
        },
        apiKey: {
          q: '我需要提供任何密钥或登录授权吗？',
          a: '不需要 Noon 的密码或密钥——Nomu 通过你已登录的 Noon 会话直接操作。但需要一个免费的 Nomu 账户：用邮箱收一封登录链接即可，不用记密码。',
        },
        whySignIn: {
          q: '为什么要登录？不能先不登录试试吗？',
          a: '扩展需要你登录：10 个功能页、工具弹窗和商品页上的采集抽屉都会先显示登录卡。你在淘宝、天猫、京东、1688 和 noon.com 上的商品页浏览不受影响，照常使用。注册免费，用邮箱收一封登录链接即可，不用记密码。',
        },
        regions: {
          q: '紫鸟浏览器怎么安装？',
          a: '紫鸟浏览器已支持，在紫鸟的插件中心搜索 Nomu 并安装即可。',
        },
        sources: {
          q: '除了 1688 还支持其它源吗？',
          a: '支持 1688、淘宝/天猫、京东的商品页，noon.com 商品页也能作为源；其它站点可以用右键「用 AI 解析」临时采集。',
        },
        data: {
          q: '我的数据存放在哪里？',
          a: '店铺配置、批次草稿和任务记录默认都存在本地浏览器。只有你主动使用云端共享池、配置同步或导出功能时，相关数据才会经扩展自带服务中转。',
        },
        ai: {
          q: 'AI 功能要另外付费吗？',
          a: '需要登录免费的 Nomu 账户才能使用扩展，AI 翻译、类目推荐、生图与右键解析另外按积分计费。',
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
    support: {
      eyebrow: '支持',
      sectionTitle: '遇到问题？',
      sectionSubtitle: '安装、采集、发布任何一步遇到问题，或者想提功能建议，都可以联系。',
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
      shareHint: '或分享给同事',
    },
    register: {
      meta: {
        title: '注册 Nomu 账号',
        description: '注册 Nomu 账号以使用扩展的全部功能，AI 助手与 AI 生图按积分计费。',
      },
      headline: '注册 Nomu 账号',
      subheadline: '注册后即可使用扩展内的采集、上架与 AI 助手等全部功能。',
      form: {
        username: '用户名',
        email: '邮箱',
        password: '密码',
        confirmPassword: '确认密码',
        emailCode: '邮箱验证码',
        sendCode: '发送验证码',
        sending: '发送中…',
        sent: '已发送',
        resendIn: '{n}s 后重发',
        submit: '注册',
        submitting: '注册中…',
      },
      errors: {
        usernameRequired: '请输入用户名',
        emailRequired: '请输入邮箱',
        emailInvalid: '邮箱格式不正确',
        passwordRequired: '请输入密码',
        confirmPasswordRequired: '请再次输入密码',
        passwordMismatch: '两次密码不一致',
        emailCodeRequired: '请输入邮箱验证码',
        sendCodeFailed: '发送验证码失败，请稍后再试',
        submitFailed: '注册失败，请稍后再试',
      },
      success: {
        title: '注册成功',
        body: '账号已就绪。现在装上 Nomu 扩展，登录后采集、上架、AI 助手、跨设备复制全部可用。',
        cta: '去安装 Nomu',
        back: '返回首页',
      },
      bottomHint: '注册即代表你同意 Nomu 的{terms}与{privacy}。',
      terms: '用户协议',
      privacy: '隐私政策',
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
    forgotPassword: {
      meta: {
        title: '重置 Nomu 账号密码',
        description: '通过邮箱验证码重置 Nomu 账号密码。',
      },
      headline: '重置密码',
      subheadline: '输入注册邮箱，我们会发送一封含 6 位验证码的重置邮件。',
      /* 步骤 1（申请邮件） */
      stepRequest: {
        email: '注册邮箱',
        submit: '发送重置邮件',
        submitting: '发送中…',
      },
      /* 步骤 1 成功：固定话术，避免泄露邮箱是否注册 */
      requestedHint: '若该邮箱已注册，重置邮件已发送。',
      requestedHintDetail: '请到邮箱抄 6 位验证码，回到这里继续。',
      /* 步骤 2（验证码 + 新密码） */
      stepConfirm: {
        emailLabel: '已发送到',
        changeEmail: '换个邮箱',
        emailCode: '邮箱验证码',
        newPassword: '新密码',
        confirmPassword: '确认新密码',
        submit: '重置密码',
        submitting: '重置中…',
      },
      errors: {
        emailRequired: '请输入邮箱',
        emailInvalid: '邮箱格式不正确',
        emailCodeRequired: '请输入 6 位验证码',
        newPasswordRequired: '请输入新密码',
        newPasswordTooShort: '密码至少 6 位',
        confirmPasswordRequired: '请再次输入新密码',
        passwordMismatch: '两次密码不一致',
        /* 步骤 2 错误：404 故意统一文案，防枚举 */
        invalidCodeOrEmail: '验证码错误或邮箱未注册',
        sessionExpired: '会话已过期，请重新申请验证码',
        passwordSameAsOld: '请换一个未使用过的密码',
        submitFailed: '重置失败，请稍后再试',
        networkError: '网络异常，请稍后再试',
      },
      success: {
        title: '密码已重置',
        body: '现在去安装 Nomu 扩展，下次用新密码登录，即可使用扩展的全部功能。',
        cta: '去安装 Nomu',
        back: '返回首页',
      },
    },
    footer: {
      tagline: 'Nomu：一款易用的 Noon 插件',
      links: {
        privacy: '隐私',
        terms: '用户协议',
        changelog: '更新日志',
        support: '获取支持',
        docs: '文档',
      },
      license: '保留所有权利',
    },
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
  },
} as const;
