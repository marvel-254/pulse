/**
 * Pulse — runtime configuration
 * Fill in the OAuth details here once your GitHub OAuth App + Worker are ready.
 * The client_id is PUBLIC (safe in the frontend). The client_secret ONLY lives
 * server-side in the Worker env (never here).
 */
window.PULSE_CONFIG = {
  oauth: {
    enabled: false, // flip to true once the Worker URL is set below
    clientId: "Ov23liWXKxq2qtzNEuvV", // GitHub OAuth App Client ID (public)
    scope: "repo,read:user,user:email",
    workerUrl: "", // TODO: set to your deployed Cloudflare Worker URL, e.g. https://pulse-oauth.<subdomain>.workers.dev
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenKey: "pulse-gh-token", // reuse existing token key so live API/private repos work
  },
};
