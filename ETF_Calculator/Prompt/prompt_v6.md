# Prompt.md

# ETF Investment Simulator - Product Evolution Prompt

You are working on a professional-grade ETF investment simulator platform.

This project is already beyond a simple calculator.

The current codebase already contains:

* ETF simulation engine
* Portfolio engine
* FIRE engine
* Scenario engine
* Monte Carlo simulation
* Historical replay
* Drawdown analysis
* Tax engine
* Web Worker support
* State management
* Chart abstraction
* Export functionality
* Testing infrastructure

The project is technically strong.

However, the platform still lacks:

* professional product UX
* dashboard experience
* polished visual hierarchy
* investment storytelling
* advanced visualization
* portfolio workflow optimization

The goal is to transform this project into a modern fintech-grade investment analysis platform.

---

# PRIMARY OBJECTIVE

Transform the current engineering-heavy simulator into a polished product-oriented ETF investment platform.

The final product should feel similar to:

* Portfolio Visualizer
* Snowball Analytics
* TradingView portfolio tools
* modern fintech dashboards

NOT a simple form calculator.

---

# CORE PRODUCT DIRECTIONS

Prioritize:

1. Dashboard experience
2. Portfolio management workflow
3. Investment storytelling
4. Professional financial visualizations
5. Product-quality UX
6. Advanced analytics
7. Mobile usability
8. Scalable architecture

---

# MOST IMPORTANT PROBLEM

Current issue:

The app feels like:

"engineer tool with many calculations"

Instead of:

"professional investment product"

Focus heavily on product layer improvements.

---

# HIGH PRIORITY UI/UX REDESIGN

# 1. Dashboard Layout

Replace traditional vertical form layout.

Target layout:

---

| Sidebar Controls | Main Dashboard Area |

---

Sidebar:

* portfolio builder
* scenario controls
* FIRE settings
* tax settings
* simulation settings

Main dashboard:

* portfolio growth chart
* drawdown chart
* Monte Carlo chart
* allocation chart
* KPI summary cards

---

# 2. KPI Summary Cards

Add high visibility investment metrics.

Examples:

* Expected CAGR
* Final Portfolio Value
* Annual Dividend Income
* FIRE Age
* Success Probability
* Max Drawdown
* Sharpe Ratio
* Inflation Adjusted Return

Cards should:

* be visually prominent
* support responsive layout
* include mini trend indicators
* support dark mode

---

# 3. Investment Narrative Layer

Add intelligent financial summaries.

Examples:

"This portfolio has strong long-term growth potential but may experience drawdowns exceeding -40% during severe bear markets."

"The current allocation improves dividend stability but slightly reduces long-term CAGR."

The app should explain results like a real financial product.

---

# 4. Design System

Implement proper design tokens.

Required:

* typography scale
* spacing scale
* elevation system
* color tokens
* radius system
* chart color palette
* semantic colors

Use CSS variables.

Example:

--bg-primary
--bg-surface
--text-primary
--accent-positive
--accent-negative
--border-muted

Avoid hardcoded colors.

---

# 5. Dark Mode

Dark mode should be first-class.

Requirements:

* chart optimized
* smooth transitions
* persisted preference
* auto detect system theme

Charts must remain readable.

---

# 6. Responsive Mobile UX

Current layout is likely desktop-first.

Need:

* mobile dashboard
* tab-based navigation
* collapsible panels
* responsive charts
* touch-friendly controls

Suggested mobile tabs:

* Summary
* Portfolio
* Charts
* Simulation
* Settings

Avoid squeezing desktop UI into mobile.

---

# PRODUCT FEATURES

# 1. Portfolio Builder

Build professional portfolio allocation workflow.

Features:

* add/remove ETFs
* allocation sliders
* allocation pie chart
* allocation validation
* rebalance preview
* portfolio comparison

Portfolio UI should feel interactive and visual.

---

# 2. ETF Metadata Database

Create structured ETF preset system.

Fields:

* ticker
* displayName
* category
* CAGR
* dividendYield
* expenseRatio
* volatility
* region
* inceptionYear

Include presets:

Taiwan:

* 0050
* 006208
* 00878
* 00919

US:

* VOO
* QQQ
* VTI
* VT
* SCHD
* SPY

Need:

* searchable dropdown
* autofill
* quick portfolio add

---

# 3. Advanced Chart System

Charts should resemble modern financial software.

Required improvements:

* benchmark overlay
* inflation overlay
* percentile bands
* hover analytics
* timeline markers
* confidence intervals
* zoom support
* export image support

Hover example:

Year 15
Portfolio: $4,230,000
Dividend: $132,000/year
Drawdown: -18%

---

# 4. Monte Carlo Upgrade

