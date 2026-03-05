// ============================================================
// Travel Lab - API Integration
// ============================================================

const RAKUTEN_APP_ID = "ec65ace1-9e87-4d23-83e4-b54103335b56";
const RAKUTEN_ACCESS_KEY = "pk_thp8WuFagFNOQh9VnsoWHJ8mAQhhRsHt4NWvW4wUA4q";

// Keyword to Rakuten Area Code Mapping (Simplified Geo-coding)
const RAKUTEN_AREA_MAPPING = {
    "東京": { large: "japan", middle: "tokyo", small: "tokyo" },
    "京都": { large: "japan", middle: "kyoto", small: "kyoto" },
    "大阪": { large: "japan", middle: "osaka", small: "osaka" },
    "沖縄": { large: "japan", middle: "okinawa", small: "naha" },
    "北海道": { large: "japan", middle: "hokkaido", small: "sapporo" },
    "札幌": { large: "japan", middle: "hokkaido", small: "sapporo" },
    "函館": { large: "japan", middle: "hokkaido", small: "hakodate" },
    "福岡": { large: "japan", middle: "fukuoka", small: "fukuoka" },
    "箱根": { large: "japan", middle: "kanagawa", small: "hakone" },
    "横浜": { large: "japan", middle: "kanagawa", small: "yokohama" },
    "軽井沢": { large: "japan", middle: "nagano", small: "karuizawa" },
    "名古屋": { large: "japan", middle: "aichi", small: "nagoya" },
    "仙台": { large: "japan", middle: "miyagi", small: "sendai" },
    "広島": { large: "japan", middle: "hiroshima", small: "hiroshima" },
    // 該当なしの場合のフォールバック
    "default": { large: "japan", middle: "tokyo", small: "tokyo" }
};

/**
 * 革新的な「ムード・気分」ベースのキーワード抽出
 */
function extractMoodKeyword(text) {
    if (!text) return "";
    let k = text;

    // 革新的な「ムード（気分）検索」マッピング
    const moodMap = {
        "リラックス": "温泉",
        "疲れた": "温泉 癒やし",
        "海が見たい": "オーシャンビュー",
        "海": "オーシャンビュー",
        "デート": "夜景 カップル",
        "家族": "ファミリールーム",
        "子供": "キッズ",
        "自然": "大自然",
        "美味しい": "バイキング 食べ放題",
        "おいしい": "グルメ",
        "ディズニー": "舞浜",
        "usj": "ユニバーサル",
        "ユニバ": "ユニバーサル",
        "雪": "スキー",
        "映え": "インスタ映え",
        "山": "絶景",
        "都会": "夜景",
        "田舎": "古民家",
        "非日常": "高級リゾート"
    };

    let moodAdded = "";
    for (const [key, val] of Object.entries(moodMap)) {
        if (text.includes(key)) {
            moodAdded += " " + val;
        }
    }

    // 極めて強力なストップワード辞書
    const stopWords = [
        "の近くの", "の周辺の", "の周りの", "のそばの",
        "の近く", "の周辺", "の周り", "のそば",
        "に行きたい", "を探して", "を教えて", "を探す", "をさがす", "したい", "見たい",
        "に泊まりたい", "に泊まる", "泊まれる", "泊まる",
        "おすすめの", "おすすめ", "オススメの", "オススメ",
        "安くて", "安い", "高級な", "豪華な", "綺麗な", "きれいな", "おしゃれな", "オシャレな",
        "ホテル", "旅館", "宿", "宿泊", "旅行", "観光", "ビジネスホテル", "カプセルホテル", "リゾート",
        "で", "や", "の", "は", "が", "を", "に", "へ", "と", "から", "より",
        "県", "都", "府", "市", "区", "町", "村"
    ];

    stopWords.forEach(word => {
        k = k.replace(new RegExp(word, 'g'), " ");
    });

    return (k + moodAdded).replace(/\s+/g, " ").trim();
}

