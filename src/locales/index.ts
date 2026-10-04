import announcementsEn from '@/features/announcements/i18n/en';
import announcementsZh from '@/features/announcements/i18n/zh-CN';
import creditsEn from '@/features/credits/i18n/en';
import creditsZh from '@/features/credits/i18n/zh-CN';
import forgotPasswordEn from '@/features/forgot-password/i18n/en';
import forgotPasswordZh from '@/features/forgot-password/i18n/zh-CN';
import landingEn from '@/features/landing/i18n/en';
import landingZh from '@/features/landing/i18n/zh-CN';
import loginEn from '@/features/login/i18n/en';
import loginZh from '@/features/login/i18n/zh-CN';
import notFoundEn from '@/features/not-found/i18n/en';
import notFoundZh from '@/features/not-found/i18n/zh-CN';
import registerEn from '@/features/register/i18n/en';
import registerZh from '@/features/register/i18n/zh-CN';
import commonEn from './common/i18n/en';
import commonZh from './common/i18n/zh-CN';

/**
 * i18n 聚合入口 —— 这里只做登记，不放文案。
 *
 * 文案跟着模块走：各 feature 目录下的 `i18n/{zh-CN,en}.ts` 归各自模块所有，
 * 改文案就改那个文件，别回到这里找。跨模块共用的一份（导航、分享）留在
 * `common/i18n/`。每个模块文件的根 key 就是它的模块名，聚合时平铺到根上，
 * 所以调用处写 `credits.title`、`common.nav.docs` 这样的全路径。
 *
 * 新增模块：写一对同构的 zh-CN / en，在这里登记。两个文件必须同时加，
 * `scripts/check-i18n-keys.mjs` 会在 build 末尾把漏的挑出来。
 */
export const messages = {
  'zh-CN': {
    ...commonZh,
    ...landingZh,
    ...announcementsZh,
    ...creditsZh,
    ...registerZh,
    ...loginZh,
    ...forgotPasswordZh,
    ...notFoundZh,
  },
  en: {
    ...commonEn,
    ...landingEn,
    ...announcementsEn,
    ...creditsEn,
    ...registerEn,
    ...loginEn,
    ...forgotPasswordEn,
    ...notFoundEn,
  },
} as const;

export type LocaleKey = keyof typeof messages;
