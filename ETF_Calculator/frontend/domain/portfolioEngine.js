function createPortfolioHoldingFromPreset(ticker, allocationPercent) {
  const preset = findEtfPreset(ticker);
  if (!preset) return null;
  return {
    ticker: preset.ticker,
    displayName: preset.displayName,
    allocation: allocationPercent / 100,
    cagr: preset.cagr,
    dividendYield: preset.dividendYield,
    expenseRatio: preset.expenseRatio,
    volatility: preset.volatility,
    currency: preset.currency,
    region: preset.region,
    category: preset.category,
    inceptionYear: preset.inceptionYear,
    dividendMonths: preset.dividendMonths || []
  };
}

function normalizePortfolioHoldings(holdings) {
  const validHoldings = (Array.isArray(holdings) ? holdings : [])
    .filter((holding) => holding && Number.isFinite(holding.allocation) && holding.allocation > 0);
  const totalAllocation = validHoldings.reduce((sum, holding) => sum + holding.allocation, 0);
  if (totalAllocation <= 0) return [];

  return validHoldings.map((holding) => ({
    ...holding,
    allocation: holding.allocation / totalAllocation
  }));
}

function validatePortfolioAllocations(holdings) {
  const diagnostics = [];
  const portfolioHoldings = Array.isArray(holdings) ? holdings : [];
  const totalAllocation = portfolioHoldings.reduce((sum, holding) => sum + (Number(holding.allocation) || 0), 0);
  const duplicateTickers = new Set();
  const seenTickers = new Set();

  portfolioHoldings.forEach((holding) => {
    const ticker = String(holding.ticker || "").toUpperCase();
    if (!ticker) diagnostics.push(createPortfolioDiagnostic("error", "missing-ticker", "ETF 代號不可空白"));
    if (seenTickers.has(ticker)) duplicateTickers.add(ticker);
    seenTickers.add(ticker);
    if (!Number.isFinite(holding.allocation) || holding.allocation <= 0) {
      diagnostics.push(createPortfolioDiagnostic("error", "invalid-allocation", `${ticker || "ETF"} 配置比例必須大於 0`));
    }
  });

  duplicateTickers.forEach((ticker) => {
    diagnostics.push(createPortfolioDiagnostic("warning", "duplicate-ticker", `${ticker} 重複配置`));
  });

  if (portfolioHoldings.length > 0 && Math.abs(totalAllocation - 1) > 0.0001) {
    diagnostics.push(createPortfolioDiagnostic("warning", "allocation-not-100", `配置合計為 ${(totalAllocation * 100).toFixed(2)}%`));
  }

  return diagnostics;
}

function createPortfolioDiagnostic(severity, code, message) {
  return { severity, code, message };
}

function calculatePortfolioMetrics(holdings) {
  const normalizedHoldings = normalizePortfolioHoldings(holdings);
  const metrics = normalizedHoldings.reduce((result, holding) => {
    result.weightedCagr += holding.allocation * holding.cagr;
    result.weightedDividendYield += holding.allocation * holding.dividendYield;
    result.weightedExpenseRatio += holding.allocation * holding.expenseRatio;
    result.weightedVolatility += holding.allocation * holding.volatility;
    return result;
  }, {
    weightedCagr: 0,
    weightedDividendYield: 0,
    weightedExpenseRatio: 0,
    weightedVolatility: 0
  });

  return {
    ...metrics,
    holdings: normalizedHoldings,
    holdingCount: normalizedHoldings.length,
    totalAllocation: normalizedHoldings.reduce((sum, holding) => sum + holding.allocation, 0),
    currencyAllocation: calculateCurrencyAllocation(normalizedHoldings)
  };
}

function calculateCurrencyAllocation(holdings) {
  return holdings.reduce((result, holding) => {
    const currency = holding.currency || "TWD";
    result[currency] = (result[currency] || 0) + holding.allocation;
    return result;
  }, {});
}

function convertPortfolioValue(value, fromCurrency, toCurrency, exchangeRates) {
  if (fromCurrency === toCurrency) return value;
  const directRate = exchangeRates && exchangeRates[`${fromCurrency}_${toCurrency}`];
  if (Number.isFinite(directRate)) return value * directRate;
  const inverseRate = exchangeRates && exchangeRates[`${toCurrency}_${fromCurrency}`];
  if (Number.isFinite(inverseRate) && inverseRate !== 0) return value / inverseRate;
  return value;
}

function calculateCurrencyExposureValue(totalValue, currencyAllocation, baseCurrency, exchangeRates) {
  return Object.entries(currencyAllocation || {}).map(([currency, allocation]) => {
    const nativeValue = totalValue * allocation;
    return {
      currency,
      allocation,
      nativeValue,
      baseValue: convertPortfolioValue(nativeValue, currency, baseCurrency, exchangeRates)
    };
  });
}

function deriveInvestmentFromPortfolio(investment, holdings) {
  const metrics = calculatePortfolioMetrics(holdings);
  if (!metrics.holdingCount) return { ...investment };
  return {
    ...investment,
    annualReturn: metrics.weightedCagr,
    dividendYield: metrics.weightedDividendYield,
    volatility: metrics.weightedVolatility,
    expenseRatio: metrics.weightedExpenseRatio
  };
}

function addOrReplacePortfolioHolding(holdings, ticker, allocationPercent) {
  const nextHolding = createPortfolioHoldingFromPreset(ticker, allocationPercent);
  if (!nextHolding) return Array.isArray(holdings) ? holdings.slice() : [];
  const others = (Array.isArray(holdings) ? holdings : []).filter((holding) => holding.ticker !== nextHolding.ticker);
  return normalizePortfolioHoldings([...others, nextHolding]);
}

function updatePortfolioHoldingAllocation(holdings, ticker, allocationPercent) {
  return (Array.isArray(holdings) ? holdings : []).map((holding) => (
    holding.ticker === ticker
      ? { ...holding, allocation: allocationPercent / 100 }
      : holding
  ));
}

function removePortfolioHolding(holdings, ticker) {
  return normalizePortfolioHoldings((Array.isArray(holdings) ? holdings : []).filter((holding) => holding.ticker !== ticker));
}

function exportPortfolioConfig(portfolio) {
  return JSON.stringify({
    version: 1,
    holdings: (portfolio.holdings || []).map((holding) => ({
      ticker: holding.ticker,
      allocation: Number((holding.allocation * 100).toFixed(2)),
      currency: holding.currency || "TWD"
    }))
  }, null, 2);
}

function importPortfolioConfig(rawConfig) {
  let parsed;
  try {
    parsed = JSON.parse(rawConfig);
  } catch {
    return { holdings: [], diagnostics: [createPortfolioDiagnostic("error", "invalid-import-json", "匯入內容不是有效 JSON")] };
  }

  const importedHoldings = (Array.isArray(parsed.holdings) ? parsed.holdings : [])
    .map((holding) => createPortfolioHoldingFromPreset(holding.ticker, Number(holding.allocation)))
    .filter(Boolean);

  if (!importedHoldings.length) {
    return { holdings: [], diagnostics: [createPortfolioDiagnostic("error", "empty-import", "匯入內容沒有有效 ETF 配置")] };
  }

  return {
    holdings: normalizePortfolioHoldings(importedHoldings),
    diagnostics: []
  };
}
