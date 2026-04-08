self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname === '/share' && event.request.method === 'POST') {
    event.respondWith((async () => {
      const formData = await event.request.formData();
      const file = formData.get('image');
      const sharedTitle = formData.get('title') || '';
      const sharedText = formData.get('text') || '';
      const sharedUrl = formData.get('url') || '';

      const cache = await caches.open('share-target');

      if (file && file.size > 0) {
        await cache.put('/shared-image', new Response(file, {
          headers: { 'Content-Type': file.type }
        }));
      }

      // Android puts shared URLs into either the `url` or `text` field depending
      // on the source app. Pull the first http(s) URL out of any of them.
      const combined = [sharedUrl, sharedText, sharedTitle].filter(Boolean).join(' ');
      const urlMatch = combined.match(/https?:\/\/\S+/i);
      if (urlMatch) {
        await cache.put('/shared-url', new Response(urlMatch[0], {
          headers: { 'Content-Type': 'text/plain' }
        }));
      }

      return Response.redirect('/?shared=1', 303);
    })());
    return;
  }

  // API-Calls nicht intercepten
  if (url.pathname.startsWith('/api')) return;

  // Für Navigation-Requests: immer ans Netzwerk
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request));
    return;
  }
});
