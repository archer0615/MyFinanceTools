const elements = {
  loanAmount: document.querySelector("#loan-amount"),
  annualRate: document.querySelector("#annual-rate"),
  loanMonths: document.querySelector("#loan-months"),
  handlingFee: document.querySelector("#handling-fee"),
  graceMonths: document.querySelector("#grace-months"),
  firstPaymentDate: document.querySelector("#first-payment-date"),
  paymentDay: document.querySelector("#payment-day"),
  prepayMonth: document.querySelector("#prepay-month"),
  prepayAmount: document.querySelector("#prepay-amount"),
  prepayFee: document.querySelector("#prepay-fee"),
  prepayPenaltyRate: document.querySelector("#prepay-penalty-rate"),
  indexedRateEnabled: document.querySelector("#indexed-rate-enabled"),
  indexBaseRate: document.querySelector("#index-base-rate"),
  indexSpreadRate: document.querySelector("#index-spread-rate"),
  indexResetMonths: document.querySelector("#index-reset-months"),
  indexStepPerReset: document.querySelector("#index-step-per-reset"),
  indexFloorRate: document.querySelector("#index-floor-rate"),
  indexCapRate: document.querySelector("#index-cap-rate"),
  indexedRateSummary: document.querySelector("#indexed-rate-summary"),
  reportUserName: document.querySelector("#report-user-name"),
  reportBankName: document.querySelector("#report-bank-name"),
  reportDate: document.querySelector("#report-date"),
  reportNote: document.querySelector("#report-note"),
  monthlyIncome: document.querySelector("#monthly-income"),
  existingDebtPayment: document.querySelector("#existing-debt-payment"),
  fixedLivingExpense: document.querySelector("#fixed-living-expense"),
  affordablePayment: document.querySelector("#affordable-payment"),
  stressIncomeDrop: document.querySelector("#stress-income-drop"),
  stressRateRise: document.querySelector("#stress-rate-rise"),
  stressExpenseShock: document.querySelector("#stress-expense-shock"),
  stressSafetyBuffer: document.querySelector("#stress-safety-buffer"),
  sensitivityStep: document.querySelector("#sensitivity-step"),
  sensitivityDownCount: document.querySelector("#sensitivity-down-count"),
  sensitivityUpCount: document.querySelector("#sensitivity-up-count"),
  matrixTermStep: document.querySelector("#matrix-term-step"),
  matrixTermDownCount: document.querySelector("#matrix-term-down-count"),
  matrixTermUpCount: document.querySelector("#matrix-term-up-count"),
  matrixMetricKey: document.querySelector("#matrix-metric-key"),
  rateBatchInput: document.querySelector("#rate-batch-input"),
  riskDsrMedium: document.querySelector("#risk-dsr-medium"),
  riskDsrHigh: document.querySelector("#risk-dsr-high"),
  riskDebtMedium: document.querySelector("#risk-debt-medium"),
  riskDebtHigh: document.querySelector("#risk-debt-high"),
  riskAprGap: document.querySelector("#risk-apr-gap"),
  riskFeeRatio: document.querySelector("#risk-fee-ratio"),
  calculateButton: document.querySelector("#calculate-button"),
  sampleButton: document.querySelector("#sample-button"),
  sensitivitySampleButton: document.querySelector("#sensitivity-sample-button"),
  rateBatchSampleButton: document.querySelector("#rate-batch-sample-button"),
  compareSampleButton: document.querySelector("#compare-sample-button"),
  addExtraPrepayButton: document.querySelector("#add-extra-prepay-button"),
  addDebtRowButton: document.querySelector("#add-debt-row-button"),
  addCompareRowButton: document.querySelector("#add-compare-row-button"),
  removeCompareRowButton: document.querySelector("#remove-compare-row-button"),
  exportJsonButton: document.querySelector("#export-json-button"),
  importJsonButton: document.querySelector("#import-json-button"),
  importJsonFile: document.querySelector("#import-json-file"),
  openSharePageButton: document.querySelector("#open-share-page-button"),
  exportPdfButton: document.querySelector("#export-pdf-button"),
  resetButton: document.querySelector("#reset-button"),
  tierSampleButton: document.querySelector("#tier-sample-button"),
  debtSampleButton: document.querySelector("#debt-sample-button"),
  addRateTierButton: document.querySelector("#add-rate-tier-button"),
  exportBaseButton: document.querySelector("#export-base-button"),
  exportPrepayButton: document.querySelector("#export-prepay-button"),
  exportAnnualBaseButton: document.querySelector("#export-annual-base-button"),
  exportAnnualPrepayButton: document.querySelector("#export-annual-prepay-button"),
  exportCompareCsvButton: document.querySelector("#export-compare-csv-button"),
  exportComparePdfButton: document.querySelector("#export-compare-pdf-button"),
  compareSortKey: document.querySelector("#compare-sort-key"),
  compareSortDirection: document.querySelector("#compare-sort-direction"),
  compareSortSummary: document.querySelector("#compare-sort-summary"),
  riskHighCount: document.querySelector("#risk-high-count"),
  riskMediumCount: document.querySelector("#risk-medium-count"),
  riskSummary: document.querySelector("#risk-summary"),
  riskAlertList: document.querySelector("#risk-alert-list"),
  diffTargetName: document.querySelector("#diff-target-name"),
  diffAprGap: document.querySelector("#diff-apr-gap"),
  diffMonthlyGap: document.querySelector("#diff-monthly-gap"),
  diffAnalysisSummary: document.querySelector("#diff-analysis-summary"),
  diffAnalysisBody: document.querySelector("#diff-analysis-body"),
  rateBatchBestRate: document.querySelector("#rate-batch-best-rate"),
  rateBatchWorstPayment: document.querySelector("#rate-batch-worst-payment"),
  rateBatchSummary: document.querySelector("#rate-batch-summary"),
  rateBatchBody: document.querySelector("#rate-batch-body"),
  copyDashboardSnapshotButton: document.querySelector("#copy-dashboard-snapshot-button"),
  copyDecisionReportButton: document.querySelector("#copy-decision-report-button"),
  chartModeMonthly: document.querySelector("#chart-mode-monthly"),
  chartModeYearly: document.querySelector("#chart-mode-yearly"),
  prepayModeShorten: document.querySelector("#prepay-mode-shorten"),
  prepayModeReduce: document.querySelector("#prepay-mode-reduce"),
  calendarYearFilter: document.querySelector("#calendar-year-filter"),
  calendarSortKey: document.querySelector("#calendar-sort-key"),
  calendarPeakMonth: document.querySelector("#calendar-peak-month"),
  calendarPeakPayment: document.querySelector("#calendar-peak-payment"),
  calendarSummary: document.querySelector("#calendar-summary"),
  paymentViewPaymentInterest: document.querySelector("#payment-view-payment-interest"),
  paymentViewPrincipalInterest: document.querySelector("#payment-view-principal-interest"),
  paymentViewTotalPayment: document.querySelector("#payment-view-total-payment"),
  balanceViewRemaining: document.querySelector("#balance-view-remaining"),
  balanceViewCumulativePrincipal: document.querySelector("#balance-view-cumulative-principal"),
  balanceViewCumulativeInterest: document.querySelector("#balance-view-cumulative-interest"),
  downloadPaymentChartButton: document.querySelector("#download-payment-chart-button"),
  downloadBalanceChartButton: document.querySelector("#download-balance-chart-button"),
  paymentChart: document.querySelector("#payment-chart"),
  balanceChart: document.querySelector("#balance-chart"),
  sensitivityChart: document.querySelector("#sensitivity-chart"),
  sensitivityChartSummary: document.querySelector("#sensitivity-chart-summary"),
  sensitivityMatrixSummary: document.querySelector("#sensitivity-matrix-summary"),
  sensitivityMatrixHead: document.querySelector("#sensitivity-matrix-head"),
  sensitivityMatrixBody: document.querySelector("#sensitivity-matrix-body"),
  costBreakdownChart: document.querySelector("#cost-breakdown-chart"),
  costBreakdownSummary: document.querySelector("#cost-breakdown-summary"),
  paymentChartTooltip: document.querySelector("#payment-chart-tooltip"),
  balanceChartTooltip: document.querySelector("#balance-chart-tooltip"),
  rateTierBody: document.querySelector("#rate-tier-body"),
  rateTierTemplate: document.querySelector("#rate-tier-row-template"),
  status: document.querySelector("#status"),
  prepayStatus: document.querySelector("#prepay-status"),
  prepayModeCompareBody: document.querySelector("#prepay-mode-compare-body"),
  scheduleBody: document.querySelector("#schedule-body"),
  prepayScheduleBody: document.querySelector("#prepay-schedule-body"),
  calendarBaseView: document.querySelector("#calendar-base-view"),
  calendarPrepayView: document.querySelector("#calendar-prepay-view"),
  annualSummaryBody: document.querySelector("#annual-summary-body"),
  annualPrepaySummaryBody: document.querySelector("#annual-prepay-summary-body"),
  sensitivityBody: document.querySelector("#sensitivity-body"),
  compareInputBody: document.querySelector("#compare-input-body"),
  compareRowTemplate: document.querySelector("#compare-row-template"),
  compareResultBody: document.querySelector("#compare-result-body"),
  extraPrepayBody: document.querySelector("#extra-prepay-body"),
  extraPrepayRowTemplate: document.querySelector("#extra-prepay-row-template"),
  debtBody: document.querySelector("#debt-body"),
  debtRowTemplate: document.querySelector("#debt-row-template"),
  adviceList: document.querySelector("#advice-list"),
  dashboardHealthScore: document.querySelector("#dashboard-health-score"),
  dashboardHealthBand: document.querySelector("#dashboard-health-band"),
  dashboardPrimaryRisk: document.querySelector("#dashboard-primary-risk"),
  dashboardHighlightList: document.querySelector("#dashboard-highlight-list"),
  dashboardSnapshotText: document.querySelector("#dashboard-snapshot-text"),
  dashboardSnapshotStatus: document.querySelector("#dashboard-snapshot-status"),
  decisionReportText: document.querySelector("#decision-report-text"),
  decisionReportStatus: document.querySelector("#decision-report-status"),
  monthlyPayment: document.querySelector("#monthly-payment"),
  gracePayment: document.querySelector("#grace-payment"),
  totalPayment: document.querySelector("#total-payment"),
  totalInterest: document.querySelector("#total-interest"),
  netAmount: document.querySelector("#net-amount"),
  feeRatio: document.querySelector("#fee-ratio"),
  averageInterest: document.querySelector("#average-interest"),
  firstInterest: document.querySelector("#first-interest"),
  dsrValue: document.querySelector("#dsr-value"),
  dsrStatus: document.querySelector("#dsr-status"),
  maxLoanAmount: document.querySelector("#max-loan-amount"),
  loanRangeConservative: document.querySelector("#loan-range-conservative"),
  loanRangeBalanced: document.querySelector("#loan-range-balanced"),
  loanRangeAggressive: document.querySelector("#loan-range-aggressive"),
  loanRangeSummary: document.querySelector("#loan-range-summary"),
  stressBaseSurplus: document.querySelector("#stress-base-surplus"),
  stressWorstSurplus: document.querySelector("#stress-worst-surplus"),
  stressBreakRate: document.querySelector("#stress-break-rate"),
  stressTestSummary: document.querySelector("#stress-test-summary"),
  stressTestBody: document.querySelector("#stress-test-body"),
  monteCarloIterations: document.querySelector("#monte-carlo-iterations"),
  monteCarloIncomeVolatility: document.querySelector("#monte-carlo-income-volatility"),
  monteCarloRateVolatility: document.querySelector("#monte-carlo-rate-volatility"),
  monteCarloExpenseShockProbability: document.querySelector("#monte-carlo-expense-shock-probability"),
  monteCarloExpenseShockAmount: document.querySelector("#monte-carlo-expense-shock-amount"),
  monteCarloSeed: document.querySelector("#monte-carlo-seed"),
  monteCarloFailRate: document.querySelector("#monte-carlo-fail-rate"),
  monteCarloMedianSurplus: document.querySelector("#monte-carlo-median-surplus"),
  monteCarloP10Surplus: document.querySelector("#monte-carlo-p10-surplus"),
  monteCarloSummary: document.querySelector("#monte-carlo-summary"),
  monteCarloBody: document.querySelector("#monte-carlo-body"),
  debtConsolidationMonthlyGap: document.querySelector("#debt-consolidation-monthly-gap"),
  debtConsolidationTotalSaved: document.querySelector("#debt-consolidation-total-saved"),
  debtConsolidationCoverage: document.querySelector("#debt-consolidation-coverage"),
  debtConsolidationSummary: document.querySelector("#debt-consolidation-summary"),
  debtConsolidationBody: document.querySelector("#debt-consolidation-body"),
  totalDebtPayment: document.querySelector("#total-debt-payment"),
  overallDebtRatio: document.querySelector("#overall-debt-ratio"),
  incomeAfterDebt: document.querySelector("#income-after-debt"),
  incomeAfterAllExpenses: document.querySelector("#income-after-all-expenses"),
  refiCurrentBalance: document.querySelector("#refi-current-balance"),
  refiCurrentRate: document.querySelector("#refi-current-rate"),
  refiCurrentMonths: document.querySelector("#refi-current-months"),
  refiCurrentGrace: document.querySelector("#refi-current-grace"),
  refiExitFee: document.querySelector("#refi-exit-fee"),
  refiNewRate: document.querySelector("#refi-new-rate"),
  refiNewMonths: document.querySelector("#refi-new-months"),
  refiNewGrace: document.querySelector("#refi-new-grace"),
  refiNewFee: document.querySelector("#refi-new-fee"),
  refiCashback: document.querySelector("#refi-cashback"),
  refiMonthlyGap: document.querySelector("#refi-monthly-gap"),
  refiTotalSaved: document.querySelector("#refi-total-saved"),
  refiBreakEven: document.querySelector("#refi-break-even"),
  refiSummary: document.querySelector("#refi-summary"),
  refiCompareBody: document.querySelector("#refi-compare-body"),
  aprEstimate: document.querySelector("#apr-estimate"),
  aprCostGap: document.querySelector("#apr-cost-gap"),
  aprSummary: document.querySelector("#apr-summary"),
  interestSaved: document.querySelector("#interest-saved"),
  monthsSaved: document.querySelector("#months-saved"),
  prepayTotalPayment: document.querySelector("#prepay-total-payment"),
  prepayPenaltyCost: document.querySelector("#prepay-penalty-cost"),
  bestPrepayMonth: document.querySelector("#best-prepay-month"),
  bestPrepayNetSaved: document.querySelector("#best-prepay-net-saved"),
  bestPrepayMonthsSaved: document.querySelector("#best-prepay-months-saved"),
  bestPrepaySummary: document.querySelector("#best-prepay-summary"),
  prepayTimingBody: document.querySelector("#prepay-timing-body"),
  printSummaryNote: document.querySelector("#print-summary-note"),
  printUserName: document.querySelector("#print-user-name"),
  printBankName: document.querySelector("#print-bank-name"),
  printReportDate: document.querySelector("#print-report-date"),
  printReportNote: document.querySelector("#print-report-note"),
  printLoanMeta: document.querySelector("#print-loan-meta"),
  printPaymentMeta: document.querySelector("#print-payment-meta"),
  printCostMeta: document.querySelector("#print-cost-meta"),
  printAprMeta: document.querySelector("#print-apr-meta"),
};

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

const decimalFormatter = new Intl.NumberFormat("zh-TW", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});
const WAN_UNIT = 10000;
const STORAGE_KEY = "credit-loan-calculator-state";
const SHARE_STORAGE_KEY = "credit-loan-calculator-share";
const DEFAULT_COMPARE_ROW_COUNT = 3;
const MAX_COMPARE_ROW_COUNT = 8;
const MIN_COMPARE_ROW_COUNT = 1;
const DEFAULT_RISK_THRESHOLDS = {
  dsrMedium: 40,
  dsrHigh: 50,
  debtMedium: 50,
  debtHigh: 60,
  aprGap: 1,
  feeRatio: 2,
};
const DEFAULT_MONTE_CARLO_ITERATIONS = 1000;

let lastBaseScenario = null;
let lastPrepayScenario = null;
let lastPrepayModeSummaries = [];
let chartMode = "monthly";
let paymentChartView = "payment-interest";
let balanceChartView = "remaining";
let prepaymentMode = "shorten-term";
let calendarYearFilter = "all";
let calendarSortKey = "chronological";
let compareSortKey = "score";
let compareSortDirection = "auto";
let lastCalculationContext = null;
let lastChartPayload = null;
let lastBreakdownPayload = null;
let lastSensitivityRows = [];
let lastSensitivityMatrix = null;
let activeTabId = "basics";

const TAB_CONFIG = [
  {
    id: "basics",
    index: "01",
    label: "基本試算",
    shortLabel: "核心輸入與主要 KPI",
    description: "輸入貸款條件、利率模型與核心試算結果。",
  },
  {
    id: "prepay",
    index: "02",
    label: "提前清償",
    shortLabel: "單筆、多筆與 APR 相關",
    description: "集中查看提前清償設定、最佳時點與清償模式比較。",
  },
  {
    id: "risk",
    index: "03",
    label: "風險分析",
    shortLabel: "收入壓力與決策摘要",
    description: "整合 DSR、壓力測試、Monte Carlo 與決策建議。",
  },
  {
    id: "compare",
    index: "04",
    label: "方案比較",
    shortLabel: "轉貸、比較與差異分析",
    description: "比較不同銀行方案、轉貸情境與條件差異。",
  },
  {
    id: "details",
    index: "05",
    label: "明細與圖表",
    shortLabel: "還款表、圖表與月曆",
    description: "查看還款趨勢圖、明細表、年度統計與月曆檢視。",
  },
];

function resolveTabIdForNode(node) {
  if (node.querySelector("#loan-amount, #rate-tier-body, #indexed-rate-enabled, #monthly-payment, #net-amount")) {
    return "basics";
  }

  if (node.querySelector("#extra-prepay-body, #best-prepay-summary, #apr-estimate, #prepay-mode-compare-body")) {
    return "prepay";
  }

  if (node.querySelector("#monthly-income, #monte-carlo-summary, #debt-consolidation-summary, #risk-summary, #advice-list, #dashboard-snapshot-text, #decision-report-text")) {
    return "risk";
  }

  if (node.querySelector("#refi-summary, #compare-input-body, #diff-analysis-body, #rate-batch-body")) {
    return "compare";
  }

  return "details";
}

function refreshVisibleTabVisuals() {
  if (activeTabId !== "details") {
    return;
  }

  renderCharts(lastBaseScenario, lastPrepayScenario);
  drawBreakdownChart(elements.costBreakdownChart, lastBreakdownPayload?.segments ?? []);
  renderSensitivityTable(lastSensitivityRows);
  renderSensitivityMatrix(lastSensitivityMatrix);
}

