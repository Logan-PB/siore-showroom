/* SKU selection is a planning aid. Actual quantities and orders stay in B2B. */
(() => {
  const CORE = [1, 2, 4, 8];
  const CORE_ROLES = ['수분·광채의 시작', '탄력 집중 케어', '농밀한 보습 마무리', '산뜻한 보습 마무리'];
  const SHORT = {0:'클렌징밀크',1:'버블토너',2:'인텐시브 세럼',3:'수딩크림',4:'리치크림',5:'에센스토너',6:'리페어 앰플',7:'카밍 수딩젤',8:'컴포트크림',9:'마시는 PDRN'};
  const STORAGE = 'siore-first-sku-plan-v1';
  let selected = new Set(), confirmed = false, mode = 'core', reviewing = false, pickerOpen = false;
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORAGE) || 'null');
    if (saved && Array.isArray(saved.ids)) {
      selected = new Set(saved.ids.filter(id => Number.isInteger(id) && id >= 0 && id < skuProducts.length));
      confirmed = saved.confirmed === true && selected.size > 0;
    }
  } catch {}
  const line = id => id < 5 ? 'nmn' : id === 9 ? 'inner' : 'relief';
  const ids = () => [...selected].sort((a,b) => a-b);
  const lineNames = [['nmn','NMN'],['relief','데일리 릴리프'],['inner','이너뷰티']];
  const fullSelection = items => items.every(id => selected.has(id));
  const miniProduct = id => `<span class="starter-mini" data-product-line="${line(id)}"><img src="${skuProducts[id].image}" alt=""><b>${SHORT[id]}</b></span>`;
  const plan = document.querySelector('.closing-plan');
  plan.classList.add('starter-plan');
  plan.innerHTML = `<div class="starter-plan-heading"><span class="eyebrow">FIRST ORDER · SKU SELECTION</span><h3>어떤 구성으로 시작할까요?</h3></div><div class="starter-entry-options"><button class="starter-entry" data-starter-mode="core"><span class="starter-entry-title"><i>A</i><span><b>핵심 4종 구성</b><small>주력 SKU로 시작하는 약국</small></span><em>구성 보기 ↗</em></span><span class="starter-mini-products">${CORE.map(miniProduct).join('')}</span><span class="starter-entry-copy">토너·세럼 + 피부에 맞춰 제안하는 크림 2종</span></button><button class="starter-entry" data-starter-mode="needs"><span class="starter-entry-title"><i>B</i><span><b>니즈별 3종 구성</b><small>우리 약국의 주요 고객에 맞춰</small></span><em>비교하기 ↗</em></span><span class="starter-need-chips">${needsRoutines.map(r=>`<span><i aria-hidden="true">${r.emoji}</i>${r.title}</span>`).join('')}</span><span class="starter-entry-copy">네 가지 상담 루틴 중 선택 · 여러 구성 조합 가능</span></button></div><div class="starter-saved"><div><strong id="starter-page-count">첫 사입 SKU를 골라보세요.</strong><span id="starter-page-lines">추천 구성에서 선택하고 제품을 추가·변경할 수 있습니다.</span></div><button id="starter-page-review">선정 목록 보기 ↗</button></div><div class="starter-order-path"><span><b>01</b>SKU 선정</span><i>→</i><span><b>02</b>가입·거래 조건 확인</span><i>→</i><span><b>03</b>첫 주문·진열</span></div><div class="closing-tools"><button onclick="openPrices()">SKU 공급단가표 ↗</button><a href="https://logan-pb.github.io/siore-skin/guides/siore_guide_12.html" target="_blank" rel="noopener">거래 안내·서류 제출 ↗</a></div>`;
  document.querySelector('.closing-heading>p:last-child').textContent = '제품 구성부터 정하고, 우리 약국의 첫 주문을 준비하세요.';
  document.querySelector('.closing-enroll .eyebrow').textContent = 'NEXT STEP · B2B';
  document.querySelector('.closing-enroll h3').textContent = '구성을 정했다면, 가입';

  const dialog = document.createElement('dialog');
  dialog.id = 'starter-guide';
  dialog.setAttribute('aria-labelledby', 'starter-title');
  dialog.innerHTML = `<div class="starter-top"><div><p class="eyebrow">FIRST ORDER · SKU SELECTION</p><h2 id="starter-title">우리 약국의 첫 SKU 구성</h2></div><button class="starter-close" aria-label="SKU 선정 가이드 닫기">닫기 ×</button></div><div id="starter-content"></div><p class="starter-foot">SKU 선정 가이드입니다. 실제 발주 수량과 공급 조건은 확인 후 B2B몰에서 주문합니다.</p>`;
  document.body.append(dialog);
  const content = document.getElementById('starter-content');
  const save = () => {
    try { sessionStorage.setItem(STORAGE, JSON.stringify({ids:ids(), confirmed})); } catch {}
    updatePageSummary();
  };
  function updatePageSummary() {
    document.getElementById('starter-page-count').textContent = selected.size ? `${confirmed?'선정 완료':'선정 중'} · ${selected.size}개 SKU` : '첫 사입 SKU를 골라보세요.';
    document.getElementById('starter-page-lines').textContent = selected.size ? lineNames.map(([key,name])=>{const n=ids().filter(id=>line(id)===key).length;return n?`${name} ${n}종`:''}).filter(Boolean).join(' · ') : '추천 구성에서 선택하고 제품을 추가·변경할 수 있습니다.';
    document.getElementById('starter-page-review').disabled = !selected.size;
  }
  function productChoice(id, role) {
    const p = skuProducts[id];
    return `<article class="starter-product" data-product-line="${line(id)}"><label><input type="checkbox" data-select-sku="${id}" ${selected.has(id)?'checked':''}><span class="starter-check-label">SKU 선택</span><img src="${p.image}" alt=""><small>${p.line}</small><b>${SHORT[id]}</b><span>${role || p.category}</span></label><button class="starter-spec" data-spec="${id}">제품 스펙 ↗</button></article>`;
  }
  function corePanel() {
    return `<div class="starter-panel-heading"><div><span class="starter-route-letter">A</span><h3>핵심 4종으로 시작</h3></div><p>토너·세럼으로 상담을 시작하고, 고객에게 맞는 크림을 제안합니다.</p></div><div class="starter-core-products">${CORE.map((id,i)=>productChoice(id,CORE_ROLES[i])).join('')}</div><div class="starter-reason"><b>고객에 따라 달라지는 크림 제안</b><p>리치크림은 농밀한 보습, 컴포트크림은 산뜻한 마무리. 두 크림은 피부 상태와 제형 선호에 맞춰 제안하는 선택지입니다.</p></div><button class="starter-add-group" data-add-core>핵심 4종 모두 담기 ＋</button>`;
  }
  function needsPanel() {
    return `<div class="starter-panel-heading"><div><span class="starter-route-letter">B</span><h3>주요 고객의 피부 고민으로 선택</h3></div><p>상담에서 함께 권할 이유가 있는 3종 구성입니다. 여러 니즈를 함께 선택할 수 있습니다.</p></div><div class="starter-routines">${needsRoutines.map((r,i)=>`<article class="starter-routine" style="--routine-tone:${r.tone}"><div class="starter-routine-title"><span aria-hidden="true">${r.emoji}</span><div><h4>${r.title}</h4><small>${r.tag}</small></div></div><div class="starter-routine-products">${r.ids.map((id,n)=>`<button data-spec="${id}" data-product-line="${line(id)}" aria-label="${skuProducts[id].name} 제품 스펙"><img src="${skuProducts[id].image}" alt=""><b>${SHORT[id]}</b><span>${n+1}. ${r.steps[n]}</span></button>`).join('')}</div><p class="starter-routine-reason">${r.reason}</p><div class="starter-routine-bottom"><span>고객 제안용 3종 소비자가 합계<strong>${r.ids.reduce((sum,id)=>sum+priceCatalog[id][2],0).toLocaleString('ko-KR')}원</strong></span><button data-add-routine="${i}">이 구성 담기 ＋</button></div></article>`).join('')}</div><p class="starter-care-note">소비자가 합계는 개별 제품 가격을 합산한 상담 예시입니다. 시술 후에는 시술기관의 사용 시점·주의사항을 따릅니다.</p>`;
  }
  function picker() {
    return `<div class="starter-picker"><button class="starter-picker-toggle" aria-expanded="${pickerOpen}">전체 10종에서 추가·변경 <span>${pickerOpen?'−':'＋'}</span></button><div class="starter-picker-grid" ${pickerOpen?'':'hidden'}>${skuProducts.map(p=>`<label data-product-line="${line(p.id)}"><input type="checkbox" data-select-sku="${p.id}" ${selected.has(p.id)?'checked':''}><img src="${p.image}" alt=""><span>${SHORT[p.id]}</span></label>`).join('')}</div></div>`;
  }
  function summaryRows() {
    if (!selected.size) return `<div class="starter-empty"><span>＋</span><b>우리 약국에 맞는 구성을 담아주세요.</b><p>핵심 4종이나 니즈별 구성을 선택하면<br>선정 목록이 이곳에 정리됩니다.</p></div>`;
    return lineNames.map(([key,name])=>{const products=ids().filter(id=>line(id)===key);return !products.length?'':`<section class="starter-selected-line" data-product-line="${key}"><h4>${name}<span>${products.length}종</span></h4>${products.map(id=>`<div class="starter-selected-item"><img src="${skuProducts[id].image}" alt=""><span>${SHORT[id]}</span><button data-remove-sku="${id}" aria-label="${SHORT[id]} 선정 목록에서 제외">×</button></div>`).join('')}</section>`}).join('');
  }
  function render() {
    if (reviewing) return renderReview();
    document.getElementById('starter-title').textContent = '우리 약국의 첫 SKU 구성';
    content.innerHTML = `<div class="starter-mode-tabs" role="group" aria-label="SKU 구성 방식"><button data-mode="core" aria-pressed="${mode==='core'}">A · 핵심 4종 구성</button><button data-mode="needs" aria-pressed="${mode==='needs'}">B · 니즈별 3종 구성</button></div><div class="starter-workspace"><section class="starter-options">${mode==='core'?corePanel():needsPanel()}${picker()}</section><aside class="starter-summary"><div class="starter-summary-title"><div><small>MY PHARMACY SELECTION</small><h3>선정 SKU <strong id="starter-count">${selected.size}</strong><span>종</span></h3></div><button data-reset>다시 선택</button></div><p class="starter-merge-note">여러 구성에 겹치는 제품은 한 번만 담습니다.</p><div id="starter-selected-list" aria-live="polite">${summaryRows()}</div><div class="starter-summary-actions"><button data-confirm ${selected.size?'':'disabled'}>이 SKU로 구성 확정 →</button><span>수량은 구성 확정 후 거래 조건과 함께 정합니다.</span></div></aside></div>`;
    bind();syncSelection();
  }
  function syncSelection() {
    content.querySelectorAll('[data-select-sku]').forEach(input=>{input.checked=selected.has(Number(input.dataset.selectSku));input.closest('label').classList.toggle('is-picked',input.checked)});
    const coreButton=content.querySelector('[data-add-core]');
    if (coreButton) {coreButton.disabled=fullSelection(CORE);coreButton.textContent=coreButton.disabled?'핵심 4종 선택됨 ✓':'핵심 4종 모두 담기 ＋'}
    content.querySelectorAll('[data-add-routine]').forEach(button=>{const included=fullSelection(needsRoutines[Number(button.dataset.addRoutine)].ids);button.disabled=included;button.textContent=included?'3종 포함됨 ✓':'이 구성 담기 ＋';button.closest('.starter-routine').classList.toggle('is-included',included)});
    const count=content.querySelector('#starter-count');if(count)count.textContent=selected.size;
    const list=content.querySelector('#starter-selected-list');if(list)list.innerHTML=summaryRows();
    const confirm=content.querySelector('[data-confirm]');if(confirm)confirm.disabled=!selected.size;
    bindRemoval();save();
  }
  function changeSelection(action) {action();confirmed=false;syncSelection()}
  function bindRemoval() {content.querySelectorAll('[data-remove-sku]').forEach(button=>button.onclick=()=>changeSelection(()=>selected.delete(Number(button.dataset.removeSku))))}
  function renderReview() {
    document.getElementById('starter-title').textContent = `우리 약국의 첫 구성, ${selected.size}개 SKU`;
    content.innerHTML = `<div class="starter-review"><div class="starter-review-products"><div class="starter-review-heading"><span>선정 완료</span><button data-edit>← 구성 수정하기</button></div>${lineNames.map(([key,name])=>{const products=ids().filter(id=>line(id)===key);return !products.length?'':`<section class="starter-review-line" data-product-line="${key}"><h3>${name}<span>${products.length}종</span></h3><div>${products.map(id=>`<button data-spec="${id}"><img src="${skuProducts[id].image}" alt=""><span><b>${skuProducts[id].name}</b><small>${skuProducts[id].size}</small></span></button>`).join('')}</div></section>`}).join('')}</div><aside class="starter-next"><small>NEXT STEP</small><h3>구성을 정했다면,<br>첫 주문을 준비하세요.</h3><ol><li><b>선정 목록 보관</b><span>목록을 복사해 담당자와 공유합니다.</span></li><li><b>수량·공급 조건 확인</b><span>진열 공간과 초도 조건에 맞춰 수량을 정합니다.</span></li><li><b>B2B몰에서 주문</b><span>가입·승인 안내 후 주문을 진행합니다.</span></li></ol><button data-copy-plan>선정 목록 복사</button><a href="https://siorekorea.co.kr/" target="_blank" rel="noopener">B2B몰 열기 ↗</a><button class="starter-price-link" data-open-prices>SKU 공급단가표 확인 ↗</button><p class="starter-copy-status" role="status"></p><textarea class="starter-copy-fallback" aria-label="복사할 SKU 선정 목록" readonly hidden></textarea></aside></div>`;
    bind();save();
  }
  function planText() {
    return ['시오레 첫 사입 SKU 선정안',`선정 제품: ${selected.size}종`,'',...lineNames.flatMap(([key,name])=>{const products=ids().filter(id=>line(id)===key);return products.length?[`[${name}]`,...products.map(id=>`- ${skuProducts[id].name} / ${skuProducts[id].size}`),'']:[]}), '발주 수량·공급 조건 확인 후 B2B몰에서 주문합니다.','B2B몰: https://siorekorea.co.kr/','시오레 담당자: 010-3109-3106'].join('\n');
  }
  function bind() {
    content.querySelectorAll('[data-mode]').forEach(button=>button.onclick=()=>{mode=button.dataset.mode;render()});
    content.querySelectorAll('[data-select-sku]').forEach(input=>input.onchange=()=>changeSelection(()=>{const id=Number(input.dataset.selectSku);input.checked?selected.add(id):selected.delete(id)}));
    content.querySelectorAll('[data-spec]').forEach(button=>button.onclick=()=>openSku(Number(button.dataset.spec)));
    const coreButton=content.querySelector('[data-add-core]');if(coreButton)coreButton.onclick=()=>changeSelection(()=>CORE.forEach(id=>selected.add(id)));
    content.querySelectorAll('[data-add-routine]').forEach(button=>button.onclick=()=>changeSelection(()=>needsRoutines[Number(button.dataset.addRoutine)].ids.forEach(id=>selected.add(id))));
    const reset=content.querySelector('[data-reset]');if(reset)reset.onclick=()=>changeSelection(()=>selected.clear());
    const confirm=content.querySelector('[data-confirm]');if(confirm)confirm.onclick=()=>{if(!selected.size)return;confirmed=true;reviewing=true;render()};
    const edit=content.querySelector('[data-edit]');if(edit)edit.onclick=()=>{reviewing=false;render()};
    const toggle=content.querySelector('.starter-picker-toggle');if(toggle)toggle.onclick=()=>{pickerOpen=!pickerOpen;toggle.setAttribute('aria-expanded',pickerOpen);toggle.querySelector('span').textContent=pickerOpen?'−':'＋';content.querySelector('.starter-picker-grid').hidden=!pickerOpen};
    const priceButton=content.querySelector('[data-open-prices]');if(priceButton)priceButton.onclick=()=>openPrices();
    const copy=content.querySelector('[data-copy-plan]');if(copy)copy.onclick=async()=>{const message=planText(),status=content.querySelector('.starter-copy-status');try{await navigator.clipboard.writeText(message);status.textContent='선정 목록을 복사했습니다.'}catch{const field=content.querySelector('.starter-copy-fallback');field.hidden=false;field.value=message;field.focus();field.select();status.textContent='아래 목록을 선택해 복사해 주세요.'}};
    bindRemoval();
  }
  window.openStarterGuide = (requestedMode='core',showReview=false) => {
    stopAuto();mode=requestedMode==='needs'?'needs':'core';reviewing=showReview&&selected.size>0;pickerOpen=false;
    render();if(!dialog.open)dialog.showModal();
  };
  document.querySelectorAll('[data-starter-mode]').forEach(button=>button.onclick=()=>openStarterGuide(button.dataset.starterMode));
  document.getElementById('starter-page-review').onclick=()=>openStarterGuide(mode,confirmed);
  dialog.querySelector('.starter-close').onclick=()=>dialog.close();
  document.addEventListener('keydown',event=>{
    if(dialog.open&&event.key.startsWith('Arrow')&&!document.querySelector('#sku-dialog[open],#clinical-viewer[open],#price-dialog[open]'))event.stopImmediatePropagation();
  },true);
  updatePageSummary();
})();
