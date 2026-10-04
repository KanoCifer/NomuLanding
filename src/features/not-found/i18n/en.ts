export default {
  notFound: {
    meta: {
      title: 'Page not found · Nomu',
      description: 'Nomu landing · The page you asked for is not here.',
    },
    quiet: {
      eyebrow: '404',
      title: 'Page not found',
      body: 'The link may be off, or the page has moved.',
      cta: 'Back to home',
      ctaHint: 'Return to the Nomu landing',
      docsLabel: 'Read the docs',
      supportLabel: 'Get support',
    },
    spatial: {
      eyebrow: '404 · Tab has drifted away',
      title: "This page isn't here",
      body: 'The tab you meant to open has left the screen. Head back home or open the docs.',
      cta: 'Back to home',
      ctaHint: 'Return to the Nomu landing',
      docsLabel: 'Read the docs',
      supportLabel: 'Get support',
    },
    editorial: {
      eyebrow: '404',
      title: 'Not found — or the product image never uploaded.',
      body: 'A broken link is more likely than a missing feature. Head home, install Nomu, or read the docs.',
      cta: 'Back to home',
      ctaHint: 'Return to the Nomu landing',
      docsLabel: 'Read the docs',
      supportLabel: 'Get support',
    },
  },
} as const;
