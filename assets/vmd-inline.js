const vmdSelections=[
[{id:0,label:'브랜드 보드 · 제품별 진열',position:'50% 85%'},{id:2,label:'선반형 · 라인별 진열',position:'50% 38%'},{id:10,label:'카운터형 · 제품 안내물',position:'50% 65%'},{id:31,label:'니즈별 구성 · 상담 POP',position:'50% 62%'}],
[{id:14,label:'브랜드 존 · 전체 공간',position:'center'},{id:6,label:'릴리프 라인 · 집중 진열',position:'center'},{id:19,label:'대표 제품 · 안내물 구성',position:'center'},{id:24,label:'루틴 제안 · 세트 구성',position:'center'}]
];
let vmdGroup=0,vmdFocus=-1;
function openVmd(){stopAuto();go(4);document.querySelector('.support-four').classList.add('vmd-open');selectVmd(0)}
function closeInlineVmd(){document.querySelector('.support-four').classList.remove('vmd-open')}
function selectVmd(i){vmdGroup=i;vmdFocus=-1;document.querySelectorAll('.inline-vmd-tabs button').forEach((b,n)=>b.setAttribute('aria-pressed',i===n));document.getElementById('inline-vmd-content').innerHTML='<div class="vmd-photo-grid">'+vmdSelections[i].map((p,n)=>`<button class="vmd-photo-card" onclick="focusVmd(${n})" aria-label="${p.label} 사진 확대"><div class="vmd-crop" style="--photo-position:${p.position}"><img src="assets/vmd/setting-${p.id}.jpg" alt="${p.label} 실제 세팅 사진" loading="lazy"></div><span>${p.label}<small>확대 ↗</small></span></button>`).join('')+'</div>'}
function focusVmd(n){vmdFocus=(n+4)%4;const p=vmdSelections[vmdGroup][vmdFocus];document.getElementById('inline-vmd-content').innerHTML=`<div class="vmd-focus-photo"><img src="assets/vmd/setting-${p.id}.jpg" alt="${p.label} 전체 사진"></div><div class="vmd-focus-nav"><button onclick="focusVmd(${vmdFocus-1})">← 이전 사진</button><span>${p.label} · ${vmdFocus+1} / 4</span><button onclick="selectVmd(${vmdGroup})">사진 모아보기</button><button onclick="focusVmd(${vmdFocus+1})">다음 사진 →</button></div>`}
// Returning through the main navigation or a benefit always opens the support overview.
document.querySelector('[data-page="4"]').addEventListener('click',closeInlineVmd);
document.querySelectorAll('.trade-benefits>button').forEach(b=>b.addEventListener('click',closeInlineVmd));
