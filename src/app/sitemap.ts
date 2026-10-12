import type { MetadataRoute } from "next";
import { projectPages } from "@/content/profile";
import { getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getPosts();
  return [
    { url: site.url },
    ...projectPages().map((project) => ({ url: `${site.url}/projects/${project.slug}` })),
    { url: `${site.url}/blog` },
    ...posts.map((post) => ({
      url: `${site.url}/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
