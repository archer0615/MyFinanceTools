const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "tax-data.js");
const outputPath = path.join(__dirname, "..", "data", "CHANGELOG.md");
const source = fs.readFileSync(dataPath, "utf8");
const json = source.match(/window\.IncomeTaxApp\.data\s*=\s*([\s\S]*?);\s*$/)[1];
const data = JSON.parse(json);
const lines = ["# Tax Data Changelog", ""];

Object.keys(data.years).sort().forEach((year, index, years) => {
  const item = data.years[year];
  lines.push(`# ${year} 稅制變更`, "");
  lines.push(`- 最後更新：${item.meta.updatedAt}`);
  if (index > 0) {
    const previous = data.years[years[index - 1]];
    Object.keys(item.deductions).forEach((key) => {
      const diff = item.deductions[key] - previous.deductions[key];
      if (diff !== 0) {
        lines.push(`- ${key} ${diff > 0 ? "+" : ""}${diff}`);
      }
    });
  }
  lines.push("");
});

fs.writeFileSync(outputPath, `${lines.join("\n")}\n`, "utf8");
