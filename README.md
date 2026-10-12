# EM-H20.github.io

Hong Eui-min (Elipair) 포트폴리오 & 블로그 — https://em-h20.github.io

Next.js 16 정적 export(`output: "export"`) → GitHub Actions → GitHub Pages.

## 개발

```bash
pnpm install
pnpm dev     # http://localhost:3000
pnpm build   # ./out 생성
```

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
- `.github/workflows/deploy.yml` — 배포
