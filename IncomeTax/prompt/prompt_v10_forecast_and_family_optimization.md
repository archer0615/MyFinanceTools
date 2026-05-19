# 台灣綜所稅工具 — Forecast Tax Engine + Family Combination Optimization Prompt v10

目前專案已具備：

- 所得稅基本試算
- deduction engine
- 房貸 deduction dependency
- 利息所得
- 股利課稅
- refund / payable flow
- validation engine

下一階段：

建立：

```text
tax planning + optimization platform
```

本次目標：

新增：

1. 下一年度所得稅預估
2. 家庭申報組合最佳化
3. 全組合自動試算
4. 稅率級距分析
5. 最佳申報建議

---

# IMPORTANT CONSTRAINTS

維持：

- Vanilla JS
- file:// compatibility
- GitHub Pages compatibility

禁止：

- rewrite
- framework migration
- architecture redesign
- backend dependency
- database introduction

採：

```text
incremental deterministic extension
```

---

# FEATURE 1 — Next-Year Forecast Engine

目前工具：

偏向：

```text
當年度申報
```

缺少：

```text
下一年度預估
```

---

# GOAL

建立：

```text
forecast tax engine
```

讓使用者可以：

```text
預估下一年度可能應繳 / 退稅
```

---

# TASK 1 — Forecast Schema

新增：

```js
forecastMode
forecastYear
```

---

# Suggested Default

```js
forecastMode: false
forecastYear: currentYear + 1
```

---

# TASK 2 — Forecast Income Inputs

新增：

---

## Salary Growth

```text
薪資成長率 %
```

---

## Dividend Growth

```text
股利變化 %
```

---

## Interest Growth

```text
利息變化 %
```

---

# TASK 3 — Forecast Projection Engine

建立：

```js
projectNextYearIncome()
```

---

# Suggested Logic

```js
projectedSalary =
currentSalary * (1 + growthRate)
```

---

# IMPORTANT

projection：

- 不可覆蓋原資料
- 必須獨立 state

---

# TASK 4 — Tax Rule Snapshot

目前 tax bracket：

可能 hardcoded。

需建立：

```text
tax rule snapshot system
```

---

# Required Structure

```js
TAX_RULES = {
  2025: {...},
  2026: {...}
}
```

---

# IMPORTANT

未來：

```text
年度稅率可能改變
```

需保留擴充能力。

---

# TASK 5 — Forecast Result Renderer

新增：

```text
預估明年應納稅額
預估退稅
預估稅率級距
```

---

# Required UX

目前年度：

與：

```text
預估年度
```

必須明確分離。

---

# Suggested UI

```text
今年試算
明年預估
```

tab 或 section。

---

# FEATURE 2 — Family Combination Optimization Engine

本次核心功能。

---

# GOAL

自動分析：

```text
所有可能申報組合
```

並找出：

```text
最低稅負方案
```

---

# TARGET MEMBERS

---

## Required Entities

```text
A 本人
B 本人父
C 本人母
D 配偶
E 配偶父
F 配偶母
G 配偶祖母
```

---

# IMPORTANT

未來：

必須可擴充。

不要 hardcode 7 人。

---

# TASK 6 — Household Member Schema

建立：

```js
householdMembers: []
```

---

# Required Structure

```js
{
  id,
  name,
  relationship,
  income,
  deductions,
  dependents,
  canBeClaimed
}
```

---

# IMPORTANT

relationship：

不可只做 display。

需可參與：

```text
tax dependency rules
```

---

# TASK 7 — Combination Generator

建立：

```js
generateFilingCombinations()
```

---

# GOAL

自動產生：

```text
所有合法申報組合
```

---

# IMPORTANT

不是：

```text
所有排列組合
```

需考慮：

- 相依關係
- 扶養規則
- 重複扶養禁止

---

# Required Output Example

```js
[
  ["A"],
  ["A", "B"],
  ["A", "B", "C"],
  ["A", "D"],
]
```

---

# TASK 8 — Combination Tax Simulator

建立：

```js
simulateCombinationTax()
```

---

# GOAL

對每個組合：

計算：

- taxable income
- deductions
- tax bracket
- payable tax
- refund

---

# Required Return

```js
{
  combinationId,
  members,
  taxBracket,
  payableTax,
  refundAmount,
  effectiveRate
}
```

---

# TASK 9 — Bracket Analysis

