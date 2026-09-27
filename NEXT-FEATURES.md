# Pulse — Next Features & Product Roadmap

> Source: external product review of the live Pulse page, cross-checked against the GitHub workflows it is built around.
>
> **Overall assessment:** Pulse has a good product idea, but it currently reads more like a very well-designed GitHub shortcut launcher than a full developer command center. The next step should **not** be "add more shortcuts." It should be turning Pulse into a workspace that understands a repository, its branches, commits, PRs, issues and developer workflow.

---

## 1. UX / UI

The strongest part of Pulse is the basic mental model: one place where a developer can enter a GitHub repository and quickly jump into useful development surfaces. That is much better than trying to recreate GitHub itself.

The problem is that the current experience still feels primarily like:

> "Here are useful GitHub URL transformations."

A polished version should feel more like:

> "Give me a repository and I'll construct the right development environment around it."

Restructure the UI around three levels:

```
Repository input
github.com/owner/repo
        ↓
Repository workspace
Overview | Code | Branches | PRs | Issues | Actions | Tools
        ↓
Actions
Open Editor Compare Blame Raw History Codespaces Clone Create Issue New PR Actions
```

The important distinction: the user shouldn't have to understand the URL tricks. Pulse should understand them for them.

> Example: GitHub officially supports `/compare` for comparing branches, tags, commits and forks. Pulse can turn that into a simple action — "Compare branches: main → feature/auth" — instead of asking the user to manually manipulate URLs.

---

## 2. The biggest opportunity: Repository Intelligence

This is what to build next.

When someone enters `https://github.com/marvel-254/pulse`, Pulse should parse:
- owner
- repository
- default branch
- branch list
- repository visibility
- language
- latest commit
- latest release
- open PRs
- open issues
- Actions status

Then produce a small repository dashboard:

```
PULSE
marvel-254 / pulse
────────────────────────────────────
main       ● passing
Latest     3f8a91c  Improve mobile navigation
Updated    12 minutes ago

CODE
  Open GitHub       Open github.dev
  Raw               Clone
  History           Blame

BRANCHES
  main
  development
  feature/mobile

COLLABORATION
  3 PRs
  7 issues
  2 workflows failing

TOOLS
  Compare
  Branch switcher
  Commit lookup
  File finder
```

Now Pulse isn't merely generating URLs — it is interpreting the repository.

---

## 3. GitHub Integration

Two possible directions:

**Lightweight approach (current):** URL-based, zero-auth Pulse. Valuable because users can use it without giving Pulse GitHub permissions.

**Advanced mode: "Connect GitHub"** — use GitHub's API/OAuth to provide authenticated information, unlocking:
- repositories
- private repositories
- issues
- PRs
- notifications
- Actions
- branches
- releases
- commits
- workflows
- starred repositories
- user profile

Make this **explicitly optional**. That gives a clean architecture:

```
PULSE
        │
┌───────┴────────┐
│                │
Public Mode   GitHub Mode
│                │
URL parsing   GitHub API
no permissions OAuth
no account     authenticated
```

GitHub already provides extensive browser-based development functionality (branch creation, editing, committing, PR creation). Pulse should therefore focus on **orchestration, not reproducing GitHub**.

---

## 4. Developer Tools

Create a Tools section:

```
TOOLS

Repository
├── Compare branches
├── Compare commits
├── File finder
├── Raw file
├── Blame
├── History
└── Permalink

Development
├── github.dev
├── Codespaces
├── GitHub Actions
├── Clone command
└── Download repository

Collaboration
├── Issues
├── Pull requests
├── Discussions
├── Releases
└── Projects

Utilities
├── GitHub URL builder
├── Markdown preview
├── JSON formatter
├── Base64
└── Regex tester
```

Pulse could essentially become a developer launchpad around GitHub.

---

## 5. Command Palette

Probably the single UX feature to add: **Ctrl + K** (Cmd + K).

```
╭────────────────────────────────────╮
│ Search Pulse...                    │
│                                    │
│ > compare branches                 │
│                                    │
│ GitHub                             │
│   Compare branches                 │
│   Open repository                  │
│   Open Actions                     │
│                                    │
│ Tools                              │
│   JSON formatter                   │
│   Markdown preview                 │
╰────────────────────────────────────╯
```

Natural commands:
```
compare marvel-254/pulse main dev
open marvel-254/pulse actions
blame marvel-254/pulse README.md
raw marvel-254/pulse README.md
history marvel-254/pulse
```

That would make Pulse feel like a developer application, rather than a website.

---

## 6. Keyboard-First Interaction

Support GitHub-style shortcuts:
- `Ctrl/Cmd + K` — command palette
- `G R` — repository
- `G B` — branches
- `G P` — pull requests
- `G I` — issues
- `G A` — Actions
- `G C` — compare
- `G E` — editor

