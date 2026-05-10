const HELP_STORAGE_KEY = "fp_onboarding_help";
const ONBOARDING_STEPS = {
  1: { key: "asset", label: "Step 1", detail: "先新增至少一筆資產，建立財務盤點起點。" },
  2: { key: "debt", label: "Step 2", detail: "補上負債資料，才能比較負債比與還款順序。" },
  3: { key: "cashflow", label: "Step 3", detail: "填寫收入與現金流，完成壓力測試基礎。" },
  4: { key: "budget", label: "Step 4", detail: "設定分類預算，讓本月支出能對照上限與剩餘額度。" },
  5: { key: "goal", label: "Step 5", detail: "設定財務目標，確認每月需投入金額與資金缺口。" },
  6: { key: "forecast", label: "Step 6", detail: "查看預測區，確認 12 個月現金是否出現缺口。" },
  7: { key: "risk", label: "Step 7", detail: "查看風險與決策建議，決定下一步行動。" },
};
const QUICK_ACTIONS = [
  { label: "資產", target: "asset" },
  { label: "負債", target: "debt" },
  { label: "現金流", target: "cashflow" },
  { label: "收支", target: "incomeExpense" },
  { label: "預算控管", target: "budget" },
  { label: "目標規劃", target: "goal" },
  { label: "預測", target: "forecast" },
  { label: "風險", target: "risk" },
];
const SECTION_TARGETS = {
  asset: () => elements.assetSection,
  debt: () => elements.debtSection,
  cashflow: () => elements.cashflowSection,
  incomeExpense: () => elements.incomeExpenseSection,
  budget: () => elements.budgetSection,
  goal: () => elements.goalSection,
  forecast: () => elements.forecastSection,
  risk: () => elements.riskSection,
  repayment: () => document.querySelector("#recommended-strategy")?.closest(".surface"),
};
let chartRenderTimer = null;

function isFeatureEnabled(name) {
  return window.FEATURE_FLAGS?.[name] !== false;
}

function optionalCall(feature, fallback, callback) {
  if (!isFeatureEnabled(feature)) {
    return fallback;
  }

  try {
    return callback();
  } catch (error) {
    console.warn(`[FinancePlanner] Optional feature failed: ${feature}`, error);
    return fallback;
  }
}

function ensureOnboardingState() {
  if (!state.onboarding || typeof state.onboarding !== "object") {
    state.onboarding = { step: 1, completed: false, seenForecast: false, seenRisk: false };
  }

  state.onboarding.step = Math.max(1, Number(state.onboarding.step) || 1);
  state.onboarding.completed = Boolean(state.onboarding.completed);
  state.onboarding.seenForecast = Boolean(state.onboarding.seenForecast);
  state.onboarding.seenRisk = Boolean(state.onboarding.seenRisk);
}

function updateSaveStatus(message) {
  if (elements.saveStatus instanceof HTMLElement) {
    elements.saveStatus.textContent = message;
  }
}

function updateBackupStatus(message) {
  if (elements.backupStatus instanceof HTMLElement) {
    elements.backupStatus.textContent = message;
  }
}

function renderSummaryCards() {
  const summary = calculateSummary(state);

  if (elements.totalAssets instanceof HTMLElement) {
    elements.totalAssets.textContent = formatCurrency(summary.totalAssets);
  }

  if (elements.totalLiabilities instanceof HTMLElement) {
    elements.totalLiabilities.textContent = formatCurrency(summary.totalLiabilities);
  }

  if (elements.netWorth instanceof HTMLElement) {
    elements.netWorth.textContent = formatCurrency(summary.netWorth);
  }

  if (elements.freeCashFlow instanceof HTMLElement) {
    elements.freeCashFlow.textContent = formatCurrency(summary.freeCashFlow);
  }
}


function formatPercent(value, fractionDigits = 1) {
  const numericValue = Number.isFinite(value) ? value : 0;
  return `${numericValue.toFixed(fractionDigits)}%`;
}

function formatMultiple(value) {
  const numericValue = Number.isFinite(value) ? value : 0;
  return `${numericValue.toFixed(2)}x`;
}

function renderSparkChart(container, rows, valueKey) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  if (!rows.length) {
    container.innerHTML = "";
    return;
  }

  const maxAbsValue = Math.max(...rows.map((row) => Math.abs(Number(row[valueKey]) || 0)), 1);
  container.innerHTML = rows.map((row) => {
    const value = Number(row[valueKey]) || 0;
    const width = Math.max(6, (Math.abs(value) / maxAbsValue) * 100);
    const fillClass = value < 0 ? "bar-fill negative" : "bar-fill";

    return `
      <div class="bar-row">
        <span class="bar-label">${row.month} 月</span>
        <div class="bar-track"><div class="${fillClass}" style="width:${width}%"></div></div>
        <span class="bar-value">${formatCurrency(value)}</span>
      </div>
    `;
  }).join("");
}

function renderComparisonBars(container, items, formatter = formatCurrency) {
  if (!(container instanceof HTMLElement)) {
    return;
  }

  if (!items.length) {
    container.innerHTML = "";
    return;
  }

  const maxValue = Math.max(...items.map((item) => Math.abs(Number(item.value) || 0)), 1);
  container.innerHTML = items.map((item) => {
    const width = Math.max(6, (Math.abs(Number(item.value) || 0) / maxValue) * 100);
    return `
      <div class="bar-row">
        <span class="bar-label">${escapeHtml(item.label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div>
        <span class="bar-value">${formatter(Number(item.value) || 0)}</span>
      </div>
    `;
  }).join("");
}


function formatPledgeStatus(status) {
  if (status === "danger") {
    return "danger";
  }

  if (status === "warning") {
    return "warning";
  }

  return "safe";
}

function buildRenderContext(options = {}) {
  const includeEnhancements = options.includeEnhancements !== false;
  ensureOnboardingState();
  if (includeEnhancements && isFeatureEnabled("onboarding")) {
    updateOnboardingState();
  }
  const risk = evaluateRisk(state);
  const cashflowForecast = buildCashflowForecast(state);
  const netWorthForecast = buildNetWorthForecast(state, { cashflowForecast });
  const scenarioSnapshot = buildScenarioSnapshot(state);
  const balance = calculateBalanceMetrics(state);
  const pledge = calculatePledgeMetrics(state);
  const pledgeStressRows = buildPledgeStressTest(state);
  const emptyRecommendations = { actions: [] };
  const emptyInvestmentTracking = { totalMarketValue: 0, totalGainLoss: 0, totalReturnRate: 0, investments: [] };
  const emptyLoanAnalysis = { totalBalance: 0, totalRateShockPayment: 0, rows: [] };
  const emptyFirePlan = { targetPortfolio: 0, progressRatio: 0, monthsToFire: 0 };
  const recommendations = includeEnhancements ? optionalCall("insights", emptyRecommendations, () => window.FinancePlannerDecisionEngine?.getRecommendedActions?.(state) || emptyRecommendations) : emptyRecommendations;
  const netWorthDashboard = calculateNetWorthDashboard(state);
  const selectedMonth = state.incomeExpense?.month || new Date().toISOString().slice(0, 7);
  const incomeExpense = calculateIncomeExpenseOverview(state.transactions, selectedMonth);
  const budget = calculateBudgetOverview(state.budgets, state.transactions, selectedMonth);
  const goal = calculateGoalPlan(state.goal, netWorthDashboard.monthlyNetCashflow);
  const scenarioComparisons = buildScenarioComparisons(state);
  const sensitivity = buildSensitivityAnalysis(state);
  const investmentTracking = includeEnhancements ? optionalCall("metrics", emptyInvestmentTracking, () => window.FinancePlannerAnalysisMetrics?.buildInvestmentTracking?.(state) || emptyInvestmentTracking) : emptyInvestmentTracking;
  const loanAnalysis = includeEnhancements ? optionalCall("metrics", emptyLoanAnalysis, () => window.FinancePlannerAnalysisMetrics?.buildLoanAnalysis?.(state) || emptyLoanAnalysis) : emptyLoanAnalysis;
  const smartSuggestions = includeEnhancements ? optionalCall("insights", [], () => window.InsightsEngine?.buildSmartSuggestions?.({ budget, cashflowForecast, incomeExpense, netWorthDashboard }) || []) : [];
  const notifications = includeEnhancements ? optionalCall("insights", [], () => window.InsightsEngine?.buildNotifications?.({ budget, cashflowForecast }, state) || []) : [];
  const educationTips = includeEnhancements ? optionalCall("metrics", [], () => window.ExperienceMetrics?.buildEducationTips?.({ budget, incomeExpense }) || []) : [];
  const firePlan = includeEnhancements ? optionalCall("metrics", emptyFirePlan, () => window.ExperienceMetrics?.buildFirePlan?.(state, netWorthDashboard) || emptyFirePlan) : emptyFirePlan;
  const autoSavingPlan = includeEnhancements ? optionalCall("metrics", [], () => window.ExperienceMetrics?.buildAutoSavingPlan?.(state, { netWorthDashboard }) || []) : [];

  return { risk, cashflowForecast, netWorthForecast, scenarioSnapshot, balance, pledge, pledgeStressRows, recommendations, netWorthDashboard, incomeExpense, budget, goal, scenarioComparisons, sensitivity, investmentTracking, loanAnalysis, smartSuggestions, notifications, educationTips, firePlan, autoSavingPlan, selectedMonth };
}

function getStepTarget(step) {
  const stepConfig = ONBOARDING_STEPS[step];
  return stepConfig ? SECTION_TARGETS[stepConfig.key]?.() || null : null;
}

