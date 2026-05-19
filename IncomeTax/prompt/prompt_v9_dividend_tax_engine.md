# 台灣綜所稅工具 — 股利所得 / 股息退稅 / 股利課稅制度 Prompt v9

目前專案：

已完成：

- 基本所得
- 扣除額
- 房貸 deduction dependency
- 利息所得
- 儲蓄投資特別扣除額

下一階段：

建立：

```text
dividend taxation engine
```

目標：

讓專案開始支援：

```text
台灣股利所得制度
```

包含：

- 股利所得
- 股利可抵減稅額
- 合併計稅
- 分離課稅
- 退稅 calculation
- 最佳方案比較

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
- async conversion
- SPA migration

採：

```text
incremental deterministic extension
```

---

# CURRENT ARCHITECTURE

目前 calculation flow：

```text
UI Input
→ tax-engine
→ deduction-engine
→ result renderer
```

不得重建。

僅允許：

```text
incremental extension
```

---

# TASK 1 — Dividend Income Schema

新增：

```js
dividendIncome
```

---

# Required Default

```js
dividendIncome: 0
```

---

# Additional Schema

新增：

```js
dividendTaxMode
```

---

# Allowed Values

```text
combined
separate
auto
```

---

# Recommended Default

```js
dividendTaxMode: "auto"
```

---

# TASK 2 — UI Extension

新增：

---

## Dividend Input

```text
股利所得
```

---

## Tax Mode Selector

```text
股利課稅方式
```

---

# Required Options

```text
自動最佳化
合併計稅
分離課稅
```

---

# Recommended UI

```html
<select>
```

---

# UX Rule

不要讓：

```text
股利設定散落
```

應集中於：

```text
投資所得區塊
```

---

# TASK 3 — Dividend Tax Credit Engine

建立：

```js
calculateDividendTaxCredit()
```

---

# Taiwan Rule

合併計稅時：

```text
股利所得 × 8.5%
```

---

# Maximum

```text
80000
```

---

# Required Formula

```js
Math.min(dividendIncome * 0.085, 80000)
```

---

# IMPORTANT

僅：

```text
combined mode
```

適用。

---

# Required Function

```js
function calculateDividendTaxCredit(
  dividendIncome,
  dividendTaxMode
) {
  if (dividendTaxMode !== "combined") {
    return 0;
  }

  return Math.min(
    (Number(dividendIncome || 0) * 0.085),
    80000
  );
}
```

---

# TASK 4 — Separate Taxation Engine

建立：

```js
calculateSeparateDividendTax()
```

---

# Taiwan Rule

分離課稅：

```text
28%
```

---

# Required Formula

```js
dividendIncome * 0.28
```

---

# Required Logic

分離課稅時：

```text
股利所得
不得進入綜合所得總額
```

---

# IMPORTANT

這是：

```text
critical dependency rule
```

---

# TASK 5 — Combined Taxation Integration

合併計稅時：

---

## Rule 1

股利所得：

必須加入：

```text
綜合所得總額
```

---

## Rule 2

股利抵減：

必須加入：

```text
tax credit
```

---

# Required Flow

```text
salary
+ interest
+ dividend
→ taxable income
→ tax
→ dividend tax credit
→ final payable tax
```

---

# TASK 6 — Refund Flow

目前專案：

大概率只有：

```text
應納稅額
```

需要新增：

```text
退稅 flow
```

---

# Required Rule

若：

```text
tax credit > payable tax
```

則：

```text
refund = abs(...)
```

---

# Required Output

新增：

```text
應補稅
退稅金額
```

---

# Required Logic

---

## Case A

```text
finalTax > 0
```

顯示：

```text
應納稅額
```

---

## Case B

```text
finalTax < 0
```

顯示：

```text
退稅金額
```

---

# IMPORTANT

不要：

```text
直接顯示負數稅額
```

---

# TASK 7 — Auto Optimization Mode

建立：

```text
auto mode
```

---

# Required Logic

自動比較：

---

## Combined

```text
綜合計稅結果
```

---

## Separate

```text
分離課稅結果
```

---

# Required Rule

選擇：

```text
稅負較低
```

方案。

---

# Required Return

```js
{
  selectedMode,
  combinedResult,
  separateResult
}
```

