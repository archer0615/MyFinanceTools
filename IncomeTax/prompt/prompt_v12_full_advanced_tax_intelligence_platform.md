# 台灣綜所稅工具 — Full Advanced Tax Intelligence Platform Prompt v12

本 Prompt 整合以下功能方向：

- Tax Delta Analysis
- Explainable Recommendation Engine
- Scenario Slider Simulation
- Timeline Forecast Engine
- Strategy Workspace
- Advanced Combination Filtering
- ViewModel Layer
- Strategy Pipeline Registry
- Derived-State Engine
- Tax Impact Visualization
- Interactive Tax Breakdown
- Smart Warning System
- Progressive Disclosure UX
- Recommendation Workspace
- Combination UX Stabilization
- Forecast Dashboard
- Recommendation Intelligence
- Optimization Goal System
- Local Scenario Persistence
- Advanced Table UX
- Recommendation Timeline
- Optimization History


# IMPORTANT CONSTRAINTS

維持：

- Vanilla JS
- file:// compatibility
- GitHub Pages compatibility

禁止：

- framework migration
- rewrite
- backend dependency
- database introduction
- npm tooling

採：

incremental deterministic extension


# FEATURE 1 — Tax Delta Analysis

建立：

calculateTaxDelta()

generateDeltaExplanation()

比較：

- payable tax
- refund
- effective rate
- tax bracket
- deductions

Renderer：

新增方案差異比較表。


# FEATURE 2 — Explainable Recommendation Engine

建立：

generateRecommendationReasons()

解釋：

- 為何推薦某方案
- 為何退稅增加
- 為何稅率下降

建立 recommendation priority system。


# FEATURE 3 — Scenario Slider Simulation

新增 slider：

- salary
- dividend
- interest
- mortgage

建立：

applyRealtimeScenario()

slider 變動時需即時重算。

新增快速情境：

- 升職加薪
- 股利減半
- 新增扶養
- 房貸增加


# FEATURE 4 — Timeline Forecast Engine

建立：

simulateTimelineForecast()

支援：

- 5-year forecast
- salary growth
- dividend growth
- inflation assumptions

Renderer：

顯示年度稅負趨勢。


# FEATURE 5 — Strategy Workspace

建立：

Tax Strategy Workspace

新增策略比較表：

- payable tax
- refund
- effective rate
- recommendation

建立：

rankStrategies()


# FEATURE 6 — Advanced Combination Filtering

新增 filter：

- only recommended
- only refund
- only low tax bracket
- only 5% bracket

自動分類：

- lowest tax
- highest refund
- high risk
- not recommended


# FEATURE 7 — ViewModel Layer

建立：

buildResultViewModel()

renderer：

只負責 render。

禁止 business logic 直接進 renderer。


# FEATURE 8 — Strategy Pipeline Registry

建立：

registerStrategy()

集中管理：

- combined taxation
- separate taxation
- recommendation strategies
- dependent strategies


# FEATURE 9 — Derived-State Engine

建立：

deriveTaxState()

集中管理：

- base state
- scenario state
- forecast state
- optimization state

避免 state drift。


# FEATURE 10 — Tax Impact Visualization

顯示：

哪些項目最影響稅負。

建立：

rankTaxImpactFactors()


# FEATURE 11 — Interactive Tax Breakdown

新增：

interactive tax breakdown

使用者可展開：

為何是這個稅額。

顯示：

- taxable income
- deduction
- tax credit
- bracket


# FEATURE 12 — Smart Warning System

建立：

generateSmartWarnings()

Examples：

- 股利抵減接近上限
- 即將進入更高級距


# FEATURE 13 — Progressive Disclosure UX

新增：

- beginner mode
- advanced mode

beginner：

只顯示核心結果。

advanced：

顯示 optimization / forecast / advanced breakdown。


# FEATURE 14 — Recommendation Workspace

建立 Recommendation Dashboard：

- 最佳節稅建議
- 最佳扶養策略
- 最佳股利策略
- 未來稅負風險


# FEATURE 15 — Combination UX Stabilization

新增：

- pagination
- lazy rendering
- virtualized rows
- combination search

避免 information explosion。


# FEATURE 16 — Forecast Dashboard

顯示：

- 今年稅負
- 明年稅負
- 五年平均稅負
- 最高稅率年度
- 最佳節稅年度

Visualization：

限制 lightweight SVG / CSS chart。


# FEATURE 17 — Performance Stabilization

建立：

- batched calculation
- render scheduling

避免 UI freeze。


# FEATURE 18 — Recommendation Intelligence

建立：

scoreRecommendations()

Factor：

- tax savings
- risk
- complexity
- confidence

新增 confidence level。


# FEATURE 19 — Optimization Goal System

新增 optimization modes：

- maximize refund
- minimize payable tax
- minimize effective rate
- conservative optimization


# FEATURE 20 — Local Scenario Persistence

建立：

saveScenario()
loadScenario()

支援：

- quick save
- rename
- overwrite
- delete


# FEATURE 21 — Advanced Table UX

支援：

- sort by tax
- sort by refund
- sort by effective rate
- sort by recommendation score

最佳方案 highlight row。

mobile 支援 horizontal scrolling。


# FEATURE 22 — Recommendation Timeline

顯示：

未來稅負風險。

Example：

若薪資持續成長，
2028 年可能進入 20% 稅率級距。


# FEATURE 23 — Optimization History

記錄：

- scenario history
- recommendation history
- optimization history


# FORBIDDEN PATTERNS

禁止：

- framework migration
- duplicated calculation logic
- renderer business logic coupling
- backend dependency
- brute-force UI blocking
- state mutation chaos


# SUCCESS CRITERIA

完成後：

- 可比較方案差異
- 可解釋推薦原因
- 可即時 scenario simulation
- 可預測未來稅負
- 可最佳化策略
- 可分析 tax impact
- 可管理大量組合
- 可視覺化稅務變化

維持：

- Vanilla JS
- deterministic flow
- pure function architecture
- file:// compatibility
- GitHub Pages compatibility
