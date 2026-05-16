function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key && i18n[key]) element.textContent = i18n[key];
  });
}

function renderDashboard(state, chartRenderer) {
  renderWorkspaceShell(createWorkspaceShell(state));
  const visualization = createVisualizationModel(state);
  const points = state.charts.dataset || [];
  const metrics = state.simulations.result || { cagr: 0, maxDrawdown: 0, sharpeRatio: 0 };
  const finalPoint = points.at(-1);
  setText("finalValue", formatCurrency(finalPoint ? finalPoint.value : 0));
  setText("cagr", formatPercent(metrics.cagr));
  setText("maxDrawdown", formatPercent(metrics.maxDrawdown));
  setText("sharpeRatio", metrics.sharpeRatio.toFixed(2));
  setText(
    "summary",
    state.explanation ? state.explanation.summary : `依目前參數估算，期末資產為 ${formatCurrency(finalPoint ? finalPoint.value : 0)}，年化報酬率為 ${formatPercent(metrics.cagr)}。`
  );
  const canvas = document.getElementById("chartCanvas");
  chartRenderer.render(canvas, visualization, state.charts.viewport);
  renderScenarioComparison(state.simulations.scenarios || []);
  renderRanking(state.simulations.ranking || []);
  renderExplanation(state.explanation);
  renderDiagnostics(state.diagnostics || []);
  renderComparisonMatrix(visualization.comparisonMatrix);
  renderTransparency(visualization.transparency);
  renderMonteCarloResult(state.simulations.monteCarlo);
  renderHistoricalReplay(state.simulations.historicalReplay);
  setText("debugOutput", state.ui.error || "");
}

function renderRanking(ranking) {
  replaceChildren("rankingList", ranking.map((scenario) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${scenario.rank}. ${scenario.label}` }),
      createElement("strong", { text: formatCurrency(scenario.finalValue) }),
      createElement("small", { text: scenario.rankScore.toFixed(0) })
    );
    return item;
  }));
}

function renderExplanation(explanation) {
  if (!explanation) return;
  replaceChildren("explanationList", [
    ["排序", explanation.bestScenario],
    ["歸因", explanation.attribution],
    ["比較", explanation.comparison],
    ["回測", explanation.historicalReplay]
  ].map(([label, value]) => {
    const wrapper = createElement("div");
    wrapper.append(createElement("dt", { text: label }), createElement("dd", { text: value }));
    return wrapper;
  }));
}

function renderScenarioComparison(scenarios) {
  replaceChildren("scenarioList", scenarios.map((scenario, index) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${index + 1}. ${scenario.label}` }),
      createElement("strong", { text: formatCurrency(scenario.finalValue) }),
      createElement("small", { text: formatPercent(scenario.cagr) })
    );
    return item;
  }));
}

function renderComparisonMatrix(rows) {
  replaceChildren("comparisonMatrix", rows.map((row) => {
    const item = createElement("div");
    item.append(
      createElement("strong", { text: row.label }),
      createElement("span", { text: formatCurrency(row.finalValue) }),
      createElement("span", { text: formatPercent(row.cagr) }),
      createElement("span", { text: row.legal ? "合法" : "排除" })
    );
    return item;
  }));
}

function renderTransparency(transparency) {
  replaceChildren("transparencyList", [
    ["合法情境", `${transparency.legalScenarioCount}/${transparency.scenarioCount}`],
    ["診斷數", String(transparency.diagnostics.length)]
  ].map(([label, value]) => {
    const wrapper = createElement("div");
    wrapper.append(createElement("dt", { text: label }), createElement("dd", { text: value }));
    return wrapper;
  }));
}

function renderDiagnostics(diagnostics) {
  replaceChildren("diagnosticsList", diagnostics.map((diagnostic) => createElement("li", {
    text: diagnostic.message,
    dataset: { severity: diagnostic.severity }
  })));
}

function renderMonteCarloResult(result) {
  if (!result) return;
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

function renderHistoricalReplay(historicalReplay) {
  if (!historicalReplay || !historicalReplay.points.length) return;
  const finalReplayPoint = historicalReplay.points.at(-1);
  setText("historicalYears", `${historicalReplay.sourceYears[0]}-${historicalReplay.sourceYears.at(-1)}`);
  setText("historicalFinal", formatCurrency(finalReplayPoint.value));
  setText("historicalCagr", formatPercent(historicalReplay.metrics.cagr));
  setText("historicalDrawdown", formatPercent(historicalReplay.metrics.maxDrawdown));
}
