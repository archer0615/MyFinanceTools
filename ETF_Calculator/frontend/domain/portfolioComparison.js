function comparePortfolios(baseInvestment, currentPortfolio, savedPortfolios) {
  const portfolios = [
    { name: "目前組合", investment: baseInvestment, portfolio: currentPortfolio },
    ...(savedPortfolios || [])
  ];

  return portfolios.map((entry) => {
    const holdings = (entry.portfolio && entry.portfolio.holdings) || [];
    const investment = deriveInvestmentFromPortfolio(entry.investment || baseInvestment, holdings);
    const dataset = calculateCompoundGrowth(investment);
    const metrics = calculateRiskMetrics(dataset, { dividendYield: investment.dividendYield });
    const portfolioMetrics = calculatePortfolioMetrics(holdings);
    const finalPoint = dataset.at(-1) || { value: 0 };

    return {
      id: normalizeComparisonId(entry.name),
      name: entry.name,
      finalValue: finalPoint.value,
      cagr: metrics.cagr,
      maxDrawdown: metrics.maxDrawdown,
      volatility: metrics.volatility,
      dividendIncome: finalPoint.value * portfolioMetrics.weightedDividendYield,
      dividendYield: portfolioMetrics.weightedDividendYield
    };
  }).sort((a, b) => b.finalValue - a.finalValue);
}

function normalizeComparisonId(name) {
  return String(name || "portfolio").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
}
