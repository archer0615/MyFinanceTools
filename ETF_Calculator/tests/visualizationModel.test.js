const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/charts/VisualizationModel.js"));

test("visualization model isolates chart-ready data from UI state", () => {
  const model = context.createVisualizationModel({
    investment: { initialAmount: 100, monthlyContribution: 0, years: 1, annualReturn: 0.08, volatility: 0.12 },
    charts: { dataset: [{ year: 1, value: 100 }] },
    simulations: {
      scenarios: [{ id: "base", label: "目前設定", finalValue: 100 }],
      ranking: [{ id: "base", label: "目前設定", rankScore: 200 }]
    },
    attribution: [{ id: "base", label: "目前設定", deltaFinalValue: 0 }],
    diagnostics: [{ severity: "warning", code: "x", message: "y" }]
  });

  assert.equal(model.primarySeries.id, "projected-assets");
  assert.equal(model.primarySeries.points.length, 1);
  assert.equal(model.comparisonBars[0].value, 100);
  assert.equal(model.rankingBars[0].value, 200);
  assert.equal(model.comparisonMatrix[0].id, "base");
  assert.equal(model.attributionBars[0].value, 0);
  assert.equal(model.transparency.diagnostics[0].code, "x");
  assert.equal(model.overlaySeries.length, 2);
  assert.equal(model.timelineMarkers.length, 1);
  assert.equal(model.distributionBars.length, 0);
});

test("visualization model exposes overlays and Monte Carlo distribution", () => {
  const model = context.createVisualizationModel({
    investment: { initialAmount: 100, monthlyContribution: 0, years: 1, annualReturn: 0.08, volatility: 0.12 },
    charts: { dataset: [{ year: 1, value: 100 }] },
    simulations: {
      scenarios: [],
      ranking: [],
      rebalancing: [{ frequency: "monthly", points: [{ year: 1, value: 100 }], metrics: {} }],
      leverage: { points: [{ year: 1, netWorth: 80 }] },
      monteCarlo: { percentiles: { p10: 1, p25: 2, p50: 3, p75: 4, p90: 5 } }
    },
    attribution: [],
    diagnostics: []
  });

  assert.equal(model.overlaySeries.length, 4);
  assert.equal(model.distributionBars.length, 5);
  assert.equal(model.distributionBars[2].label, "P50");
});

test("visualization model filters dedicated chart overlays", () => {
  const model = context.createVisualizationModel({
    investment: { initialAmount: 100, monthlyContribution: 0, years: 1, annualReturn: 0.08, volatility: 0.12 },
    charts: { dataset: [{ year: 1, value: 100 }], activeView: "leverage" },
    simulations: {
      scenarios: [],
      ranking: [],
      rebalancing: [{ frequency: "monthly", points: [{ year: 1, value: 100 }], metrics: {} }],
      leverage: { points: [{ year: 1, netWorth: 80 }] }
    },
    attribution: [],
    diagnostics: []
  });

  assert.equal(model.activeView, "leverage");
  assert.equal(model.overlaySeries.length, 1);
  assert.equal(model.overlaySeries[0].id, "leverage-net-worth");
  assert.equal(model.dedicatedChart.title, "槓桿債務與淨值");
  assert.equal(model.dedicatedChart.series.length, 2);
});
