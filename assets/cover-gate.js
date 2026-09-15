(() => {
  const cover = document.getElementById('proposal-cover');
  const start = document.getElementById('cover-start');
  const presentation = document.getElementById('presentation');
  let released = false;
  window.openProposalCover = () => {
    released = false;
    stopAuto();
    document.documentElement.classList.remove('intro-started');
    presentation.inert = true;
    if (!cover.open) cover.showModal();
    cover.focus({preventScroll:true});
  };
  window.toggleCoverFullscreen = async () => {
    await full();
    // A fullscreen element enters the top layer after an already-open dialog.
    // Reopen the cover above it so the protected presentation never shows blank.
    if (cover.open) cover.close();
    window.openProposalCover();
  };
  cover.addEventListener('cancel', event => event.preventDefault());
  cover.addEventListener('close', () => {
    if (!released) window.openProposalCover();
  });
  document.addEventListener('keydown', event => {
    if (!cover.open) return;
    if (event.key === 'Tab') return;
    if (event.target.closest('button') && ['Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
  }, true);
  cover.addEventListener('wheel', event => event.preventDefault(), {passive:false});
  cover.addEventListener('touchmove', event => event.preventDefault(), {passive:false});
  start.addEventListener('click', () => {
    released = true;
    cover.close();
    presentation.inert = false;
    document.documentElement.classList.add('intro-started');
    go(0);
    document.querySelector('.cover-brand')?.focus({preventScroll:true});
  });
  window.openProposalCover();
})();
