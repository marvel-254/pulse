/**
 * Pulse — runtime configuration (public / read-only)
 *
 * Pulse is a public showroom for one or more GitHub accounts. There is no
 * login, no OAuth, no personal access token and nothing secret in this file —
 * everything here ships to the browser and is meant to be public.
 *
 * `username` is the primary account; `accounts` lists every account whose
 * public work appears on the site.
 */
window.PULSE_CONFIG = {
  github: {
    // Primary account — the identity shown in the hero, topbar and page meta.
    username: "marvel-254",
    // Every account featured on the site. Public repos from all of these are
    // merged into one showcase; visitors can filter down to a single account.
    // Leave this out to show only `username`.
    accounts: ["marvel-254", "oliver4441"],
  },

  // Where the site is published. Used for canonical URLs, Open Graph cards,
  // sitemap.xml and share links. Change it if you host Pulse on your own domain.
  site: {
    url: "https://marvel-254.github.io/pulse/",
    name: "Pulse",
    description:
      "A public, read-only showcase of two GitHub accounts — projects, contribution history, releases and CI. No login.",
    image: "icons/og.png", // 1200x630 social card
    twitter: "",           // optional: "@handle" for twitter:site
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

  // Background soundtrack. Pulse ships NO audio files — the music is
  // synthesised in the browser (Web Audio), so there is nothing to license and
  // nothing to download. Never autoplays: it starts from a visitor's click.
  audio: {
    enabled: false,        // default off; visitors (and you) opt in
    mood: "cinematic",     // "cinematic" | "phonk"
    volume: 0.35,
    // Optional: play your OWN licensed track instead of the synth engine.
    // e.g. track: "audio/mytrack.mp3"  (only files you have rights to use)
    track: "",
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
