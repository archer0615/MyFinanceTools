const EXPENSE_CATEGORIES = [
  { value: "food", label: "Food" },
  { value: "rent", label: "Rent" },
  { value: "transport", label: "Transport" },
  { value: "utility", label: "Utility" },
  { value: "insurance", label: "Insurance" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "other", label: "Other" },
];

const INCOME_CATEGORIES = [
  { value: "salary", label: "Salary" },
  { value: "bonus", label: "Bonus" },
  { value: "interest", label: "Interest" },
  { value: "dividend", label: "Dividend" },
  { value: "side_income", label: "Side Income" },
  { value: "other", label: "Other" },
];

function getCategoryLabel(type, category) {
  const options = type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
  return options.find((option) => option.value === category)?.label || "Other";
}

function calculateNetWorthDashboard(state) {
  const totalAssets = sumBy(state.assets, (asset) => asset.amount);
  const totalLiabilities = sumBy(state.debts, (debt) => debt.balance);
  const fixedIncome = (Number(state.cashflow.salaryIncome) || 0) + (Number(state.cashflow.passiveIncome) || 0);
  const fixedExpenses = (Number(state.cashflow.monthlyExpense) || 0) + (Number(state.cashflow.debtPayment) || 0);
  const netWorth = totalAssets - totalLiabilities;
  const monthlyNetCashflow = fixedIncome - fixedExpenses;
  const liquidTypes = new Set(ASSET_TYPE_OPTIONS.filter((option) => option.liquid).map((option) => option.value));
  const liquidAssets = sumBy(state.assets, (asset) => liquidTypes.has(asset.type) ? asset.amount : 0);

  return {
    totalAssets,
    totalLiabilities,
    fixedIncome,
    fixedExpenses,
    netWorth,
    monthlyNetCashflow,
    liquidAssets,
    cashCoverageMonths: fixedExpenses > 0 ? liquidAssets / fixedExpenses : 0,
  };
}

function calculateIncomeExpenseOverview(transactions, month = null) {
  const rows = Array.isArray(transactions) ? transactions : [];
  const scopedRows = month ? rows.filter((transaction) => transaction.month === month) : rows;
  const totalIncome = sumBy(scopedRows, (transaction) => transaction.type === "income" ? transaction.amount : 0);
  const totalExpense = sumBy(scopedRows, (transaction) => transaction.type === "expense" ? transaction.amount : 0);
  const monthlyTrend = buildMonthlyTrend(rows);
  const expenseByCategory = buildCategoryTotals(scopedRows, "expense");

  return {
    totalIncome,
    totalExpense,
    netFlow: totalIncome - totalExpense,
    expenseByCategory,
    monthlyTrend,
  };
}

function calculateBudgetOverview(budgets, transactions, month = null) {
  const rows = Array.isArray(budgets) ? budgets : [];
  const expenseOverview = calculateIncomeExpenseOverview(transactions, month);
  const expenseMap = new Map(expenseOverview.expenseByCategory.map((item) => [item.category, item.value]));

  const categoryBudgets = rows.map((budget) => {
    const limit = Math.max(0, Number(budget.limit) || 0);
    const spent = expenseMap.get(budget.category) || 0;
    const remaining = limit - spent;

    return {
      ...budget,
      limit,
      spent,
      remaining,
      usageRatio: limit > 0 ? (spent / limit) * 100 : 0,
      isOverBudget: limit > 0 && spent > limit,
    };
  });

  return {
    categoryBudgets,
    totalLimit: sumBy(categoryBudgets, (budget) => budget.limit),
    totalSpent: sumBy(categoryBudgets, (budget) => budget.spent),
    totalRemaining: sumBy(categoryBudgets, (budget) => budget.remaining),
    overBudgetCount: categoryBudgets.filter((budget) => budget.isOverBudget).length,
  };
}

function calculateGoalPlan(goal, monthlyNetCashflow = 0) {
  const targetAmount = Math.max(0, Number(goal?.targetAmount) || 0);
  const currentAmount = Math.max(0, Number(goal?.currentAmount) || 0);
  const months = Math.max(1, Math.floor(Number(goal?.months) || 1));
  const remainingAmount = Math.max(0, targetAmount - currentAmount);
  const requiredMonthlyContribution = remainingAmount / months;
  const availableMonthlyCash = Math.max(0, Number(monthlyNetCashflow) || 0);

  return {
    targetAmount,
    currentAmount,
    months,
    remainingAmount,
    requiredMonthlyContribution,
    availableMonthlyCash,
    fundingGap: Math.max(0, requiredMonthlyContribution - availableMonthlyCash),
    progressRatio: targetAmount > 0 ? Math.min(100, (currentAmount / targetAmount) * 100) : 0,
    isReachable: requiredMonthlyContribution <= availableMonthlyCash,
  };
}

function buildCategoryTotals(transactions, type) {
  const totals = new Map();

  transactions
    .filter((transaction) => transaction.type === type)
    .forEach((transaction) => {
      const key = transaction.category || "other";
      totals.set(key, (totals.get(key) || 0) + (Number(transaction.amount) || 0));
    });

  return [...totals.entries()]
    .map(([category, value]) => ({
      category,
      label: getCategoryLabel(type, category),
      value,
    }))
    .sort((left, right) => right.value - left.value);
}

function buildMonthlyTrend(transactions) {
  const totals = new Map();

  transactions.forEach((transaction) => {
    const month = transaction.month || "未設定";
    const current = totals.get(month) || { month, income: 0, expense: 0, netFlow: 0 };
    const amount = Number(transaction.amount) || 0;

    if (transaction.type === "income") {
      current.income += amount;
    } else {
      current.expense += amount;
    }

    current.netFlow = current.income - current.expense;
    totals.set(month, current);
  });

  return [...totals.values()].sort((left, right) => String(left.month).localeCompare(String(right.month)));
}

window.FinancePlannerMetrics = {
  EXPENSE_CATEGORIES,
  INCOME_CATEGORIES,
  getCategoryLabel,
  calculateNetWorthDashboard,
  calculateIncomeExpenseOverview,
  calculateBudgetOverview,
  calculateGoalPlan,
};

Object.assign(window, window.FinancePlannerMetrics);
