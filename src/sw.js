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

// The build identifier lets the app remember dismissal for this exact update.
const GOM_BUILD_ID = __GOM_BUILD_ID__;

// Precache the actual Vite build assets
precacheAndRoute(self.__WB_MANIFEST);

cleanupOutdatedCaches();

// Offline navigation fallback
const navigationHandler = createHandlerBoundToURL("/index.html");

registerRoute(
  new NavigationRoute(navigationHandler, {
    denylist: [
      /^\/api(?:\/|$)/,
      /^\/auth(?:\/|$)/,
      /^\/admin(?:\/|$)/,
      /^\/account(?:\/|$)/,
      /^\/donation-result(?:\/|$)/,
      /^\/login(?:\/|$)/,
      /^\/forgot-password(?:\/|$)/,
      /^\/reset-password(?:\/|$)/
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
  ({ request, url }) =>
    url.origin === self.location.origin &&
    ["style", "script", "font"].includes(request.destination),
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
registerRoute(
  ({ request, url }) =>
    request.destination === "document" &&
    url.origin === self.location.origin &&
    !/^\/(?:api|auth|admin|account|donation-result|login|forgot-password|reset-password)(?:\/|$)/.test(url.pathname),
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

// Respond to the application with this waiting worker's build identifier.
self.addEventListener("message", (event) => {
  if (event.data?.type === "GET_BUILD_ID") {
    event.ports?.[0]?.postMessage({ buildId: GOM_BUILD_ID });
    return;
  }

  // Activate only when the user explicitly accepts the update.
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

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

  const title = data.title || "Garden of Mercy Foundation";
  const options = {
    body: data.body || "You have a new update.",
    icon: "/images/garden_of_mercy_icon.png",
    badge: "/images/garden_of_mercy_icon.png",
    tag: data.tag || "gom-announcement",
    data: { url: data.url || "/" },
    vibrate: [100, 50, 100]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const target = new URL(
    event.notification.data?.url || "/",
    self.location.origin
  );

  // Never allow notifications to navigate to external URLs.
  if (target.origin !== self.location.origin) return;

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: "window",
      includeUncontrolled: true
    });

    for (const client of windows) {
      if ("focus" in client) {
        await client.focus();
        if ("navigate" in client) await client.navigate(target.href);
        return;
      }
    }

    await self.clients.openWindow(target.href);
  })());
});
