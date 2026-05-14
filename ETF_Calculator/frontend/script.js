const repository = createRepository("etf-calculator-state");
const stateManager = createStateManager(DEFAULT_STATE, repository);
const services = createServiceLayer(stateManager);
const chartRenderer = new ChartRenderer();

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  applyI18n();
  applyUrlState();
  bindInputs(updateInvestment, updateSimulationConfig);
  bindPresets(updateInvestment);
  bindChartInteractions(stateManager.getState, services.updateViewport);
  bindMonteCarlo(runMonteCarloSimulation);
  bindExport(exportPng);
  stateManager.subscribe((state) => {
    saveUrlState(state);
    renderDashboard(state, chartRenderer);
  });
  updateDerivedDataset();
  syncInputs(stateManager.getState());
}

function applyUrlState() {
  const urlState = loadUrlState();
  if (Object.keys(urlState.investment).length > 0) services.updateInvestment(urlState.investment);
  if (Object.keys(urlState.simulations).length > 0) services.updateSimulationConfig(urlState.simulations);
}

function runMonteCarloSimulation() {
  const state = stateManager.getState();
  const config = getSimulationInput(state);
  setText("workerStatus", i18n.loadingSimulation);
  setProgress(15);

  try {
    const worker = new Worker("worker.js");
    worker.onmessage = (event) => {
      if (event.data.type === "progress") {
        setProgress(Math.max(15, Math.round(event.data.progress * 100)));
        return;
      }
      if (event.data.type !== "complete") return;
      setProgress(100);
      setText("workerStatus", i18n.calculatingRisk);
      services.setMonteCarloResult(event.data.result);
      worker.terminate();
    };
    worker.onerror = () => {
      setProgress(0);
      setText("workerStatus", "模擬執行失敗");
      services.setError("模擬執行失敗");
      worker.terminate();
    };
    worker.postMessage({ input: config, iterations: state.simulations.iterations, seed: 42 });
  } catch {
    runMonteCarloBatched(config, state.simulations.iterations, 42, {
      batchSize: 100,
      onProgress(progress) {
        setProgress(Math.max(15, Math.round(progress * 100)));
      }
    }).then((result) => {
      setProgress(100);
      setText("workerStatus", i18n.calculatingRisk);
      services.setMonteCarloResult(result);
    });
  }
}

function updateDerivedDataset() {
  const state = stateManager.getState();
  const points = calculateCompoundGrowth(state.investment);
  const metrics = calculateRiskMetrics(points);
  services.setDerivedDataset(points, metrics);
  updateHistoricalReplay(state.investment);
}

function getSimulationInput(state) {
  return {
    ...state.investment,
    simulations: state.simulations.iterations
  };
}

function updateInvestment(partialInvestment) {
  const state = stateManager.getState();
  const investment = { ...state.investment, ...partialInvestment };
  const points = calculateCompoundGrowth(investment);
  const metrics = calculateRiskMetrics(points);
  services.setInvestmentAndDerived(investment, points, metrics);
  updateHistoricalReplay(investment);
  syncInputs(stateManager.getState());
}

function updateSimulationConfig(partialSimulationConfig) {
  services.updateSimulationConfig(partialSimulationConfig);
  syncInputs(stateManager.getState());
}

function exportPng() {
  exportChartPng(document.getElementById("chartCanvas"), "etf-chart.png");
}

function updateHistoricalReplay(investment) {
  if (typeof historicalData === "undefined" || !historicalData.SP500) return;
  services.setHistoricalReplay(runHistoricalReplay(investment, historicalData.SP500));
}
