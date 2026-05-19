importScripts(
  "core/compoundGrowth.js",
  "core/monteCarlo.js",
  "domain/portfolioEngine.js",
  "domain/rebalancingEngine.js",
  "domain/leverageEngine.js",
  "domain/drawdownEngine.js",
  "domain/fireEngine.js",
  "domain/taxEngine.js",
  "domain/optimizationEngine.js"
);

self.onmessage = (event) => {
  const { task, input, iterations, seed, payload } = event.data;
  if (!task || task === "monteCarlo") {
    runMonteCarloBatched(input, iterations, seed || 42, {
      batchSize: 100,
      onProgress(progress) {
        self.postMessage({ type: "progress", progress });
      }
    }).then((result) => {
      self.postMessage({ type: "complete", task: "monteCarlo", result });
    });
    return;
  }

  const result = runWorkerTask(task, input, payload || {});
  self.postMessage({ type: "complete", task, result });
};

function runWorkerTask(task, input, payload) {
  const handlers = {
    rebalancing: () => compareRebalancingStrategies(input, payload.holdings || []),
    leverage: () => simulateLeverageInvestment(input, payload.loan || {}),
    crash: () => simulateCrashScenario(input, payload.scenarioId || "2008"),
    fire: () => simulateFirePlan(input, payload.fireConfig || {}),
    tax: () => simulateTaxImpact(input, payload.taxConfig || {}),
    optimization: () => optimizePortfolioByRiskScore(payload.holdings || [], payload.options || {})
  };
  if (!handlers[task]) throw new Error(`Unsupported worker task: ${task}`);
  return handlers[task]();
}
