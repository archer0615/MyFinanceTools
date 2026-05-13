# ETF Simulator Final Master Spec v3

## Project Goal

建立一個：

- 完全離線
- 純前端
- 高互動
- 高擬真
- 高效能
- 高可維護性
- 無依賴

的 ETF / Portfolio Simulation Platform。

---

# Core Constraints

## 禁止

不要使用：

- React
- Vue
- Angular
- Svelte
- TypeScript
- npm
- yarn
- pnpm
- webpack
- vite
- parcel
- backend
- API
- localhost
- node.js
- module bundler
- 第三方 chart library
- 外部 CDN

禁止：

- Chart.js
- D3.js
- ECharts

---

# 必須

只能使用：

- HTML
- CSS
- Vanilla JavaScript

必須：

- 支援 file://
- 可直接雙擊 index.html
- 不需 build
- 不需安裝
- 完全離線運作

---

# File Structure

/project

- index.html
- style.css
- script.js
- historicalData.js
- worker.js

禁止複雜目錄結構。

---

# System Architecture

App Flow：

Input
→ Validation
→ State Manager
→ Simulation Engine
→ Calculation Engine
→ Chart Renderer
→ KPI Update
→ Storage Sync
→ URL Sync

---

# Modules

- app controller
- state manager
- simulation engine
- historical replay engine
- monte carlo engine
- chart renderer
- tooltip manager
- storage manager
- export manager
- worker manager
- benchmark engine
- risk engine
- time engine

---

# Engine Separation

需分離：

- UI layer
- simulation layer
- render layer
- storage layer

禁止：

- chart 直接修改 state
- UI 直接修改 engine

---

# Single Source of Truth

所有 UI / Chart / KPI：

只能從 central state 讀取。

禁止：

- duplicated state
- DOM 作為 state source
- chart 自行維護 state

---

# State Lifecycle

input change
→ validate
→ normalize
→ update state
→ debounce
→ simulation
→ cache
→ render
→ sync storage
→ sync URL

---

# Render Lifecycle

state update
→ diff detection
→ dirty region detection
→ partial redraw
→ tooltip update
→ animation frame commit

---

# Dashboard Layout

介面需分成：

1. 左側控制面板
2. 右側主圖表區
3. 下方分析區

---

## Desktop Layout

左側：

- 320px 固定寬度
- 可捲動

右側：

- 自適應寬度
- 圖表優先

---

## Mobile Layout

改為：

1. 輸入區
2. 圖表區
3. 分析區

垂直排列。

---

# KPI Summary Cards

需顯示：

- 最終資產
- CAGR
- 總投入
- 總報酬
- 最大回撤
- Sharpe Ratio

卡片需：

- 大數字
- smooth transition
- hover animation

---

# UI Style

風格參考：

- TradingView
- Bloomberg Terminal modernized
- Apple Stocks
- Linear

---

## 卡片

需：

- 半透明
- 模糊背景
- 微陰影
- 圓角

---

# Color System

需定義：

- background
- surface
- border
- positive
- negative
- neutral

預設深色模式。

---

# Typography

H1:
32px

H2:
24px

Body:
14px ~ 16px

KPI:
36px ~ 48px

---

# Accessibility

需支援：

- keyboard navigation
- aria-label
- focus state
- 高對比模式

---

# Keyboard Shortcuts

需支援：

- Space：播放動畫
- R：重置
- D：切換深色模式
- M：執行 Monte Carlo

---

# Responsive Canvas

Canvas 必須：

- 自適應寬度
- retina support
- devicePixelRatio scaling

---

# Chart Coordinate System

需定義：

- world space
- screen space
- viewport transform
- zoom scale
- pan offset

---

# Chart Interaction

需支援：

- mouse wheel zoom
- drag pan
- double click reset

---

# Crosshair

hover 圖表時：

需顯示：

- 垂直線
- 水平線
- 當前資料點

同步更新 tooltip。

---

# Tooltip System

hover 時需顯示：

- 年份
- ETF 名稱
- 當前資產
- CAGR
- Max Drawdown

---

# Canvas Layering

Canvas 必須分層：

1. background grid
2. axis
3. chart line
4. hover highlight
5. tooltip overlay

---

# Timeline Slider

需提供年份 slider。

允許：

- 動態查看不同年份
- 拖曳時間軸
- 即時更新 KPI

---

# Scenario Presets

需提供：

- 樂觀
- 中性
- 保守
- 金融海嘯
- AI 牛市

---

# Financial Profiles

預設：

- Conservative
- Balanced
- Aggressive
- Leveraged
- FIRE

---

# Portfolio Allocation

允許：

- 2 ~ 5 個 ETF

---

## 每個 ETF 可設定

- 配置比例 %
- 年化報酬
- 波動率
- 股息殖利率
- 費用率
- 顏色

---

## 配置限制

所有 ETF 比例總和：

必須等於 100%

---

# Correlation Matrix

需支援：

- correlation coefficient

需模擬：

- ETF 相關性
- 不同步波動

---

# Investment Modes

## 定期定額

### Inputs

- 每月投入
- 年數
- 年化報酬
- 股息殖利率
- 是否再投入

---

## 信貸單筆投入

### Inputs

- 信貸金額
- 利率
- 還款年限
- 寬限期
- 還款模式

---

# Loan Interest Model

需支援：

