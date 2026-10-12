<div align="center">

<a href="https://em-h20.github.io"><img src="public/images/og.png" alt="시행착오를 좋아하는 개발자 홍의민입니다." width="720" /></a>

# Elipair — 홍의민 포트폴리오

**고민은 짧게, 행동은 빠르게.**<br />
시행착오를 즐기는 Flutter · Web 개발자의 포트폴리오와 블로그입니다.

[웹사이트](https://em-h20.github.io) · [PDF 포트폴리오](https://em-h20.github.io/portfolio.pdf) · [블로그](https://em-h20.github.io/blog) · [LinkedIn](https://www.linkedin.com/in/eui-min-hong)

[![Deploy](https://github.com/EM-H20/EM-H20.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/EM-H20/EM-H20.github.io/actions/workflows/deploy.yml)
![Next.js](https://img.shields.io/badge/Next.js-16-000000?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)

</div>

---

## 무엇이 들어 있나

| | |
|---|---|
| **홈** | 인사말 · 프로젝트 · 수상 · AX-Native · 연락처를 한 페이지에 |
| **프로젝트 상세** | 11개 프로젝트를 STAR(배경 → 역할 → 과정 → 결과) 구조로, 기술적 결정은 ADR 형식으로 정리 (`/projects/<slug>`) |
| **PDF 포트폴리오** | 홈과 모든 상세 페이지를 웹과 같은 디자인으로 이어 붙인 PDF — 배포할 때마다 자동 생성 |
| **블로그** | MDX 파일 하나 = 글 하나 (`/blog/<slug>`) |
| **링크 미리보기** | 모든 페이지에 같은 og 이미지, sitemap · robots 자동 생성 |
| **테마** | 기본은 라이트, 토글로 다크 |

## 기술 스택

| 영역 | 사용 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, 정적 export) · React 19 · TypeScript |
| 스타일 | Tailwind CSS 4 · 디자인 토큰(`@theme`) · Pretendard · Elipair Display(GmarketSans 서브셋) |
| 콘텐츠 | MDX (`@next/mdx`) · 데이터는 `profile.ts` 한 파일 |
| PDF | Playwright(Chromium)로 `/print` 페이지를 인쇄 |
| 배포 | GitHub Actions → GitHub Pages |
| 품질 | Node 테스트 러너(콘텐츠 검증) · WCAG AA 대비 검사 · ESLint |

## 시작하기

```bash
pnpm install
pnpm dev             # http://localhost:3000  (/design: 컴포넌트 갤러리)
```

| 명령 | 하는 일 |
|---|---|
| `pnpm build` | `./out`에 정적 사이트 생성 |
| `pnpm pdf` | `./out/portfolio.pdf` 생성 + dev용 사본 `public/portfolio.pdf` (build 후 실행, 최초 1회 `pnpm exec playwright install chromium`) |
| `pnpm test` | 콘텐츠 테스트 (프로젝트마다 MDX·이미지 존재, 히어로 문구 조사 등) |
| `pnpm check:contrast` | 디자인 토큰 색 대비(WCAG AA) 검사 |
| `pnpm lint` | ESLint |

> `globals.css`의 토큰(`@theme`)을 바꾼 뒤 반영이 안 되면 `rm -rf .next` 후 다시 실행하세요(Turbopack 캐시). dev 서버가 켜진 상태에서 `pnpm build`를 돌리면 `.next`가 덮어써지니, 빌드 후에는 dev 서버를 다시 켜세요.

## 내용 수정하기

| 바꾸고 싶은 것 | 파일 |
|---|---|
| 이름 · 소개 · 수상 · 링크 · 프로젝트 목록(기간, 스택, 배지, 링크) | `src/content/profile.ts` |
| 프로젝트 상세 본문 | `src/content/projects/<slug>.mdx` |
| 프로젝트 스크린샷 | `public/images/projects/<slug>/gallery/N.jpg` (기본 휴대폰 비율, 웹 프로젝트는 `"wide"` 16:10) |
| 블로그 글 | `src/content/posts/<slug>.mdx` |
| 링크 미리보기 이미지 | `public/images/og.png` (1200×630) |

- **히어로의 바뀌는 단어**는 `profile.ts`의 `hero.words`입니다. 첫 단어가 PDF와 og 이미지에 나가는 기본값이고, '를'이 맞는 단어(받침 없음)만 넣어야 테스트가 통과합니다. 영문 단어는 소리 내어 읽어본 뒤 `profile.test.ts`의 `REVIEWED_LATIN`에 추가하세요.
- **프로젝트를 추가**하면 같은 이름의 MDX가 있어야 테스트가 통과합니다. 상세 본문은 PDF에도 그대로 들어갑니다.
- **이미지**는 정해진 경로에 파일을 넣기만 하면 표시됩니다. 파일이 없으면 배포 사이트에서는 자리가 숨겨지고, `pnpm dev`와 `/design`에서는 설명이 적힌 자리 표시가 보입니다.

### 블로그 글 형식

```mdx
export const metadata = {
  title: "제목",
  description: "검색 결과/링크 미리보기에 보일 요약",
  date: "2026-10-12",
};

본문...
```

`metadata`가 빠지거나 형식이 틀리면 빌드가 실패합니다. `main`에 push하면 자동 배포됩니다.

## 구조

```
src/
├─ app/
│  ├─ (site)/            홈 · 블로그 · 프로젝트 상세(/projects/[slug]) · /design
│  ├─ print/             PDF 원본 페이지 (홈 섹션 + 상세 페이지를 이어 붙임)
│  ├─ sitemap.ts, robots.ts
│  └─ globals.css        디자인 토큰 (용도별 색 → Tailwind @theme)
├─ components/
│  ├─ sections/          홈 섹션 · ProjectDetail(웹 상세와 PDF가 함께 씀)
│  └─ ui/                Button · Chip · ImageSlot · RotatingWord · ThemeToggle …
├─ content/
│  ├─ profile.ts         포트폴리오 데이터의 단일 출처
│  ├─ projects/*.mdx     프로젝트 상세 본문
│  └─ posts/*.mdx        블로그 글
├─ lib/                  site.ts(SEO 단일 출처) · posts.ts · projects.ts
└─ fonts/                Elipair Display (SIL OFL 1.1 — OFL.txt)
scripts/
├─ build-pdf.mjs         /print → portfolio.pdf
├─ check-contrast.mjs    WCAG 대비 검사
└─ subset-display-font.sh
```

## 배포

`main`에 push하면 `.github/workflows/deploy.yml`이 `pnpm build` → `pnpm pdf` → GitHub Pages 배포를 실행합니다. PDF도 매번 최신 내용으로 다시 만들어집니다.

---

<div align="center">

© Hong Eui-min · Elipair — <a href="mailto:elipair0106@gmail.com">elipair0106@gmail.com</a>

</div>
