# Pulse → Public GitHub Showcase

**A structured, visitor-first way to view one GitHub account.**

Status: plan + phase 0 already implemented (login/OAuth layer removed).
Owner: `@marvel-254` · Data source: public GitHub only · No login, ever.

---

## 1. The problem with the current site

The current Pulse is built as a **personal cockpit**: it assumes the visitor is
you, logged in, with a token, looking at command-center telemetry. A visitor —
a recruiter, a collaborator, another developer — lands on it and gets:

| Current | Problem for a visitor |
| --- | --- |
| 8 equal-weight nav items (`COMMAND`, `CI`, `XP`, `HEALTH`…) | No entry point, no story, no priority |
| Empty-state metric cards (stars 0, forks 0) | The first screen is mostly zeros |
| "XP & Rewards", "Health", "Incidents" | Internal/gamified language with no public meaning |
| Repos listed as a flat grid of 9 cards | No sense of what is *important* or *finished* |
| Everything rendered at once | Nothing is explained: what is this project? is it live? |
| No per-project links | You cannot send someone a link to one project |

**The data is fine. The information architecture is the problem.**

---

## 2. Target: what a visitor should understand

Within 30 seconds:

1. **Who** — name, handle, what they do, where to reach them.
2. **What they build** — 3–5 highlighted projects with a one-line pitch.
3. **That they are active** — recent work, contributions, current momentum.
4. **How they work** — stack, shipping cadence, CI discipline, releases.
5. **How to go deeper** — a link per project, and a link to raw GitHub.

The tone stays **dark-first, cockpit-flavoured, animated** — Pulse keeps its
identity. What changes is the *order and priority of information*, not the look.

---

## 3. Proposed structure

```
PULSE @marvel-254
│
├── 1. HERO / IDENTITY            #/              ← new front door
│      avatar · name · bio · location · "on GitHub since 2026"
│      CTA: GitHub profile · Suggest something · contact links
│      live chip: "last push 3h ago · currently building stor1"
│
├── 2. HIGHLIGHTS                 #/highlights     ← new, most valuable
│      3–6 hand-picked projects, each a mini case study:
│        pitch · stack chips · README excerpt · live URL
│        latest release · CI status · stars/forks · "View project →"
│
├── 3. PULSE STORY / NUMBERS      #/numbers        ← replaces zero-heavy cards
│      repos · contributions (12 mo) · PRs merged · releases
│      longest streak · languages · followers
│
├── 4. WHAT I'VE BEEN DOING       #/activity       ← reframed Activity
│      52-week contribution heatmap
│      grouped timeline: today / this week / this month
│      digest: "37 commits across 4 repos this week"
│
├── 5. PROJECTS                   #/projects       ← reframed Repositories
│      grouped: ACTIVE · SHIPPED · ARCHIVED (not a flat list)
│      filter by language/topic · sort by activity/stars
│      each card opens #/project/<name>
│
├── 6. PROJECT DETAIL             #/project/stor1  ← new, shareable
│      pitch · full description · topics · README render
│      stack · stats · releases · CI runs · clone URLs · live link
│
├── 7. HOW I BUILD                #/craft          ← CI + stack, merged
│      workflow pass rate · recent runs · releases timeline
│      languages by bytes (not repo count) · toolchain
│
└── 8. ABOUT / CONTACT            #/about          ← merged profile + footer
       bio · profile README render · links · timeline of milestones
```

**Removed or merged as public pages:** `XP & Rewards` (gamified, internal →
either dropped or reduced to a small "momentum" streak badge on the hero),
`Health` (folded into project detail), `Community` (folded into Numbers),
separate `CI` page (folded into How I Build + project detail).
The command palette (⌘K) stays — it is genuinely useful and links everything.

---

## 4. Data layer

Everything below is **public GitHub data only**. No token, no OAuth, no private
repositories, at build time or run time.

| Data | Source | Where it goes |
| --- | --- | --- |
| Profile (name, bio, links, followers, joined) | `GET /users/:login` | Hero, About |
| Repos (stars, forks, topics, license, size, pushed) | `GET /users/:login/repos?type=owner` | Projects, Highlights |
| Contributions (52-week calendar, totals) | `github.com/users/:login/contributions` (build-time scrape) | Activity, Numbers |
| Commits / PRs / issues authored | `GET /search/issues?q=author:…` | Numbers, Activity |
| Releases | `GET /repos/:full/releases` | Highlights, Craft |
| Workflow runs + pass rate | `GET /repos/:full/actions/runs` | Craft, project detail |
| Languages by bytes | `GET /repos/:full/languages` (top ~10 repos) | Craft |
| README excerpt / cover image | `GET /repos/:full/readme` | Highlights, project detail |
| **Curated layer** (hand-written) | `data/curated.json` (committed, edited by you) | Highlights, hero tagline |

### `data/curated.json` — the human layer (why it matters)

GitHub can tell you a repo exists; it cannot tell a visitor **why it matters**.
A small committed file gives you editorial control:

```json
{
  "tagline": "I build AI-native tools and ship them.",
  "featured": [
    {
      "repo": "stor1",
      "pitch": "Omix Store — a marketplace front end built with React + Vite.",
      "highlight": "Ships a working checkout in < 200 KB of JS",
      "links": { "live": "https://…", "case": null }
    },
    { "repo": "forge-omix", "pitch": "AI-native visual software builder." }
  ],
  "sections": { "xp": false, "community": false },
  "contact": { "email": "", "linkedin": "", "x": "" }
}
```

