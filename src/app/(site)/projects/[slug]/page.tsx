import type { Metadata } from "next";
import Link from "next/link";
import { ProjectDetail } from "@/components/sections/ProjectDetail";
import { Container } from "@/components/ui/Container";
import { projectPages } from "@/content/profile";
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
  return (
    <main className="flex-1 py-8 md:py-12">
      <Container>
        <Link href="/#projects" className="inline-flex min-h-10 items-center text-meta text-fg-subtle link-draw">
          ← 프로젝트 목록
        </Link>

        <div className="mt-4">
          <ProjectDetail page={page} />
        </div>

        <nav aria-label="다른 프로젝트" className="mt-14 flex justify-between gap-4 border-t border-hairline pt-6 text-meta">
          {prev ? (
            <Link href={`/projects/${prev.slug}`} className="inline-flex min-h-10 items-center text-fg link-draw">
              ← {prev.name}
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/projects/${next.slug}`} className="inline-flex min-h-10 items-center text-right text-fg link-draw">
              {next.name} →
            </Link>
          )}
        </nav>
      </Container>
    </main>
  );
}
