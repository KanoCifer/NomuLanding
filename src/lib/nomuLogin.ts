import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.kanocifer.chat';

/**
 * 把邮件回调带回来的 token 转发给后端（POST /v3/nomu/magic-login，与
 * /v3/magic-login/consume 同 handler，按 mode 分支）。
 *
 * 后端把登录结果写回 device 槽位（nomulogin:device:<device_id>），由 Nomu
 * 扩展侧轮询取走 —— 本页只负责转发，不落会话态，因此不需要 withCredentials。
 */
export function consumeNomuMagicLink(token: string): Promise<unknown> {
  return axios.post(
    `${API_BASE}/v3/nomu/magic-login`,
    { token, mode: 'nomu' },
    { timeout: 10_000 },
  );
}