function scrollToSection(targetKey) {
  const section = SECTION_TARGETS[targetKey]?.();
  if (section instanceof HTMLElement) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function updateOnboardingState() {
  ensureOnboardingState();
  const totalIncome = (Number(state.cashflow.salaryIncome) || 0) + (Number(state.cashflow.passiveIncome) || 0);
  const assetReady = state.assets.some((asset) => Number(asset.amount) > 0);
  const debtReady = state.debts.some((debt) => Number(debt.balance) > 0);
  const incomeReady = totalIncome > 0;
  const budgetReady = Array.isArray(state.budgets) && state.budgets.some((budget) => Number(budget.limit) > 0);
  const goalReady = Number(state.goal?.targetAmount) > 0 && Number(state.goal?.months) > 0;

  let step = 1;
  if (assetReady) {
    step = 2;
  }
  if (assetReady && debtReady) {
    step = 3;
  }
  if (assetReady && debtReady && incomeReady) {
    step = 4;
  }
  if (assetReady && debtReady && incomeReady && budgetReady) {
    step = 5;
  }
  if (assetReady && debtReady && incomeReady && budgetReady && goalReady) {
    step = 6;
  }
  if (assetReady && debtReady && incomeReady && budgetReady && goalReady && state.onboarding.seenForecast) {
    step = 7;
  }

  state.onboarding.step = step;
  state.onboarding.completed = assetReady && debtReady && incomeReady && budgetReady && goalReady && state.onboarding.seenForecast && state.onboarding.seenRisk;
}

function renderGuideMessages() {
  const messages = optionalCall("guideEngine", [], () => window.GuideEngine?.getGuideMessages?.(state) || []);
  const mapping = {
    asset: elements.assetGuide,
    debt: elements.debtGuide,
    cashflow: elements.cashflowGuide,
    budget: elements.budgetGuide,
    goal: elements.goalGuide,
  };

  Object.values(mapping).forEach((element) => {
    if (element instanceof HTMLElement) {
      element.hidden = true;
      element.textContent = "";
    }
  });

  messages.forEach((item) => {
    const container = mapping[item.target];
    if (container instanceof HTMLElement) {
      container.hidden = false;
      container.textContent = item.message;
    }
  });
}

function renderQuickActions() {
  if (!(elements.onboardingQuickActions instanceof HTMLElement)) {
    return;
  }

  elements.onboardingQuickActions.innerHTML = QUICK_ACTIONS.map((action) => `
    <button type="button" class="ghost-button small-button" data-quick-target="${action.target}">${action.label}</button>
  `).join("");
}

function renderDecisionChecklist(context = buildRenderContext()) {
  if (!(elements.decisionChecklist instanceof HTMLElement)) {
    return;
  }

  if (!isFeatureEnabled("insights")) {
    elements.decisionChecklist.innerHTML = "";
    return;
  }

  if (state.onboarding.step < 7 && !state.onboarding.completed) {
    elements.decisionChecklist.innerHTML = "";
    return;
  }

  elements.decisionChecklist.innerHTML = context.recommendations.actions.length
    ? context.recommendations.actions.map((action) => `
      <article class="task-item">
        <span></span>
        <div>
          <strong>${action}</strong>
          <p>依目前資料判斷，這是優先處理項目之一。</p>
        </div>
      </article>
    `).join("")
    : `
      <article class="task-item">
        <span></span>
        <div>
          <strong>目前沒有新增建議</strong>
          <p>現金流、負債比與緊急預備金暫無觸發額外規則。</p>
        </div>
      </article>
    `;
}

function renderAutomationInsights(context = buildRenderContext()) {
  if (!isFeatureEnabled("insights") && !isFeatureEnabled("metrics")) {
    [elements.smartSuggestionList, elements.notificationList, elements.educationTipList, elements.autoSavingPlanList].forEach((element) => {
      if (element instanceof HTMLElement) {
        element.innerHTML = "";
      }
    });
    return;
  }

  if (elements.smartSuggestionList instanceof HTMLElement) {
    elements.smartSuggestionList.innerHTML = context.smartSuggestions.map((item) => `
      <article class="task-item">
        <span></span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.body)}</p>
        </div>
      </article>
    `).join("");
  }

  if (elements.notificationList instanceof HTMLElement) {
    elements.notificationList.innerHTML = context.notifications.length
      ? context.notifications.map((item) => `
        <article class="task-item notification-${item.level}">
          <span></span>
          <div>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.body)}</p>
          </div>
        </article>
      `).join("")
      : `
        <article class="task-item">
          <span></span>
          <div>
            <strong>目前沒有提醒</strong>
            <p>帳單、預算與現金餘額暫無觸發提醒。</p>
          </div>
        </article>
      `;
  }

  if (elements.educationTipList instanceof HTMLElement) {
    elements.educationTipList.innerHTML = context.educationTips.map((item) => `
      <article class="task-item">
        <span></span>
        <div>
          <strong>${escapeHtml(item.title)}</strong>
          <p>${escapeHtml(item.body)}</p>
        </div>
      </article>
    `).join("");
  }

  if (elements.autoSavingPlanList instanceof HTMLElement) {
    elements.autoSavingPlanList.innerHTML = context.autoSavingPlan.map((item) => `
      <article class="task-item">
        <span></span>
        <div>
          <strong>${escapeHtml(item.label)}：${formatCurrency(item.amount)}</strong>
          <p>建議配置 ${item.ratio}% 的月淨現金流。</p>
        </div>
      </article>
    `).join("");
  }
}

function renderOnboardingBanner(context = buildRenderContext()) {
  if (!isFeatureEnabled("onboarding")) {
    if (elements.onboardingBanner instanceof HTMLElement) {
      elements.onboardingBanner.hidden = true;
    }
    return;
  }

  if (elements.onboardingBanner instanceof HTMLElement) {
    elements.onboardingBanner.hidden = false;
  }

  updateOnboardingState();
  const currentStep = state.onboarding.completed ? 7 : state.onboarding.step;
  const stepConfig = ONBOARDING_STEPS[currentStep];
  const nextSuggestion = state.onboarding.completed
    ? (context.recommendations.actions[0] ? `下一步建議：${context.recommendations.actions[0]}` : "已完成七步導覽，可持續追蹤風險與策略。")
    : stepConfig.detail;

  if (elements.onboardingStep instanceof HTMLElement) {
    elements.onboardingStep.textContent = state.onboarding.completed ? "Step 7 Completed" : stepConfig.label;
  }

  if (elements.onboardingDetail instanceof HTMLElement) {
    elements.onboardingDetail.textContent = nextSuggestion;
  }

  if (elements.heroNextStep instanceof HTMLElement) {
    elements.heroNextStep.textContent = nextSuggestion;
  }
}

function updateHighlights() {
  if (!isFeatureEnabled("onboarding")) {
    return;
  }

  Object.values(SECTION_TARGETS).forEach((resolver) => {
    const element = resolver?.();
    if (element instanceof HTMLElement) {
      element.classList.remove("highlight");
    }
  });

  if (state.onboarding.completed) {
    SECTION_TARGETS.risk?.()?.classList.add("highlight");
    return;
  }

  getStepTarget(state.onboarding.step)?.classList.add("highlight");
}

function openHelpModal() {
  if (!isFeatureEnabled("onboarding")) {
    return;
  }

  if (elements.helpModal instanceof HTMLElement) {
    elements.helpModal.hidden = false;
    try {
      localStorage.setItem(HELP_STORAGE_KEY, "true");
    } catch (error) {
      console.warn("[FinancePlanner] Onboarding storage unavailable.", error);
    }
  }
}

function closeHelpModal() {
  if (elements.helpModal instanceof HTMLElement) {
    elements.helpModal.hidden = true;
  }
}

function renderBalanceInsights(context = buildRenderContext()) {
  const { balance, investmentTracking, pledge, pledgeStressRows } = context;

  if (elements.liabilityRatio instanceof HTMLElement) {
    elements.liabilityRatio.textContent = formatPercent(balance.liabilityRatio);
  }

  if (elements.liquidAssetRatio instanceof HTMLElement) {
    elements.liquidAssetRatio.textContent = formatPercent(balance.liquidAssetRatio);
  }

  if (elements.leverageRatio instanceof HTMLElement) {
    elements.leverageRatio.textContent = formatMultiple(balance.leverageRatio);
  }

  if (elements.pledgeMaintenanceRatio instanceof HTMLElement) {
    elements.pledgeMaintenanceRatio.textContent = formatPercent(pledge.maintenanceRatio);
  }

  if (elements.pledgeBufferRatio instanceof HTMLElement) {
    elements.pledgeBufferRatio.textContent = formatPercent(pledge.bufferRatio);
  }

  if (elements.pledgeRiskLevel instanceof HTMLElement) {
    elements.pledgeRiskLevel.textContent = pledge.riskLevel;
  }

  if (elements.pledgeRiskNote instanceof HTMLElement) {
    elements.pledgeRiskNote.textContent = pledge.note;
  }

  if (elements.pledgeStressTableBody instanceof HTMLElement) {
    elements.pledgeStressTableBody.innerHTML = pledgeStressRows.map((row) => `
      <tr>
        <td>${row.drawdown}%</td>
        <td>${formatPercent(row.maintenanceRatio)}</td>
        <td><span class="status-pill status-${formatPledgeStatus(row.status)}">${row.status}</span></td>
      </tr>
    `).join("");
  }

  renderComparisonBars(elements.balanceStructureChart, [
    { label: "總資產", value: balance.totalAssets },
    { label: "總負債", value: balance.totalLiabilities },
    { label: "淨值", value: balance.netWorth },
  ]);

  const assetTotals = ASSET_TYPE_OPTIONS.map((option) => ({
    label: option.label,
    value: sumBy(state.assets, (asset) => asset.type === option.value ? asset.amount : 0),
  })).filter((item) => item.value > 0);

  const debtTotals = DEBT_TYPE_OPTIONS.map((option) => ({
    label: option.label,
    value: sumBy(state.debts, (debt) => debt.type === option.value ? debt.balance : 0),
  })).filter((item) => item.value > 0);

  renderComparisonBars(elements.assetCategorySummary, assetTotals.slice(0, 3));
  renderComparisonBars(elements.assetCategoryChart, assetTotals);
  renderComparisonBars(elements.debtCategorySummary, debtTotals.slice(0, 3));
  renderComparisonBars(elements.debtCategoryChart, debtTotals);

  if (elements.investmentMarketValue instanceof HTMLElement) {
    elements.investmentMarketValue.textContent = formatCurrency(investmentTracking.totalMarketValue);
  }

  if (elements.investmentGainLoss instanceof HTMLElement) {
    elements.investmentGainLoss.textContent = formatCurrency(investmentTracking.totalGainLoss);
    elements.investmentGainLoss.className = investmentTracking.totalGainLoss < 0 ? "status-danger" : "status-success";
  }

  if (elements.investmentReturnRate instanceof HTMLElement) {
    elements.investmentReturnRate.textContent = formatPercent(investmentTracking.totalReturnRate);
    elements.investmentReturnRate.className = investmentTracking.totalReturnRate < 0 ? "status-danger" : "status-success";
  }

  renderComparisonBars(elements.investmentAllocationChart, investmentTracking.investments.map((investment) => ({
    label: investment.name,
    value: investment.marketValue,
  })));

  if (elements.investmentTableBody instanceof HTMLElement) {
    elements.investmentTableBody.innerHTML = investmentTracking.investments.map((investment) => `
      <tr>
        <td>${escapeHtml(investment.name)}</td>
        <td>${formatCurrency(investment.marketValue)}</td>
        <td>${formatCurrency(investment.costBasis)}</td>
        <td>${formatPercent(investment.returnRate)}</td>
        <td>${formatPercent(investment.allocation)}</td>
      </tr>
    `).join("");
  }
}

function renderScenarioPanel(context = buildRenderContext()) {
  const { scenarioComparisons, scenarioSnapshot, sensitivity } = context;

  if (elements.scenarioMonthlyNet instanceof HTMLElement) {
    elements.scenarioMonthlyNet.textContent = formatCurrency(scenarioSnapshot.forecast.baseMonthlyNet);
  }

  if (elements.scenarioLowestCash instanceof HTMLElement) {
    elements.scenarioLowestCash.textContent = formatCurrency(scenarioSnapshot.forecast.lowestCash);
  }

  if (elements.scenarioPledgeRatio instanceof HTMLElement) {
    elements.scenarioPledgeRatio.textContent = formatPercent(scenarioSnapshot.pledge.maintenanceRatio);
  }

  if (elements.scenarioStatus instanceof HTMLElement) {
    elements.scenarioStatus.textContent = `目前情境：${scenarioSnapshot.currentStatus}`;
  }

  if (elements.scenarioNote instanceof HTMLElement) {
    elements.scenarioNote.textContent = scenarioSnapshot.forecast.hasGap
      ? "此情境下現金可能破底，建議先調整支出或增加緩衝。"
      : scenarioSnapshot.pledge.bufferRatio <= 15
        ? "此情境下質押緩衝偏低，請留意市值進一步下跌。"
        : "此情境下現金與質押尚可維持，但仍建議持續追蹤。";
  }

  if (elements.scenarioCompareTableBody instanceof HTMLElement) {
    elements.scenarioCompareTableBody.innerHTML = scenarioComparisons.map((plan) => `
      <tr>
        <td>${escapeHtml(plan.name)}</td>
        <td>${formatCurrency(plan.monthlyCashflow)}</td>
        <td>${formatCurrency(plan.finalNetWorth)}</td>
        <td>${formatPercent(plan.estimatedIrr)}</td>
        <td>${plan.hasCashGap ? "有" : "無"}</td>
      </tr>
    `).join("");
  }

  if (elements.sensitivityTableBody instanceof HTMLElement) {
    elements.sensitivityTableBody.innerHTML = sensitivity.map((item, index) => `
      <tr>
        <td>${index + 1}. ${escapeHtml(item.label)}</td>
        <td>${formatCurrency(item.impact)}</td>
        <td>${formatCurrency(item.projectedNetWorth)}</td>
        <td>${escapeHtml(item.note)}</td>
      </tr>
    `).join("");
  }
}

function renderRiskPanel(context = buildRenderContext()) {
  const { risk } = context;

  if (elements.riskLevel instanceof HTMLElement) {
    elements.riskLevel.textContent = risk.level;
  }

  if (elements.riskAction instanceof HTMLElement) {
    elements.riskAction.textContent = risk.primaryAction;
  }

  if (elements.heroRiskHeadline instanceof HTMLElement) {
    elements.heroRiskHeadline.textContent = risk.headline;
  }

  if (elements.heroRiskDetail instanceof HTMLElement) {
    elements.heroRiskDetail.textContent = risk.findings.length
      ? risk.findings.map((item) => item.title).join(" / ")
      : "現金流、負債與質押緩衝目前都在可控範圍。";
  }

  if (elements.heroActionHeadline instanceof HTMLElement) {
    elements.heroActionHeadline.textContent = risk.level === "高" ? "先處理最高風險項" : "維持每月校準";
  }

  if (elements.heroActionDetail instanceof HTMLElement) {
    elements.heroActionDetail.textContent = state.onboarding.step >= 5 && context.recommendations.actions.length
      ? context.recommendations.actions.join(" / ")
      : risk.primaryAction;
  }

  if (elements.heroFocusHeadline instanceof HTMLElement) {
    elements.heroFocusHeadline.textContent = risk.findings[0]?.title || "持續追蹤現金與淨值";
  }

  if (elements.heroFocusDetail instanceof HTMLElement) {
    elements.heroFocusDetail.textContent = `現金緩衝約 ${risk.emergencyMonths.toFixed(1)} 個月，負債比 ${formatPercent(risk.balance.liabilityRatio)}。`;
  }

  if (elements.actionChecklist instanceof HTMLElement) {
    const items = risk.findings.length
      ? risk.findings.map((item) => `<label class="task-item"><input type="checkbox"> <span>${item.action}</span></label>`)
      : ['<div class="empty-state">目前沒有高優先級風險，維持每月更新即可。</div>'];
    elements.actionChecklist.innerHTML = items.join("");
  }
}

const validationErrors = {
  assets: {},
  debts: {},
};

const numericFieldRules = {
  assets: {
    amount: { min: 0, max: 999999999999, decimals: 0, label: "目前金額" },
  },
  debts: {
    balance: { min: 0, max: 999999999999, decimals: 0, label: "目前餘額" },
    rate: { min: 0, max: 100, decimals: 2, label: "年利率" },
    minimumPayment: { min: 0, max: 999999999999, decimals: 0, label: "最低月付" },
    remainingMonths: { min: 0, max: 600, decimals: 0, label: "剩餘期數" },
  },
};

let dragState = { type: "", id: "" };

function formatThousands(value, decimals = 0) {
  const numericValue = Number(value) || 0;
  return new Intl.NumberFormat("zh-TW", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(numericValue);
}

function getNumericFieldDisplayValue(value, category, field) {
  const rules = numericFieldRules[category]?.[field];
  return rules ? formatThousands(value, rules.decimals) : formatNumberInputValue(value);
}

function getFieldError(category, itemId, field) {
  return validationErrors[category]?.[itemId]?.[field] || "";
}

function setFieldError(category, itemId, field, message) {
  validationErrors[category][itemId] = validationErrors[category][itemId] || {};
  if (message) {
    validationErrors[category][itemId][field] = message;
    return;
  }

  delete validationErrors[category][itemId][field];
  if (!Object.keys(validationErrors[category][itemId]).length) {
    delete validationErrors[category][itemId];
  }
}

function sanitizeNumericInput(category, field, rawValue) {
  const rules = numericFieldRules[category]?.[field];
  if (!rules) {
    return { valid: true, value: rawValue, message: "" };
  }

  const normalizedRaw = String(rawValue ?? "").replaceAll(",", "").trim();
  if (!normalizedRaw) {
    return { valid: true, value: 0, message: "" };
  }

  const parsed = Number(normalizedRaw);
  if (!Number.isFinite(parsed)) {
    return { valid: false, value: null, message: `${rules.label}必須為有效數字。` };
  }

  if (parsed < rules.min || parsed > rules.max) {
    return { valid: false, value: null, message: `${rules.label}需介於 ${rules.min} 與 ${rules.max}。` };
  }

  const nextValue = rules.decimals === 0 ? Math.round(parsed) : Number(parsed.toFixed(rules.decimals));
  return { valid: true, value: nextValue, message: "" };
}

function moveItem(items, fromId, toId) {
  const sourceIndex = items.findIndex((item) => item.id == fromId);
  const targetIndex = items.findIndex((item) => item.id == toId);
  if (sourceIndex < 0 || targetIndex < 0 || sourceIndex == targetIndex) {
    return items;
  }

  const nextItems = [...items];
  const [movedItem] = nextItems.splice(sourceIndex, 1);
  nextItems.splice(targetIndex, 0, movedItem);
  return nextItems;
}

function handleDragStart(event, type, itemId) {
  dragState = { type, id: itemId };
  const currentTarget = event.currentTarget;
  if (currentTarget instanceof HTMLElement) {
    currentTarget.classList.add("is-dragging");
  }

  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", itemId);
  }
}

function handleDragEnd(event) {
  dragState = { type: "", id: "" };
  const currentTarget = event.currentTarget;
  if (currentTarget instanceof HTMLElement) {
    currentTarget.classList.remove("is-dragging");
  }

  document.querySelectorAll(".list-card.drag-over").forEach((node) => node.classList.remove("drag-over"));
}

function handleDragOver(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
  const currentTarget = event.currentTarget;
  if (currentTarget instanceof HTMLElement) {
    currentTarget.classList.add("drag-over");
  }
}

function handleDragLeave(event) {
  const currentTarget = event.currentTarget;
  if (currentTarget instanceof HTMLElement) {
    currentTarget.classList.remove("drag-over");
  }
}

function commitListReorder(type, targetId) {
  if (!dragState.type || dragState.type != type || !dragState.id || dragState.id == targetId) {
    return;
  }

  if (type == "asset") {
    state.assets = moveItem(state.assets, dragState.id, targetId);
  } else if (type == "debt") {
    state.debts = moveItem(state.debts, dragState.id, targetId);
  }

  refreshAfterStateChange("events");
  saveState();
}

function handleDrop(event, type, targetId) {
  event.preventDefault();
  const currentTarget = event.currentTarget;
  if (currentTarget instanceof HTMLElement) {
    currentTarget.classList.remove("drag-over");
  }
  commitListReorder(type, targetId);
}

function attachDragHandlers(container, selector, type, datasetKey) {
  container?.querySelectorAll(selector).forEach((card) => {
    if (!(card instanceof HTMLElement)) {
      return;
    }

    const itemId = card.dataset[datasetKey];
    if (!itemId) {
      return;
    }

    card.draggable = true;
    card.addEventListener("dragstart", (event) => handleDragStart(event, type, itemId));
    card.addEventListener("dragend", handleDragEnd);
    card.addEventListener("dragover", handleDragOver);
    card.addEventListener("dragleave", handleDragLeave);
    card.addEventListener("drop", (event) => handleDrop(event, type, itemId));
  });
}

function updateNumericInputPresentation(input, category, field) {
  const rules = numericFieldRules[category]?.[field];
  if (!(input instanceof HTMLInputElement) || !rules) {
    return;
  }

  if (document.activeElement === input) {
    input.value = formatNumberInputValue(input.dataset.rawValue ?? input.value);
  } else {
    input.value = getNumericFieldDisplayValue(input.dataset.rawValue ?? input.value, category, field);
  }
}

function syncNumericInputs(container, category, idKey) {
  container?.querySelectorAll("input[data-field]").forEach((input) => {
    if (!(input instanceof HTMLInputElement)) {
      return;
    }

    const itemId = input.dataset[idKey];
    const field = input.dataset.field;
    if (!itemId || !field || !numericFieldRules[category]?.[field]) {
      return;
    }

    input.dataset.rawValue = formatNumberInputValue(input.dataset.rawValue ?? input.value);
    updateNumericInputPresentation(input, category, field);
  });
}

function bindNumericFormatting(container, category, idKey, updateHandler) {
  container?.addEventListener("focusin", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const field = target.dataset.field;
    if (!field || !numericFieldRules[category]?.[field]) {
      return;
    }

    target.value = formatNumberInputValue(target.dataset.rawValue ?? target.value);
  });

  container?.addEventListener("blur", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }

    const itemId = target.dataset[idKey];
    const field = target.dataset.field;
    if (!itemId || !field || !numericFieldRules[category]?.[field]) {
      return;
    }

    updateHandler(itemId, field, target.value);
  }, true);
}

