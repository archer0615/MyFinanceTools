const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0);
}

function netWorthLineOption(dataset) {
  return {
    tooltip: {
      trigger: "axis",
      valueFormatter: formatCurrency,
    },
    legend: {
      top: 0,
    },
    grid: {
      top: 42,
      right: 18,
      bottom: 32,
      left: 72,
    },
    dataset: {
      source: dataset,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => `${Math.round(value / 10000)}萬`,
      },
    },
    series: [{
      name: "淨資產",
      type: "line",
      smooth: true,
      encode: {
        x: "date",
        y: "netWorth",
      },
    }],
  };
}

function cashFlowBarOption(dataset) {
  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      valueFormatter: formatCurrency,
    },
    legend: {
      top: 0,
    },
    grid: {
      top: 42,
      right: 18,
      bottom: 32,
      left: 72,
    },
    dataset: {
      source: dataset,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: (value) => `${Math.round(value / 10000)}萬`,
      },
    },
    series: [
      {
        name: "收入",
        type: "bar",
        stack: "cashflow",
        encode: {
          x: "date",
          y: "income",
        },
      },
      {
        name: "支出",
        type: "bar",
        stack: "cashflow",
        encode: {
          x: "date",
          y: "expense",
        },
      },
    ],
  };
}

function pieOption(dataset, name = "配置") {
  return {
    tooltip: {
      trigger: "item",
      valueFormatter: formatCurrency,
    },
    legend: {
      type: "scroll",
      bottom: 0,
    },
    dataset: {
      source: dataset.length ? dataset : [{ type: "尚無資料", value: 0 }],
    },
    series: [{
      name,
      type: "pie",
      radius: ["42%", "70%"],
      center: ["50%", "45%"],
      encode: {
        itemName: "type",
        value: "value",
      },
    }],
  };
}

window.FinancePlannerChartConfigs = {
  netWorthLineOption,
  cashFlowBarOption,
  pieOption,
};

Object.assign(window, window.FinancePlannerChartConfigs);
