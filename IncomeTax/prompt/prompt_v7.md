# 台灣綜所稅工具 — UX Recovery / Layout Stabilization Prompt v7

目前功能大致完成。

本次只處理：

```text
UI / UX recovery
layout optimization
interaction stabilization
responsive refinement
```

禁止：

- rewrite
- framework migration
- state redesign
- router introduction
- SPA migration

維持：

- Vanilla JS
- file:// compatibility
- GitHub Pages compatibility

---

# CURRENT UX ISSUES

目前存在：

---

## Issue 1 — 畫面左右空白過大

目前：

```css
.workspace-shell
```

使用：

```css
4-column grid
```

造成：

- 中央內容過窄
- 左右留白過多
- 表單閱讀壓縮
- 操作距離過長

尤其：

```text
1440px 大螢幕
```

下更明顯。

---

## Issue 2 — 展開按鈕可開不可收

目前：

```js
toggleYearData()
```

存在 interaction bug。

---

## Current Logic

目前：

```js
button.textContent = isOpen ? "展開" : "收合";
content.hidden = isOpen;
```

但實際：

- 展開後 UI state 不同步
- button state 與 hidden state 漂移
- interaction 不穩定

需修正。

---

## Issue 3 — Sticky panel 過多

目前：

```css
.household-panel
.tax-knowledge-panel
```

大量 sticky。

造成：

- 視覺壓迫
- mobile scroll awkward
- desktop layout fragmentation

---

## Issue 4 — 資訊密度不平衡

目前：

- 表單區太窄
- 結果區太散
- 側欄利用率低

---

# TASK 1 — Workspace Layout Recovery

重新調整：

```css
.workspace-shell
```

---

# Current

```css
grid-template-columns:
minmax(190px, 0.7fr)
minmax(360px, 1.25fr)
minmax(420px, 1.5fr)
minmax(220px, 0.85fr);
```

---

# Required Change

改為：

```css
grid-template-columns:
minmax(320px, 1fr)
minmax(420px, 1.2fr);
```

---

# Layout Goal

讓：

```text
左邊 = 表單
右邊 = 結果 / 分析
```

形成：

```text
2-column productivity layout
```

---

# Additional Rule

以下 panel：

```text
scenario-analysis-panel
tax-knowledge-panel
```

改為：

```text
full width section
```

放到底部。

不要佔右側欄。

---

# TASK 2 — Reduce Empty Space

目前：

```css
width: min(1440px, calc(100% - 32px));
```

造成 ultra-wide 空白過多。

---

# Required Change

改為：

```css
width: min(1680px, calc(100% - 32px));
```

---

# Additional Rule

主表單：

```css
.tax-form
```

改為：

```css
grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
```

避免：

- 欄位太窄
- 大量空白
- desktop 壓縮感

---

# TASK 3 — Expand / Collapse Stabilization

修正：

```js
toggleYearData()
```

---

# Required Logic

必須以：

```js
content.hidden
```

作為 canonical truth。

不要依賴 button text。

---

# Required Implementation

```js
function toggleYearData() {
  const button = document.getElementById("yearDataToggle");
  const content = document.getElementById("yearDataContent");

  if (!button || !content) {
    return;
  }

  const nextHiddenState = !content.hidden;

  content.hidden = nextHiddenState;

  const expanded = !nextHiddenState;

  button.setAttribute(
    "aria-expanded",
    String(expanded)
  );

  button.textContent =
    expanded ? "收合" : "展開";
}
```

---

# Additional Requirement

初始化時：

```js
aria-expanded
hidden
button text
```

必須同步。

---

# TASK 4 — Sticky Panel Reduction

目前 sticky 太多。

---

# Required Rule

僅保留：

```text
單一 sticky panel
```

建議：

```text
result summary
```

---

# Required Change

移除：

```css
position: sticky;
```

於：

```css
.tax-knowledge-panel
.household-panel
```

---

# UX Goal

改善：

- scrolling continuity
- visual fragmentation
- mobile awkwardness

---

# TASK 5 — Mobile UX Refinement

目前 mobile 已可用。

但 spacing 不佳。

---

# Required Changes

---

## Form Gap

```css
.tax-form {
  gap: 14px;
}
```

---

## Panel Padding

mobile：

```css
.panel {
  padding: 16px;
}
```

---

## Header Compression

mobile：

```css
.site-header {
  padding: 20px 0 12px;
}
```

---

# TASK 6 — Result Panel Readability

改善 deduction breakdown。

---

# Required Rule

結果區：

不要全部純文字。

增加：

```text
visual grouping
```

---

# Suggested Structure

```text
所得
扣除額
應納稅額
有效節稅
```

分段。

---

# Additional Rule

重要數字：

```css
font-size
font-weight
```

提高。

---

# TASK 7 — Interaction Polish

新增：

---

## Hover Transition

```css
transition:
background-color 120ms ease,
border-color 120ms ease,
transform 120ms ease;
```

---

## Button Hover

```css
button:hover {
  transform: translateY(-1px);
}
```

---

## Input Focus

```css
input:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
}
```

---

# TASK 8 — Visual Hierarchy Recovery

目前：

所有 panel 視覺層級接近。

---

# Required Change

建立：

```text
primary
secondary
supporting
```

hierarchy。

---

# Suggested Priority

---

## Primary

- 稅額結果
- 節稅結果

---

## Secondary

- deduction breakdown
- validation warning

---

## Supporting

- tax knowledge
- scenario analysis

---

# TASK 9 — Forbidden Recovery Patterns

禁止：

- redesign UI system
- Tailwind migration
- Bootstrap introduction
- React/Vue migration
- CSS framework introduction
- animation library
- canvas rendering
- modal-heavy redesign

---

# SUCCESS CRITERIA

完成後：

---

## UX

- 不再有大量左右空白
- 表單更容易閱讀
- 操作距離縮短
- desktop 利用率提升
- mobile scroll 更自然

---

## Interaction

- 展開/收合完全正常
- aria-expanded 同步
- hidden state 穩定

---

## Architecture

維持：

- Vanilla JS
- deterministic UI flow
- file:// compatibility
- GitHub Pages compatibility

---

## Regression

既有：

- tax calculation
- deduction flow
- validation
- renderer

不得崩潰。
