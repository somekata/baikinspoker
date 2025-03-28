// main.js
import { getYakus } from "./game.js";
import { getCardImagePath, calcTotalScore, formatYakus } from "./utils.js";

let charaData = [];
let yakuData = [];
let deck = [];
let playerHand = [];
let cpuHand = [];
let isPlayerTurn = true;
let historyLog = [];

async function loadData() {
  const baseURL = "https://somekata.github.io/baikinspoker/";
  const charaRes = await fetch(`${baseURL}data/chara.json`);
  const yakuRes = await fetch(`${baseURL}data/yaku.json`);  
  charaData = await charaRes.json();
  yakuData = await yakuRes.json();
}

function displayHand(hand, containerId, selectable = false) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  hand.forEach((card, index) => {
    const div = document.createElement("div");
    div.className = "card";
    div.dataset.index = index;

    const img = document.createElement("img");
    img.src = getCardImagePath(card);
    img.alt = card.name;

    div.appendChild(img);
    container.appendChild(div);

    if (selectable) {
      div.addEventListener("click", () => {
        document.querySelectorAll("#player-hand .card").forEach(c => c.classList.remove("selected"));
        div.classList.add("selected");
        document.getElementById("next-btn").disabled = false;
      });
    }
  });
}

function updateStatus() {
  const playerYakus = getYakus(playerHand, yakuData);
  const cpuYakus = getYakus(cpuHand, yakuData);

  document.getElementById("current-yaku").textContent = formatYakus(playerYakus);
  document.getElementById("score").textContent = calcTotalScore(playerYakus);
  document.getElementById("cpu-yaku").textContent = formatYakus(cpuYakus);
  document.getElementById("cpu-score").textContent = calcTotalScore(cpuYakus);

  if (playerYakus.length > 0 || cpuYakus.length > 0) {
    document.getElementById("finish-btn").disabled = false;
  }
}

function exchangeTurn() {
  if (deck.length === 0) return;

  if (isPlayerTurn) {
    const selected = document.querySelector("#player-hand .card.selected");
    if (selected) {
      const index = parseInt(selected.dataset.index);
      const newCard = deck.pop();
      if (newCard) playerHand[index] = newCard;
      isPlayerTurn = false;
      document.getElementById("next-btn").disabled = false;
      document.querySelectorAll("#player-hand .card").forEach(c => c.classList.remove("selected"));
    } else {
      alert("カードを選択してください。");
      return;
    }
  } else {
    const index = Math.floor(Math.random() * cpuHand.length);
    const newCard = deck.pop();
    if (newCard) cpuHand[index] = newCard;
    isPlayerTurn = true;
    document.getElementById("next-btn").disabled = true;
  }

  displayHand(playerHand, "player-hand", isPlayerTurn);
  displayHand(cpuHand, "cpu-hand", false);
  updateStatus();

  if (deck.length === 0) {
    document.getElementById("next-btn").disabled = true;
    document.getElementById("finish-btn").disabled = false;
  }
}

function showResult() {
  const playerScore = calcTotalScore(getYakus(playerHand, yakuData));
  const cpuScore = calcTotalScore(getYakus(cpuHand, yakuData));
  const winner = playerScore > cpuScore ? "あなたの勝ち！"
    : playerScore < cpuScore ? "コンピューターの勝ち！"
    : "引き分け！";
  document.getElementById("winner-message").textContent = winner;

  // 履歴保存
  const entry = {
    date: new Date().toLocaleString(),
    playerScore,
    cpuScore,
    result: winner
  };
  historyLog.push(entry);
  updateHistoryLog();
}

