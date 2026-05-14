const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("worker error handler stores error and resets progress", () => {
  const source = fs.readFileSync(path.join(__dirname, "../frontend/script.js"), "utf8");
  const calls = [];
  const services = {
    setError: (error) => calls.push(["error", error]),
    setMonteCarloResult: () => calls.push(["result"]),
    setDerivedDataset: () => {},
    setHistoricalReplay: () => {}
  };
  const context = {
    document: { addEventListener: () => {}, getElementById: () => null },
    DEFAULT_STATE: {},
    createRepository: () => ({}),
    createStateManager: () => ({ getState: () => ({ investment: {}, simulations: { iterations: 1 } }) }),
    createServiceLayer: () => services,
    ChartRenderer: function ChartRenderer() {},
    setText: (id, value) => calls.push(["text", id, value]),
    setProgress: (value) => calls.push(["progress", value]),
    i18n: { loadingSimulation: "loading", calculatingRisk: "risk" },
    Worker: function Worker() {
      this.postMessage = () => this.onerror();
      this.terminate = () => calls.push(["terminate"]);
    }
  };

  vm.runInNewContext(`${source}\nglobalThis.runMonteCarloSimulation = runMonteCarloSimulation;`, context);
  context.runMonteCarloSimulation();

  assert.deepEqual(calls.filter((call) => call[0] === "progress").at(-1), ["progress", 0]);
  assert.deepEqual(calls.find((call) => call[0] === "error"), ["error", "模擬執行失敗"]);
});
