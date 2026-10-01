const CACHE = "pulse-v8";
const ASSETS = [
  "./",
  "./index.html",
  "./css/styles.css",
  "./fonts/inter-latin-wght.woff2",
  "./fonts/inter-latin-ext-wght.woff2",
  "./fonts/jetbrains-mono-latin-wght.woff2",
  "./fonts/jetbrains-mono-latin-ext-wght.woff2",
  "./js/config.js",
  "./js/app.js",
  "./js/depth.js",
  "./js/game.js",
  "./js/music.js",
  "./data/snapshot.json",
  "./manifest.webmanifest",
  "./icons/icon.svg",
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  // Never cache GitHub API or cross-origin requests
  if (e.request.method !== "GET" || url.origin !== self.location.origin) return;
  e.respondWith(
    caches.match(e.request).then((cached) => {
      const fetched = fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const clone = res.clone();
            caches.open(CACHE).then((c) => c.put(e.request, clone));
          }
          return res;
        })
        .catch(() => cached);
      return cached || fetched;
    })
  );
});
