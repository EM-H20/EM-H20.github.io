import type { ReactNode } from "react";

type Tone = "default" | "award";

export function Tag({ tone = "default", children }: { tone?: Tone; children: ReactNode }) {
  const color = tone === "award" ? "font-medium text-fg" : "text-fg-subtle";
  return (
    <span className={`inline-flex items-center rounded-sm px-2 py-0.5 font-mono text-eyebrow uppercase shadow-hairline ${color}`}>
      {children}
    </span>
  );
}

export function TagList({
  items,
  tone = "default",
  className = "",
}: {
  items: readonly string[];
  tone?: Tone;
  className?: string;
}) {
  return (
    <ul className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Tag tone={tone}>{item}</Tag>
        </li>
      ))}
    </ul>
  );
}
