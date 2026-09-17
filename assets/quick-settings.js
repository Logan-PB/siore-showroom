/* 하단 유틸버튼(다크/라이트, 겉표지, 움직임 끄기, 자동 넘김, 전체화면)을
   "설정" 버튼 하나로 접어서, 피칭 중 "다음" 버튼만 크게 보이도록 정리합니다.
   기존 버튼 요소를 그대로 옮기기만 하므로 각 버튼의 onclick 동작은 그대로 유지됩니다. */
(() => {
  const wrap = document.querySelector('#presentation .footer > div');
  if (!wrap || wrap.children.length < 2) return;
  const nextBtn = wrap.lastElementChild; // "다음 →" 버튼은 그대로 크게 노출
  const toMove = Array.from(wrap.children).filter(el => el !== nextBtn);
  if (!toMove.length) return;

  const settingsWrap = document.createElement('div');
  settingsWrap.className = 'quick-settings-wrap';

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'quick-settings-btn';
  toggle.setAttribute('aria-haspopup', 'true');
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-label', '화면 설정 더보기');
  toggle.textContent = '설정 ⚙';

  const panel = document.createElement('div');
  panel.className = 'quick-settings-panel';
  toMove.forEach(el => panel.appendChild(el));

  function closePanel() {
    panel.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = panel.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  document.addEventListener('click', (e) => {
    if (!settingsWrap.contains(e.target)) closePanel();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closePanel();
  });

  settingsWrap.append(toggle, panel);
  wrap.insertBefore(settingsWrap, nextBtn);
})();
