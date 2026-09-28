(() => {
 const panel=document.querySelector('.quick-settings-panel');if(!panel)return;
 const link=document.createElement('a');link.href='global.html?lang=en';link.target='_blank';link.rel='noopener';
 link.className='global-share-link';link.textContent='해외용 자료 ↗';panel.append(link);
})();
