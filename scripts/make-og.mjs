/**
 * Dev-only: renders icons/og.png (the 1200x630 social card) from the retro
 * design system, so the share card can never drift from the site.
 *
 *   node scripts/make-og.mjs
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
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const chromiumPkg = await import("@sparticuz/chromium");
const chrome = chromiumPkg.default ?? chromiumPkg;

const SNAP = JSON.parse(
  (await import("node:fs")).readFileSync(path.join(root, "data/snapshot.json"), "utf8")
);
const repos = SNAP.repos?.length ?? 0;
const contributions = (SNAP.metrics?.contributionsLastYear ?? 0).toLocaleString("en-US");
const accounts = (SNAP.accounts ? Object.keys(SNAP.accounts) : []).length || 1;

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  * { margin:0; padding:0; box-sizing:border-box; border-radius:0 !important; }
  body {
    width:1200px; height:630px; overflow:hidden;
    font-family:"MS Sans Serif","Segoe UI",Tahoma,Verdana,sans-serif;
    background-color:#c0c0c0;
    background-image:
      linear-gradient(45deg,#b8b8b8 25%,transparent 25%),
      linear-gradient(-45deg,#b8b8b8 25%,transparent 25%),
      linear-gradient(45deg,transparent 75%,#b8b8b8 75%),
      linear-gradient(-45deg,transparent 75%,#b8b8b8 75%);
    background-size:4px 4px;
    background-position:0 0,0 2px,2px -2px,-2px 0;
    padding:26px; color:#000;
  }
  .win {
    height:100%; display:flex; flex-direction:column;
    background:#c0c0c0; border:2px solid;
    border-color:#fff #808080 #808080 #fff;
    box-shadow:inset 1px 1px 0 #dfdfdf, inset -1px -1px 0 #404040;
  }
  .bar {
    background:linear-gradient(90deg,#000080,#1084d0);
    color:#fff; font-family:"Arial Black",Impact,sans-serif;
    font-size:19px; letter-spacing:.04em; text-transform:uppercase;
    padding:6px 10px; display:flex; justify-content:space-between; align-items:center;
  }
  .bar .btns { display:flex; gap:4px; }
  .bar .btns i {
    width:26px; height:22px; background:#c0c0c0; border:2px solid;
    border-color:#fff #808080 #808080 #fff; display:grid; place-items:center;
    color:#000; font-style:normal; font-size:13px; font-family:"Courier New",monospace;
  }
  .in { flex:1; margin:8px; padding:22px 26px; background:#fff;
        border:2px solid; border-color:#808080 #fff #fff #808080; }
  .marquee {
    background:#000; color:#00ff00; font-family:"Courier New",monospace;
    font-size:17px; font-weight:bold; padding:7px 12px; margin-bottom:20px;
    border-top:2px solid #fff; border-bottom:2px solid #fff; white-space:nowrap; overflow:hidden;
  }
  h1 {
    font-family:"Arial Black",Impact,sans-serif; font-size:74px; line-height:1.02;
    text-transform:uppercase; letter-spacing:.01em; margin-bottom:10px;
  }
  h1 .rain { color:#ff0000; }
  .sub { font-size:23px; margin-bottom:22px; }
  .sub b { background:#ffff00; padding:1px 5px; }
  .counts { display:flex; gap:14px; margin-bottom:22px; }
  .count {
    background:#000; color:#00ff00; border:2px solid;
    border-color:#808080 #fff #fff #808080;
    font-family:"Courier New",monospace; font-size:26px; font-weight:bold;
    letter-spacing:.1em; padding:8px 16px;
  }
  .count span { color:#ffff00; font-size:15px; letter-spacing:.06em; display:block; }
  .foot { display:flex; align-items:center; gap:12px; font-size:19px; }
  .tag {
    background:#ff0000; color:#fff; font-family:"Arial Black",sans-serif;
    font-size:16px; padding:3px 10px; border:2px solid;
    border-color:#ff8888 #800000 #800000 #ff8888; letter-spacing:.06em;
  }
  .url { color:#0000ff; text-decoration:underline; }
</style></head><body>
  <div class="win">
    <div class="bar"><span>Pulse — Public GitHub Showcase</span>
      <span class="btns"><i>_</i><i>□</i><i>✕</i></span></div>
    <div class="in">
      <div class="marquee">&nbsp;★ WELCOME TO PULSE ★&nbsp; ◆ &nbsp;NO LOGIN&nbsp; ◆ &nbsp;NO TRACKING&nbsp; ◆ &nbsp;PUBLIC DATA ONLY&nbsp; ◆ &nbsp;BEST VIEWED AT 800×600&nbsp; ◆&nbsp;</div>
      <h1>GitHub, through a <span class="rain">1997</span> window</h1>
      <div class="sub">Projects, activity, releases and CI for <b>${accounts} accounts</b> — read straight from public GitHub.</div>
      <div class="counts">
        <div class="count">${String(repos).padStart(3, "0")}<span>REPOS</span></div>
        <div class="count">${contributions}<span>CONTRIBUTIONS</span></div>
        <div class="count">000<span>LOGINS</span></div>
      </div>
      <div class="foot"><span class="tag">NEW!</span> <span class="url">marvel-254.github.io/pulse</span></div>
    </div>
  </div>
</body></html>`;

const exe = await chrome.executablePath();
const libDir = process.env.PULSE_CHROMIUM_LIBS || "/tmp/al2023/lib";
const browser = await pw.launch({
  executablePath: exe,
  args: [...chrome.args.filter((a) => a !== "--single-process"), "--no-sandbox", "--disable-dev-shm-usage"],
  headless: true,
  env: { ...process.env, LD_LIBRARY_PATH: `${libDir}:${process.env.LD_LIBRARY_PATH || ""}` },
});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: "load" });
await page.waitForTimeout(400);
const buf = await page.screenshot({ type: "png", animations: "disabled" });
await browser.close();

writeFileSync(path.join(root, "icons/og.png"), buf);
console.log(`icons/og.png written (${(buf.length / 1024).toFixed(0)} KB, 1200x630)`);