function initTabbedLayout() {
  const page = document.querySelector(".page");
  const hero = page?.querySelector(".hero");
  if (!page || !hero) {
    return;
  }

  const movableNodes = [...page.children].filter((node) =>
    node instanceof HTMLElement && !node.classList.contains("print-summary") && !node.classList.contains("hero"),
  );

  if (!movableNodes.length) {
    return;
  }

  const shell = document.createElement("section");
  shell.className = "tab-shell";

  const nav = document.createElement("div");
  nav.className = "tab-nav";
  const copy = document.createElement("div");
  copy.className = "tab-nav-copy";
  const copyText = document.createElement("div");
  const eyebrow = document.createElement("p");
  eyebrow.className = "section-kicker";
  eyebrow.textContent = "Workspace";
  const title = document.createElement("h2");
  const description = document.createElement("p");
  copyText.append(eyebrow, title, description);
  const meta = document.createElement("span");
  meta.className = "tab-meta";
  copy.append(copyText, meta);

  const tabList = document.createElement("div");
  tabList.className = "tab-list";
  tabList.setAttribute("role", "tablist");
  tabList.setAttribute("aria-label", "信用貸款工具分頁");

  const panels = document.createElement("div");
  panels.className = "tab-panels";

  const panelMap = new Map();
  const buttonMap = new Map();

  TAB_CONFIG.forEach((tab) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab-button";
    button.setAttribute("role", "tab");
    button.setAttribute("aria-selected", "false");
    button.setAttribute("aria-controls", `tab-panel-${tab.id}`);
    button.innerHTML = `
      <span class="tab-button-index">${tab.index}</span>
      <span class="tab-button-text">
        <span class="tab-button-title">${tab.label}</span>
        <span class="tab-button-desc">${tab.shortLabel}</span>
      </span>
    `;

    const panel = document.createElement("div");
    panel.className = "tab-panel";
    panel.id = `tab-panel-${tab.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.hidden = true;

    buttonMap.set(tab.id, button);
    panelMap.set(tab.id, panel);
    tabList.appendChild(button);
    panels.appendChild(panel);
  });

  movableNodes.forEach((node) => {
    const targetTabId = resolveTabIdForNode(node);
    panelMap.get(targetTabId)?.appendChild(node);
  });

  nav.append(copy, tabList);
  shell.append(nav, panels);
  hero.insertAdjacentElement("afterend", shell);

  const setActiveTab = (tabId) => {
    activeTabId = tabId;

    TAB_CONFIG.forEach((tab) => {
      const isActive = tab.id === tabId;
      const button = buttonMap.get(tab.id);
      const panel = panelMap.get(tab.id);
      button?.classList.toggle("is-active", isActive);
      button?.setAttribute("aria-selected", String(isActive));
      panel.hidden = !isActive;
    });

    const activeTab = TAB_CONFIG.find((tab) => tab.id === tabId) ?? TAB_CONFIG[0];
    title.textContent = activeTab.label;
    description.textContent = activeTab.description;
    meta.textContent = `${activeTab.index} / ${TAB_CONFIG.length.toString().padStart(2, "0")}`;

    if (tabId === "details") {
      window.requestAnimationFrame(() => {
        refreshVisibleTabVisuals();
      });
    }
  };

  TAB_CONFIG.forEach((tab) => {
    buttonMap.get(tab.id)?.addEventListener("click", () => {
      setActiveTab(tab.id);
    });
  });

  setActiveTab(activeTabId);
}

function saveState() {
  const state = {
    loanAmount: elements.loanAmount.value,
    annualRate: elements.annualRate.value,
    loanMonths: elements.loanMonths.value,
    handlingFee: elements.handlingFee.value,
    graceMonths: elements.graceMonths.value,
    firstPaymentDate: elements.firstPaymentDate.value,
    paymentDay: elements.paymentDay.value,
    prepayMonth: elements.prepayMonth.value,
    prepayAmount: elements.prepayAmount.value,
    prepayFee: elements.prepayFee.value,
    prepayPenaltyRate: elements.prepayPenaltyRate.value,
    indexedRateEnabled: elements.indexedRateEnabled.value,
    indexBaseRate: elements.indexBaseRate.value,
    indexSpreadRate: elements.indexSpreadRate.value,
    indexResetMonths: elements.indexResetMonths.value,
    indexStepPerReset: elements.indexStepPerReset.value,
    indexFloorRate: elements.indexFloorRate.value,
    indexCapRate: elements.indexCapRate.value,
    reportUserName: elements.reportUserName.value,
    reportBankName: elements.reportBankName.value,
    reportDate: elements.reportDate.value,
    reportNote: elements.reportNote.value,
    monthlyIncome: elements.monthlyIncome.value,
    existingDebtPayment: elements.existingDebtPayment.value,
    fixedLivingExpense: elements.fixedLivingExpense.value,
    affordablePayment: elements.affordablePayment.value,
    stressIncomeDrop: elements.stressIncomeDrop.value,
    stressRateRise: elements.stressRateRise.value,
    stressExpenseShock: elements.stressExpenseShock.value,
    stressSafetyBuffer: elements.stressSafetyBuffer.value,
    monteCarloIterations: elements.monteCarloIterations.value,
    monteCarloIncomeVolatility: elements.monteCarloIncomeVolatility.value,
    monteCarloRateVolatility: elements.monteCarloRateVolatility.value,
    monteCarloExpenseShockProbability: elements.monteCarloExpenseShockProbability.value,
    monteCarloExpenseShockAmount: elements.monteCarloExpenseShockAmount.value,
    monteCarloSeed: elements.monteCarloSeed.value,
    refiCurrentBalance: elements.refiCurrentBalance.value,
    refiCurrentRate: elements.refiCurrentRate.value,
    refiCurrentMonths: elements.refiCurrentMonths.value,
    refiCurrentGrace: elements.refiCurrentGrace.value,
    refiExitFee: elements.refiExitFee.value,
    refiNewRate: elements.refiNewRate.value,
    refiNewMonths: elements.refiNewMonths.value,
    refiNewGrace: elements.refiNewGrace.value,
    refiNewFee: elements.refiNewFee.value,
    refiCashback: elements.refiCashback.value,
    sensitivityStep: elements.sensitivityStep.value,
    sensitivityDownCount: elements.sensitivityDownCount.value,
    sensitivityUpCount: elements.sensitivityUpCount.value,
    matrixTermStep: elements.matrixTermStep.value,
    matrixTermDownCount: elements.matrixTermDownCount.value,
    matrixTermUpCount: elements.matrixTermUpCount.value,
    matrixMetricKey: elements.matrixMetricKey.value,
    rateBatchInput: elements.rateBatchInput.value,
    riskDsrMedium: elements.riskDsrMedium.value,
    riskDsrHigh: elements.riskDsrHigh.value,
    riskDebtMedium: elements.riskDebtMedium.value,
    riskDebtHigh: elements.riskDebtHigh.value,
    riskAprGap: elements.riskAprGap.value,
    riskFeeRatio: elements.riskFeeRatio.value,
    compareScenarios: getCompareScenariosState(),
    extraPrepayEvents: getExtraPrepayEventsState(),
    debtItems: getDebtItemsState(),
    chartMode,
    paymentChartView,
    balanceChartView,
    prepaymentMode,
    calendarYearFilter,
    calendarSortKey,
    compareSortKey,
    compareSortDirection,
    rateTiers: getTierRows().map((row) => {
      const inputs = row.querySelectorAll("input");
      return {
        startMonth: inputs[0]?.value ?? "",
        endMonth: inputs[1]?.value ?? "",
        annualRate: inputs[2]?.value ?? "",
      };
    }),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentState() {
  return {
    loanAmount: elements.loanAmount.value,
    annualRate: elements.annualRate.value,
    loanMonths: elements.loanMonths.value,
    handlingFee: elements.handlingFee.value,
    graceMonths: elements.graceMonths.value,
    firstPaymentDate: elements.firstPaymentDate.value,
    paymentDay: elements.paymentDay.value,
    prepayMonth: elements.prepayMonth.value,
    prepayAmount: elements.prepayAmount.value,
    prepayFee: elements.prepayFee.value,
    prepayPenaltyRate: elements.prepayPenaltyRate.value,
    indexedRateEnabled: elements.indexedRateEnabled.value,
    indexBaseRate: elements.indexBaseRate.value,
    indexSpreadRate: elements.indexSpreadRate.value,
    indexResetMonths: elements.indexResetMonths.value,
    indexStepPerReset: elements.indexStepPerReset.value,
    indexFloorRate: elements.indexFloorRate.value,
    indexCapRate: elements.indexCapRate.value,
    reportUserName: elements.reportUserName.value,
    reportBankName: elements.reportBankName.value,
    reportDate: elements.reportDate.value,
    reportNote: elements.reportNote.value,
    monthlyIncome: elements.monthlyIncome.value,
    existingDebtPayment: elements.existingDebtPayment.value,
    fixedLivingExpense: elements.fixedLivingExpense.value,
    affordablePayment: elements.affordablePayment.value,
    stressIncomeDrop: elements.stressIncomeDrop.value,
    stressRateRise: elements.stressRateRise.value,
    stressExpenseShock: elements.stressExpenseShock.value,
    stressSafetyBuffer: elements.stressSafetyBuffer.value,
    monteCarloIterations: elements.monteCarloIterations.value,
    monteCarloIncomeVolatility: elements.monteCarloIncomeVolatility.value,
    monteCarloRateVolatility: elements.monteCarloRateVolatility.value,
    monteCarloExpenseShockProbability: elements.monteCarloExpenseShockProbability.value,
    monteCarloExpenseShockAmount: elements.monteCarloExpenseShockAmount.value,
    monteCarloSeed: elements.monteCarloSeed.value,
    refiCurrentBalance: elements.refiCurrentBalance.value,
    refiCurrentRate: elements.refiCurrentRate.value,
    refiCurrentMonths: elements.refiCurrentMonths.value,
    refiCurrentGrace: elements.refiCurrentGrace.value,
    refiExitFee: elements.refiExitFee.value,
    refiNewRate: elements.refiNewRate.value,
    refiNewMonths: elements.refiNewMonths.value,
    refiNewGrace: elements.refiNewGrace.value,
    refiNewFee: elements.refiNewFee.value,
    refiCashback: elements.refiCashback.value,
    sensitivityStep: elements.sensitivityStep.value,
    sensitivityDownCount: elements.sensitivityDownCount.value,
    sensitivityUpCount: elements.sensitivityUpCount.value,
    matrixTermStep: elements.matrixTermStep.value,
    matrixTermDownCount: elements.matrixTermDownCount.value,
    matrixTermUpCount: elements.matrixTermUpCount.value,
    matrixMetricKey: elements.matrixMetricKey.value,
    rateBatchInput: elements.rateBatchInput.value,
    riskDsrMedium: elements.riskDsrMedium.value,
    riskDsrHigh: elements.riskDsrHigh.value,
    riskDebtMedium: elements.riskDebtMedium.value,
    riskDebtHigh: elements.riskDebtHigh.value,
    riskAprGap: elements.riskAprGap.value,
    riskFeeRatio: elements.riskFeeRatio.value,
    compareScenarios: getCompareScenariosState(),
    extraPrepayEvents: getExtraPrepayEventsState(),
    debtItems: getDebtItemsState(),
    chartMode,
    paymentChartView,
    balanceChartView,
    prepaymentMode,
    calendarYearFilter,
    calendarSortKey,
    compareSortKey,
    compareSortDirection,
    rateTiers: getTierRows().map((row) => {
      const inputs = row.querySelectorAll("input");
      return {
        startMonth: inputs[0]?.value ?? "",
        endMonth: inputs[1]?.value ?? "",
        annualRate: inputs[2]?.value ?? "",
      };
    }),
  };
}

function applyState(state) {
  elements.loanAmount.value = state.loanAmount ?? "";
  elements.annualRate.value = state.annualRate ?? "";
  elements.loanMonths.value = state.loanMonths ?? "";
  elements.handlingFee.value = state.handlingFee ?? "";
  elements.graceMonths.value = state.graceMonths ?? "";
  elements.firstPaymentDate.value = state.firstPaymentDate ?? "";
  elements.paymentDay.value = state.paymentDay ?? "";
  elements.prepayMonth.value = state.prepayMonth ?? "";
  elements.prepayAmount.value = state.prepayAmount ?? "";
  elements.prepayFee.value = state.prepayFee ?? "";
  elements.prepayPenaltyRate.value = state.prepayPenaltyRate ?? "";
  elements.indexedRateEnabled.value = state.indexedRateEnabled === "on" ? "on" : "off";
  elements.indexBaseRate.value = state.indexBaseRate ?? "";
  elements.indexSpreadRate.value = state.indexSpreadRate ?? "";
  elements.indexResetMonths.value = state.indexResetMonths ?? "";
  elements.indexStepPerReset.value = state.indexStepPerReset ?? "";
  elements.indexFloorRate.value = state.indexFloorRate ?? "";
  elements.indexCapRate.value = state.indexCapRate ?? "";
  elements.reportUserName.value = state.reportUserName ?? "";
  elements.reportBankName.value = state.reportBankName ?? "";
  elements.reportDate.value = state.reportDate ?? "";
  elements.reportNote.value = state.reportNote ?? "";
  elements.monthlyIncome.value = state.monthlyIncome ?? "";
  elements.existingDebtPayment.value = state.existingDebtPayment ?? "";
  elements.fixedLivingExpense.value = state.fixedLivingExpense ?? "";
  elements.affordablePayment.value = state.affordablePayment ?? "";
  elements.stressIncomeDrop.value = state.stressIncomeDrop ?? "";
  elements.stressRateRise.value = state.stressRateRise ?? "";
  elements.stressExpenseShock.value = state.stressExpenseShock ?? "";
  elements.stressSafetyBuffer.value = state.stressSafetyBuffer ?? "";
  elements.monteCarloIterations.value = state.monteCarloIterations ?? String(DEFAULT_MONTE_CARLO_ITERATIONS);
  elements.monteCarloIncomeVolatility.value = state.monteCarloIncomeVolatility ?? "";
  elements.monteCarloRateVolatility.value = state.monteCarloRateVolatility ?? "";
  elements.monteCarloExpenseShockProbability.value = state.monteCarloExpenseShockProbability ?? "";
  elements.monteCarloExpenseShockAmount.value = state.monteCarloExpenseShockAmount ?? "";
  elements.monteCarloSeed.value = state.monteCarloSeed ?? "";
  elements.refiCurrentBalance.value = state.refiCurrentBalance ?? "";
  elements.refiCurrentRate.value = state.refiCurrentRate ?? "";
  elements.refiCurrentMonths.value = state.refiCurrentMonths ?? "";
  elements.refiCurrentGrace.value = state.refiCurrentGrace ?? "";
  elements.refiExitFee.value = state.refiExitFee ?? "";
  elements.refiNewRate.value = state.refiNewRate ?? "";
  elements.refiNewMonths.value = state.refiNewMonths ?? "";
  elements.refiNewGrace.value = state.refiNewGrace ?? "";
  elements.refiNewFee.value = state.refiNewFee ?? "";
  elements.refiCashback.value = state.refiCashback ?? "";
  elements.sensitivityStep.value = state.sensitivityStep ?? "";
  elements.sensitivityDownCount.value = state.sensitivityDownCount ?? "";
  elements.sensitivityUpCount.value = state.sensitivityUpCount ?? "";
  elements.matrixTermStep.value = state.matrixTermStep ?? "";
  elements.matrixTermDownCount.value = state.matrixTermDownCount ?? "";
  elements.matrixTermUpCount.value = state.matrixTermUpCount ?? "";
  elements.matrixMetricKey.value = ["monthlyPayment", "totalInterest", "aprEstimate", "totalPayment", "dsr"].includes(state.matrixMetricKey)
    ? state.matrixMetricKey
    : "monthlyPayment";
  elements.rateBatchInput.value = state.rateBatchInput ?? "";
  elements.riskDsrMedium.value = state.riskDsrMedium ?? String(DEFAULT_RISK_THRESHOLDS.dsrMedium);
  elements.riskDsrHigh.value = state.riskDsrHigh ?? String(DEFAULT_RISK_THRESHOLDS.dsrHigh);
  elements.riskDebtMedium.value = state.riskDebtMedium ?? String(DEFAULT_RISK_THRESHOLDS.debtMedium);
  elements.riskDebtHigh.value = state.riskDebtHigh ?? String(DEFAULT_RISK_THRESHOLDS.debtHigh);
  elements.riskAprGap.value = state.riskAprGap ?? String(DEFAULT_RISK_THRESHOLDS.aprGap);
  elements.riskFeeRatio.value = state.riskFeeRatio ?? String(DEFAULT_RISK_THRESHOLDS.feeRatio);
  applyCompareScenariosState(state.compareScenarios);
  applyExtraPrepayEventsState(state.extraPrepayEvents);
  applyDebtItemsState(state.debtItems);

  resetTierRows();
  const tiers = Array.isArray(state.rateTiers) ? state.rateTiers : [];
  if (tiers.length) {
    elements.rateTierBody.innerHTML = "";
    tiers.forEach((tier) => addTierRow(tier));
  }

  chartMode = state.chartMode === "yearly" ? "yearly" : "monthly";
  paymentChartView = ["payment-interest", "principal-interest", "total-payment"].includes(state.paymentChartView)
    ? state.paymentChartView
    : "payment-interest";
  balanceChartView = ["remaining", "cumulative-principal", "cumulative-interest"].includes(state.balanceChartView)
    ? state.balanceChartView
    : "remaining";
  prepaymentMode = ["shorten-term", "reduce-payment"].includes(state.prepaymentMode)
    ? state.prepaymentMode
    : "shorten-term";
  calendarYearFilter = typeof state.calendarYearFilter === "string" ? state.calendarYearFilter : "all";
  calendarSortKey = ["chronological", "cashOutflow", "interest", "remainingBalance"].includes(state.calendarSortKey)
    ? state.calendarSortKey
    : "chronological";
  compareSortKey = ["score", "aprEstimate", "monthlyPayment", "totalInterest", "totalPayment", "netAmount", "annualRate", "months", "handlingFee"].includes(state.compareSortKey)
    ? state.compareSortKey
    : "score";
  compareSortDirection = ["auto", "asc", "desc"].includes(state.compareSortDirection)
    ? state.compareSortDirection
    : "auto";
  elements.calendarYearFilter.value = calendarYearFilter;
  elements.calendarSortKey.value = calendarSortKey;
  elements.compareSortKey.value = compareSortKey;
  elements.compareSortDirection.value = compareSortDirection;
  updateChartModeButtons();
}

function restoreState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return false;
  }

  try {
    const state = JSON.parse(raw);
    applyState(state);
    return true;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return false;
  }
}

function exportJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    version: 1,
    data: getCurrentState(),
  };
  const blob = new Blob([`${JSON.stringify(payload, null, 2)}\n`], { type: "application/json;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "credit-loan-calculator-config.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function importJsonFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const payload = JSON.parse(String(reader.result));
      const state = payload?.data ?? payload;
      const importError = validateImportedState(state);
      if (importError) {
        throw new Error(importError);
      }
      applyState(state);
      saveState();

      if (hasPrimaryLoanInputs()) {
        calculateLoan();
      } else if (hasCompareScenarioInputs()) {
        resetOutputs();
        renderCompareResults(buildComparisonRows());
      } else {
        resetOutputs();
      }
    } catch (error) {
      elements.status.textContent = error instanceof Error
        ? `JSON 匯入失敗：${error.message}`
        : "JSON 匯入失敗，請確認檔案格式正確。";
    } finally {
      elements.importJsonFile.value = "";
    }
  };
  reader.readAsText(file);
}

function drawEmptyChart(canvas, message) {
  if (!canvas) {
    return;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth || 520;
  const height = Number(canvas.getAttribute("height")) || 240;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#f7efe5";
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#8a7868";
  ctx.font = "14px Noto Sans TC";
  ctx.textAlign = "center";
  ctx.fillText(message, width / 2, height / 2);
}

function drawLineChart(canvas, datasets, options) {
  if (!canvas || !datasets.length || !datasets[0].values.length) {
    drawEmptyChart(canvas, "尚無圖表資料");
    return;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth || 520;
  const height = Number(canvas.getAttribute("height")) || 240;
  canvas.width = width;
  canvas.height = height;

  const padding = { top: 20, right: 20, bottom: 28, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const allValues = datasets.flatMap((dataset) => dataset.values);
  const maxValue = Math.max(...allValues, 1);
  const pointCount = datasets[0].values.length;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdfa";
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(93, 70, 50, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#7c6d60";
  ctx.font = "12px Noto Sans TC";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i += 1) {
    const value = maxValue * (1 - i / 4);
    const y = padding.top + (chartHeight / 4) * i + 4;
    ctx.fillText(`${decimalFormatter.format(value / WAN_UNIT)}萬`, padding.left - 8, y);
  }

  datasets.forEach((dataset) => {
    ctx.strokeStyle = dataset.color;
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    dataset.values.forEach((value, index) => {
      const x = padding.left + (chartWidth * index) / Math.max(pointCount - 1, 1);
      const y = padding.top + chartHeight - (value / maxValue) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();
  });

  ctx.textAlign = "left";
  datasets.forEach((dataset, index) => {
    const legendX = padding.left + index * 130;
    const legendY = height - 8;
    ctx.fillStyle = dataset.color;
    ctx.fillRect(legendX, legendY - 10, 14, 4);
    ctx.fillStyle = "#5d5248";
    ctx.fillText(dataset.label, legendX + 20, legendY);
  });

  if (options?.xLabel) {
    ctx.textAlign = "center";
    ctx.fillStyle = "#7c6d60";
    ctx.fillText(options.xLabel, width / 2, height - 8);
  }

  return {
    width,
    height,
    padding,
    chartWidth,
    pointCount,
    xLabel: options?.xLabel ?? "",
  };
}

function drawBreakdownChart(canvas, segments) {
  if (!canvas || !segments.length) {
    drawEmptyChart(canvas, "尚無成本資料");
    lastBreakdownPayload = null;
    return;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth || 520;
  const height = Number(canvas.getAttribute("height")) || 240;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdfa";
  ctx.fillRect(0, 0, width, height);

  const total = segments.reduce((sum, segment) => sum + segment.value, 0) || 1;
  const barX = 26;
  const barY = 84;
  const barWidth = width - 52;
  const barHeight = 28;
  let cursor = barX;
  const hitSegments = [];

  segments.forEach((segment) => {
    const partWidth = (segment.value / total) * barWidth;
    ctx.fillStyle = segment.color;
    ctx.fillRect(cursor, barY, partWidth, barHeight);
    hitSegments.push({
      ...segment,
      ratio: total === 0 ? 0 : (segment.value / total) * 100,
      startX: cursor,
      endX: cursor + partWidth,
    });
    cursor += partWidth;
  });

  ctx.font = "13px Noto Sans TC";
  ctx.textAlign = "left";
  segments.forEach((segment, index) => {
    const y = 150 + index * 26;
    ctx.fillStyle = segment.color;
    ctx.fillRect(barX, y - 11, 14, 14);
    ctx.fillStyle = "#5d5248";
    const ratio = ((segment.value / total) * 100).toFixed(1);
    const displayValue = segment.label === "利息" || segment.label === "手續費"
      ? formatCurrency(segment.value)
      : formatWan(segment.value);
    ctx.fillText(`${segment.label} ${displayValue} (${ratio}%)`, barX + 22, y);
  });

  lastBreakdownPayload = {
    barX,
    barY,
    barWidth,
    barHeight,
    segments: hitSegments,
  };
}

function drawSensitivityChart(canvas, rows) {
  if (!canvas || !rows.length) {
    drawEmptyChart(canvas, "尚無敏感度資料");
    return;
  }

  const ctx = canvas.getContext("2d");
  const width = canvas.clientWidth || 520;
  const height = Number(canvas.getAttribute("height")) || 240;
  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#fffdfa";
  ctx.fillRect(0, 0, width, height);

  const padding = { top: 18, right: 18, bottom: 44, left: 56 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;
  const maxValue = Math.max(...rows.map((row) => row.monthlyPayment), 1);
  const barWidth = chartWidth / rows.length * 0.58;

  ctx.strokeStyle = "rgba(93, 70, 50, 0.12)";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i += 1) {
    const y = padding.top + (chartHeight / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#7c6d60";
  ctx.font = "12px Noto Sans TC";
  ctx.textAlign = "right";
  for (let i = 0; i <= 4; i += 1) {
    const value = maxValue * (1 - i / 4);
    const y = padding.top + (chartHeight / 4) * i + 4;
    ctx.fillText(`${decimalFormatter.format(value / WAN_UNIT)}萬`, padding.left - 8, y);
  }

  rows.forEach((row, index) => {
    const xCenter = padding.left + ((index + 0.5) / rows.length) * chartWidth;
    const barHeight = (row.monthlyPayment / maxValue) * chartHeight;
    const y = padding.top + chartHeight - barHeight;
    const isBase = row.label === "基準情境";
    ctx.fillStyle = isBase ? "#215f59" : "#b85b34";
    ctx.fillRect(xCenter - barWidth / 2, y, barWidth, barHeight);
    ctx.fillStyle = "#5d5248";
    ctx.textAlign = "center";
    ctx.fillText(row.label, xCenter, height - 12);
  });
}

function formatDateLabel(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function addMonthsToDateString(value, offset, fixedPaymentDay = 0) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const originalDay = date.getDate();
  const targetDay = fixedPaymentDay > 0 ? Math.min(Math.max(fixedPaymentDay, 1), 28) : originalDay;
  date.setDate(1);
  date.setMonth(date.getMonth() + offset);
  date.setDate(targetDay);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function summarizeRowsByYear(rows) {
  const groups = [];

  rows.forEach((row) => {
    const yearIndex = Math.floor((row.month - 1) / 12);
    if (!groups[yearIndex]) {
      groups[yearIndex] = {
        month: yearIndex + 1,
        annualRate: row.annualRate,
        payment: 0,
        principalPaid: 0,
        interest: 0,
        extraPayment: 0,
        penaltyCost: 0,
        remainingBalance: row.remainingBalance,
      };
    }

    groups[yearIndex].payment += row.payment;
    groups[yearIndex].principalPaid += row.principalPaid;
    groups[yearIndex].interest += row.interest;
    groups[yearIndex].extraPayment += row.extraPayment;
    groups[yearIndex].penaltyCost += row.penaltyCost ?? 0;
    groups[yearIndex].remainingBalance = row.remainingBalance;
    groups[yearIndex].annualRate = row.annualRate;
  });

  return groups.filter(Boolean);
}

function renderAnnualSummary(target, rows, emptyMessage) {
  const summaryRows = summarizeRowsByYear(rows);

  if (!summaryRows.length) {
    target.innerHTML = `
      <tr>
        <td colspan="8" class="empty-cell">${emptyMessage}</td>
      </tr>
    `;
    return;
  }

  target.innerHTML = summaryRows.map((row) => `
    <tr>
      <td data-label="年度">${row.month}</td>
      <td data-label="平均年利率">${formatPercent(row.annualRate)}</td>
      <td data-label="年度還款(萬)">${formatWan(row.payment + row.extraPayment + (row.penaltyCost ?? 0))}</td>
      <td data-label="年度本金(萬)">${formatWan(row.principalPaid)}</td>
      <td data-label="年度利息(元)">${formatCurrency(row.interest)}</td>
      <td data-label="年度額外清償(萬)">${row.extraPayment > 0 ? formatWan(row.extraPayment) : "-"}</td>
      <td data-label="年度提前清償費用(元)">${row.penaltyCost > 0 ? formatCurrency(row.penaltyCost) : "-"}</td>
      <td data-label="年末剩餘本金(萬)">${formatWan(row.remainingBalance)}</td>
    </tr>
  `).join("");
}

function accumulateRows(rows, valueKey) {
  let total = 0;
  return rows.map((row) => {
    total += row[valueKey] ?? 0;
    return total;
  });
}

function getChartRows(scenario) {
  if (!scenario?.rows?.length) {
    return [];
  }

  return chartMode === "yearly" ? summarizeRowsByYear(scenario.rows) : scenario.rows;
}

function updateChartModeButtons() {
  elements.chartModeMonthly.classList.toggle("is-active", chartMode === "monthly");
  elements.chartModeYearly.classList.toggle("is-active", chartMode === "yearly");
  elements.prepayModeShorten.classList.toggle("is-active", prepaymentMode === "shorten-term");
  elements.prepayModeReduce.classList.toggle("is-active", prepaymentMode === "reduce-payment");
  elements.paymentViewPaymentInterest.classList.toggle("is-active", paymentChartView === "payment-interest");
  elements.paymentViewPrincipalInterest.classList.toggle("is-active", paymentChartView === "principal-interest");
  elements.paymentViewTotalPayment.classList.toggle("is-active", paymentChartView === "total-payment");
  elements.balanceViewRemaining.classList.toggle("is-active", balanceChartView === "remaining");
  elements.balanceViewCumulativePrincipal.classList.toggle("is-active", balanceChartView === "cumulative-principal");
  elements.balanceViewCumulativeInterest.classList.toggle("is-active", balanceChartView === "cumulative-interest");
}

function renderCharts(baseScenario, prepayScenario = null) {
  if (!baseScenario?.rows?.length) {
    drawEmptyChart(elements.paymentChart, "先完成試算");
    drawEmptyChart(elements.balanceChart, "先完成試算");
    elements.paymentChartTooltip.textContent = "滑動到圖表上查看明細";
    elements.balanceChartTooltip.textContent = "滑動到圖表上查看明細";
    lastChartPayload = null;
    return;
  }

  const baseRows = getChartRows(baseScenario);
  const prepayRows = getChartRows(prepayScenario);
  const xLabel = chartMode === "yearly" ? "年度" : "期數";
  const paymentDatasets = (() => {
    if (paymentChartView === "principal-interest") {
      return [
        {
          label: chartMode === "yearly" ? "年度本金" : "本金",
          color: "#b85b34",
          values: baseRows.map((row) => row.principalPaid),
        },
        {
          label: chartMode === "yearly" ? "年度利息" : "利息",
          color: "#215f59",
          values: baseRows.map((row) => row.interest),
        },
      ];
    }

    if (paymentChartView === "total-payment") {
      return [
        {
          label: chartMode === "yearly" ? "年度還款" : "月付金",
          color: "#b85b34",
          values: baseRows.map((row) => row.payment),
        },
        {
          label: chartMode === "yearly" ? "年度額外清償" : "額外清償",
          color: "#8f3f1e",
          values: baseRows.map((row) => row.extraPayment),
        },
      ];
    }

    return [
      {
        label: chartMode === "yearly" ? "年度還款" : "月付金",
        color: "#b85b34",
        values: baseRows.map((row) => row.payment + row.extraPayment),
      },
      {
        label: chartMode === "yearly" ? "年度利息" : "利息",
        color: "#215f59",
        values: baseRows.map((row) => row.interest),
      },
    ];
  })();

  const paymentChartMeta = drawLineChart(elements.paymentChart, paymentDatasets, { xLabel });

  const baseBalanceValues = (() => {
    if (balanceChartView === "cumulative-principal") {
      return accumulateRows(baseRows, "principalPaid");
    }
    if (balanceChartView === "cumulative-interest") {
      return accumulateRows(baseRows, "interest");
    }
    return baseRows.map((row) => row.remainingBalance);
  })();
  const datasets = [{
    label: "原方案",
    color: "#b85b34",
    values: baseBalanceValues,
  }];

  if (prepayRows.length) {
    const prepayBalanceValues = (() => {
      if (balanceChartView === "cumulative-principal") {
        return accumulateRows(prepayRows, "principalPaid");
      }
      if (balanceChartView === "cumulative-interest") {
        return accumulateRows(prepayRows, "interest");
      }
      return prepayRows.map((row) => row.remainingBalance);
    })();
    datasets.push({
      label: "提前清償後",
      color: "#215f59",
      values: prepayBalanceValues,
    });
  }

  const balanceChartMeta = drawLineChart(elements.balanceChart, datasets, { xLabel });

  lastChartPayload = {
    payment: {
      rows: baseRows,
      meta: paymentChartMeta,
      tooltip: elements.paymentChartTooltip,
      type: "payment",
    },
    balance: {
      rows: baseRows,
      prepayRows,
      meta: balanceChartMeta,
      tooltip: elements.balanceChartTooltip,
      type: "balance",
    },
  };
}

function getHoveredIndex(event, chartMeta) {
  if (!chartMeta || chartMeta.pointCount <= 0) {
    return null;
  }

  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const relativeX = x - chartMeta.padding.left;
  const clampedX = Math.min(Math.max(relativeX, 0), chartMeta.chartWidth);
  const ratio = chartMeta.chartWidth === 0 ? 0 : clampedX / chartMeta.chartWidth;
  return Math.round(ratio * Math.max(chartMeta.pointCount - 1, 0));
}

function updateChartTooltip(chartKey, event) {
  if (!lastChartPayload?.[chartKey]) {
    return;
  }

  const payload = lastChartPayload[chartKey];
  const index = getHoveredIndex(event, payload.meta);
  if (index === null || !payload.rows[index]) {
    return;
  }

  const row = payload.rows[index];
  const label = chartMode === "yearly" ? `第 ${row.month} 年` : `第 ${row.month} 期`;

  if (payload.type === "payment") {
    if (paymentChartView === "principal-interest") {
      payload.tooltip.textContent = `${label}：本金 ${formatWan(row.principalPaid)}，利息 ${formatCurrency(row.interest)}。`;
      return;
    }
    if (paymentChartView === "total-payment") {
      payload.tooltip.textContent = `${label}：月付 ${formatWan(row.payment)}，額外清償 ${formatWan(row.extraPayment)}，提前清償費用 ${formatCurrency(row.penaltyCost ?? 0)}。`;
      return;
    }
    payload.tooltip.textContent = `${label}：還款 ${formatWan(row.payment + row.extraPayment)}，利息 ${formatCurrency(row.interest)}。`;
    return;
  }

  const baseText = balanceChartView === "cumulative-principal"
    ? `原方案累積已還本金 ${formatWan(accumulateRows(payload.rows, "principalPaid")[index])}`
    : balanceChartView === "cumulative-interest"
      ? `原方案累積已付利息 ${formatCurrency(accumulateRows(payload.rows, "interest")[index])}`
      : `原方案剩餘本金 ${formatWan(row.remainingBalance)}`;
  const parts = [`${label}：${baseText}`];
  if (payload.prepayRows?.[index]) {
    if (balanceChartView === "cumulative-principal") {
      parts.push(`提前清償後累積已還本金 ${formatWan(accumulateRows(payload.prepayRows, "principalPaid")[index])}`);
    } else if (balanceChartView === "cumulative-interest") {
      parts.push(`提前清償後累積已付利息 ${formatCurrency(accumulateRows(payload.prepayRows, "interest")[index])}`);
    } else {
      parts.push(`提前清償後 ${formatWan(payload.prepayRows[index].remainingBalance)}`);
    }
  }
  payload.tooltip.textContent = parts.join("，");
}

function resetChartTooltip(chartKey) {
  if (!lastChartPayload?.[chartKey]) {
    return;
  }

  lastChartPayload[chartKey].tooltip.textContent = "滑動到圖表上查看明細";
}

function getNumericImportError(value, label, options = {}) {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const numericValue = Number(value);
  if (!Number.isFinite(numericValue)) {
    return `${label} 不是有效數字。`;
  }

  if (options.integer && !Number.isInteger(numericValue)) {
    return `${label} 需為整數。`;
  }

  if (options.min !== undefined && numericValue < options.min) {
    return `${label} 不可小於 ${options.min}。`;
  }

  return null;
}

function validateImportedState(state) {
  if (!state || typeof state !== "object" || Array.isArray(state)) {
    return "缺少可辨識的設定資料。";
  }

  const fieldRules = [
    ["loanAmount", "貸款金額", { min: 0.01 }],
    ["annualRate", "基準年利率", { min: 0 }],
    ["loanMonths", "總期數", { min: 1, integer: true }],
    ["handlingFee", "開辦費 / 手續費", { min: 0 }],
    ["graceMonths", "寬限期月數", { min: 0, integer: true }],
    ["paymentDay", "固定扣款日", { min: 0, integer: true }],
    ["prepayMonth", "提前清償月份", { min: 0, integer: true }],
    ["prepayAmount", "提前清償金額", { min: 0 }],
    ["prepayFee", "提前清償手續費", { min: 0 }],
    ["prepayPenaltyRate", "提前清償違約金率", { min: 0 }],
    ["indexBaseRate", "目前指標利率", { min: 0 }],
    ["indexSpreadRate", "固定加碼", { min: 0 }],
    ["indexResetMonths", "重訂頻率", { min: 1, integer: true }],
    ["indexFloorRate", "利率下限", { min: 0 }],
    ["indexCapRate", "利率上限", { min: 0 }],
    ["monthlyIncome", "月收入", { min: 0 }],
    ["existingDebtPayment", "既有貸款月付", { min: 0 }],
    ["fixedLivingExpense", "每月固定支出", { min: 0 }],
    ["affordablePayment", "可接受月付上限", { min: 0 }],
    ["stressIncomeDrop", "收入下修幅度", { min: 0 }],
    ["stressRateRise", "升息幅度", { min: 0 }],
    ["stressExpenseShock", "額外支出衝擊", { min: 0 }],
    ["stressSafetyBuffer", "安全餘裕門檻", { min: 0 }],
    ["monteCarloIterations", "Monte Carlo 模擬次數", { min: 100, integer: true }],
    ["monteCarloIncomeVolatility", "Monte Carlo 月收入波動", { min: 0 }],
    ["monteCarloRateVolatility", "Monte Carlo 利率波動", { min: 0 }],
    ["monteCarloExpenseShockProbability", "Monte Carlo 突發支出機率", { min: 0 }],
    ["monteCarloExpenseShockAmount", "Monte Carlo 單次突發支出", { min: 0 }],
    ["refiCurrentBalance", "目前剩餘本金", { min: 0 }],
    ["refiCurrentRate", "目前剩餘利率", { min: 0 }],
    ["refiCurrentMonths", "目前剩餘期數", { min: 0, integer: true }],
    ["refiCurrentGrace", "目前寬限期", { min: 0, integer: true }],
    ["refiExitFee", "提前清償成本", { min: 0 }],
    ["refiNewRate", "新方案利率", { min: 0 }],
    ["refiNewMonths", "新方案期數", { min: 0, integer: true }],
    ["refiNewGrace", "新方案寬限期", { min: 0, integer: true }],
    ["refiNewFee", "新方案手續費", { min: 0 }],
    ["refiCashback", "轉貸補貼 / 回饋", { min: 0 }],
    ["sensitivityStep", "利率變動步長", { min: 0 }],
    ["sensitivityDownCount", "向下模擬組數", { min: 0, integer: true }],
    ["sensitivityUpCount", "向上模擬組數", { min: 0, integer: true }],
    ["matrixTermStep", "期數變動步長", { min: 0, integer: true }],
    ["matrixTermDownCount", "期數縮短組數", { min: 0, integer: true }],
    ["matrixTermUpCount", "期數延長組數", { min: 0, integer: true }],
  ];

  for (const [key, label, options] of fieldRules) {
    const error = getNumericImportError(state[key], label, options);
    if (error) {
      return error;
    }
  }

  if (state.firstPaymentDate && Number.isNaN(new Date(state.firstPaymentDate).getTime())) {
    return "首期日期格式不正確。";
  }

  if (state.reportDate && Number.isNaN(new Date(state.reportDate).getTime())) {
    return "試算日期格式不正確。";
  }

  if (state.paymentDay !== undefined && state.paymentDay !== "" && Number(state.paymentDay) > 28) {
    return "固定扣款日需介於 1 到 28，或留空。";
  }

  if (state.indexedRateEnabled !== undefined && !["on", "off"].includes(state.indexedRateEnabled)) {
    return "指標利率模型設定不正確。";
  }

  if (state.monteCarloExpenseShockProbability !== undefined && Number(state.monteCarloExpenseShockProbability) > 100) {
    return "Monte Carlo 突發支出機率需介於 0 到 100 之間。";
  }

  if (state.chartMode && !["monthly", "yearly"].includes(state.chartMode)) {
    return "圖表模式只接受 monthly 或 yearly。";
  }

  if (state.compareScenarios !== undefined) {
    if (!Array.isArray(state.compareScenarios)) {
      return "銀行方案比較資料格式不正確。";
    }

    for (const [index, scenario] of state.compareScenarios.entries()) {
      if (!scenario || typeof scenario !== "object" || Array.isArray(scenario)) {
        return `比較方案第 ${index + 1} 筆資料格式不正確。`;
      }

      const scenarioRules = [
        ["loanAmount", "貸款金額", { min: 0.01 }],
        ["annualRate", "年利率", { min: 0 }],
        ["months", "總期數", { min: 1, integer: true }],
        ["handlingFee", "手續費", { min: 0 }],
        ["graceMonths", "寬限期", { min: 0, integer: true }],
      ];

      for (const [key, label, options] of scenarioRules) {
        const error = getNumericImportError(scenario[key], `比較方案第 ${index + 1} 筆的${label}`, options);
        if (error) {
          return error;
        }
      }
    }
  }

  if (state.extraPrepayEvents !== undefined) {
    if (!Array.isArray(state.extraPrepayEvents)) {
      return "多筆提前清償資料格式不正確。";
    }

    for (const [index, eventItem] of state.extraPrepayEvents.entries()) {
      if (!eventItem || typeof eventItem !== "object" || Array.isArray(eventItem)) {
        return `多筆提前清償第 ${index + 1} 筆資料格式不正確。`;
      }

      const monthError = getNumericImportError(eventItem.month, `多筆提前清償第 ${index + 1} 筆的月份`, { min: 1, integer: true });
      if (monthError) {
        return monthError;
      }

      const amountError = getNumericImportError(eventItem.amount, `多筆提前清償第 ${index + 1} 筆的金額`, { min: 0 });
      if (amountError) {
        return amountError;
      }

      const feeError = getNumericImportError(eventItem.fee, `多筆提前清償第 ${index + 1} 筆的手續費`, { min: 0 });
      if (feeError) {
        return feeError;
      }

      const penaltyError = getNumericImportError(eventItem.penaltyRate, `多筆提前清償第 ${index + 1} 筆的違約金率`, { min: 0 });
      if (penaltyError) {
        return penaltyError;
      }
    }
  }

  if (state.debtItems !== undefined) {
    if (!Array.isArray(state.debtItems)) {
      return "債務整合資料格式不正確。";
    }

    for (const [index, debtItem] of state.debtItems.entries()) {
      if (!debtItem || typeof debtItem !== "object" || Array.isArray(debtItem)) {
        return `債務資料第 ${index + 1} 筆格式不正確。`;
      }

      const balanceError = getNumericImportError(debtItem.balance, `債務資料第 ${index + 1} 筆的剩餘本金`, { min: 0.01 });
      if (balanceError) {
        return balanceError;
      }
      const rateError = getNumericImportError(debtItem.annualRate, `債務資料第 ${index + 1} 筆的年利率`, { min: 0 });
      if (rateError) {
        return rateError;
      }
      const paymentError = getNumericImportError(debtItem.monthlyPayment, `債務資料第 ${index + 1} 筆的月付金`, { min: 0 });
      if (paymentError) {
        return paymentError;
      }
      const monthsError = getNumericImportError(debtItem.months, `債務資料第 ${index + 1} 筆的剩餘期數`, { min: 1, integer: true });
      if (monthsError) {
        return monthsError;
      }
      const feeError = getNumericImportError(debtItem.settlementFee, `債務資料第 ${index + 1} 筆的清償費用`, { min: 0 });
      if (feeError) {
        return feeError;
      }
    }
  }

  if (state.rateTiers !== undefined) {
    if (!Array.isArray(state.rateTiers)) {
      return "分段利率資料格式不正確。";
    }

    for (const [index, tier] of state.rateTiers.entries()) {
      if (!tier || typeof tier !== "object" || Array.isArray(tier)) {
        return `分段利率第 ${index + 1} 筆資料格式不正確。`;
      }

      const startError = getNumericImportError(tier.startMonth, `分段利率第 ${index + 1} 筆的起始月份`, { min: 1, integer: true });
      if (startError) {
        return startError;
      }

      const endError = getNumericImportError(tier.endMonth, `分段利率第 ${index + 1} 筆的結束月份`, { min: 1, integer: true });
      if (endError) {
        return endError;
      }

      const rateError = getNumericImportError(tier.annualRate, `分段利率第 ${index + 1} 筆的年利率`, { min: 0 });
      if (rateError) {
        return rateError;
      }
    }
  }

  return null;
}

function formatCurrency(value) {
  return currencyFormatter.format(Math.round(Number(value) || 0));
}

function formatWan(value) {
  return `${decimalFormatter.format((Number(value) || 0) / WAN_UNIT)} 萬`;
}

function formatPercent(value) {
  return `${decimalFormatter.format(value)}%`;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function percentile(sortedValues, ratio) {
  if (!sortedValues.length) {
    return null;
  }

  const index = clamp(Math.floor((sortedValues.length - 1) * ratio), 0, sortedValues.length - 1);
  return sortedValues[index];
}

function createSeededRandom(seedText) {
  let hash = 1779033703 ^ seedText.length;
  for (let index = 0; index < seedText.length; index += 1) {
    hash = Math.imul(hash ^ seedText.charCodeAt(index), 3432918353);
    hash = (hash << 13) | (hash >>> 19);
  }

  return () => {
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    const output = (hash ^= hash >>> 16) >>> 0;
    return output / 4294967296;
  };
}

function sampleNormal(random) {
  let u = 0;
  let v = 0;
  while (u === 0) {
    u = random();
  }
  while (v === 0) {
    v = random();
  }
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function formatBreakdownSegmentValue(segment) {
  const usesCurrency = segment.label.includes("利息") || segment.label.includes("費用") || segment.label.includes("手續費");
  return usesCurrency ? formatCurrency(segment.value) : formatWan(segment.value);
}

function updateBreakdownTooltip(event) {
  if (!lastBreakdownPayload?.segments?.length) {
    return;
  }

  const rect = event.target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  const { barX, barY, barWidth, barHeight, segments } = lastBreakdownPayload;

  if (x < barX || x > barX + barWidth || y < barY || y > barY + barHeight) {
    resetBreakdownTooltip();
    return;
  }

  const hoveredSegment = segments.find((segment) => x >= segment.startX && x <= segment.endX);
  if (!hoveredSegment) {
    resetBreakdownTooltip();
    return;
  }

  elements.costBreakdownSummary.textContent = `${hoveredSegment.label}：${formatBreakdownSegmentValue(hoveredSegment)}，占總成本 ${decimalFormatter.format(hoveredSegment.ratio)}%。`;
}

function resetBreakdownTooltip() {
  if (!lastCalculationContext?.breakdownSummary) {
    elements.costBreakdownSummary.textContent = "完成試算後顯示拆解結果";
    return;
  }

  elements.costBreakdownSummary.textContent = lastCalculationContext.breakdownSummary;
}

function setText(ids, value = "-") {
  ids.forEach((id) => {
    elements[id].textContent = value;
  });
}

function renderEmptyTable(target, message) {
  const colspan = target === elements.scheduleBody || target === elements.prepayScheduleBody ? 9 : 7;
  target.innerHTML = `
    <tr>
      <td colspan="${colspan}" class="empty-cell">${message}</td>
    </tr>
  `;
}

function renderAdviceCards(cards) {
  if (!cards.length) {
    elements.adviceList.innerHTML = `<article class="advice-card empty-advice">完成試算後，這裡會自動出現重點建議。</article>`;
    return;
  }

  elements.adviceList.innerHTML = cards.map((card) => `
    <article class="advice-card">
      <strong>${card.title}</strong>
      <span>${card.body}</span>
    </article>
  `).join("");
}

function renderDashboardHighlights(cards) {
  if (!cards.length) {
    elements.dashboardHighlightList.innerHTML = `<article class="advice-card empty-advice">完成試算後，這裡會整理摘要亮點。</article>`;
    return;
  }

  elements.dashboardHighlightList.innerHTML = cards.map((card) => `
    <article class="advice-card snapshot-card">
      <strong>${card.title}</strong>
      <span>${card.body}</span>
    </article>
  `).join("");
}

function formatMatrixMetricValue(key, value) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "-";
  }

  if (key === "monthlyPayment" || key === "totalPayment") {
    return formatWan(value);
  }
  if (key === "totalInterest") {
    return formatCurrency(value);
  }
  if (key === "aprEstimate" || key === "dsr") {
    return formatPercent(value);
  }
  return decimalFormatter.format(value);
}

function getMatrixMetricLabel(key) {
  const labels = {
    monthlyPayment: "月付金",
    totalInterest: "總利息",
    aprEstimate: "APR",
    totalPayment: "總還款",
    dsr: "DSR",
  };
  return labels[key] ?? "月付金";
}

function getMatrixMetricValue(key, scenario, aprEstimateValue, monthlyIncome) {
  if (key === "monthlyPayment") {
    return scenario.regularPayment;
  }
  if (key === "totalInterest") {
    return scenario.totalInterest;
  }
  if (key === "aprEstimate") {
    return aprEstimateValue;
  }
  if (key === "totalPayment") {
    return scenario.totalPayment;
  }
  if (key === "dsr") {
    return monthlyIncome > 0 ? (scenario.regularPayment / monthlyIncome) * 100 : null;
  }
  return scenario.regularPayment;
}

function getMatrixHeatClass(value, minValue, maxValue, betterDirection = "low") {
  if (value === null || minValue === null || maxValue === null || minValue === maxValue) {
    return "matrix-cell-neutral";
  }

  const ratio = (value - minValue) / (maxValue - minValue);
  const normalized = betterDirection === "high" ? 1 - ratio : ratio;
  if (normalized <= 0.2) {
    return "matrix-cell-good";
  }
  if (normalized <= 0.45) {
    return "matrix-cell-fair";
  }
  if (normalized <= 0.7) {
    return "matrix-cell-watch";
  }
  return "matrix-cell-risk";
}

function renderPrepaymentModeComparison(rows) {
  if (!rows.length) {
    elements.prepayModeCompareBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">填入提前清償資料後顯示兩種模式比較</td>
      </tr>
    `;
    return;
  }

  elements.prepayModeCompareBody.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="模式">${row.label}</td>
      <td data-label="月付金(萬)">${formatWan(row.monthlyPayment)}</td>
      <td data-label="總還款(萬)">${formatWan(row.totalPayment)}</td>
      <td data-label="節省利息(元)">${formatCurrency(row.interestSaved)}</td>
      <td data-label="縮短期數(月)">${row.monthsSaved}</td>
    </tr>
  `).join("");
}

function renderPrepayTimingAnalysis(rows) {
  if (!rows.length) {
    elements.bestPrepayMonth.textContent = "-";
    elements.bestPrepayNetSaved.textContent = "-";
    elements.bestPrepayMonthsSaved.textContent = "-";
    elements.bestPrepaySummary.textContent = "填入提前清償金額後，這裡會分析較合適的提前清償月份。";
    elements.prepayTimingBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">填入提前清償金額後顯示最佳時點分析</td>
      </tr>
    `;
    return;
  }

  const bestRow = rows[0];
  elements.bestPrepayMonth.textContent = `第 ${bestRow.month} 期`;
  elements.bestPrepayNetSaved.textContent = formatCurrency(bestRow.netSaved);
  elements.bestPrepayMonthsSaved.textContent = `${bestRow.monthsSaved} 月`;
  elements.bestPrepaySummary.textContent = `以目前提前清償金額來看，第 ${bestRow.month} 期的淨節省最佳，約可多保留 ${formatCurrency(bestRow.netSaved)}，並縮短 ${bestRow.monthsSaved} 個月。`;

  elements.prepayTimingBody.innerHTML = rows.map((row) => `
    <tr>
      <td>${row.month}</td>
      <td>${formatCurrency(row.interestSaved)}</td>
      <td>${formatCurrency(row.penaltyCost)}</td>
      <td>${formatCurrency(row.netSaved)}</td>
      <td>${row.monthsSaved}</td>
    </tr>
  `).join("");
}

