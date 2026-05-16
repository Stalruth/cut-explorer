import { build, files, version } from '$service-worker';

import { offlineFallback, warmStrategyCache } from 'workbox-recipes';
import { registerRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, NetworkOnly } from 'workbox-strategies';

const API_SERVER = 'https://api.cut-explorer.stalruth.dev';

const pageMatch = ({request}) => request.destination === 'document';
registerRoute(pageMatch, new NetworkOnly());
offlineFallback(); // uses cache 'workbox-offline-fallbacks'

const dataMatch = ({url}) => url.origin === API_SERVER;
const dataStrategy = new NetworkFirst({
  cacheName: 'data-2026-05',
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
      if (!['workbox-offline-fallbacks', `app-${version}`, 'data-2026-05'].includes(key)) await caches.delete(key);
    }
  }

  e.waitUntil(pruneCaches());
});

