const fields = {
  age: document.getElementById("age"),
  targetRetireAge: document.getElementById("targetRetireAge"),
  currentAssets: document.getElementById("currentAssets"),
  monthlyInvest: document.getElementById("monthlyInvest"),
  annualReturn: document.getElementById("annualReturn"),
  inflation: document.getElementById("inflation"),
  monthlyExpense: document.getElementById("monthlyExpense")
};

const output = {
  retireAge: document.getElementById("retireAge"),
  retireAsset: document.getElementById("retireAsset"),
  depleteAge: document.getElementById("depleteAge"),
  swr: document.getElementById("swr"),
  extraMonthly: document.getElementById("extraMonthly"),
  status: document.getElementById("status"),
  horizonLabel: document.getElementById("horizonLabel")
};

const charts = {
  asset: document.getElementById("assetChart"),
  cashflow: document.getElementById("cashflowChart"),
  depletion: document.getElementById("depletionChart")
};

const defaults = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value]));
const money = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 1 });

function readInputs() {
  const input = Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, Number(field.value)]));
  return {
    age: clamp(input.age, 18, 90, 35),
    targetRetireAge: clamp(input.targetRetireAge, 19, 95, 55),
    currentAssets: clamp(input.currentAssets, 0, 1000000000, 0),
    monthlyInvest: clamp(input.monthlyInvest, 0, 10000000, 0),
    annualReturn: clamp(input.annualReturn, -20, 30, 0),
    inflation: clamp(input.inflation, 0, 20, 0),
    monthlyExpense: clamp(input.monthlyExpense, 0, 10000000, 0)
  };
}

