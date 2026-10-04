import axios from 'axios';
import { useReducedMotion } from 'motion-v';
import { computed, nextTick, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { EASE_OUT, SPRING_SNUG } from '@/constants/motionPresets';
import { sendRegisterEmailCode, submitRegistration } from '@/lib/nomuRegister';

/**
 * useRegisterForm — /register 的全部状态与副作用，视图只负责排版。
 *
 * 搬到这里的东西都是「视图不该知道」的：两步状态机和它的方向、每步各自的
 * 校验规则、60 秒倒计时、后端 `{field: [msg]}` 到本页面段的错误映射、切页后
 * 该把焦点放到哪、以及各处动效的具体参数。视图因此只剩结构与文案，改校验或
 * 调动效不必在 570 行的模板里翻。
 *
 * 网络调用直接用 `@/lib/nomuRegister`，没有再包一层 —— 中间那层只会转发。
 * 文案不外泄成 key 字符串：标签都是 computed，视图里看不到 `noonTool.register.*`。
 */
export function useRegisterForm() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();

  /* ---------- 字段 ---------- */

  interface FormState {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    emailCode: string;
  }

  interface ErrorState {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    emailCode: string;
    submit: string;
  }

  const form = ref<FormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    emailCode: '',
  });

  const errors = ref<ErrorState>(emptyErrors());

  const isSubmitting = ref(false);
  const isSendingCode = ref(false);
  const codeCountdown = ref(0);
  const codeSent = ref(false);
  const isSuccess = ref(false);
  /* 密码可见：两个密码框共用一个开关，同一件事不做两套状态 */
  const showPassword = ref(false);

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  /* ---------- 两步 ---------- */

  /* 账户信息 → 邮箱验证码。五字段一屏塞不下，CTA 会被顶到折叠线以下，
     用户填完才知道按钮在哪。第二步里确认密码跟着验证码一起 —— 它和密码
     同属「再确认一次」，不该被验证码隔开。 */
  const step = ref<1 | 2>(1);

  /* 翻页方向：前进时新内容从右侧进来、后退时从左侧进来。没有这个，前后两次
     切换的方向感是反的，退回去比往前走更像「往前」。 */
  const stepDirection = ref<1 | -1>(1);

  const STEP_TOTAL = 2;
  const stepLabel = computed(() => t('noonTool.register.form.step', { current: step.value, total: STEP_TOTAL }));

  /* 切页动效。两步共用同一份参数，视图 `v-bind` 上去即可，不必知道位移量、
     曲线和 reduceMotion 分支。 */
  const stepMotion = computed(() => {
    const shift = reduceMotion.value ? 0 : 24 * stepDirection.value;
    return {
      initial: { opacity: 0, x: shift },
      animate: { opacity: 1, x: 0 },
      exit: { opacity: 0, x: -shift },
      transition: reduceMotion.value ? { duration: 0.1 } : { duration: 0.22, ease: EASE_OUT },
    };
  });

  /* 换页后把焦点送到新一步的第一个字段：内容整块换掉却不移焦点，键盘用户会
     停在已卸载的输入框上，读屏用户也不知道自己到了第几步。 */
  watch(step, async (s) => {
    await nextTick();
    document.getElementById(s === 1 ? 'reg-username' : 'reg-confirm')?.focus();
  });

  /** 回上一步：连同错误一起清掉，否则上一轮的提示会跟着翻回来。 */
  function goBack() {
    errors.value = emptyErrors();
    stepDirection.value = -1;
    step.value = 1;
  }

  /* ---------- 倒计时 ---------- */

  let countdownTimer: ReturnType<typeof setInterval> | null = null;

  onUnmounted(() => {
    if (countdownTimer) clearInterval(countdownTimer);
  });

  function startCountdown(seconds: number) {
    codeCountdown.value = seconds;
    countdownTimer = setInterval(() => {
      codeCountdown.value--;
      if (codeCountdown.value <= 0) {
        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = null;
        codeSent.value = false;
      }
    }, 1000);
  }

  /* ---------- 发送验证码 ---------- */

  const sendCodeLabel = computed(() => {
    if (isSendingCode.value) return t('noonTool.register.form.sending');
    if (codeCountdown.value > 0) return t('noonTool.register.form.resendIn', { n: codeCountdown.value });
    if (codeSent.value) return t('noonTool.register.form.sent');
    return t('noonTool.register.form.sendCode');
  });

  async function sendCode() {
    errors.value.email = '';
    errors.value.submit = '';

    if (!form.value.email) {
      errors.value.email = t('noonTool.register.errors.emailRequired');
      return;
    }
    if (!EMAIL_RE.test(form.value.email)) {
      errors.value.email = t('noonTool.register.errors.emailInvalid');
      return;
    }

    isSendingCode.value = true;
    try {
      await sendRegisterEmailCode(form.value.email);
      codeSent.value = true;
      startCountdown(60);
    } catch (err) {
      errors.value.email = extractAxiosFieldError(err, 'email') || t('noonTool.register.errors.sendCodeFailed');
    } finally {
      isSendingCode.value = false;
    }
  }

  /* ---------- 提交 ---------- */

  /* 提交按钮不因「验证码没填」而禁用 —— 禁用态在纯黄底上只呈现为一片发白的糊，
     看不出哪里没填。表单本来就有逐字段校验，点一下把话说清楚比拦在门外好。 */
  const submitDisabled = computed(() => isSubmitting.value || isSuccess.value);

  const submitLabel = computed(() => {
    if (isSubmitting.value) return t('noonTool.register.form.submitting');
    return step.value === 1 ? t('noonTool.register.form.next') : t('noonTool.register.form.submit');
  });

  async function submit() {
    errors.value = emptyErrors();

    /* 第一步只校验账户信息，通过就翻页 —— 不碰后端。 */
    if (step.value === 1) {
      if (!form.value.username) errors.value.username = t('noonTool.register.errors.usernameRequired');
      if (!form.value.email) errors.value.email = t('noonTool.register.errors.emailRequired');
      else if (!EMAIL_RE.test(form.value.email)) errors.value.email = t('noonTool.register.errors.emailInvalid');
      if (!form.value.password) errors.value.password = t('noonTool.register.errors.passwordRequired');
      if (Object.values(errors.value).some((v) => v)) return;
      stepDirection.value = 1;
      step.value = 2;
      return;
    }

    if (!form.value.confirmPassword) {
      errors.value.confirmPassword = t('noonTool.register.errors.confirmPasswordRequired');
    } else if (form.value.password !== form.value.confirmPassword) {
      errors.value.confirmPassword = t('noonTool.register.errors.passwordMismatch');
    }
    if (!form.value.emailCode) errors.value.emailCode = t('noonTool.register.errors.emailCodeRequired');

    if (Object.values(errors.value).some((v) => v)) return;

    isSubmitting.value = true;
    try {
      await submitRegistration({
        username: form.value.username,
        email: form.value.email,
        password: form.value.password,
        confirm_password: form.value.confirmPassword,
        email_code: form.value.emailCode,
      });
      isSuccess.value = true;
      /* 滚动到顶部，让成功卡可见（移动端键盘可能遮住） */
      window.scrollTo({ top: 0, behavior: reduceMotion.value ? 'auto' : 'smooth' });
    } catch (err) {
      mapSubmitError(err);
    } finally {
      isSubmitting.value = false;
    }
  }

  /** 后端按字段返回错误数组（{field: [msg, ...]}），逐字段映射；其它错误归到 submit。 */
  function mapSubmitError(err: unknown) {
    const data = axios.isAxiosError(err) ? err.response?.data : undefined;
    if (data && typeof data === 'object') {
      const body = data as Record<string, unknown>;
      if (Array.isArray(body.username) && body.username[0]) errors.value.username = body.username[0];
      if (Array.isArray(body.email) && body.email[0]) errors.value.email = body.email[0];
      if (Array.isArray(body.password) && body.password[0]) errors.value.password = body.password[0];
      if (Array.isArray(body.confirm_password) && body.confirm_password[0]) {
        errors.value.confirmPassword = body.confirm_password[0];
      }
      if (Array.isArray(body.email_code) && body.email_code[0]) errors.value.emailCode = body.email_code[0];
      if (typeof body.error === 'string') errors.value.submit = body.error;
      if (typeof body.message === 'string' && !errors.value.submit) errors.value.submit = body.message;
    }
    if (!Object.values(errors.value).some((v) => v)) {
      errors.value.submit = (err instanceof Error && err.message) || t('noonTool.register.errors.submitFailed');
    }
    /* 后端可能驳回第一步的字段（用户名被占用等），而那些输入框在第 1 步 ——
       不翻页错误就贴在看不见的地方。 */
    if (errors.value.username || errors.value.email || errors.value.password) {
      stepDirection.value = -1;
      step.value = 1;
    }
  }

  function extractAxiosFieldError(err: unknown, field: string): string {
    if (!axios.isAxiosError(err)) return '';
    const data = err.response?.data;
    if (data && typeof data === 'object' && Array.isArray((data as Record<string, unknown>)[field])) {
      const arr = (data as Record<string, string[]>)[field];
      return arr[0] ?? '';
    }
    if (data && typeof data === 'object' && typeof (data as Record<string, unknown>).message === 'string') {
      return (data as Record<string, string>).message;
    }
    return '';
  }

  function emptyErrors(): ErrorState {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      emailCode: '',
      submit: '',
    };
  }

  /** 成功卡入场：带一点缩放，卡片「落下」而不是「淡入」。 */
  const successMotion = computed(() =>
    reduceMotion.value
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 12, scale: 0.98 },
          animate: { opacity: 1, y: 0, scale: 1 },
          transition: SPRING_SNUG,
        },
  );

  /** 发送按钮的可用性：发送中或倒计时中都不能再点。视图不必知道有倒计时这回事。 */
  const canSendCode = computed(() => !isSendingCode.value && codeCountdown.value === 0);

  /** 页面入场：一次性淡入上移，delay 让内容按深度错开落位，不循环。 */
  const enter = computed(() =>
    reduceMotion.value
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.2 } }
      : {
          initial: { opacity: 0, y: 16, filter: 'blur(8px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
          transition: { duration: 0.55, ease: EASE_OUT, delay: 0.06 },
        },
  );

  function toggleReveal() {
    showPassword.value = !showPassword.value;
  }

  return {
    form,
    errors,
    step,
    stepLabel,
    stepMotion,
    enter,
    successMotion,
    showPassword,
    toggleReveal,
    isSendingCode,
    codeSent,
    canSendCode,
    sendCode,
    sendCodeLabel,
    isSubmitting,
    isSuccess,
    submitDisabled,
    submitLabel,
    submit,
    goBack,
  };
}
