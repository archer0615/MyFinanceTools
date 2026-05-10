function getRecommendedActions(state) {
  const balance = calculateBalanceMetrics(state);
  const pledge = calculatePledgeMetrics(state);
  const monthlyEssentials = (Number(state.cashflow.monthlyExpense) || 0) + (Number(state.cashflow.debtPayment) || 0);
  const emergencyMonths = monthlyEssentials > 0 ? (Number(state.cashflow.startingCash) || 0) / monthlyEssentials : 0;
  const actions = [];

  if (balance.freeCashFlow < 0) {
    actions.push("減支出");
  }

  if (balance.liabilityRatio > 60) {
    actions.push("停止槓桿");
  }

  if (pledge.pledgeDebt > 0 && pledge.bufferRatio < 10) {
    actions.push("降槓桿");
  }

  if (emergencyMonths < 3) {
    actions.push("補現金");
  }

  return { actions };
}

window.FinancePlannerDecisionEngine = {
  getRecommendedActions,
};

Object.assign(window, window.FinancePlannerDecisionEngine);
