# Pulse — Public GitHub Showcase

A public, mobile-first web app that presents two GitHub accounts as a structured
story: who they are, what they build, and what they have been doing lately —
dressed in a faithful Windows 95 / GeoCities-era interface, with a dark scheme
for anyone who remembers 1997 at 2am.

**GitHub is the data source. Pulse is the interface. No login. No OAuth. No tokens.**

Anyone can open the site, browse projects, follow activity, and jump to the
source on GitHub. Nothing is stored, nothing is written, nothing private is read.

## What it shows

Visitor-first sections, each with its own shareable URL:

| Section | Route | What it answers |
| --- | --- | --- |
| **Overview** | `#/overview` | Who is this, what do they build, are they active? |
| **Highlights** | `#/highlights` | Auto-ranked best work (recency + reach + completeness) |
| **Numbers** | `#/numbers` | Repos, stars, forks, releases, CI pass rate, timeline |
| **Activity** | `#/activity` | Public event feed, workflow runs, releases |
| **Projects** | `#/projects` | Every repo, grouped Active / Quiet / Archived |
| **How I build** | `#/craft` | Pipeline health, stack and release cadence |
| **About** | `#/about` | Profile README, per-account cards, links and contact |
| **Project page** | `#/project/<name>` | One page per project: README, stats, clone URLs, CI |

Highlights are derived automatically — no hand-curated list to go stale.

## How the data works

```
GitHub (public REST)
   │
   ├── build.mjs  → data/snapshot.json   (committed baseline, no credentials)
   └── js/app.js  → live public reads    (rate-limit aware, 60 req/hr/visitor)
```

- `data/snapshot.json` is generated for the account in `js/config.js` and is
  always public-only: `build.mjs` reads `GET /users/:login/repos?type=owner`
  and never touches private or collaborator repositories.
- The frontend tops the snapshot up with live public reads (`/users/:login/...`)
  and stays within the unauthenticated rate limit by refreshing slowly and only
  while a relevant view is open.
- If the network fails, the snapshot still renders — the site is never blank.

## Multiple accounts

Pulse can showcase more than one GitHub account. Public repos from every
account are merged into a single showcase, and visitors can filter the whole
site down to one account with the account chips (also available from ⌘K):

```
#/overview   All accounts · @marvel-254 · @oliver4441
#/numbers    side-by-side comparison of the featured accounts
#/about      one profile card per account
```

Highlights round-robin across accounts so neither dominates the page.

## Configure

Everything visitor-facing lives in one file:

```js
// js/config.js
window.PULSE_CONFIG = {
  github: {
    username: "marvel-254",                      // primary identity
    accounts: ["marvel-254", "oliver4441"],      // everything featured
  },
  display: {
    tagline: "…",                                // hero fallback line
    links: [{ label: "Portfolio", url: "https://admin.omixsystems.store" }],
  },
  live: { enabled: true, ciRefreshMs: 600000 },
};
```

Add or remove accounts in `accounts` and the whole site re-points.

## Local development

```bash
npm run build     # regenerate data/snapshot.json from PUBLIC GitHub data
npm run start     # serve the static site
npm run verify    # check + audit + axe-core, all offline  ← run before a PR
npm run smoke     # jsdom smoke test: walks every view and sheet (needs a server)
npm run og        # re-render icons/og.png from the design system
npm run sweep     # screenshot every view at 2 widths × 2 schemes (needs a browser)
```

`npm run smoke` expects the site on `http://localhost:8080`; `npm run sweep`
and `npm run og` need a headless browser, which is deliberately not a project
dependency — the exact install command is in each script's header.

