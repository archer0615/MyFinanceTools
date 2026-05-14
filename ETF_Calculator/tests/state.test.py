const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScriptWithExports } = require("./loadScript");

function createContext() {
  const storage = new Map();
  return {
    structuredClone,
    localStorage: {
      getItem: (key) => storage.get(key) || null,
      setItem: (key, value) => storage.set(key, value)
    }
  };
}

test("state manager migrates legacy config into canonical state", () => {
  const context = createContext();
  context.localStorage.setItem("state", JSON.stringify({
    config: {
      initialAmount: 1,
      monthlyContribution: 2,
      years: 3,
      annualReturn: 0.04,
      volatility: 0.05,
      dividendYield: 0.06,
      simulations: 700,
      theme: "light",
      currentTab: "dashboard"
    },
    ui: { viewport: { zoom: 2, panX: 9 } }
  }));

  loadScriptWithExports(context, path.join(__dirname, "../frontend/state/appState.js"), [
    "DEFAULT_STATE",
    "createRepository",
    "createStateManager",
    "createServiceLayer"
  ]);
  const manager = context.createStateManager(context.DEFAULT_STATE, context.createRepository("state"));
  const state = manager.getState();

  assert.equal(state.investment.initialAmount, 1);
  assert.equal(state.simulations.iterations, 700);
  assert.equal(state.charts.viewport.zoom, 2);
  assert.equal(state.config, undefined);
});

test("setInvestmentAndDerived updates canonical state atomically", () => {
  const context = createContext();
  loadScriptWithExports(context, path.join(__dirname, "../frontend/state/appState.js"), [
    "DEFAULT_STATE",
    "createRepository",
    "createStateManager",
    "createServiceLayer"
  ]);
  const manager = context.createStateManager(context.DEFAULT_STATE, context.createRepository("state"));
  const services = context.createServiceLayer(manager);

  services.setInvestmentAndDerived({ ...manager.getState().investment, years: 10 }, [{ year: 1, value: 2 }], {
    cagr: 0.1,
    maxDrawdown: 0,
    sharpeRatio: 1
  });

  const state = manager.getState();
  assert.equal(state.investment.years, 10);
  assert.equal(state.charts.dataset.length, 1);
  assert.equal(state.simulations.result.cagr, 0.1);
});

test("setError stores worker failure in ui state", () => {
  const context = createContext();
  loadScriptWithExports(context, path.join(__dirname, "../frontend/state/appState.js"), [
    "DEFAULT_STATE",
    "createRepository",
    "createStateManager",
    "createServiceLayer"
  ]);
  const manager = context.createStateManager(context.DEFAULT_STATE, context.createRepository("state"));
  const services = context.createServiceLayer(manager);

  services.setError("模擬執行失敗");

  assert.equal(manager.getState().ui.error, "模擬執行失敗");
});
