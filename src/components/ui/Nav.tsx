import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { links } from "@/content/profile";
import { site } from "@/lib/site";

const SECTIONS = [
  { href: "/#projects", label: "Projects" },
  { href: "/#awards", label: "Awards" },
  { href: "/#stack", label: "Stack" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-xl">
      <Container className="flex h-16 items-center gap-8">
        <Link href="/" className="text-sm font-medium text-fg">
          {site.shortName}
        </Link>
        <nav aria-label="섹션" className="hidden items-center gap-6 md:flex">
          {SECTIONS.map((s) => (
            <Link key={s.href} href={s.href} className="text-sm text-fg-muted hover:text-fg">
              {s.label}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button href={site.pdf.href} download={site.pdf.filename} variant="text">
            PDF
          </Button>
          <Button href="/blog" variant="text">
            Blog
          </Button>
          <Button href={links.github.href} variant="pill">
            GitHub
          </Button>
        </div>
      </Container>
    </header>
  );
}
