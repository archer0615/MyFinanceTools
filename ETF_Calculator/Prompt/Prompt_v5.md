# Prompt.md

# ETF Calculator - Advanced Investment Simulator Roadmap

You are working on a professional-grade ETF investment simulation platform.

This is NOT a toy calculator.

The goal is to evolve the current ETF Calculator into a modern investment analysis platform comparable to lightweight fintech portfolio simulators.

---

# Current Project Status

The current project already includes:

* ETF growth simulation
* CAGR calculations
* Dividend calculations
* Monte Carlo simulation
* Historical replay
* URL state sync
* localStorage persistence
* Chart visualization
* Export functionality
* Web Worker support
* Unit testing
* Modular frontend architecture

The codebase quality is already above average.

However, the project is still missing deeper investment analysis features and professional-grade simulation capabilities.

---

# Main Objectives

The next phase should focus on:

1. Multi-ETF portfolio simulation
2. Portfolio allocation system
3. Leverage / loan simulation
4. Crash and drawdown simulation
5. Professional Monte Carlo visualization
6. Portfolio rebalancing
7. FIRE retirement simulation
8. Advanced ETF metadata system
9. Scenario engine
10. Product-level UI/UX improvements

---

# IMPORTANT DEVELOPMENT RULES

## General Rules

* Do NOT rewrite the entire project.
* Preserve existing architecture whenever possible.
* Prefer incremental refactors.
* Keep modules decoupled.
* Avoid massive files.
* Use TypeScript strict mode.
* Avoid any breaking changes unless absolutely necessary.

---

# Architecture Requirements

## Maintain clean architecture

Separate:

* calculation engine
* simulation engine
* UI components
* chart adapters
* data models
* state management
* persistence layer

---

# Folder Structure

Expected architecture:

/src
/components
/features
/engines
/simulations
/workers
/charts
/models
/services
/utils
/hooks
/store
/types

---

# High Priority Features

# 1. Multi ETF Portfolio System

Implement support for:

* multiple ETFs
* allocation percentages
* weighted CAGR
* weighted dividend yield
* weighted expense ratio
* portfolio-level metrics

Support:

* add/remove ETFs
* editable allocation
* allocation validation
* auto rebalance percentages

Example:

VOO 50%
QQQ 30%
SCHD 20%

---

# 2. ETF Metadata System

Create ETF preset database.

Each ETF should include:

* ticker
* displayName
* CAGR
* dividendYield
* expenseRatio
* volatility
* region
* category
* inceptionYear

Include presets for:

Taiwan:

* 0050
* 006208
* 00878
* 00919

US:

* VOO
* QQQ
* VT
* SCHD
* SPY
* VTI

Support:

* searchable dropdown
* autofill
* quick add

---

# 3. Portfolio Rebalancing

Implement:

* monthly rebalance
* quarterly rebalance
* yearly rebalance

Need:

* rebalance engine
* allocation drift tracking
* rebalance performance comparison

Visualization:

* drift over time
* allocation history

---

# 4. Leverage / Loan Simulation

Implement loan-based investing simulation.

Support:

* initial loan
* interest rate
* monthly repayment
* amortization
* leverage ratio
* net return after interest

Need charts for:

* debt remaining
* investment growth
* net worth curve

---

# 5. Crash / Drawdown Engine

Implement stress testing.

Support:

* market crashes
* custom crash events
* recovery periods
* volatility spikes

Metrics:

* max drawdown
* recovery duration
* underwater duration

Charts:

* drawdown chart
* recovery visualization

Historical scenarios:

* 2008
* COVID crash
* dot-com bubble

---

# 6. Monte Carlo Visualization Upgrade

Current Monte Carlo output is too basic.

Implement:

* 100+ simulation paths
* percentile bands
* median path
* confidence intervals
* probability distribution charts

Add:

* 10th percentile
* 50th percentile
* 90th percentile

Visualization should look professional.

---

