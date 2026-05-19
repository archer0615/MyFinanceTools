# ETF 投資模擬器架構

- Orchestration：`frontend/script.js`
- Core：`frontend/core/` pure calculation and simulation logic
- Domain：`frontend/domain/` portfolio, ETF metadata, rebalancing, leverage, drawdown, FIRE, economic scenario engines
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
- `portfolio`
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
- Portfolio state is derived through `frontend/domain/portfolioOrchestration.js`.
- Economic scenario output is stored in `state.simulations.economicScenarios`.
- FIRE output is stored in `state.simulations.fire`.
- Chart overlays are assembled in `frontend/charts/VisualizationModel.js`, then rendered by `ChartRenderer`.
- TypeScript migration scaffold lives in `tsconfig.json` and `shared/types.d.ts`; runtime files remain browser-loaded JavaScript.
- Target `/src` migration scaffold exists with Prompt_v5 folders; production runtime has not moved out of `frontend/`.
