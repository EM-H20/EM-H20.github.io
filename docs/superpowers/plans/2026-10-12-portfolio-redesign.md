# Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Re-skin the finished portfolio from the Vercel style to the warm jeong-min.com tone: 720px column, GmarketSans display type, greeting with a rotating typed word, black chip section titles, round-icon lists, yellow highlight.

**Architecture:** Replace the token layer in `globals.css`, add a subset display font via `next/font/local`, add small presentational components (`Chip`, `Highlight`, `IconCircle`, `InfoLines`) and one client component (`RotatingWord`, driven by a pure state machine in `src/lib/rotating.ts`). Rewrite the home sections, blog and `/print` styling on top; delete the Vercel-only components. Data (`profile.ts`), `ImageSlot`, PDF generation and deploy stay as they are.

**Tech Stack:** Next.js 16.4 (static export), React 19.3, Tailwind CSS 4.3, TypeScript, `next/font/local`, Pretendard 1.3.9, GmarketSans (SIL OFL 1.1 per third-party notices; subset with fonttools — probed 2026-10-12: full woff Light 547KB / Bold 615KB → subset woff2 122KB / 128KB), Node test runner.

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-redesign-design.md` (deltas) on top of `docs/superpowers/specs/2026-10-12-portfolio-design.md` (base).

## Global Constraints

- Static export only; no new runtime dependencies. fonttools/brotli are used once, in a throwaway venv, to build committed font files.
- Components use only the semantic tokens of Task 2 (`bg-canvas bg-surface text-fg text-fg-muted text-fg-subtle bg-inverted text-on-inverted border-hairline bg-dot`, `.hl`, `text-greet text-title-lg text-title text-chip text-body text-meta`, `rounded-btn`, `max-w-page`, `font-display font-sans`). Tailwind's default color palette stays disabled (`--color-*: initial`).
- Yellow (`--highlight`) is a background only (highlight/underline), never a text color.
- Text that carries information is never lighter than `fg-subtle` (≥ 4.5:1, enforced by `pnpm check:contrast`).
- Buttons and nav controls have a hit area ≥ 40px tall. Inline text links inside sentences/lists follow WCAG 2.5.8's inline exception.
- The only client JS is `RotatingWord`. No `setState` inside `useEffect` (lint error in this repo) — it mutates its text node through a ref.
- The hero greeting must never change height while the word types/deletes: word underline via `text-decoration` only, each greeting line `whitespace-nowrap`, size `text-greet` = `clamp(28px, 6.4vw, 40px)`.
- Every rotating word must take the particle '를' (no Hangul final consonant on the last syllable).
- No large number blocks ("AI-like" per user); counts appear inside sentences only.
- The subset font must not carry the reserved name "Gmarket Sans": family is renamed to `Elipair Display`, files are `display-light.woff2` / `display-bold.woff2`, and `src/fonts/OFL.txt` ships next to them.
- After editing `globals.css` theme tokens, verify against a fresh build/dev server (`rm -rf .next`) — Turbopack caches stale `@theme` output (found in the first build).
- Commits: `<type>: <description>` + blank line + `Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML`, chained with `&&` after the checks they depend on.

## Review Focus

1. **Greeting height while typing:** across every word (including the empty state and the longest word "빠른 출시") at 390px and 1280px, and before/after the display font loads, the greeting block keeps one height. Pinned in Task 5 Step 8 (12s height sampling) and Task 9.
2. **A word with a final consonant added later** (e.g. "사용자 경험") must fail a test instead of shipping "경험를". Pinned in Task 3 (negative control).
3. **Icon file missing:** a project whose `icon.png` is absent shows its emoji, with no broken image and no placeholder in production. Pinned in Task 6 Step 7 (remove-one-icon control).
4. **Dark mode highlight:** light text on the translucent yellow must stay ≥ 4.5:1 against the composited color. Pinned in Task 2 (contrast pairs + negative control).
5. **Reduced motion / no JS / assistive tech:** the first word is shown complete, the caret is hidden under reduced motion, and assistive tech reads the greeting once as one sentence. Pinned in Task 5 Step 8.

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `scripts/subset-display-font.sh` | create | One-time build of the subset display font (documented, reproducible) |
| `src/fonts/display-light.woff2`, `display-bold.woff2`, `OFL.txt` | create | Committed subset font + license |
| `src/app/layout.tsx` | modify | Load display font, drop Geist |
| `src/app/globals.css` | rewrite | New tokens, highlight, rotating-word caret, skeleton, print |
| `scripts/check-contrast.mjs` | rewrite | New pairs + alpha compositing |
| `src/content/profile.ts` (+ `.test.ts`) | modify | `emoji`, `.png` icons, `hero.words`, `heroInfo()`; drop `cliLines` (Task 6) |
| `src/lib/rotating.ts` (+ `.test.ts`) | create | Pure typing-loop state machine |
| `src/components/ui/RotatingWord.tsx` | create | Client component driving the word |
| `src/components/ui/Chip.tsx`, `Highlight.tsx`, `IconCircle.tsx`, `InfoLines.tsx` | create | New primitives |
| `src/components/ui/Button.tsx`, `Container.tsx`, `Nav.tsx`, `ImageSlot.tsx` | modify | New look; `Section` takes `chip` (Task 6) |
| `src/components/sections/Hero.tsx` | rewrite | Greeting + info lines |
| `src/components/sections/Projects.tsx` | rewrite | Featured + major + minor rows |
| `src/components/sections/Awards.tsx`, `Stack.tsx`, `Contact.tsx` | rewrite | New list styles |
| `src/components/sections/Featured.tsx`, `ui/Card.tsx`, `ui/Tag.tsx`, `ui/CliPanel.tsx`, `ui/Typewriter.tsx`, `ui/Eyebrow.tsx`, `src/lib/typing.ts(+test)` | delete | Vercel-only pieces |
| `src/app/(site)/design/page.tsx` | rewrite | New gallery |
| `src/app/(site)/blog/**`, `src/mdx-components.tsx` | modify | New look |
| `src/app/print/page.tsx` | modify | Class swaps for removed tokens; display font headings |
| `README.md` | modify | Font build + license note |

---

### Task 1: Subset display font

**Files:**
- Create: `scripts/subset-display-font.sh`, `src/fonts/display-light.woff2`, `src/fonts/display-bold.woff2`, `src/fonts/OFL.txt`
- Modify: `src/app/layout.tsx`

**Interfaces:**
- Produces: CSS variable `--font-gmarket` on `<html>` (consumed by Task 2's `--font-display`).

- [ ] **Step 1: License check (gate)**

Search once more for an official Gmarket/eBay Korea license page for "Gmarket Sans". If an official page states terms that forbid self-hosting or modification, STOP and report to the user. Otherwise continue with the third-party-documented terms (SIL OFL 1.1, © 2019 eBay Korea Co., Ltd., Reserved Font Name "Gmarket Sans Font") and record a ledger ruling.

- [ ] **Step 2: Write `scripts/subset-display-font.sh`**

```bash
#!/usr/bin/env bash
# Builds src/fonts/display-{light,bold}.woff2 from GmarketSans (SIL OFL 1.1, © 2019 eBay Korea Co., Ltd.).
# Subset: KS X 1001 Hangul (2,350 syllables) + Latin/punctuation. Renamed to "Elipair Display" because the
# OFL forbids the Reserved Font Name on modified fonts. Needs fonttools + brotli:
#   python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip install fonttools brotli && PATH=/tmp/fontenv/bin:$PATH ./scripts/subset-display-font.sh
set -euo pipefail
OUT="$(cd "$(dirname "$0")/.." && pwd)/src/fonts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
mkdir -p "$OUT"

python3 - "$TMP/hangul.txt" <<'PY'
import sys
chars = [chr(c) for c in range(0xAC00, 0xD7A4) if len(chr(c).encode("euc_kr", "ignore")) == 2]
assert len(chars) == 2350, len(chars)
open(sys.argv[1], "w").write("".join(chars))
PY

for weight in Light Bold; do
  lower=$(printf '%s' "$weight" | tr '[:upper:]' '[:lower:]')
  curl -fsSL "https://fastly.jsdelivr.net/gh/projectnoonnu/noonfonts_2001@1.1/GmarketSans$weight.woff" -o "$TMP/$weight.woff"
  pyftsubset "$TMP/$weight.woff" \
    --text-file="$TMP/hangul.txt" \
    --unicodes="U+0020-007E,U+00A0-00FF,U+2010-2027,U+2030-205E,U+2190-21FF,U+3000-303F,U+3131-318E" \
    --layout-features='*' --flavor=woff2 --output-file="$TMP/$lower.woff2"
  python3 - "$TMP/$lower.woff2" "$OUT/display-$lower.woff2" "$weight" <<'PY'
import sys
from fontTools.ttLib import TTFont
src, dst, weight = sys.argv[1:]
names = {1: "Elipair Display", 3: f"Elipair Display {weight} subset", 4: f"Elipair Display {weight}",
         6: f"ElipairDisplay-{weight}", 16: "Elipair Display"}
font = TTFont(src)
for record in font["name"].names:
    if record.nameID in names:
        record.string = names[record.nameID]
font.flavor = "woff2"
font.save(dst)
PY
done

curl -fsSL https://openfontlicense.org/documents/OFL.txt | tail -n +6 > "$TMP/ofl-body.txt"
{
  echo "Copyright (c) 2019, eBay Korea Co., Ltd., with Reserved Font Name Gmarket Sans Font."
  echo "Modified (subset, renamed to \"Elipair Display\") for em-h20.github.io."
  cat "$TMP/ofl-body.txt"
} > "$OUT/OFL.txt"
ls -la "$OUT"
```

`chmod +x scripts/subset-display-font.sh`.

- [ ] **Step 3: Run it**

```bash
python3 -m venv /tmp/fontenv && /tmp/fontenv/bin/pip -q install fonttools brotli
PATH=/tmp/fontenv/bin:$PATH ./scripts/subset-display-font.sh
```

Expected: `display-light.woff2` ≈ 122KB, `display-bold.woff2` ≈ 128KB (both < 200KB), `OFL.txt` present.

- [ ] **Step 4: Verify name and coverage (the test for this task)**

```bash
/tmp/fontenv/bin/python -I - <<'PY'
from fontTools.ttLib import TTFont
need = "안녕하세요!를좋아하는개발자홍의민입니다.함께일해요경찰과도둑트립게더완익세종우주공부선냥생뭐였니?플래닝은샘침례교회대상특별상우수창업아이템상선정본선진출장려상글 Email.Education.Awards.Shipped.Mobile.Frontend.Backend.Data&RealtimeDevOpsprojectsawardsblogPDFgithubElipairPROJECTSAWARDSSTACKCONTACTPOSTS메일보내기포트폴리오1stPlace"
for w in ("light", "bold"):
    f = TTFont(f"src/fonts/display-{w}.woff2")
    family = {r.nameID: r.toUnicode() for r in f["name"].names}.get(1)
    missing = sorted({c for c in need if c.strip() and ord(c) not in f.getBestCmap()})
    print(w, family, "missing:", missing)
    assert family == "Elipair Display" and not missing
PY
```

Expected: both lines print `Elipair Display missing: []`. A negative control: append `똠` (not in KS X 1001) to `need` — expect it listed as missing — then remove it.

- [ ] **Step 5: Load the font in `src/app/layout.tsx`**

Replace the Geist imports and constants with:

```tsx
import localFont from "next/font/local";
```

```tsx
const display = localFont({
  src: [
    { path: "../fonts/display-light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/display-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gmarket",
  display: "swap",
});
```

and the `<html>` className becomes `` `${display.variable} h-full antialiased` ``. Keep the Pretendard CSS import, `imageExists`/`ogImage` metadata and the body classes as they are.

- [ ] **Step 6: Build and commit**

```bash
rm -rf .next && pnpm -s lint && pnpm build && ls out/_next/static/media | grep -c woff2 \
&& git add scripts/subset-display-font.sh src/fonts src/app/layout.tsx \
&& git commit -m "feat: add subset display font (GmarketSans as Elipair Display)

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

Expected: build succeeds (Geist classes no longer exist, the old `font-mono` falls back to the system stack until Task 2).

---

### Task 2: Tokens and contrast check

**Files:**
- Rewrite: `src/app/globals.css`, `scripts/check-contrast.mjs`

**Interfaces:**
- Consumes: `--font-gmarket` (Task 1).
- Produces: utilities `bg-canvas bg-surface text-fg text-fg-muted text-fg-subtle border-hairline bg-hairline bg-inverted text-on-inverted bg-dot`, `font-display font-sans`, `text-greet text-title-lg text-title text-chip text-body text-meta`, `rounded-btn`, `max-w-page`, `shadow-hairline`; classes `.hl`, `.rw-word`, `.rw-caret`, `.skeleton`, `.print-break`, `.print-block`, `.scheme-light`.

- [ ] **Step 1: Rewrite `scripts/check-contrast.mjs` (the test)**

```js
// Fails when a text/background token pair in globals.css is below WCAG AA (4.5:1), in light or dark.
// Translucent colors (e.g. the dark highlight) are composited over --canvas first.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const DARK = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]*)\}\s*\}/;
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

const darkMatch = css.match(DARK);
if (!darkMatch) fail("dark-mode :root block not found");
const lightCss = css.replace(DARK, "");
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
```

- [ ] **Step 2: Run it against the current CSS — expect failure**

Run: `pnpm -s check:contrast` — Expected: exit 1 (`--highlight is not defined`).

- [ ] **Step 3: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";

/* Semantic tokens, light. `.scheme-light` re-pins them so /print stays light under a dark OS. */
:root,
.scheme-light {
  --canvas: #ffffff;
  --surface: #f4f4f4;
  --fg: #0f1010;
  --fg-muted: #4d4d4d;
  --fg-subtle: #6b6b6b;
  --hairline: #ebebeb;
  --inverted: #0f1010;
  --on-inverted: #ffffff;
  --highlight: #ffe14d;
  --dot: #f5b800;
}

