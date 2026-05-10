# Taiwan Insurance Planner Offline Edition

## 專案定位

建立一個：

「純靜態 HTML/CSS/JavaScript 的離線個人保險財務工作台」

此專案不是 Web App。

而是：

- 離線工具
- 本機工具
- 可攜式金融工具
- 解壓縮即可使用

---

# 使用方式

使用者：

下載 zip
→ 解壓縮
→ 雙擊 index.html
→ 直接使用

不需要：

- Node.js
- npm
- build
- webpack
- vite
- react
- backend
- database
- API
- localhost

---

# 核心技術

只能使用：

- HTML
- CSS
- Vanilla JavaScript

允許：

- Chart.js CDN
- jsPDF CDN

禁止：

- React
- Vue
- Angular
- Next.js
- TypeScript
- Tailwind
- npm
- build tools
- SSR
- backend

---

# 專案結構

```txt
/index.html

/css
  style.css
  dashboard.css
  forms.css

/js
  app.js
  storage.js
  calculator.js
  irr.js
  healthcheck.js
  dashboard.js
  retirement.js
  scenario.js
  charts.js
  pdf.js

/data
  policyTemplates.js

/assets
```

---

# 最重要要求

專案必須：

- 可直接開啟 index.html
- 支援 file:// 協議
- 不依賴 localhost
- 不需要 build
- 所有功能離線可用
- 所有資料存在 localStorage

---

# UI 風格

風格：

- 金融儀表板
- 極簡
- 專業
- 白底
- 柔和陰影
- 高資訊密度

必須：

- 手機版 responsive
- 桌機版優化
- Dark mode

禁止：

- 過度動畫
- 遊戲化
- 花俏 UI

---

# 頁面結構

使用：

單頁式 SPA。

不要使用 router。

使用：

```js
showSection("dashboard")
```

切換頁面。

---

# Sections

建立：

```txt
dashboard
need-calculator
health-check
irr
compare
retirement
scenario
premium-analysis
family
settings
```

每個 section：

使用：

```html
<section id="dashboard-section">
```

---

# Policy Schema

使用：

```js
const policy = {
  id: "",

  name: "",

  company: "",

  type: "",

  subtype: "",

  status: "",

  annualPremium: 0,

  paymentYears: 0,

  coverage: 0,

  termYears: 0,

  startAge: 0,

  insuredAge: 0,

  maturityValue: 0,

  irr: 0,

  currency: "TWD",

  tags: [],

  note: "",

  cashflows: [],

  createdAt: "",

  updatedAt: ""
}
```

---

# Policy Types

```js
medical
life
cancer
accident
longtermcare
savings
investment
```

---

# Policy Status

```js
active
paidup
surrendered
matured
inactive
```

---

# localStorage

建立：

```js
savePolicies()
loadPolicies()

saveFamily()
loadFamily()

exportWorkspace()
importWorkspace()

clearWorkspace()
```

storage key：

```txt
insurance-planner-data
```

---

# Dashboard

首頁顯示：

## Summary Cards

- 總年保費
- 總保障額
- 平均 IRR
- 保單數量
- 家庭成員數
- 醫療保障
- 壽險保障
- 保費壓力

---

# Dashboard Charts

使用：

Chart.js CDN

建立：

- Pie Chart
- Radar Chart
- Line Chart
- Bar Chart
- Area Chart

---

# 保額需求試算

輸入：

- 年齡
- 年收入
- 房貸
- 小孩數
- 每月支出

公式：

```js
lifeInsuranceNeed =
annualIncome * 10 +
mortgage +
(childrenCount * 1000000)
```

```js
medicalReserve =
annualIncome * 0.5
```

```js
emergencyFund =
monthlyExpense * 6
```

輸出：

- Summary Cards
- Radar Chart
- 建議摘要
- 風險分數

---

# 保費配置

規則：

```js
if(age < 35){
  medical = 40
  life = 40
  accident = 20
}
```

```js
if(hasChild){
  life += 10
}
```

輸出：

- Pie Chart
- Allocation Table

---

# IRR Module

建立：

```js
calculateIRR()

calculateBreakEvenYear()

calculateTotalPremium()
```

要求：

- 純 JavaScript
- 不使用 finance library
- 使用 Binary Search 或 Newton Method

cashflow：

```js
[
  { year: 1, value: -100000 },
  { year: 2, value: -100000 },
  { year: 20, value: 1200000 }
]
```

---

