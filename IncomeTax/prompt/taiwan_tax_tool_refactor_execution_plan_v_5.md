# 台灣綜所稅工具 — Deterministic Refactor Execution Plan

來源 SPEC：fileciteturn0file0

---

# EXECUTION OVERVIEW

本次修正目標：

在不重建專案、不引入 framework、不破壞既有 GitHub Pages / file:// 相容性的前提下，對現有台灣綜所稅工具進行：

- 利息所得支援
- 儲蓄投資特別扣除額
- 房貸利息列舉扣除額修正
- deduction dependency system
- validation engine
- 結果頁升級
- 節稅分析補強

本次採用：

```text
incremental deterministic refactor
```

禁止：

- rewrite
- framework migration
- state management redesign
- UI system replacement
- build tooling introduction

---

# STABLE CORE PRESERVATION

以下既有架構需維持：

## Runtime

- 純 HTML
- 純 CSS
- Vanilla JS
- 無 npm
- 無 bundler
- 無 transpiler

## Compatibility

必須維持：

- GitHub Pages compatible
- file:// compatible

## Existing Calculation Flow

現有：

```text
UI Input
→ tax-engine
→ deduction-engine
→ result renderer
```

不得整體重寫。

僅允許：

```text
incremental extension
```

---

# REFACTOR BOUNDARIES

## Allowed Changes

### UI Layer

允許新增：

- 利息所得欄位
- 房貸相關欄位
- validation message area
- deduction breakdown section

---

### Engine Layer

允許新增：

- calculateSavingsDeduction()
- calculateMortgageDeduction()
- applyDeductionDependencies()
- validateMutualExclusion()

---

### Validation Layer

允許新增：

```text
validation-engine.js
```

作為獨立模組。

---

### Data Schema

允許擴充：

```json
{
  "interestIncome": 0,
  "mortgageInterestExpense": 0,
  "isOwnerOccupied": false,
  "isRegisteredResidence": false,
  "isRentalProperty": false
}
```

以及：

```json
{
  "deductions": {
    "savings": {
      "limit": 270000
    },
    "mortgageInterest": {
      "limit": 300000
    }
  }
}
```

---

## Forbidden Changes

禁止：

- 全域 rename
- massive file movement
- architecture rewrite
- async conversion
- class-based migration
- SPA migration
- dependency injection redesign

---

# PHASE PLAN

# Phase 1 — Data Schema Expansion

## Objective

建立新的 deduction 與 income schema。

---

## Tasks

### Task 1.1

新增：

```js
interestIncome
```

---

### Task 1.2

新增房貸相關欄位：

```js
isOwnerOccupied
isRegisteredResidence
isRentalProperty
mortgageInterestExpense
```

---

### Task 1.3

新增 deduction limits：

```js
const DEDUCTION_LIMITS = {
  savings: 270000,
  mortgageInterest: 300000
};
```

---

## Validation Checkpoint

確認：

- 舊資料不會 crash
- 未填新欄位時仍可正常計算
- undefined fallback 存在

---

# Phase 2 — UI Incremental Extension

## Objective

新增利息所得與房貸欄位。

---

## Tasks

### Task 2.1 — 利息所得 UI

新增：

```text
利息所得
```

可採：

```text
單一 consolidated input
```

避免過度複雜 UI。

---

### Task 2.2 — 房貸欄位 UI

新增：

```text
是否自用住宅
是否設戶籍
是否出租
房貸利息支出
```

建議：

```text
checkbox + number input
```

---

### Task 2.3 — Validation Area

建立：

```html
<div id="validation-messages"></div>
```

---

## Validation Checkpoint

確認：

- 舊欄位事件不受影響
- form serialization 正常
- 空值不會 NaN

---

# Phase 3 — Savings Deduction Engine

## Objective

建立：

```js
calculateSavingsDeduction()
```

---

## Logic

```js
function calculateSavingsDeduction(interestIncome) {
  return Math.min(interestIncome || 0, 270000);
}
```

---

## Integration

加入 deduction pipeline：

```text
interestIncome
→ calculateSavingsDeduction
→ deduction breakdown
```

---

## Validation Checkpoint

測試：

| 利息所得 | 預期扣除 |
|---|---|
| 0 | 0 |
| 100000 | 100000 |
| 270000 | 270000 |
| 500000 | 270000 |

