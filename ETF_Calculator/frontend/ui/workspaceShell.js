const WORKSPACE_PANEL_DEFINITIONS = [
  { id: "kpi-grid", role: "metrics", requiredState: "simulations.result" },
  { id: "chart-area", role: "visualization", requiredState: "charts.dataset" },
  { id: "analysis-panel", role: "reasoning", requiredState: "explanation" },
  { id: "scenario-panel", role: "scenario-comparison", requiredState: "simulations.scenarios" },
  { id: "ranking-panel", role: "optimization-ranking", requiredState: "simulations.ranking" },
  { id: "comparison-matrix-panel", role: "comparison-matrix", requiredState: "simulations.scenarios" },
  { id: "transparency-panel", role: "transparency-diagnostics", requiredState: "diagnostics" },
  { id: "historical-panel", role: "historical-replay", requiredState: "simulations.historicalReplay" },
  { id: "monte-carlo-panel", role: "monte-carlo", requiredState: "simulations.monteCarlo" }
];

function createWorkspaceShell(state) {
  return {
    mode: "workspace",
    legacyForm: {
      id: "controls",
      mode: "embedded",
      compatible: true
    },
    panels: WORKSPACE_PANEL_DEFINITIONS.map((definition, index) => ({
      ...definition,
      order: index + 1,
      status: resolvePanelStatus(state, definition.requiredState)
    }))
  };
}

function resolvePanelStatus(state, path) {
  const value = path.split(".").reduce((current, key) => (current ? current[key] : undefined), state);
  if (Array.isArray(value)) return value.length ? "ready" : "empty";
  return value ? "ready" : "empty";
}

function renderWorkspaceShell(shell) {
  shell.panels.forEach((panel) => {
    const element = document.getElementById(panel.id);
    if (!element) return;
    element.dataset.panelRole = panel.role;
    element.dataset.panelStatus = panel.status;
  });

  const legacyForm = document.getElementById(shell.legacyForm.id);
  if (legacyForm) {
    legacyForm.dataset.legacyMode = shell.legacyForm.mode;
    legacyForm.dataset.compatible = String(shell.legacyForm.compatible);
  }
}
