import assert from "node:assert/strict";
import { test } from "node:test";
import { allImages, featured, hero, heroInfo, heroStats, projects, shippedNames } from "./profile.ts";

test("hero stats are derived from awards and shipped apps", () => {
  assert.deepEqual(heroStats(), [
    "수상·선정 9건",
    "스토어 출시 앱 3개",
    "Google I/O Extended 1st Place",
  ]);
});

test("shipped names list the featured app first, then shipped projects", () => {
  assert.deepEqual(shippedNames(), ["경찰과도둑", "Block Drag", "RuleBook"]);
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

// '를' attaches to words whose last syllable has no final consonant; non-Hangul endings (React, UX) read fine.
const takesReul = (word: string) => {
  const code = word.charCodeAt(word.length - 1);
  return code < 0xac00 || code > 0xd7a3 || (code - 0xac00) % 28 === 0;
};

// Latin words can't be checked by code ("Python를" is wrong: 파이썬 ends in a consonant), so each one is
// approved by ear here. Adding a new Latin word fails until someone reads "<word>를" aloud and lists it.
const REVIEWED_LATIN = ["Flutter", "UX", "React", "Next.js"];

test("every rotating hero word takes the particle 를", () => {
  assert.ok(hero.words.length >= 2, "need at least two words to rotate");
  for (const word of hero.words) {
    assert.ok(takesReul(word), `"${word}를" is ungrammatical`);
    if (!/[가-힣]$/.test(word)) assert.ok(REVIEWED_LATIN.includes(word), `"${word}를" — read it aloud, then add it to REVIEWED_LATIN`);
  }
});

test("hero info lines are derived from profile data", () => {
  assert.deepEqual(heroInfo(), [
    { label: "Email", value: "elipair0106@gmail.com" },
    { label: "Education", value: "세종대학교 컴퓨터공학과 · AI Advanced Microdegree" },
    { label: "Certification", value: "SQLD" },
    { label: "Awards", value: "Google I/O Extended 1st Place 외 수상·선정 8건" },
    { label: "Shipped", value: "경찰과도둑 · Block Drag · RuleBook" },
  ]);
});

test("every project has an emoji fallback for its icon", () => {
  for (const item of [featured, ...projects]) assert.ok(item.emoji.length > 0, item.name);
});

test("app icons point at the committed png files", () => {
  const icons = [featured, ...projects].flatMap((p) => (p.icon ? [p.icon.src] : []));
  assert.deepEqual(icons.sort(), [
    "/images/projects/block-drag/icon.png",
    "/images/projects/cops-and-robbers/icon.png",
    "/images/projects/eunsaem/icon.png",
    "/images/projects/nyangseng/icon.png",
    "/images/projects/rulebook/icon.png",
    "/images/projects/space-study-ship/icon.png",
    "/images/projects/tripgether/icon.png",
  ]);
});
