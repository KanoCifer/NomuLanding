import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.kanocifer.chat';

/**
 * Nomu 注册 — 与 ReadingList 主站共用后端（frontend/packages/api/src/gateways/auth.ts
 * 里 register / sendRegisterEmailCode 的端点），但 mode 强制 'nomu'：
 *   - 邮件模板走 Nomu 模板（Nomu logo、副标与正文）
 *   - redis 命名空间走 nomu 专属（与魔法登录的 nomu 槽位一致）
 *   - 后端 DTO 用 binding:"required,oneof=blog nomu" 拦截非法值
 *
 * 落地页只调这两个端点，不落任何会话态：注册成功后由前端跳回首页，
 * 用户再去 Chrome 网上应用商店安装扩展；登录走 /nomu/login 的魔法链接，
 * 与本文件正交。
 */
export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  confirm_password: string;
  email_code: string;
}

/** 申请注册验证码邮件。永远 200，错误也只可能是 400（邮箱格式错）或 429（限流）。 */
export function sendRegisterEmailCode(email: string): Promise<unknown> {
  return axios.post(`${API_BASE}/v3/email/code`, { email, mode: 'nomu' }, { timeout: 10_000 });
}

/** 提交注册。返回 axios 原始对象，UI 层按 status 判断成功或解析错误字段。 */
export function submitRegistration(payload: RegisterPayload): Promise<unknown> {
  return axios.post(`${API_BASE}/v3/register`, { ...payload, mode: 'nomu' }, { timeout: 15_000 });
}
