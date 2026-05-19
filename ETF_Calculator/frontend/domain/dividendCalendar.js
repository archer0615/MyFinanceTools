function buildDividendCalendar(holdings, portfolioValue) {
  const normalizedHoldings = normalizePortfolioHoldings(holdings);
  const monthRows = Array.from({ length: 12 }, (_, index) => ({
    month: index + 1,
    estimatedDividend: 0,
    tickers: []
  }));

  normalizedHoldings.forEach((holding) => {
    const months = holding.dividendMonths && holding.dividendMonths.length ? holding.dividendMonths : [12];
    const annualDividend = portfolioValue * holding.allocation * holding.dividendYield;
    const dividendPerPayment = annualDividend / months.length;
    months.forEach((month) => {
      const row = monthRows[month - 1];
      if (!row) return;
      row.estimatedDividend += dividendPerPayment;
      row.tickers.push(holding.ticker);
    });
  });

  return monthRows;
}

function projectDividendIncome(input, years) {
  const projectionYears = Math.max(Number(years) || input.years || 1, 1);
  const dividendGrowthRate = Number.isFinite(input.dividendGrowthRate) ? input.dividendGrowthRate : 0.03;
  const reinvestmentRate = Number.isFinite(input.dividendReinvestmentRate) ? input.dividendReinvestmentRate : 1;
  const monthlyReturn = Math.pow(1 + input.annualReturn, 1 / 12) - 1;
  const points = [];
  let value = input.initialAmount || 0;
  let annualDividendIncome = 0;

  for (let year = 1; year <= projectionYears; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      value = (value + (input.monthlyContribution || 0)) * (1 + monthlyReturn);
    }
    annualDividendIncome = value * (input.dividendYield || 0) * ((1 + dividendGrowthRate) ** (year - 1));
    value += annualDividendIncome * reinvestmentRate;
    points.push({
      year,
      portfolioValue: value,
      annualDividendIncome,
      monthlyPassiveIncome: annualDividendIncome / 12,
      reinvestedDividend: annualDividendIncome * reinvestmentRate
    });
  }

  return {
    points,
    finalAnnualDividendIncome: points.at(-1) ? points.at(-1).annualDividendIncome : 0,
    finalMonthlyPassiveIncome: points.at(-1) ? points.at(-1).monthlyPassiveIncome : 0,
    totalReinvestedDividend: points.reduce((sum, point) => sum + point.reinvestedDividend, 0)
  };
}
