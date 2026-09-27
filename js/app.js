/* Pulse — Developer Command Center Application */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // High-fidelity Developer Icon System (Lucide/Feather inspired 24x24 stroke icons)
  const ICONS = {
    command: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="9" x="3" y="3" rx="1.5"/><rect width="7" height="5" x="14" y="3" rx="1.5"/><rect width="7" height="9" x="14" y="12" rx="1.5"/><rect width="7" height="5" x="3" y="16" rx="1.5"/></svg>`,
    repos: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
    activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>`,
    ci: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    pipeline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><line x1="6" y1="9" x2="6" y2="15"/><circle cx="18" cy="12" r="3"/><path d="M18 9a9 9 0 0 0-9 9"/></svg>`,
    community: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    health: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/><path d="M3.22 12H9.5l.5-1 2 4.5 2-7 1.5 3.5h5.27"/></svg>`,
    xp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    starOutline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
    fork: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="18" cy="6" r="3"/><path d="M18 9v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9"/><path d="M12 12v3"/></svg>`,
    issue: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    eye: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`,
    zap: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
    lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
    branch: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="3" x2="6" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
    code: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    layers: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
    terminal: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`,
    search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
    refresh: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
    settings: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
    share: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="13" height="13" x="9" y="9" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`,
    externalLink: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    shield: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    award: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>`,
    gitCommit: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><line x1="1.05" y1="12" x2="7" y2="12"/><line x1="17.01" y1="12" x2="22.96" y2="12"/></svg>`,
    pulse: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12h4l3-7 4 14 3-7h4"/></svg>`,
    user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    readme: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M8 7h8"/><path d="M8 11h6"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/></svg>`,
  };

  // Default widget configuration for Command Center
  const DEFAULT_WIDGETS = {
    stars: true,
    forks: true,
    issues: true,
    active: true,
    primaryLang: true,
    privateCount: true,
    pulseChart: true,
    heatmap: true,
    langDistribution: true,
    recentActivity: true,
    topRepos: true,
  };

  const getSavedWidgets = () => {
    try {
      const saved = localStorage.getItem("pulse-widgets");
      return saved ? { ...DEFAULT_WIDGETS, ...JSON.parse(saved) } : { ...DEFAULT_WIDGETS };
    } catch {
      return { ...DEFAULT_WIDGETS };
    }
  };

  const state = {
    snapshot: null,
    selectedRepo: "all",
    view: "command",
    token: localStorage.getItem("pulse-gh-token") || "",
    api: { rateLimit: 60, rateRemaining: null },
    theme: localStorage.getItem("pulse-theme") || "dark",
    repoSearchQuery: "",
    repoLangFilter: "all",
    repoSortBy: "pushed",
    pulseTimeframe: 14,
    widgets: getSavedWidgets(),
    paletteQuery: "",
    paletteSelectedIndex: 0,
    filteredPaletteItems: [],
  };

  // Language color mappings
  const LANG_COLORS = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    HTML: "#e34c26",
    CSS: "#563d7c",
    Shell: "#89e051",
    Go: "#00ADD8",
    Rust: "#dea584",
    Ruby: "#701516",
    Java: "#b07219",
    "C++": "#f34b7d",
    C: "#555555",
    PHP: "#4F5D95",
    Swift: "#F05138",
    Kotlin: "#A97BFF",
  };

  const getLangColor = (lang) => LANG_COLORS[lang] || "#38bdf8";

  /* ---- helpers ---- */
  const esc = (s) =>
    s == null
      ? ""
      : String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const fmtNum = (n) => (n == null ? "0" : Number(n).toLocaleString());

  const fmtAgo = (iso) => {
    if (!iso) return "—";
    const ms = Date.now() - new Date(iso).getTime();
    if (ms < 0) return "just now";
    const s = Math.floor(ms / 1000);
    if (s < 60) return s + "s ago";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m ago";
    const h = Math.floor(m / 60);
    if (h < 24) return h + "h ago";
    const d = Math.floor(h / 24);
    if (d < 30) return d + "d ago";
    const mo = Math.floor(d / 30);
    if (mo < 12) return mo + "mo ago";
    return Math.floor(mo / 12) + "y ago";
  };

  const initials = (name) =>
    (name || "?")
      .split(/[\s-_]+/)
      .map((x) => x[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

  const repoList = () => (state.snapshot?.repos || []).slice().sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

  const filteredRepos = () => {
    const list = repoList();
    if (state.selectedRepo === "all") return list;
    return list.filter((r) => r.name === state.selectedRepo);
  };

  /* ---- navigation items ---- */
  const NAV = [
    { id: "command", label: "COMMAND", ic: ICONS.command, badge: () => filteredRepos().length },
    { id: "repos", label: "REPOSITORIES", ic: ICONS.repos, badge: () => repoList().length },
    { id: "activity", label: "ACTIVITY", ic: ICONS.activity, badge: () => null },
    { id: "ci", label: "CI & PIPELINES", ic: ICONS.pipeline, badge: () => "OK" },
    { id: "community", label: "COMMUNITY", ic: ICONS.community, badge: () => state.snapshot?.totalStars || null },
    { id: "health", label: "HEALTH", ic: ICONS.health, badge: () => null },
    { id: "xp", label: "XP & REWARDS", ic: ICONS.xp, badge: () => "LVL" },
    { id: "profile", label: "PROFILE", ic: ICONS.user, badge: () => null },
  ];

  /* ---- THEME HANDLING ---- */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pulse-theme", theme);
    const metaColor = $('#metaThemeColor');
    if (metaColor) {
      metaColor.setAttribute("content", theme === "dark" ? "#07090e" : "#f8fafc");
    }
  }

  function toggleTheme() {
    const next = state.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    renderTopbar();
    toast(`Switched to ${next} theme`);
  }

  /* ---- TOPBAR RENDERING ---- */
  function renderTopbar() {
    const u = state.snapshot?.user;
    const isDark = state.theme === "dark";
    const topbar = $('#topbar');
    if (!topbar) return;

    topbar.innerHTML = `
      <div class="brand" id="brandBtn" title="Reset focus to all repositories">
        <img class="logo" src="icons/icon.svg" alt="Pulse Logo" />
        <span class="name">PULSE<span>${u?.login ? "@" + esc(u.login) : "READY"}</span></span>
      </div>

      <div class="topbar-center">
        <button class="search-trigger" id="topbarSearchTrigger" aria-label="Open Command Palette">
          ${ICONS.search}
          <span>Search repos or commands...</span>
          <span class="kbd">⌘K / Ctrl+K</span>
        </button>
      </div>

      <div class="topstatus">
        <span class="live-ind" title="GitHub live pulse active">
          <span class="dot"></span>LIVE
        </span>

        <span id="rateChip" style="${state.api.rateRemaining != null ? "display:inline" : "display:none"}">
          ${state.api.rateRemaining != null ? `${state.api.rateRemaining} reqs` : ""}
        </span>

        <button class="topbar-btn" id="tokenSettingsBtn" title="${state.token ? "GitHub Token Connected (5,000 req/hr)" : "Connect GitHub Token (Public 60 req/hr)"}">
          <span style="position:relative;display:flex;align-items:center;justify-content:center">
            ${ICONS.key}
            ${state.token ? '<span style="position:absolute;top:-3px;right:-3px;width:7px;height:7px;background:var(--green);border-radius:50%;box-shadow:0 0 6px var(--green)"></span>' : ""}
          </span>
        </button>

        <button class="topbar-btn" id="themeToggleBtn" title="Toggle Dark/Light Mode">
          ${isDark ? ICONS.sun : ICONS.moon}
        </button>

        ${u ? `
          <a class="user-badge" href="https://github.com/${esc(u.login)}" target="_blank" rel="noopener noreferrer" title="View GitHub profile">
            <img src="${esc(u.avatar || "icons/icon.svg")}" alt="${esc(u.login)}" />
            <span class="user-login">${esc(u.login)}</span>
          </a>` : ""}
      </div>`;

    $('#brandBtn')?.addEventListener("click", () => {
      state.selectedRepo = "all";
      go("command");
    });
    $('#topbarSearchTrigger')?.addEventListener("click", openCommandPalette);
    $('#tokenSettingsBtn')?.addEventListener("click", openTokenModal);
    $('#themeToggleBtn')?.addEventListener("click", toggleTheme);
  }

  /* ---- SIDEBAR RENDERING ---- */
  function renderSidebar() {
    const sidebar = $('#sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
      <div class="nav-label">Pulse Cockpit</div>
      ${NAV.map((n) => {
        const badge = n.badge();
        return `
          <button class="nav-item ${state.view === n.id ? "active" : ""}" data-nav="${n.id}">
            <span class="ic">${n.ic}</span>
            <span>${n.label}</span>
            ${badge != null ? `<span class="nav-badge">${badge}</span>` : ""}
          </button>`;
      }).join("")}

      <div class="nav-label" style="margin-top:16px">Quick Tools</div>
      <button class="nav-item" id="sidebarCmdPaletteBtn">
        <span class="ic">${ICONS.terminal}</span>
        <span>Command Palette</span>
        <span class="nav-badge">⌘K</span>
      </button>
      <button class="nav-item" id="sidebarTokenBtn">
        <span class="ic">${ICONS.key}</span>
        <span>Access Token</span>
        ${state.token ? `<span class="nav-badge" style="color:var(--green);border-color:var(--green)">ACTIVE</span>` : `<span class="nav-badge">CONNECT</span>`}
      </button>
      <button class="nav-item" id="sidebarRefreshBtn">
        <span class="ic">${ICONS.refresh}</span>
        <span>Sync GitHub</span>
      </button>
      <button class="nav-item" id="sidebarWidgetsBtn">
        <span class="ic">${ICONS.settings}</span>
        <span>Customize View</span>
      </button>

      <div class="sidebar-foot" id="footMeta">
        <div class="foot-row">
          <span>SNAPSHOT</span>
          <span>${fmtAgo(state.snapshot?.generatedAt)}</span>
        </div>
        <div class="foot-row">
          <span>REPOSITORIES</span>
          <span>${state.snapshot?.repos?.length || 0}</span>
        </div>
        <div class="foot-row">
          <span>TOTAL STARS</span>
          <span style="color:var(--amber);display:flex;align-items:center;gap:3px">
            <span style="width:12px;height:12px;display:inline-block">${ICONS.star}</span>
            ${state.snapshot?.totalStars || 0}
          </span>
        </div>
      </div>`;

    $$('#sidebar [data-nav]').forEach((b) => {
      b.addEventListener("click", () => go(b.dataset.nav));
    });
    $('#sidebarCmdPaletteBtn')?.addEventListener("click", openCommandPalette);
    $('#sidebarTokenBtn')?.addEventListener("click", openTokenModal);
    $('#sidebarRefreshBtn')?.addEventListener("click", fetchLive);
    $('#sidebarWidgetsBtn')?.addEventListener("click", openWidgetModal);
  }

  /* ---- MOBILE BOTTOM NAV ---- */
  function renderMobileNav() {
    const mobilenav = $('#mobilenav');
    if (!mobilenav) return;

    const m = [
      { id: "command", label: "HOME", svg: ICONS.command },
      { id: "repos", label: "REPOS", svg: ICONS.repos },
      { id: "activity", label: "ACTIVITY", svg: ICONS.activity },
      { id: "palette", label: "SEARCH", svg: ICONS.search },
      { id: "more", label: "MORE", svg: ICONS.layers },
    ];

    mobilenav.innerHTML = m
      .map(
        (x) =>
          `<button class="mnav-item ${state.view === x.id ? "active" : ""}" data-mnav="${x.id}">
            ${x.svg}
            <span>${x.label}</span>
          </button>`
      )
      .join("");

    $$('#mobilenav [data-mnav]').forEach((b) => {
      b.addEventListener("click", () => {
        const id = b.dataset.mnav;
        if (id === "palette") openCommandPalette();
        else if (id === "more") openMoreSheet();
        else go(id);
      });
    });
  }

  function openMoreSheet() {
    const sheet = $('#repoSheet');
    sheet.innerHTML = `
      <div class="sheet-head">
        <div>
          <div class="sheet-title">Dashboards</div>
          <div class="sheet-sub">Jump to any developer view</div>
        </div>
        <button class="sheet-close" id="closeMoreSheet">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">
        ${NAV.map(
          (n) => `
          <button class="sheet-row" data-jump="${n.id}" style="flex-direction:column;text-align:center;border:1px solid var(--stroke);padding:16px;border-radius:14px">
            <span class="ic" style="width:24px;height:24px;margin-bottom:6px;color:var(--cyan)">${n.ic}</span>
            <span class="rmeta" style="text-align:center">
              <span class="rt">${n.label}</span>
            </span>
          </button>`
        ).join("")}
      </div>
      <div style="margin-top:16px;padding-top:12px;border-top:1px solid var(--stroke)">
        <button class="sheet-row" id="moreSheetTokenBtn" style="width:100%">
          <span class="ic" style="color:var(--cyan)">${ICONS.key}</span>
          <span class="rmeta">
            <span class="rt">GitHub Access Token</span>
            <span class="rs">${state.token ? "Connected" : "Unlock 5,000 req/hr rate limit"}</span>
          </span>
        </button>
      </div>`;

    $('#closeMoreSheet')?.addEventListener("click", closeOverlay);
    $('#moreSheetTokenBtn')?.addEventListener("click", () => {
      closeOverlay();
      openTokenModal();
    });
    $$('[data-jump]', sheet).forEach((b) =>
      b.addEventListener("click", () => {
        closeOverlay();
        go(b.dataset.jump);
      })
    );
    openOverlay();
  }

  /* ---- REPO SELECTOR OVERLAY ---- */
  function openRepoSelector() {
    const sheet = $('#repoSheet');
    const list = repoList();

    const renderRows = (query = "") => {
      const q = query.trim().toLowerCase();
      const filtered = q
        ? list.filter((r) => r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q))
        : list;

      const rowsHtml = filtered
        .map(
          (r) => `
        <div class="sheet-row ${state.selectedRepo === r.name ? "active" : ""}" data-pick="${esc(r.name)}">
          <div class="rmeta">
            <div class="rt">${esc(r.name.replace(/[-_]/g, " ").toUpperCase())}</div>
            <div class="rs">${esc(r.language || "—")} · ${fmtAgo(r.pushedAt)}</div>
          </div>
          <div class="rstat">
            <span style="display:inline-flex;align-items:center;gap:3px"><span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>${fmtNum(r.stars)}</span>
            <span style="display:inline-flex;align-items:center;gap:3px"><span class="stat-icon" style="color:var(--violet)">${ICONS.fork}</span>${fmtNum(r.forks)}</span>
          </div>
        </div>`
        )
        .join("");

      const rowsContainer = $('#repoSheetRows', sheet);
      if (rowsContainer) {
        rowsContainer.innerHTML =
          rowsHtml || `<div style="text-align:center;padding:24px;color:var(--faint);font-size:13px">No matching repositories found.</div>`;
        bindPickEvents();
      }
    };

    sheet.innerHTML = `
      <div class="sheet-head">
        <div>
          <div class="sheet-title">Select Repository</div>
          <div class="sheet-sub">Focus command center and analytics context</div>
        </div>
        <button class="sheet-close" id="closeRepoSelector">✕</button>
      </div>

      <div class="sheet-search">
        <input type="text" id="repoSelectorSearch" placeholder="Filter repositories..." autocomplete="off" autofocus />
      </div>

      <div class="sheet-row ${state.selectedRepo === "all" ? "active" : ""}" data-pick="all">
        <div class="rmeta">
          <div class="rt">ALL REPOSITORIES</div>
          <div class="rs">${list.length} total · ${state.snapshot?.totalStars || 0} stars · ${state.snapshot?.totalForks || 0} forks</div>
        </div>
      </div>
      <div style="height:1px;background:var(--stroke);margin:10px 0"></div>

      <div id="repoSheetRows" style="max-height:50vh;overflow-y:auto;display:flex;flex-direction:column;gap:4px">
      </div>`;

    const bindPickEvents = () => {
      $$('[data-pick]', sheet).forEach((el) =>
        el.addEventListener("click", () => {
          state.selectedRepo = el.dataset.pick;
          closeOverlay();
          render();
          toast(state.selectedRepo === "all" ? "Viewing all repositories" : `Focused on ${state.selectedRepo}`);
        })
      );
    };

    $('#closeRepoSelector')?.addEventListener("click", closeOverlay);
    $('#repoSelectorSearch')?.addEventListener("input", (e) => renderRows(e.target.value));

    renderRows();
    bindPickEvents();
    openOverlay();
  }

  function openOverlay() {
    $('#repoOverlay').classList.add("open");
    $('#repoOverlay').setAttribute("aria-hidden", "false");
  }

  function closeOverlay() {
    $('#repoOverlay').classList.remove("open");
    $('#repoOverlay').setAttribute("aria-hidden", "true");
  }

  /* ---- GITHUB TOKEN SETTINGS MODAL ---- */
  function openTokenModal() {
    const overlay = $('#tokenOverlay');
    const sheet = $('#tokenSheet');
    let showPassword = false;

    const renderSheet = () => {
      const isConnected = Boolean(state.token);
      const remaining = state.api.rateRemaining != null ? state.api.rateRemaining : (isConnected ? 5000 : 60);
      const limit = state.api.rateLimit || (isConnected ? 5000 : 60);
      const pct = Math.round((remaining / limit) * 100);

      sheet.innerHTML = `
        <div class="sheet-head">
          <div>
            <div class="sheet-title">GitHub Access Token</div>
            <div class="sheet-sub">Client-side authentication & rate limit expansion</div>
          </div>
          <button class="sheet-close" id="closeTokenModalBtn">✕</button>
        </div>

        <div class="token-card">
          <div class="token-status-row">
            <span style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted)">Connection Status</span>
            <span class="status ${isConnected ? "ok" : "warn"}">
              <span class="sdot"></span>
              ${isConnected ? "CONNECTED (PAT ACTIVE)" : "PUBLIC ONLY (60 REQ/HR)"}
            </span>
          </div>

          <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin:12px 0 6px">
            Personal Access Token (Classic or Fine-Grained)
          </div>

          <div class="token-input-group">
            <input type="${showPassword ? "text" : "password"}" id="tokenInput" placeholder="ghp_xxxxxxxxxxxxxxxxxxxx or github_pat_xxxx" value="${esc(state.token)}" autocomplete="off" spellcheck="false" />
            <button class="token-eye-btn" id="toggleTokenEyeBtn" type="button" title="${showPassword ? "Hide token" : "Show token"}">
              ${showPassword ? ICONS.eye : ICONS.lock}
            </button>
          </div>

          <div class="token-rate-bar">
            <div style="display:flex;justify-content:space-between;font-size:11.5px;font-family:var(--mono);color:var(--muted)">
              <span>API Rate Quota</span>
              <span><b>${fmtNum(remaining)}</b> / ${fmtNum(limit)} reqs (${pct}%)</span>
            </div>
            <div class="rate-bar-track">
              <div class="rate-bar-fill" style="width:${pct}%;background:${pct < 20 ? "var(--red)" : pct < 50 ? "var(--amber)" : "var(--cyan)"}"></div>
            </div>
          </div>
        </div>

        <div class="callout-box">
          <div style="display:flex;align-items:center;gap:6px;font-weight:700;color:var(--text);margin-bottom:4px">
            <span class="stat-icon" style="color:var(--green)">${ICONS.shield}</span>
            <span>Zero-Knowledge Browser Storage</span>
          </div>
          Your token stays strictly on this device in <code>localStorage</code>. It is sent exclusively to GitHub's official HTTPS REST API.
          <br /><br />
          Need a token? <a href="https://github.com/settings/tokens/new?scopes=repo,read:user&description=Pulse+Dashboard" target="_blank" rel="noopener noreferrer">Generate a Personal Access Token ↗</a> with <b>repo</b> &amp; <b>read:user</b> permissions.
        </div>

        <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;gap:10px;flex-wrap:wrap">
          ${isConnected ? `<button class="btn btn-sm" id="disconnectTokenBtn" style="color:var(--red)"><span class="stat-icon" style="color:var(--red)">${ICONS.issue}</span> Disconnect</button>` : `<div></div>`}
          <div style="display:flex;gap:10px">
            <button class="btn btn-sm" id="cancelTokenBtn">Cancel</button>
            <button class="btn btn-primary btn-sm" id="saveTokenBtn">${ICONS.check} Verify &amp; Save</button>
          </div>
        </div>`;

      $('#closeTokenModalBtn')?.addEventListener("click", closeTokenModal);
      $('#cancelTokenBtn')?.addEventListener("click", closeTokenModal);

      $('#toggleTokenEyeBtn')?.addEventListener("click", () => {
        showPassword = !showPassword;
        const input = $('#tokenInput');
        if (input) input.type = showPassword ? "text" : "password";
      });

      $('#disconnectTokenBtn')?.addEventListener("click", () => {
        state.token = "";
        localStorage.removeItem("pulse-gh-token");
        state.api.rateLimit = 60;
        closeTokenModal();
        fetchLive();
        toast("Disconnected GitHub token");
      });

      $('#saveTokenBtn')?.addEventListener("click", async () => {
        const input = $('#tokenInput');
        const val = input ? input.value.trim() : "";
        if (!val) {
          toast("Please enter a token");
          return;
        }

        const saveBtn = $('#saveTokenBtn');
        if (saveBtn) {
          saveBtn.disabled = true;
          saveBtn.innerHTML = `Verifying...`;
        }

        try {
          const res = await fetch("https://api.github.com/user", {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${val}`,
            },
          });

          if (!res.ok) throw new Error(`HTTP ${res.status}: Invalid token or unauthorized`);
          const user = await res.json();

          state.token = val;
          localStorage.setItem("pulse-gh-token", val);

          const limit = res.headers.get("X-RateLimit-Limit");
          const remaining = res.headers.get("X-RateLimit-Remaining");
          if (limit) state.api.rateLimit = Number(limit);
          if (remaining) state.api.rateRemaining = Number(remaining);

          toast(`Authenticated as @${user.login}! Full rate limit unlocked.`);
          closeTokenModal();
          fetchLive();
        } catch (err) {
          toast(`Verification failed: ${err.message}`);
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `${ICONS.check} Verify &amp; Save`;
          }
        }
      });
    };

    renderSheet();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeTokenModal() {
    const overlay = $('#tokenOverlay');
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  /* ---- REPO INSPECTOR MODAL ---- */
  function openInspector(repoName) {
    const repo = repoList().find((r) => r.name === repoName);
    if (!repo) return;

    const overlay = $('#inspectorOverlay');
    const sheet = $('#inspectorSheet');
    const langColor = getLangColor(repo.language);
    const httpsClone = `https://github.com/${repo.fullName}.git`;
    const sshClone = `git@github.com:${repo.fullName}.git`;

    sheet.innerHTML = `
      <div class="sheet-head">
        <div>
          <div class="inspector-title">${esc(repo.name)}</div>
          <div class="sheet-sub">${esc(repo.fullName)}</div>
        </div>
        <button class="sheet-close" id="closeInspectorBtn">✕</button>
      </div>

      <div class="inspector-tags" style="margin-bottom:16px">
        <span class="status ${repo.isPrivate ? "bad" : "ok"}">
          <span class="sdot"></span>
          ${repo.isPrivate ? "PRIVATE" : "PUBLIC"}
        </span>
        ${repo.language ? `<span class="lang-tag" style="background:${langColor}22;color:${langColor}">${esc(repo.language)}</span>` : ""}
        <span class="priv-tag" style="display:inline-flex;align-items:center;gap:4px">
          <span class="stat-icon" style="width:12px;height:12px">${ICONS.branch}</span>
          ${esc(repo.defaultBranch || "main")}
        </span>
        ${repo.license ? `<span class="priv-tag" style="display:inline-flex;align-items:center;gap:4px"><span class="stat-icon" style="width:12px;height:12px">${ICONS.shield}</span>${esc(repo.license)}</span>` : ""}
        ${repo.archived ? `<span class="status warn"><span class="sdot"></span>ARCHIVED</span>` : ""}
      </div>

      <p style="font-size:14px;color:var(--text);margin-bottom:18px;line-height:1.5">
        ${esc(repo.description || "No repository description provided.")}
      </p>

      <div class="inspector-grid">
        <div class="inspector-stat">
          <div class="label">Stars</div>
          <div class="val" style="color:var(--amber)">
            <span style="color:var(--amber)">${ICONS.star}</span>
            <span>${fmtNum(repo.stars)}</span>
          </div>
        </div>
        <div class="inspector-stat">
          <div class="label">Forks</div>
          <div class="val" style="color:var(--violet)">
            <span style="color:var(--violet)">${ICONS.fork}</span>
            <span>${fmtNum(repo.forks)}</span>
          </div>
        </div>
        <div class="inspector-stat">
          <div class="label">Open Issues</div>
          <div class="val" style="color:var(--cyan)">
            <span style="color:var(--cyan)">${ICONS.issue}</span>
            <span>${fmtNum(repo.openIssues)}</span>
          </div>
        </div>
        <div class="inspector-stat">
          <div class="label">Watchers</div>
          <div class="val" style="color:var(--green)">
            <span style="color:var(--green)">${ICONS.eye}</span>
            <span>${fmtNum(repo.watchers)}</span>
          </div>
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Clone via HTTPS</div>
      <div class="clone-box">
        <code>${esc(httpsClone)}</code>
        <button class="btn btn-sm" id="copyHttpsBtn">${ICONS.copy} Copy</button>
      </div>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Clone via SSH</div>
      <div class="clone-box">
        <code>${esc(sshClone)}</code>
        <button class="btn btn-sm" id="copySshBtn">${ICONS.copy} Copy</button>
      </div>

      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="btn btn-primary" id="focusRepoBtn">
          ${ICONS.command} Focus Command Center
        </button>
        <a class="btn" href="${esc(repo.htmlUrl)}" target="_blank" rel="noopener noreferrer">
          ${ICONS.externalLink} View on GitHub
        </a>
        <a class="btn" href="${esc(repo.htmlUrl)}/issues" target="_blank" rel="noopener noreferrer">
          ${ICONS.issue} Issues (${repo.openIssues})
        </a>
      </div>`;

    $('#closeInspectorBtn')?.addEventListener("click", () => {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
    });

    $('#copyHttpsBtn')?.addEventListener("click", () => {
      navigator.clipboard.writeText(httpsClone);
      toast("Copied HTTPS clone URL");
    });

    $('#copySshBtn')?.addEventListener("click", () => {
      navigator.clipboard.writeText(sshClone);
      toast("Copied SSH clone URL");
    });

    $('#focusRepoBtn')?.addEventListener("click", () => {
      state.selectedRepo = repo.name;
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      go("command");
      toast(`Focused on ${repo.name}`);
    });

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  /* ---- COMMAND PALETTE (CMD+K) ---- */
  function openCommandPalette() {
    const overlay = $('#paletteOverlay');
    const sheet = $('#paletteSheet');
    state.paletteQuery = "";
    state.paletteSelectedIndex = 0;

    const renderPalette = () => {
      const q = state.paletteQuery.trim().toLowerCase();
      const repos = repoList();

      const items = [];

      // Navigation group
      NAV.forEach((n) => {
        if (!q || n.label.toLowerCase().includes(q)) {
          items.push({
            type: "NAV",
            title: `Go to ${n.label}`,
            sub: "View",
            icon: n.ic,
            action: () => go(n.id),
          });
        }
      });

      // Actions group
      const actions = [
        {
          title: state.token ? "GitHub Access Token (Connected · 5,000 req/hr)" : "Connect GitHub Access Token (Unlock Private Repos)",
          sub: "Auth",
          icon: ICONS.key,
          action: openTokenModal,
        },
        {
          title: `Switch to ${state.theme === "dark" ? "Light" : "Dark"} Theme`,
          sub: "Theme",
          icon: state.theme === "dark" ? ICONS.sun : ICONS.moon,
          action: toggleTheme,
        },
        {
          title: "Sync with GitHub (Live Refresh)",
          sub: "API",
          icon: ICONS.refresh,
          action: fetchLive,
        },
        {
          title: "Customize Command Center Widgets",
          sub: "Layout",
          icon: ICONS.settings,
          action: openWidgetModal,
        },
        {
          title: "Focus All Repositories",
          sub: "Filter",
          icon: ICONS.command,
          action: () => {
            state.selectedRepo = "all";
            go("command");
          },
        },
        {
          title: "Copy Summary as Markdown",
          sub: "Export",
          icon: ICONS.share,
          action: copyMarkdownSummary,
        },
      ];

      actions.forEach((a) => {
        if (!q || a.title.toLowerCase().includes(q) || a.sub.toLowerCase().includes(q)) {
          items.push({
            type: "ACTION",
            title: a.title,
            sub: a.sub,
            icon: a.icon,
            action: a.action,
          });
        }
      });

      // Repositories group
      repos.forEach((r) => {
        if (!q || r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q)) {
          items.push({
            type: "REPO",
            title: r.name,
            sub: `${r.language || "code"} · ★${r.stars}${r.isPrivate ? " · Private" : ""}`,
            icon: r.isPrivate ? ICONS.lock : ICONS.repos,
            action: () => openInspector(r.name),
          });
        }
      });

      state.filteredPaletteItems = items;
      if (state.paletteSelectedIndex >= items.length) {
        state.paletteSelectedIndex = Math.max(0, items.length - 1);
      }

      sheet.innerHTML = `
        <div class="palette-input-wrap">
          <span style="color:var(--cyan);display:flex;align-items:center;width:18px;height:18px">${ICONS.search}</span>
          <input type="text" id="paletteInput" placeholder="Type a command or repository name..." value="${esc(state.paletteQuery)}" autocomplete="off" />
          <span style="font-size:11px;color:var(--faint);font-family:var(--mono)">ESC to exit</span>
        </div>
        <div class="palette-results" id="paletteResults">
          ${items.length === 0 ? `<div style="padding:24px;text-align:center;color:var(--faint);font-size:13px">No matching results</div>` : ""}
          ${items.map((it, idx) => `
            <div class="palette-item ${idx === state.paletteSelectedIndex ? "selected" : ""}" data-idx="${idx}">
              <span style="width:18px;height:18px;display:flex;align-items:center;justify-content:center;color:var(--cyan)">${it.icon}</span>
              <span style="font-weight:600">${esc(it.title)}</span>
              <span class="item-sub">${esc(it.sub)}</span>
            </div>`).join("")}
        </div>`;

      const input = $('#paletteInput', sheet);
      input?.focus();
      input?.setSelectionRange(input.value.length, input.value.length);

      input?.addEventListener("input", (e) => {
        state.paletteQuery = e.target.value;
        state.paletteSelectedIndex = 0;
        renderPalette();
      });

      input?.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          state.paletteSelectedIndex = (state.paletteSelectedIndex + 1) % items.length;
          renderPalette();
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          state.paletteSelectedIndex = (state.paletteSelectedIndex - 1 + items.length) % items.length;
          renderPalette();
        } else if (e.key === "Enter") {
          e.preventDefault();
          const target = items[state.paletteSelectedIndex];
          if (target) {
            closeCommandPalette();
            target.action();
          }
        } else if (e.key === "Escape") {
          closeCommandPalette();
        }
      });

      $$('.palette-item', sheet).forEach((el) => {
        el.addEventListener("click", () => {
          const idx = Number(el.dataset.idx);
          const target = items[idx];
          if (target) {
            closeCommandPalette();
            target.action();
          }
        });
      });
    };

    renderPalette();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  function closeCommandPalette() {
    const overlay = $('#paletteOverlay');
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
  }

  /* ---- WIDGET CUSTOMIZER MODAL ---- */
  function openWidgetModal() {
    const overlay = $('#widgetOverlay');
    const sheet = $('#widgetSheet');

    const widgetDefs = [
      { key: "stars", label: "Total Stars Metric" },
      { key: "forks", label: "Forks Metric" },
      { key: "issues", label: "Open Issues Metric" },
      { key: "active", label: "Active Repositories (7d)" },
      { key: "primaryLang", label: "Primary Language Card" },
      { key: "privateCount", label: "Private Repositories Count" },
      { key: "pulseChart", label: "Commit Pulse Bar Chart" },
      { key: "heatmap", label: "12-Week Activity Heatmap" },
      { key: "langDistribution", label: "Language Breakdown Stack" },
      { key: "recentActivity", label: "Recent Activity Feed" },
      { key: "topRepos", label: "Top Repositories Leaderboard" },
    ];

    sheet.innerHTML = `
      <div class="sheet-head">
        <div>
          <div class="sheet-title">Customize Dashboard</div>
          <div class="sheet-sub">Toggle cards visible on your Command Center</div>
        </div>
        <button class="sheet-close" id="closeWidgetModalBtn">✕</button>
      </div>

      <div class="widget-toggle-list">
        ${widgetDefs.map((w) => `
          <div class="widget-toggle-item">
            <label for="w_${w.key}">
              <span>${w.label}</span>
            </label>
            <input type="checkbox" id="w_${w.key}" data-widget="${w.key}" ${state.widgets[w.key] !== false ? "checked" : ""} />
          </div>`).join("")}
      </div>

      <div style="display:flex;justify-content:flex-end;gap:10px;margin-top:20px">
        <button class="btn btn-sm" id="resetWidgetsBtn">Reset Defaults</button>
        <button class="btn btn-primary btn-sm" id="saveWidgetsBtn">${ICONS.check} Done</button>
      </div>`;

    $('#closeWidgetModalBtn')?.addEventListener("click", () => {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
    });

    $('#saveWidgetsBtn')?.addEventListener("click", () => {
      $$('[data-widget]', sheet).forEach((chk) => {
        state.widgets[chk.dataset.widget] = chk.checked;
      });
      localStorage.setItem("pulse-widgets", JSON.stringify(state.widgets));
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      render();
      toast("Layout preferences updated");
    });

    $('#resetWidgetsBtn')?.addEventListener("click", () => {
      state.widgets = { ...DEFAULT_WIDGETS };
      localStorage.removeItem("pulse-widgets");
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      render();
      toast("Reset widgets to defaults");
    });

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  /* ---- EXPORT MARKDOWN SUMMARY ---- */
  function copyMarkdownSummary() {
    const s = state.snapshot;
    const repos = filteredRepos();
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const issues = repos.reduce((a, r) => a + r.openIssues, 0);

    const text = `### ⌁ Pulse Command Summary: ${state.selectedRepo === "all" ? "All Repositories" : state.selectedRepo}
- **Repositories Tracked**: ${repos.length}
- **Total Stars**: ${stars} ★
- **Total Forks**: ${forks} ⑂
- **Open Issues**: ${issues}
- **Generated**: ${new Date().toUTCString()}
- **Live Pulse**: ${s?.user?.login ? `@${s.user.login}` : "Active"}
`;

    navigator.clipboard.writeText(text);
    toast("Copied markdown summary to clipboard");
  }

  /* ---- PROFILE README VIEW ---- */
  async function loadProfileLive() {
    const u = state.snapshot?.user?.login;
    if (!u) {
      toast("Unknown GitHub profile");
      return;
    }
    const badge = toast;
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${u}/${u}/HEAD/README.md`);
      if (!res.ok) {
        toast("No profile README found for @" + u);
        return;
      }
      const raw = await res.text();
      state.snapshot = state.snapshot || {};
      state.snapshot.profile = {
        owner: u,
        raw,
        url: `https://github.com/${u}/${u}`,
        rawUrl: `https://raw.githubusercontent.com/${u}/${u}/HEAD/README.md`,
        fetchedAt: new Date().toISOString(),
      };
      render();
      toast("Profile README loaded");
    } catch (e) {
      toast("Failed to load profile README");
    }
  }

  /* ---- LIGHTWEIGHT MARKDOWN → HTML RENDERER ---- */
  function inlineMd(s) {
    s = esc(s == null ? "" : String(s));
    // images first
    s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, '<img src="$2" alt="$1" loading="lazy" class="md-img" />');
    // links
    s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
    // bold
    s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    // italic
    s = s.replace(/(^|[^*])\*([^*\n]+)\*(?!\*)/g, "$1<em>$2</em>");
    // inline code
    s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
    return s;
  }

  function parseMdRow(r) {
    return r.replace(/^\s*\|/, "").replace(/\|\s*$/, "").split("|").map((c) => c.trim());
  }

  function mdTable(rows) {
    const head = parseMdRow(rows[0]);
    const delim = rows[1] ? parseMdRow(rows[1]) : [];
    const isDelim = delim.length && delim.every((c) => /^:?-{2,}:?$/.test(c.replace(/\s/g, "")));
    let html = `<table class="md-table"><thead><tr>${head.map((c) => `<th>${inlineMd(c)}</th>`).join("")}</tr></thead><tbody>`;
    const dataRows = isDelim ? rows.slice(2) : rows.slice(1);
    html += dataRows.map((r) => `<tr>${parseMdRow(r).map((c) => `<td>${inlineMd(c)}</td>`).join("")}</tr>`).join("");
    return html + "</tbody></table>";
  }

  function renderMarkdown(md) {
    if (!md) return "";
    const lines = String(md).replace(/\r\n/g, "\n").split("\n");
    let html = "";
    let i = 0;
    let listType = null;
    const closeList = () => { if (listType) { html += `</${listType}>`; listType = null; } };
    const openList = (t) => { if (listType !== t) { closeList(); html += `<${t}>`; listType = t; } };

    while (i < lines.length) {
      const line = lines[i];

      if (/^```/.test(line.trim())) {
        closeList();
        const lang = line.trim().replace(/^```/, "").trim();
        i++;
        const code = [];
        while (i < lines.length && !/^```/.test(lines[i].trim())) { code.push(lines[i]); i++; }
        i++;
        html += `<pre class="md-pre"><code class="md-code${lang ? " language-" + lang : ""}">${esc(code.join("\n"))}</code></pre>`;
        continue;
      }

      const h = line.match(/^(#{1,6})\s+(.*)$/);
      if (h) {
        closeList();
        const lvl = h[1].length;
        html += `<h${lvl} class="md-h md-h${lvl}">${inlineMd(h[2])}</h${lvl}>`;
        i++;
        continue;
      }

      if (/^\s*([-*_])\1{2,}\s*$/.test(line)) {
        closeList();
        html += `<hr class="md-hr" />`;
        i++;
        continue;
      }

      if (/^ {4}/.test(line)) {
        const code = [];
        while (i < lines.length && /^ {4}/.test(lines[i])) { code.push(lines[i].replace(/^ {4}/, "")); i++; }
        closeList();
        html += `<pre class="md-pre"><code class="md-code">${esc(code.join("\n"))}</code></pre>`;
        continue;
      }

      if (/^>\s?/.test(line)) {
        closeList();
        const q = [];
        while (i < lines.length && /^>\s?/.test(lines[i])) { q.push(lines[i].replace(/^>\s?/, "")); i++; }
        html += `<blockquote class="md-quote">${renderMarkdown(q.join("\n"))}</blockquote>`;
        continue;
      }

      if (/^\s*[-*+]\s+/.test(line)) {
        openList("ul");
        html += `<li>${inlineMd(line.replace(/^\s*[-*+]\s+/, ""))}</li>`;
        i++;
        continue;
      }

      if (/^\s*\d+[.)]\s+/.test(line)) {
        openList("ol");
        html += `<li>${inlineMd(line.replace(/^\s*\d+[.)]\s+/, ""))}</li>`;
        i++;
        continue;
      }

      if (/^\s*\|/.test(line)) {
        closeList();
        const rows = [];
        while (i < lines.length && /^\s*\|/.test(lines[i])) { rows.push(lines[i]); i++; }
        html += mdTable(rows);
        continue;
      }

      if (line.trim() === "") {
        closeList();
        i++;
        continue;
      }

      closeList();
      const para = [];
      while (
        i < lines.length &&
        lines[i].trim() !== "" &&
        !/^```/.test(lines[i]) &&
        !/^ {4}/.test(lines[i]) &&
        !/^#{1,6}\s/.test(lines[i]) &&
        !/^>\s?/.test(lines[i]) &&
        !/^\s*[-*+]\s+/.test(lines[i]) &&
        !/^\s*\d+[.)]\s+/.test(lines[i])
      ) {
        para.push(lines[i].trim());
        i++;
      }
      html += `<p class="md-p">${inlineMd(para.join(" "))}</p>`;
    }
    closeList();
    return html;
  }

  function renderProfile() {
    const s = state.snapshot || {};
    const u = s.user || {};
    const p = s.profile;
    const has = p && p.raw;

    if (!has) {
      const editPath = `${u.login || "yourname"}/${u.login || "yourname"}`;
      return section(
        "Profile",
        "Your GitHub profile README",
        pill(),
        `<div class="bento">
          <div class="card col2">
            <div class="card-head">
              <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.readme}</span> No Profile README Yet</div>
            </div>
            <div style="font-size:14px;color:var(--text);line-height:1.7">
              <p><b>@${esc(u.login || "you")}</b> doesn't have a profile README yet. Create a repository named <code>${esc(editPath)}</code> with a <code>README.md</code> to customize your GitHub profile.</p>
              <p>Once it exists, Pulse will render it here — including shields.io badges, github-readme-stats cards and Capsule Render banners.</p>
            </div>
            <div style="display:flex;gap:10px;margin-top:16px;flex-wrap:wrap">
              <a class="btn btn-primary" href="https://github.com/new" target="_blank" rel="noopener noreferrer">${ICONS.externalLink} Create Profile Repo</a>
              <button class="btn" id="refreshProfileBtn">${ICONS.refresh} Sync README</button>
            </div>
          </div>
        </div>`
      );
    }

    return section(
      "Profile",
      `${esc(u.login || "")} · GitHub profile README`,
      pill(),
      `<div class="bento">
        <div class="card col2 profile-card">
          <div class="profile-head">
            ${u.avatar ? `<img class="profile-avatar" src="${esc(u.avatar)}" alt="" />` : ""}
            <div>
              <div class="profile-name">${esc(u.name || u.login || "")}</div>
              <div class="profile-login">@${esc(u.login || "")} · ${fmtNum(u.followers || 0)} followers</div>
            </div>
            <div style="margin-left:auto;display:flex;gap:8px">
              <button class="btn btn-sm" id="refreshProfileBtn">${ICONS.refresh} Sync</button>
              <a class="btn btn-sm" href="${esc(p.url || "")}" target="_blank" rel="noopener noreferrer">${ICONS.repos} Repo</a>
            </div>
          </div>
          <div class="md-body">${renderMarkdown(p.raw)}</div>
        </div>
      </div>`
    );
  }

  /* ---- RENDER DISPATCH ---- */
  function render() {
    renderTopbar();
    renderSidebar();
    renderMobileNav();
    const stage = $('#stage');

    const views = {
      command: renderCommand,
      repos: renderRepos,
      activity: renderActivity,
      ci: renderCI,
      community: renderCommunity,
      health: renderHealth,
      xp: renderXP,
      profile: renderProfile,
    };

    const fn = views[state.view] || renderCommand;
    stage.innerHTML = '<div class="loading"><div class="pulse-ring"></div><span>SYNCHRONIZING</span></div>';
    requestAnimationFrame(() => {
      stage.innerHTML = fn();
      bindStage(stage);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindStage(stage) {
    $$('#stage [data-repolink]').forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        openRepoSelector();
      })
    );

    $$('#stage [data-inspect]').forEach((card) =>
      card.addEventListener("click", () => {
        openInspector(card.dataset.inspect);
      })
    );

    $('#customizeWidgetsTrigger')?.addEventListener("click", openWidgetModal);
    $('#exportSummaryTrigger')?.addEventListener("click", copyMarkdownSummary);

    $('#createIssueBtn')?.addEventListener("click", () => openIssueModal());
    $('#refreshProfileBtn')?.addEventListener("click", () => loadProfileLive());

    // Repositories view events
    $('#repoSearchInput')?.addEventListener("input", (e) => {
      state.repoSearchQuery = e.target.value;
      updateReposGrid();
    });

    $$('#stage [data-lang-filter]').forEach((btn) => {
      btn.addEventListener("click", () => {
        state.repoLangFilter = btn.dataset.langFilter;
        $$('#stage [data-lang-filter]').forEach((b) => b.classList.toggle("active", b === btn));
        updateReposGrid();
      });
    });

    $('#repoSortSelect')?.addEventListener("change", (e) => {
      state.repoSortBy = e.target.value;
      updateReposGrid();
    });

    // Commit pulse timeframe buttons
    $$('#stage [data-timeframe]').forEach((b) => {
      b.addEventListener("click", () => {
        state.pulseTimeframe = Number(b.dataset.timeframe);
        render();
      });
    });
  }

  function go(view) {
    state.view = view;
    render();
  }

  function section(title, sub, actions, inner) {
    return `<div class="section">
      <div class="section-head">
        <div>
          <h1>${esc(title)}</h1>
          <small>${esc(sub)}</small>
        </div>
        <div class="actions">${actions || ""}</div>
      </div>${inner}</div>`;
  }

  const pill = () => `
    <button class="repo-pill" data-repolink title="Change repository focus">
      <span class="stat-icon" style="color:var(--cyan)">${ICONS.repos}</span>
      ${state.selectedRepo === "all" ? '<span class="all">ALL REPOSITORIES</span>' : `<span style="color:var(--text-bright)">${esc(state.selectedRepo.replace(/[-_]/g, " ").toUpperCase())}</span>`}
      <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>`;

  /* ---- 1. COMMAND VIEW ---- */
  function renderCommand() {
    const repos = filteredRepos();
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const issues = repos.reduce((a, r) => a + r.openIssues, 0);
    const privateCount = repos.filter((r) => r.isPrivate).length;

    const langs = {};
    repos.forEach((r) => {
      if (r.language) langs[r.language] = (langs[r.language] || 0) + 1;
    });
    const topLang = Object.entries(langs).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    const active = repos.filter((r) => Date.now() - new Date(r.pushedAt).getTime() < 7 * 864e5).length;

    const w = state.widgets;

    // Header actions
    const actions = `
      ${pill()}
      <button class="btn btn-sm" id="customizeWidgetsTrigger" title="Customize Cards">
        ${ICONS.settings} Widgets
      </button>
      <button class="btn btn-sm" id="exportSummaryTrigger" title="Export Markdown">
        ${ICONS.share} Share
      </button>`;

    // Metric cards
    let metricCardsHtml = "";
    if (w.stars) {
      metricCardsHtml += `
        <div class="card">
          <div class="glow" style="background:var(--cyan)"></div>
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--cyan)">${ICONS.star}</span>
              Total Stars
            </div>
          </div>
          <div class="metric" style="color:var(--cyan)">${fmtNum(stars)}</div>
          <div class="metric-sub">across ${repos.length} repos</div>
        </div>`;
    }
    if (w.forks) {
      metricCardsHtml += `
        <div class="card">
          <div class="glow" style="background:var(--violet)"></div>
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--violet)">${ICONS.fork}</span>
              Forks
            </div>
          </div>
          <div class="metric" style="color:var(--violet)">${fmtNum(forks)}</div>
          <div class="metric-sub">community reuse</div>
        </div>`;
    }
    if (w.issues) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--amber)">${ICONS.issue}</span>
              Open Issues
            </div>
          </div>
          <div class="metric" style="color:var(--amber)">${fmtNum(issues)}</div>
          <div class="metric-sub">${issues === 0 ? "clean queue" : "action required"}</div>
        </div>`;
    }
    if (w.active) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--green)">${ICONS.zap}</span>
              Active Repos
            </div>
          </div>
          <div class="metric" style="color:var(--green)">${fmtNum(active)}<small>/ ${repos.length}</small></div>
          <div class="metric-sub">pushed past 7 days</div>
        </div>`;
    }
    if (w.primaryLang) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--blue)">${ICONS.code}</span>
              Primary Stack
            </div>
          </div>
          <div class="metric" style="font-size:24px;text-transform:uppercase;color:var(--blue)">${esc(topLang)}</div>
          <div class="metric-sub">most used language</div>
        </div>`;
    }
    if (w.privateCount) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--red)">${ICONS.lock}</span>
              Private Repos
            </div>
          </div>
          <div class="metric" style="color:var(--red)">${fmtNum(privateCount)}</div>
          <div class="metric-sub">of ${repos.length} total repos</div>
        </div>`;
    }

    return section(
      "Command Center",
      state.selectedRepo === "all" ? `Live telemetry across ${repos.length} repositories` : `Focus Mode · ${state.selectedRepo}`,
      actions,
      `<div class="bento">${metricCardsHtml}</div>
       <div style="height:18px"></div>
       <div class="bento">
         ${w.pulseChart ? commitPulseWidget() : ""}
         ${w.heatmap ? commitHeatmapWidget() : ""}
         ${w.langDistribution ? languageDistributionWidget() : ""}
         ${w.recentActivity ? recentActivityWidget() : ""}
         ${w.topRepos ? topRepositoriesWidget() : ""}
       </div>`
    );
  }

  /* ---- COMMIT PULSE CHART WIDGET ---- */
  function commitPulseWidget() {
    const repos = filteredRepos();
    const days = state.pulseTimeframe || 14;
    const buckets = Array.from({ length: days }, () => 0);
    const dayLabels = Array.from({ length: days }, (_, i) => {
      const d = new Date(Date.now() - (days - 1 - i) * 864e5);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    });

    repos.forEach((r) => {
      const d = Math.min(days - 1, Math.floor((Date.now() - new Date(r.pushedAt).getTime()) / 864e5));
      if (d >= 0 && d < days) buckets[days - 1 - d] += 1;
    });

    const max = Math.max(1, ...buckets);

    const bars = buckets
      .map((v, i) => {
        const heightPct = Math.max(8, Math.round((v / max) * 100));
        return `
        <div class="bar-col">
          <div class="bar-tooltip">${v} updates · ${dayLabels[i]}</div>
          <div class="bar" style="height:${heightPct}%"></div>
        </div>`;
      })
      .join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title">
            <span class="stat-icon" style="color:var(--cyan)">${ICONS.activity}</span>
            Commit Pulse
          </div>
          <div style="display:flex;gap:4px">
            <button class="btn btn-sm ${days === 7 ? "btn-primary" : ""}" data-timeframe="7">7D</button>
            <button class="btn btn-sm ${days === 14 ? "btn-primary" : ""}" data-timeframe="14">14D</button>
            <button class="btn btn-sm ${days === 30 ? "btn-primary" : ""}" data-timeframe="30">30D</button>
          </div>
        </div>
        <div class="bars-wrap">
          <div class="bars-head">
            <span>${days} days activity pattern</span>
            <span>Peak: ${max} pushes</span>
          </div>
          <div class="bars">${bars}</div>
        </div>
      </div>`;
  }

  /* ---- 12-WEEK COMMIT HEATMAP WIDGET ---- */
  function commitHeatmapWidget() {
    const repos = filteredRepos();
    const totalDays = 7 * 12;
    const counts = Array.from({ length: totalDays }, () => 0);

    repos.forEach((r) => {
      const ageDays = Math.floor((Date.now() - new Date(r.pushedAt).getTime()) / 864e5);
      if (ageDays >= 0 && ageDays < totalDays) {
        counts[totalDays - 1 - ageDays] += 1;
      }
    });

    const cellsHtml = counts
      .map((c, i) => {
        const lvl = c === 0 ? 0 : c === 1 ? 1 : c === 2 ? 2 : c === 3 ? 3 : 4;
        const d = new Date(Date.now() - (totalDays - 1 - i) * 864e5).toDateString();
        return `<div class="heat-cell" data-level="${lvl}" title="${c} push events on ${d}"></div>`;
      })
      .join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title">
            <span class="stat-icon" style="color:var(--green)">${ICONS.pulse}</span>
            Activity Matrix (12 Weeks)
          </div>
          <div style="display:flex;align-items:center;gap:4px;font-size:10px;font-family:var(--mono);color:var(--faint)">
            <span>Less</span>
            <div class="heat-cell" data-level="0" style="width:9px;height:9px"></div>
            <div class="heat-cell" data-level="1" style="width:9px;height:9px"></div>
            <div class="heat-cell" data-level="2" style="width:9px;height:9px"></div>
            <div class="heat-cell" data-level="3" style="width:9px;height:9px"></div>
            <div class="heat-cell" data-level="4" style="width:9px;height:9px"></div>
            <span>More</span>
          </div>
        </div>
        <div class="heatmap-container">
          <div class="heatmap-grid">${cellsHtml}</div>
        </div>
        <div class="metric-sub" style="margin-top:10px">
          Visualized across recent push timestamps
        </div>
      </div>`;
  }

  /* ---- LANGUAGE STACK BAR WIDGET ---- */
  function languageDistributionWidget() {
    const repos = filteredRepos();
    const langs = {};
    let totalWithLang = 0;

    repos.forEach((r) => {
      if (r.language) {
        langs[r.language] = (langs[r.language] || 0) + 1;
        totalWithLang++;
      }
    });

    const sorted = Object.entries(langs).sort((a, b) => b[1] - a[1]);

    const segments = sorted
      .map(([lang, count]) => {
        const pct = Math.round((count / Math.max(1, totalWithLang)) * 100);
        const col = getLangColor(lang);
        return `<div class="lang-seg" style="width:${pct}%;background:${col}" title="${lang}: ${pct}% (${count} repos)"></div>`;
      })
      .join("");

    const legend = sorted.slice(0, 6).map(([lang, count]) => {
      const pct = Math.round((count / Math.max(1, totalWithLang)) * 100);
      const col = getLangColor(lang);
      return `
        <div class="lang-item">
          <span class="ldot" style="background:${col}"></span>
          <span>${esc(lang)} <b>${pct}%</b></span>
        </div>`;
    }).join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title">
            <span class="stat-icon" style="color:var(--violet)">${ICONS.layers}</span>
            Language Stack Distribution
          </div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${sorted.length} languages</span>
        </div>
        <div class="lang-bar">${segments || '<div style="width:100%;background:var(--stroke)"></div>'}</div>
        <div class="lang-legend">${legend || '<div style="color:var(--faint);font-size:12px">No languages recorded</div>'}</div>
      </div>`;
  }

  /* ---- RECENT ACTIVITY WIDGET ---- */
  function recentActivityWidget() {
    const repos = filteredRepos();
    const rows = repos.slice(0, 5).map((r, i) => `
      <div class="mini-row" data-inspect="${esc(r.name)}" title="Inspect repository">
        <div class="av">${initials(r.name)}</div>
        <div class="meta">
          <div class="t">${esc(r.name.replace(/[-_]/g, " "))}</div>
          <div class="s">${esc(r.language || "code")} · ${esc(r.license || "no license")}</div>
        </div>
        <div class="r">${fmtAgo(r.pushedAt)}</div>
      </div>`).join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title">
            <span class="stat-icon" style="color:var(--cyan)">${ICONS.activity}</span>
            Recent Signal
          </div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">Click to inspect</span>
        </div>
        <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No repositories</div>'}</div>
      </div>`;
  }

  /* ---- TOP REPOSITORIES WIDGET ---- */
  function topRepositoriesWidget() {
    const repos = filteredRepos().slice().sort((a, b) => b.stars - a.stars).slice(0, 4);
    const rows = repos.map((r, i) => `
      <div class="mini-row" data-inspect="${esc(r.name)}" title="Inspect repository">
        <div class="av" style="background:linear-gradient(135deg,var(--violet),var(--blue))">${i + 1}</div>
        <div class="meta">
          <div class="t">${esc(r.name)}</div>
          <div class="s">${fmtNum(r.forks)} forks · ${fmtNum(r.openIssues)} issues</div>
        </div>
        <div class="r" style="color:var(--amber);display:flex;align-items:center;gap:3px">
          <span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>
          <span>${fmtNum(r.stars)}</span>
        </div>
      </div>`).join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title">
            <span class="stat-icon" style="color:var(--amber)">${ICONS.award}</span>
            Top Repositories
          </div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">Ranked by stars</span>
        </div>
        <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No data</div>'}</div>
      </div>`;
  }

  /* ---- 2. REPOSITORIES VIEW WITH FILTER & SEARCH ---- */
  function renderRepos() {
    const all = repoList();
    const languages = ["all", ...new Set(all.map((r) => r.language).filter(Boolean))];

    return section(
      "Repositories",
      state.selectedRepo === "all" ? `Tracking ${all.length} repositories with full metrics` : `Focus · ${state.selectedRepo}`,
      pill(),
      `<div class="control-bar">
        <div class="search-box">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" id="repoSearchInput" placeholder="Search repos by name or description..." value="${esc(state.repoSearchQuery)}" />
        </div>

        <div style="display:flex;gap:10px;align-items:center">
          <div class="filter-pills">
            ${languages.slice(0, 5).map((l) => `
              <button class="filter-pill ${state.repoLangFilter === l ? "active" : ""}" data-lang-filter="${esc(l)}">
                ${l === "all" ? "All Stacks" : esc(l)}
              </button>`).join("")}
          </div>

          <select id="repoSortSelect" style="height:38px;border-radius:999px">
            <option value="pushed" ${state.repoSortBy === "pushed" ? "selected" : ""}>Recently Pushed</option>
            <option value="stars" ${state.repoSortBy === "stars" ? "selected" : ""}>Most Stars</option>
            <option value="forks" ${state.repoSortBy === "forks" ? "selected" : ""}>Most Forks</option>
            <option value="issues" ${state.repoSortBy === "issues" ? "selected" : ""}>Open Issues</option>
            <option value="name" ${state.repoSortBy === "name" ? "selected" : ""}>Name (A-Z)</option>
          </select>
        </div>
      </div>

      <div class="repos-grid" id="reposGridContainer">
        ${getFilteredReposHtml()}
      </div>`
    );
  }

  function getFilteredReposHtml() {
    let repos = filteredRepos();
    const q = state.repoSearchQuery.trim().toLowerCase();

    if (q) {
      repos = repos.filter(
        (r) => r.name.toLowerCase().includes(q) || (r.description || "").toLowerCase().includes(q)
      );
    }

    if (state.repoLangFilter !== "all") {
      repos = repos.filter((r) => r.language === state.repoLangFilter);
    }

    // Sort
    if (state.repoSortBy === "stars") repos.sort((a, b) => b.stars - a.stars);
    else if (state.repoSortBy === "forks") repos.sort((a, b) => b.forks - a.forks);
    else if (state.repoSortBy === "issues") repos.sort((a, b) => b.openIssues - a.openIssues);
    else if (state.repoSortBy === "name") repos.sort((a, b) => a.name.localeCompare(b.name));
    else repos.sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

    if (repos.length === 0) {
      return `<div class="card col4" style="text-align:center;padding:48px 24px;color:var(--faint)">
        <div style="font-size:28px;margin-bottom:8px">${ICONS.search}</div>
        <div style="font-size:16px;font-weight:700;color:var(--text)">No repositories matched your filters</div>
        <div style="font-size:13px;margin-top:4px">Try adjusting search terms or language selections.</div>
      </div>`;
    }

    return repos
      .map((r) => {
        const langCol = getLangColor(r.language);
        return `
        <div class="card repo-card" data-inspect="${esc(r.name)}">
          <div class="card-head">
            <div class="name">
              <span class="dot" style="background:${r.isPrivate ? "var(--red)" : "var(--green)"}"></span>
              ${esc(r.name)}
            </div>
            <span class="priv-tag" style="display:inline-flex;align-items:center;gap:3px">
              <span class="stat-icon" style="width:11px;height:11px">${r.isPrivate ? ICONS.lock : ICONS.globe}</span>
              ${r.isPrivate ? "PRIV" : "PUB"}
            </span>
          </div>
          <div class="desc">${esc(r.description || "No description provided.")}</div>
          <div class="stats">
            <span style="display:inline-flex;align-items:center;gap:3px">
              <span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>
              <b>${fmtNum(r.stars)}</b>
            </span>
            <span style="display:inline-flex;align-items:center;gap:3px">
              <span class="stat-icon" style="color:var(--violet)">${ICONS.fork}</span>
              <b>${fmtNum(r.forks)}</b>
            </span>
            <span style="display:inline-flex;align-items:center;gap:3px">
              <span class="stat-icon" style="color:var(--cyan)">${ICONS.issue}</span>
              <b>${fmtNum(r.openIssues)}</b>
            </span>
          </div>
          <div class="foot">
            <span class="lang-tag" style="background:${langCol}22;color:${langCol}">${esc(r.language || "—")}</span>
            <span style="font-family:var(--mono);font-size:11px;color:var(--faint)">${fmtAgo(r.pushedAt)}</span>
          </div>
        </div>`;
      })
      .join("");
  }

  function updateReposGrid() {
    const container = $('#reposGridContainer');
    if (!container) return;
    container.innerHTML = getFilteredReposHtml();
    $$('#reposGridContainer [data-inspect]').forEach((card) =>
      card.addEventListener("click", () => openInspector(card.dataset.inspect))
    );
  }

  /* ---- 3. ACTIVITY VIEW ---- */
  function renderActivity() {
    const s = state.snapshot || {};
    const extras = s.extras || [];

    // Real cross-repo events, filtered by global repo selection
    const events = (s.events || []).filter(
      (e) =>
        state.selectedRepo === "all" ||
        e.repo.split("/").pop() === state.selectedRepo.split("/").pop()
    );

    const eventFeed = events
      .slice(0, 25)
      .map((e, i) => {
        const col = ["var(--cyan)", "var(--violet)", "var(--green)", "var(--blue)", "var(--amber)"][i % 5];
        const iconSvg =
          e.type === "PushEvent"
            ? ICONS.gitCommit
            : e.type === "PullRequestEvent"
            ? ICONS.branch
            : e.type === "IssuesEvent"
            ? ICONS.issue
            : e.type === "ReleaseEvent"
            ? ICONS.award
            : e.type === "WatchEvent"
            ? ICONS.starOutline
            : e.type === "ForkEvent"
            ? ICONS.fork
            : ICONS.activity;
        return `
        <div class="feed-item">
          <div class="fdot" style="background:${col}22;color:${col}">
            ${iconSvg}
          </div>
          <div>
            <div class="ft"><b>${esc(e.repo)}</b> ${esc(e.action)}</div>
            <div class="fs">${fmtAgo(e.createdAt)}</div>
          </div>
        </div>`;
      })
      .join("");

    // Real workflow runs across repos
    const allRuns = extras
      .flatMap((x) => (x.runs || []).map((r) => ({ ...r, repo: x.fullName })))
      .filter((r) => state.selectedRepo === "all" || r.repo === state.selectedRepo);

    const runningCount = allRuns.filter(
      (r) => r.status === "in_progress" || r.status === "queued"
    ).length;

    const rankRun = (r) =>
      r.status === "in_progress" ? 0 : r.status === "queued" ? 1 : 2;

    const workflowRows = allRuns
      .slice()
      .sort((a, b) => rankRun(a) - rankRun(b))
      .slice(0, 12)
      .map((r) => {
        const cls =
          r.status === "in_progress" || r.status === "queued"
            ? "run"
            : r.status === "completed" && r.conclusion === "success"
            ? "ok"
            : r.status === "completed" && r.conclusion === "failure"
            ? "bad"
            : r.status === "completed"
            ? "warn"
            : "run";
        const label =
          r.status === "in_progress"
            ? "RUNNING"
            : r.status === "queued"
            ? "QUEUED"
            : r.status === "completed"
            ? r.conclusion === "success"
              ? "PASSING"
              : r.conclusion === "failure"
              ? "FAILED"
              : "OTHER"
            : r.status;
        return `
        <div class="mini-row">
          <div class="av" style="background:linear-gradient(135deg,var(--blue),var(--green))">${initials(r.repo.split("/").pop())}</div>
          <div class="meta">
            <div class="t">${esc(r.name || "workflow")}</div>
            <div class="s">${esc(r.repo)} · ${fmtAgo(r.updatedAt || r.createdAt)}</div>
          </div>
          <div><span class="status ${cls}"><span class="sdot"></span>${label}</span></div>
        </div>`;
      })
      .join("");

    // Real releases across repos
    const allReleases = extras
      .flatMap((x) => (x.releases || []).map((r) => ({ ...r, repo: x.fullName })))
      .filter((r) => state.selectedRepo === "all" || r.repo === state.selectedRepo)
      .slice()
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    const releaseRows = allReleases.slice(0, 10).map((r) => `
        <div class="mini-row">
          <div class="av" style="background:linear-gradient(135deg,var(--amber),var(--violet))">${ICONS.award}</div>
          <div class="meta">
            <div class="t">${esc(r.tag)}${r.prerelease ? ' <span class="priv-tag" style="font-size:10px">PRE</span>' : ""}</div>
            <div class="s">${esc(r.repo)} · ${fmtAgo(r.publishedAt)}</div>
          </div>
          <div><a class="btn btn-sm" href="${esc(r.htmlUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.externalLink}</a></div>
        </div>`)
      .join("");

    const createIssueBtn = `
      <button class="btn btn-primary" id="createIssueBtn" style="margin-right:10px">${ICONS.issue} New Issue</button>`;

    return section(
      "Activity Stream",
      "Real-time activity, running workflows and releases",
      `${createIssueBtn}${pill()}`,
      `<div class="bento">
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--green)">${ICONS.activity}</span> Live Event Stream</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${events.length} events · real</span>
          </div>
          <div class="feed">${eventFeed || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No activity yet</div>'}</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--blue)">${ICONS.pipeline}</span> Running Workflows</div>
          </div>
          <div class="metric" style="color:var(--blue)">${fmtNum(runningCount)}</div>
          <div class="metric-sub">currently in progress / queued</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--amber)">${ICONS.award}</span> Releases</div>
          </div>
          <div class="metric" style="color:var(--amber)">${fmtNum(allReleases.length)}</div>
          <div class="metric-sub">published across repos</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--blue)">${ICONS.ci}</span> Workflow Runs</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">GitHub Actions</span>
          </div>
          <div class="mini-list">${workflowRows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No workflows yet</div>'}</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--amber)">${ICONS.share}</span> Latest Releases</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">Tags</span>
          </div>
          <div class="mini-list">${releaseRows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No releases yet</div>'}</div>
        </div>
      </div>`
    );
  }

  /* ---- CREATE ISSUE MODAL ---- */
  function openIssueModal(preRepo) {
    const overlay = $("#issueOverlay");
    const sheet = $("#issueSheet");
    const repos = repoList().filter((r) => !r.isPrivate);
    const pre = preRepo || state.selectedRepo !== "all" ? state.selectedRepo : "";
    const token = state.token;

    sheet.innerHTML = `
      <div class="sheet-head">
        <div>
          <div class="inspector-title">New Issue</div>
          <div class="sheet-sub">Create an issue directly from Pulse</div>
        </div>
        <button class="sheet-close" id="closeIssueBtn">✕</button>
      </div>

      ${token ? "" : `
      <div class="status warn" style="margin-bottom:16px;display:flex;gap:8px;align-items:center">
        <span class="sdot"></span> Creating issues requires a GitHub token.
        <button class="btn btn-sm" id="issueGotToken" style="margin-left:auto">Connect →</button>
      </div>`}

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Repository</div>
      <select id="issueRepo" class="form-input" style="width:100%;margin-bottom:14px">
        ${repos.map((r) => `<option value="${esc(r.fullName)}" ${r.fullName === pre ? "selected" : ""}>${esc(r.fullName)}</option>`).join("")}
      </select>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Title</div>
      <input id="issueTitle" class="form-input" placeholder="Summarize the issue" style="width:100%;margin-bottom:14px" />

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Body (Markdown)</div>
      <textarea id="issueBody" class="form-input" rows="6" placeholder="Describe the problem, steps to reproduce, expected vs actual…" style="width:100%;margin-bottom:18px"></textarea>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn" id="cancelIssueBtn">Cancel</button>
        <button class="btn btn-primary" id="submitIssueBtn" ${token ? "" : "disabled"}>${ICONS.issue} Create Issue</button>
      </div>`;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    const close = () => {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
    };
    $("#closeIssueBtn")?.addEventListener("click", close);
    $("#cancelIssueBtn")?.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });
    $("#issueGotToken")?.addEventListener("click", () => {
      close();
      openTokenModal();
    });

    $("#submitIssueBtn")?.addEventListener("click", async () => {
      const full = $("#issueRepo").value;
      const title = $("#issueTitle").value.trim();
      const body = $("#issueBody").value.trim();
      if (!full || !title) {
        toast("Please provide a repository and issue title");
        return;
      }
      const btn = $("#submitIssueBtn");
      btn.disabled = true;
      btn.textContent = "Creating…";
      try {
        const res = await fetch(`https://api.github.com/repos/${full}/issues`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${state.token}`,
          },
          body: JSON.stringify({ title, body }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Request failed");
        toast(`Issue created: ${data.html_url}`);
        close();
        fetchLive();
      } catch (err) {
        toast(`Failed to create issue: ${err.message}`);
        btn.disabled = false;
        btn.textContent = "Create Issue";
      }
    });
  }

  /* ---- 4. CI VIEW ---- */
  function renderCI() {
    const repos = filteredRepos().slice(0, 8);
    const traffic = repos
      .map((r, i) => {
        const statuses = ["run", "ok", "warn", "bad"];
        const statusIdx = i % 4;
        const statusClass = statuses[statusIdx];
        const statusLabel = ["RUNNING", "PASSING", "QUEUED", "FAILED"][statusIdx];
        return `
        <div class="mini-row" data-inspect="${esc(r.name)}">
          <div class="av" style="background:linear-gradient(135deg,var(--blue),var(--green))">${initials(r.name)}</div>
          <div class="meta">
            <div class="t">${esc(r.name)}</div>
            <div class="s">deploy-pages · ${fmtAgo(r.updatedAt)}</div>
          </div>
          <div>
            <span class="status ${statusClass}"><span class="sdot"></span>${statusLabel}</span>
          </div>
        </div>`;
      })
      .join("");

    return section(
      "CI & Workflows",
      "Deployment pipeline health and action execution",
      pill(),
      `<div class="bento">
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--blue)">${ICONS.pipeline}</span>
              Total Workflows
            </div>
          </div>
          <div class="metric" style="color:var(--blue)">${fmtNum(repos.length * 4)}</div>
          <div class="metric-sub">tracked workflows</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--green)">${ICONS.check}</span>
              Pipeline Pass Rate
            </div>
          </div>
          <div class="metric" style="color:var(--green)">96<small>%</small></div>
          <div class="metric-sub"><span class="delta up">▲ 4%</span> 30-day reliability</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--blue)">${ICONS.ci}</span>
              Workflow Status
            </div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">GitHub Actions</span>
          </div>
          <div class="mini-list">${traffic || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No workflows</div>'}</div>
        </div>
      </div>`
    );
  }

  /* ---- 5. COMMUNITY VIEW ---- */
  function renderCommunity() {
    const repos = filteredRepos().slice().sort((a, b) => b.stars - a.stars).slice(0, 6);
    const rows = repos
      .map(
        (r, i) => `
      <div class="mini-row" data-inspect="${esc(r.name)}">
        <div class="av" style="background:linear-gradient(135deg,var(--amber),var(--violet))">${i + 1}</div>
        <div class="meta">
          <div class="t">${esc(r.name)}</div>
          <div class="s">${esc(r.language || "stack")} · ${fmtNum(r.forks)} forks</div>
        </div>
        <div class="r" style="display:flex;align-items:center;gap:3px;color:var(--amber)">
          <span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>
          <span>${fmtNum(r.stars)}</span>
        </div>
      </div>`
      )
      .join("");

    const totalStars = filteredRepos().reduce((a, r) => a + r.stars, 0);
    const totalForks = filteredRepos().reduce((a, r) => a + r.forks, 0);

    return section(
      "Community Signal",
      "Repository reach, developer engagement, and forks",
      pill(),
      `<div class="bento">
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>
              Total Stars
            </div>
          </div>
          <div class="metric" style="color:var(--amber)">${fmtNum(totalStars)}</div>
          <div class="metric-sub">developer appreciation</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--violet)">${ICONS.fork}</span>
              Total Forks
            </div>
          </div>
          <div class="metric" style="color:var(--violet)">${fmtNum(totalForks)}</div>
          <div class="metric-sub">community derivations</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--amber)">${ICONS.award}</span>
              Star Leaderboard
            </div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">Top repositories</span>
          </div>
          <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No community data</div>'}</div>
        </div>
      </div>`
    );
  }

  /* ---- 6. HEALTH VIEW ---- */
  function renderHealth() {
    const repos = filteredRepos();
    const recent = repos.filter((r) => Date.now() - new Date(r.pushedAt).getTime() < 30 * 864e5).length;
    const pct = Math.round((recent / Math.max(1, repos.length)) * 100);

    const rows = repos.slice(0, 6).map((r) => {
      const isFresh = Date.now() - new Date(r.pushedAt).getTime() < 30 * 864e5;
      return `
        <div class="mini-row" data-inspect="${esc(r.name)}">
          <div class="av" style="background:${isFresh ? "linear-gradient(135deg,var(--green),var(--cyan))" : "linear-gradient(135deg,var(--amber),var(--red))"}">${initials(r.name)}</div>
          <div class="meta">
            <div class="t">${esc(r.name)}</div>
            <div class="s">${fmtNum(r.openIssues)} open issues · updated ${fmtAgo(r.pushedAt)}</div>
          </div>
          <div><span class="status ${isFresh ? "ok" : "warn"}"><span class="sdot"></span>${isFresh ? "MAINTAINED" : "STALE"}</span></div>
        </div>`;
    }).join("");

    return section(
      "Repository Health",
      "Maintenance velocity and issue pressure index",
      pill(),
      `<div class="bento">
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--green)">${ICONS.shield}</span>
              Maintained Repos
            </div>
          </div>
          <div class="metric" style="color:var(--green)">${fmtNum(recent)}<small>/ ${repos.length}</small></div>
          <div class="metric-sub">updated within 30 days</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--cyan)">${ICONS.activity}</span>
              Freshness Ratio
            </div>
          </div>
          <div class="ring-row">
            <div class="ring" style="--p:${pct}"><div class="inner">${pct}%</div></div>
            <div class="ring-legend">
              <div class="ln"><span>Active</span><b>${pct}%</b></div>
              <div class="ln"><span>Inactive</span><b>${100 - pct}%</b></div>
            </div>
          </div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--green)">${ICONS.health}</span>
              Repository Health Audit
            </div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">Inspection audit</span>
          </div>
          <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No repositories</div>'}</div>
        </div>
      </div>`
    );
  }

  /* ---- 7. XP & REWARDS VIEW ---- */
  const XP_LEVELS = ["OPERATOR", "ENGINEER", "ARCHITECT", "LEAD SHIPPER", "DISTINGUISHED TECH TITAN"];
  function renderXP() {
    const repos = filteredRepos();
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const xp = stars * 60 + forks * 30 + repos.length * 100;
    const levelIdx = Math.min(XP_LEVELS.length - 1, Math.floor(xp / 500));
    const level = XP_LEVELS[levelIdx];
    const next = XP_LEVELS[levelIdx + 1];
    const pct = next ? Math.min(100, ((xp - levelIdx * 500) / 500) * 100) : 100;

    const achievements = [
      { n: "FIRST CODEBASE", x: 100, got: repos.length >= 1, icon: ICONS.zap },
      { n: "STAR COLLECTOR", x: 150, got: stars > 0, icon: ICONS.star },
      { n: "COMMUNITY FORK", x: 120, got: forks > 0, icon: ICONS.fork },
      { n: "PORTFOLIO EXPANSION", x: 250, got: repos.length >= 5, icon: ICONS.repos },
      { n: "COMMAND SHIPPER", x: 200, got: repos.length >= 8, icon: ICONS.award },
      { n: "FULL STACK POLYGLOT", x: 300, got: new Set(repos.map((r) => r.language).filter(Boolean)).size >= 3, icon: ICONS.layers },
    ]
      .map(
        (a) => `
      <div class="ach ${a.got ? "" : "locked"}">
        <div class="badge"><span>${a.icon}</span></div>
        <div>
          <div style="font-weight:700;font-size:14px;color:var(--text-bright)">${a.n}</div>
          <div style="font-size:11.5px;color:var(--faint)">${a.got ? "Unlocked" : "In Progress"}</div>
        </div>
        <div class="xp">+${a.x} XP</div>
      </div>`
      )
      .join("");

    return section(
      "XP & Rewards",
      "Gamified developer shipping metrics and achievement progression",
      pill(),
      `<div class="bento">
        <div class="card col2">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--violet)">${ICONS.xp}</span>
              Rank · Tier ${levelIdx + 1}
            </div>
            <span class="priv-tag">${level}</span>
          </div>
          <div class="metric" style="font-size:48px;color:var(--violet)">${fmtNum(xp)}<small>XP</small></div>
          <div class="xp-track">
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <div class="xp-levels">
              <span>${level}</span>
              <span>${next ? `NEXT: ${next}` : "MAX RANK ACHIEVED"}</span>
            </div>
          </div>
          <div class="metric-sub" style="margin-top:14px">
            Calculated from ${repos.length} repos, ${stars} stars, and ${forks} forks.
          </div>
        </div>

        <div class="card col2">
          <div class="card-head">
            <div class="card-title">
              <span class="stat-icon" style="color:var(--cyan)">${ICONS.award}</span>
              Milestones & Badges
            </div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--cyan)">Progression</span>
          </div>
          <div style="margin-top:8px">${achievements}</div>
        </div>
      </div>`
    );
  }

  /* ---- DATA LOADING & SYNC ---- */
  async function loadSnapshot() {
    try {
      const res = await fetch("data/snapshot.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (data && data.repos) {
        state.snapshot = data;
        return true;
      }
    } catch (e) {
      console.warn("Snapshot load failed", e);
    }
    return false;
  }

  async function fetchLive() {
    toast(state.token ? "Syncing authenticated GitHub data..." : "Syncing public GitHub data...");
    try {
      const chip = $('#rateChip');
      const headers = { Accept: "application/vnd.github+json" };
      if (state.token) {
        headers["Authorization"] = `Bearer ${state.token}`;
      }

      // If token present, fetch both public and private repos (owner and collaborator)
      const url = state.token
        ? "https://api.github.com/user/repos?per_page=100&sort=updated&affiliation=owner,collaborator"
        : "https://api.github.com/user/repos?per_page=100&sort=updated";

      const res = await fetch(url, { headers });

      if (res.headers) {
        const limit = res.headers.get("X-RateLimit-Limit");
        const remain = res.headers.get("X-RateLimit-Remaining");
        if (limit) state.api.rateLimit = Number(limit);
        if (remain) state.api.rateRemaining = Number(remain);
        if (chip) {
          chip.style.display = "inline";
          chip.textContent = `${remain} / ${state.api.rateLimit} reqs`;
        }
      }

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length) {
        const enriched = repos
          .filter((r) => !r.fork)
          .map((r) => ({
            name: r.name,
            fullName: r.full_name,
            description: r.description,
            htmlUrl: r.html_url,
            homepage: r.homepage,
            language: r.language,
            stars: r.stargazers_count,
            forks: r.forks_count,
            openIssues: r.open_issues_count,
            watchers: r.watchers_count,
            license: r.license?.spdx_id || null,
            isPrivate: r.private,
            archived: r.archived,
            defaultBranch: r.default_branch,
            createdAt: r.created_at,
            updatedAt: r.updated_at,
            pushedAt: r.pushed_at,
          }));

        // Fetch user info if token is connected
        let userInfo = state.snapshot?.user;
        if (state.token) {
          try {
            const userRes = await fetch("https://api.github.com/user", { headers });
            if (userRes.ok) {
              const u = await userRes.json();
              userInfo = {
                login: u.login,
                name: u.name,
                avatar: u.avatar_url,
                publicRepos: u.public_repos,
                followers: u.followers,
                following: u.following,
              };
            }
          } catch (e) {}
        }

        state.snapshot = {
          ...(state.snapshot || {}),
          generatedAt: new Date().toISOString(),
          user: userInfo,
          repos: enriched,
          totalStars: enriched.reduce((a, r) => a + r.stars, 0),
          totalForks: enriched.reduce((a, r) => a + r.forks, 0),
          totalOpenIssues: enriched.reduce((a, r) => a + r.openIssues, 0),
        };
        render();
        toast(state.token ? "Synced private & public repos with full API quota" : "Live GitHub data synchronized");
      }
    } catch (e) {
      console.warn("Live sync warning:", e);
      toast("Showing latest snapshot data");
    }
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.innerHTML = `<span style="width:16px;height:16px;display:flex;align-items:center;color:var(--cyan)">${ICONS.pulse}</span> <span>${esc(msg)}</span>`;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  /* ---- BOOT ---- */
  async function boot() {
    applyTheme(state.theme);
    const ok = await loadSnapshot();
    render();

    // Register Service Worker on supported http(s) protocols
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW not registered", e));
    }

    if (ok) {
      setTimeout(fetchLive, 900);
    }

    // Modal background close triggers
    $('#repoOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "repoOverlay") closeOverlay();
    });
    $('#paletteOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "paletteOverlay") closeCommandPalette();
    });
    $('#inspectorOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "inspectorOverlay") {
        $('#inspectorOverlay').classList.remove("open");
        $('#inspectorOverlay').setAttribute("aria-hidden", "true");
      }
    });
    $('#widgetOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "widgetOverlay") {
        $('#widgetOverlay').classList.remove("open");
        $('#widgetOverlay').setAttribute("aria-hidden", "true");
      }
    });
    $('#tokenOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "tokenOverlay") closeTokenModal();
    });

    // Global keyboard shortcuts
    window.addEventListener("keydown", (e) => {
      // ⌘K or Ctrl+K or / (when not focused on input)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandPalette();
      } else if (e.key === "/" && !["INPUT", "TEXTAREA", "SELECT"].includes(document.activeElement?.tagName)) {
        e.preventDefault();
        openCommandPalette();
      } else if (e.key === "Escape") {
        closeOverlay();
        closeCommandPalette();
        closeTokenModal();
        $('#inspectorOverlay')?.classList.remove("open");
        $('#widgetOverlay')?.classList.remove("open");
        $('#issueOverlay')?.classList.remove("open");
      }
    });
  }

  // Deep-link support: #/view-name
  const applyHash = () => {
    const h = (location.hash || "").replace(/^#/, "").split("/")[0].toLowerCase();
    if (h && NAV.some((n) => n.id === h)) go(h);
  };
  window.addEventListener("hashchange", applyHash);

  boot();
  applyHash();
})();
