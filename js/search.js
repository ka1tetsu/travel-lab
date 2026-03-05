// ============================================================
// Travel Lab - Search Form Logic (index.html)
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
    // --- Set default dates ---
    const today = new Date();
    const tomorrow = new Date(today);
    const dayAfter = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    dayAfter.setDate(today.getDate() + 2);

    const checkinEl = document.getElementById("checkin");
    const checkoutEl = document.getElementById("checkout");

    if (checkinEl && checkoutEl) {
        checkinEl.value = formatDate(tomorrow);
        checkoutEl.value = formatDate(dayAfter);
        checkinEl.min = formatDate(today);
        checkoutEl.min = formatDate(tomorrow);

        checkinEl.addEventListener("change", () => {
            const newMin = new Date(checkinEl.value);
            newMin.setDate(newMin.getDate() + 1);
            checkoutEl.min = formatDate(newMin);
            if (new Date(checkoutEl.value) <= new Date(checkinEl.value)) {
                checkoutEl.value = formatDate(newMin);
            }
        });
    }

    // --- Search form submit ---
    const form = document.getElementById("search-form");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let destination = document.getElementById("destination").value.trim();
            const checkin = document.getElementById("checkin").value;
            const checkout = document.getElementById("checkout").value;
            const adults = document.getElementById("adults").value;
            const children = document.getElementById("children").value;
            const rooms = document.getElementById("rooms").value;

            // 検索窓が空の場合はおすすめを設定
            if (!destination) {
                destination = "おすすめ";
            }
            if (!checkin || !checkout) {
                showError("チェックイン・チェックアウト日を選択してください");
                return;
            }

            const params = new URLSearchParams({
                q: destination,
                checkin,
                checkout,
                adults,
                children,
                rooms,
            });

            window.location.href = `results.html?${params.toString()}`;
        });
    }

    // --- Quick destination buttons ---
    document.querySelectorAll(".quick-dest").forEach((btn) => {
        btn.addEventListener("click", () => {
            const dest = document.getElementById("destination");
            if (dest) {
                dest.value = btn.dataset.dest;
                // Animate
                dest.classList.add("flash");
                setTimeout(() => dest.classList.remove("flash"), 600);
            }
        });
    });

    // --- Geolocation ---
    const geoBtn = document.getElementById("btn-geolocation");
    if (geoBtn) {
        geoBtn.addEventListener("click", () => {
            if ("geolocation" in navigator) {
                geoBtn.innerHTML = "⏳ 取得中...";
                geoBtn.disabled = true;
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const dest = document.getElementById("destination");
                        if (dest) {
                            // api.js側でカンマ区切りを緯度経度として扱うようにしているため、カンマ区切りでセットする
                            dest.value = `${lat},${lng}`;
                            dest.classList.add("flash");
                            setTimeout(() => dest.classList.remove("flash"), 600);
                        }
                        geoBtn.innerHTML = "📍 現在地";
                        geoBtn.disabled = false;
                    },
                    (error) => {
                        console.error("Geolocation error:", error);
                        showError("位置情報を取得できませんでした。ブラウザの設定をご確認ください。");
                        geoBtn.innerHTML = "📍 現在地";
                        geoBtn.disabled = false;
                    },
                    { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
                );
            } else {
                showError("お使いのブラウザは位置情報取得に対応していません。");
            }
        });
    }

    // --- Destination suggestions ---
    const SUGGESTIONS = ["東京", "京都", "大阪", "沖縄", "北海道", "函館", "横浜", "奈良", "神戸", "福岡", "箱根", "軽井沢", "札幌", "仙台", "広島"];
    const destInput = document.getElementById("destination");
    const suggBox = document.getElementById("suggestions");

    if (destInput && suggBox) {
        destInput.addEventListener("input", () => {
            const val = destInput.value.trim();
            if (!val) { suggBox.style.display = "none"; return; }
            const matches = SUGGESTIONS.filter(s => s.includes(val));
            if (matches.length === 0) { suggBox.style.display = "none"; return; }
            suggBox.innerHTML = matches.map(m => `<div class="sugg-item" data-val="${m}">${m}</div>`).join("");
            suggBox.style.display = "block";
        });

        suggBox.addEventListener("click", (e) => {
            if (e.target.classList.contains("sugg-item")) {
                destInput.value = e.target.dataset.val;
                suggBox.style.display = "none";
            }
        });

        document.addEventListener("click", (e) => {
            if (!destInput.contains(e.target) && !suggBox.contains(e.target)) {
                suggBox.style.display = "none";
            }
        });
    }
});

function formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

function showError(msg) {
    const err = document.getElementById("search-error");
    if (err) {
        err.textContent = msg;
        err.style.display = "block";
        setTimeout(() => (err.style.display = "none"), 3000);
    }
}
