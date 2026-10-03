import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.kanocifer.chat';

/**
 * 站点公告 —— 数据源是 Server-Go 的公开接口 `GET /v3/announcements`（无鉴权：
 * 落地页没有会话态）。
 *
 * 读接口返回 `Cache-Control: public, max-age=3600`，浏览器与 CDN 会缓存 1 小时；
 * 后台改公告后这一页最长 1 小时才更新，这是接口定的缓存策略，不在前端绕。
 *
 * 与扩展侧（`@/core/dashboard/lib/announcements.ts`）共用同一份契约：字段名不
 * 改名，type 白名单外一律降级为 general。
 */

export const ANNOUNCEMENT_TYPES = ['general', 'feature', 'update', 'maintenance', 'security', 'credit'] as const;

export type AnnouncementType = (typeof ANNOUNCEMENT_TYPES)[number];

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: AnnouncementType;
  /** RFC3339 UTC，零值时为空串。 */
  created_at: string;
  updated_at: string;
}

/** 白名单外的取值降级为 general：后端新增分类时这页照常显示，而不是留白。 */
function normalizeType(raw: unknown): AnnouncementType {
  return typeof raw === 'string' && (ANNOUNCEMENT_TYPES as readonly string[]).includes(raw)
    ? (raw as AnnouncementType)
    : 'general';
}

interface Envelope {
  data?: unknown;
}

/** 单条脏数据跳过，不让整页崩。 */
function normalizeItem(raw: unknown): Announcement | null {
  if (!raw || typeof raw !== 'object') return null;
  const v = raw as Partial<Announcement>;
  if (typeof v.id !== 'number' || !Number.isFinite(v.id)) return null;
  if (typeof v.title !== 'string' || !v.title.trim()) return null;
  return {
    id: v.id,
    title: v.title,
    content: typeof v.content === 'string' ? v.content : '',
    type: normalizeType(v.type),
    created_at: typeof v.created_at === 'string' ? v.created_at : '',
    updated_at: typeof v.updated_at === 'string' ? v.updated_at : '',
  };
}

/** 拉全部公告，按创建时间倒序。失败抛错由调用方决定怎么兜 —— 这里不吞。 */
export async function fetchAnnouncements(): Promise<Announcement[]> {
  const res = await axios.get<Envelope>(`${API_BASE}/v3/announcements`, { timeout: 10_000 });
  const list = Array.isArray(res.data?.data) ? res.data.data : [];
  return list
    .map(normalizeItem)
    .filter((a): a is Announcement => a !== null)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}
