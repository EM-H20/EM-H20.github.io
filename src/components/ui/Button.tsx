import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "primary" | "ghost" | "pill" | "text";

const BASE =
  "inline-flex items-center justify-center gap-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fg";

const VARIANTS: Record<Variant, string> = {
  primary: "min-h-10 rounded-card bg-inverted px-3 text-on-inverted hover:opacity-85",
  ghost: "min-h-10 rounded-card px-5 text-fg-muted shadow-hairline hover:text-fg",
  // Visually 28px tall (refero pill); the pseudo-element extends the hit area to 40px.
  pill: "relative h-7 rounded-full bg-inverted px-3 text-on-inverted before:absolute before:inset-x-0 before:-inset-y-1.5 hover:opacity-85",
  text: "min-h-10 px-1 text-fg-muted hover:text-fg",
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
