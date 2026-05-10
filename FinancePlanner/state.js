const STORAGE_KEY = "fp_core_state";

const ASSET_TYPE_OPTIONS = [
  { value: "cash", label: "現金", liquid: true },
  { value: "deposit", label: "存款", liquid: true },
  { value: "stock", label: "股票", liquid: true },
  { value: "fund", label: "基金", liquid: true },
  { value: "etf", label: "ETF", liquid: true },
  { value: "insurance", label: "保單", liquid: false },
  { value: "foreign_currency", label: "外幣", liquid: true },
  { value: "crypto", label: "加密資產", liquid: true },
  { value: "property", label: "房產", liquid: false },
  { value: "other", label: "其他資產", liquid: false },
];

const DEBT_TYPE_OPTIONS = [
  { value: "mortgage", label: "房貸", secured: true },
  { value: "personal_loan", label: "信貸", secured: false },
  { value: "margin_loan", label: "股票質押", secured: true },
  { value: "credit_installment", label: "信用卡分期", secured: false },
  { value: "car_loan", label: "車貸", secured: true },
  { value: "student_loan", label: "學貸", secured: false },
  { value: "other", label: "其他負債", secured: false },
];

const MODEL_OVERVIEW = [
  {
    title: "資產清單",
    tag: "Assets[]",
    points: [
      "每筆資產包含名稱、類型、金額與備註。",
      "資產類型已預留現金、基金、ETF、保單、外幣、加密資產等分類。",
      "用於淨值、流動性與分類圖表計算。",
    ],
  },
  {
    title: "負債清單",
    tag: "Debts[]",
    points: [
      "每筆負債包含名稱、類型、餘額、利率、月付與剩餘期數。",
      "負債類型已預留房貸、信貸、信用卡分期、車貸、學貸等分類。",
      "用於還款策略、負債比與質押風險判斷。",
    ],
  },
  {
    title: "現金流設定",
    tag: "Cashflow",
    points: [
      "固定收入、固定支出、每月債務還款與期初現金集中管理。",
      "一次性事件另外獨立成事件陣列。",
      "用於 12 個月現金預估與資金缺口判斷。",
    ],
  },
  {
    title: "收支明細",
    tag: "Transactions[]",
    points: [
      "每筆收支包含月份、類型、分類、金額與備註。",
      "支援 food、rent、transport 等支出分類與 salary、bonus 等收入分類。",
      "用於每月統計、支出分類分析與趨勢圖。",
    ],
  },
  {
    title: "預算設定",
    tag: "Budgets[]",
    points: [
      "每筆預算綁定一個支出分類與每月上限。",
      "會依目前統計月份自動比對實際支出。",
      "用於剩餘預算、使用率與超支提醒。",
    ],
  },
  {
    title: "財務目標",
    tag: "Goal",
    points: [
      "包含目標名稱、目標金額、目前金額與剩餘月份。",
      "自動計算每月需投入金額與完成進度。",
      "會與月自由現金流比較，顯示每月資金缺口。",
    ],
  },
  {
    title: "情境模擬",
    tag: "Scenario",
    points: [
      "保留收入變動、市值變動、額外還款與觀察期。",
      "與質押風險、現金流聯動。",
      "用於壓力測試收入下滑、市場下跌與提前還款。",
    ],
  },
];

function createId(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
}

function createDefaultAsset(overrides = {}) {
  const amount = Number(overrides.amount) || 0;
  return {
    id: createId("asset"),
    name: "",
    type: "cash",
    amount: 0,
    costBasis: amount,
    note: "",
    ...overrides,
  };
}

function createDefaultDebt(overrides = {}) {
  return {
    id: createId("debt"),
    name: "",
    type: "mortgage",
    balance: 0,
    rate: 0,
    minimumPayment: 0,
    remainingMonths: 0,
    note: "",
    ...overrides,
  };
}

function createDefaultEvent(overrides = {}) {
  return {
    id: createId("event"),
    month: 1,
    amount: 0,
    type: "expense",
    label: "",
    ...overrides,
  };
}

function createDefaultTransaction(overrides = {}) {
  return {
    id: createId("transaction"),
    month: new Date().toISOString().slice(0, 7),
    type: "expense",
    category: "food",
    amount: 0,
    note: "",
    ...overrides,
  };
}

function createDefaultBudget(overrides = {}) {
  return {
    id: createId("budget"),
    category: "other",
    limit: 0,
    ...overrides,
  };
}

