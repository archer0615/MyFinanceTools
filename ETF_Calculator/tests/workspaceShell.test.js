const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

const context = {};
loadScript(context, path.join(__dirname, "../frontend/ui/workspaceShell.js"));

test("workspace shell keeps legacy form embedded and orders panels deterministically", () => {
  const shell = context.createWorkspaceShell({
    simulations: {
      result: { cagr: 0.08 },
      scenarios: [{ id: "base" }],
      ranking: [{ id: "base", rank: 1 }],
      historicalReplay: null,
      monteCarlo: null
    },
    charts: { dataset: [{ year: 1, value: 100 }] },
    explanation: { summary: "ok" }
  });

  assert.equal(shell.legacyForm.id, "controls");
  assert.equal(shell.legacyForm.compatible, true);
  assert.equal(shell.panels.map((panel) => panel.order).join(","), "1,2,3,4,5,6,7,8,9");
  assert.equal(shell.panels.find((panel) => panel.id === "chart-area").status, "ready");
  assert.equal(shell.panels.find((panel) => panel.id === "monte-carlo-panel").status, "empty");
});
