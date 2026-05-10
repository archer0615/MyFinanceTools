const assetTypeLabels = new Map(ASSET_TYPE_OPTIONS.map((option) => [option.value, option.label]));
const debtTypeLabels = new Map(DEBT_TYPE_OPTIONS.map((option) => [option.value, option.label]));

function toNumber(value) {
  return Number(value) || 0;
}

function sumBy(items, selector) {
  return (Array.isArray(items) ? items : []).reduce((total, item) => total + toNumber(selector(item)), 0);
}

function groupByType(items, valueKey, labelMap) {
  const grouped = new Map();

  (Array.isArray(items) ? items : []).forEach((item) => {
    const type = item.type || "other";
    grouped.set(type, (grouped.get(type) || 0) + toNumber(item[valueKey]));
  });

  return Array.from(grouped, ([type, value]) => ({
    type: labelMap.get(type) || type,
    value,
  })).filter((item) => item.value > 0);
}

function adaptNetWorth(state) {
  if (Array.isArray(state.timeline) && state.timeline.length > 0) {
    return state.timeline.map((row, index) => {
      const assets = toNumber(row.assets ?? row.totalAssets);
      const liabilities = toNumber(row.liabilities ?? row.totalLiabilities);

      return {
        date: row.date || row.month || String(index + 1),
        netWorth: toNumber(row.netWorth ?? (assets - liabilities)),
      };
    });
  }

  const assets = sumBy(state.assets, (asset) => asset.amount);
  const liabilities = sumBy(state.liabilities || state.debts, (liability) => liability.balance);

  return [{
    date: new Date().toISOString().slice(0, 10),
    netWorth: assets - liabilities,
  }];
}

function adaptCashflow(state) {
  const cashflow = state.cashflow || {};

  return [{
    date: state.incomeExpense?.month || new Date().toISOString().slice(0, 7),
    income: toNumber(cashflow.salaryIncome) + toNumber(cashflow.passiveIncome),
    expense: toNumber(cashflow.monthlyExpense) + toNumber(cashflow.debtPayment),
  }];
}

function adaptAssets(state) {
  return groupByType(state.assets, "amount", assetTypeLabels);
}

function adaptLiabilities(state) {
  return groupByType(state.liabilities || state.debts, "balance", debtTypeLabels);
}

function adaptChartData(state) {
  return {
    netWorth: adaptNetWorth(state),
    cashflow: adaptCashflow(state),
    assets: adaptAssets(state),
    liabilities: adaptLiabilities(state),
  };
}

window.FinancePlannerChartDataAdapter = {
  adaptNetWorth,
  adaptCashflow,
  adaptAssets,
  adaptLiabilities,
  adaptChartData,
};

Object.assign(window, window.FinancePlannerChartDataAdapter);