@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #0f1010;
    --surface: #1c1c1c;
    --fg: #ededed;
    --fg-muted: #b4b4b4;
    --fg-subtle: #8f8f8f;
    --hairline: #2a2a2a;
    --inverted: #ededed;
    --on-inverted: #0f1010;
    --highlight: rgb(255 225 77 / 0.35);
  }
}

@theme {
  --color-*: initial;

  --text-greet: clamp(28px, 6.4vw, 40px);
  --text-greet--line-height: 1.22;
  --text-title-lg: 30px;
  --text-title-lg--line-height: 1.2;
  --text-title: 18px;
  --text-title--line-height: 1.4;
  --text-chip: 20px;
  --text-chip--line-height: 1;
  --text-body: 16px;
  --text-body--line-height: 1.6;
  --text-meta: 14px;
  --text-meta--line-height: 1.5;

  --radius-btn: 8px;
  --container-page: 720px;
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-subtle: var(--fg-subtle);
  --color-hairline: var(--hairline);
  --color-inverted: var(--inverted);
  --color-on-inverted: var(--on-inverted);
  --color-dot: var(--dot);

  --font-sans: "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  /* Subset display font; glyphs outside it fall back to Pretendard. */
  --font-display: var(--font-gmarket), "Pretendard Variable", Pretendard, sans-serif;

  --shadow-hairline: inset 0 0 0 1px var(--hairline);
}

