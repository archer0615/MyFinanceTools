# Mortgage Planner — 第三階段核心升級需求

# 專案定位

目前系統已具備：

- 多貸款組合
- 多段利率
- 提前還款
- 壓力測試
- DSR
- 現金流圖表
- Snapshot
- CSV 匯出
- Canvas 圖表
- localStorage
- Worker 基礎結構

請將目前工具升級為：

```text
專業級 Mortgage Planning / Financial Decision System
```

目標不是單純：

```text
房貸計算器
```

而是：

```text
金融決策分析工具
```

---

# 技術限制（必須遵守）

禁止：

- React
- Vue
- Angular
- Svelte
- jQuery
- npm
- yarn
- pnpm
- webpack
- vite
- parcel
- babel
- TypeScript
- backend
- API
- node server
- localhost dependency
- chart library
- external CDN dependency

必須：

- 純 HTML
- 純 CSS
- 純 JavaScript
- ES6 可使用
- file:// 可執行
- 完全離線
- 不依賴 localhost

---

# 檔案結構限制

只能使用：

```text
/index.html
/style.css
/app.js
/worker.js
```

禁止新增：

```text
package.json
node_modules
webpack.config.js
vite.config.js
tsconfig.json
```

---

# 第一優先：真正完成 shortenTerm

# 問題

目前系統：

```js
prepayMode: "shortenTerm"
```

只有 UI。

實際計算邏輯仍偏向：

```text
reducePayment
```

這是不正確的。

---

# 正確 shortenTerm 規格

提前還款後：

- 月付金保持不變
- 剩餘本金下降
- 還款期數縮短
- 提前結清

---

# reducePayment 規格

提前還款後：

- 還款年限保持不變
- 月付下降

---

# 核心邏輯

提前還款後需：

1. 扣除剩餘本金
2. 重新計算攤還
3. 更新清償日期
4. 更新總利息

---

# 邊界條件

需避免：

- 負本金
- 最後一期殘值
- 浮點數誤差
- 超額還款

---

# 最後一期規則

若：

```text
剩餘本金 < 當月月付
```

則：

- 自動調整最後一期
- 剩餘本金歸零
- 不可出現負數

---

# UI 顯示

需新增：

| 項目 | 說明 |
|---|---|
| 節省利息 | 提前還款效果 |
| 提前幾年還清 | shortenTerm 專用 |
| 新月付 | reducePayment 專用 |
| 新清償日期 | 重算後日期 |

---

# 第二優先：真正啟用 Web Worker

# 問題

目前 worker.js 幾乎未實際使用。

大量計算仍在 main thread。

會導致：

- UI 卡頓
- 大型方案 lag
- 圖表延遲

---

# 必須搬移至 worker 的功能

以下功能必須移至：

```text
worker.js
```

---

# 必搬功能

1. generateSchedule
2. stress test
3. scenario compare
4. rate simulation
5. cash flow simulation
6. refinance analysis

---

# worker 通訊格式

使用：

```js
worker.postMessage({
  type: "CALCULATE",
  payload
});
```

回傳：

```js
postMessage({
  type: "RESULT",
  payload
});
```

---

# Worker 限制

不可使用：

```js
type: "module"
```

必須：

```js
new Worker("worker.js")
```

確保：

```text
file:// 可正常運作
```

---

# 第三優先：金融級 rounding system

# 問題

目前直接使用：

```js
Math.round()
```

容易導致：

- 浮點誤差
- 最後一期殘值
- 本金不歸零

---

# 必須建立

```js
function roundCurrency(value) {

}
```

---

# 所有金額必須統一經過

- 月付
- 利息
- 本金
- 剩餘本金
- 提前還款

---

# 規格

需支援：

- 四捨五入
- 最後一期補差額
- 避免浮點誤差

---

# 不可出現

```text
0.000000001
-0.0000001
```

---

# 第四優先：真正 Virtual Table

# 問題

目前：

```html
<div class="virtual-table">
```

可能只是名稱。

但未真正 virtual scroll。

---

# 真正需求

當：

```text
rows > 1000
```

時：

不可 render 全部 rows。

---

# 必須

只 render：

```text
viewport 可視範圍
```

---

# 建議技術

使用：

- scrollTop
- rowHeight
- spacer div
- documentFragment

---

# 效能要求

需可處理：

- 10+ loans
- 40 years
- 480+ months
- 多 scenario compare

且：

- 不可明顯卡頓

---

# 第五優先：IndexedDB

# 問題

目前 localStorage：

- 容量不足
- stringify 很慢
- snapshot 多會爆

---

# 必須新增

```text
IndexedDB persistence layer
```

---

# IndexedDB 儲存內容

需保存：

- snapshots
- compare scenarios
- refinance history
- stress test history
- cash flow simulations

---

# localStorage 保留用途

僅保存：

- 最近使用方案
- UI state
- temporary state

---

# 第六優先：轉貸分析（超重要）

# 功能名稱

```text
Refinance Analysis
```

---

# 使用者輸入

