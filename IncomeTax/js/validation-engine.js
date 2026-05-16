(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
  }

  function validateTaxInputs(input, activeResult) {
    const errors = [];
    const warnings = [];
    const deduction = input.deductions || {};
    const interestIncome = activeResult && activeResult.deductions
      ? n(activeResult.deductions.interestIncome)
      : n(input.taxpayer && input.taxpayer.interestIncome) + n(input.spouse && input.spouse.interestIncome);
    const hasMortgage = n(deduction.mortgageInterest) > 0;

    if (hasMortgage && !deduction.isSelfUseResidence) {
      warnings.push("購屋借款利息需為自用住宅");
    }
    if (hasMortgage && !deduction.hasHouseholdRegistration) {
      warnings.push("購屋借款利息需設戶籍");
    }
    if (hasMortgage && deduction.isRented) {
      warnings.push("出租、營業或投資使用住宅不可扣除購屋借款利息");
    }
    if (window.IncomeTaxApp.deductions.validateMutualExclusion(input).hasConflict) {
      warnings.push("可能不可同時適用");
    }
    if (interestIncome > 270000) {
      warnings.push("超過儲蓄投資特別扣除額上限");
    }
    return {
      errors: errors,
      warnings: warnings
    };
  }

  function validate(input, activeResult) {
    const result = validateTaxInputs(input, activeResult);
    return result.errors.concat(result.warnings);
  }

  window.IncomeTaxApp.validation = {
    validate: validate,
    validateTaxInputs: validateTaxInputs
  };
}());
