const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const dataDir = path.join(__dirname, "../data");

const files = fs
  .readdirSync(dataDir)
  .filter((file) => file.endsWith(".json"));

let currentYear = null;
const years = {};

for (const file of files) {
  const fullPath = path.join(dataDir, file);
  const json = JSON.parse(fs.readFileSync(fullPath, "utf8"));

  if (file === "latest.json") {
    currentYear = json.currentYear;
    continue;
  }

  const year = file.replace(".json", "");
  json.meta = Object.assign({ schemaVersion: 1 }, json.meta);
  years[year] = json;
}

const payload = {
  currentYear,
  years
};
payload.meta = {
  schemaVersion: 1,
  checksum: crypto.createHash("sha256").update(JSON.stringify(payload.years)).digest("hex")
};

const output = `window.IncomeTaxApp = window.IncomeTaxApp || {};
window.IncomeTaxApp.data = ${JSON.stringify(payload, null, 2)};
`;

fs.writeFileSync(path.join(dataDir, "tax-data.js"), output);

console.log("tax-data.js generated");
