# Pulse — Public GitHub Showcase

A public, mobile-first web app that presents one GitHub account as a structured
story: who they are, what they build, and what they have been doing lately.

**GitHub is the data source. Pulse is the interface. No login. No OAuth. No tokens.**

Anyone can open the site, browse projects, follow activity, and jump to the
source on GitHub. Nothing is stored, nothing is written, nothing private is read.

## What it shows

- **Overview** — identity, highlights and live status in one screen.
- **Repositories** — every public repo with real GitHub statistics.
- **Activity** — public event feed, workflow runs and releases.
- **CI & Workflows** — pipeline health, best-effort live from the public API.
- **Community** — stars, forks and reach.
- **Health** — maintenance recency across projects.
- **XP & Rewards** — shipping momentum, gamified for fun.
- **Profile** — the account's GitHub profile README, rendered.

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

## Configure

Everything visitor-facing lives in one file:

```js
// js/config.js
window.PULSE_CONFIG = {
  github: { username: "marvel-254" },   // the account shown on the site
  display: { tagline: "", email: "", website: "" },
  live: { enabled: true, ciRefreshMs: 600000 },
};
```

Change `username` and the whole site re-points.

## Local development

```bash
npm run build     # regenerate data/snapshot.json from PUBLIC GitHub data
npm run start     # serve the static site
npm run smoke     # jsdom smoke test: every view, no auth UI, no errors
```

`npm run build` uses the public API and needs no credentials. Setting
`PULSE_USERNAME` overrides the account; setting `GITHUB_TOKEN`/`GH_TOKEN` only
raises the rate limit — it can never pull in private data.

## Deploy to GitHub Pages

`.github/workflows/deploy.yml` regenerates the snapshot and deploys the static
site on every push to `main`. If a run is rate-limited, `build.mjs` keeps the
existing snapshot rather than publishing an empty one.

## Roadmap

The current UI still carries its "personal cockpit" navigation. The plan to
restructure it into a visitor-first public showcase — sections, data sources,
phases and decisions — is in [`SHOWCASE-PLAN.md`](SHOWCASE-PLAN.md).

## Tech

- Pure static frontend (HTML / CSS / JS) — no framework, no backend.
- PWA-ready: `manifest.webmanifest` + `sw.js`.
- Dark-first bento UI with glass surfaces, large metrics and state-communicating
  animation.
