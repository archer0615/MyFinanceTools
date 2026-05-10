# Taiwan Insurance Planner v3

## 專案定位

建立一個：

「可離線使用、純靜態、免安裝、解壓縮即可使用的個人保險工作台」

使用者流程：

下載 zip
→ 解壓縮
→ 雙擊 index.html
→ 直接使用

不需要：
- npm
- Node.js
- build
- 後端
- 資料庫
- 帳號
- API
- 網路

---

# 核心要求

此專案必須：

- 完全前端
- 完全離線可用
- 不依賴伺服器
- 不需要安裝環境
- 不需要 build
- 不需要 npm install
- 直接用瀏覽器開啟 index.html 即可使用
- localStorage 保存資料
- 支援 Windows / Mac
- 支援 file:// 協議

---

# 技術架構

使用：

- HTML
- CSS
- Vanilla JavaScript
- Canvas API
- localStorage
- Blob / FileReader
- window.print 或瀏覽器列印成 PDF

禁止：

- Next.js
- Vite
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- npm
- Node.js
- SSR
- Server Actions
- Prisma
- Firebase
- Redux
- MobX
- Backend
- API Route
- CDN
- 外部網路資源

---

# 最重要要求

專案根目錄必須可直接執行：

```txt
index.html
```

直接雙擊：

```txt
index.html
```

正常使用。

不得要求使用者執行：

```txt
npm install
npm run build
npm run dev
```

---

# Build Requirements

不需要 build。

最終產出：

```txt
InsurancePlanner/
  index.html
  style.css
  app.js
  README.md
```

壓縮：

```txt
insurance-planner.zip
```

使用者解壓縮即可使用。

---

# 專案目標

建立：

「個人保險管理工具」

功能：

- 保額試算
- 保單健檢
- IRR 試算
- 現金流分析
- 退休模擬
- 情境模擬
- 保單比較
- Dashboard

---

# UI 需求

風格：

- 金融儀表板
- 極簡
- 專業
- 高資訊密度
- 白底
- 柔和陰影

必須：

- Mobile responsive
- Desktop optimized
- Dark mode
- 操作清楚
- 資訊密度高但不擁擠

禁止：

- 過度動畫
- 遊戲化 UI
- 花俏設計
- 依賴外部字型或圖示 CDN

---

# 專案結構

使用純靜態結構：

```txt
index.html
style.css
app.js
README.md
```

如需拆分，也只能使用本地檔案：

```txt
/assets
/data
```

不得新增需要 build 才能執行的原始碼架構。

---

# Pages / Views

使用單頁應用模式，以 JavaScript 切換 section 或 view。

建立：

```txt
Dashboard
```

首頁 Dashboard

---

```txt
need-calculator
```

保額需求試算

---

```txt
health-check
```

保單健檢

---

```txt
irr
```

IRR 試算

---

```txt
compare
```

保單比較

---

```txt
retirement
```

退休模擬

---

```txt
scenario
```

情境模擬

---

```txt
premium-analysis
```

年度保費分析

---

# Policy Schema

使用 JavaScript object schema：

```js
{
  id: string,
  name: string,
  company: string,
  type: "medical" | "life" | "cancer" | "accident" | "longtermcare" | "savings",
  annualPremium: number,
  paymentYears: number,
  coverage: number,
  termYears?: number,
  startAge?: number,
  insuredAge?: number,
  maturityValue?: number,
  irr?: number,
  currency?: "TWD" | "USD",
  tags?: string[],
  note?: string,
  cashflows?: [
    {
      year: number,
      value: number
    }
  ]
}
```

---

# localStorage

在 app.js 實作：

```js
savePolicies()
loadPolicies()
exportPolicies()
importPolicies()
clearPolicies()
validatePolicy()
```

需求：

- 自動同步 localStorage
- JSON 匯出
- JSON 匯入
- schema validation
- 匯入錯誤需提示使用者

---

# Dashboard

首頁顯示：

- 總年保費
- 保單數量
- 總保障額
- 平均 IRR
- 醫療保障
- 壽險保障

圖表：

- Pie Chart
- Line Chart
- Radar Chart
- Bar Chart

圖表使用：

- Canvas API
- 不使用外部 chart library

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
- 建議文字

