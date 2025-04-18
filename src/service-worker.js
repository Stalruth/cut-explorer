import { build, files, version } from '$service-worker';
import { pageCache, staticResourceCache } from 'workbox-recipes';
import { StaleWhileRevalidate } from 'workbox-strategies/StaleWhileRevalidate.js';
import { CacheableResponsePlugin } from 'workbox-cacheable-response/CacheableResponsePlugin.js';

const API_SERVER = 'https://api.cut-explorer.stalruth.dev';

staticResourceCache({
  cacheName: 'api-cache',
  matchCallback: ({request}) => request.url.startsWith(API_SERVER) && !request.url.endsWith('/tournaments/current-year.json'),
});

const srCachedFiles = [...build, ...files];
staticResourceCache({
  cacheName: `static-resources-${version}`,
  matchCallback: ({request}) => srCachedFiles.includes((new URL(request.url)).pathname),
  warmCache: srCachedFiles
});

const pageCachedFiles = ['/', `${API_SERVER}/tournaments/current-year.json`];
pageCache({
  cacheName: 'latest',
  matchCallback: ({request}) => pageCachedFiles.includes((new URL(request.url)).pathname) || pageCachedFiles.includes(request.url),
  warmCache: pageCachedFiles
});

self.addEventListener('install', e => {
  async function preloadCache() {
    const currentYearResponse = await fetch(`${API_SERVER}/tournaments/current-year.json`);
    const currentYear = await currentYearResponse.json();

    const season = currentYear.season;
    const tours = currentYear
      .formats[currentYear.formats.length - 1]
      .tournaments
      .map(el => `tournaments/${season}/${el.id}.json`);

    const strategy = new StaleWhileRevalidate({
      cacheName: 'api-cache',
      plugins: [new CacheableResponsePlugin({statuses: [0, 200]})]
    });

    Promise.all([
      'equivalents.json',
      'tournaments/years.json',
      ...tours
    ].map(el => `${API_SERVER}/${el}`)
      .map(el => strategy.handleAll({event: e, request: new Request(el)})));
  }

  e.waitUntil(preloadCache());
});

self.addEventListener('activate', e => {
  // prune old caches
  async function pruneCaches() {
    for (const key of await caches.keys()) {
      if (!['latest', `static-resources-${version}`, 'api-cache'].includes(key)) await caches.delete(key);
    }
  }

  e.waitUntil(pruneCaches());
});

