import { Section } from "@/components/ui/Container";
import { InfoLines } from "@/components/ui/InfoLines";
import { stack } from "@/content/profile";

export function Stack() {
  return (
    <Section id="stack" chip="STACK">
      <InfoLines lines={stack.map((g) => ({ label: g.group, value: g.items.join(" · ") }))} />
    </Section>
  );
}
