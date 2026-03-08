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

// ============================================================
// ランドマーク → エリアコード直接マッピング
// 有名建物・観光スポット名からホテル検索エリアを直接解決
// ============================================================
const LANDMARK_MAPPING = {
    // ── 東京 ──
    "東京スカイツリー": { large: "japan", middle: "tokyo", small: "asakusa" },
    "スカイツリー":     { large: "japan", middle: "tokyo", small: "asakusa" },
    "浅草寺":           { large: "japan", middle: "tokyo", small: "asakusa" },
    "東京タワー":       { large: "japan", middle: "tokyo", small: "shinagawa" },
    "六本木ヒルズ":     { large: "japan", middle: "tokyo", small: "shinjuku" },
    "六本木":           { large: "japan", middle: "tokyo", small: "shinjuku" },
    "表参道":           { large: "japan", middle: "tokyo", small: "shibuya" },
    "代官山":           { large: "japan", middle: "tokyo", small: "shibuya" },
    "原宿":             { large: "japan", middle: "tokyo", small: "shibuya" },
    "明治神宮":         { large: "japan", middle: "tokyo", small: "shibuya" },
    "国立競技場":       { large: "japan", middle: "tokyo", small: "shinjuku" },
    "新国立競技場":     { large: "japan", middle: "tokyo", small: "shinjuku" },
    "東京ドーム":       { large: "japan", middle: "tokyo", small: "akihabara" },
    "上野動物園":       { large: "japan", middle: "tokyo", small: "ueno" },
    "アメ横":           { large: "japan", middle: "tokyo", small: "ueno" },
    "築地":             { large: "japan", middle: "tokyo", small: "ginza" },
    "豊洲市場":         { large: "japan", middle: "tokyo", small: "odaiba" },
    "お台場海浜公園":   { large: "japan", middle: "tokyo", small: "odaiba" },
    "羽田空港":         { large: "japan", middle: "tokyo", small: "shinagawa" },
    // ── 千葉 ──
    "東京ディズニーランド": { large: "japan", middle: "chiba", small: "chiba" },
    "東京ディズニーシー":   { large: "japan", middle: "chiba", small: "chiba" },
    "ディズニーランド":     { large: "japan", middle: "chiba", small: "chiba" },
    "ディズニーリゾート":   { large: "japan", middle: "chiba", small: "chiba" },
    "TDL":               { large: "japan", middle: "chiba", small: "chiba" },
    "TDS":               { large: "japan", middle: "chiba", small: "chiba" },
    "成田空港":          { large: "japan", middle: "chiba", small: "narita" },
    // ── 神奈川 ──
    "横浜中華街":        { large: "japan", middle: "kanagawa", small: "yokohama" },
    "山下公園":          { large: "japan", middle: "kanagawa", small: "yokohama" },
    "横浜赤レンガ倉庫":  { large: "japan", middle: "kanagawa", small: "yokohama" },
    "鶴岡八幡宮":        { large: "japan", middle: "kanagawa", small: "kamakura" },
    "高徳院":            { large: "japan", middle: "kanagawa", small: "kamakura" },
    "鎌倉大仏":          { large: "japan", middle: "kanagawa", small: "kamakura" },
    "箱根ロープウェイ":  { large: "japan", middle: "kanagawa", small: "hakone" },
    "芦ノ湖":            { large: "japan", middle: "kanagawa", small: "hakone" },
    // ── 静岡・山梨 ──
    "富士急ハイランド":  { large: "japan", middle: "yamanashi", small: "kawaguchiko" },
    "山中湖":            { large: "japan", middle: "yamanashi", small: "kawaguchiko" },
    "西湖":              { large: "japan", middle: "yamanashi", small: "kawaguchiko" },
    "本栖湖":            { large: "japan", middle: "yamanashi", small: "kawaguchiko" },
    "熱海海岸":          { large: "japan", middle: "shizuoka", small: "atami" },
    // ── 長野・岐阜 ──
    "旧軽井沢":          { large: "japan", middle: "nagano", small: "karuizawa" },
    "上高地バスターミナル": { large: "japan", middle: "nagano", small: "kamikochi" },
    "白馬八方尾根":      { large: "japan", middle: "nagano", small: "hakuba" },
    "松本城":            { large: "japan", middle: "nagano", small: "matsumoto" },
    "合掌造り":          { large: "japan", middle: "gifu", small: "shirakawago" },
    "白川郷合掌造り":    { large: "japan", middle: "gifu", small: "shirakawago" },
    "飛騨古川":          { large: "japan", middle: "gifu", small: "gifu" },
    // ── 愛知 ──
    "名古屋城":          { large: "japan", middle: "aichi", small: "nagoya" },
    "熱田神宮":          { large: "japan", middle: "aichi", small: "nagoya" },
    "トヨタ産業技術記念館": { large: "japan", middle: "aichi", small: "nagoya" },
    "名古屋港水族館":    { large: "japan", middle: "aichi", small: "nagoya" },
    // ── 三重 ──
    "伊勢神宮":          { large: "japan", middle: "mie", small: "ise" },
    "内宮":              { large: "japan", middle: "mie", small: "ise" },
    "おはらい町":        { large: "japan", middle: "mie", small: "ise" },
    "鳥羽水族館":        { large: "japan", middle: "mie", small: "toba" },
    // ── 滋賀・和歌山 ──
    "琵琶湖":            { large: "japan", middle: "shiga", small: "otsu" },
    "那智の滝":          { large: "japan", middle: "wakayama", small: "kumano" },
    "高野山":            { large: "japan", middle: "wakayama", small: "wakayama" },
    // ── 京都 ──
    "金閣寺":            { large: "japan", middle: "kyoto", small: "kyoto" },
    "銀閣寺":            { large: "japan", middle: "kyoto", small: "kyoto" },
    "清水寺":            { large: "japan", middle: "kyoto", small: "kyoto" },
    "伏見稲荷大社":      { large: "japan", middle: "kyoto", small: "kyoto" },
    "伏見稲荷":          { large: "japan", middle: "kyoto", small: "kyoto" },
    "二条城":            { large: "japan", middle: "kyoto", small: "kyoto" },
    "天橋立":            { large: "japan", middle: "kyoto", small: "kyoto" },
    "貴船神社":          { large: "japan", middle: "kyoto", small: "kyoto" },
    "鞍馬寺":            { large: "japan", middle: "kyoto", small: "kyoto" },
    "竹林":              { large: "japan", middle: "kyoto", small: "kyoto" },
    "京都御所":          { large: "japan", middle: "kyoto", small: "kyoto" },
    // ── 大阪 ──
    "大阪城":            { large: "japan", middle: "osaka", small: "osaka" },
    "道頓堀":            { large: "japan", middle: "osaka", small: "namba" },
    "通天閣":            { large: "japan", middle: "osaka", small: "namba" },
    "心斎橋":            { large: "japan", middle: "osaka", small: "namba" },
    "黒門市場":          { large: "japan", middle: "osaka", small: "namba" },
    "ユニバーサルスタジオジャパン": { large: "japan", middle: "osaka", small: "osaka" },
    // ── 奈良 ──
    "東大寺":            { large: "japan", middle: "nara", small: "nara" },
    "奈良公園":          { large: "japan", middle: "nara", small: "nara" },
    "春日大社":          { large: "japan", middle: "nara", small: "nara" },
    "法隆寺":            { large: "japan", middle: "nara", small: "nara" },
    "興福寺":            { large: "japan", middle: "nara", small: "nara" },
    "吉野山":            { large: "japan", middle: "nara", small: "yoshino" },
    // ── 兵庫 ──
    "姫路城":            { large: "japan", middle: "hyogo", small: "himeji" },
    "明石海峡大橋":      { large: "japan", middle: "hyogo", small: "kobe" },
    "神戸ハーバーランド": { large: "japan", middle: "hyogo", small: "kobe" },
    "有馬温泉郷":        { large: "japan", middle: "hyogo", small: "arima" },
    // ── 広島 ──
    "原爆ドーム":        { large: "japan", middle: "hiroshima", small: "hiroshima" },
    "平和記念公園":      { large: "japan", middle: "hiroshima", small: "hiroshima" },
    "厳島神社":          { large: "japan", middle: "hiroshima", small: "miyajima" },
    "宮島":              { large: "japan", middle: "hiroshima", small: "miyajima" },
    // ── 岡山 ──
    "後楽園":            { large: "japan", middle: "okayama", small: "okayama" },
    "倉敷美観地区":      { large: "japan", middle: "okayama", small: "kurashiki" },
    // ── 愛媛 ──
    "道後温泉本館":      { large: "japan", middle: "ehime", small: "dogo" },
    "松山城":            { large: "japan", middle: "ehime", small: "matsuyama" },
    // ── 福岡 ──
    "太宰府天満宮":      { large: "japan", middle: "fukuoka", small: "fukuoka" },
    "博多祇園山笠":      { large: "japan", middle: "fukuoka", small: "fukuoka" },
    "福岡タワー":        { large: "japan", middle: "fukuoka", small: "fukuoka" },
    // ── 長崎 ──
    "グラバー園":        { large: "japan", middle: "nagasaki", small: "nagasaki" },
    "出島":              { large: "japan", middle: "nagasaki", small: "nagasaki" },
    "ハウステンボス":    { large: "japan", middle: "nagasaki", small: "huis" },
    // ── 熊本 ──
    "熊本城":            { large: "japan", middle: "kumamoto", small: "kumamoto" },
    "阿蘇山":            { large: "japan", middle: "kumamoto", small: "aso" },
    // ── 鹿児島 ──
    "桜島":              { large: "japan", middle: "kagoshima", small: "kagoshima" },
    "指宿温泉":          { large: "japan", middle: "kagoshima", small: "ibusuki" },
    // ── 沖縄 ──
    "首里城":            { large: "japan", middle: "okinawa", small: "naha" },
    "国際通り":          { large: "japan", middle: "okinawa", small: "naha" },
    "美ら海水族館":      { large: "japan", middle: "okinawa", small: "motobu" },
    "万座ビーチ":        { large: "japan", middle: "okinawa", small: "onna" },
    "恩納ビーチ":        { large: "japan", middle: "okinawa", small: "onna" },
    // ── 北海道 ──
    "大通公園":          { large: "japan", middle: "hokkaido", small: "sapporo" },
    "すすきの":          { large: "japan", middle: "hokkaido", small: "sapporo" },
    "北海道神宮":        { large: "japan", middle: "hokkaido", small: "sapporo" },
    "小樽運河":          { large: "japan", middle: "hokkaido", small: "otaru" },
    "旭山動物園":        { large: "japan", middle: "hokkaido", small: "asahikawa" },
    "函館山":            { large: "japan", middle: "hokkaido", small: "hakodate" },
    "函館朝市":          { large: "japan", middle: "hokkaido", small: "hakodate" },
    "五稜郭":            { large: "japan", middle: "hokkaido", small: "hakodate" },
    "ニセコスキー場":    { large: "japan", middle: "hokkaido", small: "niseko" },
    "富良野ラベンダー":  { large: "japan", middle: "hokkaido", small: "furano" },
    "ファーム富田":      { large: "japan", middle: "hokkaido", small: "furano" },
    // ── 東北 ──
    "松島海岸":          { large: "japan", middle: "miyagi", small: "matsushima" },
    "仙台七夕":          { large: "japan", middle: "miyagi", small: "sendai" },
    "弘前城":            { large: "japan", middle: "aomori", small: "hirosaki" },
    "奥入瀬渓流":        { large: "japan", middle: "aomori", small: "hachinohe" },
    "日光東照宮":        { large: "japan", middle: "tochigi", small: "nikko" },
    "東照宮":            { large: "japan", middle: "tochigi", small: "nikko" },
    "中禅寺湖":          { large: "japan", middle: "tochigi", small: "nikko" },
    "華厳の滝":          { large: "japan", middle: "tochigi", small: "nikko" },
    "兼六園":            { large: "japan", middle: "ishikawa", small: "kanazawa" },
    "金沢城":            { large: "japan", middle: "ishikawa", small: "kanazawa" },
    "ひがし茶屋街":      { large: "japan", middle: "ishikawa", small: "kanazawa" },
};

