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
        const keyword = yaku.yaku_name.replace("オール", "").replace(/炎$/, "");
        const ok = hand.every(card => {
          const value = card[category];
          if (!value) return false;
  
          if (Array.isArray(value)) {
            return value.includes(keyword);
          } else {
            return value.includes(keyword);
          }
        });
  
        if (ok) results.push({ name: yaku.yaku_name, score: yaku.score });
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
  
    // 特殊役：ロイヤルファミリーズ
    const ids = hand.map(c => c.id);
    const isRoyalFamily = ids.every(id => [1, 2, 3, 4, 5].includes(id));
    if (isRoyalFamily) {
      results.push({ name: "ロイヤルファミリーズ", score: 30 });
    }
  
    return results;
  }
  