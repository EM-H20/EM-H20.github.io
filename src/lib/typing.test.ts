import assert from "node:assert/strict";
import { test } from "node:test";
import { cliLines, hero } from "../content/profile.ts";
import { CHAR_MS, GAP_MS, schedule, totalDuration } from "./typing.ts";

test("each text starts after the previous one finishes plus a gap", () => {
  assert.deepEqual(schedule(["ab", "가나다", "x"]), [0, 2 * CHAR_MS + GAP_MS, 5 * CHAR_MS + 2 * GAP_MS]);
});

test("length counts code points, not UTF-16 units", () => {
  assert.deepEqual(schedule(["😀", "a"]), [0, CHAR_MS + GAP_MS]);
});

test("empty input yields an empty schedule and zero duration", () => {
  assert.deepEqual(schedule([]), []);
  assert.equal(totalDuration([]), 0);
});

test("single text has no gap", () => {
  assert.equal(totalDuration(["abc"]), 3 * CHAR_MS);
});

test("hero typing finishes within 3 seconds", () => {
  const ms = totalDuration([hero.name, ...cliLines().map((l) => l.text)]);
  assert.ok(ms <= 3000, `hero typing takes ${ms}ms`);
});
