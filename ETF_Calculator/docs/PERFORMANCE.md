# Performance Review

## Current Controls

- Monte Carlo runs in `frontend/worker.js` when Worker is available.
- Rebalancing, leverage, crash, FIRE, tax, and optimization can run through `frontend/worker.js` with synchronous fallback.
- Fallback Monte Carlo uses `runMonteCarloBatched` with scheduled batches.
- Chart rendering is wrapped in `requestAnimationFrame`.
- Canvas rendering keeps DOM updates low during chart redraws.
- Monte Carlo chart paths are capped for drawing:
  - stored chart paths: first 120 paths
  - rendered sampled paths: first 24 paths
- URL state is compact and stores core numeric fields plus portfolio ticker allocation pairs.
- Domain engines are pure functions and can be tested without DOM.

## Risk Areas

- `renderDashboard` currently redraws all dashboard panels on every state update.
- Large portfolios may cause repeated full holding list rerenders.
- Monte Carlo percentile summaries sort values per year.
- Canvas overlays share one scale, which is fast but not always visually optimal for very different series.

## Next Improvements

- Add debounced input updates for high-frequency numeric edits.
- Split dashboard rendering into panel-level dirty checks.
- Memoize portfolio metrics by holdings signature.
- Benchmark smoke test covers 5,000 Monte Carlo iterations and 50-year projections.
