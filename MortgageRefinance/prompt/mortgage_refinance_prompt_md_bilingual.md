# prompt.md

```markdown
# PROJECT OVERVIEW

建立一個完全離線的房貸轉貸分析工具。

Build a fully offline mortgage refinance analysis tool.

技術限制：

- HTML
- CSS
- Vanilla JavaScript

必須符合：

- 可直接使用 `file://`
- 可雙擊 `index.html` 執行
- 不需要 backend
- 不需要 API
- 不需要 localhost
- 不需要 npm
- 不需要 build tools
- 不需要 framework

The application must:

- run directly via `file://`
- support direct double-click execution of `index.html`
- require no backend
- require no API
- require no localhost
- require no npm
- require no build tools
- require no framework

此工具的核心用途：

- 房貸轉貸分析
- 利息節省分析
- 回本分析
- 是否建議轉貸

Core purposes:

- mortgage refinance evaluation
- interest saving analysis
- break-even analysis
- refinance recommendation

---

# CORE OBJECTIVES

系統必須：

1. 分析是否值得轉貸
2. 計算原貸款剩餘總利息
3. 計算新轉貸總利息
4. 計算總利息節省
5. 計算回本時間
6. 提供 deterministic 的轉貸建議

The application must:

1. analyze whether refinancing is financially beneficial
2. calculate total remaining interest of existing loans
3. calculate total interest of the new refinanced loan
4. calculate total interest savings
5. calculate refinance break-even timing
6. provide deterministic refinance recommendation

系統優先級：

- deterministic calculation
- low complexity
- maintainability
- offline usability
- explicit financial logic

---

# TARGET USERS

目標使用者：

- 台灣房貸族
- 比較轉貸方案的人
- 使用新青安的人
- 有組合型房貸的人

Primary users:

- Taiwan mortgage borrowers
- users comparing refinance options
- users with combined mortgage structures
- users using New Youth Housing Loan (新青安)

使用者假設：

- 理解基本房貸概念
- 手動輸入資料
- 主要使用桌面瀏覽器

---

# FUNCTIONAL REQUIREMENTS

## Existing Loan Support

系統必須支援：

- 多筆既有房貸
- 每筆貸款獨立設定

Each existing loan must support:

- remaining principal
- remaining term (years)
- step-based interest rates

---

## Existing Loan Interest Model

還款模型：

- 本息平均攤還
- 每個利率區段內月付款固定

Repayment model:

- equal payment amortization
- fixed monthly payment within each rate segment

不支援：

- interest-only loans
- balloon loans
- floating index-based rates
- adjustable market-linked rates

---

## Step-Based Rate Schedule

每筆貸款必須支援：

- 分段固定利率

範例：

| Period | Rate |
|---|---|
| Year 1-3 | 1.1% |
| Year 4-30 | 1.5% |

The system must support:

- multiple rate segments
- deterministic transition timing

---

## Refinance Loan Model

轉貸後：

- 所有既有貸款整併成一筆新貸款

The refinance result must:

- consolidate all existing loans into one new loan

新轉貸貸款必須支援：

- 新貸款年限
- 分段利率

New refinance loan must support:

- new refinance term
- step-based interest schedule

新貸款本金：

```text
sum(existing remaining principals)
```

---

## Refinance Costs

系統必須支援：

- 違約金
- 開辦費
- 代書費

Total refinance cost:

```text
refinance_cost =
    prepayment_penalty +
    processing_fee +
    legal_fee
```

---

# OUTPUT REQUIREMENTS

## Summary Output

UI 必須顯示：

- 原貸款剩餘總利息
- 新貸款總利息
- 節省總利息
- 轉貸成本
- 淨節省
- 回本時間
- 是否建議轉貸

The UI must display:

- total remaining interest of existing loans
- total interest of refinance loan
- total interest savings
- refinance costs
- net savings
- break-even timing
- refinance recommendation

---

## Detailed Output

系統必須提供：

- 可展開的攤還明細

Expandable details must include:

| Month | Principal | Interest | Remaining Balance |
|---|---|---|---|

預設必須收合。

Details must remain collapsed by default.

---

# BREAK-EVEN REQUIREMENTS

回本定義：

```text
cumulative interest savings >= refinance_cost
```

Break-even timing must be calculated using:

- cumulative interest difference
- not monthly cash flow reduction

---

# RECOMMENDATION REQUIREMENTS

轉貸建議規則：

```text
total_interest_savings > refinance_cost
```

成立時：

```text
Recommend refinancing
```

否則：

```text
Do not recommend refinancing
```

禁止加入：

