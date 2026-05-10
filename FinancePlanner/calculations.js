const DEFAULT_EMERGENCY_MONTHS = 6;
const DEFAULT_HIGH_LIABILITY_RATIO = 60;
const DEFAULT_MEDIUM_LIABILITY_RATIO = 40;
const DEFAULT_LOW_PLEDGE_BUFFER = 15;
const DEFAULT_MEDIUM_PLEDGE_BUFFER = 30;

function sumBy(items, selector) {
  return items.reduce((total, item) => total + (Number(selector(item)) || 0), 0);
}

function calculateSummary(state) {
  const totalAssets = sumBy(state.assets, (asset) => asset.amount);
  const totalLiabilities = sumBy(state.debts, (debt) => debt.balance);
  const totalIncome = (Number(state.cashflow.salaryIncome) || 0) + (Number(state.cashflow.passiveIncome) || 0);
  const totalExpenses = (Number(state.cashflow.monthlyExpense) || 0) + (Number(state.cashflow.debtPayment) || 0);

  return {
    totalAssets,
    totalLiabilities,
    netWorth: totalAssets - totalLiabilities,
    freeCashFlow: totalIncome - totalExpenses,
  };
}

function getMonthlyNetFlowBase(state, scenarioOverrides = null) {
  const salaryIncome = Number(state.cashflow.salaryIncome) || 0;
  const passiveIncome = Number(state.cashflow.passiveIncome) || 0;
  const monthlyExpense = Number(state.cashflow.monthlyExpense) || 0;
  const debtPayment = Number(state.cashflow.debtPayment) || 0;

  if (!scenarioOverrides) {
    return salaryIncome + passiveIncome - monthlyExpense - debtPayment;
  }

  const incomeMultiplier = 1 + ((Number(scenarioOverrides.incomeChange) || 0) / 100);
  return (salaryIncome + passiveIncome) * incomeMultiplier - monthlyExpense - debtPayment;
}

function getEventSignedAmount(eventItem) {
  const amount = Math.abs(Number(eventItem.amount) || 0);
  return eventItem.type === "income" ? amount : -amount;
}

function calculateBalanceMetrics(state) {
  const summary = calculateSummary(state);
  const liquidTypes = new Set(ASSET_TYPE_OPTIONS.filter((option) => option.liquid).map((option) => option.value));
  const liquidAssets = sumBy(state.assets, (asset) => liquidTypes.has(asset.type) ? asset.amount : 0);
  const liabilityRatio = summary.totalAssets > 0 ? (summary.totalLiabilities / summary.totalAssets) * 100 : 0;
  const liquidAssetRatio = summary.totalAssets > 0 ? (liquidAssets / summary.totalAssets) * 100 : 0;
  const leverageRatio = summary.netWorth > 0 ? summary.totalLiabilities / summary.netWorth : 0;

  return {
    ...summary,
    liquidAssets,
    liabilityRatio,
    liquidAssetRatio,
    leverageRatio,
  };
}


function resolvePledgeStatus(maintenanceRatio, warningRatio) {
  if (warningRatio <= 0 || maintenanceRatio <= 0) {
    return "safe";
  }

  if (maintenanceRatio <= warningRatio) {
    return "danger";
  }

  if (maintenanceRatio <= warningRatio + DEFAULT_LOW_PLEDGE_BUFFER) {
    return "warning";
  }

  return "safe";
}

function calculatePledgeMetrics(state, marketValueOverride = null) {
  const baseMarketValue = marketValueOverride ?? Number(state.pledge.marketValue);
  const marketValue = Math.max(0, Number(baseMarketValue) || 0);
  const securedDebts = state.debts.filter((debt) => debt.type === "margin_loan");
  const pledgeDebt = sumBy(securedDebts, (debt) => debt.balance);
  const warningRatio = Math.max(0, Number(state.pledge.warningRatio) || 0);
  const maintenanceRatio = pledgeDebt > 0 ? (marketValue / pledgeDebt) * 100 : 0;
  const bufferRatio = maintenanceRatio > 0 && warningRatio > 0 ? maintenanceRatio - warningRatio : 0;

  let riskLevel = "穩定";
  let note = "目前未接近警戒線，可持續追蹤市值波動與負債變化。";

  if (pledgeDebt <= 0 || marketValue <= 0) {
    note = "目前未偵測到可計算的股票質押風險，若有質押借款請補上對應負債與市值。";
  } else if (warningRatio > 0 && maintenanceRatio <= warningRatio) {
    riskLevel = "高";
    note = "已低於警戒維持率，應優先補現金、降槓桿或補擔保品。";
  } else if (bufferRatio <= DEFAULT_LOW_PLEDGE_BUFFER) {
    riskLevel = "偏高";
    note = "距離警戒線過近，短期價格波動就可能觸發追繳。";
  } else if (bufferRatio <= DEFAULT_MEDIUM_PLEDGE_BUFFER) {
    riskLevel = "注意";
    note = "質押緩衝偏薄，建議持續監控並避免再加槓桿。";
  }

  return {
    marketValue,
    pledgeDebt,
    warningRatio,
    maintenanceRatio,
    bufferRatio,
    riskLevel,
    note,
    status: resolvePledgeStatus(maintenanceRatio, warningRatio),
  };
}

