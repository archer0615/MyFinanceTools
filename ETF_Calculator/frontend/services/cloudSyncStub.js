function createCloudSyncSnapshot(state) {
  return {
    version: state.version,
    syncedAt: new Date(0).toISOString(),
    investment: { ...state.investment },
    portfolio: {
      baseCurrency: state.portfolio.baseCurrency,
      exchangeRates: { ...(state.portfolio.exchangeRates || {}) },
      holdings: (state.portfolio.holdings || []).map((holding) => ({
        ticker: holding.ticker,
        allocation: Number((holding.allocation * 100).toFixed(2)),
        currency: holding.currency
      }))
    },
    simulations: {
      iterations: state.simulations.iterations
    }
  };
}

function exportCloudSyncSnapshot(state) {
  return JSON.stringify(createCloudSyncSnapshot(state), null, 2);
}

function importCloudSyncSnapshot(rawSnapshot) {
  let parsed;
  try {
    parsed = JSON.parse(rawSnapshot);
  } catch {
    return { investment: {}, simulations: {}, portfolio: {}, diagnostics: [{ severity: "error", code: "invalid-cloud-json", message: "雲端同步資料不是有效 JSON" }] };
  }

  const importedPortfolio = importPortfolioConfig(JSON.stringify({ holdings: parsed.portfolio && parsed.portfolio.holdings }));
  return {
    investment: parsed.investment || {},
    simulations: parsed.simulations || {},
    portfolio: {
      baseCurrency: parsed.portfolio && parsed.portfolio.baseCurrency,
      exchangeRates: parsed.portfolio && parsed.portfolio.exchangeRates,
      holdings: importedPortfolio.holdings
    },
    diagnostics: importedPortfolio.diagnostics
  };
}
