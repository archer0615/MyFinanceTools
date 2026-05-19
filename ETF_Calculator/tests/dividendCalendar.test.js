const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/dividendCalendar.js"));

test("dividend calendar spreads expected dividends across payment months", () => {
  const holdings = [
    context.createPortfolioHoldingFromPreset("VOO", 50),
    context.createPortfolioHoldingFromPreset("00878", 50)
  ];
  const calendar = context.buildDividendCalendar(holdings, 1000000);
  const march = calendar.find((row) => row.month === 3);
  const may = calendar.find((row) => row.month === 5);

  assert.equal(calendar.length, 12);
  assert.ok(march.tickers.includes("VOO"));
  assert.ok(may.tickers.includes("00878"));
  assert.ok(march.estimatedDividend > 0);
  assert.ok(may.estimatedDividend > 0);
});

test("dividend projection tracks income and reinvestment impact", () => {
  const projection = context.projectDividendIncome({
    initialAmount: 1000000,
    monthlyContribution: 10000,
    years: 5,
    annualReturn: 0.08,
    dividendYield: 0.03,
    dividendGrowthRate: 0.02,
    dividendReinvestmentRate: 1
  }, 5);

  assert.equal(projection.points.length, 5);
  assert.ok(projection.finalAnnualDividendIncome > 0);
  assert.equal(projection.finalMonthlyPassiveIncome, projection.finalAnnualDividendIncome / 12);
  assert.ok(projection.totalReinvestedDividend > projection.points[0].reinvestedDividend);
});
