(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
  }

  function getLimit(data, group, key, fallback) {
    return data.deductions && data.deductions[group] && Number.isFinite(data.deductions[group][key])
      ? data.deductions[group][key]
      : fallback;
  }

  function calculateSavingsDeduction(data, interestIncome) {
    return Math.min(n(interestIncome), getLimit(data, "savings", "limit", 270000));
  }

  function calculateMortgageDeduction(data, deduction, savingsDeduction) {
    const isSelfUseResidence = deduction.isSelfUseResidence === true;
    const hasHouseholdRegistration = deduction.hasHouseholdRegistration === true;
    const isRented = deduction.isRented === true || deduction.isBusinessUse === true || deduction.isInvestmentUse === true;
    if (!isSelfUseResidence || !hasHouseholdRegistration || isRented) {
      return 0;
    }
    const limit = getLimit(data, "mortgageInterest", "limit", 300000);
    const netInterest = Math.max(0, n(deduction.mortgageInterest) - n(savingsDeduction));
    return Math.min(netInterest, limit);
  }

  function calculateBasicLivingDeduction(data, values) {
    const perPerson = getLimit(data, "basicLivingExpense", "perPerson", 0);
    const basicLivingTotal = perPerson * n(values.personCount);
    const comparisonTotal = n(values.exemption)
      + n(values.baseDeduction)
      + n(values.savingsDeduction)
      + n(values.disabilityDeduction)
      + n(values.educationDeduction)
      + n(values.preschoolDeduction)
      + n(values.longTermCareDeduction)
      + n(values.rentDeduction);
    return {
      perPerson: perPerson,
      total: basicLivingTotal,
      comparisonTotal: comparisonTotal,
      difference: Math.max(0, basicLivingTotal - comparisonTotal)
    };
  }

  function applyDeductionDependencies(data, input, taxpayerCount) {
    const spouseIncluded = taxpayerCount > 1;
    const interestIncome = n(input.taxpayer.interestIncome) + (spouseIncluded ? n(input.spouse.interestIncome) : 0);
    const savingsDeduction = calculateSavingsDeduction(data, interestIncome);
    const mortgageInterest = calculateMortgageDeduction(data, input.deductions || {}, savingsDeduction);
    return {
      interestIncome: interestIncome,
      savingsDeduction: savingsDeduction,
      mortgageInterest: mortgageInterest
    };
  }

  function validateMutualExclusion(input) {
    const deduction = input.deductions || {};
    const hasRent = n(deduction.rent) > 0;
    const hasMortgage = n(deduction.mortgageInterest) > 0;
    return {
      hasConflict: hasRent && hasMortgage,
      message: hasRent && hasMortgage ? "可能不可同時適用" : ""
    };
  }

  function calculateItemizedDeduction(data, input, taxpayerCount) {
    const d = data.deductions;
    const deduction = input.deductions || {};
    const dependentCount = (input.dependents || []).length;
    const personCount = taxpayerCount + dependentCount;
    const insuranceCap = 24000;
    const cappedInsurance = Math.min(n(deduction.insuranceSelf), insuranceCap)
      + Math.min(n(deduction.insuranceSpouse), taxpayerCount > 1 ? insuranceCap : 0)
      + Math.min(n(deduction.insuranceDependents), insuranceCap * dependentCount);
    const healthInsurance = n(deduction.nationalHealthInsurance);
    const medical = n(deduction.medical) + n(deduction.childbirth);
    const grossIncome = window.IncomeTaxApp.engine.sumIncome(input.taxpayer) + window.IncomeTaxApp.engine.sumIncome(input.spouse);
    const regularDonationCap = grossIncome * 0.2;
    const politicalDonationCap = 200000;
    const donationGeneral = Math.min(n(deduction.donationGeneral), regularDonationCap);
    const donationPublic = Math.min(n(deduction.donationPublic), regularDonationCap);
    const donationPolitical = Math.min(n(deduction.donationPolitical), politicalDonationCap);
    const disasterLoss = n(deduction.disasterLoss);
    const dependencies = applyDeductionDependencies(data, input, taxpayerCount);
    const mortgageInterest = dependencies.mortgageInterest;
    const rentSpecial = Math.min(n(deduction.rent), d.rent || 0);
    const total = cappedInsurance + healthInsurance + medical + donationGeneral + donationPublic + donationPolitical + disasterLoss + mortgageInterest + rentSpecial;

    return {
      total: total,
      personCount: personCount,
      breakdown: {
        insurance: cappedInsurance,
        healthInsurance: healthInsurance,
        medical: medical,
        donationGeneral: donationGeneral,
        donationPublic: donationPublic,
        donationPolitical: donationPolitical,
        disasterLoss: disasterLoss,
        mortgageInterest: mortgageInterest,
        mortgageInterestPaid: n(deduction.mortgageInterest),
        savingsDeductionApplied: dependencies.savingsDeduction,
        rentSpecial: rentSpecial
      }
    };
  }

  window.IncomeTaxApp.deductions = {
    calculateItemizedDeduction: calculateItemizedDeduction,
    calculateSavingsDeduction: calculateSavingsDeduction,
    calculateMortgageDeduction: calculateMortgageDeduction,
    calculateBasicLivingDeduction: calculateBasicLivingDeduction,
    applyDeductionDependencies: applyDeductionDependencies,
    validateMutualExclusion: validateMutualExclusion
  };
}());
