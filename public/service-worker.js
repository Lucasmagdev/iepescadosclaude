self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open("ie-pescados-v2").then((cache) =>
      cache.addAll(["/", "/index.html", "/manifest.webmanifest", "/pwa-icon.svg"])
    )
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== "ie-pescados-v2").map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const copy = response.clone();
        caches.open("ie-pescados-v2").then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
