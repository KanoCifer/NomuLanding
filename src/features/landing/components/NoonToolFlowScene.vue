<script setup lang="ts">
/**
 * FlowScene — Hero 插图：从货源到 Noon 的那条航线。
 *
 * 视觉基因取自 NoonToolv1/logo/ip-mascot/PROFILE.md §5：
 *   - 形状 4–7 个大圆角几何；笔触"几乎察觉不到的极轻厚度"（这里的 5px 暖黄衬底）
 *   - 三语义色：奶白 + 深紫 + 阳光黄，页面本身的白底黑字不受影响
 *   - 姿态从右下"钻出来"，不做中心对称
 *
 * 全部内联 SVG，颜色走 theme token（fill="var(--accent)"），换肤不用改这里。
 *
 * 动效：包裹沿 .fs-route 真飞一遍航线，途经采集 / 翻译 / 上架三站时依次点亮，
 * 抵达后右上角对勾弹出并描出。8.2s 一轮（5.8s 演出 + 2.4s 停顿），慢到余光里
 * 才觉得活着 —— 和原来那条 9s 虚线流动同一个节奏量级。
 *
 * 以前是两条互不相干的 CSS 循环：虚线 stroke-dashoffset 走一圈，包裹在原地
 * 浮沉 4px。图讲的是"从货源流到 Noon"，动效演的是原地抖动，语义对不上；
 * 现在只有一条 timeline，线自己不动，由包裹带着走。
 *
 * 整条 timeline 收在 gsap.matchMedia 里：prefers-reduced-motion 下根本不建，
 * 改为包裹静态停在「上架」站前、对勾已画出 —— 是个站得住的静帧，不是放一半。
 */
import { onBeforeUnmount, onMounted } from 'vue';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

withDefaults(defineProps<{ mascot?: string }>(), {
  mascot: '/screens/pose-browsing.png',
});

/** 对勾路径长 ≈ 20.5 */
const CHECK_LEN = 21;

/** 三个站点在航线上的 t 值。cx/cy 由曲线 M134 126C188 66 250 74 296 128 反解，
 *  原来的 176/222/266 是目测摆的，其实浮在虚线旁边而不是线上。 */
const STATIONS = [
  { sel: '.fs-station-1', t: 0.35, origin: '192.6 87' },
  { sel: '.fs-station-2', t: 0.5, origin: '218 84.3' },
  { sel: '.fs-station-3', t: 0.65, origin: '242.9 89.1' },
] as const;

const TRAVEL = 5.2;

let mm: gsap.MatchMedia | null = null;

onMounted(() => {
  mm = gsap.matchMedia();
  // 两条 query 互斥，必须都写：gsap.matchMedia 只在「有条件匹配」时执行 handler，
  // 只写 reduce 的话，普通用户（no-preference）下整条 timeline 根本不会建。
  mm.add(
    {
      motion: '(prefers-reduced-motion: no-preference)',
      reduce: '(prefers-reduced-motion: reduce)',
    },
    (ctx) => {
      const { reduce } = ctx.conditions as { motion: boolean; reduce: boolean };

      gsap.set('.fs-check-path', { strokeDasharray: CHECK_LEN });

      if (reduce) {
        gsap.set('.fs-parcel', {
          motionPath: { path: '.fs-route', align: '.fs-route', alignOrigin: [0.5, 0.5], start: 0.65, end: 0.65 },
        });
        gsap.set('.fs-check', { scale: 1, autoAlpha: 1, svgOrigin: '452 76' });
        gsap.set('.fs-check-path', { strokeDashoffset: 0 });
        return;
      }

      gsap.set('.fs-check', { scale: 0, autoAlpha: 0, svgOrigin: '452 76' });
      gsap.set('.fs-check-path', { strokeDashoffset: CHECK_LEN });

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.4 });

      tl.to('.fs-parcel', {
        motionPath: { path: '.fs-route', align: '.fs-route', alignOrigin: [0.5, 0.5] },
        duration: TRAVEL,
        ease: 'power1.inOut',
      });

      for (const s of STATIONS) {
        const at = TRAVEL * s.t;
        tl.fromTo(s.sel, { scale: 1 }, { scale: 1.5, duration: 0.3, ease: 'power2.out', svgOrigin: s.origin }, at).to(
          s.sel,
          { scale: 1, duration: 0.4, ease: 'power2.inOut' },
          at + 0.3,
        );
      }

      tl.fromTo(
        '.fs-check',
        { scale: 0, autoAlpha: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.5, ease: 'back.out(2)' },
        TRAVEL - 0.1,
      )
        .to('.fs-check-path', { strokeDashoffset: 0, duration: 0.45, ease: 'power2.inOut' }, TRAVEL + 0.2)
        .set('.fs-check', { scale: 0, autoAlpha: 0 })
        .set('.fs-check-path', { strokeDashoffset: CHECK_LEN });

      return () => tl.kill();
    },
  );
});

