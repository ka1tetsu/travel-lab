// ============================================================
// Travel Lab - Results Page Logic
// ============================================================

let currentHotels = [];
let favorites = JSON.parse(localStorage.getItem("tl_favorites") || "[]");

document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const query = params.get("q") || "";
  const checkin = params.get("checkin") || "";
  const checkout = params.get("checkout") || "";
  const adults = parseInt(params.get("adults") || "2");
  const children = parseInt(params.get("children") || "0");
  const rooms = parseInt(params.get("rooms") || "1");

  // Display search summary
  renderSearchSummary({ query, checkin, checkout, adults, children, rooms });

  showLoading();
  (async () => {
    try {
      // 楽天APIからホテル情報を非同期取得 (日付も渡す)
      const apiData = await fetchRakutenHotels(query, checkin, checkout);

      if (apiData && apiData.length > 0) {
        // 取得したデータをフロントの表示フォーマットにマッピング（実際のホテル画像等を含む）
        currentHotels = mapRakutenToTravelLab(apiData, query, { checkin, checkout, adults, rooms });
      } else {
        // API結果が0件、もしくはエラーの場合はローカルのモックデータへフォールバック
        console.warn("APIからデータが取得できませんでした。モックデータにフォールバックします。");
        currentHotels = filterHotelsByQuery(query);
      }
    } catch (error) {
      console.error("API検索中にエラーが発生しました:", error);
      currentHotels = filterHotelsByQuery(query);
    }

    hideLoading();
    renderResults(currentHotels, { checkin, checkout, adults, rooms });
    updateCount(currentHotels.length);
  })();

  // Sort buttons
  document.querySelectorAll(".sort-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".sort-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      sortAndRender(btn.dataset.sort, { checkin, checkout, adults, rooms });
    });
  });

  // Filters
  document.getElementById("apply-filters")?.addEventListener("click", () => {
    applyFilters({ checkin, checkout, adults, rooms });
  });
  document.getElementById("reset-filters")?.addEventListener("click", () => {
    resetFilters({ checkin, checkout, adults, rooms });
  });

  // Price range slider
  const slider = document.getElementById("price-max");
  const sliderVal = document.getElementById("price-max-val");
  if (slider && sliderVal) {
    slider.addEventListener("input", () => {
      sliderVal.textContent = Number(slider.value).toLocaleString();
    });
  }
});

function filterHotelsByQuery(query) {
  if (!query) return HOTELS;
  const q = query.toLowerCase();
  return HOTELS.filter(h =>
    h.area.includes(query) ||
    h.name.toLowerCase().includes(q) ||
    h.address.includes(query) ||
    h.category.includes(query)
  );
}

function sortHotels(hotels, sortKey) {
  const sorted = [...hotels];
  if (sortKey === "price-asc") {
    sorted.sort((a, b) => getMinPrice(a) - getMinPrice(b));
  } else if (sortKey === "price-desc") {
    sorted.sort((a, b) => getMinPrice(b) - getMinPrice(a));
  } else if (sortKey === "rating") {
    sorted.sort((a, b) => b.rating - a.rating);
  } else if (sortKey === "reviews") {
    sorted.sort((a, b) => b.reviewCount - a.reviewCount);
  }
  return sorted;
}

function sortAndRender(sortKey, opts) {
  const filtered = applyCurrentFilters(currentHotels);
  const sorted = sortHotels(filtered, sortKey);
  const list = document.getElementById("hotel-list");
  if (list) list.innerHTML = sorted.map(h => buildHotelCard(h, opts)).join("");
  attachCardEvents();
  updateCount(sorted.length);
}

function applyFilters(opts) {
  const filtered = applyCurrentFilters(currentHotels);
  const sortKey = document.querySelector(".sort-btn.active")?.dataset.sort || "price-asc";
  const sorted = sortHotels(filtered, sortKey);
  const list = document.getElementById("hotel-list");
  if (list) list.innerHTML = sorted.map(h => buildHotelCard(h, opts)).join("");
  attachCardEvents();
  updateCount(sorted.length);
}

function applyCurrentFilters(hotels) {
  const maxPrice = parseInt(document.getElementById("price-max")?.value || "999999");
  const meal = document.querySelector(".meal-btn.active")?.dataset.meal || "all";
  const amenities = Array.from(document.querySelectorAll(".amenity-check:checked")).map(c => c.value);

  return hotels.filter(h => {
    const minP = getMinPrice(h);
    if (minP > maxPrice) return false;
    if (meal !== "all") {
      const hasMeal = Object.values(h.prices).some(p => p.price !== null && p.mealPlan === meal);
      if (!hasMeal) return false;
    }
    if (amenities.length > 0) {
      const hasAll = amenities.every(a => h.amenities.includes(a));
      if (!hasAll) return false;
    }
    return true;
  });
}

