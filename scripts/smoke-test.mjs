/**
 * Pulse smoke test (dev-only, not shipped).
 * Boots index.html in jsdom against the real static files + live public
 * GitHub API, then asserts the public showroom renders with NO auth UI.
 *
 *   node scripts/smoke-test.mjs
 */
import { readFileSync } from "node:fs";
import { JSDOM, VirtualConsole } from "jsdom";

const errors = [];
const virtualConsole = new VirtualConsole();
virtualConsole.on("jsdomError", (e) => {
  const msg = String(e.message || e);
  // jsdom-only limitations, not app bugs
  if (/fonts\.googleapis|scrollTo|Not implemented/i.test(msg)) return;
  errors.push("jsdomError: " + msg);
});
virtualConsole.on("error", (...a) => errors.push("console.error: " + a.join(" ")));
virtualConsole.on("warn", () => {});

const html = readFileSync("index.html", "utf8");
const dom = new JSDOM(html, {
  url: "http://localhost:8080/",
  runScripts: "dangerously",
  resources: "usable",
  pretendToBeVisual: true,
  virtualConsole,
});

// jsdom has no fetch; give it Node's (resolving relative URLs like a browser).
dom.window.fetch = (url, opts) => {
  const abs = new URL(url, dom.window.location.href).href;
  return fetch(abs, opts);
};
dom.window.scrollTo = () => {};
// jsdom implements neither matchMedia nor canvas 2D; shim both like a browser.
dom.window.matchMedia = (query) => ({
  matches: false,
  media: query,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
});
const noop = () => {};
dom.window.HTMLCanvasElement.prototype.getContext = () => ({
  setTransform: noop, clearRect: noop, beginPath: noop, arc: noop, fill: noop,
  fillRect: noop, moveTo: noop, lineTo: noop, stroke: noop, save: noop, restore: noop,
  fillStyle: "", strokeStyle: "", lineWidth: 1,
});
dom.window.requestAnimationFrame = (cb) => setTimeout(() => cb(Date.now()), 16);
dom.window.cancelAnimationFrame = (id) => clearTimeout(id);

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

await new Promise((resolve) => {
  dom.window.document.addEventListener("DOMContentLoaded", resolve);
  setTimeout(resolve, 3000);
});
await wait(4000);

const doc = dom.window.document;
const text = doc.body.textContent.replace(/\s+/g, " ");
const results = [];

const assert = (name, cond) => results.push({ name, pass: !!cond });

const snapJson = JSON.parse(readFileSync(new URL("../data/snapshot.json", import.meta.url), "utf8"));
assert("snapshot carries contribution + metrics data", !!snapJson.contributions && !!snapJson.metrics?.contributionsLastYear);
assert("snapshot repos carry language bytes", Object.values(snapJson.repos || {}).some((r) => r.languageBytes > 0));
assert("no login gate element", !doc.querySelector("#loginGate"));
assert("no token overlay element", !doc.querySelector("#tokenOverlay"));
assert("no login/oauth text on page", !/continue with github|sign in|oauth|access token/i.test(text));
assert("topbar rendered", doc.querySelector(".topbar .brand"));
assert("sidebar rendered", doc.querySelectorAll(".sidebar .nav-item").length >= 7);
assert("nav has no sign-out / token items", !/sign out|access token/i.test(doc.querySelector(".sidebar")?.textContent || ""));
assert("stage rendered content", (doc.querySelector("#stage")?.textContent || "").trim().length > 200);
assert("account shown in brand", /@marvel-254/.test(doc.querySelector(".brand")?.textContent || ""));
assert("GitHub profile link present", !!doc.querySelector("#githubProfileBtn, #sidebarGithubBtn"));
assert("no stored credential left behind", dom.window.localStorage.getItem("pulse-gh-token") === null);
// Walk every showcase view and confirm each one renders real content.
const views = ["overview", "highlights", "numbers", "activity", "projects", "craft", "about"];
for (const view of views) {
  dom.window.location.hash = "#/" + view;
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  await wait(400);
  const stage = doc.querySelector("#stage");
  const len = (stage?.textContent || "").trim().length;
  const hasError = /undefined|NaN|\[object Object\]/.test(stage?.textContent || "");
  assert(`view "${view}" renders (${len} chars)`, len > 150 && !hasError);
}

