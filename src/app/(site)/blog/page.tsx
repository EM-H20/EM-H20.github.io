import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Chip } from "@/components/ui/Chip";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="flex-1 py-12 md:py-16">
      <Container>
        <Chip as="h1">BLOG</Chip>
        <ul className="mt-6">
          {posts.map((post) => (
            <li key={post.slug} className="flex flex-wrap items-baseline gap-x-3 py-2">
              <Link href={`/blog/${post.slug}`} className="text-title font-medium text-fg link-draw">
                {post.title}
              </Link>
              <time dateTime={post.date} className="text-meta text-fg-subtle">
                {post.date.replaceAll("-", ".")}
              </time>
            </li>
          ))}
        </ul>
      </Container>
    </main>
  );
}
