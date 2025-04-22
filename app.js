
// 数据库配置
const DB_CONFIG = {
  name: "AquaDB_Pro",
  version: 3,
  storeName: "water_quality_records"
};

let db;

// 初始化数据库
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_CONFIG.name, DB_CONFIG.version);
    
    request.onupgradeneeded = (e) => {
      db = e.target.result;
      if (!db.objectStoreNames.contains(DB_CONFIG.storeName)) {
        const store = db.createObjectStore(DB_CONFIG.storeName, { 
          keyPath: "id",
          autoIncrement: true 
        });
        store.createIndex("ph", "ph", { unique: false });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };

    request.onsuccess = (e) => { 
      db = e.target.result;
      console.log("数据库已就绪");
      resolve();
    };
    request.onerror = (e) => {
      console.error("数据库错误:", e.target.error);
      showError("水质数据库初始化失败");
      reject(e.target.error);
    };
  });
}

// 显示错误信息
function showError(msg) {
  document.getElementById('output').innerHTML = `
    <div class="emergency">
      ⚠️ ${msg}
    </div>
  `;
}

// 获取安全数值（带边框处理）
const getSafeNumber = (id) => {
  const input = document.getElementById(id);
  const value = input.value.trim();
  if (value === '') {
    input.style.border = "2px solid red";
    return NaN;
  }
  const num = parseFloat(value);
  if (isNaN(num)) {
    input.style.border = "2px solid red";
    return NaN;
  }
  input.style.border = "1px solid #ddd";
  return num;
};

// 核心逻辑
window.generateAdvice = async function() {
  const params = {
    mode: document.getElementById('mode').value,
    temp: getSafeNumber('temp'),
    nh3: getSafeNumber('nh3'),
    no2: getSafeNumber('no2'),
    ph: getSafeNumber('ph'),
    do: getSafeNumber('do'),
    timestamp: new Date().toISOString()
  };

  let isValid = true;
  for (const [k, v] of Object.entries(params)) {
    if (isNaN(v) && k !== "mode") isValid = false;
  }
  if (!isValid) {
    showError("请填写所有水质参数（红框）");
    return;
  }

  const advice = [];
  const warnings = [];

  if (params.temp < 26) advice.push("立即加热至26°C以上");
  if (params.temp > 30) advice.push("降温至30°C以下");

  if (params.nh3 > 0.5) {
    warnings.push("氨氮严重超标");
    advice.push("立即换水50%", "停止投喂24小时", "增氧至8mg/L", "添加硝化细菌");
  }

  if (params.ph < 6.5) {
    warnings.push("pH值危险");
    advice.push("停用糖蜜48小时", `添加小苏打 ${Math.ceil((7.0 - params.ph) * 100)}g/m³`);
  } else if (params.ph < 7) {
    advice.push(`小苏打 ${Math.ceil((7.2 - params.ph) * 50)}g/m³`);
  }

  if (params.do > 8) {
    warnings.push("溶解氧过高");
    advice.push("减少增氧设备运行");
  } else if (params.do < 4) {
    advice.push("增加曝气设备");
  }

  if (params.mode === 'water') {
    advice.push("枯草芽孢杆菌 300g/亩");
  } else {
    advice.push("饲料减量30%直到氨氮正常");
  }

  await saveRecord({ ...params, advice, warnings });
  renderAdviceResult(warnings, advice);
};

function renderAdviceResult(warnings, advice) {
  const output = document.getElementById('output');
  if (warnings.length > 0) {
    output.innerHTML = `
      <div class="emergency">
        <h3>⚠️ 紧急告警</h3>
        <ul>${warnings.map(w => `<li>${w}</li>`).join('')}</ul>
      </div>
      <div class="advice">
        <h3>处理方案</h3>
        <ol>${advice.map(a => `<li>${a}</li>`).join('')}</ol>
      </div>
      <small>${new Date().toLocaleString()}</small>
    `;
  } else {
    output.innerHTML = `
      <div style="color:green;">
        <h3>✅ 水质正常</h3>
        <ul>${advice.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>
      <small>${new Date().toLocaleString()}</small>
    `;
  }
}

async function saveRecord(data) {
  if (!db) await initDB();
  return new Promise((resolve) => {
    const tx = db.transaction(DB_CONFIG.storeName, "readwrite");
    tx.objectStore(DB_CONFIG.storeName).add(data);
    tx.oncomplete = resolve;
  });
}

window.loadMoreHistory = async function() {
  if (!db) await initDB();
  const tx = db.transaction(DB_CONFIG.storeName, "readonly");
  const store = tx.objectStore(DB_CONFIG.storeName);
  const request = store.index("timestamp").openCursor(null, "prev");

  let count = 0;
  const historyDiv = document.getElementById('history');
  historyDiv.innerHTML = '<h3>最近水质记录</h3>';

  request.onsuccess = (e) => {
    const cursor = e.target.result;
    if (cursor && count < 3) {
      const record = cursor.value;
      historyDiv.innerHTML += `
        <div class="history-item">
          <strong>${new Date(record.timestamp).toLocaleString()}</strong>
          <div>pH: ${record.ph} | 氨氮: ${record.nh3} | 溶解氧: ${record.do}</div>
          ${record.warnings?.length ? 
            `<span class="warn-tag">⚠️ ${record.warnings[0]}</span>` : 
            '<span class="ok-tag">✓ 正常</span>'}
        </div>
      `;
      count++;
      cursor.continue();
    }
  };
};

document.addEventListener('DOMContentLoaded', () => {
  initDB().catch(err => {
    console.error("启动失败:", err);
    showError("系统初始化失败，请刷新页面");
  });
});
