# ETF 長期投資模擬器

## 專案目標

建立一個：

- 完全離線
- 純前端
- 高互動
- 高可讀性
- 高效能
- 高擬真
- 可長期維護

的 ETF 投資模擬工具。

---

# 核心限制

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
- 不需安裝
- 不需 build
- 完全離線運作

---

# 檔案結構

/project

- index.html
- style.css
- script.js

禁止複雜目錄結構。

---

# Dashboard Layout

介面需分成：

1. 左側控制面板
2. 右側主圖表區
3. 下方分析區

## Desktop Layout

左側：

- 320px 固定寬度
- 可捲動

右側：

- 自適應寬度
- 圖表優先

## Mobile Layout

改為：

1. 輸入區
2. 圖表區
3. 分析區

垂直排列。

---

# KPI Summary Cards

頁面頂部需固定顯示：

- 最終資產
- CAGR
- 總投入
- 總報酬
- 最大回撤

卡片需：

- 大數字
- hover 動畫
- smooth transition

---

# Scenario Presets

需提供快速情境：

- 樂觀
- 中性
- 保守
- 金融海嘯
- AI 牛市

---

# Timeline Slider

需提供年份 slider。

允許：

- 動態查看不同年份
- 動態更新數據
- 拖曳時間軸

---

# Animation 規格

圖表動畫：

- 使用 easing
- 300ms ~ 800ms

KPI 數字需：

- count up animation
- 平滑變化

---

# Loading State

Monte Carlo 執行時：

需顯示：

- progress bar
- simulation progress
- current batch

禁止：

- UI 凍結
- 無回應

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

# UI Style

風格參考：

- TradingView
- Bloomberg Terminal modernized
- Apple Stocks
- Linear

卡片需：

- 半透明
- 模糊背景
- 微陰影
- 圓角

---

# Responsive Canvas

Canvas 必須：

- 自適應寬度
- retina support
- devicePixelRatio scaling

---

# Crosshair

hover 圖表時：

需顯示：

- 垂直線
- 水平線
- 當前資料點

同步更新 tooltip。

---

# Keyboard Shortcuts

需支援：

- Space：播放動畫
- R：重置
- D：切換深色模式
- M：執行 Monte Carlo

---

# Export Report

需支援：

- 匯出完整分析圖片
- 包含 KPI
- 包含圖表
- 包含 AI 摘要

---

# Accessibility

需支援：

- keyboard navigation
- aria-label
- focus state
- 高對比模式

---

# State Synchronization

以下變更需同步：

- UI
- Chart
- URL
- LocalStorage
- KPI

---

# Memory Management

需避免：

- 未釋放 canvas reference
- 重複 event listener
- 無限制 array growth

---

# Recalculation Rules

一般輸入：

- debounce 300ms

Monte Carlo：

- 手動觸發
- 不自動重跑

---

# 資料模型規格

## ETF 資料

```js
const etfData = {
  id: "0050",
  name: "元大台灣50",
  annualReturn: 0.08,
  dividendYield: 0.03,
  expenseRatio: 0.003,
  color: "#58a6ff"
};
```

## 投資設定

```js
const investmentConfig = {
  monthlyInvestment: 10000,
  years: 30,
  reinvestDividend: true,
  annualReturn: 0.08,
  loanEnabled: false,
  loanAmount: 1000000,
  loanInterest: 0.03
};
```

## Monte Carlo 結果

```js
const simulationResult = {
  yearlyData: [],
  totalInvestment: 0,
  finalValue: 0,
  totalProfit: 0,
  cagr: 0,
  maxDrawdown: 0
};
```

---

# 投資模式

## 1. 定期定額模式

### 輸入

- 每月投入金額
- 投資年數
- 年化報酬率
- 股息殖利率
- 是否股息再投入

### 輸出

- 總投入
- 最終資產
- 總報酬
- CAGR
- 年度資產變化

---

## 2. 信貸單筆投入模式

### 輸入

- 信貸金額
- 信貸利率
- 還款年限
- ETF 年化報酬率
- 股息殖利率

### 輸出

- 總還款
- 總利息
- 最終資產
- 淨獲利
- 槓桿後 CAGR

---

# Monte Carlo 演算法規格

使用：

- 常態分布 random return
- Box-Muller transform

公式：

```js
yearReturn =
averageReturn +
(randomNormal * volatility)
```

需支援：

- 固定 random seed
- 可重現結果

---

# 回撤風險模擬

支援：

- 2008 金融海嘯
- 2020 COVID 崩盤
- 2022 升息熊市
- 自訂回撤

---

# 多 ETF 比較

支援：

- 2 ~ 5 個 ETF

每個 ETF 需包含：

- 名稱
- 年化報酬率
- 股息殖利率
- 費用率
- 顏色

---

# 損益兩平點分析

需計算：

- 超過總投入時間
- 超過總利息時間
- 真正獲利時間

---

# 台灣 ETF 預設模板

必須包含：

- 0050
- 006208
- 0056
- 00878
- 00919
- VOO
- QQQ
- VT

---

# AI 感分析摘要

禁止：

- OpenAI API
- backend AI

使用：

- template string
- rule-based generation

---

# 圖表系統

只能使用：

- HTML Canvas
或
- SVG

禁止：

- 外部圖表 library

---

# Canvas 分層規格

Canvas 必須分層：

1. background grid
2. axis
3. chart line
4. hover highlight
5. tooltip overlay

---

# Tooltip 規格

hover 時需顯示：

- 年份
- ETF 名稱
- 當前資產
- CAGR
- 最大回撤

---

# 匯出圖片

支援：

- PNG

使用：

```js
canvas.toDataURL()
```

---

# URL 參數保存

使用：

- URLSearchParams
- history.replaceState

需同步：

- 投入金額
- 投資年數
- ETF
- Monte Carlo 參數

---

# LocalStorage 保存

需保存：

- 投入金額
- ETF 設定
- 模擬設定
- 深色模式
- 當前 tab

---

# 效能優化

必須使用：

- debounce
- requestAnimationFrame
- incremental rendering
- dirty rectangle redraw

Monte Carlo：

- 分批執行
- 避免 blocking UI

---

# JavaScript 架構

script.js 必須拆分：

- state manager
- calculator
- monte carlo engine
- chart renderer
- storage manager
- url manager
- ui controller

---

# Debug Mode

需支援：

debug=true

顯示：

- FPS
- Monte Carlo 執行時間
- redraw 次數
- memory usage

---

# 最終目標

建立一個：

- 完全離線
- 高互動
- 高擬真
- 高效能
- 純前端
- 無依賴
- 易維護

的 ETF 長期投資模擬器。
