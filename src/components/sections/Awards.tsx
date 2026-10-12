import { Section } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { awards } from "@/content/profile";

// Award name leads each row (F-pattern). Mobile: award | year, then contest · project.
export function Awards() {
  return (
    <Section id="awards" chip="AWARDS">
      <ol className="divide-y divide-hairline">
        {awards.map((a) => (
          <li key={`${a.year}-${a.contest}`} className="grid py-2.5 first:pt-0 last:pb-0 grid-cols-[1fr_auto] gap-x-4 gap-y-0.5 sm:grid-cols-[150px_1fr_auto] sm:items-baseline">
            <span className="font-display font-bold text-fg">{a.highlight ? <Highlight>{a.award}</Highlight> : a.award}</span>
            <span className="text-meta text-fg-subtle sm:order-3">{a.year}</span>
            <span className="col-span-2 text-[15px] text-fg-muted sm:order-2 sm:col-span-1">
              {a.contest} <span className="text-fg-subtle">· {a.project}</span>
            </span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
