function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key && i18n[key]) element.textContent = i18n[key];
  });
}

function renderDashboard(state, chartRenderer) {
  const points = state.charts.dataset || [];
  const metrics = state.simulations.result || { cagr: 0, maxDrawdown: 0, sharpeRatio: 0 };
  const finalPoint = points.at(-1);
  setText("finalValue", formatCurrency(finalPoint ? finalPoint.value : 0));
  setText("cagr", formatPercent(metrics.cagr));
  setText("maxDrawdown", formatPercent(metrics.maxDrawdown));
  setText("sharpeRatio", metrics.sharpeRatio.toFixed(2));
  setText(
    "summary",
    `依目前參數估算，期末資產為 ${formatCurrency(finalPoint ? finalPoint.value : 0)}，年化報酬率為 ${formatPercent(metrics.cagr)}。`
  );
  const canvas = document.getElementById("chartCanvas");
  chartRenderer.render(canvas, { points }, state.charts.viewport);
  renderMonteCarloResult(state.simulations.monteCarlo);
  renderHistoricalReplay(state.simulations.historicalReplay);
  setText("debugOutput", state.ui.error || "");
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
