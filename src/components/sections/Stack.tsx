import { Fragment } from "react";
import { Section } from "@/components/ui/Container";
import { TagList } from "@/components/ui/Tag";
import { stack } from "@/content/profile";

export function Stack() {
  return (
    <Section id="stack" eyebrow="Tech Stack" title="기술 스택">
      <dl className="grid gap-x-6 gap-y-4 md:grid-cols-[180px_1fr]">
        {stack.map((group) => (
          <Fragment key={group.group}>
            <dt className="pt-1 font-mono text-eyebrow text-fg-subtle uppercase">{group.group}</dt>
            <dd>
              <TagList items={group.items} />
            </dd>
          </Fragment>
        ))}
      </dl>
    </Section>
  );
}
