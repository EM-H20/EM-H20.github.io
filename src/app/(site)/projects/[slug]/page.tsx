import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { IconCircle } from "@/components/ui/IconCircle";
import { ImageSlot } from "@/components/ui/ImageSlot";
import { projectPages } from "@/content/profile";
import { loadProjectBody } from "@/lib/projects";
import { baseOpenGraph } from "@/lib/site";

// Static export: only projects known at build time exist
export const dynamicParams = false;

export function generateStaticParams() {
  return projectPages().map(({ slug }) => ({ slug }));
}

function findPage(slug: string) {
  const pages = projectPages();
  const index = pages.findIndex((p) => p.slug === slug);
  if (index < 0) throw new Error(`unknown project: ${slug}`);
  return { page: pages[index], prev: pages[index - 1], next: pages[index + 1] };
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { page } = findPage(slug);
  return {
    title: page.name,
    description: page.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { ...baseOpenGraph, type: "article" },
  };
}

export default async function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const { page, prev, next } = findPage(slug);
  const Body = await loadProjectBody(slug);
  return (
    <main className="flex-1 py-8 md:py-12">
      <Container>
        <Link href="/#projects" className="inline-flex min-h-10 items-center text-meta text-fg-subtle underline-offset-4 hover:underline">
          ← 프로젝트 목록
        </Link>

        <header className="mt-4 flex items-center gap-4">
          <IconCircle icon={page.icon} emoji={page.emoji} />
          <div>
            <h1 className="font-display text-title-lg font-bold text-fg">{page.name}</h1>
            <p className="text-meta text-fg-subtle">
              {page.period} · {page.meta}
            </p>
          </div>
        </header>

        {page.badges.length > 0 && (
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-[15px]">
            {page.badges.map((badge) =>
              // Store releases read as facts; awards get the highlight.
              page.shipped && badge.includes("출시") ? (
                <span key={badge} className="text-fg-subtle">
                  {badge}
                </span>
              ) : (
                <Highlight key={badge}>{badge}</Highlight>
              ),
            )}
          </p>
        )}

        <p className="mt-4 text-[17px] text-fg">{page.summary}</p>

        <div className="mt-5 flex flex-wrap gap-2.5">
          {page.links.map((link) => (
            <Button key={link.href} href={link.href} variant="ghost">
              {link.label}
            </Button>
          ))}
        </div>

        {page.gallery.length > 0 && (
          // Scrolls sideways inside the column, so the page itself never scrolls horizontally.
          <ul className="mt-8 flex snap-x gap-3 overflow-x-auto pb-2">
            {page.gallery.map((image, i) => (
              <li key={image.src} className="w-36 shrink-0 snap-start sm:w-40">
                {/* The first screenshot is above the fold (LCP on phones) */}
                <ImageSlot image={image} eager={i === 0} />
              </li>
            ))}
          </ul>
        )}
        {page.photos.map((image) => (
          <ImageSlot key={image.src} image={image} className="mt-4 max-w-xl" />
        ))}

        <p className="mt-6 text-meta text-fg-subtle">{page.stack.join(" · ")}</p>

        {Body && (
          <article className="mt-8">
            <Body />
          </article>
        )}

        <nav aria-label="다른 프로젝트" className="mt-14 flex justify-between gap-4 border-t border-hairline pt-6 text-meta">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="inline-flex min-h-10 items-center text-fg underline-offset-4 hover:underline">
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="inline-flex min-h-10 items-center text-right text-fg underline-offset-4 hover:underline">
              {next.name} →
            </Link>
          )}
        </nav>
      </Container>
    </main>
  );
}
