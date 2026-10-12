import type { MDXComponents } from "mdx/types";

// Required by @next/mdx in the App Router. Maps markdown elements to token-styled elements.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-12 mb-4 text-heading font-book text-fg" {...props} />,
  h3: (props) => <h3 className="mt-8 mb-3 text-xl font-medium text-fg" {...props} />,
  p: (props) => <p className="my-4 text-body text-fg-muted" {...props} />,
  a: (props) => <a className="text-accent underline underline-offset-4" {...props} />,
  ul: (props) => <ul className="my-4 list-disc space-y-1 pl-6 text-fg-muted" {...props} />,
  ol: (props) => <ol className="my-4 list-decimal space-y-1 pl-6 text-fg-muted" {...props} />,
  blockquote: (props) => <blockquote className="my-6 border-l-2 border-hairline pl-4 text-fg-subtle" {...props} />,
  pre: (props) => (
    <pre className="my-6 overflow-x-auto rounded-card bg-surface p-4 font-mono text-[13px] shadow-hairline" {...props} />
  ),
  code: (props) => <code className="font-mono text-[0.9em] text-fg" {...props} />,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
