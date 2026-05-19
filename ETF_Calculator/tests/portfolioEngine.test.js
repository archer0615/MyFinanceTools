const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));

test("ETF metadata supports lookup and search", () => {
  assert.equal(context.findEtfPreset("voo").ticker, "VOO");
  assert.ok(context.searchEtfPresets("高股息").some((preset) => preset.ticker === "00878"));
});

test("portfolio metrics are allocation weighted", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 50),
    context.createPortfolioHoldingFromPreset("QQQ", 30),
    context.createPortfolioHoldingFromPreset("SCHD", 20)
  ];
  const metrics = context.calculatePortfolioMetrics(holdings);

  assert.equal(metrics.holdingCount, 3);
  assert.equal(Number(metrics.totalAllocation.toFixed(4)), 1);
  assert.equal(Number(metrics.weightedCagr.toFixed(4)), 0.1166);
  assert.equal(Number(metrics.weightedDividendYield.toFixed(4)), 0.0158);
  assert.equal(Number(metrics.currencyAllocation.USD.toFixed(4)), 1);
});

test("allocation helpers add, update, remove, and normalize holdings", () => {
  let holdings = context.addOrReplacePortfolioHolding([], "VOO", 70);
  holdings = context.addOrReplacePortfolioHolding(holdings, "QQQ", 30);
  holdings = context.updatePortfolioHoldingAllocation(holdings, "VOO", 80);

  assert.equal(Number(holdings.find((holding) => holding.ticker === "VOO").allocation.toFixed(2)), 0.8);
  assert.equal(context.validatePortfolioAllocations(holdings)[0].code, "allocation-not-100");

  holdings = context.removePortfolioHolding(holdings, "QQQ");
  assert.equal(holdings.length, 1);
  assert.equal(holdings[0].ticker, "VOO");
  assert.equal(holdings[0].allocation, 1);
});

test("portfolio metrics can derive canonical investment inputs", () => {
  const investment = {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 20,
    annualReturn: 0.08,
    dividendYield: 0.02,
    volatility: 0.16
  };
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 50),
    context.createPortfolioHoldingFromPreset("SCHD", 50)
  ];

  const derivedInvestment = context.deriveInvestmentFromPortfolio(investment, holdings);

  assert.equal(Number(derivedInvestment.annualReturn.toFixed(4)), 0.1055);
  assert.equal(Number(derivedInvestment.dividendYield.toFixed(4)), 0.0245);
  assert.equal(Number(derivedInvestment.expenseRatio.toFixed(4)), 0.0004);
});

test("portfolio config import and export round trip ticker allocations", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 60),
    context.createPortfolioHoldingFromPreset("SCHD", 40)
  ];

  const rawConfig = context.exportPortfolioConfig({ holdings });
  const imported = context.importPortfolioConfig(rawConfig);

  assert.equal(imported.diagnostics.length, 0);
  assert.equal(imported.holdings.length, 2);
  assert.equal(imported.holdings[1].ticker, "SCHD");
  assert.equal(imported.holdings[1].allocation, 0.4);
});

test("portfolio tracks currency allocation and conversion values", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("0050", 40),
    context.createPortfolioHoldingFromPreset("VOO", 60)
  ];
  const metrics = context.calculatePortfolioMetrics(holdings);
  const exposure = context.calculateCurrencyExposureValue(1000000, metrics.currencyAllocation, "TWD", {
    USD_TWD: 32
  });

  assert.equal(Number(metrics.currencyAllocation.TWD.toFixed(4)), 0.4);
  assert.equal(Number(metrics.currencyAllocation.USD.toFixed(4)), 0.6);
  assert.equal(exposure.find((item) => item.currency === "USD").baseValue, 19200000);
});
