/**
 * Pulse — runtime configuration (public / read-only)
 *
 * Pulse is a public showroom for ONE GitHub account. There is no login,
 * no OAuth, no personal access token and nothing secret in this file —
 * everything here ships to the browser and is meant to be public.
 *
 * `username` is the GitHub account whose work the site displays.
 */
window.PULSE_CONFIG = {
  github: {
    // The account shown on the site. Change this one value to re-point Pulse.
    username: "marvel-254",
  },

  display: {
    // Shown under the name in the hero when the GitHub bio is empty.
    tagline: "Builder of AI-native tools, web apps and developer utilities.",
    // Links rendered in the hero and the About page.
    links: [
      { label: "Portfolio", url: "https://admin.omixsystems.store" },
      { label: "Blog", url: "https://blog.omixsystems.store" },
    ],
    email: "",
  },

  // Live public GitHub API reads. No credential is ever sent.
  live: {
    enabled: true,
    // How often (ms) background workflow/CI refresh may hit the public API.
    // Public (unauthenticated) GitHub allows 60 requests/hour per visitor IP,
    // so this stays deliberately slow.
    ciRefreshMs: 600000,
  },
};
