/* Pulse — Developer Command Center Application */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

    // High-fidelity Developer Icon System (Lucide/Feather inspired 24x24 stroke icons)
  const ICONS = {
    github: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.96 0-1.32.47-2.39 1.24-3.23-.12-.31-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.18.77.84 1.24 1.91 1.24 3.23 0 4.63-2.8 5.65-5.48 5.95.43.37.81 1.1.81 2.22v3.29c0 .32.21.7.82.58A12.01 12.01 0 0 0 24 12.5C24 5.87 18.63.5 12 .5Z"/></svg>`,
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
    power: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"/><line x1="12" y1="2" x2="12" y2="12"/></svg>`,
    sun: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`,
    moon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    filter: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
    music: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    musicOff: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="2" x2="22" y2="22"/><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>`,
    volume: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/></svg>`,
    key: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="15.5" r="5.5"/><path d="m21 2-9.6 9.6"/><path d="m15.5 7.5 2.3 2.3a1 1 0 0 0 1.4 0l2.1-2.1a1 1 0 0 0 0-1.4L19 4"/></svg>`,
  };

  const state = {
    snapshot: null,
    selectedRepo: "all",
    accountFilter: "all", // "all" | account login
    view: "overview",
    api: { rateLimit: 60, rateRemaining: null },
    theme: localStorage.getItem("pulse-theme") || "dark",
    repoSearchQuery: "",
    repoLangFilter: "all",
    repoSortBy: "pushed",
    pulseTimeframe: 14,
    paletteQuery: "",
    paletteSelectedIndex: 0,
    filteredPaletteItems: [],
    ciFilter: "all",
    selectedProject: null,
    readmeCache: {},
    history: [],
    live: { lastFetchAt: null, isPolling: false, error: null },
    _pollTimer: null,
  };

  /* ---- PUBLIC ACCOUNT (no auth, ever) ----
     Pulse is a read-only showroom: no login, no OAuth, no stored token.
     The GitHub account it displays comes from js/config.js, with the
     build-time snapshot login as a fallback. */
  const accountConfig = () => (window.PULSE_CONFIG && window.PULSE_CONFIG.github) || {};
  const liveConfig = () => (window.PULSE_CONFIG && window.PULSE_CONFIG.live) || {};

  function ghAccount() {
    const configured = (accountConfig().username || "").trim();
    if (configured && configured !== "your-username") return configured;
    return (state.snapshot?.user?.login || "").trim();
  }

  /** Every account featured on the site (config list, else the primary one). */
  function accountList() {
    const configured = (accountConfig().accounts || [])
      .map((a) => String(a).trim().replace(/^@/, ""))
      .filter(Boolean);
    if (configured.length) return [...new Set(configured)];
    const single = ghAccount();
    return single ? [single] : [];
  }

  /** Account summaries from the snapshot (falls back to what the repos reveal). */
  function accountSummaries() {
    const fromSnapshot = state.snapshot?.accounts;
    if (Array.isArray(fromSnapshot) && fromSnapshot.length) return fromSnapshot;
    return accountList().map((login) => {
      const own = repoList().filter((r) => repoOwner(r) === login);
      return {
        login,
        avatar: `https://github.com/${login}.png`,
        htmlUrl: `https://github.com/${login}`,
        repoCount: own.length,
        stars: own.reduce((a, r) => a + r.stars, 0),
        latestPush: own[0]?.pushedAt || null,
        followers: null,
      };
    });
  }

  const repoOwner = (r) => r?.owner || (r?.fullName || "").split("/")[0] || "";
  const accountAvatar = (login) =>
    accountSummaries().find((a) => a.login === login)?.avatar || `https://github.com/${login}.png`;

  const isLiveEnabled = () => liveConfig().enabled !== false;

  // Purge any credential an older (login-enabled) build of Pulse may have stored.
  try {
    localStorage.removeItem("pulse-gh-token");
  } catch {}

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

  const plural = (n, word) => `${fmtNum(n)} ${word}${Number(n) === 1 ? "" : "s"}`;

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

  // Public showroom: private repositories are never listed or counted, even if
  // an old/corrupt snapshot were to contain them. Deduplicated by full name.
  const repoList = () => {
    const seen = new Set();
    return (state.snapshot?.repos || [])
      .filter((r) => r && !r.isPrivate)
      .filter((r) => {
        const key = r.fullName || r.name;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));
  };

  const accountRepos = () => {
    const list = repoList();
    if (state.accountFilter === "all") return list;
    return list.filter((r) => repoOwner(r) === state.accountFilter);
  };

  const filteredRepos = () => {
    const list = accountRepos();
    if (state.selectedRepo === "all") return list;
    return list.filter((r) => r.name === state.selectedRepo);
  };

  /* ---- PUBLIC SHOWCASE HELPERS ---- */
  const displayConfig = () => (window.PULSE_CONFIG && window.PULSE_CONFIG.display) || {};

  const displayLinks = () =>
    (displayConfig().links || []).filter((l) => l && l.label && l.url);

  const profileUrl = () => {
    const login = ghAccount();
    return login ? `https://github.com/${encodeURIComponent(login)}` : "https://github.com";
  };

  const daysSince = (iso) => (iso ? Math.floor((Date.now() - new Date(iso).getTime()) / 864e5) : Infinity);

  const accountYears = () => {
    const created = state.snapshot?.user?.createdAt;
    if (!created) return null;
    return Math.max(0, Math.round((Date.now() - new Date(created).getTime()) / (365.25 * 864e5) * 10) / 10);
  };

  // Momentum is derived from public push timestamps (works without any API auth).
  const momentum = () => {
    const repos = repoList();
    return {
      week: repos.filter((r) => daysSince(r.pushedAt) <= 7).length,
      month: repos.filter((r) => daysSince(r.pushedAt) <= 30).length,
      latest: repos[0] || null,
    };
  };

  const repoStatus = (r) => (r.archived ? "archived" : daysSince(r.pushedAt) <= 90 ? "active" : "quiet");

  /* Repos that exist to configure GitHub itself (profile README repo, dotfiles,
     topic-only repos) are not projects — they never belong in Highlights. */
  const isProfileRepo = (r) => {
    const owner = repoOwner(r);
    const name = (r.name || "").toLowerCase();
    const topics = (r.topics || []).map((t) => t.toLowerCase());
    if (owner && name === owner.toLowerCase()) return true;
    if (topics.includes("github-config") || topics.includes("profile")) return true;
    if (/^config files for my github profile/i.test(r.description || "")) return true;
    if (!r.language && !r.readmeExcerpt && !(r.description || "").trim()) return true;
    return false;
  };

  /* Auto-derived highlights — no hand-written content required.
     Recent work first, then reach (stars/forks), then how complete the repo
     looks (description, live site, README, topics, license). Results are
     spread across accounts so one account cannot dominate the page. */
  const featuredRepos = (limit = 6) => {
    const score = (r) => {
      const age = daysSince(r.pushedAt);
      const recency = age <= 1 ? 60 : age <= 7 ? 45 : age <= 30 ? 30 : age <= 90 ? 15 : 4;
      return (
        recency +
        (r.stars || 0) * 12 +
        (r.forks || 0) * 6 +
        (r.readmeExcerpt ? 10 : 0) +
        (r.description ? 6 : 0) +
        (r.homepage ? 8 : 0) +
        ((r.topics || []).length ? 4 : 0) +
        (r.license ? 2 : 0) +
        (r.language ? 3 : 0) -
        (r.archived ? 40 : 0)
      );
    };

    const ranked = repoList()
      .filter((r) => !isProfileRepo(r))
      .sort((a, b) => score(b) - score(a));

    // Round-robin across accounts so every account is represented early.
    const perOwnerCap = Math.max(1, Math.ceil(limit / Math.max(1, accountList().length)));
    const picked = [];
    const capped = [];
    const counts = {};
    for (const r of ranked) {
      const owner = repoOwner(r);
      if ((counts[owner] || 0) < perOwnerCap) {
        counts[owner] = (counts[owner] || 0) + 1;
        picked.push(r);
      } else {
        capped.push(r);
      }
      if (picked.length >= limit) break;
    }
    // Top up with the best remaining repos if an account had too few.
    return picked.concat(capped).slice(0, limit);
  };

  const extrasFor = (fullName) => (state.snapshot?.extras || []).find((x) => x.fullName === fullName) || null;

  const allReleases = () =>
    (state.snapshot?.extras || [])
      .flatMap((x) => (x.releases || []).map((r) => ({ ...r, repo: x.fullName })))
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

  const allWorkflowRuns = () =>
    (state.snapshot?.extras || []).flatMap((x) => (x.runs || []).map((r) => ({ ...r, repo: x.fullName })));

  /* ---- navigation items ---- */
  /* ---- INFORMATION ARCHITECTURE (visitor-first) ----
     Overview -> Highlights -> Numbers -> Activity -> Projects -> How I build -> About
     Plus a shareable per-project route: #/project/<name> */
  const NAV = [
    { id: "overview", label: "OVERVIEW", ic: ICONS.command, badge: () => null },
    { id: "highlights", label: "HIGHLIGHTS", ic: ICONS.zap, badge: () => featuredRepos().length || null },
    { id: "numbers", label: "NUMBERS", ic: ICONS.award, badge: () => null },
    { id: "activity", label: "ACTIVITY", ic: ICONS.activity, badge: () => null },
    { id: "projects", label: "PROJECTS", ic: ICONS.repos, badge: () => repoList().length },
    { id: "craft", label: "HOW I BUILD", ic: ICONS.pipeline, badge: () => null },
    { id: "about", label: "ABOUT", ic: ICONS.user, badge: () => null },
  ];
  const VIEW_IDS = [...NAV.map((n) => n.id), "project", "account"];

  /* ---- SHARING / SEO META ----
     Public metadata only: no tracking, no third-party scripts. Absolute URLs
     resolve against PULSE_CONFIG.site.url, so a fork on another domain still
     produces correct share cards. */
  function siteCfg() {
    const s = window.PULSE_CONFIG?.site || {};
    const base = String(s.url || location.origin + location.pathname).replace(/\/?$/, "/");
    return {
      base,
      name: s.name || "Pulse",
      description:
        s.description ||
        "A public, read-only showcase of a GitHub account: projects, activity, releases and CI. No login required.",
      image: s.image || "icons/og.png",
      twitter: s.twitter || "",
    };
  }
  const absUrl = (rel) => {
    try { return new URL(rel, siteCfg().base).href; } catch { return rel; }
  };

  function routeMeta() {
    const cfg = siteCfg();
    const u = state.snapshot?.user || {};
    const accounts = accountList();
    const who = accounts.length > 1 ? accounts.map((a) => "@" + a).join(" + ") : "@" + (u.login || ghAccount() || "github");
    const map = {
      overview: ["Overview", `What ${who} has been building — highlights, activity and public repositories.`],
      highlights: ["Highlights", `The work worth seeing from ${who}: featured projects, releases and shipped tools.`],
      numbers: ["Numbers", `Public GitHub stats for ${who}: contributions, streaks, PRs merged, issues, code volume and trends.`],
      activity: ["Activity", `Recent public commits, releases and workflow runs from ${who}.`],
      projects: ["Projects", `Every public repository from ${who}, filterable by language and activity.`],
      craft: ["How I build", `Tooling, languages, release cadence and CI habits behind the work of ${who}.`],
      about: ["About", `Who ${who} is, what they build, and how to get in touch.`],
    };
    if (state.view === "project") {
      const repo =
        repoList().find((r) => (r.name || "").toLowerCase() === String(state.selectedProject || "").toLowerCase()) || repoList()[0];
      if (repo) {
        const image = repo.cover || repo.openGraphImage || repo.socialImage;
        return {
          title: `${repo.name} — ${cfg.name}`,
          description: (repo.description || `Public repository ${repo.fullName}.`).slice(0, 180),
          path: `#/project/${repo.name}`,
          image: image ? absUrl(image) : absUrl(cfg.image),
          repo,
        };
      }
    }
    if (state.view === "account") {
      const account = accountFor(state.selectedAccount);
      if (account) {
        return {
          title: `${account.name || account.login} (@${account.login}) — ${cfg.name}`,
          description: (account.bio || `Public GitHub work from @${account.login}: repositories, contributions and languages.`).slice(0, 180),
          path: `#/account/${account.login}`,
          image: absUrl(cfg.image),
        };
      }
    }
    const [t, d] = map[state.view] || map.overview;
    return {
      title: `${t} — ${cfg.name}`,
      description: d,
      path: state.view === "overview" ? "" : `#/${state.view}`,
      image: absUrl(cfg.image),
    };
  }

  function metaTag(selector, attrs, create) {
    let el = document.head.querySelector(selector);
    if (!el) {
      el = document.createElement(create.tag);
      Object.entries(create.attrs).forEach(([k, v]) => el.setAttribute(k, v));
      document.head.appendChild(el);
    }
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
    return el;
  }

  /* Keep <title>, description, canonical and the social card in step with the
     view/deep link the visitor is looking at. */
  function syncMeta() {
    const cfg = siteCfg();
    const meta = routeMeta();
    const url = cfg.base + meta.path;
    document.title = meta.title;
    metaTag('meta[name="description"]', { content: meta.description }, { tag: "meta", attrs: { name: "description" } });
    metaTag('link[rel="canonical"]', { href: url }, { tag: "link", attrs: { rel: "canonical" } });
    [
      ["og:title", meta.title],
      ["og:description", meta.description],
      ["og:url", url],
      ["og:image", meta.image],
      ["og:site_name", cfg.name],
      ["og:type", meta.repo ? "article" : "profile"],
    ].forEach(([prop, content]) => metaTag(`meta[property="${prop}"]`, { content }, { tag: "meta", attrs: { property: prop } }));
    [
      ["twitter:card", "summary_large_image"],
      ["twitter:title", meta.title],
      ["twitter:description", meta.description],
      ["twitter:image", meta.image],
      ...(cfg.twitter ? [["twitter:site", cfg.twitter]] : []),
    ].forEach(([name, content]) => metaTag(`meta[name="${name}"]`, { content }, { tag: "meta", attrs: { name } }));
  }

  /* Share the current deep link: native sheet when the browser has one,
     clipboard otherwise. Never tracks anything. */
  async function shareCurrent() {
    const meta = routeMeta();
    const url = siteCfg().base + meta.path;
    try {
      if (navigator.share) {
        await navigator.share({ title: meta.title, text: meta.description, url });
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return; // visitor dismissed the sheet
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard");
    } catch {
      window.prompt("Copy this link:", url);
    }
  }

  /* ---- THEME HANDLING ---- */
  function applyTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("pulse-theme", theme);
    const metaColor = $('#metaThemeColor');
    if (metaColor) {
      metaColor.setAttribute("content", theme === "dark" ? "#000000" : "#000080");
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
        <span class="live-ind" title="Public GitHub data · no login required">
          <span class="dot"></span>PUBLIC
        </span>

        <span id="rateChip" style="display:none"></span>

        <button class="topbar-btn" id="shareBtn" title="Share this view" aria-label="Share this view">
          ${ICONS.share}
        </button>

        <a class="topbar-btn" id="githubProfileBtn" href="${esc(state.snapshot?.user?.htmlUrl || (ghAccount() ? "https://github.com/" + ghAccount() : "https://github.com"))}" target="_blank" rel="noopener noreferrer" title="Open GitHub profile" aria-label="Open GitHub profile (new tab)">
          ${ICONS.github}
        </a>

        <button class="topbar-btn" id="themeToggleBtn" title="Toggle Dark/Light Mode" aria-label="Toggle dark or light mode">
          ${isDark ? ICONS.sun : ICONS.moon}
        </button>

        ${u?.login ? `
          <a class="user-badge" href="https://github.com/${esc(u.login)}" target="_blank" rel="noopener noreferrer" title="View GitHub profile">
            <img src="${esc(u.avatar || "icons/icon.svg")}" alt="${esc(u.login)}" />
            <span class="user-login">${esc(u.login)}</span>
          </a>` : ""}
      </div>`;

    $('#brandBtn')?.addEventListener("click", () => {
      state.selectedRepo = "all";
      go("overview");
    });
    $('#topbarSearchTrigger')?.addEventListener("click", openCommandPalette);
    $('#shareBtn')?.addEventListener("click", shareCurrent);
    $('#themeToggleBtn')?.addEventListener("click", toggleTheme);
  }

  /* ---- SIDEBAR RENDERING ---- */
  function renderSidebar() {
    const sidebar = $('#sidebar');
    if (!sidebar) return;

    sidebar.innerHTML = `
      <nav class="nav-label" id="primaryNavLabel">Pulse Cockpit</nav>
      ${NAV.map((n) => {
        const badge = n.badge();
        const active = state.view === n.id;
        return `
          <button class="nav-item ${active ? "active" : ""}" data-nav="${n.id}"
            ${active ? 'aria-current="page"' : ""} aria-label="${esc(n.label)} section">
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
      <button class="nav-item" id="sidebarGithubBtn">
        <span class="ic">${ICONS.github}</span>
        <span>GitHub Profile</span>
        <span class="nav-badge">↗</span>
      </button>
      <button class="nav-item" id="sidebarRefreshBtn">
        <span class="ic">${ICONS.refresh}</span>
        <span>Refresh Data</span>
      </button>

      <div class="sidebar-foot" id="footMeta">
        <div class="retro-counter" style="width:100%;justify-content:space-between">
          <span class="rc-label">REPOS</span>
          <span class="rc-digits">${pad(state.snapshot?.repos?.length || 0, 3)}</span>
        </div>
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
    $('#sidebarGithubBtn')?.addEventListener("click", openGithubProfile);
    $('#sidebarRefreshBtn')?.addEventListener("click", fetchLive);
  }

  /* ---- MOBILE BOTTOM NAV ---- */
  function renderMobileNav() {
    const mobilenav = $('#mobilenav');
    if (!mobilenav) return;

    const m = [
      { id: "overview", label: "HOME", svg: ICONS.command },
      { id: "projects", label: "PROJECTS", svg: ICONS.repos },
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
        <button class="sheet-row" id="moreSheetGithubBtn" style="width:100%">
          <span class="ic" style="color:var(--cyan)">${ICONS.github}</span>
          <span class="rmeta">
            <span class="rt">GitHub Profile</span>
            <span class="rs">Open @${esc(ghAccount() || "github")} on github.com</span>
          </span>
        </button>
        <button class="sheet-row" id="moreSheetSuggestBtn" style="width:100%">
          <span class="ic" style="color:var(--green)">${ICONS.issue}</span>
          <span class="rmeta">
            <span class="rt">Suggest Something</span>
            <span class="rs">Propose an issue on a public repository</span>
          </span>
        </button>
      </div>`;

    $('#closeMoreSheet')?.addEventListener("click", closeOverlay);
    $('#moreSheetGithubBtn')?.addEventListener("click", () => {
      closeOverlay();
      openGithubProfile();
    });
    $('#moreSheetSuggestBtn')?.addEventListener("click", () => {
      closeOverlay();
      openSuggestModal();
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

  /* Move focus into the sheet that just opened; remember where we came from. */
  function focusSheet(overlay) {
    if (!overlay) return;
    state._lastFocus = document.activeElement;
    overlay.setAttribute("aria-hidden", "false");
    const target = overlay.querySelector(".sheet");
    if (target && !target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target?.focus({ preventScroll: true });
  }

  /* Return focus to the control that opened a sheet. */
  function restoreFocus() {
    const el = state._lastFocus;
    state._lastFocus = null;
    try { el?.focus?.({ preventScroll: true }); } catch {}
  }

  function closeSheets() {
    document.querySelectorAll('.overlay[role="dialog"].open').forEach((o) => {
      o.classList.remove("open");
      o.setAttribute("aria-hidden", "true");
    });
    restoreFocus();
  }

  function openOverlay() {
    const ov = $('#repoOverlay');
    ov.classList.add("open");
    focusSheet(ov);
  }

  function closeOverlay() {
    $('#repoOverlay').classList.remove("open");
    $('#repoOverlay').setAttribute("aria-hidden", "true");
    restoreFocus();
  }

  /* ---- PUBLIC PROFILE HELPERS ---- */
  function openGithubProfile() {
    const login = ghAccount();
    if (!login) {
      toast("No GitHub account configured in js/config.js");
      return;
    }
    window.open(`https://github.com/${encodeURIComponent(login)}`, "_blank", "noopener,noreferrer");
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
          title: "Open GitHub Profile",
          sub: "GitHub",
          icon: ICONS.github,
          action: openGithubProfile,
        },
        {
          title: "Suggest Something (Open an Issue)",
          sub: "Contact",
          icon: ICONS.issue,
          action: openSuggestModal,
        },
        {
          title: `Switch to ${state.theme === "dark" ? "Light" : "Dark"} Theme`,
          sub: "Theme",
          icon: state.theme === "dark" ? ICONS.sun : ICONS.moon,
          action: toggleTheme,
        },
        {
          title: "Refresh from GitHub (Live)",
          sub: "Public API",
          icon: ICONS.refresh,
          action: fetchLive,
        },
        {
          title: "Focus All Repositories",
          sub: "Filter",
          icon: ICONS.command,
          action: () => {
            state.selectedRepo = "all";
            go("overview");
          },
        },
        ...accountList().map((a) => ({
          title: `Open @${a}'s page`,
          sub: "Account",
          icon: ICONS.user,
          action: () => goAccount(a),
        })),
        ...accountList().map((a) => ({
          title: `Show only @${a}`,
          sub: "Account filter",
          icon: ICONS.layers,
          action: () => {
            state.accountFilter = a;
            state.selectedRepo = "all";
            go("overview");
            toast(`Showing @${a} only`);
          },
        })),
        ...(accountList().length > 1
          ? [
              {
                title: "Show all featured accounts",
                sub: "Account filter",
                icon: ICONS.layers,
                action: () => {
                  state.accountFilter = "all";
                  go("overview");
                  toast("Showing every account");
                },
              },
            ]
          : []),
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
            sub: `${r.language || "code"} · ★${r.stars}`,
            icon: ICONS.repos,
            action: () => goProject(r.name),
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
    focusSheet(overlay);
  }

  function closeCommandPalette() {
    const overlay = $('#paletteOverlay');
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    restoreFocus();
  }

  /* ---- PER-ACCOUNT PAGES (deep-linkable: #/account/<login>) ---- */
  function accountFor(login) {
    const summaries = accountSummaries();
    return (
      summaries.find((a) => String(a.login).toLowerCase() === String(login || "").toLowerCase()) ||
      summaries[0] ||
      null
    );
  }

  function renderAccount() {
    const account = accountFor(state.selectedAccount);
    if (!account) {
      return section("Account", "No account found", "", `<div class="card">That account is not part of this showcase.</div>`);
    }
    const login = account.login;
    const repos = repoList().filter((r) => repoOwner(r) === login);
    const m = account.metrics || {};
    const cal = state.snapshot?.contributions?.[login];
    const bytes = repos.reduce((a, r) => a + (r.languageBytes || 0), 0);
    const langs = Object.entries(
      repos.reduce((acc, r) => {
        for (const [lang, b] of Object.entries(r.languages || {})) acc[lang] = (acc[lang] || 0) + b;
        return acc;
      }, {})
    ).sort((a, b) => b[1] - a[1]);
    const totalLangBytes = langs.reduce((a, [, b]) => a + b, 0) || 1;
    const top = repos.slice().sort((a, b) => b.stars - a.stars || new Date(b.pushedAt) - new Date(a.pushedAt)).slice(0, 6);

    return section(
      account.name || login,
      `@${login}${account.company ? " · " + account.company : ""} · ${repos.length} public repositories · joined ${account.createdAt ? new Date(account.createdAt).getFullYear() : "—"}`,
      `<button class="btn btn-sm" id="accountBackBtn">${ICONS.back || ICONS.command} All accounts</button>
       <button class="btn btn-sm" id="accountShareBtn">${ICONS.share} Share</button>
       <button class="btn btn-sm" id="accountFilterBtn">${ICONS.command} Filter dashboard to @${esc(login)}</button>
       <a class="btn btn-sm" href="${esc(account.htmlUrl || "https://github.com/" + login)}" target="_blank" rel="noopener noreferrer">${ICONS.github} GitHub profile</a>`,
      `<div class="card account-hero">
        <img src="${esc(account.avatar || `https://github.com/${login}.png`)}" alt="" />
        <div class="account-meta">
          <div class="account-name">${esc(account.name || login)}</div>
          ${account.bio ? `<p class="project-pitch" style="margin:6px 0 0">${esc(account.bio)}</p>` : ""}
          <div class="account-stats">
            <span><b>${fmtNum(account.followers ?? "—")}</b> followers</span>
            <span><b>${fmtNum(account.following ?? "—")}</b> following</span>
            <span><b>${fmtNum(account.publicRepos ?? repos.length)}</b> public repos</span>
            <span>last push ${fmtAgo(account.latestPush)}</span>
          </div>
        </div>
      </div>

      <div style="height:18px"></div>
      <div class="bento">
        ${statCard("Contributions", fmtNum(m.contributionsLastYear ?? cal?.total ?? 0), "last 12 months", "var(--green)", ICONS.pulse)}
        ${statCard("Active Days", fmtNum(m.activeDays ?? cal?.activeDays ?? 0), `${plural(cal?.currentStreak || m.currentStreak || 0, "day")} current streak`, "var(--cyan)", ICONS.activity)}
        ${statCard("PRs Merged", fmtNum(m.prsMerged ?? 0), `${fmtNum(m.prsOpened ?? 0)} opened`, "var(--violet)", ICONS.branch)}
        ${statCard("Issues", fmtNum(m.issuesOpened ?? 0), "authored", "var(--amber)", ICONS.issue)}
        ${statCard("Code", formatBytes(bytes || account.codeBytes || 0), "in public repos", "var(--blue)", ICONS.layers)}
        ${statCard("Stars", fmtNum(repos.reduce((a, r) => a + r.stars, 0)), `${fmtNum(repos.reduce((a, r) => a + r.forks, 0))} forks`, "var(--amber)", ICONS.star)}
      </div>

      <div style="height:18px"></div>
      <div class="bento">
        ${contributionHeatmapWidget(login)}
        ${langs.length ? `
          <div class="card col2">
            <div class="card-head">
              <div class="card-title"><span class="stat-icon" style="color:var(--violet)">${ICONS.code}</span> @${esc(login)}'s Stack</div>
              <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${formatBytes(totalLangBytes)} · by bytes</span>
            </div>
            <div class="lang-bar">
              ${langs.map(([lang, b]) => `<div class="lang-seg" style="width:${((b / totalLangBytes) * 100).toFixed(2)}%;background:${getLangColor(lang)}" title="${esc(lang)}: ${formatBytes(b)}"></div>`).join("")}
            </div>
            <div class="lang-legend">
              ${langs.slice(0, 6).map(([lang, b]) => `
                <div class="lang-item">
                  <span class="ldot" style="background:${getLangColor(lang)}"></span>
                  <span>${esc(lang)} <b>${((b / totalLangBytes) * 100).toFixed(1)}%</b> <em>${formatBytes(b)}</em></span>
                </div>`).join("")}
            </div>
          </div>` : ""}
      </div>

      <div style="height:26px"></div>
      <div class="card-head">
        <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.repos}</span> Top work from @${esc(login)}</div>
      </div>
      <div class="hl-grid">${top.map((r, i) => highlightCard(r, i)).join("")}</div>`
    );
  }

  /* ---- "NOW" STRIP (what is happening right now) ---- */
  function nowStrip() {
    const repos = repoList();
    if (!repos.length) return "";
    const m = state.snapshot?.metrics || {};
    const lastPush = repos.map((r) => r.pushedAt).filter(Boolean).sort().at(-1);
    const week = repos.filter((r) => Date.now() - new Date(r.pushedAt).getTime() < 7 * 864e5);
    const releases = allReleases();
    const latest = releases.slice().sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0];
    const runs = allWorkflowRuns();
    const lastRun = runs.slice().sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))[0];

    const chip = (icon, value, label, color) => `
      <div class="now-chip">
        <span class="stat-icon" style="color:${color}">${icon}</span>
        <span class="now-value">${value}</span>
        <span class="now-label">${label}</span>
      </div>`;

    return `
      <div class="now-strip">
        <span class="now-title">${ICONS.pulse} RIGHT NOW</span>
        <div class="now-chips">
          ${chip(ICONS.activity, plural(m.currentStreak || 0, "day"), "current streak", "var(--green)")}
          ${chip(ICONS.zap, String(week.length), `project${week.length === 1 ? "" : "s"} pushed this week`, "var(--cyan)")}
          ${chip(ICONS.gitCommit, lastPush ? fmtAgo(lastPush) : "—", "last public commit", "var(--violet)")}
          ${latest ? chip(ICONS.award, esc(latest.name || latest.tagName || "release"), `newest release · ${fmtAgo(latest.publishedAt)}`, "var(--amber)") : ""}
          ${lastRun ? chip(lastRun.conclusion === "success" ? ICONS.pulse : ICONS.ci, esc(lastRun.conclusion || lastRun.status || "run"), `CI · ${fmtAgo(lastRun.createdAt)}`, lastRun.conclusion === "success" ? "var(--green)" : "var(--amber)") : ""}
        </div>
      </div>`;
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
    const u = ghAccount();
    if (!u) {
      toast("No GitHub account configured");
      return;
    }
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

  /* READMEs are heavily HTML (badges, banners, centred blocks). We allow a
     small, sanitised subset so profile READMEs render instead of showing raw
     markup — everything else is escaped, event handlers and scripts dropped. */
  const MD_ALLOWED_TAGS = new Set([
    "div", "span", "p", "br", "hr", "img", "a", "b", "strong", "i", "em", "u", "s",
    "code", "pre", "sub", "sup", "small", "h1", "h2", "h3", "h4", "h5", "h6",
    "ul", "ol", "li", "table", "thead", "tbody", "tr", "th", "td",
    "details", "summary", "blockquote", "picture", "source", "center",
  ]);
  const MD_ALLOWED_ATTRS = new Set([
    "href", "src", "alt", "title", "align", "width", "height", "target", "rel",
    "class", "srcset", "sizes", "colspan", "rowspan", "loading",
  ]);

  function sanitizeHtml(html) {
    return String(html)
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<(script|style|iframe|object|embed|form|input|link|meta)\b[\s\S]*?<\/\1\s*>/gi, "")
      .replace(/<(script|style|iframe|object|embed|form|input|link|meta)\b[^>]*\/?>/gi, "")
      .replace(/<([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^<>]*?)?)\/?>/g, (match, tag, attrs) => {
        const name = tag.toLowerCase();
        if (!MD_ALLOWED_TAGS.has(name)) return "";
        const kept = [];
        const attrRe = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
        let m;
        while ((m = attrRe.exec(attrs || ""))) {
          const attr = m[1].toLowerCase();
          const value = (m[3] ?? m[4] ?? m[5] ?? "").trim();
          if (attr.startsWith("on")) continue; // never keep event handlers
          if (!MD_ALLOWED_ATTRS.has(attr)) continue;
          if ((attr === "href" || attr === "src") && /^\s*(javascript|data|vbscript):/i.test(value)) continue;
          kept.push(`${attr}="${esc(value)}"`);
        }
        if (name === "a") {
          kept.push('target="_blank"');
          kept.push('rel="noopener noreferrer"');
        }
        if (name === "img") kept.push('loading="lazy"');
        return `<${name}${kept.length ? " " + kept.join(" ") : ""}>`;
      })
      .replace(/<\/([a-zA-Z][a-zA-Z0-9-]*)>/g, (m, tag) =>
        MD_ALLOWED_TAGS.has(tag.toLowerCase()) ? `</${tag.toLowerCase()}>` : ""
      );
  }

  /** Sanitised inline HTML mixed with markdown, e.g. `<b>hi</b> and **bold**`. */
  function inlineMdHTML(s) {
    return String(s == null ? "" : s)
      .split(/(<[^>]+>)/g)
      .map((part) => (part.startsWith("<") ? sanitizeHtml(part) : inlineMd(part)))
      .join("");
  }

  function renderMarkdown(md) {
    if (!md) return "";
    const cleaned = String(md)
      .replace(/\r\n/g, "\n")
      .replace(/<!--[\s\S]*?-->/g, ""); // strip html comments up front
    const lines = cleaned.split("\n");
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

      // Standalone / multi-line raw HTML blocks (badges, banners, tables).
      if (/^\s*<[a-zA-Z!/]/.test(line)) {
        closeList();
        const block = [];
        while (i < lines.length && lines[i].trim() !== "" && /^\s*</.test(lines[i])) {
          block.push(lines[i]);
          i++;
        }
        const raw = block.join("\n");
        // A lone inline-html line may just be text; render it as a paragraph.
        html += /^\s*<(div|p|table|details|center|h[1-6]|img|picture|a|span|br|hr)/i.test(raw)
          ? `<div class="md-html">${inlineMdHTML(raw)}</div>`
          : `<p class="md-p">${inlineMdHTML(raw)}</p>`;
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

  /* ---- 8. ABOUT (identity, links, profile README, timeline) ---- */
  function renderAbout() {
    const s = state.snapshot || {};
    const u = s.user || {};
    const p = s.profile;
    const login = u.login || ghAccount();
    const links = displayLinks();
    const repos = repoList();
    const years = accountYears();

    const contactRows = [
      `<a class="btn btn-primary" href="${profileUrl()}" target="_blank" rel="noopener noreferrer">${ICONS.github} GitHub</a>`,
      ...links.map(
        (l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${ICONS.externalLink} ${esc(l.label)}</a>`
      ),
      u.blog ? `<a class="btn" href="${esc(u.blog.startsWith("http") ? u.blog : "https://" + u.blog)}" target="_blank" rel="noopener noreferrer">${ICONS.globe} Website</a>` : "",
      `<button class="btn" id="refreshProfileBtn">${ICONS.refresh} Sync README</button>`,
    ].filter(Boolean).join("");

    const accounts = accountSummaries();

    const accountCards =
      accounts.length > 1
        ? `<div class="card">
             <div class="card-head">
               <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.layers}</span> Accounts</div>
               <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${accounts.length} featured</span>
             </div>
             <div class="account-grid">${accounts
               .map(
                 (a) => `
               <div class="account-card ${state.accountFilter === a.login ? "active" : ""}" data-account="${esc(a.login)}" title="Filter to @${esc(a.login)}">
                 <img src="${esc(a.avatar || `https://github.com/${a.login}.png`)}" alt="" />
                 <div class="account-meta">
                   <div class="account-name">${esc(a.name || a.login)}</div>
                   <a class="account-login" href="https://github.com/${esc(a.login)}" target="_blank" rel="noopener noreferrer">@${esc(a.login)}</a>
                   ${a.bio ? `<div class="account-bio">${esc(a.bio)}</div>` : ""}
                   <div class="account-stats">
                     <span><b>${fmtNum(a.repoCount || 0)}</b> public repos</span>
                     <span><b>${a.followers != null ? fmtNum(a.followers) : "—"}</b> followers</span>
                   </div>
                 </div>
               </div>`
               )
               .join("")}</div>
           </div>`
        : "";

    const identityCard = `
      <div class="card col2 profile-card">
        <div class="profile-head">
          ${u.avatar ? `<img class="profile-avatar" src="${esc(u.avatar)}" alt="" />` : ""}
          <div>
            <div class="profile-name">${esc(u.name || login || "")}</div>
            <div class="profile-login">${esc(accountList().map((a) => "@" + a).join(" + ") || "@" + (login || ""))}${u.location ? " · " + esc(u.location) : ""}${u.followers != null ? " · " + plural(u.followers, "follower") : ""}</div>
          </div>
        </div>
        ${u.bio ? `<p class="about-bio">${esc(u.bio)}</p>` : ""}
        <div class="hero-actions" style="margin-top:14px">${contactRows}</div>
        <div class="about-facts">
          <div><span>Public repos</span><b>${fmtNum(repos.length)}</b></div>
          <div><span>Stars earned</span><b>${fmtNum(repos.reduce((a, r) => a + r.stars, 0))}</b></div>
          <div><span>On GitHub</span><b>${years != null ? years + "y" : "—"}</b></div>
          <div><span>Latest push</span><b>${repos[0] ? fmtAgo(repos[0].pushedAt) : "—"}</b></div>
        </div>
      </div>`;

    const readmeCard = `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.readme}</span> Profile README${p?.owner ? ` · @${esc(p.owner)}` : ""}</div>
          ${p?.url ? `<a class="btn btn-sm" href="${esc(p.url)}" target="_blank" rel="noopener noreferrer">${ICONS.repos} Source repo</a>` : ""}
        </div>
        ${
          p && p.raw
            ? `<div class="md-body">${renderMarkdown(p.raw)}</div>`
            : `<div style="font-size:14px;color:var(--muted);line-height:1.7">
                 <p><b>@${esc(login || "this account")}</b> has no profile README yet, so GitHub's own profile page is the source of truth.</p>
                 <p>Create a repository named <code>${esc(login || "login")}/${esc(login || "login")}</code> with a <code>README.md</code> and it will be rendered here automatically.</p>
               </div>`
        }
      </div>`;

    return section(
      "About",
      `${esc(u.name || login || "")} · public GitHub profile`,
      `<a class="btn btn-sm" href="${profileUrl()}" target="_blank" rel="noopener noreferrer">${ICONS.github} Follow on GitHub</a>`,
      `<div class="bento">${accountCards}${identityCard}${readmeCard}</div>`
    );
  }

  /* ---- RENDER DISPATCH ---- */
  function render() {
    syncMeta();
    renderTopbar();
    renderSidebar();
    renderMobileNav();
    const stage = $('#stage');

    const views = {
      overview: renderOverview,
      highlights: renderHighlights,
      numbers: renderNumbers,
      activity: renderActivity,
      projects: renderProjects,
      project: renderProject,
      account: renderAccount,
      craft: renderCraft,
      about: renderAbout,
    };

    const fn = views[state.view] || renderOverview;
    stage.innerHTML = '<div class="loading"><div class="pulse-ring"></div><span>LOADING…</span></div>';
    requestAnimationFrame(() => {
      stage.innerHTML = marqueeBar() + fn();
      bindStage(stage);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindProjectLinks(root) {
    $$('[data-project]', root || document).forEach((card) =>
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return; // let real links win
        goProject(card.dataset.project);
      })
    );
  }

  function updateReposGrid() {
    const container = $("#reposGridContainer");
    if (!container) return;
    container.innerHTML = getFilteredReposHtml();
    bindProjectLinks(container);
  }

  function bindStage(stage) {
    $$('#stage [data-repolink]').forEach((b) =>
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        openRepoSelector();
      })
    );

    bindProjectLinks(stage);

    $$('#stage [data-account]').forEach((b) =>
      b.addEventListener("click", () => {
        const id = b.dataset.account;
        state.accountFilter = id === "all" ? "all" : id;
        if (state.selectedRepo !== "all" && state.accountFilter !== "all") {
          const repo = repoList().find((r) => r.name === state.selectedRepo);
          if (repo && repoOwner(repo) !== state.accountFilter) state.selectedRepo = "all";
        }
        render();
        toast(state.accountFilter === "all" ? "Showing every account" : `Showing @${state.accountFilter} only`);
      })
    );

    $('#heroSuggestBtn')?.addEventListener("click", () => openSuggestModal());
    $$('#stage [data-nav-jump]').forEach((b) =>
      b.addEventListener("click", () => go(b.dataset.navJump))
    );
    $('#projectBackBtn')?.addEventListener("click", () => go("projects"));
    $('#projectShareBtn')?.addEventListener("click", shareCurrent);
    $('#accountBackBtn')?.addEventListener("click", () => go("numbers"));
    $('#accountShareBtn')?.addEventListener("click", shareCurrent);
    $('#accountFilterBtn')?.addEventListener("click", () => {
      state.accountFilter = state.selectedAccount;
      go("overview");
      toast(`Dashboard filtered to @${state.selectedAccount}`);
    });
    $$('[data-account-page]').forEach((el) =>
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        goAccount(el.dataset.accountPage);
      })
    );
    $('#copyHttpsBtn')?.addEventListener("click", () => {
      const repo = repoList().find((r) => r.name === state.selectedProject);
      if (!repo) return;
      navigator.clipboard.writeText(`https://github.com/${repo.fullName}.git`);
      toast("Copied HTTPS clone URL");
    });
    $('#copySshBtn')?.addEventListener("click", () => {
      const repo = repoList().find((r) => r.name === state.selectedProject);
      if (!repo) return;
      navigator.clipboard.writeText(`git@github.com:${repo.fullName}.git`);
      toast("Copied SSH clone URL");
    });

    $('#exportSummaryTrigger')?.addEventListener("click", copyMarkdownSummary);

    $('#createIssueBtn')?.addEventListener("click", () => openSuggestModal());
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

    // CI realtime controls
    $('#wfRefreshBtn')?.addEventListener("click", async () => {
      toast("Refreshing workflows…");
      await fetchWorkflowLive(undefined, { manual: true });
      toast("Workflows refreshed");
    });
    $('#wfPollToggleBtn')?.addEventListener("click", () => toggleWorkflowPoll());
    $$('#stage [data-ci-filter]').forEach((b) => {
      b.addEventListener("click", () => {
        state.ciFilter = b.dataset.ciFilter;
        render();
      });
    });
  }

  function go(view, opts = {}) {
    state.view = view;
    // Keep the address bar in sync so any view is directly linkable.
    if (!opts.keepHash) {
      try {
        const target = "#/" + view;
        if (location.hash !== target) history.replaceState(null, "", target);
      } catch {}
    }
    if (view === "craft" || view === "project") {
      if (!state._pollTimer) scheduleWorkflowPoll();
    } else {
      if (state._pollTimer) stopWorkflowPoll();
    }
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

  /* Account filter chips — only rendered when more than one account exists. */
  const accountPills = () => {
    const accounts = accountList();
    if (accounts.length < 2) return "";
    const chip = (id, label, avatar) => `
      <button class="account-pill ${state.accountFilter === id ? "active" : ""}" data-account="${esc(id)}" title="Show ${esc(label)}">
        ${avatar ? `<img src="${esc(avatar)}" alt="" />` : ICONS.layers}
        <span>${esc(label)}</span>
      </button>`;
    return `<div class="account-pills">
      ${chip("all", "All accounts", null)}
      ${accounts.map((a) => chip(a, "@" + a, accountAvatar(a))).join("")}
    </div>`;
  };

  const pill = () => `
    <button class="repo-pill" data-repolink title="Change repository focus">
      <span class="stat-icon" style="color:var(--cyan)">${ICONS.repos}</span>
      ${state.selectedRepo === "all" ? '<span class="all">ALL REPOSITORIES</span>' : `<span style="color:var(--text-bright)">${esc(state.selectedRepo.replace(/[-_]/g, " ").toUpperCase())}</span>`}
      <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>`;


  /* ---- 90s FURNITURE ----
     The decorative layer every period page had: a scrolling marquee, a hit
     counter, a swatch strip and an "under construction" sign. Built from
     real snapshot numbers so nothing here is fabricated, and marked
     aria-hidden where it is purely ornamental. */

  const pad = (n, len = 6) => String(Math.max(0, Math.round(n || 0))).padStart(len, "0");

  function marqueeBar() {
    const repos = repoList();
    const u = state.snapshot?.user || {};
    const m = state.snapshot?.metrics || {};
    const accounts = accountList();
    const bits = [
      `<b>★ WELCOME TO PULSE ★</b>`,
      `<i>${repos.length} PUBLIC REPOSITORIES</i>`,
      `<u>${fmtNum(m.contributionsLastYear || 0)} CONTRIBUTIONS IN THE LAST YEAR</u>`,
      `<s>${accounts.length ? accounts.map((a) => "@" + a).join(" + ") : "@github"}</s>`,
      `<em>${fmtNum(u.followers || 0)} FOLLOWERS · ${fmtNum(state.snapshot?.totalStars || 0)} STARS</em>`,
      `<b>BEST VIEWED WITH ANY BROWSER</b>`,
      `<i>NO LOGIN · NO TRACKING · PUBLIC DATA ONLY</i>`,
    ];
    return `
      <div class="retro-marquee" aria-hidden="true">
        <span>${bits.join(' &nbsp;◆&nbsp; ')} &nbsp;◆&nbsp; </span>
      </div>`;
  }

  /* Hit counter — the single most 90s object on the page. Counts real
     public contributions, not fictional visitors. */
  function hitCounterPanel() {
    const m = state.snapshot?.metrics || {};
    const u = state.snapshot?.user || {};
    const since = u.createdAt ? new Date(u.createdAt).getFullYear() : null;
    const hits = m.contributionsLastYear || 0;
    const days = m.activeDays || 0;
    return `
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--amber)">${ICONS.pulse}</span> Hit Counter</div>
          ${since ? `<span>since ${since}</span>` : ""}
        </div>
        <div class="retro-counter">
          <span class="rc-label">HITS</span>
          <span class="rc-digits">${pad(hits)}</span>
        </div>
        <div class="metric-sub" style="margin-top:10px">
          Public contributions in the last 12 months · ${fmtNum(days)} active days
        </div>
      </div>`;
  }

  /* Pure decoration: the 16-colour palette, beveled. */
  function swatchPanel() {
    const colours = ["#000000","#808080","#c0c0c0","#ffffff","#ff0000","#00ff00","#0000ff","#ffff00",
                     "#ff00ff","#00ffff","#800000","#008000","#000080","#808000","#800080","#008080"];
    return `
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--violet)">${ICONS.layers}</span> Colour Palette</div>
          <span>16 / 256</span>
        </div>
        <div class="retro-swatches" role="img" aria-label="The sixteen colour VGA palette used by this page">
          ${colours.map((c) => `<span class="retro-swatch" style="background:${c}"></span>`).join("")}
        </div>
        <div class="metric-sub" style="margin-top:10px">Every colour on this page comes from this palette.</div>
      </div>`;
  }

  /* Construction stripes — used as the closing call to action. */
  function underConstructionBanner() {
    const login = ghAccount();
    return `
      <section class="retro-construction" style="margin-top:18px">
        <div class="strip-inner">
          <div class="retro-construction-title">*** This showcase is under construction ***</div>
          <p style="margin:8px 0 12px;max-width:70ch">
            Pulse is regenerated from ${login ? "@" + esc(login) + "'s" : "the"} public GitHub data on every
            push, so new repositories, releases and CI runs appear here on their own. Nothing is
            hand-maintained and nothing goes stale.
          </p>
          <div class="retro-uc" style="margin-bottom:12px">
            <span class="uc-sign" aria-hidden="true">⚠</span>
            <span>Best viewed at 800×600</span>
            <span class="retro-pulse">NEW!</span>
          </div>
          <button class="btn btn-primary" data-nav-jump="projects">Browse all projects →</button>
        </div>
      </section>`;
  }

  /* ---- HERO: identity, links and live public status ---- */
  function heroPanel() {
    const u = state.snapshot?.user || {};
    const repos = repoList();
    const m = momentum();
    const links = displayLinks();
    const login = u.login || ghAccount();
    const joinedYear = u.createdAt ? new Date(u.createdAt).getFullYear() : null;
    const accounts = accountList();
    const accountLabel = accounts.length > 1 ? accounts.map((a) => "@" + a).join(" + ") : "@" + login;
    const chips = [
      u.location ? `<span class="chip">${ICONS.globe}${esc(u.location)}</span>` : "",
      u.company ? `<span class="chip">${ICONS.layers}${esc(u.company)}</span>` : "",
      joinedYear ? `<span class="chip">${ICONS.award}On GitHub since ${joinedYear}</span>` : "",
      u.followers != null ? `<span class="chip">${ICONS.community}${plural(u.followers, "follower")}</span>` : "",
      `<span class="chip">${ICONS.repos}${repos.length} public repos</span>`,
      accounts.length > 1
        ? `<span class="chip" title="${esc(accountLabel)}">${ICONS.layers}${accounts.length} accounts</span>`
        : "",
    ].join("");

    const actions = [
      ...accountList().map(
        (a, i) =>
          `<a class="btn ${i === 0 ? "btn-primary" : ""}" href="https://github.com/${esc(a)}" target="_blank" rel="noopener noreferrer">${ICONS.github} @${esc(a)}</a>`
      ),
      ...links.map(
        (l) => `<a class="btn" href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${ICONS.externalLink} ${esc(l.label)}</a>`
      ),
      `<button class="btn" id="heroSuggestBtn">${ICONS.issue} Suggest Something</button>`,
    ].join("");

    return `
      <div class="card hero">
        <div class="hero-main">
          <img class="hero-avatar" src="${esc(u.avatar || "icons/icon.svg")}" alt="${esc(login || "GitHub")}" />
          <div class="hero-id">
            <div class="hero-name">${esc(u.name || login || "GitHub account")}</div>
            <div class="hero-handles">
              ${accounts.length > 1
                ? accounts
                    .map(
                      (a) =>
                        `<a class="hero-handle" href="https://github.com/${esc(a)}" target="_blank" rel="noopener noreferrer">@${esc(a)}</a>`
                    )
                    .join('<span class="hero-handle-sep">·</span>')
                : `<a class="hero-handle" href="${profileUrl()}" target="_blank" rel="noopener noreferrer">@${esc(login || "github")}</a>`}
            </div>
            <p class="hero-bio">${esc(u.bio || displayConfig().tagline || "Public repositories, activity and release history — read straight from GitHub, no login required.")}</p>
            <div class="hero-chips">${chips}</div>
          </div>
        </div>
        <div class="hero-side">
          <div class="hero-live">
            <span class="status ok"><span class="sdot"></span>${m.latest ? "LAST PUSH " + fmtAgo(m.latest.pushedAt).toUpperCase() : "AWAITING DATA"}</span>
            <div class="hero-live-sub">${m.latest ? `Most recently active: <b>${esc(m.latest.name)}</b>` : "Repository data is still loading"}</div>
            <div class="hero-momentum">
              <span><b>${fmtNum(m.week)}</b> repos active this week</span>
              <span><b>${fmtNum(m.month)}</b> this month</span>
            </div>
          </div>
          <div class="hero-actions">${actions}</div>
        </div>
      </div>`;
  }

  /* ---- HIGHLIGHT CARD (auto-derived, no hand-written content needed) ---- */
  function highlightCard(r, index) {
    const langCol = getLangColor(r.language);
    const st = repoStatus(r);
    const summary = (r.readmeExcerpt || r.description || "No description yet — open the project for the full picture.").slice(0, 240);
    const topics = (r.topics || []).slice(0, 3);
    return `
      <div class="card hl-card" data-project="${esc(r.name)}" title="Open ${esc(r.name)}">
        <div class="hl-head">
          <span class="hl-rank">${String(index + 1).padStart(2, "0")}</span>
          <span class="status ${st === "active" ? "ok" : st === "archived" ? "warn" : "run"}"><span class="sdot"></span>${st.toUpperCase()}</span>
        </div>
        <div class="hl-title">${esc(r.name)}</div>
        <p class="hl-pitch">${esc(summary)}</p>
        <div class="hl-stack">
          ${r.language ? `<span class="lang-tag" style="--lang:${langCol}">${esc(r.language)}</span>` : ""}
          ${topics.map((t) => `<span class="priv-tag">${esc(t)}</span>`).join("")}
        </div>
        <div class="hl-foot">
          ${accountList().length > 1 ? `<span class="owner-tag">@${esc(repoOwner(r))}</span>` : ""}
          <span><span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>${fmtNum(r.stars)}</span>
          <span><span class="stat-icon" style="color:var(--violet)">${ICONS.fork}</span>${fmtNum(r.forks)}</span>
          <span><span class="stat-icon" style="color:var(--cyan)">${ICONS.gitCommit}</span>${fmtAgo(r.pushedAt)}</span>
          <span class="hl-open">Open project →</span>
        </div>
      </div>`;
  }

  function statCard(label, value, sub, color, icon) {
    return `
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:${color}">${icon}</span> ${label}</div>
        </div>
        <div class="metric" style="color:${color}">${value}</div>
        <div class="metric-sub">${sub}</div>
      </div>`;
  }

  /* ---- 1. OVERVIEW ---- */
  function renderOverview() {
    const repos = repoList();
    const u = state.snapshot?.user || {};
    const m = momentum();
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const languages = new Set(repos.filter((r) => r.language).map((r) => r.language));
    const topLang = Object.entries(
      repos.reduce((acc, r) => (r.language ? { ...acc, [r.language]: (acc[r.language] || 0) + 1 } : acc), {})
    ).sort((a, b) => b[1] - a[1])[0]?.[0];
    const featured = featuredRepos(3);

    const actions = `
      ${accountPills()}
      ${pill()}
      <button class="btn btn-sm" id="exportSummaryTrigger" title="Copy a markdown summary">${ICONS.share} Share</button>`;

    return section(
      "Overview",
      `Public work from ${accountList().map((a) => "@" + a).join(" and ") || "GitHub"} · ${repos.length} repositories${state.accountFilter === "all" ? "" : " · @" + state.accountFilter}`,
      actions,
      `${heroPanel()}
       ${nowStrip()}
       <div class="bento" style="margin-top:18px">
         ${statCard("Public Repos", fmtNum(repos.length), `${languages.size} languages`, "var(--cyan)", ICONS.repos)}
         ${statCard("Stars", fmtNum(stars), "developer appreciation", "var(--amber)", ICONS.star)}
         ${statCard("Forks", fmtNum(forks), "community reuse", "var(--violet)", ICONS.fork)}
         ${statCard("Active This Week", fmtNum(m.week), m.month ? `${m.month} in the last 30 days` : "no recent pushes", "var(--green)", ICONS.zap)}
         ${statCard("Primary Stack", esc(topLang || "—"), "most used language", "var(--blue)", ICONS.code)}
         ${statCard("Followers", u.followers != null ? fmtNum(u.followers) : "—", u.following != null ? `following ${fmtNum(u.following)}` : "public profile", "var(--red)", ICONS.community)}
       </div>
       <div class="bento" style="margin-top:18px">
         ${hitCounterPanel()}
         ${swatchPanel()}
       </div>
       <div class="bento">
         <div class="card col2 overview-featured">
           <div class="card-head">
             <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.zap}</span> What I've Been Building</div>
             <button class="btn btn-sm" data-nav-jump="highlights">All highlights →</button>
           </div>
           <div class="hl-grid compact">${featured.map((r, i) => highlightCard(r, i)).join("")}</div>
         </div>
         ${recentActivityWidget()}
         ${commitPulseWidget()}
         ${contributionHeatmapWidget()}
         ${topRepositoriesWidget()}
       </div>
       ${underConstructionBanner()}`
    );
  }

  /* ---- 2. HIGHLIGHTS ---- */
  function renderHighlights() {
    const featured = featuredRepos(6);
    return section(
      "Highlights",
      `The work that best represents what I build${state.accountFilter === "all" ? "" : " · @" + state.accountFilter}`,
      `${accountPills()}${pill()}`,
      `<div class="retro-uc" style="margin-bottom:16px">
        <span class="uc-sign" aria-hidden="true">★</span>
        <span>Editor's picks — ranked automatically from public signals</span>
        <span class="retro-pulse">HOT!</span>
      </div>
      <div class="callout-box" style="margin-bottom:16px">
        These are derived automatically from public GitHub signals — recency of work,
        reach (stars/forks) and how complete each repository looks (description, live
        site, topics, license). No hand-curated list to go stale.
      </div>
      <div class="hl-grid">
        ${featured.map((r, i) => highlightCard(r, i)).join("") ||
          '<div class="card" style="padding:32px;text-align:center;color:var(--faint)">No public repositories to highlight yet.</div>'}
      </div>`
    );
  }

  /* Per-account comparison — only meaningful with more than one account. */
  function accountComparisonCard() {
    const accounts = accountSummaries();
    if (accounts.length < 2) return "";
    const rows = accounts
      .map((a) => {
        const own = repoList().filter((r) => repoOwner(r) === a.login);
        const stars = own.reduce((s, r) => s + r.stars, 0);
        return `
        <div class="account-card ${state.accountFilter === a.login ? "active" : ""}" data-account="${esc(a.login)}" title="Filter to @${esc(a.login)}">
          <img src="${esc(a.avatar || `https://github.com/${a.login}.png`)}" alt="" />
          <div class="account-meta">
            <div class="account-name">${esc(a.name || a.login)}</div>
            <a class="account-login" href="https://github.com/${esc(a.login)}" target="_blank" rel="noopener noreferrer">@${esc(a.login)}</a>
            ${a.bio ? `<div class="account-bio">${esc(a.bio)}</div>` : ""}
            <div class="account-stats">
              <span><b>${fmtNum(own.length || a.repoCount || 0)}</b> repos</span>
              <span><b>${fmtNum(stars || a.stars || 0)}</b> stars</span>
              <span><b>${a.followers != null ? fmtNum(a.followers) : "—"}</b> followers</span>
              <span>last push ${fmtAgo(a.latestPush || own[0]?.pushedAt)}</span>
            </div>
            <button class="btn btn-sm account-page-btn" data-account-page="${esc(a.login)}">Open @${esc(a.login)}'s page →</button>
          </div>
        </div>`;
      })
      .join("");

    return `
      <div class="card" style="margin-bottom:18px">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.layers}</span> Featured Accounts</div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">click to filter</span>
        </div>
        <div class="account-grid">${rows}</div>
      </div>`;
  }

  /* ---- 3. NUMBERS ---- */
  function renderNumbers() {
    const repos = repoList();
    const m = state.snapshot?.metrics || {};
    const u = state.snapshot?.user || {};
    const releases = allReleases();
    const runs = allWorkflowRuns();
    const completed = runs.filter((r) => r.status === "completed");
    const passed = completed.filter((r) => r.conclusion === "success");
    const passRate = completed.length ? Math.round((passed.length / completed.length) * 100) : null;
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const issues = repos.reduce((a, r) => a + r.openIssues, 0);
    const years = accountYears();

    const leaderboard = repos
      .slice()
      .sort((a, b) => b.stars - a.stars || new Date(b.pushedAt) - new Date(a.pushedAt))
      .slice(0, 6)
      .map(
        (r, i) => `
      <div class="mini-row" data-project="${esc(r.name)}" title="Open ${esc(r.name)}">
        <div class="av" style="background:linear-gradient(135deg,var(--amber),var(--violet))">${i + 1}</div>
        <div class="meta">
          <div class="t">${esc(r.name)}</div>
          <div class="s">${esc(r.language || "stack")} · ${fmtNum(r.forks)} forks · ${fmtAgo(r.pushedAt)}</div>
        </div>
        <div class="r" style="display:flex;align-items:center;gap:3px;color:var(--amber)">
          <span class="stat-icon" style="color:var(--amber)">${ICONS.star}</span>
          <span>${fmtNum(r.stars)}</span>
        </div>
      </div>`
      )
      .join("");

    // Trend cards need at least two history points; with one point they
    // render as an empty stub, so the whole row is withheld until it can
    // actually say something.
    const trendBlock = (() => {
      const ready = ["stars", "followers", "repos"].some((f) => historySeries(f, "totals").length >= 2);
      if (!ready) return "";
      return `
      <div class="bento">
        ${trendCard("stars", "Stars", "var(--amber)", ICONS.star)}
        ${trendCard("followers", "Followers", "var(--red)", ICONS.community)}
        ${trendCard("repos", "Repos", "var(--cyan)", ICONS.repos)}
      </div>
      <div style="height:18px"></div>`;
    })();

    const milestones = [
      u.createdAt ? ["Joined GitHub", new Date(u.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })] : null,
      years != null ? ["Account age", `${years} years`] : null,
      repos.length ? ["First public repo", repos[repos.length - 1]?.name] : null,
      repos.length ? ["Newest public repo", repos[0]?.name] : null,
      releases.length ? ["Latest release", releases[0]?.tag] : null,
    ].filter(Boolean);

    return section(
      "Numbers",
      state.accountFilter === "all"
        ? `The measurable footprint of ${accountList().length > 1 ? "both accounts" : "this account"}`
        : `The measurable footprint of @${state.accountFilter}`,
      `${accountPills()}${pill()}`,
      `${accountComparisonCard()}
      <div class="bento">
        ${statCard("Contributions", fmtNum(m.contributionsLastYear), "last 12 months (public)", "var(--green)", ICONS.pulse)}
        ${statCard("Active Days", fmtNum(m.activeDays), `${plural(m.currentStreak || 0, "day")} current streak`, "var(--cyan)", ICONS.activity)}
        ${statCard("PRs Merged", fmtNum(m.prsMerged), `${fmtNum(m.prsOpened)} opened`, "var(--violet)", ICONS.branch)}
        ${statCard("Issues Opened", fmtNum(m.issuesOpened), "authored issues", "var(--amber)", ICONS.issue)}
        ${statCard("Code Written", formatBytes(m.codeBytes), "across public repos", "var(--blue)", ICONS.layers)}
        ${statCard("Best Streak", `${fmtNum(m.longestStreak)}d`, "consecutive active days", "var(--red)", ICONS.zap)}
      </div>
      <div style="height:18px"></div>
      ${trendBlock}
      <div class="bento">
        ${statCard("Public Repos", fmtNum(repos.length), "on GitHub", "var(--cyan)", ICONS.repos)}
        ${statCard("Stars", fmtNum(stars), "across all repos", "var(--amber)", ICONS.star)}
        ${statCard("Forks", fmtNum(forks), "community copies", "var(--violet)", ICONS.fork)}
        ${statCard("Open Issues", fmtNum(issues), issues === 0 ? "clean queue" : "tracked work", "var(--red)", ICONS.issue)}
        ${statCard("Releases", fmtNum(releases.length), "published tags", "var(--green)", ICONS.award)}
        ${statCard("Followers", u.followers != null ? fmtNum(u.followers) : "—", `${plural(u.following || 0, "following")}`, "var(--blue)", ICONS.community)}
        ${statCard("Workflow Runs", fmtNum(runs.length), passRate != null ? `${passRate}% passing` : "tracked recent runs", "var(--blue)", ICONS.pipeline)}
        ${statCard("Account Age", years != null ? `${years}y` : "—", "since first commit here", "var(--cyan)", ICONS.clock || ICONS.activity)}
      </div>
      <div style="height:18px"></div>
      <div class="bento">
        ${contributionHeatmapWidget()}
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--amber)">${ICONS.award}</span> Most Starred</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">top ${Math.min(6, repos.length)}</span>
          </div>
          <div class="mini-list">${leaderboard || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No repositories yet</div>'}</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.clock || ICONS.activity}</span> Timeline</div>
          </div>
          <div class="mini-list">
            ${milestones
              .map(
                ([label, value]) => `
              <div class="mini-row">
                <div class="av" style="background:linear-gradient(135deg,var(--cyan),var(--blue))">${ICONS.pulse}</div>
                <div class="meta"><div class="t">${esc(String(value ?? "—"))}</div><div class="s">${esc(label)}</div></div>
              </div>`
              )
              .join("")}
          </div>
        </div>
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

  /* ---- PUBLIC CONTRIBUTION CALENDAR (real data, build-time scrape) ----
     Merges every featured account (or just the filtered one) into a 53-week
     grid with exact counts, streaks and totals. Falls back to a derived view
     when the calendar is unavailable. */
  function contributionDays(scope) {
    const all = state.snapshot?.contributions || {};
    const filter = scope || state.accountFilter;
    const logins = filter === "all" ? Object.keys(all) : [filter];
    const counts = new Map();
    let covered = false;
    for (const login of logins) {
      const cal = all[login];
      if (!cal?.days) continue;
      covered = true;
      for (const [date, count] of cal.days) counts.set(date, (counts.get(date) || 0) + count);
    }
    if (!covered) return null;
    const days = [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([date, count]) => ({ date, count }));
    const total = days.reduce((a, d) => a + d.count, 0);
    const active = days.filter((d) => d.count > 0).length;
    const best = days.reduce((a, d) => (d.count > a.count ? d : a), days[0] || { count: 0 });
    let longest = 0;
    let run = 0;
    for (const d of days) {
      run = d.count > 0 ? run + 1 : 0;
      longest = Math.max(longest, run);
    }
    let current = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) current++;
      else if (i === days.length - 1) continue;
      else break;
    }
    return { days, total, active, best, current, longest, accounts: logins.length };
  }

  const levelFor = (count) => (count <= 0 ? 0 : count <= 1 ? 1 : count <= 4 ? 2 : count <= 9 ? 3 : 4);

  function contributionHeatmapWidget(scope) {
    const data = contributionDays(scope);
    if (!data) return commitHeatmapWidget(); // graceful fallback
    const cells = data.days
      .map(
        (d) =>
          `<div class="contrib-cell" data-level="${levelFor(d.count)}" title="${d.count} contribution${d.count === 1 ? "" : "s"} on ${new Date(d.date + "T00:00:00").toDateString()}"></div>`
      )
      .join("");

    const months = (() => {
      const out = [];
      let last = "";
      data.days.forEach((d, i) => {
        const m = new Date(d.date + "T00:00:00").toLocaleString(undefined, { month: "short" });
        if (m !== last) {
          out.push(`<span style="grid-column: ${Math.floor(i / 7) + 1}">${m}</span>`);
          last = m;
        }
      });
      return out.join("");
    })();

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--green)">${ICONS.pulse}</span> Contribution Calendar</div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">last 12 months · public</span>
        </div>
        <div class="contrib-stats">
          <span><b>${fmtNum(data.total)}</b> contributions</span>
          <span><b>${fmtNum(data.active)}</b> active days</span>
          <span><b>${fmtNum(data.current)}</b> day streak</span>
          <span><b>${fmtNum(data.longest)}</b> best streak</span>
        </div>
        <div class="contrib-wrap">
          <div class="contrib-months" style="grid-template-columns: repeat(${Math.ceil(data.days.length / 7)}, 12px)">${months}</div>
          <div class="contrib-grid">${cells}</div>
        </div>
        <div class="contrib-foot">
          <span>${data.accounts > 1 ? `merged across ${data.accounts} accounts` : "single account"} · public contribution graph only</span>
          <span class="contrib-legend">Less
            <i data-level="0"></i><i data-level="1"></i><i data-level="2"></i><i data-level="3"></i><i data-level="4"></i>
          More</span>
        </div>
      </div>`;
  }

  /* ---- CODE COMPOSITION BY BYTES (real language statistics) ---- */
  function languageBytesWidget() {
    const totals = state.snapshot?.languageBytes || {};
    const entries = Object.entries(totals).filter(([, bytes]) => bytes > 0);
    const sum = entries.reduce((a, [, b]) => a + b, 0);
    if (!entries.length) return languageDistributionWidget();

    const segments = entries
      .map(([lang, bytes]) => {
        const pct = (bytes / sum) * 100;
        return `<div class="lang-seg" style="width:${pct.toFixed(2)}%;background:${getLangColor(lang)}" title="${esc(lang)}: ${pct.toFixed(1)}% (${formatBytes(bytes)})"></div>`;
      })
      .join("");

    const legend = entries
      .slice(0, 8)
      .map(([lang, bytes]) => {
        const pct = (bytes / sum) * 100;
        return `
          <div class="lang-item">
            <span class="ldot" style="background:${getLangColor(lang)}"></span>
            <span>${esc(lang)} <b>${pct.toFixed(1)}%</b> <em>${formatBytes(bytes)}</em></span>
          </div>`;
      })
      .join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:var(--violet)">${ICONS.layers}</span> Code by Language</div>
          <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${formatBytes(sum)} · ${entries.length} languages</span>
        </div>
        <div class="lang-bar">${segments}</div>
        <div class="lang-legend">${legend}</div>
        <div class="metric-sub" style="margin-top:10px">Measured in bytes of code across every public repository</div>
      </div>`;
  }

  /* ---- 52-WEEK COMMIT SPARKLINE (per repo, from GitHub stats) ---- */
  function activitySparkline(weeks, { label = "52-week commit activity" } = {}) {
    if (!Array.isArray(weeks) || !weeks.length) return "";
    const max = Math.max(1, ...weeks);
    const w = weeks.length * 4;
    const h = 34;
    const points = weeks
      .map((v, i) => `${i * 4 + 2},${h - Math.round((v / max) * (h - 4))}`)
      .join(" ");
    const area = `2,${h} ${points} ${weeks.length * 4 - 2},${h}`;
    const total = weeks.reduce((a, b) => a + b, 0);
    return `
      <div class="spark">
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" role="img" aria-label="${esc(label)}: ${total} commits over 52 weeks">
          <polygon points="${area}" fill="color-mix(in srgb, var(--cyan) 18%, transparent)"></polygon>
          <polyline points="${points}" fill="none" stroke="var(--cyan)" stroke-width="1.6" stroke-linejoin="round"></polyline>
        </svg>
        <div class="spark-meta">${fmtNum(total)} commits · 52 weeks</div>
      </div>`;
  }

  /* ---- TREND DELTAS / GROWTH SPARKLINE (from committed history) ---- */
  function historySeries(field, scope = "totals") {
    const entries = state.history || [];
    if (entries.length < 2) return [];
    const pick = (e) => (scope === "totals" ? e.totals?.[field] : e.accounts?.find((a) => a.login === scope)?.[field]);
    return entries.map((e) => ({ date: e.date, value: pick(e) })).filter((p) => typeof p.value === "number");
  }

  function trendCard(field, label, color, icon, scope = "totals") {
    const series = historySeries(field, scope);
    const current = series.length ? series[series.length - 1].value : null;
    const delta = (days) => {
      if (!series.length) return null;
      const cutoff = Date.now() - days * 864e5;
      const past = [...series].reverse().find((p) => new Date(p.date).getTime() <= cutoff);
      const base = past ? past.value : series[0].value;
      return current != null ? current - base : null;
    };
    const d7 = delta(7);
    const d30 = delta(30);
    const arrow = (d) =>
      d == null ? "—" : d > 0 ? `▲ ${fmtNum(d)}` : d < 0 ? `▼ ${fmtNum(Math.abs(d))}` : "no change";
    const points = series.map((p) => p.value);
    const spark = points.length > 1 ? (() => {
      const max = Math.max(...points);
      const min = Math.min(...points);
      const span = Math.max(1, max - min);
      return points
        .map((v, i) => `${(i / (points.length - 1)) * 100},${28 - ((v - min) / span) * 24}`)
        .join(" ");
    })() : "";

    return `
      <div class="card">
        <div class="card-head">
          <div class="card-title"><span class="stat-icon" style="color:${color}">${icon}</span> ${label}</div>
          <span style="font-family:var(--mono);font-size:10.5px;color:var(--muted)">${series.length}d tracked</span>
        </div>
        <div class="metric" style="color:${color}">${current != null ? fmtNum(current) : "—"}</div>
        <div class="trend-deltas">
          <span>7d <b>${arrow(d7)}</b></span>
          <span>30d <b>${arrow(d30)}</b></span>
        </div>
        ${spark ? `<svg class="trend-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><polyline points="${spark}" fill="none" stroke="${color}" stroke-width="1.4" vector-effect="non-scaling-stroke"></polyline></svg>` : ""}
      </div>`;
  }

  const formatBytes = (bytes) => {
    if (!bytes) return "0 B";
    const units = ["B", "KB", "MB", "GB"];
    const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
    return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

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
      <div class="mini-row" data-project="${esc(r.name)}" title="Open project">
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
      <div class="mini-row" data-project="${esc(r.name)}" title="Open project">
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

  /* ---- PROJECT CARD (links to a shareable project page) ---- */
  function projectCard(r) {
    const langCol = getLangColor(r.language);
    const st = repoStatus(r);
    const topics = (r.topics || []).slice(0, 3);
    return `
      <div class="card repo-card" data-project="${esc(r.name)}" title="Open ${esc(r.name)}">
        <div class="card-head">
          <div class="name">
            <span class="dot" style="background:${st === "archived" ? "var(--amber)" : st === "active" ? "var(--green)" : "var(--faint)"}"></span>
            ${esc(r.name)}
          </div>
          <span class="priv-tag" style="display:inline-flex;align-items:center;gap:3px">
            <span class="stat-icon" style="width:11px;height:11px">${r.archived ? ICONS.lock : ICONS.globe}</span>
            ${st.toUpperCase()}
          </span>
        </div>
        <div class="desc">${esc(r.description || "No description provided.")}</div>
        ${topics.length ? `<div class="hl-stack">${topics.map((t) => `<span class="priv-tag">${esc(t)}</span>`).join("")}</div>` : ""}
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
          <span class="lang-tag" style="--lang:${langCol}">${esc(r.language || "—")}</span>
          ${accountList().length > 1 ? `<span class="owner-tag">@${esc(repoOwner(r))}</span>` : ""}
          <span style="font-family:var(--mono);font-size:11px;color:var(--faint)">${fmtAgo(r.pushedAt)}</span>
        </div>
      </div>`;
  }

  /* ---- 5. PROJECTS ---- */
  function renderProjects() {
    const all = repoList();
    const languages = ["all", ...new Set(all.map((r) => r.language).filter(Boolean))];

    return section(
      "Projects",
      state.selectedRepo === "all"
        ? `Every public repository, grouped by activity · ${all.length} projects${state.accountFilter === "all" ? "" : " · @" + state.accountFilter}`
        : `Focus · ${state.selectedRepo}`,
      `${accountPills()}${pill()}`,
      `<div class="control-bar">
        <div class="search-box">
          <span class="search-icon">${ICONS.search}</span>
          <input type="text" id="repoSearchInput" placeholder="Search projects by name, description or topic..." value="${esc(state.repoSearchQuery)}" />
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

      <div id="reposGridContainer">
        ${getFilteredReposHtml()}
      </div>`
    );
  }

  function getFilteredReposHtml() {
    let repos = filteredRepos();
    const q = state.repoSearchQuery.trim().toLowerCase();

    if (q) {
      repos = repos.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description || "").toLowerCase().includes(q) ||
          (r.topics || []).some((t) => t.toLowerCase().includes(q))
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
      return `<div class="card" style="text-align:center;padding:48px 24px;color:var(--faint)">
        <div style="font-size:28px;margin-bottom:8px;display:flex;justify-content:center;width:32px;margin:0 auto 8px">${ICONS.search}</div>
        <div style="font-size:16px;font-weight:700;color:var(--text)">No projects matched your filters</div>
        <div style="font-size:13px;margin-top:4px">Try adjusting the search or language selection.</div>
      </div>`;
    }

    // Group into a story: what's active, what's resting, what's archived.
    const groups = { active: [], quiet: [], archived: [] };
    repos.forEach((r) => groups[repoStatus(r)].push(r));

    const blocks = [
      ["active", "Active", "Pushed within the last 90 days"],
      ["quiet", "Quiet", "Complete, but no recent pushes"],
      ["archived", "Archived", "Kept for history"],
    ]
      .filter(([key]) => groups[key].length)
      .map(
        ([key, title, sub]) => `
        <div class="group-head">
          <h2>${title}</h2>
          <span>${sub} · ${groups[key].length}</span>
        </div>
        <div class="repos-grid">${groups[key].map(projectCard).join("")}</div>`
      )
      .join("");

    return blocks;
  }

  /* ---- README LOADER (public sources only) ---- */
  async function loadReadme(repo) {
    try {
      const res = await fetch(`https://raw.githubusercontent.com/${repo.fullName}/HEAD/README.md`);
      if (res.ok) {
        const text = await res.text();
        if (text.trim()) return text;
      }
    } catch (e) {
      /* fall through to the API */
    }
    try {
      const res = await fetch(`https://api.github.com/repos/${repo.fullName}/readme`, {
        headers: { Accept: "application/vnd.github.raw" },
      });
      if (res.ok) {
        const text = await res.text();
        if (text.trim()) return text;
      }
    } catch (e) {}
    return repo.readmeExcerpt || "";
  }

  /* ---- 6. PROJECT DETAIL (#/project/<name>) ---- */
  function renderProject() {
    const repos = repoList();
    const repo =
      repos.find((r) => (r.name || "").toLowerCase() === String(state.selectedProject || "").toLowerCase()) ||
      repos.find((r) => (r.fullName || "").toLowerCase() === String(state.selectedProject || "").toLowerCase()) ||
      repos[0];

    if (!repo) {
      return section(
        "Project",
        "Nothing to show",
        pill(),
        `<div class="card" style="padding:32px;text-align:center;color:var(--faint)">No public repositories available.</div>`
      );
    }

    state.selectedProject = repo.name;
    const extras = extrasFor(repo.fullName) || {};
    const runs = (extras.runs || []).slice(0, 5);
    const releases = (extras.releases || []).slice(0, 4);
    const langCol = getLangColor(repo.language);
    const httpsClone = `https://github.com/${repo.fullName}.git`;
    const sshClone = `git@github.com:${repo.fullName}.git`;
    const st = repoStatus(repo);
    const topics = repo.topics || [];

    // README is fetched live and cached for the session.
    // Chain: raw.githubusercontent.com -> public GitHub API -> snapshot excerpt.
    const cached = state.readmeCache[repo.fullName];
    if (!cached) {
      state.readmeCache[repo.fullName] = { loading: true };
      loadReadme(repo).then((raw) => {
        state.readmeCache[repo.fullName] = { raw: raw || "" };
        if (state.view === "project" && state.selectedProject === repo.name) render();
      });
    }

    const readmeHtml = !cached || cached.loading
      ? `<div class="readme-loading"><div class="pulse-ring"></div><span>LOADING README</span></div>`
      : cached.raw
      ? `<div class="md-body">${renderMarkdown(cached.raw)}</div>`
      : repo.readmeExcerpt
      ? `<p class="project-pitch">${esc(repo.readmeExcerpt)}…</p>
         <a class="btn btn-sm" href="${esc(repo.htmlUrl)}#readme" target="_blank" rel="noopener noreferrer">${ICONS.github} Read the full README on GitHub</a>`
      : `<div style="color:var(--faint);font-size:13.5px;padding:8px 0">This repository has no README yet — the source code is the documentation.</div>`;

    return section(
      repo.name,
      `${repo.fullName} · ${st} · last push ${fmtAgo(repo.pushedAt)}`,
      `<button class="btn btn-sm" id="projectBackBtn">${ICONS.back || ICONS.command} All projects</button>
       <button class="btn btn-sm" id="projectShareBtn">${ICONS.share} Share</button>
       <a class="btn btn-sm" href="${esc(repo.htmlUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.github} Repository</a>
       ${repo.homepage ? `<a class="btn btn-sm btn-primary" href="${esc(repo.homepage)}" target="_blank" rel="noopener noreferrer">${ICONS.externalLink} Live site</a>` : ""}`,
      `<div class="card">
        <div class="hl-head">
          <span class="status ${st === "active" ? "ok" : st === "archived" ? "warn" : "run"}"><span class="sdot"></span>${st.toUpperCase()}</span>
          ${repo.language ? `<span class="lang-tag" style="--lang:${langCol}">${esc(repo.language)}</span>` : ""}
          ${repo.license ? `<span class="priv-tag">${esc(repo.license)}</span>` : ""}
          <span class="priv-tag">${esc(repo.defaultBranch || "main")}</span>
        </div>
        <p class="project-pitch">${esc(repo.description || "No repository description provided.")}</p>
        ${topics.length ? `<div class="hl-stack">${topics.map((t) => `<span class="priv-tag">${esc(t)}</span>`).join("")}</div>` : ""}
      </div>

      <div style="height:18px"></div>
      <div class="bento">
        ${statCard("Stars", fmtNum(repo.stars), "appreciation", "var(--amber)", ICONS.star)}
        ${statCard("Forks", fmtNum(repo.forks), "derivations", "var(--violet)", ICONS.fork)}
        ${statCard("Open Issues", fmtNum(repo.openIssues), "tracked work", "var(--cyan)", ICONS.issue)}
        ${statCard("Size", repo.size ? `${fmtNum(Math.round((repo.size || 0) / 1024 * 10) / 10)} MB` : "—", "repository size", "var(--blue)", ICONS.layers)}
      </div>

      ${repo.activity ? `<div class="card">${activitySparkline(repo.activity, { label: `${repo.name} commit activity` })}</div>` : ""}
      ${repo.languages ? `
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--violet)">${ICONS.code}</span> Code Composition</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${formatBytes(repo.languageBytes || 0)} · by bytes</span>
          </div>
          <div class="lang-bar">
            ${Object.entries(repo.languages)
              .map(([lang, bytes]) => `<div class="lang-seg" style="width:${((bytes / (repo.languageBytes || 1)) * 100).toFixed(2)}%;background:${getLangColor(lang)}" title="${esc(lang)}: ${formatBytes(bytes)}"></div>`)
              .join("")}
          </div>
          <div class="lang-legend">
            ${Object.entries(repo.languages)
              .slice(0, 6)
              .map(([lang, bytes]) => `
                <div class="lang-item">
                  <span class="ldot" style="background:${getLangColor(lang)}"></span>
                  <span>${esc(lang)} <b>${((bytes / (repo.languageBytes || 1)) * 100).toFixed(1)}%</b> <em>${formatBytes(bytes)}</em></span>
                </div>`)
              .join("")}
          </div>
        </div>` : ""}

      <div style="height:18px"></div>
      <div class="bento">
        <div class="card col2">
          <div class="card-head"><div class="card-title"><span class="stat-icon" style="color:var(--cyan)">${ICONS.readme}</span> README</div></div>
          ${readmeHtml}
        </div>
        <div class="card col2">
          <div class="card-head"><div class="card-title"><span class="stat-icon" style="color:var(--blue)">${ICONS.terminal}</span> Clone</div></div>
          <div class="clone-box">
            <code>${esc(httpsClone)}</code>
            <button class="btn btn-sm" id="copyHttpsBtn">${ICONS.copy} Copy</button>
          </div>
          <div class="clone-box">
            <code>${esc(sshClone)}</code>
            <button class="btn btn-sm" id="copySshBtn">${ICONS.copy} Copy</button>
          </div>

          <div class="card-head" style="margin-top:18px">
            <div class="card-title"><span class="stat-icon" style="color:var(--amber)">${ICONS.award}</span> Releases</div>
          </div>
          <div class="mini-list">
            ${releases.length
              ? releases.map((r) => `
                <div class="mini-row">
                  <div class="av" style="background:linear-gradient(135deg,var(--amber),var(--violet))">${ICONS.award}</div>
                  <div class="meta"><div class="t">${esc(r.tag)}</div><div class="s">${fmtAgo(r.publishedAt)}${r.prerelease ? " · pre-release" : ""}</div></div>
                  <a class="btn btn-sm btn-icon" href="${esc(r.htmlUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.externalLink}</a>
                </div>`).join("")
              : '<div style="color:var(--faint);font-size:13px;padding:8px 0">No releases published.</div>'}
          </div>

          <div class="card-head" style="margin-top:18px">
            <div class="card-title"><span class="stat-icon" style="color:var(--blue)">${ICONS.ci}</span> Recent Workflow Runs</div>
          </div>
          <div class="mini-list">
            ${runs.length
              ? runs.map((r) => `
                <div class="mini-row">
                  <div class="av" style="background:linear-gradient(135deg,var(--blue),var(--green))">${initials(repo.name)}</div>
                  <div class="meta"><div class="t">${esc(r.displayTitle || r.name || "workflow")}</div><div class="s">${esc(r.headBranch || "")} · ${fmtAgo(r.updatedAt || r.createdAt)}</div></div>
                  <span class="status ${runStatusClass(r)}"><span class="sdot"></span>${runStatusLabel(r)}</span>
                </div>`).join("")
              : '<div style="color:var(--faint);font-size:13px;padding:8px 0">No workflow runs recorded.</div>'}
          </div>
        </div>
      </div>`
    );
  }

  /* ---- 3. ACTIVITY VIEW ---- */
  function renderActivity() {
    const s = state.snapshot || {};
    const extras = s.extras || [];

    // Real cross-repo events, filtered by global repo selection
    const events = (s.events || []).filter((e) => {
      if (state.accountFilter !== "all" && e.repo.split("/")[0] !== state.accountFilter) return false;
      return (
        state.selectedRepo === "all" ||
        e.repo.split("/").pop() === state.selectedRepo.split("/").pop()
      );
    });

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
      .filter((r) => state.selectedRepo === "all" || r.repo.split("/").pop() === String(state.selectedRepo).split("/").pop());

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
      .filter((r) => state.selectedRepo === "all" || r.repo.split("/").pop() === String(state.selectedRepo).split("/").pop())
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
      <button class="btn btn-primary" id="createIssueBtn" style="margin-right:10px">${ICONS.issue} Suggest Something</button>`;

    return section(
      "Activity Stream",
      `Union of every featured account's public activity${state.accountFilter === "all" ? "" : " · @" + state.accountFilter}`,
      `${createIssueBtn}${accountPills()}${pill()}`,
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

  /* ---- SUGGEST / CONTACT MODAL (public: hands off to GitHub) ----
     Visitors cannot create issues from Pulse without an account, so this
     builds a prefilled GitHub "new issue" URL and opens it in a new tab.
     Nothing is stored and nothing is sent anywhere by Pulse itself. */
  function openSuggestModal(preRepo) {
    const overlay = $("#issueOverlay");
    const sheet = $("#issueSheet");
    const repos = repoList().filter((r) => !r.isPrivate && !r.archived);
    const pre = preRepo || (state.selectedRepo !== "all" ? state.selectedRepo : "");
    const preFull = repos.find((r) => r.name === pre)?.fullName || repos[0]?.fullName || "";

    sheet.innerHTML = `
      <div class="sheet-head">
        <div>
          <div class="inspector-title">Suggest Something</div>
          <div class="sheet-sub">Open a prefilled issue on GitHub — no account needed here</div>
        </div>
        <button class="sheet-close" id="closeIssueBtn">✕</button>
      </div>

      <div class="callout-box" style="margin-bottom:16px">
        Pulse is a read-only public view of ${esc(accountList().map((a) => "@" + a).join(" and ") || "this account")}.
        Your suggestion opens on <b>github.com</b> where GitHub handles sign-in and posting for you.
      </div>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Repository</div>
      <select id="issueRepo" class="form-input" style="width:100%;margin-bottom:14px">
        ${repos.map((r) => `<option value="${esc(r.fullName)}" ${r.fullName === preFull ? "selected" : ""}>${esc(r.fullName)}</option>`).join("")}
      </select>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Title</div>
      <input id="issueTitle" class="form-input" placeholder="Summarize your suggestion" style="width:100%;margin-bottom:14px" />

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Details (Markdown)</div>
      <textarea id="issueBody" class="form-input" rows="5" placeholder="Describe the idea, bug or question…" style="width:100%;margin-bottom:18px"></textarea>

      <div style="display:flex;gap:10px;justify-content:flex-end">
        <button class="btn" id="cancelIssueBtn">Cancel</button>
        <button class="btn btn-primary" id="submitIssueBtn" ${repos.length ? "" : "disabled"}>${ICONS.github} Continue on GitHub</button>
      </div>`;

    overlay.classList.add("open");
    focusSheet(overlay);

    const close = () => {
      overlay.classList.remove("open");
      overlay.setAttribute("aria-hidden", "true");
      restoreFocus();
    };
    $("#closeIssueBtn")?.addEventListener("click", close);
    $("#cancelIssueBtn")?.addEventListener("click", close);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) close();
    });

    $("#submitIssueBtn")?.addEventListener("click", () => {
      const full = $("#issueRepo")?.value;
      const title = ($("#issueTitle")?.value || "").trim();
      const body = ($("#issueBody")?.value || "").trim();
      if (!full) {
        toast("No public repository available for suggestions");
        return;
      }
      const params = new URLSearchParams();
      if (title) params.set("title", title);
      if (body) params.set("body", body);
      const url = `https://github.com/${full}/issues/new${params.toString() ? "?" + params.toString() : ""}`;
      close();
      window.open(url, "_blank", "noopener,noreferrer");
      toast("Opening GitHub to post your suggestion");
    });
  }

  /* ---- 4. CI VIEW (LIVE) ---- */
  function getAllLiveRuns() {
    const s = state.snapshot || {};
    const extras = s.extras || [];
    return extras
      .flatMap((x) => (x.runs || []).map((r) => ({ ...r, repo: x.fullName })))
      .filter((r) => state.selectedRepo === "all" || r.repo.split("/").pop() === String(state.selectedRepo).split("/").pop())
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }
  function runStatusClass(r) {
    if (r.status === "in_progress" || r.status === "queued" || r.status === "waiting" || r.status === "requested") return "run";
    if (r.status === "completed") {
      if (r.conclusion === "success") return "ok";
      if (r.conclusion === "failure" || r.conclusion === "timed_out") return "bad";
      return "warn";
    }
    return "run";
  }
  function runStatusLabel(r) {
    if (r.status === "in_progress") return "RUNNING";
    if (r.status === "queued") return "QUEUED";
    if (r.status === "waiting") return "WAITING";
    if (r.status === "requested") return "REQUESTED";
    if (r.status === "completed") {
      if (r.conclusion === "success") return "PASSING";
      if (r.conclusion === "failure") return "FAILED";
      if (r.conclusion === "cancelled") return "CANCELLED";
      if (r.conclusion === "skipped") return "SKIPPED";
      if (r.conclusion === "timed_out") return "TIMED OUT";
      return (r.conclusion || "DONE").toUpperCase();
    }
    return String(r.status || "").toUpperCase();
  }
  function runDuration(r) {
    if (!r.createdAt) return "—";
    const end = r.updatedAt || new Date().toISOString();
    const ms = new Date(end) - new Date(r.createdAt);
    if (ms < 0) return "—";
    const s = Math.floor(ms / 1000);
    if (s < 60) return s + "s";
    const m = Math.floor(s / 60);
    if (m < 60) return m + "m " + (s % 60) + "s";
    const h = Math.floor(m / 60);
    return h + "h " + (m % 60) + "m";
  }
  function renderCraft() {
    const allRuns = getAllLiveRuns();
    const live = state.live || {};
    const running = allRuns.filter((r) => ["in_progress", "queued", "waiting", "requested"].includes(r.status));
    const failed = allRuns.filter((r) => r.status === "completed" && (r.conclusion === "failure" || r.conclusion === "timed_out"));
    const passed = allRuns.filter((r) => r.status === "completed" && r.conclusion === "success");
    const completed = allRuns.filter((r) => r.status === "completed");
    const passRate = completed.length ? Math.round((passed.length / completed.length) * 100) : 100;
    const f = state.ciFilter || "all";
    const filtered = allRuns.filter((r) => {
      if (f === "all") return true;
      if (f === "running") return ["in_progress", "queued", "waiting", "requested"].includes(r.status);
      if (f === "failed") return r.status === "completed" && (r.conclusion === "failure" || r.conclusion === "timed_out");
      if (f === "success") return r.status === "completed" && r.conclusion === "success";
      return true;
    }).slice(0, 30);
    const lastSync = live.lastFetchAt ? fmtAgo(live.lastFetchAt) : (state.snapshot?.generatedAt ? fmtAgo(state.snapshot.generatedAt) + " (snapshot)" : "—");
    const liveDot = live.isPolling ? '<span class="status run"><span class="sdot"></span>POLLING</span>' : (live.error ? `<span class="status bad"><span class="sdot"></span>STALE</span>` : '<span class="status ok"><span class="sdot"></span>LIVE</span>');
    const staleHint = (!live.lastFetchAt) ? `<div class="callout-box" style="margin-top:12px">Showing the latest <b>build-time snapshot</b>. Public GitHub data is refreshed automatically while you stay on this view (unauthenticated API: 60 req/hr per visitor).</div>` : "";
    const rows = filtered.map((r) => {
      const cls = runStatusClass(r);
      const label = runStatusLabel(r);
      const isLive = ["in_progress", "queued", "waiting", "requested"].includes(r.status);
      return `
        <div class="mini-row${isLive ? " wf-live" : ""}">
          <div class="av" style="background:linear-gradient(135deg,var(--blue),var(--green))">${initials(r.repo.split("/").pop())}</div>
          <div class="meta">
            <div class="t">${esc(r.displayTitle || r.name || "workflow")} <span style="font-family:var(--mono);font-size:10.5px;color:var(--faint)">#${esc(String(r.runNumber ?? ""))}</span></div>
            <div class="s">${esc(r.repo)} · ${esc(r.headBranch || "")}${r.headSha ? " · " + esc(r.headSha) : ""} · ${esc(r.event || "")} · ${isLive ? "started " + fmtAgo(r.createdAt) : fmtAgo(r.updatedAt || r.createdAt)} · ⏱ ${runDuration(r)}${r.actor ? " · @" + esc(r.actor) : ""}</div>
          </div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0">
            <span class="status ${cls}"><span class="sdot"></span>${label}</span>
            <a class="btn btn-sm btn-icon" href="${esc(r.htmlUrl)}" target="_blank" rel="noopener noreferrer" title="Open run on GitHub">${ICONS.externalLink}</a>
          </div>
        </div>`;
    }).join("");
    const filterPills = ["all", "running", "failed", "success"].map((k) => `
      <button class="filter-pill${f === k ? " active" : ""}" data-ci-filter="${k}">${k === "all" ? "All" : k === "running" ? `Running (${running.length})` : k === "failed" ? `Failed (${failed.length})` : `Passed (${passed.length})`}</button>
    `).join("");
    return section(
      "How I Build",
      `Pipeline health, stack and release cadence · last sync ${lastSync}`,
      `${accountPills()}${pill()}`,
      `<div class="bento">
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--blue)">${ICONS.pipeline}</span> Live Status</div>
            ${liveDot}
          </div>
          <div class="metric" style="color:var(--blue)">${fmtNum(running.length)}<small>/ ${fmtNum(allRuns.length)}</small></div>
          <div class="metric-sub">running / tracked runs ${live.isPolling ? "· polling…" : ""}</div>
          <div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap">
            <button class="btn btn-sm" id="wfRefreshBtn">${ICONS.refresh} Refresh now</button>
            <button class="btn btn-sm" id="wfPollToggleBtn">${live.isPolling ? "Pause live" : "Resume live"}</button>
          </div>
          ${staleHint}
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--green)">${ICONS.check}</span> Pass Rate</div>
          </div>
          <div class="metric" style="color:${passRate >= 80 ? "var(--green)" : passRate >= 50 ? "var(--amber)" : "var(--red)"}">${passRate}<small>%</small></div>
          <div class="metric-sub">${fmtNum(passed.length)} passed · ${fmtNum(failed.length)} failed · ${fmtNum(completed.length)} completed</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--blue)">${ICONS.ci}</span> Workflow Runs</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">newest first · realtime</span>
          </div>
          <div class="filter-pills" style="margin-top:12px">${filterPills}</div>
          <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No workflow runs yet — GitHub Actions activity will appear here once a run is triggered.</div>'}</div>
        </div>
        ${languageBytesWidget()}
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="stat-icon" style="color:var(--amber)">${ICONS.award}</span> Release Cadence</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">${allReleases().length} published</span>
          </div>
          <div class="mini-list">
            ${
              allReleases()
                .slice(0, 8)
                .map(
                  (r) => `
              <div class="mini-row">
                <div class="av" style="background:linear-gradient(135deg,var(--amber),var(--violet))">${ICONS.award}</div>
                <div class="meta">
                  <div class="t">${esc(r.tag)}${r.prerelease ? ' <span class="priv-tag" style="font-size:10px">PRE</span>' : ""}</div>
                  <div class="s">${esc(r.repo)} · ${fmtAgo(r.publishedAt)}</div>
                </div>
                <a class="btn btn-sm btn-icon" href="${esc(r.htmlUrl)}" target="_blank" rel="noopener noreferrer">${ICONS.externalLink}</a>
              </div>`
                )
                .join("") ||
              '<div style="color:var(--faint);font-size:13px;padding:8px 0">No releases published yet.</div>'
            }
          </div>
        </div>
      </div>`
    );
  }

  /* ---- DATA LOADING & SYNC ---- */
  /** Trend history (stars/followers/repos per day, appended by each build). */
  async function loadHistory() {
    try {
      const res = await fetch("data/history.json", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data?.entries)) state.history = data.entries;
    } catch {}
  }

  async function loadSnapshot() {
    try {
      const res = await fetch("data/snapshot.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (data && data.repos) {
        state.snapshot = data;
        const login = ghAccount();
        if (login) {
          const u = data.user || {};
          state.snapshot.user = {
            ...u,
            login: u.login || login,
            avatar: u.avatar || `https://github.com/${encodeURIComponent(login)}.png`,
            htmlUrl: u.htmlUrl || `https://github.com/${encodeURIComponent(login)}`,
          };
        }
        return true;
      }
    } catch (e) {
      console.warn("Snapshot load failed", e);
    }
    return false;
  }

  async function fetchLive() {
    const accounts = accountList();
    if (!accounts.length) {
      toast("No GitHub account configured — set github.accounts in js/config.js");
      return;
    }
    if (!isLiveEnabled()) {
      toast("Live refresh is disabled in js/config.js");
      return;
    }
    toast(accounts.length > 1 ? `Refreshing ${accounts.length} public accounts…` : "Refreshing public GitHub data…");
    try {
      const chip = $('#rateChip');
      const headers = { Accept: "application/vnd.github+json" };

      // Public, read-only reads. No credential of any kind is attached.
      const results = await Promise.all(
        accounts.map(async (account) => {
          const [reposRes, userRes] = await Promise.all([
            fetch(`https://api.github.com/users/${encodeURIComponent(account)}/repos?per_page=100&sort=updated&type=owner`, { headers }),
            fetch(`https://api.github.com/users/${encodeURIComponent(account)}`, { headers }),
          ]);
          if (reposRes.headers) {
            const limit = reposRes.headers.get("X-RateLimit-Limit");
            const remain = reposRes.headers.get("X-RateLimit-Remaining");
            if (limit) state.api.rateLimit = Number(limit);
            if (remain) state.api.rateRemaining = Number(remain);
            if (chip && remain) {
              chip.style.display = "inline";
              chip.textContent = `${remain} / ${state.api.rateLimit} reqs`;
            }
          }
          if (!reposRes.ok) throw new Error(`${account}: HTTP ${reposRes.status}`);
          const rawRepos = await reposRes.json();
          const profile = userRes.ok ? await userRes.json().catch(() => null) : null;
          return { account, rawRepos: Array.isArray(rawRepos) ? rawRepos : [], profile };
        })
      );

      {
        const enriched = results
          .flatMap(({ account, rawRepos }) =>
            rawRepos
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
              isPrivate: false, // public showroom: only public work is listed
              archived: r.archived,
              topics: r.topics || [],
              defaultBranch: r.default_branch,
              createdAt: r.created_at,
              updatedAt: r.updated_at,
              pushedAt: r.pushed_at,
              owner: account,
            }))
          )
          .sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

        // Account summaries (bio, followers, links) straight from the public API.
        const summaries = results.map(({ account, profile, rawRepos }) => {
          const own = enriched.filter((r) => r.owner === account);
          return {
            login: account,
            name: profile?.name || null,
            avatar: profile?.avatar_url || `https://github.com/${account}.png`,
            bio: profile?.bio || null,
            company: profile?.company || null,
            blog: profile?.blog || null,
            location: profile?.location || null,
            followers: profile?.followers ?? null,
            following: profile?.following ?? null,
            publicRepos: profile?.public_repos ?? own.length,
            htmlUrl: `https://github.com/${account}`,
            createdAt: profile?.created_at || null,
            repoCount: own.length,
            stars: own.reduce((a, r) => a + r.stars, 0),
            latestPush: own[0]?.pushedAt || null,
          };
        });

        const primary =
          summaries.find((s) => s.login === ghAccount()) || summaries[0] || state.snapshot?.user || {};

        state.snapshot = {
          ...(state.snapshot || {}),
          generatedAt: new Date().toISOString(),
          account: primary.login,
          accounts: summaries,
          user: {
            ...primary,
            publicRepos: enriched.length,
            followers: summaries.reduce((a, s) => a + (s.followers || 0), 0),
            following: summaries.reduce((a, s) => a + (s.following || 0), 0),
          },
          repos: enriched,
          totalStars: enriched.reduce((a, r) => a + r.stars, 0),
          totalForks: enriched.reduce((a, r) => a + r.forks, 0),
          totalOpenIssues: enriched.reduce((a, r) => a + r.openIssues, 0),
        };
        state.live.lastFetchAt = new Date().toISOString();
        state.live.error = null;
        render();
        fetchWorkflowLive().catch(() => {});
        toast(
          summaries.length > 1
            ? `Showing public work from ${summaries.map((s) => "@" + s.login).join(" and ")}`
            : `Showing @${primary.login}'s public repositories`
        );
      }
    } catch (e) {
      console.warn("Live sync warning:", e);
      state.live.error = String(e.message || e);
      toast("Showing the latest snapshot data");
    }
  }

  async function fetchWorkflowLive(opts = {}) {
    if (!isLiveEnabled()) return null;
    const s = state.snapshot || {};
    const all = (s.repos || []).slice(0, 12);
    if (!all.length) return null;
    const headers = { Accept: "application/vnd.github+json" };
    const remaining = state.api.rateRemaining;
    const limit = state.api.rateLimit || 60;
    if (!opts.manual && remaining != null && remaining < Math.min(15, Math.ceil(limit * 0.08))) {
      state.live.error = "rate-low";
      return null;
    }
    try {
      const sel = state.selectedRepo;
      const targetRepos = sel !== "all"
        ? all.filter((r) => (r.fullName || "").split("/").pop() === String(sel).split("/").pop() || r.name === sel).slice(0, 1)
        : all.slice(0, 3);
      if (!targetRepos.length) return null;
      const results = await Promise.all(targetRepos.map(async (r) => {
        try {
          const url = `https://api.github.com/repos/${r.fullName}/actions/runs?per_page=10`;
          const res = await fetch(url, { headers });
          if (res.headers) {
            const lim = res.headers.get("X-RateLimit-Limit");
            const rem = res.headers.get("X-RateLimit-Remaining");
            if (lim) state.api.rateLimit = Number(lim);
            if (rem) state.api.rateRemaining = Number(rem);
            const chip = document.getElementById("rateChip");
            if (chip && rem) { chip.style.display = "inline"; chip.textContent = `${rem} / ${state.api.rateLimit} reqs`; }
          }
          if (!res.ok) return null;
          const data = await res.json();
          const raw = Array.isArray(data) ? data : (data.workflow_runs || []);
          const runs = raw.slice(0, 10).map((run) => ({
            id: run.id, runNumber: run.run_number, name: run.name, displayTitle: run.display_title || run.name,
            headBranch: run.head_branch, headSha: (run.head_sha || "").slice(0, 7), event: run.event,
            status: run.status, conclusion: run.conclusion, workflowId: run.workflow_id,
            actor: run.actor?.login || run.triggering_actor?.login || null,
            actorAvatar: run.actor?.avatar_url || null,
            createdAt: run.created_at, updatedAt: run.updated_at, htmlUrl: run.html_url,
          }));
          return { fullName: r.fullName, runs };
        } catch { return null; }
      }));
      const extrasMap = new Map((s.extras || []).map((x) => [x.fullName, x]));
      let changed = false;
      for (const item of results) {
        if (!item) continue;
        const prev = extrasMap.get(item.fullName);
        if (!prev) { extrasMap.set(item.fullName, { fullName: item.fullName, runs: item.runs, releases: [], workflows: [] }); changed = true; continue; }
        const prevSig = JSON.stringify((prev.runs || []).slice(0, 3).map((r) => r.id + "|" + r.status + "|" + r.conclusion));
        const nextSig = JSON.stringify(item.runs.slice(0, 3).map((r) => r.id + "|" + r.status + "|" + r.conclusion));
        if (prevSig !== nextSig) changed = true;
        extrasMap.set(item.fullName, { ...prev, runs: item.runs });
      }
      if (changed || !s.extras?.length) {
        state.snapshot = { ...s, extras: [...extrasMap.values()], generatedAt: new Date().toISOString() };
        state.live.lastFetchAt = new Date().toISOString();
        state.live.error = null;
        if (state.view === "craft" || state.view === "activity" || state.view === "project") render();
        return true;
      }
      state.live.lastFetchAt = new Date().toISOString();
      state.live.error = null;
      if (state.view === "craft") render();
      return false;
    } catch (e) {
      console.warn("Workflow live fetch failed", e);
      state.live.error = String(e.message || e);
      return null;
    }
  }
  function stopWorkflowPoll() {
    if (state._pollTimer) { clearInterval(state._pollTimer); state._pollTimer = null; }
    state.live.isPolling = false;
  }
  function scheduleWorkflowPoll() {
    if (!isLiveEnabled()) return;
    if (state._pollTimer) { clearInterval(state._pollTimer); state._pollTimer = null; }
    // Public API budget is 60 req/hr per visitor IP and CI refresh costs one
    // request per repo, so this stays slow and pauses in background tabs.
    const base = Math.max(60000, Number(liveConfig().ciRefreshMs) || 600000);
    const jitter = Math.floor(Math.random() * 8000);
    const intervalMs = base + jitter;
    state.live.isPolling = true;
    const tick = async () => {
      if (document.hidden) return;
      await fetchWorkflowLive();
    };
    setTimeout(tick, 4000);
    state._pollTimer = setInterval(tick, intervalMs);
  }
  function toggleWorkflowPoll() {
    if (state._pollTimer) { stopWorkflowPoll(); toast("Live workflow polling paused"); render(); }
    else { scheduleWorkflowPoll(); toast("Live workflow polling resumed"); }
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

  function goAccount(login) {
    if (!login) return;
    state.selectedAccount = login;
    try {
      const target = `#/account/${encodeURIComponent(login)}`;
      if (location.hash !== target) history.replaceState(null, "", target);
    } catch {}
    go("account", { keepHash: true });
  }

  function goProject(name) {
    state.selectedProject = name;
    try {
      const target = `#/project/${encodeURIComponent(name)}`;
      if (location.hash !== target) history.replaceState(null, "", target);
    } catch {}
    go("project", { keepHash: true });
  }

  /* ---- BOOT ---- */
  let _wfVisibilityWired = false;
  async function boot() {
    applyTheme(state.theme);

    // No login, no gate: the snapshot renders immediately for every visitor.
    const ok = await loadSnapshot();
    await loadHistory();
    render();

    // Register Service Worker on supported http(s) protocols
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW not registered", e));
    }

    if (ok && isLiveEnabled()) {
      setTimeout(fetchLive, 900);
      scheduleWorkflowPoll();
    }

    if (!_wfVisibilityWired) {
      _wfVisibilityWired = true;
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) return;
        if (state.view === "craft" || state.view === "project") {
          fetchWorkflowLive().catch(() => {});
        }
      });
    }

    // Modal background close triggers
    $('#repoOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "repoOverlay") closeOverlay();
    });
    $('#paletteOverlay')?.addEventListener("click", (e) => {
      if (e.target.id === "paletteOverlay") closeCommandPalette();
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
        closeSheets();
      }
    });
  }

  // Deep-link support: #/view-name
  const applyHash = () => {
    const parts = (location.hash || "")
      .replace(/^#\/?/, "")
      .split("/")
      .filter(Boolean);
    const view = (parts[0] || "").toLowerCase();
    const arg = parts.slice(1).join("/");

    // Shareable project pages: #/project/<repo-name>
    if (view === "project" && arg) {
      state.selectedProject = decodeURIComponent(arg);
      go("project", { keepHash: true });
      return;
    }
    // Shareable account pages: #/account/<login>
    if (view === "account" && arg) {
      state.selectedAccount = decodeURIComponent(arg).replace(/^@/, "");
      go("account", { keepHash: true });
      return;
    }
    // Legacy links (#/command, #/repos, #/ci, #/profile...) map to new views.
    const LEGACY = { command: "overview", repos: "projects", ci: "craft", profile: "about", community: "numbers", health: "numbers", xp: "overview" };
    const target = LEGACY[view] || view;
    if (target && NAV.some((n) => n.id === target)) go(target, { keepHash: true });
  };
  window.addEventListener("hashchange", applyHash);

  boot();
  applyHash();
})();