| 欄位 | 說明 |
|---|---|
| 剩餘本金 | 原貸款未還本金 |
| 原利率 | 目前利率 |
| 剩餘年限 | 剩餘貸款 |
| 新利率 | 新方案利率 |
| 新貸款年限 | 新方案 |
| 違約金 | 提前清償違約金 |
| 轉貸成本 | 手續費 |

---

# 系統需計算

| 項目 | 說明 |
|---|---|
| 原貸款剩餘利息 | 原方案 |
| 新貸款總利息 | 新方案 |
| 轉貸總成本 | 違約金 + 手續費 |
| 節省利息 | 差額 |
| 回本時間 | 幾年回本 |

---

# 判斷邏輯

若：

```text
節省利息 > 轉貸成本
```

顯示：

```text
值得轉貸
```

否則：

```text
不建議轉貸
```

---

# UI 顯示

需顯示：

```text
預估節省：
NT$ xxx

回本時間：
x 年

建議：
值得轉貸
```

---

# 第七優先：人生現金流分析

# 功能目標

將系統從：

```text
loan calculator
```

升級為：

```text
financial planning tool
```

---

# 使用者輸入

| 欄位 | 說明 |
|---|---|
| 月收入 | 固定收入 |
| 年終 | 年度獎金 |
| 薪資成長率 | 每年成長 |
| ETF 投資 | 每月投資 |
| 被動收入 | 房租等 |
| 育兒支出 | 固定支出 |

---

# 系統需模擬

每年：

- 總收入
- 房貸支出
- 投資支出
- 可支配所得
- DSR
- 現金流壓力

---

# 圖表

需繪製：

1. 現金流曲線
2. 房貸收入比例
3. 可支配所得曲線

---

# 風險判斷

若：

```text
房貸支出 > 收入 60%
```

顯示：

```text
高風險現金流
```

---

# 第八優先：提前還款最佳化

# 功能目標

分析：

```text
何時提前還款最划算
```

---

# 使用者輸入

```text
每年可多還：
NT$ xxx
```

---

# 系統需模擬

不同：

- 年份
- 金額
- 提前還款模式

---

# 系統需分析

輸出：

- 最大利息節省
- 最佳提前還款時間
- 最佳策略

---

# UI 顯示

例如：

```text
最佳提前還款年份：
第 7 年

預估節省：
NT$ 1,240,000
```

---

# 第九優先：利率循環模擬

# 問題

目前只有：

```text
+0.5%
+1%
```

太簡單。

---

# 必須新增

使用者可建立：

```js
[
  { year: 1, rate: 2.1 },
  { year: 2, rate: 2.5 },
  { year: 3, rate: 3.2 }
]
```

---

# 系統需模擬

- 升息循環
- 降息循環
- 長期利率變化

---

# 圖表

需顯示：

- 月付變化
- 利息變化
- 現金流變化

---

# 第十優先：AI 風險提示（rule-based）

# 不需要 AI API

使用：

```text
rule engine
```

即可。

---

# 系統需分析

例如：

- DSR 過高
- 寬限期後月付暴增
- 40 年總利息過高
- 升息風險過高
- 提前還款效益低

---

# UI 顯示

使用：

- warning card
- risk badge
- recommendation panel

---

# 第十一優先：多方案同圖比較

# 目前問題

目前圖表：

```text
單方案
```

---

# 必須支援

同時比較：

- 方案 A
- 方案 B
- 方案 C

---

# 圖表類型

需比較：

1. 月付曲線
2. 剩餘本金
3. 累積利息
4. 現金流

---

# 圖表互動

需支援：

- hover tooltip
- legend
- dynamic scale
- 顯示月份

---

# 圖表限制

禁止：

- chart.js
- echarts
- d3

必須：

- Canvas
或
- SVG

---

# 第十二優先：銀行方案模板

# 功能目標

快速套用銀行方案。

---

# 內建模板

需包含：

- 青安
- 首購
- 一般房貸

---

# 套用後

自動帶入：

- 利率
- 年限
- 寬限期

---

# 第十三優先：Snapshot 完整化

# 目前問題

目前 snapshot 偏 UI。

---

# 真正 snapshot 需保存

```js
{
  loans,
  settings,
  compareScenarios,
  stressTest,
  cashFlow,
  createdAt,
  updatedAt
}
```

---

# UI 功能

需支援：

- 建立
- 載入
- 刪除
- 重新命名
- 複製

---

# 第十四優先：Undo / Redo 真正實作

# 問題

不可只用：

```js
JSON.stringify(state)
```

---

# 建議

使用：

```js
structuredClone()
```

搭配：

- history stack
- history pointer

---

# 必須支援

```text
Ctrl + Z
Ctrl + Shift + Z
```

---

# 最終要求

請直接修改：

- index.html
- style.css
- app.js
- worker.js

禁止新增：

- build tools
- framework
- npm
- package.json
- external dependency

最終必須：

- 可直接雙擊 index.html 執行
- 支援 file://
- 完全離線
- 不依賴 localhost
- 所有功能完整可運作
- 不可只提供 pseudo code
- 必須是完整實作版本