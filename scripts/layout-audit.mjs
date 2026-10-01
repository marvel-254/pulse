/**
 * Pulse layout audit (dev-only).
 *
 * Without a browser in the build environment, this statically checks the CSS
 * and markup for the classic causes of mobile layout breakage:
 *
 *   • fixed widths / min-widths wider than a 320px phone
 *   • grid tracks with minimums that cannot shrink (minmax(300px, 1fr)…)
 *   • `white-space: nowrap` without a scrollable ancestor
 *   • vh-based heights that fight mobile browser chrome
 *   • missing breakpoints for the elements the app renders
 *
 *   node scripts/layout-audit.mjs
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SMALLEST_PHONE = 320;
const ISSUES = [];
const NOTES = [];

const css = readFileSync("css/styles.css", "utf8");
const jsFiles = readdirSync("js").filter((f) => f.endsWith(".js"));
const js = jsFiles.map((f) => readFileSync(join("js", f), "utf8")).join("\n");

/* ---- 1. fixed widths that exceed the smallest phone ---- */
const widthRe = /(^|[\s;{])((?:min-|max-)?width)\s*:\s*(\d+)px/g;
let m;
let insideQuery = 0;
const lines = css.split("\n");
for (const [i, line] of lines.entries()) {
  if (/@media/.test(line)) insideQuery++;
  const inMobileQuery = /@media[^{]*max-width/.test(line);
  widthRe.lastIndex = 0;
  while ((m = widthRe.exec(line))) {
    const prop = m[2];
    const value = Number(m[3]);
    if (value > SMALLEST_PHONE && prop !== "max-width" && !inMobileQuery) {
      // ignore decorative, non-layout properties
      if (/border|outline|letter-spacing|font-size|padding|margin|gap|height/.test(line)) continue;
      ISSUES.push(`css/styles.css:${i + 1} — ${prop}: ${value}px can overflow a ${SMALLEST_PHONE}px phone → ${line.trim().slice(0, 90)}`);
    }
  }
}

/* ---- 2. grid templates whose minimums cannot shrink ---- */
const gridRe = /grid-template-columns\s*:\s*([^;]+);/g;
while ((m = gridRe.exec(css))) {
  const value = m[1];
  const mins = [...value.matchAll(/minmax\(\s*(\d+)px/g)].map((x) => Number(x[1]));
  const fixed = [...value.matchAll(/(?<!max\()\s(\d{3,})px/g)].map((x) => Number(x[1]));
  const bad = [...mins, ...fixed].filter((v) => v > 220);
  if (bad.length && !/minmax\(0/.test(value)) {
    const idx = css.slice(0, m.index).split("\n").length;
    NOTES.push(`css/styles.css:${idx} — grid min ${bad.join("px/")}px: ${value.trim().slice(0, 70)} (verify it collapses ≤ 640px)`);
  }
}

/* ---- 3. nowrap without a scroll container nearby ---- */
lines.forEach((line, i) => {
  if (/white-space:\s*nowrap/.test(line)) {
    const context = lines.slice(Math.max(0, i - 12), i + 4).join(" ");
    if (!/overflow-x\s*:\s*auto|text-overflow|min-width:\s*0/.test(context)) {
      NOTES.push(`css/styles.css:${i + 1} — nowrap without overflow-x/text-overflow nearby: ${line.trim().slice(0, 70)}`);
    }
  }
});

/* ---- 4. vh heights (mobile URL bar) ---- */
lines.forEach((line, i) => {
  const mm = line.match(/max-height:\s*(\d+)vh/);
  if (!mm || Number(mm[1]) <= 88) return;
  // a following dvh declaration is the modern fix for mobile browser chrome
  if (/dvh/.test(lines[i + 1] || "")) return;
  NOTES.push(`css/styles.css:${i + 1} — ${mm[0]} can collide with mobile browser chrome (no dvh fallback)`);
});

/* ---- 5. required breakpoints exist ---- */
for (const bp of ["980", "720", "640", "520", "420", "380", "360"]) {
  if (!new RegExp(`max-width:\\s*${bp}px`).test(css)) {
    ISSUES.push(`css/styles.css — missing a ${bp}px breakpoint`);
  }
}

/* ---- 6. inline fixed widths in rendered markup ---- */
const inlineWidths = [...js.matchAll(/style="[^"]*width:\s*(\d+)px/g)].map((x) => Number(x[1])).filter((v) => v > 280);
if (inlineWidths.length) {
  ISSUES.push(`js/*.js — inline fixed widths > 280px: ${[...new Set(inlineWidths)].join(", ")}`);
}

/* ---- 7. elements that must exist for the mobile pass ---- */
const checks = [
  ["viewport meta with viewport-fit=cover", /viewport-fit=cover/.test(readFileSync("index.html", "utf8"))],
  ["mobile bottom nav container", /id="mobilenav"/.test(readFileSync("index.html", "utf8"))],
  ["safe-area padding rules", /env\(safe-area-inset-bottom/.test(css) && /env\(safe-area-inset-top/.test(css)],
  ["touch target minimums", /min-height:\s*44px|min-height:\s*40px/.test(css)],
  ["reduced-motion handling", /prefers-reduced-motion/.test(css) && /prefers-reduced-motion/.test(js)],
  ["no-preference for tilt on touch", /@media \(hover: none\)/.test(css)],
];
for (const [name, ok] of checks) if (!ok) ISSUES.push(`missing: ${name}`);

/* ---- report ---- */
console.log("\n=== PULSE LAYOUT AUDIT ===");
console.log(`css: ${css.split("\n").length} lines · js: ${jsFiles.length} files\n`);
if (NOTES.length) {
  console.log("Notes (verify visually):");
  for (const n of NOTES) console.log("  • " + n);
  console.log("");
}
if (ISSUES.length) {
  console.log("Issues:");
  for (const i of ISSUES) console.log("  ✗ " + i);
  console.log(`\n${ISSUES.length} issue(s) found`);
  process.exit(1);
}
console.log("No blocking layout issues found.");
console.log(process.env.STRICT_NOTES ? `${NOTES.length} note(s)` : `${NOTES.length} note(s) for manual review`);
