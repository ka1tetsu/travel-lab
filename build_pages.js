const fs = require('fs');

const index = fs.readFileSync('index.html', 'utf8');
const headEnd = index.indexOf('</head>');
let head = index.substring(0, headEnd) + '</head>';
// 構造化データを削除して汎用的にする（ページに合わせて後で調整可能）
head = head.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, '');

const headerMatch = index.match(/<body>\s*<!-- ── HEADER ── -->\s*<header class="site-header">[\s\S]*?<\/header>/);
const header = headerMatch ? headerMatch[0] : '<body>';

const footerMatch = index.match(/<!-- ── FOOTER ── -->\s*<footer class="site-footer"[\s\S]*?<\/html>/);
const footer = footerMatch ? footerMatch[0] : '</body>\n</html>';

const pages = [
    { name: 'domestic-hotels', title: '国内ホテル比較', content: '<p>日本全国のホテル・温泉旅館を横断検索・比較できます。トップページから検索をお試しください。</p>' },
    { name: 'overseas-hotels', title: '海外ホテル比較', content: '<p>ハワイ、韓国、台湾など人気の海外旅行先のホテルを最安値で検索できます。（現在準備中です。近日公開予定！）</p>' },
    { name: 'flights', title: '航空券比較', content: '<p>航空券の最安値比較サービスは現在準備中です。近日公開予定です！</p>' },
    { name: 'shinkansen', title: '新幹線予約', content: '<p>JR各社の公式新幹線予約サイトへのご案内です。（現在準備中です）</p>' },
    { name: 'guide', title: '使い方ガイド', content: '<p>1. 目的地、宿泊日、人数を入力して「検索」ボタンを押します。<br>2. 数秒で楽天トラベルやじゃらんなどの複数サイトから情報を収集します。<br>3. 最もお得なプランが「最安値」バッジ付きで表示されます。<br>4. 「予約する」ボタンから各旅行サイトへ移動し、予約を完了させてください。</p>' },
    { name: 'faq', title: 'よくある質問', content: '<div style="margin-bottom: 20px;"><h3>Q. 無料で利用できますか？</h3><p>A. はい、当サービスは価格比較サービスであり、完全に無料でご利用いただけます。</p></div><div style="margin-bottom: 20px;"><h3>Q. トラベル・ラボで直接予約はできますか？</h3><p>A. 当サイトは比較サイトのため、実際の予約は遷移先の各提携旅行サイト（楽天トラベル等）にて行っていただきます。</p></div>' },
    { name: 'contact', title: 'お問い合わせ', content: '<p>サービスに関するお問い合わせ、広告掲載、不具合のご報告については、以下のメールアドレスまでご連絡ください。</p><p style="margin-top:20px; font-weight:bold;"><a href="mailto:support@example.com" style="color:var(--primary);">support@example.com</a></p><p style="margin-top:10px; font-size: 0.9em;">※各ホテルの予約内容やキャンセルに関するお問い合わせは、各旅行サイトへ直接ご連絡をお願いいたします。</p>' },
    { name: 'terms', title: '利用規約', content: '<h3>第1条（適用）</h3><p>本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</p><h3>第2条（免責）</h3><p>当社は、本サービスに事実上または法律上の瑕疵がないことを明示的にも黙示的にも保証しておりません。</p>' },
    { name: 'privacy', title: 'プライバシーポリシー', content: '<h3>個人情報の取り扱いについて</h3><p>当サイトでは、ユーザーの個人情報（氏名、住所、電話番号等）を直接取得・保存いたしません。ホテルの予約手続きは全て遷移先の提携サイトにて行われます。</p><h3>Cookieの使用について</h3><p>当サイトではアクセス解析や広告表示（Google AdSenseを含む）のためにCookieを使用しています。</p>' },
    { name: 'law', title: '特定商取引法の表記', content: '<p>本サイトはアフィリエイトプログラムによりサービスをご紹介しており、直接の通信販売・予約手配は行っておりません。</p><p>宿泊料金やキャンセル規定などの詳細は、各リンク先の販売元サイトにてご確認ください。</p>' },
    { name: 'disclaimer', title: '免責事項', content: '<p>当サイトの掲載情報には万全を期しておりますが、APIを通じて取得する価格・空室情報の正確性、最新性についてはこれを保証するものではありません。</p><p>ホテル予約にあたっては、必ずリンク先の旅行・宿泊予約サイトの表示内容（最終料金、キャンセルポリシー、サービス内容）をご確認のうえ、ユーザーご自身の責任にてご判断ください。</p>' },
];

pages.forEach(p => {
    const html = `${head.replace(/<title>.*?<\/title>/, `<title>${p.title} | トラベル・ラボ</title>`)}
${header}
<main class="page-content" style="padding: 120px 20px 60px; max-width: 800px; margin: 0 auto; min-height: 50vh;">
  <h1 style="font-size: 1.8rem; color: var(--text); border-bottom: 3px solid var(--primary); padding-bottom: 12px; margin-bottom: 24px;">${p.title}</h1>
  <div class="page-text" style="line-height: 1.8; color: var(--text-light); font-size: 1.05rem;">
    ${p.content}
  </div>
</main>
${footer}`;
    fs.writeFileSync(`${p.name}.html`, html, 'utf8');
});

function replaceLinks(htmlStr) {
    return htmlStr
        .replace(/<a href="#">国内ホテル比較<\/a>/g, '<a href="domestic-hotels.html">国内ホテル比較</a>')
        .replace(/<a href="#">海外ホテル比較<\/a>/g, '<a href="overseas-hotels.html">海外ホテル比較</a>')
        .replace(/<a href="#">航空券比較（準備中）<\/a>/g, '<a href="flights.html">航空券比較（準備中）</a>')
        .replace(/<a href="#">航空券<\/a>/g, '<a href="flights.html">航空券</a>')
        .replace(/<a href="#">新幹線予約リンク<\/a>/g, '<a href="shinkansen.html">新幹線予約リンク</a>')
        .replace(/<a href="#">新幹線<\/a>/g, '<a href="shinkansen.html">新幹線</a>')
        .replace(/<a href="#">使い方ガイド<\/a>/g, '<a href="guide.html">使い方ガイド</a>')
        .replace(/<a href="#">よくある質問<\/a>/g, '<a href="faq.html">よくある質問</a>')
        .replace(/<a href="#">お問い合わせ<\/a>/g, '<a href="contact.html">お問い合わせ</a>')
        .replace(/<a href="#">利用規約<\/a>/g, '<a href="terms.html">利用規約</a>')
        .replace(/<a href="#">プライバシーポリシー<\/a>/g, '<a href="privacy.html">プライバシーポリシー</a>')
        .replace(/<a href="#">特定商取引法の表記<\/a>/g, '<a href="law.html">特定商取引法の表記</a>')
        .replace(/<a href="#">免責事項<\/a>/g, '<a href="disclaimer.html">免責事項</a>');
}

fs.writeFileSync('index.html', replaceLinks(index), 'utf8');
let results = fs.readFileSync('results.html', 'utf8');
fs.writeFileSync('results.html', replaceLinks(results), 'utf8');

console.log('Successfully generated all pages and updated links!');