`npm run build` uses the public API and needs no credentials. `PULSE_ACCOUNTS`
(comma-separated) or `PULSE_USERNAME` override the configured accounts;
`GITHUB_TOKEN`/`GH_TOKEN` only raises the rate limit — it can never pull in
private data.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` regenerates the snapshot and deploys the static
site on every push to `main`. If a run is rate-limited, `build.mjs` keeps the
existing snapshot rather than publishing an empty one.

## Design system

The interface is a deliberate 1997 pastiche, implemented as one token layer
plus a small set of component rules.

- **Two schemes, one vocabulary.** `:root` is the canonical Windows 95 silver
  desktop; `[data-theme="dark"]` is a period-correct dark mode — black desktop,
  neon 256-colour accents. Every token name (`--surface`, `--stroke`, `--cyan`,
  `--faint`, …) is shared, so no component knows which scheme is active.
- **The bevel is the signature.** `--bevel-hi` / `--bevel-lo` / `--bevel-inner-*`
  drive the 3D border syntax (`border-color: hi lo lo hi`) on buttons, cards,
  fields, sheets and window frames. Pressed state reverses the bevel and
  translates 1px — see `.btn:active`.
- **Typography uses system fonts.** MS Sans Serif / Tahoma for body, Arial Black
  for headings, Courier New for numbers. No webfonts ship at all, so the page
  makes zero font requests.
- **Depth is hard-edged.** No border-radius anywhere (enforced globally), no
  blur, no translucent surfaces, no soft shadows — only inset bevel shadows and
  hard offset shadows.
- **Motion is decorative or absent.** State changes are instant; only the
  marquee, rainbow heading, blink and pulse badges animate, and all four stop
  under `prefers-reduced-motion`.
- **Colour is accessible.** Every token pair used as text-on-background is
  checked against WCAG AA (4.5:1) in both schemes — the accents are darkened in
  the light scheme and brightened in the dark one to keep that true.

## Checks

`npm run verify` is the fast local gate — it runs offline and covers:

| Step | What it proves |
| --- | --- |
| `npm run check` | Every JS/JSON file parses, every asset referenced by `index.html` and `sw.js` exists, the social card is a real 1200×630 PNG, robots/sitemap are present, no login/token/analytics has crept back in, the retro system is intact (bevels, marquee, hit counter) and **no `border-radius` exists anywhere**. |
| `npm run audit` | Static CSS audit: mobile overflow risk, touch targets, reduced-motion, zero blur/soft shadows, both schemes present. |
| `npm run a11y` | axe-core across every view, the project/account pages, the repository sheet and the command palette — in **both** colour schemes. |

`npm run smoke` additionally boots the real page in jsdom and asserts the
gamified layer can never come back (no `PulseMusic`/`PulseQuests`/`PulseDepth`,
no sound button, no quest HUD, no 3D canvas).

## Mobile

The layout is tuned phones-first: two-up metric cards, stacked hero, horizontally
scrollable account/filter chips, full-width bottom sheets with `dvh` sizing,
safe-area padding, and 40px+ touch targets. The marquee keeps scrolling on
phones — that is authentic — while decorative animation drops out entirely
under `prefers-reduced-motion`.

## Views
## Views

Seven sections plus two kinds of deep-linkable detail page:

| Route | What it is |
| --- | --- |
| `#/overview` … `#/about` | The seven sections (Overview carries the "Right now" strip: current streak, projects pushed this week, last commit, newest release, latest CI run). |
| `#/project/<repo>` | A project page: stats, commit-activity sparkline, code composition by bytes, README. |
| `#/account/<login>` | A per-account page: profile hero, that account's contribution calendar, metrics, language mix and top work. |

Every route is shareable, keeps its own `<title>`/canonical/OG tags, and is
reachable from the command palette (`⌘K`).

## Sharing & SEO

- **Social card** — `icons/og.png` (1200×630), referenced by Open Graph and
  Twitter `summary_large_image` tags in `index.html`. Regenerate it with
  ImageMagick if the headline numbers change.
- **Live meta** — every route keeps `<title>`, `description`, `canonical`,
  `og:*` and `twitter:*` in sync with the view you are looking at (a project
  page shares that project, not the homepage). Absolute URLs come from
  `PULSE_CONFIG.site.url`, so a fork on another domain still produces correct
  cards.
- **Structured data** — a `ProfilePage`/`Person` JSON-LD block for search
  engines.
- **Share button** — topbar and every project page. Uses the native share sheet
  where available, falls back to copying the deep link. No third-party share
  widgets.
- **`robots.txt` + `sitemap.xml`** — crawlable, points at the canonical site
  URL.

## Accessibility

- **Skip link** to `#stage`, visible on focus, above every overlay.
- **Visible focus** for keyboard users on every link, button, field and
  `[tabindex]` element (`:focus-visible` only — mouse clicks stay quiet).
