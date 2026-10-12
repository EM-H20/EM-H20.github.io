# Portfolio Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Vercel-style design tokens + components, a one-page recruiter-facing portfolio (home), restyled blog, and a build-time PDF of the portfolio.

**Architecture:** Tokens live in `src/app/globals.css` (raw palette → semantic CSS variables → Tailwind v4 `@theme`). All UI is server components; the typing effect and skeleton are pure CSS, so the site ships no custom client JS. Content comes from one typed file (`src/content/profile.ts`) consumed by the home page and `/print`; `scripts/build-pdf.mjs` renders `/print` to `out/portfolio.pdf` after `next build`.

**Tech Stack:** Next.js 16.4 (App Router, `output: "export"`), React 19.3, Tailwind CSS 4.3, TypeScript 5, Geist / Geist Mono (`next/font/google`), Pretendard 1.3.9 (npm, probed 2026-10-12: last publish 2023-11, stable), Playwright 1.64.0 (npm, probed 2026-10-12), Node 24 built-in test runner (type stripping).

**Spec:** `docs/superpowers/specs/2026-10-12-portfolio-design.md`

## Global Constraints

- Static export only: no route handlers needing Request, no server actions, no `next/image` optimizer (`images.unoptimized: true` already set).
- Components use only semantic tokens (`bg-canvas`, `text-fg`, `text-fg-muted`, `text-fg-subtle`, `shadow-hairline`, `shadow-card`, `rounded-card`, …). Tailwind's default color palette is disabled (`--color-*: initial`).
- Text that carries information is never lighter than `fg-subtle` (≥ 4.5:1). `fg-faint` is decoration only.
- Radii: 2px (`rounded-sm`), 6px (`rounded-card`), 9999px (`rounded-full`, nav pill only). No drop shadows — rings only.
- Labels/metadata/code: Geist Mono, uppercase, `text-eyebrow` (11px, 0.071em). Headings weight 400–450 (`font-book`).
- Every clickable control has a hit area ≥ 40px tall (`min-h-10`, or a `before:` pseudo-element for the pill).
- No `▲` glyph anywhere (Vercel's logo). CLI prompt is `$`, brand is the `Elipair` wordmark.
- Lint rule `react-hooks/set-state-in-effect` is an error in this repo — do not add `useEffect` + `setState`. (Nothing in this plan needs client state.)
- `<img>` triggers `@next/next/no-img-element` (warn) — use `next/image` with `fill`.
- Copy is Korean; section eyebrows are English uppercase.
- Commit messages: `<type>: <description>` + blank line + `Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML`.

## Review Focus

1. **Narrow phones (375px):** long award/contest names, tag rows and the display name must wrap — no horizontal page scroll. Pinned in Task 10 (`scrollWidth` check on `/`, `/print`, `/blog`).
2. **Production build with no image files yet:** no placeholder text or empty image rows may reach `out/`; once a file is dropped at its documented path it must appear with no code change. Pinned in Task 4 (negative + positive build control).
3. **Reduced motion / print:** hero name and CLI lines must be fully visible immediately, with no invisible characters. Pinned in Task 5 (emulated `prefers-reduced-motion` and print screenshots).
4. **OS in dark mode opening `/print`:** the PDF source page must stay light. Pinned in Task 8 (dark-emulated screenshot of `/print`).
5. **PDF step failing silently:** a missing `out/` or a non-200 `/print` must fail the deploy, not ship a stale or empty PDF. Pinned in Task 9 (negative control: run `pnpm pdf` without `out/`, expect non-zero exit).

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `src/app/globals.css` | rewrite | Tokens (raw → semantic → `@theme`), dark mode, scoped schemes, skeleton/typing/print CSS |
| `src/app/layout.tsx` | modify | `<html>/<body>`, fonts (Geist, Pretendard), body token classes, OG image |
| `src/app/(site)/layout.tsx` | create | Nav for all site pages |
| `src/app/(site)/page.tsx` | move from `src/app/page.tsx` + rewrite | Home: composes sections |
| `src/app/(site)/blog/**` | move from `src/app/blog/**` + restyle | Blog list & post |
| `src/app/(site)/design/page.tsx` | create | Component gallery (noindex) |
| `src/app/print/page.tsx` | create | PDF source page (noindex, no Nav, light) |
| `src/components/ui/Container.tsx` | create | `Container`, `Section` |
| `src/components/ui/Nav.tsx` | create | Sticky top bar |
| `src/components/ui/Button.tsx` | create | `primary` / `ghost` / `pill` / `text` link buttons |
| `src/components/ui/Card.tsx` | create | Bordered / inverted card, sizes |
| `src/components/ui/Eyebrow.tsx` | create | Mono uppercase label |
| `src/components/ui/Tag.tsx` | create | `Tag`, `TagList` |
| `src/components/ui/CliPanel.tsx` | create | Terminal panel, optional typing |
| `src/components/ui/Skeleton.tsx` | create | Shimmer block |
| `src/components/ui/Typewriter.tsx` | create | CSS-only typing of one string |
| `src/components/ui/ImageSlot.tsx` | create | `ImageSlot`, `imageExists`, `visibleImages` |
| `src/components/sections/Hero.tsx` … `Contact.tsx` | create | One file per home section (Hero, Featured, Projects, Awards, Stack, Contact) |
| `src/content/profile.ts` | create | All portfolio content + derived helpers |
| `src/content/profile.test.ts` | create | Data integrity tests |
| `src/lib/typing.ts` / `typing.test.ts` | create | Typing timeline + tests |
| `src/lib/site.ts` | modify | Add PDF href/filename |
| `src/mdx-components.tsx` | modify | Blog prose styles |
| `scripts/check-contrast.mjs` | create | WCAG check of token pairs |
| `scripts/build-pdf.mjs` | create | `/print` → `out/portfolio.pdf` |
| `package.json`, `tsconfig.json` | modify | deps, scripts, `allowImportingTsExtensions` |
| `.github/workflows/deploy.yml` | modify | Chromium install + `pnpm pdf` |
| `README.md` | modify | Images, PDF, scripts docs |

Before starting, read `node_modules/next/dist/docs/01-app/01-getting-started/11-css.md` (global/external CSS) and `.../03-api-reference/02-components/image.md` (`fill`, `loading`) — per `AGENTS.md`, this Next version differs from training data.

---

### Task 1: Design tokens, fonts, contrast check

**Files:**
- Rewrite: `src/app/globals.css`
- Modify: `src/app/layout.tsx`
- Create: `scripts/check-contrast.mjs`
- Modify: `package.json`

**Interfaces:**
- Produces: utilities `bg-canvas bg-surface bg-inverted text-on-inverted text-fg text-fg-muted text-fg-subtle text-fg-faint text-accent border-hairline bg-skeleton shadow-hairline shadow-card rounded-sm rounded-card max-w-page font-book text-eyebrow text-caption text-body text-heading text-heading-lg text-display font-sans font-mono`; CSS classes `scheme-light`, `scheme-inverted`, `skeleton`, `type-char`, `type-caret`, `print-break`, `print-block`; npm script `check:contrast`.

- [ ] **Step 1: Install Pretendard**

Run: `pnpm add pretendard@1.3.9`
Expected: `package.json` dependencies gain `"pretendard": "1.3.9"` (pnpm may write `^1.3.9`; keep what it writes).

- [ ] **Step 2: Write the contrast checker (the test for this task)**

Create `scripts/check-contrast.mjs`:

```js
// Fails when a text/background token pair in globals.css is below WCAG AA (4.5:1), in light or dark.
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const DARK = /@media\s*\(prefers-color-scheme:\s*dark\)\s*\{\s*:root\s*\{([^}]*)\}\s*\}/;
const PAIRS = [
  ...["--fg", "--fg-muted", "--fg-subtle", "--accent"].flatMap((fg) =>
    ["--canvas", "--surface"].map((bg) => [fg, bg]),
  ),
  ["--on-inverted", "--inverted"],
  ["--on-inverted-muted", "--inverted"],
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

function luminance(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex)) fail(`expected #rrggbb, got "${hex}"`);
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
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
  for (const [fg, bg] of PAIRS) {
    const r = ratio(resolve(map, fg), resolve(map, bg));
    const ok = r >= 4.5;
    if (!ok) failures++;
    console.log(`${ok ? "ok  " : "FAIL"} ${scheme.padEnd(5)} ${fg} on ${bg}: ${r.toFixed(2)}`);
  }
}
if (failures) fail(`${failures} pair(s) below 4.5:1`);
```

Add to `package.json` `scripts`: `"check:contrast": "node scripts/check-contrast.mjs"`.

- [ ] **Step 3: Run it against the current globals.css — expect failure**

Run: `pnpm check:contrast`
Expected: exit 1 with `check-contrast: --fg is not defined` (current file has no semantic tokens).

- [ ] **Step 4: Rewrite `src/app/globals.css`**

```css
@import "tailwindcss";

/* Raw palette from the refero Vercel style. Components use the semantic tokens below, never these. */
:root {
  --vercel-paper-white: #fafafa;
  --vercel-pure-white: #ffffff;
  --vercel-hairline: #ebebeb;
  --vercel-ash: #c9c9c9;
  --vercel-smoke: #a8a8a8;
  --vercel-graphite: #8f8f8f;
  --vercel-slate: #7d7d7d;
  --vercel-stone: #666666;
  --vercel-charcoal: #4d4d4d;
  --vercel-obsidian: #171717;
  --vercel-carbon: #000000;
  --vercel-terminal-green: #297a3a;
}

/* Semantic tokens, light. `.scheme-light` re-pins them so /print stays light under a dark OS. */
:root,
.scheme-light {
  --canvas: var(--vercel-paper-white);
  --surface: var(--vercel-pure-white);
  --inverted: var(--vercel-obsidian);
  --on-inverted: var(--vercel-pure-white);
  --on-inverted-muted: #a1a1a1;
  --inverted-hairline: #333333;
  --fg: var(--vercel-obsidian);
  --fg-muted: var(--vercel-charcoal);
  --fg-subtle: var(--vercel-stone);
  --fg-faint: var(--vercel-graphite);
  --hairline: var(--vercel-hairline);
  --skeleton: var(--vercel-hairline);
  --accent: var(--vercel-terminal-green);
  --ring-card: rgb(0 0 0 / 0.08);
}

/* Dark: the gray ramp inverted. Not in refero — values chosen to pass scripts/check-contrast.mjs. */
@media (prefers-color-scheme: dark) {
  :root {
    --canvas: #0a0a0a;
    --surface: #111111;
    --inverted: #ededed;
    --on-inverted: #0a0a0a;
    --on-inverted-muted: #4d4d4d;
    --inverted-hairline: #d4d4d4;
    --fg: #ededed;
    --fg-muted: #a1a1a1;
    --fg-subtle: #8f8f8f;
    --fg-faint: #5c5c5c;
    --hairline: #2e2e2e;
    --skeleton: #1f1f1f;
    --accent: #45a557;
    --ring-card: rgb(255 255 255 / 0.1);
  }
}