---

# 保費配置

規則：

```js
if (age < 35) {
  medical = 40
  life = 40
  accident = 20
}
```

```js
if (hasChild) {
  life += 10
}
```

輸出：

- Pie Chart
- Allocation Table

---

# IRR 試算

在 app.js 實作：

```js
calculateIRR()
calculateBreakEvenYear()
calculateTotalPremium()
```

要求：

- 純 JavaScript
- 不使用 finance library
- 使用 Newton Method 或 Binary Search
- 支援動態 cashflow

cashflow 範例：

```js
[
  { year: 1, value: -100000 },
  { year: 2, value: -100000 },
  { year: 20, value: 1200000 }
]
```

---

# 保單健檢

在 app.js 實作：

```js
runHealthCheck()
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

# 保單比較

功能：

比較：

- 年保費
- 保額
- IRR
- 回本年
- 滿期金

使用：

- Table
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

變更條件後：

自動重算：

- 壽險需求
- 緊急預備金
- 保費壓力

---

# 保費分析

分析：

- 各年齡保費
- 長期保費壓力
- 保費成長

圖表：

- Line Chart
- Area Chart

---

# 保單模板

在 app.js 建立：

```js
policyTemplates
```

提供：

- 醫療險
- 壽險
- 癌症險
- 意外險
- 儲蓄險

新增保單時：

可快速套用。

---

# Components

因為使用純 HTML/CSS/JS，不建立 React component。

但 UI 必須包含等效模組：

- NumberInput
- ResultCard
- SummaryCard
- PolicyTable
- PolicyForm
- PolicyRadarChart
- PremiumLineChart
- CashflowChart
- CoveragePieChart
- Sidebar
- Topbar
- ThemeToggle

可用 JavaScript render function 或 HTML template 實作。

---

# Utility Functions

在 app.js 實作：

```js
calculateInsuranceNeed()
calculateAllocation()
calculateEmergencyFund()
calculateRetirement()
calculateCashflow()
calculateCoverage()
```

---

# 資料保存

所有資料：

存在：

```txt
localStorage
```

key：

```txt
insurance-planner-data
```

---

# JSON 功能

提供：

## 匯出

下載：

```txt
insurance-data.json
```

---

## 匯入

上傳 JSON 後：

自動覆蓋資料。

---

# PDF 功能

提供：

```txt
匯出分析報告 PDF
```

實作方式：

- 使用 window.print()
- CSS 加上 print media
- 使用者可另存為 PDF

內容：

- Dashboard
- 保單分析
- IRR
- 保額需求
- 健檢結果

---

# Dark Mode

必須：

- localStorage 記錄 theme
- 支援系統 theme
- 不依賴套件

---

# 套件要求

不得使用任何套件。

禁止：

```txt
react
react-dom
typescript
tailwindcss
chart.js
react-chartjs-2
lucide-react
shadcn/ui
jspdf
lodash
moment
redux
mobx
firebase
```

---

# 最終要求

產出：

- 完整可執行專案
- 純 HTML/CSS/JS
- 高可維護性
- 高可擴充性
- 不需要 build
- 離線可使用
- zip 後可直接發送
- 使用者雙擊 index.html 即可使用

---

# 開發順序

請依序完成：

1. 清理不需要的 npm / Vite / React / TypeScript 檔案
2. 建立純靜態 index.html
3. 建立金融儀表板 layout
4. 建立 views 切換
5. 建立 policy schema validation
6. 建立 localStorage system
7. 建立 calculators
8. 建立 dashboard
9. 建立 Canvas charts
10. 建立 forms
11. 建立 IRR module
12. 建立 health check
13. 建立 retirement simulator
14. 建立 scenario simulator
15. 建立 compare view
16. 建立 premium analysis
17. 建立 JSON import/export
18. 建立 print PDF export
19. 完整 UI polish
20. 確保 index.html 可直接雙擊開啟

---

# 最後

完成後：

請：

- 不執行 npm install
- 不執行 npm run build
- 確保無 JavaScript syntax error
- 確保直接開啟 index.html 可正常使用
- 確保所有 views 正常
- 確保 localStorage 正常
- 確保 chart 正常
- 最後輸出完整專案
