# Feature Status

## Completed

- ETF growth simulation
- CAGR, drawdown, volatility, Sharpe, Sortino, real return, dividend CAGR metrics
- Dividend-aware compound growth
- Historical replay
- Monte Carlo simulation with seeded deterministic paths
- Monte Carlo percentile paths and P10/P25/P50/P75/P90 outputs
- Multi-ETF portfolio holdings
- ETF preset metadata and search
- Allocation edit, validation, normalization, import, export
- Portfolio weighted CAGR, dividend yield, expense ratio, volatility
- Multi-currency exposure tracking for TWD and USD ETF presets
- Currency conversion UI controls for base currency and USD/TWD rate
- Tax simulation for dividend tax, capital gains tax, and estate tax drag
- Dividend calendar from ETF preset distribution months
- Portfolio optimization and risk scoring
- Cloud sync import/export stub
- Live ETF data adapter with deterministic offline preset quotes and pluggable network provider URL
- TypeScript strict migration scaffold with shared domain types
- `/src` target architecture scaffold
- Rebalancing engine with monthly, quarterly, yearly, and no-rebalance comparison
- Allocation drift and allocation history data
- Leverage loan simulation with amortization, debt, interest, net worth, leverage ratio
- Crash and drawdown stress tests for custom, 2008, COVID, and dot-com scenarios
- FIRE simulation with target amount, withdrawal rate, expenses, inflation, FIRE year, depletion year
- Economic scenario engine for high inflation, recession, long bear, rate hike, stagnation, aggressive bull
- Dashboard layout, responsive grid, sticky controls, dark mode
- Loading skeletons for Monte Carlo chart and result cards
- Canvas chart with Monte Carlo bands, sampled paths, overlays, legend, tooltip, wheel zoom, pointer pan, keyboard controls
- Dedicated chart views for rebalancing drift, leverage debt/net worth, crash drawdown, and FIRE withdrawal
- localStorage persistence
- URL state sync
- PNG export
- Web Worker Monte Carlo
- Unit and browser smoke tests
- Prompt_v5 completion audit

## Remaining

- Full runtime module conversion from browser-loaded JavaScript to TypeScript build output
- Move runtime implementation from `frontend/` into `/src`
- Rich tab navigation and collapsible section system
- Dedicated allocation history and crash recovery charts
- Full confidence interval and probability distribution chart controls
