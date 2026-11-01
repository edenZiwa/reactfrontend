
import {
  precacheAndRoute,
  cleanupOutdatedCaches,
  createHandlerBoundToURL
} from "workbox-precaching";

import {
  registerRoute,
  NavigationRoute
} from "workbox-routing";

import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate
} from "workbox-strategies";

import { ExpirationPlugin } from "workbox-expiration";

// Precache the actual Vite build assets
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Offline navigation fallback
const navigationHandler =
  createHandlerBoundToURL("/index.html");

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [
      /^\/api\//,
      /^\/auth(?:\/|$)/,
      /^\/admin(?:\/|$)/,
      /^\/account(?:\/|$)/,
      /^\/donation-result(?:\/|$)/
    ]
  })
);

// Public static images
registerRoute(
  ({ request, url }) =>
    request.destination === "image" &&
    url.origin === self.location.origin &&
    url.pathname.startsWith("/images/"),

  new CacheFirst({
    cacheName: "gom-public-images-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

// Public CSS and JavaScript not already precached
registerRoute(
  ({ request }) =>
    ["style", "script", "font"].includes(
      request.destination
    ),

  new StaleWhileRevalidate({
    cacheName: "gom-public-assets-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 7 * 24 * 60 * 60
      })
    ]
  })
);

// Public pages that require fresh information
// should use network-first caching only where appropriate.
registerRoute(
  ({ request, url }) =>
    request.destination === "document" &&
    url.origin === self.location.origin,

  new NetworkFirst({
    cacheName: "gom-public-documents-v1",
    networkTimeoutSeconds: 3,
    plugins: [
      new ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 24 * 60 * 60
      })
    ]
  })
);

// Receive a push notification
self.addEventListener("push", (event) => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: "Garden of Mercy Foundation",
      body: "You have a new announcement."
    };
  }

  const title =
    data.title || "Garden of Mercy Foundation";

  const options = {
    body: data.body || "You have a new update.",
    icon: "/icons/icon-192.png",
    badge: "/icons/icon-192.png",

    tag: data.tag || "gom-announcement",

    data: {
      url: data.url || "/"
    },

    vibrate: [100, 50, 100]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification clicks
self.addEventListener(
  "notificationclick",
  (event) => {
    event.notification.close();

    const target = new URL(
      event.notification.data?.url || "/",
      self.location.origin
    );

    // Never allow notifications to navigate to external URLs
    if (target.origin !== self.location.origin) return;

    event.waitUntil(
      (async () => {
        const windows = await self.clients.matchAll({
          type: "window",
          includeUncontrolled: true
        });

        for (const client of windows) {
          if ("focus" in client) {
            await client.focus();

            if ("navigate" in client) {
              await client.navigate(target.href);
            }

            return;
          }
        }

        await self.clients.openWindow(target.href);
      })()
    );
  }
);

// Activate only when the user accepts an update
self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
