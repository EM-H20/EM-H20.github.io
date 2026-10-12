import type { ReactNode } from "react";
import { Chip } from "@/components/ui/Chip";

export function Container({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`mx-auto w-full max-w-page px-5 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({ id, chip, children }: { id: string; chip: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-20 py-12">
      <Container>
        <Chip id={`${id}-title`}>{chip}</Chip>
        <div className="mt-6">{children}</div>
      </Container>
    </section>
  );
}
