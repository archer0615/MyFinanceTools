const SAVED_PORTFOLIO_STORAGE_KEY = "etf-calculator-saved-portfolios";

function loadSavedPortfolios(storage = localStorage) {
  try {
    const raw = storage.getItem(SAVED_PORTFOLIO_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePortfolioSnapshot(state, name, storage = localStorage) {
  const snapshots = loadSavedPortfolios(storage).filter((item) => item.name !== name);
  const snapshot = {
    id: normalizeSavedPortfolioId(name),
    name: name || "未命名組合",
    savedAt: new Date(0).toISOString(),
    investment: { ...state.investment },
    portfolio: {
      ...state.portfolio,
      holdings: (state.portfolio.holdings || []).map((holding) => ({ ...holding }))
    }
  };
  const nextSnapshots = [snapshot, ...snapshots].slice(0, 12);
  storage.setItem(SAVED_PORTFOLIO_STORAGE_KEY, JSON.stringify(nextSnapshots));
  return nextSnapshots;
}

function normalizeSavedPortfolioId(name) {
  return String(name || "portfolio").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio";
}
