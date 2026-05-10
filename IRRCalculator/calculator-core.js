(function initCalculatorCore(globalScope) {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;

  function getYearOffsets(cashflows) {
    const firstTime = cashflows[0].time;
    return cashflows.map((row) => (row.time - firstTime) / MS_PER_DAY / 365);
  }

  function xnpv(rate, cashflows, offsets) {
    return cashflows.reduce(
      (sum, row, index) => sum + row.amount / ((1 + rate) ** offsets[index]),
      0,
    );
  }

  function xnpvDerivative(rate, cashflows, offsets) {
    return cashflows.reduce((sum, row, index) => {
      const years = offsets[index];
      if (years === 0) {
        return sum;
      }
      return sum - (years * row.amount) / ((1 + rate) ** (years + 1));
    }, 0);
  }

  function estimateXirrByBisection(cashflows, offsets, maxIterations = 200, tolerance = 1e-7) {
    const minRate = -0.9999999999;
    let low = minRate;
    let high = 1;
    let lowValue = xnpv(low, cashflows, offsets);
    let highValue = xnpv(high, cashflows, offsets);

    for (let expansion = 0; expansion < 40 && lowValue * highValue > 0; expansion += 1) {
      high = (high + 1) * 2 - 1;
      highValue = xnpv(high, cashflows, offsets);

      if (!Number.isFinite(highValue)) {
        return null;
      }
    }

    if (!Number.isFinite(lowValue) || !Number.isFinite(highValue) || lowValue * highValue > 0) {
      return null;
    }

    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      const mid = (low + high) / 2;
      const midValue = xnpv(mid, cashflows, offsets);

      if (!Number.isFinite(midValue)) {
        return null;
      }

      if (Math.abs(midValue) <= tolerance) {
        return mid;
      }

      if (lowValue * midValue <= 0) {
        high = mid;
        highValue = midValue;
      } else {
        low = mid;
        lowValue = midValue;
      }

      if (Math.abs(high - low) <= tolerance || Math.abs(highValue - lowValue) <= tolerance) {
        return (low + high) / 2;
      }
    }

    return (low + high) / 2;
  }

  function estimateXirr(cashflows, guess = 0.1, options = {}) {
    const maxIterations = Number.isInteger(options.maxIterations) && options.maxIterations > 0
      ? options.maxIterations
      : 50;
    const tolerance = Number.isFinite(options.tolerance) && options.tolerance > 0
      ? options.tolerance
      : 1e-7;
    const minRate = -0.9999999999;
    const hasPositive = cashflows.some((row) => row.amount > 0);
    const hasNegative = cashflows.some((row) => row.amount < 0);

    if (!hasPositive || !hasNegative) {
      return null;
    }

    const offsets = getYearOffsets(cashflows);
    let rate = Number.isFinite(guess) && guess > minRate ? guess : 0.1;

    // First try Newton-Raphson for fast convergence near the root.
    // If any step becomes unstable (NaN, Infinity, zero derivative, or rate below -1),
    // fall back to bisection, which converges more slowly but is bracket-based and safer.
    for (let iteration = 0; iteration < maxIterations; iteration += 1) {
      const value = xnpv(rate, cashflows, offsets);
      const derivative = xnpvDerivative(rate, cashflows, offsets);

      if (!Number.isFinite(value) || !Number.isFinite(derivative) || derivative === 0) {
        break;
      }

      if (Math.abs(value) <= tolerance) {
        return rate;
      }

      const nextRate = rate - value / derivative;
      if (!Number.isFinite(nextRate) || Number.isNaN(nextRate) || nextRate <= minRate) {
        break;
      }

      if (Math.abs(nextRate - rate) <= tolerance) {
        return nextRate;
      }

      rate = nextRate;
    }

    return estimateXirrByBisection(cashflows, offsets, Math.max(maxIterations * 4, 200), tolerance);
  }

  function annualizeReturn(totalReturnRatePercent, years) {
    const totalGrowth = 1 + totalReturnRatePercent / 100;
    if (totalGrowth <= 0 || years <= 0) {
      return null;
    }

    return (totalGrowth ** (1 / years) - 1) * 100;
  }

  function calculateCagr(cashflows) {
    if (!Array.isArray(cashflows) || cashflows.length < 2) {
      return null;
    }

    const sorted = [...cashflows].sort((left, right) => left.time - right.time);
    const invested = sorted
      .filter((row) => row.amount < 0)
      .reduce((sum, row) => sum + Math.abs(row.amount), 0);
    const returned = sorted
      .filter((row) => row.amount > 0)
      .reduce((sum, row) => sum + row.amount, 0);
    const years = (sorted[sorted.length - 1].time - sorted[0].time) / MS_PER_DAY / 365;

    if (invested <= 0 || returned <= 0 || years <= 0) {
      return null;
    }

    return ((returned / invested) ** (1 / years) - 1) * 100;
  }

  function calculateTwrr(cashflows) {
    if (!Array.isArray(cashflows) || cashflows.length < 2) {
      return null;
    }

    const sorted = [...cashflows].sort((left, right) => left.time - right.time);
    let capitalBase = 0;
    let growthFactor = 1;
    let hasReturnPeriod = false;

    for (const row of sorted) {
      if (row.amount < 0) {
        capitalBase += Math.abs(row.amount);
        continue;
      }

      if (row.amount > 0 && capitalBase > 0) {
        growthFactor *= 1 + (row.amount / capitalBase);
        hasReturnPeriod = true;
      }
    }

    if (!hasReturnPeriod || growthFactor <= 0) {
      return null;
    }

    return (growthFactor - 1) * 100;
  }

  function calculateMwrr(cashflows, guess = 0.1, options = {}) {
    const irr = estimateXirr(cashflows, guess, options);
    return irr === null ? null : irr * 100;
  }

  function normalizeReturnSeries(returns) {
    if (!Array.isArray(returns)) {
      return [];
    }

    return returns.filter((value) => Number.isFinite(value));
  }

  function calculateVolatility(returns, periodsPerYear = 12) {
    const series = normalizeReturnSeries(returns);
    if (series.length < 2 || !Number.isFinite(periodsPerYear) || periodsPerYear <= 0) {
      return null;
    }

    const mean = series.reduce((sum, value) => sum + value, 0) / series.length;
    const variance = series.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / (series.length - 1);

    return Math.sqrt(variance) * Math.sqrt(periodsPerYear) * 100;
  }

  function calculateMaxDrawdown(returns) {
    const series = normalizeReturnSeries(returns);
    if (!series.length) {
      return null;
    }

    let cumulative = 1;
    let peak = 1;
    let maxDrawdown = 0;

    for (const value of series) {
      cumulative *= 1 + value;
      peak = Math.max(peak, cumulative);
      maxDrawdown = Math.min(maxDrawdown, (cumulative / peak) - 1);
    }

    return Math.abs(maxDrawdown) * 100;
  }

  function calculateSharpeRatio(returns, riskFreeRatePercent = 0, periodsPerYear = 12) {
    const series = normalizeReturnSeries(returns);
    if (series.length < 2 || !Number.isFinite(periodsPerYear) || periodsPerYear <= 0) {
      return null;
    }

    const periodicRiskFreeRate = (riskFreeRatePercent / 100) / periodsPerYear;
    const excessReturns = series.map((value) => value - periodicRiskFreeRate);
    const meanExcessReturn = excessReturns.reduce((sum, value) => sum + value, 0) / excessReturns.length;
    const variance = excessReturns.reduce((sum, value) => {
      return sum + ((value - meanExcessReturn) ** 2);
    }, 0) / (excessReturns.length - 1);
    const standardDeviation = Math.sqrt(variance);

    if (standardDeviation === 0) {
      return null;
    }

    return (meanExcessReturn / standardDeviation) * Math.sqrt(periodsPerYear);
  }

  function calculateMeanAnnualized(annualized) {
    const values = Object.values(annualized ?? {}).filter((value) => value !== null && Number.isFinite(value));
    if (!values.length) {
      return null;
    }

    return values.reduce((sum, value) => sum + value, 0) / values.length;
  }

  function calculateWeightedAnnualized(annualized, weights = {}) {
    const entries = Object.entries(weights)
      .map(([key, weight]) => ({
        value: annualized?.[key],
        weight: Number.isFinite(weight) ? weight : 0,
      }))
      .filter((entry) => entry.value !== null && Number.isFinite(entry.value));

    if (!entries.length) {
      return null;
    }

    return entries.reduce((sum, entry) => sum + (entry.weight * entry.value), 0);
  }

  function buildBatchConversionRows(startingValue, periods) {
    return periods.map((period) => {
      const annualizedReturn = annualizeReturn(period.totalReturnRate, period.years);
      if (annualizedReturn === null) {
        return { ...period, invalid: true };
      }

      const endingValue = startingValue * (1 + period.totalReturnRate / 100);
      return {
        label: period.label,
        years: period.years,
        totalReturnRate: period.totalReturnRate,
        annualizedReturn,
        endingValue,
        profitValue: endingValue - startingValue,
      };
    });
  }

  function mergeCashflows(assetCashflowGroups) {
    if (!Array.isArray(assetCashflowGroups)) {
      return [];
    }

    const mergedByTime = new Map();

    assetCashflowGroups
      .flatMap((cashflows) => (Array.isArray(cashflows) ? cashflows : []))
      .forEach((cashflow) => {
        if (!cashflow || !Number.isFinite(cashflow.time) || !Number.isFinite(cashflow.amount)) {
          return;
        }

        const current = mergedByTime.get(cashflow.time) ?? {
          time: cashflow.time,
          amount: 0,
        };
        current.amount += cashflow.amount;
        mergedByTime.set(cashflow.time, current);
      });

    return [...mergedByTime.values()]
      .filter((cashflow) => cashflow.amount !== 0)
      .sort((left, right) => left.time - right.time);
  }

  function calculatePortfolioIrr(assetCashflowGroups, guess = 0.1, options = {}) {
    const mergedCashflows = mergeCashflows(assetCashflowGroups);
    if (!mergedCashflows.length) {
      return null;
    }

    return estimateXirr(mergedCashflows, guess, options);
  }

  function pickAssetSortBasis(annualized) {
    if (annualized.return5y !== null) {
      return { key: "return5y", label: "5Y", value: annualized.return5y };
    }
    if (annualized.return3y !== null) {
      return { key: "return3y", label: "3Y", value: annualized.return3y };
    }
    if (annualized.return1y !== null) {
      return { key: "return1y", label: "1Y", value: annualized.return1y };
    }
    if (annualized.return10y !== null) {
      return { key: "return10y", label: "10Y", value: annualized.return10y };
    }
    return { key: "none", label: "-", value: Number.NEGATIVE_INFINITY };
  }

  function rankAssets(assets) {
    return [...assets]
      .map((asset) => ({
        ...asset,
        sortBasis: pickAssetSortBasis(asset.annualized),
        sortValue: pickAssetSortBasis(asset.annualized).value,
      }))
      .sort((left, right) => right.sortValue - left.sortValue);
  }

  const api = {
    MS_PER_DAY,
    getYearOffsets,
    xnpv,
    xnpvDerivative,
    estimateXirr,
    estimateXirrByBisection,
    annualizeReturn,
    calculateCagr,
    calculateTwrr,
    calculateMwrr,
    calculateVolatility,
    calculateMaxDrawdown,
    calculateSharpeRatio,
    calculateMeanAnnualized,
    calculateWeightedAnnualized,
    buildBatchConversionRows,
    mergeCashflows,
    calculatePortfolioIrr,
    pickAssetSortBasis,
    rankAssets,
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }

  globalScope.IRRCalculatorCore = api;
})(typeof globalThis !== "undefined" ? globalThis : window);
