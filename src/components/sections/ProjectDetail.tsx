import { Button } from "@/components/ui/Button";
import { Highlight } from "@/components/ui/Highlight";
import { IconCircle } from "@/components/ui/IconCircle";
import { ImageSlot } from "@/components/ui/ImageSlot";
import type { ProjectPage } from "@/content/profile";
import { loadProjectBody } from "@/lib/projects";

// A project's detail content: the web page /projects/<slug> and each project page of the PDF render this.
// The id lets the PDF turn links to /projects/<slug> into jumps within the document.
export async function ProjectDetail({ page }: { page: ProjectPage }) {
  const Body = await loadProjectBody(page.slug);
  return (
    <article id={`project-${page.slug}`}>
      <header className="flex items-center gap-4">
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
        // Paper can't scroll: show the first four in one row instead.
        <ul className="mt-8 flex snap-x gap-3 overflow-x-auto pb-2 print:overflow-visible print:[&>li:nth-child(n+5)]:hidden">
          {page.gallery.map((image, i) => (
            <li key={image.src} className="w-36 shrink-0 snap-start sm:w-40 print:w-[calc((100%-36px)/4)]">
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
        <div className="mt-8">
          <Body />
        </div>
      )}
    </article>
  );
}
