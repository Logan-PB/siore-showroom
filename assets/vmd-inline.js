/* 세팅사진 앨범: 기존 8장 기본 사진 + 태블릿 갤러리/카메라에서 바로 추가한 사진을
   IndexedDB(브라우저 로컬 저장소, 서버 전송 없음, 오프라인에서도 동작)에 저장해
   지속적으로 쌓아갈 수 있게 만든 버전입니다. 기존 openVmd()/selectVmd()/focusVmd() 이름과
   호출 방식은 그대로 유지해 다른 화면의 onclick 연결을 건드리지 않습니다. */

const vmdDefaults = [
  [{ id: 0, label: '브랜드 보드 · 제품별 진열', position: '50% 85%' }, { id: 2, label: '선반형 · 라인별 진열', position: '50% 38%' }, { id: 10, label: '카운터형 · 제품 안내물', position: '50% 65%' }, { id: 31, label: '니즈별 구성 · 상담 POP', position: '50% 62%' }],
  [{ id: 14, label: '브랜드 존 · 전체 공간', position: 'center' }, { id: 6, label: '릴리프 라인 · 집중 진열', position: 'center' }, { id: 19, label: '대표 제품 · 안내물 구성', position: 'center' }, { id: 24, label: '루틴 제안 · 세트 구성', position: 'center' }]
];

let vmdGroup = 0, vmdFocus = -1;
let vmdAlbum = null; // [[{src,label,removable,key}], [...]] populated from IndexedDB on first open

function vmdOpenDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open('siore-vmd-album', 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('photos')) {
        db.createObjectStore('photos', { keyPath: 'key', autoIncrement: true });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function vmdLoadAlbum() {
  if (vmdAlbum) return vmdAlbum;
  vmdAlbum = [[], []];
  // seed defaults first (not stored in DB, always shown unless individually removed)
  const removedKey = 'siore-vmd-removed-defaults';
  let removedDefaults = [];
  try { removedDefaults = JSON.parse(localStorage.getItem(removedKey) || '[]'); } catch {}
  vmdDefaults.forEach((group, g) => {
    group.forEach(p => {
      const defaultKey = `default-${g}-${p.id}`;
      if (removedDefaults.includes(defaultKey)) return;
      vmdAlbum[g].push({ src: `assets/vmd/setting-${p.id}.jpg`, label: p.label, removable: true, isDefault: true, key: defaultKey });
    });
  });
  try {
    const db = await vmdOpenDB();
    const tx = db.transaction('photos', 'readonly');
    const store = tx.objectStore('photos');
    const rows = await new Promise((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result || []);
      req.onerror = () => reject(req.error);
    });
    rows.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    rows.forEach(row => {
      const url = URL.createObjectURL(row.blob);
      vmdAlbum[row.group].unshift({ src: url, label: row.label || '현장 세팅 사진', removable: true, isDefault: false, key: row.key });
    });
  } catch (e) {
    console.warn('세팅사진 앨범을 불러오지 못했습니다', e);
  }
  return vmdAlbum;
}

async function vmdAddPhoto(group, file) {
  const db = await vmdOpenDB();
  const tx = db.transaction('photos', 'readwrite');
  const label = '현장 세팅 사진 · ' + new Date().toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' });
  await new Promise((resolve, reject) => {
    const req = tx.objectStore('photos').add({ group, blob: file, label, addedAt: Date.now() });
    req.onsuccess = resolve; req.onerror = () => reject(req.error);
  });
  vmdAlbum = null; // force reload
  await vmdLoadAlbum();
  selectVmd(group);
}

async function vmdRemovePhoto(group, item) {
  if (item.isDefault) {
    const removedKey = 'siore-vmd-removed-defaults';
    let removedDefaults = [];
    try { removedDefaults = JSON.parse(localStorage.getItem(removedKey) || '[]'); } catch {}
    if (!removedDefaults.includes(item.key)) removedDefaults.push(item.key);
    try { localStorage.setItem(removedKey, JSON.stringify(removedDefaults)); } catch {}
  } else {
    const db = await vmdOpenDB();
    const tx = db.transaction('photos', 'readwrite');
    await new Promise((resolve, reject) => {
      const req = tx.objectStore('photos').delete(item.key);
      req.onsuccess = resolve; req.onerror = () => reject(req.error);
    });
  }
  vmdAlbum = null;
  await vmdLoadAlbum();
  selectVmd(group);
}

function vmdResetDefaults() {
  try { localStorage.removeItem('siore-vmd-removed-defaults'); } catch {}
  vmdAlbum = null;
  vmdLoadAlbum().then(() => selectVmd(vmdGroup));
}

function vmdPickPhoto(group) {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.capture = 'environment';
  input.onchange = () => {
    if (input.files && input.files[0]) vmdAddPhoto(group, input.files[0]);
  };
  input.click();
}

function openVmd() {
  stopAuto();
  go(4);
  document.querySelector('.support-four').classList.add('vmd-open');
  vmdLoadAlbum().then(() => selectVmd(0));
}

function closeInlineVmd() {
  document.querySelector('.support-four').classList.remove('vmd-open');
}

function vmdCardsHtml(group) {
  const items = vmdAlbum[group];
  const cards = items.map((p, n) => `<div class="vmd-photo-card"><button type="button" onclick="focusVmd(${n})" aria-label="${p.label} 사진 확대"><div class="vmd-crop" style="--photo-position:${p.position || 'center'}"><img src="${p.src}" alt="${p.label} 실제 세팅 사진" loading="lazy"></div><span>${p.label}${p.isDefault ? '' : '<small>내 앨범</small>'}</span></button><button type="button" class="vmd-photo-remove" title="이 사진 삭제" aria-label="${p.label} 사진 삭제" onclick="event.stopPropagation();vmdRemovePhoto(${group}, vmdAlbum[${group}][${n}])">×</button></div>`).join('');
  const addCard = `<button type="button" class="vmd-photo-add" onclick="vmdPickPhoto(${group})"><span class="vmd-photo-add-icon">＋</span><span>사진 추가<small>갤러리 · 카메라</small></span></button>`;
  return `<div class="vmd-photo-grid">${cards}${addCard}</div>`;
}

function selectVmd(i) {
  vmdGroup = i; vmdFocus = -1;
  document.querySelectorAll('.inline-vmd-tabs button[onclick^="selectVmd"]').forEach((b, n) => b.setAttribute('aria-pressed', i === n));
  if (!vmdAlbum) { vmdLoadAlbum().then(() => { document.getElementById('inline-vmd-content').innerHTML = vmdCardsHtml(i); }); return; }
  document.getElementById('inline-vmd-content').innerHTML = vmdCardsHtml(i);
}

function focusVmd(n) {
  const items = vmdAlbum[vmdGroup];
  vmdFocus = (n + items.length) % items.length;
  const p = items[vmdFocus];
  document.getElementById('inline-vmd-content').innerHTML = `<div class="vmd-focus-photo"><img src="${p.src}" alt="${p.label} 전체 사진"></div><div class="vmd-focus-nav"><button onclick="focusVmd(${vmdFocus - 1})">← 이전 사진</button><span>${p.label} · ${vmdFocus + 1} / ${items.length}</span><button onclick="selectVmd(${vmdGroup})">사진 모아보기</button><button onclick="focusVmd(${vmdFocus + 1})">다음 사진 →</button></div>`;
}

// Returning through the main navigation or a benefit always opens the support overview.
document.querySelector('[data-page="4"]').addEventListener('click', closeInlineVmd);
document.querySelectorAll('.trade-benefits>button').forEach(b => b.addEventListener('click', closeInlineVmd));
