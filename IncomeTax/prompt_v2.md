# 修正專案支援 file:// 直接開啟使用

目前專案使用：

```js
fetch('./data/latest.json')
```

這會導致：

- file:// 無法使用
- 雙擊 index.html 無法運作
- 部分瀏覽器因 CORS/security policy 阻擋 fetch local file

需要改成：

# 新架構

改為：

- build 階段產生：
  - data/tax-data.js

前端：

- 不再 fetch json
- 改為 script 載入 JS data file

這樣：

- 可直接雙擊 index.html
- 完全支援 file://
- GitHub Pages 正常
- 離線正常
- 不需 localhost

---

# 必須修改

## 移除

```text
js/data-loader.js
```

內所有 fetch json 邏輯。

---

# 新增

## scripts/build-data.js

功能：

- 讀取 data/*.json
- 合併所有年度資料
- 產生：
  - data/tax-data.js

---

# build-data.js 要求

使用：

- Node.js built-in fs
- Node.js built-in path

禁止：

- npm
- third-party packages

---

# build-data.js 行為

讀取：

```text
data/latest.json
data/2024.json
data/2025.json
...
```

產生：

```js
window.LATEST_TAX_DATA = {
  currentYear: 2025,

  years: {
    "2024": {...},
    "2025": {...}
  }
};
```

輸出檔案：

```text
data/tax-data.js
```

---

# build-data.js 實作

直接建立完整可執行版本：

```js
const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../data');

const files = fs
  .readdirSync(dataDir)
  .filter(file => file.endsWith('.json'));

let currentYear = null;

const years = {};

for (const file of files) {
  const fullPath = path.join(dataDir, file);

  const json = JSON.parse(
    fs.readFileSync(fullPath, 'utf8')
  );

  if (file === 'latest.json') {
    currentYear = json.currentYear;
    continue;
  }

  const year = file.replace('.json', '');

  years[year] = json;
}

const output = `
window.LATEST_TAX_DATA = ${JSON.stringify({
  currentYear,
  years
}, null, 2)};
`;

fs.writeFileSync(
  path.join(dataDir, 'tax-data.js'),
  output
);

console.log('tax-data.js generated');
```

---

# index.html 修改

在：

```html
<script src="./js/app.js"></script>
```

之前加入：

```html
<script src="./data/tax-data.js"></script>
```

例如：

```html
<script src="./data/tax-data.js"></script>
<script src="./js/tax-engine.js"></script>
<script src="./js/ui.js"></script>
<script src="./js/app.js"></script>
```

---

# app.js 修改

移除：

```js
await loadLatestTaxData()
```

改為：

```js
const taxData = window.LATEST_TAX_DATA;
```

取得目前年度：

```js
const currentYear = taxData.currentYear;

const currentData =
  taxData.years[currentYear];
```

---

# 完全禁止

前端禁止：

```js
fetch('./data/*.json')
```

因為：

file:// 下會失敗。

---

# GitHub Actions 修改

workflow 增加：

```yaml
- name: Build tax data
  run: node scripts/build-data.js
```

放在 deploy 前。

---

# GitHub Actions 完整流程

1. scrape 財政部資料
2. 產生年度 json
3. build-data.js
4. 產生 tax-data.js
5. deploy GitHub Pages

---

# scripts/scrape-tax.js 修改

每次 scrape 完：

更新：

```text
data/latest.json
```

例如：

```json
{
  "currentYear": 2026
}
```

---

# 前端初始化流程

app.js：

```js
document.addEventListener('DOMContentLoaded', () => {
  const taxData = window.LATEST_TAX_DATA;

  if (!taxData) {
    alert('無法載入稅率資料');
    return;
  }

  const currentYear = taxData.currentYear;

  const currentData =
    taxData.years[currentYear];

  initializeUI(currentData);
});
```

---

# UI 必須顯示

```text
使用 2025 年度綜所稅資料
```

以及：

```text
最後更新：2026-05-01
```

資料來自：

```js
currentData.meta.updatedAt
```

---

# 專案目標

完成後：

## 本機

使用者：

直接雙擊：

```text
index.html
```

即可使用。

不需：

- localhost
- live server
- npm start

---

# GitHub Pages

也必須正常運作。

---

# 驗證條件

以下必須成立：

## file://

```text
file:///Users/xxx/index.html
```

可正常使用。

---

## GitHub Pages

```text
https://xxx.github.io/tax-tool/
```

可正常使用。

---

# 最終要求

請直接修改現有專案。

不要重建專案。

保留：

- 純 HTML/CSS/JS
- 無 framework
- 無 npm
- 無 build tool

只修改：

- data loading architecture
- build-data.js
- app initialization flow
- GitHub Actions workflow