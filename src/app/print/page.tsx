import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import {
  awards,
  ax,
  education,
  hero,
  heroStats,
  links,
  type LinkSpec,
  type ProjectPage,
  profilePhoto,
  projectPages,
  stack,
} from "@/content/profile";
import { loadProjectBody } from "@/lib/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Portfolio PDF", robots: { index: false } };

const bare = (href: string) =>
  decodeURI(href).replace(/^mailto:/, "").replace(/^https?:\/\//, "").replace(/\/$/, "");

function PrintLink({ link }: { link: LinkSpec }) {
  return (
    <a href={link.href} className="text-fg">
      {link.label}{" "}
      {link.label !== bare(link.href) && <span className="text-xs text-fg-subtle">{bare(link.href)}</span>}
    </a>
  );
}

function Heading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <>
      <p className="mb-2 font-display text-xs font-bold tracking-wide text-fg-subtle">{eyebrow}</p>
      <h2 className="mb-6 font-display text-[26px] font-bold">{title}</h2>
    </>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <p className="text-xs text-fg-subtle">{children}</p>;
}

// One page per project: the same facts, screenshots and body as its web detail page.
async function ProjectSheet({ page }: { page: ProjectPage }) {
  const Body = await loadProjectBody(page.slug);
  const photos = visibleImages(page.photos);
  const screens = visibleImages(page.gallery).slice(0, photos.length > 0 ? 3 : 4);
  return (
    <section className="print-break pt-10">
      <p className="mb-2 font-display text-xs font-bold tracking-wide text-fg-subtle">Project</p>
      <h2 className="font-display text-[26px] font-bold">{page.name}</h2>
      <Meta>
        {page.period} · {page.meta}
      </Meta>
      {page.badges.length > 0 && <p className="mt-2 text-sm font-medium">{page.badges.join(" · ")}</p>}
      <p className="mt-3 text-body">{page.summary}</p>
      {(screens.length > 0 || photos.length > 0) && (
        <div className="print-block mt-5 flex items-start gap-3">
          {screens.map((image) => (
            <ImageSlot key={image.src} image={image} eager className="w-28 shrink-0" />
          ))}
          {photos.map((image) => (
            <ImageSlot key={image.src} image={image} eager className="w-56 shrink-0" />
          ))}
        </div>
      )}
      {Body && (
        // MDX elements are styled for the web; tighten them for paper.
        <div className="mt-2 [&_h2]:mt-5 [&_h2]:mb-1.5 [&_h2]:break-after-avoid [&_h2]:text-base [&_li]:text-sm [&_p]:my-1.5 [&_p]:text-sm [&_ul]:my-1.5">
          <Body />
        </div>
      )}
      <ul className="print-block mt-4 space-y-1 text-sm">
        {[...page.links, { label: "웹에서 보기", href: `${site.url}/projects/${page.slug}` }].map((link) => (
          <li key={link.href}>
            <PrintLink link={link} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function PrintPage() {
  const [photo] = visibleImages([profilePhoto]);
  return (
    <main className="scheme-light mx-auto w-full max-w-[178mm] bg-canvas text-fg">
      <section className="flex gap-8 pt-6">
        <div className="flex-1">
          <p className="font-display text-xs font-bold tracking-wide text-fg-subtle">{hero.eyebrow}</p>
          <h1 className="mt-3 font-display text-[44px] leading-none font-bold">
            {hero.name} <span className="text-fg-subtle">{hero.alias}</span>
          </h1>
          <p className="mt-4 text-body text-fg-muted">{hero.intro}</p>
          <p className="mt-3 text-meta text-fg-subtle">{heroStats().join(" · ")}</p>
          <dl className="mt-8 space-y-2 text-sm">
            <div>
              <dt className="inline font-display text-xs font-bold text-fg-subtle">Education </dt>
              <dd className="inline">
                {education.school} · {education.extras.join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="inline font-display text-xs font-bold text-fg-subtle">Certification </dt>
              <dd className="inline">{education.certifications.join(" · ")}</dd>
            </div>
            <div>
              <dt className="inline font-display text-xs font-bold text-fg-subtle">Tech Stack </dt>
              <dd className="inline">{stack.flatMap((group) => group.items).join(" · ")}</dd>
            </div>
          </dl>
          <ul className="mt-6 space-y-1 text-sm">
            {[...Object.values(links), { label: "Portfolio", href: site.url }].map((link) => (
              <li key={link.href}>
                <PrintLink link={link} />
              </li>
            ))}
          </ul>
        </div>
        {photo && <ImageSlot image={photo} eager className="w-32 shrink-0" />}
      </section>

      {projectPages().map((page) => (
        <ProjectSheet key={page.slug} page={page} />
      ))}

      <section className="print-break pt-10">
        <Heading eyebrow="Awards" title="수상·선정" />
        <table className="w-full text-left text-sm">
          <tbody>
            {awards.map((a) => (
              <tr key={`${a.year}-${a.contest}`} className="print-block border-t border-hairline">
                <td className={`py-2 pr-4 ${a.highlight ? "font-medium" : ""}`}>{a.award}</td>
                <td className="py-2 pr-4 text-fg-muted">{a.contest}</td>
                <td className="py-2 pr-4 text-fg-subtle">{a.project}</td>
                <td className="py-2 text-xs text-fg-subtle">{a.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-block pt-10">
        <Heading eyebrow="AX-Native" title="AI와 일하는 방식" />
        <p className="text-sm text-fg-muted">{ax.intro}</p>
        <article className="print-block mt-4">
          <h3 className="font-display text-xl font-bold">{ax.tool.name}</h3>
          <p className="mt-1 text-sm text-fg-muted">{ax.tool.summary}</p>
          <p className="mt-2 text-sm">{ax.tool.benchmark}</p>
          <Meta>
            {ax.tool.install} · {ax.tool.tags.join(" · ")}
          </Meta>
          <ul className="mt-2 space-y-1 text-sm">
            {ax.tool.links.map((link) => (
              <li key={link.href}>
                <PrintLink link={link} />
              </li>
            ))}
          </ul>
        </article>
        <p className="mt-5 font-display text-xs font-bold text-fg-subtle">적용 중인 프로젝트</p>
        <ul className="mt-2 space-y-1 text-sm">
          {ax.applied.map((project) => (
            <li key={project.name}>
              <span className="font-medium">{project.name}</span>
              <span className="text-fg-muted"> — {project.summary}</span>
              {project.href && (
                <>
                  {" "}
                  <a href={project.href} className="text-xs text-fg-subtle">
                    {bare(project.href)}
                  </a>
                </>
              )}
            </li>
          ))}
        </ul>
      </section>

    </main>
  );
}