@layer components {
  mark.hl {
    color: inherit;
    background: linear-gradient(transparent 62%, var(--highlight) 62%);
    padding: 0 2px;
  }

  /* Rotating word: decoration and an inline-block caret of fixed height never change the line box. */
  .rw-word {
    text-decoration: underline 3px var(--highlight);
    text-decoration-skip-ink: none;
    text-underline-offset: 6px;
  }
  .rw-caret {
    display: inline-block;
    width: 2px;
    height: 0.9em;
    margin-left: 2px;
    vertical-align: -0.08em;
    background: currentColor;
    animation: caret-blink 1s step-end infinite;
  }

  .skeleton {
    background: linear-gradient(90deg, var(--surface) 25%, var(--canvas) 50%, var(--surface) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s linear infinite;
  }

  .print-break {
    break-before: page;
  }
  .print-block {
    break-inside: avoid;
  }
}

@media (prefers-reduced-motion: reduce), print {
  .rw-caret {
    display: none;
  }
  .skeleton {
    animation: none;
    background: var(--surface);
  }
}

@page {
  size: A4;
  margin: 16mm;
}

@media print {
  body {
    background: var(--canvas);
  }
}

@keyframes caret-blink {
  50% { opacity: 0; }
}
@keyframes skeleton-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
```

- [ ] **Step 4: Run the contrast check — expect pass, then negative control**

Run: `pnpm -s check:contrast` — Expected: 10 `ok` lines (light `--fg on --highlight` ≈ 14.6, dark `--fg on --highlight` ≈ 6.0 after compositing), exit 0.
Negative control: set the dark `--highlight` to `rgb(255 225 77 / 0.9)` → expect `FAIL dark --fg on --highlight`, exit 1; revert, re-run → exit 0.

- [ ] **Step 5: Build (fresh) and commit**

```bash
rm -rf .next && pnpm -s lint && pnpm build \
&& css=$(find out -name '*.css' -exec cat {} +) && echo "$css" | grep -c 'rw-word' && echo "$css" | grep -o -- '--text-greet:[^;}]*' | head -1 \
&& git add src/app/globals.css scripts/check-contrast.mjs \
&& git commit -m "feat: replace design tokens with the warm redesign palette

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

Expected: `rw-word` count ≥ 1 (freshness marker), `--text-greet:clamp(28px,6.4vw,40px)`. Pages look unstyled in places until Tasks 4–8 — expected.

---

### Task 3: Content updates

**Files:**
- Modify: `src/content/profile.ts`, `src/content/profile.test.ts`

**Interfaces:**
- Produces: `Project.emoji: string`; `featured.emoji: string`; `featured.icon` and project `icon` → `/images/projects/<slug>/icon.png`; icons on tripgether, space-study-ship, eunsaem, nyangseng (in addition to block-drag, rulebook, featured); `hero.words: string[]`; `type InfoLine = { label: string; value: string }`; `heroInfo(): InfoLine[]`. `cliLines` stays until Task 6.

- [ ] **Step 1: Add failing tests to `src/content/profile.test.ts`**

Change the import line to `import { allImages, cliLines, featured, hero, heroInfo, heroStats, projects } from "./profile.ts";` and append:

```ts
// '를' attaches to words whose last syllable has no final consonant; non-Hangul endings (React, UX) read fine.
const takesReul = (word: string) => {
  const code = word.charCodeAt(word.length - 1);
  return code < 0xac00 || code > 0xd7a3 || (code - 0xac00) % 28 === 0;
};

test("every rotating hero word takes the particle 를", () => {
  assert.ok(hero.words.length >= 2, "need at least two words to rotate");
  for (const word of hero.words) assert.ok(takesReul(word), `"${word}를" is ungrammatical`);
});

test("hero info lines are derived from profile data", () => {
  assert.deepEqual(heroInfo(), [
    { label: "Email", value: "elipair0106@gmail.com" },
    { label: "Education", value: "세종대학교 컴퓨터공학과 · SQLD" },
    { label: "Awards", value: "Google I/O Extended 1st Place 외 수상·선정 8건" },
    { label: "Shipped", value: "경찰과도둑 · Block Drag · RuleBook" },
  ]);
});

test("every project has an emoji fallback for its icon", () => {
  for (const item of [featured, ...projects]) assert.ok(item.emoji.length > 0, item.name);
});

test("app icons point at the committed png files", () => {
  const icons = [featured, ...projects].flatMap((p) => (p.icon ? [p.icon.src] : []));
  assert.deepEqual(icons.sort(), [
    "/images/projects/block-drag/icon.png",
    "/images/projects/cops-and-robbers/icon.png",
    "/images/projects/eunsaem/icon.png",
    "/images/projects/nyangseng/icon.png",
    "/images/projects/rulebook/icon.png",
    "/images/projects/space-study-ship/icon.png",
    "/images/projects/tripgether/icon.png",
  ]);
});
```

- [ ] **Step 2: Run — expect failures**

Run: `pnpm -s test` — Expected: fails (`hero.words` undefined / `heroInfo` not exported).

- [ ] **Step 3: Update `src/content/profile.ts`**

1. In `type Project`, add after `name: string;`:
   ```ts
     /** Shown in the round icon when no app icon file exists. */
     emoji: string;
   ```
2. Change `appIcon` to:
   ```ts
   const appIcon = (slug: string, name: string): ImageSpec => ({
     src: `/images/projects/${slug}/icon.png`,
     alt: `${name} 앱 아이콘`,
     aspect: "square",
     brief: `${name} 앱 아이콘 (정사각 PNG, 160px 이상)`,
   });
   ```
3. Add `words` to `hero` (after `alias`): `words: ["Flutter", "UX", "React", "빠른 출시", "Next.js"],`
4. Add `emoji: "🚔",` to `featured` (after `name`).
5. Add an `emoji` to every project (after `name`) and the new `icon` lines:

   | slug | emoji | icon |
   |---|---|---|
   | party-passport | `🛂` | — |
   | tripgether | `✈️` | `icon: appIcon("tripgether", "트립게더"),` |
   | stocker | `📈` | — |
   | block-drag | `🧩` | (already) |
   | rulebook | `📖` | (already) |
   | wanik-sejong | `🎓` | — |
   | space-study-ship | `🚀` | `icon: appIcon("space-study-ship", "우주공부선"),` |
   | second-brain-template | `🧠` | — |
   | emotion-diary | `📔` | — |
   | nyangseng | `🐱` | `icon: appIcon("nyangseng", "냥생뭐였니?"),` |
   | planning | `🤖` | — |
   | eunsaem | `⛪` | `icon: appIcon("eunsaem", "은샘침례교회"),` |

6. Add after `heroStats`:
   ```ts
   export type InfoLine = { label: string; value: string };

   export function heroInfo(): InfoLine[] {
     return [
       { label: "Email", value: links.email.label },
       { label: "Education", value: [education.school, ...education.certifications].join(" · ") },
       { label: "Awards", value: `${hero.topAward} 외 수상·선정 ${awards.length - 1}건` },
       { label: "Shipped", value: shippedNames().join(" · ") },
     ];
   }
   ```

- [ ] **Step 4: Run — expect pass; then negative control**

Run: `pnpm -s test` — Expected: all pass (previous 9 + 4 new).
Negative control: temporarily add `"사용자 경험"` to `hero.words` → expect `"사용자 경험를" is ungrammatical`; revert → pass.

- [ ] **Step 5: Build and commit**

```bash
pnpm -s lint && pnpm build && pnpm -s test \
&& git add src/content/profile.ts src/content/profile.test.ts \
&& git commit -m "feat: add emoji, png icons, rotating words and hero info to profile

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 4: Primitives, Nav and /design

**Files:**
- Create: `src/components/ui/Chip.tsx`, `Highlight.tsx`, `IconCircle.tsx`, `InfoLines.tsx`
- Modify: `src/components/ui/Button.tsx`, `src/components/ui/Container.tsx` (Container only), `src/components/ui/Nav.tsx`, `src/components/ui/ImageSlot.tsx`
- Rewrite: `src/app/(site)/design/page.tsx`

**Interfaces:**
- Consumes: tokens (Task 2), `ImageSpec`, `InfoLine`, `heroInfo`, `featured`, `projects`, `allImages`, `links`, `site.pdf`.
- Produces:
  - `Chip({ as?: "h1" | "h2" | "p"; id?: string; children })`
  - `Highlight({ children })` → `<mark class="hl">`
  - `IconCircle({ icon?: ImageSpec; emoji: string; size?: 56 | 40 })`
  - `InfoLines({ lines: readonly InfoLine[]; className?: string })`
  - `Button` — same props; variants restyled (`primary | ghost | pill | text`)
  - `Container({ className?, children })` — 720px

- [ ] **Step 1: Create the four primitives**

`src/components/ui/Chip.tsx`:

```tsx
import type { ReactNode } from "react";

export function Chip({ as: Tag = "h2", id, children }: { as?: "h1" | "h2" | "p"; id?: string; children: ReactNode }) {
  return (
    <Tag id={id} className="inline-block bg-inverted px-3 pt-2 pb-1.5 font-display text-chip font-bold text-on-inverted">
      {children}
    </Tag>
  );
}
```

`src/components/ui/Highlight.tsx`:

```tsx
import type { ReactNode } from "react";

export function Highlight({ children }: { children: ReactNode }) {
  return <mark className="hl">{children}</mark>;
}
```

`src/components/ui/IconCircle.tsx`:

```tsx
import Image from "next/image";
import { imageExists } from "@/components/ui/ImageSlot";
import type { ImageSpec } from "@/content/profile";

const SIZES = { 56: "size-14 text-[28px]", 40: "size-10 text-xl" } as const;

// App icon when its file exists at build time, emoji otherwise — no placeholder, no broken image.
export function IconCircle({ icon, emoji, size = 56 }: { icon?: ImageSpec; emoji: string; size?: keyof typeof SIZES }) {
  const src = icon && imageExists(icon.src) ? icon.src : undefined;
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface ${SIZES[size]}`}>
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden="true">{emoji}</span>
      )}
    </span>
  );
}
```

`src/components/ui/InfoLines.tsx`:

```tsx
import type { InfoLine } from "@/content/profile";

export function InfoLines({ lines, className = "" }: { lines: readonly InfoLine[]; className?: string }) {
  return (
    <dl className={`text-[15px] leading-[1.8] ${className}`}>
      {lines.map((line) => (
        <div key={line.label} className="flex flex-wrap gap-x-1.5">
          <dt className="font-display font-bold text-fg before:mr-2 before:inline-block before:size-1.5 before:rounded-full before:bg-dot before:align-[2px]">
            {line.label}.
          </dt>
          <dd className="text-fg-subtle">{line.value}</dd>
        </div>
      ))}
    </dl>
  );
}
```

- [ ] **Step 2: Restyle `Button`**

Replace `BASE` and `VARIANTS` in `src/components/ui/Button.tsx`:

```tsx
const BASE =
  "inline-flex items-center justify-center font-display text-sm transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

const VARIANTS: Record<Variant, string> = {
  primary: "min-h-11 rounded-btn bg-inverted px-[18px] font-bold text-on-inverted hover:opacity-85",
  ghost: "min-h-11 rounded-btn px-[18px] font-bold text-fg shadow-hairline hover:opacity-70",
  // Visually 30px tall; the pseudo-element extends the hit area to 42px.
  pill: "relative h-[30px] rounded-full bg-inverted px-3 text-[13px] font-bold text-on-inverted before:absolute before:inset-x-0 before:-inset-y-1.5 hover:opacity-85",
  text: "min-h-10 font-light text-base text-fg underline-offset-4 hover:underline",
};
```

- [ ] **Step 3: Restyle `Container`**

In `src/components/ui/Container.tsx` change only the `Container` class string to `` `mx-auto w-full max-w-page px-5 sm:px-6 ${className}` ``. (`Section` is rewritten in Task 6.)

- [ ] **Step 4: Rewrite `Nav`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { links } from "@/content/profile";
import { site } from "@/lib/site";

const NAV_LINK = "inline-flex min-h-10 items-center text-fg underline-offset-4 hover:underline";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className={`${NAV_LINK} font-display text-base font-bold`}>
          {site.shortName}
        </Link>
        <nav aria-label="메뉴" className="flex items-center gap-3.5 font-display text-base font-bold">
          <Link href="/#projects" className={`${NAV_LINK} hidden sm:inline-flex`}>
            projects
          </Link>
          <Link href="/#awards" className={`${NAV_LINK} hidden sm:inline-flex`}>
            awards
          </Link>
          <Link href="/blog" className={NAV_LINK}>
            blog
          </Link>
          <span aria-hidden="true" className="h-3.5 w-px bg-hairline" />
          <Button href={links.github.href} variant="text">
            github
          </Button>
          <Button href={site.pdf.href} download={site.pdf.filename} variant="pill">
            PDF
          </Button>
        </nav>
      </Container>
    </header>
  );
}
```

- [ ] **Step 5: Restyle `ImageSlot` placeholder/radius**

In `src/components/ui/ImageSlot.tsx`: replace `rounded-card` with `rounded-xl` (both occurrences) and in the placeholder `div` replace `font-mono text-[11px]` with `text-[11px]`.

- [ ] **Step 6: Rewrite `/design`**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { IconCircle } from "@/components/ui/IconCircle";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { InfoLines } from "@/components/ui/InfoLines";
import { Skeleton } from "@/components/ui/Skeleton";
import { allImages, featured, heroInfo, projects } from "@/content/profile";

export const metadata: Metadata = { title: "Design", robots: { index: false } };

// Class names are listed literally so Tailwind generates them.
const SWATCHES = [
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["fg-subtle", "bg-fg-subtle"],
  ["hairline", "bg-hairline"],
  ["inverted", "bg-inverted"],
  ["dot", "bg-dot"],
] as const;

const TYPE = [
  ["greet", "font-display font-light text-greet"],
  ["title-lg", "font-display font-bold text-title-lg"],
  ["title", "text-title font-medium"],
  ["body", "text-body"],
  ["meta", "text-meta text-fg-subtle"],
] as const;

function Block({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <Chip as="p">{name}</Chip>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <main className="flex-1 py-12">
      <Container className="space-y-14">
        <Block name="COLORS">
          <ul className="grid grid-cols-4 gap-3">
            {SWATCHES.map(([name, cls]) => (
              <li key={name} className="space-y-1">
                <div className={`h-12 rounded-btn shadow-hairline ${cls}`} />
                <p className="text-meta text-fg-subtle">{name}</p>
              </li>
            ))}
          </ul>
          <p className="text-body">
            형광펜: <Highlight>세종 창업 아이디어 리그 대상</Highlight>
          </p>
        </Block>

        <Block name="TYPE">
          {TYPE.map(([name, cls]) => (
            <div key={name}>
              <p className="text-meta text-fg-subtle">{name}</p>
              <p className={cls}>안녕하세요! 개발자 홍의민입니다.</p>
            </div>
          ))}
        </Block>

        <Block name="BUTTONS">
          <div className="flex flex-wrap items-center gap-3">
            <Button href="mailto:test@example.com">메일 보내기</Button>
            <Button href="https://github.com" variant="ghost">
              PDF 포트폴리오
            </Button>
            <Button href="https://github.com" variant="pill">
              PDF
            </Button>
            <Button href="https://github.com" variant="text">
              github
            </Button>
          </div>
        </Block>

        <Block name="ICONS">
          <div className="flex flex-wrap items-center gap-3">
            {[featured, ...projects].map((p) => (
              <IconCircle key={p.slug} icon={p.icon} emoji={p.emoji} />
            ))}
            <IconCircle emoji="🧪" size={40} />
          </div>
        </Block>

        <Block name="INFO LINES">
          <InfoLines lines={heroInfo()} />
        </Block>

        <Block name="SKELETON">
          <Skeleton className="h-20 max-w-sm rounded-xl" />
        </Block>

        <Block name="IMAGE SLOTS">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {allImages().map((image) => (
              <li key={image.src}>
                <ImageSlot image={image} />
              </li>
            ))}
          </ul>
        </Block>
      </Container>
    </main>
  );
}
```

