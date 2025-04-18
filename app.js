function generateAdvice() {
  const doVal = parseFloat(document.getElementById('do').value);
  const ph = parseFloat(document.getElementById('ph').value);
  const nh = parseFloat(document.getElementById('nh').value);
  const no2 = parseFloat(document.getElementById('no2').value);
  const temp = parseFloat(document.getElementById('temp').value);
  const output = document.getElementById('output');

  if (isNaN(ph) || isNaN(nh) || isNaN(no2) || isNaN(temp)) {
    output.textContent = "请填写所有数值后再生成建议。";
    return;
  }

  let risk = "✅ 正常\n";
  let sug = [];

  if (ph > 8.5) {
    sug.push("pH 值过高，建议暂停使用枯草芽孢杆菌并换水。");
    risk = "❗ 高度风险\n";
  }
  if (no2 > 2) {
    sug.push("亚硝酸盐高，立即停用糖蜜。");
    if (risk === "✅ 正常\n") risk = "⚠️ 中度风险\n";
  }

  sug.push("推荐使用：糖蜜 2000g，枯草芽孢杆菌 300g");
  const id = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0,14);
  output.textContent = risk + sug.join("\n") + "\n处理ID：" + id;
}

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('advice-btn');
  btn.addEventListener('click', generateAdvice);
  btn.addEventListener('touchstart', generateAdvice);
});