onBeforeUnmount(() => {
  mm?.revert();
  mm = null;
});
</script>

<template>
  <div class="relative">
    <!-- 航线场景。背景（落光 + 点阵）铺在面板整幅上，不放在 SVG 里 ——
         SVG 被面板的 px-9 缩进过，背景画在 SVG 里会在面板内圈露出一道硬边。
         viewBox 高度收到 296：内容实际只占 y 60~280，留 330 会在底部空出一截白。 -->
    <div class="panel bg-surface relative overflow-hidden rounded-[28px]">
      <div
        aria-hidden="true"
        class="pointer-events-none absolute inset-0"
        style="
          background-image:
            radial-gradient(30rem 18rem at 50% -14%, oklch(0.9321 0.1974 104.65 / 0.22), transparent 70%),
            radial-gradient(circle at center, oklch(0.18 0.02 95 / 0.09) 1px, transparent 1.3px);
          background-size:
            auto,
            26px 26px;
        "
      ></div>
      <div class="relative px-6 pt-9 pb-9 sm:px-9 sm:pt-11 sm:pb-11">
        <svg viewBox="0 0 480 296" class="block h-auto w-full" aria-hidden="true">
          <defs>
            <!-- 货源卡缩略图的浅黄底 -->
            <linearGradient id="fs-thumb" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="var(--accent)" stop-opacity="0.42" />
              <stop offset="1" stop-color="var(--accent)" stop-opacity="0.12" />
            </linearGradient>
          </defs>

          <!-- ── 货源：一张来源站页面卡 + 后面两枚站点点 ─────────────── -->
          <g>
            <!-- 极轻厚度：卡背后垫一层暖黄，只露 12px（PROFILE.md「几乎察觉不到的极轻厚度」） -->
            <rect x="28" y="96" width="118" height="88" rx="22" fill="var(--accent)" fill-opacity="0.42" />
            <rect x="16" y="84" width="118" height="88" rx="22" fill="var(--surface)" />
            <rect x="16" y="84" width="118" height="88" rx="22" fill="none" stroke="var(--hairline)" stroke-width="1" />

            <rect x="30" y="98" width="36" height="36" rx="12" fill="url(#fs-thumb)" />
            <rect x="76" y="104" width="46" height="6" rx="3" fill="var(--ink)" fill-opacity="0.18" />
            <rect x="76" y="117" width="30" height="6" rx="3" fill="var(--ink)" fill-opacity="0.11" />
            <rect x="30" y="142" width="92" height="6" rx="3" fill="var(--ink)" fill-opacity="0.1" />
            <rect x="30" y="154" width="58" height="6" rx="3" fill="var(--ink)" fill-opacity="0.1" />

            <!-- 缩略图里的箱子符号 -->
            <g
              stroke="var(--ink)"
              stroke-opacity="0.45"
              stroke-width="1.6"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M40 111h16v14H40z" />
              <path d="M40 116h16M48 116v9" />
            </g>

            <!-- 另外两个来源：上方的两枚小点 -->
            <circle cx="104" cy="72" r="5" fill="var(--accent)" />
            <circle cx="124" cy="60" r="5" fill="var(--accent)" fill-opacity="0.45" />
          </g>

          <!-- ── 航线：货源 → Noon 的虚线弧 ──────────────────────────── -->
          <path
            class="fs-route"
            d="M134 126C188 66 250 74 296 128"
            fill="none"
            stroke="var(--ink)"
            stroke-opacity="0.22"
            stroke-width="2"
            stroke-linecap="round"
            stroke-dasharray="3 9"
          />
          <!-- 三个站点：采集 / 翻译 / 上架 -->
          <circle
            class="fs-station-1"
            cx="192.6"
            cy="87"
            r="4"
            fill="var(--surface)"
            stroke="var(--ink)"
            stroke-opacity="0.28"
            stroke-width="1.6"
          />
          <circle
            class="fs-station-2"
            cx="218"
            cy="84.3"
            r="4"
            fill="var(--surface)"
            stroke="var(--ink)"
            stroke-opacity="0.28"
            stroke-width="1.6"
          />
          <circle
            class="fs-station-3"
            cx="242.9"
            cy="89.1"
            r="4"
            fill="var(--surface)"
            stroke="var(--ink)"
            stroke-opacity="0.28"
            stroke-width="1.6"
          />

          <!-- 翻译步骤：lucide languages 描边，不依赖字体 -->
          <g transform="translate(196 108)">
            <rect x="-17" y="-15" width="34" height="30" rx="13" fill="var(--surface)" />
            <rect x="-17" y="-15" width="34" height="30" rx="13" fill="none" stroke="var(--ink)" stroke-opacity="0.1" />
            <g
              stroke="var(--ink)"
              stroke-opacity="0.62"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              transform="translate(-8 -8) scale(0.66)"
            >
              <path d="m5 8 6 6" />
              <path d="m4 14 6-6 2-3" />
              <path d="M2 5h12" />
              <path d="M7 2h1" />
              <path d="m22 22-5-10-5 10" />
              <path d="M14 18h6" />
            </g>
          </g>

          <!-- 航线上待上架的包裹 -->
          <g class="fs-parcel">
            <rect x="242" y="60" width="30" height="26" rx="9" fill="var(--accent)" />
            <g
              stroke="var(--ink)"
              stroke-opacity="0.45"
              stroke-width="1.6"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M250 68h14v10h-14z" />
              <path d="M250 72h14M257 72v6" />
            </g>
          </g>

          <!-- ── Noon 商品卡：极轻厚度 + 白面 ───────────────────────── -->
          <rect x="298" y="70" width="164" height="212" rx="28" fill="var(--accent)" fill-opacity="0.5" />
          <rect x="292" y="64" width="164" height="212" rx="28" fill="var(--surface)" />

          <rect x="310" y="82" width="128" height="92" rx="20" fill="url(#fs-thumb)" />
          <g
            stroke="var(--ink)"
            stroke-opacity="0.4"
            stroke-width="1.8"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M358 118h32v30h-32z" />
            <path d="M358 129h32M374 129v19" />
          </g>

          <rect x="310" y="190" width="104" height="8" rx="4" fill="var(--ink)" fill-opacity="0.2" />
          <rect x="310" y="206" width="72" height="8" rx="4" fill="var(--ink)" fill-opacity="0.12" />

          <!-- 价格 chip -->
          <rect x="310" y="228" width="62" height="26" rx="13" fill="var(--accent)" />
          <rect x="322" y="238" width="38" height="6" rx="3" fill="var(--ink)" fill-opacity="0.55" />

          <!-- 上架完成对勾：浮在卡片右上角外一点 -->
          <g class="fs-check" transform="translate(452 76)">
            <circle r="19" fill="var(--accent)" />
            <path
              class="fs-check-path"
              d="m-7 0 5 5 9-10"
              fill="none"
              stroke="var(--ink)"
              stroke-width="2.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </g>

          <!-- 乐天感的小星屑 -->
          <g fill="var(--accent)">
            <path d="M266 200l3.4 7.6 7.6 3.4-7.6 3.4-3.4 7.6-3.4-7.6-7.6-3.4 7.6-3.4z" />
            <path d="M150 232l2.4 5.4 5.4 2.4-5.4 2.4-2.4 5.4-2.4-5.4-5.4-2.4 5.4-2.4z" opacity="0.75" />
            <path d="M414 224l1.8 4 4 1.8-4 1.8-1.8 4-1.8-4-4-1.8 4-1.8z" opacity="0.6" />
          </g>
        </svg>
      </div>
    </div>

    <!-- Nomu 从右下"钻出来"：压在场景面板的右下角外。
           放在 panel 外面 —— panel 有 overflow-hidden（要点阵和落光裁成圆角），
           放里面这只 chick 会被裁成一个齐边的方块，正好丢掉"钻出来"的姿态。
           源图是 1000×1000 黄底方块、chick 只占中下部，整张缩下来是一大块空黄，
           所以在裁好的小方块里把图放大到 180% 再往左上推，让脸填满框。 -->
    <div
      v-if="mascot"
      class="pointer-events-none absolute -right-3 -bottom-7 size-[108px] overflow-hidden rounded-[26px] shadow-[var(--shadow-float)] select-none sm:-right-5 sm:size-[130px] sm:rounded-[30px]"
    >
      <!-- 吉祥物是装饰：含义由同一张图里 aria-hidden 的航线 SVG 演出，旁边的
           标题也已经点名 Nomu。alt="" 才是对的，补描述等于让读屏用户把同一句话
           听两遍。alt 一律留空，别再给这个组件加 mascotAlt —— 之前那个 prop
           默认空串、没人传，渲染出来就是个看着像忘了填的 alt=""。 -->
      <img :src="mascot" alt="" aria-hidden="true" />
    </div>
  </div>
</template>
