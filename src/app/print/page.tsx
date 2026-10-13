import type { Metadata } from "next";
import { Awards } from "@/components/sections/Awards";
import { AxNative } from "@/components/sections/AxNative";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { Projects } from "@/components/sections/Projects";
import { Container } from "@/components/ui/Container";
import { projectPages } from "@/content/profile";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Portfolio PDF", robots: { index: false } };

// Source of portfolio.pdf: the home page as it is on the web, then every project's detail page.
// data-site-url lets scripts/build-pdf.mjs make site-relative links work inside the PDF.
export default function PrintPage() {
  return (
    <main className="scheme-light bg-canvas text-fg" data-site-url={site.url}>
      <Hero />
      <Projects />
      <AxNative />
      <Awards />
      {/* Short enough to keep on one page rather than leave its links stranded on the next */}
      <div className="print-block">
        <Contact />
      </div>
      {projectPages().map((page) => (
        <Container key={page.slug} className="print-break">
          <ProjectDetail page={page} />
        </Container>
      ))}
    </main>
  );
}
