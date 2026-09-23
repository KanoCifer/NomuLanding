import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.kanocifer.chat';

/**
 * Nomu 密码重置 — 与后端公开路由对齐（mode 强制 'nomu'）：
 *   - POST /password/reset         步骤 1：申请重置邮件（始终 200，防枚举），
 *                                  响应 body 携带 challenge 字段；
 *   - POST /password/reset/confirm 步骤 2：验证码 + 新密码 + challenge 落地。
 *
 * challenge 由后端生成、放在 200 响应里回流；前端拿到后原样带回 confirm，
 * 后端用它做"邮件申请与会话落地"的绑定校验，防止步骤 2 被跨会话滥用。
 *
 * 落地页只调这两个端点，不落任何会话态；challenge 只在页面内存 ref 里活到步骤 2。
 *
 * 错误处理策略：
 *   - 404「用户不存在」必须文案化成「验证码无效」，避免邮箱枚举
 *   - 400「密码必须与之前的不同」原文透传
 *   - 500 / 网络错走通用文案
 */
export interface PasswordResetConfirmPayload {
  email: string;
  email_code: string;
  new_password: string;
  challenge: string;
}

/**
 * 步骤 1：申请重置邮件。后端始终 200，body 至少含 challenge 字符串字段。
 * 返回 axios 原始对象，UI 层只读 .data.challenge。
 */
export function requestPasswordReset(email: string): Promise<unknown> {
  return axios.post(`${API_BASE}/v3/password/reset`, { email, mode: 'nomu' }, { timeout: 10_000 });
}

/** 步骤 2：提交验证码 + 新密码 + challenge。返回 axios 原始对象，UI 层按 status / data 解析错误。 */
export function confirmPasswordReset(payload: PasswordResetConfirmPayload): Promise<unknown> {
  return axios.post(`${API_BASE}/v3/password/reset/confirm`, { ...payload, mode: 'nomu' }, { timeout: 15_000 });
}
