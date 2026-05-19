const presets = {
  conservative: { annualReturn: 0.04, volatility: 0.08, dividendYield: 0.02 },
  balanced: { annualReturn: 0.08, volatility: 0.16, dividendYield: 0.02 },
  aggressive: { annualReturn: 0.12, volatility: 0.24, dividendYield: 0.01 },
  crisis: { annualReturn: -0.08, volatility: 0.32, dividendYield: 0.01 },
  bullMarket: { annualReturn: 0.105, volatility: 0.14, dividendYield: 0.023 },
  bearMarket: { annualReturn: 0.035, volatility: 0.25, dividendYield: 0.014 },
  highInflation: { annualReturn: 0.065, volatility: 0.19, dividendYield: 0.024 },
  stagflation: { annualReturn: 0.03, volatility: 0.22, dividendYield: 0.017 },
  recession: { annualReturn: 0.045, volatility: 0.23, dividendYield: 0.014 },
  aggressiveGrowth: { annualReturn: 0.12, volatility: 0.24, dividendYield: 0.028 }
};

function bindPresets(onPresetChange) {
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-preset");
      if (presetName && presets[presetName]) onPresetChange(presets[presetName]);
    });
  });
}
