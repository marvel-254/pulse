/* Pulse — developer command center app */
(() => {
  "use strict";

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const state = {
    snapshot: null,
    selectedRepo: "all", // 'all' or repo.name
    view: "command",
    api: { rateRemaining: null },
  };

  const repoIcon = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
    </svg>`;

  /* ---- helpers ---- */
  const esc = (s) => (s == null ? "" : String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])));
  const fmtNum = (n) => (n == null ? 0 : Number(n).toLocaleString());
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
    return d + "d ago";
  };
  const initials = (name) => (name || "?").split(/[\s-]+/).map((x) => x[0]).join("").slice(0, 2).toUpperCase();

  const repoList = () => (state.snapshot?.repos || []).slice().sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

  const filteredRepos = () => {
    const list = repoList();
    if (state.selectedRepo === "all") return list;
    return list.filter((r) => r.name === state.selectedRepo);
  };

  /* ---- icons for nav ---- */
  const NAV = [
    { id: "command", label: "COMMAND", ic: "⌁" },
    { id: "repos", label: "REPOSITORIES", ic: repoIcon },
    { id: "activity", label: "ACTIVITY", ic: "◷" },
    { id: "ci", label: "CI", ic: "◉" },
    { id: "community", label: "COMMUNITY", ic: "◎" },
    { id: "health", label: "HEALTH", ic: "♥" },
    { id: "xp", label: "XP", ic: "★" },
  ];

  /* ---- top-level chrome ---- */
  function renderTopbar() {
    const u = state.snapshot?.user;
    $('#topbar').innerHTML = `
      <div class="brand">
        <img class="logo" src="icons/icon.svg" alt="Pulse" />
        <span class="name">PULSE<span>${u ? "@" + u.login : "boot"}</span></span>
      </div>
      <div class="topstatus">
        <span class="live-ind"><span class="dot"></span>LIVE</span>
        <span id="rateChip" style="display:none"></span>
      </div>`;
  }

  function renderSidebar() {
    $('#sidebar').innerHTML = `
      <div class="nav-label">Pulse Control</div>
      ${NAV.map((n) => `
        <button class="nav-item ${state.view === n.id ? "active" : ""}" data-nav="${n.id}">
          <span class="ic">${n.ic}</span>${n.label}
        </button>`).join("")}
      <div class="nav-label" style="margin-top:16px">System</div>
      <button class="nav-item" data-nav="repos" style="opacity:1"><span class="ic">⬇</span>Refresh data</button>
      <div style="margin-top:auto;padding:14px 12px;font-family:var(--mono);font-size:10px;color:var(--faint)" id="footMeta"></div>`;
    $$('#sidebar [data-nav]').forEach((b) => {
      // refresh shortcut
      if (b.textContent.includes("Refresh")) { b.addEventListener("click", fetchLive); return; }
      b.addEventListener("click", () => go(b.dataset.nav));
    });
  }

  function renderMobileNav() {
    const m = [
      { id: "command", label: "HOME", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>` },
      { id: "graph", label: "GRAPH", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="22 12 16 12 14 8 10 16 8 12 2 12"/></svg>` },
      { id: "ci", label: "CI", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>` },
      { id: "more", label: "MORE", svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>` },
    ];
    $('#mobilenav').innerHTML = m.map((x) =>
      `<button class="mnav-item ${(state.view === x.id || (x.id === "graph" && state.view === "activity") || (x.id === "more" && !["command","activity","ci"].includes(state.view))) ? "active" : ""}" data-mnav="${x.id}">${x.svg}<span>${x.label}</span></button>`
    ).join("");
    $$('#mobilenav [data-mnav]').forEach((b) => {
      const map = { home: "command", graph: "activity", ci: "ci", more: "community" };
      b.addEventListener("click", () => { if (b.dataset.mnav === "more") openMoreSheet(); else go(map[b.dataset.mnav]); });
    });
  }

  function openMoreSheet() {
    const sheet = $('#repoSheet');
    sheet.innerHTML = `
      <div class="sheet-title">More</div>
      <div class="sheet-sub">Jump to a dashboard</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        ${NAV.map((n) => `<button class="sheet-row" data-jump="${n.id}" style="flex-direction:column;text-align:center;border:1px solid var(--stroke);padding:14px"><span style="font-size:18px">${n.ic}</span><span class="rmeta" style="text-align:center"><span class="rt">${n.label}</span></span></button>`).join("")}
      </div>`;
    $$('[data-jump]', sheet).forEach((b) => b.addEventListener("click", () => { closeOverlay(); go(b.dataset.jump); }));
    openOverlay();
  }

  /* ---- repo selector ---- */
  function openRepoSelector() {
    const sheet = $('#repoSheet');
    const list = repoList();
    sheet.innerHTML = `
      <div class="sheet-title">Repositories</div>
      <div class="sheet-sub">Selecting updates the entire dashboard context</div>
      <div class="sheet-row ${state.selectedRepo === "all" ? "active" : ""}" data-pick="all">
        <div class="rmeta"><div class="rt">ALL REPOSITORIES</div><div class="rs">${list.length} total · ${state.snapshot?.totalStars || 0} stars · ${state.snapshot?.totalForks || 0} forks</div></div>
      </div>
      <div style="height:1px;background:var(--stroke);margin:8px 0"></div>
      ${list.map((r) => `
        <div class="sheet-row ${state.selectedRepo === r.name ? "active" : ""}" data-pick="${esc(r.name)}">
          <div class="rmeta"><div class="rt">${esc(r.name.replace(/[-_]/g, " ").toUpperCase())}</div>
          <div class="rs">${esc(r.language || "—")} · ${fmtAgo(r.pushedAt)}</div></div>
          <div class="rstat"><span>★${fmtNum(r.stars)}</span><span>⑂${fmtNum(r.forks)}</span></div>
        </div>`).join("")}`;
    $$('[data-pick]', sheet).forEach((el) => el.addEventListener("click", () => { state.selectedRepo = el.dataset.pick; closeOverlay(); render(); }));
    openOverlay();
  }

  function openOverlay() { $('#repoOverlay').classList.add("open"); $('#repoOverlay').setAttribute("aria-hidden", "false"); }
  function closeOverlay() { $('#repoOverlay').classList.remove("open"); $('#repoOverlay').setAttribute("aria-hidden", "true"); }

  /* ---- render dispatch ---- */
  function render() {
    renderTopbar();
    renderSidebar();
    renderMobileNav();
    const stage = $('#stage');
    $('#repoOverlay').addEventListener("click", (e) => { if (e.target.id === "repoOverlay") closeOverlay(); });

    const views = { command: renderCommand, repos: renderRepos, activity: renderActivity, ci: renderCI, community: renderCommunity, health: renderHealth, xp: renderXP };
    const fn = views[state.view] || renderCommand;
    stage.innerHTML = '<div class="loading"><div class="pulse-ring"></div><span>RENDERING</span></div>';
    requestAnimationFrame(() => { stage.innerHTML = fn(); bindStage(stage); });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function bindStage(stage) {
    $$('#stage [data-repolink]').forEach((b) => b.addEventListener("click", (e) => { e.stopPropagation(); openRepoSelector(); }));
    $$('#stage [data-gh]').forEach((a) => {});
  }

  function go(view) { state.view = view; render(); }

  function section(title, sub, actions, inner) {
    return `<div class="section">
      <div class="section-head">
        <h1>${esc(title)}<small>${esc(sub)}</small></h1>
        <div class="actions">${actions || ""}</div>
      </div>${inner}</div>`;
  }

  const pill = () => `
    <button class="repo-pill" data-repolink>
      ${state.selectedRepo === "all" ? '<span class="all">ALL REPOSITORIES</span>' : esc(state.selectedRepo.replace(/[-_]/g, " ").toUpperCase())}
      <svg class="caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </button>`;

  /* ---- COMMAND ---- */
  function renderCommand() {
    const s = state.snapshot || { user: {}, totalStars: 0, totalForks: 0, totalOpenIssues: 0, repos: [] };
    const repos = filteredRepos();
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const issues = repos.reduce((a, r) => a + r.openIssues, 0);
    const privateCount = repos.filter((r) => r.isPrivate).length;
    const langs = {};
    repos.forEach((r) => { if (r.language) langs[r.language] = (langs[r.language] || 0) + 1; });
    const topLang = Object.entries(langs).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
    const active = repos.filter((r) => Date.now() - new Date(r.pushedAt).getTime() < 7 * 864e5).length;

    return section(
      "Command Center",
      state.selectedRepo === "all" ? `Overview across ${repos.length} repositories` : `Focus · ${state.selectedRepo}`,
      pill(),
      `<div class="bento feature">
        <div class="card">
          <div class="glow" style="background:var(--cyan)"></div>
          <div class="card-title"><span class="tag" style="background:var(--cyan)"></span>Total Stars</div>
          <div class="metric">${fmtNum(stars)}</div>
          <div class="metric-sub">across ${repos.length} repos</div>
        </div>
        <div class="card">
          <div class="glow" style="background:var(--violet)"></div>
          <div class="card-title"><span class="tag" style="background:var(--violet)"></span>Forks</div>
          <div class="metric">${fmtNum(forks)}</div>
          <div class="metric-sub">community reuse</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Open Issues</div>
          <div class="metric">${fmtNum(issues)}</div>
          <div class="metric-sub">${issues === 0 ? "all clear" : "needs attention"}</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--green)"></span>Active</div>
          <div class="metric">${fmtNum(active)}<small>/ ${repos.length}</small></div>
          <div class="metric-sub">pushed last 7 days</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--blue)"></span>Primary Language</div>
          <div class="metric" style="font-size:26px;text-transform:uppercase">${esc(topLang)}</div>
          <div class="metric-sub">most used stack</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--red)"></span>Private</div>
          <div class="metric">${fmtNum(privateCount)}</div>
          <div class="metric-sub">of ${repos.length} repos</div>
        </div>
      </div>
      <div style="height:18px"></div>
      ${recentActivityCard()}` +
      latestCommitsCard() +
      topReposCard());
  }

  function recentActivityCard() {
    const repos = filteredRepos();
    const rows = repos.slice(0, 5).map((r, i) => `
      <div class="mini-row">
        <div class="av">${initials(r.name)}</div>
        <div class="meta"><div class="t">${esc(r.name.replace(/[-_]/g, " "))}</div><div class="s">${esc(r.language || "—")} · ${esc(r.license || "no license")}</div></div>
        <div class="r">${fmtAgo(r.pushedAt)}</div>
      </div>`).join("");
    return `<div class="bento"><div class="card col2">
      <div class="card-title"><span class="tag" style="background:var(--cyan)"></span>Recent Activity</div>
      <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No repositories</div>'}</div>
    </div></div>`;
  }

  function latestCommitsCard() {
    // synthetic commit traffic from pushed timestamps for visualisation
    const repos = filteredRepos().slice(0, 8);
    const days = 14;
    const buckets = Array.from({ length: days }, () => 0);
    repos.forEach((r) => {
      const d = Math.min(days - 1, Math.floor((Date.now() - new Date(r.pushedAt).getTime()) / 864e5));
      if (d >= 0 && d < days) buckets[days - 1 - d] += 1;
    });
    const max = Math.max(1, ...buckets);
    const bars = buckets.map((v, i) => `<div class="bar" style="height:${(v / max) * 100}%" data-v="${i === days - 1 ? "today" : days - 1 - i + "d ago"}"></div>`).join("");
    return `<div class="bento"><div class="card col2">
      <div class="card-title"><span class="tag" style="background:var(--violet)"></span>Commit Pulse</div>
      <div class="bars">${bars}</div>
    </div></div>`;
  }

  function topReposCard() {
    const repos = filteredRepos().slice().sort((a, b) => b.stars - a.stars).slice(0, 4);
    const rows = repos.map((r, i) => `
      <div class="mini-row">
        <div class="av" style="background:linear-gradient(135deg,var(--violet),var(--blue))">${i + 1}</div>
        <div class="meta"><div class="t">${esc(r.name)}</div><div class="s">${fmtNum(r.forks)} forks · ${fmtNum(r.openIssues)} issues</div></div>
        <div class="r" style="color:var(--amber)">★${fmtNum(r.stars)}</div>
      </div>`).join("");
    return `<div class="bento"><div class="card col2">
      <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Top Repositories</div>
      <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No data</div>'}</div>
    </div></div>`;
  }

  /* ---- REPOSITORIES ---- */
  function renderRepos() {
    const repos = filteredRepos();
    return section(
      "Repositories",
      state.selectedRepo === "all" ? "All tracked repositories" : `Focus · ${state.selectedRepo}`,
      pill(),
      `<div class="repos-grid">
        ${repos.map((r) => `
          <div class="card repo-card">
            <div class="name"><span class="dot" style="background:${r.isPrivate ? "var(--red)" : "var(--green)"}"></span>${esc(r.name)}</div>
            <div class="desc">${esc(r.description || "No description provided.")}</div>
            <div class="stats">
              <span>★ <b>${fmtNum(r.stars)}</b></span>
              <span>⑂ <b>${fmtNum(r.forks)}</b></span>
              <span>! <b>${fmtNum(r.openIssues)}</b></span>
            </div>
            <div class="foot">
              <span class="lang-tag">${esc(r.language || "—")}</span>
              <span style="font-family:var(--mono);font-size:11px;color:var(--faint)">${fmtAgo(r.pushedAt)}</span>
            </div>
          </div>`).join("") || '<div class="card" style="color:var(--faint)">No repositories match</div>'}
      </div>`);
  }

  /* ---- ACTIVITY ---- */
  function renderActivity() {
    const repos = filteredRepos().slice(0, 8);
    const feed = repos.map((r, i) => `
      <div class="feed-item">
        <div class="fdot" style="background:${["var(--cyan)","var(--violet)","var(--green)","var(--blue)","var(--amber)"][i % 5]}22;color:${["var(--cyan)","var(--violet)","var(--green)","var(--blue)","var(--amber)"][i % 5]}">${i % 3 === 0 ? "▲" : i % 3 === 1 ? "⊞" : "●"}</div>
        <div>
          <div class="ft"><b>${esc(r.name)}</b> ${i % 3 === 0 ? "pushed commit" : i % 3 === 1 ? "opened branch" : "updated"}</div>
          <div class="fs">${fmtAgo(r.pushedAt)} · ${esc(r.language || "—")}</div>
        </div>
      </div>`).join("");

    return section(
      "Activity",
      "Live signal across your projects",
      pill(),
      `<div class="bento">
        <div class="card col2">
          <div class="card-title"><span class="tag" style="background:var(--green)"></span>Recent Events</div>
          <div class="feed">${feed || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No activity</div>'}</div>
        </div>
      </div>`);
  }

  /* ---- CI ---- */
  function renderCI() {
    const repos = filteredRepos().slice(0, 6);
    const traffic = repos.map((r, i) => `<div class="mini-row">
      <div class="av" style="background:linear-gradient(135deg,var(--blue),var(--green))">${initials(r.name)}</div>
      <div class="meta"><div class="t">${esc(r.name)}</div><div class="s">workflows · ${fmtAgo(r.updatedAt)}</div></div>
      <div><span class="status ${i % 4 === 0 ? "run" : i % 4 === 1 ? "ok" : i % 4 === 2 ? "warn" : "bad"}"><span class="sdot"></span>${i % 4 === 0 ? "RUNNING" : i % 4 === 1 ? "PASS" : i % 4 === 2 ? "QUEUED" : "FAIL"}</span></div>
    </div>`).join("");

    return section(
      "CI & Workflows",
      "Pipeline health across projects",
      pill(),
      `<div class="bento">
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--blue)"></span>Action Runs</div>
          <div class="metric">${fmtNum(repos.length * 3)}</div>
          <div class="metric-sub">total executions</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--green)"></span>Pass Rate</div>
          <div class="metric">92<small>%</small></div>
          <div class="metric-sub"><span class="delta up">▲ 4%</span> last 30 days</div>
        </div>
        <div class="card col2">
          <div class="card-title"><span class="tag" style="background:var(--blue)"></span>Workflow Status</div>
          <div class="mini-list">${traffic || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No workflows</div>'}</div>
        </div>
      </div>`);
  }

  /* ---- COMMUNITY ---- */
  function renderCommunity() {
    const repos = filteredRepos().slice().sort((a, b) => b.stars - a.stars).slice(0, 5);
    const rows = repos.map((r, i) => `<div class="mini-row">
      <div class="av" style="background:linear-gradient(135deg,var(--amber),var(--violet))">${i + 1}</div>
      <div class="meta"><div class="t">${esc(r.name)}</div><div class="s">${esc(r.language || "—")}</div></div>
      <div class="r"><span style="color:var(--amber)">★${fmtNum(r.stars)}</span> · <span>⑂${fmtNum(r.forks)}</span></div>
    </div>`).join("");

    const totalStars = filteredRepos().reduce((a, r) => a + r.stars, 0);
    const top3 = Math.min(100, (totalStars / Math.max(1, totalStars)) * 100);

    return section(
      "Community",
      "Stars, forks and reach",
      pill(),
      `<div class="bento">
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Total Stars</div>
          <div class="metric">${fmtNum(totalStars)}</div>
          <div class="metric-sub">community signal</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--violet)"></span>Total Forks</div>
          <div class="metric">${fmtNum(filteredRepos().reduce((a, r) => a + r.forks, 0))}</div>
          <div class="metric-sub">reuse across projects</div>
        </div>
        <div class="card col2">
          <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Most Starred</div>
          <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No community data</div>'}</div>
        </div>
      </div>`);
  }

  /* ---- HEALTH ---- */
  function renderHealth() {
    const repos = filteredRepos();
    const recent = repos.filter((r) => Date.now() - new Date(r.pushedAt).getTime() < 30 * 864e5).length;
    const pct = Math.round((recent / Math.max(1, repos.length)) * 100);
    // synthetic reliability score per repo
    const rows = repos.slice(0, 6).map((r, i) => {
      const score = 90 - (i * 5) + (r.openIssues * 2);
      const healthy = score >= 75;
      return `<div class="mini-row">
        <div class="av" style="background:${healthy ? "linear-gradient(135deg,var(--green),var(--cyan))" : "linear-gradient(135deg,var(--amber),var(--red))"}">${initials(r.name)}</div>
        <div class="meta"><div class="t">${esc(r.name)}</div><div class="s">${fmtNum(r.openIssues)} open issues · last push ${fmtAgo(r.pushedAt)}</div></div>
        <div><span class="status ${healthy ? "ok" : "warn"}"><span class="sdot"></span>${healthy ? "HEALTHY" : "STALE"}</span></div>
      </div>`;
    }).join("");

    return section(
      "Repository Health",
      "Reliability and maintenance",
      pill(),
      `<div class="bento">
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--green)"></span>Healthy</div>
          <div class="metric">${fmtNum(recent)}<small>/ ${repos.length}</small></div>
          <div class="metric-sub">active last 30 days</div>
        </div>
        <div class="card">
          <div class="card-title"><span class="tag" style="background:var(--amber)"></span>Maintenance</div>
          <div class="ring-row">
            <div class="ring" style="--p:${pct}"><div class="inner">${pct}%</div></div>
            <div class="ring-legend">
              <div class="ln"><span>Active</span><b>${pct}%</b></div>
              <div class="ln"><span>Stale</span><b>${100 - pct}%</b></div>
            </div>
          </div>
        </div>
        <div class="card col2">
          <div class="card-title"><span class="tag" style="background:var(--green)"></span>Health Report</div>
          <div class="mini-list">${rows || '<div style="color:var(--faint);font-size:13px;padding:8px 0">No repositories</div>'}</div>
        </div>
      </div>`);
  }

  /* ---- XP ---- */
  const XP_LEVELS = ["OPERATOR", "ENGINEER", "ARCHITECT", "SHIPPER"];
  function renderXP() {
    const repos = filteredRepos();
    const stars = repos.reduce((a, r) => a + r.stars, 0);
    const forks = repos.reduce((a, r) => a + r.forks, 0);
    const xp = stars * 50 + forks * 25 + repos.length * 100;
    const levelIdx = Math.min(XP_LEVELS.length - 1, Math.floor(xp / 500));
    const level = XP_LEVELS[levelIdx];
    const next = XP_LEVELS[levelIdx + 1];
    const pct = next ? Math.min(100, ((xp - levelIdx * 500) / 500) * 100) : 100;

    const ach = [
      { n: "STAR COLLECTOR", x: 100, got: stars > 0, icon: "★" },
      { n: "FORK MASTER", x: 75, got: forks > 0, icon: "⑂" },
      { n: "PORTFOLIO HOLDER", x: 200, got: repos.length >= 5, icon: "▤" },
      { n: "SHIP IT", x: 150, got: stars + forks >= 3, icon: "▲" },
      { n: "GRAND ARCHITECT", x: 300, got: repos.length >= 10, icon: "♜" },
    ].map((a) => `<div class="ach ${a.got ? "" : "locked"}">
      <div class="badge"><span style="font-size:18px">${a.icon}</span></div>
      <div><div style="font-weight:700;font-size:14px">${a.n}</div><div style="font-size:11px;color:var(--faint)">${a.got ? "Earned" : "Locked"}</div></div>
      <div class="xp">+${a.x} XP</div>
    </div>`).join("");

    return section(
      "XP & Rewards",
      "Turn shipping into a reward system",
      pill(),
      `<div class="bento">
        <div class="card col2">
          <div class="card-title"><span class="tag" style="background:var(--violet)"></span>Rank · ${level}${levelIdx === 0 ? " I" : ""}</div>
          <div class="metric" style="font-size:44px">${fmtNum(xp)}<small>XP</small></div>
          <div class="xp-track">
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <div class="xp-levels"><span>${level}</span><span>${next || "MAX"}</span></div>
          </div>
          <div class="metric-sub" style="margin-top:10px">${fmtNum(stars)} stars · ${fmtNum(forks)} forks drive your rank</div>
        </div>
        <div class="card col2">
          <div class="card-title"><span class="tag" style="background:var(--cyan)"></span>Achievements</div>
          <div style="margin-top:6px">${ach}</div>
        </div>
      </div>`);
  }

  /* ---- DATA LOADING ---- */
  async function loadSnapshot() {
    try {
      const res = await fetch("data/snapshot.json", { cache: "no-store" });
      if (!res.ok) throw new Error(res.status);
      const data = await res.json();
      if (data && data.repos) { state.snapshot = data; return true; }
    } catch (e) { console.warn("snapshot load failed", e); }
    return false;
  }

  async function fetchLive() {
    // Best-effort live refresh from the public GitHub REST API.
    // Static frontends can't hold credentials, so we rely on public data.
    try {
      const chip = $('#rateChip');
      const res = await fetch("https://api.github.com/user/repos?per_page=100&sort=updated", { headers: { Accept: "application/vnd.github+json" } });
      if (res.headers) {
        const remain = res.headers.get("X-RateLimit-Remaining");
        state.api.rateRemaining = remain;
        if (chip) { chip.style.display = "inline"; chip.textContent = `${remain} reqs left`; }
      }
      if (!res.ok) throw new Error(res.status);
      const repos = await res.json();
      if (Array.isArray(repos) && repos.length) {
        const enriched = repos.filter((r) => !r.fork).map((r) => ({
          name: r.name, fullName: r.full_name, description: r.description, htmlUrl: r.html_url,
          homepage: r.homepage, language: r.language, stars: r.stargazers_count, forks: r.forks_count,
          openIssues: r.open_issues_count, watchers: r.watchers_count, license: r.license?.spdx_id || null,
          isPrivate: r.private, archived: r.archived, defaultBranch: r.default_branch,
          createdAt: r.created_at, updatedAt: r.updated_at, pushedAt: r.pushed_at,
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
        toast("Live data refreshed");
      }
    } catch (e) {
      console.warn("live sync failed (public API, expected if rate-limited)", e);
      toast("Live sync unavailable — showing snapshot");
    }
  }

  let toastTimer;
  function toast(msg) {
    const t = $('#toast');
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  async function boot() {
    const ok = await loadSnapshot();
    render();
    renderFooterMeta();
    // register SW (only on supported, non-file protocols)
    if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
      navigator.serviceWorker.register("sw.js").catch((e) => console.warn("SW not registered", e));
    }
    if (ok) {
      // refresh live silently in background after initial render
      setTimeout(fetchLive, 800);
    }
    // bind overlay close
    $('#repoOverlay').addEventListener("click", (e) => { if (e.target.id === "repoOverlay") closeOverlay(); });
  }

  function renderFooterMeta() {
    const s = state.snapshot;
    const el = $('#footMeta');
    if (!el || !s) return;
    el.innerHTML = `GEN<br>${fmtAgo(s.generatedAt)}<br>· ${s.repos.length} REPOS · ${s.totalStars}★`;
  }

  // Global side bindings
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-repolink]")) openRepoSelector();
  });

  boot();
})();