function resetFilters(opts) {
  const slider = document.getElementById("price-max");
  const sliderVal = document.getElementById("price-max-val");
  if (slider) slider.value = slider.max;
  if (sliderVal) sliderVal.textContent = Number(slider?.max || 99999).toLocaleString();
  document.querySelectorAll(".meal-btn").forEach(b => b.classList.remove("active"));
  document.querySelector(".meal-btn[data-meal='all']")?.classList.add("active");
  document.querySelectorAll(".amenity-check").forEach(c => (c.checked = false));
  renderResults(currentHotels, opts);
  updateCount(currentHotels.length);
}

function renderSearchSummary({ query, checkin, checkout, adults, children, rooms }) {
  const el = document.getElementById("search-summary");
  if (!el) return;
  const ci = checkin ? formatJpDate(checkin) : "—";
  const co = checkout ? formatJpDate(checkout) : "—";
  const nights = checkin && checkout ? calcNights(checkin, checkout) : 1;
  const displayQuery = query.includes(",") ? "現在地周辺" : (query || "全エリア");
  el.innerHTML = `
    <span class="summary-item"><span class="summary-icon">📍</span><strong>${displayQuery}</strong></span>
    <span class="summary-sep">|</span>
    <span class="summary-item"><span class="summary-icon">📅</span>${ci} <span class="night-badge">${nights}泊</span> ${co}</span>
    <span class="summary-sep">|</span>
    <span class="summary-item"><span class="summary-icon">👤</span>大人${adults}名${children > 0 ? `・子供${children}名` : ""} / ${rooms}室</span>
  `;
}

function renderResults(hotels, opts) {
  const sorted = sortHotels(hotels, "price-asc");
  const list = document.getElementById("hotel-list");
  if (!list) return;

  if (sorted.length === 0) {
    list.innerHTML = `<div class="no-results" style="padding: 40px 20px; text-align: center; border-radius: 12px; background: #fff; box-shadow: 0 4px 15px rgba(0,0,0,0.05); border: 1px solid #eee; margin: 20px 0;">
      <div class="no-results-icon" style="font-size: 3rem; margin-bottom: 20px;">🔍</div>
      <h3 style="color: #333; margin-bottom: 10px;">近隣に条件を満たすホテルが見つかりませんでした</h3>
      <p style="color: #666; font-size: 0.95rem; line-height: 1.6;">
        以下の理由が考えられます：<br>
        ・指定した場所にホテルが存在しないか、満室になっています。<br>
        ・検索キーワードがニッチすぎる可能性があります。<br>
        お手数ですが、「エリア名（例: 新宿、箱根）」のみに変更するか、日程を変更して再度お試しください。
      </p>
      <button onclick="window.location.href='index.html'" style="margin-top:20px; padding: 10px 20px; background: var(--primary); color: white; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">トップページに戻る</button>
    </div>`;
    return;
  }

  list.innerHTML = sorted.map(h => buildHotelCard(h, opts)).join("");
  attachCardEvents();
}

