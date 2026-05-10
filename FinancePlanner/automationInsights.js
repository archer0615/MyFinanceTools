const CATEGORY_KEYWORDS = [
  { category: "food", patterns: ["food", "餐", "午餐", "晚餐", "早餐", "咖啡", "便當", "飲料", "超商"] },
  { category: "rent", patterns: ["rent", "房租", "租金", "管理費", "住居"] },
  { category: "transport", patterns: ["taxi", "uber", "捷運", "高鐵", "交通", "油錢", "停車"] },
  { category: "utility", patterns: ["電費", "水費", "瓦斯", "網路", "電話", "手機"] },
  { category: "insurance", patterns: ["保險", "保費"] },
  { category: "health", patterns: ["醫", "藥", "診所", "健檢"] },
  { category: "education", patterns: ["課程", "學費", "書", "教育"] },
  { category: "entertainment", patterns: ["電影", "遊戲", "netflix", "spotify", "娛樂"] },
];

function suggestTransactionCategory(transaction) {
  const text = `${transaction?.note || ""} ${transaction?.category || ""}`.toLowerCase();
  const match = CATEGORY_KEYWORDS.find((item) => item.patterns.some((pattern) => text.includes(pattern.toLowerCase())));
  return match?.category || transaction?.category || "other";
}

function applyAutoCategorization(transactions) {
  return (Array.isArray(transactions) ? transactions : []).map((transaction) => ({
    ...transaction,
    category: transaction.type === "expense" ? suggestTransactionCategory(transaction) : transaction.category,
  }));
}

function buildSmartSuggestions(context) {
  const suggestions = [];
  const topExpense = context.incomeExpense.expenseByCategory[0];

  if (topExpense && context.incomeExpense.totalExpense > 0 && topExpense.value / context.incomeExpense.totalExpense >= 0.4) {
    suggestions.push({
      title: `${topExpense.label} 支出偏高`,
      body: `本月 ${topExpense.label} 占支出 ${(topExpense.value / context.incomeExpense.totalExpense * 100).toFixed(1)}%，可先設定單週上限或拆成必要 / 非必要。`,
    });
  }

  if (context.budget.overBudgetCount > 0) {
    suggestions.push({
      title: "預算超標",
      body: `目前 ${context.budget.overBudgetCount} 個分類超出預算，優先檢查最大支出分類與非固定支出。`,
    });
  }

  if (context.netWorthDashboard.monthlyNetCashflow > 0) {
    suggestions.push({
      title: "儲蓄建議",
      body: `可把月淨現金流的 30% 到 50% 先分配到緊急預備金、目標或高利負債。`,
    });
  } else {
    suggestions.push({
      title: "現金流需修正",
      body: "目前月淨現金流不為正，先把固定支出與債務月付拆開檢查，再決定投資或提前還款。",
    });
  }

  return suggestions;
}

function buildNotifications(context, state) {
  const notifications = [];
  const eventItems = Array.isArray(state.events) ? state.events : [];
  const upcomingBills = eventItems
    .filter((eventItem) => eventItem.type === "expense" && Number(eventItem.month) >= 1 && Number(eventItem.month) <= 2)
    .slice(0, 3);

  upcomingBills.forEach((eventItem) => {
    notifications.push({
      level: "info",
      title: "帳單提醒",
      body: `${eventItem.month} 月有 ${eventItem.label || "未命名支出"}，金額約 ${Math.abs(Number(eventItem.amount) || 0).toLocaleString("zh-TW")}。`,
    });
  });

  if (context.budget.overBudgetCount > 0) {
    notifications.push({
      level: "warning",
      title: "預算超標",
      body: `${context.budget.overBudgetCount} 個分類已超出本月預算。`,
    });
  }

  if (context.cashflowForecast.lowestCash < 0) {
    notifications.push({
      level: "danger",
      title: "低餘額警示",
      body: `12 個月預測最低現金為 ${Math.round(context.cashflowForecast.lowestCash).toLocaleString("zh-TW")}，需要補現金或降支出。`,
    });
  }

  return notifications;
}

window.InsightsEngine = {
  suggestTransactionCategory,
  applyAutoCategorization,
  buildSmartSuggestions,
  buildNotifications,
};

Object.assign(window, window.InsightsEngine);
