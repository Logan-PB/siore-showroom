/* Ingredient summaries adapted from SIORE pharmacy education, slides 16–17.
 * Hyaluronic acid: https://cosmileeurope.eu/inci/detail/6550/hyaluronic-acid/
 * Describe ingredient properties separately from finished-product clinical effects.
 */
(() => {
  const ingredients = [
    {name:'NMN',en:'NICOTINAMIDE MONONUCLEOTIDE',role:'시오레의 시그니처 원료',text:'세포의 에너지 대사에 필요한 NAD+를 만드는 데 쓰이는 물질입니다. 시오레 NMN 라인의 중심 원료이며, 제품마다 배합 함량이 다릅니다.',color:'#e2b191'},
    {name:'PDRN',en:'POLYDEOXYRIBONUCLEOTIDE',role:'보습 · 피부 컨디셔닝',text:'연어 유래 DNA에서 얻은 성분입니다. 바르는 제품에서는 보습을 돕고 피부를 부드럽게 가꾸는 성분으로 배합합니다.',color:'#d4b3c3'},
    {name:'피크노제놀',en:'PYCNOGENOL',role:'항산화 · 광채 케어',text:'프랑스 해안송 껍질에서 얻은 폴리페놀 복합체. 항산화 특성을 바탕으로 광채·탄력 케어에 활용합니다.',color:'#bfc9a2'},
    {name:'감나무잎수',en:'DIOSPYROS KAKI LEAF WATER',role:'피부결 정돈 · 수렴',text:'탄닌과 플라보노이드를 함유한 식물 유래 원료. 수렴 특성을 활용해 피부결·피지 관리에 배합합니다.',color:'#a6cbb3'},
    {name:'히알루론산',en:'HYALURONIC ACID',role:'수분 보유 · 보습',text:'물을 끌어당기고 붙잡는 보습 성분. 피부의 수분을 유지해 촉촉하고 부드럽게 가꿔줍니다.',color:'#a7cad9'},
    {name:'콜라겐',en:'FISH COLLAGEN PEPTIDE',role:'저분자 콜라겐 보충',text:'이너뷰티에 사용하는 저분자 피쉬콜라겐펩타이드. 마시는 PDRN에 1포당 1,000mg을 담았습니다.',color:'#d9c5a2'},
    {name:'알파리포산',en:'ALPHA LIPOIC ACID · 티옥틱산',role:'항산화 케어',text:'티옥틱산이라고도 부르는 항산화 성분입니다. 외부 환경에 노출되는 피부를 관리하기 위한 성분 조합에 사용합니다.',color:'#e2b191'},
    {name:'글루타치온',en:'GLUTATHIONE',role:'항산화 · 맑은 톤 케어',text:'세 가지 아미노산으로 이루어진 성분. 항산화 특성을 바탕으로 맑은 피부 톤 관리에 활용합니다.',color:'#d4b3c3'},
    {name:'카르노신',en:'CARNOSINE',role:'항산화 · 항당화 연구',text:'두 가지 아미노산이 연결된 성분입니다. 산화와 당화(당이 단백질에 달라붙는 반응)에 관한 연구로 알려진 피부 관리 원료입니다.',color:'#d9c5a2'},
    {name:'병풀추출물',en:'CENTELLA ASIATICA',role:'진정 · 보습',text:'마데카소사이드 등 지표성분을 함유한 식물 추출물. 예민해진 피부의 진정과 보습 관리에 활용합니다.',color:'#a6cbb3'},
    {name:'판테놀',en:'PANTHENOL · PROVITAMIN B5',role:'보습 · 피부 유연화',text:'프로비타민 B5 성분. 수분을 붙잡아 건조한 피부를 촉촉하고 부드럽게 관리하는 데 사용합니다.',color:'#a7cad9'},
    {name:'펩타이드',en:'PEPTIDES',role:'피부 컨디셔닝',text:'단백질의 구성 단위인 아미노산이 짧게 연결된 성분입니다. 피부를 부드럽고 건강한 상태로 관리하는 데 쓰며, 종류별 역할은 다릅니다.',color:'#bfc9a2'}
  ];

  ingredients.push(...[{"name": "밀싹추출물", "en": "WHEAT SPROUT EXTRACT", "role": "식물 유래 피부 컨디셔닝", "text": "어린 밀싹에서 얻은 식물 추출물입니다. 데일리 릴리프 4종에 배합된 주요 원료로, 피부를 부드럽게 관리하는 성분 구성에 포함됩니다.", "color": "#9bcbd6"}, {"name": "세라마이드", "en": "CERAMIDE", "role": "보습 · 장벽 케어", "text": "피부 각질층의 지질을 이루는 성분 중 하나입니다. 수분이 쉽게 빠져나가지 않도록 돕는 보습 관리에 활용합니다.", "color": "#e5a9bf"}, {"name": "레스베라트롤", "en": "RESVERATROL", "role": "항산화 · 피부 보호", "text": "식물에서 발견되는 폴리페놀 성분입니다. 항산화 특성을 활용해 외부 환경에 노출된 피부를 관리하는 데 배합합니다.", "color": "#e5a9bf"}, {"name": "RICE-EGF", "en": "RICE-EGF", "role": "에센스 토너의 복합 원료", "text": "제품 자료에 RICE-EGF로 소개된 원료입니다. 감나무잎수·병풀 등과 함께 에센스 토너의 피부 컨디셔닝 성분 구성에 포함됩니다.", "color": "#9bcbd6"}]);

  const groups=[{"title": "NMN 라인 주요성분", "color": "#e5a9bf", "items": [{"name": "NMN", "products": ["하이드로 캡슐 클렌징밀크", "프레쉬 버블토너", "인텐시브 세럼", "하이드레이팅 수딩크림", "딥 글로우 리치크림"]}, {"name": "알파리포산", "products": ["하이드로 캡슐 클렌징밀크", "인텐시브 세럼", "하이드레이팅 수딩크림", "딥 글로우 리치크림"]}, {"name": "PDRN", "products": ["하이드로 캡슐 클렌징밀크", "인텐시브 세럼", "딥 글로우 리치크림"]}, {"name": "글루타치온", "products": ["하이드로 캡슐 클렌징밀크", "프레쉬 버블토너", "인텐시브 세럼", "하이드레이팅 수딩크림", "딥 글로우 리치크림"]}, {"name": "카르노신", "products": ["하이드로 캡슐 클렌징밀크", "프레쉬 버블토너", "인텐시브 세럼", "딥 글로우 리치크림"]}, {"name": "피크노제놀", "products": ["하이드로 캡슐 클렌징밀크", "인텐시브 세럼", "딥 글로우 리치크림"]}, {"name": "병풀추출물", "products": ["프레쉬 버블토너", "하이드레이팅 수딩크림"]}, {"name": "세라마이드", "products": ["하이드레이팅 수딩크림"]}, {"name": "레스베라트롤", "products": ["하이드레이팅 수딩크림"]}]}, {"title": "데일리 릴리프 주요성분", "color": "#9bcbd6", "items": [{"name": "감나무잎수", "products": ["에센스 토너"]}, {"name": "병풀추출물", "products": ["에센스 토너", "리페어 앰플", "카밍 수딩젤", "컴포트 크림"]}, {"name": "펩타이드", "products": ["에센스 토너", "리페어 앰플", "카밍 수딩젤", "컴포트 크림"]}, {"name": "RICE-EGF", "products": ["에센스 토너"]}, {"name": "밀싹추출물", "products": ["에센스 토너", "리페어 앰플", "카밍 수딩젤", "컴포트 크림"]}, {"name": "판테놀", "products": ["리페어 앰플", "카밍 수딩젤", "컴포트 크림"]}, {"name": "히알루론산", "products": ["카밍 수딩젤", "컴포트 크림"]}]}, {"title": "이너뷰티 주요원료", "color": "#c9ace8", "items": [{"name": "PDRN", "products": ["마시는 PDRN 200"]}, {"name": "콜라겐", "products": ["마시는 PDRN 200"]}, {"name": "NMN", "products": ["마시는 PDRN 200"]}, {"name": "병풀추출물", "products": ["마시는 PDRN 200"]}]}];

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
    <p id="ingredient-guide-summary">라인별 주요 성분 · 역할과 함유 제품을 함께 확인하세요</p>
    <div class="ingredient-line-tabs" role="group" aria-label="제품 라인 선택">${groups.map((g,i)=>`<button type="button" data-line="${i}" aria-pressed="${i===0}">${g.title}</button>`).join('')}</div>
    ${groups.map((group,g)=>`<section class="ingredient-line-section" data-line-panel="${g}" ${g?'hidden':''}><h3>${group.title}</h3><div class="ingredient-guide-grid">${group.items.map((entry,i)=>{
      const item=ingredients.find(x=>x.name===entry.name);
      let text=item.text,role=item.role;
      if(g===2){const inner={NMN:['1포당 120 mg','리포좀효모추출물분말을 원료로 NMN을 담았습니다. 바르는 제품과 구분해, 섭취하는 이너뷰티의 원료 함량으로 설명합니다.'],PDRN:['1포당 200 mg','PDRN을 한 포에 담은 액상 제품입니다. 피부에 바르는 PDRN 제품과는 사용 방식이 다른 섭취용 원료입니다.'],'콜라겐':['1포당 1,000 mg','저분자 피쉬콜라겐펩타이드를 담았습니다. 물 없이 간편하게 섭취하는 액상 스틱의 주요 원료입니다.'],'병풀추출물':['병풀추출분말 · 1포당 100 mg','병풀을 분말 원료로 담았습니다. PDRN·콜라겐·NMN과 함께 구성한 이너뷰티 제품의 부원료입니다.']};[role,text]=inner[item.name]||[role,text]}
      return `<article class="ingredient-guide-card" data-ingredient="${item.name}" style="--ingredient-color:${group.color}"><div class="ingredient-card-title"><h3>${g===2&&item.name==='병풀추출물'?'병풀추출분말':item.name}</h3><span class="ingredient-card-number">${String(i+1).padStart(2,'0')}</span></div><small class="ingredient-card-en">${item.en}</small><strong class="ingredient-card-role">${role}</strong><p>${text}</p><div class="ingredient-skus"><b>함유 제품</b><span>${entry.products.join(' · ')}</span></div></article>`;
    }).join('')}</div></section>`).join('')}
    <div class="ingredient-guide-foot"><p>원료의 일반적 특성에 대한 설명입니다. 배합·함량과 완제품 시험 결과는 제품별로 다릅니다.</p><span>시오레 교육자료 기반 · <a href="https://cosmileeurope.eu/inci/detail/6550/hyaluronic-acid/" target="_blank" rel="noopener">히알루론산 참고: COSMILE Europe ↗</a></span></div>`;
  document.body.append(dialog);
  const cards = Array.from(dialog.querySelectorAll('.ingredient-guide-card'));
  function selectLine(index){dialog.querySelectorAll('[data-line-panel]').forEach(el=>el.hidden=el.dataset.linePanel!==String(index));dialog.querySelectorAll('[data-line]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.line===String(index))))}
  dialog.querySelectorAll('[data-line]').forEach(button=>button.addEventListener('click',()=>selectLine(button.dataset.line)));
  function openIngredient(name) {
    selectLine(Math.max(0,groups.findIndex(g=>g.items.some(i=>i.name===name))));
    if (typeof stopAuto === 'function') stopAuto();
    cards.forEach(card => card.classList.toggle('is-selected', card.dataset.ingredient === name));
    dialog.showModal();
    dialog.scrollTop = 0;
    const selected = cards.find(card => card.dataset.ingredient === name && !card.closest('[data-line-panel]').hidden);
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
