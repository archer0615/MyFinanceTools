function normalizePlan(plan, fallbackName = "Plan") {
  return {
    name: plan?.name || fallbackName,
    incomeChange: Number(plan?.incomeChange) || 0,
    marketChange: Number(plan?.marketChange) || 0,
    extraPaydown: Math.max(0, Number(plan?.extraPaydown) || 0),
  };
}

function estimateAnnualizedReturn(startValue, endValue, months) {
  if (startValue <= 0 || endValue <= 0 || months <= 0) {
    return 0;
  }

  return (Math.pow(endValue / startValue, 12 / months) - 1) * 100;
}

function buildScenarioComparisons(state) {
  const plans = Array.isArray(state.scenarioPlans) && state.scenarioPlans.length
    ? state.scenarioPlans
    : [
      { name: "Plan A", incomeChange: 0, marketChange: 0, extraPaydown: 0 },
      { name: "Plan B", incomeChange: -10, marketChange: -15, extraPaydown: 0 },
      { name: "Plan C", incomeChange: 5, marketChange: 8, extraPaydown: 100000 },
    ];
  const horizon = Math.max(1, Math.floor(Number(state.scenario.horizon) || 12));
  const baseNetWorth = calculateSummary(state).netWorth;

  return plans.map((plan, index) => {
    const normalizedPlan = normalizePlan(plan, `Plan ${String.fromCharCode(65 + index)}`);
    const forecast = buildCashflowForecast(state, { scenario: normalizedPlan, horizon });
    const netWorthRows = buildNetWorthForecast(state, { scenario: normalizedPlan, horizon, cashflowForecast: forecast });
    const finalNetWorth = netWorthRows.at(-1)?.netWorth ?? baseNetWorth;

    return {
      ...normalizedPlan,
      horizon,
      monthlyCashflow: forecast.baseMonthlyNet,
      lowestCash: forecast.lowestCash,
      finalNetWorth,
      netWorthDelta: finalNetWorth - baseNetWorth,
      estimatedIrr: estimateAnnualizedReturn(baseNetWorth, finalNetWorth, horizon),
      hasCashGap: forecast.hasGap,
    };
  });
}

function buildSensitivityAnalysis(state) {
  const horizon = Math.max(1, Math.floor(Number(state.scenario.horizon) || 12));
  const baseForecast = buildCashflowForecast(state, { horizon });
  const baseNetWorthRows = buildNetWorthForecast(state, { horizon, cashflowForecast: baseForecast });
  const baseFinalNetWorth = baseNetWorthRows.at(-1)?.netWorth ?? calculateSummary(state).netWorth;
  const totalIncome = (Number(state.cashflow.salaryIncome) || 0) + (Number(state.cashflow.passiveIncome) || 0);
  const totalDebt = sumBy(state.debts, (debt) => debt.balance);
  const investedAssets = sumBy(state.assets, (asset) => {
    return ["stock", "fund", "etf", "crypto", "foreign_currency", "property"].includes(asset.type) ? asset.amount : 0;
  });
  const variables = [
    {
      key: "rate-plus",
      label: "利率 +1%",
      impact: -(totalDebt * 0.01 / 12 * horizon),
      note: "以總負債估算利率上升造成的期間利息壓力。",
    },
    {
      key: "rate-minus",
      label: "利率 -1%",
      impact: totalDebt * 0.01 / 12 * horizon,
      note: "以總負債估算利率下降釋放的現金壓力。",
    },
    {
      key: "income-plus",
      label: "收入 +10%",
      impact: totalIncome * 0.1 * horizon,
      note: "以固定收入變動推估期間現金流改善。",
    },
    {
      key: "income-minus",
      label: "收入 -10%",
      impact: -(totalIncome * 0.1 * horizon),
      note: "以固定收入變動推估期間現金流壓力。",
    },
    {
      key: "market-plus",
      label: "投資市值 +10%",
      impact: investedAssets * 0.1,
      note: "以投資型資產估算市值變動對淨值的影響。",
    },
    {
      key: "market-minus",
      label: "投資市值 -10%",
      impact: -(investedAssets * 0.1),
      note: "以投資型資產估算市值下跌對淨值的影響。",
    },
  ];

  return variables
    .map((variable) => ({
      ...variable,
      projectedNetWorth: baseFinalNetWorth + variable.impact,
      absImpact: Math.abs(variable.impact),
    }))
    .sort((left, right) => right.absImpact - left.absImpact);
}

window.FinancePlannerDecisionMetrics = {
  buildScenarioComparisons,
  buildSensitivityAnalysis,
};

Object.assign(window, window.FinancePlannerDecisionMetrics);