/**
 * URLフェッチを実行し、ホテルの配列を返すヘルパー
 */
async function fetchHotelsArray(url) {
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return data.hotels || [];
    } catch (error) {
        console.error("API Fetch Error:", error);
        return [];
    }
}

/**
 * 楽天APIからホテル情報を取得する（革新的ムード検索＆ガチャ機能付き）
 * @param {string} rawQuery ユーザー入力の生の検索文字列
 * @param {string} checkin チェックイン日 (YYYY-MM-DD)
 * @param {string} checkout チェックアウト日 (YYYY-MM-DD)
 * @returns {Promise<Array>} ホテル情報の配列
 */
async function fetchRakutenHotels(rawQuery, checkin, checkout) {
    if (!rawQuery) rawQuery = "東京";

    const baseVacantUrl = `https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&searchRadius=3`;
    const dateParams = (checkin && checkout) ? `&checkinDate=${checkin}&checkoutDate=${checkout}` : "";

    let hotels = [];

    // --- 第1段階：現在地検索（座標が渡された場合は絶対的な最優先） ---
    if (rawQuery.includes(",")) {
        const [lat, lng] = rawQuery.replace(/\s/g, "").split(",");
        if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) {
            const geoUrl = `${baseVacantUrl}&latitude=${lat}&longitude=${lng}${dateParams}`;
            hotels = await fetchHotelsArray(geoUrl);
            if (hotels.length > 0) return hotels; // 座標で見つかれば即座に返す
        }
    }

    // --- 第2段階：革新的な「ムード（気分）＆キーワード」検索 ---
    // Nominatim(ジオコーディング)はヒット率を著しく下げるため廃止し、楽天の強力なキーワード検索に完全に任せる
    const innovativeKeyword = extractMoodKeyword(rawQuery) || rawQuery;
    const searchWord = innovativeKeyword === "" ? "おすすめ" : innovativeKeyword;
    console.log(`[Phase 2] Innovative Keyword Search: ${searchWord}`);

    let keywordUrl = `https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&keyword=${encodeURIComponent(searchWord)}`;
    hotels = await fetchHotelsArray(keywordUrl);

    // --- 第3段階：結果ゼロの場合は「旅行先ガチャ（Surprise Me!）」を発動 ---
    if (hotels.length === 0) {
        const gachaPlaces = ["箱根 温泉", "京都の奥座敷", "沖縄 プライベートビーチ", "札幌 海鮮", "草津温泉 湯畑", "熱海 海の見える", "軽井沢 森の中", "由布院 離れ", "金沢 絶景"];
        const randomPlace = gachaPlaces[Math.floor(Math.random() * gachaPlaces.length)];
        console.log(`[Phase 3] 0 Results! Triggering Tourism Gacha: ${randomPlace}`);

        keywordUrl = `https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&keyword=${encodeURIComponent(randomPlace)}`;
        hotels = await fetchHotelsArray(keywordUrl);

        // ガチャ発動のフラグを立てておき、フロント側で「〇〇は見つかりませんでした！代わりに〇〇のおすすめです！」と出せるようにする
        if (hotels.length > 0) {
            hotels[0].isGacha = true;
            hotels[0].gachaKeyword = randomPlace;
        }
    }

    return hotels;
}

/**
 * 楽天のAPIレスポンスデータを、フロントエンドのフォーマットに変換する
 */
