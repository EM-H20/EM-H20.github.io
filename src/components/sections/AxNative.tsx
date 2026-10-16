import Link from "next/link";
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
            <Link href={`/projects/${tool.slug}`} className="link-draw">
              {tool.name}
            </Link>
          </h3>
          <p className="mt-1 text-body text-fg-muted">{tool.summary}</p>
          <p className="mt-4 text-meta text-fg-subtle">{tool.benchmark.caption}</p>
          <dl className="mt-2 grid gap-2 sm:grid-cols-3">
            {tool.benchmark.stats.map((stat) => (
              <div key={stat.label} className="rounded-btn bg-surface px-3 py-2.5">
                <dt className="text-meta text-fg-muted">{stat.label}</dt>
                <dd className="mt-0.5 text-fg">
                  <span className="text-meta text-fg-subtle">{stat.before}</span>
                  <span className="mx-1.5 text-fg-subtle">→</span>
                  <span className="text-title-lg font-bold">{stat.after}</span>
                </dd>
              </div>
            ))}
          </dl>
          <Link href={`/projects/${tool.slug}`} className="mt-2 inline-flex min-h-10 items-center text-meta text-fg-subtle link-draw">
            벤치마크를 어떻게 했는지 보기 →
          </Link>
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
              {project.slug ? (
                <Link href={`/projects/${project.slug}`} className="link-draw">
                  {project.name}
                </Link>
              ) : project.href ? (
                <a href={project.href} target="_blank" rel="noreferrer" className="link-draw">
                  {project.name}
                </a>
              ) : (
                project.name
              )}{" "}
              <span className="text-meta font-normal text-fg-subtle">{project.summary}</span>
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