function renderSensitivityTable(rows) {
  lastSensitivityRows = rows;

  if (!rows.length) {
    elements.sensitivityBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">完成試算後顯示利率敏感度分析</td>
      </tr>
    `;
    elements.sensitivityChartSummary.textContent = "完成試算後顯示敏感度趨勢";
    drawEmptyChart(elements.sensitivityChart, "尚無敏感度資料");
    return;
  }

  elements.sensitivityBody.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="情境">${row.label}</td>
      <td data-label="年利率">${formatPercent(row.annualRate)}</td>
      <td data-label="月付金(萬)">${formatWan(row.monthlyPayment)}</td>
      <td data-label="總利息(元)">${formatCurrency(row.totalInterest)}</td>
      <td data-label="APR">${row.aprEstimate === null ? "-" : formatPercent(row.aprEstimate)}</td>
    </tr>
  `).join("");

  const baseRow = rows.find((row) => row.label === "基準情境") ?? rows[0];
  elements.sensitivityChartSummary.textContent = `基準利率 ${formatPercent(baseRow.annualRate)} 時，月付約 ${formatWan(baseRow.monthlyPayment)}；可搭配表格查看升降息變化。`;
  drawSensitivityChart(elements.sensitivityChart, rows);
}

function buildRiskAlerts(context) {
  if (!context) {
    return [];
  }

  const alerts = [];
  const aprGap = context.aprEstimate === null ? 0 : context.aprEstimate - context.annualRate;
  const interestShare = context.baseScenario.totalPayment > 0
    ? (context.baseScenario.totalInterest / context.baseScenario.totalPayment) * 100
    : 0;
  const thresholds = context.riskThresholds ?? DEFAULT_RISK_THRESHOLDS;

  if (context.dsr !== null && context.dsr > thresholds.dsrHigh) {
    alerts.push({ level: "high", title: "月付占收入比過高", body: `DSR 約 ${formatPercent(context.dsr)}，目前月付對月收入壓力偏高。` });
  } else if (context.dsr !== null && context.dsr > thresholds.dsrMedium) {
    alerts.push({ level: "medium", title: "月付占收入比偏高", body: `DSR 約 ${formatPercent(context.dsr)}，建議保留更多現金流緩衝。` });
  }

  if (context.overallDebtRatio !== null && context.overallDebtRatio > thresholds.debtHigh) {
    alerts.push({ level: "high", title: "整體負債比過高", body: `貸後整體負債比約 ${formatPercent(context.overallDebtRatio)}，後續承壓能力有限。` });
  } else if (context.overallDebtRatio !== null && context.overallDebtRatio > thresholds.debtMedium) {
    alerts.push({ level: "medium", title: "整體負債比偏高", body: `貸後整體負債比約 ${formatPercent(context.overallDebtRatio)}，建議再比對更低月付方案。` });
  }

  if (context.incomeAfterAllExpenses < 0) {
    alerts.push({ level: "high", title: "貸後現金流為負", body: `扣除總負債與固定支出後約剩 ${formatCurrency(context.incomeAfterAllExpenses)}，現金流不足。` });
  } else if (context.incomeAfterAllExpenses < 10000) {
    alerts.push({ level: "medium", title: "貸後現金流偏緊", body: `扣除總負債與固定支出後約剩 ${formatCurrency(context.incomeAfterAllExpenses)}，緩衝空間有限。` });
  }

  if (aprGap > thresholds.aprGap) {
    alerts.push({ level: "medium", title: "APR 與名目利率差距大", body: `APR 約高出 ${formatPercent(aprGap)}，代表費用對實際成本影響明顯。` });
  }

  if (context.feeRatio >= thresholds.feeRatio) {
    alerts.push({ level: "medium", title: "手續費占比偏高", body: `手續費約占貸款金額 ${formatPercent(context.feeRatio)}，不適合只看表面利率。` });
  }

  if (interestShare >= 20) {
    alerts.push({ level: "medium", title: "總利息占比高", body: `總利息約占總還款 ${formatPercent(interestShare)}，長期成本不可忽視。` });
  }

  const sensitivityBase = context.sensitivityRows?.find((row) => row.label === "基準情境");
  const sensitivityWorst = [...(context.sensitivityRows ?? [])].sort((left, right) => right.monthlyPayment - left.monthlyPayment)[0];
  if (sensitivityBase && sensitivityWorst && sensitivityWorst.monthlyPayment - sensitivityBase.monthlyPayment > context.baseScenario.regularPayment * 0.08) {
    alerts.push({ level: "medium", title: "對升息變動敏感", body: `在較高利率情境下，月付可能增加到 ${formatWan(sensitivityWorst.monthlyPayment)}。` });
  }

  if (context.prepayScenario && context.prepayScenario.totalPenaltyCost > (context.baseScenario.totalInterest - context.prepayScenario.totalInterest) * 0.6) {
    alerts.push({ level: "medium", title: "提前清償成本偏高", body: `提前清償費用約 ${formatCurrency(context.prepayScenario.totalPenaltyCost)}，會吃掉部分節省利息效果。` });
  }

  return alerts;
}

function renderRiskAlerts(alerts) {
  if (!alerts.length) {
    elements.riskHighCount.textContent = "-";
    elements.riskMediumCount.textContent = "-";
    elements.riskSummary.textContent = "-";
    elements.riskAlertList.innerHTML = `<article class="advice-card empty-advice">完成試算後，這裡會顯示風險警示。</article>`;
    return;
  }

  const highCount = alerts.filter((alert) => alert.level === "high").length;
  const mediumCount = alerts.filter((alert) => alert.level === "medium").length;
  const topLevel = highCount > 0 ? "高" : mediumCount > 0 ? "中" : "低";
  elements.riskHighCount.textContent = `${highCount} 項`;
  elements.riskMediumCount.textContent = `${mediumCount} 項`;
  elements.riskSummary.textContent = `${topLevel}風險為主`;
  elements.riskAlertList.innerHTML = alerts.map((alert) => `
    <article class="advice-card risk-card-${alert.level}">
      <span class="risk-level risk-level-${alert.level}">${alert.level === "high" ? "高風險" : alert.level === "medium" ? "中風險" : "低風險"}</span>
      <strong>${alert.title}</strong>
      <span>${alert.body}</span>
    </article>
  `).join("");
}

function renderDifferenceAnalysis(mainScenario, compareRows, mainMeta) {
  if (!mainScenario || !compareRows.length) {
    elements.diffTargetName.textContent = "-";
    elements.diffAprGap.textContent = "-";
    elements.diffMonthlyGap.textContent = "-";
    elements.diffAnalysisSummary.textContent = "填入比較資料後，這裡會顯示主方案與最佳對照方案的差異分析。";
    elements.diffAnalysisBody.innerHTML = `<tr><td colspan="4" class="empty-cell">填入比較資料後顯示貸款條件差異分析</td></tr>`;
    return;
  }

  const target = getSortedComparisonRows(decorateComparisonRows(compareRows))[0];
  const mainApr = mainMeta.aprEstimate;
  const aprGap = target.aprEstimate === null || mainApr === null ? null : target.aprEstimate - mainApr;
  const monthlyGap = target.monthlyPayment - mainScenario.regularPayment;
  elements.diffTargetName.textContent = target.name;
  elements.diffAprGap.textContent = aprGap === null ? "-" : (aprGap === 0 ? "持平" : `${aprGap > 0 ? "+" : ""}${formatPercent(aprGap)}`);
  elements.diffMonthlyGap.textContent = monthlyGap === 0 ? "持平" : `${monthlyGap > 0 ? "+" : "-"}${formatWan(Math.abs(monthlyGap))}`;
  elements.diffAnalysisSummary.textContent = `${target.name} 為目前排序第一的對照方案，可用來快速比對主方案的成本與條件差異。`;

  const rows = [
    ["貸款金額", formatWan(mainMeta.loanAmount), formatWan(target.loanAmount * WAN_UNIT), "比較本金規模是否一致"],
    ["名目利率", formatPercent(mainMeta.annualRate), formatPercent(target.annualRate), target.annualRate > mainMeta.annualRate ? "對照方案利率較高" : target.annualRate < mainMeta.annualRate ? "對照方案利率較低" : "利率相同"],
    ["期數", `${mainMeta.loanMonths} 月`, `${target.months} 月`, target.months > mainMeta.loanMonths ? "對照方案期數較長" : target.months < mainMeta.loanMonths ? "對照方案期數較短" : "期數相同"],
    ["手續費", formatCurrency(mainMeta.handlingFee), formatCurrency(target.handlingFee), target.handlingFee > mainMeta.handlingFee ? "對照方案前期費用較高" : target.handlingFee < mainMeta.handlingFee ? "對照方案前期費用較低" : "手續費相同"],
    ["月付金", formatWan(mainScenario.regularPayment), formatWan(target.monthlyPayment), monthlyGap > 0 ? "對照方案月付較高" : monthlyGap < 0 ? "對照方案月付較低" : "月付相同"],
    ["總利息", formatCurrency(mainScenario.totalInterest), formatCurrency(target.totalInterest), target.totalInterest > mainScenario.totalInterest ? "對照方案利息較高" : target.totalInterest < mainScenario.totalInterest ? "對照方案利息較低" : "利息相同"],
    ["APR", mainApr === null ? "-" : formatPercent(mainApr), target.aprEstimate === null ? "-" : formatPercent(target.aprEstimate), aprGap === null ? "無法比較 APR" : aprGap > 0 ? "對照方案實際成本較高" : aprGap < 0 ? "對照方案實際成本較低" : "APR 相同"],
  ];

  elements.diffAnalysisBody.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="比較項目">${row[0]}</td>
      <td data-label="目前主方案">${row[1]}</td>
      <td data-label="對照方案">${row[2]}</td>
      <td data-label="差異說明">${row[3]}</td>
    </tr>
  `).join("");
}

function getStressStatusLabel(surplusAfterExpenses, safetyBuffer) {
  if (surplusAfterExpenses < 0) {
    return "現金流為負";
  }
  if (surplusAfterExpenses < safetyBuffer) {
    return "緩衝偏低";
  }
  return "可承受";
}

function buildStressTestRows(options) {
  const {
    principal,
    annualRate,
    totalMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    incomeDropRate,
    rateRise,
    expenseShock,
    safetyBuffer,
  } = options;

  if (!(monthlyIncome > 0)) {
    return [];
  }

  const buildScenarioSnapshot = (label, overrides = {}) => {
    const scenarioRateTiers = rateTiers.length
      ? rateTiers.map((tier) => ({ ...tier, annualRate: Math.max(0, tier.annualRate + (overrides.rateRise ?? 0)) }))
      : [];
    const scenario = buildSchedule({
      principal,
      annualRate: Math.max(0, annualRate + (overrides.rateRise ?? 0)),
      totalMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      rateTiers: scenarioRateTiers,
    });
    const scenarioIncome = monthlyIncome * (1 - (overrides.incomeDropRate ?? 0) / 100);
    const scenarioLivingExpense = fixedLivingExpense + (overrides.expenseShock ?? 0);
    const totalDebt = scenario.regularPayment + existingDebtPayment;
    const surplusAfterDebt = scenarioIncome - totalDebt;
    const surplusAfterExpenses = surplusAfterDebt - scenarioLivingExpense;
    const dsr = scenarioIncome > 0 ? (scenario.regularPayment / scenarioIncome) * 100 : null;

    return {
      label,
      monthlyPayment: scenario.regularPayment,
      dsr,
      totalDebt,
      surplusAfterDebt,
      surplusAfterExpenses,
      status: getStressStatusLabel(surplusAfterExpenses, safetyBuffer),
    };
  };

  return [
    buildScenarioSnapshot("基準", {}),
    buildScenarioSnapshot(`收入 -${decimalFormatter.format(incomeDropRate)}%`, { incomeDropRate }),
    buildScenarioSnapshot(`升息 +${decimalFormatter.format(rateRise)}%`, { rateRise }),
    buildScenarioSnapshot(`支出 +${formatCurrency(expenseShock)}`, { expenseShock }),
    buildScenarioSnapshot("綜合壓力", { incomeDropRate, rateRise, expenseShock }),
  ];
}

function estimateStressBreakRate(options) {
  const {
    principal,
    annualRate,
    totalMonths,
    graceMonths,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    safetyBuffer,
  } = options;

  if (!(monthlyIncome > 0)) {
    return null;
  }

  const surplusAtRate = (scenarioRate) => {
    const schedule = buildSchedule({
      principal,
      annualRate: scenarioRate,
      totalMonths,
      graceMonths,
    });
    return monthlyIncome - existingDebtPayment - fixedLivingExpense - schedule.regularPayment - safetyBuffer;
  };

  if (surplusAtRate(annualRate) < 0) {
    return annualRate;
  }

  let low = annualRate;
  let high = Math.max(annualRate + 0.5, 0.5);
  let highSurplus = surplusAtRate(high);
  let attempts = 0;
  while (highSurplus >= 0 && attempts < 24) {
    low = high;
    high += 0.5;
    highSurplus = surplusAtRate(high);
    attempts += 1;
  }

  if (highSurplus >= 0) {
    return null;
  }

  for (let index = 0; index < 36; index += 1) {
    const mid = (low + high) / 2;
    if (surplusAtRate(mid) >= 0) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return low;
}

function renderStressTest(rows, breakRate, safetyBuffer) {
  if (!rows.length) {
    elements.stressBaseSurplus.textContent = "-";
    elements.stressWorstSurplus.textContent = "-";
    elements.stressBreakRate.textContent = "-";
    elements.stressTestSummary.textContent = "填入月收入與壓力參數後，這裡會顯示現金流壓力測試結果。";
    elements.stressTestBody.innerHTML = `<tr><td colspan="6" class="empty-cell">完成試算後顯示現金流壓力測試。</td></tr>`;
    return;
  }

  const baseRow = rows[0];
  const worstRow = [...rows].sort((left, right) => left.surplusAfterExpenses - right.surplusAfterExpenses)[0];
  elements.stressBaseSurplus.textContent = formatCurrency(baseRow.surplusAfterExpenses);
  elements.stressWorstSurplus.textContent = formatCurrency(worstRow.surplusAfterExpenses);
  elements.stressBreakRate.textContent = breakRate === null ? `高於 ${formatPercent(12)}` : formatPercent(breakRate);
  elements.stressTestSummary.textContent = worstRow.surplusAfterExpenses < 0
    ? `最差情境為「${worstRow.label}」，扣除固定支出後約短少 ${formatCurrency(Math.abs(worstRow.surplusAfterExpenses))}。`
    : `最差情境為「${worstRow.label}」，扣除固定支出後仍約保留 ${formatCurrency(worstRow.surplusAfterExpenses)}；安全門檻設定為 ${formatCurrency(safetyBuffer)}。`;

  elements.stressTestBody.innerHTML = rows.map((row) => `
    <tr class="${row.surplusAfterExpenses < 0 ? "stress-row-negative" : row.surplusAfterExpenses < safetyBuffer ? "stress-row-warning" : ""}">
      <td data-label="情境">${row.label}</td>
      <td data-label="月付金(萬)">${formatWan(row.monthlyPayment)}</td>
      <td data-label="DSR">${row.dsr === null ? "-" : formatPercent(row.dsr)}</td>
      <td data-label="總月負債">${formatCurrency(row.totalDebt)}</td>
      <td data-label="貸後餘額">${formatCurrency(row.surplusAfterExpenses)}</td>
      <td data-label="壓力判讀">${row.status}</td>
    </tr>
  `).join("");
}

function buildMonteCarloRateTiers(totalMonths, annualRate, baseRateTiers, resetMonths, random, rateVolatility) {
  if (!(rateVolatility > 0)) {
    return baseRateTiers.length ? baseRateTiers : [];
  }

  const tiers = [];
  let startMonth = 1;
  let previousShock = 0;
  while (startMonth <= totalMonths) {
    const endMonth = Math.min(totalMonths, startMonth + resetMonths - 1);
    const baseRate = baseRateTiers.length
      ? getTierForMonth(startMonth, baseRateTiers, annualRate)
      : annualRate;
    previousShock += sampleNormal(random) * rateVolatility;
    tiers.push({
      startMonth,
      endMonth,
      annualRate: Math.max(0, baseRate + previousShock),
    });
    startMonth = endMonth + 1;
  }
  return tiers;
}

function runMonteCarloStressTest(options) {
  const {
    principal,
    annualRate,
    totalMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    safetyBuffer,
    iterations,
    incomeVolatility,
    rateVolatility,
    expenseShockProbability,
    expenseShockAmount,
    rateResetMonths,
    seedText,
  } = options;

  if (!(monthlyIncome > 0) || !(iterations >= 100)) {
    return null;
  }

  const random = createSeededRandom(seedText);
  const results = [];

  for (let iteration = 0; iteration < iterations; iteration += 1) {
    const simulatedTiers = buildMonteCarloRateTiers(
      totalMonths,
      annualRate,
      rateTiers,
      rateResetMonths,
      random,
      rateVolatility,
    );
    const schedule = buildSchedule({
      principal,
      annualRate,
      totalMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      rateTiers: simulatedTiers,
    });

    let worstSurplus = Number.POSITIVE_INFINITY;
    let negativeMonthCount = 0;

    schedule.rows.forEach((row) => {
      const sampledIncome = Math.max(0, monthlyIncome * (1 + sampleNormal(random) * incomeVolatility / 100));
      const shockCost = random() < expenseShockProbability / 100 ? expenseShockAmount : 0;
      const surplus = sampledIncome - existingDebtPayment - fixedLivingExpense - shockCost - row.payment - row.extraPayment - row.penaltyCost;
      worstSurplus = Math.min(worstSurplus, surplus);
      if (surplus < 0) {
        negativeMonthCount += 1;
      }
    });

    results.push({
      worstSurplus,
      negativeMonthCount,
      status: worstSurplus < 0 ? "negative" : worstSurplus < safetyBuffer ? "warning" : "safe",
    });
  }

  const sortedWorst = results.map((item) => item.worstSurplus).sort((left, right) => left - right);
  const failCount = results.filter((item) => item.worstSurplus < 0).length;
  const warningCount = results.filter((item) => item.worstSurplus >= 0 && item.worstSurplus < safetyBuffer).length;
  const safeCount = results.length - failCount - warningCount;
  const getBucketRepresentative = (predicate) => {
    const values = results
      .filter(predicate)
      .map((item) => item.worstSurplus)
      .sort((left, right) => left - right);
    return percentile(values, 0.5);
  };
  const buckets = [
    {
      label: "現金流為負",
      count: failCount,
      ratio: results.length ? failCount / results.length : 0,
      representative: getBucketRepresentative((item) => item.worstSurplus < 0),
    },
    {
      label: "低於安全緩衝",
      count: warningCount,
      ratio: results.length ? warningCount / results.length : 0,
      representative: getBucketRepresentative((item) => item.worstSurplus >= 0 && item.worstSurplus < safetyBuffer),
    },
    {
      label: "高於安全緩衝",
      count: safeCount,
      ratio: results.length ? safeCount / results.length : 0,
      representative: getBucketRepresentative((item) => item.worstSurplus >= safetyBuffer),
    },
  ];

  return {
    iterations,
    failRate: results.length ? failCount / results.length : 0,
    medianWorstSurplus: percentile(sortedWorst, 0.5),
    p10WorstSurplus: percentile(sortedWorst, 0.1),
    p90WorstSurplus: percentile(sortedWorst, 0.9),
    buckets,
  };
}

function renderMonteCarloStress(result, safetyBuffer) {
  if (!result) {
    elements.monteCarloFailRate.textContent = "-";
    elements.monteCarloMedianSurplus.textContent = "-";
    elements.monteCarloP10Surplus.textContent = "-";
    elements.monteCarloSummary.textContent = "填入月收入後，這裡會顯示 Monte Carlo 現金流壓力測試結果。";
    elements.monteCarloBody.innerHTML = `<tr><td colspan="4" class="empty-cell">完成試算後顯示 Monte Carlo 壓力測試。</td></tr>`;
    return;
  }

  elements.monteCarloFailRate.textContent = formatPercent(result.failRate * 100);
  elements.monteCarloMedianSurplus.textContent = result.medianWorstSurplus === null ? "-" : formatCurrency(result.medianWorstSurplus);
  elements.monteCarloP10Surplus.textContent = result.p10WorstSurplus === null ? "-" : formatCurrency(result.p10WorstSurplus);
  elements.monteCarloSummary.textContent = result.failRate > 0.3
    ? `共模擬 ${result.iterations} 次，現金流失守機率約 ${formatPercent(result.failRate * 100)}，屬於偏高風險；安全緩衝門檻為 ${formatCurrency(safetyBuffer)}。`
    : `共模擬 ${result.iterations} 次，現金流失守機率約 ${formatPercent(result.failRate * 100)}；中位最差餘額約 ${formatCurrency(result.medianWorstSurplus ?? 0)}。`;
  elements.monteCarloBody.innerHTML = result.buckets.map((bucket) => `
    <tr>
      <td data-label="區間">${bucket.label}</td>
      <td data-label="筆數">${bucket.count}</td>
      <td data-label="占比">${formatPercent(bucket.ratio * 100)}</td>
      <td data-label="代表最差餘額">${bucket.representative === null ? "-" : formatCurrency(bucket.representative)}</td>
    </tr>
  `).join("");
}

function buildDebtConsolidationAnalysis(options) {
  const {
    debtItems,
    loanAmountValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
  } = options;

  if (!debtItems.length) {
    return { enabled: false };
  }

  const sortedDebts = [...debtItems].sort((left, right) => {
    if (right.annualRate !== left.annualRate) {
      return right.annualRate - left.annualRate;
    }
    return right.monthlyPayment - left.monthlyPayment;
  });

  const totalBalance = sortedDebts.reduce((sum, item) => sum + item.balance, 0);
  const currentMonthly = sortedDebts.reduce((sum, item) => sum + item.monthlyPayment, 0);
  const currentTotalCost = sortedDebts.reduce((sum, item) => sum + item.monthlyPayment * item.months + item.settlementFee, 0);
  const availablePrincipal = Math.min(loanAmountValue, totalBalance);
  let remainingBudget = availablePrincipal;
  let replacedMonthly = 0;
  let replacedBalance = 0;
  let replacedSettlementFee = 0;
  let remainingMonthly = 0;
  let remainingTotalCost = 0;
  let replacedCount = 0;
  const coveredNames = [];

  sortedDebts.forEach((item) => {
    if (remainingBudget >= item.balance) {
      remainingBudget -= item.balance;
      replacedMonthly += item.monthlyPayment;
      replacedBalance += item.balance;
      replacedSettlementFee += item.settlementFee;
      replacedCount += 1;
      coveredNames.push(item.name);
    } else {
      remainingMonthly += item.monthlyPayment;
      remainingTotalCost += item.monthlyPayment * item.months + item.settlementFee;
    }
  });

  if (!(replacedBalance > 0)) {
    return {
      enabled: true,
      valid: false,
      message: "目前主方案貸款金額不足以覆蓋任何一筆債務本金，暫不建議作為整合貸款。",
    };
  }

  const consolidationSchedule = buildSchedule({
    principal: replacedBalance,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers: rateTiers.length ? rateTiers : [],
  });
  const afterMonthly = consolidationSchedule.regularPayment + remainingMonthly;
  const afterTotalCost = consolidationSchedule.totalPayment + replacedSettlementFee + remainingTotalCost;
  const monthlyGap = afterMonthly - currentMonthly;
  const totalSaved = currentTotalCost - afterTotalCost;
  const coverageRatio = totalBalance > 0 ? (replacedBalance / totalBalance) * 100 : 0;

  return {
    enabled: true,
    valid: true,
    replacedCount,
    coveredNames,
    currentMonthly,
    afterMonthly,
    monthlyGap,
    currentTotalCost,
    afterTotalCost,
    totalSaved,
    totalBalance,
    replacedBalance,
    coverageRatio,
    consolidationSchedule,
    replacedSettlementFee,
    remainingMonthly,
  };
}

function renderDebtConsolidationAnalysis(result) {
  if (!result?.enabled) {
    elements.debtConsolidationMonthlyGap.textContent = "-";
    elements.debtConsolidationTotalSaved.textContent = "-";
    elements.debtConsolidationCoverage.textContent = "-";
    elements.debtConsolidationSummary.textContent = "填入多筆債務資料後，這裡會顯示債務整合建議。";
    elements.debtConsolidationBody.innerHTML = `<tr><td colspan="4" class="empty-cell">完成輸入後顯示債務整合分析。</td></tr>`;
    return;
  }

  if (!result.valid) {
    elements.debtConsolidationMonthlyGap.textContent = "-";
    elements.debtConsolidationTotalSaved.textContent = "-";
    elements.debtConsolidationCoverage.textContent = "-";
    elements.debtConsolidationSummary.textContent = result.message;
    elements.debtConsolidationBody.innerHTML = `<tr><td colspan="4" class="empty-cell">${result.message}</td></tr>`;
    return;
  }

  elements.debtConsolidationMonthlyGap.textContent = result.monthlyGap === 0
    ? "持平"
    : result.monthlyGap < 0
      ? `少 ${formatCurrency(Math.abs(result.monthlyGap))}`
      : `多 ${formatCurrency(result.monthlyGap)}`;
  elements.debtConsolidationTotalSaved.textContent = result.totalSaved === 0
    ? "持平"
    : result.totalSaved > 0
      ? `省 ${formatCurrency(result.totalSaved)}`
      : `多 ${formatCurrency(Math.abs(result.totalSaved))}`;
  elements.debtConsolidationCoverage.textContent = formatPercent(result.coverageRatio);
  elements.debtConsolidationSummary.textContent = result.totalSaved > 0
    ? `目前主方案可覆蓋約 ${formatPercent(result.coverageRatio)} 的既有債務本金，整合後月付約 ${result.monthlyGap < 0 ? "下降" : "上升"} ${formatCurrency(Math.abs(result.monthlyGap))}，整體成本估計可省 ${formatCurrency(result.totalSaved)}。`
    : `目前主方案可覆蓋約 ${formatPercent(result.coverageRatio)} 的既有債務本金，但整合後整體成本可能增加 ${formatCurrency(Math.abs(result.totalSaved))}，較偏向用月付換總成本。`;

  const rows = [
    ["總月付", formatCurrency(result.currentMonthly), formatCurrency(result.afterMonthly), result.monthlyGap < 0 ? "整合後月付較低" : result.monthlyGap > 0 ? "整合後月付較高" : "整合前後相同"],
    ["總成本", formatCurrency(result.currentTotalCost), formatCurrency(result.afterTotalCost), result.totalSaved > 0 ? "整合後總成本較低" : result.totalSaved < 0 ? "整合後總成本較高" : "整合前後相同"],
    ["已覆蓋本金", formatWan(result.totalBalance), formatWan(result.replacedBalance), `已整合 ${result.replacedCount} 筆，覆蓋率 ${formatPercent(result.coverageRatio)}`],
    ["剩餘其他債務月付", formatCurrency(result.currentMonthly), formatCurrency(result.remainingMonthly), result.remainingMonthly > 0 ? "仍有未整合債務需持續繳款" : "已全部整合"],
  ];

  elements.debtConsolidationBody.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="項目">${row[0]}</td>
      <td data-label="整合前">${row[1]}</td>
      <td data-label="整合後">${row[2]}</td>
      <td data-label="說明">${row[3]}</td>
    </tr>
  `).join("");
}