function getDebtSortOrder(state, strategy = "snowball") {
  const debts = Array.isArray(state.debts) ? [...state.debts] : [];

  return debts.sort((left, right) => {
    if (strategy === "avalanche") {
      return (Number(right.rate) || 0) - (Number(left.rate) || 0);
    }

    return (Number(left.balance) || 0) - (Number(right.balance) || 0);
  });
}

function buildPledgeStressTest(state, drawdowns = [-10, -20, -30, -50]) {
  const warningRatio = Math.max(0, Number(state.pledge.warningRatio) || 0);
  const baseMarketValue = Math.max(0, Number(state.pledge.marketValue) || 0);

  return drawdowns.map((drawdown) => {
    const adjustedMarketValue = Math.max(0, baseMarketValue * (1 + (Number(drawdown) || 0) / 100));
    const metrics = calculatePledgeMetrics(state, adjustedMarketValue);

    return {
      drawdown,
      marketValue: adjustedMarketValue,
      maintenanceRatio: metrics.maintenanceRatio,
      bufferRatio: metrics.bufferRatio,
      warningRatio,
      status: metrics.status,
    };
  });
}

function buildCashflowForecast(state, options = {}) {
  const scenario = options.scenario ?? null;
  const horizon = Math.max(1, Math.floor(Number(options.horizon) || 12));
  const baseMonthlyNet = getMonthlyNetFlowBase(state, scenario);
  let endingCash = Number(state.cashflow.startingCash) || 0;
  let lowestCash = endingCash;
  let hasGap = endingCash < 0;
  const rows = [];

  for (let month = 1; month <= horizon; month += 1) {
    const eventTotal = state.events
      .filter((eventItem) => Number(eventItem.month) === month)
      .reduce((total, eventItem) => total + getEventSignedAmount(eventItem), 0);
    const netFlow = baseMonthlyNet + eventTotal;
    endingCash += netFlow;
    lowestCash = Math.min(lowestCash, endingCash);
    hasGap = hasGap || endingCash < 0;

    rows.push({
      month,
      netFlow,
      endingCash,
    });
  }

  return {
    baseMonthlyNet,
    rows,
    lowestCash,
    hasGap,
  };
}

function buildNetWorthForecast(state, options = {}) {
  const scenario = options.scenario ?? null;
  const cashflowForecast = options.cashflowForecast ?? buildCashflowForecast(state, options);
  const horizon = cashflowForecast.rows.length;
  const baseSummary = calculateSummary(state);
  const marketChange = scenario ? (Number(scenario.marketChange) || 0) / 100 : 0;
  const investedAssets = sumBy(state.assets, (asset) => {
    return ["stock", "fund", "etf", "crypto", "foreign_currency", "property"].includes(asset.type) ? asset.amount : 0;
  });
  const scenarioAssetDelta = investedAssets * marketChange;
  const extraPaydown = scenario ? Math.max(0, Number(scenario.extraPaydown) || 0) : 0;
  const baselineNetWorth = baseSummary.netWorth + scenarioAssetDelta;
  const baselineLiabilities = Math.max(0, baseSummary.totalLiabilities - extraPaydown);

  return cashflowForecast.rows.map((row) => ({
    month: row.month,
    netWorth: baselineNetWorth + (row.endingCash - (Number(state.cashflow.startingCash) || 0)),
    liabilities: baselineLiabilities,
  })).slice(0, horizon);
}

