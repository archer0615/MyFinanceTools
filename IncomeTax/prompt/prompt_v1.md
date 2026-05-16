# 台灣綜合所得稅試算工具 SPEC

## 專案目標

建立一個：

- 純 HTML/CSS/JS
- 無 React/Vue
- 無 npm
- 無 build tools
- 無 backend server
- 可部署於 GitHub Pages
- 自動更新台灣所得稅資料
- 自動產生年度稅率 JSON
- 自動部署

的台灣綜合所得稅試算工具。

---

# 技術限制

## 禁止

- React
- Vue
- Angular
- TypeScript
- npm
- webpack
- vite
- parcel
- backend server
- database
- express
- firebase
- cloud functions
- module bundler

## 必須

- 純 HTML
- 純 CSS
- 純 JavaScript
- GitHub Pages 可直接部署
- 使用 GitHub Actions 自動更新資料
- 所有前端邏輯皆為原生 JS
- 不使用任何 framework

---

# 專案結構

```text
/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── app.js
│   ├── tax-engine.js
│   ├── ui.js
│   └── data-loader.js
├── data/
│   ├── latest.json
│   ├── 2024.json
│   ├── 2025.json
│   └── 2026.json
├── scripts/
│   ├── scrape-tax.js
│   ├── normalize-tax-data.js
│   └── validate-tax-data.js
├── .github/
│   └── workflows/
│       └── update-tax.yml
└── README.md
```

---

# 前端需求

## 功能

建立台灣綜合所得稅試算工具。

支援：

- 年度切換
- 單身 / 已婚
- 扶養人數
- 年收入
- 股利所得
- 房租扣除
- 幼兒扣除
- 教育學費扣除
- 長照扣除
- 標準扣除額
- 列舉扣除額
- 自動計算最佳方案
- 顯示有效稅率
- 顯示應納稅額
- 顯示綜合所得淨額

---

# UI 需求

## 風格

- 極簡
- 白底
- 無 framework UI
- responsive
- mobile friendly

## Layout

使用：

- section
- form
- input
- select
- button

不要 SPA framework。

---

# index.html

建立：

- header
- calculator form
- result section
- footer

不要 inline JS。

所有 JS 皆使用：

```html
<script src="">
```

載入。

---

# data schema

每個年度資料格式固定。

例如：

```json
{
  "meta": {
    "year": 2025,
    "updatedAt": "2026-05-01",
    "source": "財政部"
  },

  "deductions": {
    "personalExemption": 97000,
    "seniorExemption": 145500,

    "standardSingle": 131000,
    "standardMarried": 262000,

    "salary": 218000,

    "disability": 218000,

    "education": 25000,

    "rent": 180000,

    "longTermCare": 120000
  },

  "taxBrackets": [
    {
      "min": 0,
      "max": 590000,
      "rate": 0.05,
      "quickDeduction": 0
    },
    {
      "min": 590001,
      "max": 1330000,
      "rate": 0.12,
      "quickDeduction": 41300
    }
  ]
}
```

---

# latest.json

格式：

```json
{
  "currentYear": 2025
}
```

---

# data-loader.js

負責：

- 載入 latest.json
- 載入對應年度 JSON
- 回傳 tax data

使用：

```js
fetch()
```

不可使用第三方 library。

---

# tax-engine.js

建立：

```js
calculateTax(data, input)
```

必須完全 data-driven。

禁止：

```js
if (year === 2025)
```

---

# calculateTax 功能

輸入：

```js
{
  maritalStatus,
  income,
  dependents,
  rent,
  dividends
}
```

輸出：

```js
{
  taxableIncome,
  taxAmount,
  effectiveRate,
  deductions
}
```

---

# 稅額計算

使用：

```text
綜合所得淨額 × 稅率 − 累進差額
```

參考財政部公式。

來源：

https://www.ntbt.gov.tw/

---

# GitHub Actions

建立：

```text
.github/workflows/update-tax.yml
```

功能：

- 每月自動執行
- scrape 財政部資料
- 產生最新年度 JSON
- 更新 latest.json
- commit 回 repo

---

# GitHub Actions schedule

使用：

```yaml
on:
  schedule:
    - cron: '0 0 1 * *'
```

---

# scrape-tax.js

功能：

- 抓取財政部公開資訊
- 解析所得稅級距
- 解析扣除額
- 產出標準 schema JSON

禁止：

- puppeteer
- playwright

優先使用：

- fetch
- RegExp
- DOMParser

Node.js 18+ 內建 fetch。

不可使用 npm package。

---

# scrape 來源

優先來源：

## 財政部

https://www.ntbt.gov.tw/

## 財政部稅務入口網

https://www.etax.nat.gov.tw/

---

# validate-tax-data.js

建立資料驗證。

驗證：

- 稅率是否存在
- 扣除額是否存在
- 級距是否遞增
- 數值是否合理

若驗證失敗：

GitHub Actions fail。

---

# normalize-tax-data.js

負責：

- 將 scrape 結果轉為固定 schema
- 統一欄位名稱
- 清理格式

---

# README.md

包含：

- 專案介紹
- GitHub Pages 部署方式
- 如何更新稅率資料
- GitHub Actions 說明

---

# GitHub Pages

部署：

Settings → Pages

branch:

```text
main
/root
```

---

# 不要使用

- localStorage framework
- state management library
- router
- SSR
- SPA framework

---

# 額外需求

## 顯示版本資訊

UI 顯示：

```text
使用 2025 年度綜所稅資料
最後更新：2026-05-01
```

---

# 顯示資料來源

footer 顯示：

- 財政部
- 財政部稅務入口網

---

# 錯誤處理

若資料載入失敗：

顯示：

```text
無法載入稅率資料
```

---

# 程式碼要求

- 使用 ES6
- 使用 async/await
- 使用 function
- 避免 global pollution
- 加入必要註解

---

# 目標

建立可長期維護的：

- 純靜態
- 自動更新
- 台灣所得稅試算工具