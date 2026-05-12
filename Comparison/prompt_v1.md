請幫我建立一個純前端工具：

專案名稱：
Comparison

資料夾: Comparison

功能：
提前還房貸 vs ETF 投資比較器

目的：
比較：
1. 提前還貸
2. ETF 投資

哪個長期淨資產較高。

技術限制：

- 只能使用原生 HTML/CSS/JavaScript
- 禁止 React
- 禁止 Vue
- 禁止 npm
- 禁止 TypeScript
- 禁止 webpack/vite/parcel
- 禁止 backend
- 禁止 API
- 禁止任何 framework
- 禁止任何第三方 library
- 禁止 CDN
- 禁止 module import/export

必須：

- 支援 file://
- 可直接雙擊 index.html 開啟
- 離線可使用
- 不依賴 localhost
- 不發送任何 network request

專案結構：

FireEmulator/
├── index.html
├── style.css
├── app.js
└── assets/

禁止新增：
- package.json
- node_modules
- build tools 設定

輸入欄位：

- 房貸餘額
- 房貸利率
- 剩餘年限
- ETF 年化報酬
- 通膨率
- 稅率

計算規則：

房貸：
- 使用本息平均攤還
- 提前還款視為一次性償還本金
- 計算剩餘利息節省

ETF：
- 使用年化複利
- 每年複利一次

通膨：
- 使用實質報酬率
- 顯示扣除通膨後結果

稅率：
- ETF 投資收益需扣稅

輸出：

- 提前還貸節省利息
- ETF 投資未來價值
- 淨資產差異
- 建議方案

建議邏輯：

若 ETF 實質報酬率 > 房貸利率：
- 建議 ETF 投資

否則：
- 建議提前還貸

可視化：

- 使用原生 Canvas 或 SVG
- 雙路徑資產曲線
- 利息節省圖

禁止：
- chart.js
- d3
- echarts

UI 要求：

- 單頁式設計
- 深色模式
- 響應式設計
- 手機可使用
- 現代簡潔風格

互動需求：

- 輸入即時重新計算
- 圖表同步更新
- 數值需驗證
- 錯誤需提示

程式要求：

- 所有 JS 寫在 app.js
- 所有 CSS 寫在 style.css
- 不可 inline script/style
- 函式模組化
- 加入註解

請直接輸出完整可執行專案。

不要解釋。
不要教學。
不要省略。
直接提供完整檔案內容。