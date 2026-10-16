import Link from "next/link";
import { Section } from "@/components/ui/Container";
import { howIWork, projectPages, shippedNames } from "@/content/profile";

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
            <p className="text-meta text-fg-subtle">
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
