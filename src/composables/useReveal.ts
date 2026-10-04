import { useReducedMotion } from 'motion-v';
import { EASE_OUT } from '@/constants/motionPresets';

/**
 * 全站唯一的入场动效：一次性淡入 + 上移 14px。
 *
 * 之前 Hero、FeatureGrid、Privacy、Services、Support、FAQ、FinalCta 各自抄了一份
 * `sectionFadeUp()`，七份几乎一样的代码，还各带一个 `blur(10px)`——长列表上
 * blur 既贵又已经过时。收到一个 composable 后，加分节只需 `v-bind="reveal()"`,
 * 改节奏 / 加减动效偏好也只改这一处。
 *
 * 克制原则：`once: true` 只演一次，不做滚动跟随、不做视差。悬停反馈一律走 CSS
 * transition，不进这里。
 */
export function useReveal() {
  const reduceMotion = useReducedMotion();

  return function reveal(delay = 0) {
    return reduceMotion.value
      ? {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.25, delay },
        }
      : {
          initial: { opacity: 0, y: 14 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: '0px 0px -12% 0px' },
          transition: { duration: 0.6, ease: EASE_OUT, delay },
        };
  };
}
