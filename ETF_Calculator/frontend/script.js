const DEFAULT_STATE = {
  config: {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 20,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02,
    simulations: 1000,
    theme: "light",
    currentTab: "dashboard"
  },
  result: null,
  monteCarlo: null,
  historicalReplay: null,
  ui: {
    isLoading: false,
    error: "",
    debug: false,
    viewport: {
      zoom: 1,
      panX: 0
    }
  }
};

function createRepository(storageKey) {
  return {
    load() {
      try {
        const raw = localStorage.getItem(storageKey);
        return raw ? JSON.parse(raw) : null;
      } catch {
        return null;
      }
    },
    save(value) {
      localStorage.setItem(storageKey, JSON.stringify(value));
    }
  };
}

function createStateManager(initialState, repository) {
  let state = mergeState(initialState, repository.load());
  const listeners = new Set();

  function getState() {
    return state;
  }

  function setState(updater) {
    const nextState = typeof updater === "function" ? updater(state) : updater;
    state = mergeState(state, nextState);
    repository.save(state);
    listeners.forEach((listener) => listener(state));
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { getState, setState, subscribe };
}

function mergeState(base, patch) {
  if (!patch || typeof patch !== "object") return structuredClone(base);
  return {
    ...base,
    ...patch,
    config: { ...base.config, ...(patch.config || {}) },
    ui: { ...base.ui, ...(patch.ui || {}) }
  };
}

function createServiceLayer(stateManager) {
  return {
    updateConfig(partialConfig) {
      stateManager.setState((state) => ({
        config: { ...state.config, ...partialConfig }
      }));
    },
    setSimulationResult(result) {
      stateManager.setState({ result });
    },
    setError(error) {
      stateManager.setState((state) => ({
        ui: { ...state.ui, error }
      }));
    }
  };
}

const repository = createRepository("etf-calculator-state");
const stateManager = createStateManager(DEFAULT_STATE, repository);
const services = createServiceLayer(stateManager);

const inputMap = {
  initialAmount: "initialAmount",
  monthlyContribution: "monthlyContribution",
  years: "years",
  annualReturn: "annualReturn",
  volatility: "volatility",
  dividendYield: "dividendYield",
  simulations: "simulations"
};

const presets = {
  conservative: { annualReturn: 0.04, volatility: 0.08, dividendYield: 0.02 },
  balanced: { annualReturn: 0.08, volatility: 0.16, dividendYield: 0.02 },
  aggressive: { annualReturn: 0.12, volatility: 0.24, dividendYield: 0.01 },
  crisis: { annualReturn: -0.08, volatility: 0.32, dividendYield: 0.01 }
};

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  applyI18n();
  bindInputs();
  bindPresets();
  bindChartInteractions();
  bindMonteCarlo();
  stateManager.subscribe(render);
  render(stateManager.getState());
}

function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key && i18n[key]) element.textContent = i18n[key];
  });
}

function bindInputs() {
  Object.entries(inputMap).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      const value = Number(input.value);
      const normalized = key.includes("Return") || key.includes("volatility") || key.includes("Yield")
        ? value / 100
        : value;
      services.updateConfig({ [key]: normalized });
    });
  });
}

function bindPresets() {
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-preset");
      if (presetName && presets[presetName]) services.updateConfig(presets[presetName]);
      syncInputs(stateManager.getState().config);
    });
  });
}

function bindMonteCarlo() {
  const button = document.getElementById("runMonteCarlo");
  if (!button) return;
  button.addEventListener("click", runMonteCarloSimulation);
}

function runMonteCarloSimulation() {
  const config = stateManager.getState().config;
  setText("workerStatus", i18n.loadingSimulation);
  setProgress(15);

  try {
    const worker = new Worker("worker.js");
    worker.onmessage = (event) => {
      if (event.data.type !== "complete") return;
      setProgress(100);
      setText("workerStatus", i18n.calculatingRisk);
      renderMonteCarloResult(event.data.result);
      worker.terminate();
    };
    worker.onerror = () => {
      setProgress(0);
      setText("workerStatus", "模擬執行失敗");
      worker.terminate();
    };
    worker.postMessage({ input: config, iterations: config.simulations, seed: 42 });
  } catch {
    const result = runMonteCarloFallback(config, config.simulations, 42);
    setProgress(100);
    setText("workerStatus", i18n.calculatingRisk);
    renderMonteCarloResult(result);
  }
}

