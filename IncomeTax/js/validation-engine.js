(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
  }

  function validate(input, activeResult) {
    const messages = [];
    const deduction = input.deductions || {};
    const interestIncome = activeResult && activeResult.deductions
      ? n(activeResult.deductions.interestIncome)
      : n(input.taxpayer && input.taxpayer.interestIncome) + n(input.spouse && input.spouse.interestIncome);
    const hasMortgage = n(deduction.mortgageInterest) > 0;

    if (hasMortgage && !deduction.isSelfUseResidence) {
      messages.push("購屋借款利息需為自用住宅");
    }
    if (hasMortgage && !deduction.hasHouseholdRegistration) {
      messages.push("購屋借款利息需設戶籍");
    }
    if (hasMortgage && deduction.isRented) {
      messages.push("出租、營業或投資使用住宅不可扣除購屋借款利息");
    }
    if (window.IncomeTaxApp.deductions.validateMutualExclusion(input).hasConflict) {
      messages.push("可能不可同時適用");
    }
    if (interestIncome > 270000) {
      messages.push("超過儲蓄投資特別扣除額上限");
    }
    return messages;
  }

  window.IncomeTaxApp.validation = {
    validate: validate
  };
}());
