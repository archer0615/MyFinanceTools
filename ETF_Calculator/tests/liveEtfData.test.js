const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = { Math, URL };
loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
loadScript(context, path.join(__dirname, "../frontend/services/liveEtfData.js"));

test("offline ETF data adapter returns deterministic quote snapshots", () => {
  const quote = context.getOfflineEtfQuote("VOO");
  const quotes = context.getOfflineEtfQuotes(["VOO", "0050", "UNKNOWN"]);

  assert.equal(quote.ticker, "VOO");
  assert.equal(quote.source, "offline-preset");
  assert.ok(quote.price > 0);
  assert.equal(quotes.length, 2);
});

test("network ETF provider normalizes quote payloads and appends ticker query", async () => {
  const requestedUrls = [];
  const fetchImpl = async (url) => {
    requestedUrls.push(url);
    return {
      ok: true,
      json: async () => ({
        ticker: "voo",
        name: "Provider VOO",
        currency: "USD",
        price: 512.34,
        dividendYield: 0.012,
        expenseRatio: 0.0003,
        source: "mock"
      })
    };
  };

  const quote = await context.fetchLiveEtfQuote("https://provider.test/quote", "VOO", fetchImpl);

  assert.equal(new URL(requestedUrls[0]).searchParams.get("ticker"), "VOO");
  assert.equal(quote.ticker, "VOO");
  assert.equal(quote.displayName, "Provider VOO");
  assert.equal(quote.price, 512.34);
  assert.equal(quote.source, "mock");
});

test("provider URL supports ticker templates and provider keys", async () => {
  const requestedUrls = [];
  const fetchImpl = async (url) => {
    requestedUrls.push(url);
    return {
      ok: true,
      json: async () => ({ ticker: "QQQ", price: 1 })
    };
  };

  await context.fetchLiveEtfQuote("https://provider.test/{ticker}/quote", "QQQ", fetchImpl);
  await context.fetchLiveEtfQuotes("mock", ["VOO"], fetchImpl);

  assert.equal(requestedUrls[0], "https://provider.test/QQQ/quote");
  assert.equal(new URL(requestedUrls[1]).searchParams.get("ticker"), "VOO");
});

test("network ETF provider falls back to offline quote on failure", async () => {
  const quote = await context.fetchLiveEtfQuote("https://provider.test/quote", "0050", async () => ({ ok: false }));

  assert.equal(quote.ticker, "0050");
  assert.equal(quote.source, "offline-preset");
});
