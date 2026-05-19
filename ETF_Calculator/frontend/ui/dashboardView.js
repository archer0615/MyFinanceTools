function applyI18n() {
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.getAttribute("data-i18n");
    if (key && i18n[key]) element.textContent = i18n[key];
  });
}

function renderDashboard(state, chartRenderer) {
  document.body.dataset.loading = state.ui.isLoading ? "true" : "false";
  renderWorkspaceShell(createWorkspaceShell(state));
  const visualization = createVisualizationModel(state);
  const points = state.charts.dataset || [];
  const metrics = state.simulations.result || { cagr: 0, maxDrawdown: 0, sharpeRatio: 0 };
  const finalPoint = points.at(-1);
  setText("finalValue", formatCurrency(finalPoint ? finalPoint.value : 0));
  setText("cagr", formatPercent(metrics.cagr));
  setText("maxDrawdown", formatPercent(metrics.maxDrawdown));
  setText("sharpeRatio", metrics.sharpeRatio.toFixed(2));
  setText("sortinoRatio", metrics.sortinoRatio.toFixed(2));
  setText("realReturn", formatPercent(metrics.realReturnAfterInflation));
  renderKpiTrends(finalPoint ? finalPoint.value : 0, metrics, state.investment);
  setText(
    "summary",
    state.explanation ? state.explanation.summary : `依目前參數估算，期末資產為 ${formatCurrency(finalPoint ? finalPoint.value : 0)}，年化報酬率為 ${formatPercent(metrics.cagr)}。`
  );
  const canvas = document.getElementById("chartCanvas");
  chartRenderer.render(canvas, visualization, state.charts.viewport);
  renderScenarioComparison(state.simulations.scenarios || []);
  renderEconomicScenarios(state.simulations.economicScenarios || []);
  renderRanking(state.simulations.ranking || []);
  renderExplanation(state.explanation);
  renderPortfolioInsights(createPortfolioInsights(state));
  renderDiagnostics(state.diagnostics || []);
  renderPortfolioHoldings(state.portfolio || {});
  renderComparisonMatrix(visualization.comparisonMatrix);
  renderDistributionBars(visualization.distributionBars);
  renderTransparency(visualization.transparency);
  renderMonteCarloResult(state.simulations.monteCarlo);
  renderRebalancingResult(state.simulations.rebalancing || []);
  renderLeverageResult(state.simulations.leverage);
  renderCrashResult(state.simulations.crash);
  renderFireResult(state.simulations.fire);
  renderTaxResult(state.simulations.tax);
  renderOptimizationResult(state.simulations.optimization);
  renderPortfolioComparison(state.simulations.portfolioComparison || []);
  renderLiveQuotes(state.simulations.liveQuotes || []);
  renderDividendCalendar(state.portfolio || {}, state.investment, finalPoint ? finalPoint.value : 0);
  renderHistoricalReplay(state.simulations.historicalReplay);
  setText("debugOutput", state.ui.error || "");
}

function renderKpiTrends(finalValue, metrics, investment) {
  const contributed = investment.initialAmount + investment.monthlyContribution * 12 * investment.years;
  const gain = contributed > 0 ? finalValue / contributed - 1 : 0;
  setKpiTrend("finalValueTrend", gain, `投入比 ${formatPercent(gain)}`, true);
  setKpiTrend("cagrTrend", metrics.cagr - 0.06, `較 6% 基準 ${formatSignedPercent(metrics.cagr - 0.06)}`, true);
  setKpiTrend("drawdownTrend", metrics.maxDrawdown + 0.25, `較 -25% 風險線 ${formatSignedPercent(metrics.maxDrawdown + 0.25)}`, true);
  setKpiTrend("sharpeTrend", metrics.sharpeRatio - 1, `較 1.0 基準 ${formatSignedNumber(metrics.sharpeRatio - 1)}`, true);
  setKpiTrend("sortinoTrend", metrics.sortinoRatio - 1.2, `較 1.2 基準 ${formatSignedNumber(metrics.sortinoRatio - 1.2)}`, true);
  setKpiTrend("realReturnTrend", metrics.realReturnAfterInflation, `實質 ${formatSignedPercent(metrics.realReturnAfterInflation)}`, true);
}

