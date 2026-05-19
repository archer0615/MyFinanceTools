const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math };
loadScript(context, path.join(__dirname, "../frontend/core/compoundGrowth.js"));
loadScript(context, path.join(__dirname, "../frontend/domain/drawdownEngine.js"));

test("crash scenario applies drawdown and recovery metrics", () => {
  const result = context.simulateCrashScenario({
    initialAmount: 100000,
    monthlyContribution: 10000,
    years: 10,
    annualReturn: 0.08,
    dividendYield: 0.02
  }, "2008");

  assert.equal(result.points.length, 10);
  assert.equal(result.scenario.label, "2008 金融海嘯");
  assert.ok(result.metrics.maxDrawdown > 0);
  assert.ok(result.metrics.underwaterDuration > 0);
  assert.ok(result.metrics.longestUnderwaterDuration > 0);
  assert.ok(result.worstPeriods.length > 0);
});

test("custom crash multiplier recovers to baseline after recovery period", () => {
  const scenario = { crashYear: 2, drawdown: -0.4, recoveryYears: 4 };

  assert.equal(context.calculateCrashMultiplier(1, scenario), 1);
  assert.equal(context.calculateCrashMultiplier(2, scenario), 0.6);
  assert.equal(context.calculateCrashMultiplier(6, scenario), 1);
});

test("drawdown periods capture start, trough, recovery, and duration", () => {
  const periods = context.identifyDrawdownPeriods([
    { year: 1, drawdown: 0 },
    { year: 2, drawdown: 0.1 },
    { year: 3, drawdown: 0.25 },
    { year: 4, drawdown: 0 },
    { year: 5, drawdown: 0.05 }
  ]);

  assert.equal(periods.length, 2);
  assert.equal(periods[0].startYear, 2);
  assert.equal(periods[0].troughYear, 3);
  assert.equal(periods[0].recoveryYear, 4);
  assert.equal(periods[0].duration, 2);
  assert.equal(periods[1].recoveryYear, null);
});
