const fs = require("fs");

function normalizeNumber(value) {
  if (typeof value === "number") {
    return value;
  }
  return Number(String(value || "").replace(/[^\d.]/g, ""));
}

function normalizeText(value) {
  return String(value || "")
    .replace(/[，]/g, ",")
    .replace(/[。]/g, ".")
    .replace(/[：]/g, ":")
    .replace(/[；]/g, ";")
    .replace(/[（）]/g, "")
    .replace(/\s+/g, "");
}

function normalize(raw) {
  return {
    meta: {
      schemaVersion: 1,
      year: normalizeNumber(raw.year),
      updatedAt: raw.updatedAt || new Date().toISOString().slice(0, 10),
      source: raw.source || "財政部、財政部稅務入口網",
      sourceUrls: Array.isArray(raw.sourceUrls) ? raw.sourceUrls : []
    },
    deductions: {
      personalExemption: normalizeNumber(raw.deductions.personalExemption),
      seniorExemption: normalizeNumber(raw.deductions.seniorExemption),
      standardSingle: normalizeNumber(raw.deductions.standardSingle),
      standardMarried: normalizeNumber(raw.deductions.standardMarried),
      salary: normalizeNumber(raw.deductions.salary),
      disability: normalizeNumber(raw.deductions.disability),
      education: normalizeNumber(raw.deductions.education),
      rent: normalizeNumber(raw.deductions.rent),
      preschool: normalizeNumber(raw.deductions.preschool),
      preschoolAdditional: normalizeNumber(raw.deductions.preschoolAdditional || raw.deductions.preschool),
      longTermCare: normalizeNumber(raw.deductions.longTermCare)
    },
    taxBrackets: raw.taxBrackets.map((bracket) => ({
      min: normalizeNumber(bracket.min),
      max: bracket.max === null ? null : normalizeNumber(bracket.max),
      rate: Number(bracket.rate),
      quickDeduction: normalizeNumber(bracket.quickDeduction)
    }))
  };
}

function main() {
  const input = process.argv[2];
  const output = process.argv[3];
  if (!input || !output) {
    throw new Error("Usage: node scripts/normalize-tax-data.js input.json output.json");
  }
  const data = normalize(JSON.parse(fs.readFileSync(input, "utf8")));
  fs.writeFileSync(output, JSON.stringify(data, null, 2) + "\n");
}

if (require.main === module) {
  main();
}

module.exports = { normalize, normalizeText };
