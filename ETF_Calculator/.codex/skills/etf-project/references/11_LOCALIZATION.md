# Localization & UI Language Specification

## Default Language

預設語言：

- Traditional Chinese（繁體中文）

所有使用者可見 UI：

必須使用：

- 繁體中文

---

# 禁止事項

禁止：

- 英文 UI
- 英文 tooltip
- 英文 placeholder
- 英文按鈕
- 中英混用 UI
- 未翻譯 financial terms

---

# Internal Code vs UI Rules

## Internal Code

允許：

- English variable names
- English function names
- English file names

例如：

- monteCarloEngine
- calculateCagr
- chartRenderer

---

## User-facing UI

必須：

- 繁體中文

例如：

- CAGR → 年化報酬率
- Drawdown → 最大回撤
- Portfolio → 投資組合
- Benchmark → 基準比較

---

# Financial Terminology Mapping

CAGR:
年化報酬率

Drawdown:
最大回撤

Max Drawdown:
最大回撤

Volatility:
波動率

Portfolio:
投資組合

Allocation:
資產配置

Benchmark:
基準比較

Risk Metrics:
風險指標

Distribution:
分布

Percentile:
百分位數

Simulation:
模擬

Historical Replay:
歷史回測

Monte Carlo:
蒙地卡羅模擬

Bull Market:
牛市

Bear Market:
熊市

Sharpe Ratio:
夏普比率

Sortino Ratio:
索提諾比率

Calmar Ratio:
卡瑪比率

Correlation:
相關性

Leverage:
槓桿

Loan:
信貸

---

# UI Copy Style

整體語氣需：

- 專業
- 客觀
- 金融工具風格
- 精簡

避免：

- AI 助理語氣
- 過度熱情
- 過度口語化
- emoji
- 行銷式文案

---

# Summary Tone

AI-style Summary：

需使用：

- 金融分析風格
- 客觀敘述
- 中性語氣

禁止：

- ChatGPT 語氣
- 情緒化描述
- 過度誇張

---

# Empty State Copy

首次進入：

顯示：

請輸入投資參數開始模擬。

---

# Loading Copy

Monte Carlo 執行時：

顯示：

- 正在執行模擬
- 正在計算風險分布
- 正在分析歷史回測

禁止：

- Loading...
- Thinking...
- AI wording

---

# Error Message Style

錯誤訊息需：

- 明確
- 簡短
- 專業

例如：

- 投入金額不可為負數
- ETF 配置總和必須為 100%
- 波動率超出合理範圍

禁止：

- technical stack trace
- raw exception
- 英文錯誤訊息

---

# Tooltip Language

所有 tooltip：

必須：

- 繁體中文
- 使用金融術語翻譯

---

# Chart Labels

X 軸：

- 年份

Y 軸：

- 資產金額

Tooltip：

- 年度
- 總資產
- 總投入
- 報酬率

---

# Number Formatting

貨幣：

使用：

NT$ 1,000,000

禁止：

$1,000,000

---

## Percentage

使用：

8.25%

---

## Large Number

需使用：

- 千分位逗號

例如：

1,234,567

---

# Date Formatting

使用：

YYYY/MM/DD

禁止：

MM/DD/YYYY

---

# Typography

中文字體優先：

- Noto Sans TC
- Microsoft JhengHei
- PingFang TC

禁止：

- serif font
- 過細字體

---

# Font Rendering

需：

- 清晰
- 高可讀性
- 適合長時間觀看

---

# KPI Text Rules

KPI 卡片：

需：

- 大數字
- 小標題
- 中文 label

例如：

年化報酬率
8.25%

---

# Responsive Text

手機版：

需：

- 避免文字 overflow
- tooltip 自動換行
- KPI 自動縮放

---

# Accessibility Language

需支援：

- aria-label 中文化
- keyboard navigation 中文提示

---

# Exported Report Language

匯出圖片：

必須：

- 完整繁體中文
- 中文 KPI
- 中文圖表標籤

---

# Placeholder Rules

所有 input placeholder：

需使用：

- 中文
- 明確範例

例如：

請輸入每月投入金額

---

# Localization Architecture

所有 UI 字串：

必須集中管理。

禁止：

- hardcoded UI text

---

## 建議格式

```js
const i18n = {
  annualReturn: "年化報酬率",
  drawdown: "最大回撤"
};
```

---

# Future-proof Localization

雖然目前僅支援繁體中文：

但 architecture 必須允許：

- 未來新增英文語系
- 未來新增日文語系

禁止：

- 將中文直接寫死在 component logic
