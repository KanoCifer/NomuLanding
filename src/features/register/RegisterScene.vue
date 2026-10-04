<script setup lang="ts">
/**
 * RegisterScene — /register 页的画：铺满视口的那一幅。
 *
 * 这一版不再是一块带边框的面板，而是**整片页面底色**：光场固定在视口上，
 * 画作为 grid 第二列与表单并排，两列各自垂直居中，表单磨砂浮在它上面。窄屏收进
 * 文档流，落在表单之后当收尾的一拍（DOM 顺序即视觉顺序，手机上先让人看见能填的东西）。
 *
 * 黄色在这里当**光**不当颜料：全画唯一饱和的东西是那张发着光的验证码卡，
 * 光从它背后透出来（bloom），而不是把它涂成一块色板。深度靠材质堆叠
 * （两片磨砂平面 + 一个带长软影的信封 + 一张发光的卡），不靠画细节。
 *
 * 动效仍是一次性落位：信封先到，卡随后淡入，然后彻底静止。注册页是用户
 * 只经过一次的页面，循环动画在这里只有打扰。入场按深度错开（远 → 近）。
 *
 * 色值一律走 theme token，不写死 oklch 字面量。
 */
import { motion, useReducedMotion } from 'motion-v';

const props = defineProps<{ done?: boolean }>();

const reduceMotion = useReducedMotion();
</script>

<template>
  <div aria-hidden="true">
    <!-- 光场：固定在视口。一大团暖光从右上打进来，左下补一束冷光做平衡，
         再叠一层极淡的点阵 —— 大面积渐变在低质量屏上会出色带，点阵顺带把
         「白」拉出前后景。position:fixed，所以滚动时表单始终浮在同一片光里。 -->
    <div
      class="pointer-events-none fixed inset-0 z-0"
      style="
        background-image:
          radial-gradient(58rem 40rem at 82% 6%, color-mix(in oklch, var(--accent) 40%, transparent), transparent 62%),
          radial-gradient(
            40rem 34rem at 8% 92%,
            color-mix(in oklch, var(--accent-slate) 16%, transparent),
            transparent 68%
          ),
          radial-gradient(circle at center, color-mix(in oklch, var(--ink) 11%, transparent) 0.7px, transparent 1px);
        background-size:
          auto,
          auto,
          34px 34px;
      "
    ></div>

    <!-- 画：跟着 grid 的第二列走，宽就是列宽、在列里居中（垂直居中由父级
         items-center 负责）。窄屏没有 grid，退回文档流落在表单之后收尾。 -->
    <div class="pointer-events-none relative z-0 mx-auto w-[min(34rem,88vw)] lg:w-full lg:max-w-[34rem]">
      <!-- 两片磨砂平面：转过一点点角度、两片错开，读作「叠在一起的材料」。
           权重不同 —— 远的那片更淡更薄。 -->
      <div
        class="absolute top-[12%] left-[2%] h-[62%] w-[78%] rotate-[-4deg] rounded-[40px] border border-[color-mix(in_oklch,var(--ink)_6%,transparent)] bg-[color-mix(in_oklch,var(--surface)_34%,transparent)] backdrop-blur-[18px] backdrop-saturate-150"
      ></div>
      <div
        class="absolute top-[20%] left-[12%] h-[60%] w-[74%] rotate-[3deg] rounded-[40px] border border-[color-mix(in_oklch,var(--ink)_6%,transparent)] bg-[color-mix(in_oklch,var(--surface)_52%,transparent)] backdrop-blur-[18px] backdrop-saturate-150"
      ></div>

      <svg viewBox="0 0 620 560" class="relative block h-auto w-full">
        <defs>
          <!-- 信封下的长软影：产品的落地感靠这道斜影，不靠描边 -->
          <filter id="reg-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="22" />
          </filter>
          <!-- 验证码卡背后的光晕：黄色从这里透出来 -->
          <filter id="reg-bloom" x="-70%" y="-70%" width="240%" height="240%">
            <feGaussianBlur stdDeviation="34" />
          </filter>
        </defs>

        <ellipse cx="330" cy="470" rx="190" ry="34" fill="var(--ink)" fill-opacity="0.1" filter="url(#reg-shadow)" />

        <!-- 发光卡：全画唯一饱和物，先于信封入场（它是主角） -->
        <motion.g
          :initial="reduceMotion ? { opacity: 0 } : { opacity: 0, y: 18 }"
          :animate="reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }"
          :transition="{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
            delay: reduceMotion ? 0 : 0.42,
          }"
        >
          <circle cx="330" cy="196" r="96" fill="var(--accent)" fill-opacity="0.55" filter="url(#reg-bloom)" />
          <rect x="252" y="150" width="156" height="92" rx="24" fill="var(--accent)" />
          <!-- 提交成功后六位数字换成一道对勾：这幅画跟着页面状态走完 -->
          <g v-if="!props.done" fill="var(--ink)" fill-opacity="0.4">
            <rect v-for="i in 6" :key="i" :x="282 + (i - 1) * 18" y="188" width="8" height="19" rx="4" />
          </g>
          <path
            v-else
            d="m300 196 12 12 22-26"
            fill="none"
            stroke="var(--contrast)"
            stroke-width="5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </motion.g>

        <!-- 信封：低对比的白面 + 一道 hairline。刻意不给实填充色，让背后的光
             透上来 —— 这才有「被照着」而不是「被画着」的感觉。 -->
        <motion.g
          :initial="reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }"
          :animate="reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }"
          :transition="{
            duration: 0.6,
            ease: [0.23, 1, 0.32, 1],
            delay: reduceMotion ? 0 : 0.24,
          }"
        >
          <rect
            x="160"
            y="228"
            width="340"
            height="240"
            rx="36"
            fill="var(--surface)"
            fill-opacity="0.78"
            stroke="var(--hairline)"
            stroke-width="1"
          />
          <path
            d="M166 252q164 116 328 0"
            fill="none"
            stroke="var(--ink)"
            stroke-opacity="0.13"
            stroke-width="2"
            stroke-linecap="round"
          />
          <rect x="196" y="398" width="120" height="8" rx="4" fill="var(--ink)" fill-opacity="0.09" />
          <rect x="196" y="416" width="74" height="8" rx="4" fill="var(--ink)" fill-opacity="0.05" />
        </motion.g>
      </svg>
    </div>
  </div>
</template>
