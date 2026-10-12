import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { links } from "@/content/profile";
import { site } from "@/lib/site";

// Display is set per link: combining `inline-flex` with `hidden` lets `inline-flex` win on mobile.
const NAV_LINK = "min-h-10 items-center text-fg link-draw";

export function Nav() {
  return (
    <header className="sticky top-0 z-10 bg-canvas/85 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className={`${NAV_LINK} inline-flex font-display text-base font-bold`}>
          {site.shortName}
        </Link>
        <nav aria-label="메뉴" className="flex items-center gap-3.5 font-display text-base font-bold">
          <Link href="/#projects" className={`${NAV_LINK} hidden sm:inline-flex`}>
            projects
          </Link>
          <Link href="/#awards" className={`${NAV_LINK} hidden sm:inline-flex`}>
            awards
          </Link>
          <Link href="/blog" className={`${NAV_LINK} inline-flex`}>
            blog
          </Link>
          <span aria-hidden="true" className="h-3.5 w-px bg-hairline" />
          <Button href={links.github.href} variant="text">
            github
          </Button>
          <Button href={site.pdf.href} download={site.pdf.filename} variant="pill">
            PDF
          </Button>
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
