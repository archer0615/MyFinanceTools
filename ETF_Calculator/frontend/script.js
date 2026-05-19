const repository = createRepository("etf-calculator-state");
const stateManager = createStateManager(DEFAULT_STATE, repository);
const services = createServiceLayer(stateManager);
const chartRenderer = new ChartRenderer();

document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  applyI18n();
  renderEtfPresetOptions();
  applyUrlState();
  bindInputs(updateInvestment, updateSimulationConfig);
  bindPortfolioInputs(updatePortfolioHoldings);
  bindCurrencyInputs(updatePortfolioSettings);
  bindPresets(updateInvestment);
  bindChartInteractions(stateManager.getState, services.updateViewport);
  bindMonteCarlo(runMonteCarloSimulation);
  bindRebalancing(runRebalancingSimulation);
  bindLeverage(runLeverageSimulation);
  bindCrash(runCrashSimulation);
  bindFire(runFireSimulation);
  bindTax(runTaxSimulation);
  bindOptimization(runOptimizationSimulation);
  bindSavedPortfolios(runSavePortfolioSnapshot, runPortfolioComparison);
  bindLiveQuotes(runLiveQuoteRefresh);
  bindThemeToggle();
  bindMobileTabs();
  bindChartViewControls(services.setChartView);
  bindExport(exportPng, exportJson, exportCsv);
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
  if (urlState.portfolio && Array.isArray(urlState.portfolio.holdings)) {
    services.setPortfolioAndDerived(
      { ...stateManager.getState().portfolio, holdings: urlState.portfolio.holdings },
      stateManager.getState().investment,
      stateManager.getState().charts.dataset || [],
      stateManager.getState().simulations.result,
      stateManager.getState().simulations.historicalReplay,
      stateManager.getState().simulations.scenarios,
      stateManager.getState().simulations.ranking,
      stateManager.getState().explanation,
      stateManager.getState().diagnostics,
      stateManager.getState().attribution,
      stateManager.getState().comparison,
      stateManager.getState().simulations.economicScenarios
    );
  }
}

function runMonteCarloSimulation() {
  const state = stateManager.getState();
  const config = buildSimulationInput(state);
  services.setLoading(true);
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
  const derived = deriveHoldingsState(state.investment, state.portfolio.holdings, getHistoricalReturns());
  services.setDerivedDataset(
    derived.dataset,
    derived.result,
    derived.portfolio,
    derived.historicalReplay,
    derived.scenarios,
    derived.ranking,
    derived.explanation,
    derived.diagnostics,
    derived.attribution,
    derived.comparison,
    derived.economicScenarios
  );
}

function updateInvestment(partialInvestment) {
  const state = stateManager.getState();
  const investment = { ...state.investment, ...partialInvestment };
  const derived = deriveHoldingsState(investment, state.portfolio.holdings, getHistoricalReturns());
  services.setInvestmentAndDerived(
    derived.investment,
    derived.dataset,
    derived.result,
    derived.portfolio,
    derived.historicalReplay,
    derived.scenarios,
    derived.ranking,
    derived.explanation,
    derived.diagnostics,
    derived.attribution,
    derived.comparison,
    derived.economicScenarios
  );
  syncInputs(stateManager.getState());
}

function runRebalancingSimulation() {
  const state = stateManager.getState();
  runWorkerTask("rebalancing", state.investment, { holdings: state.portfolio.holdings || [] }, services.setRebalancingResult, () => {
    services.setRebalancingResult(compareRebalancingStrategies(state.investment, state.portfolio.holdings || []));
  });
}

function runLeverageSimulation() {
  const state = stateManager.getState();
  const loan = {
    principal: Number(document.getElementById("loanPrincipal").value || 0),
    annualInterestRate: Number(document.getElementById("loanRate").value || 0) / 100,
    years: Number(document.getElementById("loanYears").value || state.investment.years)
  };
  runWorkerTask("leverage", state.investment, { loan }, services.setLeverageResult, () => {
    services.setLeverageResult(simulateLeverageInvestment(state.investment, loan));
  });
}

function runCrashSimulation() {
  const state = stateManager.getState();
  const scenarioId = document.getElementById("crashScenario").value || "2008";
  runWorkerTask("crash", state.investment, { scenarioId }, services.setCrashResult, () => {
    services.setCrashResult(simulateCrashScenario(state.investment, scenarioId));
  });
}

function runFireSimulation() {
  const state = stateManager.getState();
  const fireConfig = {
    currentAge: Number(document.getElementById("currentAge").value || 0),
    retirementAge: Number(document.getElementById("retirementAge").value || 0),
    monthlyExpenses: Number(document.getElementById("monthlyExpenses").value || 0),
    monthlyPassiveIncomeGoal: Number(document.getElementById("monthlyPassiveIncomeGoal").value || 0),
    safeWithdrawalRate: Number(document.getElementById("safeWithdrawalRate").value || 4) / 100,
    inflationRate: Number(document.getElementById("inflationRate").value || 0) / 100
  };
  runWorkerTask("fire", state.investment, { fireConfig }, services.setFireResult, () => {
    services.setFireResult(simulateFirePlan(state.investment, fireConfig));
  });
}

function runTaxSimulation() {
  const state = stateManager.getState();
  const taxConfig = {
    dividendTaxRate: Number(document.getElementById("dividendTaxRate").value || 0) / 100,
    capitalGainsTaxRate: Number(document.getElementById("capitalGainsTaxRate").value || 0) / 100,
    estateTaxRate: Number(document.getElementById("estateTaxRate").value || 0) / 100,
    estateExemption: Number(document.getElementById("estateExemption").value || 0)
  };
  runWorkerTask("tax", state.investment, { taxConfig }, services.setTaxResult, () => {
    services.setTaxResult(simulateTaxImpact(state.investment, taxConfig));
  });
}

