# ETF 長期投資模擬器 - Advanced Specification

## 專案目標

建立一個：

- 完全離線
- 純前端
- 高互動
- 高擬真
- 高效能
- 無依賴

的 ETF / Portfolio 長期投資模擬器。

---

# Portfolio Allocation

允許建立投資組合：

- ETF A
- ETF B
- ETF C
- ETF D
- ETF E

## 每個 ETF 可設定

- 配置比例 %
- 年化報酬
- 波動率
- 股息殖利率
- 費用率
- 顏色

## 配置限制

所有 ETF 比例總和：

必須等於 100%

需即時驗證。

---

# Historical Replay

需支援：

- 真實歷史回測

## Historical Replay 目的

Historical Replay：

- 使用真實市場歷史
- 重現歷史危機
- 重現真實回撤
- 重現真實恢復速度

用途：

- 比 Monte Carlo 更真實
- 可重現結果
- 可比較不同策略

## 歷史情境

至少包含：

- 2000 網路泡沫
- 2008 金融海嘯
- 2020 COVID 崩盤
- 2022 升息熊市

## Historical Replay 資料來源

資料可一次性整理。

來源可包含：

- Macrotrends
- Yahoo Finance
- Stooq
- Slickcharts
- Kaggle
- Portfolio Visualizer historical data

## Historical Replay 資料方式

禁止：

- API
- 即時抓取
- backend
- 外部 request

必須：

- 本地 JSON
- historicalData.js

## Historical Replay 資料格式

```js
const historicalData = {
  SP500: [
    { year: 2000, return: -0.09 },
    { year: 2001, return: -0.12 }
  ]
};
```

## 資料粒度

建議：

- yearly data

禁止：

- daily data
- tick data

原因：

- daily data 過大
- Canvas render 成本高
- 離線工具無必要

---

# Risk Metrics

需計算：

- Max Drawdown
- Volatility
- Sharpe Ratio
- Sortino Ratio
- Calmar Ratio

---

# Correlation Matrix

多 ETF 模式需支援：

- correlation coefficient

需模擬：

- ETF 相關性
- 不同波動方向
- 非同步上漲下跌

---

# Market Regime Simulation

需模擬：

- 牛市
- 熊市
- 高通膨
- 升息循環

不同 regime 需影響：

- 平均報酬
- 波動率
- 回撤機率

---

# Heatmap

需提供：

- 資產熱力圖

X 軸：

- 年化報酬率

Y 軸：

- 投資年數

顏色：

- 最終資產

---

# Distribution Chart

Monte Carlo 結果需提供：

- 資產分布圖
- 成功率分布
- percentile distribution

---

# Percentile Metrics

需顯示：

- P10
- P25
- Median
- P75
- P90

---

# Simulation Speed Control

需支援：

- 慢速播放
- 正常速度
- 快速播放

---

# Snapshot System

需允許：

- 保存 scenario
- 快速切換 scenario
- 比較不同配置

---

# Undo / Redo

需支援：

- Ctrl + Z
- Ctrl + Shift + Z

---

# Benchmark Comparison

需支援比較：

- 現金
- 定存
- 大盤 ETF

---

# Risk Warning Engine

若：

- 槓桿過高
- 波動過大
- 最大回撤超標

需顯示：

- 風險警告
- 高波動提示
- 回撤警示

---

# Explanation Panel

需提供：

- Monte Carlo 說明
- CAGR 說明
- Max Drawdown 說明
- Sharpe Ratio 說明

---

# Precision Financial Math

禁止：

```js
monthlyRate = annualReturn / 12
```

必須使用：

```js
monthlyRate =
Math.pow(1 + annualReturn, 1 / 12) - 1;
```

---

# Loan Interest Model

信貸模式需支援：

- 本利攤還
- 只還利息
- 寬限期

---

# Deterministic vs Stochastic

需允許切換：

- 固定報酬模式
- 隨機市場模式

---

# Web Worker

Monte Carlo 計算需：

- 使用 Web Worker

避免：

- blocking main thread
- UI freeze

---

# Virtualized Rendering

大量 Monte Carlo 路徑時：

需使用：

- downsample
- aggregation
- opacity rendering

避免：

- FPS 下降
- Canvas 過度 redraw
- memory explosion

---

# 最終目標

建立一個：

- 完全離線
- 高擬真
- 高互動
- 高效能
- 無依賴

的 Portfolio Simulation Platform。
