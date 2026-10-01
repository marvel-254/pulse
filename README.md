# Pulse — Public GitHub Showcase

A public, mobile-first web app that presents one GitHub account as a structured
story: who they are, what they build, and what they have been doing lately.

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
npm run smoke     # jsdom smoke test: 57 checks incl. 3D, quests, phone width
npm run audit     # static mobile/overflow audit of the CSS
```

`npm run build` uses the public API and needs no credentials. `PULSE_ACCOUNTS`
(comma-separated) or `PULSE_USERNAME` override the configured accounts;
`GITHUB_TOKEN`/`GH_TOKEN` only raises the rate limit — it can never pull in
private data.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` regenerates the snapshot and deploys the static
site on every push to `main`. If a run is rate-limited, `build.mjs` keeps the
existing snapshot rather than publishing an empty one.

## Roadmap

The visitor-first restructure (Phase 1) has shipped. Remaining work — a 52-week
contribution heatmap, authored PR/issue counts, language statistics by bytes,
Open Graph share cards — is tracked in [`SHOWCASE-PLAN.md`](SHOWCASE-PLAN.md).

## Smoke test

`npm run smoke` boots the real page in jsdom against the real snapshot, walks
every section, opens the project page, palette and suggest modal, and asserts
that no login/token UI exists and no uncaught errors occur.

## 3D layer

`js/depth.js` adds a perspective starfield that sits behind the UI: particles
live in a real 3D volume, react to the pointer and drift as you scroll, while
cards tilt in a shared perspective (`data-tilt`) and the hero avatar floats on
its own depth plane (`data-depth`). It is dependency-free, pauses in hidden
tabs, scales its particle count down on phones and low-power devices, respects
`prefers-reduced-motion`, and can be switched off from the topbar (persisted as
`pulse-3d`).

## Pulse Quests (gamification)

`js/game.js` turns exploring the showcase into progress. XP, levels and badges
are stored **only in the visitor's browser** (`pulse-quests`) — no account, no
server, nothing tracked.

- **Exploration badges** — earned by actually using the site: visiting each
  section, opening project pages, using ⌘K, filtering by account, toggling 3D…
- **Showcase badges** — derived from the real public GitHub data on screen
  (Polyglot, Prolific, Shipper, Release Train, Veteran…).
- **HUD** — a level ring in the topbar, a progress strip on the Overview, an
  achievement toast, and a full badge sheet (27 badges, 7 ranks).
- Reset any time from the badge sheet.

## Mobile

The layout is tuned phones-first: two-up metric cards, stacked hero with icon
columns, horizontally scrollable account/filter chips, full-width bottom sheets
with `dvh` sizing, safe-area padding top and bottom, 40px+ touch targets, and
tilt/3D effects disabled on touch-only devices. `npm run audit` statically
checks the CSS for mobile overflow risks.

## Tech

- Pure static frontend (HTML / CSS / JS) — no framework, no backend, no runtime
  dependencies (the 3D and quest layers are hand-written and ~20 KB total).
- PWA-ready: `manifest.webmanifest` + `sw.js`.
- Dark-first bento UI with glass surfaces, large metrics and state-communicating
  animation.