- 本利攤還
- 只還利息
- 寬限期

---

# Precision Financial Math

禁止：

monthlyRate = annualReturn / 12

必須使用：

monthlyRate =
Math.pow(1 + annualReturn, 1 / 12) - 1;

---

# Time Engine

Simulation step：

- monthly
- yearly

所有 engine：

需使用同一時間系統。

---

# Historical Replay

需支援：

- 真實歷史回測

---

## Historical Replay Sources

來源可包含：

- Macrotrends
- Yahoo Finance
- Stooq
- Slickcharts
- Kaggle
- Portfolio Visualizer

---

## Historical Replay Storage

禁止：

- API
- backend
- 即時抓取

必須：

- 本地 JSON
- historicalData.js

---

## Historical Replay Format

```js
const historicalData = {
  SP500: [
    { year: 2000, return: -0.09 },
    { year: 2001, return: -0.12 }
  ]
};
```

---

## Historical Replay Events

至少包含：

- 2000 網路泡沫
- 2008 金融海嘯
- 2020 COVID
- 2022 升息熊市

---

# Market Regime Simulation

需模擬：

- 牛市
- 熊市
- 高通膨
- 升息循環

需影響：

- 平均報酬
- 波動率
- 回撤機率

---

# Deterministic vs Stochastic

需允許切換：

- 固定報酬模式
- 隨機市場模式

---

# Monte Carlo Engine

需使用：

- 常態分布
- Box-Muller transform

---

# Random Engine

需支援：

- seeded random
- reproducible simulation
- independent streams

禁止：

- 到處直接使用 Math.random()

---

# Monte Carlo Outputs

需顯示：

- 最佳結果
- 最差結果
- 平均值
- 中位數
- 成功率

---

# Distribution Chart

需顯示：

- 資產分布圖
- percentile distribution
- success distribution

---

# Percentile Metrics

需顯示：

- P10
- P25
- Median
- P75
- P90

---

# Heatmap

需提供：

X 軸：

- 年化報酬率

Y 軸：

- 投資年數

顏色：

- 最終資產

---

# Risk Engine

需統一處理：

- drawdown
- volatility
- Sharpe
- Sortino
- Calmar
- correlation risk
- regime risk

---

# Benchmark Engine

需比較：

- 現金
- 定存
- 大盤 ETF

需計算：

- excess return
- benchmark comparison

---

# Risk Warning Engine

若：

- 槓桿過高
- 波動過大
- 最大回撤超標

需顯示：

- info
- warning
- danger

---

# Explanation Panel

需提供：

- Monte Carlo 說明
- CAGR 說明
- Sharpe Ratio 說明
- Max Drawdown 說明

需：

- collapsible panel
- tooltip help icon

---

# AI-style Summary

禁止：

- OpenAI API
- backend AI

使用：

- rule-based generation
- template string

---

# Export Engine

需支援：

- PNG export
- report export
- dark mode export
- chart snapshot export

---

# URL State

需同步：

- ETF
- Monte Carlo 參數
- 投入金額
- 深色模式

使用：

- URLSearchParams
- history.replaceState

---

# LocalStorage

需保存：

- 當前 tab
- ETF 設定
- 模擬設定
- theme

---

# Snapshot System

需允許：

- 保存 scenario
- 快速切換 scenario
- 配置比較

---

# Undo / Redo

需支援：

- Ctrl + Z
- Ctrl + Shift + Z

---

# Web Worker

需處理：

- Monte Carlo
- percentile calculation
- random generation

避免：

- UI freeze
- blocking main thread

---

# Cache System

需 cache：

- Monte Carlo result
- Historical Replay result
- Percentile result

避免：

- 重複計算

---

# Dataset Virtualization

大量 path 時：

需：

- path sampling
- aggregation
- viewport culling

---

# Virtualized Rendering

需：

- downsample
- opacity rendering
- partial redraw

避免：

- FPS 下降
- Canvas redraw explosion

---

# Adaptive Rendering

低 FPS 時：

需自動：

- 降低 redraw frequency
- 降低 animation quality
- 降低 visible paths

---

# Performance Rules

禁止：

- 每次 input 全量重算
- mousemove 全 redraw

需使用：

- debounce
- requestAnimationFrame
- dirty rectangle redraw

---

# Recalculation Rules

一般輸入：

- debounce 300ms

Monte Carlo：

- 手動觸發
- 不自動重跑

---

# Error Boundary

simulation error：

不得導致：

- blank screen
- UI crash
- chart freeze

---

# Memory Management

需避免：

- event listener leak
- array 無限制成長
- canvas reference leak

---

# Immutable State

state update：

必須建立新 object。

禁止：

- mutable nested state

---

# Config Driven Design

所有：

- ETF template
- regime
- scenario
- benchmark

必須使用 config object。

禁止：

- hardcoded logic

---

# Feature Flags

需支援：

- debug mode
- performance mode
- experimental features

---

# Debug Mode

debug=true

需顯示：

- FPS
- render timing
- simulation timing
- worker status
- cache hit rate

---

# Testing Hooks

需暴露：

- render timing
- simulation timing
- worker status
- cache hit rate

---

# Final Goal

建立一個：

- 完全離線
- 高互動
- 高擬真
- 高效能
- 無依賴
- 易維護

的 Professional Portfolio Simulation Platform。
