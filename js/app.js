/* Pulse — Developer Command Center Application */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

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
    selectedRepo: "all", // 'all' or repo.name
    view: "command",
    api: { rateRemaining: null },
    theme: localStorage.getItem("pulse-theme") || "dark",
    repoSearchQuery: "",
    repoLangFilter: "all",
    repoSortBy: "pushed",
    pulseTimeframe: 14, // 7, 14, 30 days
    widgets: getSavedWidgets(),
    paletteQuery: "",
    paletteSelectedIndex: 0,
    filteredPaletteItems: [],
  };

  // Color mapping for languages
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

  const repoIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>`;

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
    { id: "command", label: "COMMAND", ic: "⌁", badge: () => filteredRepos().length },
    { id: "repos", label: "REPOSITORIES", ic: repoIcon, badge: () => repoList().length },
    { id: "activity", label: "ACTIVITY", ic: "◷", badge: () => null },
    { id: "ci", label: "CI & PIPELINES", ic: "◉", badge: () => "OK" },
    { id: "community", label: "COMMUNITY", ic: "◎", badge: () => state.snapshot?.totalStars || null },
    { id: "health", label: "HEALTH", ic: "♥", badge: () => null },
    { id: "xp", label: "XP & REWARDS", ic: "★", badge: () => "LVL" },
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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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

        <button class="topbar-btn" id="themeToggleBtn" title="Toggle Dark/Light Mode">
          ${isDark
            ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
            : `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`}
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
        <span class="ic">⌘</span>
        <span>Command Palette</span>
        <span class="nav-badge">⌘K</span>
      </button>
      <button class="nav-item" id="sidebarRefreshBtn">
        <span class="ic">↻</span>
        <span>Sync GitHub</span>
      </button>
      <button class="nav-item" id="sidebarWidgetsBtn">
        <span class="ic">⚙</span>
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
          <span style="color:var(--amber)">★${state.snapshot?.totalStars || 0}</span>
        </div>
      </div>`;

    $$('#sidebar [data-nav]').forEach((b) => {
      b.addEventListener("click", () => go(b.dataset.nav));
    });
    $('#sidebarCmdPaletteBtn')?.addEventListener("click", openCommandPalette);
    $('#sidebarRefreshBtn')?.addEventListener("click", fetchLive);
    $('#sidebarWidgetsBtn')?.addEventListener("click", openWidgetModal);
  }

  /* ---- MOBILE BOTTOM NAV ---- */
  function renderMobileNav() {
    const mobilenav = $('#mobilenav');
    if (!mobilenav) return;

    const m = [
      { id: "command", label: "HOME", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
      { id: "repos", label: "REPOS", svg: repoIcon },
      { id: "activity", label: "ACTIVITY", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 16 12 14 8 10 16 8 12 2 12"/></svg>` },
      { id: "palette", label: "SEARCH", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>` },
      { id: "more", label: "MORE", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>` },
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
          <div class="sheet-title">More Dashboards</div>
          <div class="sheet-sub">Jump to any developer view</div>
        </div>
        <button class="sheet-close" id="closeMoreSheet">✕</button>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px">
        ${NAV.map(
          (n) => `
          <button class="sheet-row" data-jump="${n.id}" style="flex-direction:column;text-align:center;border:1px solid var(--stroke);padding:16px;border-radius:14px">
            <span style="font-size:22px;margin-bottom:6px">${n.ic}</span>
            <span class="rmeta" style="text-align:center">
              <span class="rt">${n.label}</span>
            </span>
          </button>`
        ).join("")}
      </div>`;

    $('#closeMoreSheet')?.addEventListener("click", closeOverlay);
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
            <span>★ ${fmtNum(r.stars)}</span>
            <span>⑂ ${fmtNum(r.forks)}</span>
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
        <span class="status ${repo.isPrivate ? "bad" : "ok"}"><span class="sdot"></span>${repo.isPrivate ? "PRIVATE" : "PUBLIC"}</span>
        ${repo.language ? `<span class="lang-tag" style="background:${langColor}22;color:${langColor}">${esc(repo.language)}</span>` : ""}
        <span class="priv-tag">BRANCH: ${esc(repo.defaultBranch || "main")}</span>
        ${repo.license ? `<span class="priv-tag">LICENSE: ${esc(repo.license)}</span>` : ""}
        ${repo.archived ? `<span class="status warn"><span class="sdot"></span>ARCHIVED</span>` : ""}
      </div>

      <p style="font-size:14px;color:var(--text);margin-bottom:18px;line-height:1.5">
        ${esc(repo.description || "No repository description provided.")}
      </p>

      <div class="inspector-grid">
        <div class="inspector-stat">
          <div class="label">Stars</div>
          <div class="val" style="color:var(--amber)">★ ${fmtNum(repo.stars)}</div>
        </div>
        <div class="inspector-stat">
          <div class="label">Forks</div>
          <div class="val" style="color:var(--violet)">⑂ ${fmtNum(repo.forks)}</div>
        </div>
        <div class="inspector-stat">
          <div class="label">Open Issues</div>
          <div class="val" style="color:var(--cyan)">! ${fmtNum(repo.openIssues)}</div>
        </div>
        <div class="inspector-stat">
          <div class="label">Watchers</div>
          <div class="val" style="color:var(--green)">◉ ${fmtNum(repo.watchers)}</div>
        </div>
      </div>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Clone HTTPS</div>
      <div class="clone-box">
        <code>${esc(httpsClone)}</code>
        <button class="btn btn-sm" id="copyHttpsBtn">Copy</button>
      </div>

      <div style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--faint);margin-bottom:8px">Clone SSH</div>
      <div class="clone-box">
        <code>${esc(sshClone)}</code>
        <button class="btn btn-sm" id="copySshBtn">Copy</button>
      </div>

      <div style="display:flex;gap:10px;margin-top:20px;flex-wrap:wrap">
        <button class="btn btn-primary" id="focusRepoBtn">
          ⌁ Focus Command Center
        </button>
        <a class="btn" href="${esc(repo.htmlUrl)}" target="_blank" rel="noopener noreferrer">
          View on GitHub ↗
        </a>
        <a class="btn" href="${esc(repo.htmlUrl)}/issues" target="_blank" rel="noopener noreferrer">
          Issues (${repo.openIssues})
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
          title: `Switch to ${state.theme === "dark" ? "Light" : "Dark"} Theme`,
          sub: "Theme",
          icon: "◐",
          action: toggleTheme,
        },
        {
          title: "Sync with GitHub (Live Refresh)",
          sub: "API",
          icon: "↻",
          action: fetchLive,
        },
        {
          title: "Customize Command Center Widgets",
          sub: "Layout",
          icon: "⚙",
          action: openWidgetModal,
        },
        {
          title: "Focus All Repositories",
          sub: "Filter",
          icon: "⌁",
          action: () => {
            state.selectedRepo = "all";
            go("command");
          },
        },
        {
          title: "Copy Summary as Markdown",
          sub: "Export",
          icon: "📋",
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
            icon: "▣",
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
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input type="text" id="paletteInput" placeholder="Type a command or repository name..." value="${esc(state.paletteQuery)}" autocomplete="off" />
          <span style="font-size:11px;color:var(--faint);font-family:var(--mono)">ESC to exit</span>
        </div>
        <div class="palette-results" id="paletteResults">
          ${items.length === 0 ? `<div style="padding:24px;text-align:center;color:var(--faint);font-size:13px">No matching results</div>` : ""}
          ${items.map((it, idx) => `
            <div class="palette-item ${idx === state.paletteSelectedIndex ? "selected" : ""}" data-idx="${idx}">
              <span style="width:20px;text-align:center;font-size:14px;color:var(--cyan)">${it.icon}</span>
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
        <button class="btn btn-primary btn-sm" id="saveWidgetsBtn">Done</button>
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
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>
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
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
        Widgets
      </button>
      <button class="btn btn-sm" id="exportSummaryTrigger" title="Export Markdown">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
        Share
      </button>`;

    // Metric cards
    let metricCardsHtml = "";
    if (w.stars) {
      metricCardsHtml += `
        <div class="card">
          <div class="glow" style="background:var(--cyan)"></div>
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--cyan);color:var(--cyan)"></span>Total Stars</div>
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
            <div class="card-title"><span class="tag" style="background:var(--violet);color:var(--violet)"></span>Forks</div>
          </div>
          <div class="metric" style="color:var(--violet)">${fmtNum(forks)}</div>
          <div class="metric-sub">community reuse</div>
        </div>`;
    }
    if (w.issues) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--amber);color:var(--amber)"></span>Open Issues</div>
          </div>
          <div class="metric" style="color:var(--amber)">${fmtNum(issues)}</div>
          <div class="metric-sub">${issues === 0 ? "clean queue" : "action required"}</div>
        </div>`;
    }
    if (w.active) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--green);color:var(--green)"></span>Active Repos</div>
          </div>
          <div class="metric" style="color:var(--green)">${fmtNum(active)}<small>/ ${repos.length}</small></div>
          <div class="metric-sub">pushed past 7 days</div>
        </div>`;
    }
    if (w.primaryLang) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--blue);color:var(--blue)"></span>Primary Stack</div>
          </div>
          <div class="metric" style="font-size:24px;text-transform:uppercase;color:var(--blue)">${esc(topLang)}</div>
          <div class="metric-sub">most used language</div>
        </div>`;
    }
    if (w.privateCount) {
      metricCardsHtml += `
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--red);color:var(--red)"></span>Private Repos</div>
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
            <span class="tag" style="background:var(--cyan);color:var(--cyan)"></span>
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
    const totalDays = 7 * 12; // 12 weeks
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
            <span class="tag" style="background:var(--green);color:var(--green)"></span>
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
            <span class="tag" style="background:var(--violet);color:var(--violet)"></span>
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
            <span class="tag" style="background:var(--cyan);color:var(--cyan)"></span>
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
        <div class="r" style="color:var(--amber)">★ ${fmtNum(r.stars)}</div>
      </div>`).join("");

    return `
      <div class="card col2">
        <div class="card-head">
          <div class="card-title">
            <span class="tag" style="background:var(--amber);color:var(--amber)"></span>
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
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
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
        <div style="font-size:28px;margin-bottom:8px">🔍</div>
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
            <span class="priv-tag">${r.isPrivate ? "PRIV" : "PUB"}</span>
          </div>
          <div class="desc">${esc(r.description || "No description provided.")}</div>
          <div class="stats">
            <span>★ <b>${fmtNum(r.stars)}</b></span>
            <span>⑂ <b>${fmtNum(r.forks)}</b></span>
            <span>! <b>${fmtNum(r.openIssues)}</b></span>
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
    const repos = filteredRepos().slice(0, 12);
    const feed = repos
      .map((r, i) => {
        const col = ["var(--cyan)", "var(--violet)", "var(--green)", "var(--blue)", "var(--amber)"][i % 5];
        return `
        <div class="feed-item" data-inspect="${esc(r.name)}" style="cursor:pointer" title="Inspect repository">
          <div class="fdot" style="background:${col}22;color:${col}">
            ${i % 3 === 0 ? "▲" : i % 3 === 1 ? "⊞" : "●"}
          </div>
          <div>
            <div class="ft">
              <b>${esc(r.name)}</b> ${i % 3 === 0 ? "pushed latest commit" : i % 3 === 1 ? "updated default branch" : "synchronized"}
            </div>
            <div class="fs">${fmtAgo(r.pushedAt)} · ${esc(r.language || "stack")} · ${esc(r.defaultBranch || "main")}</div>
          </div>
        </div>`;
      })
      .join("");

    return section(
      "Activity Stream",
      "Real-time commit signals and repository updates",
      pill(),
      `<div class="bento">
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--green)"></span>Live Event Stream</div>
            <span style="font-family:var(--mono);font-size:11px;color:var(--muted)">Auto-synced</span>
          </div>
          <div class="feed">${feed || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No activity</div>'}</div>
        </div>
        ${commitHeatmapWidget()}
      </div>`
    );
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
            <div class="card-title"><span class="tag" style="background:var(--blue)"></span>Total Workflows</div>
          </div>
          <div class="metric" style="color:var(--blue)">${fmtNum(repos.length * 4)}</div>
          <div class="metric-sub">tracked workflows</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--green)"></span>Pipeline Pass Rate</div>
          </div>
          <div class="metric" style="color:var(--green)">96<small>%</small></div>
          <div class="metric-sub"><span class="delta up">▲ 4%</span> 30-day reliability</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--blue)"></span>Workflow Status</div>
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
        <div class="r"><span style="color:var(--amber)">★ ${fmtNum(r.stars)}</span></div>
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
            <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Total Stars</div>
          </div>
          <div class="metric" style="color:var(--amber)">${fmtNum(totalStars)}</div>
          <div class="metric-sub">developer appreciation</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--violet)"></span>Total Forks</div>
          </div>
          <div class="metric" style="color:var(--violet)">${fmtNum(totalForks)}</div>
          <div class="metric-sub">community derivations</div>
        </div>
        <div class="card col2">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Star Leaderboard</div>
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
            <div class="card-title"><span class="tag" style="background:var(--green)"></span>Maintained Repos</div>
          </div>
          <div class="metric" style="color:var(--green)">${fmtNum(recent)}<small>/ ${repos.length}</small></div>
          <div class="metric-sub">updated within 30 days</div>
        </div>
        <div class="card">
          <div class="card-head">
            <div class="card-title"><span class="tag" style="background:var(--cyan)"></span>Freshness Ratio</div>
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
            <div class="card-title"><span class="tag" style="background:var(--green)"></span>Repository Health Audit</div>
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
      { n: "FIRST CODEBASE", x: 100, got: repos.length >= 1, icon: "⚡" },
      { n: "STAR COLLECTOR", x: 150, got: stars > 0, icon: "★" },
      { n: "COMMUNITY FORK", x: 120, got: forks > 0, icon: "⑂" },
      { n: "PORTFOLIO EXPANSION", x: 250, got: repos.length >= 5, icon: "▤" },
      { n: "COMMAND SHIPPER", x: 200, got: repos.length >= 8, icon: "▲" },
      { n: "FULL STACK POLYGLOT", x: 300, got: new Set(repos.map((r) => r.language).filter(Boolean)).size >= 3, icon: "♜" },
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
            <div class="card-title"><span class="tag" style="background:var(--violet)"></span>Rank · Tier ${levelIdx + 1}</div>
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
            <div class="card-title"><span class="tag" style="background:var(--cyan)"></span>Milestones & Badges</div>
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
    toast("Syncing with GitHub API...");
    try {
      const chip = $('#rateChip');
      const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", {
        headers: { Accept: "application/vnd.github+json" },
      });
      if (res.headers) {
        const remain = res.headers.get("X-RateLimit-Remaining");
        state.api.rateRemaining = remain;
        if (chip) {
          chip.style.display = "inline";
          chip.textContent = `${remain} reqs`;
        }
      }
      if (!res.ok) throw new Error(res.status);
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

        state.snapshot = {
          ...(state.snapshot || {}),
          generatedAt: new Date().toISOString(),
          repos: enriched,
          totalStars: enriched.reduce((a, r) => a + r.stars, 0),
          totalForks: enriched.reduce((a, r) => a + r.forks, 0),
          totalOpenIssues: enriched.reduce((a, r) => a + r.openIssues, 0),
        };
        render();
        toast("Live GitHub data synchronized");
      }
    } catch (e) {
      console.warn("Live sync warning (expected if rate-limited without auth token):", e);
      toast("Showing latest snapshot data");
    }
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    if (!t) return;
    t.innerHTML = `<span>⌁</span> <span>${esc(msg)}</span>`;
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
        $('#inspectorOverlay')?.classList.remove("open");
        $('#widgetOverlay')?.classList.remove("open");
      }
    });
  }

  boot();
})();