// ============================================================
// テーマ・コンセプト → 推奨エリアリスト
// 「温泉」「スキー」などの抽象的なキーワードを人気エリアに変換
// ============================================================
const CONCEPT_MAPPING = {
    // 温泉・癒やし系
    "温泉":     ["箱根", "別府", "草津温泉", "有馬温泉", "登別", "道後温泉", "乳頭温泉", "修善寺"],
    "露天風呂": ["箱根", "別府", "草津温泉", "有馬温泉"],
    "旅館":     ["箱根", "京都", "別府", "草津温泉"],
    "湯治":     ["草津温泉", "別府", "乳頭温泉"],
    "スパ":     ["箱根", "沖縄", "東京"],
    // ウインタースポーツ
    "スキー":   ["白馬", "ニセコ", "蔵王", "志賀高原", "越後湯沢"],
    "スノボ":   ["白馬", "ニセコ", "蔵王", "越後湯沢"],
    "スノーボード": ["白馬", "ニセコ", "蔵王"],
    "スキー場": ["白馬", "ニセコ", "志賀高原", "蔵王"],
    "雪遊び":   ["北海道", "白馬", "蔵王"],
    "雪":       ["北海道", "ニセコ", "蔵王", "白馬"],
    // 海・ビーチ系
    "海":       ["沖縄", "石垣島", "宮古島", "熱海", "伊豆"],
    "ビーチ":   ["沖縄", "石垣島", "宮古島", "白浜"],
    "海水浴":   ["沖縄", "石垣島", "宮古島", "熱海"],
    "マリンスポーツ": ["沖縄", "石垣島", "宮古島"],
    "シュノーケリング": ["石垣島", "宮古島", "沖縄"],
    "ダイビング": ["石垣島", "宮古島", "沖縄"],
    "リゾート": ["沖縄", "石垣島", "宮古島", "熱海"],
    // 山・自然系
    "山":       ["富士山", "上高地", "軽井沢", "白馬"],
    "登山":     ["富士山", "上高地", "白馬"],
    "ハイキング": ["上高地", "日光", "箱根", "富士山"],
    "キャンプ": ["那須", "軽井沢", "富良野"],
    "高原":     ["軽井沢", "上高地", "白馬", "那須"],
    "湖":       ["箱根", "河口湖", "日光"],
    "渓谷":     ["上高地", "日光", "奥入瀬渓流"],
    "離島":     ["石垣島", "宮古島", "屋久島"],
    "秘境":     ["上高地", "屋久島", "白川郷"],
    "大自然":   ["北海道", "富良野", "屋久島", "上高地"],
    "ラベンダー": ["富良野"],
    "花畑":     ["富良野", "北海道"],
    // 四季・シーズン
    "紅葉":     ["京都", "日光", "箱根", "蔵王"],
    "もみじ":   ["京都", "日光", "箱根"],
    "花見":     ["京都", "奈良", "弘前", "上野"],
    "桜":       ["京都", "奈良", "弘前", "吉野"],
    "さくら":   ["京都", "奈良", "弘前"],
    "新緑":     ["京都", "上高地", "箱根"],
    // 文化・観光系
    "世界遺産": ["京都", "広島", "宮島", "白川郷", "日光"],
    "歴史":     ["京都", "奈良", "鎌倉", "日光"],
    "神社":     ["京都", "奈良", "伊勢", "出雲"],
    "お寺":     ["京都", "奈良", "鎌倉"],
    "城":       ["大阪", "名古屋", "熊本", "金沢"],
    "古都":     ["京都", "奈良", "鎌倉"],
    "伝統":     ["京都", "奈良", "金沢"],
    "パワースポット": ["伊勢", "京都", "奈良", "出雲"],
    "縁結び":   ["出雲", "伊勢", "京都"],
    "アート":   ["金沢", "直島", "東京"],
    "夜景":     ["函館", "長崎", "神戸", "横浜"],
    "イルミネーション": ["東京", "大阪", "神戸"],
    // グルメ・体験系
    "グルメ":   ["大阪", "博多", "名古屋", "東京"],
    "食べ歩き": ["大阪", "博多", "金沢"],
    "ラーメン": ["博多", "札幌", "仙台"],
    "寿司":     ["東京", "金沢", "函館", "小樽"],
    "海鮮":     ["函館", "金沢", "小樽", "博多"],
    "もつ鍋":   ["博多"],
    "たこ焼き": ["大阪"],
    "うどん":   ["高松", "香川"],
    "日本酒":   ["新潟", "京都", "金沢"],
    "酒蔵":     ["新潟", "京都", "金沢"],
    // 旅行スタイル系
    "カップル": ["京都", "箱根", "沖縄", "熱海"],
    "ふたり旅": ["京都", "箱根", "沖縄"],
    "ハネムーン": ["沖縄", "石垣島", "宮古島", "京都"],
    "蜜月":     ["沖縄", "石垣島", "京都"],
    "女子旅":   ["京都", "金沢", "箱根", "軽井沢"],
    "修学旅行": ["京都", "奈良", "東京", "広島"],
    "家族旅行": ["東京", "大阪", "沖縄", "那須"],
    "ファミリー": ["東京", "大阪", "沖縄", "那須"],
    "子連れ":   ["東京", "大阪", "那須", "沖縄"],
    "子供":     ["東京", "大阪", "那須"],
    "一人旅":   ["東京", "大阪", "京都", "博多"],
    "ひとり旅": ["東京", "大阪", "京都"],
    "ソロ旅":   ["東京", "京都", "博多"],
    "女一人":   ["京都", "東京", "金沢"],
    // 予算系
    "高級":     ["東京", "京都", "箱根"],
    "ラグジュアリー": ["東京", "京都", "沖縄"],
    "豪華":     ["東京", "京都", "箱根"],
    "格安":     ["大阪", "東京", "博多"],
    "安い":     ["大阪", "博多", "東京"],
    "コスパ":   ["大阪", "博多", "名古屋"],
    "節約":     ["大阪", "博多"],
    "バジェット": ["東京", "大阪"],
    // その他
    "アニメ":   ["東京", "秋葉原"],
    "聖地":     ["東京", "京都"],
    "絶景":     ["函館", "沖縄", "富士山", "長崎"],
    "インスタ映え": ["京都", "大阪", "沖縄"],
    "映え":     ["京都", "大阪", "沖縄", "金沢"],
    "おすすめ": ["東京", "京都", "大阪", "沖縄", "北海道"],
    "人気":     ["東京", "京都", "大阪", "沖縄"],
    "定番":     ["東京", "京都", "大阪"],
};

