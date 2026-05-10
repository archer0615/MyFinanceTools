function buildEducationTips(context) {
  const tips = [
    {
      title: "淨資產曲線",
      body: "淨資產是資產扣除負債後的結果，長期方向比單月波動更重要。",
    },
    {
      title: "提領率",
      body: "退休規劃常用年支出除以可投資資產，提領率越低，資金安全邊際通常越高。",
    },
  ];

  if (context.budget.overBudgetCount > 0) {
    tips.push({
      title: "預算超標",
      body: "預算不是限制消費，而是讓你把錢留給更重要的目標。",
    });
  }

  return tips;
}

function buildFirePlan(state, dashboard) {
  const annualExpense = ((Number(state.cashflow.monthlyExpense) || 0) + (Number(state.cashflow.debtPayment) || 0)) * 12;
  const withdrawalRate = Math.max(0.1, Number(state.fire?.withdrawalRate) || 4);
  const targetPortfolio = annualExpense / (withdrawalRate / 100);
  const investableAssets = Math.max(0, dashboard.liquidAssets || 0);
  const monthlyContribution = Math.max(0, dashboard.monthlyNetCashflow || 0);
  const remaining = Math.max(0, targetPortfolio - investableAssets);

  return {
    annualExpense,
    withdrawalRate,
    targetPortfolio,
    investableAssets,
    monthlyContribution,
    remaining,
    monthsToFire: monthlyContribution > 0 ? Math.ceil(remaining / monthlyContribution) : 0,
    progressRatio: targetPortfolio > 0 ? Math.min(100, (investableAssets / targetPortfolio) * 100) : 0,
  };
}

function buildAutoSavingPlan(state, context) {
  const monthlyNet = Math.max(0, context.netWorthDashboard.monthlyNetCashflow || 0);
  const allocations = [
    { label: "緊急預備金", ratio: monthlyNet > 0 ? 30 : 0 },
    { label: "財務目標", ratio: monthlyNet > 0 ? 30 : 0 },
    { label: "投資配置", ratio: monthlyNet > 0 ? 25 : 0 },
    { label: "提前還款", ratio: monthlyNet > 0 ? 15 : 0 },
  ];

  return allocations.map((item) => ({
    ...item,
    amount: monthlyNet * item.ratio / 100,
  }));
}

window.ExperienceMetrics = {
  buildEducationTips,
  buildFirePlan,
  buildAutoSavingPlan,
};

Object.assign(window, window.ExperienceMetrics);
