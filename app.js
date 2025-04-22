const MODES = {
  WATER_CULTURE: {
    name: "养水",
    triggers: { nh3: 0.5, no2: 0.1 },
    actions: { carbonRatio: 0.4, bacteriaDose: 15 }
  },
  FISH_FARMING: {
    name: "养鱼",
    triggers: { nh3: 0.2, no2: 0.05 },
    actions: { carbonRatio: 0.2, bacteriaDose: 5, feedReduction: 0.3 }
  }
};

function decideAction(currentMode, params) {
  const { nh3, no2, ph, do: doVal } = params;
  const mode = MODES[currentMode];
  let commands = [];

  if (nh3 >= mode.triggers.nh3) {
    commands.push(
      `添加糖蜜 ${(nh3 * mode.actions.carbonRatio).toFixed(1)}g/L`,
      `接种${mode === MODES.WATER_CULTURE ? "枯草芽孢" : "硝化"}杆菌 ${mode.actions.bacteriaDose}mL/100L`
    );
    if (mode === MODES.FISH_FARMING) {
      commands.push(`减少投喂${mode.actions.feedReduction * 100}%`);
    }
  }

  if (no2 >= mode.triggers.no2) {
    commands.push(mode === MODES.WATER_CULTURE
      ? "保持曝气等待NO₂转化"
      : "检查碳源是否充足");
  }

  if (ph < 6.8) {
    commands.push("⚠️ pH偏低，使用碳酸氢钠每立方添加20g");
  }

  if (doVal < 4) {
    commands.push("⚠️ 溶氧过低，请检查曝气系统");
  }

  return commands.length > 0 ? commands : ["系统正常，维持操作"];
}

function run() {
  const mode = document.getElementById('mode').value;
  const params = {
    nh3: parseFloat(document.getElementById('nh3').value),
    no2: parseFloat(document.getElementById('no2').value),
    ph: parseFloat(document.getElementById('ph').value),
    temp: parseFloat(document.getElementById('temp').value),
    do: parseFloat(document.getElementById('do').value)
  };

  const output = document.getElementById('output');
  const result = decideAction(mode, params);
  output.innerHTML = `
    <b>当前模式：</b>${MODES[mode].name}<br/>
    <b>时间：</b>${new Date().toLocaleString()}<br/>
    <b>建议操作：</b><br/>${result.map(item => `• ${item}`).join('<br/>')}
  `;
}
