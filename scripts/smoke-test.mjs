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
// Walk every dashboard view and confirm each one renders real content.
const views = ["command", "repos", "activity", "ci", "community", "health", "xp", "profile"];
for (const view of views) {
  dom.window.location.hash = "#/" + view;
  dom.window.dispatchEvent(new dom.window.HashChangeEvent("hashchange"));
  await wait(400);
  const stage = doc.querySelector("#stage");
  const len = (stage?.textContent || "").trim().length;
  const hasError = /undefined|NaN|\[object Object\]/.test(stage?.textContent || "");
  assert(`view "${view}" renders (${len} chars)`, len > 150 && !hasError);
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
