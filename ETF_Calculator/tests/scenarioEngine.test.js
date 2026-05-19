const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {
  Math,
  Number,
  i18n: {
    invalidContribution: "投入金額不可為負數",
    invalidVolatility: "波動率超出合理範圍"
  }
};
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioOrchestration.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/scenarioEngine.js"));

test("economic scenarios adjust return, volatility, and dividend yield", () => {
  const investment = {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 10,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  };

  const scenarios = context.enumerateEconomicScenarios(investment);
  const bull = scenarios.find((scenario) => scenario.id === "aggressiveBullMarket");
  const bear = scenarios.find((scenario) => scenario.id === "longBearMarket");

  assert.equal(scenarios.length, 10);
  assert.ok(scenarios.find((scenario) => scenario.id === "bullMarket"));
  assert.ok(scenarios.find((scenario) => scenario.id === "stagflation"));
  assert.equal(Number(bull.investment.annualReturn.toFixed(3)), 0.12);
  assert.equal(Number(bull.investment.volatility.toFixed(3)), 0.184);
  assert.equal(Number(bull.investment.dividendYield.toFixed(3)), 0.028);
  assert.ok(bull.finalValue > bear.finalValue);
});