- time value of money
- inflation adjustment
- risk scoring
- financial forecasting
- subjective recommendation logic

---

# INPUT REQUIREMENTS

## Interest Rate Input

使用者輸入：

```text
1.775
```

Interpretation:

```text
1.775%
```

Internal conversion:

```text
1.775 → 0.01775
```

---

## Currency Input

金額單位：

- 台幣整數

範例：

```text
10000000
```

Internal calculations must use:

- integer TWD precision

---

## Loan Term Input

使用者輸入：

- 年

Internal conversion:

```text
years → months
```

---

# UI REQUIREMENTS

## Calculation Trigger

系統禁止自動計算。

流程：

```text
User Input
    ↓
Click "Start Calculation"
    ↓
Run Full Analysis
```

禁止：

- realtime recalculation
- debounce recalculation

---

## Loan Management

UI 必須支援：

- 新增貸款
- 移除貸款

Each loan block must be isolated.

---

## Expandable Sections

攤還明細必須：

- 可展開
- 可收合
- 預設收合

---

# STATE MANAGEMENT REQUIREMENTS

狀態管理必須使用：

- centralized plain JavaScript object

禁止：

- framework state systems
- reactive systems
- proxy-based state libraries

Recommended architecture:

```js
const appState = {
  existingLoans: [],
  refinanceLoan: {},
  refinanceCosts: {},
  uiState: {}
};
```

---

# PERSISTENCE REQUIREMENTS

資料保存必須使用：

- localStorage only

保存內容：

- existing loans
- refinance settings
- refinance costs
- UI expansion states

The application must:

- safely recover from corrupted localStorage
- reset invalid state automatically

---

# ARCHITECTURE CONSTRAINTS

## Mandatory

必須：

- single-page application
- pure HTML/CSS/JS
- direct browser execution
- deterministic calculations
- offline-first

---

## Forbidden

禁止：

- React
- Vue
- Angular
- TypeScript
- npm
- webpack
- vite
- parcel
- backend
- API
- localhost dependency
- server dependency
- external SDKs
- cloud dependency

---

# RUNTIME CONSTRAINTS

系統必須能直接在：

```text
file://
```

下執行。

不得依賴：

- CORS workaround
- server
- transpilation
- build step

---

# CALCULATION ENGINE REQUIREMENTS

攤還計算引擎必須：

- 支援分段利率
- 支援利率切換後重新計算
- 支援多貸款聚合分析
- 產生 deterministic 月度攤還表

Calculations must avoid:

- hidden rounding drift
- inconsistent floating behavior

Rounding policy must be explicitly centralized.

---

# DATA FLOW EXPECTATIONS

資料流必須：

- explicit
- unidirectional
- centralized

Preferred flow:

```text
Input
  ↓
Validation
  ↓
Normalized State
  ↓
Calculation Engine
  ↓
Result Model
  ↓
Renderer
```

---

# VALIDATION REQUIREMENTS

系統必須驗證：

- negative values
- empty values
- invalid rate segments
- invalid loan terms
- malformed numeric input

Validation errors must:

- remain local to the relevant input
- not crash calculations

---

# NON-FUNCTIONAL REQUIREMENTS

優先級：

1. deterministic correctness
2. maintainability
3. low complexity
4. offline reliability
5. UI clarity

---

# MAINTAINABILITY REQUIREMENTS

Code organization must remain:

- modular
- readable
- framework-free
- low coupling

Recommended separation:

```text
/calculation
/storage
/ui
/validation
```

即使最終仍為單一 HTML 檔案。

---

# ANTI-ENTROPY REQUIREMENTS

避免：

- overengineering
- reactive abstractions
- plugin systems
- excessive genericization
- hidden state mutation
- asynchronous complexity

Prefer:

- simple loops
- explicit functions
- deterministic state updates
- centralized calculations

---

# FORBIDDEN ARCHITECTURES

禁止實作：

- SPA frameworks
- SSR
- client-server architecture
- dependency injection frameworks
- observer-heavy reactive systems
- event-bus architectures
- build pipelines
- microfrontend structures

---

# SUCCESS CRITERIA

專案成功條件：

- users can open `index.html` directly
- calculations are deterministic
- refinance analysis is financially correct
- multi-loan refinance works correctly
- segmented rates calculate correctly
- offline usage is fully functional
- no external dependency exists

---

# IMPLEMENTATION PRIORITIES

Priority order:

1. deterministic amortization engine
2. segmented rate support
3. multi-loan aggregation
4. refinance comparison engine
5. validation system
6. persistence
7. expandable detail UI
8. styling polish
```

