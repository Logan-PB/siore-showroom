/* Shared, offline price-card renderer. No analytics or network requests. */
const priceCatalog=[
['NMN 하이드로 캡슐 클렌징 밀크','150 mL',38000,33000],['NMN 프레쉬 버블 토너','145 mL',38000,30000],['NMN 인텐시브 세럼','50 mL',44000,35000],['NMN 하이드레이팅 수딩 크림','50 mL',32000,27000],['NMN 딥 글로우 리치크림','50 mL',44000,35000],['데일리 릴리프 에센스 토너','150 mL',39000,33000],['데일리 릴리프 리페어 앰플','30 mL',35000,30000],['데일리 릴리프 카밍 수딩 젤','80 mL',35000,30000],['데일리 릴리프 컴포트 크림','50 mL',39000,33000],['마시는 PDRN 200 어드밴스드','15 g × 15포',40000,33500]
];
function validPricePayload(p){return p&&p.v===1&&Array.isArray(p.prices)&&p.prices.length===priceCatalog.length&&p.prices.every(n=>Number.isSafeInteger(n)&&n>=0&&n<=1000000)&&typeof p.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(p.date);}
const priceAssetBase=new URL('price-products/',document.currentScript.src).href;
let pricePhotoPromise;
function loadPricePhotos(){return pricePhotoPromise??=Promise.all(priceCatalog.map((_,i)=>new Promise((resolve,reject)=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>reject(Error('제품 사진을 불러오지 못했습니다. 다시 시도해 주세요.'));im.src=priceAssetBase+i+'.png'})))}
async function makePriceCanvas(payload){
 if(!validPricePayload(payload))throw Error('올바르지 않은 단가표입니다.');
 const photos=await loadPricePhotos();await document.fonts.ready;
 const c=document.createElement('canvas');c.width=1654;c.height=2339;const x=c.getContext('2d');
 x.fillStyle='#f7f2eb';x.fillRect(0,0,c.width,c.height);x.fillStyle='#221a15';x.fillRect(0,0,c.width,275);
 x.fillStyle='#e8ad89';x.font='24px sans-serif';x.fillText('SIORÉ / PHARMACY PARTNERS',75,76);
 x.fillStyle='#fff';x.font='bold 62px sans-serif';x.fillText('SKU 공급단가표',75,165);
 x.fillStyle='#d2bead';x.font='24px sans-serif';x.fillText('작성일 '+payload.date+'  ·  제품 1개 기준  ·  부가세 포함',75,224);
 const money=n=>n.toLocaleString('ko-KR')+'원';
 x.fillStyle='#845039';x.font='bold 25px sans-serif';x.fillText('제품 / 용량',220,326);x.textAlign='right';x.fillText('소비자가',1100,326);x.fillText('공급가',1310,326);x.fillText('약국 판매하한가',1570,326);
 let y=357;
 priceCatalog.forEach((row,i)=>{
  if(i===0||i===5||i===9){x.fillStyle=i===0?'#dec2ad':i===5?'#cbd7cf':'#ded2bb';x.fillRect(65,y,1524,53);x.textAlign='left';x.fillStyle='#3a3027';x.font='bold 25px sans-serif';x.fillText(i===0?'01  NMN LINE · 엔엠엔':i===5?'02  DAILY RELIEF · 데일리 릴리프':'03  INNER BEAUTY · 이너뷰티',85,y+35);y+=53;}
  x.fillStyle=i%2?'#f0e7dc':'#fffaf4';x.fillRect(65,y,1524,145);
  const im=photos[i],scale=Math.min(116/im.naturalWidth,119/im.naturalHeight);x.drawImage(im,82+(116-im.naturalWidth*scale)/2,y+13+(119-im.naturalHeight*scale)/2,im.naturalWidth*scale,im.naturalHeight*scale);
  x.textAlign='left';x.fillStyle='#30271f';x.font='bold 28px sans-serif';x.fillText(row[0],220,y+64,680);x.fillStyle='#8a7362';x.font='23px sans-serif';x.fillText(row[1],220,y+103);
  x.textAlign='right';x.fillStyle='#76665a';x.font='26px sans-serif';x.fillText(money(row[2]),1100,y+84);x.fillStyle='#b54b27';x.font='bold 32px sans-serif';x.fillText(money(payload.prices[i]),1310,y+84);x.fillStyle='#524534';x.font='bold 29px sans-serif';x.fillText(money(row[3]),1570,y+84);y+=145;
 });
 x.textAlign='left';x.fillStyle='#514032';x.font='bold 28px sans-serif';x.fillText('모든 가격은 부가세 포함 가격입니다.',75,2044);
 x.fillStyle='#85705e';x.font='23px sans-serif';x.fillText('최종 거래 조건과 주문 구성은 주문 전 확인해 주세요.',75,2088);
 x.fillStyle='#2a2018';x.fillRect(65,2150,1524,120);x.fillStyle='#ddbea5';x.font='23px sans-serif';x.fillText('약국 전용 B2B 주문몰',95,2197);x.fillStyle='#fff3e7';x.font='bold 35px sans-serif';x.fillText('https://siorekorea.co.kr',95,2246);
 return c;
}
function downloadPriceCanvas(canvas){const a=document.createElement('a');a.href=canvas.toDataURL('image/png');a.download='SIORE_SKU_공급단가표.png';a.click();}
