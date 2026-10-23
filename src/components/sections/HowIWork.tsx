import Link from "next/link";
import { Section } from "@/components/ui/Container";
import { howIWork, projectPages, shippedNames } from "@/content/profile";

// One hue and line icon per row (24×24, lucide-style strokes), so the list scans by color before text.
const ROW_ICON: Record<string, { color: string; paths: string[] }> = {
  "work-jail": { color: "#3b82f6", paths: ["M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z", "M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"] },
  "work-right": { color: "#ec4899", paths: ["M12 19l7-7 3 3-7 7-3-3z", "M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z", "M2 2l7.586 7.586", "M11 9a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"] },
  "work-battery": { color: "#16a34a", paths: ["M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", "m9 12 2 2 4-4"] },
  "work-tutorial": { color: "#f97316", paths: ["M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"] },
  "work-delete": { color: "#8b5cf6", paths: ["M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2", "M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z", "M23 21v-2a4 4 0 0 0-3-3.87", "M16 3.13a4 4 0 0 1 0 7.75"] },
  "work-alert": { color: "#f5b800", paths: ["M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z", "m21 21-4.3-4.3"] },
};

function RowIcon({ id }: { id: string }) {
  const icon = ROW_ICON[id];
  if (!icon) return null;
  return (
    <span
      aria-hidden="true"
      className="inline-flex size-9 shrink-0 items-center justify-center rounded-full sm:mb-2 sm:flex"
      style={{ color: icon.color, backgroundColor: `color-mix(in srgb, ${icon.color} 14%, transparent)` }}
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {icon.paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </svg>
    </span>
  );
}

// A T-shaped profile (broad bar over a deep stem), then product changes made from feedback.
// Each row links to the paragraph on the project page that tells the whole story.
export function HowIWork() {
  const names = new Map(projectPages().map((p) => [p.slug, p.name]));
  return (
    <Section id="how-i-work" chip="HOW I WORK">
      <figure aria-label={`T자형 — 깊이: ${howIWork.depth}, 넓이: ${howIWork.breadth.map((b) => b.label).join(", ")}`}>
        <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 border-b-4 border-fg pb-2 text-[15px] text-fg">
          {howIWork.breadth.map((item) => (
            <li key={item.label}>
              <Link href={`/projects/${item.slug}`} className="link-draw">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex flex-col items-center">
          <span aria-hidden="true" className="h-12 w-1 bg-fg" />
          <p className="mt-2 font-display text-title font-bold text-fg">{howIWork.depth}</p>
          <p className="text-meta text-fg-subtle">스토어 출시 앱 {shippedNames().length}개 · 경찰과도둑 앱 설계</p>
        </div>
      </figure>

      <div className="mt-8 space-y-1 text-body text-fg-muted">
        <p className="font-bold text-fg">{howIWork.story[0]}</p>
        {howIWork.story.slice(1).map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {/* One focal point per row: the answer. Skill and project index the row on the left (sm+);
          question, project and fact stay quiet. The answer link's ::after makes the whole row clickable. */}
      <ol className="mt-8 divide-y divide-hairline">
        {howIWork.rows.map((row) => (
          <li key={row.id} className="group relative grid gap-y-1 py-5 first:pt-0 last:pb-0 sm:grid-cols-[150px_1fr] sm:gap-x-6">
            <p className="flex items-center gap-2 text-meta text-fg-subtle sm:block">
              <RowIcon id={row.id} />
              <span className="font-semibold text-fg">{row.skill}</span>
              <span className="sm:hidden"> · </span>
              <span className="sm:block">{names.get(row.slug)}</span>
            </p>
            <div>
              <p className="text-meta text-fg-subtle">{row.question}</p>
              <p className="mt-0.5 font-display text-title font-bold text-fg">
                {/* A plain <a>: a full load sets :target, which tints the paragraph; client navigation would not. */}
                <a href={`/projects/${row.slug}#${row.id}`} className="link-draw after:absolute after:inset-0">
                  {row.answer}
                  <span className="sr-only"> — {names.get(row.slug)}에서 어떻게 했는지 보기</span>
                </a>
              </p>
              <p className="mt-1.5 text-[15px] text-fg-muted">
                {row.fact} <span aria-hidden="true" className="text-fg-subtle">→</span>
              </p>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
