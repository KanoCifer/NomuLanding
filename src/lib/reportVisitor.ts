import axios from 'axios';
import { collectVisitorData } from './visitorTrack';

// 上报追踪数据到后端
export async function reportVisitorData() {
  try {
    const data = collectVisitorData();
    await axios.post(
      `${import.meta.env.VITE_API_BASE || 'https://api.kanocifer.chat'}/v3/track`,
      data,
      {
        timeout: 5000,
        withCredentials: true,
      },
    );
  } catch (error) {
    // 上报失败不影响主流程，仅控制台打印
    if (error instanceof Error) {
      console.warn('访客追踪数据上报失败:', error.message);
    }
  }
}