---

# IMPORTANT

這是：

```text
核心 UX feature
```

---

# TASK 8 — Dividend Analysis Engine

新增：

```text
股利分析
```

---

# Required Messages

---

## Combined Better

```text
合併計稅較有利，
已套用股利抵減稅額。
```

---

## Separate Better

```text
分離課稅較有利，
已採用 28% 單一稅率。
```

---

## Refund

```text
因股利可抵減稅額，
本年度可能產生退稅。
```

---

# IMPORTANT

analysis：

- 不可修改 calculation
- 不可耦合 validation
- pure analysis pipeline

---

# TASK 9 — Result Renderer Upgrade

新增：

---

## Display

```text
股利所得
股利課稅方式
股利可抵減稅額
分離課稅稅額
退稅金額
```

---

# Additional Rule

結果頁：

必須明確顯示：

```text
目前採用方案
```

---

# Example

```text
股利課稅方式：合併計稅（較有利）
```

---

# TASK 10 — Validation

validation-engine.js：

新增：

---

## Validation A

若：

```text
股利所得 > 0
```

但：

```text
未選擇課稅方式
```

顯示：

```text
請選擇股利課稅方式
```

---

## Validation B

若：

```text
dividendIncome < 0
```

顯示：

```text
股利所得不可為負數
```

---

# TASK 11 — Dependency Stabilization

建立：

```text
dividend dependency orchestration
```

---

# Required Rule

禁止：

```text
股利 calculation scattered
```

---

# Required Central Flow

```text
dividend income
→ taxation mode
→ credit/separate tax
→ final tax
→ refund/payable
```

---

# Required Function

```js
applyDividendTaxStrategy()
```

---

# Suggested Structure

```js
function applyDividendTaxStrategy(data) {
  // combined
  // separate
  // auto comparison
}
```

---

# TASK 12 — Result Tax State Refactor

目前：

大概率只有：

```text
tax payable
```

需改為：

---

# Required Structure

```js
{
  payableTax,
  refundAmount,
  finalTaxState
}
```

---

# Allowed Values

```text
payable
refund
neutral
```

---

# TASK 13 — UIUX Improvement

股利功能新增後：

避免：

```text
form explosion
```

---

# Required Rule

建立：

```text
投資所得區塊
```

集中：

- 利息所得
- 股利所得
- 股利課稅方式

---

# TASK 14 — Regression Protection

確認：

---

## Existing Features

以下不得崩潰：

- 房貸 deduction
- 儲蓄投資特別扣除額
- validation-engine
- result renderer
- tax calculation

---

## Existing Cases

舊資料：

```text
無股利資料
```

必須：

```text
正常運作
```

---

# TASK 15 — Test Scenarios

---

## Case A — Small Dividend Refund

```text
股利所得：50000
合併計稅
```

Expected：

```text
股利抵減：4250
可能退稅
```

---

## Case B — Large Dividend Cap

```text
股利所得：2000000
```

Expected：

```text
股利抵減上限：80000
```

---

## Case C — Separate Better

高所得案例：

```text
自動模式
```

Expected：

```text
選擇分離課稅
```

---

## Case D — Combined Better

低所得案例：

```text
自動模式
```

Expected：

```text
選擇合併計稅
```

---

## Case E — No Dividend

```text
股利所得：0
```

Expected：

```text
不影響既有 calculation
```

---

# FORBIDDEN PATTERNS

禁止：

- rewrite tax-engine
- framework migration
- state management redesign
- duplicated tax logic
- scattered dividend calculation
- renderer business logic coupling

---

# SUCCESS CRITERIA

完成後：

---

## Functional

以下成立：

- 股利所得可計算
- 合併 / 分離課稅正常
- 股利抵減正常
- auto optimization 正常
- 退稅 calculation 正常
- result renderer 正常

---

## Architectural

維持：

- Vanilla JS
- deterministic calculation flow
- pure function calculation
- file:// compatibility
- GitHub Pages compatibility

---

## UX

使用者可理解：

- 為何退稅
- 為何選擇合併或分離
- 哪個方案較有利

---

## Regression

既有：

- deduction logic
- validation
- mortgage deduction
- savings deduction

不得崩潰。
