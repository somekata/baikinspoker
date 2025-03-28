// script/game.js

// ランダムな手札を返す（デフォルト5枚）
export function getRandomHand(deck, count = 5) {
  const shuffled = [...deck].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// 役を判定する関数（chara5枚 + yakuData → 成立役のリスト）
export function getYakus(hand, yakuData) {
  const results = [];

  // type, nature カテゴリ共通処理
  const checkCategory = (category) => {
    const yakuList = yakuData.filter(y => y.category === category);

    yakuList.forEach(yaku => {
      const keyword = yaku.yaku_name.replace("オール", "").replace(/炎$/, "");
      const ok = hand.every(card => {
        const value = card[category];
        if (!value) return false;
        return Array.isArray(value) ? value.includes(keyword) : value.includes(keyword);
      });

      if (ok) results.push({ name: yaku.yaku_name, score: yaku.score });
    });
  };

  // area 特別処理（コードベースで判定）
  const checkAreaYakus = () => {
    const areaYakus = yakuData.filter(y => y.category === "area");

    const areaCodeMap = {
      "オール髄膜炎": "N",
      "オール肺感染": "R",
      "オール腸炎": "E",
      "オールUTI": "U"
    };

    areaYakus.forEach(yaku => {
      const code = areaCodeMap[yaku.yaku_name];
      if (!code) return;

      const ok = hand.every(card => {
        const areaField = card.area;
        if (!areaField) return false;
        return Array.isArray(areaField) ? areaField.includes(code) : areaField === code;
      });

      if (ok) results.push({ name: yaku.yaku_name, score: yaku.score });
    });
  };

  checkCategory("type");
  checkAreaYakus();
  checkCategory("nature");

  // 特殊役：ロイヤルファミリーズ（ID 1〜5）
  const ids = hand.map(c => c.id);
  const isRoyalFamily = ids.every(id => [1, 2, 3, 4, 5].includes(id));
  if (isRoyalFamily) {
    results.push({ name: "ロイヤルファミリーズ", score: 30 });
  }

  return results;
}