(The rotating word is added to this page in Task 5.)

- [ ] **Step 7: Verify visually**

`rm -rf .next && pnpm dev`; Playwright `/design` at 1280×900 and 390×844, light and dark. Check: chips black (light) / light (dark); highlight readable in dark; 7 icons are images (cops, block-drag, rulebook, tripgether, space, eunsaem, nyangseng) and 6 are emoji; Nav pill height 30 with hit area reaching 42 (`elementFromPoint` 5px above/below returns the anchor); 390px has no horizontal scroll.

- [ ] **Step 8: Build and commit**

```bash
pnpm -s lint && pnpm build && pnpm -s test \
&& git add src/components/ui "src/app/(site)/design/page.tsx" \
&& git commit -m "feat: add chip, highlight, icon circle and info lines primitives

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 5: Rotating word and hero

**Files:**
- Create: `src/lib/rotating.ts`, `src/lib/rotating.test.ts`, `src/components/ui/RotatingWord.tsx`
- Rewrite: `src/components/sections/Hero.tsx`
- Modify: `src/app/(site)/design/page.tsx`

**Interfaces:**
- Consumes: `hero.words`, `hero.name`, `heroInfo`, `links`, `site.pdf`, `Container`, `Highlight`, `InfoLines`, `Button`.
- Produces: `TYPE_MS = 110`, `DELETE_MS = 50`, `HOLD_MS = 1400`, `NEXT_MS = 300`; `type RotState = { word: number; length: number; deleting: boolean }`; `step(words, state): { state: RotState; delay: number }`; `visible(words, state): string`; `RotatingWord({ words: readonly string[] })`.

- [ ] **Step 1: Write the failing tests `src/lib/rotating.test.ts`**

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { DELETE_MS, HOLD_MS, NEXT_MS, type RotState, step, TYPE_MS, visible } from "./rotating.ts";

const s = (word: number, length: number, deleting = false): RotState => ({ word, length, deleting });

test("types one character per step", () => {
  assert.deepEqual(step(["ab"], s(0, 0)), { state: s(0, 1), delay: TYPE_MS });
});

test("holds when the word is complete, then deletes", () => {
  assert.deepEqual(step(["ab"], s(0, 2)), { state: s(0, 2, true), delay: HOLD_MS });
  assert.deepEqual(step(["ab"], s(0, 2, true)), { state: s(0, 1, true), delay: DELETE_MS });
});

test("moves to the next word after deleting, wrapping around", () => {
  assert.deepEqual(step(["ab", "c"], s(0, 0, true)), { state: s(1, 0), delay: NEXT_MS });
  assert.deepEqual(step(["ab", "c"], s(1, 0, true)), { state: s(0, 0), delay: NEXT_MS });
});

test("counts code points, so Hangul and emoji are typed whole", () => {
  assert.equal(visible(["빠른 출시"], s(0, 2)), "빠른");
  assert.deepEqual(step(["😀"], s(0, 0)), { state: s(0, 1), delay: TYPE_MS });
  assert.deepEqual(step(["😀"], s(0, 1)), { state: s(0, 1, true), delay: HOLD_MS });
});

test("a full cycle over all words returns to the start", () => {
  const words = ["Flutter", "UX", "빠른 출시"];
  const start = s(0, 0);
  let state = start;
  let steps = 0;
  do {
    state = step(words, state).state;
    steps++;
  } while (JSON.stringify(state) !== JSON.stringify(start) && steps < 1000);
  // per word: type n, hold 1, delete n, next 1 → 2n + 2
  assert.equal(steps, words.reduce((sum, w) => sum + 2 * Array.from(w).length + 2, 0));
});
```

