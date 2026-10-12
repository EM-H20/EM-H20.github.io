import type { ReactNode } from "react";
import { Chip } from "@/components/ui/Chip";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-5 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({ id, chip, children }: { id: string; chip: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 pb-7">
      {/* The divider sits inside the gutter, not edge to edge; 28px on each side of it. */}
      <Container>
        <div className="border-t border-hairline pt-7">
          <Chip id={`${id}-title`}>{chip}</Chip>
          <div className="mt-5">{children}</div>
        </div>
      </Container>
    </section>
  );
}
