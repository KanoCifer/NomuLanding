/**
 * i18n key 自检 —— 文案跟着模块走之后，最容易出的错是「改了一处、忘了另一处」：
 *
 * 1. 漏改调用点：`t('credits.titel')` 拼错、`noonTool.` 前缀没清干净。
 *    vue-i18n 在本项目没开类型（createI18n 没传泛型），vue-tsc 抓不到，
 *    漏掉的 key 线上不报错，只是把 "credits.titel" 原样渲染出来。
 * 2. 双语不同构：zh 加了 key、en 忘了加，英文用户就看到裸 key。
 * 3. 跨模块串用：某个页面引用了不属于自己模块的 key，文案又被拆到别的文件里。
 *
 * 不引测试框架，跑法就是 `node scripts/check-i18n-keys.mjs`（已挂在 build 末尾）。
 */
import { readFileSync, existsSync, globSync } from 'node:fs';
import { resolve, relative } from 'node:path';

const SRC = resolve(import.meta.dirname, '../src');
const failures = [];

function check(ok, message) {
  if (!ok) failures.push(message);
}

/* 1. 载入 messages。各 locale 文件除了结尾的 `as const` 没有别的 TS 语法，
   去掉它就是纯数据，用 data URL 直接 import，不用为这个脚本拉构建工具。
   绑定名以 Zh / En 结尾，决定它归进哪份语言包。 */
async function load() {
  const index = readFileSync(resolve(SRC, 'locales/index.ts'), 'utf8');
  const entries = [...index.matchAll(/^import\s+(\w+)\s+from\s+'([^']+)';/gm)];

  check(entries.length > 0, 'locales/index.ts 里没解析到任何 import');

  const messages = { 'zh-CN': {}, en: {} };
  for (const [, binding, specifier] of entries) {
    // `@/x` 指向 src/，相对路径以 locales/index.ts 自己的目录为基准
    const base = specifier.startsWith('@/') ? SRC : resolve(SRC, 'locales');
    const path = resolve(base, `${specifier.replace(/^@\//, '')}.ts`);
    check(existsSync(path), `locales/index.ts 引用的 ${specifier} 不存在`);
    if (!existsSync(path)) continue;
    const code = readFileSync(path, 'utf8').replace(/\bas const;?\s*$/, ';');
    const mod = await import(`data:text/javascript,${encodeURIComponent(code)}`);
    const locale = binding.endsWith('Zh') ? 'zh-CN' : 'en';
    Object.assign(messages[locale], mod.default);
  }
  return messages;
}

/** 摊平出所有叶子 key 路径；数组也算叶子（tm() 取整个数组）。 */
function leaves(node, prefix = '', out = new Set()) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) {
    out.add(prefix);
    return out;
  }
  for (const [k, v] of Object.entries(node)) leaves(v, prefix ? `${prefix}.${k}` : k, out);
  return out;
}

/** 查路径是否落在一个分支上（动态 key 只知道静态前缀，能验到这里就够了）。 */
function hasBranch(messages, path) {
  let node = messages;
  for (const seg of path.split('.')) {
    if (node === null || typeof node !== 'object' || Array.isArray(node)) return false;
    if (!(seg in node)) return false;
    node = node[seg];
  }
  return true;
}

const messages = await load();
const zhLeaves = leaves(messages['zh-CN']);
const enLeaves = leaves(messages.en);
check(zhLeaves.size > 0, 'zh-CN 文案是空的');
if (zhLeaves.size === 0) {
  console.error('[i18n 自检] locale 文件没载入成功，先修聚合入口');
  process.exit(1);
}

/* 2. 双语同构 */
for (const key of zhLeaves) check(enLeaves.has(key), `en 缺 key「${key}」`);
for (const key of enLeaves) check(zhLeaves.has(key), `zh-CN 缺 key「${key}」`);

/* 3. 调用点逐个解析。覆盖 t() / tm() / $t() 与 <i18n-t keypath>。
   模板字符串只取 ${} 之前的静态前缀 —— 运行时的值这里无从得知，
   但前缀写错（少一层、拼错）照样能挑出来。 */
const REFS = [
  { re: /(?:tm|\$t|\bt)\(\s*'([^']+)'/g, kind: '字面量', take: (m) => m[1] },
  { re: /(?:tm|\$t|\bt)\(\s*`([^`]*)`/g, kind: '模板静态段', take: (m) => m[1].split('${')[0].replace(/\.+$/, '') },
  { re: /keypath="([^"]+)"/g, kind: 'keypath', take: (m) => m[1] },
];

const files = globSync('**/*.{vue,ts}', { cwd: SRC }).filter((f) => !f.startsWith('locales/') && !f.includes('/i18n/'));
for (const file of files) {
  const src = readFileSync(resolve(SRC, file), 'utf8');
  for (const { re, kind, take } of REFS) {
    for (const m of src.matchAll(re)) {
      const key = take(m).trim();
      // 整段都由 ${} 拼出来的话没有静态前缀可验，跳过
      if (!key) continue;
      for (const [name, bundle] of Object.entries(messages)) {
        if (!hasBranch(bundle, key)) {
          failures.push(`${file}: ${kind}「${key}」在 ${name} 里不存在`);
        }
      }
    }
  }
}

if (failures.length > 0) {
  // 同一个拼错的 key 会在多处调用点重复报，去重后好读
  const unique = [...new Set(failures)];
  console.error(`\n[i18n 自检] ${unique.length} 项不通过：`);
  for (const f of unique) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log(`[i18n 自检] 通过：${files.length} 个源文件、${zhLeaves.size} 个 key，zh-CN / en 同构`);
