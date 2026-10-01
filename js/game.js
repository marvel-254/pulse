/**
 * Pulse Quests — the gamification layer.
 *
 * A visitor-facing progress system for a public showcase. Everything is
 * local-first: XP and badges live in this browser's localStorage, nothing is
 * sent anywhere, and no account is involved.
 *
 *   • Exploration badges — awarded for actually using the site (visiting
 *     sections, opening projects, using ⌘K, switching accounts…).
 *   • Showcase badges — derived from the real public GitHub data on screen
 *     (polyglot, prolific, release train…), so the profile itself is the game.
 *   • Levels, ranks, a HUD chip, an Overview strip and a badge sheet.
 */
(() => {
  "use strict";

  const STORE_KEY = "pulse-quests";
  const LEVEL_STEP = 45;
  const LEVEL_BASE = 60; // XP needed for level 2; each level costs 45 more

  const RANKS = [
    "Signal Scout",
    "Grid Runner",
    "Depth Diver",
    "Vector Pilot",
    "Core Architect",
    "Pulse Master",
    "Legend",
  ];

  /* ---- badge icon set (kept tiny and inline) ---- */
  const ICON = {
    compass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="3" rx="1.5"/><rect width="7" height="7" x="14" y="14" rx="1.5"/><rect width="7" height="7" x="3" y="14" rx="1.5"/></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    repo: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
    pipeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="6" y1="9" x2="6" y2="15"/><circle cx="18" cy="12" r="3"/><path d="M18 9a9 9 0 0 0-9 9"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    unlock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    split: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    bulb: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    cube: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" y1="22" x2="12" y2="12"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    readme: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>`,
  };

  /* ---- badge catalogue ---- */
  const BADGES = [
    // Exploration
    { id: "visit:overview", group: "explore", label: "First Light", desc: "Open the Overview", xp: 10, icon: "compass" },
    { id: "visit:highlights", group: "explore", label: "Scout", desc: "Reach the Highlights", xp: 10, icon: "layers" },
    { id: "visit:numbers", group: "explore", label: "Number Cruncher", desc: "Read the Numbers", xp: 10, icon: "grid" },
    { id: "visit:activity", group: "explore", label: "Signal Watcher", desc: "Watch the Activity stream", xp: 10, icon: "activity" },
    { id: "visit:projects", group: "explore", label: "Project Tour", desc: "Browse all Projects", xp: 10, icon: "repo" },
    { id: "visit:craft", group: "explore", label: "Craft Apprentice", desc: "See How I build", xp: 10, icon: "pipeline" },
    { id: "visit:about", group: "explore", label: "Face to Face", desc: "Visit About", xp: 10, icon: "user" },
    { id: "complete:tour", group: "explore", label: "Completionist", desc: "Visit all seven sections", xp: 50, icon: "trophy" },
    { id: "project:1", group: "explore", label: "First Dig", desc: "Open a project page", xp: 15, icon: "repo" },
    { id: "project:5", group: "explore", label: "Spelunker", desc: "Open 5 project pages", xp: 30, icon: "layers" },
    { id: "project:10", group: "explore", label: "Archaeologist", desc: "Open 10 project pages", xp: 50, icon: "compass" },
    { id: "action:palette", group: "explore", label: "Palette Master", desc: "Use the command palette (⌘K)", xp: 15, icon: "palette" },
    { id: "action:account", group: "explore", label: "Split Focus", desc: "Filter by a single account", xp: 15, icon: "split" },
    { id: "action:theme", group: "explore", label: "Light Switch", desc: "Toggle the theme", xp: 10, icon: "sun" },
    { id: "action:sync", group: "explore", label: "Fresh Data", desc: "Trigger a live refresh", xp: 15, icon: "refresh" },
    { id: "action:suggest", group: "explore", label: "Idea Dropper", desc: "Open the Suggest dialog", xp: 15, icon: "bulb" },
    { id: "action:share", group: "explore", label: "Signal Sharer", desc: "Share a link or copy a markdown summary", xp: 15, icon: "share" },
    { id: "action:depth", group: "explore", label: "Depth Diver", desc: "Toggle the 3D layer", xp: 10, icon: "cube" },
    { id: "action:contact", group: "explore", label: "Reaching Out", desc: "Follow a portfolio or blog link", xp: 15, icon: "globe" },
    { id: "action:music", group: "explore", label: "Soundtrack", desc: "Turn on the background music", xp: 15, icon: "music" },
    { id: "action:sound", group: "explore", label: "Tone Selector", desc: "Switch the soundtrack mood", xp: 15, icon: "volume" },
    { id: "action:moods", group: "explore", label: "Sound Sage", desc: "Try both soundtrack moods", xp: 25, icon: "music" },
    // Showcase (derived from real public GitHub data)
    { id: "data:polyglot", group: "profile", label: "Polyglot", desc: "5+ languages across the repos", xp: 25, icon: "layers" },
    { id: "data:prolific", group: "profile", label: "Prolific", desc: "25+ public repositories", xp: 25, icon: "repo" },
    { id: "data:shipper", group: "profile", label: "Shipper", desc: "10+ repos pushed in 30 days", xp: 25, icon: "pipeline" },
    { id: "data:release", group: "profile", label: "Release Train", desc: "5+ published releases", xp: 20, icon: "award" },
    { id: "data:documented", group: "profile", label: "Documented", desc: "10+ repos with a README", xp: 20, icon: "readme" },
    { id: "data:veteran", group: "profile", label: "Veteran", desc: "An account older than 2 years", xp: 20, icon: "trophy" },
    { id: "data:traction", group: "profile", label: "Traction", desc: "5+ stars earned", xp: 20, icon: "star" },
    { id: "data:vault", group: "profile", label: "Vault", desc: "40+ public repositories", xp: 35, icon: "cube" },
  ];

  const TOTAL_XP = BADGES.reduce((a, b) => a + b.xp, 0);

  /* ---- state ---- */
  const emptyState = () => ({
    xp: 0,
    unlocked: {},
    views: [],
    projects: [],
    actions: [],
    seen: {},
    updated: null,
  });

  let state = load();
  let snapshot = null;

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return emptyState();
      const parsed = JSON.parse(raw);
      return { ...emptyState(), ...parsed };
    } catch {
      return emptyState();
    }
  }

  function save() {
    state.updated = new Date().toISOString();
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch {}
  }

  /* ---- levels ---- */
  const xpForLevel = (level) => LEVEL_BASE + (level - 1) * LEVEL_STEP; // XP to go from `level` to `level+1`

  function levelInfo(xp = state.xp) {
    let level = 1;
    let remaining = xp;
    while (remaining >= xpForLevel(level)) {
      remaining -= xpForLevel(level);
      level++;
    }
    const need = xpForLevel(level);
    return {
      level,
      into: remaining,
      need,
      pct: Math.round((remaining / need) * 100),
      rank: RANKS[Math.min(RANKS.length - 1, level - 1)],
    };
  }

  /* ---- awarding ---- */
  function unlock(id, { silent = false } = {}) {
    const badge = BADGES.find((b) => b.id === id);
    if (!badge || state.unlocked[id]) return false;
    const before = levelInfo();
    state.unlocked[id] = new Date().toISOString();
    state.xp += badge.xp;
    save();
    const after = levelInfo();
    if (!silent) {
      badgeToast(badge, after.level > before.level ? after : null);
      if (after.level > before.level) {
        window.PulseDepth?.burst(null, 140, "violet", 40);
      }
    }
    mount();
    return true;
  }

  const awardAction = (action) => {
    if (!state.actions.includes(action)) state.actions.push(action);
    save();
  };

  function visit(view) {
    if (!view) return;
    if (!state.views.includes(view)) state.views.push(view);
    state.seen[view] = Date.now();
    save();
    unlock(`visit:${view}`, { silent: true });
    const sections = ["overview", "highlights", "numbers", "activity", "projects", "craft", "about"];
    if (sections.every((s) => state.views.includes(s))) unlock("complete:tour");
    mount();
  }

  function openProject(name) {
    if (!name) return;
    if (!state.projects.includes(name)) state.projects.push(name);
    save();
    if (state.projects.length >= 1) unlock("project:1", { silent: true });
    if (state.projects.length >= 5) unlock("project:5");
    if (state.projects.length >= 10) unlock("project:10");
    mount();
  }

  function action(name) {
    awardAction(name);
    unlock(`action:${name}`);
  }

  /** Derive showcase badges from whatever public data is on screen. */
  function syncSnapshot(next) {
    if (!next) return;
    snapshot = next;
    const repos = (next.repos || []).filter((r) => r && !r.isPrivate);
    if (!repos.length) return;

    const languages = new Set(repos.map((r) => r.language).filter(Boolean));
    const recent = repos.filter((r) => Date.now() - new Date(r.pushedAt).getTime() < 30 * 864e5).length;
    const releases = (next.extras || []).reduce((a, x) => a + (x.releases || []).length, 0);
    const documented = repos.filter((r) => r.readmeExcerpt).length;
    const stars = repos.reduce((a, r) => a + (r.stars || 0), 0);
    const oldest = repos
      .map((r) => next.accounts?.find((a) => a.login === (r.owner || (r.fullName || "").split("/")[0]))?.createdAt || next.user?.createdAt)
      .filter(Boolean)
      .sort()[0];
    const years = oldest ? (Date.now() - new Date(oldest).getTime()) / (365.25 * 864e5) : 0;

    const checks = [
      [languages.size >= 5, "data:polyglot"],
      [repos.length >= 25, "data:prolific"],
      [recent >= 10, "data:shipper"],
      [releases >= 5, "data:release"],
      [documented >= 10, "data:documented"],
      [years >= 2, "data:veteran"],
      [stars >= 5, "data:traction"],
      [repos.length >= 40, "data:vault"],
    ];
    // Showcase badges are derived from the data, so several can land at once.
    // Announce them in a single toast instead of a burst of six.
    const newly = [];
    for (const [ok, id] of checks) {
      if (ok && unlock(id, { silent: true })) newly.push(id);
    }
    if (newly.length === 1) {
      badgeToast(BADGES.find((b) => b.id === newly[0]));
    } else if (newly.length > 1) {
      const xp = newly.reduce((a, id) => a + (BADGES.find((b) => b.id === id)?.xp || 0), 0);
      summaryToast(`${newly.length} showcase badges unlocked`, `Derived from the public GitHub data · +${xp} XP`);
    }
    mount();
  }

  /* ---- achievement toast ---- */
  function badgeToast(badge, level) {
    const host = document.getElementById("questToasts") || document.body;
    const el = document.createElement("div");
    el.className = "quest-toast";
    el.innerHTML = `
      <span class="qt-ic">${ICON.unlock}</span>
      <span class="qt-body">
        <span class="qt-label">Badge unlocked · ${escapeHtml(badge.label)}</span>
        <span class="qt-desc">${escapeHtml(badge.desc)} <b>+${badge.xp} XP</b></span>
      </span>`;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 400);
    }, 3600);

    if (level) {
      const lv = document.createElement("div");
      lv.className = "quest-toast level";
      lv.innerHTML = `
        <span class="qt-ic">${ICON.trophy}</span>
        <span class="qt-body">
          <span class="qt-label">Level ${level.level} · ${escapeHtml(level.rank)}</span>
          <span class="qt-desc">${state.xp} XP earned exploring this profile</span>
        </span>`;
      host.appendChild(lv);
      requestAnimationFrame(() => lv.classList.add("show"));
      setTimeout(() => {
        lv.classList.remove("show");
        setTimeout(() => lv.remove(), 400);
      }, 5200);
    }
  }

  function summaryToast(label, desc) {
    const host = document.getElementById("questToasts") || document.body;
    const el = document.createElement("div");
    el.className = "quest-toast level";
    el.innerHTML = `
      <span class="qt-ic">${ICON.trophy}</span>
      <span class="qt-body">
        <span class="qt-label">${escapeHtml(label)}</span>
        <span class="qt-desc">${escapeHtml(desc)}</span>
      </span>`;
    host.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 400);
    }, 4600);
  }

  const escapeHtml = (s) =>
    String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---- HUD rendering ---- */
  function unlockedCount() {
    return BADGES.filter((b) => state.unlocked[b.id]).length;
  }

  function nextObjectives(limit = 3) {
    const locked = BADGES.filter((b) => !state.unlocked[b.id]);
    const order = ["explore", "profile"];
    return locked
      .sort((a, b) => order.indexOf(a.group) - order.indexOf(b.group) || a.xp - b.xp)
      .slice(0, limit);
  }

  function chipHtml() {
    const lv = levelInfo();
    return `
      <button class="quest-chip" id="questChipBtn" title="Explorer level ${lv.level} — ${state.xp} XP · ${unlockedCount()}/${BADGES.length} badges">
        <span class="qc-ring" style="--pct:${lv.pct}">
          <span class="qc-level">${lv.level}</span>
        </span>
        <span class="qc-meta">
          <span class="qc-xp">${state.xp} XP</span>
          <span class="qc-bar"><i style="width:${lv.pct}%"></i></span>
        </span>
      </button>`;
  }

  function stripHtml() {
    const lv = levelInfo();
    const goals = nextObjectives(3);
    return `
      <div class="card col2 quest-strip" data-tilt>
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--violet)">${ICON.trophy}</span> Explorer Progress</div>
          <button class="btn btn-sm" id="questOpenBtn">All badges</button>
        </div>
        <div class="quest-level-row">
          <div class="quest-level">
            <span class="ql-num">Lv ${lv.level}</span>
            <span class="ql-rank">${escapeHtml(lv.rank)}</span>
          </div>
          <div class="quest-level-meta">
            <span><b>${state.xp}</b> / ${TOTAL_XP} XP</span>
            <span>${unlockedCount()} / ${BADGES.length} badges</span>
            <span>${state.projects.length} projects opened</span>
          </div>
        </div>
        <div class="quest-bar"><i style="width:${Math.round((state.xp / TOTAL_XP) * 100)}%"></i></div>
        <div class="quest-goals">
          ${goals
            .map(
              (b) => `
            <div class="quest-goal">
              <span class="qg-ic">${ICON[b.icon] || ICON.lock}</span>
              <span class="qg-body">
                <span class="qg-label">${escapeHtml(b.label)}</span>
                <span class="qg-desc">${escapeHtml(b.desc)}</span>
              </span>
              <span class="qg-xp">+${b.xp}</span>
            </div>`
            )
            .join("")}
        </div>
        <div class="quest-foot">Level ${lv.level + 1} in ${Math.max(0, lv.need - lv.into)} XP · progress is stored only in your browser</div>
      </div>`;
  }

  function sheetHtml() {
    const lv = levelInfo();
    const groups = [
      ["explore", "Exploration", "Earned by actually using this site"],
      ["profile", "Showcase", "Earned by the public GitHub data on display"],
    ];
    const depthOn = window.PulseDepth?.isEnabled?.() ?? true;
    return `
      <div class="sheet-head">
        <div>
          <div class="sheet-title">Pulse Quests</div>
          <div class="sheet-sub">Explorer level ${lv.level} · ${escapeHtml(lv.rank)} · ${state.xp} XP</div>
        </div>
        <button class="sheet-close" id="questCloseBtn">✕</button>
      </div>

      <div class="quest-sheet-level">
        <div class="quest-bar big"><i style="width:${lv.pct}%"></i></div>
        <div class="quest-level-meta">
          <span><b>${lv.into}</b> / ${lv.need} XP to level ${lv.level + 1}</span>
          <span>${unlockedCount()} / ${BADGES.length} badges · ${state.projects.length} projects opened</span>
        </div>
      </div>

      ${groups
        .map(
          ([key, title, sub]) => `
        <div class="badge-group">
          <div class="badge-group-head">
            <h3>${title}</h3>
            <span>${sub}</span>
          </div>
          <div class="badge-grid">
            ${BADGES.filter((b) => b.group === key)
              .map((b) => {
                const has = !!state.unlocked[b.id];
                return `
                <div class="badge ${has ? "unlocked" : "locked"}">
                  <span class="badge-ic">${ICON[b.icon] || ICON.trophy}</span>
                  <span class="badge-body">
                    <span class="badge-label">${escapeHtml(b.label)}</span>
                    <span class="badge-desc">${escapeHtml(b.desc)}</span>
                  </span>
                  <span class="badge-xp">${has ? "✓" : "+" + b.xp}</span>
                </div>`;
              })
              .join("")}
          </div>
        </div>`
        )
        .join("")}

      <div class="quest-sheet-foot">
        <button class="btn btn-sm" id="questDepthBtn">${depthOn ? "3D layer: ON" : "3D layer: OFF"}</button>
        <button class="btn btn-sm" id="questResetBtn">Reset progress</button>
      </div>
      <div class="quest-note">Your XP, badges and counters never leave this browser — there is no account and nothing is sent to a server.</div>`;
  }

  function mount() {
    const chipHost = document.getElementById("questChip");
    if (chipHost) chipHost.innerHTML = chipHtml();
    const stripHost = document.getElementById("questStrip");
    if (stripHost) stripHost.innerHTML = stripHtml();
    bindChip();
  }

  let lastFocus = null;

  function bindChip() {
    document.getElementById("questChipBtn")?.addEventListener("click", openSheet);
    document.getElementById("questOpenBtn")?.addEventListener("click", openSheet);
  }

  function openSheet() {
    const overlay = document.getElementById("questOverlay");
    const sheet = document.getElementById("questSheet");
    if (!overlay || !sheet) return;
    sheet.innerHTML = sheetHtml();
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    if (!sheet.hasAttribute("tabindex")) sheet.setAttribute("tabindex", "-1");
    sheet.focus?.({ preventScroll: true });

    document.getElementById("questCloseBtn")?.addEventListener("click", closeSheet);
    document.getElementById("questResetBtn")?.addEventListener("click", () => {
      state = emptyState();
      save();
      sheet.innerHTML = sheetHtml();
      openSheet();
      mount();
    });
    document.getElementById("questDepthBtn")?.addEventListener("click", (e) => {
      const next = !(window.PulseDepth?.isEnabled?.() ?? true);
      window.PulseDepth?.setEnabled(next);
      action("depth");
      e.target.textContent = next ? "3D layer: ON" : "3D layer: OFF";
    });
  }

  function closeSheet() {
    const overlay = document.getElementById("questOverlay");
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    try { lastFocus?.focus?.({ preventScroll: true }); } catch {}
    lastFocus = null;
  }

  /* ---- init ---- */
  function init() {
    const overlay = document.getElementById("questOverlay");
    overlay?.addEventListener("click", (e) => {
      if (e.target.id === "questOverlay") closeSheet();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeSheet();
    });
    mount();
  }

  window.PulseQuests = {
    init,
    mount,
    visit,
    openProject,
    action,
    unlock,
    syncSnapshot,
    open: openSheet,
    state: () => ({ ...state, level: levelInfo() }),
    badges: BADGES,
    totalXp: TOTAL_XP,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => setTimeout(init, 0), { once: true });
  } else {
    setTimeout(init, 0);
  }
})();