function updateHistoryLog() {
  const log = document.getElementById("history-log");
  log.innerHTML = "";
  if (historyLog.length === 0) {
    log.innerHTML = "<p>まだ履歴はありません。</p>";
    return;
  }
  const table = document.createElement("table");
  table.innerHTML = "<tr><th>日時</th><th>あなた</th><th>コンピューター</th><th>結果</th></tr>";
  historyLog.slice().reverse().forEach(entry => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${entry.date}</td><td>${entry.playerScore}</td><td>${entry.cpuScore}</td><td>${entry.result}</td>`;
    table.appendChild(row);
  });
  log.appendChild(table);
}

function startGame() {
  deck = [...charaData].sort(() => 0.5 - Math.random());
  playerHand = deck.splice(0, 5);
  cpuHand = deck.splice(0, 5);
  isPlayerTurn = true;

  displayHand(playerHand, "player-hand", true);
  displayHand(cpuHand, "cpu-hand", false);
  updateStatus();

  document.getElementById("next-btn").disabled = true;
  document.getElementById("finish-btn").disabled = true;
  document.getElementById("winner-message").textContent = "";
}

async function setup() {
  await loadData();
  document.getElementById("start-btn").addEventListener("click", startGame);
  document.getElementById("next-btn").addEventListener("click", exchangeTurn);
  document.getElementById("finish-btn").addEventListener("click", showResult);
}

setup();

async function loadYakuTable() {
  const baseURL = "https://somekata.github.io/baikinspoker/";
  const res = await fetch(`${baseURL}data/yaku.json`);
  const yakuData = await res.json();
  const tableBody = document.getElementById("yaku-table-body");
  if (!tableBody) return;

  yakuData.forEach(yaku => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    nameTd.textContent = yaku.yaku_name;
    nameTd.style.border = "1px solid #333";
    nameTd.style.padding = "0.5rem";

    const descTd = document.createElement("td");
    descTd.textContent = yaku.description;
    descTd.style.border = "1px solid #333";
    descTd.style.padding = "0.5rem";

    const scoreTd = document.createElement("td");
    scoreTd.textContent = yaku.score;
    scoreTd.style.border = "1px solid #333";
    scoreTd.style.padding = "0.5rem";

    tr.appendChild(nameTd);
    tr.appendChild(descTd);
    tr.appendChild(scoreTd);
    tableBody.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadYakuTable(); // ← INFO用役テーブル表示
});
async function loadCharaTable() {
  const baseURL = "https://somekata.github.io/baikinspoker/";
  const res = await fetch(`${baseURL}data/chara.json`);
  const charaData = await res.json();
  const tableBody = document.getElementById("chara-table-body");
  if (!tableBody) return;

  charaData.forEach(ch => {
    const tr = document.createElement("tr");

    const nameTd = document.createElement("td");
    const name = ch.name || "";
    const sci = ch.scientificNameEn || "";
    nameTd.innerHTML = `${name} / ${sci}`;    
    nameTd.style.border = "1px solid #333";
    nameTd.style.padding = "0.5rem";

    const typeTd = document.createElement("td");
    typeTd.textContent = Array.isArray(ch.type) ? ch.type.join(", ") : ch.type || "";
    typeTd.style.border = "1px solid #333";
    typeTd.style.padding = "0.5rem";

    const yakuTd = document.createElement("td");
    const yakuList = [];

    if (ch.yaku_type) yakuList.push(ch.yaku_type);
    if (ch.yaku_area) {
      if (Array.isArray(ch.yaku_area)) {
        yakuList.push(...ch.yaku_area);
      } else if (typeof ch.yaku_area === "object") {
        yakuList.push(...Object.values(ch.yaku_area));
      } else {
        yakuList.push(ch.yaku_area);
      }
    }
    if (ch.yaku_nature) yakuList.push(ch.yaku_nature);

    yakuTd.textContent = [...new Set(yakuList)].join(" / ");
    yakuTd.style.border = "1px solid #333";
    yakuTd.style.padding = "0.5rem";

    tr.appendChild(nameTd);
    tr.appendChild(typeTd);
    tr.appendChild(yakuTd);
    tableBody.appendChild(tr);
  });
}

// 既存のloadYakuTableと同じように呼び出す
document.addEventListener("DOMContentLoaded", () => {
  loadCharaTable();
});