function clamp(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function futureValue(principal, monthly, annualRate, years) {
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = Math.pow(1 + annualRate, 1 / 12) - 1;
  let value = principal;
  for (let i = 0; i < months; i += 1) {
    value = value * (1 + monthlyRate) + monthly;
  }
  return Math.max(0, value);
}

function project(input, addedMonthly = 0) {
  const annualReturn = input.annualReturn / 100;
  const inflation = input.inflation / 100;
  const realReturn = ((1 + annualReturn) / (1 + inflation)) - 1;
  const plannedRetireAge = Math.max(input.age, input.targetRetireAge);
  const targetYears = plannedRetireAge - input.age;
  const maxAge = 110;
  const monthlyInvest = input.monthlyInvest + addedMonthly;
  const annualExpenseNow = input.monthlyExpense * 12;
  const assets = [];
  const cashflows = [];
  let retirementAge = null;
  let retirementAsset = 0;

  for (let age = input.age; age <= maxAge; age += 1) {
    const years = age - input.age;
    const asset = futureValue(input.currentAssets, monthlyInvest, annualReturn, years);
    const expense = annualExpenseNow * Math.pow(1 + inflation, years);
    const inflatedFireNumber = expense / 0.04;
    assets.push({ age, asset, fireNumber: inflatedFireNumber });
    cashflows.push({ age, inflow: monthlyInvest * 12, outflow: age >= plannedRetireAge ? expense : 0 });
    if (retirementAge === null && annualExpenseNow === 0) {
      retirementAge = age;
      retirementAsset = asset;
    }
    if (retirementAge === null && asset >= inflatedFireNumber) {
      retirementAge = age;
      retirementAsset = asset;
    }
  }

  const targetRetirementAsset = futureValue(input.currentAssets, monthlyInvest, annualReturn, targetYears);
  if (retirementAge === null) {
    retirementAge = plannedRetireAge;
    retirementAsset = targetRetirementAsset;
  }

  const depletion = [];
  let balance = retirementAsset;
  let depleteAge = null;
  for (let age = retirementAge; age <= maxAge; age += 1) {
    const yearsAfterStart = age - input.age;
    const annualExpense = annualExpenseNow * Math.pow(1 + inflation, yearsAfterStart);
    depletion.push({ age, asset: Math.max(0, balance), expense: annualExpense });
    if (age > retirementAge) {
      balance = balance * (1 + annualReturn) - annualExpense;
    }
    if (balance <= 0 && depleteAge === null) {
      depleteAge = age;
      depletion.push({ age: age + 1, asset: 0, expense: annualExpense * (1 + inflation) });
      break;
    }
  }

  const swr = retirementAsset > 0 ? (annualExpenseNow * Math.pow(1 + inflation, Math.max(0, retirementAge - input.age))) / retirementAsset : 0;
  return { assets, cashflows, depletion, retirementAge, retirementAsset, depleteAge, swr, realReturn };
}

function findExtraMonthly(input) {
  if (input.targetRetireAge <= input.age) return 0;
  if (input.monthlyExpense <= 0) return 0;
  const targetYears = input.targetRetireAge - input.age;
  const targetExpense = input.monthlyExpense * 12 * Math.pow(1 + input.inflation / 100, targetYears);
  const targetFireNumber = targetExpense / 0.04;
  if (futureValue(input.currentAssets, input.monthlyInvest, input.annualReturn / 100, targetYears) >= targetFireNumber) return 0;
  let low = 0;
  let high = 1000;
  while (futureValue(input.currentAssets, input.monthlyInvest + high, input.annualReturn / 100, targetYears) < targetFireNumber && high < 2000000) {
    high *= 2;
  }
  if (high >= 2000000 && futureValue(input.currentAssets, input.monthlyInvest + high, input.annualReturn / 100, targetYears) < targetFireNumber) {
    return high;
  }
  for (let i = 0; i < 40; i += 1) {
    const mid = (low + high) / 2;
    const value = futureValue(input.currentAssets, input.monthlyInvest + mid, input.annualReturn / 100, targetYears);
    if (value >= targetFireNumber) high = mid;
    else low = mid;
  }
  return Math.ceil(high / 100) * 100;
}

function fitCanvas(canvas) {
  const ratio = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = Math.max(320, Math.round(rect.width * ratio));
  canvas.height = Math.max(220, Math.round(rect.height * ratio));
  const ctx = canvas.getContext("2d");
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  return { ctx, width: rect.width, height: rect.height };
}

function drawChart(canvas, series, options) {
  const { ctx, width, height } = fitCanvas(canvas);
  const pad = { left: 56, right: 18, top: 20, bottom: 38 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const ages = series.flatMap(line => line.points.map(point => point.age));
  const values = series.flatMap(line => line.points.map(point => point.value));
  const minAge = Math.min(...ages);
  const maxAge = Math.max(...ages);
  const maxValue = Math.max(1, ...values) * 1.08;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fbfdfb";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "#dfe7df";
  ctx.lineWidth = 1;
  ctx.font = "12px Arial";
  ctx.fillStyle = "#61706a";

  for (let i = 0; i <= 4; i += 1) {
    const y = pad.top + (plotH * i) / 4;
    const value = maxValue * (1 - i / 4);
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(width - pad.right, y);
    ctx.stroke();
    ctx.fillText(options.money ? compactMoney(value) : number.format(value), 8, y + 4);
  }

  for (let i = 0; i <= 4; i += 1) {
    const x = pad.left + (plotW * i) / 4;
    const age = minAge + ((maxAge - minAge) * i) / 4;
    ctx.fillText(`${Math.round(age)}歲`, x - 14, height - 14);
  }

  series.forEach(line => {
    ctx.beginPath();
    ctx.strokeStyle = line.color;
    ctx.lineWidth = 2.5;
    line.points.forEach((point, index) => {
      const x = pad.left + ((point.age - minAge) / Math.max(1, maxAge - minAge)) * plotW;
      const y = pad.top + (1 - point.value / maxValue) * plotH;
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  });

  let legendX = pad.left;
  series.forEach(line => {
    ctx.fillStyle = line.color;
    ctx.fillRect(legendX, 12, 10, 10);
    ctx.fillStyle = "#18211e";
    ctx.fillText(line.name, legendX + 15, 22);
    legendX += ctx.measureText(line.name).width + 38;
  });
}

function compactMoney(value) {
  if (value >= 100000000) return `${number.format(value / 100000000)}億`;
  if (value >= 10000) return `${number.format(value / 10000)}萬`;
  return number.format(value);
}

function render() {
  const input = readInputs();
  const result = project(input);
  const extra = findExtraMonthly(input);
  const targetResult = project(input, extra);

  output.retireAge.textContent = result.retirementAge ? `${result.retirementAge} 歲` : "-";
  output.retireAsset.textContent = money.format(result.retirementAsset);
  output.depleteAge.textContent = result.depleteAge ? `${result.depleteAge} 歲` : "未耗盡";
  output.swr.textContent = `${(result.swr * 100).toFixed(2)}%`;
  output.extraMonthly.textContent = money.format(extra);
  output.horizonLabel.textContent = `${input.age} 歲至 110 歲`;

  const targetMet = input.monthlyExpense <= 0 || (result.retirementAge <= input.targetRetireAge && result.swr <= 0.04);
  output.status.className = targetMet ? "status" : "status warning";
  output.status.textContent = targetMet
    ? `目前條件可在 ${result.retirementAge} 歲達成 FIRE，實質報酬率約 ${(result.realReturn * 100).toFixed(2)}%。`
    : `目前條件不足以穩定達成 ${input.targetRetireAge} 歲退休，建議每月投入增加至 ${money.format(input.monthlyInvest + extra)}。`;

  drawChart(charts.asset, [
    { name: "資產", color: "#1f7a5a", points: result.assets.map(point => ({ age: point.age, value: point.asset })) },
    { name: "4% FIRE 門檻", color: "#d28b31", points: result.assets.map(point => ({ age: point.age, value: point.fireNumber })) },
    { name: "增加投入後資產", color: "#4b6fb3", points: targetResult.assets.map(point => ({ age: point.age, value: point.asset })) }
  ], { money: true });

  drawChart(charts.cashflow, [
    { name: "年投入", color: "#1f7a5a", points: result.cashflows.map(point => ({ age: point.age, value: point.inflow })) },
    { name: "退休年支出", color: "#b84444", points: result.cashflows.map(point => ({ age: point.age, value: point.outflow })) }
  ], { money: true });

  drawChart(charts.depletion, [
    { name: "退休後資產", color: "#1f7a5a", points: result.depletion.map(point => ({ age: point.age, value: point.asset })) },
    { name: "年支出", color: "#b84444", points: result.depletion.map(point => ({ age: point.age, value: point.expense })) }
  ], { money: true });
}

Object.values(fields).forEach(input => input.addEventListener("input", render));
document.getElementById("resetBtn").addEventListener("click", () => {
  Object.entries(defaults).forEach(([key, value]) => {
    fields[key].value = value;
  });
  render();
});
window.addEventListener("resize", render);
render();
