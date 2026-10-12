# 포트폴리오 리디자인 — jeong-min.com 톤

- 날짜: 2026-10-12
- 브랜치: `feat/portfolio` (기존 구현 위에 이어서)
- 참고: https://www.jeong-min.com/ (홈·about)
- 기준 스펙: `docs/superpowers/specs/2026-10-12-portfolio-design.md` — 이 문서가 **바꾸는 부분만** 적는다. 여기 없는 항목(콘텐츠 데이터 `profile.ts`, 이미지 자리 메커니즘 `ImageSlot`, `/print` + PDF 생성, 블로그 MDX 구조, 배포)은 기준 스펙을 그대로 따른다.

## 1. 왜 바꾸나

사용자 피드백: "디자인이 안 예쁘다". 기존 Vercel 스타일(넓은 1280px, 카드·테두리, 모노 레이블)이 차갑고 기업적으로 느껴진다. 참고 사이트처럼 **따뜻하고 개인적인 톤**으로 전환한다. 주 독자(채용 담당자)와 목표(1–2분 안에 역할·성과 파악)는 그대로다.

**결정 사항 (브레인스토밍 목업으로 확인)**

| 항목 | 결정 |
|---|---|
| 방향 | 참고 사이트 톤으로 전환. Vercel 요소(모노 레이블, 카드 링, 터미널 패널, Geist) 제거 |
| 히어로 | 시안 C-4: 인사말 + 타이핑 단어 + 정보 줄 + 노란 포인트 |
| 섹션 | 시안 A: 검은 칩 섹션 제목 + 원형 아이콘 리스트 |
| 숫자 강조 | 하지 않는다(큰 숫자 블록은 "AI 템플릿 같다"는 피드백으로 기각). 숫자는 문장 속에 담백하게 |
| 다크 모드 | 라이트가 기본. 우측 상단 토글로 다크를 고르면 저장되어 유지 (시스템 설정은 따르지 않음, 2026-10-12 사용자 요청) |

## 2. 디자인 토큰 (`src/app/globals.css` 교체)

### 2.1 색

| 용도 토큰 | 라이트 | 다크 | 용도 |
|---|---|---|---|
| `canvas` | `#ffffff` | `#0f1010` | 페이지 배경 |
| `surface` | `#f4f4f4` | `#1c1c1c` | 원형 아이콘 바탕, 스켈레톤, 이미지 자리 |
| `fg` | `#0f1010` | `#ededed` | 제목·본문 |
| `fg-muted` | `#4d4d4d` | `#b4b4b4` | 설명 |
| `fg-subtle` | `#6b6b6b` | `#8f8f8f` | 날짜·메타 (정보를 담는 글자의 하한) |
| `hairline` | `#ebebeb` | `#2a2a2a` | 구분선, 고스트 버튼 테두리 |
| `inverted` / `on-inverted` | `#0f1010` / `#ffffff` | `#ededed` / `#0f1010` | 검은 칩, 채움 버튼, Nav PDF 알약 |
| `highlight` | `#ffe14d` | `rgb(255 225 77 / 0.35)` | 형광펜·밑줄 **배경 전용**, 글자색으로 쓰지 않음 |
| `dot` | `#f5b800` | `#f5b800` | 정보 줄 앞 점(장식) |

