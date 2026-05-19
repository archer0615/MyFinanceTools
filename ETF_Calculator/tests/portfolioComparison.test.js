const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math, Number };
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioComparison.js"));

test("portfolio comparison ranks current and saved portfolios", () => {
  const investment = {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 10,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  };
  const currentPortfolio = {
    holdings: [context.createPortfolioHoldingFromPreset("SCHD", 100)]
  };
  const savedPortfolios = [{
    name: "Growth",
    investment,
    portfolio: { holdings: [context.createPortfolioHoldingFromPreset("QQQ", 100)] }
  }];

  const rows = context.comparePortfolios(investment, currentPortfolio, savedPortfolios);

  assert.equal(rows.length, 2);
  assert.equal(rows[0].name, "Growth");
  assert.ok(rows[0].finalValue > rows[1].finalValue);
  assert.ok(rows[1].dividendIncome > 0);
});
