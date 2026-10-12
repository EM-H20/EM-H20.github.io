// Hero typing timeline: texts type one after another with a short pause between them.
export const CHAR_MS = 35;
export const GAP_MS = 120;

const length = (text: string) => Array.from(text).length;

export function schedule(texts: readonly string[]): number[] {
  const starts: number[] = [];
  let t = 0;
  for (const text of texts) {
    starts.push(t);
    t += length(text) * CHAR_MS + GAP_MS;
  }
  return starts;
}

export function totalDuration(texts: readonly string[]): number {
  if (texts.length === 0) return 0;
  return texts.reduce((t, text) => t + length(text) * CHAR_MS, 0) + GAP_MS * (texts.length - 1);
}
