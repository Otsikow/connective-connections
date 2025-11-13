const APP_VERSION = "connective-pwa-v20250204";
const APP_SHELL_CACHE = `${APP_VERSION}-shell`;
const RUNTIME_CACHE = `${APP_VERSION}-runtime`;
const ASSET_CACHE = `${APP_VERSION}-assets`;
const APP_SHELL_FILES = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/favicon.ico",
  "/pwa-icon.svg",
  "/connective-logo.svg",
  "/placeholder.svg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(APP_SHELL_CACHE)
      .then((cache) => cache.addAll(APP_SHELL_FILES))
      .catch((error) => console.error("[ServiceWorker] Failed to pre-cache:", error))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => ![APP_SHELL_CACHE, RUNTIME_CACHE, ASSET_CACHE].includes(key))
            .map((key) => caches.delete(key))
        )
      )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(request.url);
  const isSameOrigin = requestUrl.origin === self.location.origin;

  if (request.mode === "navigate") {
    if (!isSameOrigin) {
      return;
    }
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (!isSameOrigin) {
    return;
  }

  if (["style", "script", "worker"].includes(request.destination)) {
    event.respondWith(staleWhileRevalidate(request, ASSET_CACHE));
    return;
  }

  if (["image", "font"].includes(request.destination)) {
    event.respondWith(cacheFirst(request, `${ASSET_CACHE}-media`));
    return;
  }

  event.respondWith(networkFirst(request, RUNTIME_CACHE));
});

async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    const shellCache = await caches.open(APP_SHELL_CACHE);
    const fallback = await shellCache.match("/index.html");
    return fallback || (await shellCache.match("/offline.html"));
  }
}

async function networkFirst(request, cacheName) {
  try {
    const response = await fetch(request);
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => undefined);

  if (cached) {
    networkPromise.catch(() => undefined);
    return cached;
  }

  const networkResponse = await networkPromise;
  if (networkResponse) {
    return networkResponse;
  }

  throw new Error("Network unavailable for resource");
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) {
    return cached;
  }
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.destination === "image") {
      const shellCache = await caches.open(APP_SHELL_CACHE);
      const placeholder = await shellCache.match("/placeholder.svg");
      if (placeholder) {
        return placeholder;
      }
    }
    throw error;
  }
}

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});
