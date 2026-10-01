#!/usr/bin/env node
/**
 * Pulse — public data snapshot generator
 *
 * Builds `data/snapshot.json`, the static payload Pulse renders for visitors
 * before (or without) a live refresh.
 *
 * Only PUBLIC GitHub data is ever read or written:
 *   - the account comes from PULSE_USERNAME, else github.username in js/config.js
 *   - repositories come from `GET /users/:owner/repos` filtered to `type=owner`
 *     (GitHub only returns public repos to unauthenticated callers, and
 *      `owner` excludes collaborator repositories)
 *   - no OAuth, no login, no personal access token is ever required
 *
 * An optional GITHUB_TOKEN/GH_TOKEN only raises the API rate limit; it can
 * never cause private data to be included, because none of the endpoints
 * used here can return private repositories for another account.
 *
 *   PULSE_USERNAME=octocat node build.mjs
 */

import { writeFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "data", "snapshot.json");
const API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

/** Resolve the accounts to publish: env -> js/config.js -> repo-owner fallback. */
function configuredAccounts() {
  const clean = (list) =>
    [...new Set(list.map((u) => String(u).trim().replace(/^@/, "")).filter((u) => u && u !== "your-username"))];

  const envAccounts = (process.env.PULSE_ACCOUNTS || "").split(",").map((x) => x.trim()).filter(Boolean);
  if (envAccounts.length) return clean(envAccounts);

  const envUser = (process.env.PULSE_USERNAME || "").trim().replace(/^@/, "");
  if (envUser) return clean([envUser]);

  try {
    const cfg = readFileSync(join(__dirname, "js", "config.js"), "utf8");
    const listMatch = cfg.match(/accounts:\s*\[([^\]]*)\]/);
    if (listMatch) {
      const list = listMatch[1]
        .split(",")
        .map((x) => x.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
      if (list.length) return clean(list);
    }
    const single = cfg.match(/username:\s*["']([^"']+)["']/);
    if (single) return clean([single[1]]);
  } catch {}
  return [];
}