Rules: the site must **degrade gracefully** — if `curated.json` is missing or a
featured repo no longer exists, Highlights falls back to "most recently active
repos with stars", so the page is never broken by editorial drift.

### Data freshness (no backend)

```
GitHub Actions (cron 2×/day + on push)
        │  build.mjs  → data/snapshot.json   (public snapshot, committed)
        ▼
Static site on GitHub Pages
        │  js/app.js  → live public REST reads (60 req/hr per visitor)
        ▼
Visitor sees fresh data even if the snapshot is hours old
```

- Snapshot = guaranteed baseline (works with JS API rate-limited or offline).
- Live layer = top-up for the views that benefit (activity, CI, project stats).
- No server, no credentials, nothing to leak. The existing PWA/service worker
  keep working; bump the cache key on every schema change.

---

## 5. Implementation phases

### Phase 0 — done in this pass
- [x] Removed the mandatory GitHub OAuth login gate, the landing/"Continue with
      GitHub" screen, the PAT modal, the OAuth Worker and all token storage.
- [x] `js/config.js` is now a single public knob: `github.username`.
- [x] `build.mjs` reads **public endpoints only** and can never include private
      repositories (defensive: refuses to write an empty snapshot).
- [x] `data/snapshot.json` regenerated for `@marvel-254` — the previous file
      contained 11 private repo names and 8 repos from a second account; both
      are gone. `repoList()` now also filters private/duplicate entries at
      runtime as a second line of defence.
- [x] Live reads are public (`/users/:login/...`), rate-limit aware and slow.
- [x] "New Issue" (which required a token) → **Suggest Something**, which opens
      a prefilled GitHub issue URL in a new tab. Read-only site, zero writes.
- [x] Deep links fixed (`#/repos` never worked before — the hash parser
      dropped the `/`), so every view is now linkable and shareable.
- [x] Smoke test: `npm run smoke` boots the real page in jsdom, walks every
      view, opens the palette/modals and asserts no auth UI remains.

### Phase 1 — IA skeleton (the visible restructure)
- New nav + routes: Overview · Highlights · Activity · Projects · Craft · About.
- Hero component with identity + live "currently building" chip.
- Projects grouped into ACTIVE / SHIPPED / ARCHIVED; project detail route
  `#/project/<name>` with its own shareable URL and OG tags.
- `data/curated.json` + featured/fallback logic.
- Convert "XP & Rewards" and "Health" into hero micro-badges or drop them.

### Phase 2 — data depth
- Contribution heatmap + totals (build-time scrape → snapshot).
- Authored PR/issue counts via the Search API (build-time, cheap).
- Languages **by bytes** for the top repos.
- README excerpt + cover image per featured repo.
- "This week" digest computed in `build.mjs` (not in the browser).

### Phase 3 — share & polish
- Open Graph/Twitter card image generated at build time (`og.png`) + meta tags.
- Print/PDF-friendly "About" (a one-page résumé view).
- Per-project "case study" layout for the featured 3–5.
- Motion/accessibility pass (respect `prefers-reduced-motion`, focus states).

### Phase 4 — optional
- Multi-account mode (a `PULSE_USERNAME` list) for collaborations.
- Embeddable widget (`<iframe src="…/#/project/stor1">`).
- Visitor-facing "compare accounts" or "timeline of everything shipped".

---

## 6. Decision checklist (what I need from you)

1. **Structure**: adopt the 8-section visitor IA above, or keep the current
   cockpit nav and only reframe the labels?
2. **XP / Health / Community**: drop entirely, or shrink into hero badges?
3. **Featured projects**: which 3–5 repos should lead, and do you want to write
   the pitches (or should I draft them from the repo descriptions/READMEs)?
4. **Personal links**: which contact links should appear (email, LinkedIn, X,
   portfolio)? They go in `js/config.js` / `curated.json`.
5. **Contributions privacy**: the heatmap only reads the *public* contribution
   graph — confirm that is acceptable (it shows counts, no private detail).

---

## 7. Verification & guardrails

- `npm run smoke` — boots the real page, walks all views, asserts no login/
  token UI and no uncaught errors.
- `node build.mjs` — refuses to overwrite a good snapshot with an empty one.
- Runtime guard: `repoList()` drops anything flagged private or duplicated, so a
  stale snapshot can never leak private repo names.
- Manual check before deploy: `grep -ri "token\|oauth\|private" js/ index.html`
  should return only copy/text, never storage or auth code.

---

## 8. Security follow-ups for you (outside the code)

The login layer is gone from the site, but two things still exist on GitHub's
and Cloudflare's side and should be cleaned up by you:

1. **Cloudflare Worker** `pulse-oauth…workers.dev` — delete it (it can still
   exchange OAuth codes). Dashboard → Workers → pulse-oauth → Delete.
2. **GitHub OAuth App** `Ov23liWXKxq2qtzNEuvV` — delete it in
   Settings → Developer settings → OAuth Apps. If you prefer to keep it for
   future use, at least rotate the client secret in the Worker env.

Neither is required for the public showcase to work.
