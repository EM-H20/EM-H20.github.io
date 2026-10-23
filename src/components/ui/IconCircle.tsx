import Image from "next/image";
import { imageExists } from "@/components/ui/ImageSlot";
import { phosphor, type PhosphorName } from "@/components/ui/phosphor";
import type { ImageSpec } from "@/content/profile";

const SIZES = { 56: "size-14", 40: "size-10" } as const;
const GLYPH = { 56: "size-7", 40: "size-5" } as const;

// App icon when its file exists at build time, a Phosphor duotone icon otherwise — no placeholder, no broken image.
// The duotone's faint layer takes the brand yellow; the outline follows the text color (light and dark).
// The ring is drawn on ::after so it stays visible over white-background icons.
export function IconCircle({ icon, symbol, size = 56 }: { icon?: ImageSpec; symbol: PhosphorName; size?: keyof typeof SIZES }) {
  const src = icon && imageExists(icon.src) ? icon.src : undefined;
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface after:absolute after:inset-0 after:rounded-full after:shadow-hairline ${SIZES[size]}`}>
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <svg aria-hidden="true" viewBox="0 0 256 256" className={`text-fg ${GLYPH[size]}`}>
          {phosphor[symbol].map((path) =>
            "faint" in path ? (
              <path key={path.d} d={path.d} className="fill-dot" opacity={0.6} />
            ) : (
              <path key={path.d} d={path.d} fill="currentColor" />
            ),
          )}
        </svg>
      )}
    </span>
  );
}
