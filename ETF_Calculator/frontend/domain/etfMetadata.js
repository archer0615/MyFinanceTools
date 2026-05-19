const ETF_PRESETS = [
  {
    ticker: "0050",
    displayName: "元大台灣50",
    cagr: 0.082,
    dividendYield: 0.028,
    expenseRatio: 0.0043,
    volatility: 0.18,
    currency: "TWD",
    region: "Taiwan",
    category: "Large Cap",
    inceptionYear: 2003,
    dividendMonths: [1, 7]
  },
  {
    ticker: "006208",
    displayName: "富邦台50",
    cagr: 0.083,
    dividendYield: 0.027,
    expenseRatio: 0.0034,
    volatility: 0.18,
    currency: "TWD",
    region: "Taiwan",
    category: "Large Cap",
    inceptionYear: 2012,
    dividendMonths: [7]
  },
  {
    ticker: "00878",
    displayName: "國泰永續高股息",
    cagr: 0.071,
    dividendYield: 0.055,
    expenseRatio: 0.0046,
    volatility: 0.145,
    currency: "TWD",
    region: "Taiwan",
    category: "Dividend",
    inceptionYear: 2020,
    dividendMonths: [2, 5, 8, 11]
  },
  {
    ticker: "00919",
    displayName: "群益台灣精選高息",
    cagr: 0.073,
    dividendYield: 0.068,
    expenseRatio: 0.0049,
    volatility: 0.15,
    currency: "TWD",
    region: "Taiwan",
    category: "Dividend",
    inceptionYear: 2022,
    dividendMonths: [3, 6, 9, 12]
  },
  {
    ticker: "VOO",
    displayName: "Vanguard S&P 500 ETF",
    cagr: 0.103,
    dividendYield: 0.014,
    expenseRatio: 0.0003,
    volatility: 0.155,
    currency: "USD",
    region: "US",
    category: "Large Cap",
    inceptionYear: 2010,
    dividendMonths: [3, 6, 9, 12]
  },
  {
    ticker: "QQQ",
    displayName: "Invesco QQQ Trust",
    cagr: 0.145,
    dividendYield: 0.006,
    expenseRatio: 0.002,
    volatility: 0.215,
    currency: "USD",
    region: "US",
    category: "Technology",
    inceptionYear: 1999,
    dividendMonths: [3, 6, 9, 12]
  },
  {
    ticker: "VT",
    displayName: "Vanguard Total World Stock ETF",
    cagr: 0.078,
    dividendYield: 0.019,
    expenseRatio: 0.0007,
    volatility: 0.145,
    currency: "USD",
    region: "Global",
    category: "Total Market",
    inceptionYear: 2008,
    dividendMonths: [3, 6, 9, 12]
  },
  {
    ticker: "SCHD",
    displayName: "Schwab US Dividend Equity ETF",
    cagr: 0.108,
    dividendYield: 0.035,
    expenseRatio: 0.0006,
    volatility: 0.15,
    currency: "USD",
    region: "US",
    category: "Dividend",
    inceptionYear: 2011,
    dividendMonths: [3, 6, 9, 12]
  },
  {
    ticker: "SPY",
    displayName: "SPDR S&P 500 ETF Trust",
    cagr: 0.101,
    dividendYield: 0.014,
    expenseRatio: 0.000945,
    volatility: 0.156,
    currency: "USD",
    region: "US",
    category: "Large Cap",
    inceptionYear: 1993,
    dividendMonths: [1, 4, 7, 10]
  },
  {
    ticker: "VTI",
    displayName: "Vanguard Total Stock Market ETF",
    cagr: 0.098,
    dividendYield: 0.015,
    expenseRatio: 0.0003,
    volatility: 0.158,
    currency: "USD",
    region: "US",
    category: "Total Market",
    inceptionYear: 2001,
    dividendMonths: [3, 6, 9, 12]
  }
];

function findEtfPreset(ticker) {
  const normalizedTicker = String(ticker || "").trim().toUpperCase();
  return ETF_PRESETS.find((preset) => preset.ticker.toUpperCase() === normalizedTicker) || null;
}

function searchEtfPresets(query) {
  const normalizedQuery = String(query || "").trim().toUpperCase();
  if (!normalizedQuery) return ETF_PRESETS.slice();
  return ETF_PRESETS.filter((preset) => [
    preset.ticker,
    preset.displayName,
    preset.region,
    preset.category
  ].some((value) => String(value).toUpperCase().includes(normalizedQuery)));
}
