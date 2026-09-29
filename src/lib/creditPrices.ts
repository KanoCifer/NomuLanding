import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'https://api.kanocifer.chat';

/**
 * 积分消耗表 —— 数据源是 Server-Go 的 credit_price 表，经公开接口
 * `GET /v3/credits/prices` 暴露（无鉴权：落地页没有会话态）。
 *
 * 调价在后端改表，这里不用动。amount 单位是「分」；perToken 区分
 * 「分 / 1K tokens」与「分 / 计量单位」，决定单位文案。
 *
 * 唯一真源：Server-Go internal/model/credit.go 的 creditPriceSeeds。
 */
export interface CreditPrice {
  source: string;
  variant: string;
  /** 分（0.01 元）。0.1 = 0.1 分。 */
  amount: number;
  /** true = 分 / 1K tokens；false = 分 / 计量单位（次、张）。字段名与后端一致，不做改名。 */
  per_token: boolean;
}

interface PricesEnvelope {
  data?: { items?: CreditPrice[] };
}

/** 拉价格表。失败抛错由调用方决定怎么兜 —— 这里不吞，也不再返回硬编码兜底值。 */
export async function fetchCreditPrices(): Promise<CreditPrice[]> {
  const res = await axios.get<PricesEnvelope>(`${API_BASE}/v3/credits/prices`, { timeout: 10_000 });
  return res.data?.data?.items ?? [];
}