function bindStorageControls() {
  elements.exportButton?.addEventListener("click", exportState);

  elements.importFile?.addEventListener("change", (event) => {
    const input = event.currentTarget;

    if (!(input instanceof HTMLInputElement) || !input.files || input.files.length === 0) {
      return;
    }

    importStateFromFile(input.files[0]);
    input.value = "";
  });

  elements.resetButton?.addEventListener("click", resetState);
}

function renderAssetList() {
  if (!(elements.assetList instanceof HTMLElement)) {
    return;
  }

  if (!Array.isArray(state.assets) || state.assets.length === 0) {
    elements.assetList.innerHTML = `
      <div class="empty-state">
        目前沒有資產項目。先新增現金、ETF、基金或外幣部位，摘要卡才會開始反映你的資產結構。
      </div>
    `;
    return;
  }

  const assetTypeOptionsMarkup = ASSET_TYPE_OPTIONS.map((option) => `
    <option value="${option.value}">${option.label}</option>
  `).join("");

  elements.assetList.innerHTML = state.assets.map((asset, index) => `
    <article class="list-card" data-asset-id="${asset.id}">
      <div class="list-card-toolbar">
        <div class="list-card-meta">
          <span class="drag-handle" aria-hidden="true">::</span>
          <span class="list-badge">${getAssetTypeLabel(asset.type)}</span>
          <strong>資產 ${index + 1}</strong>
        </div>
        <button type="button" class="ghost-button small-button" data-action="remove-asset" data-asset-id="${asset.id}">刪除</button>
      </div>
      <div class="list-card-grid">
        <label class="field">
          <span>資產名稱</span>
          <small>例如：台幣活存、006208、美元定存、醫療保單。</small>
          <input
            type="text"
            data-field="name"
            data-asset-id="${asset.id}"
            value="${escapeHtml(asset.name)}"
            placeholder="例如：全球股票 ETF"
          >
        </label>
        <label class="field">
          <span>資產類型</span>
          <small>已支援基金、ETF、保單、外幣與加密資產等分類。</small>
          <select data-field="type" data-asset-id="${asset.id}">
            ${assetTypeOptionsMarkup}
          </select>
        </label>
        <label class="field">
          <span>目前金額</span>
          <small>先填你現在願意納入資產負債表的估計值，之後可再細修。</small>
          <input
            type="text"
            inputmode="numeric"
            data-field="amount"
            data-asset-id="${asset.id}"
            data-raw-value="${formatNumberInputValue(asset.amount)}"
            value="${getNumericFieldDisplayValue(asset.amount, "assets", "amount")}"
            placeholder="0"
          >
          <small class="field-error">${escapeHtml(getFieldError("assets", asset.id, "amount"))}</small>
        </label>
        <label class="field field-wide">
          <span>備註</span>
          <small>可記錄帳戶位置、幣別、保單性質或這筆資產的使用限制。</small>
          <input
            type="text"
            data-field="note"
            data-asset-id="${asset.id}"
            value="${escapeHtml(asset.note)}"
            placeholder="例如：美元部位、3 個月內不動用"
          >
        </label>
      </div>
    </article>
  `).join("");

  state.assets.forEach((asset) => {
    const select = elements.assetList.querySelector(`select[data-field="type"][data-asset-id="${asset.id}"]`);
    if (select instanceof HTMLSelectElement) {
      select.value = asset.type;
    }
  });

  attachDragHandlers(elements.assetList, ".list-card[data-asset-id]", "asset", "assetId");
  syncNumericInputs(elements.assetList, "assets", "assetId");
}

