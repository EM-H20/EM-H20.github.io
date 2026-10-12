import type { Metadata } from "next";
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
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-24">
      <article>
        <h1 className="text-3xl font-semibold">{meta.title}</h1>
        <time dateTime={meta.date}>{meta.date}</time>
        <div className="mt-10">
          <Content />
        </div>
      </article>
    </main>
  );
}
