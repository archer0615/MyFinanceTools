const INVESTMENT_TYPES = new Set(["stock", "fund", "etf", "crypto", "foreign_currency"]);

function buildInvestmentTracking(state) {
  const investments = (Array.isArray(state.assets) ? state.assets : [])
    .filter((asset) => INVESTMENT_TYPES.has(asset.type))
    .map((asset) => {
      const costBasis = Math.max(0, Number(asset.costBasis) || Number(asset.amount) || 0);
      const marketValue = Math.max(0, Number(asset.amount) || 0);
      const gainLoss = marketValue - costBasis;

      return {
        id: asset.id,
        name: asset.name || "未命名投資",
        type: asset.type,
        costBasis,
        marketValue,
        gainLoss,
        returnRate: costBasis > 0 ? (gainLoss / costBasis) * 100 : 0,
      };
    });
  const totalMarketValue = sumBy(investments, (investment) => investment.marketValue);
  const totalCostBasis = sumBy(investments, (investment) => investment.costBasis);
  const totalGainLoss = totalMarketValue - totalCostBasis;

  return {
    investments: investments.map((investment) => ({
      ...investment,
      allocation: totalMarketValue > 0 ? (investment.marketValue / totalMarketValue) * 100 : 0,
    })),
    totalMarketValue,
    totalCostBasis,
    totalGainLoss,
    totalReturnRate: totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0,
  };
}

function buildLoanAnalysis(state) {
  const annualInvestmentReturn = Math.max(0, Number(state.loanAnalysis?.investmentReturn) || 0);
  const extraPaydown = Math.max(0, Number(state.repayment?.extraBudget) || 0);
  const rows = (Array.isArray(state.debts) ? state.debts : [])
    .filter((debt) => Number(debt.balance) > 0)
    .map((debt) => {
      const balance = Math.max(0, Number(debt.balance) || 0);
      const rate = Math.max(0, Number(debt.rate) || 0);
      const monthlyRate = rate / 100 / 12;
      const monthlyPayment = Math.max(0, Number(debt.minimumPayment) || 0);
      const interestOnlyCost = balance * monthlyRate;
      const rateShockPayment = monthlyPayment + (balance * 0.01 / 12);
      const annualInterestSaved = Math.min(extraPaydown, balance) * rate / 100;
      const annualInvestmentGain = extraPaydown * annualInvestmentReturn / 100;
      const betterAction = annualInterestSaved >= annualInvestmentGain ? "提前還款" : "投入投資";

      return {
        id: debt.id,
        name: debt.name || "未命名貸款",
        balance,
        rate,
        monthlyPayment,
        interestOnlyCost,
        rateShockPayment,
        annualInterestSaved,
        annualInvestmentGain,
        betterAction,
      };
    });

  return {
    rows,
    totalBalance: sumBy(rows, (row) => row.balance),
    totalMonthlyPayment: sumBy(rows, (row) => row.monthlyPayment),
    totalRateShockPayment: sumBy(rows, (row) => row.rateShockPayment),
    investmentReturn: annualInvestmentReturn,
  };
}

window.FinancePlannerAnalysisMetrics = {
  buildInvestmentTracking,
  buildLoanAnalysis,
};

Object.assign(window, window.FinancePlannerAnalysisMetrics);
