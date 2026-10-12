// Fails when a text/background token pair in globals.css is below WCAG AA (4.5:1), in light or dark.
// Translucent colors (e.g. the dark highlight) are composited over --canvas first.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const DARK = /:root\[data-theme="dark"\]\s*\{([^}]*)\}/;
const SYSTEM_DARK = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{([^}]*)\}\s*\}/;
const PAIRS = [
  ["--fg", "--canvas"],
  ["--fg-muted", "--canvas"],
  ["--fg-subtle", "--canvas"],
  ["--on-inverted", "--inverted"],
  ["--fg", "--highlight"],
];

function fail(message) {
  console.error(`check-contrast: ${message}`);
  process.exit(1);
}

const declarations = (block) =>
  Object.fromEntries([...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((m) => [m[1], m[2].trim()]));

// Dark tokens appear twice: for an explicit choice and for the system preference when no choice is stored.
const darkMatch = css.match(DARK);
const systemMatch = css.match(SYSTEM_DARK);
if (!darkMatch) fail(':root[data-theme="dark"] block not found');
if (!systemMatch) fail("prefers-color-scheme dark block not found");
if (JSON.stringify(declarations(darkMatch[1])) !== JSON.stringify(declarations(systemMatch[1])))
  fail("the two dark-token blocks differ — keep them identical");
const lightCss = css.replace(SYSTEM_DARK, "").replace(DARK, "");
const light = Object.assign({}, ...[...lightCss.matchAll(/:root[^{]*\{([^}]*)\}/g)].map((m) => declarations(m[1])));
const dark = { ...light, ...declarations(darkMatch[1]) };

function resolve(map, name, seen = new Set()) {
  const value = map[name];
  if (value === undefined) fail(`${name} is not defined`);
  const ref = value.match(/^var\((--[\w-]+)\)$/);
  if (!ref) return value;
  if (seen.has(name)) fail(`var() cycle at ${name}`);
  seen.add(name);
  return resolve(map, ref[1], seen);
}

function parse(color) {
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) return { rgb: [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16)), a: 1 };
  const rgb = color.match(/^rgb\(\s*(\d+)\s+(\d+)\s+(\d+)\s*(?:\/\s*([\d.]+))?\s*\)$/);
  if (rgb) return { rgb: rgb.slice(1, 4).map(Number), a: rgb[4] === undefined ? 1 : Number(rgb[4]) };
  fail(`unsupported color "${color}"`);
}

const over = (top, bottom) => top.rgb.map((c, i) => c * top.a + bottom[i] * (1 - top.a));

function luminance(rgb) {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

const ratio = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Text on the highlight must use --fg (the pair checked above), never inherit a lighter token.
const highlightRule = css.match(/mark\.hl\s*\{([^}]*)\}/);
if (!highlightRule || !/color:\s*var\(--fg\)\s*;/.test(highlightRule[1])) fail("mark.hl must set color: var(--fg)");

let failures = 0;
for (const [scheme, map] of [["light", light], ["dark", dark]]) {
  const canvas = parse(resolve(map, "--canvas"));
  if (canvas.a !== 1) fail(`${scheme} --canvas must be opaque`);
  for (const [fg, bg] of PAIRS) {
    const bgRgb = over(parse(resolve(map, bg)), canvas.rgb);
    const fgRgb = over(parse(resolve(map, fg)), bgRgb);
    const r = ratio(fgRgb, bgRgb);
    const ok = r >= 4.5;
    if (!ok) failures++;
    console.log(`${ok ? "ok  " : "FAIL"} ${scheme.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)}`);
  }
}
if (failures) fail(`${failures} pair(s) below 4.5:1`);