/**
 * 自然言語ノイズ除去（拡張版）
 * 「温泉のある宿」「海が見えるホテルを教えて」などの文章から核心キーワードを抽出
 */
function cleanKeyword(text) {
    if (!text) return "";
    let k = text;
    // 場所・位置修飾子
    const stopWords = [
        "の近くの", "の周辺の", "の周りの", "のそばの", "の付近の",
        "の近く", "の周辺", "の周り", "のそば", "の付近",
        "に近い", "に近めの", "の中心部", "の繁華街", "の観光地",
        "のある", "がある", "にある", "である", "な宿", "なホテル",
        "なところ", "なエリア", "のある宿", "のある所", "のあるところ",
        "が見える", "が見れる", "が見渡せる", "を見渡せる",
        "に行く", "に行きたい", "に行きたかった",
        "を探して", "を教えて", "を探す", "をさがす", "を見つけて", "を見つけたい",
        "を探したい", "をお願い", "でお願い",
        "に泊まりたい", "に泊まる", "泊まれる", "泊まる", "に泊まって",
        "でゆっくりしたい", "でくつろぎたい", "でリラックス",
        "おすすめの", "おすすめ", "オススメの", "オススメ", "おすすめを",
        "人気の", "定番の", "有名な", "有名の",
        "付き", "プラン", "コース", "ツアー",
        "エリア", "地域", "あたり", "周辺",
        "ホテル", "旅館", "宿", "宿泊", "旅行", "観光", "リゾート",
        "を楽しみたい", "を楽しめる", "が楽しめる", "ができる", "で遊べる",
        "場所", "スポット", "施設",
        "良い", "いい", "素敵な", "素晴らしい", "きれいな", "綺麗な",
        "ください", "します", "したい",
    ];
    stopWords.forEach(word => {
        k = k.replace(new RegExp(word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), " ");
    });
    return k.replace(/\s+/g, " ").trim();
}

