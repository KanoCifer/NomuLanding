export default {
  forgotPassword: {
    meta: {
      title: 'Reset your Nomu password',
      description: 'Reset your Nomu account password with an email verification code.',
    },
    headline: 'Reset password',
    subheadline: 'Enter the email on your account — we will send a 6-digit code to reset your password.',
    /* Step 1: request the reset email */
    stepRequest: {
      email: 'Account email',
      submit: 'Send reset email',
      submitting: 'Sending…',
    },
    /* Step 1 success: fixed wording to avoid leaking whether the email is registered */
    requestedHint: 'If that email is registered, a reset link is on its way.',
    requestedHintDetail: 'Grab the 6-digit code from your inbox, then come back here.',
    /* Step 2: code + new password */
    stepConfirm: {
      emailLabel: 'Sent to',
      changeEmail: 'Use a different email',
      emailCode: 'Email code',
      newPassword: 'New password',
      confirmPassword: 'Confirm new password',
      submit: 'Reset password',
      submitting: 'Resetting…',
    },
    errors: {
      emailRequired: 'Please enter your email',
      emailInvalid: 'That email looks invalid',
      emailCodeRequired: 'Please enter the 6-digit code',
      newPasswordRequired: 'Please enter a new password',
      newPasswordTooShort: 'Use at least 6 characters',
      confirmPasswordRequired: 'Please confirm your new password',
      passwordMismatch: "Passwords don't match",
      /* Step 2 errors: 404 is intentionally rewritten to block account enumeration */
      invalidCodeOrEmail: 'Code is invalid or the email is not registered',
      sessionExpired: 'Session expired. Please request a new code.',
      passwordSameAsOld: 'Pick a password you have not used before',
      submitFailed: "Couldn't reset the password. Try again in a moment.",
      networkError: 'Network error. Try again in a moment.',
    },
    success: {
      title: 'Password updated',
      body: 'Install the Nomu extension and sign in with your new password to open the whole extension.',
      cta: 'Install Nomu',
      back: 'Back to home',
    },
  },
} as const;
