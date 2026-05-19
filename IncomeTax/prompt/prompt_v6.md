# 台灣綜所稅工具 — Remaining Recovery Tasks Prompt v6

來源：

- prompt_v5.md
- deterministic refactor execution plan v5
- existing implementation audit

---

# CURRENT STATUS

目前以下功能已大致完成：

- 利息所得
- 儲蓄投資特別扣除額
- 房貸利息列舉扣除額
- deduction dependency
- validation-engine
- result breakdown
- mutual exclusion validation

目前階段：

```text
integration refinement phase
```

本次目標：

只處理剩餘 integration / normalization / stabilization 工作。

禁止：

- rewrite
- framework migration
- architecture redesign
- state management replacement
- massive rename
- directory restructure

維持：

- Vanilla JS
- GitHub Pages compatibility
- file:// compatibility

---

# TASK 1 — Schema Naming Compatibility Bridge

目前 schema naming 存在 drift。

---

# Current Existing Names

目前 code 使用：

```js
mortgageInterest
isSelfUseResidence
hasHouseholdRegistration
isRented
```

---

# Target Canonical Names

希望逐步收斂為：

```js
mortgageInterestExpense
isOwnerOccupied
isRegisteredResidence
isRentalProperty
```

---

# IMPORTANT

不要直接 global rename。

不要一次改全專案。

---

# Required Strategy

建立：

```js
normalizeMortgageSchema()
```

---

# Example

```js
function normalizeMortgageSchema(data) {
  return {
    ...data,

    mortgageInterestExpense:
      data.mortgageInterestExpense ??
      data.mortgageInterest ??
      0,

    isOwnerOccupied:
      data.isOwnerOccupied ??
      data.isSelfUseResidence ??
      false,

    isRegisteredResidence:
      data.isRegisteredResidence ??
      data.hasHouseholdRegistration ??
      false,

    isRentalProperty:
      data.isRentalProperty ??
      data.isRented ??
      false
  };
}
```

---

# Integration Rule

所有 deduction calculation：

先 normalize。

---

# Required Integration

以下 function：

```js
calculateMortgageDeduction()
applyDeductionDependencies()
validateTaxInputs()
```

都必須使用 normalized schema。

---

# Validation Goal

避免：

```text
schema drift
prompt mismatch
future orchestration ambiguity
```

---

# TASK 2 — Result Breakdown Upgrade

目前結果頁：

缺少：

```text
房貸利息支出
實際可扣金額
```

---

# Required UI Upgrade

結果頁需顯示：

```text
利息所得：150000
儲蓄投資特別扣除額：150000

房貸利息支出：280000
房貸利息實際可扣：130000
```

---

# Important Rule

不要只顯示：

```text
房貸利息扣除額：130000
```

因為 deduction dependency 不夠明顯。

---

# Rendering Constraint

不要重寫 renderer。

採 incremental rendering extension。

---

# Suggested Pattern

```js
if (result.mortgageInterestExpense > 0) {
  // append breakdown row
}
```

---

# TASK 3 — Tax Saving Analysis Integration

目前 analysis pipeline 未確認完整。

需補強。

---

# Required Analysis Message

當：

```js
savingsDeduction > 0 &&
mortgageInterestExpense > 0
```

顯示：

```text
因已有儲蓄投資特別扣除額，
房貸利息扣除額將減少。
```

---

# Additional Suggested Message

若：

```js
mortgageDeduction === 0 &&
savingsDeduction > 0
```

顯示：

```text
儲蓄投資特別扣除額已抵減房貸利息扣除空間。
```

---

# Integration Constraint

analysis：

- 不可修改 calculation
- 不可耦合 validation
- 不可直接讀 DOM

保持：

```text
pure analysis pipeline
```

---

# TASK 4 — Validation Consistency Stabilization

目前 validation 已存在。

但需統一 normalize schema。

---

# Required Rule

validation-engine.js：

所有 validation：

先執行：

```js
normalizeMortgageSchema()
```

---

# Required Validations

確認以下仍存在：

---

## Validation A

```text
購屋借款利息需為自用住宅
```

---

## Validation B

```text
需設立戶籍才可適用購屋借款利息列舉扣除額
```

---

## Validation C

```text
出租住宅不可適用購屋借款利息列舉扣除額
```

---

## Validation D

```text
可能不可同時適用
```

---

## Validation E

```text
超過儲蓄投資特別扣除額上限
```

---

# TASK 5 — Deterministic Dependency Enforcement

目前 deduction dependency 已存在。

需強化 deterministic flow。

---

# Required Rule

禁止：

```text
mortgage deduction independently calculated
```

---

# Required Structure

所有 deduction summary：

必須透過：

```js
applyDeductionDependencies()
```

產生。

---

# Forbidden Pattern

禁止：

```js
calculateMortgageDeduction(data)
```

直接在 renderer 或 UI event 中單獨呼叫。

---

# TASK 6 — Defensive Fallback Stabilization

新增 defensive fallback。

避免：

```text
NaN
undefined
negative deduction
```

---

# Required Rule

所有 deduction input：

使用：

```js
Number(value || 0)
```

---

# Required Rule

所有 deduction output：

保證：

```js
Number.isFinite(value)
```

---

# Required Rule

renderer：

避免：

```text
undefined rendering
NaN rendering
```

---

# TASK 7 — Regression Safety Verification

新增 lightweight regression verification。

---

# Required Cases

---

## Case A

```text
利息所得：150000
房貸利息：280000
```

Expected：

```text
房貸可扣：130000
```

---

## Case B

```text
利息所得：300000
房貸利息：200000
```

Expected：

```text
房貸可扣：0
```

---

## Case C

```text
出租=true
```

Expected：

```text
房貸可扣：0
```

---

## Case D

```text
未設戶籍
```

Expected：

```text
房貸可扣：0
```

---

## Case E

```text
純舊資料 schema
```

Expected：

```text
不 crash
```

---

# TASK 8 — Forbidden Recovery Patterns

禁止：

- rewrite renderer
- migrate to framework
- async conversion
- event system redesign
- state management rewrite
- SPA migration
- ES module migration
- npm tooling introduction

---

# EXECUTION PRIORITY

依序執行：

```text
1. normalizeMortgageSchema
2. dependency stabilization
3. validation normalization
4. renderer upgrade
5. analysis integration
6. regression verification
```

---

# SUCCESS CRITERIA

完成後：

以下需成立：

---

## Functional

- analysis message 正常顯示
- result breakdown 更完整
- schema drift 降低
- deduction dependency 完全固定
- validation consistency 完成

---

## Architectural

維持：

- Vanilla JS
- deterministic flow
- pure function calculation
- file:// compatibility
- GitHub Pages compatibility

---

## Regression

既有：

- tax calculation
- deduction flow
- UI rendering

不得崩潰。
