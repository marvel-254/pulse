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

/** Resolve the public account: env var -> js/config.js -> repo-owner fallback. */
function configuredUsername() {
  const env = (process.env.PULSE_USERNAME || "").trim().replace(/^@/, "");
  if (env) return env;
  try {
    const cfg = readFileSync(join(__dirname, "js", "config.js"), "utf8");
    const m = cfg.match(/username:\s*["']([^"']+)["']/);
    if (m && m[1] && m[1] !== "your-username") return m[1];
  } catch {}
  return "";
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

const login = configuredUsername();
if (!login) {
  console.error("No GitHub account resolved. Set PULSE_USERNAME or github.username in js/config.js.");
  process.exit(1);
}

console.log(`Pulse public snapshot → @${login}${TOKEN ? " (rate-limit token present)" : " (anonymous)"}`);

const [user, rawRepos, eventsRaw, profileReadme] = await Promise.all([
  api(`/users/${login}`),
  api(`/users/${login}/repos?per_page=100&sort=updated&type=owner`),
  api(`/users/${login}/events/public?per_page=60`),
  api(`/repos/${login}/${login}/readme`),
]);

const repos = (Array.isArray(rawRepos) ? rawRepos : [])
  .filter((r) => !r.fork && !r.private)
  .map(enrichRepo);

// Safety: never replace a good snapshot with an empty one (e.g. rate-limited run).
if (!repos.length) {
  if (existsSync(OUT)) {
    console.warn("No public repositories returned — keeping the existing data/snapshot.json.");
    process.exit(0);
  }
  console.error("No public repositories returned and no snapshot exists yet.");
  process.exit(1);
}

const events = (Array.isArray(eventsRaw) ? eventsRaw : [])
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
  .filter((e) => e.repo.split("/")[0] === login)
  .slice(0, 40);

// Deep enrichment (releases + workflow runs) for the most recently active repos.
const DEEP = TOKEN ? 12 : 8;
const deepRepos = repos.slice(0, DEEP);
const extras = [];
for (const repo of deepRepos) {
  const full = repo.fullName;
  const [releasesRaw, runsRaw, workflowsRaw] = await Promise.all([
    api(`/repos/${full}/releases?per_page=5`),
    api(`/repos/${full}/actions/runs?per_page=10`),
    TOKEN ? api(`/repos/${full}/actions/workflows?per_page=20`) : Promise.resolve(null),
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
}

const profile = profileReadme?.content
  ? {
      owner: login,
      name: profileReadme.name,
      raw: Buffer.from(profileReadme.content, "base64").toString("utf8"),
      url: `https://github.com/${login}/${login}`,
      rawUrl: `https://raw.githubusercontent.com/${login}/${login}/HEAD/README.md`,
      fetchedAt: new Date().toISOString(),
    }
  : null;

const snapshot = {
  generatedAt: new Date().toISOString(),
  account: login,
  user: {
    login,
    name: user?.name || null,
    avatar: user?.avatar_url || `https://github.com/${login}.png`,
    bio: user?.bio || null,
    company: user?.company || null,
    blog: user?.blog || null,
    location: user?.location || null,
    twitter: user?.twitter_username || null,
    hireable: user?.hireable ?? null,
    publicRepos: user?.public_repos ?? repos.length,
    publicGists: user?.public_gists ?? null,
    followers: user?.followers ?? null,
    following: user?.following ?? null,
    htmlUrl: user?.html_url || `https://github.com/${login}`,
    createdAt: user?.created_at || null,
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
