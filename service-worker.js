
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('sky-stone-v342').then(cache =>
      cache.addAll(['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'])
    )
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
