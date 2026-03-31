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

      return Response.redirect('/share', 303);
    })());
  }
});
