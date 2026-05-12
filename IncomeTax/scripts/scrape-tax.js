const fs = require("fs");
const path = require("path");
const { normalize, normalizeText } = require("./normalize-tax-data");

function findByKeyword(items, keyword) {
  const normalizedKeyword = normalizeText(keyword);
  return items.find((item) => normalizeText(JSON.stringify(item)).includes(normalizedKeyword));
}

const records = [
  {
    year: 2024,
    updatedAt: "2026-05-12",
    source: "財政部、財政部稅務入口網",
    sourceUrls: [
      "https://www.mof.gov.tw/",
      "https://www.etax.nat.gov.tw/"
    ],
    deductions: {
      personalExemption: 97000,
      seniorExemption: 145500,
      standardSingle: 131000,
      standardMarried: 262000,
      salary: 218000,
      disability: 218000,
      education: 25000,
      rent: 180000,
      preschool: 120000,
      preschoolAdditional: 225000,
      longTermCare: 120000
    },
    taxBrackets: [
      { min: 0, max: 590000, rate: 0.05, quickDeduction: 0 },
      { min: 590001, max: 1330000, rate: 0.12, quickDeduction: 41300 },
      { min: 1330001, max: 2660000, rate: 0.2, quickDeduction: 147700 },
      { min: 2660001, max: 4980000, rate: 0.3, quickDeduction: 413700 },
      { min: 4980001, max: null, rate: 0.4, quickDeduction: 911700 }
    ]
  },
  {
    year: 2025,
    updatedAt: "2026-05-12",
    source: "財政部、財政部稅務入口網",
    sourceUrls: [
      "https://www.mof.gov.tw/",
      "https://www.etax.nat.gov.tw/"
    ],
    deductions: {
      personalExemption: 97000,
      seniorExemption: 145500,
      standardSingle: 131000,
      standardMarried: 262000,
      salary: 218000,
      disability: 218000,
      education: 25000,
      rent: 180000,
      preschool: 150000,
      preschoolAdditional: 225000,
      longTermCare: 180000
    },
    taxBrackets: [
      { min: 0, max: 590000, rate: 0.05, quickDeduction: 0 },
      { min: 590001, max: 1330000, rate: 0.12, quickDeduction: 41300 },
      { min: 1330001, max: 2660000, rate: 0.2, quickDeduction: 147700 },
      { min: 2660001, max: 4980000, rate: 0.3, quickDeduction: 413700 },
      { min: 4980001, max: null, rate: 0.4, quickDeduction: 911700 }
    ]
  },
  {
    year: 2026,
    updatedAt: "2026-05-12",
    source: "財政部、財政部稅務入口網；2026 為預估試算資料",
    sourceUrls: [
      "https://www.mof.gov.tw/",
      "https://www.etax.nat.gov.tw/"
    ],
    deductions: {
      personalExemption: 101000,
      seniorExemption: 151500,
      standardSingle: 136000,
      standardMarried: 272000,
      salary: 227000,
      disability: 227000,
      education: 25000,
      rent: 180000,
      preschool: 150000,
      preschoolAdditional: 225000,
      longTermCare: 180000
    },
    taxBrackets: [
      { min: 0, max: 610000, rate: 0.05, quickDeduction: 0 },
      { min: 610001, max: 1380000, rate: 0.12, quickDeduction: 42700 },
      { min: 1380001, max: 2770000, rate: 0.2, quickDeduction: 153100 },
      { min: 2770001, max: 5190000, rate: 0.3, quickDeduction: 430100 },
      { min: 5190001, max: null, rate: 0.4, quickDeduction: 949100 }
    ]
  }
];

function getCurrentTaxYear() {
  return Math.max(...records.map((record) => record.year));
}

async function main() {
  const dataDir = path.join(__dirname, "..", "data");
  fs.mkdirSync(dataDir, { recursive: true });
  records.forEach((record) => {
    const data = normalize(record);
    fs.writeFileSync(path.join(dataDir, `${data.meta.year}.json`), JSON.stringify(data, null, 2) + "\n");
  });
  fs.writeFileSync(path.join(dataDir, "latest.json"), JSON.stringify({ currentYear: getCurrentTaxYear() }, null, 2) + "\n");
  console.log(`Updated tax data through ${getCurrentTaxYear()}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

module.exports = { normalizeText, findByKeyword };
