// Portfolio content for the home page and /print. Mirrors the GitHub profile README (2026-10-11)
// and the Hack-the-Beat repository. No imports: `node --test` loads this file directly.

export type ImageAspect = "phone" | "wide" | "square" | "og";
export type ImageSpec = { src: string; alt: string; aspect: ImageAspect; brief: string };
export type LinkSpec = { label: string; href: string };

export type Project = {
  slug: string;
  tier: 2 | 3;
  name: string;
  /** Shown in the round icon when no app icon file exists. */
  emoji: string;
  summary: string;
  stack: string[];
  period: string;
  badges: string[];
  /** Released on Google Play and the App Store — counted in the hero stats. */
  shipped?: boolean;
  links: LinkSpec[];
  images: ImageSpec[];
  icon?: ImageSpec;
  /** Extra screenshots shown only on the detail page. */
  gallery?: ImageSpec[];
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
  src: `/images/projects/${slug}/${n}.jpg`,
  alt,
  aspect: "phone",
  brief,
});

// Phone screenshots by default; web-first projects pass "wide" (desktop captures, 16:10).
const gallery = (slug: string, name: string, count: number, aspect: ImageAspect = "phone"): ImageSpec[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/projects/${slug}/gallery/${i + 1}.jpg`,
    alt: `${name} 화면 ${i + 1}`,
    aspect,
    brief: `${name} 스크린샷 ${i + 1}`,
  }));

// Screen recordings (<n>.mp4 with a <n>.jpg poster), shown before the screenshots.
const clips = (slug: string, name: string, count: number, aspect: ImageAspect = "phone"): ImageSpec[] =>
  Array.from({ length: count }, (_, i) => ({
    src: `/images/projects/${slug}/clips/${i + 1}.mp4`,
    alt: `${name} 실제 구동 화면 영상 ${i + 1}`,
    aspect,
    brief: `${name} 화면 녹화 ${i + 1}`,
  }));

const appIcon =(slug: string, name: string): ImageSpec => ({
  src: `/images/projects/${slug}/icon.png`,
  alt: `${name} 앱 아이콘`,
  aspect: "square",
  brief: `${name} 앱 아이콘 (정사각 PNG, 160px 이상)`,
});

export const links = {
  email: { label: "elipair0106@gmail.com", href: "mailto:elipair0106@gmail.com" },
  github: { label: "GitHub", href: "https://github.com/EM-H20" },
  linkedin: { label: "LinkedIn", href: "https://www.linkedin.com/in/eui-min-hong" },
  blog: { label: "Tistory 블로그", href: "https://elipair.tistory.com/" },
  instagram: { label: "Instagram @e_m_hong", href: "https://instagram.com/e_m_hong" },
} satisfies Record<string, LinkSpec>;

export const hero = {
  eyebrow: "Flutter Developer · Mobile & Web",
  name: "홍의민",
  alias: "Elipair",
  motto: "고민은 짧게, 행동은 빠르게",
  words: ["Quest", "First Try", "Retry", "XP", "Log", "Flutter"],
  intro: "아이디어를 실제로 사용할 수 있는 모바일·웹 서비스로 만듭니다.",
  topAward: "Google I/O Extended 1st Place",
  contactLine: "채용·협업 제안은 메일로 연락해 주세요.",
};

export const education = {
  school: "세종대학교 컴퓨터공학과",
  extras: ["AI Advanced Microdegree"],
  certifications: ["SQLD (2026.03 취득)"],
};

export const featured = {
  slug: "cops-and-robbers",
  name: "경찰과도둑",
  emoji: "🚔",
  summary: "친구들과 밖에서 노는 GPS 술래잡기, 경도",
  description:
    "친구·동료·가족이 스마트폰으로 함께 즐기는 경찰과 도둑 놀이입니다. 위치 공유부터 QR 체포, 팀 채팅, 게임 판정까지 하나의 앱으로 연결합니다.",
  period: "2025.10 – 2026",
  platform: "Flutter · Android & iOS",
  role: "Flutter 앱 설계·구현 · GitHub Actions/Fastlane 배포 자동화 · UX 개선",
  features: ["실시간 위치 공유", "QR 체포·초대", "팀별 채팅", "자동 게임 판정", "2~150명 플레이"],
  stack: ["Flutter", "Riverpod", "Dio/Retrofit", "Google Maps", "WebSocket(STOMP)", "Firebase"],
  badges: [
    "세종 창업 아이디어 리그 대상",
    "세종대 창업아이템 경진대회 우수상",
    "입주공모전 우수 창업 아이템상",
    "아롬 데모데이 특별상",
    "창업 동아리 SSUP 선정",
  ],
  events: ["서울대학페스티벌", "청춘대로", "서울게임타운"],
  links: [
    { label: "Website", href: "https://copsandrobbers.app/" },
    { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.elipair.copsandrobbers" },
    { label: "App Store", href: "https://apps.apple.com/us/app/cops-and-robbers-real-chase/id6756843948" },
    { label: "GitHub", href: "https://github.com/cops-and-robbers/cops-and-robbers-FE" },
  ],
  screens: [
    phone("cops-and-robbers", 1, "정해진 시간마다 도둑 위치가 지도에 공개되는 화면", "게임 중 지도 화면 — 팀원·상대 위치가 보이는 장면"),
    phone("cops-and-robbers", 2, "QR 코드로 도둑을 체포하는 화면", "QR 체포 또는 QR 초대 화면"),
    phone("cops-and-robbers", 3, "실시간 팀 채팅 화면", "팀 채팅 또는 게임 결과(판정) 화면"),
  ],
  event: {
    src: "/images/projects/cops-and-robbers/event.jpg",
    alt: "행사 부스 현장 — 동심지키미: 경찰과 도둑학개론",
    aspect: "wide",
    brief: "서울대학페스티벌 등 행사 부스 현장 사진",
  } satisfies ImageSpec,
  icon: appIcon("cops-and-robbers", "경찰과도둑"),
  gallery: [...clips("cops-and-robbers", "경찰과도둑", 1), ...gallery("cops-and-robbers", "경찰과도둑", 8)],
};

export const projects: Project[] = [
  {
    slug: "party-passport",
    tier: 2,
    name: "Party Passport",
    emoji: "🛂",
    summary: "파티에서 QR로 만난 사람을 스탬프로 모으고, 서로 고른 사람만 매칭되는 웹앱",
    stack: ["React", "TypeScript", "Vite"],
    period: "2026.08",
    badges: ["Google I/O Extended: Hack the Beat 1st Place"],
    links: [
      { label: "Live Demo", href: "https://twin-fang.github.io/Hack-the-Beat/" },
      { label: "GitHub", href: "https://github.com/Twin-Fang/Hack-the-Beat" },
      // GDG Campus Korea event recaps (captions confirm AI judging and the theme; slide 12 is the one shared as proof)
      { label: "Instagram 행사 기록", href: "https://www.instagram.com/p/Dc27pKRk18w/?img_index=12" },
      { label: "LinkedIn 행사 기록", href: "https://www.linkedin.com/posts/gdg-campus-korea_gdg-ioex-ioextended-activity-7510266275038695425-Mg0S" },
    ],
    images: [
      phone("party-passport", 1, "배지 모음 화면", "배지 모음 또는 상호 매칭 결과 화면 (Hack-the-Beat 저장소 docs/images/04-badges.png, 05-result.png 재사용 가능)"),
    ],
    // Recorded against a local stand-in for the event server: real UI, made-up guests and badges.
    gallery: [
      { src: "/images/projects/party-passport/clips/1.mp4", alt: "Party Passport 파티 만들기부터 배지 모으기까지 (예시 데이터)", aspect: "phone", brief: "호스트 흐름 녹화" },
      { src: "/images/projects/party-passport/clips/2.mp4", alt: "Party Passport 파티 종료 후 상호 매칭 (예시 데이터)", aspect: "phone", brief: "매칭 흐름 녹화" },
      ...gallery("party-passport", "Party Passport", 5),
    ],
  },
  {
    slug: "tripgether",
    tier: 2,
    name: "트립게더",
    emoji: "✈️",
    summary: "SNS 게시물을 공유하면 장소 정보를 정리하는 AI 여행 가이드",
    stack: ["Flutter"],
    period: "2025.09 – 2025.11",
    badges: ["세종대 창업캠프 대상", "롯데 청년기업가대상 본선"],
    links: [{ label: "GitHub", href: "https://github.com/EM-H20/Tripgether-FE" }],
    images: [phone("tripgether", 1, "장소 정리 화면", "SNS 게시물 공유 후 장소가 정리된 화면")],
    icon: appIcon("tripgether", "트립게더"),
  },
  {
    slug: "stocker",
    tier: 2,
    name: "Stocker",
    emoji: "📈",
    summary: "주식투자를 배우는 핀테크 교육 앱 · 팀 돔황촤 코스피",
    stack: ["Flutter"],
    period: "2025.05 – 2025.11",
    badges: ["Seeds 팀 프로젝트 우수상"],
    links: [
      { label: "GitHub", href: "https://github.com/EM-H20/stocker" },
    ],
    images: [phone("stocker", 1, "학습 메인 화면", "학습/모의투자 메인 화면")],
    gallery: clips("stocker", "Stocker", 1),
  },
  {
    slug: "block-drag",
    tier: 2,
    name: "Block Drag",
    emoji: "🧩",
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
    gallery: [...clips("block-drag", "Block Drag", 4), ...gallery("block-drag", "Block Drag", 8)],
  },
  {
    slug: "rulebook",
    tier: 2,
    name: "RuleBook",
    emoji: "📖",
    summary: "출석·벌칙·벌금을 관리하는 앱",
    stack: ["Flutter"],
    period: "2025.03 – 2025.06",
    badges: ["Google Play · App Store 출시"],
    shipped: true,
    links: [
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.elipair.rulebook" },
      { label: "App Store", href: "https://apps.apple.com/us/app/%EB%A3%B0%EB%B6%81-rulebook/id6745808744" },
    ],
    images: [phone("rulebook", 1, "인원별 경고·벌칙·벌금 현황 화면", "인원별 출석·벌칙·벌금 현황 화면")],
    icon: appIcon("rulebook", "RuleBook"),
    gallery: gallery("rulebook", "RuleBook", 6),
  },
  {
    slug: "wanik-sejong",
    tier: 2,
    name: "완익세종",
    emoji: "🎓",
    summary: "AI 기반 진로-교과목 로드맵 추천 서비스 · 팀 완익세종",
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
    gallery: gallery("wanik-sejong", "완익세종", 6, "wide"),
  },
  {
    slug: "space-study-ship",
    tier: 3,
    name: "우주공부선",
    emoji: "🚀",
    summary: "스터디 목표 설정·학습 기록·공유 플랫폼",
    stack: ["Flutter"],
    period: "2025.12 – 2026",
    badges: [],
    links: [{ label: "GitHub", href: "https://github.com/SpaceStudyShip" }],
    images: [],
    icon: appIcon("space-study-ship", "우주공부선"),
    gallery: [...clips("space-study-ship", "우주공부선", 3), ...gallery("space-study-ship", "우주공부선", 6)],
  },
  {
    slug: "nyangseng",
    tier: 3,
    name: "냥생뭐였니?",
    emoji: "🐱",
    summary: "고양이를 테마로 한 웹 콘텐츠",
    stack: ["Next.js"],
    period: "2024.11 – 2024.12",
    badges: [],
    links: [
      { label: "Website", href: "https://nyangseng.vercel.app" },
      { label: "GitHub", href: "https://github.com/EM-H20/Nyangseng" },
    ],
    images: [],
    icon: appIcon("nyangseng", "냥생뭐였니?"),
    gallery: clips("nyangseng", "냥생뭐였니?", 1),
  },
  {
    slug: "planning",
    tier: 3,
    name: "플래닝",
    emoji: "🤖",
    summary: "로스트아크 정보를 제공하는 Discord 봇",
    stack: ["Python", "Oracle Cloud"],
    period: "2024.11 – 2025.01",
    badges: [],
    links: [{ label: "GitHub", href: "https://github.com/EM-H20/DiscordBot" }],
    images: [],
  },
  {
    slug: "eunsaem",
    tier: 3,
    name: "은샘침례교회",
    emoji: "⛪",
    summary: "교회 홈페이지와 API 서버 — 실제 운영 중",
    stack: ["Next.js", "TypeScript", "Spring Boot", "PostgreSQL", "Docker", "Oracle Cloud"],
    period: "2026.06 – 2026.09",
    badges: [],
    links: [
      { label: "Website", href: "https://www.eunsaem.com/" },
      { label: "GitHub", href: "https://github.com/church-template" },
    ],
    images: [],
    icon: appIcon("eunsaem", "은샘침례교회"),
    // Desktop scroll, then a phone walk-through; sermons and 성경통독 need login, so the stills are public pages.
    gallery: [
      ...clips("eunsaem", "은샘침례교회", 1, "wide"),
      { src: "/images/projects/eunsaem/clips/2.mp4", alt: "은샘침례교회 모바일 화면 영상", aspect: "phone", brief: "모바일 화면 녹화" },
      ...gallery("eunsaem", "은샘침례교회", 4, "wide"),
    ],
  },
];

export const awards: Award[] = [
  { award: "1st Place", contest: "Google I/O Extended: Hack the Beat · GDG Campus Korea", project: "Party Passport", year: 2026, highlight: true },
  { award: "대상", contest: "세종대학교 SW중심대학 · 세종 창업 아이디어 리그", project: "경찰과도둑", year: 2026, highlight: true },
  { award: "우수상", contest: "세종대학교 창업아이템 경진대회 (22팀 중 6팀 수상)", project: "경찰과도둑", year: 2026, highlight: false },
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

export const ax = {
  intro: "AI 에이전트와 함께 일하는 방식을 도구로 만들고, 실제 팀 프로젝트에 적용합니다.",
  tool: {
    slug: "second-brain-template",
    name: "Second Brain Template",
    emoji: "🧠",
    period: "2026.07 – 2026",
    summary:
      "회의·문서·이슈·결정을 지식으로 쌓고, 코드와의 충돌 감지·리포트·반복 이슈 탐지까지 한 흐름으로 묶는 프로젝트별 세컨드 브레인 템플릿",
    install: "npx github:EM-H20/second-brain-template",
    tags: ["Claude Code", "Codex", "Gemini", "Obsidian", "의존성 0"],
    // second-brain-bench results/report.md (2026-09-26, 1st run): opus, 31 questions, one run each.
    benchmark: {
      caption: "경찰과도둑 저장소 31문항 1차 벤치마크 — 코드만 있을 때 → 볼트가 있을 때",
      stats: [
        { label: "정확도", before: "0.71", after: "0.97" },
        { label: "'왜 이렇게 정했나' 질문", before: "0.0", after: "1.0" },
        { label: "없는 경로 인용", before: "8.3%", after: "0.8%" },
      ],
    },
    links: [{ label: "GitHub", href: "https://github.com/EM-H20/second-brain-template" }],
  },
  // The vaults themselves are private; each item links the project's GitHub organization or code instead,
  // or its detail page when it has one (slug).
  applied: [
    {
      name: "경찰과도둑",
      emoji: "🚔",
      icon: appIcon("cops-and-robbers", "경찰과도둑"),
      summary: "앱·서버·웹 3개 저장소의 회의·이슈·설계를 한 볼트로 관리",
      href: "https://github.com/cops-and-robbers",
    },
    {
      name: "캡스톤 Big-Brother",
      emoji: "📹",
      summary: "CCTV 위험 상황 관제와 VLM 자연어 설명 — FE·BE·VLM 지식을 한곳에",
      href: "https://github.com/SJU-Big-Brother",
      slug: "big-brother",
    },
    {
      name: "에브리페스타",
      emoji: "🎪",
      icon: appIcon("festa", "에브리페스타"),
      summary: "대학 축제 정보 서비스 — 결정·이슈·교훈을 기록하고 축제 데이터 볼트를 따로 분리",
      href: "https://github.com/greedy-team/festa-frontend",
      slug: "festa",
    },
  ] as { name: string; emoji: string; icon?: ImageSpec; summary: string; href?: string; slug?: string }[],
};

export type WorkRow = { id: string; skill: string; question: string; answer: string; fact: string; slug: string };

// HOW I WORK: a T-shaped profile, then product changes I proposed or made from feedback.
// Each row's id is a <WorkNote id> on src/content/projects/<slug>.mdx, where the full story is.
export const howIWork = {
  depth: "Flutter",
  breadth: [
    { label: "기획", slug: "party-passport" },
    { label: "웹", slug: "wanik-sejong" },
    { label: "서버", slug: "eunsaem" },
    { label: "DB", slug: "eunsaem" },
    { label: "클라우드", slug: "eunsaem" },
    { label: "AI 에이전트", slug: "second-brain-template" },
  ],
  story: [
    "Front만 알 땐, API가 외국어였습니다.",
    "그래서 서버를 직접 띄워 보고(Oracle Cloud), 백엔드는 AI 에이전트와 함께 짜 봤습니다.",
    "지금은 교회 홈페이지를 DB부터 배포까지 혼자 만들어 운영합니다.",
    "이제 백엔드 팀원과 같은 언어로 말합니다.",
  ],
  rows: [
    {
      id: "work-jail",
      skill: "사용자 관점",
      question: "사용자가 답답하다면요?",
      answer: "Lock은 걸어도, Block은 말고.",
      fact: "잡힌 사람이 감옥을 못 찾자 지도와 채팅을 열어 두자고 제안",
      slug: "cops-and-robbers",
    },
    {
      id: "work-right",
      skill: "디자인 협업",
      question: "버튼은 어디에 둬요?",
      answer: "Right는 Right에.",
      fact: "긍정 버튼에 색을 넣고 오른쪽으로 옮기자고 디자이너에게 제안",
      slug: "cops-and-robbers",
    },
    {
      id: "work-battery",
      skill: "책임감",
      question: "제 실수를 찾으면요?",
      answer: "제가 세운 Gate, 제가 걷습니다.",
      fact: "제가 넣은 배터리 설정 요구가 진입 장벽이 되자, 원인을 고쳐 없앰",
      slug: "cops-and-robbers",
    },
    {
      id: "work-tutorial",
      skill: "문제 해결",
      question: "같은 불만이 계속되면요?",
      answer: "Count 말고 Cause를.",
      fact: "튜토리얼 노출 횟수를 세 번 바꾼 뒤, 강제하는 구조를 걷어냄",
      slug: "cops-and-robbers",
    },
    {
      id: "work-delete",
      skill: "팀워크",
      question: "안 되는 기능은요?",
      answer: "Disable 말고 Delete.",
      fact: "눌러도 반응 없는 버튼을 지우자고 제안했고, 팀 규칙이 됨",
      slug: "festa",
    },
    {
      id: "work-alert",
      skill: "디테일",
      question: "경고는 언제 띄워요?",
      answer: "늦게 오는 Alert는 Alert가 아니니까.",
      fact: "관제원 창에 경고 카드를 바로 띄우고, 영상이 밀리지 않게 자리를 고정",
      slug: "big-brother",
    },
  ] as WorkRow[],
};

export type ProjectPage = {
  slug: string;
  name: string;
  emoji: string;
  icon?: ImageSpec;
  period: string;
  /** Platform line for apps; otherwise the stack is shown. */
  meta: string;
  summary: string;
  badges: string[];
  shipped: boolean;
  stack: string[];
  links: LinkSpec[];
  gallery: ImageSpec[];
  /** Wide photos (e.g. event booth) shown below the gallery. */
  photos: ImageSpec[];
};

/** Every project in home order, featured first — one detail page each. */
export function projectPages(): ProjectPage[] {
  return [
    {
      slug: featured.slug,
      name: featured.name,
      emoji: featured.emoji,
      icon: featured.icon,
      period: featured.period,
      meta: featured.platform,
      summary: featured.summary,
      badges: featured.badges,
      shipped: true,
      stack: featured.stack,
      links: featured.links,
      gallery: featured.gallery,
      photos: [featured.event],
    },
    ...projects.map((p) => ({
      slug: p.slug,
      name: p.name,
      emoji: p.emoji,
      icon: p.icon,
      period: p.period,
      meta: p.stack.join(" · "),
      summary: p.summary,
      badges: p.badges,
      shipped: p.shipped ?? false,
      stack: p.stack,
      links: p.links,
      gallery: p.gallery ?? [],
      photos: [],
    })),
    // Not in the project list (it sits in AX-Native), but gets a detail page for the benchmark write-up.
    {
      slug: ax.tool.slug,
      name: ax.tool.name,
      emoji: ax.tool.emoji,
      period: ax.tool.period,
      meta: "AI 코딩 에이전트용 프로젝트 템플릿",
      summary: ax.tool.summary,
      badges: [],
      shipped: false,
      stack: ax.tool.tags,
      links: ax.tool.links,
      gallery: [],
      photos: [],
    },
    // AX-Native team projects: detail pages for the HOW I WORK write-ups, not in the project list.
    {
      slug: "festa",
      name: "에브리페스타",
      emoji: "🎪",
      icon: appIcon("festa", "에브리페스타"),
      period: "2026.08 – 2026",
      meta: "Next.js · TanStack Query",
      summary: "대학 축제를 축제·아티스트·학교별로 찾아보는 웹 서비스 — 프론트엔드 2명, 백엔드 2명 팀",
      badges: [],
      shipped: false,
      stack: ["Next.js", "TypeScript", "TanStack Query", "Playwright"],
      links: [
        { label: "Website", href: "https://www.every-festa.com/" },
        { label: "GitHub", href: "https://github.com/greedy-team/festa-frontend" },
      ],
      gallery: [],
      photos: [],
    },
    {
      slug: "big-brother",
      name: "Big-Brother",
      emoji: "📹",
      period: "2026.09 – 2026",
      meta: "React · Spring Boot",
      summary: "여러 CCTV의 위험 상황을 찾고 VLM이 자연어로 설명하는 관제 시스템 — 4명 캡스톤 프로젝트",
      badges: [],
      shipped: false,
      stack: ["React", "TypeScript", "Vite", "TanStack Query", "zustand", "Spring Boot"],
      links: [{ label: "GitHub", href: "https://github.com/SJU-Big-Brother" }],
      gallery: [],
      photos: [],
    },
  ];
}

export function shippedNames(): string[] {
  return [featured.name, ...projects.filter((p) => p.shipped).map((p) => p.name)];
}

export function heroStats(): string[] {
  return [`수상·선정 ${awards.length}건`, `스토어 출시 앱 ${shippedNames().length}개`, hero.topAward];
}

export type InfoLine = { label: string; value: string };

export function heroInfo(): InfoLine[] {
  return [
    { label: "Motto", value: hero.motto },
    { label: "Email", value: links.email.label },
    { label: "Education", value: [education.school, ...education.extras].join(" · ") },
    { label: "Certification", value: education.certifications.join(" · ") },
    { label: "Awards", value: `${hero.topAward} 외 수상·선정 ${awards.length - 1}건` },
    { label: "Shipped", value: shippedNames().join(" · ") },
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
