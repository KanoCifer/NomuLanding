/** 收紧弹簧 — 面板级（Modal / Drawer），克制无过冲 */
export const SPRING_SNUG = {
  type: 'spring',
  stiffness: 320,
  damping: 32,
  mass: 0.8,
} as const;

/** 快速淡入 — 遮罩层 / backdrop */
export const FADE_FAST = { duration: 0.18 } as const;