function createDefaultState() {
  return {
    assets: [
      createDefaultAsset({ name: "台幣活存", type: "cash", amount: 180000, note: "緊急預備金" }),
      createDefaultAsset({ name: "全球股票 ETF", type: "etf", amount: 620000, note: "長期投資部位" }),
    ],
    debts: [
      createDefaultDebt({ name: "房貸", type: "mortgage", balance: 5200000, rate: 2.18, minimumPayment: 28500, remainingMonths: 264 }),
      createDefaultDebt({ name: "信用卡分期", type: "credit_installment", balance: 86000, rate: 6.5, minimumPayment: 7600, remainingMonths: 12 }),
    ],
    pledge: {
      marketValue: 1400000,
      warningRatio: 130,
    },
    cashflow: {
      salaryIncome: 95000,
      passiveIncome: 12000,
      monthlyExpense: 38000,
      debtPayment: 56000,
      startingCash: 300000,
      eventNote: "",
    },
    events: [
      createDefaultEvent({ month: 3, amount: -90000, type: "expense", label: "年度綜所稅" }),
      createDefaultEvent({ month: 12, amount: 160000, type: "income", label: "年終獎金" }),
    ],
    transactions: [
      createDefaultTransaction({ month: "2026-05", type: "income", category: "salary", amount: 95000, note: "薪資" }),
      createDefaultTransaction({ month: "2026-05", type: "expense", category: "food", amount: 16000, note: "餐飲" }),
      createDefaultTransaction({ month: "2026-05", type: "expense", category: "rent", amount: 22000, note: "房租 / 住居" }),
    ],
    repayment: {
      extraBudget: 15000,
      strategy: "snowball",
      planNote: "",
    },
    loanAnalysis: {
      investmentReturn: 6,
    },
    incomeExpense: {
      month: "2026-05",
    },
    budgets: [
      createDefaultBudget({ category: "food", limit: 18000 }),
      createDefaultBudget({ category: "rent", limit: 25000 }),
      createDefaultBudget({ category: "transport", limit: 6000 }),
    ],
    goal: {
      name: "緊急預備金",
      targetAmount: 600000,
      currentAmount: 180000,
      months: 18,
    },
    onboarding: {
      step: 1,
      completed: false,
      seenForecast: false,
      seenRisk: false,
    },
    scenario: {
      incomeChange: -10,
      marketChange: -15,
      extraPaydown: 100000,
      horizon: 12,
    },
    scenarioPlans: [
      { name: "Plan A", incomeChange: 0, marketChange: 0, extraPaydown: 0 },
      { name: "Plan B", incomeChange: -10, marketChange: -15, extraPaydown: 0 },
      { name: "Plan C", incomeChange: 5, marketChange: 8, extraPaydown: 100000 },
    ],
    fire: {
      withdrawalRate: 4,
    },
    ui: {
      theme: "light",
    },
  };
}

const state = createDefaultState();

