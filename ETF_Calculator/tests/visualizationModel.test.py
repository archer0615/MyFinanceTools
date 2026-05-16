const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/charts/VisualizationModel.js"));

test("visualization model isolates chart-ready data from UI state", () => {
  const model = context.createVisualizationModel({
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
});
