const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/portfolioInsights.js"));

test("portfolio insights produce action-oriented risk and income notes", () => {
  const insights = context.createPortfolioInsights({
    portfolio: {
      holdings: [],
      metrics: {
        weightedVolatility: 0.25,
        weightedDividendYield: 0.035
      }
    },
    simulations: {
      result: { maxDrawdown: -0.4 },
      fire: { metrics: { targetGap: 1000 } },
      monteCarlo: { successRate: 0.6 }
    }
  });

  assert.ok(insights.find((insight) => insight.type === "risk"));
  assert.ok(insights.find((insight) => insight.type === "income"));
  assert.ok(insights.every((insight) => insight.action));
});
