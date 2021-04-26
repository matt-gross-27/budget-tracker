const APP_PREFIX = 'BudgetTracker-';
const VERSION = 'v1.0.0'
const CACHE_NAME = APP_PREFIX + VERSION;
const DATA_CACHE_NAME = 'Transactions-' + CACHE_NAME

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png',
  '/js/index.js',
  // '/manifest.json'
]

// Install Service Worker
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );

  self.skipWaiting();
});

// Active Service Worker and Clear Old Cache
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('Removing old cache data', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});



// Intercept Network Requests
self.addEventListener('fetch', e => {
  if (e.req.url.includes('/api/')) {
    caches
      .open(DATA_CACHE_NAME)
      .then(cache => {
        return fetch(e.req)
          .then(res => {
            // if good res, clone it and store in cache
            if (res.status === 200) {
              cache.put(e.req.url, res.clone());
            }
            return res;
          })
          .catch(err => {
            // Network req failed, try to get it from cache
            return cache.match(e.req);
          });
      })
      .catch(err => console.log(err))
  }

  e.respondWith(
    fetch(e.req).catch(() => {
      return caches.match(e.req).then(res => {
        if (res) {
          return res;
        } else if (e.req.headers.get('accept').includes('text/html')) {
          // return the cached home page for all requests for html pages
          return caches.match('/');
        }
      });
    })
  );

  return;
});