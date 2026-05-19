const inputMap = {
  initialAmount: "initialAmount",
  monthlyContribution: "monthlyContribution",
  years: "years",
  annualReturn: "annualReturn",
  volatility: "volatility",
  dividendYield: "dividendYield",
  simulations: "iterations"
};

function bindInputs(onInvestmentChange, onSimulationConfigChange) {
  Object.entries(inputMap).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      const value = Number(input.value);
      const normalized = key.includes("Return") || key.includes("volatility") || key.includes("Yield")
        ? value / 100
        : value;
      if (key === "iterations") {
        onSimulationConfigChange({ [key]: normalized });
      } else {
        onInvestmentChange({ [key]: normalized });
      }
    });
  });
}

function syncInputs(state) {
  Object.entries(inputMap).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    const value = key === "iterations" ? state.simulations.iterations : state.investment[key];
    input.value = key.includes("Return") || key.includes("volatility") || key.includes("Yield")
      ? String(Number((value * 100).toFixed(2)))
      : String(value);
  });
  const baseCurrencyInput = document.getElementById("baseCurrency");
  const usdTwdRateInput = document.getElementById("usdTwdRate");
  if (baseCurrencyInput) baseCurrencyInput.value = state.portfolio.baseCurrency || "TWD";
  if (usdTwdRateInput) usdTwdRateInput.value = String((state.portfolio.exchangeRates && state.portfolio.exchangeRates.USD_TWD) || 32);
}

function renderEtfPresetOptions() {
  const select = document.getElementById("etfPresetSelect");
  if (!select) return;
  updateEtfPresetOptions("");
}

function updateEtfPresetOptions(query) {
  replaceChildren("etfPresetSelect", searchEtfPresets(query).map((preset) => {
    const option = createElement("option", {
      text: `${preset.ticker} - ${preset.displayName}`,
      value: preset.ticker
    });
    return option;
  }));
}

function bindPortfolioInputs(onPortfolioChange) {
  const addButton = document.getElementById("addEtf");
  const rebalanceButton = document.getElementById("rebalanceEtfs");
  const searchInput = document.getElementById("etfPresetSearch");
  const exportButton = document.getElementById("exportPortfolioConfig");
  const importButton = document.getElementById("importPortfolioConfig");
  const exportCloudButton = document.getElementById("exportCloudSnapshot");
  const importCloudButton = document.getElementById("importCloudSnapshot");
  if (searchInput) {
    searchInput.addEventListener("input", () => updateEtfPresetOptions(searchInput.value));
  }
  if (addButton) {
    addButton.addEventListener("click", () => {
      const select = document.getElementById("etfPresetSelect");
      const allocation = Number(document.getElementById("etfAllocation").value || 0);
      if (!select || !allocation) return;
      onPortfolioChange((holdings) => addOrReplacePortfolioHolding(holdings, select.value, allocation));
    });
  }
  if (rebalanceButton) {
    rebalanceButton.addEventListener("click", () => {
      onPortfolioChange((holdings) => normalizePortfolioHoldings(holdings));
    });
  }
  if (exportButton) {
    exportButton.addEventListener("click", () => {
      const output = document.getElementById("portfolioConfigText");
      if (output) output.value = exportPortfolioConfig(stateManager.getState().portfolio);
    });
  }
  if (importButton) {
    importButton.addEventListener("click", () => {
      const input = document.getElementById("portfolioConfigText");
      const imported = importPortfolioConfig(input ? input.value : "");
      if (imported.holdings.length) onPortfolioChange(imported.holdings);
    });
  }
  if (exportCloudButton) {
    exportCloudButton.addEventListener("click", () => {
      const output = document.getElementById("portfolioConfigText");
      if (output) output.value = exportCloudSyncSnapshot(stateManager.getState());
    });
  }
  if (importCloudButton) {
    importCloudButton.addEventListener("click", () => {
      const input = document.getElementById("portfolioConfigText");
      const imported = importCloudSyncSnapshot(input ? input.value : "");
      if (imported.portfolio.holdings.length) onPortfolioChange(imported.portfolio.holdings);
    });
  }
}

function bindCurrencyInputs(onPortfolioSettingsChange) {
  const baseCurrencyInput = document.getElementById("baseCurrency");
  const usdTwdRateInput = document.getElementById("usdTwdRate");
  if (baseCurrencyInput) {
    baseCurrencyInput.addEventListener("change", () => {
      onPortfolioSettingsChange({ baseCurrency: baseCurrencyInput.value });
    });
  }
  if (usdTwdRateInput) {
    usdTwdRateInput.addEventListener("input", () => {
      onPortfolioSettingsChange({ exchangeRates: { USD_TWD: Number(usdTwdRateInput.value || 32) } });
    });
  }
}

function bindRebalancing(onRunRebalancing) {
  const button = document.getElementById("runRebalancing");
  if (button) button.addEventListener("click", onRunRebalancing);
}

function bindLeverage(onRunLeverage) {
  const button = document.getElementById("runLeverage");
  if (button) button.addEventListener("click", onRunLeverage);
}

function bindCrash(onRunCrash) {
  const button = document.getElementById("runCrash");
  if (button) button.addEventListener("click", onRunCrash);
}

function bindFire(onRunFire) {
  const button = document.getElementById("runFire");
  if (button) button.addEventListener("click", onRunFire);
}

function bindTax(onRunTax) {
  const button = document.getElementById("runTax");
  if (button) button.addEventListener("click", onRunTax);
}

function bindOptimization(onRunOptimization) {
  const button = document.getElementById("runOptimization");
  if (button) button.addEventListener("click", onRunOptimization);
}

function bindSavedPortfolios(onSavePortfolio, onRunComparison) {
  const saveButton = document.getElementById("savePortfolioSnapshot");
  const compareButton = document.getElementById("runPortfolioComparison");
  if (saveButton) saveButton.addEventListener("click", onSavePortfolio);
  if (compareButton) compareButton.addEventListener("click", onRunComparison);
  renderSavedPortfolioList(loadSavedPortfolios());
}

function bindLiveQuotes(onRunLiveQuotes) {
  const button = document.getElementById("refreshLiveQuotes");
  if (button) button.addEventListener("click", onRunLiveQuotes);
}

function bindChartViewControls(onChartViewChange) {
  document.querySelectorAll("[data-chart-view]").forEach((button) => {
    button.addEventListener("click", () => {
      onChartViewChange(button.dataset.chartView);
      document.querySelectorAll("[data-chart-view]").forEach((chartButton) => {
        chartButton.setAttribute("aria-pressed", String(chartButton === button));
      });
    });
  });
}
