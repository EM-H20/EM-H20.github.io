import type { ReactNode } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-4 sm:px-6 lg:px-12 ${className}`}>{children}</div>;
}

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-24 md:py-32">
      <Container>
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 id={`${id}-title`} className="text-heading font-book text-fg">
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </Container>
    </section>
  );
}