function buildDecisionReport(context) {
  if (!context?.baseScenario) {
    return "";
  }

  const bestCompare = buildComparisonRows().length
    ? getSortedComparisonRows(decorateComparisonRows(buildComparisonRows()))[0]
    : null;
  const lines = [
    "【信用貸款決策報告】",
    `貸款條件：${formatWan(context.loanAmount)}，${formatPercent(context.annualRate)}，${context.loanMonths} 期，手續費 ${formatCurrency(context.handlingFee)}。`,
    `核心結果：月付約 ${formatWan(context.baseScenario.regularPayment)}，總還款 ${formatWan(context.baseScenario.totalPayment)}，總利息 ${formatCurrency(context.baseScenario.totalInterest)}，APR 約 ${context.aprEstimate === null ? "-" : formatPercent(context.aprEstimate)}。`,
    context.indexedRate?.enabled ? `利率模型：已啟用指標利率路徑，${context.indexedRate.summary}` : "利率模型：未啟用指標利率模型。",
    context.dsr === null ? "收入壓力：未填月收入，無法判斷 DSR。" : `收入壓力：DSR 約 ${formatPercent(context.dsr)}，整體負債比約 ${context.overallDebtRatio === null ? "-" : formatPercent(context.overallDebtRatio)}，扣除固定支出後每月餘額約 ${formatCurrency(context.incomeAfterAllExpenses)}。`,
    `壓力測試：${elements.stressTestSummary.textContent}`,
    `Monte Carlo：${elements.monteCarloSummary.textContent}`,
    context.debtConsolidation?.enabled ? `債務整合：${elements.debtConsolidationSummary.textContent}` : "債務整合：未輸入多筆債務資料。",
    context.prepayScenario ? `提前清償：${elements.prepayStatus.textContent}` : "提前清償：未設定提前清償情境。",
    bestCompare ? `方案比較：目前 ${bestCompare.name} 排名第 1，月付 ${formatWan(bestCompare.monthlyPayment)}，APR ${bestCompare.aprEstimate === null ? "-" : formatPercent(bestCompare.aprEstimate)}。` : "方案比較：未輸入其他銀行比較方案。",
    `主要風險：${elements.dashboardPrimaryRisk.textContent}。`,
    `建議結論：${elements.dashboardHealthBand.textContent === "-" ? "請先完成試算。" : elements.dashboardHealthBand.textContent === "穩健" ? "可進一步洽談條件與文件準備。" : elements.dashboardHealthBand.textContent === "可控" ? "可申辦，但建議再比一輪 APR 與費用。" : elements.dashboardHealthBand.textContent === "偏緊" ? "建議先壓低月付或縮小額度再評估。" : "建議先處理負債或調整借款規模，避免現金流過緊。"}`
  ];

  return lines.filter(Boolean).join("\n");
}

function renderDecisionReport(context) {
  const reportText = buildDecisionReport(context);
  elements.decisionReportText.value = reportText;
  elements.decisionReportStatus.textContent = reportText
    ? "決策報告已生成，可直接複製到 Email、簡報或內部簽核。"
    : "完成試算後會產生決策報告。";
}

function buildDashboardSnapshot(context) {
  if (!context?.baseScenario) {
    return null;
  }

  const alerts = buildRiskAlerts(context);
  const highCount = alerts.filter((alert) => alert.level === "high").length;
  const mediumCount = alerts.filter((alert) => alert.level === "medium").length;
  let score = 100 - highCount * 22 - mediumCount * 9;

  if (context.stressWorstSurplus !== null && context.stressWorstSurplus < 0) {
    score -= 18;
  } else if (context.stressWorstSurplus !== null && context.stressWorstSurplus < context.stressSafetyBuffer) {
    score -= 8;
  }

  score = Math.max(0, Math.min(100, Math.round(score)));
  const band = score >= 80 ? "穩健" : score >= 65 ? "可控" : score >= 45 ? "偏緊" : "高壓";
  const primaryRisk = alerts[0]?.title ?? "無明顯高風險";
  const compareRows = buildComparisonRows();
  const bestCompare = compareRows.length ? getSortedComparisonRows(decorateComparisonRows(compareRows))[0] : null;
  const refiSummary = context.refinanceState?.enabled && context.refinanceState.valid
    ? buildRefinanceComparison(context.refinanceState.values)
    : null;

  const highlightCards = [
    {
      title: "貸款核心條件",
      body: `${formatWan(context.loanAmount)}、${formatPercent(context.annualRate)}、${context.loanMonths} 期，月付約 ${formatWan(context.baseScenario.regularPayment)}。`,
    },
    {
      title: "貸後現金流",
      body: context.monthlyIncome > 0
        ? `DSR 約 ${context.dsr === null ? "-" : formatPercent(context.dsr)}，扣除負債與固定支出後約剩 ${formatCurrency(context.incomeAfterAllExpenses)}。`
        : "未輸入月收入，無法判斷貸後現金流。 ",
    },
    {
      title: "壓力測試",
      body: context.stressWorstLabel
        ? `最差情境為「${context.stressWorstLabel}」，餘額約 ${formatCurrency(context.stressWorstSurplus)}，臨界利率約 ${context.stressBreakRateLabel}。`
        : "未輸入收入資料，尚未產生壓力測試。 ",
    },
  ];

  if (bestCompare) {
    highlightCards.push({
      title: "方案比較領先者",
      body: `${bestCompare.name} 目前排名第 1，月付 ${formatWan(bestCompare.monthlyPayment)}，APR ${bestCompare.aprEstimate === null ? "-" : formatPercent(bestCompare.aprEstimate)}。`,
    });
  }

  if (refiSummary) {
    highlightCards.push({
      title: "轉貸判讀",
      body: refiSummary.totalSaved > 0
        ? `若改貸新方案，估計可節省約 ${formatCurrency(refiSummary.totalSaved)}，回收期約 ${refiSummary.breakEvenMonth === null ? "無法回收" : `${refiSummary.breakEvenMonth} 期`}。`
        : `若改貸新方案，總成本可能增加約 ${formatCurrency(Math.abs(refiSummary.totalSaved))}。`,
    });
  }

  if (context.debtConsolidation?.enabled && context.debtConsolidation.valid) {
    highlightCards.push({
      title: "債務整合建議",
      body: context.debtConsolidation.totalSaved > 0
        ? `可整合 ${context.debtConsolidation.replacedCount} 筆債務，覆蓋率 ${formatPercent(context.debtConsolidation.coverageRatio)}，總成本估計可省 ${formatCurrency(context.debtConsolidation.totalSaved)}。`
        : `可整合 ${context.debtConsolidation.replacedCount} 筆債務，但整體成本可能增加 ${formatCurrency(Math.abs(context.debtConsolidation.totalSaved))}。`,
    });
  }

  const snapshotText = [
    `【信用貸款儀表板快照】`,
    `綜合健康分數：${score} 分（${band}）`,
    `貸款條件：${formatWan(context.loanAmount)} / ${formatPercent(context.annualRate)} / ${context.loanMonths} 期 / 月付約 ${formatWan(context.baseScenario.regularPayment)}`,
    `APR：${context.aprEstimate === null ? "-" : formatPercent(context.aprEstimate)}，總利息：${formatCurrency(context.baseScenario.totalInterest)}`,
    `貸後現金流：${context.monthlyIncome > 0 ? `DSR ${context.dsr === null ? "-" : formatPercent(context.dsr)}，扣除固定支出後約剩 ${formatCurrency(context.incomeAfterAllExpenses)}` : "未提供收入資料"}`,
    `主要風險：${primaryRisk}`,
    context.stressWorstLabel ? `壓力測試：最差情境「${context.stressWorstLabel}」，餘額 ${formatCurrency(context.stressWorstSurplus)}，臨界利率 ${context.stressBreakRateLabel}` : null,
    context.monteCarloResult ? `Monte Carlo：失守機率約 ${formatPercent(context.monteCarloResult.failRate * 100)}，中位最差餘額 ${formatCurrency(context.monteCarloResult.medianWorstSurplus ?? 0)}` : null,
    context.debtConsolidation?.enabled ? `債務整合：${elements.debtConsolidationSummary.textContent}` : null,
    bestCompare ? `方案比較：${bestCompare.name} 暫居第一，APR ${bestCompare.aprEstimate === null ? "-" : formatPercent(bestCompare.aprEstimate)}` : null,
    refiSummary ? `轉貸比較：${refiSummary.totalSaved > 0 ? `可省 ${formatCurrency(refiSummary.totalSaved)}` : `可能多付 ${formatCurrency(Math.abs(refiSummary.totalSaved))}`}` : null,
  ].filter(Boolean).join("\n");

  return {
    score,
    band,
    primaryRisk,
    highlightCards,
    snapshotText,
  };
}

function renderDashboardSnapshot(snapshot) {
  if (!snapshot) {
    elements.dashboardHealthScore.textContent = "-";
    elements.dashboardHealthBand.textContent = "-";
    elements.dashboardPrimaryRisk.textContent = "-";
    elements.dashboardSnapshotText.value = "";
    elements.dashboardSnapshotStatus.textContent = "完成試算後可一鍵複製。";
    renderDashboardHighlights([]);
    return;
  }

  elements.dashboardHealthScore.textContent = `${snapshot.score} 分`;
  elements.dashboardHealthBand.textContent = snapshot.band;
  elements.dashboardPrimaryRisk.textContent = snapshot.primaryRisk;
  elements.dashboardSnapshotText.value = snapshot.snapshotText;
  elements.dashboardSnapshotStatus.textContent = "可直接複製到訊息、筆記或報告。";
  renderDashboardHighlights(snapshot.highlightCards);
}

function buildSensitivityMatrix(options) {
  const {
    loanAmountValue,
    handlingFeeValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    monthlyIncome,
    rateStep,
    rateDownCount,
    rateUpCount,
    termStep,
    termDownCount,
    termUpCount,
    metricKey,
  } = options;

  const rateOffsets = [];
  for (let offset = -rateDownCount; offset <= rateUpCount; offset += 1) {
    rateOffsets.push(offset);
  }

  const termOffsets = [];
  for (let offset = -termDownCount; offset <= termUpCount; offset += 1) {
    termOffsets.push(offset);
  }

  const columnDefs = termOffsets
    .map((offset) => {
      const months = loanMonths + offset * termStep;
      if (months <= graceMonths || months <= 0) {
        return null;
      }
      return {
        offset,
        months,
        label: offset === 0 ? `基準 ${loanMonths} 期` : `${offset > 0 ? "+" : ""}${offset * termStep} 月`,
      };
    })
    .filter(Boolean);

  const rows = rateOffsets.map((offset) => {
    const scenarioRate = Math.max(0, annualRate + offset * rateStep);
    const scenarioRateTiers = rateTiers.length ? shiftRateTiers(rateTiers, offset * rateStep) : [];
    const cells = columnDefs.map((column) => {
      const scenario = buildSchedule({
        principal: loanAmountValue,
        annualRate: scenarioRate,
        totalMonths: column.months,
        graceMonths,
        firstPaymentDate,
        paymentDay,
        rateTiers: scenarioRateTiers,
      });
      const aprValue = estimateApr(loanAmountValue - handlingFeeValue, scenario.rows);
      return {
        rate: scenarioRate,
        months: column.months,
        value: getMatrixMetricValue(metricKey, scenario, aprValue, monthlyIncome),
        scenario,
        aprValue,
      };
    });

    return {
      label: offset === 0 ? `基準 ${formatPercent(scenarioRate)}` : `${offset > 0 ? "+" : ""}${decimalFormatter.format(offset * rateStep)}%`,
      rate: scenarioRate,
      cells,
    };
  });

  return {
    metricKey,
    metricLabel: getMatrixMetricLabel(metricKey),
    columns: columnDefs,
    rows,
  };
}

function renderSensitivityMatrix(matrix) {
  lastSensitivityMatrix = matrix;

  if (!matrix?.rows?.length || !matrix.columns.length) {
    elements.sensitivityMatrixSummary.textContent = "完成試算後顯示利率 x 期數雙軸矩陣";
    elements.sensitivityMatrixHead.innerHTML = `<tr><th>利率 \\ 期數</th><th>基準</th></tr>`;
    elements.sensitivityMatrixBody.innerHTML = `<tr><td colspan="2" class="empty-cell">完成試算後顯示條件敏感度矩陣</td></tr>`;
    return;
  }

  const values = matrix.rows.flatMap((row) => row.cells.map((cell) => cell.value)).filter((value) => value !== null);
  const minValue = values.length ? Math.min(...values) : null;
  const maxValue = values.length ? Math.max(...values) : null;
  elements.sensitivityMatrixHead.innerHTML = `
    <tr>
      <th>利率 \\ 期數</th>
      ${matrix.columns.map((column) => `<th>${column.label}</th>`).join("")}
    </tr>
  `;

  elements.sensitivityMatrixBody.innerHTML = matrix.rows.map((row) => `
    <tr>
      <td class="matrix-axis-cell">${formatPercent(row.rate)}</td>
      ${row.cells.map((cell) => {
        const heatClass = getMatrixHeatClass(cell.value, minValue, maxValue, "low");
        return `
          <td class="matrix-value-cell ${heatClass}">
            <strong>${formatMatrixMetricValue(matrix.metricKey, cell.value)}</strong>
            <span>${cell.months} 期</span>
          </td>
        `;
      }).join("")}
    </tr>
  `).join("");

  const baseRow = matrix.rows.find((row) => Math.abs(row.rate - matrix.rows[Math.floor(matrix.rows.length / 2)].rate) < 0.000001) ?? matrix.rows[0];
  const baseCell = baseRow.cells.find((cell) => cell.months === matrix.columns.find((column) => column.offset === 0)?.months) ?? baseRow.cells[0];
  elements.sensitivityMatrixSummary.textContent = `${matrix.metricLabel} 矩陣已生成；基準格為 ${formatMatrixMetricValue(matrix.metricKey, baseCell.value)}，可同時比較利率與期數調整。`;
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function parseRefinanceInputs() {
  const rawValues = {
    currentBalance: elements.refiCurrentBalance.value.trim(),
    currentRate: elements.refiCurrentRate.value.trim(),
    currentMonths: elements.refiCurrentMonths.value.trim(),
    currentGrace: elements.refiCurrentGrace.value.trim(),
    exitFee: elements.refiExitFee.value.trim(),
    newRate: elements.refiNewRate.value.trim(),
    newMonths: elements.refiNewMonths.value.trim(),
    newGrace: elements.refiNewGrace.value.trim(),
    newFee: elements.refiNewFee.value.trim(),
    cashback: elements.refiCashback.value.trim(),
  };
  const hasAnyInput = Object.values(rawValues).some(Boolean);
  if (!hasAnyInput) {
    return { enabled: false };
  }

  const requiredKeys = ["currentBalance", "currentRate", "currentMonths", "newRate", "newMonths"];
  const missingKeys = requiredKeys.filter((key) => !rawValues[key]);
  if (missingKeys.length) {
    return { enabled: true, valid: false, message: "轉貸比較需至少填完目前剩餘本金、目前利率、目前剩餘期數、新方案利率與新方案期數。" };
  }

  const values = {
    currentBalance: Number(rawValues.currentBalance),
    currentRate: Number(rawValues.currentRate),
    currentMonths: Number(rawValues.currentMonths),
    currentGrace: Number(rawValues.currentGrace || 0),
    exitFee: Number(rawValues.exitFee || 0),
    newRate: Number(rawValues.newRate),
    newMonths: Number(rawValues.newMonths),
    newGrace: Number(rawValues.newGrace || 0),
    newFee: Number(rawValues.newFee || 0),
    cashback: Number(rawValues.cashback || 0),
  };

  if (!Number.isFinite(values.currentBalance) || values.currentBalance <= 0) {
    return { enabled: true, valid: false, message: "目前剩餘本金需大於 0。" };
  }
  if (!Number.isFinite(values.currentRate) || values.currentRate < 0 || !Number.isFinite(values.newRate) || values.newRate < 0) {
    return { enabled: true, valid: false, message: "轉貸比較的利率不可小於 0。" };
  }
  if (!Number.isInteger(values.currentMonths) || values.currentMonths <= 0 || !Number.isInteger(values.newMonths) || values.newMonths <= 0) {
    return { enabled: true, valid: false, message: "轉貸比較的剩餘期數與新方案期數都需為正整數。" };
  }
  if (!Number.isInteger(values.currentGrace) || values.currentGrace < 0 || !Number.isInteger(values.newGrace) || values.newGrace < 0) {
    return { enabled: true, valid: false, message: "轉貸比較的寬限期需為 0 或正整數。" };
  }
  if (values.currentGrace >= values.currentMonths || values.newGrace >= values.newMonths) {
    return { enabled: true, valid: false, message: "轉貸比較的寬限期需小於對應期數。" };
  }
  if ([values.exitFee, values.newFee, values.cashback].some((value) => !Number.isFinite(value) || value < 0)) {
    return { enabled: true, valid: false, message: "轉貸比較的費用與補貼不可小於 0。" };
  }

  return { enabled: true, valid: true, values };
}

function findBreakEvenMonth(currentRows, newRows, upfrontCost) {
  let cumulative = -upfrontCost;
  const maxMonths = Math.max(currentRows.length, newRows.length);

  for (let month = 0; month < maxMonths; month += 1) {
    const currentPayment = (currentRows[month]?.payment ?? 0) + (currentRows[month]?.extraPayment ?? 0);
    const newPayment = (newRows[month]?.payment ?? 0) + (newRows[month]?.extraPayment ?? 0);
    cumulative += currentPayment - newPayment;

    if (cumulative >= 0) {
      return month + 1;
    }
  }

  return null;
}

function buildRefinanceComparison(values) {
  const principal = values.currentBalance * WAN_UNIT;
  const currentScenario = buildSchedule({
    principal,
    annualRate: values.currentRate,
    totalMonths: values.currentMonths,
    graceMonths: values.currentGrace,
  });
  const newScenario = buildSchedule({
    principal,
    annualRate: values.newRate,
    totalMonths: values.newMonths,
    graceMonths: values.newGrace,
  });
  const upfrontCost = values.exitFee + values.newFee - values.cashback;
  const totalCurrentOutflow = currentScenario.totalPayment;
  const totalNewOutflow = newScenario.totalPayment + upfrontCost;
  const totalSaved = totalCurrentOutflow - totalNewOutflow;
  const monthlyGap = newScenario.regularPayment - currentScenario.regularPayment;
  const breakEvenMonth = findBreakEvenMonth(currentScenario.rows, newScenario.rows, upfrontCost);

  return {
    currentScenario,
    newScenario,
    upfrontCost,
    totalCurrentOutflow,
    totalNewOutflow,
    totalSaved,
    monthlyGap,
    breakEvenMonth,
  };
}

function renderRefinanceComparison(refiState) {
  if (!refiState?.enabled) {
    elements.refiMonthlyGap.textContent = "-";
    elements.refiTotalSaved.textContent = "-";
    elements.refiBreakEven.textContent = "-";
    elements.refiSummary.textContent = "填入目前貸款剩餘條件與新方案後，這裡會顯示貸款重整 / 轉貸比較。";
    elements.refiCompareBody.innerHTML = `<tr><td colspan="4" class="empty-cell">完成輸入後顯示轉貸比較結果。</td></tr>`;
    return;
  }

  if (!refiState.valid) {
    elements.refiMonthlyGap.textContent = "-";
    elements.refiTotalSaved.textContent = "-";
    elements.refiBreakEven.textContent = "-";
    elements.refiSummary.textContent = refiState.message;
    elements.refiCompareBody.innerHTML = `<tr><td colspan="4" class="empty-cell">${refiState.message}</td></tr>`;
    return;
  }

  const result = buildRefinanceComparison(refiState.values);
  const monthlyGapLabel = result.monthlyGap === 0
    ? "持平"
    : `${result.monthlyGap > 0 ? "+" : "-"}${formatWan(Math.abs(result.monthlyGap))}`;
  const monthlyGapSummary = result.monthlyGap === 0
    ? "持平"
    : `${result.monthlyGap < 0 ? "少" : "多"} ${formatWan(Math.abs(result.monthlyGap))}`;
  elements.refiMonthlyGap.textContent = monthlyGapLabel;
  elements.refiTotalSaved.textContent = result.totalSaved === 0
    ? "持平"
    : `${result.totalSaved > 0 ? "+" : "-"}${formatCurrency(Math.abs(result.totalSaved))}`;
  elements.refiBreakEven.textContent = result.breakEvenMonth === null ? "無法回收" : `約 ${result.breakEvenMonth} 期`;

  if (result.totalSaved > 0 && result.breakEvenMonth !== null) {
    elements.refiSummary.textContent = `新方案月付約 ${monthlyGapSummary}，整體仍可節省約 ${formatCurrency(result.totalSaved)}，回收期約 ${result.breakEvenMonth} 期。`;
  } else if (result.monthlyGap < 0) {
    elements.refiSummary.textContent = `新方案可把月付壓低約 ${formatWan(Math.abs(result.monthlyGap))}，但整體總成本可能增加 ${formatCurrency(Math.abs(result.totalSaved))}，屬於以月付換總成本。`;
  } else {
    elements.refiSummary.textContent = `以目前輸入條件估算，新方案整體優勢不明顯；即使執行轉貸，總成本差異約 ${result.totalSaved > 0 ? "+" : "-"}${formatCurrency(Math.abs(result.totalSaved))}。`;
  }

  const rows = [
    ["剩餘本金", formatWan(refiState.values.currentBalance * WAN_UNIT), formatWan(refiState.values.currentBalance * WAN_UNIT), "兩邊皆以目前剩餘本金為比較基準"],
    ["名目利率", formatPercent(refiState.values.currentRate), formatPercent(refiState.values.newRate), refiState.values.newRate < refiState.values.currentRate ? "新方案利率較低" : refiState.values.newRate > refiState.values.currentRate ? "新方案利率較高" : "利率相同"],
    ["期數", `${refiState.values.currentMonths} 月`, `${refiState.values.newMonths} 月`, refiState.values.newMonths > refiState.values.currentMonths ? "新方案期數較長" : refiState.values.newMonths < refiState.values.currentMonths ? "新方案期數較短" : "期數相同"],
    ["月付金", formatWan(result.currentScenario.regularPayment), formatWan(result.newScenario.regularPayment), result.monthlyGap < 0 ? "新方案月付較低" : result.monthlyGap > 0 ? "新方案月付較高" : "月付相同"],
    ["剩餘利息", formatCurrency(result.currentScenario.totalInterest), formatCurrency(result.newScenario.totalInterest), result.newScenario.totalInterest < result.currentScenario.totalInterest ? "新方案利息較低" : result.newScenario.totalInterest > result.currentScenario.totalInterest ? "新方案利息較高" : "利息相同"],
    ["轉貸前置成本", formatCurrency(0), formatCurrency(result.upfrontCost), result.upfrontCost > 0 ? "需先吸收手續費 / 清償成本" : "有補貼可抵銷前置成本"],
    ["未來總支出", formatWan(result.totalCurrentOutflow), formatWan(result.totalNewOutflow), result.totalSaved > 0 ? "新方案總成本較低" : result.totalSaved < 0 ? "新方案總成本較高" : "總成本相同"],
  ];

  elements.refiCompareBody.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="比較項目">${row[0]}</td>
      <td data-label="目前貸款">${row[1]}</td>
      <td data-label="新方案">${row[2]}</td>
      <td data-label="差異判讀">${row[3]}</td>
    </tr>
  `).join("");
}

function renderRateBatchTable(rows) {
  if (!rows.length) {
    elements.rateBatchBestRate.textContent = "-";
    elements.rateBatchWorstPayment.textContent = "-";
    elements.rateBatchSummary.textContent = "-";
    elements.rateBatchBody.innerHTML = `<tr><td colspan="8" class="empty-cell">輸入利率批次後顯示情境比較</td></tr>`;
    return;
  }

  const bestRow = [...rows].sort((left, right) => {
    const leftApr = left.aprEstimate ?? Number.POSITIVE_INFINITY;
    const rightApr = right.aprEstimate ?? Number.POSITIVE_INFINITY;
    return leftApr - rightApr || left.monthlyPayment - right.monthlyPayment;
  })[0];
  const worstRow = [...rows].sort((left, right) => right.monthlyPayment - left.monthlyPayment)[0];
  elements.rateBatchBestRate.textContent = formatPercent(bestRow.annualRate);
  elements.rateBatchWorstPayment.textContent = formatWan(worstRow.monthlyPayment);
  elements.rateBatchSummary.textContent = `共 ${rows.length} 組情境，最佳利率為 ${formatPercent(bestRow.annualRate)}。`;

  elements.rateBatchBody.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="情境">${row.label}</td>
      <td data-label="年利率">${formatPercent(row.annualRate)}</td>
      <td data-label="月付金(萬)">${formatWan(row.monthlyPayment)}</td>
      <td data-label="總利息(元)">${formatCurrency(row.totalInterest)}</td>
      <td data-label="APR">${row.aprEstimate === null ? "-" : formatPercent(row.aprEstimate)}</td>
      <td data-label="月付差異">${row.paymentGap === 0 ? "持平" : `${row.paymentGap > 0 ? "+" : "-"}${formatWan(Math.abs(row.paymentGap))}`}</td>
      <td data-label="利息差異">${row.interestGap === 0 ? "持平" : `${row.interestGap > 0 ? "+" : "-"}${formatCurrency(Math.abs(row.interestGap))}`}</td>
      <td data-label="風險標記">${row.riskTag}</td>
    </tr>
  `).join("");
}

