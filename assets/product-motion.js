/* Original packshots, short texture demonstrations, and separate spec actions. */
(() => {
  const gallery = document.getElementById('featured-skus');
  if (!gallery) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const configs = [
    { id: 0, kind: 'milk', label: '밀크 제형', split: 174, nozzle: [247, 143] },
    { id: 1, kind: 'foam', label: '버블 제형', split: 305, nozzle: [247, 137] },
    { id: 7, kind: 'gel', label: '수딩 젤' },
    { id: 9, kind: 'liquid', label: '액상 타입' }
  ];
  const timers = new Map();
  const autoTimers = new Set();
  function stop(tile) {
    clearTimeout(timers.get(tile));
    timers.delete(tile);
    tile.classList.remove('is-dispensing');
  }
  function play(tile) {
    if (tile.classList.contains('is-dispensing') || document.hidden || document.body.classList.contains('paused')) return;
    tile.classList.add('is-dispensing');
    timers.set(tile, setTimeout(() => stop(tile), reduced.matches ? 1200 : 3300));
  }
  function pump(p, c) {
    const tag = `pump-${c.id}`;
    const [x, y] = c.nozzle;
    return `<svg class="pump-packshot" viewBox="0 0 654 1103" aria-hidden="true">
      <defs>
        <clipPath id="${tag}-body"><rect y="${c.split}" width="654" height="1103"/></clipPath>
        <clipPath id="${tag}-head"><rect width="654" height="${c.split}"/></clipPath>
        <linearGradient id="${tag}-milk" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#fffdf6"/><stop offset="1" stop-color="#d5d8d9"/></linearGradient>
        <radialGradient id="${tag}-foam" cx=".3" cy=".25" r=".8"><stop stop-color="#fff"/><stop offset=".6" stop-color="#f9fcff"/><stop offset="1" stop-color="#b9d0d9"/></radialGradient>
      </defs>
      <image href="${p.image}" width="654" height="1103" clip-path="url(#${tag}-body)"/>
      <g class="pump-head"><image href="${p.image}" width="654" height="1103" clip-path="url(#${tag}-head)"/></g>
      <g class="dispense-effects">
        <path class="dispense-thread" d="M${x} ${y + 19} C${x - 75} ${y + 14} ${x - 105} ${y + 51} ${x - 106} ${y + 130}" fill="none" stroke="url(#${tag}-milk)" stroke-width="${c.kind === 'milk' ? 17 : 23}" stroke-linecap="round" pathLength="1"/>
        ${c.kind === 'milk' ? `<path class="milk-bead" d="M141 266 C137 289 113 305 117 330 C120 354 158 361 169 340 C180 318 154 291 141 266Z" fill="url(#${tag}-milk)"/><path class="milk-glint" d="M133 314 Q126 330 136 338" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>` : `<g class="foam-cloud" fill="url(#${tag}-foam)" stroke="#edf7fb" stroke-width="1.5"><circle cx="127" cy="245" r="37"/><circle cx="94" cy="272" r="29"/><circle cx="155" cy="272" r="41"/><circle cx="118" cy="295" r="37"/><circle cx="156" cy="307" r="23"/><circle cx="96" cy="239" r="15"/><circle cx="172" cy="239" r="16"/></g><g class="foam-satellites" fill="url(#${tag}-foam)"><circle cx="68" cy="232" r="9"/><circle cx="179" cy="202" r="12"/><circle cx="86" cy="188" r="7"/></g>`}
      </g>
    </svg>`;
  }
  configs.forEach((c, index) => {
    const original = gallery.children[index];
    if (!original || original.dataset.motion) return;
    const tile = document.createElement('article');
    tile.className = original.className;
    tile.dataset.productLine = original.dataset.productLine;
    tile.dataset.motion = c.kind;
    tile.innerHTML = original.innerHTML;
    original.replaceWith(tile);
    const previousVisual = tile.querySelector('.sku-visual');
    const visual = document.createElement('button');
    visual.type = 'button';
    visual.className = 'sku-visual texture-demo';
    visual.setAttribute('aria-label', `${skuProducts[c.id].name} ${c.label} 애니메이션 재생`);
    visual.innerHTML = previousVisual.innerHTML;
    previousVisual.replaceWith(visual);
    if (c.kind === 'milk' || c.kind === 'foam') {
      visual.querySelector('.sku-product').remove();
      visual.insertAdjacentHTML('afterbegin', pump(skuProducts[c.id], c));
    }
    if (c.kind === 'gel') {
      visual.insertAdjacentHTML('beforeend', '<svg class="gel-demo" viewBox="0 0 300 340" aria-hidden="true"><defs><linearGradient id="gel-sheen"><stop stop-color="#d9f9ff" stop-opacity=".45"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#9acee0" stop-opacity=".65"/></linearGradient></defs><path class="gel-ribbon" d="M182 239 C237 271 259 215 225 203 C196 192 199 153 250 168" fill="none" stroke="url(#gel-sheen)" stroke-width="18" stroke-linecap="round" pathLength="1"/><path class="gel-highlight" d="M183 235 C233 261 245 224 226 212" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="3" stroke-linecap="round" pathLength="1"/></svg>');
    }
    visual.insertAdjacentHTML('beforeend', `<span class="texture-hint" aria-hidden="true"><svg viewBox="0 0 16 16"><path d="m6 3 6 5-6 5Z" fill="currentColor"/></svg>${c.label} 보기</span>`);
    const oldMore = tile.querySelector('.sku-more');
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'sku-more texture-spec';
    more.textContent = '제품 스펙 보기 ↗';
    more.setAttribute('aria-label', `${skuProducts[c.id].name} 상세 보기`);
    oldMore.replaceWith(more);
    if (c.kind === 'liquid') {
      const note = document.createElement('span');
      note.className = 'texture-ingredient-note';
      note.textContent = 'PDRN + 콜라겐 + NMN + 병풀 · 한 포에';
      more.before(note);
    }
    visual.addEventListener('click', () => play(tile));
    more.addEventListener('click', () => { stop(tile); openSku(c.id, true); });
  });
  const section = gallery.closest('.screen');
  let visible = false;
  function visibility() {
    const showing = section.classList.contains('active') && !document.hidden && !document.body.classList.contains('paused') && !document.querySelector('dialog[open]');
    if (showing === visible) return;
    visible = showing;
    autoTimers.forEach(clearTimeout);
    autoTimers.clear();
    [...gallery.children].forEach(stop);
    if (showing && !reduced.matches && !document.body.classList.contains('paused')) {
      [...gallery.children].forEach((tile, i) => {
        const timer = setTimeout(() => { autoTimers.delete(timer); play(tile); }, 550 + i * 1600);
        autoTimers.add(timer);
      });
    }
  }
  new MutationObserver(visibility).observe(section, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(visibility).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.querySelectorAll('dialog').forEach(d => new MutationObserver(visibility).observe(d, { attributes: true, attributeFilter: ['open'] }));
  document.addEventListener('visibilitychange', visibility);
  reduced.addEventListener('change', () => { visible = false; visibility(); });
  visibility();
})();
