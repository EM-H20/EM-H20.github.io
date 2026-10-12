import { Typewriter } from "@/components/ui/Typewriter";
import type { CliLine } from "@/content/profile";

const PREFIX: Record<CliLine["kind"], string> = { cmd: "$", ok: "✓" };

// Without `starts`, lines render statically.
export function CliPanel({ lines, starts }: { lines: readonly CliLine[]; starts?: readonly number[] }) {
  return (
    <div className="rounded-card bg-surface p-4 font-mono text-[13px] leading-relaxed text-fg shadow-hairline">
      {lines.map((line, i) => {
        const start = starts?.[i];
        const typed = start !== undefined;
        return (
          <p key={i} className="flex gap-2">
            <span
              aria-hidden="true"
              className={`${line.kind === "ok" ? "text-accent" : ""} ${typed ? "type-char" : ""}`}
              style={typed ? { animationDelay: `${start}ms` } : undefined}
            >
              {PREFIX[line.kind]}
            </span>
            {typed ? (
              // Screen readers get the line once; the per-character spans are visual only.
              <span>
                <span className="sr-only">{line.text}</span>
                <span aria-hidden="true">
                  <Typewriter text={line.text} start={start} />
                </span>
              </span>
            ) : (
              <span>{line.text}</span>
            )}
          </p>
        );
      })}
    </div>
  );
}
