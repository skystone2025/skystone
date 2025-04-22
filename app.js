
let db;
const DB_NAME = "SkyStoneDB";
const DB_VERSION = 1;
const STORE_NAME = "feed_advice";

function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "timestamp" });
      }
    };
    request.onsuccess = (e) => {
      db = e.target.result;
      resolve(db);
    };
    request.onerror = (e) => {
      reject(e.target.error);
    };
  });
}

async function saveAdvice(advice) {
  if (!db) await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(STORE_NAME, "readwrite");
    tx.objectStore(STORE_NAME).put({
      timestamp: Date.now(),
      date: new Date().toLocaleDateString('zh-CN'),
      advice: advice.join("，")
    });
    tx.oncomplete = () => resolve();
  });
}

async function generateAdvice() {
  const ph = parseFloat(document.getElementById('ph').value);
  if (isNaN(ph)) {
    alert("请输入有效的 pH 值");
    return;
  }

  const advice = [];
  if (ph < 6.5) {
    advice.push('<span class="emergency">⚠️ 停糖蜜24小时 + 双倍小苏打</span>');
    document.getElementById('output').innerHTML = advice.join("<br>");
    await saveAdvice(advice);
    return;
  }

  if (ph < 7) {
    const soda = Math.ceil((7.2 - ph) * 50);
    advice.push(`小苏打 ${(soda / 1000).toFixed(1)}kg`);
  }

  const mode = document.getElementById('mode').value;
  if (mode === 'water') {
    advice.push(`糖蜜 ${ph < 7 ? 999 : 1999}g`, "枯草芽孢杆菌 300g");
  } else {
    advice.push(`糖蜜 ${ph < 7 ? 300 : 500}g`, "枯草芽孢杆菌 200g", "饲料 4.5kg");
  }

  document.getElementById('output').innerHTML = `
    ✅ 正常<br>
    日期：${new Date().toLocaleDateString('zh-CN')}<br>
    推荐：${advice.join("，")}
  `;

  await saveAdvice(advice);
}

document.addEventListener('DOMContentLoaded', initDB);
