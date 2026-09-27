#!/usr/bin/env node
/**
 * Pulse — data snapshot generator
 * Pulls real GitHub data via the `gh` CLI and writes a static snapshot
 * that the static frontend can use as a fallback / initial payload.
 * The frontend also does a live fetch from the public GitHub REST API.
 */

import { execFileSync } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "data", "snapshot.json");

function gh(args, opts = {}) {
  try {
    const out = execFileSync(
      "gh", ["api", ...args, "--jq", "."],
      { encoding: "utf8", ...opts, maxBuffer: 64 * 1024 * 1024 }
    );
    return JSON.parse(out);
  } catch (e) {
    return null;
  }
}

// current authenticated user
const user = gh(["/user"]);
const login = user?.login || "";

// public repos
const repos = (gh(["/user/repos?per_page=100&sort=updated"]) || []).filter(
  (r) => !r.fork
);

// limit deep enrichment to the most recently updated repos to keep runtime sane
const DEEP = 12;
const deepRepos = repos.slice(0, DEEP);

const EVENT_TYPES = {
  PushEvent: ["pushed to", (p) => p.commits?.length || 0],
  PullRequestEvent: ["opened a pull request in", () => ""],
  IssuesEvent: ["opened an issue in", () => ""],
  IssueCommentEvent: ["commented on an issue in", () => ""],
  CreateEvent: ["created branch/tag in", () => ""],
  WatchEvent: ["starred", () => ""],
  ForkEvent: ["forked", () => ""],
  ReleaseEvent: ["published a release in", () => ""],
  PullRequestReviewEvent: ["reviewed a PR in", () => ""],
};

function enrichRepo(r) {
  const base = {
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
  };

  return base;
}

// per-repo real extras (releases, workflow runs) for the deep set
const extras = deepRepos
  .map((r) => {
    const full = r.full_name;
    const releases = (gh([`/repos/${full}/releases?per_page=5`]) || []).map(
      (rel) => ({
        tag: rel.tag_name,
        name: rel.name,
        publishedAt: rel.published_at,
        prerelease: rel.prerelease,
        draft: rel.draft,
        htmlUrl: rel.html_url,
      })
    );

    const runsData = gh([`/repos/${full}/actions/runs?per_page=10`]);
    const rawRuns = Array.isArray(runsData) ? runsData : runsData?.workflow_runs || [];
    const runs = rawRuns.map(
      (run) => ({
        name: run.name,
        headBranch: run.head_branch,
        status: run.status,
        conclusion: run.conclusion,
        createdAt: run.created_at,
        updatedAt: run.updated_at,
        htmlUrl: run.html_url,
      })
    );

    return { fullName: full, releases, runs };
  })
  .filter(Boolean);

// recent user events (cross-repo activity)
const events = (gh(["/users/" + login + "/events/public?per_page=40"]) || [])
  .map((ev) => {
    const t = EVENT_TYPES[ev.type];
    if (!t || !ev.repo) return null;
    const [verb, extra] = t;
    return {
      type: ev.type,
      action: verb,
      repo: ev.repo.name,
      createdAt: ev.created_at,
      extra: typeof extra === "function" ? extra(ev.payload || {}) : "",
      htmlUrl:
        ev.type === "PushEvent"
          ? `https://github.com/${ev.repo.name}/commits`
          : ev.repo.url || `https://github.com/${ev.repo.name}`,
    };
  })
  .filter(Boolean)
  .slice(0, 40);

const now = new Date().toISOString();

const snapshot = {
  generatedAt: now,
  user: {
    login,
    name: user?.name,
    avatar: user?.avatar_url,
    publicRepos: user?.public_repos,
    followers: user?.followers,
    following: user?.following,
  },
  totalStars: repos.reduce((a, r) => a + r.stargazers_count, 0),
  totalForks: repos.reduce((a, r) => a + r.forks_count, 0),
  totalOpenIssues: repos.reduce((a, r) => a + r.open_issues_count, 0),
  repos: repos.map(enrichRepo),
  events,
  extras,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
console.log(`Wrote snapshot to ${OUT}`);
console.log(
  `Repos: ${repos.length} · Stars: ${snapshot.totalStars} · Forks: ${snapshot.totalForks} · Events: ${events.length} · Deep-repos: ${extras.length}`
);