function refreshAfterStateChange(section = "") {
  if (section) {
    renderListSection(section);
  }

  renderStaticSection();
  renderCorePanels();
}

function updateAsset(assetId, field, value) {
  const asset = state.assets.find((item) => item.id === assetId);
  if (!asset) {
    return false;
  }

  if (field === "amount") {
    const sanitized = sanitizeNumericInput("assets", field, value);
    setFieldError("assets", assetId, field, sanitized.message);
    if (!sanitized.valid) {
      renderListSection("assets");
      return false;
    }
    asset[field] = sanitized.value;
  } else {
    asset[field] = value;
  }

  refreshAfterStateChange("assets");
  saveState();
  return true;
}

function addAsset() {
  state.assets.push(createDefaultAsset({ type: "fund" }));
  refreshAfterStateChange("assets");
  saveState();
}

function removeAsset(assetId) {
  state.assets = state.assets.filter((asset) => asset.id !== assetId);
  refreshAfterStateChange("assets");
  saveState();
}

function bindAssetControls() {
  elements.addAssetButton?.addEventListener("click", addAsset);

  elements.assetList?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.dataset.assetId || !target.dataset.field) {
      return;
    }

    if (numericFieldRules.assets[target.dataset.field]) {
      target.dataset.rawValue = target.value.replaceAll(",", "");
      return;
    }

    updateAsset(target.dataset.assetId, target.dataset.field, target.value);
  });

  elements.assetList?.addEventListener("change", (event) => {
    const target = event.target;

    if (target instanceof HTMLSelectElement && target.dataset.assetId && target.dataset.field) {
      updateAsset(target.dataset.assetId, target.dataset.field, target.value);
      return;
    }

    if (target instanceof HTMLInputElement && target.dataset.assetId && target.dataset.field) {
      updateAsset(target.dataset.assetId, target.dataset.field, target.value);
    }
  });

  elements.assetList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action === "remove-asset" && target.dataset.assetId) {
      removeAsset(target.dataset.assetId);
    }
  });

  bindNumericFormatting(elements.assetList, "assets", "assetId", updateAsset);
}

function renderDebtList() {
  if (!(elements.debtList instanceof HTMLElement)) {
    return;
  }

  if (!Array.isArray(state.debts) || state.debts.length === 0) {
    elements.debtList.innerHTML = `
      <div class="empty-state">
        目前沒有負債項目。先補上房貸、信貸或信用卡分期，系統之後才有辦法比較還款優先順序。
      </div>
    `;
    return;
  }

  const debtTypeOptionsMarkup = DEBT_TYPE_OPTIONS.map((option) => `
    <option value="${option.value}">${option.label}</option>
  `).join("");

  elements.debtList.innerHTML = state.debts.map((debt, index) => `
    <article class="list-card" data-debt-id="${debt.id}">
      <div class="list-card-toolbar">
        <div class="list-card-meta">
          <span class="drag-handle" aria-hidden="true">::</span>
          <span class="list-badge">${getDebtTypeLabel(debt.type)}</span>
          <strong>負債 ${index + 1}</strong>
        </div>
        <button type="button" class="ghost-button small-button" data-action="remove-debt" data-debt-id="${debt.id}">刪除</button>
      </div>
      <div class="list-card-grid">
        <label class="field">
          <span>負債名稱</span>
          <small>例如：房貸、學貸、車貸、信用卡分期。</small>
          <input
            type="text"
            data-field="name"
            data-debt-id="${debt.id}"
            value="${escapeHtml(debt.name)}"
            placeholder="例如：信用卡分期"
          >
        </label>
        <label class="field">
          <span>負債類型</span>
          <small>已支援信用卡分期、車貸、學貸與股票質押等分類。</small>
          <select data-field="type" data-debt-id="${debt.id}">
            ${debtTypeOptionsMarkup}
          </select>
        </label>
        <label class="field">
          <span>目前餘額</span>
          <small>填尚未清償的本金或目前帳上剩餘負債總額。</small>
          <input
            type="text"
            inputmode="numeric"
            data-field="balance"
            data-debt-id="${debt.id}"
            data-raw-value="${formatNumberInputValue(debt.balance)}"
            value="${getNumericFieldDisplayValue(debt.balance, "debts", "balance")}"
            placeholder="0"
          >
          <small class="field-error">${escapeHtml(getFieldError("debts", debt.id, "balance"))}</small>
        </label>
        <label class="field">
          <span>年利率 (%)</span>
          <small>填名目年利率即可，後續可再接更細的實際 APR 模型。</small>
          <input
            type="text"
            inputmode="decimal"
            data-field="rate"
            data-debt-id="${debt.id}"
            data-raw-value="${formatNumberInputValue(debt.rate)}"
            value="${getNumericFieldDisplayValue(debt.rate, "debts", "rate")}"
            placeholder="0"
          >
          <small class="field-error">${escapeHtml(getFieldError("debts", debt.id, "rate"))}</small>
        </label>
        <label class="field">
          <span>最低月付</span>
          <small>先填每月最低必繳金額，後續還款策略會用這個當基準。</small>
          <input
            type="text"
            inputmode="numeric"
            data-field="minimumPayment"
            data-debt-id="${debt.id}"
            data-raw-value="${formatNumberInputValue(debt.minimumPayment)}"
            value="${getNumericFieldDisplayValue(debt.minimumPayment, "debts", "minimumPayment")}"
            placeholder="0"
          >
          <small class="field-error">${escapeHtml(getFieldError("debts", debt.id, "minimumPayment"))}</small>
        </label>
        <label class="field">
          <span>剩餘期數</span>
          <small>填估計還剩幾個月，若不確定可先填合約剩餘期數。</small>
          <input
            type="text"
            inputmode="numeric"
            data-field="remainingMonths"
            data-debt-id="${debt.id}"
            data-raw-value="${formatNumberInputValue(debt.remainingMonths)}"
            value="${getNumericFieldDisplayValue(debt.remainingMonths, "debts", "remainingMonths")}"
            placeholder="0"
          >
          <small class="field-error">${escapeHtml(getFieldError("debts", debt.id, "remainingMonths"))}</small>
        </label>
        <label class="field field-wide">
          <span>備註</span>
          <small>可記錄寬限期、提前清償限制、是否可轉貸或其他壓力來源。</small>
          <input
            type="text"
            data-field="note"
            data-debt-id="${debt.id}"
            value="${escapeHtml(debt.note)}"
            placeholder="例如：可提前清償但有違約金"
          >
        </label>
      </div>
    </article>
  `).join("");

  state.debts.forEach((debt) => {
    const select = elements.debtList.querySelector(`select[data-field="type"][data-debt-id="${debt.id}"]`);
    if (select instanceof HTMLSelectElement) {
      select.value = debt.type;
    }
  });

  attachDragHandlers(elements.debtList, ".list-card[data-debt-id]", "debt", "debtId");
  syncNumericInputs(elements.debtList, "debts", "debtId");
}

function updateDebt(debtId, field, value) {
  const debt = state.debts.find((item) => item.id === debtId);
  if (!debt) {
    return false;
  }

  if (field === "balance" || field === "rate" || field === "minimumPayment" || field === "remainingMonths") {
    const sanitized = sanitizeNumericInput("debts", field, value);
    setFieldError("debts", debtId, field, sanitized.message);
    if (!sanitized.valid) {
      renderListSection("debts");
      return false;
    }
    debt[field] = sanitized.value;
  } else {
    debt[field] = value;
  }

  refreshAfterStateChange("debts");
  saveState();
  return true;
}

function addDebt() {
  state.debts.push(createDefaultDebt({ type: "credit_installment" }));
  refreshAfterStateChange("debts");
  saveState();
}

function removeDebt(debtId) {
  state.debts = state.debts.filter((debt) => debt.id !== debtId);
  refreshAfterStateChange("debts");
  saveState();
}

