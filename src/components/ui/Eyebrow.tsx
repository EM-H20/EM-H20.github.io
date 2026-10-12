import type { ReactNode } from "react";

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 font-mono text-eyebrow text-fg uppercase">{children}</p>;
}
