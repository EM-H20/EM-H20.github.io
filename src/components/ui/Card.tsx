import type { ReactNode } from "react";

const SIZES = { sm: "p-4", md: "p-6", lg: "p-8 md:p-10" } as const;

export function Card({
  inverted = false,
  size = "sm",
  className = "",
  children,
}: {
  inverted?: boolean;
  size?: keyof typeof SIZES;
  className?: string;
  children: ReactNode;
}) {
  const surface = inverted ? "scheme-inverted bg-inverted text-on-inverted" : "bg-surface shadow-card";
  return <div className={`rounded-card ${surface} ${SIZES[size]} ${className}`}>{children}</div>;
}
