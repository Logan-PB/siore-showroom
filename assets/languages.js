(() => {
 const dict=window.SIORE_LANGUAGES, languages=['ko','en','zh','ja'];
 const storageKey=document.documentElement.dataset.edition==='global'?'siore-global-language':'siore-showroom-language';
 let lang=document.documentElement.dataset.edition==='global'?'en':'ko';try{lang=localStorage.getItem(storageKey)||lang}catch{}
 const requested=new URLSearchParams(location.search).get('lang');if(languages.includes(requested))lang=requested;
 if(!languages.includes(lang))lang='ko';
 const originals=new WeakMap(), attributes=new WeakMap(); let pending=false;
 const normalized=new Map(Object.entries(dict).map(([k,v])=>[k.replace(/\s+/g,' ').trim(),v]));
 const reverse=new Map();Object.entries(dict).forEach(([k,rows])=>rows.forEach(v=>{if(v!==k&&!reverse.has(v))reverse.set(v,k)}));
 function translated(source){
  if(lang==='ko')return source;
  const key=source.trim(),row=normalized.get(key.replace(/\s+/g,' '));
  if(row)return source.replace(key,row[languages.indexOf(lang)-1]);
  if(/^[0-9 /]+ · SIORÉ · 약국 파트너십$/.test(key))return key.replace('약국 파트너십',({en:'Pharmacy partnership',zh:'药房合作',ja:'薬局パートナーシップ'})[lang]);
  const count=key.match(/^(\d+)(개 SKU|종)$/);if(count)return count[1]+' '+({en:'products',zh:'款',ja:'品'})[lang];
  const money=key.match(/^([\d,]+)원$/);if(money)return money[1]+' KRW';
  const setTab=key.match(/^([AB] · )(.+)$/);if(setTab)return setTab[1]+translated(setTab[2]);
  const lineCount=key.match(/^(NMN|데일리 릴리프|이너뷰티) (\d+)종$/);if(lineCount)return translated(lineCount[1])+' '+lineCount[2]+' '+({en:'products',zh:'款',ja:'品'})[lang];
  const numbered=key.match(/^(\d+\. |\d+ \/ )(.+)$/);
  if(numbered)return numbered[1]+translated(numbered[2]);
  const arrow=key.match(/^(.+?)( ↗| →)$/);if(arrow)return translated(arrow[1])+arrow[2];
  if(key.includes(' · ')||key.includes(' / '))return source.split(/( · | \/ )/).map(t=>t===' · '||t===' / '?t:translated(t)).join('');
  for(const [suffix,values] of Object.entries({' 상세 보기':[' details',' 详情',' 詳細'],' 성분 안내':[' ingredient guide',' 成分介绍',' 成分ガイド'],' 임상 이미지 확대':[' study image',' 测试图片',' 試験画像']})){
   if(key.endsWith(suffix))return translated(key.slice(0,-suffix.length))+values[languages.indexOf(lang)-1];
  }
  return source;
 }
 function render(){
  observer.disconnect();
  document.querySelectorAll('dialog:not(#proposal-cover)').forEach(dialog=>{
   if(dialog.querySelector('.dialog-language-bar'))return;
   const bar=document.createElement('div');bar.className='dialog-language-bar';
   bar.append(selector());dialog.prepend(bar);
  });
  const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=walk.nextNode()){
   if(n.parentElement.closest('script,style,[data-language-control],svg'))continue;
   const saved=originals.get(n);let original=saved&&n.nodeValue===saved.last?saved.source:n.nodeValue;
   if(!saved&&reverse.has(original.trim()))original=original.replace(original.trim(),reverse.get(original.trim()));
   const value=translated(original);if(value!==n.nodeValue)n.nodeValue=value;
   originals.set(n,{source:original,last:value});
  }
  document.querySelectorAll('[aria-label],[title],[placeholder]').forEach(el=>{
   if(el.closest('[data-language-control]'))return;
   const saved=attributes.get(el)||{};
   for(const attr of ['aria-label','title','placeholder']){
    if(!el.hasAttribute(attr))continue;
    const current=el.getAttribute(attr),prior=saved[attr];
    const source=prior&&current===prior.last?prior.source:current,value=translated(source);
    if(current!==value)el.setAttribute(attr,value);saved[attr]={source,last:value};
   }attributes.set(el,saved);
  });
  document.documentElement.lang=lang==='zh'?'zh-CN':lang;
  document.documentElement.dataset.language=lang;
  document.querySelectorAll('[data-language-control] select').forEach(s=>s.value=lang);
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});pending=false;
 }
 const observer=new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(render)}});
 function selector(){const label=document.createElement('label');label.className='language-selector';label.dataset.languageControl='';label.innerHTML='<span aria-hidden="true">🌐</span><select aria-label="Language"><option value="ko">한국어</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option></select>';label.querySelector('select').addEventListener('change',e=>{lang=e.target.value;try{localStorage.setItem(storageKey,lang)}catch{}const u=new URL(location.href);u.searchParams.set('lang',lang);history.replaceState(null,'',u);render()});return label}
 document.querySelector('#presentation header').append(selector());
 document.querySelector('#proposal-cover .cover-stage').append(selector());
 render();
})();
