// Renders /print from the static export (out/) to out/portfolio.pdf with headless Chromium.
// Keep the output name in sync with site.pdf.href in src/lib/site.ts.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const OUT = path.resolve("out");
const PDF = path.join(OUT, "portfolio.pdf");
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".woff2": "font/woff2",
  ".webp": "image/webp",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

async function isFile(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false; // missing candidate — try the next one
  }
}

// Static-export URL rules: /print → print.html, /dir/ → dir/index.html.
async function resolveFile(urlPath) {
  const target = path.join(OUT, decodeURIComponent(urlPath.split("?")[0]));
  if (!target.startsWith(OUT)) return null;
  for (const candidate of [target, `${target}.html`, path.join(target, "index.html")]) {
    if (await isFile(candidate)) return candidate;
  }
  return null;
}

if (!(await isFile(path.join(OUT, "print.html")))) {
  console.error("build-pdf: out/print.html not found — run `pnpm build` first");
  process.exit(1);
}

const server = createServer(async (req, res) => {
  const file = await resolveFile(req.url ?? "/");
  if (!file) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] ?? "application/octet-stream" });
  res.end(await readFile(file));
});
await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.emulateMedia({ colorScheme: "light", media: "print" });
  const response = await page.goto(`http://127.0.0.1:${port}/print`, { waitUntil: "networkidle" });
  if (!response?.ok()) throw new Error(`/print returned HTTP ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.pdf({ path: PDF, printBackground: true, preferCSSPageSize: true });
  const { size } = await stat(PDF);
  if (size < 20_000) throw new Error(`portfolio.pdf is only ${size} bytes`);
  console.log(`build-pdf: wrote ${PDF} (${Math.round(size / 1024)} KB)`);
} finally {
  await browser.close();
  server.close();
}
