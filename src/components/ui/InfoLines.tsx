import type { InfoLine } from "@/content/profile";

export function InfoLines({ lines, className = "" }: { lines: readonly InfoLine[]; className?: string }) {
  return (
    <dl className={`text-[15px] leading-[1.8] ${className}`}>
      {lines.map((line) => (
        // Inline, so a long value continues after the label and wraps like a sentence.
        <div key={line.label}>
          <dt className="inline font-display font-bold text-fg before:mr-2 before:inline-block before:size-1.5 before:rounded-full before:bg-dot before:align-[2px]">
            {line.label}.
          </dt>{" "}
          <dd className="inline text-fg-subtle">{line.value}</dd>
        </div>
      ))}
    </dl>
  );
}
