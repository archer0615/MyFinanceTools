const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

test("PNG export creates a download link from canvas data URL", () => {
  const clicks = [];
  const context = {
    document: {
      createElement: (tagName) => ({
        tagName,
        click: () => clicks.push(tagName)
      })
    }
  };
  loadScript(context, path.join(__dirname, "../frontend/export/pngExport.js"));

  const canvas = {
    toDataURL: (type) => `data:${type};base64,abc`
  };
  context.exportChartPng(canvas, "chart.png");

  assert.deepEqual(clicks, ["a"]);
});

test("JSON and CSV export create downloadable payloads", () => {
  const links = [];
  const context = {
    encodeURIComponent,
    Date,
    document: {
      createElement: (tagName) => {
        const link = {
          tagName,
          click: () => links.push({ download: link.download, href: link.href })
        };
        return link;
      }
    }
  };
  loadScript(context, path.join(__dirname, "../frontend/export/pngExport.js"));
  const state = {
    version: 1,
    investment: { initialAmount: 100 },
    portfolio: { holdings: [{ ticker: "VOO" }] },
    simulations: { result: { cagr: 0.08, maxDrawdown: -0.2, sharpeRatio: 1.1 }, monteCarlo: null, fire: null, tax: null, portfolioComparison: [] },
    charts: { dataset: [{ year: 1, value: 120 }] }
  };

  context.exportStateJson(state, "state.json");
  context.exportReportCsv(state, "report.csv");

  assert.equal(links[0].download, "state.json");
  assert.ok(links[0].href.startsWith("data:application/json"));
  assert.equal(links[1].download, "report.csv");
  assert.ok(decodeURIComponent(links[1].href).includes("Final Value,120"));
});
