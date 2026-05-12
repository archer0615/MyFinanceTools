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

assert(html.indexOf('<section class="panel result-panel"') < html.indexOf('<section class="panel input-panel"'), "結果頁面必須在試算資料上方");
assert(html.includes('id="themeToggle"'), "缺少深色主題切換按鈕");
assert(html.includes("深色主題"), "缺少深色主題文字");
assert(html.includes('id="shareButton"'), "缺少分享連結按鈕");
assert(html.includes("js/share.js"), "缺少分享功能腳本");
assert(html.includes("扣除額明細"), "扣除額標題未中文化");
assert(app.includes("dark-theme"), "深色主題切換邏輯不存在");
assert(app.includes("新增扶養親屬") || html.includes("新增扶養親屬"), "扶養新增按鈕不存在");
assert(style.includes("body.dark-theme"), "深色主題樣式不存在");

console.log("介面靜態測試通過");
