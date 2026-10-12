# 포트폴리오 사이트 — Vercel 스타일 디자인 토큰 & 컴포넌트

- 날짜: 2026-10-12
- 저장소: EM-H20.github.io (Next.js 16.4 정적 export → GitHub Pages, Tailwind 4.3)
- 스타일 원본: https://styles.refero.design/style/f24daf3a-d43f-4dec-85a9-8ac1d5148a03 (Vercel 디자인 시스템)
- 내용 원본: https://github.com/EM-H20 프로필 README

## 1. 목표와 범위

**목표:** 채용 담당자·면접관이 1–2분 안에 역할·기술·성과(출시, 수상)를 파악할 수 있는 한 페이지 포트폴리오.

**결정 사항**

| 항목 | 결정 |
|---|---|
| "버셀용" | Vercel *스타일* 토큰. 배포는 기존 GitHub Pages 유지 |
| 주 독자 | 채용 담당자·면접관 |
| 구조 | 홈 한 페이지 + 기존 `/blog` 유지. 프로젝트 상세 페이지 없음 |
| 다크 모드 | 시스템 설정(`prefers-color-scheme`)만 따름. 토글 없음, JS 없음 |
| 토큰 방식 | Tailwind v4 `@theme` + CSS 변수, `globals.css` 한 파일 |
| 언어 | 한국어 본문 + 영문 대문자 모노 레이블 |
| 한글 글꼴 | Pretendard (npm `pretendard@1.3.9`, 자체 호스팅, dynamic subset) |
| 작업 순서 | 토큰 → 컴포넌트 + `/design` → 데이터 → 홈 섹션 → 블로그 스타일 |

**범위 밖:** WakaTime/AI 통계, GitHub 통계 이미지, 애니메이션, 프로젝트 스크린샷, 프로젝트 상세 페이지, 다크 모드 토글, 다국어.

## 2. 디자인 토큰 (`src/app/globals.css`)

### 2.1 두 층 구조

- **원본 층 (`:root`)** — refero 값을 이름 그대로: `--color-paper-white #fafafa`, `--color-pure-white #ffffff`, `--color-hairline #ebebeb`, `--color-ash #c9c9c9`, `--color-smoke #a8a8a8`, `--color-graphite #8f8f8f`, `--color-slate #7d7d7d`, `--color-stone #666666`, `--color-charcoal #4d4d4d`, `--color-obsidian #171717`, `--color-carbon #000000`, `--color-terminal-green #297a3a`. 유틸리티로 노출하지 않으며 컴포넌트는 직접 참조하지 않는다.
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
| `accent` | terminal-green `#297a3a` | 링크 강조, ✓ 표시 |

다크 값은 회색 단계를 뒤집어 정한다(예: canvas ≈ `#0a0a0a`, surface ≈ `#111`, fg ≈ `#ededed`). accent는 어두운 배경에서 4.5:1 이상이 되도록 밝힌 초록을 쓴다. 정확한 다크 값은 구현 시 대비 검사 스크립트(§5)를 통과하는 값으로 확정한다.

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
- 모서리: `--radius-sm` 2px(nav, 태그), `--radius-card` 6px(카드·버튼), `--radius-full`(알약형 nav 버튼만).
- 깊이: 그림자 대신 링만 사용. `--shadow-card`(위 2.2-3), `--shadow-hairline` `0 0 0 1px var(--hairline)`.

## 3. 컴포넌트 (`src/components/ui/`, 모두 서버 컴포넌트)

| 컴포넌트 | API(개요) | 명세 |
|---|---|---|
| `Button` | `href`, `variant: "primary" \| "ghost" \| "pill"`, `children` | `<a>` 렌더. 외부 링크는 `target="_blank" rel="noreferrer"`. primary: inverted 배경, 14px/400, 6px, 가로 12px. ghost: 투명, fg-muted, hairline 링, 6px. pill: 9999px, 세로 여백 최소 |
| `Card` | `inverted?: boolean`, `children`, `className?` | surface + card 링 + 6px + 16–24px 여백. inverted는 대표 프로젝트 1회만 |
| `Eyebrow` | `children` | 모노 11px, 0.071em, 대문자, fg. 뒤 제목과 12px 간격 |
| `CliPanel` | `lines: { kind: "cmd" \| "ok" \| "out"; text: string }[]` | surface + hairline 링 + 6px + 16px. 모노 12–13px. cmd는 `$` 접두(fg), ok는 `✓` 접두(accent) |
| `Tag` | `children` | refero에 없음 — 모노 11–12px 대문자, hairline 링, 2px 모서리, fg-subtle |
| `Nav` | 없음(내부에서 데이터 사용) | 64px sticky, canvas 반투명 + `backdrop-blur`, 아래 테두리 없음. 좌 `Elipair` 워드마크, 중앙 앵커 링크, 우 Blog·GitHub pill. 모바일에서 중앙 링크 숨김 |
| `Container` / `Section` | `id?`, `children` | 최대 폭 1280px 가운데 정렬, 섹션 세로 간격 |