function bindDebtControls() {
  elements.addDebtButton?.addEventListener("click", addDebt);

  elements.debtList?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.dataset.debtId || !target.dataset.field) {
      return;
    }

    if (numericFieldRules.debts[target.dataset.field]) {
      target.dataset.rawValue = target.value.replaceAll(",", "");
      return;
    }

    updateDebt(target.dataset.debtId, target.dataset.field, target.value);
  });

  elements.debtList?.addEventListener("change", (event) => {
    const target = event.target;

    if (target instanceof HTMLSelectElement && target.dataset.debtId && target.dataset.field) {
      updateDebt(target.dataset.debtId, target.dataset.field, target.value);
      return;
    }

    if (target instanceof HTMLInputElement && target.dataset.debtId && target.dataset.field) {
      updateDebt(target.dataset.debtId, target.dataset.field, target.value);
    }
  });

  elements.debtList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action === "remove-debt" && target.dataset.debtId) {
      removeDebt(target.dataset.debtId);
    }
  });

  bindNumericFormatting(elements.debtList, "debts", "debtId", updateDebt);
}

function renderEventList() {
  if (!(elements.eventList instanceof HTMLElement)) {
    return;
  }

  if (!Array.isArray(state.events) || state.events.length === 0) {
    elements.eventList.innerHTML = `
      <div class="empty-state">
        目前沒有一次性事件。若你有保費、繳稅、年終或大額支出，建議先補進來。
      </div>
    `;
    return;
  }

  elements.eventList.innerHTML = state.events.map((eventItem, index) => `
    <article class="list-card" data-event-id="${eventItem.id}">
      <div class="list-card-toolbar">
        <div class="list-card-meta">
          <span class="list-badge">${eventItem.type === "income" ? "收入" : "支出"}</span>
          <strong>事件 ${index + 1}</strong>
        </div>
        <button type="button" class="ghost-button small-button" data-action="remove-event" data-event-id="${eventItem.id}">刪除</button>
      </div>
      <div class="list-card-grid">
        <label class="field">
          <span>月份</span>
          <small>輸入 1 到 12，代表事件發生月份。</small>
          <input type="number" min="1" max="12" step="1" data-field="month" data-event-id="${eventItem.id}" value="${formatNumberInputValue(eventItem.month)}">
        </label>
        <label class="field">
          <span>事件類型</span>
          <small>收入會增加現金，支出會降低現金。</small>
          <select data-field="type" data-event-id="${eventItem.id}">
            <option value="expense">支出</option>
            <option value="income">收入</option>
          </select>
        </label>
        <label class="field">
          <span>金額</span>
          <small>輸入正數即可，實際正負會由事件類型決定。</small>
          <input type="number" min="0" step="1" data-field="amount" data-event-id="${eventItem.id}" value="${formatNumberInputValue(Math.abs(Number(eventItem.amount) || 0))}">
        </label>
        <label class="field field-wide">
          <span>事件名稱</span>
          <small>例如：年度綜所稅、年終獎金、保單續期保費。</small>
          <input type="text" data-field="label" data-event-id="${eventItem.id}" value="${escapeHtml(eventItem.label)}" placeholder="例如：年度綜所稅">
        </label>
      </div>
    </article>
  `).join("");

  state.events.forEach((eventItem) => {
    const select = elements.eventList.querySelector(`select[data-field="type"][data-event-id="${eventItem.id}"]`);
    if (select instanceof HTMLSelectElement) {
      select.value = eventItem.type;
    }
  });
}

function addEventItem() {
  state.events.push(createDefaultEvent());
  refreshAfterStateChange("events");
  saveState();
}

function removeEventItem(eventId) {
  state.events = state.events.filter((item) => item.id !== eventId);
  refreshAfterStateChange("events");
  saveState();
}

function updateEventItem(eventId, field, value) {
  const eventItem = state.events.find((item) => item.id === eventId);
  if (!eventItem) {
    return;
  }

  if (field === "month") {
    const parsed = Number(value) || 1;
    eventItem.month = Math.min(12, Math.max(1, parsed));
  } else if (field === "amount") {
    const parsed = Number(value) || 0;
    eventItem.amount = eventItem.type === "income" ? Math.abs(parsed) : -Math.abs(parsed);
  } else if (field === "type") {
    eventItem.type = value === "income" ? "income" : "expense";
    eventItem.amount = eventItem.type === "income"
      ? Math.abs(Number(eventItem.amount) || 0)
      : -Math.abs(Number(eventItem.amount) || 0);
  } else {
    eventItem[field] = value;
  }

  refreshAfterStateChange("events");
  saveState();
}

function bindEventControls() {
  elements.addEventButton?.addEventListener("click", addEventItem);

  elements.eventList?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.dataset.eventId || !target.dataset.field) {
      return;
    }

    updateEventItem(target.dataset.eventId, target.dataset.field, target.value);
  });

  elements.eventList?.addEventListener("change", (event) => {
    const target = event.target;

    if (target instanceof HTMLSelectElement && target.dataset.eventId && target.dataset.field) {
      updateEventItem(target.dataset.eventId, target.dataset.field, target.value);
      return;
    }

    if (target instanceof HTMLInputElement && target.dataset.eventId && target.dataset.field) {
      updateEventItem(target.dataset.eventId, target.dataset.field, target.value);
    }
  });

  elements.eventList?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.dataset.action === "remove-event" && target.dataset.eventId) {
      removeEventItem(target.dataset.eventId);
    }
  });
}

function updateTransaction(transactionId, field, value) {
  const transaction = state.transactions.find((item) => item.id === transactionId);
  if (!transaction) {
    return;
  }

  if (field === "amount") {
    transaction.amount = Math.max(0, Number(value) || 0);
  } else if (field === "type") {
    transaction.type = value === "income" ? "income" : "expense";
    const options = transaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    if (!options.some((option) => option.value === transaction.category)) {
      transaction.category = options[0].value;
    }
  } else {
    transaction[field] = value;
  }

  if (field === "note" || field === "type") {
    const [categorized] = optionalCall("insights", [transaction], () => window.InsightsEngine?.applyAutoCategorization?.([transaction]) || [transaction]);
    transaction.category = categorized.category;
  }

  renderTransactionList();
  renderCorePanels();
  saveState();
}

function addTransaction() {
  state.transactions.push(createDefaultTransaction({ month: state.incomeExpense?.month || new Date().toISOString().slice(0, 7) }));
  renderTransactionList();
  renderCorePanels();
  saveState();
}

function removeTransaction(transactionId) {
  state.transactions = state.transactions.filter((transaction) => transaction.id !== transactionId);
  renderTransactionList();
  renderCorePanels();
  saveState();
}

function bindTransactionControls() {
  elements.addTransactionButton?.addEventListener("click", addTransaction);

  elements.incomeExpenseMonth?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      state.incomeExpense = { ...(state.incomeExpense || {}), month: target.value };
      renderCorePanels();
      saveState();
    }
  });

  elements.transactionList?.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || !target.dataset.transactionId || !target.dataset.field) {
      return;
    }

    updateTransaction(target.dataset.transactionId, target.dataset.field, target.value);
  });

  elements.transactionList?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement) || !target.dataset.transactionId || !target.dataset.field) {
      return;
    }

    updateTransaction(target.dataset.transactionId, target.dataset.field, target.value);
  });

  elements.transactionList?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.action === "remove-transaction" && target.dataset.transactionId) {
      removeTransaction(target.dataset.transactionId);
    }
  });
}

function updateBudget(budgetId, field, value) {
  const budget = state.budgets.find((item) => item.id === budgetId);
  if (!budget) {
    return;
  }

  budget[field] = field === "limit" ? Math.max(0, Number(value) || 0) : value;
  renderBudgetList();
  renderCorePanels();
  saveState();
}

function addBudget() {
  state.budgets.push(createDefaultBudget());
  renderBudgetList();
  renderCorePanels();
  saveState();
}

function removeBudget(budgetId) {
  state.budgets = state.budgets.filter((budget) => budget.id !== budgetId);
  renderBudgetList();
  renderCorePanels();
  saveState();
}

function bindBudgetControls() {
  elements.addBudgetButton?.addEventListener("click", addBudget);

  elements.budgetList?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.dataset.budgetId && target.dataset.field) {
      updateBudget(target.dataset.budgetId, target.dataset.field, target.value);
    }
  });

  elements.budgetList?.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLSelectElement && target.dataset.budgetId && target.dataset.field) {
      updateBudget(target.dataset.budgetId, target.dataset.field, target.value);
    }
  });

  elements.budgetList?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.action === "remove-budget" && target.dataset.budgetId) {
      removeBudget(target.dataset.budgetId);
    }
  });
}

function bindGoalControls() {
  [
    [elements.goalName, "name"],
    [elements.goalTargetAmount, "targetAmount"],
    [elements.goalCurrentAmount, "currentAmount"],
    [elements.goalMonths, "months"],
  ].forEach(([element, field]) => {
    element?.addEventListener("input", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      state.goal[field] = field === "name" ? target.value : Number(target.value) || 0;
      renderCorePanels();
      saveState();
    });
  });
}

function applyTemplate(templateName) {
  if (templateName === "investor") {
    state.cashflow.salaryIncome = 120000;
    state.cashflow.monthlyExpense = 52000;
    state.goal.name = "投資資產配置";
    state.goal.targetAmount = 2000000;
    state.goal.months = 36;
    state.fire.withdrawalRate = 4;
  } else if (templateName === "conservative") {
    state.cashflow.salaryIncome = 85000;
    state.cashflow.monthlyExpense = 36000;
    state.goal.name = "緊急預備金";
    state.goal.targetAmount = 720000;
    state.goal.months = 24;
    state.fire.withdrawalRate = 3.5;
  } else {
    state.cashflow.salaryIncome = 60000;
    state.cashflow.monthlyExpense = 30000;
    state.goal.name = "第一桶緊急預備金";
    state.goal.targetAmount = 300000;
    state.goal.months = 18;
    state.fire.withdrawalRate = 4;
  }

  renderStaticSection();
  renderCorePanels();
  saveState();
}

function bindTemplateControls() {
  elements.templateButtons?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.template) {
      applyTemplate(target.dataset.template);
    }
  });
}

function updateNestedState(section, field, value) {
  if (!state[section]) {
    return;
  }

  state[section][field] = value;
  renderStaticSection();
  renderCorePanels();
  saveState();
}

