const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math, Number };
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/fireEngine.js"));

test("fire simulation derives target, fire year, and withdrawal result", () => {
  const result = context.simulateFirePlan({
    initialAmount: 1000000,
    monthlyContribution: 50000,
    years: 30,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  }, {
    currentAge: 35,
    retirementAge: 50,
    monthlyExpenses: 60000,
    monthlyPassiveIncomeGoal: 100000,
    safeWithdrawalRate: 0.04,
    inflationRate: 0.02
  });

  assert.equal(result.targetAmount, 30000000);
  assert.ok(result.fireDateYear > 0);
  assert.equal(result.estimatedFireAge, 35 + result.fireDateYear);
  assert.equal(result.withdrawal.points.length, 40);
  assert.ok(result.reverseCalculation.requiredMonthlyContribution >= 0);
  assert.ok(result.reverseCalculation.targetCagr > -1);
});
