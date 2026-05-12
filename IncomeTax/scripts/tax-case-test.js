const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const context = {
  window: {},
  Intl,
  Number,
  Math,
  String,
  Boolean,
  Array,
  Object,
  console
};

[
  "data/tax-data.js",
  "js/formatter.js",
  "js/state.js",
  "js/dependent-engine.js",
  "js/deduction-engine.js",
  "js/tax-engine.js",
  "js/filing-strategy.js"
].forEach((file) => {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const data = context.window.IncomeTaxApp.data.years["2026"];

function baseInput(overrides = {}) {
  return Object.assign({
    filingMode: "single",
    taxpayer: {
      salaryIncome: 800000,
      professionalIncome: 0,
      dividendIncome: 0,
      otherIncome: 0
    },
    spouse: {
      salaryIncome: 0,
      professionalIncome: 0,
      dividendIncome: 0,
      otherIncome: 0
    },
    dependents: [],
    deductions: {
      insuranceSelf: 0,
      insuranceSpouse: 0,
      insuranceDependents: 0,
      nationalHealthInsurance: 0,
      medical: 0,
      childbirth: 0,
      donationGeneral: 0,
      donationPolitical: 0,
      donationPublic: 0,
      disasterLoss: 0,
      mortgageInterest: 0,
      rent: 0,
      longTermCareCount: 0,
      preschoolChildren: 0,
      educationCount: 0
    }
  }, overrides);
}

function assertEqual(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}

const single = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput(), "separate");
assertEqual(single.grossIncome, 800000, "單身總所得");
assertEqual(single.totalDeductions, 464000, "單身總扣除額");
assertEqual(single.taxableIncome, 336000, "單身淨所得");
assertEqual(single.taxAmount, 16800, "單身應納稅額");

const joint = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  spouse: {
    salaryIncome: 600000,
    professionalIncome: 0,
    dividendIncome: 0,
    otherIncome: 0
  }
}), "joint");
assertEqual(joint.grossIncome, 1400000, "夫妻總所得");
assertEqual(joint.totalDeductions, 928000, "夫妻總扣除額");
assertEqual(joint.taxableIncome, 472000, "夫妻淨所得");
assertEqual(joint.taxAmount, 23600, "夫妻應納稅額");

console.log("稅務案例測試通過");
