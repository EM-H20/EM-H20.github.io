import { CHAR_MS } from "@/lib/typing";

// Pure CSS: all characters are server-rendered (so crawlers, print and no-JS see full text);
// each becomes visible at its own animation-delay. globals.css disables this for reduced motion and print.
export function Typewriter({ text, start = 0 }: { text: string; start?: number }) {
  const chars = Array.from(text);
  const end = start + chars.length * CHAR_MS;
  return (
    <>
      {chars.map((char, i) => (
        <span key={i} className="type-char" style={{ animationDelay: `${start + i * CHAR_MS}ms` }}>
          {char}
        </span>
      ))}
      <span aria-hidden="true" className="type-caret" style={{ animationDelay: `${start}ms, ${end}ms` }}>
        <span>▍</span>
      </span>
    </>
  );
}
