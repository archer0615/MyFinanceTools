const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math, Number };
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/taxEngine.js"));

test("tax simulation applies dividend, capital gains, and estate drag", () => {
  const result = context.simulateTaxImpact({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 5,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  }, {
    dividendTaxRate: 0.3,
    capitalGainsTaxRate: 0.1,
    estateTaxRate: 0.05,
    estateExemption: 500000
  });

  assert.ok(result.metrics.finalBeforeTaxValue > result.metrics.finalAfterTaxValue);
  assert.ok(result.metrics.dividendTaxDrag > 0);
  assert.ok(result.metrics.capitalGainsTax > 0);
  assert.ok(result.metrics.effectiveTaxDragRate > 0);
});
