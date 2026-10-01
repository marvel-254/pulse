/**
 * Pulse accessibility check (dev-only, not shipped).
 *
 * Boots index.html in JSDOM, walks every view + a project page and runs
 * axe-core against the live DOM. Fails on serious/critical violations
 * (colour-contrast is reported as "incomplete" by axe in JSDOM because there
 * is no layout, so it is listed but not fatal).
 *
 *   node scripts/a11y-test.mjs
 */
import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const axeSource = readFileSync(path.join(root, "node_modules/axe-core/axe.min.js"), "utf8");

const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", () => {});
virtualConsole.on("error", () => {});
virtualConsole.on("warn", () => {});

const dom = new JSDOM(readFileSync(path.join(root, "index.html"), "utf8"), {
  url: "https://marvel-254.github.io/pulse/",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  virtualConsole,
  beforeParse(win) {
    win.HTMLCanvasElement.prototype.getContext = () => null;
    win.scrollTo = () => {};
    win.matchMedia = win.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  },
});
const { window } = dom;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
await wait(4000);

window.eval(axeSource);
window.axe.configure({ branding: { brand: "pulse" } });

const views = ["overview", "highlights", "numbers", "activity", "projects", "craft", "about"];
const reports = [];

async function audit(name) {
  const results = await window.axe.run(window.document, {
    runOnly: { type: "tag", values: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice"] },
    resultTypes: ["violations"],
  });
  reports.push({ name, violations: results.violations });
}

for (const view of views) {
  window.location.hash = `#/${view}`;
  window.dispatchEvent(new window.HashChangeEvent("hashchange"));
  await wait(700);
  await audit(view);
}

/* A project page and the two most important sheets. */
window.location.hash = "#/project/1";
window.dispatchEvent(new window.HashChangeEvent("hashchange"));
await wait(900);
const firstRepo = window.document.querySelector("[data-open-project]")?.getAttribute("data-open-project");
window.location.hash = `#/project/${firstRepo || "stor1"}`;
window.dispatchEvent(new window.HashChangeEvent("hashchange"));
await wait(1400);
await audit("project");

/* A per-account page. */
window.location.hash = "#/account/oliver4441";
window.dispatchEvent(new window.HashChangeEvent("hashchange"));
await wait(900);
await audit("account");

window.document.querySelector("#soundToggleBtn")?.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
await wait(100);
window.document.querySelector("#soundToggleBtn")?.dispatchEvent(new window.MouseEvent("contextmenu", { bubbles: true }));
await wait(400);
await audit("sound sheet");

window.document.querySelector("#questChipBtn")?.click();
await wait(400);
await audit("quest sheet");

/* ---- report ---- */
const rank = { critical: 0, serious: 1, moderate: 2, minor: 3 };
let blocking = 0;
for (const { name, violations } of reports) {
  if (!violations.length) {
    console.log(`PASS  ${name} — no violations`);
    continue;
  }
  for (const v of violations.sort((a, b) => rank[a.impact] - rank[b.impact])) {
    const fatal = v.impact === "critical" || v.impact === "serious";
    if (fatal) blocking += 1;
    console.log(
      `${fatal ? "FAIL" : "NOTE"}  ${name} — [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node${v.nodes.length === 1 ? "" : "s"})`
    );
    v.nodes.slice(0, 3).forEach((n) => console.log(`        ${n.target.join(" ")}`));
  }
}

const total = reports.reduce((a, r) => a + r.violations.length, 0);
console.log(`\n${reports.length} surfaces audited · ${total} violation type(s) · ${blocking} serious/critical`);
if (blocking) {
  console.error("\nACCESSIBILITY FAILED");
  process.exit(1);
}
console.log("ACCESSIBILITY PASSED");
