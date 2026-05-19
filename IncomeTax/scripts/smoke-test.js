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
  "js/planning-engine.js",
  "js/household-model.js",
  "js/validation-engine.js",
  "js/orchestration.js",
  "js/filing-strategy.js"
].forEach((file) => {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), "utf8"), context, { filename: file });
});

const data = context.window.IncomeTaxApp.data.years["2026"];
const input = {
  filingMode: "auto",
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
  dependents: [
    {
      relation: "parent",
      birthYear: 1950,
      isSenior: true,
      disabled: true,
      sameHousehold: true
    }
  ],
  deductions: {
    insuranceSelf: 30000,
    insuranceSpouse: 0,
    insuranceDependents: 30000,
    nationalHealthInsurance: 20000,
    medical: 0,
    childbirth: 0,
    donationGeneral: 0,
    donationPolitical: 0,
    donationPublic: 0,
    disasterLoss: 0,
    mortgageInterest: 0,
    rent: 180000,
    longTermCareCount: 1,
    preschoolChildren: 0,
    educationCount: 0
  }
};

const result = context.window.IncomeTaxApp.strategy.compareFilingStrategies(data, input);

if (!Number.isFinite(result.activeResult.taxAmount)) {
  throw new Error("應納稅額不是有效數字");
}

if (result.activeResult.deductions.dependent.count !== 1) {
  throw new Error("扶養人數計算錯誤");
}

if (result.activeResult.deductions.dependent.disabledCount !== 1) {
  throw new Error("身障扶養計算錯誤");
}

if (!["joint", "separate"].includes(result.recommended)) {
  throw new Error("最佳申報方式回傳錯誤");
}

console.log("煙霧測試通過");
