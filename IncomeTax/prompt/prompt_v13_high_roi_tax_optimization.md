
# 台灣綜所稅工具 — High ROI Optimization Execution Prompt v13

本次只實作：

- 稅務差異分析
- 可解釋推薦引擎
- 情境模擬工作區
- 多年度稅負預測
- 組合篩選
- 策略工作台
- 推薦智能排序
- Beginner / Advanced Mode
- ViewModel Layer
- Performance Stabilization

---

# IMPORTANT CONSTRAINTS

維持：

- Vanilla JS
- file:// compatibility
- GitHub Pages compatibility

禁止：

- rewrite
- framework migration
- backend dependency
- npm tooling

採：

incremental deterministic extension

---

# IMPLEMENTATION ORDER

Phase 1 — Tax Delta Analysis
Phase 2 — Explainable Recommendation
Phase 3 — Scenario Workspace
Phase 4 — Timeline Forecast
Phase 5 — Combination Filtering
Phase 6 — Strategy Workspace
Phase 7 — Recommendation Intelligence
Phase 8 — Beginner / Advanced Mode
Phase 9 — ViewModel Layer
Phase 10 — Performance Stabilization

---

# PHASE 1 — Tax Delta Analysis

建立：

calculateTaxDelta()

輸出：

- payableTaxDelta
- refundDelta
- effectiveRateDelta
- bracketDelta
- deductionDelta

新增：

方案差異分析區。

表格：

| 項目 | 原方案 | 新方案 | 差異 |

Examples：

- 退稅增加 12000 元
- 稅率由 12% 降至 5%

禁止 renderer calculation coupling。

---

# PHASE 2 — Explainable Recommendation

建立：

generateRecommendationReasons()

輸出：

- type
- priority
- message
- confidence

Examples：

- 納入父母扶養後稅率降至 5%
- 股利改採分離課稅後總稅負降低

建立：

Recommendation Insight Panel

分組：

- 高影響
- 中影響
- 注意事項

---

# PHASE 3 — Scenario Workspace

建立：

Scenario Workspace

新增 slider：

- salary
- dividend
- interest
- mortgage

建立：

applyRealtimeScenario()

slider 變動：

立即重算。

新增 presets：

- 升職加薪
- 股利減半
- 新增扶養
- 房貸增加

顯示：

- 稅率
- 退稅
- 應納稅額
- 有效稅率

禁止覆蓋 base state。

---

# PHASE 4 — Timeline Forecast

建立：

simulateTimelineForecast()

輸入：

- salaryGrowth
- dividendGrowth
- inflationRate

輸出：

- year
- payableTax
- refundAmount
- effectiveRate
- bracket

建立：

Timeline Forecast Panel

顯示：

2026 → 2030

Visualization：

- 稅負變化
- 稅率變化
- 退稅變化

禁止 heavy chart libraries。

---

# PHASE 5 — Combination Filtering

建立：

filterCombinationResults()

支援：

- only recommended
- only refund
- only low tax
- only 5% bracket

新增：

搜尋申報組合。

自動分類：

- 最低稅負
- 高退稅
- 高風險
- 不推薦

---

# PHASE 6 — Strategy Workspace

建立：

Tax Strategy Workspace

新增策略比較表：

- 應納稅
- 退稅
- 有效稅率
- 推薦

建立：

rankStrategies()

排序：

- 最低稅負
- 最大退稅
- 最低有效稅率

---

# PHASE 7 — Recommendation Intelligence

建立：

scoreRecommendations()

Factors：

- tax savings
- risk
- complexity
- confidence

Categories：

- highly recommended
- recommended
- informational
- warning

---

# PHASE 8 — Beginner / Advanced Mode

建立：

toggleExperienceMode()

Beginner：

- 應納稅額
- 退稅
- 最佳方案
- 核心 recommendation

Advanced：

- optimization
- delta analysis
- timeline forecast
- impact analysis
- strategy comparison

---

# PHASE 9 — ViewModel Layer

建立：

buildResultViewModel()

renderer：

只 render。

禁止：

- recommendation logic
- ranking logic
- calculation logic

Structure：

- summary
- recommendation
- comparison
- forecast
- warnings

---

# PHASE 10 — Performance Stabilization

建立：

- batched calculation
- lazy rendering
- render scheduling

table：

支援：

- pagination
- virtualized rows

避免：

- UI freeze
- giant table lag
- synchronous heavy render

---

# REQUIRED PIPELINE

base state
→ derived state
→ recommendation
→ view model
→ renderer

---

# UIUX REQUIREMENTS

建立 workflow-oriented UI。

避免 dashboard chaos。

Visual Hierarchy：

Primary：

- payable tax
- refund
- best strategy

Secondary：

- recommendation
- delta analysis

Supporting：

- breakdown
- warnings
- comparison

---

# FORBIDDEN PATTERNS

禁止：

- framework migration
- duplicated calculation logic
- renderer business logic
- brute-force rendering
- hidden state mutation

---

# SUCCESS CRITERIA

完成後：

- 可比較方案差異
- 可解釋推薦原因
- 可即時 scenario simulation
- 可預測五年稅負
- 可最佳化策略
- 可分析大量組合
- recommendation 有智能排序

維持：

- Vanilla JS
- deterministic flow
- pure function architecture
- file:// compatibility
- GitHub Pages compatibility