---

# Phase 4 — Mortgage Deduction Refactor

## Objective

修正房貸利息列舉扣除額。

---

## Required Function

```js
calculateMortgageDeduction()
```

---

## Required Rules

### Rule 1 — 自用住宅

若：

```text
isRentalProperty === true
```

則：

```js
return 0;
```

---

### Rule 2 — 必須設戶籍

若：

```text
isRegisteredResidence === false
```

則：

```js
return 0;
```

---

### Rule 3 — 儲蓄投資特別扣除額依賴

公式：

```text
mortgageDeduction =
mortgageInterestExpense - savingsDeduction
```

---

### Rule 4 — 不得小於 0

```js
Math.max(0, value)
```

---

### Rule 5 — 上限 300000

```js
Math.min(value, 300000)
```

---

## Recommended Implementation

```js
function calculateMortgageDeduction(data) {
  if (!data.isOwnerOccupied) return 0;
  if (!data.isRegisteredResidence) return 0;
  if (data.isRentalProperty) return 0;

  const savingsDeduction = calculateSavingsDeduction(
    data.interestIncome
  );

  const rawDeduction =
    (data.mortgageInterestExpense || 0) - savingsDeduction;

  return Math.min(
    Math.max(0, rawDeduction),
    300000
  );
}
```

---

## Validation Checkpoint

### Case A

```text
利息所得：150000
房貸利息：280000
```

Expected:

```text
130000
```

---

### Case B

```text
房貸：200000
利息所得：300000
```

Expected:

```text
0
```

---

### Case C

```text
出租=true
```

Expected:

```text
0
```

---

# Phase 5 — Deduction Dependency System

## Objective

建立 deduction dependency orchestration。

---

## Required Function

```js
applyDeductionDependencies()
```

---

## Responsibility

建立 deduction execution order。

---

## Recommended Flow

```text
interestIncome
→ savings deduction
→ mortgage deduction
→ deduction summary
```

---

## Recommended Structure

```js
function applyDeductionDependencies(data) {
  const savingsDeduction =
    calculateSavingsDeduction(data.interestIncome);

  const mortgageDeduction =
    calculateMortgageDeduction({
      ...data,
      savingsDeduction
    });

  return {
    savingsDeduction,
    mortgageDeduction
  };
}
```

---

## Validation Checkpoint

確認：

- mortgage deduction 不再獨立運算
- dependency order 固定
- deduction recalculation deterministic

---

# Phase 6 — Mutual Exclusion Validation

## Objective

避免房租與房貸異常同時適用。

---

## Required Function

```js
validateMutualExclusion()
```

---

## Recommended Logic

```js
function validateMutualExclusion(data) {
  const warnings = [];

  if (
    data.hasRentDeduction &&
    data.mortgageInterestExpense > 0
  ) {
    warnings.push('可能不可同時適用');
  }

  return warnings;
}
```

---

## Validation Checkpoint

確認：

- 僅 warning
- 不阻止 calculation
- 不影響其他 deduction

---

# Phase 7 — validation-engine.js

## Objective

將 validation 與 tax calculation 分離。

---

## New File

```text
validation-engine.js
```

---

## Responsibilities

### Mortgage Validation

```text
購屋借款利息需為自用住宅
```

---

### Rental Conflict Validation

```text
可能不可同時適用
```

---

### Savings Deduction Validation

```text
超過儲蓄投資特別扣除額上限
```

---

## Recommended API

```js
function validateTaxInputs(data) {
  return {
    errors: [],
    warnings: []
  };
}
```

---

## Validation Checkpoint

確認：

- validation 不修改 state
- validation 不直接 render UI
- pure function architecture 維持

---

# Phase 8 — Result Page Upgrade

## Objective

擴充 deduction breakdown。

---

## Required Display

新增：

```text
利息所得
儲蓄投資特別扣除額
房貸利息扣除額
```

---

## Additional Requirement

顯示：

```text
實際可扣金額
```

---

## Recommended Breakdown Structure

```text
利息所得：150000
儲蓄投資特別扣除額：150000
房貸利息支出：280000
房貸利息實際可扣：130000
```

---

## Validation Checkpoint

確認：