function bindStaticFieldControls() {
  elements.inputPledgeMarketValue?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("pledge", "marketValue", Number(target.value) || 0);
    }
  });

  elements.inputPledgeWarningRatio?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("pledge", "warningRatio", Number(target.value) || 0);
    }
  });

  elements.inputSalaryIncome?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("cashflow", "salaryIncome", Number(target.value) || 0);
    }
  });

  elements.inputPassiveIncome?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("cashflow", "passiveIncome", Number(target.value) || 0);
    }
  });

  elements.inputMonthlyExpense?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("cashflow", "monthlyExpense", Number(target.value) || 0);
    }
  });

  elements.inputDebtPayment?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("cashflow", "debtPayment", Number(target.value) || 0);
    }
  });

  elements.inputStartingCash?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("cashflow", "startingCash", Number(target.value) || 0);
    }
  });

  elements.inputEventNote?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("cashflow", "eventNote", target.value);
    }
  });

  elements.inputExtraBudget?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("repayment", "extraBudget", Number(target.value) || 0);
    }
  });

  elements.inputStrategy?.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLSelectElement) {
      updateNestedState("repayment", "strategy", target.value);
    }
  });

  elements.inputPlanNote?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLTextAreaElement) {
      updateNestedState("repayment", "planNote", target.value);
    }
  });

  elements.inputLoanInvestmentReturn?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("loanAnalysis", "investmentReturn", Number(target.value) || 0);
    }
  });

  elements.inputFireWithdrawalRate?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("fire", "withdrawalRate", Number(target.value) || 4);
    }
  });

  elements.inputScenarioIncomeChange?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("scenario", "incomeChange", Number(target.value) || 0);
    }
  });

  elements.inputScenarioMarketChange?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("scenario", "marketChange", Number(target.value) || 0);
    }
  });

  elements.inputScenarioExtraPaydown?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("scenario", "extraPaydown", Number(target.value) || 0);
    }
  });

  elements.inputScenarioHorizon?.addEventListener("input", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement) {
      updateNestedState("scenario", "horizon", Number(target.value) || 0);
    }
  });

  elements.scenarioQuickButtons?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const preset = target.dataset.scenarioPreset;
    if (!preset) {
      return;
    }

    if (preset === "income--10") {
      state.scenario.incomeChange = -10;
    } else if (preset === "income--20") {
      state.scenario.incomeChange = -20;
    } else if (preset === "market--15") {
      state.scenario.marketChange = -15;
    } else if (preset === "market--30") {
      state.scenario.marketChange = -30;
    }

    renderStaticSection();
    renderCorePanels();
    saveState();
  });

}

function bindHelpControls() {
  if (!isFeatureEnabled("onboarding")) {
    return;
  }

  elements.helpButton?.addEventListener("click", openHelpModal);
  elements.helpModalClose?.addEventListener("click", closeHelpModal);
  elements.helpModalDismiss?.addEventListener("click", closeHelpModal);
  elements.helpModal?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.helpClose === "true") {
      closeHelpModal();
    }
  });

  let hasSeenHelp = true;
  try {
    hasSeenHelp = Boolean(localStorage.getItem(HELP_STORAGE_KEY));
  } catch (error) {
    hasSeenHelp = true;
  }

  if (!hasSeenHelp) {
    openHelpModal();
  }
}

function bindQuickActionControls() {
  elements.onboardingQuickActions?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    const sectionKey = target.dataset.quickTarget;
    if (sectionKey) {
      scrollToSection(sectionKey);
    }
  });
}

function bindOnboardingObservers() {
  const observer = new IntersectionObserver((entries) => {
    let changed = false;

    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        return;
      }

      if (entry.target === elements.forecastSection && !state.onboarding.seenForecast) {
        state.onboarding.seenForecast = true;
        changed = true;
      }

      if (entry.target === elements.riskSection && !state.onboarding.seenRisk) {
        state.onboarding.seenRisk = true;
        changed = true;
      }
    });

    if (changed) {
      renderCorePanels();
      saveState();
    }
  }, { threshold: 0.45 });

  [elements.forecastSection, elements.riskSection].forEach((element) => {
    if (element instanceof HTMLElement) {
      observer.observe(element);
    }
  });
}

function renderStaticFields() {
  if (elements.inputPledgeMarketValue instanceof HTMLInputElement) {
    elements.inputPledgeMarketValue.value = formatNumberInputValue(state.pledge.marketValue);
  }

  if (elements.inputPledgeWarningRatio instanceof HTMLInputElement) {
    elements.inputPledgeWarningRatio.value = formatNumberInputValue(state.pledge.warningRatio);
  }

  if (elements.inputSalaryIncome instanceof HTMLInputElement) {
    elements.inputSalaryIncome.value = formatNumberInputValue(state.cashflow.salaryIncome);
  }

  if (elements.inputPassiveIncome instanceof HTMLInputElement) {
    elements.inputPassiveIncome.value = formatNumberInputValue(state.cashflow.passiveIncome);
  }

  if (elements.inputMonthlyExpense instanceof HTMLInputElement) {
    elements.inputMonthlyExpense.value = formatNumberInputValue(state.cashflow.monthlyExpense);
  }

  if (elements.inputDebtPayment instanceof HTMLInputElement) {
    elements.inputDebtPayment.value = formatNumberInputValue(state.cashflow.debtPayment);
  }

  if (elements.inputStartingCash instanceof HTMLInputElement) {
    elements.inputStartingCash.value = formatNumberInputValue(state.cashflow.startingCash);
  }

  if (elements.inputEventNote instanceof HTMLInputElement) {
    elements.inputEventNote.value = state.cashflow.eventNote || "";
  }

  if (elements.inputExtraBudget instanceof HTMLInputElement) {
    elements.inputExtraBudget.value = formatNumberInputValue(state.repayment.extraBudget);
  }

  if (elements.inputStrategy instanceof HTMLSelectElement) {
    elements.inputStrategy.value = state.repayment.strategy;
  }

  if (elements.inputPlanNote instanceof HTMLTextAreaElement) {
    elements.inputPlanNote.value = state.repayment.planNote || "";
  }

  if (elements.inputScenarioIncomeChange instanceof HTMLInputElement) {
    elements.inputScenarioIncomeChange.value = formatNumberInputValue(state.scenario.incomeChange);
  }

  if (elements.inputScenarioMarketChange instanceof HTMLInputElement) {
    elements.inputScenarioMarketChange.value = formatNumberInputValue(state.scenario.marketChange);
  }

  if (elements.inputScenarioExtraPaydown instanceof HTMLInputElement) {
    elements.inputScenarioExtraPaydown.value = formatNumberInputValue(state.scenario.extraPaydown);
  }

  if (elements.inputScenarioHorizon instanceof HTMLInputElement) {
    elements.inputScenarioHorizon.value = formatNumberInputValue(state.scenario.horizon);
  }

  if (elements.inputHighestRateDebt instanceof HTMLInputElement) {
    const highestRateDebt = [...state.debts].sort((left, right) => (right.rate || 0) - (left.rate || 0))[0];
    elements.inputHighestRateDebt.value = highestRateDebt?.name || "";
  }

  if (elements.inputSmallestBalanceDebt instanceof HTMLInputElement) {
    const smallestBalanceDebt = [...state.debts]
      .filter((debt) => Number(debt.balance) > 0)
      .sort((left, right) => (left.balance || 0) - (right.balance || 0))[0];
    elements.inputSmallestBalanceDebt.value = smallestBalanceDebt?.name || "";
  }

}

function buildValidationItems(context = buildRenderContext()) {
  const { risk } = context;
  const items = [];

  if (!state.assets.length) {
    items.push({ title: "尚未建立資產", body: "至少新增一筆現金、基金或 ETF，摘要卡才有實際參考價值。" });
  }

  if (!state.debts.length) {
    items.push({ title: "尚未建立負債", body: "若你有房貸、信貸或卡分期，建議補進來再看淨值與還款規劃。" });
  }

  if (state.assets.some((asset) => !asset.name.trim())) {
    items.push({ title: "有資產尚未命名", body: "建議替每筆資產填上可辨識名稱，避免後續排序或匯出時難以判讀。" });
  }

  if (state.debts.some((debt) => !debt.name.trim())) {
    items.push({ title: "有負債尚未命名", body: "建議替每筆負債填上名稱，之後比較雪球法與雪崩法才容易辨識。" });
  }

  if (state.debts.some((debt) => Number(debt.balance) > 0 && Number(debt.minimumPayment) <= 0)) {
    items.push({ title: "有負債缺少最低月付", body: "最低月付會影響每月現金流與還款試算，建議盡快補齊。" });
  }

  if ((Number(state.cashflow.salaryIncome) || 0) + (Number(state.cashflow.passiveIncome) || 0) <= 0) {
    items.push({ title: "尚未填寫收入", body: "若沒有收入資料，月自由現金流與壓力測試都會失真。" });
  }

  if ((Number(state.cashflow.startingCash) || 0) <= 0) {
    items.push({ title: "期初現金為 0", body: "若你有活存或可立即動用資金，建議填入，才能更合理評估現金缺口。" });
  }

  if ((Number(state.pledge.marketValue) || 0) > 0 && (Number(state.pledge.warningRatio) || 0) <= 0) {
    items.push({ title: "質押警戒維持率未設定", body: "若你有股票質押部位，請補上警戒維持率，否則無法評估風險緩衝。" });
  }

  if (context.budget.overBudgetCount > 0) {
    items.push({ title: "本月預算已超支", body: `目前有 ${context.budget.overBudgetCount} 個分類超過預算上限，建議先檢查支出分類。` });
  }

  if (context.goal.remainingAmount > 0 && !context.goal.isReachable) {
    items.push({ title: "財務目標每月投入不足", body: `依目前月自由現金流，每月仍缺 ${formatCurrency(context.goal.fundingGap)} 才能準時達標。` });
  }

  risk.findings.forEach((finding) => {
    items.push({ title: `風險規則：${finding.title}`, body: finding.action });
  });

  return items;
}

function renderValidationList(context = buildRenderContext()) {
  if (!(elements.validationList instanceof HTMLElement)) {
    return;
  }

  const items = buildValidationItems(context);

  if (elements.validationSummary instanceof HTMLElement) {
    elements.validationSummary.textContent = `集中檢查完成：${context.risk.level}風險，共 ${items.length} 項提醒。`;
  }

  if (items.length === 0) {
    elements.validationList.innerHTML = `
      <div class="validation-item">
        <strong>目前資料完整度可用</strong>
        <p>核心欄位已具備基本判讀條件，可以繼續進行現金流、還款與情境分析。</p>
      </div>
    `;
    return;
  }

  elements.validationList.innerHTML = items.map((item) => `
    <article class="validation-item">
      <strong>${item.title}</strong>
      <p>${item.body}</p>
    </article>
  `).join("");
}

function renderNetWorthDashboard(context = buildRenderContext()) {
  const dashboard = context.netWorthDashboard;

  if (elements.netWorthDashboardAssets instanceof HTMLElement) {
    elements.netWorthDashboardAssets.textContent = formatCurrency(dashboard.totalAssets);
  }

  if (elements.netWorthDashboardLiabilities instanceof HTMLElement) {
    elements.netWorthDashboardLiabilities.textContent = formatCurrency(dashboard.totalLiabilities);
  }

  if (elements.netWorthDashboardCashflow instanceof HTMLElement) {
    elements.netWorthDashboardCashflow.textContent = formatCurrency(dashboard.monthlyNetCashflow);
  }

  if (elements.netWorthDashboardCoverage instanceof HTMLElement) {
    elements.netWorthDashboardCoverage.textContent = `${dashboard.cashCoverageMonths.toFixed(1)} 月`;
  }
}

