function exportChartPng(canvas, filename) {
  if (!canvas) return;
  const link = document.createElement("a");
  link.download = filename;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function exportStateJson(state, filename) {
  const link = document.createElement("a");
  const payload = JSON.stringify(createExportPayload(state), null, 2);
  link.download = filename;
  link.href = `data:application/json;charset=utf-8,${encodeURIComponent(payload)}`;
  link.click();
}

function exportReportCsv(state, filename) {
  const link = document.createElement("a");
  link.download = filename;
  link.href = `data:text/csv;charset=utf-8,${encodeURIComponent(createReportCsv(state))}`;
  link.click();
}

function createExportPayload(state) {
  return {
    version: state.version,
    exportedAt: new Date(0).toISOString(),
    investment: state.investment,
    portfolio: state.portfolio,
    simulations: {
      result: state.simulations.result,
      monteCarlo: state.simulations.monteCarlo,
      fire: state.simulations.fire,
      tax: state.simulations.tax,
      portfolioComparison: state.simulations.portfolioComparison
    }
  };
}

function createReportCsv(state) {
  const result = state.simulations.result || {};
  const finalPoint = state.charts.dataset && state.charts.dataset.at(-1);
  const rows = [
    ["Metric", "Value"],
    ["Final Value", finalPoint ? finalPoint.value : 0],
    ["CAGR", result.cagr || 0],
    ["Max Drawdown", result.maxDrawdown || 0],
    ["Sharpe Ratio", result.sharpeRatio || 0],
    ["Holdings", (state.portfolio.holdings || []).map((holding) => holding.ticker).join("|")]
  ];
  return rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n");
}

function escapeCsvValue(value) {
  const text = String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}
