import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { getPost, getSlugs } from "@/lib/posts";
import { baseOpenGraph } from "@/lib/site";

// Static export: only slugs known at build time exist
export const dynamicParams = false;

export function generateStaticParams() {
  return getSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { meta } = await getPost(slug);
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { ...baseOpenGraph, type: "article", publishedTime: meta.date },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const { Content, meta } = await getPost(slug);
  return (
    <main className="flex-1 py-12 md:py-16">
      <Container>
        <article>
          <time dateTime={meta.date} className="text-meta text-fg-subtle">
            {meta.date.replaceAll("-", ".")}
          </time>
          <h1 className="mt-2 font-display text-title-lg font-bold text-fg">{meta.title}</h1>
          <div className="mt-10">
            <Content />
          </div>
        </article>
      </Container>
    </main>
  );
}
