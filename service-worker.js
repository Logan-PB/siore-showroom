/* Prefer current sales materials online; retain cached responses for offline use. */
const CACHE_NAME = 'siore-showroom-live-v19-20261001';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const old = keys.filter(k => k.startsWith('siore-showroom-') && k !== CACHE_NAME);
    await Promise.all(old.map(k => caches.delete(k)));
    await self.clients.claim();
    // Existing clients may still have the former cache-first registration script.
    if (old.length) {
      const windows = await self.clients.matchAll({type:'window'});
      await Promise.all(windows.filter(c => c.url.startsWith(self.registration.scope)).map(c => c.navigate(c.url).catch(() => {})));
    }
  })());
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    try {
      const response = await fetch(event.request, {cache:'no-cache'});
      if (response.ok) await cache.put(event.request, response.clone());
      return response;
    } catch (_) {
      return await cache.match(event.request) || new Response('인터넷 연결 후 자료를 한 번 열어주세요.', {status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});
