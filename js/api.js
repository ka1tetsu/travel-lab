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
 * 簡易的な形態素解析（ストップワード除去）
 */
function cleanKeyword(text) {
    if (!text) return "";
    let k = text;
    // 冗長な表現の除去
    const stopWords = [
        "の近くの", "の周辺の", "の周りの", "のそばの",
        "の近く", "の周辺", "の周り", "のそば",
        "に行きたい", "を探して", "を教えて", "を探す", "をさがす",
        "に泊まりたい", "に泊まる", "泊まれる", "泊まる",
        "おすすめの", "おすすめ", "オススメの", "オススメ",
        "ホテル", "旅館", "宿", "宿泊", "旅行", "観光"
    ];
    stopWords.forEach(word => {
        k = k.replace(new RegExp(word, 'g'), " ");
    });
    return k.replace(/\s+/g, " ").trim();
}

/**
 * Wikipedia APIを用いて地名・ランドマークから座標を取得
 * 高精度な日本国内のランドマーク検索用
 */
async function getWikiCoordinates(keyword) {
    if (!keyword || keyword.length < 2) return null;
    const url = `https://ja.wikipedia.org/w/api.php?action=query&prop=coordinates&titles=${encodeURIComponent(keyword)}&format=json&origin=*`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.query && data.query.pages) {
            const pages = data.query.pages;
            for (let pageId in pages) {
                if (pages[pageId].coordinates && pages[pageId].coordinates.length > 0) {
                    const coord = pages[pageId].coordinates[0];
                    return { lat: coord.lat, lng: coord.lon };
                }
            }
        }
    } catch (e) {
        console.error("Wiki Geocoding Error:", e);
    }
    return null;
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
 * 楽天APIからホテル情報を取得する（堅牢な5段階フォールバック検索）
 * @param {string} rawQuery ユーザー入力の生の検索文字列
 * @param {string} checkin チェックイン日 (YYYY-MM-DD)
 * @param {string} checkout チェックアウト日 (YYYY-MM-DD)
 * @returns {Promise<Array>} ホテル情報の配列
 */
async function fetchRakutenHotels(rawQuery, checkin, checkout) {
    if (!rawQuery) rawQuery = "東京"; // Default searching

    const baseVacantUrl = `https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&searchRadius=3`;
    const baseKeywordUrl = `https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}`;

    // VacantHotelSearchは日付パラメータが必須
    const dateParams = (checkin && checkout) ? `&checkinDate=${checkin}&checkoutDate=${checkout}` : "";

    let hotels = [];

    // --- Phase 1: 直座標指定（現在地ボタン使用時） ---
    if (rawQuery.includes(",")) {
        const [lat, lng] = rawQuery.replace(/\s/g, "").split(",");
        if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && dateParams) {
            hotels = await fetchHotelsArray(`${baseVacantUrl}&latitude=${lat}&longitude=${lng}${dateParams}`);
            if (hotels.length > 0) return hotels;
        }
    }

    const cleanedWord = cleanKeyword(rawQuery);
    const searchWord = cleanedWord || rawQuery;

    // --- Phase 2: Wikipedia APIを活用したランドマーク周辺検索 ---
    // 名所や施設名で検索された場合、Wikipediaで座標を引いてから半径3kmの空室を探す
    const geo = await getWikiCoordinates(searchWord);
    if (geo && dateParams) {
        console.log(`[Phase 2] Wiki GeoSearch Lat: ${geo.lat}, Lng: ${geo.lng} for ${searchWord}`);
        hotels = await fetchHotelsArray(`${baseVacantUrl}&latitude=${geo.lat}&longitude=${geo.lng}${dateParams}`);
        if (hotels.length > 0) return hotels;
    }

    // --- Phase 3: 楽天APIの完全一致キーワード検索 ---
    console.log(`[Phase 3] Keyword Search: ${searchWord}`);
    hotels = await fetchHotelsArray(`${baseKeywordUrl}&keyword=${encodeURIComponent(searchWord)}`);
    if (hotels.length > 0) return hotels;

    // --- Phase 4: クエリ緩和（文章を分割し、最も特徴的な長い単語だけで再検索） ---
    const words = searchWord.split(/[\s　]+/);
    if (words.length > 1) {
        const longestWord = words.reduce((a, b) => a.length > b.length ? a : b);
        console.log(`[Phase 4] Relaxed Keyword Search: ${longestWord}`);
        hotels = await fetchHotelsArray(`${baseKeywordUrl}&keyword=${encodeURIComponent(longestWord)}`);
        if (hotels.length > 0) return hotels;
    }

    // --- Phase 5: 最終フォールバック（入力に含まれる都道府県・主要都市レベルでの検索） ---
    const majorAreas = ["北海道", "青森", "岩手", "宮城", "秋田", "山形", "福島", "茨城", "栃木", "群馬", "埼玉", "千葉", "東京", "神奈川", "箱根", "新潟", "富山", "石川", "福井", "山梨", "長野", "軽井沢", "岐阜", "静岡", "愛知", "名古屋", "三重", "滋賀", "京都", "大阪", "兵庫", "神戸", "奈良", "和歌山", "鳥取", "島根", "岡山", "広島", "山口", "徳島", "香川", "愛媛", "高知", "福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島", "沖縄"];
    for (const area of majorAreas) {
        if (rawQuery.includes(area) || rawQuery.includes(area.replace(/(都|道|府|県)$/, ''))) {
            console.log(`[Phase 5] Area Fallback: ${area}`);
            hotels = await fetchHotelsArray(`${baseKeywordUrl}&keyword=${encodeURIComponent(area)}`);
            if (hotels.length > 0) return hotels;
        }
    }

    return hotels; // 全部ダメなら0件
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