- breakdown 數值一致
- deduction dependency 可視化
- UI 不出現負數

---

# Phase 9 — Tax Saving Analysis

## Objective

新增 deduction interaction explanation。

---

## Required Message

```text
因已有儲蓄投資特別扣除額，
房貸利息扣除額將減少。
```

---

## Trigger Condition

```js
if (
  savingsDeduction > 0 &&
  mortgageInterestExpense > 0
)
```

---

## Validation Checkpoint

確認：

- message 僅於 relevant case 出現
- 不影響 calculation
- 不與 validation 混用

---

# TASK GRAPH

```text
Phase 1
  ↓
Phase 2
  ↓
Phase 3
  ↓
Phase 4
  ↓
Phase 5
  ↓
Phase 6
  ↓
Phase 7
  ↓
Phase 8
  ↓
Phase 9
```

---

# MIGRATION STRATEGY

## Strategy Type

```text
incremental compatibility-safe migration
```

---

## Migration Rules

### Rule 1

先新增 schema。

不要先修改 calculation。

---

### Rule 2

先建立新 function。

不要直接覆蓋舊 function。

---

### Rule 3

最後才切換 integration path。

避免中途 calculation 崩潰。

---

## Compatibility Bridge

建立 fallback：

```js
const interestIncome = data.interestIncome || 0;
```

避免舊資料失效。

---

# VALIDATION CHECKPOINTS

## Core Validation

### Checkpoint A

舊案例結果不可變。

---

### Checkpoint B

新 deduction 不得產生：

```text
NaN
Infinity
negative deduction
```

---

### Checkpoint C

file:// 必須正常。

不得使用：

```text
fetch()
module import
server dependency
```

---

### Checkpoint D

所有 deduction function 必須：

```text
pure function
```

---

# COMPATIBILITY BRIDGES

## Existing Result Renderer

若 renderer 尚未支援新欄位：

採：

```js
if (result.savingsDeduction != null)
```

避免 undefined rendering。

---

## Existing Tax Pipeline

允許：

```js
legacy calculation
+ extended deductions
```

短期共存。

---

# RISK ANALYSIS

## Risk 1 — Deduction Order Bug

### Description

房貸 deduction 依賴 savings deduction。

若 execution order 錯誤：

```text
房貸扣除額會過高
```

---

### Mitigation

統一透過：

```js
applyDeductionDependencies()
```

執行。

---

## Risk 2 — Negative Deduction

### Description

```text
房貸利息 < 儲蓄扣除額
```

可能產生負數。

---

### Mitigation

強制：

```js
Math.max(0, value)
```

---

## Risk 3 — UI Regression

### Description

新增欄位可能破壞既有 layout。

---

### Mitigation

採：

```text
incremental form section
```

不要重排整體 UI。

---

## Risk 4 — Validation Coupling

### Description

validation 與 calculation 混雜。

---

### Mitigation

獨立：

```text
validation-engine.js
```

---

# ROLLBACK STRATEGY

## Safe Rollback Boundary

每個 phase 必須可獨立 rollback。

---

## Rollback Method

### UI

僅移除新增欄位。

---

### Engine

保留舊 calculation path。

---

### Validation

validation-engine.js 可完全拔除。

---

## Critical Rule

不要在單一 commit 同時：

```text
修改 UI
+ 修改 engine
+ 修改 renderer
```

應拆分。

---

# EXECUTION CONSTRAINTS

## Constraint 1

不得重建專案。

---

## Constraint 2

不得導入 framework。

---

## Constraint 3

不得破壞：

```text
file:// compatibility
```

---

## Constraint 4

不得將 deduction logic scattered。

需集中於：

```text
deduction-engine
```

---

## Constraint 5

validation 與 calculation 必須分離。

---

# SUCCESS CRITERIA

## Functional Success

以下功能完成：

- 利息所得
- 儲蓄投資特別扣除額
- 房貸利息列舉扣除額
- deduction dependency
- validation warnings
- 結果頁 breakdown
- 節稅分析

---

## Architectural Success

以下維持：

- Vanilla JS
- GitHub Pages compatibility
- file:// compatibility
- deterministic calculation flow
- pure function deduction engine

---

## Regression Success

既有：

- tax calculation
- UI flow
- result rendering

不得崩潰。