function setKpiTrend(id, value, text, higherIsBetter) {
  const element = document.getElementById(id);
  if (!element) return;
  element.textContent = text;
  const article = element.closest("article");
  if (!article) return;
  const isPositive = higherIsBetter ? value >= 0 : value <= 0;
  article.dataset.kpiTone = Math.abs(value) < 0.005 ? "neutral" : (isPositive ? "positive" : "negative");
}

function formatSignedPercent(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatPercent(value)}`;
}

function formatSignedNumber(value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}`;
}

function renderPortfolioHoldings(portfolio) {
  const metrics = portfolio.metrics || calculatePortfolioMetrics(portfolio.holdings || []);
  setText("portfolioCagr", formatPercent(metrics.weightedCagr));
  setText("portfolioDividend", formatPercent(metrics.weightedDividendYield));
  setText("portfolioExpense", formatPercent(metrics.weightedExpenseRatio));
  setText("portfolioVolatility", formatPercent(metrics.weightedVolatility));
  replaceChildren("currencyExposure", Object.entries(metrics.currencyAllocation || {}).map(([currency, allocation]) => {
    const item = createElement("div");
    item.append(createElement("dt", { text: currency }), createElement("dd", { text: formatPercent(allocation) }));
    return item;
  }));
  const finalPoint = stateManager.getState().charts.dataset && stateManager.getState().charts.dataset.at(-1);
  replaceChildren("currencyExposureValue", calculateCurrencyExposureValue(
    finalPoint ? finalPoint.value : 0,
    metrics.currencyAllocation || {},
    portfolio.baseCurrency || "TWD",
    portfolio.exchangeRates || { USD_TWD: 32 }
  ).map((item) => {
    const wrapper = createElement("div");
    wrapper.append(
      createElement("dt", { text: item.currency }),
      createElement("dd", { text: formatCurrencyByCode(item.baseValue, portfolio.baseCurrency || "TWD") })
    );
    return wrapper;
  }));
  replaceChildren("portfolioHoldings", metrics.holdings.map((holding) => {
    const item = createElement("li");
    const allocationInput = createElement("input", {
      type: "number",
      min: "0.1",
      max: "100",
      step: "0.1",
      value: String(Number((holding.allocation * 100).toFixed(2)))
    });
    allocationInput.setAttribute("aria-label", `${holding.ticker} 配置比例`);
    allocationInput.addEventListener("change", () => {
      updatePortfolioHoldings((holdings) => updatePortfolioHoldingAllocation(holdings, holding.ticker, Number(allocationInput.value)));
    });
    const removeButton = createElement("button", {
      type: "button",
      text: "移除"
    });
    removeButton.setAttribute("aria-label", `移除 ${holding.ticker}`);
    removeButton.addEventListener("click", () => {
      updatePortfolioHoldings((holdings) => removePortfolioHolding(holdings, holding.ticker));
    });
    item.append(
      createElement("strong", { text: holding.ticker }),
      createElement("span", { text: holding.displayName }),
      allocationInput,
      createElement("small", { text: `${holding.currency || "TWD"} · ${formatPercent(holding.cagr)} / ${formatPercent(holding.dividendYield)}` }),
      removeButton
    );
    return item;
  }));
}

