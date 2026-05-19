# 台灣綜合所得稅試算工具

- 純前端台灣綜合所得稅試算工具，可直接用瀏覽器開啟 `index.html`。
- 不需要後端、資料庫、npm 套件或網路服務。
- 目前內建 `2024`、`2025`、`2026`、`2027` 年度稅制資料。
- 預設年度由 `data/latest.json` 控制。
- 瀏覽器實際載入資料為 `data/tax-data.js`。

## 主要功能

- 年度稅制下拉選單試算。
- 本人、配偶、扶養親屬收入輸入。
- 扶養親屬可輸入收入與個別列舉扣除額。
- 單獨申報、夫妻合併申報、自動比較最佳方案。
- 股利所得合併計稅、分離課稅、自動最佳化。
- 股利可抵減稅額、分離課稅稅額、應補稅與退稅試算。
- 儲蓄投資特別扣除額與房貸利息扣除額 dependency 計算。
- 標準扣除額與列舉扣除額比較。
- 房貸、租金、長照、幼兒學前、教育學費等扣除項目。
- 家庭申報組合最佳化與全組合比較表。
- 五年稅負趨勢、Forecast Dashboard、最佳方案分析。
- 情境 Quick Save / Load / Delete，資料保存在本機 `localStorage`。
- 深色主題與響應式版面。

## 使用方式

- 開啟 `index.html`。
- 在頁首選擇試算年度，例如 `2027`。
- 在「試算資料」輸入本人與配偶收入。
- 在「扶養親屬」新增扶養資料。
- 在每位扶養親屬卡片中輸入：
  - 姓名
  - 身分類型
  - 收入
  - 列舉扣除額
  - 是否滿 70 歲
  - 是否身心障礙
  - 是否同戶籍
- 系統會自動更新：
  - 試算結果
  - 扣除額明細
  - 股利課稅分析
  - 家庭申報最佳化
  - 五年稅負趨勢

## 更新年度資料

- 新年度資料放在 `data/YYYY.json`。
- 例如政府公告 `2028` 年資料時：
  - 複製 `data/2027.json`
  - 改名為 `data/2028.json`
  - 修改 `meta.year`
  - 修改 `meta.updatedAt`
  - 修改 `meta.source`
  - 修改 `deductions`
  - 修改 `taxBrackets`

- 更新預設年度：

```json
{
  "currentYear": 2028
}
```

- 重新產生前端資料：

```powershell
node scripts\build-data.js
```

- 驗證資料與功能：

```powershell
node scripts\run-all-tests.js
```

## 年度資料格式

```json
{
  "meta": {
    "schemaVersion": 1,
    "year": 2028,
    "updatedAt": "2027-12-31",
    "source": "財政部公告資料",
    "sourceUrls": [
      "https://www.mof.gov.tw/",
      "https://www.etax.nat.gov.tw/"
    ]
  },
  "deductions": {
    "personalExemption": 101000,
    "seniorExemption": 151500,
    "standardSingle": 136000,
    "standardMarried": 272000,
    "salary": 227000,
    "disability": 227000,
    "education": 25000,
    "savings": { "limit": 270000 },
    "basicLivingExpense": { "perPerson": 213000 },
    "mortgageInterest": { "limit": 300000 },
    "rent": 180000,
    "preschool": 150000,
    "preschoolAdditional": 225000,
    "longTermCare": 180000
  },
  "taxBrackets": [
    { "min": 0, "max": 610000, "rate": 0.05, "quickDeduction": 0 }
  ]
}
```

## 專案結構

```text
IncomeTax/
├─ index.html
├─ css/
├─ data/
│  ├─ 2024.json
│  ├─ 2025.json
│  ├─ 2026.json
│  ├─ 2027.json
│  ├─ latest.json
│  └─ tax-data.js
├─ js/
│  ├─ app.js
│  ├─ tax-engine.js
│  ├─ deduction-engine.js
│  ├─ dependent-engine.js
│  ├─ planning-engine.js
│  ├─ orchestration.js
│  ├─ ui.js
│  ├─ storage.js
│  └─ state.js
└─ scripts/
   ├─ build-data.js
   ├─ validate-tax-data.js
   ├─ run-all-tests.js
   └─ tax-case-test.js
```

## 測試

```powershell
node scripts\run-all-tests.js
```

## 操作手冊

- 詳細使用流程請看 [操作手冊.md](操作手冊.md)。
- 手冊包含：
  - 年度選擇
  - 本人與配偶資料輸入
  - 扶養親屬收入與扣除額輸入
  - 股利課稅方式
  - 房貸與租金
  - 家庭申報最佳化
  - 五年稅負趨勢
  - 情境儲存與還原
  - 範例情境

## 典型操作流程

```text
1. 選擇年度
2. 輸入本人收入
3. 輸入配偶收入
4. 新增扶養親屬
5. 填寫各成員列舉扣除額
6. 選擇股利課稅方式
7. 查看試算結果
8. 查看家庭申報最佳化
9. 查看五年稅負趨勢
10. 必要時 Quick Save 情境
```

## 使用注意事項

- 本工具提供試算與規劃用途，正式申報仍以財政部公告與報稅系統為準。
- `2027.json` 目前為沿用 115 年度公告稅制作為試算資料，後續政府公告後應更新。
- 輸入資料保存在使用者本機瀏覽器，不會送到伺服器。
- 更新 `data/YYYY.json` 後一定要執行 `node scripts\build-data.js`。