# Health Check

建立：

```js
calculateHealthCheck()
```

規則：

---

## 家庭責任風險

```js
hasChild &&
lifeCoverage < annualIncome * 10
```

顯示：

「壽險保障不足」

---

## 醫療保障不足

```js
medicalCoverage < 2000000
```

顯示：

「醫療保障可能不足」

---

## 保費壓力

```js
annualPremium > annualIncome * 0.1
```

顯示：

「保費佔收入比例偏高」

---

## 儲蓄險效率

```js
irr < 2
```

顯示：

「資金效率偏低」

---

## 保費集中度

```js
singlePolicyPremium > totalPremium * 0.5
```

顯示：

「保費過度集中」

---

## 高齡續保風險

```js
insuredAge > 60 &&
type === "medical"
```

顯示：

「高齡醫療保費可能快速上升」

---

# Insurance Score

建立：

0 ~ 100 分。

項目：

- 醫療
- 壽險
- 癌症
- 長照
- 意外

使用：

Radar Chart。

---

# 保單比較

功能：

比較：

- 年保費
- 保額
- IRR
- 回本年
- 滿期金
- 現金價值

使用：

- HTML Table
- Radar Chart

---

# 退休模擬

輸入：

- 年齡
- 退休年齡
- 每月支出
- 通膨率
- 投資報酬率

輸出：

- 退休缺口
- 所需退休資產
- 資產成長曲線

---

# 情境模擬

情境：

- 結婚
- 生小孩
- 買房
- 收入下降
- 提前退休

修改後：

自動重算：

- 壽險需求
- 緊急預備金
- 保費壓力
- 家庭風險

---

# 年度保費分析

分析：

- 各年齡保費
- 長期保費壓力
- 保費成長

使用：

- Line Chart
- Area Chart

---

# 家庭模式

支援：

```js
familyMembers = []
```

每位成員：

```js
{
  name,
  age,
  relation,
  annualIncome,
  monthlyExpense
}
```

分析：

- 家庭總保費
- 家庭總保障
- 家庭風險

---

# 保單模板

建立：

```js
policyTemplates = []
```

提供：

- 醫療險
- 實支實付
- 壽險
- 癌症險
- 意外險
- 長照險
- 儲蓄險
- 投資型保單

---

# Backup System

提供：

## 匯出完整工作區

下載：

```txt
insurance-workspace.json
```

---

## 匯入完整工作區

恢復：

- 保單
- 家庭
- 設定
- 主題

---

# PDF Export

使用：

jsPDF CDN

匯出：

- Dashboard
- 保單分析
- IRR
- 健檢結果
- 家庭分析

---

# Notification

使用：

Notification API

提供：

- 保單到期提醒
- 保費提醒
- 定期險續保提醒

---

# Dark Mode

需求：

- localStorage 記錄 theme
- 支援系統 theme

---

# Components

使用：

可重用 HTML component function。

建立：

```js
createSummaryCard()

createPolicyCard()

createChartContainer()

createModal()

createToast()
```

---

# Utility Functions

建立：

```js
calculateInsuranceNeed()

calculateAllocation()

calculateEmergencyFund()

calculateRetirement()

calculateCashflow()

calculateCoverage()

calculateInsuranceScore()
```

---

# 必須避免

不要：

- 使用 ES Module import/export
- 使用 npm package
- 使用 build tools
- 使用 TypeScript
- 使用 SPA framework

所有 JS：

使用：

```html
<script src="">
```

載入。

---

# CDN

允許：

```html
Chart.js
jsPDF
Font Awesome
Google Fonts
```

---

# 最終要求

完成後：

- 直接開啟 index.html 可使用
- 支援 file://
- 無 console error
- localStorage 正常
- 所有 charts 正常
- 所有功能離線可用
- 手機版正常
- 可直接 zip 發送

---

# 開發順序

依序完成：

1. 建立 index.html
2. 建立 layout
3. 建立 sidebar
4. 建立 sections
5. 建立 storage system
6. 建立 calculators
7. 建立 dashboard
8. 建立 charts
9. 建立 policy management
10. 建立 family system
11. 建立 IRR module
12. 建立 health check
13. 建立 retirement simulator
14. 建立 scenario simulator
15. 建立 compare section
16. 建立 premium analysis
17. 建立 backup system
18. 建立 PDF export
19. 建立 notification system
20. 建立 dark mode
21. UI polish
22. 測試 file://
23. 輸出完整專案