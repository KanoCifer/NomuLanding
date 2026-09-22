export default {
  noonTool: {
    meta: {
      title: 'Nomu: an easy-to-use Chrome extension for Noon',
      description:
        'Nomu is a Chrome extension that captures products from 1688, Taobao/Tmall and JD, translates the details (Chinese to English and Arabic), prepares images, and publishes each product to Noon UAE and Saudi. Multi-store management, a task panel, store-to-store duplication and AI category suggestions are built in; store settings stay on your machine by default.',
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
    hero: {
      eyebrow: 'Nomu · Chrome extension',
      headline: 'An easy-to-use',
      headlineTail: 'Noon Chrome extension',
      subheadline:
        "It's still the familiar purchasing page, still your Noon store. Nomu accelerates collection, translation, image processing and individual release, facilitating your operational work.",
      ctaPrimary: 'Add to Chrome',
      ctaPrimaryHint: 'Opens the Chrome Web Store listing for a one-click install of Nomu',
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
    nav: {
      sections: {
        features: 'Features',
        support: 'Support',
        faq: 'FAQ',
      },
      docs: 'Docs',
      register: 'Create account',
      menu: 'Menu',
      menuOpen: 'Open menu',
      menuClose: 'Close menu',
    },
    share: {
      label: 'Share',
      copied: 'Link copied',
    },
    features: {
      eyebrow: 'Features',
      sectionTitle: 'Capture products. The extension handles the rest.',
      sectionSubtitle:
        'Every step runs with a sensible default: automatic translation, compliant images and AI category prediction. You check the highlighted fields before anything goes out. The rest is watched for you.',
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
            'Ask anything about the listing rules, export anything you have shipped — so the numbers leave the browser when you need them to.',
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
          title: 'CNY prices converted for you',
          imageAlt: 'Screenshot of a converted price filling the price field',
          body: 'Source prices are converted to your store currency at the live rate, shown alongside the CNY figure, so you can stop switching to a calculator.',
        },
        export: {
          title: 'Export your product table',
          imageAlt: 'Screenshot of SKU export to a spreadsheet',
          body: 'Export the pending list as an Excel sheet for reconciliation or to hand to a colleague, instead of copying rows off the page.',
        },
        account: {
          title: 'Passwordless sign-in',
          imageAlt: 'Screenshot of the email magic-link sign-in screen',
          body: 'Sign in with a link sent to your email. No password to remember. Your session follows the account, so a new computer does not mean re-configuring stores.',
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
        assistant: {
          title: 'AI assistant and right-click parsing',
          imageAlt: 'Screenshot of asking the AI assistant a question on the page',
          body: 'Ask the built-in AI assistant about listing rules directly, and on a page the tool has no adapter for, right-click to parse the product into a draft.',
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
      sectionSubtitle: 'Your data is stored locally, while product data comes from Noon.',
      cols: {
        yours: {
          name: 'Yours',
          chip: 'Local',
          tagline: 'Stored in your browser. Never uploaded unless you act.',
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
        productDetails: {
          name: 'Product details',
          detail: 'Title, description, attributes, price, stock. Sent only when you publish.',
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
          name: 'Analytics or telemetry',
          detail: 'No tracking pixels, no event pings, no usage beacons.',
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
          a: 'Part of Nomu is free. Settings and cookies stay in your own browser',
        },
        apiKey: {
          q: 'Do I need to provide a key or sign in somewhere?',
          a: 'No. Nomu works through your existing Noon login, so you never have to enter a password or key.',
        },
        regions: {
          q: 'How to install Nomu on the Purple Bird Browser?',
          a: 'The Purple Bird Browser is not yet available on the Chrome Web Store. Please sync manually or contact me for support.',
        },
        sources: {
          q: 'Can I use sources other than 1688?',
          a: 'Product pages on 1688, Taobao/Tmall and JD are supported, and noon.com pages can be used as a source too. For any other site, right-click and use "Parse with AI" to capture it on demand.',
        },
        data: {
          q: 'Where is my data stored?',
          a: "Store configs, batches and task history stay in your browser by default. Data only travels through the tool's own service when you actively use the cloud pool, config sync or export; none of those are required to publish normally.",
        },
        ai: {
          q: 'Do AI features cost extra?',
          a: 'The AI assistant, category suggestions and right-click parsing need a Nomu account and are billed in credits. Capture, translation and publishing work without signing in.',
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
      title: 'Make listing a pipeline',
      body: 'Capture, translate, prep images, publish, duplicate, watch the tasks. One extension covers it.',
      button: 'Add to Chrome',
      hint: 'One-click install from the Chrome Web Store',
      shareHint: 'Or share with a colleague',
    },
    register: {
      meta: {
        title: 'Create your Nomu account',
        description:
          'Create a Nomu account to unlock the AI assistant, AI Generation, and right-click parsing — billed in credits.',
      },
      headline: 'Create your Nomu account',
      subheadline:
        'An account unlocks the AI assistant and AI Generation. Capture and publishing still work without signing in.',
      form: {
        username: 'Username',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm password',
        emailCode: 'Email code',
        sendCode: 'Send code',
        sending: 'Sending…',
        sent: 'Sent',
        resendIn: 'Resend in {n}s',
        submit: 'Create account',
        submitting: 'Creating…',
      },
      errors: {
        usernameRequired: 'Please enter a username',
        emailRequired: 'Please enter your email',
        emailInvalid: 'That email looks invalid',
        passwordRequired: 'Please enter a password',
        confirmPasswordRequired: 'Please confirm your password',
        passwordMismatch: "Passwords don't match",
        emailCodeRequired: 'Please enter the email code',
        sendCodeFailed: "Couldn't send the code. Try again in a moment.",
        submitFailed: "Couldn't create the account. Try again in a moment.",
      },
      success: {
        title: "You're in",
        body: 'Your account is ready. Install the Nomu extension to use the AI assistant, category suggestions, and more.',
        cta: 'Install Nomu',
        back: 'Back to home',
      },
      bottomHint: "By creating an account you agree to Nomu's terms and {privacy}.",
      privacy: 'privacy policy',
    },
    login: {
      /* 与 ReadingList 的 noonTool.nomuLogin 文案保持一致 */
      headlinePending: 'Welcome back',
      headlineSuccess: 'Sign-in synced',
      headlineError: 'Unable to continue',
      sublinePending: 'Confirming this sign-in with Nomu…',
      sublineSuccess: 'You can return to the Nomu extension to keep working.',
      sublineFallbackError: "Nomu didn't confirm this link in time. It may have expired.",
      missingTokenError: 'Missing token. This link is invalid.',
      closePage: 'Close this page',
      retry: 'Try again',
    },
    footer: {
      tagline: 'Nomu: an easy-to-use Chrome extension for Noon',
      links: {
        privacy: 'Privacy',
        changelog: 'Changelog',
        support: 'Support',
        docs: 'Docs',
      },
      license: 'All rights reserved',
    },
  },
} as const;
