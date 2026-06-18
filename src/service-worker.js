import { PUBLIC_API_URL } from '$env/static/public';
import { build, files, version } from '$service-worker';

import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies';

const pageMatch = ({request}) => request.destination === 'document';
registerRoute(pageMatch, new NetworkOnly());
offlineFallback(); // uses cache 'workbox-offline-fallbacks'

const dataMatch = ({url}) => url.origin === PUBLIC_API_URL;
const dataCache = 'data-2026-06-04';
const dataStrategy = new NetworkFirst({
  cacheName: dataCache,
  networkTimeoutSeconds: 2
});
registerRoute(dataMatch, dataStrategy);

const appMatch = ({url, request}) => url.origin === location.origin && request.destination !== 'document';
const appStrategy = new CacheFirst({
  cacheName: `app-${version}`
});
warmStrategyCache({'urls': [...build, ...files], 'strategy': appStrategy});
registerRoute(appMatch, appStrategy);

self.addEventListener('activate', e => {
  // prune old caches
  async function pruneCaches() {
    for (const key of await caches.keys()) {
      if (!['workbox-offline-fallbacks', `app-${version}`, dataCache].includes(key)) await caches.delete(key);
    }
  }

  e.waitUntil(pruneCaches());
});