function mapRakutenToTravelLab(apiHotels, query, opts = {}) {
    const { checkin, checkout, adults, rooms } = opts;
    let idCounter = 1000;

    return apiHotels.map(item => {
        const info = item.hotel[0].hotelBasicInfo;

        // APIから最低宿泊料金を取得（取れない場合は一時的なモック値）
        const rPrice = info.hotelMinCharge || (Math.floor(Math.random() * 5 + 5) * 1000);

        // 高解像度の画像（存在しない場合は低解像度、またはフォールバック）
        const imageUrl = info.hotelImageUrl || info.hotelThumbnailUrl || "assets/images/hotel_tokyo.png";

        // 楽天トラベルのURL生成（日付対応）
        let rakutenUrl = info.hotelInformationUrl || "#";
        if (rakutenUrl !== "#" && checkin) {
            try {
                const urlObj = new URL(rakutenUrl);
                const ciDate = new Date(checkin);
                urlObj.searchParams.append('f_tehai_ki', '1');
                urlObj.searchParams.append('f_nen1', ciDate.getFullYear());
                urlObj.searchParams.append('f_tuki1', ciDate.getMonth() + 1);
                urlObj.searchParams.append('f_hi1', ciDate.getDate());

                if (checkout) {
                    const coDate = new Date(checkout);
                    urlObj.searchParams.append('f_nen2', coDate.getFullYear());
                    urlObj.searchParams.append('f_tuki2', coDate.getMonth() + 1);
                    urlObj.searchParams.append('f_hi2', coDate.getDate());
                    const nights = Math.max(1, Math.round((coDate - ciDate) / 86400000));
                    urlObj.searchParams.append('f_hakusu', nights);
                }

                urlObj.searchParams.append('f_heya_su', rooms || 1);
                urlObj.searchParams.append('f_otona_su', adults || 2);
                rakutenUrl = urlObj.toString();
            } catch (e) {
                console.error("URL parsing error", e);
            }
        }

        // 他社サイトの価格・URL生成処理（日付引き継ぎ対応モック）
        const generateSiteData = (basePrice, variance, baseUrl) => {
            const price = Math.round(basePrice * (1 + variance));
            let url = baseUrl;
            if (checkin && checkout) {
                // 仮で汎用的なパラメータを付与（実際は各社専用のパラメーター名になる）
                url += `&checkin=${checkin}&checkout=${checkout}&adults=${adults || 2}&rooms=${rooms || 1}`;
            }
            return { price, url, mealPlan: "素泊まり" };
        };

        const prices = {
            rakuten: { price: rPrice, url: rakutenUrl, mealPlan: "素泊まり" },
            jalan: generateSiteData(rPrice, Math.random() * 0.1 - 0.03, "https://www.jalan.net/biz/?sc_cid=tl"),
            yahoo: generateSiteData(rPrice, Math.random() * 0.1 - 0.05, "https://travel.yahoo.co.jp/search/?tl=1"),
            booking: generateSiteData(rPrice, Math.random() * 0.15 - 0.02, "https://www.booking.com/searchresults.html?aid=tl"),
            expedia: generateSiteData(rPrice, Math.random() * 0.12 - 0.04, "https://www.expedia.co.jp/Hotel-Search?tl=1"),
            agoda: generateSiteData(rPrice, Math.random() * 0.14 - 0.06, "https://www.agoda.com/ja-jp/search?tl=1"),
            jtb: generateSiteData(rPrice, Math.random() * 0.08 + 0.02, "https://www.jtb.co.jp/kokunai_hotel/list/?tl=1"),
            rurubu: generateSiteData(rPrice, Math.random() * 0.09 + 0.01, "https://www.rurubu.travel/hotel-search?tl=1"),
        };

        // アメニティの生成（ダミー）
        const amenities = ["wifi"];
        if (rPrice % 3 === 0) amenities.push("breakfast");
        if (rPrice % 2 === 0) amenities.push("onsen");

        return {
            id: info.hotelNo || idCounter++,
            name: info.hotelName || "ホテル情報取得エラー",
            area: query,
            address: `${info.address1 || ""}${info.address2 || ""}`,
            category: "提携ホテル",
            stars: Math.max(1, Math.min(5, Math.round(info.reviewAverage || 3))),
            rating: info.reviewAverage ? info.reviewAverage.toFixed(1) : "3.0",
            reviewCount: info.reviewCount || Math.floor(Math.random() * 500) + 10,
            image: imageUrl,
            amenities: amenities,
            description: info.hotelSpecial || "人気のロケーションにあるおすすめのホテルです。",
            prices: prices,
        };
    });
}
