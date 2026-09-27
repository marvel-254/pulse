/**
 * Pulse — runtime configuration
 * Fill in the OAuth details here once your GitHub OAuth App + Worker are ready.
 * The client_id is PUBLIC (safe in the frontend). The client_secret ONLY lives
 * server-side in the Worker env (never here).
 */
window.PULSE_CONFIG = {
  oauth: {
    enabled: false, // set true once clientId + workerUrl are configured
    clientId: "", // GitHub OAuth App Client ID
    scope: "repo,read:user,user:email",
    workerUrl: "", // e.g. https://pulse-oauth.<your-subdomain>.workers.dev
    authorizeUrl: "https://github.com/login/oauth/authorize",
    tokenKey: "pulse-gh-token", // reuse existing token key so live API/private repos work
  },
};