function renderRanking(ranking) {
  replaceChildren("rankingList", ranking.map((scenario) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${scenario.rank}. ${scenario.label}` }),
      createElement("strong", { text: formatCurrency(scenario.finalValue) }),
      createElement("small", { text: scenario.rankScore.toFixed(0) })
    );
    return item;
  }));
}

function renderExplanation(explanation) {
  if (!explanation) return;
  replaceChildren("explanationList", [
    ["排序", explanation.bestScenario],
    ["歸因", explanation.attribution],
    ["比較", explanation.comparison],
    ["回測", explanation.historicalReplay]
  ].map(([label, value]) => {
    const wrapper = createElement("div");
    wrapper.append(createElement("dt", { text: label }), createElement("dd", { text: value }));
    return wrapper;
  }));
}

function renderScenarioComparison(scenarios) {
  replaceChildren("scenarioList", scenarios.map((scenario, index) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${index + 1}. ${scenario.label}` }),
      createElement("strong", { text: formatCurrency(scenario.finalValue) }),
      createElement("small", { text: formatPercent(scenario.cagr) })
    );
    return item;
  }));
}

function renderComparisonMatrix(rows) {
  replaceChildren("comparisonMatrix", rows.map((row) => {
    const item = createElement("div");
    item.append(
      createElement("strong", { text: row.label }),
      createElement("span", { text: formatCurrency(row.finalValue) }),
      createElement("span", { text: formatPercent(row.cagr) }),
      createElement("span", { text: row.legal ? "合法" : "排除" })
    );
    return item;
  }));
}

function renderTransparency(transparency) {
  replaceChildren("transparencyList", [
    ["合法情境", `${transparency.legalScenarioCount}/${transparency.scenarioCount}`],
    ["診斷數", String(transparency.diagnostics.length)]
  ].map(([label, value]) => {
    const wrapper = createElement("div");
    wrapper.append(createElement("dt", { text: label }), createElement("dd", { text: value }));
    return wrapper;
  }));
}

function renderDiagnostics(diagnostics) {
  replaceChildren("diagnosticsList", diagnostics.map((diagnostic) => createElement("li", {
    text: diagnostic.message,
    dataset: { severity: diagnostic.severity }
  })));
}

function renderMonteCarloResult(result) {
  if (!result) return;
  setText("mcP10", formatCurrency(result.percentiles.p10));
  setText("mcP25", formatCurrency(result.percentiles.p25));
  setText("mcP50", formatCurrency(result.percentiles.p50));
  setText("mcP75", formatCurrency(result.percentiles.p75));
  setText("mcP90", formatCurrency(result.percentiles.p90));
  setText("mcBest", formatCurrency(result.bestCase));
  setText("mcWorst", formatCurrency(result.worstCase));
  setText("mcSuccess", formatPercent(result.successRate));
  setText("workerStatus", "模擬完成");
}

function renderPortfolioInsights(insights) {
  replaceChildren("portfolioInsightList", insights.map((insight) => {
    const item = createElement("li");
    item.dataset.severity = insight.type;
    item.append(
      createElement("span", { text: insight.title }),
      createElement("strong", { text: insight.message }),
      createElement("small", { text: insight.action })
    );
    return item;
  }));
}

function renderDistributionBars(rows) {
  const maxValue = Math.max(...rows.map((row) => row.value), 1);
  replaceChildren("distributionBars", rows.map((row) => {
    const item = createElement("div", {
      className: "distribution-bar",
      style: `--bar-width: ${Math.max(4, row.value / maxValue * 100)}%`
    });
    item.append(
      createElement("span", { text: row.label }),
      createElement("strong", { text: formatCurrency(row.value) })
    );
    return item;
  }));
}

function renderRebalancingResult(rebalancing) {
  const labels = {
    none: "不再平衡",
    monthly: "每月",
    quarterly: "每季",
    yearly: "每年"
  };
  replaceChildren("rebalancingList", rebalancing.map((strategy) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: labels[strategy.frequency] || strategy.frequency }),
      createElement("strong", { text: formatCurrency(strategy.metrics.finalValue) }),
      createElement("small", { text: `漂移 ${formatPercent(strategy.metrics.maxDrift)}` })
    );
    return item;
  }));
  replaceChildren("driftMatrix", rebalancing.map((strategy) => {
    const item = createElement("div");
    item.append(
      createElement("strong", { text: labels[strategy.frequency] || strategy.frequency }),
      createElement("span", { text: formatPercent(strategy.metrics.maxDrift) }),
      createElement("span", { text: formatCurrency(strategy.metrics.finalValue) }),
      createElement("span", { text: `${strategy.driftHistory.length} 年` })
    );
    return item;
  }));
}

