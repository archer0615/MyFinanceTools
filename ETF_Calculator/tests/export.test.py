const assert = require("node:assert/strict");
const test = require("node:test");
const path = require("node:path");
const { loadScript } = require("./loadScript");

test("PNG export creates a download link from canvas data URL", () => {
  const clicks = [];
  const context = {
    document: {
      createElement: (tagName) => ({
        tagName,
        click: () => clicks.push(tagName)
      })
    }
  };
  loadScript(context, path.join(__dirname, "../frontend/export/pngExport.js"));

  const canvas = {
    toDataURL: (type) => `data:${type};base64,abc`
  };
  context.exportChartPng(canvas, "chart.png");

  assert.deepEqual(clicks, ["a"]);
});
