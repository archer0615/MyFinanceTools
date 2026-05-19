const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math, Number };
loadScript(context, path.join(__dirname, "../frontend/domain/leverageEngine.js"));

test("loan payment handles amortized and zero-interest loans", () => {
  assert.ok(context.calculateMonthlyLoanPayment(500000, 0.03, 7) > 0);
  assert.equal(context.calculateMonthlyLoanPayment(120000, 0, 1), 10000);
});

test("leverage simulation tracks debt, interest, and net worth", () => {
  const result = context.simulateLeverageInvestment({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 5,
    annualReturn: 0.08,
    dividendYield: 0.02
  }, {
    principal: 500000,
    annualInterestRate: 0.03,
    years: 7
  });

  assert.equal(result.points.length, 5);
  assert.ok(result.metrics.finalInvestmentValue > 600000);
  assert.ok(result.metrics.finalDebt > 0);
  assert.ok(result.metrics.totalInterest > 0);
  assert.equal(result.metrics.leverageRatio, 6);
});
