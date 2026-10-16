# HOW I WORK — 소프트 스킬 섹션 설계

날짜: 2026-10-16 · 상태: 구현됨 (2026-10-17 개정)

> **개정 2026-10-17** — 사용자 요청("기능적 측면 뭐 없을까? UI/UX 개선을 제안했고 받아들여졌다든가")으로 1-2의 소프트 스킬 일화 7줄을 **피드백·제안으로 제품을 바꾼 이야기 6줄**로 교체했다. 경찰과도둑이 대표 프로젝트라 4줄을 두고, 에브리페스타·Big-Brother는 1줄씩이다. AI 활용은 T자 블록·AX 섹션·Big-Brother 상세의 서브에이전트 문단에 남긴다.

## 목표

하드 스킬 나열 대신, **"일 잘하는 사람은 혼자 다 하지 않고, 이 일을 누가 제일 잘하는지 안다"**를 보여 준다. 그 "누구"에는 팀원과 AI 에이전트가 모두 들어간다. AI 사용은 숨기지 않는다.

- 위치: 홈 섹션 하나 (Projects 바로 아래). PDF(/print)에도 같은 순서로 넣는다.
- 형태: **T자형 인재** 블록 + **묻고 답하기** 6줄 (말장난 포함).
- 연결: 홈의 각 줄 → 해당 프로젝트 상세 페이지의 **그 문단**으로 이동. 상세 페이지에서는 "그래서 어떻게 적용했나"를 상황 → 누구에게 맡겼나/어떻게 풀었나 → 결과 순서로 읽을 수 있다.

### 문체 규칙 (메모리: no-generic-ai-copy, readability-first)

- "~를 중시합니다" 같은 다짐, 이모지 카드 그리드, 대칭 3단 문장은 쓰지 않는다.
- 사실은 볼트·저장소·기존 상세 페이지에 기록된 것만 쓴다. 화자가 불확실한 기록(iOS 심사 제출, 당근 광고)은 쓰지 않는다.
- 팀원은 이름 없이 역할로만 쓴다 (볼트는 비공개).

## 1. 홈 섹션 `HOW I WORK`

### 1-1. T자 블록

```
        기획 · 웹 · 서버 · DB · 클라우드 · AI 에이전트      ← 가로 획 (넓이)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                       ┃  Flutter                           ← 세로 획 (깊이)
                       ┃  출시 앱 3개 · 경찰과도둑 앱 설계
```

- HTML/CSS로 그린다 (가로 막대 + 세로 막대, 이미지 없음). 가로 항목은 줄바꿈 허용 — 375px에서 두 줄.
- 가로 항목마다 근거 프로젝트 링크: 기획 → Party Passport, 웹 → 완익세종, 서버·DB·클라우드 → 은샘교회, AI 에이전트 → Second Brain Template.
- 아래 4줄:

> **Front만 알 땐, API가 외국어였습니다.**
> 그래서 서버를 직접 띄워 보고(Oracle Cloud), 백엔드는 AI 에이전트와 함께 짜 봤습니다.
> 지금은 교회 홈페이지를 DB부터 배포까지 혼자 만들어 운영합니다.
> 이제 백엔드 팀원과 **같은 언어로** 말합니다.

근거: planning.mdx(2024.11 Oracle Cloud), eunsaem.mdx("백엔드와 프론트엔드를 혼자", OCI VM·Vercel·GitHub Actions, `AGENTS.md`), eunsaem-church 저장소 AI 공동 작성 커밋 114개.

### 1-2. 묻고 답하기 (6줄)

한 줄 = 작은 역량 라벨 · 질문 · 답(말장난) · 사실 한 줄 · `어떻게 했는지 →` 링크. Awards와 같은 줄 목록(divide-y)으로, 카드 그리드는 쓰지 않는다. 기준: 사용자·팀 피드백에서 출발해 제품을 바꿨고, 다른 사람이 받아들였거나 배포된 기록이 있는 것.

