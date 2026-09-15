/* Theme changes preserve the current screen, dialogs, and presentation controls. */
(() => {
  const root = document.documentElement;
  const light = document.getElementById('theme-light');
  const key = 'siore-showroom-theme';
  function applyTheme(value, persist = true) {
    const theme = value === 'light' ? 'light' : 'dark';
    root.dataset.theme = theme;
    light.media = theme === 'light' ? 'all' : 'not all';
    document.querySelectorAll('[data-set-theme]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.setTheme === theme));
    });
    if (persist) { try { localStorage.setItem(key, theme); } catch {} }
  }
  function picker(className) {
    const group = document.createElement('div');
    group.className = 'theme-picker ' + className;
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', '화면 테마');
    for (const [theme, label, path] of [
      ['dark', '다크', '<path d="M16 11.8A6.4 6.4 0 0 1 8.2 4 6.5 6.5 0 1 0 16 11.8Z"/>'],
      ['light', '라이트', '<circle cx="10" cy="10" r="3.2"/><path d="M10 1.5v2M10 16.5v2M1.5 10h2M16.5 10h2M4 4l1.4 1.4M14.6 14.6 16 16M4 16l1.4-1.4M14.6 5.4 16 4"/>']
    ]) {
      const button = document.createElement('button');
      button.type = 'button';
      button.dataset.setTheme = theme;
      button.innerHTML = `<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true">${path}</svg><span>${label}</span>`;
      button.addEventListener('click', event => { event.stopPropagation(); applyTheme(theme); });
      group.append(button);
    }
    return group;
  }
  document.querySelector('#presentation .footer > div').prepend(picker('footer-theme-picker'));
  document.querySelector('#proposal-cover .cover-stage').append(picker('cover-theme-picker'));
  applyTheme(root.dataset.theme, false);
  window.addEventListener('storage', event => { if (event.key === key) applyTheme(event.newValue, false); });
})();