function renderIncomeExpenseTracker(context = buildRenderContext()) {
  const overview = context.incomeExpense;

  if (elements.incomeExpenseMonth instanceof HTMLInputElement) {
    elements.incomeExpenseMonth.value = context.selectedMonth;
  }

  if (elements.incomeExpenseIncome instanceof HTMLElement) {
    elements.incomeExpenseIncome.textContent = formatCurrency(overview.totalIncome);
  }

  if (elements.incomeExpenseExpense instanceof HTMLElement) {
    elements.incomeExpenseExpense.textContent = formatCurrency(overview.totalExpense);
  }

  if (elements.incomeExpenseNetFlow instanceof HTMLElement) {
    elements.incomeExpenseNetFlow.textContent = formatCurrency(overview.netFlow);
    elements.incomeExpenseNetFlow.className = overview.netFlow < 0 ? "status-danger" : "status-success";
  }

  renderComparisonBars(elements.expenseCategoryChart, overview.expenseByCategory);
  renderComparisonBars(
    elements.incomeExpenseTrendChart,
    overview.monthlyTrend.map((row) => ({ label: row.month, value: row.netFlow })),
  );
}

function renderTransactionList() {
  if (!(elements.transactionList instanceof HTMLElement)) {
    return;
  }

  if (!Array.isArray(state.transactions) || state.transactions.length === 0) {
    elements.transactionList.innerHTML = `<div class="empty-state">目前沒有收支明細。</div>`;
    return;
  }

  elements.transactionList.innerHTML = state.transactions.map((transaction, index) => {
    const options = transaction.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    const categoryOptions = options.map((option) => `
      <option value="${option.value}" ${option.value === transaction.category ? "selected" : ""}>${option.label}</option>
    `).join("");

    return `
      <article class="list-card" data-transaction-id="${transaction.id}">
        <div class="list-card-toolbar">
          <div class="list-card-meta">
            <span class="list-badge">${transaction.type === "income" ? "收入" : "支出"}</span>
            <strong>收支 ${index + 1}</strong>
          </div>
          <button type="button" class="ghost-button small-button" data-action="remove-transaction" data-transaction-id="${transaction.id}">刪除</button>
        </div>
        <div class="list-card-grid">
          <label class="field">
            <span>月份</span>
            <small>用於每月統計與趨勢分析。</small>
            <input type="month" data-field="month" data-transaction-id="${transaction.id}" value="${escapeHtml(transaction.month)}">
          </label>
          <label class="field">
            <span>類型</span>
            <small>收入會增加結餘，支出會降低結餘。</small>
            <select data-field="type" data-transaction-id="${transaction.id}">
              <option value="expense" ${transaction.type === "expense" ? "selected" : ""}>支出</option>
              <option value="income" ${transaction.type === "income" ? "selected" : ""}>收入</option>
            </select>
          </label>
          <label class="field">
            <span>分類</span>
            <small>支出分析以分類為核心。</small>
            <select data-field="category" data-transaction-id="${transaction.id}">${categoryOptions}</select>
          </label>
          <label class="field">
            <span>金額</span>
            <small>請輸入正數。</small>
            <input type="number" min="0" step="1" data-field="amount" data-transaction-id="${transaction.id}" value="${formatNumberInputValue(transaction.amount)}">
          </label>
          <label class="field field-wide">
            <span>備註</span>
            <small>${getCategoryLabel(transaction.type, transaction.category)}</small>
            <input type="text" data-field="note" data-transaction-id="${transaction.id}" value="${escapeHtml(transaction.note)}" placeholder="例如：午餐、房租、薪資">
          </label>
        </div>
      </article>
    `;
  }).join("");
}

function renderBudgetPanel(context = buildRenderContext()) {
  const budget = context.budget;

  if (elements.budgetLimitTotal instanceof HTMLElement) {
    elements.budgetLimitTotal.textContent = formatCurrency(budget.totalLimit);
  }

  if (elements.budgetSpentTotal instanceof HTMLElement) {
    elements.budgetSpentTotal.textContent = formatCurrency(budget.totalSpent);
  }

  if (elements.budgetRemainingTotal instanceof HTMLElement) {
    elements.budgetRemainingTotal.textContent = formatCurrency(budget.totalRemaining);
    elements.budgetRemainingTotal.className = budget.totalRemaining < 0 ? "status-danger" : "status-success";
  }

  if (elements.budgetOverAlert instanceof HTMLElement) {
    elements.budgetOverAlert.textContent = `${budget.overBudgetCount} 類`;
    elements.budgetOverAlert.className = budget.overBudgetCount > 0 ? "status-danger" : "status-success";
  }
}

function renderBudgetList(context = buildRenderContext()) {
  if (!(elements.budgetList instanceof HTMLElement)) {
    return;
  }

  if (!Array.isArray(state.budgets) || state.budgets.length === 0) {
    elements.budgetList.innerHTML = `<div class="empty-state">目前沒有分類預算。</div>`;
    return;
  }

  const rowsById = new Map(context.budget.categoryBudgets.map((budget) => [budget.id, budget]));
  elements.budgetList.innerHTML = state.budgets.map((budgetItem, index) => {
    const row = rowsById.get(budgetItem.id) || budgetItem;
    const categoryOptions = EXPENSE_CATEGORIES.map((option) => `
      <option value="${option.value}" ${option.value === budgetItem.category ? "selected" : ""}>${option.label}</option>
    `).join("");

    return `
      <article class="list-card" data-budget-id="${budgetItem.id}">
        <div class="list-card-toolbar">
          <div class="list-card-meta">
            <span class="list-badge">${row.isOverBudget ? "超支" : "預算"}</span>
            <strong>預算 ${index + 1}</strong>
          </div>
          <button type="button" class="ghost-button small-button" data-action="remove-budget" data-budget-id="${budgetItem.id}">刪除</button>
        </div>
        <div class="list-card-grid">
          <label class="field">
            <span>支出分類</span>
            <small>只套用支出類別。</small>
            <select data-field="category" data-budget-id="${budgetItem.id}">${categoryOptions}</select>
          </label>
          <label class="field">
            <span>每月上限</span>
            <small>本月花費 ${formatCurrency(row.spent || 0)}，剩餘 ${formatCurrency(row.remaining || 0)}。</small>
            <input type="number" min="0" step="1" data-field="limit" data-budget-id="${budgetItem.id}" value="${formatNumberInputValue(budgetItem.limit)}">
          </label>
          <label class="field field-wide">
            <span>使用率</span>
            <small>${(row.usageRatio || 0).toFixed(1)}%</small>
            <progress class="${row.isOverBudget ? "budget-progress over-budget" : "budget-progress"}" max="100" value="${Math.min(100, row.usageRatio || 0)}"></progress>
          </label>
        </div>
      </article>
    `;
  }).join("");
}

function renderGoalPanel(context = buildRenderContext()) {
  const goal = context.goal;
  const firePlan = context.firePlan;

  if (elements.goalName instanceof HTMLInputElement) {
    elements.goalName.value = state.goal.name || "";
  }

  if (elements.goalTargetAmount instanceof HTMLInputElement) {
    elements.goalTargetAmount.value = formatNumberInputValue(state.goal.targetAmount);
  }

  if (elements.goalCurrentAmount instanceof HTMLInputElement) {
    elements.goalCurrentAmount.value = formatNumberInputValue(state.goal.currentAmount);
  }

  if (elements.goalMonths instanceof HTMLInputElement) {
    elements.goalMonths.value = formatNumberInputValue(state.goal.months);
  }

  if (elements.goalRequiredMonthly instanceof HTMLElement) {
    elements.goalRequiredMonthly.textContent = formatCurrency(goal.requiredMonthlyContribution);
  }

  if (elements.goalProgress instanceof HTMLElement) {
    elements.goalProgress.textContent = formatPercent(goal.progressRatio);
  }

  if (elements.goalFundingGap instanceof HTMLElement) {
    elements.goalFundingGap.textContent = formatCurrency(goal.fundingGap);
    elements.goalFundingGap.className = goal.fundingGap > 0 ? "status-danger" : "status-success";
  }

  if (elements.goalStatus instanceof HTMLElement) {
    elements.goalStatus.textContent = goal.remainingAmount <= 0 ? "已達成" : goal.isReachable ? "可達成" : "需調整";
    elements.goalStatus.className = goal.isReachable ? "status-success" : "status-danger";
  }

  if (elements.inputFireWithdrawalRate instanceof HTMLInputElement) {
    elements.inputFireWithdrawalRate.value = formatNumberInputValue(state.fire.withdrawalRate);
  }

  if (elements.fireTargetPortfolio instanceof HTMLElement) {
    elements.fireTargetPortfolio.textContent = formatCurrency(firePlan.targetPortfolio);
  }

  if (elements.fireProgress instanceof HTMLElement) {
    elements.fireProgress.textContent = formatPercent(firePlan.progressRatio);
  }

  if (elements.fireMonths instanceof HTMLElement) {
    elements.fireMonths.textContent = firePlan.monthsToFire > 0 ? `${firePlan.monthsToFire} 個月` : "需正現金流";
  }
}

function renderCashflowForecast(context = buildRenderContext()) {
  const forecast = context.cashflowForecast;
  const netWorthRows = context.netWorthForecast;
  const firstDeficitRow = forecast.rows.find((row) => row.endingCash < 0);

  if (elements.monthlyNetFlow instanceof HTMLElement) {
    elements.monthlyNetFlow.textContent = formatCurrency(forecast.baseMonthlyNet);
  }

  if (elements.lowestCashBalance instanceof HTMLElement) {
    elements.lowestCashBalance.textContent = formatCurrency(forecast.lowestCash);
  }

  if (elements.cashGapFlag instanceof HTMLElement) {
    elements.cashGapFlag.textContent = forecast.hasGap ? "是" : "否";
    elements.cashGapFlag.className = forecast.hasGap ? "status-danger" : "status-success";
  }

  if (elements.forecastDeficitMonth instanceof HTMLElement) {
    elements.forecastDeficitMonth.textContent = firstDeficitRow ? `${firstDeficitRow.month} 月` : "-";
    elements.forecastDeficitMonth.className = firstDeficitRow ? "status-danger" : "status-success";
  }

  if (elements.forecastDeficitAmount instanceof HTMLElement) {
    elements.forecastDeficitAmount.textContent = formatCurrency(Math.abs(Math.min(0, forecast.lowestCash)));
    elements.forecastDeficitAmount.className = forecast.lowestCash < 0 ? "status-danger" : "status-success";
  }

  if (elements.forecastTableBody instanceof HTMLElement) {
    elements.forecastTableBody.innerHTML = forecast.rows.map((row, index) => `
      <tr>
        <td>${row.month} 月</td>
        <td>${formatCurrency(row.netFlow)}</td>
        <td>${formatCurrency(row.endingCash)}</td>
        <td>${formatCurrency(netWorthRows[index]?.netWorth || 0)}</td>
      </tr>
    `).join("");
  }

  renderSparkChart(elements.cashflowChart, forecast.rows, "endingCash");
  renderSparkChart(elements.netWorthChart, netWorthRows, "netWorth");
}

