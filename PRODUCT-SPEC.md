# Pulse — Personal GitHub Command Center (Product Spec)

---

## 1. Product Overview

Pulse is a personal, mobile-first developer command center powered by GitHub.

It is **not** intended to look like GitHub and should not simply reproduce GitHub's repository interface.

**GitHub is the data source. Pulse is the interface.**

The application turns GitHub repositories, commits, pull requests, workflows, CI results, releases, stars, forks, issues, deployments, incidents and activity into a real-time visual command center.

The primary experience should answer:

> **"What is happening across my software projects right now?"**

The product should feel closer to a futuristic developer operations cockpit than a conventional status page.

The site should be deployable to GitHub Pages for the static frontend. Dynamic/realtime functionality should be designed so that the frontend can remain static while a minimal external realtime layer can be added when true push-based updates are required.

---

## 2. Product Goals

### Primary goals

- Provide a real-time view of personal GitHub activity.
- Monitor multiple repositories from one interface.
- Switch between repositories instantly.
- Display actual GitHub statistics.
- Display running GitHub Actions workflows and CI status.
- Display pull requests, issues, commits, releases, stars and forks.
- Provide live and historical graphs.
- Show incidents and errors clearly.
- Provide repository health/reliability information.
- Turn development activity into an XP/reward system.
- Provide a visually impressive desktop command center.
- Provide an excellent mobile experience.
- Provide PWA support.
- Provide intelligent shortcuts into GitHub and external development tools.
- Remain lightweight.
- Avoid unnecessary backend infrastructure.
- Keep the public frontend safe from GitHub credentials.

### Non-goals for MVP

- Building a replacement for GitHub.
- Editing repository files directly inside Pulse.
- Running arbitrary code on Pulse infrastructure.
- Hosting Git repositories.
- Becoming a full CI/CD platform.
- Building an AI coding agent.
- Exposing private credentials.
- Recreating every GitHub feature.

---

## 3. Core Concept

Pulse consists of six major layers:

```
GitHub
   │
   ├── Repositories
   ├── Commits
   ├── Pull requests
   ├── Issues
   ├── Stars
   ├── Forks
   ├── Releases
   ├── Actions
   └── Workflow runs
          │
          ▼
   Data / Event Layer
          │
          ▼
   Normalized Pulse Data
          │
          ▼
   Dashboard Engine
          │
          ├── Command Center
          ├── Repository Dashboard
          ├── CI Dashboard
          ├── Community Dashboard
          ├── Reliability Dashboard
          ├── Activity Dashboard
          └── XP Dashboard
          │
          ▼
   Mobile / Desktop UI
```

---

## 4. Visual Identity

Pulse should **not** look like GitHub.

### Avoid

- GitHub-style repository pages.
- Generic admin dashboards.
- Large tables.
- Excessive borders.
- Conventional SaaS layouts.
- Dense GitHub clones.
- Excessive neon effects.

### Use

- Dark-first interface.
- High-quality typography.
- Subtle glass/solid surfaces.
- Large numerical metrics.
- Animated status indicators.
- Smooth graph transitions.
- Subtle particle/grid effects where appropriate.
- Responsive cards.
- Minimal icons.
- Strong hierarchy.
- Generous desktop space.
- Thumb-friendly mobile controls.

The visual direction is:

> developer cockpit + observability platform + personal operating system.

Animation should communicate state rather than exist purely for decoration.

---

## 5. Main Navigation

### Desktop

```
COMMAND
REPOSITORIES
ACTIVITY
CI
COMMUNITY
HEALTH
XP
```

### Mobile

```
HOME
GRAPH
CI
MORE
```

The currently selected repository should remain accessible globally.

Example:

```
OMIX STORE ▾
```

Opening the selector:

```
ALL REPOSITORIES

OMIX STORE
FORGE@OMIX
THREADMYMAIL
PHIKILA
KEDIS
LOOMA
...
```

Selecting a repository updates the entire dashboard context.

---

## 6. Command Center

The default screen is the primary command center (overview dashboard).