| # | 라벨 | 질문 | 답 | 사실 한 줄 | 링크 |
|---|---|---|---|---|---|
| 1 | 사용자 관점 | 사용자가 답답하다면요? | **Lock은 걸어도, Block은 말고.** | 잡힌 사람이 감옥을 못 찾자 지도와 채팅을 열어 두자고 제안 | 경찰과도둑 `#work-jail` |
| 2 | 디자인 협업 | 버튼은 어디에 둬요? | **Right는 Right에.** | 긍정 버튼에 색을 넣고 오른쪽으로 옮기자고 디자이너에게 제안 | 경찰과도둑 `#work-right` |
| 3 | 책임감 | 제 실수를 찾으면요? | **제가 세운 Gate, 제가 걷습니다.** | 제가 넣은 배터리 설정 요구가 진입 장벽이 되자, 원인을 고쳐 없앰 | 경찰과도둑 `#work-battery` |
| 4 | 문제 해결 | 같은 불만이 계속되면요? | **Count 말고 Cause를.** | 튜토리얼 노출 횟수를 세 번 바꾼 뒤, 강제하는 구조를 걷어냄 | 경찰과도둑 `#work-tutorial` |
| 5 | 팀워크 | 안 되는 기능은요? | **Disable 말고 Delete.** | 눌러도 반응 없는 버튼을 지우자고 제안했고, 팀 규칙이 됨 | 에브리페스타 `#work-delete` |
| 6 | 디테일 | 경고는 언제 띄워요? | **늦게 오는 Alert는 Alert가 아니니까.** | 관제원 창에 경고 카드를 바로 띄우고, 영상이 밀리지 않게 자리를 고정 | Big-Brother `#work-alert` |

