import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { Section } from "@/components/ui/Container";
import { Highlight } from "@/components/ui/Highlight";
import { IconCircle } from "@/components/ui/IconCircle";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import { featured, type LinkSpec, type Project, projects } from "@/content/profile";

const EXTERNAL = { target: "_blank", rel: "noreferrer" } as const;
const UNDERLINE = "text-fg underline underline-offset-[3px]";
const DETAIL_LINK = "link-draw";

// Store/GitHub links stay on the row; the project name opens its detail page.
function InlineLinks({ links }: { links: readonly LinkSpec[] }) {
  return links.map((link) => (
    <Fragment key={link.href}>
      {" · "}
      <a href={link.href} {...EXTERNAL} className={UNDERLINE}>
        {link.label}
      </a>
    </Fragment>
  ));
}

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="mr-1.5 inline font-semibold text-fg">{label}</dt>
      <dd className="inline">{children}</dd>
    </div>
  );
}

function TextLinks({ links }: { links: readonly LinkSpec[] }) {
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 text-meta">
      {links.map((link) => (
        <a key={link.href} href={link.href} {...EXTERNAL} className={`inline-flex min-h-10 items-center ${UNDERLINE}`}>
          {link.label}
        </a>
      ))}
    </p>
  );
}

function FeaturedProject() {
  const screens = visibleImages(featured.screens);
  const [event] = visibleImages([featured.event]);
  const [firstAward, ...otherAwards] = featured.badges;
  return (
    <article className="pb-6">
      <div className="flex items-center gap-4">
        <IconCircle icon={featured.icon} emoji={featured.emoji} />
        <div>
          <h3 className="font-display text-title-lg font-bold text-fg">
            <Link href={`/projects/${featured.slug}`} className={DETAIL_LINK}>
              {featured.name}
            </Link>
          </h3>
          <p className="text-meta text-fg-subtle">
            {featured.period} · {featured.platform}
          </p>
        </div>
      </div>
      <p className="mt-4 text-[17px] text-fg">{featured.summary}</p>
      <dl className="mt-3 space-y-1 text-meta text-fg-muted">
        <Detail label="역할">{featured.role}</Detail>
        <Detail label="수상">
          <Highlight>{firstAward}</Highlight> 외 {otherAwards.length}건
        </Detail>
        <Detail label="기능">{featured.features.join(" · ")}</Detail>
      </dl>
      {screens.length > 0 && (
        <ul className="mt-5 flex gap-2.5">
          {screens.map((image) => (
            <li key={image.src} className="w-24">
              <ImageSlot image={image} />
            </li>
          ))}
        </ul>
      )}
      {event && <ImageSlot image={event} className="mt-3 max-w-md" />}
      <TextLinks links={featured.links} />
      <Link href={`/projects/${featured.slug}`} className={`inline-flex min-h-10 items-center text-meta font-semibold ${UNDERLINE}`}>
        자세히 보기 →
      </Link>
    </article>
  );
}

function MajorRow({ project }: { project: Project }) {
  return (
    <li className="flex gap-4 py-2.5">
      <IconCircle icon={project.icon} emoji={project.emoji} />
      <div className="min-w-0 pt-1">
        <h3 className="text-title font-medium text-fg">
          <Link href={`/projects/${project.slug}`} className={DETAIL_LINK}>
            {project.name}
          </Link>
          {project.badges.map((badge) => (
            <span key={badge} className="ml-2 text-[13px] font-normal">
              {/* Store releases read as facts; awards get the highlight. */}
              {project.shipped ? <span className="text-fg-subtle">{badge}</span> : <Highlight>{badge}</Highlight>}
            </span>
          ))}
        </h3>
        <p className="mt-0.5 text-meta text-fg-subtle">
          {project.summary} · {project.stack.join(" · ")} · {project.period}
          <InlineLinks links={project.links} />
        </p>
      </div>
    </li>
  );
}

function MinorRow({ project }: { project: Project }) {
  return (
    <li className="flex items-center gap-3 py-1.5">
      <IconCircle icon={project.icon} emoji={project.emoji} size={40} />
      <p className="min-w-0 text-base font-medium text-fg">
        <Link href={`/projects/${project.slug}`} className={DETAIL_LINK}>
          {project.name}
        </Link>{" "}
        <span className="text-meta font-normal text-fg-subtle">
          {project.summary} · {project.period}
        </span>
      </p>
    </li>
  );
}

export function Projects() {
  return (
    <Section id="projects" chip="PROJECTS">
      <FeaturedProject />
      <ul>
        {projects
          .filter((p) => p.tier === 2)
          .map((project) => (
            <MajorRow key={project.slug} project={project} />
          ))}
      </ul>
      <ul className="mt-6">
        {projects
          .filter((p) => p.tier === 3)
          .map((project) => (
            <MinorRow key={project.slug} project={project} />
          ))}
      </ul>
    </Section>
  );
}
