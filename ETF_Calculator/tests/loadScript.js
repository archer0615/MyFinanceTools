const fs = require("node:fs");
const vm = require("node:vm");

function loadScript(context, filePath) {
  vm.runInNewContext(fs.readFileSync(filePath, "utf8"), context, { filename: filePath });
  return context;
}

function loadScriptWithExports(context, filePath, exportNames) {
  const source = fs.readFileSync(filePath, "utf8");
  const exportsSource = exportNames.map((name) => `globalThis.${name} = ${name};`).join("\n");
  vm.runInNewContext(`${source}\n${exportsSource}`, context, { filename: filePath });
  return context;
}

module.exports = { loadScript, loadScriptWithExports };
