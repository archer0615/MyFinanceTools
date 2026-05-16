function createPortfolioAggregate(investment) {
  return {
    investorId: "primary",
    persons: [
      {
        id: "primary",
        relation: "owner",
        investment: { ...investment }
      }
    ],
    investment: { ...investment }
  };
}

function derivePortfolioState(portfolio, historicalReturns) {
  const investment = { ...portfolio.investment };
  const dataset = calculateCompoundGrowth(investment);
  const result = calculateRiskMetrics(dataset);
  const historicalReplay = Array.isArray(historicalReturns)
    ? runHistoricalReplay(investment, historicalReturns)
    : null;
  const scenarios = enumeratePortfolioScenarios(investment);
  const ranking = rankPortfolioScenarios(scenarios);
  const attribution = attributeScenarioSavings(scenarios);
  const comparison = compareRankedScenarios(ranking);
  const explanation = explainPortfolioResult({ investment, dataset, result, historicalReplay, ranking, attribution, comparison });
  const diagnostics = validatePortfolioState({ investment, dataset, result, historicalReplay, scenarios });

  return {
    portfolio,
    investment,
    dataset,
    result,
    historicalReplay,
    scenarios,
    ranking,
    attribution,
    comparison,
    explanation,
    diagnostics
  };
}

function deriveInvestmentState(investment, historicalReturns) {
  return derivePortfolioState(createPortfolioAggregate(investment), historicalReturns);
}

function buildSimulationInput(state) {
  return {
    ...state.investment,
    simulations: state.simulations.iterations
  };
}

function enumeratePortfolioScenarios(investment) {
  const scenarioDefinitions = [
    ["base", "目前設定", investment],
    ["conservative", "保守壓力", {
      ...investment,
      annualReturn: investment.annualReturn - 0.02,
      volatility: investment.volatility * 0.8
    }],
    ["growth", "成長假設", {
      ...investment,
      annualReturn: investment.annualReturn + 0.02,
      volatility: investment.volatility * 1.15
    }]
  ];

  return scenarioDefinitions
    .map(([id, label, scenarioInvestment], index) => createScenario(id, label, scenarioInvestment, index + 1))
    .sort((a, b) => b.finalValue - a.finalValue || a.sequence - b.sequence);
}

function createScenario(id, label, investment, sequence) {
  const dataset = calculateCompoundGrowth(investment);
  const result = calculateRiskMetrics(dataset);
  const finalPoint = dataset.at(-1) || { value: 0, contribution: 0 };
  const legality = validateScenarioLegality(investment);

  return {
    id,
    label,
    sequence,
    investment: { ...investment },
    legal: legality.legal,
    diagnostics: legality.diagnostics,
    finalValue: finalPoint.value,
    contribution: finalPoint.contribution,
    cagr: result.cagr,
    maxDrawdown: result.maxDrawdown,
    sharpeRatio: result.sharpeRatio
  };
}

function rankPortfolioScenarios(scenarios) {
  return scenarios
    .filter((scenario) => scenario.legal)
    .map((scenario) => ({
      ...scenario,
      rankScore: scenario.finalValue * (1 + scenario.sharpeRatio) * (1 - scenario.maxDrawdown)
    }))
    .sort((a, b) => b.rankScore - a.rankScore || a.sequence - b.sequence)
    .map((scenario, index) => ({ ...scenario, rank: index + 1 }));
}

function validateScenarioLegality(investment) {
  const diagnostics = [];

  if (!Number.isFinite(investment.initialAmount) || investment.initialAmount < 0) {
    diagnostics.push(createDiagnostic("error", "illegal-initial-amount", i18n.invalidContribution));
  }
  if (!Number.isFinite(investment.monthlyContribution) || investment.monthlyContribution < 0) {
    diagnostics.push(createDiagnostic("error", "illegal-monthly-contribution", i18n.invalidContribution));
  }
  if (!Number.isFinite(investment.years) || investment.years < 1 || investment.years > 50) {
    diagnostics.push(createDiagnostic("error", "illegal-years", "投資年期必須介於 1 至 50 年"));
  }
  if (!Number.isFinite(investment.annualReturn) || investment.annualReturn < -0.5 || investment.annualReturn > 0.5) {
    diagnostics.push(createDiagnostic("error", "illegal-annual-return", "年化報酬率超出合法情境範圍"));
  }
  if (!Number.isFinite(investment.volatility) || investment.volatility < 0 || investment.volatility > 0.8) {
    diagnostics.push(createDiagnostic("error", "illegal-volatility", i18n.invalidVolatility));
  }
  if (!Number.isFinite(investment.dividendYield) || investment.dividendYield < 0 || investment.dividendYield > 0.2) {
    diagnostics.push(createDiagnostic("error", "illegal-dividend-yield", "股息率超出合法情境範圍"));
  }

  return {
    legal: diagnostics.length === 0,
    diagnostics
  };
}