const elements = {
  assetList: document.querySelector("#asset-list"),
  addAssetButton: document.querySelector("#add-asset-button"),
  debtList: document.querySelector("#debt-list"),
  addDebtButton: document.querySelector("#add-debt-button"),
  validationList: document.querySelector("#validation-list"),
  validationSummary: document.querySelector("#validation-summary"),
  eventList: document.querySelector("#event-list"),
  addEventButton: document.querySelector("#add-event-button"),
  monthlyNetFlow: document.querySelector("#monthly-net-flow"),
  lowestCashBalance: document.querySelector("#lowest-cash-balance"),
  cashGapFlag: document.querySelector("#cash-gap-flag"),
  forecastTableBody: document.querySelector("#forecast-table-body"),
  cashflowChart: document.querySelector("#cashflow-chart"),
  netWorthChart: document.querySelector("#net-worth-chart"),
  recommendedStrategy: document.querySelector("#recommended-strategy"),
  payoffMonths: document.querySelector("#payoff-months"),
  payoffInterest: document.querySelector("#payoff-interest"),
  repaymentTableBody: document.querySelector("#repayment-table-body"),
  strategyNote: document.querySelector("#strategy-note"),
  repaymentScheduleList: document.querySelector("#repayment-schedule-list"),
  totalAssets: document.querySelector("#total-assets"),
  totalLiabilities: document.querySelector("#total-liabilities"),
  netWorth: document.querySelector("#net-worth"),
  freeCashFlow: document.querySelector("#free-cash-flow"),
  liabilityRatio: document.querySelector("#liability-ratio"),
  liquidAssetRatio: document.querySelector("#liquid-asset-ratio"),
  leverageRatio: document.querySelector("#leverage-ratio"),
  pledgeMaintenanceRatio: document.querySelector("#pledge-maintenance-ratio"),
  pledgeBufferRatio: document.querySelector("#pledge-buffer-ratio"),
  pledgeRiskLevel: document.querySelector("#pledge-risk-level"),
  pledgeRiskNote: document.querySelector("#pledge-risk-note"),
  pledgeStressTableBody: document.querySelector("#pledge-stress-table-body"),
  balanceStructureChart: document.querySelector("#balance-structure-chart"),
  assetCategorySummary: document.querySelector("#asset-category-summary"),
  assetCategoryChart: document.querySelector("#asset-category-chart"),
  debtCategorySummary: document.querySelector("#debt-category-summary"),
  debtCategoryChart: document.querySelector("#debt-category-chart"),
  investmentMarketValue: document.querySelector("#investment-market-value"),
  investmentGainLoss: document.querySelector("#investment-gain-loss"),
  investmentReturnRate: document.querySelector("#investment-return-rate"),
  investmentAllocationChart: document.querySelector("#investment-allocation-chart"),
  investmentTableBody: document.querySelector("#investment-table-body"),
  heroRiskHeadline: document.querySelector("#hero-risk-headline"),
  heroRiskDetail: document.querySelector("#hero-risk-detail"),
  heroActionHeadline: document.querySelector("#hero-action-headline"),
  heroActionDetail: document.querySelector("#hero-action-detail"),
  heroFocusHeadline: document.querySelector("#hero-focus-headline"),
  heroFocusDetail: document.querySelector("#hero-focus-detail"),
  heroNextStep: document.querySelector("#hero-next-step"),
  actionChecklist: document.querySelector("#action-checklist"),
  saveStatus: document.querySelector("#save-status"),
  backupStatus: document.querySelector("#backup-status"),
  exportButton: document.querySelector("#export-button"),
  importFile: document.querySelector("#import-file"),
  resetButton: document.querySelector("#reset-button"),
  modelGrid: document.querySelector("#model-grid"),
  inputPledgeMarketValue: document.querySelector("#input-pledge-market-value"),
  inputPledgeWarningRatio: document.querySelector("#input-pledge-warning-ratio"),
  inputSalaryIncome: document.querySelector("#input-salary-income"),
  inputPassiveIncome: document.querySelector("#input-passive-income"),
  inputMonthlyExpense: document.querySelector("#input-monthly-expense"),
  inputDebtPayment: document.querySelector("#input-debt-payment"),
  inputStartingCash: document.querySelector("#input-starting-cash"),
  inputEventNote: document.querySelector("#input-event-note"),
  inputExtraBudget: document.querySelector("#input-extra-budget"),
  inputStrategy: document.querySelector("#input-strategy"),
  inputHighestRateDebt: document.querySelector("#input-highest-rate-debt"),
  inputSmallestBalanceDebt: document.querySelector("#input-smallest-balance-debt"),
  inputPlanNote: document.querySelector("#input-plan-note"),
  inputLoanInvestmentReturn: document.querySelector("#input-loan-investment-return"),
  loanTotalBalance: document.querySelector("#loan-total-balance"),
  loanRateShockPayment: document.querySelector("#loan-rate-shock-payment"),
  loanComparisonTableBody: document.querySelector("#loan-comparison-table-body"),
  inputScenarioIncomeChange: document.querySelector("#input-scenario-income-change"),
  inputScenarioMarketChange: document.querySelector("#input-scenario-market-change"),
  inputScenarioExtraPaydown: document.querySelector("#input-scenario-extra-paydown"),
  inputScenarioHorizon: document.querySelector("#input-scenario-horizon"),
  scenarioMonthlyNet: document.querySelector("#scenario-monthly-net"),
  scenarioLowestCash: document.querySelector("#scenario-lowest-cash"),
  scenarioPledgeRatio: document.querySelector("#scenario-pledge-ratio"),
  scenarioNote: document.querySelector("#scenario-note"),
  scenarioStatus: document.querySelector("#scenario-status"),
  scenarioQuickButtons: document.querySelector("#scenario-quick-buttons"),
  scenarioCompareTableBody: document.querySelector("#scenario-compare-table-body"),
  sensitivityTableBody: document.querySelector("#sensitivity-table-body"),
  riskLevel: document.querySelector("#risk-level"),
  riskAction: document.querySelector("#risk-action"),
  helpButton: document.querySelector("#help-button"),
  helpModal: document.querySelector("#help-modal"),
  helpModalClose: document.querySelector("#help-modal-close"),
  helpModalDismiss: document.querySelector("#help-modal-dismiss"),
  onboardingBanner: document.querySelector("#onboarding-banner"),
  onboardingStep: document.querySelector("#onboarding-step"),
  onboardingDetail: document.querySelector("#onboarding-detail"),
  onboardingQuickActions: document.querySelector("#onboarding-quick-actions"),
  decisionChecklist: document.querySelector("#decision-checklist"),
  smartSuggestionList: document.querySelector("#smart-suggestion-list"),
  notificationList: document.querySelector("#notification-list"),
  educationTipList: document.querySelector("#education-tip-list"),
  autoSavingPlanList: document.querySelector("#auto-saving-plan-list"),
  fireTargetPortfolio: document.querySelector("#fire-target-portfolio"),
  fireProgress: document.querySelector("#fire-progress"),
  fireMonths: document.querySelector("#fire-months"),
  inputFireWithdrawalRate: document.querySelector("#input-fire-withdrawal-rate"),
  templateButtons: document.querySelector("#template-buttons"),
  assetGuide: document.querySelector("#asset-guide"),
  debtGuide: document.querySelector("#debt-guide"),
  cashflowGuide: document.querySelector("#cashflow-guide"),
  budgetGuide: document.querySelector("#budget-guide"),
  goalGuide: document.querySelector("#goal-guide"),
  assetSection: document.querySelector("#asset-section"),
  debtSection: document.querySelector("#debt-section"),
  cashflowSection: document.querySelector("#cashflow-section"),
  incomeExpenseSection: document.querySelector("#income-expense-section"),
  budgetSection: document.querySelector("#budget-section"),
  goalSection: document.querySelector("#goal-section"),
  forecastSection: document.querySelector("#forecast-section"),
  netWorthDashboardAssets: document.querySelector("#net-worth-dashboard-assets"),
  netWorthDashboardLiabilities: document.querySelector("#net-worth-dashboard-liabilities"),
  netWorthDashboardCashflow: document.querySelector("#net-worth-dashboard-cashflow"),
  netWorthDashboardCoverage: document.querySelector("#net-worth-dashboard-coverage"),
  transactionList: document.querySelector("#transaction-list"),
  addTransactionButton: document.querySelector("#add-transaction-button"),
  incomeExpenseMonth: document.querySelector("#income-expense-month"),
  incomeExpenseIncome: document.querySelector("#income-expense-income"),
  incomeExpenseExpense: document.querySelector("#income-expense-expense"),
  incomeExpenseNetFlow: document.querySelector("#income-expense-net-flow"),
  expenseCategoryChart: document.querySelector("#expense-category-chart"),
  incomeExpenseTrendChart: document.querySelector("#income-expense-trend-chart"),
  budgetList: document.querySelector("#budget-list"),
  addBudgetButton: document.querySelector("#add-budget-button"),
  budgetLimitTotal: document.querySelector("#budget-limit-total"),
  budgetSpentTotal: document.querySelector("#budget-spent-total"),
  budgetRemainingTotal: document.querySelector("#budget-remaining-total"),
  budgetOverAlert: document.querySelector("#budget-over-alert"),
  goalName: document.querySelector("#input-goal-name"),
  goalTargetAmount: document.querySelector("#input-goal-target-amount"),
  goalCurrentAmount: document.querySelector("#input-goal-current-amount"),
  goalMonths: document.querySelector("#input-goal-months"),
  goalRequiredMonthly: document.querySelector("#goal-required-monthly"),
  goalProgress: document.querySelector("#goal-progress"),
  goalFundingGap: document.querySelector("#goal-funding-gap"),
  goalStatus: document.querySelector("#goal-status"),
  forecastDeficitMonth: document.querySelector("#forecast-deficit-month"),
  forecastDeficitAmount: document.querySelector("#forecast-deficit-amount"),
  riskSection: document.querySelector("#risk-section"),
};

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

