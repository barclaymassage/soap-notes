const CACHE_NAME = 'knead-clay-v6';
const ASSETS = [
    '/massageintake/',
    '/massageintake/intake.html'
];

// 1. Force immediate installation and caching of the unlock interface
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// 2. Clear out any old cached scripts immediately
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
        }).then(() => self.clients.claim())
    );
});

// 3. OFFLINE-FIRST FORCE: Grab from internal memory instantly so the unlock page opens
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request, { ignoreSearch: true }).then(cachedResponse => {
            // If the unlock page/app layout is in memory, load it instantly
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Otherwise, pull from network (only applies if you add external style/images later)
            return fetch(e.request);
        })
    );
});
