# 台灣綜所稅工具 — Full UIUX Recovery Prompt v8

目前功能已接近完整。

本次不要再做 tax logic。

只專注：

```text
serious UIUX recovery
layout rebalance
information architecture
desktop optimization
interaction ergonomics
```

目前問題：

```text
畫面仍像 prototype
```

尤其：

- 上方右邊大面積空白
- layout density 不平衡
- form / result separation 不夠明確
- desktop 空間浪費
- panels 太像 dashboard widget
- 視覺重心不穩
- 資訊層級不夠

本次目標：

讓 UI 更像：

```text
production-grade productivity web app
```

不是：

```text
experimental dashboard
```

---

# CRITICAL UX ISSUE

目前：

```css
.site-header
```

使用：

```css
display: flex;
justify-content: space-between;
align-items: start;
```

但右側只有：

```text
theme toggle
```

導致：

```text
header 右半部完全空白
```

這是目前最大 UX 問題。

---

# TASK 1 — Header Architecture Redesign

不要再保留：

```text
左邊 title
右邊 theme button
```

模式。

---

# Required New Layout

Header 改為：

```text
top intro block
+
toolbar row
```

---

# Suggested Structure

```text
[ Title ]
[ Description ]

[ Theme Toggle | Year Selector | Expand Button ]
```

---

# Required CSS

```css
.site-header {
  display: grid;
  gap: 18px;
}
```

---

# Toolbar

新增：

```css
.header-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
```

---

# UX Goal

讓：

- header 不再右側空白
- controls 集中
- desktop 空間被利用
- interaction 更自然

---

# TASK 2 — True App Layout

目前：

```text
2-column
```

仍太鬆散。

需改成：

```text
application workspace layout
```

---

# Required Layout

Desktop：

```text
左側：
輸入表單

右側：
結果
分析
建議
```

形成：

```text
control panel + insight panel
```

---

# Required CSS

```css
.workspace-shell {
  display: grid;

  grid-template-columns:
    minmax(420px, 0.95fr)
    minmax(520px, 1.15fr);

  gap: 24px;
}
```

---

# Additional Rule

右側結果區：

建立：

```css
.results-stack {
  display: grid;
  gap: 18px;
}
```

不要讓 panel 分散。

---

# TASK 3 — Remove Fake Dashboard Feeling

目前：

```text
panel 太多
```

像 analytics dashboard。

需要：

```text
workflow-oriented layout
```

---

# Required Rule

以下：

```text
scenario-analysis-panel
tax-knowledge-panel
```

改為：

```text
accordion section
```

預設收合。

---

# Required UX

避免：

```text
初次進入資訊爆炸
```

---

# TASK 4 — Form UX Recovery

目前 form：

仍像資料庫表單。

---

# Required Changes

---

## Section Grouping

建立：

```text
基本資料
所得
扣除額
房貸 / 房租
```

分組。

---

## Required CSS

```css
.form-section {
  display: grid;
  gap: 14px;

  padding: 18px;
  border: 1px solid var(--line);
  border-radius: 10px;

  background: var(--soft);
}
```

---

## Section Title

```css
.form-section-title {
  font-size: 1rem;
  font-weight: 800;
}
```

---

# UX Goal

避免：

```text
所有欄位混在一起
```

---

# TASK 5 — Result Area Redesign

目前結果：

太像：

```text
debug output
```

---

# Required Redesign

建立：

```text
summary hero
+
breakdown groups
+
analysis insight
```

---

# Required Structure

---

## Hero Summary

大數字：

```text
應納稅額
```

---

## Secondary Cards

```text
總所得
總扣除額
有效稅率
節稅金額
```

---

## Breakdown

獨立 panel：

```text
所得 breakdown
扣除額 breakdown
```

---

# Required CSS

```css
.tax-total {
  font-size: clamp(2.2rem, 5vw, 3.6rem);
  font-weight: 900;
  line-height: 1;
}
```

---

# TASK 6 — Eliminate Dead Space

目前：

```css
width: min(1680px, calc(100% - 32px));
```

仍太保守。

---

# Required Change

```css
width: min(1920px, calc(100% - 40px));
```

---

# Additional Rule

大螢幕：

不要限制太窄。

---

# TASK 7 — Vertical Rhythm Recovery

目前：

spacing 不一致。

---

# Required Global Rhythm

---

## Panel Gap

```css
gap: 20px;
```

---

## Section Gap

```css
gap: 14px;
```

---

## Tight Text Gap

```css
gap: 6px;
```

---

# TASK 8 — Visual Hierarchy Recovery

目前：

所有 panel 權重接近。

---

# Required Priority

---

## Highest

- tax result
- saving amount

---

## Medium

- deduction breakdown
- warnings

---

## Lowest

- tax knowledge
- analysis notes

---

# Required CSS

建立：

```css
.panel-primary
.panel-secondary
.panel-supporting
```

---

# TASK 9 — Better Expand / Collapse UX

目前：

展開按鈕 UX 很差。

---

# Required Improvement

改為：

```text
chevron interaction
```

---

# Required HTML

```html
<button class="accordion-toggle">
  <span>年度資料</span>
  <span class="chevron">⌄</span>
</button>
```

---

# Required CSS

```css
.chevron {
  transition: transform 120ms ease;
}
```

---

# Expanded State

```css
[aria-expanded="true"] .chevron {
  transform: rotate(180deg);
}
```

---

# TASK 10 — Desktop Productivity Optimization

目前：

desktop 使用效率不高。

---

# Required Goal

1920px 螢幕下：

必須：

```text
不用一直上下捲動
```

---

# Required Strategy

---

## Left Side

sticky form summary。

---

## Right Side

scrollable result area。

---

# Required CSS

```css
.input-panel {
  position: sticky;
  top: 16px;
}
```

---

# Important

只允許：

```text
單一 sticky
```

---

# TASK 11 — Micro Interaction Polish

新增：

---

## Panel Hover

```css
.panel:hover {
  transform: translateY(-1px);
}
```

---

## Smooth Transition

```css
.panel,
button,
input,
select {
  transition:
    background-color 120ms ease,
    border-color 120ms ease,
    transform 120ms ease,
    box-shadow 120ms ease;
}
```

---

## Focus Ring

```css
input:focus,
select:focus {
  box-shadow:
    0 0 0 3px rgba(23, 107, 135, 0.12);
}
```

---

# TASK 12 — Mobile Recovery

mobile：

禁止：

```text
桌面 layout 硬壓縮
```

---

# Required Mobile Layout

mobile：

```text
單欄 workflow
```

---

# Required Rule

所有 sticky：

mobile 全部取消。

---

# Required CSS

```css
@media (max-width: 760px) {
  .input-panel {
    position: static;
  }
}
```

---

# TASK 13 — Forbidden Patterns

禁止：

- dashboard framework
- Tailwind
- Bootstrap
- React/Vue
- animation-heavy redesign
- glassmorphism overuse
- neumorphism
- floating modal workflow
- canvas rendering

---

# SUCCESS CRITERIA

完成後：

---

## UX

- header 不再右側空白
- desktop 空間有效利用
- form 更容易輸入
- result 更容易閱讀
- 不再像 prototype
- interaction 更直覺

---

## Layout

- 大螢幕不再浪費空間
- workflow 更集中
- 視覺重心穩定

---

## Interaction

- accordion 完全正常
- expand/collapse 穩定
- hover/focus 更自然

---

## Architecture

維持：

- Vanilla JS
- file:// compatibility
- GitHub Pages compatibility
- deterministic UI flow

---

## Regression

既有：

- tax calculation
- deduction logic
- validation
- renderer

不得崩潰。
