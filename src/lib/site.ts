export const site = {
  url: "https://em-h20.github.io",
  name: "Hong Eui-min · Elipair",
  shortName: "Elipair",
  description:
    "Flutter Developer · 아이디어를 실제로 사용할 수 있는 모바일·웹 서비스로 만듭니다.",
  tagline: "Turning Ideas Into Real Products",
  // scripts/build-pdf.mjs writes out/portfolio.pdf; keep the two in sync
  pdf: { href: "/portfolio.pdf", filename: "홍의민_포트폴리오.pdf" },
};

// Page-level `openGraph` replaces the layout's instead of merging, so pages spread this in
export const baseOpenGraph = { siteName: site.name, locale: "ko_KR" };
