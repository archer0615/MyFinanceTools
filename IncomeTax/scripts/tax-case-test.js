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
assertEqual(mortgage.deductions.mortgageInterestExpense, 280000, "房貸利息支出需保留於結果");

const mortgageBlockedByHighSavings = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 800000,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 300000,
    otherIncome: 0
  },
  deductions: Object.assign({}, baseInput().deductions, {
    isSelfUseResidence: true,
    hasHouseholdRegistration: true,
    mortgageInterest: 200000
  })
}), "separate");
assertEqual(mortgageBlockedByHighSavings.deductions.mortgageInterest, 0, "儲蓄扣除額大於房貸利息時房貸可扣為 0");

[
  [0, 0],
  [100000, 100000],
  [270000, 270000],
  [500000, 270000]
].forEach(([interestIncome, expected]) => {
  assertEqual(
    context.window.IncomeTaxApp.deductions.calculateSavingsDeduction(data, interestIncome),
    expected,
    `儲蓄扣除額上限 ${interestIncome}`
  );
});

const mortgageBlockedBySavings = context.window.IncomeTaxApp.deductions.calculateMortgageDeduction(data, {
  isSelfUseResidence: true,
  hasHouseholdRegistration: true,
  isRented: false,
  mortgageInterest: 200000
}, 270000);
assertEqual(mortgageBlockedBySavings, 0, "房貸利息低於儲蓄扣除額時不可為負數");

const mortgageBlockedByRental = context.window.IncomeTaxApp.deductions.calculateMortgageDeduction(data, {
  isSelfUseResidence: true,
  hasHouseholdRegistration: true,
  isRented: true,
  mortgageInterest: 500000
}, 0);
assertEqual(mortgageBlockedByRental, 0, "出租住宅不可扣除購屋借款利息");

const mortgageBlockedByUnregistered = context.window.IncomeTaxApp.deductions.calculateMortgageDeduction(data, {
  isSelfUseResidence: true,
  hasHouseholdRegistration: false,
  isRented: false,
  mortgageInterest: 280000
}, 0);
assertEqual(mortgageBlockedByUnregistered, 0, "未設戶籍不可扣除購屋借款利息");

const legacySchema = context.window.IncomeTaxApp.deductions.applyDeductionDependencies(data, {
  taxpayer: {
    salaryIncome: 0,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 150000,
    otherIncome: 0
  },
  spouse: {
    salaryIncome: 0,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 0,
    otherIncome: 0
  },
  deductions: {
    isSelfUseResidence: true,
    hasHouseholdRegistration: true,
    isRented: false,
    mortgageInterest: 280000
  }
}, 1);
assertEqual(legacySchema.mortgageInterest, 130000, "純舊資料 schema 不 crash 且房貸可扣正確");

const validation = context.window.IncomeTaxApp.validation.validateTaxInputs(baseInput({
  taxpayer: {
    salaryIncome: 800000,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 300000,
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
    isSelfUseResidence: false,
    hasHouseholdRegistration: false,
    isRented: false,
    mortgageInterest: 200000,
    rent: 120000,
    longTermCareCount: 0,
    preschoolChildren: 0,
    educationCount: 0
  }
}));
assertEqual(validation.errors.length, 0, "validation 不阻止計算");
assertEqual(validation.warnings.includes("可能不可同時適用"), true, "房租房貸互斥提醒");
assertEqual(validation.warnings.includes("超過儲蓄投資特別扣除額上限"), true, "儲蓄扣除額上限提醒");

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

const strategy = context.window.IncomeTaxApp.strategy.compareFilingStrategies(data, baseInput({
  taxpayer: {
    salaryIncome: 800000,
    professionalIncome: 0,
    dividendIncome: 100000,
    interestIncome: 0,
    otherIncome: 0
  }
}));
assertEqual(strategy.household.persons.length, 2, "Household canonical persons");
assertEqual(strategy.strategyComparison.scenarios.length, 4, "情境列舉數");
assertEqual(strategy.strategyComparison.bestStrategy, "joint-combined", "情境排序需穩定");
assertEqual(strategy.diagnostics.length, 0, "診斷層輸出");

const smallDividendCombined = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 0,
    professionalIncome: 0,
    dividendIncome: 50000,
    interestIncome: 0,
    otherIncome: 0
  },
  dividendTaxMode: "combined"
}), "separate", "combined");
assertEqual(smallDividendCombined.dividendTaxCredit, 4250, "小額股利抵減");
assertEqual(smallDividendCombined.refundAmount, 4250, "小額股利可能退稅");

const largeDividendCombined = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 0,
    professionalIncome: 0,
    dividendIncome: 2000000,
    interestIncome: 0,
    otherIncome: 0
  },
  dividendTaxMode: "combined"
}), "separate", "combined");
assertEqual(largeDividendCombined.dividendTaxCredit, 80000, "股利抵減上限");

