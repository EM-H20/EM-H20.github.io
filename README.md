# EM-H20.github.io

Hong Eui-min (Elipair) 포트폴리오 & 블로그 — https://em-h20.github.io

Next.js 16 정적 export(`output: "export"`) → GitHub Actions → GitHub Pages.

## 개발

```bash
pnpm install
pnpm dev             # http://localhost:3000 (/design: 컴포넌트 갤러리)
pnpm build           # ./out 생성
pnpm pdf             # ./out/portfolio.pdf 생성 (build 후, 최초 1회 `pnpm exec playwright install chromium`)
pnpm test            # 콘텐츠·타이핑 테스트
pnpm check:contrast  # 디자인 토큰 대비(WCAG AA) 검사
```

`globals.css`의 토큰(`@theme`)을 바꾼 뒤 화면이나 빌드에 반영되지 않으면 `rm -rf .next` 후 다시 실행하세요(Turbopack 캐시).

## 포트폴리오 내용 수정

모든 내용은 `src/content/profile.ts` 한 파일에 있습니다. 홈과 PDF(`/print`)가 같은 데이터를 씁니다.

## 이미지 추가

`public/` 아래 정해진 경로에 파일을 넣으면 자동으로 표시됩니다(코드 수정 불필요). 파일이 없으면 배포 사이트에서는 자리가 숨겨지고, `pnpm dev`와 `/design`에서는 설명이 적힌 자리 표시가 보입니다. 전체 목록과 권장 크기는 `docs/superpowers/specs/2026-10-12-portfolio-design.md` §7, 또는 `/design` 페이지의 Image slots 섹션을 보세요.

## 글 쓰기

`src/content/posts/<slug>.mdx` 파일을 추가하고 `main`에 push하면 자동 배포됩니다. 파일 이름이 주소가 됩니다(`/blog/<slug>`).

```mdx
export const metadata = {
  title: "제목",
  description: "검색 결과/링크 미리보기에 보일 요약",
  date: "2026-10-12",
};

본문...
```

`metadata`가 빠지거나 형식이 틀리면 빌드가 실패합니다.

## 구조

- `src/lib/site.ts` — 사이트 이름·URL·설명 (SEO 메타데이터의 단일 출처)
- `src/lib/posts.ts` — MDX 글 목록/로딩
- `src/app/sitemap.ts`, `src/app/robots.ts` — 빌드 시 정적 생성
- `src/app/globals.css` — 디자인 토큰 (refero Vercel 스타일 → 용도별 토큰 → Tailwind `@theme`)
- `src/components/ui/` — 기본 컴포넌트, `src/components/sections/` — 홈 섹션
- `src/app/print/` + `scripts/build-pdf.mjs` — PDF 원본 페이지와 생성 스크립트
- `.github/workflows/deploy.yml` — 배포 (build → PDF 생성 → Pages)
