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
            // 先に進む前に現在のデフォルト値を取得
            let checkin = document.getElementById("checkin").value;
            let checkout = document.getElementById("checkout").value;
            let adults = document.getElementById("adults").value;
            let children = document.getElementById("children").value;
            let rooms = document.getElementById("rooms").value;

            // --- 自然言語解析 (NLU) 日付・人数の抽出 ---
            const today = new Date();

            // 抽出と置換処理用ヘルパー
            const extractAndRemove = (pattern, callback) => {
                const match = destination.match(pattern);
                if (match) {
                    callback(match);
                    destination = destination.replace(pattern, " ").replace(/\s+/g, " ").trim();
                }
            };

            // 1. 人数の抽出
            extractAndRemove(/(?:大人)?([1-9１-９])(?:人|名)/, (m) => {
                adults = parseInt(m[1].replace(/[１-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0)));
            });
            extractAndRemove(/カップル|ふたり|夫婦/, () => { adults = 2; });
            extractAndRemove(/家族|ファミリー/, () => {
                adults = 2;
                children = (parseInt(children) === 0) ? 1 : children; // 家族の場合は子供も追加
            });
            extractAndRemove(/一人|ひとり|ぼっち/, () => { adults = 1; });

            // 2. 日付の抽出 (相対指定)
            extractAndRemove(/今日|本日/, () => {
                const d = new Date(today);
                checkin = formatDate(d);
                d.setDate(d.getDate() + 1);
                checkout = formatDate(d);
            });
            extractAndRemove(/明日|あした/, () => {
                const d = new Date(today);
                d.setDate(d.getDate() + 1);
                checkin = formatDate(d);
                d.setDate(d.getDate() + 1);
                checkout = formatDate(d);
            });
            extractAndRemove(/明後日|あさって/, () => {
                const d = new Date(today);
                d.setDate(d.getDate() + 2);
                checkin = formatDate(d);
                d.setDate(d.getDate() + 1);
                checkout = formatDate(d);
            });
            extractAndRemove(/今週末|週末/, () => {
                const d = new Date(today);
                const dayToFriday = (5 - d.getDay() + 7) % 7 || 7; // 次の(または今の)金曜日
                d.setDate(d.getDate() + dayToFriday);
                checkin = formatDate(d);
                d.setDate(d.getDate() + 2); // 日曜日チェックアウト
                checkout = formatDate(d);
            });
            extractAndRemove(/来週末/, () => {
                const d = new Date(today);
                const dayToFriday = (5 - d.getDay() + 7) % 7 + 7; // 来週の金曜日
                d.setDate(d.getDate() + dayToFriday);
                checkin = formatDate(d);
                d.setDate(d.getDate() + 2); // 日曜日チェックアウト
                checkout = formatDate(d);
            });

            // 3. 日付の抽出 (絶対指定 e.g., "3月15日", "12/5")
            // パターン: (月)月(日)日 または (月)/(日)
            extractAndRemove(/([1-9１-９]{1,2})[月\/]([1-9１-９]{1,2})[日]?/, (m) => {
                const mStr = m[1].replace(/[１-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
                const dStr = m[2].replace(/[１-９]/g, s => String.fromCharCode(s.charCodeAt(0) - 0xFEE0));
                let y = today.getFullYear();
                const month = parseInt(mStr) - 1;
                const date = parseInt(dStr);

                // 指定された日付が過去の場合は来年と解釈する
                let targetDate = new Date(y, month, date);
                if (targetDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
                    targetDate = new Date(y + 1, month, date);
                }

                checkin = formatDate(targetDate);
                targetDate.setDate(targetDate.getDate() + 1); // 1泊とする
                checkout = formatDate(targetDate);
            });


            // 検索窓が空（またはすべて抽出されて空になった）場合はおすすめを設定
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
    const SUGGESTIONS = [
        // 関東
        "東京", "新宿", "渋谷", "浅草", "銀座", "秋葉原", "品川", "池袋", "上野", "お台場",
        "横浜", "みなとみらい", "鎌倉", "箱根", "箱根湯本", "湯河原", "成田", "川越",
        // 関西
        "京都", "嵐山", "祇園", "大阪", "難波", "梅田", "神戸", "有馬温泉", "奈良", "和歌山", "白浜",
        // 北海道・東北
        "北海道", "札幌", "函館", "旭川", "ニセコ", "富良野", "登別", "洞爺湖", "小樽",
        "仙台", "松島", "青森", "弘前", "盛岡", "秋田", "山形", "蔵王", "会津若松",
        // 中部
        "名古屋", "富士山", "河口湖", "熱海", "伊豆", "修善寺", "軽井沢", "白馬", "上高地", "金沢", "白川郷",
        // 九州・沖縄
        "福岡", "博多", "別府", "由布院", "長崎", "熊本", "阿蘇", "鹿児島", "指宿",
        "沖縄", "那覇", "石垣島", "宮古島", "恩納村",
        // その他
        "広島", "宮島", "倉敷", "道後温泉", "草津温泉", "伊香保", "那須", "日光",
    ];
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
