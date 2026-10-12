import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

export type PostMeta = { title: string; description: string; date: string };
export type Post = PostMeta & { slug: string };

const POSTS_DIR = path.join(process.cwd(), "src/content/posts");

export function getSlugs(): string[] {
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function getPost(
  slug: string,
): Promise<{ Content: ComponentType; meta: PostMeta }> {
  const mod = await import(`@/content/posts/${slug}.mdx`);
  const meta = mod.metadata as Partial<PostMeta> | undefined;
  // Fail the build instead of shipping a post with missing fields
  if (!meta?.title || !meta.description || !/^\d{4}-\d{2}-\d{2}$/.test(meta.date ?? "")) {
    throw new Error(
      `${slug}.mdx: export const metadata = { title, description, date: "YYYY-MM-DD" } is required`,
    );
  }
  return { Content: mod.default, meta: meta as PostMeta };
}

export async function getPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    getSlugs().map(async (slug) => ({ slug, ...(await getPost(slug)).meta })),
  );
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
