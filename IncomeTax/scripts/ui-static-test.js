const fs = require("fs");
const path = require("path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const app = fs.readFileSync(path.join(__dirname, "..", "js", "app.js"), "utf8");
const style = fs.readFileSync(path.join(__dirname, "..", "css", "style.css"), "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

assert(html.includes('<main class="workspace-shell">'), "缺少 workspace shell");
assert(html.includes('household-panel'), "缺少 household panel");
assert(html.includes('input-panel person-editor-panel'), "缺少 person editor panel");
assert(html.includes('panel-primary result-panel'), "缺少 result panel");
assert(html.includes('year-panel tax-knowledge-panel'), "缺少 tax knowledge panel");
assert(html.includes('class="header-toolbar"'), "缺少 header toolbar");
assert(html.includes('class="results-stack"'), "缺少 results stack");
assert(html.includes('class="accordion-toggle"'), "缺少 accordion toggle");
assert(html.indexOf('person-editor-panel') < html.indexOf('result-panel'), "legacy form 必須保留在結果前");
assert(html.includes('id="themeToggle"'), "缺少深色主題切換按鈕");
assert(html.includes("深色主題"), "缺少深色主題文字");
assert(!html.includes('id="shareButton"'), "不應顯示分享連結按鈕");
assert(!html.includes('id="printButton"'), "不應顯示列印按鈕");
assert(!html.includes("js/share.js"), "不應載入分享功能腳本");
assert(!app.includes("window.print"), "不應保留列印功能");
assert(html.includes("扣除額明細"), "扣除額標題未中文化");
assert(app.includes("dark-theme"), "深色主題切換邏輯不存在");
assert(app.includes("新增扶養親屬") || html.includes("新增扶養親屬"), "扶養新增按鈕不存在");
assert(style.includes("body.dark-theme"), "深色主題樣式不存在");

console.log("介面靜態測試通過");
