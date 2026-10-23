import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { Children, isValidElement, type ReactNode } from "react";
import { WorkNote } from "@/components/ui/WorkNote";

// "- **상황**: text" → the short bold label moves to a quiet left column, so the heading above stays
// the one bold line. Longer bold leads ("- **앱 구조 설계** — …") stay ordinary bullets.
function splitLabel(children: ReactNode): [string, ReactNode[]] | null {
  const [first, second, ...rest] = Children.toArray(children);
  if (!isValidElement<{ children?: ReactNode }>(first) || first.type !== "strong") return null;
  const label = first.props.children;
  if (typeof label !== "string" || label.length > 3 || typeof second !== "string" || !second.startsWith(": ")) return null;
  return [label, [second.slice(2), ...rest]];
}

const isLabeledList = (children: ReactNode) =>
  Children.toArray(children)
    .filter(isValidElement<{ children?: ReactNode }>)
    .every((li) => splitLabel(li.props.children));

// Required by @next/mdx in the App Router. Maps markdown elements to token-styled elements.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 font-display text-[22px] font-bold text-fg" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-title font-semibold text-fg" {...props} />,
  p: (props) => <p className="my-4 text-body text-fg-muted" {...props} />,
  a: (props) => <a className="text-fg underline decoration-dot decoration-2 underline-offset-4" {...props} />,
  ul: ({ children, ...props }) => (
    <ul {...props} className={isLabeledList(children) ? "my-4 space-y-2 text-fg-muted" : "my-4 list-disc space-y-1 pl-6 text-fg-muted"}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }) => {
    const split = splitLabel(children);
    if (!split) return <li {...props}>{children}</li>;
    return (
      <li {...props} className="relative pl-12">
        <span className="absolute left-0 text-fg-subtle">{split[0]}</span>
        {split[1]}
      </li>
    );
  },
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6 text-fg-muted" {...props} />,
  blockquote: (props) => <blockquote className="my-6 border-l-2 border-hairline pl-4 text-fg-subtle" {...props} />,
  pre: (props) => <pre className="my-6 overflow-x-auto rounded-btn bg-surface p-4 font-mono text-[13px]" {...props} />,
  code: (props) => <code className="font-mono text-[0.9em] text-fg" {...props} />,
  WorkNote,
  // A photo inside the story (not a screenshot): <Photo src="/images/…" alt="…" width={800} height={1048} caption="…" />
  Photo: ({ caption, alt, ...image }: { src: string; alt: string; width: number; height: number; caption?: string }) => (
    // Portrait photos stay phone-sized; landscape ones take the column.
    <figure className={`print-block my-6 ${image.width > image.height ? "" : "max-w-sm"}`}>
      <Image {...image} alt={alt} sizes="(min-width: 768px) 720px, 100vw" className="w-full rounded-xl" />
      {caption && <figcaption className="mt-2 text-meta text-fg-subtle">{caption}</figcaption>}
    </figure>
  ),
  // A YouTube video played in place. Paper can't play it, so the PDF shows the link instead.
  YouTube: ({ id, title }: { id: string; title: string }) => (
    <figure className="my-6">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="encrypted-media; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className="aspect-video w-full rounded-xl print:hidden"
      />
      <figcaption className="mt-2 text-meta text-fg-subtle">
        <a href={`https://www.youtube.com/watch?v=${id}`} className="link-draw">
          {title}
        </a>
      </figcaption>
    </figure>
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
