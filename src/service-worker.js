import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [
  '/',
  '/2023/',
  '/2024/',
  ...files
];

self.addEventListener('install', e => {
  async function cacheAll() {
    const cache = await caches.open(CACHE);
    await cache.addAll(ASSETS);
  }

  e.waitUntil(cacheAll());
});

self.addEventListener('activate', e => {
  async function pruneCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  e.awaitUntil(pruneCaches());
});

self.addEventListener('fetch', e => {
  if (event.request.method !== 'GET') return;

  async function respond() {
    const url = new URL(e.request.url);
    const cache = await caches.open(CACHE);

    if (files.includes(url.pathname)) {
      const response = await cache.match(url.pathname);

      if (response) {
        return response;
      }
    }

    try {
      const response = await fetch(e.request);

      if(!(response instanceof Response)) {
        throw new Error('fetch failed');
      }

      if (response.status === 200) {
        cache.put(event.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(event.request);

      if (response) {
        return response;
      }

      throw err;
    }
  }

  event.respondWith(respond());
});