新增：

```text
稅率級距分析
```

---

# Required Display

```text
5%
12%
20%
30%
40%
```

---

# Required UX

每個組合：

需顯示：

```text
落入哪個級距
```

---

# TASK 10 — Combination Ranking Engine

建立：

```js
rankCombinationResults()
```

---

# Required Sort Priority

---

## Priority 1

最低稅負

---

## Priority 2

最高退稅

---

## Priority 3

最低有效稅率

---

# Required Result

```text
最佳方案
次佳方案
高稅負方案
```

---

# TASK 11 — Combination Result Table

新增：

```text
全組合比較表
```

---

# Required Example

```text
組合 A+B+C
稅率級距 5%
應退稅 12000 元
```

---

# Additional Examples

```text
組合 A
稅率級距 12%
應補稅 18000 元
```

---

# Required Columns

---

## Combination

```text
申報組合
```

---

## Tax Bracket

```text
稅率級距
```

---

## Taxable Income

```text
課稅所得
```

---

## Payable / Refund

```text
應補稅 / 退稅
```

---

## Effective Tax Rate

```text
有效稅率
```

---

## Recommendation

```text
是否推薦
```

---

# TASK 12 — Best Combination Recommendation

新增：

```text
最佳申報建議
```

---

# Required Analysis

---

## Example A

```text
納入父母扶養後，
可降至 5% 稅率級距。
```

---

## Example B

```text
配偶分開申報較有利。
```

---

## Example C

```text
加入祖母扶養後，
標準扣除額效益提高。
```

---

# IMPORTANT

analysis：

- 不可修改 calculation
- 不可耦合 renderer
- 必須 pure analysis

---

# TASK 13 — Combination Explosion Protection

避免：

```text
組合爆炸
```

---

# Required Rule

若：

```text
member count > 10
```

採：

```text
incremental pruning
```

---

# Suggested Strategy

優先排除：

```text
不合法組合
```

再試算。

---

# TASK 14 — UIUX Upgrade

新增：

```text
家庭申報最佳化
```

專區。

---

# Required Sections

---

## Member Management

```text
家庭成員資料
```

---

## Combination Results

```text
全組合試算
```

---

## Recommendation

```text
最佳方案分析
```

---

# Required UX

避免：

```text
巨大表格直接爆炸
```

---

# Suggested UX

- filter
- sorting
- collapsible sections

---

# TASK 15 — Table Optimization

目前結果 renderer：

偏 panel。

本功能需新增：

```text
真正 data table
```

---

# Required Features

---

## Sort

依：

- 稅負
- 退稅
- 稅率

排序。

---

## Highlight

最佳方案：

```text
highlight row
```

---

## Responsive

mobile：

```text
horizontal scroll
```

---

# TASK 16 — Regression Protection

確認：

以下不得崩潰：

- mortgage deduction
- dividend taxation
- savings deduction
- validation-engine
- refund flow

---

# TASK 17 — Test Scenarios

---

## Case A

```text
A 單獨申報
```

Expected：

```text
12% 稅率
```

---

## Case B

```text
A+B+C
```

Expected：

```text
5% 稅率
```

---

## Case C

```text
A+D
```

Expected：

```text
退稅增加
```

---

## Case D

```text
加入祖母扶養
```

Expected：

```text
扣除額增加
```

---

## Case E

```text
auto optimization
```

Expected：

```text
最佳方案排名正確
```

---

# FORBIDDEN PATTERNS

禁止：

- brute force UI freeze
- renderer business logic coupling
- duplicated tax calculation
- hardcoded family structure
- framework migration
- backend dependency

---

# SUCCESS CRITERIA

完成後：

---

## Functional

以下成立：

- 可預估明年所得稅
- 可試算所有家庭組合
- 可分析稅率級距
- 可比較退稅 / 補稅
- 可自動推薦最佳方案

---

## UX

使用者可理解：

- 哪種申報最有利
- 為何稅率下降
- 為何退稅增加
- 哪個家庭組合最佳

---

## Architecture

維持：

- Vanilla JS
- deterministic calculation flow
- pure function calculation
- file:// compatibility
- GitHub Pages compatibility

---

## Performance

家庭組合：

不可造成：

```text
UI freeze
```

---

## Regression

既有：

- deduction logic
- mortgage calculation
- dividend taxation
- validation
- renderer

不得崩潰。
