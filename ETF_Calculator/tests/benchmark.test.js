const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { performance } = require("node:perf_hooks");
const { loadScript } = require("./loadScript");

const context = { Math, Number, Promise, setTimeout, requestAnimationFrame: (callback) => callback() };
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/core/monteCarlo.js"));

test("benchmark: 5000 Monte Carlo iterations stay under smoke threshold", async () => {
  const start = performance.now();
  const result = await context.runMonteCarloBatched({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 50,
    annualReturn: 0.08,
    volatility: 0.16,
    dividendYield: 0.02
  }, 5000, 42, { batchSize: 250 });
  const duration = performance.now() - start;

  assert.equal(result.percentilePaths.length, 50);
  assert.ok(duration < 5000, `benchmark exceeded 5000ms: ${duration}`);
});
