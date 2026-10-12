import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "pill" | "text";

// Font size lives in each variant: two text-* utilities on one element resolve by CSS order, not intent.
const BASE =
  "inline-flex items-center justify-center font-display transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

const VARIANTS: Record<Variant, string> = {
  primary: "min-h-11 rounded-btn bg-inverted px-[18px] text-sm font-bold text-on-inverted hover:opacity-85",
  ghost: "min-h-11 rounded-btn px-[18px] text-sm font-bold text-fg shadow-hairline hover:opacity-70",
  // Visually 30px tall; the pseudo-element extends the hit area to 42px.
  pill: "relative h-[30px] rounded-full bg-inverted px-3 text-[13px] font-bold text-on-inverted before:absolute before:inset-x-0 before:-inset-y-1.5 hover:opacity-85",
  text: "min-h-10 font-light text-base text-fg underline-offset-4 hover:underline",
};

export function Button({
  href,
  variant = "primary",
  download,
  children,
}: {
  href: string;
  variant?: Variant;
  download?: string;
  children: ReactNode;
}) {
  const className = `${BASE} ${VARIANTS[variant]}`;
  if (href.startsWith("/") && download === undefined) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      download={download}
      className={className}
      {...(external && { target: "_blank", rel: "noreferrer" })}
    >
      {children}
    </a>
  );
}