function explainPortfolioResult(derived) {
  const finalPoint = derived.dataset.at(-1) || { value: 0, contribution: 0 };
  const bestScenario = derived.ranking[0];
  const historicalPoint = derived.historicalReplay && derived.historicalReplay.points.at(-1);
  const topAttribution = derived.attribution.find((item) => item.id !== "base");

  return {
    summary: `期末資產 ${formatDomainCurrency(finalPoint.value)}，累積投入 ${formatDomainCurrency(finalPoint.contribution)}，年化報酬 ${formatDomainPercent(derived.result.cagr)}。`,
    bestScenario: bestScenario
      ? `最佳排序為「${bestScenario.label}」，期末資產 ${formatDomainCurrency(bestScenario.finalValue)}。`
      : "尚未產生可排序情境。",
    attribution: topAttribution
      ? `相較目前設定，「${topAttribution.label}」差異為 ${formatDomainCurrency(topAttribution.deltaFinalValue)}，投入效率差異 ${formatDomainPercent(topAttribution.deltaReturnOnContribution)}。`
      : "尚未產生可歸因差異。",
    comparison: derived.comparison
      ? `第一名與第二名差距 ${formatDomainCurrency(derived.comparison.finalValueGap)}，排序分數差距 ${derived.comparison.rankScoreGap.toFixed(0)}。`
      : "尚未產生可比較排序。",
    historicalReplay: historicalPoint
      ? `歷史回測期末資產 ${formatDomainCurrency(historicalPoint.value)}，最大回撤 ${formatDomainPercent(derived.historicalReplay.metrics.maxDrawdown)}。`
      : "尚未載入歷史回測資料。"
  };
}

function attributeScenarioSavings(scenarios) {
  const base = scenarios.find((scenario) => scenario.id === "base") || scenarios[0];
  if (!base) return [];

  return scenarios.map((scenario) => ({
    id: scenario.id,
    label: scenario.label,
    deltaFinalValue: scenario.finalValue - base.finalValue,
    deltaContribution: scenario.contribution - base.contribution,
    deltaCagr: scenario.cagr - base.cagr,
    deltaReturnOnContribution: calculateReturnOnContribution(scenario) - calculateReturnOnContribution(base)
  })).sort((a, b) => b.deltaFinalValue - a.deltaFinalValue || a.id.localeCompare(b.id));
}

function compareRankedScenarios(ranking) {
  if (ranking.length < 2) return null;
  const [best, nextBest] = ranking;

  return {
    bestId: best.id,
    nextBestId: nextBest.id,
    finalValueGap: best.finalValue - nextBest.finalValue,
    rankScoreGap: best.rankScore - nextBest.rankScore,
    cagrGap: best.cagr - nextBest.cagr,
    drawdownGap: best.maxDrawdown - nextBest.maxDrawdown
  };
}

function calculateReturnOnContribution(scenario) {
  if (!scenario.contribution) return 0;
  return (scenario.finalValue - scenario.contribution) / scenario.contribution;
}

function validatePortfolioState(derived) {
  const diagnostics = [];
  const investment = derived.investment;

  if (investment.initialAmount < 0 || investment.monthlyContribution < 0) {
    diagnostics.push(createDiagnostic("error", "negative-contribution", i18n.invalidContribution));
  }
  if (investment.volatility > 0.8) {
    diagnostics.push(createDiagnostic("warning", "high-volatility", i18n.invalidVolatility));
  }
  if (!derived.dataset.length) {
    diagnostics.push(createDiagnostic("error", "empty-dataset", "無法產生資產走勢"));
  }
  if (!derived.scenarios.length) {
    diagnostics.push(createDiagnostic("warning", "empty-scenarios", "尚未產生情境比較"));
  }

  return diagnostics;
}

function createDiagnostic(severity, code, message) {
  return { severity, code, message };
}

function formatDomainCurrency(value) {
  return `NT$ ${Math.round(value).toLocaleString("zh-TW")}`;
}

function formatDomainPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}
