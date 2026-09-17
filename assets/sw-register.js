if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js').catch(() => {
      /* 서비스워커 등록 실패 시에도 페이지는 평소처럼(온라인 상태에서) 계속 동작합니다. */
    });
  });
}
