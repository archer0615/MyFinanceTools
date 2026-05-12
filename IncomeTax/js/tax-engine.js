(function () {
  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? number : 0;
  }

  function findBracket(brackets, taxableIncome) {
    return brackets.find(function (bracket) {
      const max = bracket.max === null ? Infinity : bracket.max;
      return taxableIncome >= bracket.min && taxableIncome <= max;
    }) || brackets[brackets.length - 1];
  }

  function sumIncome(person) {
    return toNumber(person.salaryIncome) + toNumber(person.professionalIncome) + toNumber(person.dividendIncome) + toNumber(person.otherIncome);
  }

  function buildDeductionSet(data, input, options) {
    const deductions = data.deductions;
    const spouseIncluded = options.spouseIncluded;
    const taxpayerCount = spouseIncluded ? 2 : 1;
    const dependentDeduction = window.IncomeTaxApp.dependents.calculateDependentDeduction(data, input.dependents || []);
    const itemized = window.IncomeTaxApp.deductions.calculateItemizedDeduction(data, input, taxpayerCount);
    const standard = spouseIncluded ? deductions.standardMarried : deductions.standardSingle;
    const deductionStrategy = compareDeductionStrategies(data, input, options);
    const useItemized = deductionStrategy.bestStrategy === "itemized";
    const baseDeduction = useItemized ? itemized.total : standard;
    const taxpayerSalary = Math.min(toNumber(input.taxpayer.salaryIncome), deductions.salary || 0);
    const spouseSalary = spouseIncluded ? Math.min(toNumber(input.spouse.salaryIncome), deductions.salary || 0) : 0;
    const educationDeduction = toNumber(input.deductions.educationCount) * (deductions.education || 0);
    const preschoolChildren = toNumber(input.deductions.preschoolChildren);
    const preschoolDeduction = preschoolChildren === 0 ? 0 : (deductions.preschool || 0) + Math.max(0, preschoolChildren - 1) * (deductions.preschoolAdditional || deductions.preschool || 0);
    const longTermCareDeduction = toNumber(input.deductions.longTermCareCount) * (deductions.longTermCare || 0);
    const special = taxpayerSalary + spouseSalary + educationDeduction + preschoolDeduction + longTermCareDeduction;
    const exemption = deductions.personalExemption * taxpayerCount + dependentDeduction.exemption + dependentDeduction.disability;
    const total = exemption + baseDeduction + special;

    return {
      mode: useItemized ? "列舉扣除額" : "標準扣除額",
      exemption: exemption,
      standard: standard,
      itemized: itemized.total,
      itemizedBreakdown: itemized.breakdown,
      base: baseDeduction,
      salary: taxpayerSalary + spouseSalary,
      rent: itemized.breakdown.rentSpecial,
      education: educationDeduction,
      preschool: preschoolDeduction,
      longTermCare: longTermCareDeduction,
      dependent: dependentDeduction,
      total: total,
      advantage: Math.abs(itemized.total - standard)
    };
  }

  function compareDeductionStrategies(data, input, options) {
    const taxpayerCount = options.spouseIncluded ? 2 : 1;
    const standard = options.spouseIncluded ? data.deductions.standardMarried : data.deductions.standardSingle;
    const itemized = window.IncomeTaxApp.deductions.calculateItemizedDeduction(data, input, taxpayerCount).total;
    const bestStrategy = itemized > standard ? "itemized" : "standard";
    return {
      bestStrategy: bestStrategy,
      savedTax: Math.max(0, itemized - standard),
      standard: standard,
      itemized: itemized
    };
  }

  function calculateByMode(data, input, options) {
    const spouseIncluded = options.spouseIncluded;
    const grossIncome = sumIncome(input.taxpayer) + (spouseIncluded ? sumIncome(input.spouse) : 0);
    const deductions = buildDeductionSet(data, input, options);
    const taxableIncome = Math.max(0, grossIncome - deductions.total);
    const bracket = findBracket(data.taxBrackets, taxableIncome);
    const taxAmount = Math.max(0, Math.round(taxableIncome * bracket.rate - bracket.quickDeduction));

    return {
      filingType: spouseIncluded ? "joint" : "separate",
      grossIncome: grossIncome,
      totalDeductions: deductions.total,
      taxableIncome: taxableIncome,
      taxAmount: taxAmount,
      effectiveRate: grossIncome > 0 ? taxAmount / grossIncome : 0,
      marginalRate: bracket.rate,
      bracket: bracket,
      deductions: deductions
    };
  }

  function calculateTax(data, input, filingType) {
    return calculateByMode(data, input, { spouseIncluded: filingType === "joint" });
  }

  function compareTaxStrategies(data, input) {
    const separate = calculateTax(data, input, "separate");
    const joint = calculateTax(data, input, "joint");
    const dividendSeparateRate = 0.28;
    const dividendIncome = toNumber(input.taxpayer.dividendIncome) + toNumber(input.spouse.dividendIncome);
    const dividendSeparateTax = Math.round(dividendIncome * dividendSeparateRate);
    const scenarios = [
      Object.assign({}, separate, { key: "separate-merged", dividendMode: "merged" }),
      Object.assign({}, joint, { key: "joint-merged", dividendMode: "merged" }),
      Object.assign({}, separate, { key: "separate-dividend-separated", dividendMode: "separated", taxAmount: separate.taxAmount + dividendSeparateTax }),
      Object.assign({}, joint, { key: "joint-dividend-separated", dividendMode: "separated", taxAmount: joint.taxAmount + dividendSeparateTax })
    ];
    scenarios.sort(function (a, b) { return a.taxAmount - b.taxAmount; });
    return {
      bestStrategy: scenarios[0].key,
      savedTax: scenarios[scenarios.length - 1].taxAmount - scenarios[0].taxAmount,
      scenarios: scenarios
    };
  }

  window.IncomeTaxApp.engine = {
    calculateTax: calculateTax,
    compareDeductionStrategies: compareDeductionStrategies,
    compareTaxStrategies: compareTaxStrategies,
    toNumber: toNumber,
    sumIncome: sumIncome
  };
}());
