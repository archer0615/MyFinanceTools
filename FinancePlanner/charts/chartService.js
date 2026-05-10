const chartInstances = new Map();

function initChart(id) {
  if (chartInstances.has(id)) {
    return chartInstances.get(id);
  }

  const element = document.getElementById(id);

  if (!window.echarts || !(element instanceof HTMLElement)) {
    return null;
  }

  const chart = window.echarts.init(element);
  chartInstances.set(id, chart);
  return chart;
}

function setOption(id, option) {
  const chart = initChart(id);

  if (chart) {
    chart.setOption(option, true);
  }
}

function resizeCharts() {
  chartInstances.forEach((chart) => chart.resize());
}

window.addEventListener("resize", resizeCharts);

window.FinancePlannerChartService = {
  setOption,
  resizeCharts,
};

Object.assign(window, window.FinancePlannerChartService);
