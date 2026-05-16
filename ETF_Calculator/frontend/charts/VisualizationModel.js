function createVisualizationModel(state) {
  const points = state.charts.dataset || [];
  const scenarios = state.simulations.scenarios || [];
  const ranking = state.simulations.ranking || [];
  const attribution = state.attribution || [];
  const diagnostics = state.diagnostics || [];

  return {
    primarySeries: {
      id: "projected-assets",
      points,
      color: "#2563eb"
    },
    comparisonBars: scenarios.map((scenario) => ({
      id: scenario.id,
      label: scenario.label,
      value: scenario.finalValue
    })),
    rankingBars: ranking.map((scenario) => ({
      id: scenario.id,
      label: scenario.label,
      value: scenario.rankScore
    })),
    comparisonMatrix: scenarios.map((scenario) => ({
      id: scenario.id,
      label: scenario.label,
      finalValue: scenario.finalValue,
      cagr: scenario.cagr,
      maxDrawdown: scenario.maxDrawdown,
      legal: scenario.legal
    })),
    attributionBars: attribution.map((item) => ({
      id: item.id,
      label: item.label,
      value: item.deltaFinalValue
    })),
    transparency: {
      diagnostics: diagnostics.map((diagnostic) => ({
        severity: diagnostic.severity,
        code: diagnostic.code,
        message: diagnostic.message
      })),
      legalScenarioCount: scenarios.filter((scenario) => scenario.legal).length,
      scenarioCount: scenarios.length
    }
  };
}
