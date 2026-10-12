# 포트폴리오 사이트 — Vercel 스타일 디자인 토큰 & 컴포넌트

- 날짜: 2026-10-12
- 저장소: EM-H20.github.io (Next.js 16.4 정적 export → GitHub Pages, Tailwind 4.3)
- 스타일 원본: https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03 (Vercel 디자인 시스템)
- 내용 원본: https://github.com/EM-H20 프로필 README, https://github.com/Twin-Fang/Hack-the-Beat (Party Passport)

## 1. 목표와 범위

**목표:** 채용 담당자·면접관이 1–2분 안에 역할·기술·성과(출시, 수상)를 파악할 수 있는 한 페이지 포트폴리오. 같은 내용을 제출용 PDF로도 내려받을 수 있다.

**결정 사항**

| 항목 | 결정 |
|---|---|
| "버셀용" | Vercel *스타일* 토큰. 배포는 기존 GitHub Pages 유지 |
| 주 독자 | 채용 담당자·면접관 |
| 구조 | 홈 한 페이지 + 기존 `/blog` + PDF용 `/print`. 프로젝트 상세 페이지 없음 |
| 프로젝트 위계 | 중요도에 따라 3단계 크기 (§4.1-5) |
| 다크 모드 | 시스템 설정(`prefers-color-scheme`)만 따름. 토글 없음 |
| 토큰 방식 | Tailwind v4 `@theme` + CSS 변수, `globals.css` 한 파일 |
| 언어 | 한국어 본문 + 영문 대문자 모노 레이블 |
| 한글 글꼴 | Pretendard (npm `pretendard@1.3.9`, 자체 호스팅, dynamic subset) |
| 움직임 | 히어로 타이핑 효과 1회만, CSS만 사용 (§3.2) |
| 이미지 | 자리만 만들어 두고 파일은 사용자가 나중에 추가. lazy loading + 스켈레톤. 파일이 없으면 배포본에서 자리 숨김 (§3.3, §7) |
| PDF | 빌드 시 Playwright로 `/print`를 A4 PDF로 생성, 다운로드 버튼 제공. 페이지 수 제한 없음 (§4.4, §5.3) |
| 작업 순서 | 토큰 → 컴포넌트 + `/design` → 데이터 → 홈 섹션 → 블로그 스타일 → `/print` + PDF 생성 |

**범위 밖:** WakaTime/AI 통계, GitHub 통계 이미지, 타이핑 외 애니메이션, 프로젝트 상세 페이지, 다크 모드 토글, 다국어, 실제 이미지 파일 제작.

## 2. 디자인 토큰 (`src/app/globals.css`)

### 2.1 두 층 구조

- **원본 층 (`:root`)** — refero 값과 이름을 `--vercel-` 접두로: `--vercel-paper-white #fafafa`, `--vercel-pure-white #ffffff`, `--vercel-hairline #ebebeb`, `--vercel-ash #c9c9c9`, `--vercel-smoke #a8a8a8`, `--vercel-graphite #8f8f8f`, `--vercel-slate #7d7d7d`, `--vercel-stone #666666`, `--vercel-charcoal #4d4d4d`, `--vercel-obsidian #171717`, `--vercel-carbon #000000`, `--vercel-terminal-green #297a3a`. (refero의 `--color-*` 이름은 Tailwind 색 네임스페이스와 충돌해 `--color-hairline`이 순환 참조가 되므로 접두를 바꿨다.) 유틸리티로 노출하지 않으며 컴포넌트는 직접 참조하지 않는다. Tailwind 기본 색 팔레트는 `--color-*: initial`로 끈다.
- **용도 층 (`@theme inline`으로 노출)** — 컴포넌트는 이것만 쓴다. 다크 모드에서는 이 층의 값만 바뀐다.

| 용도 토큰 | 라이트 | 용도 |
|---|---|---|
| `canvas` | paper-white `#fafafa` | 페이지 배경 |
| `surface` | pure-white `#ffffff` | 카드, 입력 |
| `inverted` / `on-inverted` | obsidian `#171717` / `#ffffff` | 반전 카드, 채움 버튼 |
| `fg` | obsidian `#171717` | 제목, 주요 텍스트 |
| `fg-muted` | charcoal `#4d4d4d` | 본문, 카드 설명 |
| `fg-subtle` | stone `#666666` | 캡션, 메타데이터 (읽어야 하는 글자의 하한) |
| `fg-faint` | graphite `#8f8f8f` | 장식 전용 (구분 기호 등). 정보를 담는 글자에 쓰지 않음 |
| `hairline` | `#ebebeb` | 1px 링 |
| `skeleton` | hairline `#ebebeb` | 스켈레톤 바탕 (반짝임은 canvas 쪽으로) |
| `accent` | terminal-green `#297a3a` | 링크 강조, ✓ 표시 |

