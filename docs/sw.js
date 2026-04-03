self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === '/share' && event.request.method === 'POST') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const file = formData.get('image');

      if (file) {
        const cache = await caches.open('share-target');
        await cache.put('/shared-image', new Response(file, {
          headers: { 'Content-Type': file.type }
        }));
      }

      return Response.redirect('/?shared=1', 303);
    })());
    return;
  }

  // Für Navigation-Requests: Network-first, dann Offline-Fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match('/') || new Response('Offline', { status: 503 }))
    );
    return;
  }
});
