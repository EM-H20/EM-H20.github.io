// Hero word loop: type → hold → delete → pause → next word. Pure, so it is testable without a DOM.
export const TYPE_MS = 110;
export const DELETE_MS = 50;
export const HOLD_MS = 1400;
export const NEXT_MS = 300;

export type RotState = { word: number; length: number; deleting: boolean };

const chars = (word: string) => Array.from(word);

/** Advances one step and returns how long the new state should stay on screen. */
export function step(words: readonly string[], state: RotState): { state: RotState; delay: number } {
  const full = chars(words[state.word]).length;
  if (!state.deleting && state.length < full) return { state: { ...state, length: state.length + 1 }, delay: TYPE_MS };
  if (!state.deleting) return { state: { ...state, deleting: true }, delay: HOLD_MS };
  if (state.length > 0) return { state: { ...state, length: state.length - 1 }, delay: DELETE_MS };
  return { state: { word: (state.word + 1) % words.length, length: 0, deleting: false }, delay: NEXT_MS };
}

export function visible(words: readonly string[], state: RotState): string {
  return chars(words[state.word]).slice(0, state.length).join("");
}
