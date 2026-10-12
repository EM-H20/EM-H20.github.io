import Image from "next/image";
import { imageExists } from "@/components/ui/ImageSlot";
import type { ImageSpec } from "@/content/profile";

const SIZES = { 56: "size-14 text-[28px]", 40: "size-10 text-xl" } as const;

// App icon when its file exists at build time, emoji otherwise — no placeholder, no broken image.
// The ring is drawn on ::after so it stays visible over white-background icons.
export function IconCircle({ icon, emoji, size = 56 }: { icon?: ImageSpec; emoji: string; size?: keyof typeof SIZES }) {
  const src = icon && imageExists(icon.src) ? icon.src : undefined;
  return (
    <span className={`relative grid shrink-0 place-items-center overflow-hidden rounded-full bg-surface after:absolute after:inset-0 after:rounded-full after:shadow-hairline ${SIZES[size]}`}>
      {src ? (
        <Image src={src} alt="" fill sizes={`${size}px`} className="object-cover" />
      ) : (
        <span aria-hidden="true">{emoji}</span>
      )}
    </span>
  );
}
