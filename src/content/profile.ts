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
  src: `/images/projects/${slug}/icon.png`,
  alt: `${name} 앱 아이콘`,
  aspect: "square",
  brief: `${name} 앱 아이콘 (정사각 PNG, 160px 이상)`,
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
  words: ["Flutter", "UX", "React", "빠른 출시", "Next.js"],
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
  emoji: "🚔",
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
    emoji: "🛂",
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
      { label: "상장", href: "https://github.com/user-attachments/files/26157168/_.pdf" },
    ],
    images: [phone("stocker", 1, "학습 메인 화면", "학습/모의투자 메인 화면")],
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
  },
  {
    slug: "rulebook",
    tier: 2,
    name: "RuleBook",
    emoji: "📖",
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
    emoji: "🎓",
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
    emoji: "🚀",
    summary: "스터디 목표 설정·학습 기록·공유 플랫폼",
    stack: ["Flutter"],
    period: "2026.01 – 2026",
    badges: [],
    links: [{ label: "GitHub", href: "https://github.com/SpaceStudyShip/SpaceStudyShip-FE" }],
    images: [],
    icon: appIcon("space-study-ship", "우주공부선"),
  },
  {
    slug: "second-brain-template",
    tier: 3,
    name: "Second Brain Template",
    emoji: "🧠",
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
    emoji: "📔",
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
  },
  {
    slug: "planning",
    tier: 3,
    name: "플래닝",
    emoji: "🤖",
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
    emoji: "⛪",
    summary: "교회 홈페이지와 API 서버 — 실제 운영 중",
    stack: ["Next.js", "TypeScript", "FastAPI", "Docker", "Oracle Cloud"],
    period: "2025.07 – 2025.11",
    badges: [],
    links: [{ label: "Website", href: "https://www.eunsaem.com/" }],
    images: [],
    icon: appIcon("eunsaem", "은샘침례교회"),
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

export type InfoLine = { label: string; value: string };

export function heroInfo(): InfoLine[] {
  return [
    { label: "Email", value: links.email.label },
    { label: "Education", value: [education.school, ...education.certifications].join(" · ") },
    { label: "Awards", value: `${hero.topAward} 외 수상·선정 ${awards.length - 1}건` },
    { label: "Shipped", value: shippedNames().join(" · ") },
  ];
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
