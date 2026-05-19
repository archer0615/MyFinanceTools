# Testing

- Unit tests：`npm test`
- Browser smoke：`npm run test:browser`
- Core coverage：compound growth, risk metrics, Monte Carlo batching, historical replay
- Domain coverage：ETF metadata, portfolio allocation, rebalancing, leverage, drawdown, FIRE, economic scenarios
- State coverage：legacy migration, canonical derived dataset update
- URL coverage：load and save round-trip fields
- Visualization coverage：chart model primary series, overlays, Monte Carlo distribution bars
- Benchmark coverage：5,000 Monte Carlo iterations over 50 years
- Accessibility coverage：theme text and muted color contrast checks
- Export coverage：PNG download link generation
- Error recovery：worker failure writes `ui.error`
- Browser smoke coverage：file:// render, canvas size, historical replay UI, Monte Carlo completion, console errors
- Offline criteria：file:// works, no CDN, no fetch(), no backend, no console errors

## Current Commands

- `npm test`
- `npm run test:browser`

## Deterministic Rules

- Monte Carlo tests use fixed seed `42`.
- Financial engine tests avoid wall-clock time and network data.
- Browser smoke validates static `file://` execution.
