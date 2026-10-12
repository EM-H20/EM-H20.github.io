"use client";

import { useEffect, useRef } from "react";
import { HOLD_MS, type RotState, step, visible } from "@/lib/rotating";

// Updates its text node through a ref instead of React state: the repo's lint forbids setState in
// effects, and re-rendering every 50ms buys nothing. The server renders the first word complete.
export function RotatingWord({ words }: { words: readonly string[] }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || words.length < 2 || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let state: RotState = { word: 0, length: Array.from(words[0]).length, deleting: false };
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = () => {
      const next = step(words, state);
      state = next.state;
      el.textContent = visible(words, state);
      timer = setTimeout(tick, next.delay);
    };
    // Pause in background tabs; resume from the current state when visible again.
    const onVisibility = () => {
      clearTimeout(timer);
      if (!document.hidden) timer = setTimeout(tick, HOLD_MS);
    };
    timer = setTimeout(tick, HOLD_MS);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [words]);

  return (
    <>
      <span ref={ref} className="rw-word">
        {words[0]}
      </span>
      <span aria-hidden="true" className="rw-caret" />
    </>
  );
}
