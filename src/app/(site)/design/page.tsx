import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CliPanel } from "@/components/ui/CliPanel";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tag, TagList } from "@/components/ui/Tag";
import { allImages, cliLines } from "@/content/profile";

export const metadata: Metadata = { title: "Design", robots: { index: false } };

// Class names are listed literally so Tailwind generates them.
const SWATCHES = [
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["inverted", "bg-inverted"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["fg-subtle", "bg-fg-subtle"],
  ["fg-faint", "bg-fg-faint"],
  ["hairline", "bg-hairline"],
  ["skeleton", "bg-skeleton"],
  ["accent", "bg-accent"],
] as const;

const TYPE = [
  ["display", "text-display font-book"],
  ["heading-lg", "text-heading-lg font-book"],
  ["heading", "text-heading font-book"],
  ["body", "text-body"],
  ["caption", "text-caption"],
] as const;

export default function DesignPage() {
  return (
    <main className="flex-1 py-16">
      <Container className="space-y-16">
        <section>
          <Eyebrow>Colors</Eyebrow>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {SWATCHES.map(([name, cls]) => (
              <li key={name} className="space-y-2">
                <div className={`h-16 rounded-card shadow-hairline ${cls}`} />
                <p className="font-mono text-eyebrow text-fg-subtle uppercase">{name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <Eyebrow>Type</Eyebrow>
          <div className="space-y-6">
            {TYPE.map(([name, cls]) => (
              <div key={name}>
                <p className="font-mono text-eyebrow text-fg-subtle uppercase">{name}</p>
                <p className={cls}>홍의민 Turning Ideas Into Real Products</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <Eyebrow>Buttons</Eyebrow>
          <div className="flex flex-wrap items-center gap-3">
            <Button href="mailto:test@example.com">Primary</Button>
            <Button href="https://github.com" variant="ghost">
              Ghost
            </Button>
            <Button href="https://github.com" variant="pill">
              Pill
            </Button>
            <Button href="/blog" variant="text">
              Text
            </Button>
          </div>
        </section>

        <section>
          <Eyebrow>Cards</Eyebrow>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <p className="text-body">sm card</p>
            </Card>
            <Card size="md">
              <p className="text-body text-fg-muted">md card</p>
            </Card>
            <Card inverted size="lg">
              <Eyebrow>Inverted</Eyebrow>
              <p className="text-body text-fg-muted">lg inverted card</p>
              <TagList items={["Flutter", "Riverpod"]} className="mt-4" />
              <div className="mt-4">
                <Button href="https://github.com" variant="ghost">
                  Ghost on inverted
                </Button>
              </div>
            </Card>
          </div>
        </section>

        <section>
          <Eyebrow>Tags</Eyebrow>
          <div className="flex flex-wrap gap-2">
            <Tag>Flutter</Tag>
            <Tag tone="award">대상</Tag>
          </div>
        </section>

        <section>
          <Eyebrow>CLI Panel</Eyebrow>
          <div className="max-w-md">
            <CliPanel lines={cliLines()} />
          </div>
        </section>

        <section>
          <Eyebrow>Skeleton</Eyebrow>
          <Skeleton className="h-24 max-w-md rounded-card" />
        </section>

        <section>
          <Eyebrow>Image slots (all)</Eyebrow>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {allImages().map((image) => (
              <li key={image.src}>
                <ImageSlot image={image} />
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </main>
  );
}
