var cacheName = 'petstore-v1';
var cacheFiles = [
    'index.html',
    'lessons.js',
    'strawgoh.webmanifest',
    'images/applogo.png',
    'images/thelogo.png'
];

self.addEventListener('install', (e) => {
    console.log('[Service Worker] Install');
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('[Service Worker] Caching all the files');
            return cache.addAll(cacheFiles);
        })
    );
});

self.addEventListener('fetch', function (e) {
    e.respondWith(
        caches.match(e.request).then(function (r) {
            // Return cached file if it exists
            if (r) {
                console.log('[Service Worker] Returning from Cache: ' + e.request.url);
                return r;
            }

            // If the file is not in the cache, fetch it from the network
            return fetch(e.request).then(function (response) {
                // Check if a valid response was received
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Clone the response
                var responseToCache = response.clone();

                // Open the cache and add the new file
                caches.open(cacheName).then(function (cache) {
                    cache.put(e.request, responseToCache);
                });

                return response;
            });
        })
    );
});