Every card/action should show a visible shortcut when appropriate. GitHub itself exposes a substantial keyboard-navigation system; Pulse could make keyboard navigation a first-class feature.

---

## 7. Mobile

A desktop developer dashboard can tolerate dense information; mobile cannot.

Instead of shrinking the desktop UI, make mobile Pulse a **different information hierarchy**:

```
PULSE

[ GitHub repository URL       ]

┌─────────────────────────────┐
│ marvel-254 / pulse          │
│ ● main                     │
│                             │
│ Latest commit               │
│ Improve mobile navigation   │
└─────────────────────────────┘

[ Open GitHub ]

QUICK ACTIONS
[ Editor ] [ Compare ]
[ Issues ] [ PRs     ]
[ Actions ] [ History ]

─────────────────────────────
MORE
Branches
Releases
Clone
Raw
Blame
```

Use **bottom navigation** for the major surfaces: `Home | Repository | Tools | Settings`. Don't put six or seven navigation items in a horizontal desktop-style header on mobile. Also make the repository input extremely prominent — that's the primary interaction.

---

## 8. Performance

Pulse has a major advantage: the concept doesn't require a heavy frontend. Keep it aggressively lightweight.

**Avoid:**
- huge component libraries
- unnecessary animations
- giant icon packages
- client-side frameworks unless actually needed
- fetching GitHub data that isn't displayed
- loading every tool upfront

**Prefer:**
- static-first rendering
- lazy-loaded tools
- SVG icons
- minimal JavaScript
- localStorage for recent repositories
- GitHub API requests only when needed
- aggressive caching where appropriate

**Targets:**
- Initial JS: `<100 KB`
- Interactive: `<1 sec`
- Lighthouse: `95+`
- Mobile: `excellent`
- Offline shell: `possible`

The architecture matters more than chasing a specific Lighthouse score.

---

## 9. Recent Repositories

A small feature that would dramatically improve usability:

```
RECENT

marvel-254 / pulse
oliver4441 / stor1
oliver4441 / forge-omix
langattr-cloud / phikila-school-management-system
```

- No account required.
- Store them locally (localStorage).
- Clicking one immediately opens its Pulse workspace.

That changes the experience from `paste URL → use tool` to `open Pulse → continue working`.

---

## 10. Repository URL Parsing (Must Be Excellent)

Support:
```
https://github.com/user/repo
https://github.com/user/repo/
github.com/user/repo
user/repo
user/repo/blob/main/src/app.ts
user/repo/tree/dev
user/repo/issues/42
user/repo/pull/18
```

And extract: owner, repository, branch, path, commit, issue, PR.

Then Pulse can intelligently decide what the user is trying to do.

> Example: `user/repo/blob/main/src/app.ts` could automatically offer: Open, Raw, Blame, History, Permalink, Edit, Download.

---

## 11. GitHub URL Transformations Should Become Invisible

This is the conceptual evolution. Don't advertise "Change github.com to github.dev." Instead, provide actions:

- Open Editor
- Compare
- Blame
- Raw
- History
- Permalink
- Actions
- Codespaces

Pulse internally generates the appropriate destination. The user doesn't need to know these are URL transformations — that's the magic of the product.

---

## 12. A "Developer Context" Panel (Potential Signature Feature)

For any repository:

```
DEVELOPER CONTEXT

Repository
  marvel-254/pulse

Branch
  main

Latest commit
  3f8a91c

Open PRs
  3

Open issues
  7

CI
  Passing

Editor
  github.dev

Deploy
  GitHub Pages

Quick commands
  git clone ...
  gh repo clone ...
```

Now Pulse answers: *"What do I need to know before I start working?"* — far more valuable than another collection of links.

---

## 13. A Future GitHub CLI Bridge

Fits the developer-tool direction well. Pulse could eventually generate commands:

```
gh repo clone marvel-254/pulse
gh issue list -R marvel-254/pulse
gh pr list -R marvel-254/pulse
gh run list -R marvel-254/pulse
```

And offer **Copy CLI command**. A future desktop/PWA version could even communicate with a local GitHub CLI installation. That would make Pulse the bridge between `browser → GitHub → terminal`.

---

## 14. What NOT to Build

Avoid turning Pulse into a giant GitHub clone. Don't build:
- an entire GitHub code editor
- a full issue-management system
- another Git client
- another GitHub social feed
- an elaborate AI chatbot just because it's fashionable
- a full project-management suite

GitHub already does those things. **Pulse should remain the control layer.**

---

## 15. Product Positioning

Instead of "GitHub shortcuts," position it as:

> **Pulse — Your developer command center for GitHub.**

> Turn any GitHub repository into a focused workspace for code, branches, commits, pull requests, Actions and developer tools.

---

