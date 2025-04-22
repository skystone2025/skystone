
function generateAdvice() {
  const temp = parseFloat(document.getElementById('temp').value);
  const nh3 = parseFloat(document.getElementById('nh3').value);
  const no2 = parseFloat(document.getElementById('no2').value);
  const ph = parseFloat(document.getElementById('ph').value);
  const doVal = parseFloat(document.getElementById('do').value);

  let sugar = ph < 7 ? 999 : 2000;
  let soda = ph < 7 ? ((7.2 - ph) * 50 * 100 / 1000).toFixed(1) + "kg" : "0kg";
  let advice = "✅ 正常<br>日期：2025年04月22日<br>";
  advice += "推荐使用： 糖蜜 " + sugar + "g，枯草芽孢杆菌 300g";
  if (ph < 7) advice += "，小苏打 " + soda;
  advice += "<br>处理ID：20250422" + new Date().toTimeString().slice(0,8).replace(/:/g, '');
  document.getElementById('output').innerHTML = advice;
}