function buildRepaymentResult(strategy) {
  const orderedDebts = getDebtSortOrder(state, strategy)
    .filter((debt) => Number(debt.balance) > 0)
    .map((debt) => ({
      ...debt,
      name: debt.name || getDebtTypeLabel(debt.type),
      balance: Number(debt.balance) || 0,
      rate: Number(debt.rate) || 0,
      minimumPayment: Math.max(0, Number(debt.minimumPayment) || 0),
      remainingMonths: Math.max(1, Number(debt.remainingMonths) || 0),
    }));

  if (orderedDebts.length === 0) {
    return {
      strategy,
      months: 0,
      interest: 0,
      order: [],
      schedule: [],
    };
  }

  const result = generateAmortizationSchedule(orderedDebts, state.repayment.extraBudget);

  return {
    strategy,
    months: result.months,
    interest: result.totalInterest,
    order: orderedDebts.map((debt) => debt.name),
    schedule: result.schedule,
  };
}


function buildDebtScheduleMap(schedule) {
  const debtScheduleMap = new Map();

  schedule.forEach((monthItem) => {
    monthItem.entries.forEach((entry) => {
      const rows = debtScheduleMap.get(entry.debtId) || [];
      rows.push({
        month: monthItem.month,
        principal: entry.principalPaid,
        interest: entry.interest,
        endingBalance: entry.endingBalance,
      });
      debtScheduleMap.set(entry.debtId, rows);
    });
  });

  return debtScheduleMap;
}

function renderRepaymentSchedules(result) {
  if (!(elements.repaymentScheduleList instanceof HTMLElement)) {
    return;
  }

  const debtScheduleMap = buildDebtScheduleMap(result.schedule);
  const activeDebts = getDebtSortOrder(state, result.strategy)
    .filter((debt) => Number(debt.balance) > 0)
    .map((debt) => ({
      id: debt.id,
      name: debt.name || getDebtTypeLabel(debt.type),
      rate: Number(debt.rate) || 0,
      balance: Number(debt.balance) || 0,
    }));

  if (!activeDebts.length) {
    elements.repaymentScheduleList.innerHTML = `
      <div class="empty-state">
        目前沒有可展開的攤還明細。先補上負債餘額後，這裡才會顯示每月本金與利息。
      </div>
    `;
    return;
  }

  elements.repaymentScheduleList.innerHTML = activeDebts.map((debt, index) => {
    const rows = debtScheduleMap.get(debt.id) || [];
    const scheduleRows = rows.map((row) => `
      <tr>
        <td>${row.month}</td>
        <td>${formatCurrency(row.principal)}</td>
        <td>${formatCurrency(row.interest)}</td>
        <td>${formatCurrency(row.endingBalance)}</td>
      </tr>
    `).join("");

    return `
      <details class="repayment-detail" ${index === 0 ? "open" : ""}>
        <summary class="repayment-detail-summary">
          <div>
            <strong>${escapeHtml(debt.name)}</strong>
            <span>年利率 ${debt.rate}% · 目前餘額 ${formatCurrency(debt.balance)}</span>
          </div>
          <span>${rows.length} 期</span>
        </summary>
        <div class="forecast-table-wrap repayment-schedule-wrap">
          <table class="forecast-table repayment-schedule-table">
            <thead>
              <tr>
                <th>月份</th>
                <th>本金</th>
                <th>利息</th>
                <th>剩餘餘額</th>
              </tr>
            </thead>
            <tbody>
              ${scheduleRows}
            </tbody>
          </table>
        </div>
      </details>
    `;
  }).join("");
}

function renderRepaymentPlan() {
  const snowball = buildRepaymentResult("snowball");
  const avalanche = buildRepaymentResult("avalanche");
  const selectedStrategy = state.repayment.strategy === "avalanche" ? "avalanche" : "snowball";
  const selectedResult = selectedStrategy === "avalanche" ? avalanche : snowball;
  const recommended = avalanche.interest < snowball.interest ? avalanche : snowball;

  if (elements.recommendedStrategy instanceof HTMLElement) {
    elements.recommendedStrategy.textContent = recommended.strategy === "avalanche" ? "雪崩法" : "雪球法";
  }

  if (elements.payoffMonths instanceof HTMLElement) {
    elements.payoffMonths.textContent = `${selectedResult.months} 個月`;
  }

  if (elements.payoffInterest instanceof HTMLElement) {
    elements.payoffInterest.textContent = formatCurrency(selectedResult.interest);
  }

  if (elements.repaymentTableBody instanceof HTMLElement) {
    const rows = [snowball, avalanche];
    elements.repaymentTableBody.innerHTML = rows.map((result) => `
      <tr>
        <td>${result.strategy === "avalanche" ? "雪崩法" : "雪球法"}</td>
        <td>${result.months} 個月</td>
        <td>${formatCurrency(result.interest)}</td>
        <td>${result.order.length ? result.order.join(" → ") : "-"}</td>
      </tr>
    `).join("");
  }

  renderRepaymentSchedules(selectedResult);

  if (elements.strategyNote instanceof HTMLElement) {
    if (!state.debts.some((debt) => Number(debt.balance) > 0)) {
      elements.strategyNote.textContent = "目前沒有可試算的負債餘額，先新增負債或補上餘額後再比較策略。";
    } else if (snowball.interest === avalanche.interest) {
      elements.strategyNote.textContent = "兩種策略在目前資料下差異不大，可依心理壓力與現金流偏好決定。";
    } else if (recommended.strategy === "avalanche") {
      elements.strategyNote.textContent = "雪崩法預估總利息較低，適合想先壓低利息成本的人。";
    } else {
      elements.strategyNote.textContent = "雪球法預估可較快清掉小額負債，適合優先降低帳戶數與心理壓力。";
    }
  }

  renderLoanAnalysis(buildRenderContext({ includeEnhancements: false }));
}

function renderLoanAnalysis(context = buildRenderContext()) {
  const loanAnalysis = context.loanAnalysis;

  if (elements.inputLoanInvestmentReturn instanceof HTMLInputElement) {
    elements.inputLoanInvestmentReturn.value = formatNumberInputValue(state.loanAnalysis.investmentReturn);
  }

  if (elements.loanTotalBalance instanceof HTMLElement) {
    elements.loanTotalBalance.textContent = formatCurrency(loanAnalysis.totalBalance);
  }

  if (elements.loanRateShockPayment instanceof HTMLElement) {
    elements.loanRateShockPayment.textContent = formatCurrency(loanAnalysis.totalRateShockPayment);
  }

  if (elements.loanComparisonTableBody instanceof HTMLElement) {
    elements.loanComparisonTableBody.innerHTML = loanAnalysis.rows.map((row) => `
      <tr>
        <td>${escapeHtml(row.name)}</td>
        <td>${formatCurrency(row.monthlyPayment)}</td>
        <td>${formatCurrency(row.rateShockPayment)}</td>
        <td>${formatCurrency(row.annualInterestSaved)}</td>
        <td>${row.betterAction}</td>
      </tr>
    `).join("");
  }
}

function renderModelOverview() {
  if (!(elements.modelGrid instanceof HTMLElement)) {
    return;
  }

  elements.modelGrid.innerHTML = MODEL_OVERVIEW.map((section) => `
    <article class="model-card">
      <span>${section.tag}</span>
      <h3>${section.title}</h3>
      <ul>
        ${section.points.map((point) => `<li>${point}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

function renderCorePanels() {
  const context = buildRenderContext({ includeEnhancements: false });
  renderValidationList(context);
  renderSummaryCards();
  renderNetWorthDashboard(context);
  renderBalanceInsights(context);
  renderIncomeExpenseTracker(context);
  renderBudgetPanel(context);
  renderBudgetList(context);
  renderGoalPanel(context);
  renderCashflowForecast(context);
  renderRepaymentPlan();
  renderScenarioPanel(context);
  renderRiskPanel(context);
  scheduleEnhancementRender();
  scheduleRenderCharts(state);
  updateHighlights();
}

function scheduleEnhancementRender() {
  window.setTimeout(() => {
    const context = buildRenderContext({ includeEnhancements: true });
    renderGuideMessages();
    renderQuickActions();
    renderOnboardingBanner(context);
    renderDecisionChecklist(context);
    renderAutomationInsights(context);
    updateHighlights();
  }, 0);
}

function renderCharts(state) {
  if (!window.FinancePlannerChartDataAdapter || !window.FinancePlannerChartService || !window.FinancePlannerChartConfigs) {
    return;
  }

  const dataset = adaptChartData(state);

  setOption("chart-networth", netWorthLineOption(dataset.netWorth));
  setOption("chart-cashflow", cashFlowBarOption(dataset.cashflow));
  setOption("chart-asset", pieOption(dataset.assets, "資產配置"));
  setOption("chart-debt", pieOption(dataset.liabilities, "負債結構"));
}

function scheduleRenderCharts(state) {
  window.clearTimeout(chartRenderTimer);
  chartRenderTimer = window.setTimeout(() => renderCharts(state), 300);
}

function renderListSection(section) {
  if (section === "assets") {
    renderAssetList();
    return;
  }

  if (section === "debts") {
    renderDebtList();
    return;
  }

  if (section === "events") {
    renderEventList();
    return;
  }

  if (section === "transactions") {
    renderTransactionList();
  }
}

function renderStaticSection() {
  renderStaticFields();
}

function render() {
  renderModelOverview();
  renderAssetList();
  renderDebtList();
  renderEventList();
  renderTransactionList();
  renderBudgetList();
  renderStaticFields();
  renderCorePanels();
}

configureStorage({ render, updateSaveStatus, updateBackupStatus });

function init() {
  loadState();
  ensureOnboardingState();
  bindStorageControls();
  bindAssetControls();
  bindDebtControls();
  bindEventControls();
  bindTransactionControls();
  bindBudgetControls();
  bindGoalControls();
  bindTemplateControls();
  bindStaticFieldControls();
  bindHelpControls();
  bindQuickActionControls();
  bindOnboardingObservers();
  render();
  saveState();
  updateBackupStatus("建議定期匯出 JSON 備份。");
  window.financePlannerApp = {
    STORAGE_KEY,
    ASSET_TYPE_OPTIONS,
    DEBT_TYPE_OPTIONS,
    createDefaultState,
    calculateBudgetOverview: () => calculateBudgetOverview(state.budgets, state.transactions, state.incomeExpense?.month),
    calculateGoalPlan: () => calculateGoalPlan(state.goal, calculateNetWorthDashboard(state).monthlyNetCashflow),
    calculateIncomeExpenseOverview: () => calculateIncomeExpenseOverview(state.transactions, state.incomeExpense?.month),
    calculateNetWorthDashboard: () => calculateNetWorthDashboard(state),
    calculateSummary: () => calculateSummary(state),
    exportState,
    loadState,
    resetState,
    saveState,
    state,
  };
}

window.FinancePlannerUI = {
  init,
  render,
  renderCorePanels,
  renderCharts,
  scheduleRenderCharts,
};

Object.assign(window, window.FinancePlannerUI);
