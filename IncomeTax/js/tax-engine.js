(function () {
  function toNumber(value) {
    const number = Number(value);
    return Number.isFinite(number) && number > 0 ? Math.floor(number) : 0;
  }

  function findBracket(brackets, taxableIncome) {
    return brackets.find(function (bracket) {
      const max = bracket.max === null ? Infinity : bracket.max;
      return taxableIncome >= bracket.min && taxableIncome <= max;
    }) || brackets[brackets.length - 1];
  }

  function sumIncome(person, includeDividend) {
    const dividend = includeDividend === false ? 0 : toNumber(person.dividendIncome);
    return toNumber(person.salaryIncome) + toNumber(person.professionalIncome) + dividend + toNumber(person.interestIncome) + toNumber(person.otherIncome);
  }

  function sumInterestIncome(input, spouseIncluded) {
    return toNumber(input.taxpayer.interestIncome) + (spouseIncluded ? toNumber(input.spouse.interestIncome) : 0);
  }

  function sumDividendIncome(input, spouseIncluded) {
    return toNumber(input.taxpayer.dividendIncome) + (spouseIncluded ? toNumber(input.spouse.dividendIncome) : 0);
  }

  function normalizeDividendTaxMode(mode) {
    return ["combined", "separate", "auto"].includes(mode) ? mode : "auto";
  }

  function calculateDividendTaxCredit(dividendIncome, dividendTaxMode) {
    if (dividendTaxMode !== "combined") {
      return 0;
    }
    return Math.min(Number(dividendIncome || 0) * 0.085, 80000);
  }

  function calculateSeparateDividendTax(dividendIncome) {
    return Math.round(Number(dividendIncome || 0) * 0.28);
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
    const personalExemption = deductions.personalExemption * taxpayerCount + dependentDeduction.exemption;
    const disabilityDeduction = dependentDeduction.disability;
    const taxpayerSalary = Math.min(toNumber(input.taxpayer.salaryIncome), deductions.salary || 0);
    const spouseSalary = spouseIncluded ? Math.min(toNumber(input.spouse.salaryIncome), deductions.salary || 0) : 0;
    const interestIncome = sumInterestIncome(input, spouseIncluded);
    const savingsDeduction = window.IncomeTaxApp.deductions.calculateSavingsDeduction(data, interestIncome);
    const dependencySummary = window.IncomeTaxApp.deductions.applyDeductionDependencies(data, input, taxpayerCount);
    const educationDeduction = toNumber(input.deductions.educationCount) * (deductions.education || 0);
    const preschoolChildren = toNumber(input.deductions.preschoolChildren);
    const preschoolDeduction = preschoolChildren === 0 ? 0 : (deductions.preschool || 0) + Math.max(0, preschoolChildren - 1) * (deductions.preschoolAdditional || deductions.preschool || 0);
    const longTermCareDeduction = toNumber(input.deductions.longTermCareCount) * (deductions.longTermCare || 0);
    const basicLiving = window.IncomeTaxApp.deductions.calculateBasicLivingDeduction(data, {
      personCount: taxpayerCount + (input.dependents || []).length,
      exemption: personalExemption,
      baseDeduction: baseDeduction,
      savingsDeduction: savingsDeduction,
      disabilityDeduction: disabilityDeduction,
      educationDeduction: educationDeduction,
      preschoolDeduction: preschoolDeduction,
      longTermCareDeduction: longTermCareDeduction,
      rentDeduction: itemized.breakdown.rentSpecial
    });
    const special = taxpayerSalary + spouseSalary + savingsDeduction + educationDeduction + preschoolDeduction + longTermCareDeduction + disabilityDeduction;
    const exemption = personalExemption;
    const total = exemption + baseDeduction + special + basicLiving.difference;

    return {
      mode: useItemized ? "列舉扣除額" : "標準扣除額",
      exemption: exemption,
      standard: standard,
      itemized: itemized.total,
      itemizedBreakdown: itemized.breakdown,
      base: baseDeduction,
      basicLiving: basicLiving,
      basicLivingDifference: basicLiving.difference,
      salary: taxpayerSalary + spouseSalary,
      disability: disabilityDeduction,
      interestIncome: interestIncome,
      savings: savingsDeduction,
      rent: itemized.breakdown.rentSpecial,
      mortgageInterest: dependencySummary.mortgageInterest,
      mortgageInterestExpense: dependencySummary.mortgageInterestExpense,
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
    const dividendTaxMode = normalizeDividendTaxMode(options.dividendTaxMode || "combined");
    const includeDividend = dividendTaxMode === "combined";
    const dividendIncome = sumDividendIncome(input, spouseIncluded);
    const grossIncome = sumIncome(input.taxpayer, includeDividend) + (spouseIncluded ? sumIncome(input.spouse, includeDividend) : 0);
    const deductions = buildDeductionSet(data, input, options);
    const taxableIncome = Math.max(0, grossIncome - deductions.total);
    const bracket = findBracket(data.taxBrackets, taxableIncome);
    const taxBeforeCredits = Math.max(0, Math.round(taxableIncome * bracket.rate - bracket.quickDeduction));
    const dividendTaxCredit = Math.round(calculateDividendTaxCredit(dividendIncome, dividendTaxMode));
    const separateDividendTax = dividendTaxMode === "separate" ? calculateSeparateDividendTax(dividendIncome) : 0;
    const finalTax = taxBeforeCredits + separateDividendTax - dividendTaxCredit;
    const payableTax = Math.max(0, finalTax);
    const refundAmount = Math.max(0, -finalTax);
    const finalTaxState = finalTax > 0 ? "payable" : finalTax < 0 ? "refund" : "neutral";

    return {
      filingType: spouseIncluded ? "joint" : "separate",
      dividendTaxMode: dividendTaxMode,
      selectedDividendTaxMode: dividendTaxMode,
      grossIncome: grossIncome,
      totalDeductions: deductions.total,
      taxableIncome: taxableIncome,
      taxBeforeCredits: taxBeforeCredits,
      taxAmount: payableTax,
      payableTax: payableTax,
      refundAmount: refundAmount,
      finalTax: finalTax,
      finalTaxState: finalTaxState,
      dividendIncome: dividendIncome,
      dividendTaxCredit: dividendTaxCredit,
      separateDividendTax: separateDividendTax,
      effectiveRate: grossIncome > 0 ? payableTax / grossIncome : 0,
      marginalRate: bracket.rate,
      bracket: bracket,
      meta: data.meta || {},
      deductions: deductions
    };
  }

  function applyDividendTaxStrategy(data, input, filingType, dividendTaxMode) {
    const mode = normalizeDividendTaxMode(dividendTaxMode || input.dividendTaxMode);
    const spouseIncluded = filingType === "joint";
    const combinedResult = calculateByMode(data, input, { spouseIncluded: spouseIncluded, dividendTaxMode: "combined" });
    const separateResult = calculateByMode(data, input, { spouseIncluded: spouseIncluded, dividendTaxMode: "separate" });
    const selectedMode = mode === "auto"
      ? (separateResult.finalTax < combinedResult.finalTax ? "separate" : "combined")
      : mode;
    const selected = selectedMode === "separate" ? separateResult : combinedResult;
    return Object.assign({}, selected, {
      selectedDividendTaxMode: selectedMode,
      dividendStrategy: {
        selectedMode: selectedMode,
        combinedResult: combinedResult,
        separateResult: separateResult
      }
    });
  }

  function calculateTax(data, input, filingType, dividendTaxMode) {
    return applyDividendTaxStrategy(data, input, filingType, dividendTaxMode || input.dividendTaxMode || "auto");
  }

  function compareTaxStrategies(data, input) {
    const separate = calculateTax(data, input, "separate", input.dividendTaxMode || "auto");
    const joint = calculateTax(data, input, "joint", input.dividendTaxMode || "auto");
    const scenarios = [
      Object.assign({}, separate, { key: "separate-" + separate.selectedDividendTaxMode }),
      Object.assign({}, joint, { key: "joint-" + joint.selectedDividendTaxMode })
    ];
    scenarios.sort(function (a, b) { return a.finalTax - b.finalTax; });
    return {
      bestStrategy: scenarios[0].key,
      savedTax: scenarios[scenarios.length - 1].taxAmount - scenarios[0].taxAmount,
      scenarios: scenarios
    };
  }

  window.IncomeTaxApp.engine = {
    calculateTax: calculateTax,
    calculateDividendTaxCredit: calculateDividendTaxCredit,
    calculateSeparateDividendTax: calculateSeparateDividendTax,
    applyDividendTaxStrategy: applyDividendTaxStrategy,
    compareDeductionStrategies: compareDeductionStrategies,
    compareTaxStrategies: compareTaxStrategies,
    toNumber: toNumber,
    sumIncome: sumIncome
  };
}());
