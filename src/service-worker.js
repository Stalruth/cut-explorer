import { build, files, version } from '$service-worker';
import { pageCache, imageCache, staticResourceCache } from 'workbox-recipes';

pageCache({warmCache: ['/']});

const warmCache = [...build, ...files].filter(el => el.endsWith('css') || el.endsWith('js') || (el.endsWith('json') && (!el.includes('202') || el.includes('2025'))));
const matchCallback = ({ request }) => ['style', 'script', 'worker'].includes(request.destination) || !request.destination;
staticResourceCache({
  warmCache,
  matchCallback
});

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

