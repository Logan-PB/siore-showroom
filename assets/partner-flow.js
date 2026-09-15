function supplyPrice(p){if(supplyMode!=='custom'&&p[0].startsWith('마시는 PDRN'))return supplyMode==='vip'?13600:16800;return Math.round(p[2]*supplyRate/100)}
const influencerRequestUrl='https://docs.google.com/forms/d/e/1FAIpQLSf9Fs_Srsn04sd9LNjyPbydjHFPa-yso2rWGgcAtYC-u_oZkA/viewform';
const priceViewerUrl='https://logan-pb.github.io/siore-price-card/';
async function copyTextButton(url,button){try{await navigator.clipboard.writeText(url);const old=button.textContent;button.textContent='복사 완료';setTimeout(()=>button.textContent=old,1600)}catch{prompt('아래 링크를 복사해 주세요.',url)}}
function copyPartnerLink(type,button){return copyTextButton(type==='form'?influencerRequestUrl:'https://k.link-pb.com/home',button)}
function openVmd(){stopAuto();selectVmd(0);document.getElementById('vmd-gallery').showModal()}
function selectVmd(i){document.querySelectorAll('.vmd-tabs button').forEach((b,n)=>b.setAttribute('aria-pressed',i===n));document.getElementById('vmd-gallery-content').innerHTML=i===0?'<img class="vmd-gallery-image" src="assets/vmd-setting.jpg" alt="시오레 실제 VMD 세팅 사진">':'<div class="vmd-empty"><h4>일반 RRP 진열</h4><p>진열 사진 준비 중</p></div>'}
let supplyMode="partner",supplyRate=50,settingsApplied=false;

function renderPrices(){document.getElementById('price-rows').innerHTML=priceCatalog.map(p=>`<tr><td>${p[0]}</td><td>${p[1]}</td><td>${p[2].toLocaleString('ko-KR')}원</td><td>${supplyRate===null&&!p[0].startsWith('마시는 PDRN')?'상담 후 안내':supplyPrice(p).toLocaleString('ko-KR')+'원'}</td><td>${p[3].toLocaleString('ko-KR')}원</td></tr>`).join('');document.getElementById('price-save').disabled=supplyRate===null;document.getElementById('price-share').disabled=supplyRate===null;document.getElementById('price-status').textContent=supplyRate===null?'공급 조건은 담당자에게 문의해 주세요.':'';}
function openPrices(){stopAuto();renderPrices();document.getElementById('rate-dialog').close();document.getElementById('price-dialog').showModal()}
function editRate(){document.getElementById('supply-mode').value=supplyMode;document.getElementById('supply-rate').value=supplyMode==='custom'?supplyRate:'';document.getElementById('rate-error').textContent='';changeSupplyMode();document.getElementById('rate-dialog').showModal();document.getElementById('supply-mode').focus()}
function changeSupplyMode(){const mode=document.getElementById('supply-mode').value;document.getElementById('custom-rate-field').hidden=mode!=='custom';document.getElementById('rate-help').textContent=mode==='partner'?'소비자가 × 50% · PDRN 16,800원':mode==='vip'?'소비자가 × 43% · PDRN 13,600원':'PDRN을 포함한 전체 10종에 입력한 비율을 적용합니다.'}
function applySupplyRate(){const mode=document.getElementById('supply-mode').value;const n=mode==='partner'?50:mode==='vip'?43:Number(document.getElementById('supply-rate').value);if(!['partner','vip','custom'].includes(mode)||!Number.isFinite(n)||n<=0||n>100){document.getElementById('rate-error').textContent='공급률은 0보다 크고 100 이하로 입력해 주세요.';return}supplyMode=mode;supplyRate=n;settingsApplied=true;document.getElementById('rate-dialog').close();renderPrices()}
function clearSupplyRate(){supplyMode='partner';supplyRate=50;settingsApplied=false;document.getElementById('rate-dialog').close();renderPrices()}
function pricePayload(){if(supplyRate===null)throw Error('공급률을 먼저 설정해 주세요.');return {v:1,date:new Date().toLocaleDateString('sv-SE'),prices:priceCatalog.map(p=>supplyPrice(p))}}
function currentPriceLink(){return priceViewerUrl+'#'+encodeURIComponent(JSON.stringify(pricePayload()))}
async function savePriceImage(){await document.fonts.ready;downloadPriceCanvas(await makePriceCanvas(pricePayload()))}
async function showPriceShare(){await document.fonts.ready;document.getElementById('price-image').src=(await makePriceCanvas(pricePayload())).toDataURL('image/png');const qr=qrcode(0,'M');qr.addData(currentPriceLink());qr.make();document.getElementById('price-qr').innerHTML=qr.createSvgTag(4,16);document.getElementById('price-share-dialog').showModal()}
function copyPriceLink(b){return copyTextButton(currentPriceLink(),b)}
const priceTitle=document.getElementById('price-title');
priceTitle.addEventListener('click',editRate);
document.addEventListener('keydown',e=>{if(e.altKey&&e.key.toLowerCase()==='p'){e.preventDefault();if(!document.getElementById('price-dialog').open)openPrices();editRate()}});
document.addEventListener('keydown',e=>{if(document.querySelector('#price-dialog[open],#price-share-dialog[open],#vmd-gallery[open]')){if(e.key.startsWith('Arrow'))e.stopImmediatePropagation()}},true);