async function api(path) {
  try {
    const res = await fetch(API + path, {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "pulse-public-snapshot",
        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.warn(`  ! ${path}: ${e.message}`);
    return null;
  }
}

const EVENT_VERBS = {
  PushEvent: (p) => ["pushed to", p.commits?.length || 0],
  PullRequestEvent: () => ["opened a pull request in", ""],
  IssuesEvent: () => ["opened an issue in", ""],
  IssueCommentEvent: () => ["commented on an issue in", ""],
  CreateEvent: () => ["created branch/tag in", ""],
  WatchEvent: () => ["starred", ""],
  ForkEvent: () => ["forked", ""],
  ReleaseEvent: () => ["published a release in", ""],
  PullRequestReviewEvent: () => ["reviewed a PR in", ""],
  PublicEvent: () => ["made public", ""],
};

/** Reduce a README to a short plain-text pitch for highlight cards. */
function readmeExcerpt(markdown, limit = 220) {
  if (!markdown) return "";
  const text = markdown
    .replace(/^\s*<!--[\s\S]*?-->\s*$/gm, " ") // html comments
    .replace(/```[\s\S]*?```/g, " ") // code blocks
    .replace(/<[^>]+>/g, " ") // html tags
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> text
    .replace(/^\s*#{1,6}\s*/gm, " ") // headings
    .replace(/^\s*[-*+]\s+/gm, " ") // bullets
    .replace(/[`*_>|]/g, " ") // markdown punctuation
    .replace(/^\s*(badge|shields|\[!\[)[^\n]*$/gim, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const sentences = text.split(/(?<=[.!?])\s+/);
  let out = "";
  for (const s of sentences) {
    if ((out + " " + s).trim().length > limit) break;
    out = (out + " " + s).trim();
  }
  return (out || text.slice(0, limit)).trim();
}

function enrichRepo(r) {
  return {
    name: r.name,
    fullName: r.full_name,
    description: r.description,
    htmlUrl: r.html_url,
    homepage: r.homepage,
    language: r.language,
    topics: r.topics || [],
    stars: r.stargazers_count,
    forks: r.forks_count,
    openIssues: r.open_issues_count,
    watchers: r.watchers_count,
    license: r.license?.spdx_id || null,
    isPrivate: false, // public snapshot: only public work is ever published
    archived: r.archived,
    defaultBranch: r.default_branch,
    size: r.size,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
    pushedAt: r.pushed_at,
  };
}

/* ------------------------------------------------------------------ */

const accounts = configuredAccounts();
if (!accounts.length) {
  console.error("No GitHub account resolved. Set PULSE_ACCOUNTS / PULSE_USERNAME or github.accounts in js/config.js.");
  process.exit(1);
}

const login = accounts[0]; // primary account (identity + page meta)
console.log(
  `Pulse public snapshot → ${accounts.map((a) => "@" + a).join(", ")}${TOKEN ? " (rate-limit token present)" : " (anonymous)"}`
);

const profiles = await Promise.all(accounts.map((account) => api(`/users/${account}`)));

const repoLists = await Promise.all(
  accounts.map(async (account) => {
    const list = await api(`/users/${account}/repos?per_page=100&sort=updated&type=owner`);
    return (Array.isArray(list) ? list : [])
      .filter((r) => !r.fork && !r.private)
      .map((r) => ({ ...enrichRepo(r), owner: account }));
  })
);

const repos = repoLists.flat().sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt));

const eventLists = await Promise.all(accounts.map((account) => api(`/users/${account}/events/public?per_page=60`)));

// Safety: never replace a good snapshot with an empty one (e.g. rate-limited run).
if (!repos.length) {
  if (existsSync(OUT)) {
    console.warn("No public repositories returned — keeping the existing data/snapshot.json.");
    process.exit(0);
  }
  console.error("No public repositories returned and no snapshot exists yet.");
  process.exit(1);
}

const events = eventLists
  .flatMap((list) => (Array.isArray(list) ? list : []))
  .map((ev) => {
    const verb = EVENT_VERBS[ev.type];
    if (!verb || !ev.repo) return null;
    const [action, extra] = verb(ev.payload || {});
    return {
      type: ev.type,
      action,
      repo: ev.repo.name,
      createdAt: ev.created_at,
      extra: typeof extra === "function" ? extra(ev.payload || {}) : extra,
      htmlUrl:
        ev.type === "PushEvent"
          ? `https://github.com/${ev.repo.name}/commits`
          : `https://github.com/${ev.repo.name}`,
    };
  })
  .filter(Boolean)
  .filter((e) => accounts.includes(e.repo.split("/")[0]))
  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  .slice(0, 40);

// Deep enrichment (releases + workflow runs) is limited to keep the build
// within GitHub's rate limits. README excerpts are cheap (1 request each) and
// are collected for every repo when a token is available.
const DEEP = TOKEN ? 40 : 10;
const deepRepos = repos.slice(0, DEEP);
const extras = [];
const EXCERPT_SET = TOKEN ? repos : deepRepos;
for (const repo of deepRepos) {
  const full = repo.fullName;
  const wantsExcerpt = EXCERPT_SET.includes(repo);
  const [releasesRaw, runsRaw, workflowsRaw, readmeRaw] = await Promise.all([
    api(`/repos/${full}/releases?per_page=5`),
    api(`/repos/${full}/actions/runs?per_page=10`),
    TOKEN ? api(`/repos/${full}/actions/workflows?per_page=20`) : Promise.resolve(null),
    wantsExcerpt ? api(`/repos/${full}/readme`) : Promise.resolve(null),
  ]);

  const releases = (Array.isArray(releasesRaw) ? releasesRaw : []).map((rel) => ({
    tag: rel.tag_name,
    name: rel.name,
    publishedAt: rel.published_at,
    prerelease: rel.prerelease,
    draft: rel.draft,
    htmlUrl: rel.html_url,
  }));

  const rawRuns = Array.isArray(runsRaw) ? runsRaw : runsRaw?.workflow_runs || [];
  const runs = rawRuns.map((run) => ({
    id: run.id,
    runNumber: run.run_number,
    name: run.name,
    displayTitle: run.display_title || run.name,
    headBranch: run.head_branch,
    headSha: (run.head_sha || "").slice(0, 7),
    event: run.event,
    status: run.status,
    conclusion: run.conclusion,
    workflowId: run.workflow_id,
    actor: run.actor?.login || run.triggering_actor?.login || null,
    actorAvatar: run.actor?.avatar_url || null,
    createdAt: run.created_at,
    updatedAt: run.updated_at,
    htmlUrl: run.html_url,
  }));

  const rawWfs = Array.isArray(workflowsRaw?.workflows) ? workflowsRaw.workflows : [];
  const workflows = rawWfs.map((wf) => ({
    id: wf.id,
    name: wf.name,
    path: wf.path,
    state: wf.state,
    htmlUrl: wf.html_url,
  }));

  extras.push({ fullName: full, releases, runs, workflows });

  // Attach a plain-text README excerpt to the repo itself (used by Highlights).
  if (readmeRaw?.content) {
    repo.readmeExcerpt = readmeExcerpt(
      Buffer.from(readmeRaw.content, "base64").toString("utf8")
    );
  }
}

const profileReadmes = await Promise.all(accounts.map((account) => api(`/repos/${account}/${account}/readme`)));
const profile =
  profileReadmes
    .map((readme, i) =>
      readme?.content
        ? {
            owner: accounts[i],
            name: readme.name,
            raw: Buffer.from(readme.content, "base64").toString("utf8"),
            url: `https://github.com/${accounts[i]}/${accounts[i]}`,
            rawUrl: `https://raw.githubusercontent.com/${accounts[i]}/${accounts[i]}/HEAD/README.md`,
            fetchedAt: new Date().toISOString(),
          }
        : null
    )
    .find(Boolean) || null;

const accountSummaries = accounts.map((account, i) => {
  const profile = profiles[i];
  const own = repos.filter((r) => r.owner === account);
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
    latestPush: own.slice().sort((a, b) => new Date(b.pushedAt) - new Date(a.pushedAt))[0]?.pushedAt || null,
  };
});

const snapshot = {
  generatedAt: new Date().toISOString(),
  account: login,
  accounts: accountSummaries,
  // Primary account identity (the hero/topbar/page meta).
  user: {
    ...accountSummaries[0],
    twitter: profiles[0]?.twitter_username || null,
    hireable: profiles[0]?.hireable ?? null,
    publicGists: profiles[0]?.public_gists ?? null,
    // Aggregate across every featured account
    publicRepos: repos.length,
    followers: accountSummaries.reduce((a, s) => a + (s.followers || 0), 0),
    following: accountSummaries.reduce((a, s) => a + (s.following || 0), 0),
  },
  totalStars: repos.reduce((a, r) => a + r.stars, 0),
  totalForks: repos.reduce((a, r) => a + r.forks, 0),
  totalOpenIssues: repos.reduce((a, r) => a + r.openIssues, 0),
  repos,
  events,
  extras,
  profile,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
console.log(`Wrote ${OUT}`);
console.log(
  `Repos: ${repos.length} · Stars: ${snapshot.totalStars} · Forks: ${snapshot.totalForks} · Events: ${events.length} · Deep: ${extras.length} · README: ${profile ? "yes" : "no"}`
);
