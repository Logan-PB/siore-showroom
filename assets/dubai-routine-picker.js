(() => {
 const grid=document.querySelector('#featured-skus');
 if(!grid || typeof needsRoutines==='undefined')return;
 const bar=document.createElement('div');bar.className='routine-picker';bar.setAttribute('data-language-control','');bar.setAttribute('role','group');
 const text={ko:['핵심 4종','안티에이징','시술 후 · 진정','여드름성 · 트러블','열감 · 홍조'],en:['Core 4','Anti-aging','Post-procedure care','Blemish-prone','Heat & redness'],zh:['核心4款','抗老护理','术后舒缓','易长痘肌肤','热感与泛红'],ja:['基本4品','エイジングケア','施術後のケア','ニキビ肌','ほてり・赤み']};
 const caution={ko:'시술 후에는 시술기관의 사용 시점·주의사항을 따릅니다.',en:'After a procedure, follow your provider’s timing and care instructions.',zh:'术后请遵循施术机构的使用时间和护理说明。',ja:'施術後は施術機関の使用時期・注意事項に従ってください。'};
 let chosen=0, rendered='';
 const note=document.createElement('p');note.className='routine-caution';note.setAttribute('data-language-control','');
 function render(){const lang=document.documentElement.dataset.language||'en';if(rendered===lang)return;rendered=lang;const labels=text[lang]||text.en;bar.setAttribute('aria-label',lang==='ko'?'피부 고민별 SKU 구성':'Select a skincare routine');bar.replaceChildren(...labels.map((label,i)=>{const b=document.createElement('button');b.type='button';b.textContent=label;b.setAttribute('aria-pressed',String(i===chosen));b.onclick=()=>{chosen=i;bar.querySelectorAll('button').forEach((el,n)=>el.setAttribute('aria-pressed',String(n===i)));note.hidden=i!==2;document.dispatchEvent(new CustomEvent('siore:select-routine',{detail:i===0?[0,1,2,7]:needsRoutines[i-1].ids}));};return b}));note.textContent=caution[lang]||caution.en;note.hidden=chosen!==2;}
 grid.before(bar);grid.after(note);render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['data-language']});
})();