function buildHotelCard(hotel, { checkin, checkout, adults, rooms } = {}) {
  const minPrice = getMinPrice(hotel);
  const cheapSite = getCheapestSite(hotel);
  const nights = checkin && checkout ? calcNights(checkin, checkout) : 1;
  const isFav = favorites.includes(hotel.id);
  const stars = "★".repeat(hotel.stars) + "☆".repeat(5 - hotel.stars);

  const priceRows = Object.entries(hotel.prices).map(([site, data]) => {
    const cfg = SITE_CONFIG[site];
    if (!data.price) {
      return `<div class="price-row price-na">
        <div class="site-label" style="color:${cfg.color}">
          <span class="site-dot" style="background:${cfg.color}"></span>${cfg.name}
        </div>
        <div class="price-unavailable">取扱なし</div>
      </div>`;
    }
    const isCheap = site === cheapSite;
    const totalPrice = data.price * nights * rooms;
    return `<div class="price-row ${isCheap ? "cheapest" : ""}">
      <div class="site-label" style="color:${cfg.color}">
        <span class="site-dot" style="background:${cfg.color}"></span>${cfg.name}
        ${isCheap ? '<span class="cheapest-badge">最安値</span>' : ""}
      </div>
      <div class="price-col">
        <div class="price-per-night">¥${data.price.toLocaleString()}<span class="per-night">/泊</span></div>
        ${nights > 1 ? `<div class="price-total">合計 ¥${totalPrice.toLocaleString()}</div>` : ""}
        <div class="meal-tag">${data.mealPlan}</div>
      </div>
      <a href="${buildAffiliateUrl(data.url, { checkin, checkout, adults, rooms, hotelId: hotel.id })}" 
         class="book-btn ${isCheap ? "book-btn-primary" : "book-btn-secondary"}"
         target="_blank" rel="noopener noreferrer" 
         data-site="${site}" data-hotel="${hotel.id}">
        予約する
      </a>
    </div>`;
  }).join("");

  const amenityTags = hotel.amenities.map(a => {
    const info = AMENITY_ICONS[a] || { icon: "✓", label: a };
    return `<span class="amenity-tag"><span>${info.icon}</span>${info.label}</span>`;
  }).join("");

  return `
  <article class="hotel-card" data-id="${hotel.id}">
    <div class="hotel-card-inner">
      <div class="hotel-image-wrap">
        <img src="${hotel.image}" alt="${hotel.name}" class="hotel-image" loading="lazy">
        <div class="hotel-overlay">
          <span class="hotel-category">${hotel.category}</span>
          <button class="fav-btn ${isFav ? "fav-active" : ""}" data-id="${hotel.id}" aria-label="お気に入り">
            ${isFav ? "♥" : "♡"}
          </button>
        </div>
      </div>
      <div class="hotel-info">
        <div class="hotel-header">
          <div>
            <div class="hotel-stars">${stars}</div>
            <h2 class="hotel-name">${hotel.name}</h2>
            <div class="hotel-address">📍 ${hotel.address}</div>
          </div>
          <div class="hotel-rating-block">
            <div class="rating-score">${hotel.rating}</div>
            <div class="rating-label">クチコミ</div>
            <div class="review-count">${hotel.reviewCount.toLocaleString()}件</div>
          </div>
        </div>
        <p class="hotel-desc">${hotel.description}</p>
        <div class="amenity-row">${amenityTags}</div>
        <div class="price-table">
          <div class="price-table-header">
            <span>比較サイト</span>
            <span>1泊料金</span>
            <span></span>
          </div>
          ${priceRows}
        </div>
        <div class="card-footer">
          <div class="min-price-summary">
            <span class="min-label">最安値</span>
            <span class="min-price">¥${minPrice.toLocaleString()}<span class="min-per">/泊</span></span>
          </div>
        </div>
      </div>
    </div>
  </article>`;
}

function attachCardEvents() {
  // Favorite buttons
  document.querySelectorAll(".fav-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const id = parseInt(btn.dataset.id);
      if (favorites.includes(id)) {
        favorites = favorites.filter(f => f !== id);
        btn.textContent = "♡";
        btn.classList.remove("fav-active");
      } else {
        favorites.push(id);
        btn.textContent = "♥";
        btn.classList.add("fav-active");
      }
      localStorage.setItem("tl_favorites", JSON.stringify(favorites));
    });
  });

  // Track affiliate clicks
  document.querySelectorAll(".book-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const site = btn.dataset.site;
      const hotel = btn.dataset.hotel;
      console.log(`[Analytics] Affiliate click: site=${site}, hotel=${hotel}`);
    });
  });

  // Meal filter buttons
  document.querySelectorAll(".meal-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".meal-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    });
  });
}

function buildAffiliateUrl(baseUrl, { checkin, checkout, adults, rooms, hotelId }) {
  if (!baseUrl) return "#";
  const url = new URL(baseUrl);
  if (checkin) url.searchParams.set("checkin", checkin);
  if (checkout) url.searchParams.set("checkout", checkout);
  url.searchParams.set("adults", adults || 2);
  url.searchParams.set("rooms", rooms || 1);
  url.searchParams.set("utm_source", "travellab");
  url.searchParams.set("utm_medium", "metasearch");
  url.searchParams.set("utm_campaign", `hotel_${hotelId}`);
  return url.toString();
}

function showLoading() {
  document.getElementById("loading-overlay")?.style && (document.getElementById("loading-overlay").style.display = "flex");
  document.getElementById("hotel-list")?.style && (document.getElementById("hotel-list").style.display = "none");
}
function hideLoading() {
  document.getElementById("loading-overlay")?.style && (document.getElementById("loading-overlay").style.display = "none");
  document.getElementById("hotel-list")?.style && (document.getElementById("hotel-list").style.display = "block");
}
function updateCount(n) {
  const el = document.getElementById("result-count");
  if (el) el.textContent = `${n}件のホテルが見つかりました`;
}
function formatJpDate(str) {
  const d = new Date(str);
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}
function calcNights(checkin, checkout) {
  const a = new Date(checkin), b = new Date(checkout);
  return Math.max(1, Math.round((b - a) / 86400000));
}
