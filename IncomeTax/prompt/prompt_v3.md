# 台灣綜合所得稅試算工具 - 夫妻合併報稅 / 扶養 / 列舉扣除額升級 SPEC

目前專案已具備：

- 純 HTML/CSS/JS
- GitHub Pages
- file:// 支援
- tax-data.js build architecture
- GitHub Actions 自動更新
- data-driven tax engine

接下來需要升級：

- 夫妻合併申報比較
- 扶養親屬管理
- 完整列舉扣除額
- 自動最佳節稅方案
- 更完整台灣所得稅模型

請直接修改現有專案。

不要重建專案。

禁止：

- React
- Vue
- npm
- TypeScript
- backend
- build tools

維持：

- 純 HTML/CSS/JS
- GitHub Pages compatible
- file:// compatible

---

# 第一部分：夫妻報稅模式

目前僅有單一路徑試算。

需要支援：

## 1. 單獨申報

## 2. 夫妻合併申報

## 3. 自動比較最佳方案

---

# UI 新增

建立：

```text
申報模式
```

使用：

```html
<select>
```

選項：

```text
- 單獨申報
- 夫妻合併申報
- 自動比較最佳方案
```

---

# 夫妻資料輸入

若選擇：

```text
夫妻合併申報
```

顯示：

## 配偶收入

```text
薪資所得
執行業務所得
股利所得
其他所得
```

---

# 自動比較最佳方案

當選擇：

```text
自動比較最佳方案
```

系統必須：

## 自動試算

- 個別申報
- 夫妻合併申報

比較：

- 應納稅額
- 有效稅率
- 可扣除額

最後顯示：

```text
建議使用：夫妻合併申報

可少繳：
12,800 元
```

---

# tax-engine.js 修改

建立：

```js
compareFilingStrategies()
```

回傳：

```js
{
  recommended: 'joint',

  saving: 12800,

  strategies: {
    separate: {},
    joint: {}
  }
}
```

---

# 第二部分：扶養親屬系統

目前扶養功能過於簡單。

需要建立完整扶養管理。

---

# UI 新增

建立：

```text
扶養親屬
```

支援：

- 動態新增
- 動態刪除

使用：

```html
<button>新增扶養親屬</button>
```

---

# 每位扶養親屬資料

每位扶養需包含：

```text
姓名
出生年
身份類型
是否滿 70 歲
是否身心障礙
是否同戶籍
```

---

# 身份類型選項

```text
- 子女
- 父母
- 祖父母
- 兄弟姊妹
- 其他親屬
```

---

# 自動判斷免稅額

系統需依：

- 年齡
- 是否滿 70 歲
- 身障

自動帶入：

- 一般免稅額
- 老人免稅額
- 身障扣除額

---

# 扶養資料 schema

建立：

```js
dependents: [
  {
    relation: 'parent',

    birthYear: 1950,

    isSenior: true,

    disabled: false
  }
]
```

---

# tax-engine.js

建立：

```js
calculateDependentDeduction()
```

---

# 第三部分：完整列舉扣除額

目前列舉扣除額不足。

需要補齊主要台灣綜所稅列舉項目。

---

# 列舉扣除額 UI

建立：

```text
列舉扣除額
```

使用：

```html
<details>
```

分類收合。

---

# 必須支援的列舉扣除額

## 1. 保險費

```text
本人保險費
配偶保險費
扶養親屬保險費
```

需檢查：

- 每人上限
- 全民健保不受限制

---

# 2. 醫藥及生育費

```text
醫療費
生育費
```

---

# 3. 捐贈

```text
一般捐贈
政治獻金
公益團體捐贈
```

需支援：

- 百分比上限
- 特殊限制

---

# 4. 災害損失

```text
災害損失金額
```

---

# 5. 購屋借款利息

```text
房貸利息
```

需支援：

- 自用住宅限制
- 上限

---

# 6. 房租支出

```text
租金支出
```

需支援：

- 房租特別扣除
- 上限

---

# 7. 長照扣除

```text
長期照顧特別扣除額
```

---

# 8. 幼兒學前扣除

```text
幼兒學前特別扣除額
```

支援：

- 多孩加成
- 年齡判定

---

# 9. 教育學費

```text
大專院校學費
```

---

# tax-engine.js

建立：

```js
calculateItemizedDeduction()
```

---

# 自動比較

系統需自動比較：

```text
標準扣除額
vs
列舉扣除額
```

並自動選擇最有利方案。

---

# 顯示結果

例如：

```text
列舉扣除額較有利

可多扣除：
38,200 元
```

---

# 第四部分：節稅分析功能

建立：

```text
節稅分析
```

---

# 分析內容

## 1. 標準 vs 列舉

## 2. 合併 vs 分開

## 3. 股利合併 vs 分離

---

# 顯示：

```text
最佳申報方式：
夫妻合併 + 列舉扣除

預估節省：
18,200 元
```

---

# 第五部分：結果頁升級

結果頁新增：

---

# 1. 稅額摘要

```text
總所得
總扣除額
綜合所得淨額
應納稅額
有效稅率
邊際稅率
```

---

# 2. 扣除額 breakdown

顯示：

```text
免稅額
標準扣除額
列舉扣除額
薪資扣除額
房租扣除額
教育扣除額
長照扣除額
```

---

# 3. 扶養摘要

顯示：

```text
扶養人數
老人扶養
身障扶養
```

---

# 4. 最佳策略說明

例如：

```text
因列舉扣除額高於標準扣除額，
建議採用列舉扣除。

因夫妻收入差距較大，
建議使用夫妻合併申報。
```

---

# 第六部分：state 管理升級

state.js 增加：

```js
window.IncomeTaxApp.state = {
  filingMode: 'auto',

  taxpayer: {},

  spouse: {},

  dependents: [],

  deductions: {},

  result: {}
};
```

---

# 第七部分：localStorage

需保存：

- 夫妻資料
- 扶養資料
- 扣除額
- 申報模式

重新整理後恢復。

---

# 第八部分：URL sharing

分享連結需包含：

- filingMode
- spouse income
- dependent count
- deduction summary

但：

禁止包含：

- 姓名
- 個資

---

# 第九部分：print mode

列印時：

隱藏：

- form buttons
- input controls

只顯示：

- 試算結果
- 節稅分析
- breakdown

---

# 第十部分：檔案結構

最終目標：

```text
/
├── index.html
├── css/
│   ├── style.css
│   ├── form.css
│   ├── result.css
│   └── print.css
├── js/
│   ├── app.js
│   ├── state.js
│   ├── ui.js
│   ├── formatter.js
│   ├── storage.js
│   ├── share.js
│   ├── tax-engine.js
│   ├── deduction-engine.js
│   ├── dependent-engine.js
│   ├── filing-strategy.js
│   └── charts.js
├── data/
│   ├── tax-data.js
│   └── *.json
├── scripts/
│   ├── scrape-tax.js
│   ├── build-data.js
│   ├── validate-tax-data.js
│   └── generate-changelog.js
└── .github/
    └── workflows/
        └── update-tax.yml
```

---

# 最終要求

請直接：

- 修改現有專案
- 補齊台灣綜所稅模型
- 增加夫妻申報比較
- 增加完整扶養系統
- 增加完整列舉扣除額
- 增加節稅分析
- 增加最佳方案推薦

並保持：

- 純 HTML/CSS/JS
- GitHub Pages compatible
- file:// compatible
- 無 framework
- 無 npm
- 無 build tool