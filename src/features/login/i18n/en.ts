export default {
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
} as const;