function getCompareScenarioRows() {
  return [...elements.compareInputBody.querySelectorAll("tr")];
}

function getExtraPrepayRows() {
  return [...elements.extraPrepayBody.querySelectorAll("tr[data-extra-prepay-row='true']")];
}

function renderEmptyExtraPrepayState() {
  if (getExtraPrepayRows().length) {
    return;
  }

  elements.extraPrepayBody.innerHTML = `
    <tr>
      <td colspan="5" class="empty-cell">如有多次提前清償需求，可新增列後輸入月份與金額。</td>
    </tr>
  `;
}

function addExtraPrepayRow(values = {}) {
  const fragment = elements.extraPrepayRowTemplate.content.cloneNode(true);
  const row = fragment.querySelector("tr");
  const inputs = row.querySelectorAll("input");
  row.dataset.extraPrepayRow = "true";

  if (inputs.length >= 4) {
    inputs[0].value = values.month ?? "";
    inputs[1].value = values.amount ?? "";
    inputs[2].value = values.fee ?? "";
    inputs[3].value = values.penaltyRate ?? "";
  }

  if (elements.extraPrepayBody.querySelector(".empty-cell")) {
    elements.extraPrepayBody.innerHTML = "";
  }

  elements.extraPrepayBody.appendChild(row);
}

function getExtraPrepayEventsState() {
  return getExtraPrepayRows().map((row) => {
    const inputs = row.querySelectorAll("input");
    return {
      month: inputs[0]?.value ?? "",
      amount: inputs[1]?.value ?? "",
      fee: inputs[2]?.value ?? "",
      penaltyRate: inputs[3]?.value ?? "",
    };
  });
}

function applyExtraPrepayEventsState(events = []) {
  elements.extraPrepayBody.innerHTML = "";
  const sanitizedEvents = Array.isArray(events) ? events : [];
  sanitizedEvents.forEach((eventItem) => addExtraPrepayRow(eventItem));
  renderEmptyExtraPrepayState();
}

function renderEmptyDebtState() {
  if (elements.debtBody.children.length === 0) {
    elements.debtBody.innerHTML = `<tr><td colspan="7" class="empty-cell">如要評估債務整合，可新增現有卡債、信貸或車貸資料。</td></tr>`;
  }
}

