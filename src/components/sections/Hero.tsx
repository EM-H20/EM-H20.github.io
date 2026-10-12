import { Button } from "@/components/ui/Button";
import { CliPanel } from "@/components/ui/CliPanel";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Typewriter } from "@/components/ui/Typewriter";
import { cliLines, hero, heroStats, links } from "@/content/profile";
import { schedule } from "@/lib/typing";

export function Hero() {
  const lines = cliLines();
  const [nameStart, ...lineStarts] = schedule([hero.name, ...lines.map((l) => l.text)]);
  return (
    <Container className="grid gap-12 pt-16 md:grid-cols-[1.2fr_1fr] md:items-center md:pt-28">
      <div>
        <Eyebrow>{hero.eyebrow}</Eyebrow>
        <h1 className="text-display font-book text-fg" aria-label={hero.name}>
          <Typewriter text={hero.name} start={nameStart} />
        </h1>
        <p className="mt-6 max-w-xl text-body text-fg-muted">{hero.intro}</p>
        <p className="mt-4 font-mono text-caption text-fg-subtle">{heroStats().join(" · ")}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href={links.email.href}>메일 보내기</Button>
          <Button href={links.github.href} variant="ghost">
            GitHub
          </Button>
        </div>
      </div>
      <CliPanel lines={lines} starts={lineStarts} />
    </Container>
  );
}
