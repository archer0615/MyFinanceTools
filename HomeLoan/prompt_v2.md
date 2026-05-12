# 房貸試算工具 — 第二階段完整升級規格

# 專案目標

目前系統已具備：

- 多貸款組合
- 多段利率
- 提前還款
- DSR
- 壓力測試
- 攤還表
- CSV 匯出
- Canvas 圖表
- localStorage

請將此工具升級為：

```text
專業級房貸與現金流規劃工具
```

工具需偏向：

- 真實銀行邏輯
- 金融決策分析
- 長期現金流模擬
- 多方案比較
- 風險分析

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
- 完全離線可用
- 不可依賴 localhost

---

# 檔案結構

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
build config
tsconfig
vite config
webpack config
```

---

# UI/UX 規格

# 整體風格

需為：

- 專業金融工具風格
- 深色與淺色皆清晰
- 高資訊密度
- 易讀性高
- 偏桌機操作
- 手機可使用

---

# 首頁版面

首頁需包含：

1. 工具列
2. 貸款列表區
3. 總結分析區
4. 圖表分析區
5. 現金流分析區
6. 風險提示區
7. 攤還表區
8. Snapshot 管理區

---

# 工具列

需包含：

- 新增貸款
- 儲存方案
- 載入方案
- 匯出 CSV
- 重設
- Undo
- Redo

---

# 貸款卡片 UI

每筆貸款為獨立卡片。

每張卡片需包含：

| 欄位 | 說明 |
|---|---|
| 貸款名稱 | 可編輯 |
| 貸款金額 | 數字輸入 |
| 年限 | 年 |
| 寬限期 | 年 |
| 還款方式 | 下拉選單 |
| 提前還款模式 | radio |
| 利率階段 | 動態新增 |
| 提前還款 | 動態新增 |

---

# 卡片功能

每張卡片需支援：

- 展開/收合
- 刪除
- 複製
- 即時計算
- 顯示摘要

---

# 即時計算

當使用者修改：

- 利率
- 年限
- 金額
- 提前還款
- 寬限期

系統需：

- 即時重新計算
- 不需按按鈕
- 不可整頁 reload

---

# 1. shortenTerm 真正實作

# 功能說明

目前系統只有：

```js
prepayMode: "reducePayment"
```

需完整實作：

```js
prepayMode: "shortenTerm"
```

---

# reducePayment 規則

提前還款後：

- 保持原本總年限
- 重新計算月付
- 月付下降

---

# shortenTerm 規則

提前還款後：

- 保持原本月付
- 縮短剩餘期數
- 提前結清

---

# 演算法要求

提前還款後：

1. 扣除剩餘本金
2. 重新產生攤還表
3. 重新計算利息
4. 重新計算最後還款日期

---

# 邊界條件

需避免：

- 負本金
- 最後一期殘值
- 浮點誤差累積
- 多扣款

最後一期：

- 自動補差額
- 自動歸零本金

---

# UI 顯示

需顯示：

| 項目 | 說明 |
|---|---|
| 節省利息 | 提前還款效果 |
| 提前幾年還清 | shortenTerm 專用 |
| 新月付 | reducePayment 專用 |
| 新清償日期 | 重新計算 |

---

# 2. 真實銀行 rounding 規則

# 必須建立統一 rounding system

建立：

```js
function roundCurrency(value) {

}
```

所有：

- 月付
- 本金
- 利息
- 剩餘本金

都需經過此 function。

---

# 規則

需支援：

- 四捨五入
- 無條件捨去
- 最後一期補差額

---

# 避免問題

不可出現：

```text
剩餘本金 = -0.0000001
```

或：

```text
最後一期仍殘留本金
```

---

# 3. 房貸轉貸分析

# 新增功能區塊

新增：

```text
轉貸分析
```

---

# 使用者輸入

| 欄位 | 說明 |
|---|---|
| 剩餘本金 | 目前未還本金 |
| 目前利率 | 舊利率 |
| 剩餘年限 | 剩餘貸款 |
| 新利率 | 新銀行利率 |
| 新貸款年限 | 新方案 |
| 違約金 | 提前清償違約金 |
| 轉貸成本 | 手續費 |

---

# 系統需計算

| 項目 | 說明 |
|---|---|
| 原貸款剩餘利息 | 原方案 |
| 新貸款總利息 | 新方案 |
| 總轉貸成本 | 違約金 + 手續費 |
| 利息節省 | 差額 |
| 回本時間 | 幾年回收成本 |

---

# 判斷邏輯

若：

```text
利息節省 > 轉貸成本
```

則：

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
轉貸後預估節省：
NT$ xxx

回本時間：
x 年

建議：
值得轉貸
```

---

# 4. 多方案圖表比較

# 功能目標

需支援：

- 多方案同時比較
- 同圖呈現

---

# 圖表類型

需包含：

1. 月付曲線
2. 剩餘本金曲線
3. 累積利息曲線
4. 提前還款影響圖
5. 現金流曲線

---