function renderEconomicScenarios(scenarios) {
  replaceChildren("economicScenarioList", scenarios.map((scenario, index) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${index + 1}. ${scenario.label}` }),
      createElement("strong", { text: formatCurrency(scenario.finalValue) }),
      createElement("small", { text: `${formatPercent(scenario.cagr)} / ${formatPercent(scenario.volatility)}` })
    );
    return item;
  }));
}

function renderLeverageResult(leverage) {
  if (!leverage) return;
  setText("leverageInvestment", formatCurrency(leverage.metrics.finalInvestmentValue));
  setText("leverageDebt", formatCurrency(leverage.metrics.finalDebt));
  setText("leverageNetWorth", formatCurrency(leverage.metrics.finalNetWorth));
  setText("leverageInterest", formatCurrency(leverage.metrics.totalInterest));
  setText("leverageRatio", `${leverage.metrics.leverageRatio.toFixed(2)}x`);
  setText("leverageNetReturn", formatCurrency(leverage.metrics.netReturnAfterInterest));
}

function renderCrashResult(crash) {
  if (!crash) return;
  setText("crashLabel", crash.scenario.label);
  setText("crashDrawdown", formatPercent(crash.metrics.maxDrawdown));
  setText("crashRecovery", crash.metrics.recoveryDuration === null ? "未恢復" : `${crash.metrics.recoveryDuration} 年`);
  setText("crashUnderwater", `${crash.metrics.underwaterDuration} 年`);
  setText("crashLongestUnderwater", `${crash.metrics.longestUnderwaterDuration || 0} 年`);
  replaceChildren("drawdownPeriodList", (crash.worstPeriods || []).map((period) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${period.startYear}-${period.recoveryYear || "未恢復"}` }),
      createElement("strong", { text: formatPercent(period.maxDrawdown) }),
      createElement("small", { text: `${period.duration} 年` })
    );
    return item;
  }));
}

function renderFireResult(fire) {
  if (!fire) return;
  setText("fireTarget", formatCurrency(fire.targetAmount));
  setText("fireYear", fire.fireDateYear === null ? "未達成" : `${fire.fireDateYear} 年`);
  setText("fireAge", fire.estimatedFireAge === null ? "-" : `${fire.estimatedFireAge} 歲`);
  setText("fireSuccess", formatPercent(fire.metrics.successProbability));
  setText("fireDepletion", fire.metrics.depletionYear === null ? "未耗盡" : `${fire.metrics.depletionYear} 年`);
  setText("fireFinal", formatCurrency(fire.metrics.finalRetirementValue));
  setText("fireRequiredMonthly", formatCurrency(fire.reverseCalculation.requiredMonthlyContribution));
  setText("fireTargetCagr", formatPercent(fire.reverseCalculation.targetCagr));
}

function renderTaxResult(tax) {
  if (!tax) return;
  setText("taxBefore", formatCurrency(tax.metrics.finalBeforeTaxValue));
  setText("taxAfter", formatCurrency(tax.metrics.finalAfterTaxValue));
  setText("taxDividendDrag", formatCurrency(tax.metrics.dividendTaxDrag));
  setText("taxCapitalGains", formatCurrency(tax.metrics.capitalGainsTax));
  setText("taxEstate", formatCurrency(tax.metrics.estateTax));
  setText("taxEffectiveRate", formatPercent(tax.metrics.effectiveTaxDragRate));
}

