# 專案架構優化與進階功能開發 SPEC

目前專案已具備：

- 純 HTML/CSS/JS
- GitHub Pages
- file:// 支援
- tax-data.js build flow
- GitHub Actions 自動更新
- scrape 財政部資料
- data-driven 稅率架構

接下來需要：

- 提升架構穩定性
- 提升可維護性
- 提升稅務模型完整度
- 增加進階功能
- 提升產品感

請直接修改現有專案。

不要重建專案。

不要引入：

- React
- Vue
- npm
- build tools
- TypeScript
- backend

維持：

- 純靜態
- 純 JS
- GitHub Pages compatible
- file:// compatible

---

# 第一部分：架構優化

---

# 1. 避免 global namespace pollution

目前：

```js
window.LATEST_TAX_DATA
```

改成：

```js
window.IncomeTaxApp = {
  data: {},
  state: {},
  utils: {}
};
```

tax-data.js：

```js
window.IncomeTaxApp = window.IncomeTaxApp || {};

window.IncomeTaxApp.data = {
  currentYear: 2025,
  years: {}
};
```

所有程式統一使用：

```js
window.IncomeTaxApp
```

不要再建立新的 global variable。

---

# 2. 建立 state.js

新增：

```text
js/state.js
```

用途：

集中管理：

- 使用者輸入
- 當前年度
- 試算結果
- UI state

建立：

```js
window.IncomeTaxApp.state = {
  currentYear: null,
  formData: {},
  result: null
};
```

避免：

- 多處 DOM query
- 多處 mutable variable
- 邏輯散亂

---

# 3. 建立 formatter.js

新增：

```text
js/formatter.js
```

建立：

```js
formatCurrency()
formatPercent()
formatNumber()
```

例如：

```js
formatCurrency(1234567)
```

輸出：

```text
1,234,567
```

所有金額格式化統一使用 formatter。

禁止：

```js
number.toLocaleString()
```

散落在各檔案。

---

# 4. 強化 validate-tax-data.js

目前驗證不足。

增加：

## 稅率合理性

```js
rate >= 0 && rate <= 1
```

## 級距合理性

- max > min
- 不可重疊
- 必須遞增

## 扣除額異常檢查

若今年與去年差異超過：

```text
50%
```

workflow fail。

---

# 5. 新增 schemaVersion

所有年度 JSON：

```json
{
  "meta": {
    "schemaVersion": 1
  }
}
```

未來 schema 改版時使用。

---

# 6. build-data.js 增加 checksum

產出：

```json
{
  "meta": {
    "checksum": "xxxx"
  }
}
```

使用：

Node.js built-in crypto。

---

# 7. scrape robustness

目前 scrape-tax.js 過度依賴 HTML structure。

請修改：

- 不依賴 table index
- 不依賴 nth-child
- 優先使用 keyword matching
- normalize whitespace
- normalize Chinese punctuation

建立：

```js
normalizeText()
```

例如：

```js
replace(/\s+/g, '')
```

---

# 第二部分：稅務模型升級

---

# 1. 建立 deduction strategy engine

目前：

只做單一路徑計算。

改成：

自動比較：

- 標準扣除額
- 列舉扣除額

回傳：

```js
{
  bestStrategy: 'standard',
  savedTax: 8200
}
```

---

# 2. 建立 multiple tax strategy comparison

建立：

```js
compareTaxStrategies()
```

比較：

- 股利合併
- 股利分離
- 標準扣除
- 列舉扣除

回傳：

最省稅方案。

---

# 3. effective tax rate

結果顯示：

```text
有效稅率：8.3%
```

---

# 4. marginal tax rate

顯示：

```text
目前邊際稅率：12%
```

---

# 第三部分：UI 功能升級

---

# 1. localStorage

自動保存：

- 使用者輸入
- 年度
- 選項

頁面重整後恢復。

建立：

```js
saveState()
loadState()
```

---

# 2. URL sharing

支援：

```text
?income=1200000&rent=180000
```

可直接分享試算結果。

建立：

```js
serializeStateToUrl()
loadStateFromUrl()
```

---

# 3. 年度比較功能

建立：

```text
2025 vs 2026
```

顯示：

- 應納稅額差異
- 扣除額差異
- 有效稅率差異

---

# 4. 稅率變化比較

建立：

```text
薪資扣除額 +12000
標準扣除額 +7000
```

從不同年度 JSON 自動比較。

---

# 5. 圖表功能

使用：

- 原生 canvas
- 或 SVG

禁止：

- chart.js
- 第三方圖表 library

建立：

## effective tax rate graph

## tax bracket graph

## year comparison graph

---

# 6. print mode

建立：

```css
@media print
```

支援：

```js
window.print()
```

列印試算結果。

---

# 7. responsive UI

支援：

- mobile
- tablet
- desktop

禁止：

CSS framework。

---

# 第四部分：GitHub Actions 強化

---

# 1. scrape diff report

每次更新：

自動產生：

```text
CHANGELOG.md
```

內容：

```md
# 2026 稅制變更

- 標準扣除額 +7000
- 薪資扣除額 +12000
```

---

# 2. workflow validation

若：

- scrape fail
- schema invalid
- checksum mismatch

workflow fail。

---

# 3. workflow artifact

上傳：

- generated tax-data.js
- validation report

作為 artifact。

---

# 第五部分：使用者體驗提升

---

# 1. 顯示資料來源

footer：

```text
資料來源：
財政部
財政部電子申報繳稅服務網
```

---

# 2. 顯示版本資訊

例如：

```text
Tax Tool v1.2.0
Schema v1
Data Year 2026
```

---

# 3. 顯示資料更新時間

例如：

```text
最後更新：
2026-05-01
```

---

# 4. loading state

資料初始化時：

顯示：

```text
載入稅率資料中...
```

---

# 5. error boundary

若資料異常：

顯示：

```text
無法載入稅率資料
```

禁止：

console error only。

---

# 第六部分：檔案結構重整

最終目標：

```text
/
├── index.html
├── css/
│   ├── style.css
│   ├── layout.css
│   ├── form.css
│   └── print.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── tax-engine.js
│   ├── formatter.js
│   ├── ui.js
│   ├── charts.js
│   ├── storage.js
│   └── share.js
├── data/
│   ├── tax-data.js
│   ├── latest.json
│   └── *.json
├── scripts/
│   ├── scrape-tax.js
│   ├── build-data.js
│   ├── validate-tax-data.js
│   ├── normalize-tax-data.js
│   └── generate-changelog.js
└── .github/
    └── workflows/
        └── update-tax.yml
```

---

# 最終要求

請直接：

- 修改現有專案
- 重構現有 JS
- 保持純靜態架構
- 不引入 framework
- 不引入 npm
- 不引入 build tool

並完成：

- 架構優化
- state 管理
- formatter
- validate 強化
- tax strategy engine
- localStorage
- URL sharing
- 年度比較
- 圖表
- print mode
- changelog generation
- workflow 強化