function renderMonteCarloResult(result) {
  setText("mcP10", formatCurrency(result.percentiles.p10));
  setText("mcP25", formatCurrency(result.percentiles.p25));
  setText("mcP50", formatCurrency(result.percentiles.p50));
  setText("mcP75", formatCurrency(result.percentiles.p75));
  setText("mcP90", formatCurrency(result.percentiles.p90));
  setText("mcBest", formatCurrency(result.bestCase));
  setText("mcWorst", formatCurrency(result.worstCase));
  setText("mcSuccess", formatPercent(result.successRate));
  setText("workerStatus", "模擬完成");
}

function runMonteCarloFallback(input, iterations, seed) {
  const random = createSeededRandom(seed);
  const values = Array.from({ length: iterations }, () => runMonteCarloPath(input, random)).sort((a, b) => a - b);
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const target = input.initialAmount + input.monthlyContribution * input.years * 12;
  return {
    bestCase: values.at(-1) || 0,
    worstCase: values[0] || 0,
    median: percentile(values, 0.5),
    average,
    successRate: values.filter((value) => value >= target).length / values.length,
    percentiles: {
      p10: percentile(values, 0.1),
      p25: percentile(values, 0.25),
      p50: percentile(values, 0.5),
      p75: percentile(values, 0.75),
      p90: percentile(values, 0.9)
    }
  };
}

function runMonteCarloPath(input, random) {
  let value = input.initialAmount;
  for (let year = 0; year < input.years; year += 1) {
    const annualReturn = input.annualReturn + input.volatility * normalDistribution(random);
    const monthlyRate = Math.pow(1 + annualReturn + input.dividendYield, 1 / 12) - 1;
    for (let month = 0; month < 12; month += 1) {
      value = value * (1 + monthlyRate) + input.monthlyContribution;
    }
  }
  return value;
}

function createSeededRandom(seed) {
  let current = seed || 1;
  return () => {
    current = (current * 16807) % 2147483647;
    return (current - 1) / 2147483646;
  };
}

function normalDistribution(random) {
  const u1 = Math.max(random(), Number.EPSILON);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function percentile(sortedValues, ratio) {
  if (sortedValues.length === 0) return 0;
  const index = Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * ratio));
  return sortedValues[index];
}

function syncInputs(config) {
  Object.entries(inputMap).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    const value = config[key];
    input.value = key.includes("Return") || key.includes("volatility") || key.includes("Yield")
      ? String(Number((value * 100).toFixed(2)))
      : String(value);
  });
}

function render(state) {
  const points = calculateCompoundGrowth(state.config);
  const metrics = calculateRiskMetrics(points);
  const finalPoint = points.at(-1);
  setText("finalValue", formatCurrency(finalPoint ? finalPoint.value : 0));
  setText("cagr", formatPercent(metrics.cagr));
  setText("maxDrawdown", formatPercent(metrics.maxDrawdown));
  setText("sharpeRatio", metrics.sharpeRatio.toFixed(2));
  setText(
    "summary",
    `依目前參數估算，期末資產為 ${formatCurrency(finalPoint ? finalPoint.value : 0)}，年化報酬率為 ${formatPercent(metrics.cagr)}。`
  );
  drawChart(points, state.ui.viewport);
}

function calculateCompoundGrowth(config) {
  const monthlyRate = Math.pow(1 + config.annualReturn + config.dividendYield, 1 / 12) - 1;
  const months = config.years * 12;
  const points = [];
  let value = config.initialAmount;
  let contribution = config.initialAmount;

  for (let month = 1; month <= months; month += 1) {
    value = value * (1 + monthlyRate) + config.monthlyContribution;
    contribution += config.monthlyContribution;
    if (month % 12 === 0) {
      points.push({ year: month / 12, value, contribution, returnRate: value / contribution - 1 });
    }
  }

  return points;
}

function calculateRiskMetrics(points) {
  const finalPoint = points.at(-1);
  const cagr = finalPoint ? Math.pow(finalPoint.value / finalPoint.contribution, 1 / finalPoint.year) - 1 : 0;
  const maxDrawdown = calculateMaxDrawdown(points.map((point) => point.value));
  const volatility = standardDeviation(points.map((point) => point.returnRate));
  return {
    cagr,
    maxDrawdown,
    sharpeRatio: volatility > 0 ? (cagr - 0.01) / volatility : 0
  };
}

