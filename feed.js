
function generateAdvice() {
    const doVal = parseFloat(document.getElementById('do').value);
    const ph = parseFloat(document.getElementById('ph').value);
    const nh3 = parseFloat(document.getElementById('nh3').value);
    const no2 = parseFloat(document.getElementById('no2').value);
    const temp = parseFloat(document.getElementById('temp').value);
    const result = document.getElementById('result');

    let messages = [];
    let riskLevel = "✅ 正常";

    if (isNaN(doVal) || isNaN(ph) || isNaN(nh3) || isNaN(no2) || isNaN(temp)) {
        result.textContent = "请填写所有参数后再生成建议。";
        return;
    }

    if (ph > 8.5) {
        messages.push("pH 值过高，建议暂停使用枯草芽孢杆菌并考虑换水降 pH。");
        riskLevel = "❗ 高度风险";
    }

    if (no2 > 1) {
        messages.push("亚硝酸盐过高，立即停止糖蜜使用，提升系统稳定性。");
        if (riskLevel === "✅ 正常") riskLevel = "⚠️ 中度风险";
    }

    if (nh3 > 5 && temp > 28) {
        messages.push("氨氮高 + 高温，存在溶氧风险，建议开启照明、减少投喂。");
        riskLevel = "❗ 高度风险";
    }

    // 建议量（简单举例，后续可按需换算）
    let molasses = 2000;
    let bacillus = 300;

    // 模拟鱼苗模式路径自动识别逻辑（假设路径包含 fry）
    if (window.location.href.includes("fry")) {
        molasses *= 0.7;
        bacillus *= 0.7;
        messages.push("当前为鱼苗模式，投料剂量按 0.7 倍计算。");
    }

    messages.push(`推荐使用：糖蜜 ${Math.round(molasses)}g，枯草芽孢杆菌 ${Math.round(bacillus)}g`);

    // 创建唯一处理编号
    const now = new Date();
    const timestamp = now.getFullYear().toString() +
        String(now.getMonth() + 1).padStart(2, '0') +
        String(now.getDate()).padStart(2, '0') + "-" +
        String(now.getHours()).padStart(2, '0') +
        String(now.getMinutes()).padStart(2, '0') +
        String(now.getSeconds()).padStart(2, '0');
    messages.push("\n处理ID：" + timestamp);

    result.textContent = riskLevel + "\n\n" + messages.join("\n");
}