- **▲ 미사용:** Vercel 로고이므로 CLI 프롬프트는 `$`, 브랜드는 `Elipair` 워드마크로 대체.
- **`/design` 페이지** (`src/app/design/page.tsx`): 모든 토큰 견본과 컴포넌트 변형을 나열. `robots: { index: false }`, 사이트맵 제외, Nav에 링크하지 않음.

## 4. 페이지

### 4.1 홈 (`src/app/page.tsx`) — 섹션 순서

1. **Nav**
2. **Hero** — 좌: Eyebrow `FLUTTER DEVELOPER · MOBILE & WEB`, display "홍의민", 한 줄 소개("아이디어를 실제로 사용할 수 있는 모바일·웹 서비스로 만듭니다."), [메일 보내기 primary] [GitHub ghost]. 우: CliPanel — `$ whoami` / `✓ 세종대학교 컴퓨터공학과` / `✓ SQLD` / `$ ls shipped/` / `✓ 경찰과도둑 · Block Drag · RuleBook`. 모바일에서는 세로로 쌓임.
3. **대표 프로젝트** (`#featured`) — inverted Card: 경찰과도둑, 2025.10–2026, Flutter·Android & iOS. 담당 역할, 핵심 기능, 기술 Tag, 행사 참가, Google Play / App Store / GitHub 버튼.
4. **수상** (`#awards`) — 9행. 열: 연도(모노) · 상 · 대회 · 프로젝트. 1st Place·대상은 fg + 굵기 500, 나머지 fg-muted. 모바일에서는 행이 2줄로 접힘.
5. **프로젝트** (`#projects`) — Card 그리드 3/2/1열, 간격 16–24px. README 프로젝트 10개 + Second Brain Template. 카드: 이름(20px, 굵기 500), 설명(fg-muted), 기술·기간 Tag, 링크 Button(ghost).
6. **기술 스택** (`#stack`) — Mobile / Frontend / Backend / Data & Realtime / DevOps 그룹별 Tag.
7. **푸터/연락처** (`#contact`) — 이메일, 티스토리 블로그, 인스타그램, GitHub. 저작권 한 줄(fg-subtle).

### 4.2 블로그

- `/blog`, `/blog/[slug]`에 같은 Nav·Container·토큰 적용.
- `mdx-components.tsx`에 h1–h3, p, a(accent), ul/ol, code/pre(모노, surface + hairline), blockquote 기본 스타일.

### 4.3 공통

- Nav는 `layout.tsx`에서 렌더해 모든 페이지에 공통 적용.
- `layout.tsx`의 `body` 폰트를 토큰 `--font-sans`로 교체(현재 `Arial` 하드코딩 제거).

## 5. 데이터와 검증

### 5.1 데이터 (`src/content/profile.ts`)

- 타입 있는 상수: `links`(email, github, blog, instagram), `featured`, `awards[]`, `projects[]`, `stack[]`, `hero`(CLI 라인 포함).
- 내용은 2026-10-11 기준 프로필 README에서 옮긴다. 수정은 이 파일 하나에서.
- `src/lib/site.ts`는 SEO 메타데이터 출처로 유지.

### 5.2 검증

- `pnpm lint`, `pnpm build`(정적 export 성공) 통과.
- **대비 검사 스크립트** (`scripts/check-contrast.mjs`): `globals.css`에서 라이트·다크 용도 토큰 값을 파싱하고, 글자/배경 쌍(fg·fg-muted·fg-subtle·accent × canvas·surface, on-inverted × inverted)이 4.5:1 이상인지 검사. 실패 시 exit 1. 파싱된 토큰 수가 0이면 실패(빈 결과를 통과로 보지 않음).
- **시각 확인:** Playwright로 `/`, `/design`을 375px·1280px × 라이트·다크 스크린샷 후 육안 검토 — 한글 자간(-0.06em에서 뭉침 여부), 가로 스크롤 없음, 링 테두리 렌더.

## 6. 위험과 대응

| 위험 | 대응 |
|---|---|
| -0.06em 자간이 한글에서 너무 좁을 수 있음 | 스크린샷 확인 후 필요하면 `:lang(ko)` 또는 한글 위주 제목만 자간 완화 |
| Pretendard 패키지 용량(설치 97MB) | devDependency 수준 영향만. 빌드 산출물에는 사용된 subset woff2만 포함되는지 `out/` 크기로 확인 |
| 정적 export에서 폰트 CSS의 상대 경로 | 빌드 후 `out/`에 woff2가 복사되고 로드되는지 스크린샷·네트워크로 확인 |
