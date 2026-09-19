/** 收紧弹簧 — 面板级（Modal / Drawer），克制无过冲 */
export const SPRING_SNUG = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 0.8,
} as const;

/** 快速淡入 — 遮罩层 / backdrop */
export const FADE_FAST = { duration: 0.18 } as const;

/** 强 ease-out — 与 theme.css 的 --ease-out 数值一致，但 motion-v 不接受 CSS var，必须 JS 端再写一份 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
/** 强 ease-in-out — 与 theme.css 的 --ease-in-out 一致 */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
