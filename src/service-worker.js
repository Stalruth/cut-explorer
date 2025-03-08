import { build, files, version } from '$service-worker';
import { pageCache, imageCache, staticResourceCache } from 'workbox-recipes';

pageCache({warmCache: ['/', ...build.filter(el => el.includes('2025'))]});
staticResourceCache({warmCache: files.filter(el => el.endsWith('css') || el.endsWith('js') || (el.endsWith('json') && el.includes('2025')))});
imageCache({warmCache: files.filter(el => el.endsWith('png'))});

self.addEventListener('activate', e => {
  // prune old caches
    async function pruneCaches() {
    for (const key of await caches.keys()) {
      if (!['pages', 'static-resources', 'images'].includes(key)) await caches.delete(key);
    }
  }

  e.waitUntil(pruneCaches());
});

