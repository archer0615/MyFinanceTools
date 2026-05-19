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
loadScript(context, path.join(__dirname, "../frontend/core/historicalReplay.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/scenarioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioOrchestration.js"));

test("portfolio orchestration derives dataset, metrics, and historical replay centrally", () => {
  const investment = {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 2,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  };

  const derived = context.deriveInvestmentState(investment, [
    { year: 2020, return: 0.1 },
    { year: 2021, return: -0.05 }
  ]);

  assert.equal(derived.portfolio.investorId, "primary");
  assert.equal(derived.portfolio.persons[0].relation, "owner");
  assert.equal(derived.dataset.length, 2);
  assert.ok(derived.result.cagr !== undefined);
  assert.deepEqual(derived.historicalReplay.sourceYears, [2020, 2021]);
  assert.equal(derived.diagnostics.length, 0);
  assert.equal(derived.scenarios[0].id, "growth");
  assert.equal(derived.economicScenarios.length, 10);
  assert.equal(derived.economicScenarios[0].id, "aggressiveGrowth");
  assert.equal(derived.scenarios[0].legal, true);
  assert.equal(derived.scenarios[1].id, "base");
  assert.equal(derived.scenarios[2].id, "conservative");
  assert.equal(derived.ranking[0].rank, 1);
  assert.equal(derived.ranking[0].id, "growth");
  assert.equal(derived.attribution[0].id, "growth");
  assert.equal(derived.comparison.bestId, "growth");
  assert.match(derived.explanation.summary, /期末資產/);
  assert.match(derived.explanation.bestScenario, /最佳排序/);
  assert.match(derived.explanation.attribution, /差異/);
  assert.match(derived.explanation.comparison, /差距/);
});

test("simulation input is built from canonical state", () => {
  const input = context.buildSimulationInput({
    investment: { initialAmount: 1, monthlyContribution: 2, years: 3 },
    simulations: { iterations: 400 }
  });

  assert.equal(input.initialAmount, 1);
  assert.equal(input.monthlyContribution, 2);
  assert.equal(input.years, 3);
  assert.equal(input.simulations, 400);
});

test("portfolio diagnostics flag invalid inputs", () => {
  const derived = context.deriveInvestmentState({
    initialAmount: -1,
    monthlyContribution: 10000,
    years: 2,
    annualReturn: 0.08,
    volatility: 0.9,
    dividendYield: 0.02
  });

  assert.equal(derived.diagnostics[0].code, "negative-contribution");
  assert.equal(derived.diagnostics[1].code, "high-volatility");
  assert.equal(derived.scenarios.every((scenario) => !scenario.legal), true);
});

test("scenario legality excludes invalid scenarios from ranking", () => {
  const scenarios = context.enumeratePortfolioScenarios({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 60,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  });

  assert.equal(scenarios.length, 3);
  assert.equal(scenarios.every((scenario) => !scenario.legal), true);
  assert.equal(context.rankPortfolioScenarios(scenarios).length, 0);
});

test("portfolio orchestration derives weighted ETF portfolio inputs", () => {
  const investment = {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 2,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  };
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 50),
    context.createPortfolioHoldingFromPreset("QQQ", 50)
  ];

  const derived = context.deriveHoldingsState(investment, holdings);

  assert.equal(Number(derived.investment.annualReturn.toFixed(4)), 0.124);
  assert.equal(Number(derived.portfolio.metrics.weightedExpenseRatio.toFixed(4)), 0.0011);
  assert.equal(derived.portfolio.holdings.length, 2);
  assert.equal(derived.diagnostics.length, 0);
});
