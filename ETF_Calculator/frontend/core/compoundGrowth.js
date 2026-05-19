function calculateCompoundGrowth(config) {
  const monthlyRate = Math.pow(1 + config.annualReturn + config.dividendYield, 1 / 12) - 1;
  const months = config.years * 12;
  const points = [];
  let value = config.initialAmount;
  let contribution = config.initialAmount;

  for (let month = 1; month <= months; month += 1) {
    value = value * (1 + monthlyRate) + config.monthlyContribution;
    contribution += config.monthlyContribution;
    if (month % 12 === 0) {
      points.push({ year: month / 12, value, contribution, returnRate: value / contribution - 1 });
    }
  }

  return points;
}

function calculateRiskMetrics(points, options = {}) {
  const finalPoint = points.at(-1);
  const cagr = finalPoint ? Math.pow(finalPoint.value / finalPoint.contribution, 1 / finalPoint.year) - 1 : 0;
  const maxDrawdown = calculateMaxDrawdown(points.map((point) => point.value));
  const annualReturns = calculateAnnualReturns(points);
  const volatility = standardDeviation(annualReturns.length ? annualReturns : points.map((point) => point.returnRate));
  const downsideVolatility = calculateDownsideDeviation(annualReturns, 0.01);
  const dividendCagr = calculateDividendCagr(points, Number(options.dividendYield) || 0);
  const inflationRate = Number(options.inflationRate) || 0.02;
  return {
    cagr,
    maxDrawdown,
    volatility,
    annualizedReturn: cagr,
    realReturnAfterInflation: (1 + cagr) / (1 + inflationRate) - 1,
    dividendCagr,
    sharpeRatio: volatility > 0 ? (cagr - 0.01) / volatility : 0,
    sortinoRatio: downsideVolatility > 0 ? (cagr - 0.01) / downsideVolatility : 0
  };
}

function calculateMaxDrawdown(values) {
  let peak = values[0] || 0;
  let drawdown = 0;
  values.forEach((value) => {
    peak = Math.max(peak, value);
    drawdown = Math.max(drawdown, peak > 0 ? (peak - value) / peak : 0);
  });
  return drawdown;
}

function standardDeviation(values) {
  if (values.length === 0) return 0;
  const average = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - average) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function calculateAnnualReturns(points) {
  return points.map((point, index) => {
    const previousValue = index === 0 ? point.contribution : points[index - 1].value;
    const previousContribution = index === 0 ? 0 : points[index - 1].contribution;
    const newContribution = point.contribution - previousContribution;
    return previousValue > 0 ? (point.value - newContribution) / previousValue - 1 : 0;
  });
}

function calculateDownsideDeviation(returns, minimumAcceptableReturn) {
  const downsideReturns = returns
    .map((value) => Math.min(value - minimumAcceptableReturn, 0))
    .filter((value) => value < 0);
  return standardDeviation(downsideReturns);
}

function calculateDividendCagr(points, dividendYield) {
  if (points.length < 2) return 0;
  const firstDividend = points[0].value * dividendYield;
  const lastDividend = points.at(-1).value * dividendYield;
  if (firstDividend <= 0 || lastDividend <= 0) return 0;
  return Math.pow(lastDividend / firstDividend, 1 / Math.max(points.at(-1).year - points[0].year, 1)) - 1;
}
