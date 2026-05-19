const ECONOMIC_SCENARIOS = [
  { id: "bullMarket", label: "多頭市場", annualReturnShift: 0.025, volatilityMultiplier: 0.9, dividendGrowthShift: 0.003 },
  { id: "bearMarket", label: "熊市", annualReturnShift: -0.045, volatilityMultiplier: 1.55, dividendGrowthShift: -0.006 },
  { id: "highInflation", label: "高通膨", annualReturnShift: -0.015, volatilityMultiplier: 1.2, dividendGrowthShift: 0.004 },
  { id: "stagflation", label: "停滯性通膨", annualReturnShift: -0.05, volatilityMultiplier: 1.35, dividendGrowthShift: -0.003 },
  { id: "recession", label: "景氣衰退", annualReturnShift: -0.035, volatilityMultiplier: 1.45, dividendGrowthShift: -0.006 },
  { id: "longBearMarket", label: "長期熊市", annualReturnShift: -0.055, volatilityMultiplier: 1.35, dividendGrowthShift: -0.01 },
  { id: "rateHikeCycle", label: "升息循環", annualReturnShift: -0.02, volatilityMultiplier: 1.25, dividendGrowthShift: -0.003 },
  { id: "stagnation", label: "停滯市場", annualReturnShift: -0.04, volatilityMultiplier: 0.95, dividendGrowthShift: -0.004 },
  { id: "aggressiveGrowth", label: "積極成長", annualReturnShift: 0.04, volatilityMultiplier: 1.15, dividendGrowthShift: 0.008 },
  { id: "aggressiveBullMarket", label: "強勢多頭", annualReturnShift: 0.04, volatilityMultiplier: 1.15, dividendGrowthShift: 0.008 }
];

function applyEconomicScenario(investment, scenario) {
  return {
    ...investment,
    annualReturn: investment.annualReturn + scenario.annualReturnShift,
    volatility: investment.volatility * scenario.volatilityMultiplier,
    dividendYield: Math.max(investment.dividendYield + scenario.dividendGrowthShift, 0)
  };
}

function enumerateEconomicScenarios(investment) {
  return ECONOMIC_SCENARIOS.map((scenario, index) => {
    const scenarioInvestment = applyEconomicScenario(investment, scenario);
    const dataset = calculateCompoundGrowth(scenarioInvestment);
    const result = calculateRiskMetrics(dataset, { dividendYield: scenarioInvestment.dividendYield });
    const finalPoint = dataset.at(-1) || { value: 0, contribution: 0 };
    const legality = typeof validateScenarioLegality === "function"
      ? validateScenarioLegality(scenarioInvestment)
      : { legal: true, diagnostics: [] };

    return {
      ...scenario,
      sequence: index + 1,
      investment: scenarioInvestment,
      legal: legality.legal,
      diagnostics: legality.diagnostics,
      finalValue: finalPoint.value,
      contribution: finalPoint.contribution,
      cagr: result.cagr,
      maxDrawdown: result.maxDrawdown,
      sharpeRatio: result.sharpeRatio,
      volatility: result.volatility,
      dividendYield: scenarioInvestment.dividendYield
    };
  }).sort((a, b) => b.finalValue - a.finalValue || a.sequence - b.sequence);
}
