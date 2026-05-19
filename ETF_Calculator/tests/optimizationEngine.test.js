const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/optimizationEngine.js"));

test("portfolio optimization creates capped weighted allocations and risk score", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 33),
    context.createPortfolioHoldingFromPreset("QQQ", 33),
    context.createPortfolioHoldingFromPreset("SCHD", 34)
  ];
  const result = context.optimizePortfolioByRiskScore(holdings, { maxAllocation: 0.6 });

  assert.equal(result.holdings.length, 3);
  assert.equal(Number(result.metrics.totalAllocation.toFixed(4)), 1);
  assert.ok(result.holdings.every((holding) => holding.allocation <= 0.6));
  assert.ok(result.score > 0);
  assert.equal(result.efficientFrontier.length, 5);
  assert.ok(result.efficientFrontier.every((point) => point.holdings.length === 3));
  assert.ok(result.suggestions.every((suggestion) => suggestion.action));
});
