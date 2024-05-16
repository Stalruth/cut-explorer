import { build, files, version } from '$service-worker';

const CACHE = `cache-${version}`;

const ASSETS = [
  '/',
  '/2023/',
  '/2024/',
  ...(files.filter(path => !path.startsWith('/_')))
];

self.addEventListener('install', e => {
  async function cacheAll() {
    const cache = await caches.open(CACHE);
    try {
      await cache.addAll(ASSETS);
    } catch (err) {
      console.error('sw: cache.addAll');
      for (let file of ASSETS) {
        try {
          await cache.add(file);
        } catch (err2) {
          console.warn(`sw: cache.add(${file})`);
        }
      }
    }
  }

  e.waitUntil(cacheAll());
});

self.addEventListener('activate', e => {
  async function pruneCaches() {
    for (const key of await caches.keys()) {
      if (key !== CACHE) await caches.delete(key);
    }
  }

  e.waitUntil(pruneCaches());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;

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
        cache.put(e.request, response.clone());
      }

      return response;
    } catch (err) {
      const response = await cache.match(e.request);

      if (response) {
        return response;
      }

      throw err;
    }
  }

  e.respondWith(respond());
});

