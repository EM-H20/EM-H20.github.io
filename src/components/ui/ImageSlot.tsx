import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ImageAspect, ImageSpec } from "@/content/profile";

const ASPECT: Record<ImageAspect, string> = {
  phone: "aspect-[9/19.5]",
  wide: "aspect-[16/10]",
  square: "aspect-square",
  og: "aspect-[1200/630]",
};

const RECOMMENDED: Record<ImageAspect, string> = {
  phone: "1080×2340",
  wide: "1600×1000",
  square: "512×512",
  og: "1200×630",
};

// Runs at build time (static export), so this checks the repo's public/ folder.
export function imageExists(src: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "public", src));
}

// Dev shows placeholders for files not added yet; production drops them so nothing looks unfinished.
export function visibleImages(
  images: readonly ImageSpec[],
  showMissing = process.env.NODE_ENV === "development",
): ImageSpec[] {
  return images.filter((image) => showMissing || imageExists(image.src));
}

export function ImageSlot({
  image,
  eager = false,
  className = "",
}: {
  image: ImageSpec;
  eager?: boolean;
  className?: string;
}) {
  return (
    <div className={`print-block relative overflow-hidden rounded-xl ${ASPECT[image.aspect]} ${className}`}>
      {imageExists(image.src) ? (
        <>
          <Skeleton className="absolute inset-0" />
          <Image
            src={image.src}
            alt={image.alt}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            loading={eager ? "eager" : "lazy"}
            className="object-cover object-top"
          />
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col justify-center gap-1 rounded-xl border border-dashed border-hairline p-3 text-[11px] leading-snug break-all text-fg-subtle">
          <span className="text-fg">{image.brief}</span>
          <span>{image.src}</span>
          <span>{RECOMMENDED[image.aspect]}</span>
        </div>
      )}
    </div>
  );
}
