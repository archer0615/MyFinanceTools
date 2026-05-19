const assert = require("node:assert/strict");
const test = require("node:test");
const fs = require("node:fs");
const path = require("node:path");

test("theme colors meet basic contrast thresholds", () => {
  const css = fs.readFileSync(path.join(__dirname, "../frontend/style.css"), "utf8");
  const light = extractCssVars(css, ":root");
  const dark = extractCssVars(css, 'body[data-theme="dark"]');

  assert.ok(contrastRatio(light["--text"], light["--bg"]) >= 4.5);
  assert.ok(contrastRatio(light["--muted"], light["--bg"]) >= 4.5);
  assert.ok(contrastRatio(dark["--text"], dark["--bg"]) >= 4.5);
  assert.ok(contrastRatio(dark["--muted"], dark["--bg"]) >= 4.5);
});

function extractCssVars(css, selector) {
  const match = css.match(new RegExp(`${escapeRegExp(selector)}\\s*\\{([\\s\\S]*?)\\}`));
  const vars = {};
  if (!match) return vars;
  [...match[1].matchAll(/(--[\w-]+):\s*(#[0-9a-fA-F]{6})/g)].forEach((item) => {
    vars[item[1]] = item[2];
  });
  return vars;
}

function contrastRatio(foreground, background) {
  const foregroundLuminance = relativeLuminance(hexToRgb(foreground));
  const backgroundLuminance = relativeLuminance(hexToRgb(background));
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function relativeLuminance([red, green, blue]) {
  return [red, green, blue]
    .map((value) => {
      const normalized = value / 255;
      return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, value, index) => sum + value * [0.2126, 0.7152, 0.0722][index], 0);
}

function hexToRgb(value) {
  return [1, 3, 5].map((start) => parseInt(value.slice(start, start + 2), 16));
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
