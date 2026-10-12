import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Section } from "@/components/ui/Container";
import { ImageSlot, visibleImages } from "@/components/ui/ImageSlot";
import { TagList } from "@/components/ui/Tag";
import { type Project, projects } from "@/content/profile";

function Links({ project }: { project: Project }) {
  return (
    <div className="mt-auto flex flex-wrap gap-2 pt-6">
      {project.links.map((link) => (
        <Button key={link.href} href={link.href} variant="ghost">
          {link.label}
        </Button>
      ))}
    </div>
  );
}

function MajorProject({ project }: { project: Project }) {
  const [image] = visibleImages(project.images);
  const [icon] = project.icon ? visibleImages([project.icon]) : [];
  return (
    <Card size="md" className="flex h-full flex-col gap-6 sm:flex-row">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-3">
          {icon && <ImageSlot image={icon} className="size-10 shrink-0" />}
          <h3 className="text-heading font-book text-fg">{project.name}</h3>
        </div>
        <TagList items={project.badges} tone="award" className="mt-4" />
        <p className="mt-4 text-body text-fg-muted">{project.summary}</p>
        <TagList items={[...project.stack, project.period]} className="mt-4" />
        <Links project={project} />
      </div>
      {image && (
        <ImageSlot
          image={image}
          className={`w-full shrink-0 self-center sm:self-start ${image.aspect === "phone" ? "max-w-40" : "sm:max-w-56"}`}
        />
      )}
    </Card>
  );
}

function MinorProject({ project }: { project: Project }) {
  return (
    <Card className="flex h-full flex-col">
      <h3 className="text-xl font-medium text-fg">{project.name}</h3>
      <p className="mt-2 text-sm text-fg-muted">{project.summary}</p>
      <TagList items={[...project.stack, project.period]} className="mt-4" />
      <Links project={project} />
    </Card>
  );
}

export function Projects() {
  const major = projects.filter((p) => p.tier === 2);
  const minor = projects.filter((p) => p.tier === 3);
  return (
    <Section id="projects" eyebrow="Projects" title="프로젝트">
      <ul className="grid gap-6 md:grid-cols-2">
        {major.map((project) => (
          <li key={project.slug}>
            <MajorProject project={project} />
          </li>
        ))}
      </ul>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {minor.map((project) => (
          <li key={project.slug}>
            <MinorProject project={project} />
          </li>
        ))}
      </ul>
    </Section>
  );
}