다크 값은 회색 단계를 뒤집어 정한다(예: canvas ≈ `#0a0a0a`, surface ≈ `#111`, fg ≈ `#ededed`). accent는 어두운 배경에서 4.5:1 이상이 되도록 밝힌 초록을 쓴다. 정확한 다크 값은 구현 시 대비 검사 스크립트(§5.2)를 통과하는 값으로 확정한다.

### 2.2 원본 대비 수정

1. **대비:** 측정값 — `#666` 5.5:1, `#7d7d7d` 3.94:1, `#8f8f8f` 3.1:1, `#a8a8a8` 2.28:1, `#297a3a` 5.11:1 (배경 `#fafafa`). 정보를 담는 글자는 `fg-subtle`(`#666`)까지만 허용.
2. **자간을 em으로:** display/heading-lg `-0.06em`(원본 -3.84px/64, -3.36px/56과 동일), heading `-0.05em`(-1.5px/30).
3. **카드 링:** 원본 CSS 변수(`0 0 0 1px #fafafa`)와 본문(`2px`)이 불일치. 1px은 안쪽 링에 가려 무효이므로 `0 0 0 1px rgba(0,0,0,.08), 0 0 0 2px var(--canvas)`를 쓴다. 다크에서는 첫 링을 밝은 반투명으로 바꾼다.

### 2.3 타이포그래피

- `--font-sans`: Geist(라틴) → Pretendard Variable(한글) → 시스템 폴백. `--font-mono`: Geist Mono.
- 글꼴 기능: `"calt" 0, "rlig", "ss11"` (원본).
- 크기 토큰 (Tailwind `--text-*`, 행간·자간 묶음):

| 토큰 | 크기 | 행간 | 자간 |
|---|---|---|---|
| `eyebrow` | 11px | 1.5 | 0.071em, 대문자, 모노 |
| `caption` | 13px | 1.54 | — |
| `body` | 16px | 1.5 | — |
| `heading` | 30px | 1.1 | -0.05em |
| `heading-lg` | 36px → 56px (md 이상) | 1.0 | -0.06em |
| `display` | 40px → 64px (md 이상) | 1.0 | -0.06em |

- 제목 굵기 400–450. 레이블·메타데이터·코드는 항상 모노·대문자·8–12px.

### 2.4 간격·모서리·깊이

- 간격: Tailwind 기본 4px 단위 사용(원본 스케일 4/8/12/16/20/24/32/40이 모두 4px 배수). 섹션 간격 96–128px, 카드 안쪽 여백 16px, 요소 간격 12px, 최대 폭 1280px, 좌우 여백 24–48px(모바일 16px).
- 모서리: `--radius-sm` 2px(nav, 태그), `--radius-card` 6px(카드·버튼·이미지), `--radius-full`(알약형 nav 버튼만).
- 깊이: 그림자 대신 링만 사용. `--shadow-card`(위 2.2-3), `--shadow-hairline` `0 0 0 1px var(--hairline)`.

## 3. 컴포넌트 (`src/components/ui/`)

### 3.1 기본 컴포넌트 (서버 컴포넌트, JS 없음)