## 16. Suggested Roadmap

**Phase 1 — Foundation**
- Repository parser
- Recent repositories
- Persistent local state
- Responsive mobile UI
- Command palette
- Keyboard shortcuts

**Phase 2 — Repository workspace**
- Repository overview
- Branches
- Commits
- PRs
- Issues
- Actions
- Releases

**Phase 3 — Developer actions**
- Editor
- Compare
- Blame
- Raw
- History
- Permalinks
- Clone commands
- Codespaces

**Phase 4 — GitHub authentication**
- OAuth
- Private repositories
- Authenticated API
- User repositories
- Notifications
- Personal dashboard

**Phase 5 — Power-user layer**
- GitHub CLI integration
- Custom commands
- Workspace presets
- Command aliases
- PWA/offline shell
- Browser extension

**Phase 6 — Optional intelligence**
Not "AI chat"; instead, contextual actions:
- Repository changed significantly → Compare with previous release
- CI failed → Inspect failing workflow
- PR waiting for review → Open PR
- Branch is behind main → Compare branches

That would make intelligence actually useful.

---

## Assessment & Conceptual Shift

Don't throw away what's built. The current URL-centric idea is the foundation. Evolve it:

```
CURRENT PULSE
        │
        ▼
GitHub URL shortcuts
        │
        ▼
Repository parser
        │
        ▼
Repository workspace
        │
┌───────┼───────┐
▼       ▼       ▼
Code   Git     CI/CD
│       │       │
└───────┼───────┘
        ▼
Developer command center
```

**The critical product shift:**

> Pulse should stop being a place where developers find GitHub links and become the place from which developers operate GitHub.

This preserves the lightweight, zero-auth nature of what's already built while leaving room for authenticated GitHub integration later.

---

# 17. Profile README Tab (Personalization)

**Feature request (priority):** Display the user's GitHub profile README under a new **"PROFILE"** tab, embedded exactly as the user has customized it, in the Pulse nav alongside COMMAND / REPOSITORIES / ACTIVITY / CI / COMMUNITY / HEALTH / XP.

## What it does
- Fetches the profile README (`GET /repos/{user}/{user}/readme`) from the special `owner/owner` profile repo (e.g. `marvel-254/marvel-254`).
- Renders the customized README (Markdown → live HTML) inside a dedicated **Profile** view.
- Works with README **generators / embeds** the user already uses, including:
  - **shields.io** badges
  - **github-readme-stats** cards (stats, top languages, streak)
  - **Capsule Render** banners
  - any other dynamic-badge embeds the user drops inline in their README

## How to embed safely (static frontend)
- Profile READMEs often contain `<img>` embed URLs (shields.io, stats cards) that render fine in an iframe/HTML blob.
- Fetch the raw README via the GitHub REST API (`/repos/:owner/:owner/readme` returns base64 `content`); decode, render through a Markdown renderer.
- Because the frontend must stay static + credential-safe, use the **raw GitHub content URL** (`raw.githubusercontent.com/{owner}/{owner}/HEAD/README.md`) for on-demand loading, or bake a rendered copy into `data/snapshot.json` at build time (Phase 6 auto-snapshot).
- Live embeds (badges / stats images) load from their own CDNs (shields.io, github-readme-stats) regardless of our host — so they keep working on GitHub Pages.
- Sanitize / strip active scripts; allow only images, links, headings, lists, code fences.

## Build steps
1. Extend `build.mjs` → fetch `owner/owner` README, store `{ owner, name, html, raw, fetchedAt }` in `snapshot.profile`.
2. Add a **Profile** view (renderer + nav item) that renders the README.
3. Add a "README Generator" helper: pick badges (shields.io), stats cards (github-readme-stats), capsule banner → outputs a Markdown snippet the user can paste into their profile repo.
4. Fall back gracefully when no profile README exists (show a friendly "no profile README yet" state with a link to create one).

---

# 18. Operational Roadmap (Community Plan)

> Externally contributed phased, actionable plan. Assumes Pulse is a static frontend building `snapshot.json` via `build.mjs` + GitHub REST API, with sections Command Center, Repositories, Activity, CI & Workflows, Community, Health, XP & Rewards. File names map onto the current structure.

## Guiding principles
1. **Modular widgets** – each feature is a self-contained component reading from a shared data layer.
2. **Data pipeline first** – extend `build.mjs` to fetch + normalize new data into `snapshot.json` before building UI.
3. **Progressive enhancement** – features needing extra API scopes (e.g. traffic) degrade gracefully.
4. **Cache & rate limits** – ETags, conditional requests, GitHub Actions scheduled builds.
5. **Feature flags** – `features.json` or query params to toggle new sections during development.

