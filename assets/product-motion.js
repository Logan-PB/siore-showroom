/* Open the original packaging, dispense, then reset for the next visible-page loop. */
(() => {
  const gallery = document.getElementById('featured-skus');
  if (!gallery) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const configs = [
    { id: 0, kind: 'milk', label: '보호캡을 벗기고 펌프에서 밀크가 나오는 모습', split: 174, nozzle: [258, 142] },
    { id: 1, kind: 'foam', label: '보호캡을 벗기고 펌프에서 거품이 나오는 모습', split: 305, nozzle: [239, 133] },
    { id: 7, kind: 'gel', label: '아래 뚜껑을 열고 젤을 짜내는 모습' },
    { id: 9, kind: 'liquid', label: '스틱 포의 상단을 찢고 액상이 나오는 모습' }
  ];
  function pump(p, config) {
    const tag = `pump-${config.id}`, milk = config.kind === 'milk';
    const [x, y] = config.nozzle;
    const cap = milk ? { x: 247, y: 73, w: 149, h: 102 } : { x: 194, y: 74, w: 261, h: 245 };
    const actuator = milk
      ? 'M258 106 Q258 88 279 88 H359 Q382 88 382 108 V171 H263 V148 H254 V110Z'
      : 'M235 111 Q250 90 295 99 L359 109 Q389 112 391 154 V262 H408 V300 H257 V260 H275 V143 H236Z';
    return `<svg class="package-packshot pump-packshot" viewBox="0 0 654 1103" aria-hidden="true">
      <defs>
        <clipPath id="${tag}-body"><rect y="${config.split}" width="654" height="1103"/></clipPath>
        <clipPath id="${tag}-actuator"><path d="${actuator}"/></clipPath>
        <clipPath id="${tag}-cap-edge"><path fill-rule="evenodd" clip-rule="evenodd" d="M${cap.x} ${cap.y}h${cap.w}v${cap.h}h-${cap.w}Z M${cap.x + 13} ${cap.y + 12}v${cap.h - 19}h${cap.w - 26}v-${cap.h - 19}Z"/></clipPath>
        <linearGradient id="${tag}-clear"><stop stop-color="#ecf5fa" stop-opacity=".42"/><stop offset=".22" stop-color="#fff" stop-opacity=".1"/><stop offset=".8" stop-color="#fff" stop-opacity=".07"/><stop offset="1" stop-color="#b7c6cf" stop-opacity=".42"/></linearGradient>
        <linearGradient id="${tag}-white"><stop stop-color="#d9dddf"/><stop offset=".35" stop-color="#fff"/><stop offset=".7" stop-color="#fafbfb"/><stop offset="1" stop-color="#c8ced0"/></linearGradient>
        <linearGradient id="${tag}-milk" x2=".8" y2="1"><stop stop-color="#fff"/><stop offset=".55" stop-color="#fffdf6"/><stop offset="1" stop-color="#d5d8d9"/></linearGradient>
        <radialGradient id="${tag}-foam" cx=".3" cy=".25" r=".8"><stop stop-color="#fff"/><stop offset=".6" stop-color="#f9fcff"/><stop offset="1" stop-color="#b9d0d9"/></radialGradient>
      </defs>
      <image href="${p.image}" width="654" height="1103" clip-path="url(#${tag}-body)"/>
      <rect x="${milk ? 290 : 299}" y="${milk ? 150 : 243}" width="${milk ? 68 : 80}" height="${milk ? 53 : 90}" rx="8" fill="url(#${tag}-white)"/>
      <g class="pump-actuator">
        <image href="${p.image}" width="654" height="1103" clip-path="url(#${tag}-actuator)"/>
        <rect x="${x - 5}" y="${y - 3}" width="14" height="9" rx="4" fill="#d0d5d6"/><ellipse cx="${x - 2}" cy="${y + 1}" rx="4" ry="3" fill="#919d9f"/>
      </g>
      <g class="pump-protection-cap">
        <rect x="${cap.x + 2}" y="${cap.y + 4}" width="${cap.w - 4}" height="${cap.h - 5}" rx="${milk ? 8 : 23}" fill="url(#${tag}-clear)" stroke="#e7eef2" stroke-opacity=".65" stroke-width="2"/>
        <image href="${p.image}" width="654" height="1103" clip-path="url(#${tag}-cap-edge)"/>
        <path d="M${cap.x + 13} ${cap.y + 18} V${cap.y + cap.h - 11}" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="4"/>
      </g>
      <g class="dispense-effects pump-output">
        <path class="dispense-thread" d="M${x - 2} ${y + 23} C${x - 65} ${y + 20} ${x - 105} ${y + 57} ${x - 108} ${y + 130}" fill="none" stroke="url(#${tag}-milk)" stroke-width="${milk ? 17 : 23}" stroke-linecap="round" pathLength="1"/>
        ${milk ? `<path class="milk-bead" d="M148 270 C145 293 121 310 124 334 C127 358 165 365 176 344 C187 322 161 295 148 270Z" fill="url(#${tag}-milk)"/><path class="milk-glint" d="M140 318 Q133 334 143 342" fill="none" stroke="white" stroke-width="5" stroke-linecap="round"/>` : `<g class="foam-cloud" fill="url(#${tag}-foam)" stroke="#edf7fb" stroke-width="1.5"><circle cx="120" cy="247" r="37"/><circle cx="87" cy="274" r="29"/><circle cx="148" cy="274" r="41"/><circle cx="111" cy="297" r="37"/><circle cx="149" cy="309" r="23"/><circle cx="89" cy="241" r="15"/><circle cx="165" cy="241" r="16"/></g><g class="foam-satellites" fill="url(#${tag}-foam)"><circle cx="63" cy="230" r="8"/><circle cx="172" cy="202" r="10"/><circle cx="79" cy="188" r="6"/></g>`}
      </g>
    </svg>`;
  }
  function gel(p) {
    return `<svg class="package-packshot gel-packshot" viewBox="0 0 425 1198" aria-hidden="true">
      <defs>
        <clipPath id="gel-body"><rect width="425" height="1084"/></clipPath>
        <clipPath id="gel-lid"><rect y="1084" width="425" height="114"/></clipPath>
        <linearGradient id="gel-metal"><stop stop-color="#9b9f9f"/><stop offset=".32" stop-color="#fff"/><stop offset=".5" stop-color="#aeb5b6"/><stop offset=".72" stop-color="#f7ffff"/><stop offset="1" stop-color="#969e9f"/></linearGradient>
        <linearGradient id="gel-sheen"><stop stop-color="#ddfaff" stop-opacity=".68"/><stop offset=".5" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#a5d5dd" stop-opacity=".8"/></linearGradient>
      </defs>
      <g class="gel-tube-body"><image href="${p.image}" width="425" height="1198" clip-path="url(#gel-body)"/></g>
      <g class="gel-open-mouth"><ellipse cx="207" cy="1085" rx="81" ry="13" fill="url(#gel-metal)"/><ellipse cx="207" cy="1087" rx="15" ry="7" fill="#737f82"/><ellipse cx="207" cy="1089" rx="9" ry="4" fill="#344448"/></g>
      <g class="gel-flip-lid"><image href="${p.image}" width="425" height="1198" clip-path="url(#gel-lid)"/><ellipse class="gel-lid-inside" cx="206" cy="1090" rx="79" ry="12" fill="url(#gel-metal)"/></g>
      <g class="dispense-effects gel-output"><path class="gel-ribbon" d="M207 1092 C206 1122 186 1128 188 1145 C190 1167 230 1154 226 1173" fill="none" stroke="url(#gel-sheen)" stroke-width="19" stroke-linecap="round" pathLength="1"/><path class="gel-highlight" d="M205 1096 C204 1122 187 1130 191 1145" fill="none" stroke="white" stroke-opacity=".9" stroke-width="3" stroke-linecap="round" pathLength="1"/><ellipse class="gel-pearl" cx="226" cy="1181" rx="15" ry="11" fill="url(#gel-sheen)"/></g>
    </svg>`;
  }
  function pouch(p) {
    const tear = '1715 880 L1790 872 L1845 890 L1905 875 L1970 886 L2030 871 L2095 890 L2160 874 L2225 886 L2290 870 L2355 886 L2445 876';
    return `<svg class="pouch-packshot" viewBox="0 0 4160 5200" aria-hidden="true">
      <defs>
        <clipPath id="pouch-body"><path d="M${tear} L2445 5200 H1715Z"/></clipPath>
        <clipPath id="pouch-tear"><path d="M1715 0 H2445 V876 L2355 886 L2290 870 L2225 886 L2160 874 L2095 890 L2030 871 L1970 886 L1905 875 L1845 890 L1790 872 L1715 880Z"/></clipPath>
        <linearGradient id="pouch-foil"><stop stop-color="#9f9f9d"/><stop offset=".35" stop-color="#fff"/><stop offset=".55" stop-color="#c5c9ca"/><stop offset="1" stop-color="#f5f9fa"/></linearGradient>
        <radialGradient id="pouch-liquid" cx=".3" cy=".25" r=".8"><stop stop-color="#ffefb0"/><stop offset=".3" stop-color="#ecbc65"/><stop offset=".75" stop-color="#c38138"/><stop offset="1" stop-color="#94532c"/></radialGradient>
      </defs>
      <g class="pouch-tilt"><g class="pouch-squeeze">
        <image href="${p.stick}" width="4160" height="5200" clip-path="url(#pouch-body)"/>
        <g class="pouch-mouth"><path d="M1718 882 Q2080 784 2440 879 Q2080 954 1718 882" fill="url(#pouch-foil)"/><path d="M1770 881 Q2080 841 2387 881 Q2080 916 1770 881" fill="#65373f"/><path d="M1770 881 Q2080 861 2387 881" fill="none" stroke="#dfa0a6" stroke-width="8"/></g>
        <g class="pouch-torn-top"><image href="${p.stick}" width="4160" height="5200" clip-path="url(#pouch-tear)"/></g>
        <path class="pouch-tear-line" d="M${tear}" fill="none" stroke="#fff4f2" stroke-width="10" pathLength="1"/>
      </g></g>
      <g class="dispense-effects pouch-output"><path class="pouch-stream" d="M2426 922 C2670 858 2875 1030 2878 1370" stroke="url(#pouch-liquid)" stroke-width="64" fill="none" stroke-linecap="round" pathLength="1"/><path class="pouch-drop" d="M2878 1330 C2861 1408 2763 1475 2780 1560 C2799 1662 2958 1676 2992 1580 C3026 1491 2897 1404 2878 1330Z" fill="url(#pouch-liquid)"/><path class="pouch-drop-glint" d="M2837 1510 Q2816 1565 2849 1591" stroke="#fff9df" stroke-width="20" fill="none" stroke-linecap="round"/></g>
    </svg>`;
  }
  configs.forEach((config, index) => {
    const original = gallery.children[index];
    if (!original || original.dataset.motion) return;
    const product = skuProducts[config.id];
    const tile = document.createElement('article');
    tile.className = original.className;
    tile.dataset.productLine = original.dataset.productLine;
    tile.dataset.motion = config.kind;
    tile.style.setProperty('--motion-delay', `${0.35 + index * 0.65}s`);
    tile.innerHTML = original.innerHTML;
    original.replaceWith(tile);
    const visual = tile.querySelector('.sku-visual');
    visual.classList.add('texture-demo');
    visual.setAttribute('role', 'img');
    visual.setAttribute('aria-label', `${product.name}. ${config.label}`);
    if (config.kind === 'milk' || config.kind === 'foam') {
      visual.querySelector('.sku-product').remove();
      visual.insertAdjacentHTML('afterbegin', pump(product, config));
    } else if (config.kind === 'gel') {
      visual.querySelector('.sku-product').remove();
      visual.insertAdjacentHTML('afterbegin', gel(product));
    } else {
      visual.querySelector('.pdrn-stick').remove();
      visual.querySelector('.liquid-drop').remove();
      visual.insertAdjacentHTML('beforeend', pouch(product));
    }
    const more = document.createElement('button');
    more.type = 'button';
    more.className = 'sku-more texture-spec';
    more.textContent = '제품 스펙 보기 ↗';
    more.setAttribute('aria-label', `${product.name} 상세 보기`);
    tile.querySelector('.sku-more').replaceWith(more);
    if (config.kind === 'liquid') {
      const note = document.createElement('span');
      note.className = 'texture-ingredient-note';
      note.textContent = 'PDRN + 콜라겐 + NMN + 병풀 · 한 포에';
      more.before(note);
    }
    more.addEventListener('click', () => openSku(config.id, true));
  });
  const section = gallery.closest('.screen');
  function visibility() {
    const playing = section.classList.contains('active') && !document.hidden &&
      !document.body.classList.contains('paused') && !document.querySelector('dialog[open]') && !reduced.matches;
    gallery.querySelectorAll('[data-motion]').forEach(tile => tile.classList.toggle('is-dispensing', playing));
  }
  new MutationObserver(visibility).observe(section, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(visibility).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.querySelectorAll('dialog').forEach(dialog => new MutationObserver(visibility).observe(dialog, { attributes: true, attributeFilter: ['open'] }));
  document.addEventListener('visibilitychange', visibility);
  reduced.addEventListener('change', visibility);
  visibility();
})();
