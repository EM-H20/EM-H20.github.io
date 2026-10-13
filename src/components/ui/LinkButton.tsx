import Image from "next/image";
import type { ReactNode } from "react";

// Outbound link button for project pages. On hover or keyboard focus the destination's mark comes up
// from behind the button — the store icon, the GitHub or social mark — and a plain website
// launches a rocket. Marks only move; their artwork is never rotated, recoloured or cropped
// (see .lb in globals.css). Touch screens just get the button.
type Kind = "rocket" | "github" | "app-store" | "google-play" | "instagram" | "linkedin";

const KINDS: Record<string, Kind> = {
  "github.com": "github",
  "apps.apple.com": "app-store",
  "play.google.com": "google-play",
  "instagram.com": "instagram",
  "linkedin.com": "linkedin",
};

// GitHub mark: Primer Octicons mark-github-24 (MIT).
const GITHUB = "M10.226 17.284c-2.965-.36-5.054-2.493-5.054-5.256 0-1.123.404-2.336 1.078-3.144-.292-.741-.247-2.314.09-2.965.898-.112 2.111.36 2.83 1.01.853-.269 1.752-.404 2.853-.404 1.1 0 1.999.135 2.807.382.696-.629 1.932-1.1 2.83-.988.315.606.36 2.179.067 2.942.72.854 1.101 2 1.101 3.167 0 2.763-2.089 4.852-5.098 5.234.763.494 1.28 1.572 1.28 2.807v2.336c0 .674.561 1.056 1.235.786 4.066-1.55 7.255-5.615 7.255-10.646C23.5 6.188 18.334 1 11.978 1 5.62 1 .5 6.188.5 12.545c0 4.986 3.167 9.12 7.435 10.669.606.225 1.19-.18 1.19-.786V20.63a2.9 2.9 0 0 1-1.078.224c-1.483 0-2.359-.808-2.987-2.313-.247-.607-.517-.966-1.034-1.033-.27-.023-.359-.135-.359-.27 0-.27.45-.471.898-.471.652 0 1.213.404 1.797 1.235.45.651.921.943 1.483.943.561 0 .92-.202 1.437-.719.382-.381.674-.718.944-.943";

function Mark({ kind }: { kind: Kind }) {
  switch (kind) {
    case "github":
      return (
        <svg viewBox="0 0 24 24" width="36" height="36" fill="currentColor">
          <path d={GITHUB} />
        </svg>
      );
    case "instagram":
      // Official gradient glyph from Meta's 2023 Instagram brand asset pack, resized only.
      return <Image src="/images/brands/instagram.png" alt="" width="32" height="32" />;
    case "app-store":
      // Official App Store icon from Apple's marketing resources, unmodified.
      return <Image src="/images/brands/app-store.png" alt="" width="36" height="36" />;
    case "google-play":
      // Google Play icon (2022), unmodified.
      return <Image src="/images/brands/google-play.svg" alt="" width="28" height="32" />;
    case "linkedin":
      return <Image src="/images/brands/linkedin.svg" alt="" width="37" height="32" />;
    default:
      return <span className="lb-rocket-emoji">🚀</span>;
  }
}

export function LinkButton({ href, children }: { href: string; children: ReactNode }) {
  const kind = KINDS[new URL(href).hostname.replace(/^www\./, "")] ?? "rocket";
  return (
    <a href={href} target="_blank" rel="noreferrer" className={`lb lb-${kind} font-display text-sm font-bold`}>
      <span aria-hidden="true" className="lb-mark">
        <Mark kind={kind} />
      </span>
      <span className="lb-face">{children}</span>
    </a>
  );
}
