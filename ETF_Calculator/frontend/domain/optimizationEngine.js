function optimizePortfolioByRiskScore(holdings, options = {}) {
  const candidates = normalizePortfolioHoldings(holdings);
  if (!candidates.length) return { holdings: [], score: 0, metrics: calculatePortfolioMetrics([]) };
  const maxAllocation = Math.max(Number(options.maxAllocation) || 0.6, 0.05);
  const rawScores = candidates.map((holding) => ({
    holding,
    score: Math.max((holding.cagr + holding.dividendYield - holding.expenseRatio) / Math.max(holding.volatility, 0.001), 0.001)
  }));
  const totalScore = rawScores.reduce((sum, item) => sum + item.score, 0);
  const capped = rawScores.map((item) => ({
    ...item.holding,
    allocation: Math.min(item.score / totalScore, maxAllocation)
  }));
  const optimizedHoldings = normalizePortfolioHoldings(capped);
  const metrics = calculatePortfolioMetrics(optimizedHoldings);

  return {
    holdings: optimizedHoldings,
    score: calculatePortfolioRiskScore(metrics),
    metrics,
    efficientFrontier: generateEfficientFrontier(candidates, options),
    suggestions: createOptimizationSuggestions(candidates, optimizedHoldings, metrics)
  };
}

function calculatePortfolioRiskScore(metrics) {
  const returnScore = metrics.weightedCagr + metrics.weightedDividendYield - metrics.weightedExpenseRatio;
  const riskPenalty = metrics.weightedVolatility + Math.max(metrics.weightedExpenseRatio * 10, 0);
  return riskPenalty > 0 ? returnScore / riskPenalty : 0;
}

function generateEfficientFrontier(holdings, options = {}) {
  const candidates = normalizePortfolioHoldings(holdings);
  if (!candidates.length) return [];
  const maxAllocation = Math.max(Number(options.maxAllocation) || 0.6, 0.05);
  return [0.2, 0.35, 0.5, 0.65, 0.8].map((riskPreference) => {
    const weighted = candidates.map((holding) => ({
      ...holding,
      allocation: Math.min(
        Math.max((holding.cagr * riskPreference + holding.dividendYield * (1 - riskPreference)) / Math.max(holding.volatility, 0.001), 0.001),
        maxAllocation
      )
    }));
    const frontierHoldings = normalizePortfolioHoldings(weighted);
    const metrics = calculatePortfolioMetrics(frontierHoldings);
    return {
      riskPreference,
      expectedReturn: metrics.weightedCagr,
      volatility: metrics.weightedVolatility,
      dividendYield: metrics.weightedDividendYield,
      score: calculatePortfolioRiskScore(metrics),
      holdings: frontierHoldings.map((holding) => ({ ticker: holding.ticker, allocation: holding.allocation }))
    };
  }).sort((a, b) => a.volatility - b.volatility);
}

function createOptimizationSuggestions(originalHoldings, optimizedHoldings, metrics) {
  const suggestions = optimizedHoldings.map((holding) => {
    const original = originalHoldings.find((item) => item.ticker === holding.ticker);
    const delta = holding.allocation - (original ? original.allocation : 0);
    return {
      ticker: holding.ticker,
      delta,
      action: Math.abs(delta) < 0.005 ? "hold" : (delta > 0 ? "increase" : "decrease")
    };
  });
  if (metrics.weightedExpenseRatio > 0.002) {
    suggestions.push({ ticker: "portfolio", delta: 0, action: "review-fees" });
  }
  return suggestions;
}