- [ ] **Step 2: Run — expect failure**

Run: `pnpm -s test` — Expected: `Cannot find module '.../src/lib/rotating.ts'`.

- [ ] **Step 3: Write `src/lib/rotating.ts`**

```ts
// Hero word loop: type → hold → delete → pause → next word. Pure, so it is testable without a DOM.
export const TYPE_MS = 110;
export const DELETE_MS = 50;
export const HOLD_MS = 1400;
export const NEXT_MS = 300;

export type RotState = { word: number; length: number; deleting: boolean };

const chars = (word: string) => Array.from(word);

/** Advances one step and returns how long the new state should stay on screen. */
export function step(words: readonly string[], state: RotState): { state: RotState; delay: number } {
  const full = chars(words[state.word]).length;
  if (!state.deleting && state.length < full) return { state: { ...state, length: state.length + 1 }, delay: TYPE_MS };
  if (!state.deleting) return { state: { ...state, deleting: true }, delay: HOLD_MS };
  if (state.length > 0) return { state: { ...state, length: state.length - 1 }, delay: DELETE_MS };
  return { state: { word: (state.word + 1) % words.length, length: 0, deleting: false }, delay: NEXT_MS };
}

export function visible(words: readonly string[], state: RotState): string {
  return chars(words[state.word]).slice(0, state.length).join("");
}
```

- [ ] **Step 4: Run — expect pass**

Run: `pnpm -s test` — Expected: all pass (13 profile/typing + 5 rotating). Hand check of the cycle test: Flutter 2·7+2=16, UX 2·2+2=6, 빠른 출시 2·5+2=12 → 34.

- [ ] **Step 5: Write `src/components/ui/RotatingWord.tsx`**