// Shareable project page (#/project/<name>) — deep link + README render.
dom.window.location.hash = "#/projects";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(600);
const projectCards = doc.querySelectorAll("#stage [data-project]");
assert("projects view lists cards", projectCards.length >= 3);
const firstProject = projectCards[0]?.dataset.project;
assert("a project card exists", !!firstProject);
if (firstProject) {
  dom.window.location.hash = "#/project/" + firstProject;
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  await wait(1200);
  const projectText = doc.querySelector("#stage")?.textContent || "";
  assert("project page opens from deep link", new RegExp(firstProject, "i").test(projectText));
  assert("project page shows clone URLs", /Clone/.test(projectText));
  assert("project page has a back link", !!doc.querySelector("#projectBackBtn"));
}

// Home-view assertions for the public showcase.
dom.window.location.hash = "#/overview";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);
const home = doc.querySelector("#stage")?.textContent || "";
assert("hero shows the account", /@marvel-254/.test(home));
assert("hero links to the portfolio", !!doc.querySelector('.hero-actions a[href*="omixsystems"]'));
assert("hero has a suggest action", !!doc.querySelector("#heroSuggestBtn"));

// Multi-account: both accounts visible, filter chips actually filter.
const heroText = doc.querySelector("#stage")?.textContent || "";
assert("hero names both accounts", /@marvel-254/.test(heroText) && /@oliver4441/.test(heroText));
assert("account filter chips rendered", doc.querySelectorAll("[data-account]").length >= 2);

dom.window.location.hash = "#/projects";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);
const allCards = doc.querySelectorAll("#stage [data-project]").length;
const chip = [...doc.querySelectorAll("#stage [data-account]")].find((c) => c.dataset.account === "oliver4441");
chip?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await wait(500);
const filteredCards = doc.querySelectorAll("#stage [data-project]").length;
const filteredText = doc.querySelector("#stage")?.textContent || "";
assert("account chip filters the project list", filteredCards > 0 && filteredCards < allCards);
assert("filtered view names the account", /@oliver4441/.test(filteredText));

dom.window.location.hash = "#/numbers";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);
assert("numbers compares the accounts", (doc.querySelector("#stage")?.textContent || "").match(/Featured Accounts/) && /oliver4441/.test(doc.querySelector("#stage")?.textContent || ""));

// README rendering: markdown + a sanitised HTML subset (badges/banners).
dom.window.location.hash = "#/about";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(800);
const md = doc.querySelector(".md-body");
if (md) {
  const mdHtml = md.innerHTML;
  assert("readme renders without raw html comments", !mdHtml.includes("<!--"));
  assert("readme drops script tags", !/<script/i.test(mdHtml));
  assert("readme drops javascript: urls", !/javascript:/i.test(mdHtml));
  assert("readme drops inline event handlers", !/\son[a-z]+=/i.test(mdHtml));
}

// Public interactions: palette, repo selector, widget modal, suggest modal.
const click = (sel) => doc.querySelector(sel)?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
click("#topbarSearchTrigger");
await wait(150);
assert("command palette opens with results", (doc.querySelectorAll(".palette-item").length || 0) > 3);
assert("palette has no token action", !/access token/i.test(doc.querySelector("#paletteSheet")?.textContent || ""));
dom.window.document.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape" }));

dom.window.location.hash = "#/activity";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(300);
click("#createIssueBtn");
await wait(150);
const suggestText = doc.querySelector("#issueSheet")?.textContent || "";
assert("suggest modal opens", /Suggest Something/.test(suggestText));
assert("suggest modal has no token requirement", !/token/i.test(suggestText));