/* Inside an inverted card, text and hairline tokens flip to the opposite scheme. */
.scheme-inverted {
  --fg: var(--on-inverted);
  --fg-muted: var(--on-inverted-muted);
  --fg-subtle: var(--on-inverted-muted);
  --hairline: var(--inverted-hairline);
}

@theme {
  --color-*: initial;

  --text-eyebrow: 11px;
  --text-eyebrow--line-height: 1.5;
  --text-eyebrow--letter-spacing: 0.071em;
  --text-caption: 13px;
  --text-caption--line-height: 1.54;
  --text-body: 16px;
  --text-body--line-height: 1.5;
  --text-heading: 30px;
  --text-heading--line-height: 1.1;
  --text-heading--letter-spacing: -0.05em;
  --text-heading-lg: 36px;
  --text-heading-lg--line-height: 1;
  --text-heading-lg--letter-spacing: -0.06em;
  --text-display: 40px;
  --text-display--line-height: 1;
  --text-display--letter-spacing: -0.06em;

  --font-weight-book: 450;
  --radius-sm: 2px;
  --radius-card: 6px;
  --container-page: 1280px;
}

@theme inline {
  --color-canvas: var(--canvas);
  --color-surface: var(--surface);
  --color-inverted: var(--inverted);
  --color-on-inverted: var(--on-inverted);
  --color-fg: var(--fg);
  --color-fg-muted: var(--fg-muted);
  --color-fg-subtle: var(--fg-subtle);
  --color-fg-faint: var(--fg-faint);
  --color-hairline: var(--hairline);
  --color-skeleton: var(--skeleton);
  --color-accent: var(--accent);

  --font-sans: var(--font-geist-sans), "Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, Menlo, monospace;

  --shadow-hairline: 0 0 0 1px var(--hairline);
  --shadow-card: 0 0 0 1px var(--ring-card), 0 0 0 2px var(--canvas);
}

/* Display sizes grow at md; the letter-spacing is in em so it scales with them. */
@media (width >= 48rem) {
  :root {
    --text-heading-lg: 56px;
    --text-display: 64px;
  }
}

@layer base {
  body {
    font-feature-settings: "calt" 0, "rlig", "ss11";
  }
}

@layer components {
  .skeleton {
    background: linear-gradient(90deg, var(--skeleton) 25%, var(--canvas) 50%, var(--skeleton) 75%);
    background-size: 200% 100%;
    animation: skeleton-shimmer 1.5s linear infinite;
  }

  /* Typing: every character is in the DOM from the start; each one becomes visible at its own delay. */
  .type-char {
    opacity: 0;
    animation: type-reveal 0s forwards;
  }
  .type-caret {
    display: inline-block;
    width: 0;
    opacity: 0;
    animation: type-reveal 0s forwards, type-hide 0s forwards;
  }
  .type-caret > span {
    animation: caret-blink 1s step-end infinite;
  }

  .print-break {
    break-before: page;
  }
  .print-block {
    break-inside: avoid;
  }
}

@media (prefers-reduced-motion: reduce), print {
  .skeleton {
    animation: none;
    background: var(--skeleton);
  }
  .type-char {
    opacity: 1;
    animation: none;
  }
  .type-caret {
    display: none;
  }
}

@page {
  size: A4;
  margin: 16mm;
}

