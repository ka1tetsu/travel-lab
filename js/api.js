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
 * 文章から不要な言葉を取り除き、検索用のキーワードを抽出する
 */
function extractKeyword(text) {
    if (!text) return "";
    let keyword = text;
    // 検索のノイズになる一般的な単語や助詞を削除
    const stopWords = [
        "の近く", "の周辺", "の周り", "のそば", "のホテル", "の宿", "の旅館",
        "に行きたい", "を探して", "を教えて", "に泊まりたい", "おすすめ", "安い",
        "ホテル", "旅館", "宿", "宿泊", "旅行", "観光",
        "は", "が", "を", "に", "へ", "と", "から", "より", "で", "や", "の"
    ];

    // ストップワードを空文字に置換（長い順に処理すると安全だがある程度簡易化）
    stopWords.forEach(word => {
        const regex = new RegExp(word, 'g');
        keyword = keyword.replace(regex, " ");
    });

    // 連続する余白を削除し、トリム
    return keyword.replace(/\s+/g, " ").trim();
}

/**
 * OpenStreetMap (Nominatim) APIを用いてキーワードから緯度経度を取得する
 * @param {string} keyword 
 * @returns {Promise<{lat: number, lng: number}|null>}
 */
async function geocodeKeyword(keyword) {
    if (!keyword) return null;
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keyword)}&limit=1`;
    try {
        const res = await fetch(url, { headers: { "User-Agent": "TravelLab/1.0" } });
        const data = await res.json();
        if (data && data.length > 0) {
            return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
        }
    } catch (e) {
        console.error("Geocoding Error:", e);
    }
    return null;
}

/**
 * 楽天APIからホテル情報を取得する
 * @param {string} rawQuery ユーザー入力の生の検索文字列
 * @returns {Promise<Array>} ホテル情報の配列
 */
async function fetchRakutenHotels(rawQuery) {
    if (!rawQuery) rawQuery = "東京"; // Default searching

    let url = "";

    // すでに緯度経度が直接渡されている場合（現在地ボタンなど）
    if (rawQuery.includes(",")) {
        const [lat, lng] = rawQuery.split(",");
        url = `https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&latitude=${lat}&longitude=${lng}&searchRadius=3`;
    } else {
        // 文章等が入力された場合の処理
        const keyword = extractKeyword(rawQuery);
        const geo = await geocodeKeyword(keyword);

        if (geo) {
            // ジオコーディング成功：その座標の周辺ホテルを検索
            console.log(`[GeoSearch: ${keyword}] Lat: ${geo.lat}, Lng: ${geo.lng}`);
            url = `https://openapi.rakuten.co.jp/engine/api/Travel/VacantHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&latitude=${geo.lat}&longitude=${geo.lng}&searchRadius=3`;
        } else {
            // ジオコーディング失敗（抽象的な地名など）：キーワード検索
            const searchWord = keyword || rawQuery;
            console.log(`[KeywordSearch: ${searchWord}]`);
            url = `https://openapi.rakuten.co.jp/engine/api/Travel/KeywordHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&accessKey=${RAKUTEN_ACCESS_KEY}&keyword=${encodeURIComponent(searchWord)}`;
        }
    }

    try {
        const res = await fetch(url);
        if (!res.ok) {
            throw new Error("HTTP error " + res.status);
        }
        const data = await res.json();
        return data.hotels || [];
    } catch (error) {
        console.error("Rakuten API Fetch Error:", error);
        return [];
    }
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