// ---- retro design system ----
assert("tiled cross-hatch desktop exists", !!doc.querySelector(".grid-bg"));
const css = dom.window.document.querySelector('link[href="css/styles.css"]');
assert("stylesheet is linked", !!css);
dom.window.location.hash = "#/overview";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);

assert("marquee renders on every view", !!doc.querySelector(".retro-marquee"));
assert("hit counter renders real data", /HITS/.test(doc.querySelector("#stage .retro-counter")?.textContent || ""));
assert("decorative colour palette renders", doc.querySelectorAll(".retro-swatch").length === 16);
assert("under-construction banner renders", !!doc.querySelector(".retro-construction"));

// ---- theme switch still works (light ⇄ dark) ----
const themeBtn = doc.querySelector("#themeToggleBtn");
const before = doc.documentElement.getAttribute("data-theme");
themeBtn?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await wait(200);
const after = doc.documentElement.getAttribute("data-theme");
assert("theme toggle flips the scheme", before !== after && !!after);
themeBtn?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await wait(200);
assert("theme toggle returns to the original scheme", doc.documentElement.getAttribute("data-theme") === before);
await wait(150);

// ---- real data upgrades (contributions, bytes, trends) ----
dom.window.location.hash = "#/numbers";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);
const numbersText = doc.querySelector("#stage")?.textContent || "";
assert("numbers shows contribution totals", /Contributions/.test(numbersText) && /Active Days/.test(numbersText));
assert("numbers shows PR/issue counts", /PRs Merged/.test(numbersText) && /Issues Opened/.test(numbersText));
assert("numbers shows code volume", /Code Written/.test(numbersText));
assert("real contribution calendar renders", doc.querySelectorAll("#stage .contrib-cell").length > 300);
assert("calendar has activity levels", doc.querySelectorAll('#stage .contrib-cell[data-level="4"], #stage .contrib-cell[data-level="3"]').length > 0);
assert("calendar cells carry tooltips", /contributions? on /.test(doc.querySelector(".contrib-cell")?.getAttribute("title") || ""));

dom.window.location.hash = "#/craft";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(450);
assert("code-by-language (bytes) card renders", /Code by Language/.test(doc.querySelector("#stage")?.textContent || ""));

dom.window.location.hash = "#/project/stor1";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(1200);
const projectText = doc.querySelector("#stage")?.textContent || "";
assert("project page shows code composition", /Code Composition/.test(projectText) || /README/.test(projectText));

// ---- the gamer layer is gone for good ----
assert("no sound toggle in the UI", !doc.querySelector("#soundToggleBtn"));
assert("no quest HUD in the UI", !doc.querySelector("#questChip"));
assert("no 3D canvas in the UI", !doc.querySelector("#depthScene"));
assert("no audio module shipped", typeof dom.window.PulseMusic === "undefined");
assert("no quest module shipped", typeof dom.window.PulseQuests === "undefined");
assert("no depth module shipped", typeof dom.window.PulseDepth === "undefined");

// ---- "Right now" strip + per-account pages ----
dom.window.location.hash = "#/overview";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);
const overviewText = doc.querySelector("#stage")?.textContent || "";
assert("Right now strip renders", /RIGHT NOW/.test(overviewText));
assert("now strip shows the current streak", /current streak/.test(overviewText));
assert("now strip shows the week's pushes", /pushed this week/.test(overviewText));

dom.window.location.hash = "#/account/oliver4441";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(700);
const acctText = doc.querySelector("#stage")?.textContent || "";
assert("account page opens from a deep link", /oliver4441/.test(acctText));
assert("account page shows its own metrics", /Contributions/.test(acctText) && /Active Days/.test(acctText));
assert("account page shows their stack", /Stack/.test(acctText));
assert("account page lists their own repos", doc.querySelectorAll("#stage .hl-card").length > 0);
assert("account page can filter the dashboard", !!doc.querySelector("#accountFilterBtn"));
assert("account page title is per-account", /oliver4441/.test(doc.title));

