self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('gestionpyme-v1').then((cache) => cache.addAll(['/dashboard', '/manifest.json']))
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => cachedResponse || fetch(event.request))
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'TEST_NOTIFICATION') {
    self.registration.showNotification('GestiónPYME', {
      body: event.data?.message ?? 'Notificación de prueba',
      icon: '/icon-192.png'
    });
  }
});