/**
 * 有名ランドマーク名からエリアコードを検索（最長一致）
 */
function findLandmark(query) {
    if (!query) return null;
    const keys = Object.keys(LANDMARK_MAPPING);
    keys.sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (query.includes(key)) return LANDMARK_MAPPING[key];
    }
    return null;
}

/**
 * テーマ・コンセプトキーワードから推奨エリアリストを返す
 * 「温泉」→ ["箱根", "別府", ...] など
 */
function findConcept(query) {
    if (!query) return null;
    const keys = Object.keys(CONCEPT_MAPPING);
    // 長いキーワードを優先してマッチ
    keys.sort((a, b) => b.length - a.length);
    for (const key of keys) {
        if (query.includes(key)) {
            return CONCEPT_MAPPING[key]; // エリア名の配列を返す
        }
    }
    return null;
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

    // --- Phase -1: ランドマーク直接検索（超優先・施設名→エリアコード解決） ---
    // 「東京スカイツリーの近く」「清水寺周辺」など有名施設名で検索された場合
    const landmarkMap = findLandmark(rawQuery);
    if (landmarkMap) {
        const lpParams = `&largeClassCode=${landmarkMap.large}&middleClassCode=${landmarkMap.middle}&smallClassCode=${landmarkMap.small}`;
        console.log(`[Phase -1] Landmark Search: ${landmarkMap.middle}/${landmarkMap.small}`);
        if (dateParams) {
            hotels = await fetchHotelsArray(`${baseVacantUrl}${lpParams}${dateParams}&datumType=1`);
            if (hotels.length > 0) return hotels;
        }
        hotels = await fetchHotelsArray(`${baseHotelUrl}${lpParams}`);
        if (hotels.length > 0) return hotels;
    }

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

    // --- Phase 4.5: コンセプト・テーマ検索（温泉/スキー/海/カップルなど） ---
    // 「温泉のある宿」「海が見えるホテル」など抽象的なキーワードに対応
    const conceptAreas = findConcept(rawQuery) || findConcept(searchWord);
    if (conceptAreas && conceptAreas.length > 0) {
        console.log(`[Phase 4.5] Concept Search: [${conceptAreas.slice(0,3).join(",")}...]`);
        for (const areaName of conceptAreas) {
            const conceptMap = findAreaMapping(areaName);
            if (conceptMap) {
                const cpParams = `&largeClassCode=${conceptMap.large}&middleClassCode=${conceptMap.middle}&smallClassCode=${conceptMap.small}`;
                if (dateParams) {
                    hotels = await fetchHotelsArray(`${baseVacantUrl}${cpParams}${dateParams}&datumType=1`);
                    if (hotels.length > 0) return hotels;
                }
                hotels = await fetchHotelsArray(`${baseHotelUrl}${cpParams}`);
                if (hotels.length > 0) return hotels;
            }
        }
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
