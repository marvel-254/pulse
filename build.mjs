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

// enrich each repo with deep stats (limited to keep runtime sane)
const enriched = repos.map((r) => ({
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
  totalStars: enriched.reduce((a, r) => a + r.stars, 0),
  totalForks: enriched.reduce((a, r) => a + r.forks, 0),
  totalOpenIssues: enriched.reduce((a, r) => a + r.openIssues, 0),
  repos: enriched,
};

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, JSON.stringify(snapshot, null, 2));
console.log(`Wrote snapshot to ${OUT}`);
console.log(`Repos: ${enriched.length} · Stars: ${snapshot.totalStars} · Forks: ${snapshot.totalForks}`);
