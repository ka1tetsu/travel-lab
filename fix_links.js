const fs = require('fs');
const glob = require('glob');

const files = glob.sync('*.html');

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    content = content
        .replace(/<a\s+href="[^"]*"\s*>国内ホテル比較<\/a>/g, '<a href="domestic-hotels.html">国内ホテル比較</a>')
        .replace(/<a\s+href="[^"]*"\s*>海外ホテル比較<\/a>/g, '<a href="overseas-hotels.html">海外ホテル比較</a>')
        .replace(/<a\s+href="[^"]*"\s*>航空券比較（準備中）<\/a>/g, '<a href="flights.html">航空券比較（準備中）</a>')
        .replace(/<a\s+href="[^"]*"\s*>航空券<\/a>/g, '<a href="flights.html">航空券</a>')
        .replace(/<a\s+href="[^"]*"\s*>新幹線予約リンク<\/a>/g, '<a href="shinkansen.html">新幹線予約リンク</a>')
        .replace(/<a\s+href="[^"]*"\s*>新幹線<\/a>/g, '<a href="shinkansen.html">新幹線</a>')
        .replace(/<a\s+href="[^"]*"\s*>使い方ガイド<\/a>/g, '<a href="guide.html">使い方ガイド</a>')
        .replace(/<a\s+href="[^"]*"\s*>よくある質問<\/a>/g, '<a href="faq.html">よくある質問</a>')
        .replace(/<a\s+href="[^"]*"\s*>お問い合わせ<\/a>/g, '<a href="contact.html">お問い合わせ</a>')
        .replace(/<a\s+href="[^"]*"\s*>利用規約<\/a>/g, '<a href="terms.html">利用規約</a>')
        .replace(/<a\s+href="[^"]*"\s*>プライバシーポリシー<\/a>/g, '<a href="privacy.html">プライバシーポリシー</a>')
        .replace(/<a\s+href="[^"]*"\s*>特定商取引法の表記<\/a>/g, '<a href="law.html">特定商取引法の表記</a>')
        .replace(/<a\s+href="[^"]*"\s*>免責事項<\/a>/g, '<a href="disclaimer.html">免責事項</a>');

    fs.writeFileSync(file, content, 'utf8');
});
console.log('Fixed links in all files.');
