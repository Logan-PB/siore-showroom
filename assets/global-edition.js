/* Isolated two-section edition for international presentations. */
(() => {
 document.title='SIORÉ | Brand & Signature Products';
 document.querySelectorAll('#presentation nav [data-page]').forEach(b=>{if(+b.dataset.page>1)b.remove()});
 document.querySelectorAll('#presentation main > .screen').forEach((s,i)=>{if(i>1)s.remove()});
 document.querySelectorAll('.sku-route > div,.needs-entry,.benefits-heading > button').forEach(el=>el.remove());
 document.querySelectorAll('.trade-benefits > button').forEach(button=>{
  button.removeAttribute('onclick');button.tabIndex=-1;button.setAttribute('aria-disabled','true');button.style.cursor='default';
 });
 document.querySelectorAll('#needs-dialog,#price-dialog,#price-share-dialog,#rate-dialog,#vmd-gallery,#starter-guide').forEach(el=>{el.inert=true});
 // Arrow keys stay inside this edition, including after modal dismissal.
 document.addEventListener('keydown',e=>{
  if(e.altKey&&e.key.toLowerCase()==='p'){e.preventDefault();e.stopImmediatePropagation();return}
  if(e.target.closest('select,input,textarea')||document.querySelector('dialog[open]'))return;
  if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopImmediatePropagation();nextMain()}
 },true);
 document.getElementById('cover-start').click();
})();