function runOptimizationSimulation() {
  const state = stateManager.getState();
  const options = {
    maxAllocation: Number(document.getElementById("maxOptimizedAllocation").value || 60) / 100
  };
  runWorkerTask("optimization", state.investment, { holdings: state.portfolio.holdings || [], options }, services.setOptimizationResult, () => {
    services.setOptimizationResult(optimizePortfolioByRiskScore(state.portfolio.holdings || [], options));
  });
}

function runSavePortfolioSnapshot() {
  const nameInput = document.getElementById("savedPortfolioName");
  const snapshots = savePortfolioSnapshot(stateManager.getState(), nameInput ? nameInput.value.trim() : "");
  renderSavedPortfolioList(snapshots);
}

function runPortfolioComparison() {
  const state = stateManager.getState();
  const comparison = comparePortfolios(state.investment, state.portfolio, loadSavedPortfolios());
  services.setPortfolioComparison(comparison);
}

async function runLiveQuoteRefresh() {
  const state = stateManager.getState();
  const providerUrlInput = document.getElementById("etfProviderUrl");
  const providerPresetInput = document.getElementById("etfProviderPreset");
  const providerPreset = providerPresetInput ? providerPresetInput.value : "custom";
  const providerUrl = providerPreset === "custom" && providerUrlInput ? providerUrlInput.value.trim() : providerPreset;
  const tickers = (state.portfolio.holdings || []).map((holding) => holding.ticker);
  services.setLiveQuotes(providerUrl
    ? await fetchLiveEtfQuotes(providerUrl, tickers)
    : getOfflineEtfQuotes(tickers));
}

function updatePortfolioHoldings(updater) {
  const state = stateManager.getState();
  const holdings = typeof updater === "function" ? updater(state.portfolio.holdings || []) : updater;
  const derived = deriveHoldingsState(state.investment, holdings, getHistoricalReturns());
  services.setPortfolioAndDerived(
    derived.portfolio,
    derived.investment,
    derived.dataset,
    derived.result,
    derived.historicalReplay,
    derived.scenarios,
    derived.ranking,
    derived.explanation,
    derived.diagnostics,
    derived.attribution,
    derived.comparison,
    derived.economicScenarios
  );
  syncInputs(stateManager.getState());
}

function updatePortfolioSettings(partialPortfolio) {
  const state = stateManager.getState();
  const nextPortfolio = { ...state.portfolio, ...partialPortfolio };
  const derived = deriveHoldingsState(state.investment, nextPortfolio.holdings, getHistoricalReturns());
  services.setPortfolioAndDerived(
    { ...derived.portfolio, baseCurrency: nextPortfolio.baseCurrency, exchangeRates: nextPortfolio.exchangeRates },
    derived.investment,
    derived.dataset,
    derived.result,
    derived.historicalReplay,
    derived.scenarios,
    derived.ranking,
    derived.explanation,
    derived.diagnostics,
    derived.attribution,
    derived.comparison,
    derived.economicScenarios
  );
  syncInputs(stateManager.getState());
}

function updateSimulationConfig(partialSimulationConfig) {
  services.updateSimulationConfig(partialSimulationConfig);
  syncInputs(stateManager.getState());
}

function exportPng() {
  exportChartPng(document.getElementById("chartCanvas"), "etf-chart.png");
}

function exportJson() {
  exportStateJson(stateManager.getState(), "etf-analysis.json");
}

function exportCsv() {
  exportReportCsv(stateManager.getState(), "etf-analysis.csv");
}

function runWorkerTask(task, input, payload, onComplete, onFallback) {
  try {
    const worker = new Worker("worker.js");
    worker.onmessage = (event) => {
      if (event.data.type !== "complete" || event.data.task !== task) return;
      onComplete(event.data.result);
      worker.terminate();
    };
    worker.onerror = () => {
      worker.terminate();
      onFallback();
    };
    worker.postMessage({ task, input, payload });
  } catch {
    onFallback();
  }
}

function getHistoricalReturns() {
  if (typeof historicalData === "undefined" || !historicalData.SP500) return;
  return historicalData.SP500;
}

function bindThemeToggle() {
  const button = document.getElementById("themeToggle");
  if (!button) return;
  const storedTheme = localStorage.getItem("etf-calculator-theme") || getSystemTheme();
  applyTheme(storedTheme);
  const media = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  if (media) {
    media.addEventListener("change", (event) => {
      if (localStorage.getItem("etf-calculator-theme")) return;
      applyTheme(event.matches ? "dark" : "light");
    });
  }
  button.addEventListener("click", () => {
    const nextTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(nextTheme);
    localStorage.setItem("etf-calculator-theme", nextTheme);
  });
}

function getSystemTheme() {
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme) {
  const isDark = theme === "dark";
  document.body.dataset.theme = isDark ? "dark" : "light";
  const button = document.getElementById("themeToggle");
  if (!button) return;
  button.textContent = isDark ? "淺色模式" : "深色模式";
  button.setAttribute("aria-pressed", String(isDark));
}

function bindMobileTabs() {
  document.body.dataset.mobileTab = "summary";
  document.querySelectorAll("[data-mobile-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      const tab = button.getAttribute("data-mobile-tab");
      document.body.dataset.mobileTab = tab;
      document.querySelectorAll("[data-mobile-tab]").forEach((tabButton) => {
        tabButton.setAttribute("aria-pressed", String(tabButton === button));
      });
    });
  });
}