function addDebtRow(values = {}) {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td data-label="債務名稱"><input class="compare-input debt-name" type="text" placeholder="信用卡分期"></td>
    <td data-label="剩餘本金(萬)"><input class="compare-input debt-balance" type="number" min="0.1" step="0.1" placeholder="8"></td>
    <td data-label="年利率"><input class="compare-input debt-rate" type="number" min="0" step="0.01" placeholder="14.5"></td>
    <td data-label="月付金(元)"><input class="compare-input debt-payment" type="number" min="0" step="100" placeholder="6500"></td>
    <td data-label="剩餘期數"><input class="compare-input debt-months" type="number" min="1" step="1" placeholder="24"></td>
    <td data-label="清償費用(元)"><input class="compare-input debt-fee" type="number" min="0" step="100" placeholder="0"></td>
    <td data-label="操作"><button class="ghost-button debt-remove-button" type="button">刪除</button></td>
  `;
  const inputs = row.querySelectorAll("input");
  if (inputs.length >= 6) {
    inputs[0].value = values.name ?? "";
    inputs[1].value = values.balance ?? "";
    inputs[2].value = values.annualRate ?? "";
    inputs[3].value = values.monthlyPayment ?? "";
    inputs[4].value = values.months ?? "";
    inputs[5].value = values.settlementFee ?? "";
  }

  if (elements.debtBody.querySelector(".empty-cell")) {
    elements.debtBody.innerHTML = "";
  }
  elements.debtBody.appendChild(row);
}

function getDebtRows() {
  return [...elements.debtBody.querySelectorAll("tr")].filter((row) => !row.querySelector(".empty-cell"));
}

function getDebtItemsState() {
  return getDebtRows().map((row) => {
    const inputs = row.querySelectorAll("input");
    return {
      name: inputs[0]?.value ?? "",
      balance: inputs[1]?.value ?? "",
      annualRate: inputs[2]?.value ?? "",
      monthlyPayment: inputs[3]?.value ?? "",
      months: inputs[4]?.value ?? "",
      settlementFee: inputs[5]?.value ?? "",
    };
  });
}

function applyDebtItemsState(items = []) {
  elements.debtBody.innerHTML = "";
  const sanitizedItems = Array.isArray(items) ? items : [];
  sanitizedItems.forEach((item) => addDebtRow(item));
  renderEmptyDebtState();
}

function getCompareRowPlaceholder(index) {
  return `方案 ${String.fromCharCode(65 + index)}`;
}

function addCompareRow(values = {}) {
  const rowIndex = getCompareScenarioRows().length;
  if (rowIndex >= MAX_COMPARE_ROW_COUNT) {
    return false;
  }

  const fragment = elements.compareRowTemplate.content.cloneNode(true);
  const row = fragment.querySelector("tr");
  const inputs = row.querySelectorAll("input");
  const placeholder = getCompareRowPlaceholder(rowIndex);

  if (inputs.length >= 6) {
    inputs[0].placeholder = placeholder;
    inputs[1].placeholder = "50";
    inputs[2].placeholder = "2.88";
    inputs[3].placeholder = "60";
    inputs[4].placeholder = "3000";
    inputs[5].placeholder = "0";
    inputs[0].value = values.name ?? "";
    inputs[1].value = values.loanAmount ?? "";
    inputs[2].value = values.annualRate ?? "";
    inputs[3].value = values.months ?? "";
    inputs[4].value = values.handlingFee ?? "";
    inputs[5].value = values.graceMonths ?? "";
  }

  elements.compareInputBody.appendChild(row);
  return true;
}

function syncCompareRowPlaceholders() {
  getCompareScenarioRows().forEach((row, index) => {
    const nameInput = row.querySelector(".compare-name");
    if (nameInput instanceof HTMLInputElement) {
      nameInput.placeholder = getCompareRowPlaceholder(index);
    }
  });
}

function getCompareScenariosState() {
  return getCompareScenarioRows().map((row) => {
    const inputs = row.querySelectorAll("input");
    return {
      name: inputs[0]?.value ?? "",
      loanAmount: inputs[1]?.value ?? "",
      annualRate: inputs[2]?.value ?? "",
      months: inputs[3]?.value ?? "",
      handlingFee: inputs[4]?.value ?? "",
      graceMonths: inputs[5]?.value ?? "",
    };
  });
}

function hasPrimaryLoanInputs() {
  return Boolean(elements.loanAmount.value || elements.annualRate.value || elements.loanMonths.value);
}

function hasCompareScenarioInputs() {
  return getCompareScenariosState().some((scenario) => (
    scenario.name || scenario.loanAmount || scenario.annualRate || scenario.months || scenario.handlingFee || scenario.graceMonths
  ));
}

function applyCompareScenariosState(scenarios = []) {
  elements.compareInputBody.innerHTML = "";
  const sanitizedScenarios = Array.isArray(scenarios) ? scenarios : [];
  const targetCount = Math.min(
    Math.max(sanitizedScenarios.length || DEFAULT_COMPARE_ROW_COUNT, MIN_COMPARE_ROW_COUNT),
    MAX_COMPARE_ROW_COUNT,
  );

  for (let index = 0; index < targetCount; index += 1) {
    addCompareRow(sanitizedScenarios[index] ?? {});
  }

  syncCompareRowPlaceholders();
}

function clearCompareScenarios() {
  applyCompareScenariosState([]);
}

function getCompareMetricMeta(key) {
  const labels = {
    score: "綜合優勢",
    aprEstimate: "APR",
    monthlyPayment: "月付金",
    totalInterest: "總利息",
    totalPayment: "總還款",
    netAmount: "實拿金額",
    annualRate: "名目利率",
    months: "期數",
    handlingFee: "手續費",
  };
  const higherIsBetter = ["score", "netAmount", "months"].includes(key);
  return {
    label: labels[key] ?? "綜合優勢",
    direction: higherIsBetter ? "desc" : "asc",
  };
}

function getSortedComparisonRows(rows) {
  if (!rows.length) {
    return [];
  }

  const metricMeta = getCompareMetricMeta(compareSortKey);
  const direction = compareSortDirection === "auto" ? metricMeta.direction : compareSortDirection;
  const directionFactor = direction === "desc" ? -1 : 1;
  return [...rows].sort((left, right) => {
    const leftValue = left[compareSortKey];
    const rightValue = right[compareSortKey];

    if (leftValue === null && rightValue === null) {
      return left.name.localeCompare(right.name, "zh-Hant");
    }
    if (leftValue === null) {
      return 1;
    }
    if (rightValue === null) {
      return -1;
    }
    if (leftValue === rightValue) {
      if (left.score !== right.score) {
        return right.score - left.score;
      }
      return left.name.localeCompare(right.name, "zh-Hant");
    }
    return (leftValue > rightValue ? 1 : -1) * directionFactor;
  });
}

function decorateComparisonRows(rows) {
  if (!rows.length) {
    return [];
  }

  const minApr = Math.min(...rows.filter((row) => row.aprEstimate !== null).map((row) => row.aprEstimate));
  const minInterest = Math.min(...rows.map((row) => row.totalInterest));
  const minMonthlyPayment = Math.min(...rows.map((row) => row.monthlyPayment));
  const maxNetAmount = Math.max(...rows.map((row) => row.netAmount));

  return rows.map((row) => {
    const wins = [];
    if (row.aprEstimate !== null && row.aprEstimate === minApr) {
      wins.push("APR 最佳");
    }
    if (row.totalInterest === minInterest) {
      wins.push("利息最低");
    }
    if (row.monthlyPayment === minMonthlyPayment) {
      wins.push("月付最低");
    }
    if (row.netAmount === maxNetAmount) {
      wins.push("實拿最高");
    }
    return { ...row, wins, score: wins.length };
  });
}

function renderCompareResults(rows) {
  if (!rows.length) {
    elements.compareResultBody.innerHTML = `
      <tr>
        <td colspan="8" class="empty-cell">填入比較資料後會顯示方案比較結果</td>
      </tr>
    `;
    elements.compareSortSummary.textContent = "排序器會依你指定的欄位重新排列貸款方案。";
    return;
  }

  const minApr = Math.min(...rows.filter((row) => row.aprEstimate !== null).map((row) => row.aprEstimate));
  const minInterest = Math.min(...rows.map((row) => row.totalInterest));
  const minMonthlyPayment = Math.min(...rows.map((row) => row.monthlyPayment));
  const maxNetAmount = Math.max(...rows.map((row) => row.netAmount));
  const scoredRows = decorateComparisonRows(rows);
  const sortedRows = getSortedComparisonRows(scoredRows);
  const bestScore = Math.max(...sortedRows.map((row) => row.score));
  const metricMeta = getCompareMetricMeta(compareSortKey);
  const activeDirection = compareSortDirection === "auto" ? metricMeta.direction : compareSortDirection;
  const topRow = sortedRows[0];
  elements.compareSortSummary.textContent = `目前依「${metricMeta.label}」${activeDirection === "asc" ? "由低到高" : "由高到低"}排序，${topRow.name} 排名第 1。`;

  elements.compareResultBody.innerHTML = sortedRows.map((row, index) => `
    <tr class="${row.score === bestScore && row.score > 0 ? "compare-winner" : ""}">
      <td data-label="排序"><span class="rank-badge">#${index + 1}</span></td>
      <td data-label="方案">${row.name}</td>
      <td data-label="月付金(萬)" class="${row.monthlyPayment === minMonthlyPayment ? "best-cell" : ""}">${formatWan(row.monthlyPayment)}</td>
      <td data-label="總還款(萬)" class="mobile-hide">${formatWan(row.totalPayment)}</td>
      <td data-label="總利息(元)" class="mobile-hide ${row.totalInterest === minInterest ? "best-cell" : ""}">${formatCurrency(row.totalInterest)}</td>
      <td data-label="實拿金額(萬)" class="mobile-hide ${row.netAmount === maxNetAmount ? "best-cell" : ""}">${formatWan(row.netAmount)}</td>
      <td data-label="APR" class="${row.aprEstimate !== null && row.aprEstimate === minApr ? "best-cell" : ""}">${row.aprEstimate === null ? "-" : formatPercent(row.aprEstimate)}</td>
      <td data-label="判讀">${row.note}${row.wins.length ? `<br><span class="winner-badge">${row.wins.join(" / ")}</span>` : ""}</td>
      <td data-label="核心摘要" class="mobile-only">月付 ${formatWan(row.monthlyPayment)} / APR ${row.aprEstimate === null ? "-" : formatPercent(row.aprEstimate)}</td>
    </tr>
  `).join("");
}

function buildAdviceCards(context) {
  if (!context) {
    return [];
  }

  const {
    annualRate,
    aprEstimate,
    feeRatio,
    overallDebtRatio,
    incomeAfterAllExpenses,
    baseScenario,
    prepayScenario,
    prepayMonth,
    extraPrepayEvents,
    debtConsolidation,
  } = context;
  const cards = [];

  if (aprEstimate !== null) {
    const aprGap = aprEstimate - annualRate;
    if (aprGap > 0.5) {
      cards.push({
        title: "APR 明顯高於名目利率",
        body: `APR 約 ${formatPercent(aprEstimate)}，比名目利率 ${formatPercent(annualRate)} 高出 ${formatPercent(aprGap)}，代表手續費或現金流結構明顯拉高了實際資金成本。`,
      });
    } else {
      cards.push({
        title: "APR 與名目利率差距不大",
        body: `APR 約 ${formatPercent(aprEstimate)}，與名目利率 ${formatPercent(annualRate)} 接近，表示額外費用對整體成本影響相對有限。`,
      });
    }
  }

  if (feeRatio >= 1) {
    cards.push({
      title: "手續費占比偏高",
      body: `手續費約占貸款金額 ${formatPercent(feeRatio)}，建議比較不同銀行方案時優先看 APR，不要只看表面利率。`,
    });
  } else {
    cards.push({
      title: "手續費占比相對溫和",
      body: `手續費約占貸款金額 ${formatPercent(feeRatio)}，主要成本仍來自後續利息支出。`,
    });
  }

  const interestShare = baseScenario.totalPayment > 0
    ? (baseScenario.totalInterest / baseScenario.totalPayment) * 100
    : 0;

  if (interestShare >= 15) {
    cards.push({
      title: "利息負擔不可忽略",
      body: `總利息約 ${formatCurrency(baseScenario.totalInterest)}，占總還款約 ${formatPercent(interestShare)}。若現金流允許，可考慮提早部分清償來壓低總成本。`,
    });
  } else {
    cards.push({
      title: "利息占總還款比例不高",
      body: `總利息約 ${formatCurrency(baseScenario.totalInterest)}，占總還款約 ${formatPercent(interestShare)}，整體成本仍屬可控範圍。`,
    });
  }

  if (overallDebtRatio !== null) {
    if (overallDebtRatio > 50) {
      cards.push({
        title: "整體負債比偏高",
        body: `新貸款加上既有負債後，月負債比約 ${formatPercent(overallDebtRatio)}，建議保守評估還款壓力。`,
      });
    } else if (incomeAfterAllExpenses < 0) {
      cards.push({
        title: "貸後現金流可能不足",
        body: `扣除總負債與每月固定支出後，剩餘約 ${formatCurrency(incomeAfterAllExpenses)}，表示目前設定下現金流偏緊。`,
      });
    }
  }

  if (prepayScenario) {
    const interestSaved = baseScenario.totalInterest - prepayScenario.totalInterest;
    const monthsSaved = baseScenario.monthsUsed - prepayScenario.monthsUsed;
    cards.push({
      title: "提前清償有明顯效果",
      body: extraPrepayEvents?.length
        ? `多筆提前清償合計可節省利息 ${formatCurrency(interestSaved)}，縮短 ${monthsSaved} 個月期數，並留意提前清償費用。`
        : `若在第 ${prepayMonth} 期提前清償，可節省利息 ${formatCurrency(interestSaved)}，縮短 ${monthsSaved} 個月期數，並留意提前清償費用。`,
    });
  }

  if (debtConsolidation?.enabled && debtConsolidation.valid) {
    cards.push({
      title: debtConsolidation.totalSaved > 0 ? "債務整合有機會改善結構" : "債務整合未必划算",
      body: debtConsolidation.totalSaved > 0
        ? `目前主方案可整合 ${debtConsolidation.replacedCount} 筆債務，月付約少 ${formatCurrency(Math.abs(debtConsolidation.monthlyGap))}，整體成本估計可省 ${formatCurrency(debtConsolidation.totalSaved)}。`
        : `目前主方案雖可整合 ${debtConsolidation.replacedCount} 筆債務，但整體成本可能增加 ${formatCurrency(Math.abs(debtConsolidation.totalSaved))}，需確認是否主要目標是壓低月付。`,
    });
  }

  return cards.slice(0, 4);
}

function getTierRows() {
  return [...elements.rateTierBody.querySelectorAll("tr")];
}

function parseTierRows(totalMonths) {
  const rows = getTierRows();
  const tiers = [];

  for (const row of rows) {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 3) {
      continue;
    }

    const startRaw = inputs[0].value.trim();
    const endRaw = inputs[1].value.trim();
    const rateRaw = inputs[2].value.trim();

    if (!startRaw && !endRaw && !rateRaw) {
      continue;
    }

    if (!startRaw || !endRaw || !rateRaw) {
      return { valid: false, message: "分段利率若要使用，每列都需完整填寫起始、結束月份與年利率。" };
    }

    const startMonth = Number(startRaw);
    const endMonth = Number(endRaw);
    const annualRate = Number(rateRaw);

    if (!Number.isInteger(startMonth) || !Number.isInteger(endMonth) || startMonth <= 0 || endMonth <= 0) {
      return { valid: false, message: "分段利率月份需為正整數。" };
    }

    if (startMonth > endMonth) {
      return { valid: false, message: "分段利率的起始月份不可大於結束月份。" };
    }

    if (endMonth > totalMonths) {
      return { valid: false, message: "分段利率的結束月份不可超過總期數。" };
    }

    if (!Number.isFinite(annualRate) || annualRate < 0) {
      return { valid: false, message: "分段利率不可小於 0。" };
    }

    tiers.push({ startMonth, endMonth, annualRate });
  }

  if (!tiers.length) {
    return { valid: true, tiers: [] };
  }

  tiers.sort((a, b) => a.startMonth - b.startMonth);

  for (let i = 0; i < tiers.length; i += 1) {
    const tier = tiers[i];
    if (i === 0 && tier.startMonth !== 1) {
      return { valid: false, message: "分段利率若啟用，第一段需從第 1 期開始。" };
    }

    if (i > 0) {
      const prev = tiers[i - 1];
      if (tier.startMonth !== prev.endMonth + 1) {
        return { valid: false, message: "分段利率各階段需連續不中斷，不能重疊或跳號。" };
      }
    }
  }

  if (tiers[tiers.length - 1].endMonth !== totalMonths) {
    return { valid: false, message: "分段利率若啟用，最後一段需覆蓋到總期數。" };
  }

  return { valid: true, tiers };
}

function parseExtraPrepayRows(totalMonths) {
  const rows = getExtraPrepayRows();
  const events = [];

  for (const [index, row] of rows.entries()) {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 4) {
      continue;
    }

    const monthRaw = inputs[0].value.trim();
    const amountRaw = inputs[1].value.trim();
    const feeRaw = inputs[2].value.trim();
    const penaltyRaw = inputs[3].value.trim();

    if (!monthRaw && !amountRaw && !feeRaw && !penaltyRaw) {
      continue;
    }

    if (!monthRaw || !amountRaw) {
      return { valid: false, message: `第 ${index + 1} 筆多筆提前清償需至少填寫月份與金額。` };
    }

    const month = Number(monthRaw);
    const amount = Number(amountRaw);
    const fee = feeRaw === "" ? 0 : Number(feeRaw);
    const penaltyRate = penaltyRaw === "" ? 0 : Number(penaltyRaw);

    if (!Number.isInteger(month) || month <= 0) {
      return { valid: false, message: `第 ${index + 1} 筆多筆提前清償月份需為正整數。` };
    }

    if (month > totalMonths) {
      return { valid: false, message: `第 ${index + 1} 筆多筆提前清償月份不可超過總期數。` };
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      return { valid: false, message: `第 ${index + 1} 筆多筆提前清償金額需大於 0。` };
    }

    if (!Number.isFinite(fee) || fee < 0) {
      return { valid: false, message: `第 ${index + 1} 筆多筆提前清償手續費不可小於 0。` };
    }

    if (!Number.isFinite(penaltyRate) || penaltyRate < 0) {
      return { valid: false, message: `第 ${index + 1} 筆多筆提前清償違約金率不可小於 0。` };
    }

    events.push({ month, amount: amount * WAN_UNIT, fee, penaltyRate });
  }

  return { valid: true, events };
}

function parseDebtRows() {
  const rows = getDebtRows();
  const items = [];

  for (const [index, row] of rows.entries()) {
    const inputs = row.querySelectorAll("input");
    if (inputs.length < 6) {
      continue;
    }

    const name = inputs[0].value.trim() || `債務 ${index + 1}`;
    const balanceRaw = inputs[1].value.trim();
    const rateRaw = inputs[2].value.trim();
    const paymentRaw = inputs[3].value.trim();
    const monthsRaw = inputs[4].value.trim();
    const feeRaw = inputs[5].value.trim();

    if (!balanceRaw && !rateRaw && !paymentRaw && !monthsRaw && !feeRaw) {
      continue;
    }

    if (!balanceRaw || !rateRaw || !paymentRaw || !monthsRaw) {
      return { valid: false, message: `第 ${index + 1} 筆債務資料需完整填寫剩餘本金、年利率、月付金與剩餘期數。` };
    }

    const balance = Number(balanceRaw);
    const annualRate = Number(rateRaw);
    const monthlyPayment = Number(paymentRaw);
    const months = Number(monthsRaw);
    const settlementFee = feeRaw === "" ? 0 : Number(feeRaw);

    if (!Number.isFinite(balance) || balance <= 0) {
      return { valid: false, message: `第 ${index + 1} 筆債務剩餘本金需大於 0。` };
    }
    if (!Number.isFinite(annualRate) || annualRate < 0) {
      return { valid: false, message: `第 ${index + 1} 筆債務年利率不可小於 0。` };
    }
    if (!Number.isFinite(monthlyPayment) || monthlyPayment < 0) {
      return { valid: false, message: `第 ${index + 1} 筆債務月付金不可小於 0。` };
    }
    if (!Number.isInteger(months) || months <= 0) {
      return { valid: false, message: `第 ${index + 1} 筆債務剩餘期數需為正整數。` };
    }
    if (!Number.isFinite(settlementFee) || settlementFee < 0) {
      return { valid: false, message: `第 ${index + 1} 筆債務清償費用不可小於 0。` };
    }

    items.push({
      name,
      balance: balance * WAN_UNIT,
      annualRate,
      monthlyPayment,
      months,
      settlementFee,
    });
  }

  return { valid: true, items };
}

function parseIndexedRateConfig(totalMonths) {
  const enabled = elements.indexedRateEnabled.value === "on";
  if (!enabled) {
    return { valid: true, enabled: false, annualRate: null, rateTiers: [], summary: "未啟用指標利率模型時，系統會沿用基準年利率或手動分段利率。" };
  }

  const indexBaseRate = Number(elements.indexBaseRate.value);
  const indexSpreadRate = Number(elements.indexSpreadRate.value);
  const indexResetMonths = Number(elements.indexResetMonths.value);
  const indexStepPerReset = Number(elements.indexStepPerReset.value || 0);
  const floorRaw = elements.indexFloorRate.value.trim();
  const capRaw = elements.indexCapRate.value.trim();
  const indexFloorRate = floorRaw === "" ? null : Number(floorRaw);
  const indexCapRate = capRaw === "" ? null : Number(capRaw);

  if (!Number.isFinite(indexBaseRate) || indexBaseRate < 0) {
    return { valid: false, message: "目前指標利率不可小於 0。" };
  }
  if (!Number.isFinite(indexSpreadRate) || indexSpreadRate < 0) {
    return { valid: false, message: "固定加碼不可小於 0。" };
  }
  if (!Number.isInteger(indexResetMonths) || indexResetMonths <= 0) {
    return { valid: false, message: "重訂頻率需為正整數月數。" };
  }
  if (!Number.isFinite(indexStepPerReset)) {
    return { valid: false, message: "每次重訂預估變動需為有效數字。" };
  }
  if (indexFloorRate !== null && (!Number.isFinite(indexFloorRate) || indexFloorRate < 0)) {
    return { valid: false, message: "利率下限不可小於 0。" };
  }
  if (indexCapRate !== null && (!Number.isFinite(indexCapRate) || indexCapRate < 0)) {
    return { valid: false, message: "利率上限不可小於 0。" };
  }
  if (indexFloorRate !== null && indexCapRate !== null && indexFloorRate > indexCapRate) {
    return { valid: false, message: "利率下限不可高於利率上限。" };
  }

  const clampRate = (rate) => clamp(rate, indexFloorRate ?? 0, indexCapRate ?? Number.POSITIVE_INFINITY);
  const rateTiers = [];
  let startMonth = 1;
  let bucket = 0;
  while (startMonth <= totalMonths) {
    const endMonth = Math.min(totalMonths, startMonth + indexResetMonths - 1);
    const rawRate = indexBaseRate + indexSpreadRate + bucket * indexStepPerReset;
    rateTiers.push({
      startMonth,
      endMonth,
      annualRate: clampRate(rawRate),
    });
    startMonth = endMonth + 1;
    bucket += 1;
  }

  const firstRate = rateTiers[0]?.annualRate ?? clampRate(indexBaseRate + indexSpreadRate);
  const lastRate = rateTiers[rateTiers.length - 1]?.annualRate ?? firstRate;
  const floorText = indexFloorRate === null ? "未設下限" : `下限 ${formatPercent(indexFloorRate)}`;
  const capText = indexCapRate === null ? "未設上限" : `上限 ${formatPercent(indexCapRate)}`;

  return {
    valid: true,
    enabled: true,
    annualRate: firstRate,
    rateTiers,
    config: {
      indexBaseRate,
      indexSpreadRate,
      indexResetMonths,
      indexStepPerReset,
      indexFloorRate,
      indexCapRate,
    },
    summary: `已套用指標利率模型：起始利率 ${formatPercent(firstRate)}，每 ${indexResetMonths} 個月重訂一次，每次預估 ${indexStepPerReset >= 0 ? "+" : ""}${formatPercent(indexStepPerReset)}，末段約 ${formatPercent(lastRate)}；${floorText}、${capText}。`,
  };
}

function shiftRateTiers(rateTiers, offset) {
  return rateTiers.map((tier) => ({
    ...tier,
    annualRate: Math.max(0, tier.annualRate + offset),
  }));
}

function parseRateBatchInput() {
  const raw = elements.rateBatchInput.value.trim();
  if (!raw) {
    return { valid: true, rates: [] };
  }

  const tokens = raw
    .split(/[\s,，、\n\r\t]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (!tokens.length) {
    return { valid: true, rates: [] };
  }

  const rates = [];
  for (const [index, token] of tokens.entries()) {
    const rate = Number(token);
    if (!Number.isFinite(rate) || rate < 0) {
      return { valid: false, message: `利率批次第 ${index + 1} 筆格式不正確，請輸入大於或等於 0 的數字。` };
    }
    rates.push(rate);
  }

  const uniqueRates = [...new Set(rates)];
  if (uniqueRates.length > 12) {
    return { valid: false, message: "利率批次比較最多支援 12 組情境。" };
  }

  return { valid: true, rates: uniqueRates };
}

function getRiskThresholds() {
  const parseOrDefault = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
  };

  const thresholds = {
    dsrMedium: parseOrDefault(elements.riskDsrMedium.value, DEFAULT_RISK_THRESHOLDS.dsrMedium),
    dsrHigh: parseOrDefault(elements.riskDsrHigh.value, DEFAULT_RISK_THRESHOLDS.dsrHigh),
    debtMedium: parseOrDefault(elements.riskDebtMedium.value, DEFAULT_RISK_THRESHOLDS.debtMedium),
    debtHigh: parseOrDefault(elements.riskDebtHigh.value, DEFAULT_RISK_THRESHOLDS.debtHigh),
    aprGap: parseOrDefault(elements.riskAprGap.value, DEFAULT_RISK_THRESHOLDS.aprGap),
    feeRatio: parseOrDefault(elements.riskFeeRatio.value, DEFAULT_RISK_THRESHOLDS.feeRatio),
  };

  if (thresholds.dsrHigh < thresholds.dsrMedium) {
    thresholds.dsrHigh = thresholds.dsrMedium;
  }
  if (thresholds.debtHigh < thresholds.debtMedium) {
    thresholds.debtHigh = thresholds.debtMedium;
  }

  return thresholds;
}

function validateInputs() {
  const loanAmount = Number(elements.loanAmount.value);
  const annualRate = Number(elements.annualRate.value);
  const loanMonths = Number(elements.loanMonths.value);
  const handlingFee = Number(elements.handlingFee.value || 0);
  const graceMonths = Number(elements.graceMonths.value || 0);
  const paymentDayRaw = elements.paymentDay.value.trim();
  const paymentDay = paymentDayRaw === "" ? 0 : Number(paymentDayRaw);
  const prepayFee = Number(elements.prepayFee.value || 0);
  const prepayPenaltyRate = Number(elements.prepayPenaltyRate.value || 0);
  const monteCarloIterations = Number(elements.monteCarloIterations.value || DEFAULT_MONTE_CARLO_ITERATIONS);
  const monteCarloIncomeVolatility = Number(elements.monteCarloIncomeVolatility.value || 0);
  const monteCarloRateVolatility = Number(elements.monteCarloRateVolatility.value || 0);
  const monteCarloExpenseShockProbability = Number(elements.monteCarloExpenseShockProbability.value || 0);
  const monteCarloExpenseShockAmount = Number(elements.monteCarloExpenseShockAmount.value || 0);
  const monteCarloSeed = elements.monteCarloSeed.value.trim();
  const monthlyIncome = Number(elements.monthlyIncome.value || 0);
  const existingDebtPayment = Number(elements.existingDebtPayment.value || 0);
  const fixedLivingExpense = Number(elements.fixedLivingExpense.value || 0);
  const stressIncomeDrop = Number(elements.stressIncomeDrop.value || 0);
  const stressRateRise = Number(elements.stressRateRise.value || 0);
  const stressExpenseShock = Number(elements.stressExpenseShock.value || 0);
  const stressSafetyBuffer = Number(elements.stressSafetyBuffer.value || 0);
  const sensitivityStep = Number(elements.sensitivityStep.value || 0);
  const sensitivityDownCount = Number(elements.sensitivityDownCount.value || 0);
  const sensitivityUpCount = Number(elements.sensitivityUpCount.value || 0);
  const matrixTermStep = Number(elements.matrixTermStep.value || 0);
  const matrixTermDownCount = Number(elements.matrixTermDownCount.value || 0);
  const matrixTermUpCount = Number(elements.matrixTermUpCount.value || 0);
  const matrixMetricKey = elements.matrixMetricKey.value;
  const prepayMonthRaw = elements.prepayMonth.value.trim();
  const prepayAmountRaw = elements.prepayAmount.value.trim();
  const affordablePaymentRaw = elements.affordablePayment.value.trim();
  const prepayMonth = prepayMonthRaw === "" ? 0 : Number(prepayMonthRaw);
  const prepayAmount = prepayAmountRaw === "" ? 0 : Number(prepayAmountRaw);
  const affordablePayment = affordablePaymentRaw === "" ? 0 : Number(affordablePaymentRaw);
  const reportUserName = elements.reportUserName.value.trim();
  const reportBankName = elements.reportBankName.value.trim();
  const reportDate = elements.reportDate.value;
  const reportNote = elements.reportNote.value.trim();

  if (!Number.isFinite(loanAmount) || loanAmount <= 0) {
    return { valid: false, message: "貸款金額需大於 0。" };
  }

  if (!Number.isFinite(annualRate) || annualRate < 0) {
    return { valid: false, message: "基準年利率不可小於 0。" };
  }

  if (!Number.isInteger(loanMonths) || loanMonths <= 0) {
    return { valid: false, message: "總期數需為大於 0 的整數月數。" };
  }

  if (!Number.isFinite(handlingFee) || handlingFee < 0) {
    return { valid: false, message: "開辦費 / 手續費不可小於 0。" };
  }

  if (!Number.isFinite(prepayFee) || prepayFee < 0) {
    return { valid: false, message: "提前清償手續費不可小於 0。" };
  }

  if (!Number.isFinite(prepayPenaltyRate) || prepayPenaltyRate < 0) {
    return { valid: false, message: "提前清償違約金率不可小於 0。" };
  }

  if (handlingFee >= loanAmount * WAN_UNIT) {
    return { valid: false, message: "開辦費不可高於或等於貸款金額。" };
  }

  if (!Number.isInteger(graceMonths) || graceMonths < 0) {
    return { valid: false, message: "寬限期月數需為 0 或正整數。" };
  }

  if (graceMonths >= loanMonths) {
    return { valid: false, message: "寬限期月數需小於總期數。" };
  }

  if (!Number.isInteger(paymentDay) || paymentDay < 0 || paymentDay > 28) {
    return { valid: false, message: "固定扣款日需為 0 到 28 的整數。" };
  }

  if (!Number.isInteger(prepayMonth) || prepayMonth < 0) {
    return { valid: false, message: "提前清償月份需為 0 或正整數。" };
  }

  if (prepayMonth > loanMonths) {
    return { valid: false, message: "提前清償月份不可大於總期數。" };
  }

  if (!Number.isFinite(prepayAmount) || prepayAmount < 0) {
    return { valid: false, message: "提前清償金額不可小於 0。" };
  }

  if (!Number.isFinite(monthlyIncome) || monthlyIncome < 0) {
    return { valid: false, message: "月收入不可小於 0。" };
  }

  if (!Number.isFinite(existingDebtPayment) || existingDebtPayment < 0) {
    return { valid: false, message: "既有貸款月付不可小於 0。" };
  }

  if (!Number.isFinite(fixedLivingExpense) || fixedLivingExpense < 0) {
    return { valid: false, message: "每月固定支出不可小於 0。" };
  }

  if (!Number.isFinite(affordablePayment) || affordablePayment < 0) {
    return { valid: false, message: "可接受月付上限不可小於 0。" };
  }

  if (!Number.isFinite(stressIncomeDrop) || stressIncomeDrop < 0 || stressIncomeDrop > 100) {
    return { valid: false, message: "收入下修幅度需介於 0% 到 100% 之間。" };
  }

  if (!Number.isFinite(stressRateRise) || stressRateRise < 0) {
    return { valid: false, message: "升息幅度不可小於 0。" };
  }

  if (!Number.isFinite(stressExpenseShock) || stressExpenseShock < 0) {
    return { valid: false, message: "額外支出衝擊不可小於 0。" };
  }

  if (!Number.isFinite(stressSafetyBuffer) || stressSafetyBuffer < 0) {
    return { valid: false, message: "安全餘裕門檻不可小於 0。" };
  }

  if (!Number.isInteger(monteCarloIterations) || monteCarloIterations < 100) {
    return { valid: false, message: "Monte Carlo 模擬次數需至少 100 次。" };
  }

  if (!Number.isFinite(monteCarloIncomeVolatility) || monteCarloIncomeVolatility < 0) {
    return { valid: false, message: "Monte Carlo 月收入波動不可小於 0。" };
  }

  if (!Number.isFinite(monteCarloRateVolatility) || monteCarloRateVolatility < 0) {
    return { valid: false, message: "Monte Carlo 利率波動不可小於 0。" };
  }

  if (!Number.isFinite(monteCarloExpenseShockProbability) || monteCarloExpenseShockProbability < 0 || monteCarloExpenseShockProbability > 100) {
    return { valid: false, message: "Monte Carlo 突發支出機率需介於 0% 到 100% 之間。" };
  }

  if (!Number.isFinite(monteCarloExpenseShockAmount) || monteCarloExpenseShockAmount < 0) {
    return { valid: false, message: "Monte Carlo 單次突發支出不可小於 0。" };
  }

  if (!Number.isFinite(sensitivityStep) || sensitivityStep < 0) {
    return { valid: false, message: "利率變動步長不可小於 0。" };
  }

  if (!Number.isInteger(sensitivityDownCount) || sensitivityDownCount < 0) {
    return { valid: false, message: "向下模擬組數需為 0 或正整數。" };
  }

  if (!Number.isInteger(sensitivityUpCount) || sensitivityUpCount < 0) {
    return { valid: false, message: "向上模擬組數需為 0 或正整數。" };
  }

  if ((sensitivityDownCount > 0 || sensitivityUpCount > 0) && sensitivityStep === 0) {
    return { valid: false, message: "若要做利率敏感度分析，利率變動步長需大於 0。" };
  }

  if (!Number.isFinite(matrixTermStep) || matrixTermStep < 0) {
    return { valid: false, message: "期數變動步長不可小於 0。" };
  }

  if (!Number.isInteger(matrixTermDownCount) || matrixTermDownCount < 0) {
    return { valid: false, message: "期數縮短組數需為 0 或正整數。" };
  }

  if (!Number.isInteger(matrixTermUpCount) || matrixTermUpCount < 0) {
    return { valid: false, message: "期數延長組數需為 0 或正整數。" };
  }

  if ((matrixTermDownCount > 0 || matrixTermUpCount > 0) && matrixTermStep === 0) {
    return { valid: false, message: "若要做條件敏感度矩陣，期數變動步長需大於 0。" };
  }

  if (!["monthlyPayment", "totalInterest", "aprEstimate", "totalPayment", "dsr"].includes(matrixMetricKey)) {
    return { valid: false, message: "條件敏感度矩陣指標不正確。" };
  }

  if ((prepayMonth === 0 && prepayAmount > 0) || (prepayMonth > 0 && prepayAmount === 0)) {
    return { valid: false, message: "提前清償月份與金額需同時填寫，或兩者都留空。" };
  }

  if (reportDate && Number.isNaN(new Date(`${reportDate}T00:00:00`).getTime())) {
    return { valid: false, message: "試算日期格式不正確。" };
  }

  const indexedRateValidation = parseIndexedRateConfig(loanMonths);
  if (!indexedRateValidation.valid) {
    return indexedRateValidation;
  }

  const tierValidation = indexedRateValidation.enabled
    ? { valid: true, tiers: indexedRateValidation.rateTiers }
    : parseTierRows(loanMonths);
  if (!tierValidation.valid) {
    return tierValidation;
  }

  const extraPrepayValidation = parseExtraPrepayRows(loanMonths);
  if (!extraPrepayValidation.valid) {
    return extraPrepayValidation;
  }

  const debtValidation = parseDebtRows();
  if (!debtValidation.valid) {
    return debtValidation;
  }

  const rateBatchValidation = parseRateBatchInput();
  if (!rateBatchValidation.valid) {
    return rateBatchValidation;
  }

  return {
    valid: true,
    values: {
      loanAmount,
      annualRate,
      loanMonths,
      handlingFee,
      graceMonths,
      paymentDay,
      prepayFee,
      prepayPenaltyRate,
      prepayMonth,
      prepayAmount,
      extraPrepayEvents: extraPrepayValidation.events,
      debtItems: debtValidation.items,
      monthlyIncome,
      existingDebtPayment,
      fixedLivingExpense,
      affordablePayment,
      stressIncomeDrop,
      stressRateRise,
      stressExpenseShock,
      stressSafetyBuffer,
      monteCarloIterations,
      monteCarloIncomeVolatility,
      monteCarloRateVolatility,
      monteCarloExpenseShockProbability,
      monteCarloExpenseShockAmount,
      monteCarloSeed,
      sensitivityStep,
      sensitivityDownCount,
      sensitivityUpCount,
      matrixTermStep,
      matrixTermDownCount,
      matrixTermUpCount,
      matrixMetricKey,
      rateBatchRates: rateBatchValidation.rates,
      rateTiers: tierValidation.tiers,
      indexedRate: indexedRateValidation,
      reportUserName,
      reportBankName,
      reportDate,
      reportNote,
    },
  };
}

function buildSensitivityRows(options) {
  const {
    loanAmountValue,
    handlingFeeValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    sensitivityStep,
    sensitivityDownCount,
    sensitivityUpCount,
  } = options;
  const rows = [];

  for (let offset = -sensitivityDownCount; offset <= sensitivityUpCount; offset += 1) {
    const scenarioRate = Math.max(0, annualRate + offset * sensitivityStep);
    const scenarioRateTiers = rateTiers.length ? shiftRateTiers(rateTiers, offset * sensitivityStep) : [];
    const scenario = buildSchedule({
      principal: loanAmountValue,
      annualRate: scenarioRate,
      totalMonths: loanMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      rateTiers: scenarioRateTiers,
    });
    const netAmount = loanAmountValue - handlingFeeValue;
    const cashflows = [netAmount, ...scenario.rows.map((row) => -(row.payment + row.extraPayment))];
    const monthlyIrr = estimateMonthlyIrr(cashflows);
    const aprEstimate = monthlyIrr === null ? null : ((1 + monthlyIrr) ** 12 - 1) * 100;
    const delta = offset * sensitivityStep;
    const label = offset === 0
      ? "基準情境"
      : delta > 0
        ? `+${decimalFormatter.format(delta)}%`
        : `${decimalFormatter.format(delta)}%`;

    rows.push({
      label,
      annualRate: scenarioRate,
      monthlyPayment: scenario.regularPayment,
      totalInterest: scenario.totalInterest,
      aprEstimate,
    });
  }

  return rows;
}

function buildRateBatchRows(options) {
  const {
    loanAmountValue,
    handlingFeeValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    rateBatchRates,
  } = options;

  if (!rateBatchRates.length) {
    return [];
  }

  const baselineScenario = buildSchedule({
    principal: loanAmountValue,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
  });

  return rateBatchRates.map((scenarioRate, index) => {
    const rateOffset = scenarioRate - annualRate;
    const scenario = buildSchedule({
      principal: loanAmountValue,
      annualRate: scenarioRate,
      totalMonths: loanMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      rateTiers: rateTiers.length ? shiftRateTiers(rateTiers, rateOffset) : [],
    });
    const netAmount = loanAmountValue - handlingFeeValue;
    const cashflows = [netAmount, ...scenario.rows.map((row) => -(row.payment + row.extraPayment))];
    const monthlyIrr = estimateMonthlyIrr(cashflows);
    const aprEstimate = monthlyIrr === null ? null : ((1 + monthlyIrr) ** 12 - 1) * 100;
    const paymentGap = scenario.regularPayment - baselineScenario.regularPayment;
    const interestGap = scenario.totalInterest - baselineScenario.totalInterest;
    const riskTag = paymentGap > baselineScenario.regularPayment * 0.1 || scenarioRate >= annualRate + 1
      ? "升息壓力高"
      : paymentGap > 0 || interestGap > 0
        ? "成本偏高"
        : "相對溫和";

    return {
      label: `批次 ${index + 1}`,
      annualRate: scenarioRate,
      monthlyPayment: scenario.regularPayment,
      totalInterest: scenario.totalInterest,
      aprEstimate,
      paymentGap,
      interestGap,
      riskTag,
    };
  }).sort((left, right) => left.annualRate - right.annualRate);
}

function buildComparisonRows() {
  return getCompareScenariosState().map((scenario, index) => {
    const loanAmount = Number(scenario.loanAmount || 0);
    const annualRate = Number(scenario.annualRate || 0);
    const months = Number(scenario.months || 0);
    const handlingFee = Number(scenario.handlingFee || 0);
    const graceMonths = Number(scenario.graceMonths || 0);
    const name = scenario.name?.trim() || `方案 ${String.fromCharCode(65 + index)}`;

    if (!(loanAmount > 0) || !(months > 0) || annualRate < 0 || graceMonths < 0 || graceMonths >= months) {
      return null;
    }

    const principal = loanAmount * WAN_UNIT;
    const schedule = buildSchedule({
      principal,
      annualRate,
      totalMonths: months,
      graceMonths,
    });
    const netAmount = principal - handlingFee;
    const cashflows = [netAmount, ...schedule.rows.map((row) => -(row.payment + row.extraPayment))];
    const monthlyIrr = estimateMonthlyIrr(cashflows);
    const aprEstimate = monthlyIrr === null ? null : ((1 + monthlyIrr) ** 12 - 1) * 100;

    return {
      name,
      annualRate,
      months,
      handlingFee,
      graceMonths,
      monthlyPayment: schedule.regularPayment,
      totalPayment: schedule.totalPayment,
      totalInterest: schedule.totalInterest,
      netAmount,
      aprEstimate,
      note: graceMonths > 0 ? `含 ${graceMonths} 期寬限期` : "一般攤還",
    };
  }).filter(Boolean);
}

function buildPrepayTimingRows(options) {
  const {
    principal,
    annualRate,
    totalMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    handlingFeeValue,
    prepayAmountValue,
    prepayFee,
    prepayPenaltyRate,
    rateTiers,
    baseScenario,
  } = options;

  if (!(prepayAmountValue > 0) || !baseScenario?.rows?.length) {
    return [];
  }

  const candidateMonths = [];
  for (let month = 1; month <= Math.max(totalMonths - 1, 1); month += 1) {
    candidateMonths.push(month);
  }

  const rows = candidateMonths.map((month) => {
    const scenario = buildSchedule({
      principal,
      annualRate,
      totalMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      prepayMonth: month,
      prepayAmount: prepayAmountValue,
      prepayFeeFixed: prepayFee,
      prepayPenaltyRate,
      rateTiers,
    });
    const interestSaved = baseScenario.totalInterest - scenario.totalInterest;
    const netSaved = interestSaved - scenario.totalPenaltyCost;
    const monthsSaved = baseScenario.monthsUsed - scenario.monthsUsed;

    return {
      month,
      interestSaved,
      penaltyCost: scenario.totalPenaltyCost,
      netSaved,
      monthsSaved,
      totalPayment: scenario.totalPayment,
      aprEstimate: estimateApr(principal - handlingFeeValue, scenario.rows),
    };
  });

  return rows
    .sort((a, b) => {
      if (b.netSaved !== a.netSaved) {
        return b.netSaved - a.netSaved;
      }
      if (b.monthsSaved !== a.monthsSaved) {
        return b.monthsSaved - a.monthsSaved;
      }
      return a.month - b.month;
    })
    .slice(0, 5);
}

function estimateApr(netAmount, rows) {
  const cashflows = [netAmount, ...rows.map((row) => -(row.payment + row.extraPayment + (row.penaltyCost ?? 0)))];
  const monthlyIrr = estimateMonthlyIrr(cashflows);
  return monthlyIrr === null ? null : ((1 + monthlyIrr) ** 12 - 1) * 100;
}

function calculateLevelPayment(principal, monthlyRate, months) {
  if (months <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return principal / months;
  }

  const factor = (1 + monthlyRate) ** months;
  return principal * monthlyRate * factor / (factor - 1);
}

function estimateMaxLoanAmount(options) {
  const {
    affordablePaymentWan,
    annualRate,
    totalMonths,
    graceMonths,
  } = options;
  const affordablePaymentValue = affordablePaymentWan * WAN_UNIT;

  if (affordablePaymentValue <= 0 || totalMonths <= graceMonths) {
    return 0;
  }

  const monthlyRate = annualRate / 12 / 100;
  const amortizationMonths = totalMonths - graceMonths;

  if (monthlyRate === 0) {
    return affordablePaymentValue * amortizationMonths;
  }

  const factor = (1 + monthlyRate) ** amortizationMonths;
  const amortizedPrincipalCap = affordablePaymentValue * (factor - 1) / (monthlyRate * factor);

  if (graceMonths > 0) {
    const graceInterestCap = affordablePaymentValue / monthlyRate;
    return Math.min(amortizedPrincipalCap, graceInterestCap);
  }

  return amortizedPrincipalCap;
}

function estimateLoanRange(options) {
  const {
    monthlyIncome = 0,
    existingDebtPayment = 0,
    affordablePaymentWan = 0,
    annualRate,
    totalMonths,
    graceMonths,
  } = options;

  const userCap = affordablePaymentWan > 0 ? affordablePaymentWan * WAN_UNIT : null;
  const conservativeCap = monthlyIncome > 0 ? Math.max(0, monthlyIncome * 0.3 - existingDebtPayment) : null;
  const balancedCap = monthlyIncome > 0 ? Math.max(0, monthlyIncome * 0.4 - existingDebtPayment) : null;
  const aggressiveCap = monthlyIncome > 0 ? Math.max(0, monthlyIncome * 0.5 - existingDebtPayment) : null;

  const resolveCap = (incomeCap, multiplier) => {
    if (userCap !== null && incomeCap !== null) {
      return Math.min(userCap * multiplier, incomeCap);
    }
    if (userCap !== null) {
      return userCap * multiplier;
    }
    return incomeCap ?? 0;
  };

  const conservativePayment = resolveCap(conservativeCap, 0.85);
  const balancedPayment = resolveCap(balancedCap, 1);
  const aggressivePayment = resolveCap(aggressiveCap, 1.15);

  return {
    conservative: estimateMaxLoanAmount({ affordablePaymentWan: conservativePayment / WAN_UNIT, annualRate, totalMonths, graceMonths }),
    balanced: estimateMaxLoanAmount({ affordablePaymentWan: balancedPayment / WAN_UNIT, annualRate, totalMonths, graceMonths }),
    aggressive: estimateMaxLoanAmount({ affordablePaymentWan: aggressivePayment / WAN_UNIT, annualRate, totalMonths, graceMonths }),
    conservativePayment,
    balancedPayment,
    aggressivePayment,
  };
}

function getTierForMonth(month, rateTiers, defaultAnnualRate) {
  if (!rateTiers.length) {
    return defaultAnnualRate;
  }

  const tier = rateTiers.find((item) => month >= item.startMonth && month <= item.endMonth);
  return tier ? tier.annualRate : defaultAnnualRate;
}

function buildSchedule(options) {
  const {
    principal,
    annualRate,
    totalMonths,
    graceMonths,
    firstPaymentDate = "",
    paymentDay = 0,
    prepayMonth = 0,
    prepayAmount = 0,
    prepayFeeFixed = 0,
    prepayPenaltyRate = 0,
    prepaymentEvents = [],
    prepaymentStrategy = "shorten-term",
    rateTiers = [],
  } = options;

  const rows = [];
  let remainingBalance = principal;
  let totalInterest = 0;
  let totalPayment = 0;
  let totalPenaltyCost = 0;
  let currentPayment = 0;
  let currentRateKey = "";
  const normalizedEvents = [
    ...(prepayMonth > 0 && prepayAmount > 0
      ? [{ month: prepayMonth, amount: prepayAmount, fee: prepayFeeFixed, penaltyRate: prepayPenaltyRate }]
      : []),
    ...prepaymentEvents,
  ]
    .filter((eventItem) => eventItem && eventItem.month > 0 && eventItem.amount > 0)
    .sort((a, b) => a.month - b.month);

  for (let month = 1; month <= totalMonths && remainingBalance > 0.000001; month += 1) {
    const rateForMonth = getTierForMonth(month, rateTiers, annualRate);
    const monthlyRate = rateForMonth / 12 / 100;
    const isGracePeriod = month <= graceMonths;
    const monthsLeft = totalMonths - month + 1;

    if (isGracePeriod) {
      currentPayment = monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
    } else {
      const rateKey = prepaymentStrategy === "reduce-payment"
        ? `${rateForMonth}-${monthsLeft}`
        : `${rateForMonth}-${graceMonths > 0 ? "post-grace" : "fixed"}`;
      if (rateKey !== currentRateKey) {
        currentPayment = calculateLevelPayment(remainingBalance, monthlyRate, monthsLeft);
        currentRateKey = rateKey;
      }
    }

    const interest = monthlyRate === 0 ? 0 : remainingBalance * monthlyRate;
    let scheduledPayment = isGracePeriod ? currentPayment : currentPayment;
    let principalPaid = isGracePeriod ? 0 : Math.max(0, scheduledPayment - interest);
    let extraPayment = 0;
    let penaltyCost = 0;

    if (!isGracePeriod && principalPaid > remainingBalance) {
      principalPaid = remainingBalance;
      scheduledPayment = principalPaid + interest;
    }

    remainingBalance = Math.max(0, remainingBalance - principalPaid);

    const monthEvents = normalizedEvents.filter((eventItem) => eventItem.month === month);
    if (monthEvents.length) {
      monthEvents.forEach((eventItem) => {
        if (remainingBalance <= 0.000001) {
          return;
        }

        const eventPayment = Math.min(eventItem.amount, remainingBalance);
        extraPayment += eventPayment;
        remainingBalance = Math.max(0, remainingBalance - eventPayment);
        penaltyCost += (eventItem.fee || 0) + (eventPayment * (eventItem.penaltyRate || 0) / 100);
      });

      totalPenaltyCost += penaltyCost;
      totalPayment += penaltyCost;
      if (prepaymentStrategy === "reduce-payment") {
        currentRateKey = "";
      }
    }

    totalInterest += interest;
    totalPayment += scheduledPayment + extraPayment;

    rows.push({
      month,
      paymentDate: addMonthsToDateString(firstPaymentDate, month - 1, paymentDay),
      annualRate: rateForMonth,
      payment: scheduledPayment,
      principalPaid,
      interest,
      extraPayment,
      penaltyCost,
      remainingBalance,
    });
  }

  return {
    rows,
    regularPayment: rows.find((row) => row.month > graceMonths)?.payment || 0,
    gracePayment: rows.find((row) => row.month <= graceMonths)?.payment || 0,
    totalInterest,
    totalPayment,
    totalPenaltyCost,
    monthsUsed: rows.length,
  };
}

function renderSchedule(target, rows, emptyMessage) {
  if (!rows.length) {
    renderEmptyTable(target, emptyMessage);
    return;
  }

  target.innerHTML = rows.map((row) => `
    <tr>
      <td data-label="期數">${row.month}</td>
      <td data-label="日期">${formatDateLabel(row.paymentDate)}</td>
      <td data-label="年利率">${formatPercent(row.annualRate)}</td>
      <td data-label="月付金(萬)">${formatWan(row.payment)}</td>
      <td data-label="本金(萬)">${formatWan(row.principalPaid)}</td>
      <td data-label="利息(元)">${formatCurrency(row.interest)}</td>
      <td data-label="額外清償(萬)">${row.extraPayment > 0 ? formatWan(row.extraPayment) : "-"}</td>
      <td data-label="提前清償費用(元)">${row.penaltyCost > 0 ? formatCurrency(row.penaltyCost) : "-"}</td>
      <td data-label="剩餘本金(萬)">${formatWan(row.remainingBalance)}</td>
    </tr>
  `).join("");
}

function summarizeRowsByCalendarMonth(rows) {
  const groups = new Map();

  rows.forEach((row) => {
    const key = formatDateLabel(row.paymentDate);
    if (key === "-") {
      return;
    }

    if (!groups.has(key)) {
      groups.set(key, {
        label: key,
        payment: 0,
        principalPaid: 0,
        interest: 0,
        extraPayment: 0,
        penaltyCost: 0,
        cashOutflow: 0,
        remainingBalance: row.remainingBalance,
        installmentCount: 0,
        annualRateTotal: 0,
        graceMonths: 0,
        prepayMonths: 0,
      });
    }

    const group = groups.get(key);
    group.payment += row.payment;
    group.principalPaid += row.principalPaid;
    group.interest += row.interest;
    group.extraPayment += row.extraPayment;
    group.penaltyCost += row.penaltyCost ?? 0;
    group.cashOutflow += row.payment + row.extraPayment + (row.penaltyCost ?? 0);
    group.remainingBalance = row.remainingBalance;
    group.installmentCount += 1;
    group.annualRateTotal += row.annualRate;
    if (row.principalPaid === 0 && row.interest > 0) {
      group.graceMonths += 1;
    }
    if (row.extraPayment > 0 || (row.penaltyCost ?? 0) > 0) {
      group.prepayMonths += 1;
    }
  });

  return [...groups.values()].map((group) => ({
    ...group,
    averageAnnualRate: group.installmentCount > 0 ? group.annualRateTotal / group.installmentCount : 0,
    year: group.label.split("-")[0] ?? "",
  }));
}

function filterCalendarGroups(groups) {
  if (calendarYearFilter === "all") {
    return groups;
  }
  return groups.filter((group) => group.year === calendarYearFilter);
}

function sortCalendarGroups(groups) {
  const sortedGroups = [...groups];
  const comparators = {
    chronological: (left, right) => left.label.localeCompare(right.label),
    cashOutflow: (left, right) => right.cashOutflow - left.cashOutflow || left.label.localeCompare(right.label),
    interest: (left, right) => right.interest - left.interest || left.label.localeCompare(right.label),
    remainingBalance: (left, right) => right.remainingBalance - left.remainingBalance || left.label.localeCompare(right.label),
  };
  return sortedGroups.sort(comparators[calendarSortKey] ?? comparators.chronological);
}

function buildCalendarComparisonMap(groups) {
  return new Map(groups.map((group) => [group.label, group]));
}

function populateCalendarYearFilter(baseRows = [], prepayRows = []) {
  const allGroups = [
    ...summarizeRowsByCalendarMonth(baseRows),
    ...summarizeRowsByCalendarMonth(prepayRows),
  ];
  const yearOptions = [...new Set(allGroups.map((group) => group.year).filter(Boolean))].sort();
  const currentValue = yearOptions.includes(calendarYearFilter) ? calendarYearFilter : "all";
  calendarYearFilter = currentValue;
  elements.calendarYearFilter.innerHTML = [
    '<option value="all">全部年份</option>',
    ...yearOptions.map((year) => `<option value="${year}">${year} 年</option>`),
  ].join("");
  elements.calendarYearFilter.value = currentValue;
}

function updateCalendarSummary(baseRows = [], prepayRows = []) {
  const preferredRows = prepayRows.length ? prepayRows : baseRows;
  const filteredGroups = sortCalendarGroups(filterCalendarGroups(summarizeRowsByCalendarMonth(preferredRows)));

  if (!filteredGroups.length) {
    elements.calendarPeakMonth.textContent = "-";
    elements.calendarPeakPayment.textContent = "-";
    elements.calendarSummary.textContent = "-";
    return;
  }

  const peakCashOutflowGroup = [...filteredGroups].sort((left, right) => right.cashOutflow - left.cashOutflow)[0];
  const prepayMonthCount = filteredGroups.filter((group) => group.prepayMonths > 0).length;
  const graceMonthCount = filteredGroups.filter((group) => group.graceMonths > 0).length;

  elements.calendarPeakMonth.textContent = peakCashOutflowGroup.label;
  elements.calendarPeakPayment.textContent = formatWan(peakCashOutflowGroup.cashOutflow);
  elements.calendarSummary.textContent = `共 ${filteredGroups.length} 個月份，含 ${prepayMonthCount} 個有額外清償月份${graceMonthCount > 0 ? `，${graceMonthCount} 個寬限期月份` : ""}。`;
}

function renderCalendarView(target, rows, emptyMessage, compareRows = []) {
  if (!rows.length) {
    target.innerHTML = `<article class="advice-card empty-advice">${emptyMessage}</article>`;
    return;
  }

  const groups = sortCalendarGroups(filterCalendarGroups(summarizeRowsByCalendarMonth(rows)));
  if (!groups.length) {
    target.innerHTML = `<article class="advice-card empty-advice">${emptyMessage}</article>`;
    return;
  }

  const compareGroupMap = buildCalendarComparisonMap(summarizeRowsByCalendarMonth(compareRows));

  target.innerHTML = groups.map((group) => {
    const compareGroup = compareGroupMap.get(group.label);
    const deltaCashOutflow = compareGroup ? group.cashOutflow - compareGroup.cashOutflow : null;
    const deltaInterest = compareGroup ? group.interest - compareGroup.interest : null;
    const deltaClass = deltaCashOutflow === null
      ? ""
      : deltaCashOutflow < 0
        ? "is-delta-positive"
        : deltaCashOutflow > 0
          ? "is-delta-negative"
          : "";

    return `
      <article class="calendar-card ${deltaClass}">
        <h4>${group.label}</h4>
        <div class="calendar-badges">
          <span class="calendar-badge">總支出 ${formatWan(group.cashOutflow)}</span>
          <span class="calendar-badge">平均利率 ${formatPercent(group.averageAnnualRate)}</span>
          ${group.prepayMonths > 0 ? '<span class="calendar-badge is-alert">含提前清償</span>' : ""}
          ${group.graceMonths > 0 ? '<span class="calendar-badge">寬限期</span>' : ""}
        </div>
        <p>月付合計：${formatWan(group.payment)}</p>
        <p>本金合計：${formatWan(group.principalPaid)}</p>
        <p>利息合計：${formatCurrency(group.interest)}</p>
        <p>額外清償：${group.extraPayment > 0 ? formatWan(group.extraPayment) : "-"}</p>
        <p>提前清償費用：${group.penaltyCost > 0 ? formatCurrency(group.penaltyCost) : "-"}</p>
        <p>月末剩餘本金：${formatWan(group.remainingBalance)}</p>
        <p>當月期數：${group.installmentCount} 期</p>
        ${compareGroup ? `
          <div class="calendar-delta">
            <strong>相較對照方案</strong>
            <p>總支出差異：${deltaCashOutflow === 0 ? "持平" : deltaCashOutflow < 0 ? `少 ${formatWan(Math.abs(deltaCashOutflow))}` : `多 ${formatWan(deltaCashOutflow)}`}</p>
            <p>利息差異：${deltaInterest === 0 ? "持平" : deltaInterest < 0 ? `少 ${formatCurrency(Math.abs(deltaInterest))}` : `多 ${formatCurrency(deltaInterest)}`}</p>
          </div>
        ` : ""}
      </article>
    `;
  }).join("");
}

function npv(rate, cashflows) {
  return cashflows.reduce((sum, cashflow, index) => sum + cashflow / ((1 + rate) ** index), 0);
}

function estimateMonthlyIrr(cashflows) {
  let low = -0.9999;
  let high = 1;
  let npvLow = npv(low, cashflows);
  let npvHigh = npv(high, cashflows);

  while (npvLow * npvHigh > 0 && high < 100) {
    high *= 2;
    npvHigh = npv(high, cashflows);
  }

  if (npvLow * npvHigh > 0) {
    return null;
  }

  for (let i = 0; i < 120; i += 1) {
    const mid = (low + high) / 2;
    const npvMid = npv(mid, cashflows);

    if (Math.abs(npvMid) < 1e-8) {
      return mid;
    }

    if (npvLow * npvMid <= 0) {
      high = mid;
    } else {
      low = mid;
      npvLow = npvMid;
    }
  }

  return (low + high) / 2;
}

function rowsToCsv(rows) {
  const header = ["期數", "日期", "年利率%", "月付金(萬)", "本金(萬)", "利息(元)", "額外清償(萬)", "提前清償費用(元)", "剩餘本金(萬)"];
  const body = rows.map((row) => [
    row.month,
    row.paymentDate ? formatDateLabel(row.paymentDate) : "",
    row.annualRate.toFixed(2),
    (row.payment / WAN_UNIT).toFixed(2),
    (row.principalPaid / WAN_UNIT).toFixed(2),
    Math.round(row.interest),
    (row.extraPayment / WAN_UNIT).toFixed(2),
    Math.round(row.penaltyCost ?? 0),
    (row.remainingBalance / WAN_UNIT).toFixed(2),
  ]);

  return [header, ...body].map((line) => line.join(",")).join("\n");
}

function annualRowsToCsv(rows) {
  const annualRows = summarizeRowsByYear(rows);
  const header = ["年度", "平均年利率%", "年度還款(萬)", "年度本金(萬)", "年度利息(元)", "年度額外清償(萬)", "年度提前清償費用(元)", "年末剩餘本金(萬)"];
  const body = annualRows.map((row) => [
    row.month,
    row.annualRate.toFixed(2),
    ((row.payment + row.extraPayment + (row.penaltyCost ?? 0)) / WAN_UNIT).toFixed(2),
    (row.principalPaid / WAN_UNIT).toFixed(2),
    Math.round(row.interest),
    (row.extraPayment / WAN_UNIT).toFixed(2),
    Math.round(row.penaltyCost ?? 0),
    (row.remainingBalance / WAN_UNIT).toFixed(2),
  ]);

  return [header, ...body].map((line) => line.join(",")).join("\n");
}

function downloadCsv(filename, rows) {
  if (!rows || !rows.length) {
    return;
  }

  const csv = `\uFEFF${rowsToCsv(rows)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadAnnualCsv(filename, rows) {
  if (!rows || !rows.length) {
    return;
  }

  const csv = `\uFEFF${annualRowsToCsv(rows)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function downloadCanvasPng(canvas, filename) {
  if (!canvas) {
    return;
  }

  const url = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function comparisonRowsToCsv(rows) {
  const header = ["方案", "月付金(萬)", "總還款(萬)", "總利息(元)", "實拿金額(萬)", "APR", "判讀"];
  const body = rows.map((row) => [
    row.name,
    (row.monthlyPayment / WAN_UNIT).toFixed(2),
    (row.totalPayment / WAN_UNIT).toFixed(2),
    Math.round(row.totalInterest),
    (row.netAmount / WAN_UNIT).toFixed(2),
    row.aprEstimate === null ? "" : row.aprEstimate.toFixed(2),
    row.note,
  ]);
  return [header, ...body].map((line) => line.join(",")).join("\n");
}

function downloadComparisonCsv(filename, rows) {
  if (!rows?.length) {
    return;
  }

  const csv = `\uFEFF${comparisonRowsToCsv(rows)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function printComparisonResults(rows) {
  if (!rows?.length) {
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html lang="zh-Hant">
    <head>
      <meta charset="UTF-8">
      <title>銀行方案比較報表</title>
      <style>
        body { font-family: "Noto Sans TC", sans-serif; padding: 24px; color: #221811; }
        h1 { margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #cbb9a8; padding: 10px; text-align: right; }
        th:first-child, td:first-child { text-align: left; }
        th:last-child, td:last-child { text-align: left; }
        th { background: #f7efe5; }
      </style>
    </head>
    <body>
      <h1>銀行方案比較報表</h1>
      <table>
        <thead>
          <tr>
            <th>方案</th>
            <th>月付金(萬)</th>
            <th>總還款(萬)</th>
            <th>總利息(元)</th>
            <th>實拿金額(萬)</th>
            <th>APR</th>
            <th>判讀</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `
            <tr>
              <td>${row.name}</td>
              <td>${formatWan(row.monthlyPayment)}</td>
              <td>${formatWan(row.totalPayment)}</td>
              <td>${formatCurrency(row.totalInterest)}</td>
              <td>${formatWan(row.netAmount)}</td>
              <td>${row.aprEstimate === null ? "-" : formatPercent(row.aprEstimate)}</td>
              <td>${row.note}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </body>
    </html>
  `;

  const compareWindow = window.open("", "_blank", "width=1080,height=720");
  if (!compareWindow) {
    return;
  }

  compareWindow.document.open();
  compareWindow.document.write(html);
  compareWindow.document.close();
  compareWindow.focus();
  compareWindow.print();
}

function updatePrintSummary(context) {
  if (!context) {
    elements.printSummaryNote.textContent = "請先完成試算，再輸出 PDF。";
    elements.printUserName.textContent = "-";
    elements.printBankName.textContent = "-";
    elements.printReportDate.textContent = "-";
    elements.printReportNote.textContent = "-";
    elements.printLoanMeta.textContent = "-";
    elements.printPaymentMeta.textContent = "-";
    elements.printCostMeta.textContent = "-";
    elements.printAprMeta.textContent = "-";
    return;
  }

  const {
    loanAmount,
    annualRate,
    loanMonths,
    handlingFee,
    graceMonths,
    paymentDay,
    reportUserName,
    reportBankName,
    reportDate,
    reportNote,
    aprEstimate,
    baseScenario,
    prepayScenario,
    prepayMonth,
    prepayAmount,
    extraPrepayEvents = [],
    debtConsolidation,
  } = context;

  elements.printSummaryNote.textContent = "此摘要會隨 PDF 列印一併輸出。";
  elements.printUserName.textContent = reportUserName || "-";
  elements.printBankName.textContent = reportBankName || "-";
  elements.printReportDate.textContent = reportDate ? formatDateLabel(reportDate) : "-";
  elements.printReportNote.textContent = reportNote || "-";
  elements.printLoanMeta.textContent = `${formatWan(loanAmount)} / ${formatPercent(annualRate)} / ${loanMonths} 期 / 手續費 ${formatCurrency(handlingFee)}`;
  elements.printPaymentMeta.textContent = `月付約 ${formatWan(baseScenario.regularPayment)}${graceMonths > 0 ? `，寬限期 ${graceMonths} 期每月 ${formatWan(baseScenario.gracePayment)}` : "，無寬限期"}${paymentDay > 0 ? `，每月約 ${paymentDay} 日扣款` : ""}`;
  elements.printCostMeta.textContent = `總還款 ${formatWan(baseScenario.totalPayment)}，總利息 ${formatCurrency(baseScenario.totalInterest)}`;
  elements.printAprMeta.textContent = prepayScenario
    ? extraPrepayEvents.length
      ? `APR 約 ${aprEstimate === null ? "-" : formatPercent(aprEstimate)}，含 ${extraPrepayEvents.length + (prepayMonth > 0 && prepayAmount > 0 ? 1 : 0)} 筆提前清償`
      : `APR 約 ${aprEstimate === null ? "-" : formatPercent(aprEstimate)}，第 ${prepayMonth} 期提前清償 ${formatWan(prepayAmount)}`
    : `APR 約 ${aprEstimate === null ? "-" : formatPercent(aprEstimate)}，未設定提前清償`;
  if (debtConsolidation?.enabled && debtConsolidation.valid) {
    elements.printSummaryNote.textContent = `此摘要會隨 PDF 列印一併輸出。債務整合覆蓋率約 ${formatPercent(debtConsolidation.coverageRatio)}。`;
  }
}

function saveShareSnapshot(snapshot) {
  localStorage.setItem(SHARE_STORAGE_KEY, JSON.stringify(snapshot));
}

function clearShareSnapshot() {
  localStorage.removeItem(SHARE_STORAGE_KEY);
}

function resetOutputs() {
  setText([
    "monthlyPayment",
    "gracePayment",
    "totalPayment",
    "totalInterest",
    "netAmount",
    "feeRatio",
    "averageInterest",
    "firstInterest",
    "dsrValue",
    "dsrStatus",
    "maxLoanAmount",
    "loanRangeConservative",
    "loanRangeBalanced",
    "loanRangeAggressive",
    "stressBaseSurplus",
    "stressWorstSurplus",
    "stressBreakRate",
    "monteCarloFailRate",
    "monteCarloMedianSurplus",
    "monteCarloP10Surplus",
    "debtConsolidationMonthlyGap",
    "debtConsolidationTotalSaved",
    "debtConsolidationCoverage",
    "totalDebtPayment",
    "overallDebtRatio",
    "incomeAfterDebt",
    "incomeAfterAllExpenses",
    "refiMonthlyGap",
    "refiTotalSaved",
    "refiBreakEven",
    "aprEstimate",
    "aprCostGap",
    "aprSummary",
    "interestSaved",
    "monthsSaved",
    "prepayTotalPayment",
    "prepayPenaltyCost",
    "riskHighCount",
    "riskMediumCount",
    "riskSummary",
    "dashboardHealthScore",
    "dashboardHealthBand",
    "dashboardPrimaryRisk",
    "diffTargetName",
    "diffAprGap",
    "diffMonthlyGap",
    "rateBatchBestRate",
    "rateBatchWorstPayment",
    "rateBatchSummary",
  ]);
  renderEmptyTable(elements.scheduleBody, "尚未產生試算結果");
  renderEmptyTable(elements.prepayScheduleBody, "尚未設定提前清償比較");
  populateCalendarYearFilter([], []);
  updateCalendarSummary([], []);
  renderCalendarView(elements.calendarBaseView, [], "完成試算後，這裡會顯示原方案的月曆式還款表。");
  renderCalendarView(elements.calendarPrepayView, [], "若有設定提前清償，這裡會顯示提前清償後的月曆式還款表。");
  renderAnnualSummary(elements.annualSummaryBody, [], "尚未產生年度統計");
  renderAnnualSummary(elements.annualPrepaySummaryBody, [], "尚未設定提前清償年度統計");
  renderAdviceCards([]);
  renderDashboardSnapshot(null);
  renderRiskAlerts([]);
  renderSensitivityTable([]);
  renderSensitivityMatrix(null);
  renderDifferenceAnalysis(null, [], {});
  renderRateBatchTable([]);
  renderPrepayTimingAnalysis([]);
  renderPrepaymentModeComparison([]);
  renderCompareResults([]);
  lastBaseScenario = null;
  lastPrepayScenario = null;
  lastPrepayModeSummaries = [];
  lastCalculationContext = null;
  lastBreakdownPayload = null;
  lastSensitivityRows = [];
  lastSensitivityMatrix = null;
  updatePrintSummary(null);
  clearShareSnapshot();
  elements.loanRangeSummary.textContent = "填入月收入或可接受月付上限後，這裡會顯示可貸額度區間建議。";
  elements.indexedRateSummary.textContent = "未啟用指標利率模型時，系統會沿用基準年利率或手動分段利率。";
  elements.stressTestSummary.textContent = "填入月收入與壓力參數後，這裡會顯示現金流壓力測試結果。";
  elements.monteCarloSummary.textContent = "填入月收入後，這裡會顯示 Monte Carlo 現金流壓力測試結果。";
  elements.debtConsolidationSummary.textContent = "填入多筆債務資料後，這裡會顯示債務整合建議。";
  elements.refiSummary.textContent = "填入目前貸款剩餘條件與新方案後，這裡會顯示貸款重整 / 轉貸比較。";
  elements.dashboardSnapshotStatus.textContent = "完成試算後可一鍵複製。";
  elements.costBreakdownSummary.textContent = "完成試算後顯示拆解結果";
  elements.diffAnalysisSummary.textContent = "填入比較資料後，這裡會顯示主方案與最佳對照方案的差異分析。";
  elements.stressTestBody.innerHTML = `<tr><td colspan="6" class="empty-cell">完成試算後顯示現金流壓力測試。</td></tr>`;
  elements.monteCarloBody.innerHTML = `<tr><td colspan="4" class="empty-cell">完成試算後顯示 Monte Carlo 壓力測試。</td></tr>`;
  elements.debtConsolidationBody.innerHTML = `<tr><td colspan="4" class="empty-cell">完成輸入後顯示債務整合分析。</td></tr>`;
  elements.refiCompareBody.innerHTML = `<tr><td colspan="4" class="empty-cell">完成輸入後顯示轉貸比較結果。</td></tr>`;
  elements.sensitivityMatrixSummary.textContent = "完成試算後顯示利率 x 期數雙軸矩陣";
  elements.dashboardSnapshotText.value = "";
  elements.decisionReportText.value = "";
  elements.decisionReportStatus.textContent = "完成試算後會產生決策報告。";
  drawEmptyChart(elements.costBreakdownChart, "尚無成本資料");
  renderCharts(null, null);
}

function calculateLoan() {
  const validation = validateInputs();

  if (!validation.valid) {
    elements.status.textContent = validation.message;
    elements.prepayStatus.textContent = "請先修正輸入資料。";
    resetOutputs();
    return;
  }

  const {
    loanAmount,
    annualRate,
    loanMonths,
    handlingFee,
    graceMonths,
    paymentDay,
    firstPaymentDate,
    prepayFee,
    prepayPenaltyRate,
    prepayMonth,
    prepayAmount,
    extraPrepayEvents,
    debtItems,
    indexedRate,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    affordablePayment,
    stressIncomeDrop,
    stressRateRise,
    stressExpenseShock,
    stressSafetyBuffer,
    monteCarloIterations,
    monteCarloIncomeVolatility,
    monteCarloRateVolatility,
    monteCarloExpenseShockProbability,
    monteCarloExpenseShockAmount,
    monteCarloSeed,
    sensitivityStep,
    sensitivityDownCount,
    sensitivityUpCount,
    matrixTermStep,
    matrixTermDownCount,
    matrixTermUpCount,
    matrixMetricKey,
    rateBatchRates,
    rateTiers,
    reportUserName,
    reportBankName,
    reportDate,
    reportNote,
  } = validation.values;
  const riskThresholds = getRiskThresholds();
  const loanAmountValue = loanAmount * WAN_UNIT;
  const handlingFeeValue = handlingFee;
  const prepayAmountValue = prepayAmount * WAN_UNIT;
  const maxLoanAmount = estimateMaxLoanAmount({
    affordablePaymentWan: affordablePayment,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
  });
  const loanRange = estimateLoanRange({
    monthlyIncome,
    existingDebtPayment,
    affordablePaymentWan: affordablePayment,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
  });
  const sensitivityRows = buildSensitivityRows({
    loanAmountValue,
    handlingFeeValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    sensitivityStep,
    sensitivityDownCount,
    sensitivityUpCount,
  });
  const sensitivityMatrix = buildSensitivityMatrix({
    loanAmountValue,
    handlingFeeValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    monthlyIncome,
    rateStep: sensitivityStep,
    rateDownCount: sensitivityDownCount,
    rateUpCount: sensitivityUpCount,
    termStep: matrixTermStep,
    termDownCount: matrixTermDownCount,
    termUpCount: matrixTermUpCount,
    metricKey: matrixMetricKey,
  });
  const rateBatchRows = buildRateBatchRows({
    loanAmountValue,
    handlingFeeValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    rateBatchRates,
  });

  const baseScenario = buildSchedule({
    principal: loanAmountValue,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
  });

  const netAmount = loanAmountValue - handlingFeeValue;
  const feeRatio = (handlingFeeValue / loanAmountValue) * 100;
  const averageInterest = baseScenario.totalInterest / baseScenario.rows.length;
  const firstInterest = baseScenario.rows.length ? baseScenario.rows[0].interest : 0;
  const cashflows = [netAmount, ...baseScenario.rows.map((row) => -(row.payment + row.extraPayment))];
  const monthlyIrr = estimateMonthlyIrr(cashflows);
  const aprEstimate = monthlyIrr === null ? null : ((1 + monthlyIrr) ** 12 - 1) * 100;
  const totalCostGap = baseScenario.totalPayment - netAmount;
  const dsr = monthlyIncome > 0 ? (baseScenario.regularPayment / monthlyIncome) * 100 : null;
  const totalDebtPayment = baseScenario.regularPayment + existingDebtPayment;
  const overallDebtRatio = monthlyIncome > 0 ? (totalDebtPayment / monthlyIncome) * 100 : null;
  const incomeAfterDebt = monthlyIncome - totalDebtPayment;
  const incomeAfterAllExpenses = monthlyIncome - totalDebtPayment - fixedLivingExpense;
  const stressRows = buildStressTestRows({
    principal: loanAmountValue,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    incomeDropRate: stressIncomeDrop,
    rateRise: stressRateRise,
    expenseShock: stressExpenseShock,
    safetyBuffer: stressSafetyBuffer,
  });
  const stressBreakRate = estimateStressBreakRate({
    principal: loanAmountValue,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    safetyBuffer: stressSafetyBuffer,
  });
  const monteCarloSeedText = monteCarloSeed || JSON.stringify({
    loanAmountValue,
    annualRate,
    loanMonths,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    monteCarloIterations,
    monteCarloIncomeVolatility,
    monteCarloRateVolatility,
    monteCarloExpenseShockProbability,
    monteCarloExpenseShockAmount,
  });
  const monteCarloResult = runMonteCarloStressTest({
    principal: loanAmountValue,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    safetyBuffer: stressSafetyBuffer,
    iterations: monteCarloIterations,
    incomeVolatility: monteCarloIncomeVolatility,
    rateVolatility: monteCarloRateVolatility,
    expenseShockProbability: monteCarloExpenseShockProbability,
    expenseShockAmount: monteCarloExpenseShockAmount,
    rateResetMonths: indexedRate.enabled ? indexedRate.config.indexResetMonths : 12,
    seedText: monteCarloSeedText,
  });
  const debtConsolidation = buildDebtConsolidationAnalysis({
    debtItems,
    loanAmountValue,
    annualRate,
    loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    rateTiers,
  });
  const refinanceState = parseRefinanceInputs();
  let dsrStatus = "-";

  if (dsr !== null) {
    if (dsr < 30) {
      dsrStatus = "壓力低";
    } else if (dsr <= 40) {
      dsrStatus = "可接受";
    } else if (dsr <= 50) {
      dsrStatus = "偏高";
    } else {
      dsrStatus = "壓力高";
    }
  }

  elements.monthlyPayment.textContent = formatWan(baseScenario.regularPayment);
  elements.gracePayment.textContent = graceMonths > 0 ? formatWan(baseScenario.gracePayment) : "無";
  elements.totalPayment.textContent = formatWan(baseScenario.totalPayment);
  elements.totalInterest.textContent = formatCurrency(baseScenario.totalInterest);
  elements.netAmount.textContent = formatWan(netAmount);
  elements.feeRatio.textContent = formatPercent(feeRatio);
  elements.averageInterest.textContent = formatCurrency(averageInterest);
  elements.firstInterest.textContent = formatCurrency(firstInterest);
  elements.dsrValue.textContent = dsr === null ? "-" : formatPercent(dsr);
  elements.dsrStatus.textContent = dsrStatus;
  elements.maxLoanAmount.textContent = maxLoanAmount > 0 ? formatWan(maxLoanAmount) : "-";
  elements.loanRangeConservative.textContent = loanRange.conservative > 0 ? formatWan(loanRange.conservative) : "-";
  elements.loanRangeBalanced.textContent = loanRange.balanced > 0 ? formatWan(loanRange.balanced) : "-";
  elements.loanRangeAggressive.textContent = loanRange.aggressive > 0 ? formatWan(loanRange.aggressive) : "-";
  elements.loanRangeSummary.textContent = loanRange.balanced > 0
    ? `以目前收入與月付設定估算，較穩健可貸約 ${formatWan(loanRange.conservative)}，一般建議約 ${formatWan(loanRange.balanced)}，壓力上限約 ${formatWan(loanRange.aggressive)}。`
    : "填入月收入或可接受月付上限後，這裡會顯示可貸額度區間建議。";
  elements.indexedRateSummary.textContent = indexedRate.summary;
  elements.totalDebtPayment.textContent = formatCurrency(totalDebtPayment);
  elements.overallDebtRatio.textContent = overallDebtRatio === null ? "-" : formatPercent(overallDebtRatio);
  elements.incomeAfterDebt.textContent = formatCurrency(incomeAfterDebt);
  elements.incomeAfterAllExpenses.textContent = formatCurrency(incomeAfterAllExpenses);
  renderStressTest(stressRows, stressBreakRate, stressSafetyBuffer);
  renderMonteCarloStress(monteCarloResult, stressSafetyBuffer);
  renderDebtConsolidationAnalysis(debtConsolidation);
  renderRefinanceComparison(refinanceState);
  renderSensitivityMatrix(sensitivityMatrix);
  elements.aprEstimate.textContent = aprEstimate === null ? "-" : formatPercent(aprEstimate);
  elements.aprCostGap.textContent = formatWan(totalCostGap);
  elements.aprSummary.textContent = aprEstimate === null
    ? "無法反推有效 APR"
    : `${indexedRate.enabled ? "指標利率模型" : rateTiers.length ? "分段利率" : "固定利率"}下，費用納入後約 ${formatPercent(aprEstimate)}`;
  elements.status.textContent = `試算完成：${loanMonths} 期，${indexedRate.enabled ? "已套用指標利率模型，" : rateTiers.length ? "已套用分段利率，" : ""}目前月付約 ${formatWan(baseScenario.regularPayment)}。`;
  const breakdownSegments = [
    { label: "本金", value: loanAmountValue, color: "#b85b34" },
    { label: "利息", value: baseScenario.totalInterest, color: "#215f59" },
    { label: "手續費", value: handlingFeeValue, color: "#d49b4e" },
  ].filter((item) => item.value > 0);
  const baseBreakdownSummary = `本金 ${formatWan(loanAmountValue)}、利息 ${formatCurrency(baseScenario.totalInterest)}、手續費 ${formatCurrency(handlingFeeValue)}。`;
  drawBreakdownChart(elements.costBreakdownChart, breakdownSegments);
  elements.costBreakdownSummary.textContent = baseBreakdownSummary;

  renderSchedule(elements.scheduleBody, baseScenario.rows, "尚未產生試算結果");
  populateCalendarYearFilter(baseScenario.rows, []);
  updateCalendarSummary(baseScenario.rows, []);
  renderCalendarView(elements.calendarBaseView, baseScenario.rows, "完成試算後，這裡會顯示原方案的月曆式還款表。");
  renderAnnualSummary(elements.annualSummaryBody, baseScenario.rows, "尚未產生年度統計");
  renderSensitivityTable(sensitivityRows);
  const stressWorstRow = stressRows.length
    ? [...stressRows].sort((left, right) => left.surplusAfterExpenses - right.surplusAfterExpenses)[0]
    : null;
  renderRateBatchTable(rateBatchRows);
  renderPrepayTimingAnalysis(buildPrepayTimingRows({
    principal: loanAmountValue,
    annualRate,
    totalMonths: loanMonths,
    graceMonths,
    firstPaymentDate,
    paymentDay,
    handlingFeeValue,
    prepayAmountValue,
    prepayFee,
    prepayPenaltyRate,
    rateTiers,
    baseScenario,
  }));
  renderCompareResults(buildComparisonRows());
  lastBaseScenario = baseScenario;
  lastCalculationContext = {
    loanAmount: loanAmountValue,
    annualRate,
    loanMonths,
    handlingFee: handlingFeeValue,
    graceMonths,
    paymentDay,
    firstPaymentDate,
    feeRatio,
    monthlyIncome,
    existingDebtPayment,
    fixedLivingExpense,
    overallDebtRatio,
    incomeAfterAllExpenses,
    affordablePayment,
    dsr,
    maxLoanAmount,
    aprEstimate,
    riskThresholds,
    sensitivityRows,
    sensitivityMatrix,
    rateBatchRows,
    baseScenario,
    prepayScenario: null,
    prepayMonth,
    prepayAmount: prepayAmountValue,
    extraPrepayEvents,
    stressSafetyBuffer,
    stressWorstSurplus: stressWorstRow?.surplusAfterExpenses ?? null,
    stressWorstLabel: stressWorstRow?.label ?? "",
    stressBreakRateLabel: stressBreakRate === null ? `高於 ${formatPercent(12)}` : formatPercent(stressBreakRate),
    monteCarloResult,
    indexedRate,
    debtConsolidation,
    refinanceState,
    breakdownSummary: baseBreakdownSummary,
    reportUserName,
    reportBankName,
    reportDate,
    reportNote,
  };

  if ((prepayMonth > 0 && prepayAmount > 0) || extraPrepayEvents.length) {
    const shortenScenario = buildSchedule({
      principal: loanAmountValue,
      annualRate,
      totalMonths: loanMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      prepayMonth,
      prepayAmount: prepayAmountValue,
      prepayFeeFixed: prepayFee,
      prepayPenaltyRate,
      prepaymentEvents: extraPrepayEvents,
      prepaymentStrategy: "shorten-term",
      rateTiers,
    });
    const reduceScenario = buildSchedule({
      principal: loanAmountValue,
      annualRate,
      totalMonths: loanMonths,
      graceMonths,
      firstPaymentDate,
      paymentDay,
      prepayMonth,
      prepayAmount: prepayAmountValue,
      prepayFeeFixed: prepayFee,
      prepayPenaltyRate,
      prepaymentEvents: extraPrepayEvents,
      prepaymentStrategy: "reduce-payment",
      rateTiers,
    });
    const prepayModeRows = [
      {
        key: "shorten-term",
        label: "縮短期數",
        scenario: shortenScenario,
        interestSaved: baseScenario.totalInterest - shortenScenario.totalInterest,
        monthsSaved: baseScenario.monthsUsed - shortenScenario.monthsUsed,
        monthlyPayment: shortenScenario.regularPayment,
        totalPayment: shortenScenario.totalPayment,
      },
      {
        key: "reduce-payment",
        label: "降低月付",
        scenario: reduceScenario,
        interestSaved: baseScenario.totalInterest - reduceScenario.totalInterest,
        monthsSaved: baseScenario.monthsUsed - reduceScenario.monthsUsed,
        monthlyPayment: reduceScenario.regularPayment,
        totalPayment: reduceScenario.totalPayment,
      },
    ];
    renderPrepaymentModeComparison(prepayModeRows);
    lastPrepayModeSummaries = prepayModeRows;
    const selectedMode = prepayModeRows.find((row) => row.key === prepaymentMode) ?? prepayModeRows[0];
    const prepayScenario = selectedMode.scenario;

    const interestSaved = selectedMode.interestSaved;
    const monthsSaved = selectedMode.monthsSaved;
    const prepayBreakdownSegments = [
      { label: "本金", value: loanAmountValue, color: "#b85b34" },
      { label: "利息", value: prepayScenario.totalInterest, color: "#215f59" },
      { label: "手續費", value: handlingFeeValue, color: "#d49b4e" },
      { label: "提前清償費用", value: prepayScenario.totalPenaltyCost, color: "#8f3f1e" },
    ].filter((item) => item.value > 0);
    const prepayBreakdownSummary = `提前清償後：本金 ${formatWan(loanAmountValue)}、利息 ${formatCurrency(prepayScenario.totalInterest)}、手續費 ${formatCurrency(handlingFeeValue)}、提前清償費用 ${formatCurrency(prepayScenario.totalPenaltyCost)}。`;

    elements.interestSaved.textContent = formatCurrency(interestSaved);
    elements.monthsSaved.textContent = `${monthsSaved} 月`;
    elements.prepayTotalPayment.textContent = formatWan(prepayScenario.totalPayment);
    elements.prepayPenaltyCost.textContent = formatCurrency(prepayScenario.totalPenaltyCost);
    elements.prepayStatus.textContent = extraPrepayEvents.length
      ? `已套用 ${extraPrepayEvents.length + (prepayMonth > 0 && prepayAmount > 0 ? 1 : 0)} 筆提前清償事件，目前以「${selectedMode.label}」模式顯示，約可少付 ${formatCurrency(interestSaved)} 利息。`
      : `第 ${prepayMonth} 期額外清償 ${formatWan(prepayAmountValue)} 後，目前以「${selectedMode.label}」模式顯示，約可少付 ${formatCurrency(interestSaved)} 利息，提前清償費用約 ${formatCurrency(prepayScenario.totalPenaltyCost)}。`;
    drawBreakdownChart(elements.costBreakdownChart, prepayBreakdownSegments);
    elements.costBreakdownSummary.textContent = prepayBreakdownSummary;

    renderSchedule(elements.prepayScheduleBody, prepayScenario.rows, "尚未設定提前清償比較");
    populateCalendarYearFilter(baseScenario.rows, prepayScenario.rows);
    updateCalendarSummary(baseScenario.rows, prepayScenario.rows);
    renderCalendarView(elements.calendarBaseView, baseScenario.rows, "完成試算後，這裡會顯示原方案的月曆式還款表。");
    renderCalendarView(elements.calendarPrepayView, prepayScenario.rows, "若有設定提前清償，這裡會顯示提前清償後的月曆式還款表。", baseScenario.rows);
    renderAnnualSummary(elements.annualPrepaySummaryBody, prepayScenario.rows, "尚未設定提前清償年度統計");
    lastPrepayScenario = prepayScenario;
    lastCalculationContext.prepayScenario = prepayScenario;
    lastCalculationContext.prepayMode = selectedMode.key;
    lastCalculationContext.prepayModeSummaries = prepayModeRows;
    lastCalculationContext.breakdownSummary = prepayBreakdownSummary;
    renderAdviceCards(buildAdviceCards(lastCalculationContext));
    renderRiskAlerts(buildRiskAlerts(lastCalculationContext));
    renderDashboardSnapshot(buildDashboardSnapshot(lastCalculationContext));
    renderDifferenceAnalysis(baseScenario, buildComparisonRows(), lastCalculationContext);
    updatePrintSummary(lastCalculationContext);
    renderDecisionReport(lastCalculationContext);
    renderCharts(baseScenario, prepayScenario);
  } else {
    lastPrepayModeSummaries = [];
    elements.interestSaved.textContent = "-";
    elements.monthsSaved.textContent = "-";
    elements.prepayTotalPayment.textContent = "-";
    elements.prepayPenaltyCost.textContent = "-";
    elements.prepayStatus.textContent = "如需比較，請填寫提前清償月份與金額。";
    renderPrepaymentModeComparison([]);
    renderEmptyTable(elements.prepayScheduleBody, "尚未設定提前清償比較");
    populateCalendarYearFilter(baseScenario.rows, []);
    updateCalendarSummary(baseScenario.rows, []);
    renderCalendarView(elements.calendarBaseView, baseScenario.rows, "完成試算後，這裡會顯示原方案的月曆式還款表。");
    renderCalendarView(elements.calendarPrepayView, [], "若有設定提前清償，這裡會顯示提前清償後的月曆式還款表。");
    renderAnnualSummary(elements.annualPrepaySummaryBody, [], "尚未設定提前清償年度統計");
    lastPrepayScenario = null;
    renderAdviceCards(buildAdviceCards(lastCalculationContext));
    renderRiskAlerts(buildRiskAlerts(lastCalculationContext));
    renderDashboardSnapshot(buildDashboardSnapshot(lastCalculationContext));
    renderDifferenceAnalysis(baseScenario, buildComparisonRows(), lastCalculationContext);
    updatePrintSummary(lastCalculationContext);
    renderDecisionReport(lastCalculationContext);
    renderCharts(baseScenario, null);
  }

  saveShareSnapshot({
    generatedAt: new Date().toISOString(),
    reportUserName,
    reportBankName,
    reportDate,
    reportNote,
    loanAmount: formatWan(loanAmountValue),
    annualRate: formatPercent(annualRate),
    loanMonths,
    handlingFee: formatCurrency(handlingFeeValue),
    monthlyPayment: formatWan(baseScenario.regularPayment),
    gracePayment: graceMonths > 0 ? formatWan(baseScenario.gracePayment) : "無",
    totalPayment: formatWan(baseScenario.totalPayment),
    totalInterest: formatCurrency(baseScenario.totalInterest),
    netAmount: formatWan(netAmount),
    aprEstimate: aprEstimate === null ? "-" : formatPercent(aprEstimate),
    dsr: dsr === null ? "-" : formatPercent(dsr),
    dsrStatus,
    loanRange: {
      conservative: loanRange.conservative > 0 ? formatWan(loanRange.conservative) : "-",
      balanced: loanRange.balanced > 0 ? formatWan(loanRange.balanced) : "-",
      aggressive: loanRange.aggressive > 0 ? formatWan(loanRange.aggressive) : "-",
    },
    debtOverview: {
      totalDebtPayment: formatCurrency(totalDebtPayment),
      overallDebtRatio: overallDebtRatio === null ? "-" : formatPercent(overallDebtRatio),
      incomeAfterDebt: formatCurrency(incomeAfterDebt),
      incomeAfterAllExpenses: formatCurrency(incomeAfterAllExpenses),
    },
    stressTest: {
      baseSurplus: elements.stressBaseSurplus.textContent,
      worstSurplus: elements.stressWorstSurplus.textContent,
      breakRate: elements.stressBreakRate.textContent,
      summary: elements.stressTestSummary.textContent,
    },
    monteCarloStress: {
      failRate: elements.monteCarloFailRate.textContent,
      medianWorstSurplus: elements.monteCarloMedianSurplus.textContent,
      p10WorstSurplus: elements.monteCarloP10Surplus.textContent,
      summary: elements.monteCarloSummary.textContent,
    },
    debtConsolidation: {
      monthlyGap: elements.debtConsolidationMonthlyGap.textContent,
      totalSaved: elements.debtConsolidationTotalSaved.textContent,
      coverage: elements.debtConsolidationCoverage.textContent,
      summary: elements.debtConsolidationSummary.textContent,
    },
    refinanceComparison: {
      monthlyGap: elements.refiMonthlyGap.textContent,
      totalSaved: elements.refiTotalSaved.textContent,
      breakEven: elements.refiBreakEven.textContent,
      summary: elements.refiSummary.textContent,
    },
    dashboardSnapshot: {
      healthScore: elements.dashboardHealthScore.textContent,
      healthBand: elements.dashboardHealthBand.textContent,
      primaryRisk: elements.dashboardPrimaryRisk.textContent,
      text: elements.dashboardSnapshotText.value,
    },
    decisionReport: {
      text: elements.decisionReportText.value,
      status: elements.decisionReportStatus.textContent,
    },
    prepaymentSummary: {
      enabled: Boolean(lastPrepayScenario),
      status: elements.prepayStatus.textContent,
      interestSaved: elements.interestSaved.textContent,
      monthsSaved: elements.monthsSaved.textContent,
      totalPayment: elements.prepayTotalPayment.textContent,
      penaltyCost: elements.prepayPenaltyCost.textContent,
    },
    adviceCards: buildAdviceCards(lastCalculationContext),
    compareRows: buildComparisonRows().map((row) => ({
      name: row.name,
      monthlyPayment: formatWan(row.monthlyPayment),
      totalPayment: formatWan(row.totalPayment),
      totalInterest: formatCurrency(row.totalInterest),
      netAmount: formatWan(row.netAmount),
      aprEstimate: row.aprEstimate === null ? "-" : formatPercent(row.aprEstimate),
      note: row.note,
    })),
    extraPrepayEvents: [
      ...(prepayMonth > 0 && prepayAmount > 0 ? [{
        month: prepayMonth,
        amount: formatWan(prepayAmountValue),
        fee: formatCurrency(prepayFee),
        penaltyRate: formatPercent(prepayPenaltyRate),
      }] : []),
      ...extraPrepayEvents.map((eventItem) => ({
        month: eventItem.month,
        amount: formatWan(eventItem.amount),
        fee: formatCurrency(eventItem.fee),
        penaltyRate: formatPercent(eventItem.penaltyRate),
      })),
    ],
    debtItems: debtItems.map((item) => ({
      name: item.name,
      balance: formatWan(item.balance),
      annualRate: formatPercent(item.annualRate),
      monthlyPayment: formatCurrency(item.monthlyPayment),
      months: `${item.months} 月`,
      settlementFee: formatCurrency(item.settlementFee),
    })),
  });

  saveState();
}

function addTierRow(values = {}) {
  const fragment = elements.rateTierTemplate.content.cloneNode(true);
  const row = fragment.querySelector("tr");
  const [startInput, endInput, rateInput] = row.querySelectorAll("input");

  startInput.value = values.startMonth ?? "";
  endInput.value = values.endMonth ?? "";
  rateInput.value = values.annualRate ?? "";

  elements.rateTierBody.appendChild(row);
}

function resetTierRows() {
  elements.rateTierBody.innerHTML = `
    <tr>
      <td><input class="tier-input" type="number" min="1" step="1" value="1"></td>
      <td><input class="tier-input" type="number" min="1" step="1" placeholder="12"></td>
      <td><input class="tier-input" type="number" min="0" step="0.01" placeholder="2.10"></td>
      <td><button class="ghost-button tier-remove-button" type="button">刪除</button></td>
    </tr>
  `;
}

function fillTierSample() {
  elements.annualRate.value = "3.35";
  elements.loanMonths.value = elements.loanMonths.value || "60";
  resetTierRows();
  const firstRowInputs = elements.rateTierBody.querySelectorAll("input");
  firstRowInputs[0].value = "1";
  firstRowInputs[1].value = "12";
  firstRowInputs[2].value = "1.88";
  addTierRow({ startMonth: 13, endMonth: 60, annualRate: 3.35 });
  saveState();
}

function fillSample() {
  elements.loanAmount.value = "50";
  elements.annualRate.value = "3.35";
  elements.loanMonths.value = "60";
  elements.handlingFee.value = "3000";
  elements.graceMonths.value = "6";
  elements.firstPaymentDate.value = "2026-05-15";
  elements.paymentDay.value = "15";
  elements.prepayMonth.value = "12";
  elements.prepayAmount.value = "10";
  elements.prepayFee.value = "3000";
  elements.prepayPenaltyRate.value = "1";
  elements.reportUserName.value = "王小明";
  elements.reportBankName.value = "OO 銀行信貸方案";
  elements.reportDate.value = "2026-04-27";
  elements.reportNote.value = "供內部比較使用";
  elements.monthlyIncome.value = "60000";
  elements.existingDebtPayment.value = "12000";
  elements.fixedLivingExpense.value = "18000";
  elements.affordablePayment.value = "1.5";
  elements.stressIncomeDrop.value = "10";
  elements.stressRateRise.value = "0.75";
  elements.stressExpenseShock.value = "8000";
  elements.stressSafetyBuffer.value = "10000";
  elements.indexedRateEnabled.value = "on";
  elements.indexBaseRate.value = "1.35";
  elements.indexSpreadRate.value = "1.53";
  elements.indexResetMonths.value = "3";
  elements.indexStepPerReset.value = "0.08";
  elements.indexFloorRate.value = "2.60";
  elements.indexCapRate.value = "4.50";
  elements.monteCarloIterations.value = String(DEFAULT_MONTE_CARLO_ITERATIONS);
  elements.monteCarloIncomeVolatility.value = "8";
  elements.monteCarloRateVolatility.value = "0.18";
  elements.monteCarloExpenseShockProbability.value = "12";
  elements.monteCarloExpenseShockAmount.value = "12000";
  elements.monteCarloSeed.value = "sample-seed";
  elements.refiCurrentBalance.value = "38";
  elements.refiCurrentRate.value = "4.25";
  elements.refiCurrentMonths.value = "42";
  elements.refiCurrentGrace.value = "0";
  elements.refiExitFee.value = "12000";
  elements.refiNewRate.value = "2.68";
  elements.refiNewMonths.value = "60";
  elements.refiNewGrace.value = "0";
  elements.refiNewFee.value = "3000";
  elements.refiCashback.value = "5000";
  elements.sensitivityStep.value = "0.5";
  elements.sensitivityDownCount.value = "2";
  elements.sensitivityUpCount.value = "2";
  elements.matrixTermStep.value = "12";
  elements.matrixTermDownCount.value = "1";
  elements.matrixTermUpCount.value = "2";
  elements.matrixMetricKey.value = "monthlyPayment";
  elements.rateBatchInput.value = "2.35, 2.88, 3.15, 3.75";
  elements.riskDsrMedium.value = String(DEFAULT_RISK_THRESHOLDS.dsrMedium);
  elements.riskDsrHigh.value = String(DEFAULT_RISK_THRESHOLDS.dsrHigh);
  elements.riskDebtMedium.value = String(DEFAULT_RISK_THRESHOLDS.debtMedium);
  elements.riskDebtHigh.value = String(DEFAULT_RISK_THRESHOLDS.debtHigh);
  elements.riskAprGap.value = String(DEFAULT_RISK_THRESHOLDS.aprGap);
  elements.riskFeeRatio.value = String(DEFAULT_RISK_THRESHOLDS.feeRatio);
  applyExtraPrepayEventsState([
    { month: "24", amount: "5", fee: "0", penaltyRate: "0" },
    { month: "36", amount: "3", fee: "0", penaltyRate: "0" },
  ]);
  applyDebtItemsState([
    { name: "信用卡分期", balance: "8", annualRate: "14.8", monthlyPayment: "6200", months: "18", settlementFee: "0" },
    { name: "小額信貸", balance: "12", annualRate: "9.5", monthlyPayment: "8900", months: "24", settlementFee: "3000" },
    { name: "車貸", balance: "15", annualRate: "4.2", monthlyPayment: "11200", months: "30", settlementFee: "0" },
  ]);
  elements.compareInputBody.innerHTML = "";
  applyCompareScenariosState([
    { name: "銀行 A", loanAmount: "50", annualRate: "2.68", months: "60", handlingFee: "3000", graceMonths: "0" },
    { name: "銀行 B", loanAmount: "50", annualRate: "2.88", months: "60", handlingFee: "1000", graceMonths: "0" },
    { name: "銀行 C", loanAmount: "50", annualRate: "3.15", months: "72", handlingFee: "0", graceMonths: "6" },
    { name: "銀行 D", loanAmount: "50", annualRate: "2.58", months: "48", handlingFee: "4500", graceMonths: "0" },
    { name: "銀行 E", loanAmount: "50", annualRate: "2.99", months: "84", handlingFee: "0", graceMonths: "3" },
  ]);
  resetTierRows();
  const firstRowInputs = elements.rateTierBody.querySelectorAll("input");
  firstRowInputs[0].value = "1";
  firstRowInputs[1].value = "12";
  firstRowInputs[2].value = "1.88";
  addTierRow({ startMonth: 13, endMonth: 60, annualRate: 3.35 });
  calculateLoan();
}

function resetForm() {
  [
    "loanAmount",
    "annualRate",
    "loanMonths",
    "handlingFee",
    "graceMonths",
    "firstPaymentDate",
    "paymentDay",
    "prepayFee",
    "prepayPenaltyRate",
    "indexedRateEnabled",
    "indexBaseRate",
    "indexSpreadRate",
    "indexResetMonths",
    "indexStepPerReset",
    "indexFloorRate",
    "indexCapRate",
    "prepayMonth",
    "prepayAmount",
    "reportUserName",
    "reportBankName",
    "reportDate",
    "reportNote",
    "monthlyIncome",
    "existingDebtPayment",
    "fixedLivingExpense",
    "affordablePayment",
    "stressIncomeDrop",
    "stressRateRise",
    "stressExpenseShock",
    "stressSafetyBuffer",
    "monteCarloIterations",
    "monteCarloIncomeVolatility",
    "monteCarloRateVolatility",
    "monteCarloExpenseShockProbability",
    "monteCarloExpenseShockAmount",
    "monteCarloSeed",
    "refiCurrentBalance",
    "refiCurrentRate",
    "refiCurrentMonths",
    "refiCurrentGrace",
    "refiExitFee",
    "refiNewRate",
    "refiNewMonths",
    "refiNewGrace",
    "refiNewFee",
    "refiCashback",
    "sensitivityStep",
    "sensitivityDownCount",
    "sensitivityUpCount",
    "matrixTermStep",
    "matrixTermDownCount",
    "matrixTermUpCount",
    "rateBatchInput",
    "riskDsrMedium",
    "riskDsrHigh",
    "riskDebtMedium",
    "riskDebtHigh",
    "riskAprGap",
    "riskFeeRatio",
  ].forEach((key) => {
    elements[key].value = "";
  });
  elements.indexedRateEnabled.value = "off";
  elements.monteCarloIterations.value = String(DEFAULT_MONTE_CARLO_ITERATIONS);
  elements.riskDsrMedium.value = String(DEFAULT_RISK_THRESHOLDS.dsrMedium);
  elements.riskDsrHigh.value = String(DEFAULT_RISK_THRESHOLDS.dsrHigh);
  elements.riskDebtMedium.value = String(DEFAULT_RISK_THRESHOLDS.debtMedium);
  elements.riskDebtHigh.value = String(DEFAULT_RISK_THRESHOLDS.debtHigh);
  elements.riskAprGap.value = String(DEFAULT_RISK_THRESHOLDS.aprGap);
  elements.riskFeeRatio.value = String(DEFAULT_RISK_THRESHOLDS.feeRatio);
  elements.matrixMetricKey.value = "monthlyPayment";
  clearCompareScenarios();
  applyExtraPrepayEventsState([]);
  applyDebtItemsState([]);
  resetTierRows();
  calendarYearFilter = "all";
  calendarSortKey = "chronological";
  compareSortKey = "score";
  compareSortDirection = "auto";
  elements.calendarYearFilter.innerHTML = '<option value="all">全部年份</option>';
  elements.calendarYearFilter.value = "all";
  elements.calendarSortKey.value = "chronological";
  elements.compareSortKey.value = "score";
  elements.compareSortDirection.value = "auto";
  elements.compareSortSummary.textContent = "排序器會依你指定的欄位重新排列貸款方案。";
  elements.calendarPeakMonth.textContent = "-";
  elements.calendarPeakPayment.textContent = "-";
  elements.calendarSummary.textContent = "-";
  elements.status.textContent = "請輸入資料後按下「開始試算」。";
  elements.prepayStatus.textContent = "如需比較，請填寫提前清償月份與金額。";
  resetOutputs();
  saveState();
}

elements.calculateButton.addEventListener("click", calculateLoan);
elements.sampleButton.addEventListener("click", fillSample);
elements.addExtraPrepayButton.addEventListener("click", () => {
  addExtraPrepayRow();
  saveState();
});
elements.addDebtRowButton.addEventListener("click", () => {
  addDebtRow();
  renderEmptyDebtState();
  saveState();
});
elements.debtSampleButton.addEventListener("click", () => {
  applyDebtItemsState([
    { name: "信用卡分期", balance: "8", annualRate: "14.8", monthlyPayment: "6200", months: "18", settlementFee: "0" },
    { name: "小額信貸", balance: "12", annualRate: "9.5", monthlyPayment: "8900", months: "24", settlementFee: "3000" },
    { name: "車貸", balance: "15", annualRate: "4.2", monthlyPayment: "11200", months: "30", settlementFee: "0" },
  ]);
  saveState();
});
elements.sensitivitySampleButton.addEventListener("click", () => {
  elements.sensitivityStep.value = "0.5";
  elements.sensitivityDownCount.value = "2";
  elements.sensitivityUpCount.value = "2";
  saveState();
});
elements.rateBatchSampleButton.addEventListener("click", () => {
  elements.rateBatchInput.value = "2.35, 2.88, 3.15, 3.75";
  saveState();
});
elements.compareSampleButton.addEventListener("click", () => {
  applyCompareScenariosState([
    { name: "銀行 A", loanAmount: "50", annualRate: "2.68", months: "60", handlingFee: "3000", graceMonths: "0" },
    { name: "銀行 B", loanAmount: "50", annualRate: "2.88", months: "60", handlingFee: "1000", graceMonths: "0" },
    { name: "銀行 C", loanAmount: "50", annualRate: "3.15", months: "72", handlingFee: "0", graceMonths: "6" },
    { name: "銀行 D", loanAmount: "50", annualRate: "2.58", months: "48", handlingFee: "4500", graceMonths: "0" },
    { name: "銀行 E", loanAmount: "50", annualRate: "2.99", months: "84", handlingFee: "0", graceMonths: "3" },
  ]);
  renderCompareResults(buildComparisonRows());
  renderDifferenceAnalysis(lastBaseScenario, buildComparisonRows(), lastCalculationContext ?? {});
  saveState();
});
elements.addCompareRowButton.addEventListener("click", () => {
  if (addCompareRow()) {
    syncCompareRowPlaceholders();
    saveState();
  }
});
elements.removeCompareRowButton.addEventListener("click", () => {
  const rows = getCompareScenarioRows();
  if (rows.length <= MIN_COMPARE_ROW_COUNT) {
    return;
  }

  rows[rows.length - 1]?.remove();
  syncCompareRowPlaceholders();
  renderCompareResults(buildComparisonRows());
  saveState();
});
elements.exportJsonButton.addEventListener("click", exportJson);
elements.importJsonButton.addEventListener("click", () => elements.importJsonFile.click());
elements.importJsonFile.addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (file) {
    importJsonFile(file);
  }
});
elements.exportPdfButton.addEventListener("click", () => window.print());
elements.resetButton.addEventListener("click", resetForm);
elements.tierSampleButton.addEventListener("click", fillTierSample);
elements.addRateTierButton.addEventListener("click", () => addTierRow());
elements.copyDashboardSnapshotButton.addEventListener("click", async () => {
  const text = elements.dashboardSnapshotText.value.trim();
  if (!text) {
    elements.dashboardSnapshotStatus.textContent = "目前沒有可複製的快照文字。";
    return;
  }

  try {
    await copyTextToClipboard(text);
    elements.dashboardSnapshotStatus.textContent = "快照摘要已複製。";
  } catch (error) {
    elements.dashboardSnapshotStatus.textContent = "複製失敗，請手動選取文字。";
  }
});
elements.copyDecisionReportButton.addEventListener("click", async () => {
  const text = elements.decisionReportText.value.trim();
  if (!text) {
    elements.decisionReportStatus.textContent = "目前沒有可複製的決策報告。";
    return;
  }

  try {
    await copyTextToClipboard(text);
    elements.decisionReportStatus.textContent = "決策報告已複製。";
  } catch (error) {
    elements.decisionReportStatus.textContent = "複製失敗，請手動選取文字。";
  }
});
elements.exportBaseButton.addEventListener("click", () => downloadCsv("loan-base-schedule.csv", lastBaseScenario?.rows));
elements.exportPrepayButton.addEventListener("click", () => downloadCsv("loan-prepay-schedule.csv", lastPrepayScenario?.rows));
elements.exportAnnualBaseButton.addEventListener("click", () => downloadAnnualCsv("loan-annual-base-summary.csv", lastBaseScenario?.rows));
elements.exportAnnualPrepayButton.addEventListener("click", () => downloadAnnualCsv("loan-annual-prepay-summary.csv", lastPrepayScenario?.rows));
elements.exportCompareCsvButton.addEventListener("click", () => {
  const rows = getSortedComparisonRows(decorateComparisonRows(buildComparisonRows()));
  downloadComparisonCsv("loan-compare-results.csv", rows);
});
elements.exportComparePdfButton.addEventListener("click", () => {
  const rows = getSortedComparisonRows(decorateComparisonRows(buildComparisonRows()));
  printComparisonResults(rows);
});
elements.compareSortKey.addEventListener("change", () => {
  compareSortKey = elements.compareSortKey.value;
  renderCompareResults(buildComparisonRows());
  renderDifferenceAnalysis(lastBaseScenario, buildComparisonRows(), lastCalculationContext ?? {});
  saveState();
});
elements.compareSortDirection.addEventListener("change", () => {
  compareSortDirection = elements.compareSortDirection.value;
  renderCompareResults(buildComparisonRows());
  renderDifferenceAnalysis(lastBaseScenario, buildComparisonRows(), lastCalculationContext ?? {});
  saveState();
});
elements.calendarYearFilter.addEventListener("change", () => {
  calendarYearFilter = elements.calendarYearFilter.value;
  updateCalendarSummary(lastBaseScenario?.rows ?? [], lastPrepayScenario?.rows ?? []);
  renderCalendarView(elements.calendarBaseView, lastBaseScenario?.rows ?? [], "完成試算後，這裡會顯示原方案的月曆式還款表。");
  renderCalendarView(elements.calendarPrepayView, lastPrepayScenario?.rows ?? [], "若有設定提前清償，這裡會顯示提前清償後的月曆式還款表。", lastBaseScenario?.rows ?? []);
  saveState();
});
elements.calendarSortKey.addEventListener("change", () => {
  calendarSortKey = elements.calendarSortKey.value;
  updateCalendarSummary(lastBaseScenario?.rows ?? [], lastPrepayScenario?.rows ?? []);
  renderCalendarView(elements.calendarBaseView, lastBaseScenario?.rows ?? [], "完成試算後，這裡會顯示原方案的月曆式還款表。");
  renderCalendarView(elements.calendarPrepayView, lastPrepayScenario?.rows ?? [], "若有設定提前清償，這裡會顯示提前清償後的月曆式還款表。", lastBaseScenario?.rows ?? []);
  saveState();
});
elements.chartModeMonthly.addEventListener("click", () => {
  chartMode = "monthly";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.chartModeYearly.addEventListener("click", () => {
  chartMode = "yearly";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.paymentViewPaymentInterest.addEventListener("click", () => {
  paymentChartView = "payment-interest";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.paymentViewPrincipalInterest.addEventListener("click", () => {
  paymentChartView = "principal-interest";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.paymentViewTotalPayment.addEventListener("click", () => {
  paymentChartView = "total-payment";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.balanceViewRemaining.addEventListener("click", () => {
  balanceChartView = "remaining";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.balanceViewCumulativePrincipal.addEventListener("click", () => {
  balanceChartView = "cumulative-principal";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.balanceViewCumulativeInterest.addEventListener("click", () => {
  balanceChartView = "cumulative-interest";
  updateChartModeButtons();
  renderCharts(lastBaseScenario, lastPrepayScenario);
  saveState();
});
elements.prepayModeShorten.addEventListener("click", () => {
  prepaymentMode = "shorten-term";
  updateChartModeButtons();
  if (hasPrimaryLoanInputs()) {
    calculateLoan();
  } else {
    saveState();
  }
});
elements.prepayModeReduce.addEventListener("click", () => {
  prepaymentMode = "reduce-payment";
  updateChartModeButtons();
  if (hasPrimaryLoanInputs()) {
    calculateLoan();
  } else {
    saveState();
  }
});
elements.downloadPaymentChartButton.addEventListener("click", () => downloadCanvasPng(elements.paymentChart, `payment-chart-${chartMode}.png`));
elements.downloadBalanceChartButton.addEventListener("click", () => downloadCanvasPng(elements.balanceChart, `balance-chart-${chartMode}.png`));

elements.rateTierBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("tier-remove-button")) {
    return;
  }

  const rows = getTierRows();
  if (rows.length === 1) {
    const inputs = rows[0].querySelectorAll("input");
    inputs.forEach((input) => {
      input.value = "";
    });
    saveState();
    return;
  }

  target.closest("tr")?.remove();
  saveState();
});

[
  elements.loanAmount,
  elements.annualRate,
  elements.loanMonths,
  elements.handlingFee,
  elements.graceMonths,
  elements.firstPaymentDate,
  elements.paymentDay,
  elements.prepayFee,
  elements.prepayPenaltyRate,
  elements.indexedRateEnabled,
  elements.indexBaseRate,
  elements.indexSpreadRate,
  elements.indexResetMonths,
  elements.indexStepPerReset,
  elements.indexFloorRate,
  elements.indexCapRate,
  elements.prepayMonth,
  elements.prepayAmount,
  elements.reportUserName,
  elements.reportBankName,
  elements.reportDate,
  elements.reportNote,
  elements.monthlyIncome,
  elements.existingDebtPayment,
  elements.fixedLivingExpense,
  elements.affordablePayment,
  elements.stressIncomeDrop,
  elements.stressRateRise,
  elements.stressExpenseShock,
  elements.stressSafetyBuffer,
  elements.monteCarloIterations,
  elements.monteCarloIncomeVolatility,
  elements.monteCarloRateVolatility,
  elements.monteCarloExpenseShockProbability,
  elements.monteCarloExpenseShockAmount,
  elements.monteCarloSeed,
  elements.refiCurrentBalance,
  elements.refiCurrentRate,
  elements.refiCurrentMonths,
  elements.refiCurrentGrace,
  elements.refiExitFee,
  elements.refiNewRate,
  elements.refiNewMonths,
  elements.refiNewGrace,
  elements.refiNewFee,
  elements.refiCashback,
  elements.sensitivityStep,
  elements.sensitivityDownCount,
  elements.sensitivityUpCount,
  elements.matrixTermStep,
  elements.matrixTermDownCount,
  elements.matrixTermUpCount,
  elements.rateBatchInput,
  elements.riskDsrMedium,
  elements.riskDsrHigh,
  elements.riskDebtMedium,
  elements.riskDebtHigh,
  elements.riskAprGap,
  elements.riskFeeRatio,
  elements.matrixMetricKey,
].forEach((input) => {
  input.addEventListener("input", saveState);
  input.addEventListener("change", saveState);
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      calculateLoan();
    }
  });
});

elements.rateTierBody.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    saveState();
  }
});

elements.extraPrepayBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("extra-prepay-remove-button")) {
    return;
  }

  target.closest("tr")?.remove();
  renderEmptyExtraPrepayState();
  saveState();
});

elements.extraPrepayBody.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    saveState();
  }
});

elements.debtBody.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("debt-remove-button")) {
    return;
  }

  target.closest("tr")?.remove();
  renderEmptyDebtState();
  saveState();
});

elements.debtBody.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    saveState();
  }
});

