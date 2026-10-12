import fs from "node:fs";
import path from "node:path";
import type { ComponentType } from "react";

// Detail-page body for a project (src/content/projects/<slug>.mdx), rendered by ProjectDetail.
// profile.test.ts requires one file per project, so `null` only happens while a body is being written.
export async function loadProjectBody(slug: string): Promise<ComponentType | null> {
  if (!fs.existsSync(path.join(process.cwd(), "src/content/projects", `${slug}.mdx`))) return null;
  return (await import(`@/content/projects/${slug}.mdx`)).default;
}