```tsx
"use client";

import { useEffect, useRef } from "react";
import { HOLD_MS, type RotState, step, visible } from "@/lib/rotating";

// Updates its text node through a ref instead of React state: the repo's lint forbids setState in
// effects, and re-rendering every 50ms buys nothing. The server renders the first word complete.
export function RotatingWord({ words }: { words: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let state: RotState = { word: 0, length: Array.from(words[0]).length, deleting: false };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const next = step(words, state);
      state = next.state;
      el.textContent = visible(words, state);
      timer = setTimeout(tick, next.delay);
    };
    // Pause in background tabs; resume from the current state when visible again.
    const onVisibility = () => {
      clearTimeout(timer);
      if (!document.hidden) timer = setTimeout(tick, HOLD_MS);
    };
    timer = setTimeout(tick, HOLD_MS);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [words]);

  return (
    <>
      <span ref={ref} className="rw-word">
        {words[0]}
      </span>
      <span aria-hidden="true" className="rw-caret" />
    </>
  );
}
```

- [ ] **Step 6: Rewrite `src/components/sections/Hero.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { InfoLines } from "@/components/ui/InfoLines";
import { RotatingWord } from "@/components/ui/RotatingWord";
import { hero, heroInfo, links } from "@/content/profile";
import { site } from "@/lib/site";

// Each line is nowrap and the size is clamped, so the block keeps one height while the word types.
export function Hero() {
  return (
    <Container className="pt-16 pb-12 md:pt-24">
      <h1 className="sr-only">{`안녕하세요! ${hero.words[0]}를 좋아하는 개발자 ${hero.name}입니다.`}</h1>
      <p aria-hidden="true" className="font-display text-greet font-light text-fg">
        <span className="block whitespace-nowrap">안녕하세요!</span>
        <span className="block whitespace-nowrap">
          <RotatingWord words={hero.words} />를 좋아하는
        </span>
        <span className="block whitespace-nowrap">
          개발자{" "}
          <Highlight>
            <strong className="font-bold">{hero.name}</strong>
          </Highlight>
          입니다.
        </span>
      </p>
      <InfoLines lines={heroInfo()} className="mt-9" />
      <div className="mt-7 flex flex-wrap gap-2.5">
        <Button href={links.email.href}>메일 보내기</Button>
        <Button href={site.pdf.href} download={site.pdf.filename} variant="ghost">
          PDF 포트폴리오
        </Button>
      </div>
    </Container>
  );
}
```

- [ ] **Step 7: Add the rotating word to `/design`**

In `src/app/(site)/design/page.tsx` import `{ RotatingWord }` from `@/components/ui/RotatingWord` and `hero` from `@/content/profile`, and add as the first `Block`:

```tsx
        <Block name="ROTATING WORD">
          <p className="font-display text-greet font-light">
            <span className="block whitespace-nowrap">
              <RotatingWord words={hero.words} />를 좋아하는
            </span>
          </p>
        </Block>
```

- [ ] **Step 8: Review Focus #1 and #5 — measure**

`pnpm dev`; Playwright on `/`:
1. At 1280×900 and 390×844 (light), sample `document.querySelector('[aria-hidden="true"].text-greet').getBoundingClientRect().height` every 30ms for 12s, also collecting `.rw-word` text. Expected: exactly one height value per width; the collected texts include `""` and `"빠른 출시"`; at 390 no greeting line has `scrollWidth > clientWidth`.
2. Reload with `emulateMedia({ reducedMotion: "reduce" })`; sample 4s: `.rw-word` text is always `"Flutter"`; `.rw-caret` computed `display` is `none`.
3. `browser_snapshot`: one `heading` "안녕하세요! Flutter를 좋아하는 개발자 홍의민입니다." and the visual paragraph absent from the accessibility tree.
4. Server HTML (what no-JS visitors and crawlers get): `curl -s localhost:3000/ | grep -o 'rw-word">[^<]*'` → `rw-word">Flutter`.

- [ ] **Step 9: Lint, build, commit**

```bash
pnpm -s lint && pnpm build && pnpm -s test \
&& git add src/lib/rotating.ts src/lib/rotating.test.ts src/components/ui/RotatingWord.tsx src/components/sections/Hero.tsx "src/app/(site)/design/page.tsx" \
&& git commit -m "feat: add greeting hero with rotating typed word

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 6: Sections and cleanup

**Files:**
- Modify: `src/components/ui/Container.tsx` (`Section`), `src/app/(site)/page.tsx`, `src/content/profile.ts` (drop `cliLines`), `src/content/profile.test.ts`, `src/app/(site)/design/page.tsx` (nothing to change if it does not import removed items — verify)
- Rewrite: `src/components/sections/Projects.tsx`, `Awards.tsx`, `Stack.tsx`, `Contact.tsx`
- Delete: `src/components/sections/Featured.tsx`, `src/components/ui/Card.tsx`, `Tag.tsx`, `CliPanel.tsx`, `Typewriter.tsx`, `src/lib/typing.ts`, `src/lib/typing.test.ts`

**Interfaces:**
- Produces: `Section({ id: string; chip: string; children })`.

- [ ] **Step 1: Rewrite `Section`**

In `src/components/ui/Container.tsx` replace the `Eyebrow` import with `import { Chip } from "@/components/ui/Chip";` and `Section` with:

```tsx
export function Section({ id, chip, children }: { id: string; chip: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-12">
      <Container>
        <Chip id={`${id}-title`}>{chip}</Chip>
        <div className="mt-6">{children}</div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/sections/Projects.tsx`**

```tsx
import { Fragment, type ReactNode } from "react";
import { Section } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { IconCircle } from "@/components/ui/IconCircle";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import { featured, type LinkSpec, type Project, projects } from "@/content/profile";

const EXTERNAL = { target: "_blank", rel: "noreferrer" } as const;
const UNDERLINE = "text-fg underline underline-offset-[3px]";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mr-1.5 inline font-semibold text-fg">{label}</dt>
      <dd className="inline">{children}</dd>
    </div>
  );
}

function TextLinks({ links }: { links: readonly LinkSpec[] }) {
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 text-meta">
      {links.map((link) => (
        <a key={link.href} href={link.href} {...EXTERNAL} className={`inline-flex min-h-10 items-center ${UNDERLINE}`}>
          {link.label}
        </a>
      ))}
    </p>
  );
}

function FeaturedProject() {
  const screens = visibleImages(featured.screens);
  const [event] = visibleImages([featured.event]);
  const [firstAward, ...otherAwards] = featured.badges;
  return (
    <article className="pb-8">
      <div className="flex items-center gap-4">
        <IconCircle icon={featured.icon} emoji={featured.emoji} />
        <div>
          <h3 className="font-display text-title-lg font-bold text-fg">{featured.name}</h3>
          <p className="text-meta text-fg-subtle">
            {featured.period} · {featured.platform}
          </p>
        </div>
      </div>
      <p className="mt-4 text-[17px] text-fg">{featured.summary}</p>
      <dl className="mt-3 space-y-1 text-meta text-fg-muted">
        <Detail label="역할">{featured.role}</Detail>
        <Detail label="수상">
          <Highlight>{firstAward}</Highlight> 외 {otherAwards.length}건
        </Detail>
        <Detail label="기능">{featured.features.join(" · ")}</Detail>
      </dl>
      {screens.length > 0 && (
        <ul className="mt-5 flex gap-2.5">
          {screens.map((image) => (
            <li key={image.src} className="w-24">
              <ImageSlot image={image} />
            </li>
          ))}
        </ul>
      )}
      {event && <ImageSlot image={event} className="mt-3 max-w-md" />}
      <TextLinks links={featured.links} />
    </article>
  );
}

