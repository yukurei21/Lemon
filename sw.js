/* Lemon のオフライン用。ネットにつながるときは最新を取りに行き、つながらないときは保存しておいた版を使う。 */
const CACHE = "lemon-v2.0";
const FILES = ["./", "index.html", "fsrs.js", "words-eiken2.js", "manifest.webmanifest",
               "icon-192.png", "icon-512.png", "icon-maskable-512.png"];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys()
    .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
      return res;
    }).catch(() => caches.match(req, {ignoreSearch: true})
      .then(hit => hit || (req.mode === "navigate" ? caches.match("index.html") : undefined))
      .then(hit => hit || new Response("offline", {status: 503})))
  );
});
