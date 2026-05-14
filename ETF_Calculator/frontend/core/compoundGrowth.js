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

function calculateRiskMetrics(points) {
  const finalPoint = points.at(-1);
  const cagr = finalPoint ? Math.pow(finalPoint.value / finalPoint.contribution, 1 / finalPoint.year) - 1 : 0;
  const maxDrawdown = calculateMaxDrawdown(points.map((point) => point.value));
  const volatility = standardDeviation(points.map((point) => point.returnRate));
  return {
    cagr,
    maxDrawdown,
    sharpeRatio: volatility > 0 ? (cagr - 0.01) / volatility : 0
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
