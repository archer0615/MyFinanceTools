const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/rebalancingEngine.js"));

test("rebalancing simulation tracks yearly value and allocation drift", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 50),
    context.createPortfolioHoldingFromPreset("QQQ", 50)
  ];
  const result = context.simulatePortfolioRebalancing({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 3
  }, holdings, "yearly");

  assert.equal(result.points.length, 3);
  assert.equal(result.allocationHistory.length, 3);
  assert.ok(result.metrics.finalValue > 100000);
  assert.ok(result.metrics.maxDrift >= 0);
});

test("rebalancing comparison returns all supported frequencies", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 60),
    context.createPortfolioHoldingFromPreset("SCHD", 40)
  ];
  const result = context.compareRebalancingStrategies({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 2
  }, holdings);

  assert.equal(result.map((strategy) => strategy.frequency).join(","), "none,monthly,quarterly,yearly");
  assert.equal(result.every((strategy) => strategy.points.length === 2), true);
});
