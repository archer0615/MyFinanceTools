# 台灣綜所稅工具 — Advanced Planning & Optimization Prompt v11

目前專案已具備：

- 基本綜所稅試算
- deduction engine
- 利息所得
- 房貸 deduction dependency
- 股利課稅
- refund / payable flow
- validation engine
- UIUX optimization

本次目標：

進一步升級為：

Tax Planning & Optimization Platform

但：

以下功能暫不實作：

- 二代健保
- 海外所得 AMT
- 股票 vesting / RSU
- FIRE / 退休模擬
- PDF report
- Shareable link
- 匯入報稅資料
- 稅法版本切換
- ETF / 股票深度分析
- 夫妻申報最佳化

---

# 核心新增功能

1. Scenario Simulation Engine
2. Multi-Year Tax Simulation
3. Explainable Tax Engine
4. Constraint-Based Optimization
5. Family Combination Optimization
6. Recommendation Engine
7. Local Save / Restore
8. Advanced Data Table UX
9. Forecast Dashboard

---

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
- async architecture redesign

採：

incremental deterministic extension

---

# FEATURE 1 — Scenario Simulation Engine

建立：

scenarioOverrides

支援：

- 薪資變動
- 股利變動
- 利息變動
- 房貸變動
- 扶養變動

建立：

applyScenarioProjection()

流程：

base data
+ scenario overrides
→ projected tax result

不可覆蓋原始資料。

---

# FEATURE 2 — Multi-Year Tax Simulation

建立：

simulateMultiYearTax()

支援：

- 未來 3~5 年
- 稅負變化
- 退稅變化
- 稅率變化

Renderer 顯示：

- 2026
- 2027
- 2028
- 2029
- 2030

需支援：

- 趨勢分析
- 年度比較

---

# FEATURE 3 — Explainable Tax Engine

建立：

generateTaxExplanation()

需解釋：

- 為何稅負增加
- 為何退稅增加
- 為何稅率下降

Example：

因加入扶養親屬，
稅率由 12% 降至 5%。

analysis：

- 不可修改 calculation
- pure explanation pipeline

---

# FEATURE 4 — Constraint-Based Optimization

建立：

optimizeTaxStrategy()

支援：

- 最低應納稅
- 最大退稅
- 最低有效稅率

Constraint examples：

- 不新增扶養
- 維持房貸
- 不改變股利模式

---

# FEATURE 5 — Family Combination Optimization

建立：

householdMembers

Structure：

{
  id,
  name,
  relationship,
  income,
  canBeClaimed
}

建立：

generateFilingCombinations()

與：

simulateCombinationTax()

輸出：

- 稅率級距
- 應補稅
- 退稅
- 有效稅率

建立：

rankCombinationResults()

---

# FEATURE 6 — Recommendation Engine

建立：

generateRecommendations()

Examples：

- 目前採合併計稅較有利
- 新增扶養父母後可降低稅率
- 股利抵減已接近上限

recommendation：

- pure pipeline
- 不直接操作 renderer

---

# FEATURE 7 — Local Save / Restore

建立：

saveScenario()
loadScenario()

使用：

localStorage

支援：

- quick save
- rename
- overwrite
- delete

---

# FEATURE 8 — Advanced Data Table UX

建立：

sortable result table

支援：

- sort by tax
- sort by refund
- sort by effective rate

最佳方案：

highlight row

mobile：

horizontal scroll

---

# FEATURE 9 — Forecast Dashboard

新增：

- 今年稅負
- 明年預估
- 五年平均稅負
- 最高稅率年度
- 最佳節稅年度

建立：

trend visualization

限制：

禁止重型 chart library。

僅允許：

- lightweight SVG
- CSS visualization

---

# PERFORMANCE REQUIREMENTS

避免：

- UI freeze
- brute-force rendering

大型組合：

需：

- batched calculation
- incremental rendering

---

# FORBIDDEN PATTERNS

禁止：

- framework migration
- duplicated tax logic
- renderer business logic coupling
- backend API dependency
- state mutation chaos

---

# SUCCESS CRITERIA

完成後：

- 可模擬未來稅負
- 可做情境模擬
- 可分析家庭組合
- 可自動推薦節稅方案
- 可保存與還原資料
- 可視化稅負趨勢

維持：

- Vanilla JS
- deterministic flow
- pure function architecture
- file:// compatibility
- GitHub Pages compatibility

既有：

- mortgage logic
- dividend logic
- deduction engine
- validation

不得崩潰。