| 컴포넌트 | API(개요) | 명세 |
|---|---|---|
| `Button` | `href`, `variant: "primary" \| "ghost" \| "pill"`, `download?`, `children` | `<a>` 렌더. 외부 링크는 `target="_blank" rel="noreferrer"`. primary: inverted 배경, 14px/400, 6px, 가로 12px. ghost: 투명, fg-muted, hairline 링, 6px. pill: 9999px. **모든 변형의 클릭 영역 최소 높이 40px**(pill은 시각적 높이를 유지하고 패딩/의사 요소로 영역 확보) |
| `Card` | `inverted?`, `size?: "lg" \| "md" \| "sm"`, `children`, `className?` | surface + card 링 + 6px. 여백 sm 16px / md 24px / lg 32–40px. inverted는 대표 프로젝트 1회만 |
| `Eyebrow` | `children` | 모노 11px, 0.071em, 대문자, fg. 뒤 제목과 12px 간격 |
| `CliPanel` | `lines: { kind: "cmd" \| "ok" \| "out"; text: string }[]` | surface + hairline 링 + 6px + 16px. 모노 12–13px. cmd는 `$` 접두(fg), ok는 `✓` 접두(accent) |
| `Tag` | `children`, `tone?: "default" \| "award"` | refero에 없음 — 모노 11–12px 대문자, hairline 링, 2px 모서리, fg-subtle. `award`는 fg 글자 + 굵기 500 (수상·출시 배지) |
| `Nav` | 없음 | 64px sticky, canvas 반투명 + `backdrop-blur`, 아래 테두리 없음. 좌 `Elipair` 워드마크, 중앙 앵커 링크, 우 `PDF` · `Blog` · `GitHub` pill. 모바일에서 중앙 링크 숨김 |
| `Container` / `Section` | `id?`, `children` | 최대 폭 1280px 가운데 정렬, 섹션 세로 간격 |
| `Skeleton` | `className?` | skeleton 바탕 + 좌→우 반짝임(`@keyframes`). `prefers-reduced-motion`이면 반짝임 없이 정지 |

- **▲ 미사용:** Vercel 로고이므로 CLI 프롬프트는 `$`, 브랜드는 `Elipair` 워드마크로 대체.

### 3.2 `Typewriter` (서버 컴포넌트 — CSS 애니메이션만 사용, JS 없음)

- 대상: 히어로의 이름 → CliPanel 라인을 **순서대로 한 번** 타이핑. 반복 없음. 한 줄 소개는 길어서 타이핑하면 읽기가 늦어지므로 정적으로 둔다.
- 원문 전체가 처음부터 DOM에 있다(서버 렌더). 글자마다 `animation-delay`를 달리해 차례로 보이게 한다 → 검색엔진·PDF는 항상 완성된 문장을 보고, 글자가 처음부터 자리를 차지하므로 레이아웃 밀림이 없다. 이름 제목은 `aria-label`로 스크린리더에 한 단어로 읽힌다.
- 이 저장소의 lint(`react-hooks/set-state-in-effect`가 error)에 걸리는 `useEffect`+`setState` 방식을 피하기 위해 CSS로 구현한다.
- `prefers-reduced-motion: reduce`, 인쇄(`@media print`): 타이핑 없이 전체 표시.
- 커서: 모노 `▍`(fg) 깜빡임, 각 줄 타이핑 중에만 보이고 끝나면 사라짐.
- 속도: 글자당 35ms, 줄 사이 120ms. 전체 3초 이내(테스트로 고정, 현재 약 2.9초).

### 3.3 `ImageSlot` (서버 컴포넌트)

- API: `src`(public 기준 경로, 항상 지정), `alt`, `aspect`(`"phone"` 9:19.5 · `"wide"` 16:10 · `"square"` 1:1 · `"og"` 1200:630), `brief`(어떤 이미지가 필요한지 한 줄), `priority?`.
- 빌드 시 `public/` 아래 파일 존재 여부를 `fs`로 확인한다.
  - **파일 있음:** `aspect` 고정 박스 + 배경에 `Skeleton` + 그 위에 `<img loading="lazy" decoding="async">`(`priority`면 eager). 이미지가 다 그려지면 스켈레톤을 덮는다 — JS 없음.
  - **파일 없음 + 개발(`pnpm dev`) 또는 `/design`:** 점선 hairline 박스에 `brief`, 경로, 권장 크기를 표시.
  - **파일 없음 + 배포 빌드:** 아무것도 렌더하지 않는다(카드 레이아웃은 이미지 없이도 성립해야 함).
- 사용자는 §7의 경로에 파일을 넣기만 하면 되고, 코드 수정은 필요 없다.
- 이미지 형식: WebP 권장(PNG/JPG도 허용, 경로의 확장자와 일치해야 함).

### 3.4 `/design` 페이지 (`src/app/design/page.tsx`)

모든 토큰 견본, 컴포넌트 변형, 빈/채워진 ImageSlot, Skeleton, Typewriter를 나열. `robots: { index: false }`, 사이트맵 제외, Nav에 링크하지 않음.

## 4. 페이지

### 4.1 홈 (`src/app/page.tsx`) — 섹션 순서

