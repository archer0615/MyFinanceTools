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
      interestIncome: 0,
      otherIncome: 0
    },
    spouse: {
      salaryIncome: 0,
      professionalIncome: 0,
      dividendIncome: 0,
      interestIncome: 0,
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
      isSelfUseResidence: false,
      hasHouseholdRegistration: false,
      isRented: false,
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
    interestIncome: 0,
    otherIncome: 0
  }
}), "joint");
assertEqual(joint.grossIncome, 1400000, "夫妻總所得");
assertEqual(joint.totalDeductions, 928000, "夫妻總扣除額");
assertEqual(joint.taxableIncome, 472000, "夫妻淨所得");
assertEqual(joint.taxAmount, 23600, "夫妻應納稅額");

const mortgage = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 800000,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 150000,
    otherIncome: 0
  },
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
    isSelfUseResidence: true,
    hasHouseholdRegistration: true,
    isRented: false,
    mortgageInterest: 280000,
    rent: 0,
    longTermCareCount: 0,
    preschoolChildren: 0,
    educationCount: 0
  }
}), "separate");
assertEqual(mortgage.grossIncome, 950000, "利息所得併入總所得");
assertEqual(mortgage.deductions.savings, 150000, "儲蓄投資特別扣除額");
assertEqual(mortgage.deductions.mortgageInterest, 130000, "房貸利息扣除額需扣除儲蓄扣除額");

const basicLiving = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 0,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 0,
    otherIncome: 0
  },
  dependents: [
    {
      relation: "child",
      birthYear: 2020,
      isSenior: false,
      disabled: false,
      sameHousehold: true
    },
    {
      relation: "child",
      birthYear: 2022,
      isSenior: false,
      disabled: false,
      sameHousehold: true
    }
  ]
}), "separate");
assertEqual(basicLiving.deductions.basicLiving.perPerson, 213000, "每人基本生活所需費用");
assertEqual(basicLiving.deductions.basicLiving.total, 639000, "基本生活費總額");
assertEqual(basicLiving.deductions.basicLivingDifference, 200000, "基本生活費差額");

console.log("稅務案例測試通過");
