import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import { TagList } from "@/components/ui/Tag";
import { featured } from "@/content/profile";

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[96px_1fr] sm:gap-4">
      <dt className="font-mono text-eyebrow text-fg-subtle uppercase">{label}</dt>
      <dd className="text-sm text-fg-muted">{children}</dd>
    </div>
  );
}

export function Featured() {
  const screens = visibleImages(featured.screens);
  const [event] = visibleImages([featured.event]);
  const [icon] = visibleImages([featured.icon]);
  return (
    <Section id="featured" eyebrow="Featured Project" title="대표 프로젝트">
      <Card inverted size="lg">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              {icon && <ImageSlot image={icon} className="size-10 shrink-0" />}
              <p className="font-mono text-eyebrow text-fg-subtle uppercase">
                {featured.period} · {featured.platform}
              </p>
            </div>
            <h3 className="mt-3 text-heading-lg font-book text-fg">{featured.name}</h3>
            <p className="mt-4 text-body text-fg">{featured.summary}</p>
            <p className="mt-2 text-body text-fg-muted">{featured.description}</p>
            <dl className="mt-8 space-y-4">
              <Row label="Role">{featured.role}</Row>
              <Row label="Features">{featured.features.join(" · ")}</Row>
            </dl>
            <TagList items={featured.stack} className="mt-6" />
          </div>
          <div className="space-y-8">
            <div>
              <Eyebrow>Awards</Eyebrow>
              <TagList items={featured.badges} tone="award" />
            </div>
            <div>
              <Eyebrow>Events</Eyebrow>
              <p className="text-sm text-fg-muted">{featured.events.join(" · ")}</p>
            </div>
          </div>
        </div>
        {screens.length > 0 && (
          <ul className="mt-10 grid grid-cols-3 gap-3 md:max-w-xl md:gap-4">
            {screens.map((image) => (
              <li key={image.src}>
                <ImageSlot image={image} />
              </li>
            ))}
          </ul>
        )}
        {event && <ImageSlot image={event} className="mt-6 md:max-w-xl" />}
        <div className="mt-10 flex flex-wrap gap-3">
          {featured.links.map((link) => (
            <Button key={link.href} href={link.href} variant="ghost">
              {link.label}
            </Button>
          ))}
        </div>
      </Card>
    </Section>
  );
}