1. **Nav**
2. **Hero** — 좌: Eyebrow `FLUTTER DEVELOPER · MOBILE & WEB`, display "홍의민"(Typewriter), 한 줄 소개(정적, "아이디어를 실제로 사용할 수 있는 모바일·웹 서비스로 만듭니다."), **숫자 줄**(모노 caption: `수상·선정 9건 · 스토어 출시 앱 3개 · Google I/O Extended 1st Place` — 9건에 '선정'·'본선 진출'이 포함되므로 '수상·선정'으로 표기), [메일 보내기 primary] [GitHub ghost]. 우: CliPanel(Typewriter) — `$ whoami` / `✓ 세종대학교 컴퓨터공학과` / `✓ SQLD` / `$ ls shipped/` / `✓ 경찰과도둑 · Block Drag · RuleBook`. 모바일에서는 세로로 쌓임.
3. **대표 프로젝트** (`#featured`) — **1단계**: 전체 폭 inverted Card(lg). 제목 heading-lg "경찰과도둑", 2025.10–2026, Flutter·Android & iOS. 2단 구성 — 좌: 한 줄 설명, 담당 역할, 핵심 기능, 기술 Tag. 우: 수상 Tag(award) 4개(대상 · 우수 창업 아이템상 · 특별상 · SSUP 선정), 행사 참가(서울대학페스티벌 · 청춘대로 · 서울게임타운). 하단: 이미지 줄(ImageSlot phone × 3) + Google Play / App Store / GitHub 버튼.
4. **프로젝트** (`#projects`)
   - **2단계** — 2열(모바일 1열) Card(md). 제목 heading(30px), 수상·출시 Tag(award), 한 줄 설명, 기술·기간 Tag, ImageSlot(대표 1장), 링크 Button(ghost). 순서:
     1. Party Passport — 🥇 Google I/O Extended: Hack the Beat 1st Place · 라이브 데모. "파티에서 QR로 만난 사람을 스탬프로 모으고, 서로 고른 사람만 매칭되는 웹앱" · TypeScript · 2026
     2. 트립게더 — 세종대 창업캠프 대상 · 롯데 청년기업가대상 본선
     3. Stocker — Seeds 팀 프로젝트 우수상
     4. Block Drag — Google Play · App Store 출시
     5. RuleBook — Google Play · App Store 출시
     6. 완익세종 — SW-AI 해커톤 장려상
   - **3단계** — 3열/2열/1열 Card(sm). 이름(20px, 굵기 500), 한 줄 설명, 기술·기간 Tag, 링크. 이미지 없음. 순서: 우주공부선 → Second Brain Template → Emotion Diary → 냥생뭐였니? → 플래닝 → 은샘침례교회(실제 운영 사이트로 마무리).
5. **수상** (`#awards`) — 9행. 열 순서 **상 · 대회 · 프로젝트 · 연도(모노)** — 줄 첫머리에 상 이름이 오도록. 1st Place·대상은 fg + 굵기 500, 나머지 fg-muted. 모바일에서는 행이 2줄로 접힘.
6. **기술 스택** (`#stack`) — Mobile / Frontend / Backend / Data & Realtime / DevOps 그룹별 Tag.
7. **마무리 CTA** (`#contact`) — heading "함께 일해요" + 한 줄 + [메일 보내기 primary] [PDF 포트폴리오 받기 ghost]. 그 아래 링크 줄(이메일, 티스토리 블로그, 인스타그램, GitHub)과 저작권 한 줄(fg-subtle).

### 4.2 블로그

- `/blog`, `/blog/[slug]`에 같은 Nav·Container·토큰 적용.
- `mdx-components.tsx`에 h1–h3, p, a(accent), ul/ol, code/pre(모노, surface + hairline), blockquote 기본 스타일.

### 4.3 공통

- 라우트 그룹 `src/app/(site)/layout.tsx`가 Nav를 렌더한다. 홈·`/blog`·`/design`은 `(site)` 아래로 옮기고(URL 변화 없음), `/print`는 그룹 밖에 두어 Nav 없이 렌더한다. 루트 `layout.tsx`는 `<html>`/`<body>`/폰트만 담당.
- `layout.tsx`의 `body` 폰트를 토큰 `--font-sans`로 교체(현재 `Arial` 하드코딩 제거).

### 4.4 `/print` — PDF 원본 페이지

