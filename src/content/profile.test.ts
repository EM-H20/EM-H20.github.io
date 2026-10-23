import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { test } from "node:test";
import { allImages, ax, featured, hero, heroInfo, heroStats, howIWork, projectPages, projects, shippedNames } from "./profile.ts";
import { phosphor } from "../components/ui/phosphor.ts";

test("hero stats are derived from awards and shipped apps", () => {
  assert.deepEqual(heroStats(), [
    "수상·선정 10건",
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
const REVIEWED_LATIN = ["Flutter", "UX", "React", "Next.js", "Quest", "First Try", "Retry", "XP", "Log"];

test("every rotating hero word takes the particle 를", () => {
  assert.ok(hero.words.length >= 2, "need at least two words to rotate");
  for (const word of hero.words) {
    assert.ok(takesReul(word), `"${word}를" is ungrammatical`);
    if (!/[가-힣]$/.test(word)) assert.ok(REVIEWED_LATIN.includes(word), `"${word}를" — read it aloud, then add it to REVIEWED_LATIN`);
  }
});

test("hero info lines are derived from profile data", () => {
  assert.deepEqual(heroInfo(), [
    { label: "Motto", value: "고민은 짧게, 행동은 빠르게" },
    { label: "Email", value: "elipair0106@gmail.com" },
    { label: "Education", value: "세종대학교 컴퓨터공학과 · AI Advanced Microdegree" },
    { label: "Certification", value: "SQLD (2026.03 취득)" },
    { label: "Awards", value: "Google I/O Extended 1st Place 외 수상·선정 9건" },
    { label: "Shipped", value: "경찰과도둑 · Block Drag · RuleBook" },
  ]);
});

test("every detail page has a Phosphor fallback for its icon", () => {
  for (const page of projectPages()) assert.ok(page.symbol in phosphor, `${page.name}: ${page.symbol}`);
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

test("Second Brain Template lives in AX-Native, not in the project list", () => {
  assert.equal(ax.tool.name, "Second Brain Template");
  assert.ok(!projects.some((p) => p.name === ax.tool.name), "listed twice");
});

test("AX-Native lists the projects that run a second brain", () => {
  assert.deepEqual(ax.applied.map((a) => a.name), ["경찰과도둑", "캡스톤 Big-Brother", "에브리페스타"]);
});

test("featured project links its official website first", () => {
  assert.deepEqual(featured.links[0], { label: "Website", href: "https://copsandrobbers.app/" });
});

test("RuleBook is described as the attendance/penalty app its code implements", () => {
  assert.match(projects.find((p) => p.slug === "rulebook")?.summary ?? "", /출석/);
});

test("every project, featured included, has a detail page with a unique slug", () => {
  const slugs = projectPages().map((p) => p.slug);
  assert.deepEqual(slugs, [featured.slug, ...projects.map((p) => p.slug), ax.tool.slug, "festa", "big-brother"]);
  assert.equal(new Set(slugs).size, slugs.length);
});

test("every detail page has a written body", () => {
  for (const { slug } of projectPages())
    assert.ok(existsSync(new URL(`./projects/${slug}.mdx`, import.meta.url)), `missing src/content/projects/${slug}.mdx`);
});

test("every gallery image is committed under public/", () => {
  for (const page of projectPages())
    for (const image of [...page.gallery, ...page.photos])
      assert.ok(existsSync(new URL(`../../public${image.src}`, import.meta.url)), image.src);
});

const pageSlugs = () => new Set(projectPages().map((p) => p.slug));
const workNoteIds = (mdx: string) => [...mdx.matchAll(/<WorkNote id="([^"]+)">/g)].map((m) => m[1]);

test("HOW I WORK links only to existing detail pages", () => {
  for (const { slug } of [...howIWork.rows, ...howIWork.breadth]) assert.ok(pageSlugs().has(slug), slug);
});

// All detail pages share one document in the PDF, so ids must not collide with section ids there.
test("HOW I WORK row ids are unique and prefixed", () => {
  const ids = howIWork.rows.map((r) => r.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^work-[a-z-]+$/);
});

test("every HOW I WORK row points at exactly one WorkNote on its project page", () => {
  for (const row of howIWork.rows) {
    const mdx = readFileSync(new URL(`./projects/${row.slug}.mdx`, import.meta.url), "utf8");
    assert.equal(workNoteIds(mdx).filter((id) => id === row.id).length, 1, `${row.slug}.mdx needs <WorkNote id="${row.id}">`);
  }
});

test("every WorkNote on a project page has a HOW I WORK row for that page", () => {
  for (const file of readdirSync(new URL("./projects/", import.meta.url))) {
    const slug = file.replace(/\.mdx$/, "");
    for (const id of workNoteIds(readFileSync(new URL(`./projects/${file}`, import.meta.url), "utf8")))
      assert.ok(howIWork.rows.some((r) => r.id === id && r.slug === slug), `${file}: ${id}`);
  }
});

test("AX-Native team projects link to their detail pages", () => {
  const linked = ax.applied.flatMap((a) => (a.slug ? [a.slug] : []));
  assert.deepEqual(linked, ["big-brother", "festa"]);
  for (const slug of linked) assert.ok(pageSlugs().has(slug), slug);
});
