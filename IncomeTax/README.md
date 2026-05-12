# 台灣綜合所得稅試算工具

- 這是一個純前端的台灣綜合所得稅試算工具。
- 可用瀏覽器直接開啟 `index.html` 使用，不需要後端服務。
- 目前內建 2024、2025、2026 年度稅制資料，預設年度由 `data/latest.json` 控制。

## 主要功能

- 支援單獨申報、夫妻合併申報、自動比較最佳申報方案。
- 支援本人與配偶的薪資所得、執行業務所得、股利所得、其他所得。
- 支援扶養親屬資料輸入，並計算相關免稅額與扣除額。
- 支援標準扣除額與列舉扣除額比較。
- 支援保險費、全民健保費、醫療費、生育費、捐贈、災害損失、房貸利息、租金、長照、幼兒學前、大專院校學費等扣除項目。
- 顯示最佳申報方式、總所得、總扣除額、綜合所得淨額、應納稅額、有效稅率、邊際稅率。
- 提供扣除額明細、扶養摘要、節稅分析與圖表。
- 支援深色主題、列印結果、複製分享連結。
- 使用 `localStorage` 保留使用者上次輸入狀態。

## 專案結構

```text
IncomeTax/
├─ index.html
├─ css/
│  ├─ style.css
│  ├─ form.css
│  ├─ result.css
│  └─ print.css
├─ js/
│  ├─ app.js
│  ├─ tax-engine.js
│  ├─ deduction-engine.js
│  ├─ dependent-engine.js
│  ├─ filing-strategy.js
│  ├─ ui.js
│  ├─ charts.js
│  ├─ formatter.js
│  ├─ share.js
│  ├─ state.js
│  └─ storage.js
├─ data/
│  ├─ 2024.json
│  ├─ 2025.json
│  ├─ 2026.json
│  ├─ latest.json
│  ├─ tax-data.js
│  └─ CHANGELOG.md
└─ scripts/
   ├─ build-data.js
   ├─ validate-tax-data.js
   ├─ smoke-test.js
   ├─ tax-case-test.js
   ├─ ui-static-test.js
   ├─ theme-static-test.js
   ├─ run-all-tests.js
   ├─ normalize-tax-data.js
   ├─ scrape-tax.js
   └─ generate-changelog.js
```

## 快速開始

- 用瀏覽器開啟 `index.html`。
- 選擇年度與申報模式。
- 輸入本人、配偶、扶養親屬與列舉扣除額資料。
- 系統會自動重新計算並更新試算結果。

## 資料來源與資料檔

- 年度稅制資料放在 `data/YYYY.json`。
- 預設使用年度放在 `data/latest.json`。
- 瀏覽器實際載入的整合資料是 `data/tax-data.js`。
- 稅制變更紀錄放在 `data/CHANGELOG.md`。
- 頁面顯示資料來源為財政部與財政部稅務入口網。

## 更新年度資料

- 修改或新增 `data/YYYY.json`。
- 如需調整預設年度，修改 `data/latest.json` 的 `currentYear`。
- 重新產生瀏覽器載入用資料：

```powershell
node scripts\build-data.js
```

- 驗證資料格式：

```powershell
node scripts\validate-tax-data.js
```

## 測試

- 執行全部測試：

```powershell
node scripts\run-all-tests.js
```

- 個別測試：

```powershell
node scripts\smoke-test.js
node scripts\tax-case-test.js
node scripts\ui-static-test.js
node scripts\theme-static-test.js
```

## 核心模組說明

- `js/app.js`：初始化頁面、載入年度資料、綁定表單事件、切換主題、觸發計算與渲染。
- `js/tax-engine.js`：計算所得稅額、有效稅率、邊際稅率。
- `js/deduction-engine.js`：計算免稅額、標準扣除額、列舉扣除額與特別扣除額。
- `js/dependent-engine.js`：處理扶養親屬相關計算。
- `js/filing-strategy.js`：比較單獨申報、夫妻合併申報與自動最佳方案。
- `js/ui.js`：讀取表單輸入、填入表單值、渲染結果與錯誤狀態。
- `js/charts.js`：繪製有效稅率、稅率級距與年度比較圖。
- `js/share.js`：將目前輸入狀態序列化到網址，產生可分享連結。
- `js/storage.js`：保存與讀取本機輸入狀態。
- `js/state.js`：定義前端預設狀態。
- `js/formatter.js`：格式化金額、百分比與顯示文字。

## 使用注意事項

- 本工具提供試算與比較用途，實際申報仍應以財政部公告與報稅系統為準。
- 若年度稅制資料更新，必須同步更新 `data/YYYY.json` 並重新產生 `data/tax-data.js`。
- 若瀏覽器限制剪貼簿權限，複製分享連結功能可能需要 HTTPS 或使用者授權。
- 因為是純前端工具，輸入資料主要保存在使用者本機瀏覽器，不會送到伺服器。
