
const CACHE_VERSION = "gom-pwa-v1";

const APP_CACHE = `${CACHE_VERSION}-app`;
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = "/offline.html";

const APP_SHELL = [
  "/",
  "/index.html",
  OFFLINE_URL
];

// Install service worker and cache application shell
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);

      await cache.addAll(APP_SHELL);

      await self.skipWaiting();
    })()
  );
});

// Remove outdated caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const cacheNames = await caches.keys();

      await Promise.all(
        cacheNames
          .filter((name) => {
            return (
              name.startsWith("gom-pwa-") &&
              ![
                APP_CACHE,
                STATIC_CACHE
              ].includes(name)
            );
          })
          .map((name) => caches.delete(name))
      );

      await self.clients.claim();
    })()
  );
});

// Handle network requests
self.addEventListener("fetch", (event) => {
  const request = event.request;

  // Only handle GET requests
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never cache external requests
  if (url.origin !== self.location.origin) return;

  // Never cache authentication, API or account requests
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/auth/") ||
    url.pathname.startsWith("/account") ||
    url.pathname.startsWith("/admin")
  ) {
    return;
  }

  // Handle website navigation
  if (request.mode === "navigate") {
    event.respondWith(
      (async () => {
        try {
          const response = await fetch(request);

          if (response.ok) {
            const cache = await caches.open(APP_CACHE);

            await cache.put("/index.html", response.clone());
          }

          return response;
        } catch (error) {
          return (
            await caches.match("/index.html")
          ) || (
            await caches.match(OFFLINE_URL)
          );
        }
      })()
    );

    return;
  }

  // Cache-first strategy for static assets
  if (
    /\.(?:css|js|png|jpg|jpeg|webp|svg|ico|woff2|woff|ttf)$/i
      .test(url.pathname)
  ) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const response = await fetch(request);

          if (response.ok && response.type === "basic") {
            const cache = await caches.open(STATIC_CACHE);

            await cache.put(request, response.clone());
          }

          return response;
        } catch (error) {
          return new Response("", {
            status: 503,
            statusText: "Offline"
          });
        }
      })()
    );
  }
});
