import zhCN from './zh-CN';
import en from './en';

export const messages = {
  'zh-CN': zhCN,
  en,
} as const;

export type LocaleKey = keyof typeof messages;
