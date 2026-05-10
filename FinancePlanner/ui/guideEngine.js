function getGuideMessages(state) {
  const messages = [];

  if (!state.assets.length) {
    messages.push({
      target: "asset",
      message: "先新增至少一筆資產，才能開始建立淨值與流動性判讀。",
    });
  }

  if (!state.debts.length) {
    messages.push({
      target: "debt",
      message: "先補上負債資料，還款策略與負債比才有參考意義。",
    });
  }

  const totalIncome = (Number(state.cashflow.salaryIncome) || 0) + (Number(state.cashflow.passiveIncome) || 0);
  if (totalIncome <= 0) {
    messages.push({
      target: "cashflow",
      message: "先填每月收入，系統才能判斷自由現金流與安全水位。",
    });
  }

  const hasBudget = Array.isArray(state.budgets) && state.budgets.some((budget) => Number(budget.limit) > 0);
  if (!hasBudget) {
    messages.push({
      target: "budget",
      message: "先設定至少一個支出分類預算，才能看到剩餘額度與超支提醒。",
    });
  }

  if (!state.goal || Number(state.goal.targetAmount) <= 0 || Number(state.goal.months) <= 0) {
    messages.push({
      target: "goal",
      message: "先填目標金額與剩餘月份，系統才能計算每月需投入金額。",
    });
  }

  return messages;
}

window.GuideEngine = {
  getGuideMessages,
};

Object.assign(window, window.GuideEngine);
