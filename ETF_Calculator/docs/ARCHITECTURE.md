# ETF 投資模擬器架構

- Orchestration：`frontend/script.js`
- Core：`frontend/core/` pure calculation and simulation logic
- State：`frontend/state/` canonical state, localStorage, URL sync
- Charts：`frontend/charts/` stateless canvas renderer
- UI：`frontend/ui/` DOM bindings and view updates
- Export：`frontend/export/` PNG export

## Canonical Data Flow

- Input
- State
- Simulation
- Derived Dataset
- Renderer
- Export

## State Shape

- `investment`
- `simulations`
- `charts`
- `presets`
- `ui`
- `export`

## Notes

- `frontend/historicalData.js` feeds `frontend/core/historicalReplay.js` and stores output in `state.simulations.historicalReplay`.
- Historical replay is rendered in its own UI block through `frontend/ui/dashboardView.js`.
- Worker Monte Carlo uses `frontend/core/monteCarlo.js` through `importScripts`.
- `frontend/script.js` should remain orchestration-only.
