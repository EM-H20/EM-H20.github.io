import type { Metadata } from "next";
import localFont from "next/font/local";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";
import { imageExists } from "@/components/ui/ImageSlot";
import { ogImage } from "@/content/profile";
import { baseOpenGraph, site } from "@/lib/site";
import "./globals.css";

const display = localFont({
  src: [
    { path: "../fonts/display-light.woff2", weight: "300", style: "normal" },
    { path: "../fonts/display-bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-gmarket",
  display: "swap",
});

// Applies a stored theme choice before first paint (no flash). Without one, the page stays light.
// Key must match STORAGE_KEY in components/ui/ThemeToggle.tsx.
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s | ${site.shortName}` },
  description: site.description,
  openGraph: {
    ...baseOpenGraph,
    type: "website",
    ...(imageExists(ogImage.src) && { images: [ogImage.src] }),
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ko"
      className={`${display.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans break-keep text-fg">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        {children}
      </body>
    </html>
  );
}