function buildScenarioSnapshot(state) {
  const horizon = Math.max(1, Math.floor(Number(state.scenario.horizon) || 12));
  const scenario = {
    incomeChange: Number(state.scenario.incomeChange) || 0,
    marketChange: Number(state.scenario.marketChange) || 0,
    extraPaydown: Number(state.scenario.extraPaydown) || 0,
  };
  const forecast = buildCashflowForecast(state, { scenario, horizon });
  const netWorthRows = buildNetWorthForecast(state, { scenario, horizon, cashflowForecast: forecast });
  const adjustedMarketValue = Math.max(0, (Number(state.pledge.marketValue) || 0) * (1 + scenario.marketChange / 100));
  const pledge = calculatePledgeMetrics(state, adjustedMarketValue);
  const extraPaydownText = scenario.extraPaydown ? `NT$ ${Math.round(scenario.extraPaydown)}` : "未設定";

  return {
    scenario,
    forecast,
    netWorthRows,
    pledge,
    currentStatus: `收入 ${scenario.incomeChange}% / 市場 ${scenario.marketChange}% / 額外還款 ${extraPaydownText}`,
  };
}

function evaluateRisk(state) {
  const balance = calculateBalanceMetrics(state);
  const pledge = calculatePledgeMetrics(state);
  const monthlyEssentials = (Number(state.cashflow.monthlyExpense) || 0) + (Number(state.cashflow.debtPayment) || 0);
  const emergencyMonths = monthlyEssentials > 0 ? (Number(state.cashflow.startingCash) || 0) / monthlyEssentials : 0;
  const freeCashFlow = balance.freeCashFlow;
  const findings = [];

  if (emergencyMonths < DEFAULT_EMERGENCY_MONTHS) {
    findings.push({
      code: "cash-buffer",
      severity: emergencyMonths < 3 ? "high" : "medium",
      title: "現金不足",
      action: `先補足至少 ${DEFAULT_EMERGENCY_MONTHS} 個月支出緩衝，避免現金流短缺時被迫賣資產。`,
    });
  }

  if (balance.liabilityRatio >= DEFAULT_HIGH_LIABILITY_RATIO) {
    findings.push({
      code: "liability-ratio",
      severity: "high",
      title: "負債比過高",
      action: "優先停止新增槓桿，並將額外現金流集中到高利負債或高壓力負債。",
    });
  } else if (balance.liabilityRatio >= DEFAULT_MEDIUM_LIABILITY_RATIO) {
    findings.push({
      code: "liability-ratio",
      severity: "medium",
      title: "負債比偏高",
      action: "持續監控總負債增長，避免生活支出與槓桿同步擴張。",
    });
  }

  if (freeCashFlow < 0) {
    findings.push({
      code: "negative-cashflow",
      severity: "high",
      title: "現金流為負",
      action: "先縮減固定支出或調整月付結構，再考慮投資與加速還款。",
    });
  }

  if (pledge.pledgeDebt > 0 && pledge.bufferRatio <= DEFAULT_LOW_PLEDGE_BUFFER) {
    findings.push({
      code: "pledge-buffer",
      severity: pledge.bufferRatio <= 0 ? "high" : "medium",
      title: "質押 buffer 過低",
      action: "提高維持率緩衝，避免市值下跌時觸發追繳或被迫賣出。",
    });
  }

  let level = "低";
  if (findings.some((item) => item.severity === "high")) {
    level = "高";
  } else if (findings.length > 0) {
    level = "中";
  }

  const primaryAction = findings[0]?.action || "目前結構可控，維持每月更新資產負債與現金流即可。";
  const headline = level === "高" ? "需要優先處理風險" : level === "中" ? "風險偏中，建議持續修正" : "目前風險可控";

  return {
    level,
    headline,
    primaryAction,
    findings,
    emergencyMonths,
    balance,
    pledge,
  };
}

window.FinancePlannerCalculations = {
  sumBy,
  calculateSummary,
  getMonthlyNetFlowBase,
  getEventSignedAmount,
  calculateBalanceMetrics,
  calculatePledgeMetrics,
  getDebtSortOrder,
  buildPledgeStressTest,
  buildCashflowForecast,
  buildNetWorthForecast,
  buildScenarioSnapshot,
  evaluateRisk,
};

Object.assign(window, window.FinancePlannerCalculations);