출처 (상세 페이지 `{/* 출처 */}` 주석에 남김):
1. cops-and-robbers-brain `knowledge/meetings/2026-09-09-festival-rehearsal-event-game-ux.md` §5 + 원본 전사체 36:28–42:30 (제안 화자는 개발자 본인 확인, 2026-10-17), DEC-0067, DEC-0068, DEC-0074, FE CHANGELOG v3.0.22·v3.0.24
2. 개발자 설명(2026-10-17: 시안의 긍정 버튼 왼쪽·디자이너에게 제안·반영), FE `app_dialog.dart`(#99, 2026-02-20부터 취소 왼쪽·확인 오른쪽), 호출부 31곳·2버튼 19곳
3. cops-and-robbers-brain `knowledge/lessons/LSN-0006-…`, DEC-0007, FE CHANGELOG v2.4.8 (#466)
4. cops-and-robbers-brain `knowledge/issues/ISS-0169-…` + 완료 리포트, FE CHANGELOG v3.0.1 (#523)
5. festa `knowledge/decisions/DEC-0129-…`, festa-frontend 이슈 #86 · PR #88 (다른 FE 팀원 리뷰·머지) · 이슈 #161 (같은 팀원이 규칙으로 인용)
6. Big-Brother-brain `knowledge/decisions/DEC-0080-…`, `LSN-0010-…`, 요구사항 분석서 UC-16 A4·FR-16 세부 6 (개정 커밋은 본인, 최종 제출본은 문서 담당 팀원)

## 2. 상세 페이지

### 2-1. 앵커 문단 컴포넌트 `WorkNote`

```mdx
<WorkNote id="work-jail">

**잡힌 사람도 지도는 보게 하자고 제안했습니다.**

- **상황**: …
- **한 일**: …
- **결과**: …

</WorkNote>
```

- `id`로 1-2의 행을 찾아 **라벨**(예: `사용자 관점`)을 문단 위에 작게 표시한다 → 라벨 문자열은 `profile.ts` 한 곳에만 둔다.
- `scroll-mt`로 고정 Nav에 가리지 않게 하고, `:target`일 때 배경을 잠깐 강조한다 (CSS만, JS 없음).
- `mdx-components.tsx`에 등록해 import 없이 쓴다.

### 2-2. 경찰과도둑 — 섹션 추가

`cops-and-robbers.mdx`의 `## 과정` 뒤에 `## 일한 방식`을 넣고 #1·#2·#3·#4 네 문단을 쓴다. 배터리·튜토리얼 문단은 `## 과정`에서 옮겨 와 중복을 두지 않는다.

### 2-3. 새 상세 페이지 2개

Second Brain Template처럼 **홈 프로젝트 목록에는 넣지 않고** 상세 페이지만 만든다. AX-Native "적용 중인 프로젝트"의 두 항목 링크를 GitHub 조직 → 이 상세 페이지로 바꾼다.

| | 에브리페스타 (`festa`) | Big-Brother (`big-brother`) |
|---|---|---|
| 한 줄 | 대학 축제 정보 서비스 | CCTV 위험 상황 관제와 VLM 자연어 설명 (캡스톤) |
| 팀 | FE 2 · BE 2 | 4명 — 풀스택 · 클라우드·문서 · VLM · YOLO 탐지. 역할은 있지만 애자일로 손 빈 사람이 집어 개발 |
| 내 역할 | 프론트엔드 · 볼트 도입 · PR 리뷰 | 풀스택 (FE·BE 연동) · 다중 시점 융합 벤치 · 볼트 도입 |
| 스택 | Next.js · TanStack Query · Playwright | React · Vite · TanStack Query · zustand / Spring Boot |
| 섹션 | 배경 · 맡은 역할 · 일한 방식(#5) · 배운 점 | 배경 · 맡은 역할 · 일한 방식(#6 + AI 서브에이전트 문단) · 배운 점 |

- 밀도는 `second-brain-template.mdx` 기준 (짧은 문장, 굵은 첫 줄).
- 이미지는 없어도 렌더된다 (`gallery: []`). 아이콘은 에브리페스타만 기존 `festa/icon.png` 사용.

## 3. 데이터 (`src/content/profile.ts`)

```ts
export const howIWork = {
  story: string[],                       // 1-1의 4줄
  depth: { label, detail },              // Flutter
  breadth: { label, slug }[],            // 가로 획
  rows: { id, skill, question, answer, fact, slug }[],  // 1-2
};
```

`projectPages()`에 festa·big-brother 두 항목을 second-brain-template처럼 추가한다.

## 4. 검증

- `profile.test.ts`에 추가:
  - 모든 `rows[].slug`·`breadth[].slug`가 `projectPages()`에 있다.
  - 모든 `rows[].id`가 해당 slug의 mdx에 `<WorkNote id="…">`로 정확히 한 번 있다.
  - `rows[].id`가 서로 겹치지 않는다.
- `pnpm test`, `pnpm lint`, `pnpm build` 통과.
- 브라우저(375px·데스크톱, 라이트·다크): 홈 섹션, 링크 → 상세 문단 이동·강조, 새 상세 페이지 두 개.
- PDF: `/print`에 섹션이 들어가고, 상세 링크가 문서 내 이동으로 바뀌는지 확인 (`scripts/build-pdf.mjs`).

## 범위 밖

- about-me 글 수정, 다른 프로젝트 상세 페이지 수정.
- 볼트 내용 공개(링크는 GitHub 조직/저장소까지만).

## 확인된 사실

- 링크: 에브리페스타 Website `https://www.every-festa.com/` + GitHub `greedy-team/festa-frontend`. Big-Brother는 배포하지 않음 → GitHub `SJU-Big-Brother`만.
- 기간 (볼트 기록 기준, 진행 중): 에브리페스타 `2026.08 – 2026` (첫 회의 2026-08-09), Big-Brother `2026.09 – 2026` (첫 회의 2026-09-06).
- 2026-10-16 (2026-10-16): Big-Brother는 풀스택 1 · 클라우드·문서 1 · VLM 1 · YOLO 탐지 1로 나뉘지만, 애자일로 손 빈 사람이 개발한다. #3(시간 정렬 작업 겹침)은 이 방식에서 나온 장면으로 쓴다.