Current implementation is calculation-heavy but visually weak.

Add:

* 100+ simulation paths
* percentile areas
* terminal distribution histogram
* probability heatmaps
* success probability

Need institutional-grade visualization quality.

---

# 5. Drawdown Analytics

Improve risk visualization.

Features:

* underwater chart
* recovery duration
* max drawdown periods
* stress test visualization

Historical presets:

* 2008 crash
* COVID crash
* dot-com bubble

---

# 6. Scenario Presets

Scenario engine should support quick presets.

Examples:

* Bull Market
* Bear Market
* High Inflation
* Stagflation
* Recession
* Aggressive Growth

One-click switching.

---

# 7. FIRE Planning

Improve retirement planning UX.

Features:

* retirement target
* monthly passive income goal
* safe withdrawal rate
* inflation adjustment
* retirement success probability

Add reverse calculation:

User goal:
"I want 100k monthly passive income"

System calculates:

* required capital
* monthly contribution
* target CAGR
* estimated FIRE age

---

# 8. Dividend Projection

Very important feature.

Display:

* annual dividend income
* monthly passive income
* dividend growth over time
* dividend reinvestment impact

Need charts + summary cards.

---

# 9. Portfolio Comparison

Allow multiple portfolio comparison.

Example:

Portfolio A:

* VOO heavy

Portfolio B:

* Dividend heavy

Compare:

* CAGR
* drawdown
* dividend income
* volatility
* FIRE timeline

---

# 10. Saved Portfolios

Implement portfolio persistence.

Need:

* save/load
* localStorage
* import/export JSON
* sharable URL configs

Future ready for cloud sync.

---

# ARCHITECTURE IMPROVEMENTS

# IMPORTANT

Avoid giant orchestration files.

Potential current risk:

* script.js growing too large
* appState coupling
* dashboardView complexity

---

# Recommended Structure

/src

/components
/widgets
/features
/layouts
/charts
/engines
/simulations
/models
/store
/services
/hooks
/utils
/workers
/themes
/types

---

# COMPONENT STRATEGY

Move toward feature-based components.

Examples:

PortfolioBuilder
SummaryMetrics
MonteCarloPanel
DrawdownPanel
ScenarioSelector
FirePlanner
DividendProjection
AllocationChart

Avoid monolithic views.

---

# PERFORMANCE REQUIREMENTS

Heavy simulations must remain smooth.

Use:

* memoization
* lazy loading
* Web Workers
* debounced updates
* virtualization if necessary

Avoid:

* blocking UI thread
* excessive rerenders
* huge reactive state chains

Target:

Smooth UX under large simulations.

---

# VISUAL HIERARCHY

Current app likely lacks visual prioritization.

Need:

* clear section hierarchy
* spacing consistency
* readable typography
* emphasis system
* cleaner grouping

Dashboard should immediately communicate:

* performance
* risk
* retirement readiness

---

# ACCESSIBILITY

Implement:

* keyboard navigation
* ARIA labels
* contrast compliance
* semantic HTML

---

# TESTING REQUIREMENTS

Add tests for:

* portfolio calculations
* rebalance engine
* Monte Carlo engine
* FIRE calculations
* drawdown calculations
* tax calculations

Financial calculations must remain deterministic.

---

# FUTURE OPTIONAL FEATURES

Optional roadmap:

* live ETF APIs
* currency conversion
* AI portfolio insights
* portfolio optimization
* tax optimization
* dividend calendar
* brokerage integration

---

# DEVELOPMENT PRIORITY

PHASE 1

* dashboard redesign
* KPI cards
* dark mode
* portfolio builder
* ETF metadata system

PHASE 2

* advanced charts
* Monte Carlo visualization
* drawdown analytics
* scenario presets

PHASE 3

* FIRE planning
* dividend projection
* portfolio comparison

PHASE 4

* mobile UX
* accessibility
* saved portfolios
* export improvements

PHASE 5

* API integrations
* AI insights
* optimization tools

---

# IMPORTANT CODING RULES

* Prefer readability.
* Avoid overengineering.
* Keep business logic outside UI.
* Keep components small.
* Use strict typing.
* Avoid unnecessary dependencies.
* Keep modules testable.

---

# DO NOT

* Do NOT rewrite entire project.
* Do NOT introduce unnecessary frameworks.
* Do NOT tightly couple chart logic with simulation logic.
* Do NOT place heavy calculations inside UI components.
* Do NOT create giant global state.

---

# FINAL GOAL

Build a production-quality ETF investment analysis platform with:

* professional fintech UX
* advanced portfolio analytics
* scalable architecture
* institutional-grade visualization
* polished dashboard experience
* excellent mobile usability

The final product should feel like a real investment platform, not a calculator.
