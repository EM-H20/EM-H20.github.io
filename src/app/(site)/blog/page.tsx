import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="flex-1 py-16 md:py-24">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>Blog</Eyebrow>
          <h1 className="text-heading-lg font-book text-fg">글</h1>
          <ul className="mt-12 divide-y divide-hairline border-y border-hairline">
            {posts.map((post) => (
              <li key={post.slug} className="py-6">
                <Link href={`/blog/${post.slug}`} className="text-xl font-medium text-fg hover:underline">
                  {post.title}
                </Link>
                <p className="mt-2 text-body text-fg-muted">{post.description}</p>
                <time dateTime={post.date} className="mt-2 block font-mono text-caption text-fg-subtle">
                  {post.date}
                </time>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </main>
  );
}