function MajorRow({ project }: { project: Project }) {
  const [primary, ...others] = project.links;
  return (
    <li className="flex gap-4 py-2.5">
      <IconCircle icon={project.icon} emoji={project.emoji} />
      <div className="min-w-0 pt-1">
        <h3 className="text-title font-medium text-fg">
          <a href={primary.href} {...EXTERNAL} className="underline-offset-4 hover:underline">
            {project.name}
          </a>
          {project.badges.map((badge) => (
            <span key={badge} className="ml-2 text-[13px] font-normal">
              {/* Store releases read as facts; awards get the highlight. */}
              {project.shipped ? <span className="text-fg-subtle">{badge}</span> : <Highlight>{badge}</Highlight>}
            </span>
          ))}
        </h3>
        <p className="mt-0.5 text-meta text-fg-subtle">
          {project.summary} · {project.stack.join(" · ")} · {project.period}
          {others.map((link) => (
            <Fragment key={link.href}>
              {" · "}
              <a href={link.href} {...EXTERNAL} className={UNDERLINE}>
                {link.label}
              </a>
            </Fragment>
          ))}
        </p>
      </div>
    </li>
  );
}

function MinorRow({ project }: { project: Project }) {
  return (
    <li className="flex items-center gap-3 py-1.5">
      <IconCircle icon={project.icon} emoji={project.emoji} size={40} />
      <p className="min-w-0 text-base font-medium text-fg">
        <a href={project.links[0].href} {...EXTERNAL} className="underline-offset-4 hover:underline">
          {project.name}
        </a>{" "}
        <span className="text-meta font-normal text-fg-subtle">
          {project.summary} · {project.period}
        </span>
      </p>
    </li>
  );
}

export function Projects() {
  return (
    <Section id="projects" chip="PROJECTS">
      <FeaturedProject />
      <ul>
        {projects
          .filter((p) => p.tier === 2)
          .map((project) => (
            <MajorRow key={project.slug} project={project} />
          ))}
      </ul>
      <ul className="mt-6">
        {projects
          .filter((p) => p.tier === 3)
          .map((project) => (
            <MinorRow key={project.slug} project={project} />
          ))}
      </ul>
    </Section>
  );
}
```

- [ ] **Step 3: Rewrite `Awards`, `Stack`, `Contact`**

`src/components/sections/Awards.tsx`:

```tsx
import { Section } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { awards } from "@/content/profile";

