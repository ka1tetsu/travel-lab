// ============================================================
// Travel Lab - API Integration
// ============================================================

const RAKUTEN_APP_ID = "ec65ace1-9e87-4d23-83e4-b54103335b56";
const RAKUTEN_ACCESS_KEY = "pk_thp8WuFagFNOQh9VnsoWHJ8mAQhhRsHt4NWvW4wUA4q";

// Keyword to Rakuten Area Code Mapping (Full 47-prefecture + major tourist spots)
const RAKUTEN_AREA_MAPPING = {
    // ── 北海道 ──
    "北海道":   { large: "japan", middle: "hokkaido", small: "sapporo" },
    "札幌":     { large: "japan", middle: "hokkaido", small: "sapporo" },
    "函館":     { large: "japan", middle: "hokkaido", small: "hakodate" },
    "旭川":     { large: "japan", middle: "hokkaido", small: "asahikawa" },
    "ニセコ":   { large: "japan", middle: "hokkaido", small: "niseko" },
    "富良野":   { large: "japan", middle: "hokkaido", small: "furano" },
    "帯広":     { large: "japan", middle: "hokkaido", small: "obihiro" },
    "釧路":     { large: "japan", middle: "hokkaido", small: "kushiro" },
    "小樽":     { large: "japan", middle: "hokkaido", small: "otaru" },
    "登別":     { large: "japan", middle: "hokkaido", small: "noboribetsu" },
    "洞爺湖":   { large: "japan", middle: "hokkaido", small: "toyako" },
    // ── 東北 ──
    "青森":     { large: "japan", middle: "aomori", small: "aomori" },
    "弘前":     { large: "japan", middle: "aomori", small: "hirosaki" },
    "八戸":     { large: "japan", middle: "aomori", small: "hachinohe" },
    "岩手":     { large: "japan", middle: "iwate", small: "morioka" },
    "盛岡":     { large: "japan", middle: "iwate", small: "morioka" },
    "平泉":     { large: "japan", middle: "iwate", small: "hiraizumi" },
    "宮城":     { large: "japan", middle: "miyagi", small: "sendai" },
    "仙台":     { large: "japan", middle: "miyagi", small: "sendai" },
    "松島":     { large: "japan", middle: "miyagi", small: "matsushima" },
    "秋田":     { large: "japan", middle: "akita", small: "akita" },
    "乳頭温泉": { large: "japan", middle: "akita", small: "nyuto" },
    "山形":     { large: "japan", middle: "yamagata", small: "yamagata" },
    "蔵王":     { large: "japan", middle: "yamagata", small: "zao" },
    "福島":     { large: "japan", middle: "fukushima", small: "fukushima" },
    "会津若松": { large: "japan", middle: "fukushima", small: "aizuwakamatsu" },
    "那須":     { large: "japan", middle: "tochigi", small: "nasu" },
    // ── 関東 ──
    "東京":     { large: "japan", middle: "tokyo", small: "tokyo" },
    "新宿":     { large: "japan", middle: "tokyo", small: "shinjuku" },
    "渋谷":     { large: "japan", middle: "tokyo", small: "shibuya" },
    "浅草":     { large: "japan", middle: "tokyo", small: "asakusa" },
    "銀座":     { large: "japan", middle: "tokyo", small: "ginza" },
    "秋葉原":   { large: "japan", middle: "tokyo", small: "akihabara" },
    "品川":     { large: "japan", middle: "tokyo", small: "shinagawa" },
    "池袋":     { large: "japan", middle: "tokyo", small: "ikebukuro" },
    "上野":     { large: "japan", middle: "tokyo", small: "ueno" },
    "お台場":   { large: "japan", middle: "tokyo", small: "odaiba" },
    "神奈川":   { large: "japan", middle: "kanagawa", small: "yokohama" },
    "横浜":     { large: "japan", middle: "kanagawa", small: "yokohama" },
    "みなとみらい": { large: "japan", middle: "kanagawa", small: "yokohama" },
    "箱根":     { large: "japan", middle: "kanagawa", small: "hakone" },
    "箱根湯本": { large: "japan", middle: "kanagawa", small: "hakone" },
    "湯河原":   { large: "japan", middle: "kanagawa", small: "yugawara" },
    "鎌倉":     { large: "japan", middle: "kanagawa", small: "kamakura" },
    "埼玉":     { large: "japan", middle: "saitama", small: "saitama" },
    "川越":     { large: "japan", middle: "saitama", small: "kawagoe" },
    "千葉":     { large: "japan", middle: "chiba", small: "chiba" },
    "成田":     { large: "japan", middle: "chiba", small: "narita" },
    "木更津":   { large: "japan", middle: "chiba", small: "kisarazu" },
    "茨城":     { large: "japan", middle: "ibaraki", small: "mito" },
    "水戸":     { large: "japan", middle: "ibaraki", small: "mito" },
    "栃木":     { large: "japan", middle: "tochigi", small: "utsunomiya" },
    "日光":     { large: "japan", middle: "tochigi", small: "nikko" },
    "群馬":     { large: "japan", middle: "gunma", small: "takasaki" },
    "草津温泉": { large: "japan", middle: "gunma", small: "kusatsu" },
    "伊香保":   { large: "japan", middle: "gunma", small: "ikaho" },
    // ── 中部 ──
    "山梨":     { large: "japan", middle: "yamanashi", small: "kofu" },
    "富士山":   { large: "japan", middle: "shizuoka", small: "fujisan" },
    "富士":     { large: "japan", middle: "shizuoka", small: "fujisan" },
    "河口湖":   { large: "japan", middle: "yamanashi", small: "kawaguchiko" },
    "長野":     { large: "japan", middle: "nagano", small: "nagano" },
    "軽井沢":   { large: "japan", middle: "nagano", small: "karuizawa" },
    "松本":     { large: "japan", middle: "nagano", small: "matsumoto" },
    "白馬":     { large: "japan", middle: "nagano", small: "hakuba" },
    "上高地":   { large: "japan", middle: "nagano", small: "kamikochi" },
    "志賀高原": { large: "japan", middle: "nagano", small: "shigakogen" },
    "静岡":     { large: "japan", middle: "shizuoka", small: "shizuoka" },
    "熱海":     { large: "japan", middle: "shizuoka", small: "atami" },
    "伊豆":     { large: "japan", middle: "shizuoka", small: "izu" },
    "修善寺":   { large: "japan", middle: "shizuoka", small: "shuzenji" },
    "愛知":     { large: "japan", middle: "aichi", small: "nagoya" },
    "名古屋":   { large: "japan", middle: "aichi", small: "nagoya" },
    "岐阜":     { large: "japan", middle: "gifu", small: "gifu" },
    "白川郷":   { large: "japan", middle: "gifu", small: "shirakawago" },
    "新潟":     { large: "japan", middle: "niigata", small: "niigata" },
    "越後湯沢": { large: "japan", middle: "niigata", small: "yuzawa" },
    "富山":     { large: "japan", middle: "toyama", small: "toyama" },
    "石川":     { large: "japan", middle: "ishikawa", small: "kanazawa" },
    "金沢":     { large: "japan", middle: "ishikawa", small: "kanazawa" },
    "和倉温泉": { large: "japan", middle: "ishikawa", small: "wakura" },
    "福井":     { large: "japan", middle: "fukui", small: "fukui" },
    "東尋坊":   { large: "japan", middle: "fukui", small: "fukui" },
    // ── 近畿 ──
    "大阪":     { large: "japan", middle: "osaka", small: "osaka" },
    "難波":     { large: "japan", middle: "osaka", small: "namba" },
    "梅田":     { large: "japan", middle: "osaka", small: "umeda" },
    "USJ":      { large: "japan", middle: "osaka", small: "osaka" },
    "京都":     { large: "japan", middle: "kyoto", small: "kyoto" },
    "嵐山":     { large: "japan", middle: "kyoto", small: "kyoto" },
    "祇園":     { large: "japan", middle: "kyoto", small: "kyoto" },
    "伏見":     { large: "japan", middle: "kyoto", small: "kyoto" },
    "兵庫":     { large: "japan", middle: "hyogo", small: "kobe" },
    "神戸":     { large: "japan", middle: "hyogo", small: "kobe" },
    "有馬温泉": { large: "japan", middle: "hyogo", small: "arima" },
    "城崎温泉": { large: "japan", middle: "hyogo", small: "kinosaki" },
    "奈良":     { large: "japan", middle: "nara", small: "nara" },
    "吉野":     { large: "japan", middle: "nara", small: "yoshino" },
    "滋賀":     { large: "japan", middle: "shiga", small: "otsu" },
    "大津":     { large: "japan", middle: "shiga", small: "otsu" },
    "比叡山":   { large: "japan", middle: "shiga", small: "otsu" },
    "和歌山":   { large: "japan", middle: "wakayama", small: "wakayama" },
    "白浜":     { large: "japan", middle: "wakayama", small: "shirahama" },
    "熊野":     { large: "japan", middle: "wakayama", small: "kumano" },
    "三重":     { large: "japan", middle: "mie", small: "ise" },
    "伊勢":     { large: "japan", middle: "mie", small: "ise" },
    "鳥羽":     { large: "japan", middle: "mie", small: "toba" },
    // ── 中国 ──
    "広島":     { large: "japan", middle: "hiroshima", small: "hiroshima" },
    "宮島":     { large: "japan", middle: "hiroshima", small: "miyajima" },
    "岡山":     { large: "japan", middle: "okayama", small: "okayama" },
    "倉敷":     { large: "japan", middle: "okayama", small: "kurashiki" },
    "鳥取":     { large: "japan", middle: "tottori", small: "tottori" },
    "島根":     { large: "japan", middle: "shimane", small: "matsue" },
    "出雲":     { large: "japan", middle: "shimane", small: "izumo" },
    "山口":     { large: "japan", middle: "yamaguchi", small: "yamaguchi" },
    "萩":       { large: "japan", middle: "yamaguchi", small: "hagi" },
    // ── 四国 ──
    "徳島":     { large: "japan", middle: "tokushima", small: "tokushima" },
    "香川":     { large: "japan", middle: "kagawa", small: "takamatsu" },
    "高松":     { large: "japan", middle: "kagawa", small: "takamatsu" },
    "愛媛":     { large: "japan", middle: "ehime", small: "matsuyama" },
    "道後温泉": { large: "japan", middle: "ehime", small: "dogo" },
    "高知":     { large: "japan", middle: "kochi", small: "kochi" },
    // ── 九州 ──
    "福岡":     { large: "japan", middle: "fukuoka", small: "fukuoka" },
    "博多":     { large: "japan", middle: "fukuoka", small: "fukuoka" },
    "天神":     { large: "japan", middle: "fukuoka", small: "fukuoka" },
    "糸島":     { large: "japan", middle: "fukuoka", small: "itoshima" },
    "佐賀":     { large: "japan", middle: "saga", small: "saga" },
    "嬉野温泉": { large: "japan", middle: "saga", small: "ureshino" },
    "長崎":     { large: "japan", middle: "nagasaki", small: "nagasaki" },
    "ハウステンボス": { large: "japan", middle: "nagasaki", small: "huis" },
    "熊本":     { large: "japan", middle: "kumamoto", small: "kumamoto" },
    "阿蘇":     { large: "japan", middle: "kumamoto", small: "aso" },
    "大分":     { large: "japan", middle: "oita", small: "beppu" },
    "別府":     { large: "japan", middle: "oita", small: "beppu" },
    "由布院":   { large: "japan", middle: "oita", small: "yufuin" },
    "宮崎":     { large: "japan", middle: "miyazaki", small: "miyazaki" },
    "鹿児島":   { large: "japan", middle: "kagoshima", small: "kagoshima" },
    "指宿":     { large: "japan", middle: "kagoshima", small: "ibusuki" },
    "屋久島":   { large: "japan", middle: "kagoshima", small: "yakushima" },
    // ── 沖縄 ──
    "沖縄":     { large: "japan", middle: "okinawa", small: "naha" },
    "那覇":     { large: "japan", middle: "okinawa", small: "naha" },
    "恩納村":   { large: "japan", middle: "okinawa", small: "onna" },
    "石垣島":   { large: "japan", middle: "okinawa", small: "ishigaki" },
    "宮古島":   { large: "japan", middle: "okinawa", small: "miyako" },
    "本部":     { large: "japan", middle: "okinawa", small: "motobu" },
    "名護":     { large: "japan", middle: "okinawa", small: "nago" },
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
 * RAKUTEN_AREA_MAPPINGから最もマッチするエリアキーを検索する
 * 長いキーワードを優先（例: "箱根湯本" > "箱根"）
 */
function findAreaMapping(query) {
    if (!query) return null;
    // 完全一致を優先
    if (RAKUTEN_AREA_MAPPING[query]) return RAKUTEN_AREA_MAPPING[query];
    // 長さ降順でキーをソートして最長一致を探す
    const keys = Object.keys(RAKUTEN_AREA_MAPPING).filter(k => k !== "default");
    keys.sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (query.includes(key)) return RAKUTEN_AREA_MAPPING[key];
    }
    return null;
}

