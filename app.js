// 增强数值获取（解决所有解析问题）
const getValidNumber = (id) => {
  const input = document.getElementById(id);
  const value = input.value.replace(/,/g, '.').trim(); // 兼容逗号/小数点
  const num = parseFloat(value);
  input.style.border = isNaN(num) ? "2px solid red" : "1px solid #ddd";
  return isNaN(num) ? null : num;
};

window.generateAdvice = async function() {
  const params = {
    mode: document.getElementById('mode').value,
    temp: getValidNumber('temp'),
    nh3: getValidNumber('nh3'),
    no2: getValidNumber('no2'),
    ph: getValidNumber('ph'),
    do: getValidNumber('do')
  };

  const missingParams = Object.entries(params)
    .filter(([k,v]) => v === null && k !== 'mode')
    .map(([k]) => k);

  if (missingParams.length > 0) {
    document.getElementById('output').innerHTML = `
      <div class="emergency">
        ⚠️ 以下参数需要修正：
        ${missingParams.map(p => `<br>• ${p}`).join('')}
      </div>
    `;
    return;
  }

  document.getElementById('output').innerHTML = `
    ✅ 参数校验通过<br>${new Date().toLocaleString()}
  `;
};

window.loadMoreHistory = function() {
  document.getElementById('history').innerHTML = "<p>历史记录功能尚未启用。</p>";
};
