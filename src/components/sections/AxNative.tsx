import { Section } from "@/components/ui/Container";
import { IconCircle } from "@/components/ui/IconCircle";
import { ax } from "@/content/profile";

export function AxNative() {
  const { tool } = ax;
  return (
    <Section id="ax" chip="AX-NATIVE">
      <p className="text-body text-fg-muted">{ax.intro}</p>

      <article className="mt-6 flex gap-4">
        <IconCircle emoji={tool.emoji} />
        <div className="min-w-0 pt-1">
          <h3 className="text-title font-medium text-fg">
            <a href={tool.links[0].href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
              {tool.name}
            </a>
          </h3>
          <p className="mt-1 text-body text-fg-muted">{tool.summary}</p>
          <p className="mt-2 text-body text-fg">{tool.benchmark}</p>
          <code className="mt-3 inline-block rounded-btn bg-surface px-3 py-1.5 font-mono text-[13px] break-all text-fg">
            {tool.install}
          </code>
          <p className="mt-2 text-meta text-fg-subtle">{tool.tags.join(" · ")}</p>
        </div>
      </article>

      <h3 className="mt-8 font-display font-bold text-fg">적용 중인 프로젝트</h3>
      <ul className="mt-3">
        {ax.applied.map((project) => (
          <li key={project.name} className="flex items-center gap-3 py-1.5">
            <IconCircle icon={project.icon} emoji={project.emoji} size={40} />
            <p className="min-w-0 text-base font-medium text-fg">
              {project.href ? (
                <a href={project.href} target="_blank" rel="noreferrer" className="underline-offset-4 hover:underline">
                  {project.name}
                </a>
              ) : (
                project.name
              )}{" "}
              <span className="text-meta font-normal text-fg-subtle">
                {project.summary}
                {project.privateRepo && " · 비공개 저장소"}
              </span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
