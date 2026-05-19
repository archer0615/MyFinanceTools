const urlStateMap = {
  initialAmount: "initialAmount",
  monthlyContribution: "monthlyContribution",
  years: "years",
  annualReturn: "annualReturn",
  volatility: "volatility",
  dividendYield: "dividendYield",
  iterations: "iterations"
};

function loadUrlState() {
  const params = new URLSearchParams(window.location.search);
  const investment = {};
  const simulations = {};
  const portfolio = {};

  Object.entries(urlStateMap).forEach(([paramName, stateKey]) => {
    if (!params.has(paramName)) return;
    const value = Number(params.get(paramName));
    if (!Number.isFinite(value)) return;
    if (stateKey === "iterations") simulations.iterations = value;
    else investment[stateKey] = value;
  });

  if (params.has("holdings")) {
    const holdings = parseUrlHoldings(params.get("holdings"));
    if (holdings.length) portfolio.holdings = holdings;
  }

  return { investment, simulations, portfolio };
}

function saveUrlState(state) {
  const params = new URLSearchParams();
  Object.keys(urlStateMap).forEach((paramName) => {
    const value = paramName === "iterations"
      ? state.simulations.iterations
      : state.investment[paramName];
    if (value !== undefined && value !== null) params.set(paramName, String(value));
  });
  const holdings = serializeUrlHoldings(state.portfolio && state.portfolio.holdings);
  if (holdings) params.set("holdings", holdings);
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}

function parseUrlHoldings(value) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => {
      const [ticker, allocationText] = item.split(":");
      const allocation = Number(allocationText);
      const preset = findEtfPreset(ticker);
      if (!preset || !Number.isFinite(allocation) || allocation <= 0) return null;
      return createPortfolioHoldingFromPreset(preset.ticker, allocation);
    })
    .filter(Boolean);
}

function serializeUrlHoldings(holdings) {
  if (!Array.isArray(holdings) || !holdings.length) return "";
  return holdings
    .map((holding) => `${holding.ticker}:${Number((holding.allocation * 100).toFixed(2))}`)
    .join(",");
}
