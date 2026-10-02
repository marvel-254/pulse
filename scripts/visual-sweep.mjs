/**
 * Dev-only visual sweep: renders every Pulse view and reports any element
 * that overflows the viewport or any inline icon that renders oversized.
 * Not shipped.
 *
 *   node scripts/visual-sweep.mjs [--port 8000] [--out /tmp/shots]
 */
/**
 * Requires a headless browser, which is deliberately NOT a project dependency
 * (CI does not run this script, and a 60 MB download on every CI run is waste):
 *
 *   npm i -D playwright-core @sparticuz/chromium
 *
 * On a glibc host the bundled build also needs its AL2023 NSS libraries:
 *
 *   node -e "const z=require('zlib'),f=require('fs');f.writeFileSync('/tmp/al2023.tar',z.brotliDecompressSync(f.readFileSync('node_modules/@sparticuz/chromium/bin/al2023.tar.br')))"
 *   mkdir -p /tmp/al2023 && tar -xf /tmp/al2023.tar -C /tmp/al2023
 */
try {
  await import("playwright-core");
  await import("@sparticuz/chromium");
} catch (err) {
  console.error(
    "\nThis script needs a headless browser, which is not a project dependency.\n" +
      "Install it with:\n\n  npm i -D playwright-core @sparticuz/chromium\n"
  );
  process.exit(1);
}

import { chromium as pw } from "playwright-core";
import { mkdirSync } from "node:fs";

const chromiumPkg = await import("@sparticuz/chromium");
const chrome = chromiumPkg.default ?? chromiumPkg;

const args = process.argv.slice(2);
const flag = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i === -1 ? d : args[i + 1];
};
const port = flag("port", "8000");
const outDir = flag("out", "/tmp/shots");
mkdirSync(outDir, { recursive: true });

const VIEWS = ["overview", "highlights", "numbers", "activity", "projects", "craft", "about"];
const THEMES = ["light", "dark"];
const SIZES = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];

const exe = await chrome.executablePath();
const libDir = process.env.PULSE_CHROMIUM_LIBS || "/tmp/al2023/lib";
const browser = await pw.launch({
  executablePath: exe,
  // --single-process is fine for a Lambda, fatal for a normal session.
  args: [...chrome.args.filter((a) => a !== "--single-process"), "--no-sandbox", "--disable-dev-shm-usage"],
  headless: true,
  env: { ...process.env, LD_LIBRARY_PATH: `${libDir}:${process.env.LD_LIBRARY_PATH || ""}` },
});

const problems = [];

for (const size of SIZES) {
  for (const theme of THEMES) {
  for (const view of VIEWS) {
    const context = await browser.newContext({
      viewport: { width: size.width, height: size.height },
      deviceScaleFactor: 1,
    });
    await context.addInitScript((t) => {
      try { localStorage.setItem("pulse-theme", t); } catch (e) {}
    }, theme);
    const page = await context.newPage();
    const tag = `${size.name}-${theme}-${view}`;
    page.on("pageerror", (e) => problems.push(`[${tag}] pageerror: ${e.message}`));
    try {
      await page.goto(`http://127.0.0.1:${port}/#/${view}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });
      await page.waitForSelector(".stage .section-head", { timeout: 15000 }).catch(() => {});
      await page.waitForTimeout(1500);

      // --- oversized inline icons ---
      const bigIcons = await page.$$eval("svg", (els) =>
        els
          .map((e) => {
            const r = e.getBoundingClientRect();
            return {
              w: Math.round(r.width),
              h: Math.round(r.height),
              cls: (e.parentElement?.className || "").toString().slice(0, 40),
            };
          })
          .filter((x) => x.w > 72 || x.h > 72)
      );
      bigIcons.forEach((b) =>
        problems.push(`[${tag}] oversized svg ${b.w}x${b.h} in .${b.cls}`)
      );

      // --- horizontal overflow ---
      const overflow = await page.evaluate(() => {
        const docW = document.documentElement.clientWidth;
        const bad = [];
        // Content inside a clipped ancestor (the marquee, scroll rails) is
        // meant to extend past the viewport — ignore it.
        const isClipped = (el) => {
          for (let p = el.parentElement; p && p !== document.documentElement; p = p.parentElement) {
            const ov = getComputedStyle(p).overflowX;
            if (ov === "hidden" || ov === "auto" || ov === "scroll") return true;
          }
          return false;
        };
        document.querySelectorAll(".stage *, .topbar *, .sidebar *, .mobilenav *").forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (isClipped(el)) return;
          if (r.right > docW + 2 || r.left < -2) {
            bad.push(
              `${el.tagName.toLowerCase()}.${(el.className || "").toString().split(" ")[0]} ` +
              `[${Math.round(r.left)}..${Math.round(r.right)}] vs ${docW}`
            );
          }
        });
        return [...new Set(bad)].slice(0, 6);
      });
      overflow.forEach((o) => problems.push(`[${tag}] overflow: ${o}`));

      const scrollW = await page.evaluate(() => document.documentElement.scrollWidth);
      if (scrollW > size.width + 2)
        problems.push(`[${tag}] page scrollWidth ${scrollW} > ${size.width}`);

      const offsets = size.name === "desktop" ? [0, 1000, 2200] : [0, 900];
      for (let i = 0; i < offsets.length; i++) {
        await page.evaluate((y) => window.scrollTo(0, y), offsets[i]);
        await page.waitForTimeout(400);
        await page.screenshot({
          path: `${outDir}/${tag}-${i}.png`,
          animations: "disabled",
          timeout: 60000,
        });
      }
    } catch (err) {
      problems.push(`[${tag}] FAILED: ${err.message.split("\n")[0]}`);
    }
    await page.close();
  }
  }
}

await browser.close();

console.log(`sweep complete → ${outDir}`);
if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  problems.forEach((p) => console.log("  • " + p));
} else {
  console.log("no oversized icons or overflow detected");
}
