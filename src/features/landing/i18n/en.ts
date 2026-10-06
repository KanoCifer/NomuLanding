export default {
  landing: {
    meta: {
      title: 'Nomu: an easy-to-use Chrome extension for Noon',
      description:
        'Nomu is a Chrome extension that captures products from 1688, Taobao/Tmall and JD, translates the details (Chinese to English and Arabic), prepares images, and publishes each product to Noon UAE and Saudi. Multi-store management, a task panel, store-to-store duplication and AI category suggestions are built in; sign in with a free account, and store settings stay on your machine by default.',
      keywords: [
        'Nomu',
        '1688',
        'Taobao listing',
        'JD listing',
        'Noon listing',
        'Noon UAE',
        'Noon Saudi',
        'browser extension',
      ],
    },
    // 文档站内链的锚文本，取各文档页自己的标题（NomuDocs frontmatter 的 title），
    // 这样锚文本本身带信息量。key 与 docsLinks.ts 的 DOC_HREF 一一对应，改一处要改两处。
    docsLinks: {
      quickStart: 'Quick start',
      account: 'Account & AI credits',
      stores: 'Store management',
      catalogBrowse: 'Product catalog',
      quickSearch: 'Quick search',
      nomuDesign: 'NomuDesign image generation',
      nomuAssistant: 'Nomu Assistant',
      groupAndSizes: 'Group & sizes variants',
      tasks: 'Task panel',
      duplicate: 'Duplicate product',
      cloudPool: 'Cloud pool & transfer station',
      configSync: 'Cloud config sync',
      barcode: 'Barcode label printing',
      install: 'Install Nomu',
      features: 'Features overview',
      privacy: 'Privacy policy',
    },
    // 挂在功能卡 / FAQ 答案下面的链接前缀，后面接锚文本。写成参数是为了能接
    // 「在文档里看：快速上手」这种读得通的句子，而不是两个词硬拼。
    docsCta: 'Read the docs: ',
    hero: {
      eyebrow: 'Nomu · Chrome extension',
      headline: 'An easy-to-use',
      headlineTail: 'Noon Chrome extension',
      subheadline:
        "It's still the familiar purchasing page, still your Noon store. Nomu accelerates collection, translation, image processing and individual release, facilitating your operational work.",
      ctaPrimary: 'Add to Chrome',
      ctaPrimaryHint:
        'Opens the Chrome Web Store listing for a one-click install. Free to install — sign in with your email to start.',
      ctaSecondary: 'See what it does',
      ctaDocs: 'Read the docs',
      localeZh: '中文',
      localeEn: 'EN',
      pipeline: {
        capture: 'Capture',
        translate: 'Translate',
        image: 'Image',
        category: 'Category',
        publish: 'Publish',
      },
      screenshotAlt: 'Nomu promotional poster — Tool for Noon Sellers. Manage, List, Track, Grow on Noon.',
      screenshotCaption: 'Nomu · Tool for Noon Sellers · 2026',
    },
    splash: {
      eyebrow: 'Nomu',
    },
    features: {
      eyebrow: 'Features',
      sectionTitle: 'Capture products. The extension handles the rest.',
      sectionSubtitle:
        'Automatic translation, AI product imagery, category prediction and barcode labels. You check the highlighted fields before anything goes out. The rest is watched for you.',
      poster: {
        alt: 'Nomu promotional poster — Tool for Noon Sellers. Manage, List, Track, Grow on Noon.',
        caption: 'Nomu · Tool for Noon Sellers · 2026',
      },
      chapter: 'Chapter',
      pillars: {
        manage: {
          title: 'Product Management',
          tagline:
            'Keep every store, every source, every account in one place — so the next listing starts from a known state.',
        },
        list: {
          title: 'Bulk Listing',
          tagline:
            'Translate, re-image, re-price and re-categorize in one batch — so a hundred drafts do not mean a hundred days.',
        },
        track: {
          title: 'Task Tracking',
          tagline:
            'Every publish and every duplication lives in one panel, with timing, failures and retries — so nothing runs in the dark.',
        },
        insights: {
          title: 'Performance Insights',
          tagline:
            'See where the money goes, ask anything, print a label on the spot, export whatever you have shipped — the tools are there for whatever has to leave the browser.',
        },
      },
      items: {
        pipeline: {
          title: 'Send source products to Noon',
          imageAlt: 'Screenshot of the one-click capture-to-publish flow',
          body: 'Capture the source page, add it to your batch, then submit for listing, activation and warranty registration in one flow.',
        },
        multiAccount: {
          title: 'Store management in one place',
          imageAlt: 'Screenshot of the multi-store list and switching in the side panel',
          body: 'Keep all your Noon stores in one panel and switch stores to auto-fill the listing settings.',
        },
        translate: {
          title: 'Auto-translate Chinese to English and Arabic',
          imageAlt: 'Screenshot of the translation result',
          body: 'Titles, selling points and attributes are translated automatically, covering both Noon UAE and Saudi.',
        },
        image: {
          title: 'Product images ready to publish',
          imageAlt: 'Screenshot of images being prepared to the 660×900 spec',
          body: "Images are resized onto white backgrounds at Noon's 660×900 spec automatically, so a bad image never blocks a listing.",
        },
        serial: {
          title: 'Publish one by one, stop on the first problem',
          imageAlt: 'Screenshot of independently published products',
          body: 'Each product publishes on its own. If one fails, the whole batch stops instead of leaving half-published listings behind.',
        },
        category: {
          title: 'Category suggested automatically',
          imageAlt: 'Screenshot of the suggested Noon category',
          body: "The Noon category is suggested from the source data, so you don't have to pick it by hand.",
        },
        sources: {
          title: 'More than 1688',
          imageAlt: 'Screenshot of capturing products from different sources',
          body: 'Capture from 1688, Taobao/Tmall, JD, and noon.com product pages; any other site can be captured on demand without waiting for a release.',
        },
        browse: {
          title: 'Three-column product catalog',
          imageAlt: 'Screenshot of the catalog list, detail and filter columns side by side',
          body: 'The catalog is a page of its own: list on the left, detail in the middle, filters on the right. Click a row and the full product information is there, with edits flowing straight back in; batch status changes and batch deletion both happen here, and list rows show sold rather than the selling price, so you judge what actually moves before picking stock. Press Ctrl/⌘ + Shift + S on any page for the search overlay, where you can jump to an item or flip its live status.',
        },
        design: {
          title: 'Regenerate product imagery with AI',
          imageAlt: 'Screenshot of NomuDesign generating a product image',
          body: 'The NomuDesign canvas runs product imagery: prompt templates, AI prompt optimisation, model and tier selection, and history to scrub back through — then apply the result straight back to the gallery.',
        },
        variants: {
          title: 'Group publishing, sizes in one submission',
          imageAlt: 'Screenshot of the group and sizes-variant settings',
          body: 'Same-brand items can be merged into one group along a size / model / colour axis. Standard sizes go in as variants right in the single-product form, so parent and children go out together instead of building a parent and coming back for the children.',
        },
        barcode: {
          title: 'Print barcode labels on the spot',
          imageAlt: 'Screenshot of the barcode label generator and print view',
          body: 'Print labels for your own SKUs in Code 128, EAN-13 or UPC-A, one at a time or in batch — print straight from the page or export SVG / PNG / ZPL for your label printer. Working from a list of SKUs? Say so in the assistant and the whole batch comes back as a zip.',
        },
        tasks: {
          title: 'A task panel for the whole run',
          imageAlt: 'Screenshot of the task panel listing publish and duplicate tasks',
          body: 'Publish and duplicate tasks live in one panel: progress, per-step timing and the failure reason expand inline, and failed items can be retried on their own.',
        },
        duplicate: {
          title: 'Duplicate products across devices',
          imageAlt: 'Screenshot of duplicating an existing product onto another device',
          body: 'Copy an already-listed product to another device signed in to the same account, with batch rewrite for Partner SKU, barcode and brand. Duplication runs on its own queue, so it never competes with publishing. Same-device copy lands straight in the target store; cross-device copy rides a sync bus the remote end claims when it comes online.',
        },
        engine: {
          title: 'Concurrency and retries, your call',
          imageAlt: 'Screenshot of the engine concurrency and retry settings',
          body: 'Publishing and duplication each get their own concurrency and retry limits, conservative by default. Changes apply immediately, no browser restart.',
        },
        price: {
          title: 'Price conversion and profit breakdown',
          imageAlt: 'Screenshot of the fee breakdown and profit card',
          body: 'Source prices are converted to your store currency at the live rate, shown alongside the CNY figure, so you can stop switching to a calculator. Selecting a product in the catalog produces a fee breakdown and a profit card, showing how the price splits across commission, FBN shipping, first-mile and product cost at a glance; items with missing data are named rather than folded into a number that merely looks complete.',
        },
        export: {
          title: 'Export your product table',
          imageAlt: 'Screenshot of SKU export to a spreadsheet',
          body: 'Export the pending list as an Excel sheet for reconciliation or to hand to a colleague, instead of copying rows off the page.',
        },
        account: {
          title: 'Passwordless sign-in',
          imageAlt: 'Screenshot of the email magic-link sign-in screen',
          body: 'One email, one link, no password. Every page in the extension opens once you are signed in. Up to 3 devices per account, so a new computer does not mean re-configuring stores.',
        },
        cloudPool: {
          title: 'Move captures across devices',
          imageAlt: 'Screenshot of claiming a capture from the cloud pool',
          body: 'Push a finished capture to the cloud pool where your other devices see it live, and claim it back locally to keep publishing.',
        },
        sync: {
          title: 'Sync configs to another machine',
          imageAlt: 'Screenshot of uploading and downloading cloud configs',
          body: 'Upload store configs to the cloud and pull them back on another computer, so a new machine does not need every setting typed again.',
        },
        overview: {
          title: 'The overview page',
          imageAlt: 'Screenshot of the overview track and announcement board',
          body: "One track shows this week's captured, drafts, in progress and listed side by side, so you can see at a glance which stage things are piling up in. The attention queue lists failures only and does not take over task handling. Platform announcements sit across the top; click a row to mark it read, and it recedes into the background with the read state remembered.",
        },
        status: {
          title: 'Connection status you can see',
          imageAlt: 'Screenshot of the sync connection status and latency readout',
          body: 'The sync connection, heartbeat and latency have a page of their own: whether it is healthy, reconnecting or running high on latency is readable at a glance instead of guessed at. Measuring latency and reconnecting are both done in place.',
        },
        assistant: {
          title: 'Ask the Nomu Assistant anything',
          imageAlt: 'Screenshot of a streaming answer from the Nomu Assistant',
          body: 'The built-in assistant is not just a rules lookup: questions and product parsing both stream back word by word, from the extension popup or the action menu. Hand it a list of SKUs and it generates barcode labels in bulk as a zip. On a page with no adapter, right-click "Parse with AI" turns the product into a draft instead.',
        },
      },
      placeholder: {
        caption: 'screenshot to come',
      },
    },
    audience: {
      motto: 'Built for sellers sourcing on 1688, Taobao or JD, listing on Noon UAE and Saudi',
    },
    privacyPermissions: {
      eyebrow: 'Privacy & Permissions',
      sectionTitle: 'Where everything the extension touches ends up.',
      sectionSubtitle:
        "Store configs and drafts stay local, accounts and credits go to Nomu's service, product data goes to Noon.",
      cols: {
        yours: {
          name: 'Yours',
          chip: 'Local',
          tagline: 'Stored in your browser. Never uploaded unless you act.',
        },
        nomu: {
          name: 'Nomu service',
          chip: 'Via us',
          tagline:
            'Unavoidable once signed in: account, credits and AI calls go here; AI content then goes to the model provider.',
        },
        noon: {
          name: 'Noon',
          chip: 'Egress',
          tagline: 'Sent only when you publish a product.',
        },
        nowhere: {
          name: 'Nowhere',
          chip: 'Never',
          tagline: 'Explicitly excluded by design.',
        },
      },
      items: {
        storeSettings: {
          name: 'Store settings',
          detail: 'Country, partner code, warehouse, quantity, warranty, brand.',
        },
        storeRecords: {
          name: 'Store records & active store',
          detail: 'Which store is currently connected.',
        },
        batches: {
          name: 'Batches, drafts, history',
          detail: 'Saved locally so you can resume after a browser restart.',
        },
        storage: {
          name: 'Storage permission',
          detail: 'Holds store records, settings and batches in your browser.',
        },
        alarms: {
          name: 'Alarms',
          detail: 'Scan pending publish / duplicate tasks on a timer so they resume.',
        },
        nomuAccount: {
          name: 'Account and tokens',
          detail: 'Email, username, plus the access tokens and credit balance used to authenticate you.',
        },
        nomuCloud: {
          name: 'Cloud pool',
          detail: 'Product drafts you push yourself, for your other devices on the same account to claim.',
        },
        nomuAi: {
          name: 'AI call content',
          detail:
            'Translation text, image prompts and assistant questions, passed per call to third-party model providers. Your account token is not forwarded.',
        },
        productDetails: {
          name: 'Product details',
          detail:
            "Title, description, attributes, price, stock. Sent to Noon when you publish, and to Nomu's service when you use AI product parsing or prompt optimisation.",
        },
        productImages: {
          name: 'Product images',
          detail: 'Re-squared and de-backgrounded to the compliant spec.',
        },
        warranty: {
          name: 'Warranty & duplication requests',
          detail: 'Submitted to Noon when you click "publish".',
        },
        activeTab: {
          name: 'activeTab permission',
          detail: 'Read the page only when you click the extension.',
        },
        scripting: {
          name: 'Scripting permission',
          detail: 'Inject the capture UI into the page on matched sites.',
        },
        password: {
          name: 'Noon account password',
          detail: 'You sign in to Noon directly; the extension never sees it.',
        },
        analytics: {
          name: 'Crash diagnostics',
          detail:
            'One anonymous diagnostic event on crash, plus one version heartbeat after each update; no usage behaviour is recorded.',
        },
        browsingHistory: {
          name: 'Browsing history',
          detail: 'Cookies are only read on the matched sites, on click.',
        },
        notifications: {
          name: 'Notifications (unless you ask)',
          detail: 'Only enabled if you opt in to batch-finished alerts.',
        },
        contextMenus: {
          name: 'Context menus (unless you ask)',
          detail: 'Right-click entries appear only after you enable them.',
        },
      },
      permissionsStrip: {
        title: 'Permissions, listed',
        subtitle: 'Six total',
        perms: {
          storage: {
            label: 'Storage',
            detail: 'Holds store records and settings locally.',
          },
          alarms: {
            label: 'Alarms',
            detail: 'Resumes pending tasks after browser restart.',
          },
          notifications: {
            label: 'Notifications',
            detail: 'Tells you when a batch finishes or fails.',
          },
          activeTab: {
            label: 'activeTab',
            detail: 'Reads the page only when you click the extension.',
          },
          scripting: {
            label: 'Scripting',
            detail: 'Injects capture UI on matched sites.',
          },
          contextMenus: {
            label: 'Context menus',
            detail: 'Right-click actions like "Parse with AI".',
          },
        },
      },
      hosts: {
        noonPartners: 'Noon partner area',
        noonCdn: 'Noon image server',
        alicdn: '1688 / Taobao image server',
        jdimg: 'JD image server',
        backend: "Tool's own service",
      },
      hostsTitle: 'Hosts Nomu requests',
    },
    faq: {
      sectionTitle: 'Frequently asked',
      items: {
        free: {
          q: 'Is Nomu free?',
          a: 'The extension itself is free to use and is not billed per feature. AI translation, image generation and the assistant are billed in credits. Settings and cookies stay in your own browser',
        },
        apiKey: {
          q: 'Do I need to provide a key or sign in somewhere?',
          a: 'You never need your Noon password or a key — Nomu works through your existing Noon login. But a free Nomu account is required: sign in with a link sent to your email, no password needed.',
        },
        whySignIn: {
          q: 'Why do I need to sign in? Can I try it first?',
          a: 'The extension needs you signed in: all ten feature pages, the toolbar popup and the capture drawer on product pages show a sign-in card first. Browsing products on Taobao, Tmall, JD, 1688 and noon.com is never blocked. An account is free — sign in with a link sent to your email, no password to remember.',
        },
        regions: {
          q: 'How to install Nomu on the Purple Bird Browser?',
          a: 'Nomu is supported on the Purple Bird Browser: search for Nomu in its plugin center and install it there.',
        },
        sources: {
          q: 'Can I use sources other than 1688?',
          a: 'Product pages on 1688, Taobao/Tmall and JD are supported, and noon.com pages can be used as a source too. For any other site, right-click and use "Parse with AI" to capture it on demand.',
        },
        data: {
          q: 'Where is my data stored?',
          a: "Store configs, batches and task history stay in your browser by default. Data only travels through the tool's own service when you actively use the cloud pool, config sync or export.",
        },
        ai: {
          q: 'Do AI features cost extra?',
          a: 'A free Nomu account is required to use the extension. AI translation, category suggestions, image generation and right-click parsing are additionally billed in credits.',
        },
        translation: {
          q: 'How good is the translation? Should I proofread?',
          a: "Translation is automatic (Any to English and Arabic). For high-value or brand items, do a quick spot-check before publishing; auto-translation isn't guaranteed to be native-level.",
        },
        failure: {
          q: 'What happens if a listing fails?',
          a: 'The batch stops on the first failed item. That item is flagged in the list and can be retried on its own or fixed manually.',
        },
      },
    },
    services: {
      eyebrow: 'Agency services',
      sectionTitle: 'We handle the store-opening paperwork',
      sectionSubtitle:
        'VAT registration and Noon store setup, handled end to end: we prepare the documents, run the process and keep you posted.',
      cta: 'Get in touch',
      items: {
        vat: {
          title: 'VAT registration, done for you',
          body: 'From tax number application to the filings that follow, we prepare the paperwork and track every deadline.',
        },
        storeSetup: {
          title: 'Noon store setup, done for you',
          body: 'Store documents, category choice and going live, moved forward step by step instead of left to you to work out.',
        },
      },
    },
    support: {
      eyebrow: 'Support',
      sectionTitle: 'Stuck? Get in touch directly.',
      sectionSubtitle:
        'No forum digging. If install, capture or publishing gets stuck, or you have a feature idea, get in touch.',
      viewQr: 'View WeChat QR code',
      channels: {
        wechat: {
          title: 'WeChat (recommended)',
          body: 'Scan the QR code to add me, mention "Nomu". Day-to-day questions and feature requests live here.',
        },
        docs: {
          title: 'Ask the assistant, then the docs',
          body: 'Listing rules and field requirements can be asked straight to the in-extension AI assistant; install, updates and common questions live at nomu.kanocifer.chat/docs',
        },
      },
    },
    finalCta: {
      eyebrow: 'Get started',
      title: 'Make listing a pipeline',
      body: 'Capture, translate, prep images, publish, duplicate, watch the tasks. One extension covers it.',
      button: 'Add to Chrome',
      hint: 'One-click install from the Chrome Web Store',
      shareHint: 'Or share with a colleague',
    },
    footer: {
      tagline: 'Nomu: an easy-to-use Chrome extension for Noon',
      links: {
        privacy: 'Privacy',
        terms: 'Terms',
        changelog: 'Changelog',
        support: 'Support',
        docs: 'Docs',
      },
      license: 'All rights reserved',
    },
  },
} as const;
