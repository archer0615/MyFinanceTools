const presets = {
  conservative: { annualReturn: 0.04, volatility: 0.08, dividendYield: 0.02 },
  balanced: { annualReturn: 0.08, volatility: 0.16, dividendYield: 0.02 },
  aggressive: { annualReturn: 0.12, volatility: 0.24, dividendYield: 0.01 },
  crisis: { annualReturn: -0.08, volatility: 0.32, dividendYield: 0.01 }
};

function bindPresets(onPresetChange) {
  document.querySelectorAll("[data-preset]").forEach((button) => {
    button.addEventListener("click", () => {
      const presetName = button.getAttribute("data-preset");
      if (presetName && presets[presetName]) onPresetChange(presets[presetName]);
    });
  });
}
