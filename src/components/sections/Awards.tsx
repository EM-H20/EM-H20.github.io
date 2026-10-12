import { Section } from "@/components/ui/Container";
import { awards } from "@/content/profile";

// Award name leads each row (F-pattern scanning); on mobile: award | year, then contest, then project.
export function Awards() {
  return (
    <Section id="awards" eyebrow="Awards" title="수상">
      <ol className="divide-y divide-hairline border-y border-hairline">
        {awards.map((a) => (
          <li
            key={`${a.year}-${a.contest}`}
            className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-1 py-4 md:grid-cols-[180px_1fr_160px_64px] md:items-baseline"
          >
            <span className={`order-1 ${a.highlight ? "font-medium text-fg" : "text-fg-muted"}`}>{a.award}</span>
            <span className="order-2 font-mono text-caption text-fg-subtle md:order-4 md:text-right">{a.year}</span>
            <span className="order-3 col-span-2 text-fg-muted md:order-2 md:col-span-1">{a.contest}</span>
            <span className="order-4 col-span-2 text-sm text-fg-subtle md:order-3 md:col-span-1">{a.project}</span>
          </li>
        ))}
      </ol>
    </Section>
  );
}