elements.compareInputBody.addEventListener("input", (event) => {
  if (event.target instanceof HTMLInputElement) {
    renderCompareResults(buildComparisonRows());
    renderDifferenceAnalysis(lastBaseScenario, buildComparisonRows(), lastCalculationContext ?? {});
    saveState();
  }
});

initTabbedLayout();

if (!restoreState()) {
  resetForm();
} else if (hasPrimaryLoanInputs()) {
  calculateLoan();
} else if (hasCompareScenarioInputs()) {
  resetOutputs();
  renderCompareResults(buildComparisonRows());
} else {
  resetOutputs();
}
updateChartModeButtons();
syncCompareRowPlaceholders();

window.addEventListener("resize", () => {
  refreshVisibleTabVisuals();
});

elements.paymentChart.addEventListener("mousemove", (event) => updateChartTooltip("payment", event));
elements.balanceChart.addEventListener("mousemove", (event) => updateChartTooltip("balance", event));
elements.paymentChart.addEventListener("mouseleave", () => resetChartTooltip("payment"));
elements.balanceChart.addEventListener("mouseleave", () => resetChartTooltip("balance"));
elements.costBreakdownChart.addEventListener("mousemove", updateBreakdownTooltip);
elements.costBreakdownChart.addEventListener("mouseleave", resetBreakdownTooltip);
