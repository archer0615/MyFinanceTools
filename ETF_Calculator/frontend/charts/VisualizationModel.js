function createVisualizationModel(state) {
  const points = state.charts.dataset || [];
  const scenarios = state.simulations.scenarios || [];
  const ranking = state.simulations.ranking || [];
  const attribution = state.attribution || [];
  const diagnostics = state.diagnostics || [];
  const monteCarlo = state.simulations.monteCarlo || null;
  const rebalancing = state.simulations.rebalancing || [];
  const leverage = state.simulations.leverage || null;
  const crash = state.simulations.crash || null;
  const fire = state.simulations.fire || null;
  const benchmarkSeries = createBenchmarkSeries(points, state.investment, 0.06);
  const inflationSeries = createInflationAdjustedSeries(points, state.investment);
  const overlaySeries = [
    ...(benchmarkSeries.length ? [{ id: "benchmark-6pct", label: "6% 基準", points: benchmarkSeries, color: "#64748b", style: "dashed" }] : []),
    ...(inflationSeries.length ? [{ id: "inflation-adjusted", label: "通膨調整", points: inflationSeries, color: "#ca8a04", style: "dotted" }] : []),
    ...rebalancing.map((strategy) => ({
      id: `rebalance-${strategy.frequency}`,
      label: `再平衡 ${strategy.frequency}`,
      points: strategy.points || [],
      color: strategy.frequency === "monthly" ? "#0f766e" : strategy.frequency === "quarterly" ? "#7c3aed" : "#f97316"
    })),
    ...(leverage ? [{ id: "leverage-net-worth", label: "槓桿淨資產", points: leverage.points.map((point) => ({ year: point.year, value: point.netWorth })), color: "#dc2626" }] : []),
    ...(crash ? [{ id: "crash-stress", label: "壓力測試", points: crash.points, color: "#b45309" }] : []),
    ...(fire ? [{ id: "fire-withdrawal", label: "退休提領", points: fire.withdrawal.points, color: "#0891b2" }] : [])
  ];
  const activeView = state.charts.activeView || "overview";
  const dedicatedCharts = {
    rebalancing: {
      title: "再平衡漂移",
      series: rebalancing.map((strategy) => ({
        id: `drift-${strategy.frequency}`,
        label: strategy.frequency,
        points: (strategy.driftHistory || []).map((point) => ({ year: point.year, value: point.maxDrift })),
        color: strategy.frequency === "monthly" ? "#0f766e" : strategy.frequency === "quarterly" ? "#7c3aed" : "#f97316"
      }))
    },
    leverage: {
      title: "槓桿債務與淨值",
      series: leverage ? [
        { id: "leverage-debt", label: "剩餘債務", points: leverage.points.map((point) => ({ year: point.year, value: point.debt })), color: "#dc2626" },
        { id: "leverage-net-worth", label: "淨資產", points: leverage.points.map((point) => ({ year: point.year, value: point.netWorth })), color: "#0f766e" }
      ] : []
    },
    crash: {
      title: "回撤曲線",
      series: crash ? [
        { id: "drawdown", label: "回撤", points: crash.drawdownSeries.map((point) => ({ year: point.year, value: point.drawdown })), color: "#b45309" }
      ] : []
    },
    fire: {
      title: "退休提領",
      series: fire ? [
        { id: "fire-withdrawal", label: "退休資產", points: fire.withdrawal.points, color: "#0891b2" }
      ] : []
    }
  };

  return {
    activeView,
    dedicatedChart: dedicatedCharts[activeView] || null,
    primarySeries: {
      id: "projected-assets",
      points,
      color: "#2563eb"
    },
    timelineMarkers: createTimelineMarkers(state.investment, points),
    monteCarlo,
    overlaySeries: filterOverlaySeries(overlaySeries, activeView),
    distributionBars: createMonteCarloDistribution(monteCarlo),
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

function createBenchmarkSeries(points, investment, annualReturn) {
  if (!points.length || !investment) return [];
  let value = investment.initialAmount || 0;
  let contribution = investment.initialAmount || 0;
  const monthlyContribution = investment.monthlyContribution || 0;
  return Array.from({ length: investment.years || points.length }, (_, index) => {
    for (let month = 0; month < 12; month += 1) {
      value = (value + monthlyContribution) * (1 + annualReturn / 12);
      contribution += monthlyContribution;
    }
    return { year: index + 1, value, contribution };
  });
}

function createInflationAdjustedSeries(points, investment) {
  const inflationRate = investment && Number.isFinite(investment.inflationRate) ? investment.inflationRate : 0.02;
  return points.map((point) => ({
    ...point,
    value: point.value / ((1 + inflationRate) ** point.year)
  }));
}

function createTimelineMarkers(investment, points) {
  if (!investment || !points.length) return [];
  const markerYears = [
    { id: "midpoint", label: "中期檢視", year: Math.max(1, Math.round(investment.years / 2)) },
    { id: "target", label: "目標年", year: investment.years }
  ];
  return markerYears
    .map((marker) => {
      const point = points.find((item) => item.year === marker.year) || points.at(-1);
      return { ...marker, value: point ? point.value : 0 };
    })
    .filter((marker, index, markers) => markers.findIndex((item) => item.year === marker.year) === index);
}

function filterOverlaySeries(series, activeView) {
  const viewPrefixes = {
    rebalancing: "rebalance-",
    leverage: "leverage-",
    crash: "crash-",
    fire: "fire-"
  };
  const prefix = viewPrefixes[activeView];
  if (!prefix) return series;
  return series.filter((item) => item.id.startsWith(prefix));
}

function createMonteCarloDistribution(monteCarlo) {
  if (!monteCarlo || !monteCarlo.percentiles) return [];
  return [
    { label: "P10", value: monteCarlo.percentiles.p10 },
    { label: "P25", value: monteCarlo.percentiles.p25 },
    { label: "P50", value: monteCarlo.percentiles.p50 },
    { label: "P75", value: monteCarlo.percentiles.p75 },
    { label: "P90", value: monteCarlo.percentiles.p90 }
  ];
}