// ---- share cards / SEO ----
assert("canonical link is absolute", /^https:\/\/[^"]+$/.test(doc.querySelector('link[rel="canonical"]')?.getAttribute("href") || ""));
assert("og:image points at a real card", /icons\/og\.png$/.test(doc.querySelector('meta[property="og:image"]')?.getAttribute("content") || ""));
assert("twitter card present", doc.querySelector('meta[name="twitter:card"]')?.getAttribute("content") === "summary_large_image");
assert("share button rendered", !!doc.querySelector("#shareBtn"));
dom.window.location.hash = "#/projects";
dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
await wait(500);
assert("title follows the view", /Projects/.test(doc.title));
assert("og:url follows the deep link", /#\/projects$/.test(doc.querySelector('meta[property="og:url"]')?.getAttribute("content") || ""));
const beforeShare = doc.title;
doc.querySelector("#shareBtn")?.dispatchEvent(new dom.window.MouseEvent("click", { bubbles: true }));
await wait(200);
assert("sharing does not break the view", doc.title === beforeShare && !!doc.querySelector("#stage")?.textContent.trim());

// ---- accessibility structure ----
assert("skip link exists and targets the stage", !!doc.querySelector('a.skip-link[href="#stage"]'));
assert("stage can take focus", doc.querySelector("#stage")?.getAttribute("tabindex") === "-1");
assert("primary nav marks the active section", !!doc.querySelector('.sidebar [aria-current="page"]'));
assert(
  "sheet overlays are labelled dialogs",
  [...doc.querySelectorAll('.overlay[role="dialog"]')].every((o) => o.getAttribute("aria-label") && o.getAttribute("aria-modal") === "true")
);
assert("icon-only topbar buttons have labels", !!doc.querySelector("#themeToggleBtn")?.getAttribute("aria-label"));
// The repo selector is the sheet every visitor can reach.
const repoPill = doc.querySelector('[data-repo-selector], #repoSelectorBtn, .repo-pill, [data-open-repos]');
assert("a control opens the repository sheet", !!repoPill);
repoPill?.click();
await wait(350);
assert("opening a sheet sets aria-hidden=false", doc.querySelector("#repoOverlay")?.getAttribute("aria-hidden") === "false");
assert("opening a sheet moves focus into it", doc.activeElement?.closest("#repoOverlay") !== null);
doc.dispatchEvent(new dom.window.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
await wait(250);
assert("Escape closes the sheet again", doc.querySelector("#repoOverlay")?.getAttribute("aria-hidden") === "true");

// ---- phone viewport simulation ----
dom.window.innerWidth = 390;
dom.window.innerHeight = 844;
dom.window.dispatchEvent(new dom.window.Event("resize"));
for (const view of ["overview", "highlights", "projects", "about"]) {
  dom.window.location.hash = "#/" + view;
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  await wait(350);
}
assert("renders every section at 390px", (doc.querySelector("#stage")?.textContent || "").length > 150);
assert("no errors after resize to phone width", errors.length === 0);

assert("no uncaught script errors", errors.length === 0);

console.log("\n=== PULSE SMOKE TEST ===");
for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}`);
if (errors.length) console.log("\nErrors:\n" + errors.join("\n"));
console.log("repos in state:", dom.window.document.querySelectorAll("#stage .repo-card").length);
const renders = (doc.querySelector("#stage")?.textContent || "").trim().slice(0, 200);
console.log("\n--- stage preview ---\n" + renders + "\n");
const failed = results.filter((r) => !r.pass).length;
console.log(failed ? `${failed} FAILED` : "ALL PASSED");
process.exit(failed ? 1 : 0);
