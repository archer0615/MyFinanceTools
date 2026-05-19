const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

test("URL state loads investment and simulation fields", () => {
  const context = {
    URLSearchParams,
    Number,
    window: {
      location: {
        search: "?initialAmount=120000&monthlyContribution=15000&years=10&annualReturn=0.07&volatility=0.12&dividendYield=0.02&iterations=500"
      }
    }
  };
  loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
  loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
  loadScript(context, path.join(__dirname, "../frontend/state/urlState.js"));

  const state = context.loadUrlState();

  assert.equal(state.investment.initialAmount, 120000);
  assert.equal(state.investment.annualReturn, 0.07);
  assert.equal(state.simulations.iterations, 500);
});

test("URL state loads ETF portfolio holdings", () => {
  const context = {
    URLSearchParams,
    Number,
    window: {
      location: {
        search: "?holdings=VOO:50,QQQ:30,SCHD:20"
      }
    }
  };
  loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
  loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
  loadScript(context, path.join(__dirname, "../frontend/state/urlState.js"));

  const state = context.loadUrlState();

  assert.equal(state.portfolio.holdings.length, 3);
  assert.equal(state.portfolio.holdings[0].ticker, "VOO");
  assert.equal(state.portfolio.holdings[0].allocation, 0.5);
});

test("URL state saves canonical state as query params", () => {
  let replacedUrl = "";
  const context = {
    URLSearchParams,
    window: {
      location: { pathname: "/index.html", hash: "#chart" },
      history: {
        replaceState: (_state, _title, url) => {
          replacedUrl = url;
        }
      }
    }
  };
  loadScript(context, path.join(__dirname, "../frontend/domain/etfMetadata.js"));
  loadScript(context, path.join(__dirname, "../frontend/domain/portfolioEngine.js"));
  loadScript(context, path.join(__dirname, "../frontend/state/urlState.js"));

  context.saveUrlState({
    investment: {
      initialAmount: 100000,
      monthlyContribution: 10000,
      years: 20,
      annualReturn: 0.08,
      volatility: 0.16,
      dividendYield: 0.02
    },
    simulations: { iterations: 1000 },
    portfolio: {
      holdings: [
        { ticker: "VOO", allocation: 0.5 },
        { ticker: "QQQ", allocation: 0.3 }
      ]
    }
  });

  assert.match(replacedUrl, /^\/index\.html\?/);
  assert.match(replacedUrl, /initialAmount=100000/);
  assert.match(replacedUrl, /iterations=1000/);
  assert.match(replacedUrl, /holdings=VOO%3A50%2CQQQ%3A30/);
  assert.match(replacedUrl, /#chart$/);
});
