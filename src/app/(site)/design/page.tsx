import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { IconCircle } from "@/components/ui/IconCircle";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { InfoLines } from "@/components/ui/InfoLines";
import { RotatingWord } from "@/components/ui/RotatingWord";
import { Skeleton } from "@/components/ui/Skeleton";
import { allImages, featured, hero, heroInfo, projects } from "@/content/profile";

export const metadata: Metadata = { title: "Design", robots: { index: false } };

// Class names are listed literally so Tailwind generates them.
const SWATCHES = [
  ["canvas", "bg-canvas"],
  ["surface", "bg-surface"],
  ["fg", "bg-fg"],
  ["fg-muted", "bg-fg-muted"],
  ["fg-subtle", "bg-fg-subtle"],
  ["hairline", "bg-hairline"],
  ["inverted", "bg-inverted"],
  ["dot", "bg-dot"],
] as const;

const TYPE = [
  ["greet", "font-display font-light text-greet"],
  ["title-lg", "font-display font-bold text-title-lg"],
  ["title", "text-title font-medium"],
  ["body", "text-body"],
  ["meta", "text-meta text-fg-subtle"],
] as const;

function Block({ name, children }: { name: string; children: ReactNode }) {
  return (
    <section className="space-y-4">
      <Chip as="p">{name}</Chip>
      {children}
    </section>
  );
}

export default function DesignPage() {
  return (
    <main className="flex-1 py-12">
      <Container className="space-y-14">
        <Block name="ROTATING WORD">
          <p className="font-display text-greet font-light">
            <span className="block whitespace-nowrap">
              <RotatingWord words={hero.words} />를 좋아하는
            </span>
          </p>
        </Block>

        <Block name="COLORS">
          <ul className="grid grid-cols-4 gap-3">
            {SWATCHES.map(([name, cls]) => (
              <li key={name} className="space-y-1">
                <div className={`h-12 rounded-btn shadow-hairline ${cls}`} />
                <p className="text-meta text-fg-subtle">{name}</p>
              </li>
            ))}
          </ul>
          <p className="text-body">
            형광펜: <Highlight>세종 창업 아이디어 리그 대상</Highlight>
          </p>
        </Block>

        <Block name="TYPE">
          {TYPE.map(([name, cls]) => (
            <div key={name}>
              <p className="text-meta text-fg-subtle">{name}</p>
              <p className={cls}>안녕하세요! 개발자 홍의민입니다.</p>
            </div>
          ))}
        </Block>

        <Block name="BUTTONS">
          <div className="flex flex-wrap items-center gap-3">
            <Button href="mailto:test@example.com">메일 보내기</Button>
            <Button href="https://github.com" variant="ghost">
              PDF 포트폴리오
            </Button>
            <Button href="https://github.com" variant="pill">
              PDF
            </Button>
            <Button href="https://github.com" variant="text">
              github
            </Button>
          </div>
        </Block>

        <Block name="ICONS">
          <div className="flex flex-wrap items-center gap-3">
            {[featured, ...projects].map((p) => (
              <IconCircle key={p.slug} icon={p.icon} symbol={p.symbol} />
            ))}
            <IconCircle symbol="puzzle-piece" size={40} />
          </div>
        </Block>

        <Block name="INFO LINES">
          <InfoLines lines={heroInfo()} />
        </Block>

        <Block name="SKELETON">
          <Skeleton className="h-20 max-w-sm rounded-xl" />
        </Block>

        <Block name="IMAGE SLOTS">
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-5">
            {allImages().map((image) => (
              <li key={image.src}>
                <ImageSlot image={image} />
              </li>
            ))}
          </ul>
        </Block>
      </Container>
    </main>
  );
}
