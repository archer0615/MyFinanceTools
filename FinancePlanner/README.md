# FinancePlanner

## 使用方式

- 直接開啟 `index.html` 即可使用
- `index.html` 目前載入 `dist/bundle.js`
- `bundle.js` 是由多個原始 JS 檔案產生
- 若只改 HTML 或 CSS，不需要重新產生 `bundle.js`
- 若修改任何 JS 原始檔，需要重新執行建置指令

## 建置指令

```powershell
node scripts/build-bundle.js
```

## 檔案說明

- `index.html`：主頁面
- `styles.css`：樣式
- `dist/bundle.js`：瀏覽器實際載入的整合 JS
- `scripts/build-bundle.js`：產生 `dist/bundle.js` 的建置腳本
- `vendor/echarts.min.js`：本地 ECharts 圖表套件
- `state.js`：預設資料與狀態工具
- `calculations.js`：核心財務計算
- `financeMetrics.js`：財務指標
- `decisionMetrics.js`：決策指標
- `analysisMetrics.js`：分析指標
- `automationInsights.js`：自動分類與洞察
- `experienceMetrics.js`：體驗型指標
- `amortization.js`：攤還表計算
- `storage.js`：匯入、匯出、儲存與重設
- `ui.js`：主要畫面互動與渲染
- `app.js`：初始化入口
- `ui/guideEngine.js`：導引訊息
- `engines/decisionEngine.js`：決策建議
- `charts/chartConfigs.js`：圖表設定
- `charts/chartDataAdapter.js`：圖表資料轉換
- `charts/chartService.js`：圖表渲染服務

## 開發流程

1. 修改原始 JS 檔案
2. 執行 `node scripts/build-bundle.js`
3. 開啟或重新整理 `index.html`
4. 確認功能正常

## 注意事項

- 不建議直接修改 `dist/bundle.js`
- `dist/bundle.js` 會被 `scripts/build-bundle.js` 重新產生並覆蓋
- ECharts 已改為本地檔案 `vendor/echarts.min.js`
- 目前主要功能可直接開啟 `index.html` 離線使用
