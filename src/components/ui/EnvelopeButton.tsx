import type { ReactNode } from "react";

// On hover or keyboard focus the button opens like an envelope: the flap swings up and the button's
// face rises out of it as a sheet of letter paper (see .env in globals.css). Touch screens just get
// the button. Every part sits inside the link, so the whole envelope stays clickable.
export function EnvelopeButton({
  href,
  download,
  tone = "primary",
  letter,
  children,
}: {
  href: string;
  download?: string;
  tone?: "primary" | "ghost";
  // First line written on the letter paper; must fit the button's width.
  letter: string;
  children: ReactNode;
}) {
  return (
    <a href={href} download={download} className={`env env-${tone} font-display text-sm font-bold`}>
      <svg aria-hidden="true" viewBox="0 0 100 20" preserveAspectRatio="none" className="env-flap">
        <path d="M0 20 L50 1 L100 20" />
      </svg>
      <span aria-hidden="true" className="env-back" />
      <span className="env-letter">
        <span className="env-label">{children}</span>
        <span aria-hidden="true" className="env-paper">
          {letter}
        </span>
      </span>
      <svg aria-hidden="true" viewBox="0 0 100 44" preserveAspectRatio="none" className="env-pocket">
        <path d="M0 14 L50 30 L100 14 L100 44 L0 44 Z" />
        <path d="M0 14 L50 30 L100 14" className="env-fold" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
      </svg>
    </a>
  );
}
