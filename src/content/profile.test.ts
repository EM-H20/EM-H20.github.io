import assert from "node:assert/strict";
import { test } from "node:test";
import { allImages, cliLines, heroStats, projects } from "./profile.ts";

test("hero stats are derived from awards and shipped apps", () => {
  assert.deepEqual(heroStats(), [
    "수상·선정 9건",
    "스토어 출시 앱 3개",
    "Google I/O Extended 1st Place",
  ]);
});

test("CLI shipped line lists the featured app first, then shipped projects", () => {
  assert.deepEqual(cliLines().at(-1), {
    kind: "ok",
    text: "경찰과도둑 · Block Drag · RuleBook",
  });
});

test("project slugs are unique", () => {
  const slugs = projects.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every image has a documented path under /images/ and a brief", () => {
  const images = allImages();
  assert.ok(images.length >= 14, `only ${images.length} images`);
  for (const image of images) {
    assert.match(image.src, /^\/images\/[a-z0-9/-]+\.(webp|png|jpg)$/, image.src);
    assert.ok(image.brief.length > 0, `${image.src} has no brief`);
    assert.ok(image.alt.length > 0, `${image.src} has no alt`);
  }
  assert.equal(new Set(images.map((i) => i.src)).size, images.length, "duplicate image paths");
});
