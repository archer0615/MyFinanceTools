function runMonteCarloFallback(input, iterations, seed) {
  const random = createSeededRandom(seed);
  const values = Array.from({ length: iterations }, () => runMonteCarloPath(input, random)).sort((a, b) => a - b);
  return summarizeMonteCarloValues(input, values);
}

function runMonteCarloBatched(input, iterations, seed, options = {}) {
  const batchSize = options.batchSize || 100;
  const onProgress = options.onProgress || (() => {});
  const random = createSeededRandom(seed);
  const values = [];
  let completed = 0;

  return new Promise((resolve) => {
    function runBatch() {
      const end = Math.min(iterations, completed + batchSize);
      for (; completed < end; completed += 1) {
        values.push(runMonteCarloPath(input, random));
      }
      onProgress(iterations > 0 ? completed / iterations : 1);
      if (completed < iterations) {
        scheduleBatch(runBatch);
        return;
      }
      values.sort((a, b) => a - b);
      resolve(summarizeMonteCarloValues(input, values));
    }

    runBatch();
  });
}

function scheduleBatch(callback) {
  if (typeof requestAnimationFrame === "function") {
    requestAnimationFrame(callback);
    return;
  }
  setTimeout(callback, 0);
}

function summarizeMonteCarloValues(input, values) {
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const target = input.initialAmount + input.monthlyContribution * input.years * 12;
  return {
    bestCase: values.at(-1) || 0,
    worstCase: values[0] || 0,
    median: percentile(values, 0.5),
    average,
    successRate: values.filter((value) => value >= target).length / values.length,
    percentiles: {
      p10: percentile(values, 0.1),
      p25: percentile(values, 0.25),
      p50: percentile(values, 0.5),
      p75: percentile(values, 0.75),
      p90: percentile(values, 0.9)
    }
  };
}

function runMonteCarloPath(input, random) {
  let value = input.initialAmount;
  for (let year = 0; year < input.years; year += 1) {
    const annualReturn = input.annualReturn + input.volatility * normalDistribution(random);
    const monthlyRate = Math.pow(1 + annualReturn + input.dividendYield, 1 / 12) - 1;
    for (let month = 0; month < 12; month += 1) {
      value = value * (1 + monthlyRate) + input.monthlyContribution;
    }
  }
  return value;
}

function createSeededRandom(seed) {
  let current = seed || 1;
  return () => {
    current = (current * 16807) % 2147483647;
    return (current - 1) / 2147483646;
  };
}

function normalDistribution(random) {
  const u1 = Math.max(random(), Number.EPSILON);
  const u2 = random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function percentile(sortedValues, ratio) {
  if (sortedValues.length === 0) return 0;
  const index = Math.min(sortedValues.length - 1, Math.floor(sortedValues.length * ratio));
  return sortedValues[index];
}
