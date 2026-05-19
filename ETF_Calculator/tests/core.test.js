const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math, Number, Promise, setTimeout, requestAnimationFrame: (callback) => callback() };
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/core/monteCarlo.js"));
loadScript(context, path.join(__dirname, "../frontend/core/historicalReplay.js"));

test("compound growth returns yearly points and risk metrics", () => {
  const points = context.calculateCompoundGrowth({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 2,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  });
  const metrics = context.calculateRiskMetrics(points);

  assert.equal(points.length, 2);
  assert.ok(points[1].value > points[0].value);
  assert.ok(metrics.cagr > 0);
  assert.equal(metrics.maxDrawdown, 0);
});

test("monte carlo batched result matches synchronous fallback", async () => {
  const input = {
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 5,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  };

  const syncResult = context.runMonteCarloFallback(input, 200, 42);
  const batchedResult = await context.runMonteCarloBatched(input, 200, 42, { batchSize: 25 });

  assert.deepEqual(batchedResult, syncResult);
  assert.equal(batchedResult.percentilePaths.length, input.years);
  assert.equal(Array.isArray(batchedResult.paths), true);
});

test("historical replay maps market returns into canonical points", () => {
  const replay = context.runHistoricalReplay({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 2,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  }, [
    { year: 2000, return: -0.1 },
    { year: 2001, return: 0.2 }
  ]);

  assert.equal(replay.points.length, 2);
  assert.deepEqual(replay.sourceYears, [2000, 2001]);
  assert.ok(replay.metrics.cagr !== undefined);
});
