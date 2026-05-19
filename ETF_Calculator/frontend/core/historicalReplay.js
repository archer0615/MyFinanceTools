function runHistoricalReplay(input, marketReturns) {
  const years = marketReturns.slice(0, input.years);
  const points = [];
  let value = input.initialAmount;
  let contribution = input.initialAmount;

  years.forEach((marketYear, index) => {
    for (let month = 0; month < 12; month += 1) {
      contribution += input.monthlyContribution;
      value += input.monthlyContribution;
    }
    value *= 1 + marketYear.return + input.dividendYield;
    points.push({
      year: index + 1,
      sourceYear: marketYear.year,
      value,
      contribution,
      returnRate: value / contribution - 1
    });
  });

  return {
    points,
    metrics: calculateRiskMetrics(points, { dividendYield: input.dividendYield }),
    sourceYears: years.map((item) => item.year)
  };
}
