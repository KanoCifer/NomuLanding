export default {
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
} as const;