function calculateMaxDrawdown(values) {
  let peak = values[0] || 0;
  let drawdown = 0;
  values.forEach((value) => {
    peak = Math.max(peak, value);
    drawdown = Math.max(drawdown, peak > 0 ? (peak - value) / peak : 0);
  });
  return drawdown;
}

function standardDeviation(values) {
  if (values.length === 0) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function bindChartInteractions() {
  const canvas = document.getElementById("chartCanvas");
  if (!canvas) return;
  let isPanning = false;
  let lastX = 0;

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    updateViewport((viewport) => ({
      ...viewport,
      zoom: Math.min(4, Math.max(1, viewport.zoom + delta))
    }));
  });

  canvas.addEventListener("pointerdown", (event) => {
    isPanning = true;
    lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    const state = stateManager.getState();
    const points = calculateCompoundGrowth(state.config);
    updateTooltip(event, points, state.ui.viewport);
    if (!isPanning) return;
    const deltaX = event.clientX - lastX;
    lastX = event.clientX;
    updateViewport((viewport) => ({ ...viewport, panX: viewport.panX + deltaX }));
  });

  canvas.addEventListener("pointerup", (event) => {
    isPanning = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerleave", () => {
    isPanning = false;
    const tooltip = document.getElementById("tooltip");
    if (tooltip) tooltip.hidden = true;
  });
}

function updateViewport(updater) {
  stateManager.setState((state) => ({
    ui: {
      ...state.ui,
      viewport: updater(state.ui.viewport)
    }
  }));
}

function updateTooltip(event, points, viewport) {
  const canvas = document.getElementById("chartCanvas");
  const tooltip = document.getElementById("tooltip");
  if (!canvas || !tooltip || points.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const index = screenXToPointIndex(x, rect.width, points.length, viewport);
  const point = points[index];
  if (!point) return;
  tooltip.hidden = false;
  tooltip.style.left = `${Math.min(rect.width - 180, Math.max(8, x + 12))}px`;
  tooltip.style.top = `${Math.max(8, event.clientY - rect.top - 42)}px`;
  tooltip.textContent = `年度 ${point.year}｜總資產 ${formatCurrency(point.value)}｜報酬率 ${formatPercent(point.returnRate)}`;
}

function screenXToPointIndex(x, width, pointCount, viewport) {
  const chartWidth = width - 56;
  const worldX = (x - 32 - viewport.panX) / viewport.zoom;
  const ratio = Math.min(1, Math.max(0, worldX / chartWidth));
  return Math.min(pointCount - 1, Math.max(0, Math.round(ratio * (pointCount - 1))));
}

function drawChart(points, viewport) {
  const canvas = document.getElementById("chartCanvas");
  if (!canvas) return;
  const rect = canvas.getBoundingClientRect();
  const ratio = window.devicePixelRatio || 1;
  canvas.width = rect.width * ratio;
  canvas.height = rect.height * ratio;
  const context = canvas.getContext("2d");
  if (!context) return;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  context.clearRect(0, 0, rect.width, rect.height);
  drawGrid(context, rect.width, rect.height);
  drawLine(context, rect.width, rect.height, points, viewport);
}

function drawGrid(context, width, height) {
  context.strokeStyle = "#d8dee8";
  context.lineWidth = 1;
  for (let index = 0; index < 6; index += 1) {
    const y = 24 + ((height - 48) / 5) * index;
    context.beginPath();
    context.moveTo(32, y);
    context.lineTo(width - 24, y);
    context.stroke();
  }
}

function drawLine(context, width, height, points, viewport) {
  const maxValue = Math.max(...points.map((point) => point.value), 1);
  context.strokeStyle = "#2563eb";
  context.lineWidth = 2;
  context.beginPath();
  points.forEach((point, index) => {
    const x = 32 + viewport.panX + ((width - 56) / Math.max(points.length - 1, 1)) * index * viewport.zoom;
    const y = height - 24 - (point.value / maxValue) * (height - 48);
    if (index === 0) context.moveTo(x, y);
    else context.lineTo(x, y);
  });
  context.stroke();
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setProgress(value) {
  const element = document.getElementById("progress");
  if (element) element.value = value;
}

function formatCurrency(value) {
  return `NT$ ${Math.round(value).toLocaleString("zh-TW")}`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}