# 圖表限制

禁止：

- chart.js
- echarts
- d3

必須：

- 原生 Canvas
或
- SVG

---

# 圖表互動

需支援：

- hover tooltip
- 顯示方案名稱
- 顯示數值
- 顯示月份

---

# 圖表效能

需可處理：

- 10+ 方案
- 480+ 月資料

不可明顯卡頓。

---

# 5. 現金流分析

# 功能目標

從：

```text
房貸計算器
```

升級為：

```text
人生現金流規劃工具
```

---

# 使用者輸入

| 欄位 | 說明 |
|---|---|
| 月收入 | 固定收入 |
| 年終 | 年度獎金 |
| 薪資成長率 | 每年增加 |
| ETF 投資 | 每月投資 |
| 房租收入 | 被動收入 |
| 育兒支出 | 每月固定支出 |

---

# 系統需模擬

每年：

- 總收入
- 房貸支出
- 投資支出
- 可支配現金
- 負債比例

---

# 圖表

需繪製：

- 現金流曲線
- 房貸佔收入比例
- 可支配所得趨勢

---

# 風險判斷

若：

```text
房貸佔收入 > 60%
```

顯示：

```text
高風險現金流
```

---

# 6. 提前還款最佳化分析

# 功能目標

分析：

```text
何時提前還款最划算
```

---

# 使用者輸入

```text
每年可額外還款：
NT$ xxx
```

---

# 系統需模擬

不同：

- 年份
- 金額
- 還款模式

並分析：

- 最大利息節省
- 最佳還款時間

---

# 結果顯示

例如：

```text
最佳提前還款時間：
第 7 年

預估節省利息：
NT$ 1,240,000
```

---

# 7. 利率模擬模型

# 功能目標

模擬：

- 升息
- 降息
- 長期利率循環

---

# 使用者輸入

```js
[
  { year: 1, rate: 2.1 },
  { year: 2, rate: 2.5 },
  { year: 3, rate: 3.2 }
]
```

---

# 系統需重新模擬

- 月付
- 利息
- 現金流
- DSR

---

# 8. Scenario Snapshot

# 功能目標

儲存不同人生情境。

例如：

- 升息版
- 小孩出生版
- 提前還款版
- 轉貸版

---

# Snapshot 需保存

- 所有貸款
- 利率
- 提前還款
- 現金流設定
- 建立時間
- 名稱

---

# UI 功能

需支援：

- 建立
- 載入
- 刪除
- 重新命名

---

# 9. Undo / Redo

# 快捷鍵

需支援：

```text
Ctrl + Z
Ctrl + Shift + Z
```

---

# 可回復操作

- 修改利率
- 修改貸款
- 刪除貸款
- 修改提前還款
- 修改 Snapshot

---

# 10. Virtual Table

# 功能目標

攤還表超過：

```text
1000 rows
```

時：

- 不可一次 render 全部

---

# 必須

僅 render：

```text
可視範圍 rows
```

---

# 效能要求

避免：

```js
table.innerHTML += ...
```

---

# 建議

使用：

- documentFragment
- requestAnimationFrame
- lazy render

---

# 11. Web Worker

# 必須新增

```text
worker.js
```

---

# 必須搬移至 Worker 的功能

- 大量攤還計算
- 多方案比較
- 利率模擬
- 現金流模擬

---

# Worker 限制

必須支援：

```text
file://
```

不可使用：

```js
type: "module"
```

---

# 必須使用

```js
new Worker("worker.js")
```

---

# 12. IndexedDB

# 功能目標

目前 localStorage 不足。

需新增：

```text
IndexedDB
```

---

# 儲存內容

- Snapshot
- 歷史方案
- 大型攤還資料

---

# localStorage

仍需保留：

- 基本 UI state
- 最近使用方案

---

# 13. AI 風險提示（rule-based）

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
- 提前還款效益低
- 升息風險高

---

# UI 顯示

需使用：

- warning card
- risk badge
- recommendation panel

---

# 14. 銀行方案模板

# 功能目標

快速建立銀行方案。

---

# 內建模板

需包含：

- 青安貸款
- 首購貸款
- 一般房貸

---

# 使用方式

使用者可：

```text
套用方案
```

自動帶入：

- 利率
- 年限
- 寬限期

---

# CSS 要求

需：

- 使用 CSS Variables
- 使用 Grid/Flex
- sticky header
- responsive layout

禁止：

- Bootstrap
- Tailwind
- Material UI

---

# JavaScript 要求

需：

- 模組化
- 易維護
- 不可全域污染

建議：

```js
const App = (() => {

})();
```

---

# 最終要求

請直接修改：

- index.html
- style.css
- app.js

必要時新增：

- worker.js

但禁止新增：

- build system
- npm
- package.json
- external dependency

最終必須：

- 可直接雙擊 index.html 執行
- 支援 file://
- 完全離線
- 不依賴 localhost
- 所有功能需完整可運作
- 不可只提供 pseudo code
- 必須是完整可執行版本