const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const style = fs.readFileSync(path.join(root, "css", "style.css"), "utf8");
const result = fs.readFileSync(path.join(root, "css", "result.css"), "utf8");
const form = fs.readFileSync(path.join(root, "css", "form.css"), "utf8");
const app = fs.readFileSync(path.join(root, "js", "app.js"), "utf8");
const state = fs.readFileSync(path.join(root, "js", "state.js"), "utf8");
const storage = fs.readFileSync(path.join(root, "js", "storage.js"), "utf8");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

[
  "--bg",
  "--panel",
  "--field",
  "--soft",
  "--text",
  "--label",
  "--muted",
  "--line",
  "--accent",
  "--accent-strong",
  "--accent-soft"
].forEach((token) => {
  assert(style.includes(token), `缺少色彩變數 ${token}`);
});

assert(html.includes('aria-pressed="false"'), "深色主題按鈕缺少狀態標記");
assert(app.includes('button.textContent = isDark ? "淺色主題" : "深色主題"'), "主題切換文字未更新");
assert(state.includes('theme: "light"'), "預設主題狀態不存在");
assert(storage.includes("theme: state.theme"), "主題狀態未保存");
assert(result.includes("var(--soft)") && result.includes("var(--field)"), "結果區塊未使用主題變數");
assert(form.includes("var(--field)") && form.includes("var(--soft)"), "表單區塊未使用主題變數");

console.log("主題靜態測試通過");