- **Dialogs** — every sheet is a labelled `role="dialog" aria-modal="true"`
  surface: opening one moves focus inside, Escape or the backdrop closes it and
  focus returns to the control that opened it. `aria-hidden` tracks open state.
- **Landmarks & state** — `main`/`aside` landmarks, `aria-current="page"` on the
  active nav item, labels on icon-only buttons, `role="status"` for toasts.
- **Reduced motion** — the marquee, rainbow heading, blink and pulsing badges
  all stop, and state changes were already instant.
- **No webfonts** — the page uses fonts already on the machine, so there are no
  font requests and no FOIT/FOUT.
- **Colour contrast** — every text/background token pair is verified at WCAG AA
  (4.5:1) or better in both schemes.
- **Verified with axe-core** — `npm run a11y` boots the site in JSDOM and audits
  every view, both detail pages, the repository sheet and the command palette, in
  light and dark. Currently: 0 violations across 15 surfaces. The same check runs
  in CI.

## Checks (CI)

`.github/workflows/ci.yml` runs on every pull request and non-`main` push:

| Step | What it proves |
| --- | --- |
| `npm run check` | Every JS/JSON file parses, every asset referenced by `index.html` and `sw.js` exists, the social card is a real 1200×630 PNG, robots/sitemap are present, and no login/token/analytics/third-party script has crept back in. Offline and deterministic. |
| `npm run audit` | Static CSS audit for mobile overflow risks. |
| `npm run a11y` | axe-core across every view, both detail pages and the sheets, in both colour schemes; fails on serious/critical violations. |
| `npm run smoke` | Informational only (needs the public GitHub API, so shared-runner rate limits would make it flaky). Run it locally before opening a PR. |

## Data depth

Every number on the page is real and public — nothing is typed in by hand.

- **Contributions** — the build parses the public calendar at
  `github.com/users/<login>/contributions` (the same data as the profile
  graph): 365 days, per-day levels, totals, active days and current/longest
  streaks. Rendered as a 53×7 heatmap on Overview and Numbers.
- **Code by language (bytes)** — `api.github.com/repos/:full/languages` for the
  featured repos, so the composition bar is weighted by real byte counts, not
  repo counts.
- **Authored work** — `search/issues?author:<login>+type:pr|issue` gives
  PRs opened/merged and issues authored (build-time only; the search bucket is
  30 requests/hour per IP, so it is cached into the snapshot).
- **Commit activity** — `stats/participation` per repo drives the per-project
  sparkline (52 weeks). GitHub sometimes returns all-zeros while it computes;
  the UI treats that as "no data" and hides the chart.
- **Trends** — `data/history.json` appends one line per build (stars,
  followers, repos, contributions/code totals) and the Numbers view diffs the
  newest entry against the previous one, so deltas grow as the site rebuilds.

All of it lands in `data/snapshot.json` at build time; the browser only ever
reads that file. No visitor analytics, ever.

## The 90s layer

Everything that gives the page its period character lives in one additive block
at the end of `css/styles.css` and one helper block in `js/app.js`:

- **Marquee** — a colour-cycling announcement bar above every view, built from
  real snapshot numbers and marked `aria-hidden` (it is decoration, not content).
- **Hit counter** — black box, green monospace digits, counting real public
  contributions rather than fictional visitors.
- **Colour palette** — the 16-colour VGA set as beveled swatches, which is
  genuinely the palette this page is drawn from.
- **Under construction** — yellow/black hazard stripes closing the Overview,
  with a working call to action rather than a dead GIF.
- **Window chrome** — navy-to-blue title bars on cards and sheets, with the
  classic minimise/maximise/close furniture on the social card.

All of it is derived from the same public snapshot as the rest of the page, and
none of it is required to read the data.

## Tech

- Pure static frontend (HTML / CSS / JS) — no framework, no backend, no runtime
  dependencies at all.
- PWA-ready: `manifest.webmanifest` + `sw.js`.
- One stylesheet: a token layer (two schemes) + component rules + the additive
  90s furniture block.
- Zero third-party requests: system fonts, no CDN, no analytics.
