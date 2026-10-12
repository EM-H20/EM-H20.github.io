import assert from "node:assert/strict";
import { test } from "node:test";
import { DELETE_MS, HOLD_MS, NEXT_MS, type RotState, step, TYPE_MS, visible } from "./rotating.ts";

const s = (word: number, length: number, deleting = false): RotState => ({ word, length, deleting });

test("types one character per step", () => {
  assert.deepEqual(step(["ab"], s(0, 0)), { state: s(0, 1), delay: TYPE_MS });
});

test("holds when the word is complete, then deletes", () => {
  assert.deepEqual(step(["ab"], s(0, 2)), { state: s(0, 2, true), delay: HOLD_MS });
  assert.deepEqual(step(["ab"], s(0, 2, true)), { state: s(0, 1, true), delay: DELETE_MS });
});

test("moves to the next word after deleting, wrapping around", () => {
  assert.deepEqual(step(["ab", "c"], s(0, 0, true)), { state: s(1, 0), delay: NEXT_MS });
  assert.deepEqual(step(["ab", "c"], s(1, 0, true)), { state: s(0, 0), delay: NEXT_MS });
});

test("counts code points, so Hangul and emoji are typed whole", () => {
  assert.equal(visible(["빠른 출시"], s(0, 2)), "빠른");
  assert.deepEqual(step(["😀"], s(0, 0)), { state: s(0, 1), delay: TYPE_MS });
  assert.deepEqual(step(["😀"], s(0, 1)), { state: s(0, 1, true), delay: HOLD_MS });
});

test("a full cycle over all words returns to the start", () => {
  const words = ["Flutter", "UX", "빠른 출시"];
  const start = s(0, 0);
  let state = start;
  let steps = 0;
  do {
    state = step(words, state).state;
    steps++;
  } while (JSON.stringify(state) !== JSON.stringify(start) && steps < 1000);
  // per word: type n, hold 1, delete n, next 1 → 2n + 2
  assert.equal(steps, words.reduce((sum, w) => sum + 2 * Array.from(w).length + 2, 0));
});