@keyframes skeleton-shimmer {
  from { background-position: 200% 0; }
  to { background-position: -200% 0; }
}
@keyframes type-reveal {
  to { opacity: 1; }
}
@keyframes type-hide {
  to { opacity: 0; }
}
@keyframes caret-blink {
  50% { opacity: 0; }
}
```

- [ ] **Step 5: Run the contrast check — expect pass**

Run: `pnpm check:contrast`
Expected: 20 lines starting with `ok`, exit 0. Light `--fg-subtle on --canvas: 5.50`, dark `--accent on --surface: 6.09`.

- [ ] **Step 6: Negative control**

Temporarily change the light `--fg-subtle: var(--vercel-stone);` to `--fg-subtle: var(--vercel-graphite);`.
Run: `pnpm check:contrast`
Expected: `FAIL light --fg-subtle on --canvas: 3.10`, exit 1. Revert the line and re-run: exit 0.

- [ ] **Step 7: Wire fonts and body tokens in `src/app/layout.tsx`**

Replace the file with:

```tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { baseOpenGraph, site } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: { ...baseOpenGraph, type: "website" },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-fg">{children}</body>
    </html>
  );
}
```

(The OG image is added in Task 4, once `ImageSlot` exists.)

The current placeholder `src/app/page.tsx` uses `font-semibold`/`underline` only, so it still builds.

- [ ] **Step 8: Build and verify generated CSS and fonts**

Run: `pnpm lint && pnpm build`
Expected: both succeed.

Then verify the token wiring in the emitted CSS:

```bash
css=$(ls out/_next/static/chunks/*.css out/_next/static/css/*.css 2>/dev/null | xargs cat)
echo "$css" | grep -o -- '--text-display:[^;]*' | head -2
echo "$css" | grep -c 'Pretendard Variable'
ls out/_next/static/media | grep -c woff2
```

Expected: `--text-display:40px` and `--text-display:64px` both present; `Pretendard Variable` count ≥ 1; woff2 count ≥ 92 (Pretendard subsets + Geist). If the woff2 count is ~2–4 the Pretendard `url()` files were not emitted — stop and report (spec §6 risk).

Utilities are only emitted once a component uses them; Task 3 Step 8 checks them in the browser.

- [ ] **Step 9: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx scripts/check-contrast.mjs package.json pnpm-lock.yaml
git commit -m "feat: add Vercel-style design tokens, fonts and contrast check

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 2: Portfolio content and data tests

**Files:**
- Create: `src/content/profile.ts`
- Create: `src/content/profile.test.ts`
- Modify: `tsconfig.json`, `package.json`, `src/lib/site.ts`

**Interfaces:**
- Produces (all from `@/content/profile`):
  - types `ImageAspect = "phone" | "wide" | "square" | "og"`, `ImageSpec = { src: string; alt: string; aspect: ImageAspect; brief: string }`, `LinkSpec = { label: string; href: string }`, `CliLine = { kind: "cmd" | "ok"; text: string }`, `Project`, `Award`, `StackGroup`
  - consts `links`, `hero`, `education`, `featured`, `projects`, `awards`, `stack`, `profilePhoto`, `ogImage`
  - functions `shippedNames(): string[]`, `heroStats(): string[]`, `cliLines(): CliLine[]`, `allImages(): ImageSpec[]`
- Produces (from `@/lib/site`): `site.pdf = { href: "/portfolio.pdf", filename: "홍의민_포트폴리오.pdf" }`

`profile.ts` must not import anything (it is loaded directly by `node --test`).

- [ ] **Step 1: Enable `.ts` import specifiers for Node's test runner**

In `tsconfig.json` `compilerOptions`, add `"allowImportingTsExtensions": true,` after `"noEmit": true,`. (Valid because `noEmit` is set.)

Add to `package.json` `scripts`: `"test": "node --test \"src/**/*.test.ts\""`.

- [ ] **Step 2: Write the failing tests**

Create `src/content/profile.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { allImages, cliLines, heroStats, projects } from "./profile.ts";

test("hero stats are derived from awards and shipped apps", () => {
  assert.deepEqual(heroStats(), [
    "수상·선정 9건",
    "스토어 출시 앱 3개",
    "Google I/O Extended 1st Place",
  ]);
});

test("CLI shipped line lists the featured app first, then shipped projects", () => {
  assert.deepEqual(cliLines().at(-1), {
    kind: "ok",
    text: "경찰과도둑 · Block Drag · RuleBook",
  });
});

test("project slugs are unique", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every image has a documented path under /images/ and a brief", () => {
  const images = allImages();
  assert.ok(images.length >= 14, `only ${images.length} images`);
  for (const image of images) {
    assert.match(image.src, /^\/images\/[a-z0-9/-]+\.(webp|png|jpg)$/, image.src);
    assert.ok(image.brief.length > 0, `${image.src} has no brief`);
    assert.ok(image.alt.length > 0, `${image.src} has no alt`);
  }
  assert.equal(new Set(images.map((i) => i.src)).size, images.length, "duplicate image paths");
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '.../src/content/profile.ts'`.

- [ ] **Step 4: Write `src/content/profile.ts`**

```ts
// Portfolio content for the home page and /print. Mirrors the GitHub profile README (2026-10-11)
// and the Hack-the-Beat repository. No imports: `node --test` loads this file directly.

export type ImageAspect = "phone" | "wide" | "square" | "og";
export type ImageSpec = { src: string; alt: string; aspect: ImageAspect; brief: string };
export type LinkSpec = { label: string; href: string };
export type CliLine = { kind: "cmd" | "ok"; text: string };

export type Project = {
  slug: string;
  tier: 2 | 3;
  name: string;
  summary: string;
  stack: string[];
  period: string;
  badges: string[];
  /** Released on Google Play and the App Store — counted in the hero stats. */
  shipped?: boolean;
  links: LinkSpec[];
  images: ImageSpec[];
  icon?: ImageSpec;
};

export type Award = {
  award: string;
  contest: string;
  project: string;
  year: number;
  highlight: boolean;
};

export type StackGroup = { group: string; items: string[] };

const phone = (slug: string, n: number, alt: string, brief: string): ImageSpec => ({
  src: `/images/projects/${slug}/${n}.webp`,
  alt,
  aspect: "phone",
  brief,
});

const appIcon = (slug: string, name: string): ImageSpec => ({
  src: `/images/projects/${slug}/icon.webp`,
  alt: `${name} 앱 아이콘`,
  aspect: "square",
  brief: `${name} 앱 아이콘 (512×512)`,
});

export const links = {
  email: { label: "elipair0106@gmail.com", href: "mailto:elipair0106@gmail.com" },
  github: { label: "GitHub", href: "https://github.com/EM-H20" },
  blog: { label: "Tistory 블로그", href: "https://elipair.tistory.com/" },
  instagram: { label: "Instagram @e_m_hong", href: "https://instagram.com/e_m_hong" },
} satisfies Record<string, LinkSpec>;

export const hero = {
  eyebrow: "Flutter Developer · Mobile & Web",
  name: "홍의민",
  alias: "Elipair",
  intro: "아이디어를 실제로 사용할 수 있는 모바일·웹 서비스로 만듭니다.",
  topAward: "Google I/O Extended 1st Place",
  contactLine: "채용·협업 제안은 메일로 연락해 주세요.",
};

export const education = {
  school: "세종대학교 컴퓨터공학과",
  extras: ["AI Advanced Microdegree"],
  certifications: ["SQLD"],
};

export const featured = {
  slug: "cops-and-robbers",
  name: "경찰과도둑",
  summary: "현실의 술래잡기를 연결하는 실시간 위치 기반 야외 게임 앱",
  description:
    "친구·동료·가족이 스마트폰으로 함께 즐기는 경찰과 도둑 놀이입니다. 위치 공유부터 QR 체포, 팀 채팅, 게임 판정까지 하나의 앱으로 연결합니다.",
  period: "2025.10 – 2026",
  platform: "Flutter · Android & iOS",
  role: "Flutter 앱 개발 · GitHub Actions/Fastlane 배포 자동화 · UX 개선",
  features: ["실시간 위치 공유", "QR 체포·초대", "팀별 채팅", "자동 게임 판정"],
  stack: ["Flutter", "Riverpod", "Dio/Retrofit", "지도 SDK", "WebSocket(STOMP)", "Firebase"],
  badges: [
    "세종 창업 아이디어 리그 대상",
    "입주공모전 우수 창업 아이템상",
    "아롬 데모데이 특별상",
    "창업 동아리 SSUP 선정",
  ],
  events: ["서울대학페스티벌", "청춘대로", "서울게임타운"],
  links: [
    { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.elipair.copsandrobbers" },
    { label: "App Store", href: "https://apps.apple.com/us/app/cops-and-robbers-real-chase/id6756843948" },
    { label: "GitHub", href: "https://github.com/cops-and-robbers/cops-and-robbers-FE" },
  ],
  screens: [
    phone("cops-and-robbers", 1, "게임 중 지도 화면", "게임 중 지도 화면 — 팀원·상대 위치가 보이는 장면"),
    phone("cops-and-robbers", 2, "QR 체포 화면", "QR 체포 또는 QR 초대 화면"),
    phone("cops-and-robbers", 3, "팀 채팅 화면", "팀 채팅 또는 게임 결과(판정) 화면"),
  ],
  event: {
    src: "/images/projects/cops-and-robbers/event.webp",
    alt: "행사 부스 현장",
    aspect: "wide",
    brief: "서울대학페스티벌 등 행사 부스 현장 사진",
  } satisfies ImageSpec,
  icon: appIcon("cops-and-robbers", "경찰과도둑"),
};

export const projects: Project[] = [
  {
    slug: "party-passport",
    tier: 2,
    name: "Party Passport",
    summary: "파티에서 QR로 만난 사람을 스탬프로 모으고, 서로 고른 사람만 매칭되는 웹앱",
    stack: ["React", "TypeScript", "Vite"],
    period: "2026.08",
    badges: ["Google I/O Extended: Hack the Beat 1st Place"],
    links: [
      { label: "Live Demo", href: "https://twin-fang.github.io/Hack-the-Beat/" },
      { label: "GitHub", href: "https://github.com/Twin-Fang/Hack-the-Beat" },
    ],
    images: [
      phone("party-passport", 1, "배지 모음 화면", "배지 모음 또는 상호 매칭 결과 화면 (Hack-the-Beat 저장소 docs/images/04-badges.png, 05-result.png 재사용 가능)"),
    ],
  },
  {
    slug: "tripgether",
    tier: 2,
    name: "트립게더",
    summary: "SNS 게시물을 공유하면 장소 정보를 정리하는 AI 여행 가이드",
    stack: ["Flutter"],
    period: "2025.09 – 2025.11",
    badges: ["세종대 창업캠프 대상", "롯데 청년기업가대상 본선"],
    links: [{ label: "GitHub", href: "https://github.com/EM-H20/Tripgether-FE" }],
    images: [phone("tripgether", 1, "장소 정리 화면", "SNS 게시물 공유 후 장소가 정리된 화면")],
  },
  {
    slug: "stocker",
    tier: 2,
    name: "Stocker",
    summary: "주식투자를 배우는 핀테크 교육 앱 · 팀 돔황촤 코스피",
    stack: ["Flutter"],
    period: "2025.05 – 2025.11",
    badges: ["Seeds 팀 프로젝트 우수상"],
    links: [
      { label: "GitHub", href: "https://github.com/EM-H20/stocker" },
      { label: "상장", href: "https://github.com/user-attachments/files/26157168/_.pdf" },
    ],
    images: [phone("stocker", 1, "학습 메인 화면", "학습/모의투자 메인 화면")],
  },
  {
    slug: "block-drag",
    tier: 2,
    name: "Block Drag",
    summary: "공간 감각을 활용하는 퍼즐 게임",
    stack: ["Flutter", "Supabase"],
    period: "2025.05 – 2025.07",
    badges: ["Google Play · App Store 출시"],
    shipped: true,
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.elipair.blockdrag&pli=1" },
      { label: "App Store", href: "https://apps.apple.com/us/app/block-drag/id6745786081" },
    ],
    images: [phone("block-drag", 1, "퍼즐 플레이 화면", "퍼즐 플레이 화면")],
    icon: appIcon("block-drag", "Block Drag"),
  },
  {
    slug: "rulebook",
    tier: 2,
    name: "RuleBook",
    summary: "보드게임 규칙 검색·북마크 앱",
    stack: ["Flutter"],
    period: "2025.03 – 2025.06",
    badges: ["Google Play · App Store 출시"],
    shipped: true,
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.elipair.rulebook" },
      { label: "App Store", href: "https://apps.apple.com/us/app/%EB%A3%B0%EB%B6%81-rulebook/id6745808744" },
    ],
    images: [phone("rulebook", 1, "규칙 검색 화면", "규칙 검색 결과 또는 상세 화면")],
    icon: appIcon("rulebook", "RuleBook"),
  },
  {
    slug: "wanik-sejong",
    tier: 2,
    name: "완익세종",
    summary: "SW-AI 해커톤 웹 프로젝트 · 팀 완익고무 100점",
    stack: ["React", "Next.js"],
    period: "2025.12.23 – 2025.12.24",
    badges: ["SW-AI 해커톤 장려상"],
    links: [{ label: "GitHub", href: "https://github.com/Wanik-Sejong/Wanik-Sejong-FE" }],
    images: [
      {
        src: "/images/projects/wanik-sejong/1.webp",
        alt: "완익세종 웹 메인 화면",
        aspect: "wide",
        brief: "웹 메인 화면 캡처 (데스크톱, 16:10)",
      },
    ],
  },
  {
    slug: "space-study-ship",
    tier: 3,
    name: "우주공부선",
    summary: "스터디 목표 설정·학습 기록·공유 플랫폼",
    stack: ["Flutter"],
    period: "2026.01 – 2026",
    badges: [],
    links: [{ label: "GitHub", href: "https://github.com/SpaceStudyShip/SpaceStudyShip-FE" }],
    images: [],
  },
  {
    slug: "second-brain-template",
    tier: 3,
    name: "Second Brain Template",
    summary: "회의·문서·이슈·의사결정을 연결하는 AI 에이전트용 Markdown 지식 관리 템플릿",
    stack: ["JavaScript", "Markdown"],
    period: "2026.07",
    badges: [],
    links: [{ label: "GitHub", href: "https://github.com/EM-H20/second-brain-template" }],
    images: [],
  },
  {
    slug: "emotion-diary",
    tier: 3,
    name: "Emotion Diary",
    summary: "감정을 기록하고 일상을 돌아보는 다이어리",
    stack: ["React"],
    period: "2025.07 – 2025.08",
    badges: [],
    links: [{ label: "Website", href: "https://emotion-diary-theta-eight.vercel.app/" }],
    images: [],
  },
  {
    slug: "nyangseng",
    tier: 3,
    name: "냥생뭐였니?",
    summary: "고양이를 테마로 한 웹 콘텐츠",
    stack: ["Next.js"],
    period: "2024.11 – 2024.12",
    badges: [],
    links: [
      { label: "Website", href: "https://nyangseng.vercel.app" },
      { label: "GitHub", href: "https://github.com/EM-H20/Nyangseng" },
    ],
    images: [],
  },
  {
    slug: "planning",
    tier: 3,
    name: "플래닝",
    summary: "로스트아크 정보를 제공하는 Discord 봇",
    stack: ["Python", "Oracle Cloud"],
    period: "2024.11 – 2024.12",
    badges: [],
    links: [{ label: "GitHub", href: "https://github.com/EM-H20/DiscordBot" }],
    images: [],
  },
  {
    slug: "eunsaem",
    tier: 3,
    name: "은샘침례교회",
    summary: "교회 홈페이지와 API 서버 — 실제 운영 중",
    stack: ["Next.js", "TypeScript", "FastAPI", "Docker", "Oracle Cloud"],
    period: "2025.07 – 2025.11",
    badges: [],
    links: [{ label: "Website", href: "https://www.eunsaem.com/" }],
    images: [],
  },
];

export const awards: Award[] = [
  { award: "1st Place", contest: "Google I/O Extended: Hack the Beat · GDG Campus Korea", project: "Party Passport", year: 2026, highlight: true },
  { award: "대상", contest: "세종대학교 SW중심대학 · 세종 창업 아이디어 리그", project: "경찰과도둑", year: 2026, highlight: true },
  { award: "우수 창업 아이템상", contest: "세종대학교 하반기 입주공모전", project: "경찰과도둑", year: 2026, highlight: false },
  { award: "특별상", contest: "세종대학교 중앙학술동아리 아롬 데모데이", project: "경찰과도둑", year: 2026, highlight: false },
  { award: "선정", contest: "세종대학교 창업 동아리 SSUP", project: "경찰과도둑", year: 2026, highlight: false },
  { award: "대상", contest: "세종대학교 창업캠프", project: "트립게더", year: 2025, highlight: true },
  { award: "본선 진출", contest: "제2회 신격호 롯데 청년기업가대상", project: "트립게더", year: 2025, highlight: false },
  { award: "우수상", contest: "연합동아리 Seeds 팀 프로젝트", project: "Stocker", year: 2025, highlight: false },
  { award: "장려상", contest: "제13회 세종대학교 SW-AI 해커톤", project: "완익세종", year: 2025, highlight: false },
];

export const stack: StackGroup[] = [
  { group: "Mobile", items: ["Flutter", "Dart", "Riverpod"] },
  { group: "Frontend", items: ["React", "Next.js", "TypeScript", "HTML", "CSS"] },
  { group: "Backend", items: ["Python", "FastAPI", "Java", "Spring"] },
  { group: "Data & Realtime", items: ["Supabase", "Firebase", "WebSocket / STOMP"] },
  { group: "DevOps", items: ["Docker", "Oracle Cloud", "Vercel", "Git", "GitHub Actions", "Fastlane"] },
];

export const profilePhoto: ImageSpec = {
  src: "/images/profile.webp",
  alt: "홍의민 프로필 사진",
  aspect: "square",
  brief: "프로필 사진 — PDF 표지에만 사용",
};

export const ogImage: ImageSpec = {
  src: "/images/og.png",
  alt: "홍의민 포트폴리오",
  aspect: "og",
  brief: "링크 공유 미리보기 (1200×630) — 이름 + 한 줄 소개, 흑백 스타일",
};

export function shippedNames(): string[] {
  return [featured.name, ...projects.filter((p) => p.shipped).map((p) => p.name)];
}

export function heroStats(): string[] {
  return [`수상·선정 ${awards.length}건`, `스토어 출시 앱 ${shippedNames().length}개`, hero.topAward];
}

export function cliLines(): CliLine[] {
  return [
    { kind: "cmd", text: "whoami" },
    { kind: "ok", text: education.school },
    ...education.certifications.map((text): CliLine => ({ kind: "ok", text })),
    { kind: "cmd", text: "ls shipped/" },
    { kind: "ok", text: shippedNames().join(" · ") },
  ];
}

export function allImages(): ImageSpec[] {
  return [
    ...featured.screens,
    featured.event,
    featured.icon,
    ...projects.flatMap((p) => [...p.images, ...(p.icon ? [p.icon] : [])]),
    profilePhoto,
    ogImage,
  ];
}
```

Image count: 3 screens + event + icon + 6 project images + 2 icons + profile + og = 15 (test asserts ≥ 14).

- [ ] **Step 5: Run tests to verify they pass**

Run: `pnpm test`
Expected: 4 tests pass. If Node prints an ExperimentalWarning about type stripping, that is fine.

- [ ] **Step 6: Add PDF settings to `src/lib/site.ts`**

Add inside the `site` object, after `tagline`:

```ts
  // scripts/build-pdf.mjs writes out/portfolio.pdf; keep the two in sync
  pdf: { href: "/portfolio.pdf", filename: "홍의민_포트폴리오.pdf" },
```

- [ ] **Step 7: Typecheck via build, then commit**

Run: `pnpm lint && pnpm build` — Expected: success (`allowImportingTsExtensions` accepted with `noEmit`).

```bash
git add src/content/profile.ts src/content/profile.test.ts src/lib/site.ts tsconfig.json package.json
git commit -m "feat: add typed portfolio content with data tests

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 3: Route group, Container, Button, Nav, and the /design page

**Files:**
- Move: `src/app/page.tsx` → `src/app/(site)/page.tsx`; `src/app/blog/` → `src/app/(site)/blog/`
- Create: `src/app/(site)/layout.tsx`, `src/app/(site)/design/page.tsx`
- Create: `src/components/ui/Container.tsx`, `src/components/ui/Eyebrow.tsx`, `src/components/ui/Button.tsx`, `src/components/ui/Nav.tsx`

**Interfaces:**
- Consumes: tokens (Task 1), `links` (Task 2), `site.pdf` (Task 2)
- Produces:
  - `Container({ className?: string; children: ReactNode })`
  - `Section({ id: string; eyebrow: string; title: string; children: ReactNode })` — renders `<section id>` with `scroll-mt-20`, `Eyebrow`, `<h2 id="{id}-title">`
  - `Eyebrow({ children: ReactNode })`
  - `Button({ href: string; variant?: "primary" | "ghost" | "pill" | "text"; download?: string; children: ReactNode })`
  - `Nav()`

- [ ] **Step 1: Move routes into the `(site)` group**

```bash
mkdir -p "src/app/(site)"
git mv src/app/page.tsx "src/app/(site)/page.tsx"
git mv src/app/blog "src/app/(site)/blog"
```

- [ ] **Step 2: Create `src/components/ui/Eyebrow.tsx`**

```tsx
import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 font-mono text-eyebrow text-fg uppercase">{children}</p>;
}
```

- [ ] **Step 3: Create `src/components/ui/Container.tsx`**

```tsx
import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 lg:px-12 ${className}`}>{children}</div>;
}

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={`${id}-title`} className="text-heading font-book text-fg">
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/Button.tsx`**

```tsx
import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "pill" | "text";

