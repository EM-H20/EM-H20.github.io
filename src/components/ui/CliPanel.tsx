import type { CliLine } from "@/content/profile";

const PREFIX: Record<CliLine["kind"], string> = { cmd: "$", ok: "✓" };

export function CliPanel({ lines }: { lines: readonly CliLine[] }) {
  return (
    <div className="rounded-card bg-surface p-4 font-mono text-[13px] leading-relaxed text-fg shadow-hairline">
      {lines.map((line, i) => (
        <p key={i} className="flex gap-2">
          <span aria-hidden="true" className={line.kind === "ok" ? "text-accent" : undefined}>
            {PREFIX[line.kind]}
          </span>
          <span>{line.text}</span>
        </p>
      ))}
    </div>
  );
}