## Phase 0 — Foundation & Refactor (Week 1–2)
- Audit codebase: map `build.mjs → snapshot.json → components`.
- Define extended schema: top-level `languages, heatmap, traffic, achievements, persona, triage, releases, followers`.
- Create widget registry (`src/widgets/index.js`): map widget ID → component; each declares required data keys.
- Theme system: CSS variables (`src/styles/themes.css`) + ThemeSwitcher in localStorage.
- GitHub Actions: daily `node build.mjs` + commit snapshot.
- Install Chart.js; reusable `<Chart>` wrapper.

Deliverable: modular architecture, theme switcher, daily refresh.

## Phase 1 — Quick Wins (Week 3–4)
| Feature | Tasks / API / Tool | Effort |
|---|---|---|
| Language Pie Chart | Aggregate languages from `/users/:user/repos`; `snapshot.languages`; Chart.js pie in Repositories | S |
| Contribution Heatmap | `/users/:user/events` (90 days) or GraphQL; GitHub-style grid in Activity | M |
| Proof of Shipping Card | Count merged PRs + releases from snapshot; Command Center card | S |
| Theme Switcher | 3–4 themes (dark, light, neon, glass) via CSS variables + localStorage | S |

Deliverable: four visible features, no new API scopes.

## Phase 2 — Analytics Expansion (Week 5–7)
- Traffic & Clone Analytics: `/repos/:o/:r/traffic/views` + `/clones` (requires repo scope/push); per-repo; Community view. Note: only for owned repos; otherwise "Not available".
- Code Frequency & Commit Patterns: aggregate commit timestamps; day-of-week/hour heatmap.
- Follower Growth: daily snapshot via GitHub Action; `followers.json`; line chart.
- Language Distribution over Time: store per-snapshot language stats; trend.

Deliverable: rich analytics in Activity & Community.

## Phase 3 — Gamification & Motivation (Week 8–9)
- Achievement Badges: rules (100 commits/mo, first merged PR, 5★ repo) evaluated in `build.mjs`; XP section.
- Bloom Percentage / Health Score: composite per-repo score (commit frequency, issue resolution, CI pass rate) in Health.
- Developer Persona: analyze commit messages / PR descriptions / issue comments; persona label (keyword matching).

Deliverable: shareable, motivating profile elements.

## Phase 4 — Productivity & Workflow (Week 10–11)
- PR & Issue Triage Dashboard: fetch open PRs/issues across repos; flag stale, needs review, recently merged. New **Triage** tab.
- Release & Milestone Tracker: releases + milestones; upcoming + progress. Enhance Repositories.
- Proof of Shipping Card expansion: release dates + PR links.

Deliverable: workflow cockpit.

## Phase 5 — Customization & Sharing (Week 12–13)
- **Profile README Generator**: form to pick badges, stats cards, banners; output Markdown snippet. (shields.io, github-readme-stats, Capsule Render)
- Exportable Stats Cards: render any widget to SVG/PNG (canvas / server SVG); "Export" button.
- Theme & Layout Customization: drag-and-drop bento grid; save to localStorage (CSS Grid, SortableJS).

Deliverable: users generate/export Pulse data for their GitHub profile.

## Phase 6 — Technical & Community (Week 14–16)
- GitHub Actions Auto-Snapshot: daily workflow commits snapshot; optional PR preview.
- Multi-User Support: `?user=...` query param; side-by-side compare.
- Plugin Architecture: widget interface `{ id, requiredData, render() }`; community widgets in `src/widgets/community/`.
- Starred Repositories Library: `/users/:user/starred`; search/filter in Community.
- Follower & Reach Analytics: top-referring repos + star growth.

Deliverable: extensible, multi-user, community-driven Pulse.

## Cross-cutting concerns
- Rate limits: PAT in Actions; ETags; client-side conditional requests.
- Caching: raw API responses in `cache/`; refetch only when needed.
- Testing: unit tests for aggregation (jest/vitest); visual regression (Playwright).
- Deployment: GitHub Pages / Vercel / Netlify; ensure `snapshot.json` built at deploy.
- Error handling: each widget shows fallback when data missing.

## Timeline summary
| Phase | Focus | Duration |
|---|---|---|
| 0 | Foundation | 2 weeks |
| 1 | Quick Wins | 2 weeks |
| 2 | Analytics | 3 weeks |
| 3 | Gamification | 2 weeks |
| 4 | Productivity | 2 weeks |
| 5 | Customization | 2 weeks |
| 6 | Technical & Community | 3 weeks |
| **Total** | | **~16 weeks (part-time)** |

## Recommended next steps
1. Start with Phase 0 + Phase 1 (Language Pie Chart & Contribution Heatmap) for immediate visible value — **plus the Profile README tab** (feature request above).
2. Create a GitHub Project board with these tasks.
3. Open feature branch `feat/language-pie` and implement the first widget.
