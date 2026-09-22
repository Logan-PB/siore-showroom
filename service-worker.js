/* 오프라인 캐싱: 와이파이/데이터가 있을 때 한 번 열어두면, 그 다음부터는
   인터넷 연결 없이도 이 페이지가 그대로 열립니다.
   - 콘텐츠를 바꾼 뒤 태블릿에 새 버전을 반영하려면 CACHE_NAME 값을 바꿔서
     새로 배포하세요 (예: 'siore-showroom-v1' -> 'siore-showroom-v2').
   - 같은 출처(이 사이트 자체 파일)만 캐싱하며, 외부 사이트 요청은 건드리지 않습니다. */
const CACHE_NAME = 'siore-showroom-song-20260923';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  let url;
  try { url = new URL(event.request.url); } catch { return; }
  if (url.origin !== self.location.origin) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    const networkFetch = fetch(event.request)
      .then((response) => {
        if (response && response.ok) cache.put(event.request, response.clone());
        return response;
      })
      .catch(() => undefined);
    if (cached) {
      // 캐시가 있으면 즉시 응답하고, 뒤에서 최신 버전으로 갱신(다음 접속부터 반영)
      networkFetch;
      return cached;
    }
    const fresh = await networkFetch;
    if (fresh) return fresh;
    return new Response(
      '오프라인 상태이며 아직 이 화면이 저장되지 않았습니다. 인터넷이 연결된 곳에서 한 번 열어주세요.',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } }
    );
  })());
});
