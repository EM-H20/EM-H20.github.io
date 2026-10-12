import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import {
  awards,
  education,
  featured,
  hero,
  heroStats,
  links,
  type LinkSpec,
  profilePhoto,
  type Project,
  projects,
  stack,
} from "@/content/profile";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Portfolio PDF", robots: { index: false } };

const bare = (href: string) => href.replace(/^mailto:/, "").replace(/^https?:\/\//, "").replace(/\/$/, "");

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
      <p className="mb-2 font-mono text-eyebrow text-fg uppercase">{eyebrow}</p>
      <h2 className="mb-6 text-heading font-book">{title}</h2>
    </>
  );
}

function Meta({ children }: { children: ReactNode }) {
  return <p className="font-mono text-[10px] tracking-[0.071em] text-fg-subtle uppercase">{children}</p>;
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="inline font-medium">{label} </dt>
      <dd className="inline text-fg-muted">{children}</dd>
    </div>
  );
}

function MajorBlock({ project }: { project: Project }) {
  const images = visibleImages(project.images);
  return (
    <article className="print-block border-t border-hairline py-6">
      <h3 className="text-xl font-medium">{project.name}</h3>
      <Meta>
        {project.period} · {project.stack.join(" · ")}
      </Meta>
      {project.badges.length > 0 && <p className="mt-2 text-sm font-medium">{project.badges.join(" · ")}</p>}
      <p className="mt-2 text-sm text-fg-muted">{project.summary}</p>
      {images.length > 0 && (
        <div className="mt-4 flex gap-3">
          {images.map((image) => (
            <ImageSlot key={image.src} image={image} eager className={image.aspect === "phone" ? "w-28" : "w-72"} />
          ))}
        </div>
      )}
      <ul className="mt-3 space-y-1 text-sm">
        {project.links.map((link) => (
          <li key={link.href}>
            <PrintLink link={link} />
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function PrintPage() {
  const [photo] = visibleImages([profilePhoto]);
  const screens = visibleImages(featured.screens);
  const [event] = visibleImages([featured.event]);
  const major = projects.filter((p) => p.tier === 2);
  const minor = projects.filter((p) => p.tier === 3);
  return (
    <main className="scheme-light mx-auto w-full max-w-[178mm] bg-canvas text-fg">
      <section className="flex gap-8 pt-6">
        <div className="flex-1">
          <p className="font-mono text-eyebrow uppercase">{hero.eyebrow}</p>
          <h1 className="mt-3 text-[48px] leading-none font-book tracking-[-0.06em]">
            {hero.name} <span className="text-fg-subtle">{hero.alias}</span>
          </h1>
          <p className="mt-4 text-body text-fg-muted">{hero.intro}</p>
          <p className="mt-3 font-mono text-caption text-fg-subtle">{heroStats().join(" · ")}</p>
          <dl className="mt-8 space-y-2 text-sm">
            <div>
              <dt className="inline font-mono text-eyebrow text-fg-subtle uppercase">Education </dt>
              <dd className="inline">
                {education.school} · {education.extras.join(" · ")}
              </dd>
            </div>
            <div>
              <dt className="inline font-mono text-eyebrow text-fg-subtle uppercase">Certification </dt>
              <dd className="inline">{education.certifications.join(" · ")}</dd>
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

      <section className="print-break pt-10">
        <Heading eyebrow="Featured Project" title={featured.name} />
        <Meta>
          {featured.period} · {featured.platform}
        </Meta>
        <p className="mt-3 text-body">{featured.summary}</p>
        <p className="mt-2 text-sm text-fg-muted">{featured.description}</p>
        <dl className="mt-6 space-y-2 text-sm">
          <Detail label="담당 역할">{featured.role}</Detail>
          <Detail label="핵심 기능">{featured.features.join(" · ")}</Detail>
          <Detail label="기술">{featured.stack.join(" · ")}</Detail>
          <Detail label="수상">{featured.badges.join(" · ")}</Detail>
          <Detail label="행사 참가">{featured.events.join(" · ")}</Detail>
        </dl>
        {screens.length > 0 && (
          <div className="mt-6 flex gap-3">
            {screens.map((image) => (
              <ImageSlot key={image.src} image={image} eager className="w-36" />
            ))}
          </div>
        )}
        {event && <ImageSlot image={event} eager className="mt-4 w-full" />}
        <ul className="mt-6 space-y-1 text-sm">
          {featured.links.map((link) => (
            <li key={link.href}>
              <PrintLink link={link} />
            </li>
          ))}
        </ul>
      </section>

      <section className="print-break pt-10">
        <Heading eyebrow="Projects" title="주요 프로젝트" />
        {major.map((project) => (
          <MajorBlock key={project.slug} project={project} />
        ))}
      </section>

      <section className="print-block pt-10">
        <Heading eyebrow="More" title="기타 프로젝트" />
        <ul className="space-y-3 text-sm">
          {minor.map((project) => (
            <li key={project.slug} className="print-block">
              <span className="font-medium">{project.name}</span>
              <span className="text-fg-muted"> — {project.summary}</span>
              <Meta>
                {project.period} · {project.stack.join(" · ")}
              </Meta>
              <p className="text-xs text-fg-subtle">{project.links.map((l) => bare(l.href)).join(" · ")}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="print-break pt-10">
        <Heading eyebrow="Awards" title="수상·선정" />
        <table className="w-full text-left text-sm">
          <tbody>
            {awards.map((a) => (
              <tr key={`${a.year}-${a.contest}`} className="print-block border-t border-hairline">
                <td className={`py-2 pr-4 ${a.highlight ? "font-medium" : ""}`}>{a.award}</td>
                <td className="py-2 pr-4 text-fg-muted">{a.contest}</td>
                <td className="py-2 pr-4 text-fg-subtle">{a.project}</td>
                <td className="py-2 font-mono text-[11px] text-fg-subtle">{a.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="print-block pt-10">
        <Heading eyebrow="Tech Stack" title="기술 스택" />
        <dl className="space-y-2 text-sm">
          {stack.map((group) => (
            <div key={group.group}>
              <dt className="inline font-mono text-eyebrow text-fg-subtle uppercase">{group.group} </dt>
              <dd className="inline">{group.items.join(" · ")}</dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}
