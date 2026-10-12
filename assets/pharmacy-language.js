(() => {
 Object.assign(window.SIORE_LANGUAGES,{"거래약국 제품 가이드 · 시안": ["Pharmacy Product Guide", "药房产品指南", "薬局向け製品ガイド"], "피부 고민에 맞춰,": ["For your skin concerns,", "针对肌肤困扰，", "肌悩みに合わせて、"], "시오레를 더 쉽게.": ["Discover SIORÉ.", "轻松了解 SIORÉ。", "SIORÉをもっと身近に。"], "제품의 역할부터 제형, 임상 수치와 사용 순서까지.": ["Benefits, textures, study results and routine steps.", "产品作用、质地、测试结果与使用顺序。", "製品の役割・質感・試験結果・使用順序まで。"], "전제품 10종": ["All 10 products", "全部10款产品", "全10製品"], "고민별 추천": ["By skin concern", "按肌肤需求推荐", "肌悩み別おすすめ"], "전체": ["All", "全部", "すべて"], "약국 판매하한가": ["Minimum pharmacy retail price", "药房最低零售价", "薬局販売下限価格"], "1개 기준 · 부가세 포함": ["Per item · VAT included", "单件价格 · 含税", "1点あたり・税込"], "제품 자세히 보기": ["View product details", "查看产品详情", "製品詳細を見る"], "이 제품 링크 복사": ["Copy product link", "复制产品链接", "製品リンクをコピー"], "스킨케어의 기본, 세정": ["Skincare starts with cleansing", "护肤始于清洁", "スキンケアの基本、洗浄"], "클렌징밀크 · 세정부터": ["Cleansing milk · First step", "洁面乳 · 清洁第一步", "クレンジングミルク・洗浄から"], "좋은 스킨케어의 시작은, 꼼꼼한 세정.": ["Good skincare starts with thorough cleansing.", "良好的护肤从认真清洁开始。", "丁寧な洗浄から始めるスキンケア。"], "클렌징밀크 단독 케어": ["Cleansing milk care", "洁面乳护理", "クレンジングミルクケア"], "이렇게 설명해 보세요": ["A simple explanation", "简明介绍", "説明のポイント"], "추천 구성 한눈에 보기": ["Routine at a glance", "推荐组合一览", "おすすめの組み合わせ"], "두 제품 병행 · 1회 사용 직후": ["Both products together · Immediately after one use", "两款产品搭配 · 使用1次后即刻", "2製品併用・1回使用直後"], "광채 · 탄력 · 주름": ["Glow · Firmness · Wrinkles", "光泽 · 弹力 · 皱纹", "ツヤ・ハリ・シワ"], "피지 관리 · 가벼운 보습": ["Sebum care · Light hydration", "皮脂管理 · 轻盈保湿", "皮脂ケア・軽い保湿"], "피부 쿨링 · 수분": ["Cooling · Hydration", "清凉护理 · 补水", "クーリング・うるおい"], "장벽 케어 · 보습": ["Barrier care · Moisture", "屏障护理 · 保湿", "バリアケア・保湿"], "닫기 ×": ["Close ×", "关闭 ×", "閉じる ×"], "피지·트러블 (여드름성)": ["Sebum & blemish-prone skin", "皮脂·易长痘肌肤", "皮脂・肌トラブル（ニキビ肌）"], "시술 후, 회복&보습": ["Post-treatment moisture care", "术后保湿护理", "施術後の保湿ケア"], "열감·붉어짐": ["Heat & redness", "热感·泛红", "熱感・赤み"], "광채 탄력 주름케어관리": ["Glow, firmness & wrinkle care", "光泽、弹力与皱纹护理", "ツヤ・ハリ・シワケア"]});
 const dict=window.SIORE_LANGUAGES, languages=['ko','en','zh','ja'];
 const storageKey=document.documentElement.dataset.edition==='global'?'siore-global-language':'siore-pharmacy-language';
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
 document.querySelector('header').append(selector());

 render();
})();