const BASE =
  "inline-flex items-center justify-center gap-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

const VARIANTS: Record<Variant, string> = {
  primary: "min-h-10 rounded-card bg-inverted px-3 text-on-inverted hover:opacity-85",
  ghost: "min-h-10 rounded-card px-5 text-fg-muted shadow-hairline hover:text-fg",
  // Visually 28px tall (refero pill); the pseudo-element extends the hit area to 40px.
  pill: "relative h-7 rounded-full bg-inverted px-3 text-on-inverted before:absolute before:inset-x-0 before:-inset-y-1.5 hover:opacity-85",
  text: "min-h-10 px-1 text-fg-muted hover:text-fg",
};

export function Button({
  href,
  variant = "primary",
  download,
  children,
}: {
  href: string;
  variant?: Variant;
  download?: string;
  children: ReactNode;
}) {
  const className = `${BASE} ${VARIANTS[variant]}`;
  if (href.startsWith("/") && download === undefined) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      download={download}
      className={className}
      {...(external && { target: "_blank", rel: "noreferrer" })}
    >
      {children}
    </a>
  );
}
```

- [ ] **Step 5: Create `src/components/ui/Nav.tsx`**

```tsx
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { links } from "@/content/profile";
import { site } from "@/lib/site";

const SECTIONS = [
  { href: "/#projects", label: "Projects" },
  { href: "/#awards", label: "Awards" },
  { href: "/#stack", label: "Stack" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-8">
        <Link href="/" className="text-sm font-medium text-fg">
          {site.shortName}
        </Link>
        <nav aria-label="섹션" className="hidden items-center gap-6 md:flex">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="text-sm text-fg-muted hover:text-fg">
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button href={site.pdf.href} download={site.pdf.filename} variant="text">
            PDF
          </Button>
          <Button href="/blog" variant="text">
            Blog
          </Button>
          <Button href={links.github.href} variant="pill">
            GitHub
          </Button>
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 6: Create `src/app/(site)/layout.tsx`**

```tsx
import { Nav } from "@/components/ui/Nav";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Nav />
      {children}
    </>
  );
}
```

- [ ] **Step 7: Create `src/app/(site)/design/page.tsx` (first version)**

```tsx
import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export const metadata: Metadata = { title: "Design", robots: { index: false } };

// Class names are listed literally so Tailwind generates them.
const SWATCHES = [
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["inverted", "bg-inverted"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["fg-subtle", "bg-fg-subtle"],
  ["fg-faint", "bg-fg-faint"],
  ["hairline", "bg-hairline"],
  ["skeleton", "bg-skeleton"],
  ["accent", "bg-accent"],
] as const;

const TYPE = [
  ["display", "text-display font-book"],
  ["heading-lg", "text-heading-lg font-book"],
  ["heading", "text-heading font-book"],
  ["body", "text-body"],
  ["caption", "text-caption"],
] as const;

export default function DesignPage() {
  return (
    <main className="flex-1 py-16">
      <Container className="space-y-16">
        <section>
          <Eyebrow>Colors</Eyebrow>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SWATCHES.map(([name, cls]) => (
              <li key={name} className="space-y-2">
                <div className={`h-16 rounded-card shadow-hairline ${cls}`} />
                <p className="font-mono text-eyebrow text-fg-subtle uppercase">{name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Eyebrow>Type</Eyebrow>
          <div className="space-y-6">
            {TYPE.map(([name, cls]) => (
              <div key={name}>
                <p className="font-mono text-eyebrow text-fg-subtle uppercase">{name}</p>
                <p className={cls}>홍의민 Turning Ideas Into Real Products</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Eyebrow>Buttons</Eyebrow>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="mailto:test@example.com">Primary</Button>
            <Button href="https://github.com" variant="ghost">
              Ghost
            </Button>
            <Button href="https://github.com" variant="pill">
              Pill
            </Button>
            <Button href="/blog" variant="text">
              Text
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
```

- [ ] **Step 8: Verify in the browser**

Run: `pnpm lint && pnpm build`, then `pnpm dev`.
With Playwright: open `http://localhost:3000/design` at 1280×900 and 375×812, screenshot each in light and in dark (`emulateMedia({ colorScheme: "dark" })`). Check:
- Swatches show distinct values; dark swatches differ from light.
- Display line is 64px at 1280 and 40px at 375; tight tracking visible.
- Nav is sticky with blur, `Elipair` left, section links hidden at 375, `PDF` `Blog` `GitHub` right.
- Pill button: measure with `page.evaluate(() => { const r = document.querySelector('header a[href^="https://github"]').getBoundingClientRect(); return r.height; })` → 28; tap area: `document.elementFromPoint(r.x + 5, r.y - 4)` returns the same anchor.
- `/` and `/blog` still render (now with Nav).

- [ ] **Step 9: Commit**

```bash
git add -A "src/app/(site)" src/components/ui
git status --short   # the git mv renames from Step 1 are already staged
git commit -m "feat: add route group with nav, container, button and design page

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 4: Card, Tag, CliPanel, Skeleton, ImageSlot

**Files:**
- Create: `src/components/ui/Card.tsx`, `Tag.tsx`, `CliPanel.tsx`, `Skeleton.tsx`, `ImageSlot.tsx`
- Modify: `src/app/(site)/design/page.tsx`, `src/app/layout.tsx`

**Interfaces:**
- Consumes: `ImageSpec`, `ImageAspect`, `CliLine`, `allImages`, `ogImage` (Task 2)
- Produces:
  - `Card({ inverted?: boolean; size?: "sm" | "md" | "lg"; className?: string; children: ReactNode })`
  - `Tag({ tone?: "default" | "award"; children: ReactNode })`, `TagList({ items: readonly string[]; tone?: "default" | "award"; className?: string })`
  - `CliPanel({ lines: readonly CliLine[]; starts?: readonly number[] })` — `starts` is filled in by Task 5; without it lines render statically
  - `Skeleton({ className?: string })`
  - `imageExists(src: string): boolean`, `visibleImages(images: readonly ImageSpec[], showMissing?: boolean): ImageSpec[]`, `ImageSlot({ image: ImageSpec; eager?: boolean; className?: string })`

- [ ] **Step 1: Create `src/components/ui/Card.tsx`**

```tsx
import type { ReactNode } from "react";

const SIZES = { sm: "p-4", md: "p-6", lg: "p-8 md:p-10" } as const;

export function Card({
  inverted = false,
  size = "sm",
  className = "",
  children,
}: {
  inverted?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  const surface = inverted ? "scheme-inverted bg-inverted text-on-inverted" : "bg-surface shadow-card";
  return <div className={`rounded-card ${surface} ${SIZES[size]} ${className}`}>{children}</div>;
}
```

- [ ] **Step 2: Create `src/components/ui/Tag.tsx`**

```tsx
import type { ReactNode } from "react";

type Tone = "default" | "award";

export function Tag({ tone = "default", children }: { tone?: Tone; children: ReactNode }) {
  const color = tone === "award" ? "font-medium text-fg" : "text-fg-subtle";
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-eyebrow uppercase shadow-hairline ${color}`}>
      {children}
    </span>
  );
}

export function TagList({
  items,
  tone = "default",
  className = "",
}: {
  items: readonly string[];
  tone?: Tone;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Tag tone={tone}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
```

- [ ] **Step 3: Create `src/components/ui/Skeleton.tsx`**

```tsx
export function Skeleton({ className = "" }: { className?: string }) {
  return <div aria-hidden="true" className={`skeleton ${className}`} />;
}
```

- [ ] **Step 4: Create `src/components/ui/CliPanel.tsx` (static version)**

```tsx
import type { CliLine } from "@/content/profile";

const PREFIX: Record<CliLine["kind"], string> = { cmd: "$", ok: "✓" };

export function CliPanel({ lines }: { lines: readonly CliLine[] }) {
  return (
    <div className="rounded-card bg-surface p-4 font-mono text-[13px] leading-relaxed text-fg shadow-hairline">
      {lines.map((line, i) => (
        <p key={i} className="flex gap-2">
          <span aria-hidden="true" className={line.kind === "ok" ? "text-accent" : undefined}>
            {PREFIX[line.kind]}
          </span>
          <span>{line.text}</span>
        </p>
      ))}
    </div>
  );
}
```

- [ ] **Step 5: Create `src/components/ui/ImageSlot.tsx`**

```tsx
import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ImageAspect, ImageSpec } from "@/content/profile";

const ASPECT: Record<ImageAspect, string> = {
  phone: "aspect-[9/19.5]",
  wide: "aspect-[16/10]",
  square: "aspect-square",
  og: "aspect-[1200/630]",
};

const RECOMMENDED: Record<ImageAspect, string> = {
  phone: "1080×2340",
  wide: "1600×1000",
  square: "512×512",
  og: "1200×630",
};

// Runs at build time (static export), so this checks the repo's public/ folder.
export function imageExists(src: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

// Dev shows placeholders for files not added yet; production drops them so nothing looks unfinished.
export function visibleImages(
  images: readonly ImageSpec[],
  showMissing = process.env.NODE_ENV === "development",
): ImageSpec[] {
  return images.filter((image) => showMissing || imageExists(image.src));
}

export function ImageSlot({
  image,
  eager = false,
  className = "",
}: {
  image: ImageSpec;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden rounded-card ${ASPECT[image.aspect]} ${className}`}>
      {imageExists(image.src) ? (
        <>
          <Skeleton className="absolute inset-0" />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            loading={eager ? "eager" : "lazy"}
            className="object-cover object-top"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center gap-1 rounded-card border border-dashed border-hairline p-3 font-mono text-[11px] leading-snug break-all text-fg-subtle">
          <span className="text-fg">{image.brief}</span>
          <span>{image.src}</span>
          <span>{RECOMMENDED[image.aspect]}</span>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 6: Add the OG image to `src/app/layout.tsx`**

Add imports:

```tsx
import { imageExists } from "@/components/ui/ImageSlot";
import { ogImage } from "@/content/profile";
```

Change the `openGraph` line in `metadata` to:

```tsx
  openGraph: {
    ...baseOpenGraph,
    type: "website",
    ...(imageExists(ogImage.src) && { images: [ogImage.src] }),
  },
```

- [ ] **Step 7: Extend `/design` with the new components**

In `src/app/(site)/design/page.tsx` add imports:

```tsx
import { Card } from "@/components/ui/Card";
import { CliPanel } from "@/components/ui/CliPanel";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tag, TagList } from "@/components/ui/Tag";
import { allImages, cliLines } from "@/content/profile";
```

Append these sections inside `<Container>` after the Buttons section:

```tsx
        <section>
          <Eyebrow>Cards</Eyebrow>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <p className="text-body">sm card</p>
            </Card>
            <Card size="md">
              <p className="text-body text-fg-muted">md card</p>
            </Card>
            <Card inverted size="lg">
              <Eyebrow>Inverted</Eyebrow>
              <p className="text-body text-fg-muted">lg inverted card</p>
              <TagList items={["Flutter", "Riverpod"]} className="mt-4" />
              <div className="mt-4">
                <Button href="https://github.com" variant="ghost">
                  Ghost on inverted
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <Eyebrow>Tags</Eyebrow>
          <div className="flex flex-wrap gap-2">
            <Tag>Flutter</Tag>
            <Tag tone="award">대상</Tag>
          </div>
        </section>

        <section>
          <Eyebrow>CLI Panel</Eyebrow>
          <div className="max-w-md">
            <CliPanel lines={cliLines()} />
          </div>
        </section>

        <section>
          <Eyebrow>Skeleton</Eyebrow>
          <Skeleton className="h-24 max-w-md rounded-card" />
        </section>

        <section>
          <Eyebrow>Image slots (all)</Eyebrow>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {allImages().map((image) => (
              <li key={image.src}>
                <ImageSlot image={image} />
              </li>
            ))}
          </ul>
        </section>
```

- [ ] **Step 8: Verify components visually**

`pnpm dev`; screenshot `/design` at 1280 and 375, light and dark. Check: inverted card text is light-on-dark in light mode and dark-on-light in dark mode, its tags/ghost button use the inverted hairline; skeleton shimmers; each image slot shows brief + path + size in a dashed box; Korean tags not clipped.

- [ ] **Step 9: Build**

Run: `pnpm lint && pnpm build && grep -c "1080×2340" out/design.html`
Expected: success and a count ≥ 1 — `/design` renders every slot unfiltered on purpose (noindex, unlinked). The production filter (`visibleImages`) is verified on the home page in Task 6 Step 6.

- [ ] **Step 10: Commit**

```bash
git add src/components/ui "src/app/(site)/design/page.tsx" src/app/layout.tsx
git commit -m "feat: add card, tag, CLI panel, skeleton and image slot components

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 5: CSS-only typing effect

**Files:**
- Create: `src/lib/typing.ts`, `src/lib/typing.test.ts`, `src/components/ui/Typewriter.tsx`
- Modify: `src/components/ui/CliPanel.tsx`, `src/app/(site)/design/page.tsx`

**Interfaces:**
- Consumes: `hero`, `cliLines` (Task 2); `.type-char`, `.type-caret` CSS (Task 1)
- Produces: `CHAR_MS = 35`, `GAP_MS = 120`, `schedule(texts: readonly string[]): number[]` (start ms per text), `totalDuration(texts: readonly string[]): number`; `Typewriter({ text: string; start?: number })`; `CliPanel` gains `starts?: readonly number[]`

- [ ] **Step 1: Write the failing tests**

Create `src/lib/typing.test.ts`:

```ts
import assert from "node:assert/strict";
import { test } from "node:test";
import { cliLines, hero } from "../content/profile.ts";
import { CHAR_MS, GAP_MS, schedule, totalDuration } from "./typing.ts";

test("each text starts after the previous one finishes plus a gap", () => {
  assert.deepEqual(schedule(["ab", "가나다", "x"]), [0, 2 * CHAR_MS + GAP_MS, 5 * CHAR_MS + 2 * GAP_MS]);
});

test("length counts code points, not UTF-16 units", () => {
  assert.deepEqual(schedule(["😀", "a"]), [0, CHAR_MS + GAP_MS]);
});

test("empty input yields an empty schedule and zero duration", () => {
  assert.deepEqual(schedule([]), []);
  assert.equal(totalDuration([]), 0);
});

test("single text has no gap", () => {
  assert.equal(totalDuration(["abc"]), 3 * CHAR_MS);
});

test("hero typing finishes within 3 seconds", () => {
  const ms = totalDuration([hero.name, ...cliLines().map((l) => l.text)]);
  assert.ok(ms <= 3000, `hero typing takes ${ms}ms`);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `pnpm test`
Expected: FAIL — `Cannot find module '.../src/lib/typing.ts'`.

- [ ] **Step 3: Write `src/lib/typing.ts`**

```ts
// Hero typing timeline: texts type one after another with a short pause between them.
export const CHAR_MS = 35;
export const GAP_MS = 120;

const length = (text: string) => Array.from(text).length;

export function schedule(texts: readonly string[]): number[] {
  const starts: number[] = [];
  let t = 0;
  for (const text of texts) {
    starts.push(t);
    t += length(text) * CHAR_MS + GAP_MS;
  }
  return starts;
}

export function totalDuration(texts: readonly string[]): number {
  if (texts.length === 0) return 0;
  return texts.reduce((t, text) => t + length(text) * CHAR_MS, 0) + GAP_MS * (texts.length - 1);
}
```

Hand check of the hero test: 3 + 6 + 12 + 4 + 11 + 29 = 65 chars × 35 = 2275 ms + 5 gaps × 120 = 600 → 2875 ≤ 3000.

- [ ] **Step 4: Run tests to verify they pass**

Run: `pnpm test` — Expected: 9 tests pass (4 profile + 5 typing).

- [ ] **Step 5: Create `src/components/ui/Typewriter.tsx`**

```tsx
import { CHAR_MS } from "@/lib/typing";

// Pure CSS: all characters are server-rendered (so crawlers, print and no-JS see full text);
// each becomes visible at its own animation-delay. globals.css disables this for reduced motion and print.
export function Typewriter({ text, start = 0 }: { text: string; start?: number }) {
  const chars = Array.from(text);
  const end = start + chars.length * CHAR_MS;
  return (
    <>
      {chars.map((char, i) => (
        <span key={i} className="type-char" style={{ animationDelay: `${start + i * CHAR_MS}ms` }}>
          {char}
        </span>
      ))}
      <span aria-hidden="true" className="type-caret" style={{ animationDelay: `${start}ms, ${end}ms` }}>
        <span>▍</span>
      </span>
    </>
  );
}
```

- [ ] **Step 6: Add typing to `CliPanel`**

Replace `src/components/ui/CliPanel.tsx` with:

```tsx
import { Typewriter } from "@/components/ui/Typewriter";
import type { CliLine } from "@/content/profile";

const PREFIX: Record<CliLine["kind"], string> = { cmd: "$", ok: "✓" };

// Without `starts`, lines render statically.
export function CliPanel({ lines, starts }: { lines: readonly CliLine[]; starts?: readonly number[] }) {
  return (
    <div className="rounded-card bg-surface p-4 font-mono text-[13px] leading-relaxed text-fg shadow-hairline">
      {lines.map((line, i) => {
        const start = starts?.[i];
        const typed = start !== undefined;
        return (
          <p key={i} className="flex gap-2">
            <span
              aria-hidden="true"
              className={`${line.kind === "ok" ? "text-accent" : ""} ${typed ? "type-char" : ""}`}
              style={typed ? { animationDelay: `${start}ms` } : undefined}
            >
              {PREFIX[line.kind]}
            </span>
            <span>{typed ? <Typewriter text={line.text} start={start} /> : line.text}</span>
          </p>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 7: Add a typed sample to `/design`**

In `src/app/(site)/design/page.tsx`, import `{ hero }` additionally from `@/content/profile`, `{ schedule }` from `@/lib/typing`, `{ Typewriter }` from `@/components/ui/Typewriter`. At the top of `DesignPage()` (before `return`) add:

```tsx
  const lines = cliLines();
  const [nameStart, ...lineStarts] = schedule([hero.name, ...lines.map((l) => l.text)]);
```

and replace the CLI Panel section with:

```tsx
        <section>
          <Eyebrow>Typing (reload to replay)</Eyebrow>
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <p className="text-display font-book" aria-label={hero.name}>
              <Typewriter text={hero.name} start={nameStart} />
            </p>
            <CliPanel lines={lines} starts={lineStarts} />
          </div>
        </section>
```

- [ ] **Step 8: Review Focus #3 — verify typing, reduced motion and print**

`pnpm dev`, Playwright on `/design`:
1. Screenshot at t≈200ms after load: name partially typed, CLI empty except prefixes not yet shown. Screenshot at 3.5s: everything visible, caret gone, no layout shift between the two (compare the CLI panel's `getBoundingClientRect().height` at both times — equal).
2. `emulateMedia({ reducedMotion: "reduce" })`, reload, screenshot immediately: full name and all CLI lines visible, no caret.
3. `emulateMedia({ media: "print" })`, reload, screenshot immediately: full text visible.
4. Accessibility tree: Playwright `browser_snapshot` shows the name element as `홍의민` (from `aria-label`; the caret is `aria-hidden`).

- [ ] **Step 9: Lint, build, commit**

Run: `pnpm lint && pnpm build && pnpm test` — all succeed.

```bash
git add src/lib/typing.ts src/lib/typing.test.ts src/components/ui "src/app/(site)/design/page.tsx"
git commit -m "feat: add CSS-only typing effect for hero text and CLI panel

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 6: Home — Hero and Featured

**Files:**
- Create: `src/components/sections/Hero.tsx`, `src/components/sections/Featured.tsx`
- Rewrite: `src/app/(site)/page.tsx`

**Interfaces:**
- Consumes: `Button`, `Container`, `Section`, `Eyebrow`, `Card`, `TagList`, `CliPanel`, `Typewriter`, `ImageSlot`, `visibleImages`, `schedule`, `hero`, `heroStats`, `cliLines`, `links`, `featured`
- Produces: `Hero()`, `Featured()`

- [ ] **Step 1: Create `src/components/sections/Hero.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { CliPanel } from "@/components/ui/CliPanel";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Typewriter } from "@/components/ui/Typewriter";
import { cliLines, hero, heroStats, links } from "@/content/profile";
import { schedule } from "@/lib/typing";

export function Hero() {
  const lines = cliLines();
  const [nameStart, ...lineStarts] = schedule([hero.name, ...lines.map((l) => l.text)]);
  return (
    <Container className="grid gap-12 pt-16 pb-24 md:grid-cols-[1.2fr_1fr] md:items-center md:pt-28 md:pb-32">
      <div>
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="text-display font-book text-fg" aria-label={hero.name}>
          <Typewriter text={hero.name} start={nameStart} />
        </h1>
        <p className="mt-6 max-w-xl text-body text-fg-muted">{hero.intro}</p>
        <p className="mt-4 font-mono text-caption text-fg-subtle">{heroStats().join(" · ")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={links.email.href}>메일 보내기</Button>
          <Button href={links.github.href} variant="ghost">
            GitHub
          </Button>
        </div>
      </div>
      <CliPanel lines={lines} starts={lineStarts} />
    </Container>
  );
}
```

- [ ] **Step 2: Create `src/components/sections/Featured.tsx`**

```tsx
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import { TagList } from "@/components/ui/Tag";
import { featured } from "@/content/profile";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[96px_1fr] sm:gap-4">
      <dt className="font-mono text-eyebrow text-fg-subtle uppercase">{label}</dt>
      <dd className="text-sm text-fg-muted">{children}</dd>
    </div>
  );
}

export function Featured() {
  const screens = visibleImages(featured.screens);
  const [event] = visibleImages([featured.event]);
  const [icon] = visibleImages([featured.icon]);
  return (
    <Section id="featured" eyebrow="Featured Project" title="대표 프로젝트">
      <Card inverted size="lg">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {icon && <ImageSlot image={icon} className="size-10 shrink-0" />}
              <p className="font-mono text-eyebrow text-fg-subtle uppercase">
                {featured.period} · {featured.platform}
              </p>
            </div>
            <h3 className="mt-3 text-heading-lg font-book text-fg">{featured.name}</h3>
            <p className="mt-4 text-body text-fg">{featured.summary}</p>
            <p className="mt-2 text-body text-fg-muted">{featured.description}</p>
            <dl className="mt-8 space-y-4">
              <Row label="Role">{featured.role}</Row>
              <Row label="Features">{featured.features.join(" · ")}</Row>
            </dl>
            <TagList items={featured.stack} className="mt-6" />
          </div>
          <div className="space-y-8">
            <div>
              <Eyebrow>Awards</Eyebrow>
              <TagList items={featured.badges} tone="award" />
            </div>
            <div>
              <Eyebrow>Events</Eyebrow>
              <p className="text-sm text-fg-muted">{featured.events.join(" · ")}</p>
            </div>
          </div>
        </div>
        {screens.length > 0 && (
          <ul className="mt-10 grid grid-cols-3 gap-3 md:max-w-xl md:gap-4">
            {screens.map((image) => (
              <li key={image.src}>
                <ImageSlot image={image} />
              </li>
            ))}
          </ul>
        )}
        {event && <ImageSlot image={event} className="mt-6 md:max-w-xl" />}
        <div className="mt-10 flex flex-wrap gap-3">
          {featured.links.map((link) => (
            <Button key={link.href} href={link.href} variant="ghost">
              {link.label}
            </Button>
          ))}
        </div>
      </Card>
    </Section>
  );
}
```

- [ ] **Step 3: Rewrite `src/app/(site)/page.tsx`**

```tsx
import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Featured />
    </main>
  );
}
```

- [ ] **Step 4: Visual check**

`pnpm dev`, screenshot `/` at 1280 and 375, light and dark. Check: hero two columns at 1280, stacked at 375; stats line in mono; featured card is dark in light mode (light in dark mode) with readable text, award tags, image placeholders (dev), ghost buttons with visible rings.

- [ ] **Step 5: Lint and build**

Run: `pnpm lint && pnpm build` — success.

- [ ] **Step 6: Review Focus #2 — production image control on the home page**

Negative control (no image files exist):

```bash
grep -c "images/projects" out/index.html
```

Expected: `0` (no placeholders, no image rows).

Positive control:

```bash
mkdir -p public/images/projects/cops-and-robbers
printf 'placeholder' > public/images/projects/cops-and-robbers/1.webp   # existence is all the build checks
pnpm build
grep -o 'src="/images/projects/cops-and-robbers/1.webp"' out/index.html | head -1
rm -r public/images
```

Expected: the grep prints the `src` attribute. `public/images` did not exist before this step, so `rm -r` restores the tree; confirm `git status --short public` is empty.

- [ ] **Step 7: Commit**

```bash
git add src/components/sections "src/app/(site)/page.tsx"
git commit -m "feat: add hero and featured project sections

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 7: Home — Projects, Awards, Stack, Contact

**Files:**
- Create: `src/components/sections/Projects.tsx`, `Awards.tsx`, `Stack.tsx`, `Contact.tsx`
- Modify: `src/app/(site)/page.tsx`

**Interfaces:**
- Consumes: `Section`, `Card`, `Tag`, `TagList`, `Button`, `ImageSlot`, `visibleImages`, `projects`, `Project`, `awards`, `stack`, `hero`, `links`, `site.pdf`
- Produces: `Projects()`, `Awards()`, `Stack()`, `Contact()`

- [ ] **Step 1: Create `src/components/sections/Projects.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Container";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import { TagList } from "@/components/ui/Tag";
import { type Project, projects } from "@/content/profile";

function Links({ project }: { project: Project }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-6">
      {project.links.map((link) => (
        <Button key={link.href} href={link.href} variant="ghost">
          {link.label}
        </Button>
      ))}
    </div>
  );
}

function MajorProject({ project }: { project: Project }) {
  const [image] = visibleImages(project.images);
  const [icon] = project.icon ? visibleImages([project.icon]) : [];
  return (
    <Card size="md" className="flex h-full flex-col gap-6 sm:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3">
          {icon && <ImageSlot image={icon} className="size-10 shrink-0" />}
          <h3 className="text-heading font-book text-fg">{project.name}</h3>
        </div>
        <TagList items={project.badges} tone="award" className="mt-4" />
        <p className="mt-4 text-body text-fg-muted">{project.summary}</p>
        <TagList items={[...project.stack, project.period]} className="mt-4" />
        <Links project={project} />
      </div>
      {image && (
        <ImageSlot
          image={image}
          className={`w-full shrink-0 self-center sm:self-start ${image.aspect === "phone" ? "max-w-40" : "sm:max-w-56"}`}
        />
      )}
    </Card>
  );
}

function MinorProject({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col">
      <h3 className="text-xl font-medium text-fg">{project.name}</h3>
      <p className="mt-2 text-sm text-fg-muted">{project.summary}</p>
      <TagList items={[...project.stack, project.period]} className="mt-4" />
      <Links project={project} />
    </Card>
  );
}

export function Projects() {
  const major = projects.filter((p) => p.tier === 2);
  const minor = projects.filter((p) => p.tier === 3);
  return (
    <Section id="projects" eyebrow="Projects" title="프로젝트">
      <ul className="grid gap-6 md:grid-cols-2">
        {major.map((project) => (
          <li key={project.slug}>
            <MajorProject project={project} />
          </li>
        ))}
      </ul>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {minor.map((project) => (
          <li key={project.slug}>
            <MinorProject project={project} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
```

(`text-xl` is Tailwind's default 20px size — font sizes are not disabled, only colors.)

- [ ] **Step 2: Create `src/components/sections/Awards.tsx`**

```tsx
import { Section } from "@/components/ui/Container";
import { awards } from "@/content/profile";

// Award name leads each row (F-pattern scanning); on mobile: award | year, then contest, then project.
export function Awards() {
  return (
    <Section id="awards" eyebrow="Awards" title="수상">
      <ol className="divide-y divide-hairline border-y border-hairline">
        {awards.map((a) => (
          <li
            key={`${a.year}-${a.contest}`}
            className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-4 md:grid-cols-[180px_1fr_160px_64px] md:items-baseline"
          >
            <span className={`order-1 ${a.highlight ? "font-medium text-fg" : "text-fg-muted"}`}>{a.award}</span>
            <span className="order-2 font-mono text-caption text-fg-subtle md:order-4 md:text-right">{a.year}</span>
            <span className="order-3 col-span-2 text-fg-muted md:order-2 md:col-span-1">{a.contest}</span>
            <span className="order-4 col-span-2 text-sm text-fg-subtle md:order-3 md:col-span-1">{a.project}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
```

- [ ] **Step 3: Create `src/components/sections/Stack.tsx`**

```tsx
import { Fragment } from "react";
import { Section } from "@/components/ui/Container";
import { TagList } from "@/components/ui/Tag";
import { stack } from "@/content/profile";

export function Stack() {
  return (
    <Section id="stack" eyebrow="Tech Stack" title="기술 스택">
      <dl className="grid gap-x-6 gap-y-4 md:grid-cols-[180px_1fr]">
        {stack.map((group) => (
          <Fragment key={group.group}>
            <dt className="pt-1 font-mono text-eyebrow text-fg-subtle uppercase">{group.group}</dt>
            <dd>
              <TagList items={group.items} />
            </dd>
          </Fragment>
        ))}
      </dl>
    </Section>
  );
}
```

- [ ] **Step 4: Create `src/components/sections/Contact.tsx`**

```tsx
import { Button } from "@/components/ui/Button";
import { Section } from "@/components/ui/Container";
import { hero, links } from "@/content/profile";
import { site } from "@/lib/site";

export function Contact() {
  return (
    <Section id="contact" eyebrow="Contact" title="함께 일해요">
      <p className="max-w-xl text-body text-fg-muted">{hero.contactLine}</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Button href={links.email.href}>메일 보내기</Button>
        <Button href={site.pdf.href} download={site.pdf.filename} variant="ghost">
          PDF 포트폴리오 받기
        </Button>
      </div>
      <ul className="mt-16 flex flex-wrap gap-x-6 gap-y-2">
        {Object.values(links).map((link) => (
          <li key={link.href}>
            <Button href={link.href} variant="text">
              {link.label}
            </Button>
          </li>
        ))}
      </ul>
      <p className="mt-8 font-mono text-caption text-fg-subtle">
        © {new Date().getFullYear()} {site.name}
      </p>
    </Section>
  );
}
```

- [ ] **Step 5: Compose the home page**

Replace `src/app/(site)/page.tsx`:

```tsx
import { Awards } from "@/components/sections/Awards";
import { Contact } from "@/components/sections/Contact";
import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Stack } from "@/components/sections/Stack";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Featured />
      <Projects />
      <Awards />
      <Stack />
      <Contact />
    </main>
  );
}
```

- [ ] **Step 6: Visual check + nav anchors**

`pnpm dev`; full-page screenshots of `/` at 1280 and 375, light and dark. Check: tier-2 cards are visibly larger than tier-3; award rows lead with the award name; mobile award rows show award|year on line 1; clicking Nav `Projects` scrolls so the section title is not hidden under the sticky bar.

- [ ] **Step 7: Lint, build, commit**

Run: `pnpm lint && pnpm build && grep -c "images/projects" out/index.html` — success and `0`.

```bash
git add src/components/sections "src/app/(site)/page.tsx"
git commit -m "feat: add projects, awards, stack and contact sections

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 8: Blog restyle

**Files:**
- Modify: `src/app/(site)/blog/page.tsx`, `src/app/(site)/blog/[slug]/page.tsx`, `src/mdx-components.tsx`

**Interfaces:**
- Consumes: `Container`, `Eyebrow`, tokens

- [ ] **Step 1: Restyle the blog list**

Replace the `return (...)` of `BlogPage` in `src/app/(site)/blog/page.tsx` and add the imports `import { Container } from "@/components/ui/Container";` and `import { Eyebrow } from "@/components/ui/Eyebrow";`:

```tsx
  return (
    <main className="flex-1 py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>Blog</Eyebrow>
          <h1 className="text-heading-lg font-book text-fg">글</h1>
          <ul className="mt-12 divide-y divide-hairline border-y border-hairline">
            {posts.map((post) => (
              <li key={post.slug} className="py-6">
                <Link href={`/blog/${post.slug}`} className="text-xl font-medium text-fg hover:underline">
                  {post.title}
                </Link>
                <p className="mt-2 text-body text-fg-muted">{post.description}</p>
                <time dateTime={post.date} className="mt-2 block font-mono text-caption text-fg-subtle">
                  {post.date}
                </time>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
```

(Width is capped by an inner `div`, not a second `max-w-*` on `Container`, so no two `max-width` utilities compete.)

- [ ] **Step 2: Restyle the post page**

In `src/app/(site)/blog/[slug]/page.tsx`, add `import { Container } from "@/components/ui/Container";` and replace the `return (...)` of `PostPage`:

```tsx
  return (
    <main className="flex-1 py-16 md:py-24">
      <Container>
        <article className="max-w-3xl">
          <time dateTime={meta.date} className="font-mono text-caption text-fg-subtle">
            {meta.date}
          </time>
          <h1 className="mt-3 text-heading-lg font-book text-fg">{meta.title}</h1>
          <div className="mt-12">
            <Content />
          </div>
        </article>
      </Container>
    </main>
  );
```

- [ ] **Step 3: MDX element styles**

Replace `src/mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types";

// Required by @next/mdx in the App Router. Maps markdown elements to token-styled elements.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 text-heading font-book text-fg" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-medium text-fg" {...props} />,
  p: (props) => <p className="my-4 text-body text-fg-muted" {...props} />,
  a: (props) => <a className="text-accent underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6 text-fg-muted" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6 text-fg-muted" {...props} />,
  blockquote: (props) => <blockquote className="my-6 border-l-2 border-hairline pl-4 text-fg-subtle" {...props} />,
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-card bg-surface p-4 font-mono text-[13px] shadow-hairline" {...props} />
  ),
  code: (props) => <code className="font-mono text-[0.9em] text-fg" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

(`h1` is not mapped: the post title is the page `h1`; posts start at `##`.)

- [ ] **Step 4: Verify and commit**

`pnpm lint && pnpm build`; screenshot `/blog` and `/blog/hello-world` at 1280 and 375. Check: content column ≈768px wide at 1280; inline code and list readable in dark.

```bash
git add "src/app/(site)/blog" src/mdx-components.tsx
git commit -m "feat: restyle blog with design tokens

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 9: /print page

**Files:**
- Create: `src/app/print/page.tsx`

**Interfaces:**
- Consumes: `awards`, `education`, `featured`, `hero`, `heroStats`, `links`, `profilePhoto`, `projects`, `stack`, `Project`, `ImageSlot`, `visibleImages`, `site`
- Produces: route `/print` (static `out/print.html`)

- [ ] **Step 1: Create `src/app/print/page.tsx`**

```tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import {
  awards,
  education,
  featured,
  hero,
  heroStats,
  links,
  type LinkSpec,
  profilePhoto,
  type Project,
  projects,
  stack,
} from "@/content/profile";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Portfolio PDF", robots: { index: false } };

const bare = (href: string) => href.replace(/^mailto:/, "").replace(/^https?:\/\//, "").replace(/\/$/, "");

function PrintLink({ link }: { link: LinkSpec }) {
  return (
    <a href={link.href} className="text-fg">
      {link.label} <span className="font-mono text-[10px] text-fg-subtle">{bare(link.href)}</span>
    </a>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="mb-2 font-mono text-eyebrow text-fg uppercase">{eyebrow}</p>
      <h2 className="mb-6 text-heading font-book">{title}</h2>
    </>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.071em] text-fg-subtle uppercase">{children}</p>;
}

function MajorBlock({ project }: { project: Project }) {
  const images = visibleImages(project.images);
  return (
    <article className="print-block border-t border-hairline py-6">
      <h3 className="text-xl font-medium">{project.name}</h3>
      <Meta>
        {project.period} · {project.stack.join(" · ")}
      </Meta>
      {project.badges.length > 0 && <p className="mt-2 text-sm font-medium">{project.badges.join(" · ")}</p>}
      <p className="mt-2 text-sm text-fg-muted">{project.summary}</p>
      {images.length > 0 && (
        <div className="mt-4 flex gap-3">
          {images.map((image) => (
            <ImageSlot key={image.src} image={image} eager className={image.aspect === "phone" ? "w-28" : "w-72"} />
          ))}
        </div>
      )}
      <ul className="mt-3 space-y-1 text-sm">
        {project.links.map((link) => (
          <li key={link.href}>
            <PrintLink link={link} />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PrintPage() {
  const [photo] = visibleImages([profilePhoto]);
  const screens = visibleImages(featured.screens);
  const [event] = visibleImages([featured.event]);
  const major = projects.filter((p) => p.tier === 2);
  const minor = projects.filter((p) => p.tier === 3);
  return (
    <main className="scheme-light mx-auto w-full max-w-[178mm] bg-canvas text-fg">
      <section className="flex gap-8 pt-6">
        <div className="flex-1">
          <p className="font-mono text-eyebrow uppercase">{hero.eyebrow}</p>
          <h1 className="mt-3 text-[48px] leading-none font-book tracking-[-0.06em]">
            {hero.name} <span className="text-fg-subtle">{hero.alias}</span>
          </h1>
          <p className="mt-4 text-body text-fg-muted">{hero.intro}</p>
          <p className="mt-3 font-mono text-caption text-fg-subtle">{heroStats().join(" · ")}</p>
          <dl className="mt-8 space-y-2 text-sm">
            <div>
              <dt className="inline font-mono text-eyebrow text-fg-subtle uppercase">Education </dt>
              <dd className="inline">
                {education.school} · {education.extras.join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="inline font-mono text-eyebrow text-fg-subtle uppercase">Certification </dt>
              <dd className="inline">{education.certifications.join(" · ")}</dd>
            </div>
          </dl>
          <ul className="mt-6 space-y-1 text-sm">
            {[...Object.values(links), { label: "Portfolio", href: site.url }].map((link) => (
              <li key={link.href}>
                <PrintLink link={link} />
              </li>
            ))}
          </ul>
        </div>
        {photo && <ImageSlot image={photo} eager className="w-32 shrink-0" />}
      </section>

      <section className="print-break">
        <Heading eyebrow="Featured Project" title={featured.name} />
        <Meta>
          {featured.period} · {featured.platform}
        </Meta>
        <p className="mt-3 text-body">{featured.summary}</p>
        <p className="mt-2 text-sm text-fg-muted">{featured.description}</p>
        <dl className="mt-6 space-y-2 text-sm">
          <div><dt className="inline font-medium">담당 역할 </dt><dd className="inline text-fg-muted">{featured.role}</dd></div>
          <div><dt className="inline font-medium">핵심 기능 </dt><dd className="inline text-fg-muted">{featured.features.join(" · ")}</dd></div>
          <div><dt className="inline font-medium">기술 </dt><dd className="inline text-fg-muted">{featured.stack.join(" · ")}</dd></div>
          <div><dt className="inline font-medium">수상 </dt><dd className="inline text-fg-muted">{featured.badges.join(" · ")}</dd></div>
          <div><dt className="inline font-medium">행사 참가 </dt><dd className="inline text-fg-muted">{featured.events.join(" · ")}</dd></div>
        </dl>
        {screens.length > 0 && (
          <div className="mt-6 flex gap-3">
            {screens.map((image) => (
              <ImageSlot key={image.src} image={image} eager className="w-36" />
            ))}
          </div>
        )}
        {event && <ImageSlot image={event} eager className="mt-4 w-full" />}
        <ul className="mt-6 space-y-1 text-sm">
          {featured.links.map((link) => (
            <li key={link.href}>
              <PrintLink link={link} />
            </li>
          ))}
        </ul>
      </section>

      <section className="print-break">
        <Heading eyebrow="Projects" title="주요 프로젝트" />
        {major.map((project) => (
          <MajorBlock key={project.slug} project={project} />
        ))}
      </section>

      <section className="print-block pt-10">
        <Heading eyebrow="More" title="기타 프로젝트" />
        <ul className="space-y-3 text-sm">
          {minor.map((project) => (
            <li key={project.slug} className="print-block">
              <span className="font-medium">{project.name}</span>
              <span className="text-fg-muted"> — {project.summary}</span>
              <Meta>
                {project.period} · {project.stack.join(" · ")} · {project.links.map((l) => bare(l.href)).join(" · ")}
              </Meta>
            </li>
          ))}
        </ul>
      </section>

      <section className="print-break">
        <Heading eyebrow="Awards" title="수상·선정" />
        <table className="w-full text-left text-sm">
          <tbody>
            {awards.map((a) => (
              <tr key={`${a.year}-${a.contest}`} className="print-block border-t border-hairline">
                <td className={`py-2 pr-4 ${a.highlight ? "font-medium" : ""}`}>{a.award}</td>
                <td className="py-2 pr-4 text-fg-muted">{a.contest}</td>
                <td className="py-2 pr-4 text-fg-subtle">{a.project}</td>
                <td className="py-2 font-mono text-[11px] text-fg-subtle">{a.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-block pt-10">
        <Heading eyebrow="Tech Stack" title="기술 스택" />
        <dl className="space-y-2 text-sm">
          {stack.map((group) => (
            <div key={group.group}>
              <dt className="inline font-mono text-eyebrow text-fg-subtle uppercase">{group.group} </dt>
              <dd className="inline">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
```

- [ ] **Step 2: Review Focus #4 — print page stays light; layout check**

`pnpm dev`; Playwright on `/print`:
- `emulateMedia({ colorScheme: "dark" })`, screenshot: page body behind `<main>` may be dark, but `<main>` content is light-on-white (scheme-light). Then `emulateMedia({ media: "print", colorScheme: "dark" })` and `page.pdf()` is not available in MCP — instead screenshot with `media: "print"` and confirm no Nav and full text.
- No Nav rendered (`document.querySelector("header")` is `null`).

- [ ] **Step 3: Lint, build, commit**

Run: `pnpm lint && pnpm build && ls out/print.html` — success.

```bash
git add src/app/print
git commit -m "feat: add print page as the PDF source

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 10: PDF generation, deploy, README

**Files:**
- Create: `scripts/build-pdf.mjs`
- Modify: `package.json`, `.github/workflows/deploy.yml`, `README.md`

**Interfaces:**
- Consumes: `out/print.html` (Task 9), `site.pdf.href` = `/portfolio.pdf`
- Produces: `out/portfolio.pdf`; npm script `pdf`

- [ ] **Step 1: Install Playwright**

Run: `pnpm add -D playwright@1.64.0 && pnpm exec playwright install chromium`
Expected: Chromium downloaded to the Playwright cache.

- [ ] **Step 2: Create `scripts/build-pdf.mjs`**

```js
// Renders /print from the static export (out/) to out/portfolio.pdf with headless Chromium.
// Keep the output name in sync with site.pdf.href in src/lib/site.ts.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const OUT = path.resolve("out");
const PDF = path.join(OUT, "portfolio.pdf");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false; // missing candidate — try the next one
  }
}

// Static-export URL rules: /print → print.html, /dir/ → dir/index.html.
async function resolveFile(urlPath) {
  const target = path.join(OUT, decodeURIComponent(urlPath.split("?")[0]));
  if (!target.startsWith(OUT)) return null;
  for (const candidate of [target, `${target}.html`, path.join(target, "index.html")]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

if (!(await isFile(path.join(OUT, "print.html")))) {
  console.error("build-pdf: out/print.html not found — run `pnpm build` first");
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? "/");
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.emulateMedia({ colorScheme: "light", media: "print" });
  const response = await page.goto(`http://127.0.0.1:${port}/print`, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`/print returned HTTP ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: PDF, printBackground: true, preferCSSPageSize: true });
  const { size } = await stat(PDF);
  if (size < 20_000) throw new Error(`portfolio.pdf is only ${size} bytes`);
  console.log(`build-pdf: wrote ${PDF} (${Math.round(size / 1024)} KB)`);
} finally {
  await browser.close();
  server.close();
}
```

Add to `package.json` `scripts`: `"pdf": "node scripts/build-pdf.mjs"`.

- [ ] **Step 3: Review Focus #5 — negative control first**

```bash
rm -rf out
pnpm pdf; echo "exit=$?"
```

Expected: `build-pdf: out/print.html not found — run \`pnpm build\` first` and `exit=1`.

- [ ] **Step 4: Generate the PDF**

Run: `pnpm build && pnpm pdf`
Expected: `build-pdf: wrote …/out/portfolio.pdf (N KB)`.

Inspect it (read the PDF with the Read tool, or open it):
- Page 1 cover, page 2 starts with `경찰과도둑`, projects start on a new page, awards on a new page.
- Korean renders in Pretendard (not boxes); `strings out/portfolio.pdf | grep -c Pretendard` ≥ 1.
- Links are clickable (`strings out/portfolio.pdf | grep -c "/URI"` ≥ 10).
- No project block is split across pages.

- [ ] **Step 5: Add the PDF step to the deploy workflow**

In `.github/workflows/deploy.yml`, after `- run: pnpm build` add:

```yaml
      - run: pnpm exec playwright install --with-deps chromium
      - run: pnpm pdf
```

- [ ] **Step 6: Document in `README.md`**

Replace the `## 개발` code block with:

```bash
pnpm install
pnpm dev             # http://localhost:3000 (/design: 컴포넌트 갤러리)
pnpm build           # ./out 생성
pnpm pdf             # ./out/portfolio.pdf 생성 (build 후, 최초 1회 `pnpm exec playwright install chromium`)
pnpm test            # 콘텐츠·타이핑 테스트
pnpm check:contrast  # 디자인 토큰 대비(WCAG AA) 검사
```

Append before `## 구조`:

````md
## 포트폴리오 내용 수정

모든 내용은 `src/content/profile.ts` 한 파일에 있습니다. 홈과 PDF(`/print`)가 같은 데이터를 씁니다.

## 이미지 추가

`public/` 아래 정해진 경로에 파일을 넣으면 자동으로 표시됩니다(코드 수정 불필요). 파일이 없으면 배포 사이트에서는 자리가 숨겨지고, `pnpm dev`와 `/design`에서는 설명이 적힌 자리 표시가 보입니다. 전체 목록과 권장 크기는 `docs/superpowers/specs/2026-10-12-portfolio-design.md` §7, 또는 `/design` 페이지의 Image slots 섹션을 보세요.
````

Add to `## 구조`:

```md
- `src/app/globals.css` — 디자인 토큰 (refero Vercel 스타일 → 용도별 토큰 → Tailwind `@theme`)
- `src/components/ui/` — 기본 컴포넌트, `src/components/sections/` — 홈 섹션
- `src/app/print/` + `scripts/build-pdf.mjs` — PDF 원본 페이지와 생성 스크립트
```

- [ ] **Step 7: Commit**

```bash
git add scripts/build-pdf.mjs package.json pnpm-lock.yaml .github/workflows/deploy.yml README.md
git commit -m "feat: generate portfolio PDF at build time

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```

---

### Task 11: Final verification

**Files:** none (fixes go back to the owning task's files)

- [ ] **Step 1: Full check suite**

Run: `pnpm lint && pnpm test && pnpm check:contrast && pnpm build && pnpm pdf`
Expected: all pass.

- [ ] **Step 2: Review Focus #1 — no horizontal scroll at 375px**

Run `pnpm dev` (dev renders every image placeholder, the widest case) and use Playwright. For each of `/`, `/blog`, `/blog/hello-world`, `/print` at 375×812, light and dark:

```js
() => document.documentElement.scrollWidth <= window.innerWidth
```

Expected: `true` on every page. Save full-page screenshots of `/` at 375 and 1280 in both schemes.

- [ ] **Step 3: Korean tracking check**

On the 1280 screenshots, inspect the display name and section headings at -0.06em/-0.05em. If Hangul glyphs touch, change `--text-display--letter-spacing` and `--text-heading-lg--letter-spacing` in `@theme` to `-0.04em`, rebuild, re-check. (`:lang(ko)` cannot target this — the whole page is `lang="ko"`.) Record the decision in the commit message.

- [ ] **Step 4: Embedded-code drift check**

For each file this plan embedded in full, `diff` the plan block against the shipped file and note intentional deviations in the final report (fixes made during review change shipped code but not this plan).

- [ ] **Step 5: Final commit (only if Steps 2–3 changed files)**

```bash
git add -A src
git commit -m "fix: adjust layout after final verification

Claude-Session: https://claude.ai/code/session_01F2XuCryd8mU6U6vz2k6BML"
```
