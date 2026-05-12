const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const requiredDeductions = [
  "personalExemption",
  "standardSingle",
  "standardMarried",
  "salary",
  "education",
  "rent",
  "longTermCare"
];

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateFile(filePath) {
  const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
  assert(data.meta && Number.isInteger(data.meta.year), `${filePath}: meta.year is required`);
  assert(data.meta.schemaVersion === 1, `${filePath}: meta.schemaVersion must be 1`);
  assert(data.deductions && typeof data.deductions === "object", `${filePath}: deductions is required`);
  assert(Array.isArray(data.taxBrackets) && data.taxBrackets.length > 0, `${filePath}: taxBrackets is required`);

  requiredDeductions.forEach((key) => {
    assert(Number.isFinite(data.deductions[key]) && data.deductions[key] >= 0, `${filePath}: invalid deduction ${key}`);
  });

  let previousMax = -1;
  data.taxBrackets.forEach((bracket, index) => {
    assert(Number.isFinite(bracket.min) && bracket.min >= 0, `${filePath}: invalid min at bracket ${index}`);
    assert(bracket.max === null || Number.isFinite(bracket.max), `${filePath}: invalid max at bracket ${index}`);
    assert(Number.isFinite(bracket.rate) && bracket.rate >= 0 && bracket.rate <= 1, `${filePath}: invalid rate at bracket ${index}`);
    assert(Number.isFinite(bracket.quickDeduction) && bracket.quickDeduction >= 0, `${filePath}: invalid quickDeduction at bracket ${index}`);
    assert(bracket.min > previousMax, `${filePath}: brackets must be increasing at bracket ${index}`);
    assert(bracket.max === null || bracket.max > bracket.min, `${filePath}: max must be greater than min at bracket ${index}`);
    previousMax = bracket.max === null ? Number.MAX_SAFE_INTEGER : bracket.max;
  });
  return data;
}

function validateYearOverYear(files, yearlyData) {
  const sorted = files.map((file) => file.replace(".json", "")).sort();
  sorted.slice(1).forEach((year, index) => {
    const previous = yearlyData[sorted[index]].deductions;
    const current = yearlyData[year].deductions;
    Object.keys(current).forEach((key) => {
      if (previous[key] === 0 || previous[key] === undefined) {
        return;
      }
      const diffRatio = Math.abs(current[key] - previous[key]) / previous[key];
      assert(diffRatio <= 0.5, `${year}: deduction ${key} changed more than 50%`);
    });
  });
}

function validateBuiltData(dataDir, yearlyData) {
  const builtPath = path.join(dataDir, "tax-data.js");
  if (!fs.existsSync(builtPath)) {
    return;
  }
  const source = fs.readFileSync(builtPath, "utf8");
  const match = source.match(/window\.IncomeTaxApp\.data\s*=\s*([\s\S]*?);\s*$/);
  assert(match, "tax-data.js must assign window.IncomeTaxApp.data");
  const payload = JSON.parse(match[1]);
  const checksum = crypto.createHash("sha256").update(JSON.stringify(payload.years)).digest("hex");
  assert(payload.meta && payload.meta.checksum === checksum, "tax-data.js checksum mismatch");
}

function main() {
  const dataDir = path.join(__dirname, "..", "data");
  const files = fs.readdirSync(dataDir).filter((file) => /^\d{4}\.json$/.test(file));
  assert(files.length > 0, "No yearly tax data found");
  const yearlyData = {};
  files.forEach((file) => {
    yearlyData[file.replace(".json", "")] = validateFile(path.join(dataDir, file));
  });
  validateYearOverYear(files, yearlyData);
  validateBuiltData(dataDir, yearlyData);
  JSON.parse(fs.readFileSync(path.join(dataDir, "latest.json"), "utf8"));
  console.log(`Validated ${files.length} yearly tax data files`);
}

main();
