const { spawnSync } = require("child_process");
const path = require("path");

const root = path.join(__dirname, "..");
const scripts = [
  "validate-tax-data.js",
  "smoke-test.js",
  "tax-case-test.js",
  "ui-static-test.js",
  "theme-static-test.js"
];

scripts.forEach((script) => {
  const result = spawnSync(process.execPath, [path.join("scripts", script)], {
    cwd: root,
    stdio: "inherit"
  });
  if (result.status !== 0) {
    process.exit(result.status || 1);
  }
});

console.log("全部測試通過");
