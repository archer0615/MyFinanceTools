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

  Object.entries(urlStateMap).forEach(([paramName, stateKey]) => {
    if (!params.has(paramName)) return;
    const value = Number(params.get(paramName));
    if (!Number.isFinite(value)) return;
    if (stateKey === "iterations") simulations.iterations = value;
    else investment[stateKey] = value;
  });

  return { investment, simulations };
}

function saveUrlState(state) {
  const params = new URLSearchParams();
  Object.keys(urlStateMap).forEach((paramName) => {
    const value = paramName === "iterations"
      ? state.simulations.iterations
      : state.investment[paramName];
    if (value !== undefined && value !== null) params.set(paramName, String(value));
  });
  const query = params.toString();
  const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
  window.history.replaceState(null, "", nextUrl);
}