function syncState(target, source) {
  Object.keys(target).forEach((key) => {
    delete target[key];
  });

  Object.assign(target, deepClone(source));
}

function formatCurrency(value) {
  const numericValue = Number.isFinite(value) ? value : 0;
  return `NT$ ${new Intl.NumberFormat("zh-TW", {
    maximumFractionDigits: 0,
  }).format(Math.round(numericValue))}`;
}

function formatNumberInputValue(value) {
  const numericValue = Number(value) || 0;
  return String(numericValue);
}

function getAssetTypeLabel(type) {
  return ASSET_TYPE_OPTIONS.find((option) => option.value === type)?.label || "未分類資產";
}

function getDebtTypeLabel(type) {
  return DEBT_TYPE_OPTIONS.find((option) => option.value === type)?.label || "未分類負債";
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

window.FEATURE_FLAGS = Object.assign({
  onboarding: true,
  guideEngine: true,
  insights: true,
  metrics: true,
}, window.FEATURE_FLAGS || {});

window.FinancePlannerState = {
  STORAGE_KEY,
  ASSET_TYPE_OPTIONS,
  DEBT_TYPE_OPTIONS,
  MODEL_OVERVIEW,
  createId,
  createDefaultAsset,
  createDefaultDebt,
  createDefaultEvent,
  createDefaultTransaction,
  createDefaultBudget,
  createDefaultState,
  state,
  elements,
  deepClone,
  syncState,
  formatCurrency,
  formatNumberInputValue,
  getAssetTypeLabel,
  getDebtTypeLabel,
  escapeHtml,
};

Object.assign(window, window.FinancePlannerState);
