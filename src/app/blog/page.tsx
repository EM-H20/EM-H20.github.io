import type { Metadata } from "next";
import Link from "next/link";
import { getPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Blog",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-24">
      <h1 className="text-3xl font-semibold">Blog</h1>
      <ul className="mt-10 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`} className="underline">
              {post.title}
            </Link>
            <p>{post.description}</p>
            <time dateTime={post.date}>{post.date}</time>
          </li>
        ))}
      </ul>
    </main>
  );
}