function renderDividendCalendar(portfolio, investment, portfolioValue) {
  const projection = buildDividendProjectionFromPortfolio(portfolio, investment);
  setText("dividendAnnualIncome", formatCurrency(projection.finalAnnualDividendIncome));
  setText("dividendMonthlyIncome", formatCurrency(projection.finalMonthlyPassiveIncome));
  setText("dividendReinvested", formatCurrency(projection.totalReinvestedDividend));
  replaceChildren("dividendCalendar", buildDividendCalendar(portfolio.holdings || [], portfolioValue).map((row) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${row.month}月` }),
      createElement("strong", { text: formatCurrency(row.estimatedDividend) }),
      createElement("small", { text: row.tickers.join(", ") || "-" })
    );
    return item;
  }));
}

function buildDividendProjectionFromPortfolio(portfolio, investment) {
  const metrics = portfolio.metrics || calculatePortfolioMetrics(portfolio.holdings || []);
  return projectDividendIncome({
    ...investment,
    dividendYield: metrics.weightedDividendYield || investment.dividendYield,
    dividendGrowthRate: 0.03,
    dividendReinvestmentRate: 1
  }, investment.years);
}

function renderOptimizationResult(optimization) {
  if (!optimization) return;
  setText("optimizationScore", optimization.score.toFixed(2));
  setText("optimizationCagr", formatPercent(optimization.metrics.weightedCagr));
  setText("optimizationVolatility", formatPercent(optimization.metrics.weightedVolatility));
  replaceChildren("optimizationList", optimization.holdings.map((holding) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: holding.ticker }),
      createElement("strong", { text: formatPercent(holding.allocation) }),
      createElement("small", { text: `${formatPercent(holding.cagr)} / ${formatPercent(holding.volatility)}` })
    );
    return item;
  }));
  replaceChildren("efficientFrontierList", (optimization.efficientFrontier || []).map((point) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `風險偏好 ${Math.round(point.riskPreference * 100)}%` }),
      createElement("strong", { text: formatPercent(point.expectedReturn) }),
      createElement("small", { text: `波動 ${formatPercent(point.volatility)} / 股息 ${formatPercent(point.dividendYield)}` })
    );
    return item;
  }));
  replaceChildren("optimizationSuggestionList", (optimization.suggestions || []).map((suggestion) => {
    const labels = { increase: "增加", decrease: "降低", hold: "維持", "review-fees": "檢查費用" };
    const item = createElement("li");
    item.append(
      createElement("span", { text: suggestion.ticker }),
      createElement("strong", { text: labels[suggestion.action] || suggestion.action }),
      createElement("small", { text: formatSignedPercent(suggestion.delta || 0) })
    );
    return item;
  }));
}

function renderSavedPortfolioList(snapshots) {
  replaceChildren("savedPortfolioList", (snapshots || []).map((snapshot) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: snapshot.name }),
      createElement("strong", { text: `${(snapshot.portfolio.holdings || []).length} 檔` }),
      createElement("small", { text: snapshot.savedAt.slice(0, 10) })
    );
    return item;
  }));
}

function renderPortfolioComparison(rows) {
  replaceChildren("portfolioComparisonList", rows.map((row, index) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: `${index + 1}. ${row.name}` }),
      createElement("strong", { text: formatCurrency(row.finalValue) }),
      createElement("small", { text: `${formatPercent(row.cagr)} / 股息 ${formatCurrency(row.dividendIncome)}` })
    );
    return item;
  }));
}

function renderLiveQuotes(quotes) {
  replaceChildren("liveQuoteList", quotes.map((quote) => {
    const item = createElement("li");
    item.append(
      createElement("span", { text: quote.ticker }),
      createElement("strong", { text: formatCurrencyByCode(quote.price, quote.currency) }),
      createElement("small", { text: `${quote.source} · ${quote.asOf}` })
    );
    return item;
  }));
}

function renderHistoricalReplay(historicalReplay) {
  if (!historicalReplay || !historicalReplay.points.length) return;
  const finalReplayPoint = historicalReplay.points.at(-1);
  setText("historicalYears", `${historicalReplay.sourceYears[0]}-${historicalReplay.sourceYears.at(-1)}`);
  setText("historicalFinal", formatCurrency(finalReplayPoint.value));
  setText("historicalCagr", formatPercent(historicalReplay.metrics.cagr));
  setText("historicalDrawdown", formatPercent(historicalReplay.metrics.maxDrawdown));
}
