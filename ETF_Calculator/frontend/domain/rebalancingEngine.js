const REBALANCE_FREQUENCIES = {
  none: 0,
  monthly: 1,
  quarterly: 3,
  yearly: 12
};

function simulatePortfolioRebalancing(input, holdings, frequency) {
  const normalizedHoldings = normalizePortfolioHoldings(holdings);
  if (!normalizedHoldings.length) {
    return { points: [], allocationHistory: [], driftHistory: [], metrics: { finalValue: 0, maxDrift: 0 } };
  }

  const rebalanceInterval = REBALANCE_FREQUENCIES[frequency] || 0;
  const values = normalizedHoldings.map((holding) => input.initialAmount * holding.allocation);
  const points = [];
  const allocationHistory = [];
  const driftHistory = [];
  const totalMonths = input.years * 12;

  for (let month = 1; month <= totalMonths; month += 1) {
    normalizedHoldings.forEach((holding, index) => {
      const monthlyRate = Math.pow(1 + holding.cagr + holding.dividendYield - holding.expenseRatio, 1 / 12) - 1;
      values[index] = values[index] * (1 + monthlyRate) + input.monthlyContribution * holding.allocation;
    });

    if (rebalanceInterval > 0 && month % rebalanceInterval === 0) {
      rebalanceValues(values, normalizedHoldings);
    }

    if (month % 12 === 0) {
      const year = month / 12;
      const totalValue = values.reduce((sum, value) => sum + value, 0);
      const allocations = values.map((value, index) => ({
        ticker: normalizedHoldings[index].ticker,
        targetAllocation: normalizedHoldings[index].allocation,
        actualAllocation: totalValue > 0 ? value / totalValue : 0
      }));
      const maxDrift = Math.max(...allocations.map((allocation) => Math.abs(allocation.actualAllocation - allocation.targetAllocation)), 0);
      points.push({ year, value: totalValue, contribution: input.initialAmount + input.monthlyContribution * month });
      allocationHistory.push({ year, allocations });
      driftHistory.push({ year, maxDrift });
    }
  }

  return {
    points,
    allocationHistory,
    driftHistory,
    metrics: {
      finalValue: points.at(-1) ? points.at(-1).value : 0,
      maxDrift: Math.max(...driftHistory.map((point) => point.maxDrift), 0)
    }
  };
}

function compareRebalancingStrategies(input, holdings) {
  return ["none", "monthly", "quarterly", "yearly"].map((frequency) => ({
    frequency,
    ...simulatePortfolioRebalancing(input, holdings, frequency)
  }));
}

function rebalanceValues(values, holdings) {
  const totalValue = values.reduce((sum, value) => sum + value, 0);
  holdings.forEach((holding, index) => {
    values[index] = totalValue * holding.allocation;
  });
}
