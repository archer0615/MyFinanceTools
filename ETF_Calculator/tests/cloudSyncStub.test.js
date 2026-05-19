const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Date };
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/services/cloudSyncStub.js"));

test("cloud sync snapshot exports and imports portable state", () => {
  const snapshot = context.exportCloudSyncSnapshot({
    version: 1,
    investment: { initialAmount: 100000, years: 20 },
    portfolio: {
      baseCurrency: "TWD",
      exchangeRates: { USD_TWD: 32 },
      holdings: [
        context.createPortfolioHoldingFromPreset("VOO", 60),
        context.createPortfolioHoldingFromPreset("0050", 40)
      ]
    },
    simulations: { iterations: 1000 }
  });
  const imported = context.importCloudSyncSnapshot(snapshot);

  assert.equal(imported.investment.initialAmount, 100000);
  assert.equal(imported.simulations.iterations, 1000);
  assert.equal(imported.portfolio.holdings.length, 2);
  assert.equal(imported.portfolio.baseCurrency, "TWD");
});
