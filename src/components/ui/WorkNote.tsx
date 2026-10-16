import Link from "next/link";
import type { ReactNode } from "react";
import { howIWork } from "@/content/profile";

// A paragraph on a project page that a HOW I WORK row links to (/projects/<slug>#<id>).
// Same hierarchy as the home row: the row's answer is the one large line, then the MDX lead sentence.
// Skill and answer come from that row, so they are written once in profile.ts.
// 상황·한 일·결과 get their quiet label column from the ul/li mapping in mdx-components.
export function WorkNote({ id, children }: { id: string; children: ReactNode }) {
  const row = howIWork.rows.find((r) => r.id === id);
  if (!row) throw new Error(`WorkNote "${id}" has no row in howIWork.rows`);
  return (
    <div id={id} className="work-note my-8 scroll-mt-20 rounded-r-btn border-l-2 border-hairline py-2 pr-3 pl-4 [&>p]:my-1 [&>p]:text-fg">
      <Link href="/#how-i-work" className="text-meta text-fg-subtle link-draw">
        {row.skill} · HOW I WORK ↑
      </Link>
      <h3 className="mt-1 font-display text-title font-bold text-fg">{row.answer}</h3>
      {children}
    </div>
  );
}
