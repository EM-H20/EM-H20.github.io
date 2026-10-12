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
    >
      <body className="flex min-h-full flex-col bg-canvas font-sans text-fg">{children}</body>
    </html>
  );
}