- 대비 검사(`scripts/check-contrast.mjs`)의 쌍: `fg`·`fg-muted`·`fg-subtle` × `canvas`, `on-inverted` × `inverted`, 그리고 **형광펜 위 글자** `fg` × (라이트: `highlight` 불투명 / 다크: `highlight`를 `canvas`에 합성한 색). 스크립트가 `rgb(r g b / a)`를 받아 canvas와 합성하도록 확장한다.
- `#6b6b6b`/white = 5.3:1. 참고 사이트의 연회색 날짜(약 #bbb)는 대비 미달이라 쓰지 않는다.

### 2.2 글꼴

- **GmarketSans Light / Bold** — 인사말, 이름, Nav, 섹션 칩, 정보 줄 레이블(`Email.`), 대표 프로젝트 제목, 수상 이름, 버튼. 굵기 2개만.
- **Pretendard Variable** — 그 외 본문·설명·메타 (기존 유지).
- Geist, Geist Mono 제거. `--font-mono` 사용처 없음.
- GmarketSans는 가변 폰트가 아니고 한글 전체 woff가 Light 547KB / Bold 615KB(2026-10-12 측정). **KS X 1001 한글 2,350자 + 영문·숫자·기본 기호로 서브셋한 woff2**를 저장소에 넣고 `next/font/local`로 자체 호스팅한다. 목표: 굵기당 200KB 이하. 서브셋에 없는 글자는 Pretendard로 대체된다(폴백 스택).

### 2.3 크기·간격

| 토큰 | 값 | 용도 |
|---|---|---|
| `greet` | `clamp(28px, 6.4vw, 40px)`, 행간 1.22, GmarketSans Light | 히어로 인사말 |
| `title-lg` | 30px Bold | 대표 프로젝트 제목 |
| `title` | 18px, Pretendard 500 | 주요 프로젝트 제목 |
| `chip` | 20px Bold | 섹션 칩 |
| `body` | 16px / 1.6 | 본문 |
| `meta` | 14px | 메타·날짜 |

- 컨테이너: 최대 폭 **720px**, 좌우 여백 20px(모바일)–24px.
- 섹션 간격 56px (처음 96px → 72px → 56px, 사용자 요청으로 축소, 2026-10-12). 모서리: 버튼 8px, 아이콘 원형, 칩 0.

## 3. 컴포넌트

기존 `Card`, `Tag`, `CliPanel`, `Typewriter`(글자별 CSS), `Eyebrow`는 홈에서 더 쓰지 않으므로 **삭제**한다(그 테스트 `src/lib/typing.test.ts`, `src/lib/typing.ts`도 삭제). `Button`, `Container`/`Section`, `Nav`, `Skeleton`, `ImageSlot`은 새 스타일로 수정한다.

| 컴포넌트 | 명세 |
|---|---|
| `Nav` | 720px 안. 좌 `Elipair`(Bold), 우 `projects · awards · blog`(Bold) + 구분선 + `github`(Light) + `PDF` 알약(inverted). 모바일에서는 `projects · awards` 숨김. sticky + 흰 배경 반투명 블러, 테두리 없음 |
| `Section` | `id`, `chip`(대문자 영문) → 검은 칩 제목 + 내용 |
| `Chip` | inverted 배경, GmarketSans Bold 20px, 패딩 8/12, 모서리 0 |
| `Button` | `primary`(inverted, 8px), `ghost`(hairline 테두리, 8px), `pill`(Nav PDF), `text`. 글꼴 GmarketSans Bold 14px. 클릭 영역 최소 40px 유지 |
| `Highlight` | `<mark>` 대체 — 글자 아래 38%에 `highlight` 배경 (`linear-gradient(transparent 62%, var(--highlight) 62%)`) |
| `RotatingWord` | **클라이언트 컴포넌트(사이트 유일의 JS)**. §4.1 |
| `IconCircle` | `size: 56 \| 40`. 앱 아이콘 파일이 있으면 원형으로 자른 이미지, 없으면 이모지. 바탕 `surface` |
| `InfoLines` | `{ label, value }[]` → 노란 점 + `Label.`(Bold) + 값(`fg-subtle`) 한 줄씩 |
| `ImageSlot` / `Skeleton` | 동작 동일. 색만 `surface` 기반으로 |

## 4. 홈 페이지

### 4.1 히어로

- 인사말 3줄(각 줄 `display:block; white-space:nowrap`):
  `안녕하세요!` / `[단어]를 좋아하는` / `개발자 [홍의민 — Highlight + Bold]입니다.`
- **RotatingWord**
  - 단어 목록은 `profile.ts`의 `hero.words` (초기값: `Flutter`, `UX`, `React`, `빠른 출시`, `Next.js`). 한 글자씩 타이핑(110ms) → 1.4초 정지 → 한 글자씩 지움(50ms) → 0.3초 후 다음 단어. 무한 반복.
  - 서버 렌더 HTML에는 첫 단어가 완성된 상태로 들어간다(JS 없음·검색엔진·PDF 대비). 커서는 2px 막대, 1초 깜빡임.
  - `prefers-reduced-motion: reduce`이면 첫 단어 고정, 커서 숨김.
  - 구현 제약: lint `react-hooks/set-state-in-effect`(error) 때문에 `useEffect` 안에서 `setState`를 쓰지 않는다 — ref로 텍스트 노드를 직접 갱신하고 타이머는 cleanup에서 해제한다.
  - 스크린리더: 문장 전체를 `sr-only`로 한 번(`안녕하세요! Flutter를 좋아하는 개발자 홍의민입니다.`) 제공하고, 바뀌는 시각 텍스트는 `aria-hidden`.
  - **높이 고정(필수):** 단어 밑줄은 `text-decoration: underline 3px var(--highlight)`로만 그린다(테두리·inline-block 금지 — 빈 단어일 때 줄 높이가 3px 변하는 것을 목업에서 측정함). 각 줄 `nowrap` + `greet` 글자 크기 `clamp`로 390px 폭에서도 가장 긴 단어가 한 줄에 들어간다.
  - **조사 규칙:** 모든 단어는 '를'과 어울려야 한다(마지막 글자가 받침 있는 한글이면 안 됨). 테스트로 강제한다.
- 정보 줄(`InfoLines`): `Email.` 이메일 / `Education.` 세종대학교 컴퓨터공학과 · SQLD / `Awards.` Google I/O Extended 1st Place 외 수상·선정 8건 / `Shipped.` 경찰과도둑 · Block Drag · RuleBook. 값은 `profile.ts`에서 계산(수상 수 = `awards.length - 1`, 출시 앱 = `shippedNames()`).
- 버튼: [메일 보내기 primary] [PDF 포트폴리오 ghost].

### 4.2 PROJECTS

- **대표(경찰과도둑):** `IconCircle 56`(앱 아이콘) + 제목 `title-lg` + `기간 · 플랫폼` 메타 / 요약 / `역할`·`수상`(첫 수상 Highlight + "외 3건")·`기능` 줄 / 스크린샷 3장(`ImageSlot`, 없으면 배포본에서 숨김) / 텍스트 링크(Google Play · App Store · GitHub, 밑줄).
- **주요 6개(tier 2):** 한 행 = `IconCircle 56` + [제목(대표 링크로 연결) + 배지(수상은 Highlight, 출시는 `fg-subtle`)] / [요약 · 기술 · 기간]. 나머지 링크는 요약 줄 끝에 작은 텍스트 링크. **스크린샷은 홈에 넣지 않고 PDF에만** 넣는다.
- **기타 6개(tier 3):** `IconCircle 40` + 제목 + `fg-subtle` 한 줄 설명. 제목이 대표 링크.
- 아이콘: 앱 아이콘 파일 `public/images/projects/<slug>/icon.png`(160px, 7개 확보: 경찰과도둑·Block Drag·RuleBook·트립게더·우주공부선·은샘침례교회·냥생뭐였니?). 없으면 이모지 — Party Passport 🛂, Stocker 📈, 완익세종 🎓, Second Brain Template 🧠, Emotion Diary 📔, 플래닝 🤖. `profile.ts`의 각 프로젝트에 `emoji` 필드 추가, `icon` 경로는 `.png`로 변경.

### 4.3 AWARDS

한 줄 = `상`(GmarketSans Bold; `highlight: true`면 Highlight) · `대회`(fg-muted) · `프로젝트`(fg-subtle) · `연도`(fg-subtle, 오른쪽). 모바일에서는 `상 | 연도` 다음 줄에 대회·프로젝트. F-패턴 원칙(상 이름이 줄 첫머리) 유지.

### 4.4 AX-NATIVE (STACK 대체, 2026-10-12 사용자 요청)

- 기술 스택 섹션은 홈에서 제거하고, 같은 자리에 AX-NATIVE 섹션을 둔다.
- 구성: 한 줄 소개 → Second Brain Template(설명, `second-brain-bench` 1차 결과 한 문장, `npx` 설치 명령, 지원 도구, GitHub 링크) → "적용 중인 프로젝트" 3개(경찰과도둑 · 캡스톤 Big-Brother · 에브리페스타). 적용 프로젝트의 볼트 저장소는 비공개라 링크하지 않는다.
- Second Brain Template은 기타 프로젝트 목록에서 빼 이 섹션으로 옮긴다(중복 방지).
- PDF: AX-Native 섹션을 추가하고, 기술 스택은 키워드 검색용으로 한 줄(모든 항목 나열)만 남긴다.

### 4.5 CONTACT

칩 `CONTACT` + "함께 일해요"(GmarketSans Light 30px) + `hero.contactLine` + [메일 보내기] [PDF 포트폴리오] + 링크 줄(이메일 · GitHub · 블로그 · 인스타그램) + 저작권.

## 5. 블로그·PDF·/design

- **블로그:** 720px 컬럼, 제목 GmarketSans Bold, 목록은 `제목 + 회색 날짜` 한 줄(참고 사이트 글 목록). MDX 본문 스타일은 새 토큰으로.
- **PDF(`/print`):** 구조·내용은 기준 스펙 §4.4 그대로. 제목(h1·h2·프로젝트명)만 GmarketSans Bold, 주요 프로젝트 블록에 스크린샷 포함(기존과 동일). 모노 메타 → Pretendard `fg-subtle`.
- **`/design`:** 새 토큰 견본, 칩, 버튼, Highlight, RotatingWord, IconCircle(아이콘/이모지), InfoLines, ImageSlot을 나열.

## 6. 검증

- `pnpm lint`, `pnpm test`, `pnpm check:contrast`, `pnpm build`, `pnpm pdf` 통과.
- 테스트 추가: `hero.words`의 모든 단어가 '를' 조사와 맞는지(받침 검사: 한글 음절 `(code - 0xAC00) % 28 === 0`이어야 함), 단어가 1개 이상인지. `heroStats`류 숫자 테스트는 새 정보 줄 문자열 기준으로 갱신.
- 대비 검사: §2.1 쌍, 다크 형광펜은 합성색 기준. 음성 대조(일부러 낮은 값) 1회.
- Playwright: 히어로 인사말 높이를 12초간 샘플링해 **값이 하나**인지 1280px·390px에서 확인(빈 단어·가장 긴 단어 구간 포함). 375px 가로 스크롤 없음(`/`, `/blog`, `/print`). 동작 줄이기에서 첫 단어 고정. 접근성 트리에 인사말 문장이 한 번만 노출.
- 이미지: 배포 빌드에서 아이콘 7개가 `<img>`로, 나머지는 이모지로 렌더. 스크린샷 자리는 파일이 없으면 렌더되지 않음.

## 7. 위험

| 위험 | 대응 |
|---|---|
| GmarketSans 라이선스 원문 미확인(제3자 안내: SIL OFL, 상업·임베딩 가능, 폰트 판매 금지) | 공식 배포처 원문을 구현 전에 확인. OFL의 예약 글꼴명 조건이 있으면 서브셋 파일의 family 이름을 바꿔 사용 |
| 서브셋 밖 글자(희귀 한글) | Pretendard 폴백으로 표시됨을 수용 |
| 타이핑 루프가 배경 탭에서도 계속 동작 | `document.hidden`이면 타이머를 멈추고 `visibilitychange`에서 재개 |
| 다크 모드 형광펜 위 글자 대비 | 합성색 기준 대비 검사로 강제 |
