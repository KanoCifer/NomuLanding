export const LOCALES = ['zh-CN', 'en'] as const;

export type Locale = (typeof LOCALES)[number];

const LOCALE_STORAGE_KEY = 'noontool.locale';

function isLocale(value: unknown): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function readLocale(): Locale {
  const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (isLocale(saved)) return saved;
  const lang = (navigator.language || '').toLowerCase();
  return lang.startsWith('zh') ? 'zh-CN' : 'en';
}

export function writeLocale(locale: Locale): void {
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
}