// Award name leads each row (F-pattern). Mobile: award | year, then contest · project.
export function Awards() {
  return (
    <Section id="awards" chip="AWARDS">
      <ol className="space-y-2.5">
        {awards.map((a) => (
          <li key={`${a.year}-${a.contest}`} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 sm:grid-cols-[150px_1fr_auto] sm:items-baseline">
            <span className="font-display font-bold text-fg">{a.highlight ? <Highlight>{a.award}</Highlight> : a.award}</span>
            <span className="text-meta text-fg-subtle sm:order-3">{a.year}</span>
            <span className="col-span-2 text-[15px] text-fg-muted sm:order-2 sm:col-span-1">
              {a.contest} <span className="text-fg-subtle">· {a.project}</span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

`src/components/sections/Stack.tsx`:

```tsx
import { Section } from "@/components/ui/Container";
import { InfoLines } from "@/components/ui/InfoLines";
import { stack } from "@/content/profile";

export function Stack() {
  return (
    <Section id="stack" chip="STACK">
      <InfoLines lines={stack.map((g) => ({ label: g.group, value: g.items.join(" · ") }))} />
    </Section>
  );
}
```

`src/components/sections/Contact.tsx`:

```tsx
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Container";
import { hero, links } from "@/content/profile";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <Section id="contact" chip="CONTACT">
      <p className="font-display text-title-lg font-light text-fg">함께 일해요</p>
      <p className="mt-2 text-body text-fg-muted">{hero.contactLine}</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        <Button href={links.email.href}>메일 보내기</Button>
        <Button href={site.pdf.href} download={site.pdf.filename} variant="ghost">
          PDF 포트폴리오
        </Button>
      </div>
      <ul className="mt-10 flex flex-wrap gap-x-5">
        {Object.values(links).map((link) => (
          <li key={link.href}>
            <Button href={link.href} variant="text">
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-meta text-fg-subtle">
        © {new Date().getFullYear()} {site.name}
      </p>
    </Section>
  );
}
```

- [ ] **Step 4: Compose the page**

`src/app/(site)/page.tsx`:

```tsx
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";

export default function Home() {
  return (
    <main className="flex-1 pb-12">
      <Hero />
      <Projects />
      <Awards />
      <Stack />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 5: Delete the Vercel-only pieces**

```bash
git rm src/components/sections/Featured.tsx src/components/ui/Card.tsx src/components/ui/Tag.tsx src/components/ui/CliPanel.tsx src/components/ui/Typewriter.tsx src/lib/typing.ts src/lib/typing.test.ts
```

In `src/content/profile.ts` delete `export type CliLine …` and `export function cliLines() {…}`. In `src/content/profile.test.ts` remove `cliLines` from the import and delete the test "CLI shipped line lists the featured app first, then shipped projects", replacing it with:

```ts
test("shipped names list the featured app first, then shipped projects", () => {
  assert.deepEqual(shippedNames(), ["경찰과도둑", "Block Drag", "RuleBook"]);
});
```

(add `shippedNames` to the import). Then:

```bash
grep -rnE 'ui/(Card|Tag|CliPanel|Typewriter)"|lib/typing|cliLines|text-eyebrow|font-book|shadow-card|text-heading|text-caption|rounded-card|scheme-inverted' src --include=*.tsx --include=*.ts | grep -v '^src/app/print' | grep -v '^src/app/(site)/blog'
```

Expected: no output (blog and print are restyled in Tasks 7–8).

- [ ] **Step 6: Visual check**

`pnpm dev`; full-page screenshots of `/` at 1280 and 390, light and dark. Check: chips, featured icon + title, major rows with icon images for tripgether/block-drag/rulebook and emoji for others, award highlight on 1st Place/대상 rows, stack info lines, contact; 390px no horizontal scroll; `#projects` anchor title visible below the sticky nav.

- [ ] **Step 7: Review Focus #3 — missing icon control**

```bash
pnpm build && grep -o 'images/projects/[a-z-]*/icon.png' out/index.html | sort -u | wc -l
mv public/images/projects/rulebook/icon.png /tmp/rulebook-icon.png && pnpm build \
&& grep -c 'images/projects/rulebook/icon.png' out/index.html; grep -o '📖' out/index.html | head -1
mv /tmp/rulebook-icon.png public/images/projects/rulebook/icon.png && git status --short public
```

Expected: first count `7`; after removing the RuleBook icon, its path count `0` and `📖` present; after restoring, `git status` clean for `public`.

- [ ] **Step 8: Lint, build, commit**

```bash
pnpm -s lint && pnpm build && pnpm -s test && pnpm -s check:contrast \
&& git add -A src \
&& git commit -m "feat: rebuild home sections in the redesign style, drop Vercel components

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 7: Blog

**Files:**
- Modify: `src/app/(site)/blog/page.tsx`, `src/app/(site)/blog/[slug]/page.tsx`, `src/mdx-components.tsx`
- Delete: `src/components/ui/Eyebrow.tsx`

- [ ] **Step 1: Blog list**

In `src/app/(site)/blog/page.tsx` replace the `Eyebrow` import with `import { Chip } from "@/components/ui/Chip";` and the `return` with:

```tsx
  return (
    <main className="flex-1 py-12 md:py-16">
      <Container>
        <Chip as="h1">POSTS</Chip>
        <ul className="mt-6">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-wrap items-baseline gap-x-3 py-2">
              <Link href={`/blog/${post.slug}`} className="text-title font-medium text-fg underline-offset-4 hover:underline">
                {post.title}
              </Link>
              <time dateTime={post.date} className="text-meta text-fg-subtle">
                {post.date.replaceAll("-", ".")}
              </time>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
```

- [ ] **Step 2: Post page**

In `src/app/(site)/blog/[slug]/page.tsx` replace the `return` with:

```tsx
  return (
    <main className="flex-1 py-12 md:py-16">
      <Container>
        <article>
          <time dateTime={meta.date} className="text-meta text-fg-subtle">
            {meta.date.replaceAll("-", ".")}
          </time>
          <h1 className="mt-2 font-display text-title-lg font-bold text-fg">{meta.title}</h1>
          <div className="mt-10">
            <Content />
          </div>
        </article>
      </Container>
    </main>
  );
```

- [ ] **Step 3: MDX styles**

Replace the `components` object in `src/mdx-components.tsx`:

```tsx
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 font-display text-[22px] font-bold text-fg" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-title font-semibold text-fg" {...props} />,
  p: (props) => <p className="my-4 text-body text-fg-muted" {...props} />,
  a: (props) => <a className="text-fg underline decoration-dot decoration-2 underline-offset-4" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6 text-fg-muted" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6 text-fg-muted" {...props} />,
  blockquote: (props) => <blockquote className="my-6 border-l-2 border-hairline pl-4 text-fg-subtle" {...props} />,
  pre: (props) => <pre className="my-6 overflow-x-auto rounded-btn bg-surface p-4 font-mono text-[13px]" {...props} />,
  code: (props) => <code className="font-mono text-[0.9em] text-fg" {...props} />,
};
```

(`font-mono` is Tailwind's default monospace stack — only `--color-*` is reset.)

- [ ] **Step 4: Delete Eyebrow, verify, commit**

```bash
git rm src/components/ui/Eyebrow.tsx \
&& ! grep -rn "Eyebrow" src \
&& pnpm -s lint && pnpm build \
&& git add -A "src/app/(site)/blog" src/mdx-components.tsx \
&& git commit -m "feat: restyle blog for the redesign

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

Then screenshot `/blog` and `/blog/hello-world` at 1280 and 390 (light/dark): title + gray dotted date, link underline in the dot color.

---

### Task 8: /print restyle

**Files:**
- Modify: `src/app/print/page.tsx`

- [ ] **Step 1: Swap removed tokens**

Apply these exact replacements in `src/app/print/page.tsx`:

| Old | New |
|---|---|
| `<p className="mb-2 font-mono text-eyebrow text-fg uppercase">{eyebrow}</p>` | `<p className="mb-2 font-display text-xs font-bold tracking-wide text-fg-subtle">{eyebrow}</p>` |
| `<h2 className="mb-6 text-heading font-book">{title}</h2>` | `<h2 className="mb-6 font-display text-[26px] font-bold">{title}</h2>` |
| `<p className="font-mono text-[10px] tracking-[0.071em] text-fg-subtle uppercase">{children}</p>` (Meta) | `<p className="text-xs text-fg-subtle">{children}</p>` |
| `<h3 className="text-xl font-medium">{project.name}</h3>` | `<h3 className="font-display text-xl font-bold">{project.name}</h3>` |
| `<p className="font-mono text-eyebrow uppercase">{hero.eyebrow}</p>` | `<p className="font-display text-xs font-bold tracking-wide text-fg-subtle">{hero.eyebrow}</p>` |
| `<h1 className="mt-3 text-[48px] leading-none font-book tracking-[-0.06em]">` | `<h1 className="mt-3 font-display text-[44px] leading-none font-bold">` |
| `<p className="mt-3 font-mono text-caption text-fg-subtle">{heroStats().join(" · ")}</p>` | `<p className="mt-3 text-meta text-fg-subtle">{heroStats().join(" · ")}</p>` |
| `className="inline font-mono text-eyebrow text-fg-subtle uppercase"` (3×: Education, Certification, stack dt) | `className="inline font-display text-xs font-bold text-fg-subtle"` |
| `<td className="py-2 font-mono text-[11px] text-fg-subtle">{a.year}</td>` | `<td className="py-2 text-xs text-fg-subtle">{a.year}</td>` |
| `bg-surface text-fg">` (main) | `bg-canvas text-fg">` |

`text-body` stays (redefined as 16px/1.6).

- [ ] **Step 2: Verify no removed tokens remain and the PDF renders**

```bash
! grep -nE "font-mono|text-eyebrow|font-book|text-heading|text-caption" src/app/print/page.tsx \
&& pnpm build && pnpm -s pdf \
&& strings out/portfolio.pdf | grep -c ElipairDisplay \
&& python3 -I -c "import re;d=open('out/portfolio.pdf','rb').read();print('pages',len(re.findall(rb'/Type\s*/Page[^s]',d)),'uris',len(re.findall(rb'/URI\s*\(',d)))"
```

Expected: `ElipairDisplay` count ≥ 1, `uris 25`, pages 5 or 6. Render pages with `swift /private/tmp/claude-501/-Users-luca-Documents-GitHub-EM-H20-github-io/b8331c78-6bf1-4be8-894f-fabc41b0dbf6/scratchpad/pdf2png.swift out/portfolio.pdf .playwright-mcp` (PDFKit, writes pdf-pN.png) and check headings in the display font, white paper, no blocks split.

- [ ] **Step 3: Commit**

```bash
git add src/app/print/page.tsx && git commit -m "feat: restyle print page headings for the redesign

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 9: Final verification and docs

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Full suite**

Run: `rm -rf .next && pnpm -s lint && pnpm -s test && pnpm -s check:contrast && pnpm build && pnpm -s pdf` — all pass.

- [ ] **Step 2: Review Focus re-run on the production build**

With `pnpm dev` and Playwright: greeting height sampling at 390 and 1280 (one value each); 375px no horizontal scroll on `/`, `/blog`, `/blog/hello-world`, `/print` in light and dark. On the production build: `grep -o 'images/projects/[a-z-]*/icon.png' out/index.html | sort -u | wc -l` → 7, and `grep -c 'images/projects/[a-z-]*/1.webp' out/index.html` → 0.

- [ ] **Step 3: README**

In `README.md` `## 구조` add:

```md
- `src/fonts/` — 제목용 글꼴 `Elipair Display` (GmarketSans 서브셋, SIL OFL 1.1 — `src/fonts/OFL.txt`). 다시 만들 때: `scripts/subset-display-font.sh`
```

and in `## 포트폴리오 내용 수정` add: `히어로의 바뀌는 단어는 profile.ts의 hero.words — 받침 없는 단어만('를'이 맞게), 테스트가 검사합니다.`

- [ ] **Step 4: Embedded-code drift check and commit**

Diff the plan's embedded blocks against shipped files; note deviations in the ledger as rulings. Commit README:

```bash
git add README.md && git commit -m "docs: document display font and rotating words

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```