/**
 * 楽天APIからホテル情報を取得する（堅牢な6段階フォールバック検索）
 * @param {string} rawQuery ユーザー入力の生の検索文字列
 * @param {string} checkin チェックイン日 (YYYY-MM-DD)
 * @param {string} checkout チェックアウト日 (YYYY-MM-DD)
 * @returns {Promise<Array>} ホテル情報の配列
 */
async function fetchRakutenHotels(rawQuery, checkin, checkout) {
    if (!rawQuery) rawQuery = "東京"; // Default searching

    const baseVacantUrl = `https://app.rakuten.co.jp/services/api/Travel/VacantHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}&searchRadius=3`;
    const baseHotelUrl  = `https://app.rakuten.co.jp/services/api/Travel/HotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}`;
    const baseKeywordUrl = `https://app.rakuten.co.jp/services/api/Travel/KeywordHotelSearch/20170426?format=json&applicationId=${RAKUTEN_APP_ID}`;

    // VacantHotelSearchは日付パラメータが必須
    const dateParams = (checkin && checkout) ? `&checkinDate=${checkin}&checkoutDate=${checkout}` : "";

    let hotels = [];

    // --- Phase 0: RAKUTEN_AREA_MAPPINGの直接マッチング（最優先・最高速） ---
    // 入力がエリアマッピングに存在する場合、エリアコードで直接検索
    const areaMap = findAreaMapping(rawQuery);
    if (areaMap) {
        const areaParams = `&largeClassCode=${areaMap.large}&middleClassCode=${areaMap.middle}&smallClassCode=${areaMap.small}`;
        if (dateParams) {
            console.log(`[Phase 0] Area Vacant Search: ${areaMap.middle}/${areaMap.small}`);
            hotels = await fetchHotelsArray(`${baseVacantUrl}${areaParams}${dateParams}&datumType=1`);
            if (hotels.length > 0) return hotels;
        }
        // 日付なし or 空室なしの場合はHotelSearchでエリア検索
        console.log(`[Phase 0b] Area Hotel Search: ${areaMap.middle}/${areaMap.small}`);
        hotels = await fetchHotelsArray(`${baseHotelUrl}${areaParams}`);
        if (hotels.length > 0) return hotels;
    }

    // --- Phase 1: 直座標指定（現在地ボタン使用時） ---
    if (rawQuery.includes(",")) {
        const [lat, lng] = rawQuery.replace(/\s/g, "").split(",");
        if (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng)) && dateParams) {
            hotels = await fetchHotelsArray(`${baseVacantUrl}&latitude=${lat}&longitude=${lng}${dateParams}&datumType=1`);
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
        hotels = await fetchHotelsArray(`${baseVacantUrl}&latitude=${geo.lat}&longitude=${geo.lng}${dateParams}&datumType=1`);
        if (hotels.length > 0) return hotels;
    }

    // --- Phase 3: 楽天APIのキーワード検索（cleanedWordで） ---
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

    // --- Phase 5: 最終フォールバック（RAKUTEN_AREA_MAPPINGの全キーと照合） ---
    const areaKeys = Object.keys(RAKUTEN_AREA_MAPPING).filter(k => k !== "default");
    areaKeys.sort((a, b) => b.length - a.length); // 長いキーを優先
    for (const key of areaKeys) {
        if (rawQuery.includes(key)) {
            const m = RAKUTEN_AREA_MAPPING[key];
            console.log(`[Phase 5] Area Fallback via Mapping: ${key}`);
            hotels = await fetchHotelsArray(`${baseHotelUrl}&largeClassCode=${m.large}&middleClassCode=${m.middle}&smallClassCode=${m.small}`);
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