- `profile.ts`의 같은 데이터로 렌더하는 인쇄 전용 레이아웃. A4 세로, 여백 약 16mm, 라이트 테마 고정(다크 모드 무시), Nav·타이핑·스켈레톤 없음.
- 페이지 수 제한 없음. 구성:
  1. **표지 겸 소개** — 이름, 한 줄 소개, 숫자 줄, 학력·자격증, 연락처(이메일, GitHub, 사이트 URL, 블로그), (있으면) 프로필 사진
  2. **대표 프로젝트** — 경찰과도둑 한 페이지 단독: 설명, 역할, 기능, 기술, 수상, 행사, 스크린샷(있으면), 스토어 링크
  3. **주요 프로젝트(2단계 6개)** — 프로젝트별 블록, 이미지(있으면), 링크. 블록 중간에서 페이지가 잘리지 않게 `break-inside: avoid`
  4. **기타 프로젝트(3단계)** — 이름·설명·기술 목록
  5. **수상** 전체 표
  6. **기술 스택**
- 모든 링크는 PDF에서 클릭 가능(전체 URL을 함께 표기).
- `robots: { index: false }`, 사이트맵 제외.

## 5. 데이터, 빌드, 검증

### 5.1 데이터 (`src/content/profile.ts`)

- 타입 있는 상수: `links`(email, github, blog, instagram, site), `hero`(이름, 소개, 숫자 줄, CLI 라인), `featured`, `projects[]`(각 항목에 `tier: 2 | 3`, `badges[]`, `images[]`), `awards[]`, `stack[]`, `education`.
- 이미지 항목: `{ src, alt, aspect, brief }` — §7 표와 1:1.
- 내용은 2026-10-11 기준 프로필 README와 Hack-the-Beat 저장소에서 옮긴다. 수정은 이 파일 하나에서.
- 숫자 줄의 숫자(수상·선정 9건, 출시 앱 3개)는 하드코딩하지 않고 `awards.length`, 출시 배지 수에서 계산한다.
- `src/lib/site.ts`는 SEO 메타데이터 출처로 유지.

### 5.2 검증

- `pnpm lint`, `pnpm build`(정적 export 성공) 통과.
- **대비 검사 스크립트** (`scripts/check-contrast.mjs`): `globals.css`에서 라이트·다크 용도 토큰 값을 파싱하고, 글자/배경 쌍(fg·fg-muted·fg-subtle·accent × canvas·surface, on-inverted × inverted)이 4.5:1 이상인지 검사. 실패 시 exit 1. 파싱된 토큰 수가 0이면 실패(빈 결과를 통과로 보지 않음).
- **시각 확인:** Playwright로 `/`, `/design`을 375px·1280px × 라이트·다크 스크린샷 후 육안 검토 — 한글 자간, 가로 스크롤 없음, 링 테두리, 빈 ImageSlot 숨김(배포 빌드), 타이핑 완료 후 레이아웃 밀림 없음, reduced-motion에서 즉시 전체 표시.
- **PDF 확인:** 생성된 PDF를 열어 페이지 분할, 한글 글꼴(Pretendard 임베드), 링크 클릭 가능 여부를 확인.

### 5.3 PDF 생성

- 스크립트 `scripts/build-pdf.mjs`: `out/`을 로컬 정적 서버로 띄우고 Playwright Chromium으로 `/print`를 연 뒤 `document.fonts.ready`를 기다리고 `page.pdf({ format: "A4", printBackground: true })`로 `out/portfolio.pdf`를 쓴다. 실패 시 exit 1(빈/누락 PDF로 배포하지 않음).
- `package.json`: `"pdf": "node scripts/build-pdf.mjs"`. 배포 워크플로에 `pnpm build` 다음 단계로 Playwright Chromium 설치 + `pnpm pdf` 추가.
- 다운로드 버튼: `<a href="/portfolio.pdf" download="홍의민_포트폴리오.pdf">`. `pnpm dev`에서는 PDF가 없으므로 `pnpm build && pnpm pdf` 후 확인.

## 6. 위험과 대응

