(function () {
  const products = typeof skuProducts !== "undefined" && Array.isArray(skuProducts) ? skuProducts : [];
  const picks = [0, 1, 2, 7];
  const claims = {
    ko: [
      ["당김 없이 부드러운 세정", "미세먼지 세정 99.55% · 1회 사용"],
      ["수분과 광채를 한 번에", "수분 +148.70% · 광채 +403.37% · 1회 사용"],
      ["탄력과 주름 집중 케어", "입가주름 −13.60% · 겉탄력 +6.97% · 4주"],
      ["열감은 낮추고, 피부는 편안하게", "즉각 보습 +76.04% · 수분손실 −15.42% · 1회 사용"]
    ],
    en: [
      ["Gentle cleanse. No tightness.", "99.55% fine-dust cleansing · after 1 use"],
      ["Hydration and glow, together.", "+148.70% hydration · +403.37% glow · after 1 use"],
      ["Firmness and wrinkle care.", "−13.60% mouth-area wrinkles · +6.97% firmness · 4 weeks"],
      ["Cool heat. Calm skin.", "+76.04% instant hydration · −15.42% water loss · after 1 use"]
    ],
    zh: [
      ["温和净澈，不紧绷", "微尘清洁 99.55% · 使用1次后"],
      ["水润与光泽，一步到位", "水分 +148.70% · 光泽 +403.37% · 使用1次后"],
      ["集中改善弹性与细纹", "嘴角纹 −13.60% · 表层弹性 +6.97% · 4周"],
      ["舒缓热感，安抚肌肤", "即时保湿 +76.04% · 水分流失 −15.42% · 使用1次后"]
    ],
    ja: [
      ["つっぱらず、やさしく洗う", "微細ほこり洗浄 99.55% · 1回使用後"],
      ["うるおいとツヤを同時に", "水分 +148.70% · ツヤ +403.37% · 1回使用後"],
      ["ハリとシワの集中ケア", "口元のシワ −13.60% · 表面弾力 +6.97% · 4週間"],
      ["ほてりを抑え、肌を心地よく", "即時保湿 +76.04% · 水分損失 −15.42% · 1回使用後"]
    ]
  };
  let dominoTimer = 0;
  let dominoIndex = 0;

  function safe(value) {
    return String(value || "").replace(/[&<>\"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }

  function pumpFocus(product) {
    return `<div class="sku-head-focus sku-head-pump" aria-hidden="true"><svg viewBox="0 0 420 430">
      <g class="sku-focus-body"><image href="${safe(product.image)}" x="0" y="0" width="420" height="430" preserveAspectRatio="xMidYMid meet"/></g>
      <rect class="sku-cap-cover" x="132" y="24" width="158" height="145" rx="28"/>
      <g class="sku-real-pump"><rect x="177" y="111" width="66" height="38" rx="10"/><path d="M186 115 H243 Q256 115 256 127 V134 H230 V128 H186Z"/></g>
      <g class="sku-focus-cap"><rect x="164" y="50" width="96" height="108" rx="25"/><path d="M176 66 Q211 51 247 66"/></g>
    </svg></div>`;
  }

  function gelFocus(product) {
    return `<div class="sku-head-focus sku-head-gel" aria-hidden="true"><svg viewBox="0 0 420 430">
      <g class="sku-focus-body"><image href="${safe(product.image)}" x="0" y="0" width="420" height="430" preserveAspectRatio="xMidYMid meet"/></g>
      <rect class="sku-cap-cover" x="171" y="360" width="79" height="70" rx="13"/>
      <g class="sku-gel-nozzle"><rect x="196" y="354" width="28" height="25" rx="6"/></g>
      <g class="sku-focus-cap sku-gel-cap"><rect x="171" y="364" width="79" height="62" rx="13"/><path d="M178 374 H243"/></g>
    </svg></div>`;
  }

  function stage(product, order) {
    const gel = product.id === 7;
    return `<div class="sku-domino-stage ${gel ? "is-gel" : "is-pump"}">
      <img class="sku-full-product" src="${safe(product.image)}" alt="${safe(product.name)}">
      <div class="sku-texture-clean" aria-hidden="true"><img src="${safe(product.textureImage)}" alt=""></div>
      <div class="sku-texture-claim" data-claim-index="${order}"><b></b><span></span></div>
    </div>`;
  }

  function updateClaims(cards) {
    const lang = document.documentElement.dataset.language || new URLSearchParams(location.search).get("lang") || "en";
    const list = claims[lang] || claims.en;
    cards.forEach(function (card, index) {
      const claim = card.querySelector(".sku-texture-claim");
      if (claim) {
        claim.querySelector("b").textContent = list[index][0];
        claim.querySelector("span").textContent = list[index][1];
      }
    });
  }

  function stopDomino(cards) {
    window.clearTimeout(dominoTimer);
    cards.forEach(function (card) { card.classList.remove("is-domino-active"); });
  }

  function playDomino(cards, screen) {
    stopDomino(cards);
    dominoIndex = 0;
    const next = function () {
      cards.forEach(function (card) { card.classList.remove("is-domino-active"); });
      if (!screen.classList.contains("active")) return;
      const card = cards[dominoIndex];
      void card.offsetWidth;
      card.classList.add("is-domino-active");
      dominoIndex = (dominoIndex + 1) % cards.length;
      dominoTimer = window.setTimeout(next, 4500);
    };
    next();
  }

  function mount() {
    const grid = document.querySelector("#featured-skus");
    if (!grid || grid.dataset.dominoMounted === "true") return;
    const cards = Array.from(grid.querySelectorAll(".sku-tile"));
    if (cards.length !== picks.length) return;
    grid.dataset.dominoMounted = "true";
    cards.forEach(function (card, order) {
      const product = products[picks[order]];
      const visual = card.querySelector(".sku-visual");
      if (!product || !visual) return;
      const swatch = card.querySelector(":scope > .sku-swatch");
      if (swatch) swatch.hidden = true;
      visual.innerHTML = stage(product, order);
      visual.classList.add("sku-domino-motion");
    });
    updateClaims(cards);
    new MutationObserver(function () { updateClaims(cards); }).observe(document.documentElement, { attributes: true, attributeFilter: ["data-language"] });
    const screen = grid.closest(".screen");
    const sync = function () {
      if (screen && screen.classList.contains("active")) playDomino(cards, screen);
      else stopDomino(cards);
    };
    if (screen) new MutationObserver(sync).observe(screen, { attributes: true, attributeFilter: ["class"] });
    sync();
  }

  const observer = new MutationObserver(mount);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount);
  else mount();
})();
