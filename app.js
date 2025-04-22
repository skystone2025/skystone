
function generateAdvice() {
  const ph = parseFloat(document.getElementById('phInput').value);
  const date = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
  const id = new Date().toISOString().replace(/[-T:\.Z]/g, '');
  let soda = ph < 7 ? Math.ceil((7.2 - ph) * 50 * 100) : 0;
  let sugar = ph < 7 ? 999 : 2000;
  let output = "<div class='status'>✅ 正常</div>";
  output += `<div>日期：${date}</div>`;
  output += `<div>推荐使用：糖蜜 ${sugar}g，枯草芽孢杆菌 300g${soda > 0 ? "，小苏打 " + (soda/1000).toFixed(1) + "kg" : ""}</div>`;
  output += `<div>处理ID：${id}</div>`;
  document.getElementById('output').innerHTML = output;
}
