// script/utils.js

// 0埋め（例: 1 → "01"）
export function padZero(num, length = 2) {
    return String(num).padStart(length, '0');
  }
  
  // カード画像のパスを返す（charaオブジェクトから）
  export function getCardImagePath(card) {
    return card.sm_card || `img/sm-card-${padZero(card.id)}.png`;
  }
  
  // スコア合計を計算（役リストを受け取る）
  export function calcTotalScore(yakus) {
    const total = yakus.reduce((sum, y) => sum + Number(y.score), 0);
    console.log("🧮 スコア計算詳細:", yakus.map(y => `${y.name} (${y.score})`).join(", "), `=> 合計: ${total}`);
    return total;
  }
  
  
  // 役の名前だけを並べて表示用にする
  export function formatYakus(yakus) {
    return yakus.length ? yakus.map(y => y.name).join(" / ") : "---";
  }
  