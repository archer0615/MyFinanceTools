(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
  }

  function validateTaxInputs(input, activeResult) {
    const errors = [];
    const warnings = [];
    const deduction = window.IncomeTaxApp.deductions.normalizeMortgageSchema(input.deductions || {});
    const interestIncome = activeResult && activeResult.deductions
      ? n(activeResult.deductions.interestIncome)
      : n(input.taxpayer && input.taxpayer.interestIncome) + n(input.spouse && input.spouse.interestIncome);
    const rawDividendIncome = Number(input.taxpayer && input.taxpayer.dividendIncome || 0) + Number(input.spouse && input.spouse.dividendIncome || 0);
    const dividendTaxMode = input.dividendTaxMode;
    const hasMortgage = n(deduction.mortgageInterestExpense) > 0;

    if (hasMortgage && !deduction.isOwnerOccupied) {
      warnings.push("購屋借款利息需為自用住宅");
    }
    if (hasMortgage && !deduction.isRegisteredResidence) {
      warnings.push("需設立戶籍才可適用購屋借款利息列舉扣除額");
    }
    if (hasMortgage && deduction.isRentalProperty) {
      warnings.push("出租住宅不可適用購屋借款利息列舉扣除額");
    }
    if (window.IncomeTaxApp.deductions.validateMutualExclusion(input).hasConflict) {
      warnings.push("可能不可同時適用");
    }
    if (interestIncome > 270000) {
      warnings.push("超過儲蓄投資特別扣除額上限");
    }
    if (rawDividendIncome > 0 && !dividendTaxMode) {
      warnings.push("請選擇股利課稅方式");
    }
    if (rawDividendIncome < 0) {
      warnings.push("股利所得不可為負數");
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
