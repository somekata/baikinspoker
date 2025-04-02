// script/game.js

// ランダムな手札を返す（デフォルト5枚）
export function getRandomHand(deck, count = 5) {
    const shuffled = [...deck].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  
  // 役を判定する関数（chara5枚 + yakuData → 成立役のリスト）
  export function getYakus(hand, yakuData) {
    const results = [];
  
// 汎用カテゴリチェック関数
const checkCategory = (category) => {
  const yakuList = yakuData.filter(y => y.category === category);

  yakuList.forEach(yaku => {
    const keyword = yaku.yaku_name.replace(/^オール/, "").trim();

    const ok = hand.every(card => {
      let value = card[category];
      if (!value) return false;

      // どんな型でも配列化してから判定
      const values = Array.isArray(value) ? value : [value];
      return values.some(v => v.includes(keyword));
    });

    if (ok) {
      console.log(`✅ 成立: ${yaku.yaku_name}（category: ${category}, keyword: ${keyword}）`);
      results.push({ name: yaku.yaku_name, score: Number(yaku.score) });
    } else {
      console.log(`❌ 不成立: ${yaku.yaku_name}`);
    }
  });
};
  
    checkCategory("type");
    checkCategory("nature");

    // areaはオブジェクトになっているので別処理にする
const areaYakus = yakuData.filter(y => y.category === "area");
areaYakus.forEach(yaku => {
  const keyword = yaku.yaku_name.replace("オール", "").replace(/炎$/, "");
  const ok = hand.every(card => {
    const areaObj = card.area;  // 例: ["N", "R"]
    const yakuAreaObj = card.yaku_area;  // 例: { N: "オール髄膜炎", R: "オール肺感染" }
    if (!areaObj || !yakuAreaObj) return false;
    // yakuData 側の条件に合うキーが存在し、かつそれが keyword を含んでいる
    return Object.values(yakuAreaObj).includes(yaku.yaku_name);
  });
  if (ok) results.push({ name: yaku.yaku_name, score: yaku.score });
});
console.log("🃏 成立役リスト:", results.map(r => r.name));
    return results;
  }
  