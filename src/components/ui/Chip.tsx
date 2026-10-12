import type { ReactNode } from "react";

export function Chip({ as: Tag = "h2", id, children }: { as?: "h1" | "h2" | "p"; id?: string; children: ReactNode }) {
  return (
    <Tag id={id} className="inline-block bg-inverted px-3 pt-2 pb-1.5 font-display text-chip font-bold text-on-inverted">
      {children}
    </Tag>
  );
}
