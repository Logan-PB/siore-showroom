/* Ingredient summaries adapted from SIORE pharmacy education, slides 16–17.
 * Hyaluronic acid: https://cosmileeurope.eu/inci/detail/6550/hyaluronic-acid/
 * Describe ingredient properties separately from finished-product clinical effects.
 */
(() => {
  const ingredients = [
    {name:'NMN',en:'NICOTINAMIDE MONONUCLEOTIDE',role:'시오레의 시그니처 원료',text:'세포 에너지 대사에 관여하는 NAD+의 전구체. 시오레가 성분 설계의 중심에 둔 원료입니다.',color:'#e2b191'},
    {name:'PDRN',en:'POLYDEOXYRIBONUCLEOTIDE',role:'보습 · 피부 컨디셔닝',text:'연어 유래 DNA를 정제한 핵산 성분. 스킨케어에서 보습과 피부를 부드럽게 관리하는 목적으로 배합합니다.',color:'#d4b3c3'},
    {name:'피크노제놀',en:'PYCNOGENOL',role:'항산화 · 광채 케어',text:'프랑스 해안송 껍질에서 얻은 폴리페놀 복합체. 항산화 특성을 바탕으로 광채·탄력 케어에 활용합니다.',color:'#bfc9a2'},
    {name:'감나무잎수',en:'DIOSPYROS KAKI LEAF WATER',role:'피부결 정돈 · 수렴',text:'탄닌과 플라보노이드를 함유한 식물 유래 원료. 수렴 특성을 활용해 피부결·피지 관리에 배합합니다.',color:'#a6cbb3'},
    {name:'히알루론산',en:'HYALURONIC ACID',role:'수분 보유 · 보습',text:'물을 끌어당기고 붙잡는 보습 성분. 피부의 수분을 유지해 촉촉하고 부드럽게 가꿔줍니다.',color:'#a7cad9'},
    {name:'콜라겐',en:'FISH COLLAGEN PEPTIDE',role:'저분자 콜라겐 보충',text:'이너뷰티에 사용하는 저분자 피쉬콜라겐펩타이드. 마시는 PDRN에 1포당 1,000mg을 담았습니다.',color:'#d9c5a2'},
    {name:'알파리포산',en:'ALPHA LIPOIC ACID · 티옥틱산',role:'항산화 케어',text:'수용성·지용성 양쪽에 친화성을 가진 항산화 성분. 산화로 인한 변화를 줄이는 목적으로 배합합니다.',color:'#e2b191'},
    {name:'글루타치온',en:'GLUTATHIONE',role:'항산화 · 맑은 톤 케어',text:'세 가지 아미노산으로 이루어진 성분. 항산화 특성을 바탕으로 맑은 피부 톤 관리에 활용합니다.',color:'#d4b3c3'},
    {name:'카르노신',en:'CARNOSINE',role:'항산화 · 항당화 연구',text:'두 가지 아미노산으로 이루어진 성분. 당이 단백질에 달라붙는 당화 반응을 억제하는 특성이 연구됩니다.',color:'#d9c5a2'},
    {name:'병풀추출물',en:'CENTELLA ASIATICA',role:'진정 · 보습',text:'마데카소사이드 등 지표성분을 함유한 식물 추출물. 예민해진 피부의 진정과 보습 관리에 활용합니다.',color:'#a6cbb3'},
    {name:'판테놀',en:'PANTHENOL · PROVITAMIN B5',role:'보습 · 피부 유연화',text:'프로비타민 B5 성분. 수분을 붙잡아 건조한 피부를 촉촉하고 부드럽게 관리하는 데 사용합니다.',color:'#a7cad9'},
    {name:'펩타이드',en:'PEPTIDES',role:'피부 컨디셔닝',text:'아미노산이 짧게 이어진 사슬 형태의 성분. 피부를 좋은 상태로 유지하는 데 사용하며 종류마다 특성이 다릅니다.',color:'#bfc9a2'}
  ];

  const entries = Array.from(document.querySelectorAll('.ingredient-unified > div, .ingredient-secondary > div'));
  if (!entries.length || document.getElementById('ingredient-dialog')) return;
  const icons = new Map(entries.map(el => [el.querySelector('b')?.textContent.trim(), el.querySelector('svg')?.outerHTML || '']));
  const dialog = document.createElement('dialog');
  dialog.id = 'ingredient-dialog';
  dialog.setAttribute('aria-labelledby', 'ingredient-guide-title');
  dialog.setAttribute('aria-describedby', 'ingredient-guide-summary');
  dialog.innerHTML = `
    <div class="ingredient-guide-head">
      <div><span>SIORÉ INGREDIENT GUIDE</span><h2 id="ingredient-guide-title">성분을 알면, <em>상담이 명확해집니다.</em></h2></div>
      <button type="button" class="ingredient-guide-close" autofocus aria-label="성분 안내 닫기">닫기 ×</button>
    </div>
    <p id="ingredient-guide-summary">시오레의 주요 원료 12가지 · 성분별 역할을 한눈에</p>
    <div class="ingredient-guide-grid">${ingredients.map((item,i) => `
      <article class="ingredient-guide-card" data-ingredient="${item.name}" style="--ingredient-color:${item.color}">
        <div class="ingredient-card-title"><span class="ingredient-card-icon" aria-hidden="true">${icons.get(item.name) || ''}</span><h3>${item.name}</h3><span class="ingredient-card-number">${String(i+1).padStart(2,'0')}</span></div>
        <small class="ingredient-card-en">${item.en}</small>
        <strong class="ingredient-card-role">${item.role}</strong>
        <p>${item.text}</p>
      </article>`).join('')}</div>
    <div class="ingredient-guide-foot"><p>원료의 일반적 특성에 대한 설명입니다. 배합·함량과 완제품 시험 결과는 제품별로 다릅니다.</p><span>시오레 교육자료 기반 · <a href="https://cosmileeurope.eu/inci/detail/6550/hyaluronic-acid/" target="_blank" rel="noopener">히알루론산 참고: COSMILE Europe ↗</a></span></div>`;
  document.body.append(dialog);
  const cards = Array.from(dialog.querySelectorAll('.ingredient-guide-card'));
  function openIngredient(name) {
    if (typeof stopAuto === 'function') stopAuto();
    cards.forEach(card => card.classList.toggle('is-selected', card.dataset.ingredient === name));
    dialog.showModal();
    dialog.scrollTop = 0;
    const selected = cards.find(card => card.dataset.ingredient === name);
    // Keep the chosen ingredient visible on narrow or short screens.
    if (selected && selected.getBoundingClientRect().bottom > dialog.getBoundingClientRect().bottom - 30) {
      selected.scrollIntoView({block:'center',behavior:'instant'});
    }
  }
  entries.forEach(el => {
    const name = el.querySelector('b')?.textContent.trim();
    if (!ingredients.some(item => item.name === name)) return;
    const button = document.createElement('button');
    for (const attr of el.attributes) button.setAttribute(attr.name, attr.value);
    button.type = 'button';
    button.classList.add('ingredient-trigger');
    button.setAttribute('aria-label', `${name} 성분 안내`);
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.innerHTML = el.innerHTML;
    button.addEventListener('click', () => openIngredient(name));
    el.replaceWith(button);
  });
  dialog.querySelector('.ingredient-guide-close').addEventListener('click', () => dialog.close());
  // Keep presentation navigation still while this dialog is open.
  document.addEventListener('keydown', event => {
    if (dialog.open && event.key.startsWith('Arrow')) event.stopImmediatePropagation();
  }, true);
})();