const highIncomeDividendAuto = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 12000000,
    professionalIncome: 0,
    dividendIncome: 1000000,
    interestIncome: 0,
    otherIncome: 0
  },
  dividendTaxMode: "auto"
}), "separate", "auto");
assertEqual(highIncomeDividendAuto.selectedDividendTaxMode, "separate", "高所得自動選擇分離課稅");

const lowIncomeDividendAuto = context.window.IncomeTaxApp.engine.calculateTax(data, baseInput({
  taxpayer: {
    salaryIncome: 0,
    professionalIncome: 0,
    dividendIncome: 100000,
    interestIncome: 0,
    otherIncome: 0
  },
  dividendTaxMode: "auto"
}), "separate", "auto");
assertEqual(lowIncomeDividendAuto.selectedDividendTaxMode, "combined", "低所得自動選擇合併計稅");

const projected = context.window.IncomeTaxApp.planning.projectNextYearIncome(baseInput(), {
  forecastYear: 2027,
  salaryGrowthRate: 10,
  dividendGrowthRate: 0,
  interestGrowthRate: 0
});
assertEqual(projected.taxpayer.salaryIncome, 880000, "明年薪資預估");

const members = context.window.IncomeTaxApp.planning.defaultHouseholdMembers(baseInput({
  taxpayer: {
    salaryIncome: 1300000,
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
  dependents: [
    { id: "C", name: "本人父", relation: "parent", salaryIncome: 100000, isSenior: true, sameHousehold: true },
    { id: "D", name: "本人母", relation: "parent", isSenior: true, sameHousehold: true }
  ]
}));
const combos = context.window.IncomeTaxApp.planning.generateFilingCombinations(members);
assertEqual(combos.some((combo) => combo.join("+") === "A"), true, "產生 A 單獨申報");
assertEqual(combos.some((combo) => combo.join("+") === "A+C+D"), true, "產生 A+C+D 申報");
assertEqual(combos.some((combo) => combo.join("+") === "A+B"), true, "產生 A+B 申報");
const comboA = context.window.IncomeTaxApp.planning.simulateCombinationTax(data, baseInput({
  taxpayer: {
    salaryIncome: 1300000,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 0,
    otherIncome: 0
  }
}), members, ["A"]);
assertEqual(comboA.taxBracket, "12%", "A 單獨申報 12% 稅率");
const comboACD = context.window.IncomeTaxApp.planning.simulateCombinationTax(data, baseInput({
  taxpayer: {
    salaryIncome: 1300000,
    professionalIncome: 0,
    dividendIncome: 0,
    interestIncome: 0,
    otherIncome: 0
  }
}), members, ["A", "C", "D"]);
assertEqual(comboACD.taxBracket, "5%", "A+C+D 申報 5% 稅率");
const rankedFamily = context.window.IncomeTaxApp.planning.rankCombinationResults([comboA, comboACD]);
assertEqual(rankedFamily[0].combinationId, "A+C+D", "最佳方案排名正確");
assertEqual(rankedFamily[0].combinationName, "本人 + 本人父 + 本人母", "組合顯示名稱");
assertEqual(comboACD.result.grossIncome, 1400000, "扶養收入併入組合試算");

const scenarioProjection = context.window.IncomeTaxApp.planning.applyScenarioProjection(baseInput(), {
  salaryChange: 100000,
  dividendChange: 50000
});
assertEqual(scenarioProjection.taxpayer.salaryIncome, 900000, "情境薪資變動");
assertEqual(scenarioProjection.taxpayer.dividendIncome, 50000, "情境股利變動");

const multiYear = context.window.IncomeTaxApp.planning.simulateMultiYearTax(context.window.IncomeTaxApp.data, baseInput(), 2026, 5, {});
assertEqual(multiYear.length, 5, "五年稅負模擬");

const optimized = context.window.IncomeTaxApp.planning.optimizeTaxStrategy([comboA, comboACD], "minTax", {});
assertEqual(optimized.combinationId, "A+C+D", "最低應納稅最佳化");

const explanation = context.window.IncomeTaxApp.planning.generateTaxExplanation(comboA.result, comboACD.result);
assertEqual(explanation.length > 0, true, "可解釋稅務分析");

const delta = context.window.IncomeTaxApp.planning.calculateTaxDelta(comboA.result, comboACD.result);
assertEqual(Number.isFinite(delta.payableTax), true, "方案差異分析");
const scored = context.window.IncomeTaxApp.planning.scoreRecommendations([comboA, comboACD]);
assertEqual(scored.every((item) => item.confidence), true, "推薦信心分數");
const impact = context.window.IncomeTaxApp.planning.rankTaxImpactFactors(comboA.result, comboACD.result);
assertEqual(impact.length, 5, "稅負影響因素排序");
const derived = context.window.IncomeTaxApp.planning.deriveTaxState(baseInput(), { salaryChange: 1 });
assertEqual(derived.scenario.taxpayer.salaryIncome, 800001, "derived-state engine");

console.log("稅務案例測試通過");
