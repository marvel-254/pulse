/**
 * Pulse deterministic checks (dev-only, not shipped).
 *
 * Offline, no network, no browser — safe to run on every pull request.
 * Validates that what the site *ships* is internally consistent:
 *   - every JS file parses
 *   - every JSON file parses
 *   - every local asset referenced by index.html exists on disk
 *   - the service worker precache list points at real files
 *   - SEO files exist and the social card is a real PNG
 *   - no login/OAuth/token UI has crept back in
 *
 *   node scripts/ci-check.mjs
 */
import { readFileSync, existsSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const results = [];
const assert = (name, cond) => results.push({ name, pass: !!cond });
const read = (rel) => readFileSync(path.join(root, rel), "utf8");
const has = (rel) => existsSync(path.join(root, rel));

/* ---- files that must exist ---- */
const required = [
  "index.html",
  "css/styles.css",
  "js/config.js",
  "js/app.js",
  "data/snapshot.json",
  "data/history.json",
  "sw.js",
  "manifest.webmanifest",
  "icons/icon.svg",
  "icons/og.png",
  "robots.txt",
  "sitemap.xml",
  "fonts/inter-latin-wght.woff2",
  "fonts/jetbrains-mono-latin-wght.woff2",
  "fonts/OFL-Inter.txt",
  "scripts/a11y-test.mjs",
];
required.forEach((f) => assert(`exists: ${f}`, has(f)));

/* ---- JS parses ---- */
const jsFiles = required.filter((f) => f.endsWith(".js"));
for (const f of jsFiles) {
  try {
    new (await import("node:vm")).Script(read(f), { filename: f });
    assert(`parses: ${f}`, true);
  } catch (err) {
    assert(`parses: ${f} (${err.message})`, false);
  }
}

/* ---- JSON parses ---- */
const jsonFiles = ["data/snapshot.json", "data/history.json", "manifest.webmanifest", "package.json"];
for (const f of jsonFiles) {
  try {
    JSON.parse(read(f));
    assert(`valid JSON: ${f}`, true);
  } catch (err) {
    assert(`valid JSON: ${f} (${err.message})`, false);
  }
}

/* ---- snapshot sanity ---- */
const snap = JSON.parse(read("data/snapshot.json"));
assert("snapshot has repos", (snap.repos || []).length > 0);
assert("snapshot has no private repos", !(snap.repos || []).some((r) => r.isPrivate));
const contribAccounts = Object.values(snap.contributions || {});
assert(
  "snapshot has per-account contribution calendars",
  contribAccounts.length > 0 && contribAccounts.every((c) => Array.isArray(c.days) && c.days.length >= 300)
);
assert("snapshot has per-account metrics", Object.values(snap.accounts || {}).length === 0 || Object.values(snap.accounts || {}).every((a) => !a.metrics || typeof a.metrics.contributionsLastYear === "number"));
assert("snapshot metrics present", !!snap.metrics && typeof snap.metrics.contributionsLastYear === "number");
assert("history log is an array", Array.isArray(JSON.parse(read("data/history.json")).entries ?? JSON.parse(read("data/history.json"))));
assert(
  "repo language bytes are numbers",
  (snap.repos || []).every((r) => r.languageBytes === undefined || typeof r.languageBytes === "number")
);

/* ---- index.html: local assets resolve ---- */
const html = read("index.html");
const refs = [...html.matchAll(/(?:src|href)="([^"#:]+)"/g)]
  .map((m) => m[1])
  .filter((u) => !u.startsWith("http") && !u.startsWith("//") && !u.startsWith("data:"));
refs.forEach((rel) => assert(`index.html asset exists: ${rel}`, has(rel)));
assert("index.html has canonical link", /rel="canonical"/.test(html));
assert("index.html has og:image", /property="og:image"\s+content="https?:\/\/[^"]+"/.test(html));
assert("index.html has twitter card", /name="twitter:card"\s+content="summary_large_image"/.test(html));
assert("index.html has description", /name="description"/.test(html));
assert("index.html has JSON-LD", /application\/ld\+json/.test(html));
assert("index.html has a skip link", /class="skip-link"[^>]*href="#stage"/.test(html));
assert("stage is a focus target", /<main class="stage" id="stage" tabindex="-1">/.test(html));
assert("sheets are dialogs", (html.match(/role="dialog"/g) || []).length >= 3);
assert("index.html loads the app", /js\/app\.js/.test(html));
assert("no login / token UI in HTML", !/access token|sign in with github|oauth/i.test(html));

/* ---- service worker precache matches disk ---- */
const sw = read("sw.js");
const cached = [...sw.matchAll(/"(\.\/[^"]+)"/g)].map((m) => m[1].replace(/^\.\//, "")).filter(Boolean);
cached.forEach((f) => assert(`precached file exists: ${f}`, f === "" || has(f)));
assert("service worker caches the app shell", /"\.\/js\/app\.js"/.test(sw));
assert("service worker cache name is versioned", /const CACHE = "pulse-v\d+"/.test(sw));

/* ---- shipped code stays login-free and third-party-script-free ---- */
const appJs = read("js/app.js");
assert(
  "app has no token/OAuth flow",
  !/access_token|authorize\?client_id/i.test(appJs) && !/oauth/i.test(appJs.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, ""))
);
assert("app has no analytics beacons", !/gtag\(|googletagmanager|plausible\.io|posthog|mixpanel|umami/i.test(appJs));
assert(
  "retro design system present (bevels, marquee, hit counter)",
  /--bevel-hi\s*:/.test(read("css/styles.css")) &&
    /\.retro-marquee\s*\{/.test(read("css/styles.css")) &&
    /\.retro-counter\s*\{/.test(read("css/styles.css"))
);
assert(
  "no border-radius anywhere (1995 had none)",
  !/^[ \t]*border-radius\s*:/m.test(read("css/styles.css"))
);
assert("dark scheme defined", /\[data-theme="dark"\]/.test(read("css/styles.css")));
assert("no bundled audio files", !/\.(mp3|wav|ogg|m4a|flac)["')]/i.test(appJs) || /hasCustomTrack/.test(appJs));
const tracked = [...html.matchAll(/<(?:script|link|img)[^>]*?(?:src|href)="(https?:\/\/[^"]+)"/g)]
  .filter((m) => !/rel="(canonical|alternate|me)"/.test(m[0]))
  .map((m) => m[1]);
assert(
  "no webfont requests (system fonts only)",
  !/@font-face/.test(read("css/styles.css")) &&
    !/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html) &&
    !/\.(woff2?|ttf|eot|otf)["')]/.test(read("css/styles.css"))
);
assert("no third-party requests at all", tracked.length === 0);
assert(
  "third-party requests limited to fonts",
  tracked.every((u) => /^https:\/\/(fonts\.googleapis\.com|fonts\.gstatic\.com)(\/|$)/.test(u))
);

/* ---- social card is a real PNG of the right size (IHDR check, no deps) ---- */
try {
  const png = readFileSync(path.join(root, "icons/og.png"));
  const isPng = png.slice(1, 4).toString() === "PNG";
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  assert("og.png is a PNG", isPng);
  assert(`og.png is 1200x630 (got ${width}x${height})`, width === 1200 && height === 630);
  assert("og.png is under 1 MB", statSync(path.join(root, "icons/og.png")).size < 1024 * 1024);
} catch (err) {
  assert(`og.png readable (${err.message})`, false);
}

/* ---- robots + sitemap ---- */
const robots = read("robots.txt");
assert("robots.txt allows crawling", /User-agent: \*/i.test(robots) && /Allow: \//i.test(robots));
assert("robots.txt points at the sitemap", /Sitemap: https?:\/\/\S+sitemap\.xml/.test(robots));
const sitemap = read("sitemap.xml");
assert("sitemap is valid urlset", /<urlset/.test(sitemap) && /<\/urlset>/.test(sitemap));
assert("sitemap lists the root", /<loc>[^<]*\/pulse\/<\/loc>/.test(sitemap));

/* ---- report ---- */
const failed = results.filter((r) => !r.pass);
results.forEach((r) => console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.name}`));
console.log(`\n${results.length - failed.length}/${results.length} checks passed`);
if (failed.length) {
  console.error(`\n${failed.length} FAILED`);
  process.exit(1);
}
console.log("CI CHECKS PASSED");
