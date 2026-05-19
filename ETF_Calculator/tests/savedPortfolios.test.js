const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

function createMemoryStorage() {
  const values = new Map();
  return {
    getItem(key) {
      return values.has(key) ? values.get(key) : null;
    },
    setItem(key, value) {
      values.set(key, value);
    }
  };
}

const context = {
  localStorage: createMemoryStorage(),
  Date
};
loadScript(context, path.join(__dirname, "../frontend/services/savedPortfolios.js"));

test("saved portfolios persist named snapshots with holdings", () => {
  const storage = createMemoryStorage();
  const snapshots = context.savePortfolioSnapshot({
    investment: { initialAmount: 100000, monthlyContribution: 10000 },
    portfolio: {
      holdings: [{ ticker: "VOO", allocation: 1 }]
    }
  }, "Core ETF", storage);

  assert.equal(snapshots.length, 1);
  assert.equal(snapshots[0].id, "core-etf");
  assert.equal(context.loadSavedPortfolios(storage)[0].portfolio.holdings[0].ticker, "VOO");
});