| 위험 | 대응 |
|---|---|
| -0.06em 자간이 한글에서 너무 좁을 수 있음 | 스크린샷 확인 후 필요하면 한글 제목만 자간 완화 |
| Pretendard 패키지 용량(설치 97MB) | 빌드 산출물에는 사용된 subset woff2만 포함되는지 `out/` 크기로 확인 |
| 정적 export에서 폰트 CSS의 상대 경로 | 빌드 후 `out/`에 woff2가 복사되고 로드되는지 확인 |
| 타이핑 효과로 인한 레이아웃 밀림·접근성 저하 | 원문을 처음부터 렌더하고 높이를 고정, reduced-motion·인쇄 시 비활성 |
| CI에서 Chromium 설치로 배포 시간 증가 | `playwright install --with-deps chromium`만 설치. 필요하면 캐시 추가 |
| 이미지 없는 상태에서 카드가 비어 보임 | 모든 카드는 이미지 없이도 완결된 레이아웃으로 설계, 이미지는 덧붙는 요소 |

## 7. 이미지 목록 (사용자가 나중에 추가)

경로는 모두 `public/` 기준. 파일을 해당 경로에 넣으면 자동으로 표시된다. 휴대폰 스크린샷은 실제 기기 캡처(상태바 포함 가능), 가로 1080px 이상 권장.

### 7.1 필요 (넣으면 효과가 큰 것)

| 경로 | 비율 | 내용 |
|---|---|---|
| `images/projects/cops-and-robbers/1.webp` | phone | 경찰과도둑 — 게임 중 지도 화면(팀원·상대 위치가 보이는 장면) |
| `images/projects/cops-and-robbers/2.webp` | phone | 경찰과도둑 — QR 체포 또는 QR 초대 화면 |
| `images/projects/cops-and-robbers/3.webp` | phone | 경찰과도둑 — 팀 채팅 또는 게임 결과(판정) 화면 |
| `images/projects/party-passport/1.webp` | phone | Party Passport — 배지 모음 또는 상호 매칭 결과 화면 (저장소 `docs/images/04-badges.png`, `05-result.png` 재사용 가능) |
| `images/projects/tripgether/1.webp` | phone | 트립게더 — SNS 게시물 공유 후 장소가 정리된 화면 |
| `images/projects/stocker/1.webp` | phone | Stocker — 학습/모의투자 메인 화면 |
| `images/projects/block-drag/1.webp` | phone | Block Drag — 퍼즐 플레이 화면 |
| `images/projects/rulebook/1.webp` | phone | RuleBook — 규칙 검색 결과 또는 상세 화면 |
| `images/projects/wanik-sejong/1.webp` | wide | 완익세종 — 웹 메인 화면 캡처(데스크톱, 16:10) |
| `images/og.png` | og | 링크 공유 미리보기(1200×630). 이름 + 한 줄 소개, 사이트와 같은 흑백 스타일 |

### 7.2 있으면 좋은 것

| 경로 | 비율 | 내용 |
|---|---|---|
| `images/profile.webp` | square | 프로필 사진 — PDF 표지에만 사용(사이트 히어로에는 넣지 않음) |
| `images/projects/cops-and-robbers/event.webp` | wide | 서울대학페스티벌 등 행사 부스 현장 사진 — 실사용 증거 |
| `images/projects/cops-and-robbers/icon.webp` | square | 경찰과도둑 앱 아이콘(512×512) |
| `images/projects/block-drag/icon.webp`, `images/projects/rulebook/icon.webp` | square | 스토어 출시 앱 아이콘 |

3단계 프로젝트에는 이미지 자리를 두지 않는다.

## 8. 적용한 UX 원칙

| 원칙 | 적용 위치 |
|---|---|
| 시각적 위계 · 폰 레스토프 효과 | 프로젝트 3단계 크기, 대표 프로젝트만 반전 카드 |
| 사회적 증거 · 권위 | 히어로 숫자 줄, 프로젝트 카드의 수상·출시 배지 |
| F-패턴 스캔 | 수상 표 열 순서(상 이름이 줄 첫머리), 왼쪽 정렬 제목 |
| 계열 위치 효과 | 단계 안에서 영향력 순 정렬, 3단계는 실제 운영 사이트로 마무리 |
| 피크-엔드 법칙 | 마지막 섹션을 CTA("함께 일해요")로 종료 |
| 피츠의 법칙 | 모든 버튼 클릭 영역 최소 40px |
| 힉의 법칙 | 히어로·CTA 버튼 2개 |
| 청킹 | 기술 스택 그룹, 카드 단위 |

구텐베르크 다이어그램은 균일한 텍스트 배치에 해당하므로 적용하지 않는다(강한 시각적 위계가 우선). 희소성·긴급성 기법은 신뢰를 떨어뜨리므로 사용하지 않는다.
