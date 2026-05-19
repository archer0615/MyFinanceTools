function getOfflineEtfQuote(ticker) {
  const preset = findEtfPreset(ticker);
  if (!preset) return null;
  return {
    ticker: preset.ticker,
    displayName: preset.displayName,
    currency: preset.currency,
    price: estimatePresetPrice(preset),
    dividendYield: preset.dividendYield,
    expenseRatio: preset.expenseRatio,
    source: "offline-preset",
    asOf: "static"
  };
}

function estimatePresetPrice(preset) {
  const age = Math.max(2026 - preset.inceptionYear, 1);
  return Math.round(100 * (1 + preset.cagr) ** Math.min(age, 20));
}

function getOfflineEtfQuotes(tickers) {
  return (Array.isArray(tickers) ? tickers : [])
    .map(getOfflineEtfQuote)
    .filter(Boolean);
}

function buildEtfProviderUrl(providerUrl, ticker) {
  if (providerUrl.includes("{ticker}")) return providerUrl.replace("{ticker}", encodeURIComponent(ticker));
  const url = new URL(providerUrl);
  url.searchParams.set("ticker", ticker);
  return url.toString();
}

function resolveEtfProviderUrl(providerKeyOrUrl) {
  const providers = {
    custom: "",
    twse: "https://openapi.twse.com.tw/v1/exchangeReport/STOCK_DAY_AVG_ALL",
    mock: "https://provider.test/quote?ticker={ticker}"
  };
  return providers[providerKeyOrUrl] || providerKeyOrUrl || "";
}

async function fetchLiveEtfQuote(providerUrl, ticker, fetchImpl = fetch) {
  const fallback = getOfflineEtfQuote(ticker);
  if (!providerUrl || typeof fetchImpl !== "function") return fallback;
  try {
    const response = await fetchImpl(buildEtfProviderUrl(providerUrl, ticker), {
      headers: { accept: "application/json" }
    });
    if (!response || !response.ok) return fallback;
    const payload = await response.json();
    return normalizeProviderQuote(payload, fallback);
  } catch {
    return fallback;
  }
}

async function fetchLiveEtfQuotes(providerUrl, tickers, fetchImpl = fetch) {
  const resolvedUrl = resolveEtfProviderUrl(providerUrl);
  const quotes = await Promise.all((Array.isArray(tickers) ? tickers : [])
    .map((ticker) => fetchLiveEtfQuote(resolvedUrl, ticker, fetchImpl)));
  return quotes.filter(Boolean);
}

function normalizeProviderQuote(payload, fallback) {
  if (!payload && !fallback) return null;
  return {
    ticker: String(payload.ticker || fallback.ticker).toUpperCase(),
    displayName: payload.displayName || payload.name || fallback.displayName,
    currency: payload.currency || fallback.currency,
    price: Number(payload.price) || fallback.price,
    dividendYield: Number(payload.dividendYield) || fallback.dividendYield,
    expenseRatio: Number(payload.expenseRatio) || fallback.expenseRatio,
    source: payload.source || "network-provider",
    asOf: payload.asOf || new Date(0).toISOString()
  };
}
