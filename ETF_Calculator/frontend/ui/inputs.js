const inputMap = {
  initialAmount: "initialAmount",
  monthlyContribution: "monthlyContribution",
  years: "years",
  annualReturn: "annualReturn",
  volatility: "volatility",
  dividendYield: "dividendYield",
  simulations: "iterations"
};

function bindInputs(onInvestmentChange, onSimulationConfigChange) {
  Object.entries(inputMap).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    input.addEventListener("input", () => {
      const value = Number(input.value);
      const normalized = key.includes("Return") || key.includes("volatility") || key.includes("Yield")
        ? value / 100
        : value;
      if (key === "iterations") {
        onSimulationConfigChange({ [key]: normalized });
      } else {
        onInvestmentChange({ [key]: normalized });
      }
    });
  });
}

function syncInputs(state) {
  Object.entries(inputMap).forEach(([id, key]) => {
    const input = document.getElementById(id);
    if (!input) return;
    const value = key === "iterations" ? state.simulations.iterations : state.investment[key];
    input.value = key.includes("Return") || key.includes("volatility") || key.includes("Yield")
      ? String(Number((value * 100).toFixed(2)))
      : String(value);
  });
}
