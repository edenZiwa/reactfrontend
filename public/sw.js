
const VERSION = "gom-v2";

const APP_CACHE = `${VERSION}-app`;
const STATIC_CACHE = `${VERSION}-static`;

const OFFLINE_URL = "/offline.html";

const APP_SHELL = [
  "/",
  "/index.html",
  OFFLINE_URL
];

const PRIVATE_PATHS = [
  "/api/",
  "/auth/",
  "/admin",
  "/account"
];

function isPrivatePath(pathname) {
  return PRIVATE_PATHS.some((path) =>
    pathname.startsWith(path)
  );
}

function isStaticAsset(pathname) {
  return /\.(css|js|mjs|png|jpg|jpeg|webp|svg|ico|woff2|woff|ttf)$/i
    .test(pathname);
}

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(APP_CACHE);

      await cache.addAll(APP_SHELL);

      // Do not skipWaiting here.
      // Let the user decide when to activate an update.
    })()
  );
});

// Activate and clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) =>
            key.startsWith("gom-") &&
            key !== APP_CACHE &&
            key !== STATIC_CACHE
          )
          .map((key) => caches.delete(key))
      );

      await self.clients.claim();
    })()
  );
});

// Allow the application to activate a waiting update
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Network-first navigation with offline fallback
async function handleNavigation(request) {
  try {
    return await fetch(request);
  } catch {
    const cachedShell = await caches.match("/index.html");

    if (cachedShell) return cachedShell;

    return (
      await caches.match(OFFLINE_URL)
    ) || new Response("You are offline.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
}

// Cache-first static assets with network fallback
async function handleStaticAsset(request) {
  const cached = await caches.match(request);

  if (cached) return cached;

  try {
    const response = await fetch(request);

    if (
      response.ok &&
      response.type === "basic"
    ) {
      const cache = await caches.open(STATIC_CACHE);

      await cache.put(request, response.clone());
    }

    return response;
  } catch {
    return new Response("", {
      status: 503,
      statusText: "Offline"
    });
  }
}

// Fetch handling
self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  // Never cache private or sensitive routes
  if (isPrivatePath(url.pathname)) return;

  if (request.mode === "navigate") {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
  }
});
