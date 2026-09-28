(() => {
 const dict=window.SIORE_LANGUAGES, languages=['ko','en','zh','ja'];
 let lang='ko';try{lang=localStorage.getItem('siore-showroom-language')||'ko'}catch{}
 const requested=new URLSearchParams(location.search).get('lang');if(languages.includes(requested))lang=requested;
 if(!languages.includes(lang))lang='ko';
 const originals=new WeakMap(); let pending=false;
 function translated(source){
  if(lang==='ko')return source;
  const key=source.trim(),row=dict[key];
  if(row)return source.replace(key,row[languages.indexOf(lang)-1]);
  if(/^[0-9 /]+ · SIORÉ · 약국 파트너십$/.test(key))return key.replace('약국 파트너십',({en:'Pharmacy partnership',zh:'药房合作',ja:'薬局パートナーシップ'})[lang]);
  return source;
 }
 function render(){
  observer.disconnect();
  const walk=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);let n;
  while(n=walk.nextNode()){
   if(n.parentElement.closest('script,style,select,option,[data-language-control],svg'))continue;
   const saved=originals.get(n);let original=saved&&n.nodeValue===saved.last?saved.source:n.nodeValue;
   const value=translated(original);if(value!==n.nodeValue)n.nodeValue=value;
   originals.set(n,{source:original,last:value});
  }
  document.documentElement.lang=lang==='zh'?'zh-CN':lang;
  document.documentElement.dataset.language=lang;
  document.querySelectorAll('[data-language-control] select').forEach(s=>s.value=lang);
  observer.observe(document.body,{childList:true,subtree:true,characterData:true});pending=false;
 }
 const observer=new MutationObserver(()=>{if(!pending){pending=true;queueMicrotask(render)}});
 function selector(){const label=document.createElement('label');label.className='language-selector';label.dataset.languageControl='';label.innerHTML='<span aria-hidden="true">🌐</span><select aria-label="Language / 언어"><option value="ko">한국어</option><option value="en">English</option><option value="zh">中文</option><option value="ja">日本語</option></select>';label.querySelector('select').addEventListener('change',e=>{lang=e.target.value;try{localStorage.setItem('siore-showroom-language',lang)}catch{}render()});return label}
 document.querySelector('#presentation header').append(selector());
 document.querySelector('#proposal-cover .cover-stage').append(selector());
 render();
})();
