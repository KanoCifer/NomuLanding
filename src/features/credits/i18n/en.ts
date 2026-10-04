export default {
  credits: {
    meta: {
      title: 'Credits explained',
      description:
        'Nomu AI features spend credits: how many credits translation, AI prompt optimization, AI product parsing, knowledge-base Q&A and AI image generation use, and how credits are deducted. Capturing and publishing use none.',
    },
    eyebrow: 'Credits',
    title: 'What one AI action costs you in credits.',
    subtitle:
      'Only AI features spend credits — capturing, editing and publishing do not. Below is what a single action uses; your balance and every deduction are in the extension under Account.',
    unitFen: 'credits',
    back: 'Back to home',
    updatedAt: 'Any rule change shows up here and in the changelog.',
    table: {
      title: 'Credits used per action',
      feature: 'Feature',
      unit: 'Per action',
      amount: 'Credits used',
      caption:
        'Balance and history live in the extension under Account — every deduction, and why, is listed item by item.',
      loading: 'Loading the credit table…',
      failed: 'The credit table is unavailable right now. Refresh, or check it under Account in the extension.',
    },
    units: {
      perCall: 'Call',
      perKToken: '1K tokens',
      perImage: 'Image',
    },
    items: {
      translate: {
        name: 'Translation',
        desc: 'Product details, Chinese to English or Arabic',
      },
      promptOptimize: {
        name: 'AI prompt optimization',
        desc: 'Turns one line into a usable image or listing prompt',
      },
      productParse: {
        name: 'AI product parsing',
        desc: 'Right-click “Parse with AI” on any source page',
      },
      knowledgeAsk: {
        name: 'Knowledge-base Q&A',
        desc: 'The in-extension assistant for listing rules (tokens, rounded up)',
      },
      designLite: {
        name: 'AI image · standard',
        desc: 'Seedream 5.0 / GPT-Image 2 series',
      },
      designPro: {
        name: 'AI image · high quality',
        desc: 'Seedream 5.0 Pro, when quality matters more than speed',
      },
    },
    rulesTitle: 'How credits are deducted',
    rules: {
      preconsume: {
        title: 'Reserved up front, reconciled after',
        body: 'Image generation reserves credits by image count up front, then checks the actual count and returns the difference.',
      },
      idempotent: {
        title: 'Retries never deduct twice',
        body: 'Every call carries a unique idempotency key, so a network retry or a double click only counts once.',
      },
      insufficient: {
        title: 'Blocked when credits run out',
        body: 'A request with too few credits is rejected on the spot and the balance never goes negative; add credits and it works again immediately.',
      },
      records: {
        title: 'Every deduction is itemized',
        body: 'Account · Usage history lists the source, the amount and the time of each one, with returned credits shown separately.',
      },
    },
  },
} as const;