# 7. FIRE Simulation

Implement retirement simulation.

Support:

* retirement target
* safe withdrawal rate
* monthly expenses
* inflation
* retirement age
* withdrawal simulation

Need:

* FIRE date estimation
* success probability
* depletion simulation

---

# 8. Scenario Engine

Implement economic scenarios.

Scenarios:

* high inflation
* recession
* long bear market
* rate hike cycle
* stagnation
* aggressive bull market

Each scenario should affect:

* CAGR
* volatility
* dividend growth

---

# 9. Advanced Analytics

Add professional investment analytics.

Metrics:

* Sharpe ratio
* Sortino ratio
* volatility
* CAGR
* annualized return
* real return after inflation
* dividend CAGR
* max drawdown

---

# 10. UI / UX Improvements

Current UI is developer-oriented.

Need product-oriented redesign.

Implement:

* dashboard layout
* responsive mobile UI
* dark mode
* sticky summary panel
* collapsible sections
* tab navigation
* better spacing hierarchy
* loading skeletons
* smooth transitions

Design should resemble modern fintech tools.

---

# Performance Requirements

Must maintain smooth performance.

Use:

* memoization
* virtualization if needed
* Web Workers for heavy calculations
* lazy loading
* debounced updates

Avoid:

* unnecessary rerenders
* huge synchronous calculations

Target:

* smooth interaction under heavy simulations
* no UI freezing

---

# Testing Requirements

Add tests for:

* simulation engines
* financial calculations
* edge cases
* portfolio rebalance logic
* leverage calculations
* drawdown calculations

Use:

* unit tests
* integration tests

Financial calculations must be deterministic.

---

# Accessibility

Need:

* keyboard navigation
* ARIA support
* semantic HTML
* contrast compliance

---

# Charts

Charts must support:

* zoom
* tooltip
* responsive resizing
* export image
* multiple overlays

Avoid cluttered visuals.

---

# Data Persistence

Support:

* localStorage persistence
* sharable URLs
* import/export portfolio config

Future-ready for cloud sync.

---

# Future Optional Features

Optional future roadmap:

* live ETF API
* tax simulation
* dividend calendar
* currency conversion
* multi-currency portfolio
* AI investment insights
* portfolio optimization
* risk scoring

---

# Refactoring Priorities

Refactor areas that are:

* tightly coupled
* duplicated
* difficult to test
* calculation-heavy
* state-heavy

Do NOT over-engineer.

---

# Recommended Development Order

Phase 1:

* ETF metadata system
* multi ETF support
* allocation engine

Phase 2:

* portfolio rebalancing
* advanced charts
* Monte Carlo upgrade

Phase 3:

* leverage simulation
* crash simulation
* drawdown analytics

Phase 4:

* FIRE simulation
* scenario engine
* advanced analytics

Phase 5:

* UI redesign
* mobile optimization
* accessibility

---

# Deliverables

For every feature:

1. implementation
2. tests
3. documentation
4. typed interfaces
5. responsive UI
6. performance review

---

# IMPORTANT CODING STYLE RULES

* Prefer readability over cleverness.
* Avoid magic numbers.
* Use descriptive naming.
* Extract reusable utilities.
* Keep components small.
* Keep business logic outside UI components.

---

# DO NOT

* Do NOT introduce unnecessary frameworks.
* Do NOT rewrite working modules.
* Do NOT use massive global state unnecessarily.
* Do NOT create deeply nested component trees.
* Do NOT mix calculation logic into UI.

---

# Expected Outcome

Final product should feel like:

"Professional ETF & Portfolio Investment Simulator"

NOT:

"Simple CAGR calculator"

The platform should be suitable for:

* portfolio analysis
* retirement planning
* risk analysis
* leverage simulation
* investment education
* fintech showcase portfolio

---

# Final Goal

Build a clean, scalable, professional investment simulation platform with production-quality frontend architecture and professional financial analytics.
