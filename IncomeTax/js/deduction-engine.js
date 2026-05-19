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
    return finiteDeduction(Math.min(n(interestIncome), getLimit(data, "savings", "limit", 270000)));
  }

  function finiteDeduction(value) {
    return Number.isFinite(value) ? Math.max(0, value) : 0;
  }

  function normalizeMortgageSchema(data) {
    const source = data || {};
    const mortgageInterestExpense = Number(source.mortgageInterestExpense || source.mortgageInterest || 0);
    const normalizedInterest = Number.isFinite(mortgageInterestExpense) ? Math.max(0, Math.floor(mortgageInterestExpense)) : 0;
    const isOwnerOccupied = source.isOwnerOccupied !== undefined ? source.isOwnerOccupied === true : source.isSelfUseResidence === true;
    const isRegisteredResidence = source.isRegisteredResidence !== undefined ? source.isRegisteredResidence === true : source.hasHouseholdRegistration === true;
    const isRentalProperty = source.isRentalProperty !== undefined ? source.isRentalProperty === true : source.isRented === true;
    return Object.assign({}, source, {
      mortgageInterestExpense: normalizedInterest,
      mortgageInterest: normalizedInterest,
      isOwnerOccupied: isOwnerOccupied,
      isSelfUseResidence: isOwnerOccupied,
      isRegisteredResidence: isRegisteredResidence,
      hasHouseholdRegistration: isRegisteredResidence,
      isRentalProperty: isRentalProperty,
      isRented: isRentalProperty
    });
  }

  function calculateMortgageDeduction(data, deduction, savingsDeduction) {
    const normalized = normalizeMortgageSchema(deduction);
    const isRented = normalized.isRentalProperty === true || normalized.isBusinessUse === true || normalized.isInvestmentUse === true;
    if (!normalized.isOwnerOccupied || !normalized.isRegisteredResidence || isRented) {
      return 0;
    }
    const limit = getLimit(data, "mortgageInterest", "limit", 300000);
    const netInterest = Math.max(0, n(normalized.mortgageInterestExpense) - n(savingsDeduction));
    return finiteDeduction(Math.min(netInterest, limit));
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
    const deduction = normalizeMortgageSchema(input.deductions || {});
    const mortgageInterest = calculateMortgageDeduction(data, deduction, savingsDeduction);
    return {
      interestIncome: interestIncome,
      savingsDeduction: savingsDeduction,
      mortgageInterest: finiteDeduction(mortgageInterest),
      mortgageInterestExpense: deduction.mortgageInterestExpense
    };
  }

  function validateMutualExclusion(input) {
    const deduction = normalizeMortgageSchema(input.deductions || {});
    const hasRent = n(deduction.rent) > 0;
    const hasMortgage = n(deduction.mortgageInterest) > 0;
    return {
      hasConflict: hasRent && hasMortgage,
      message: hasRent && hasMortgage ? "可能不可同時適用" : ""
    };
  }

  function calculateItemizedDeduction(data, input, taxpayerCount) {
    const d = data.deductions;
    const deduction = normalizeMortgageSchema(input.deductions || {});
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
        mortgageInterest: finiteDeduction(mortgageInterest),
        mortgageInterestExpense: n(deduction.mortgageInterestExpense),
        mortgageInterestPaid: n(deduction.mortgageInterestExpense),
        savingsDeductionApplied: dependencies.savingsDeduction,
        rentSpecial: rentSpecial
      }
    };
  }

  window.IncomeTaxApp.deductions = {
    calculateItemizedDeduction: calculateItemizedDeduction,
    calculateSavingsDeduction: calculateSavingsDeduction,
    normalizeMortgageSchema: normalizeMortgageSchema,
    calculateMortgageDeduction: calculateMortgageDeduction,
    calculateBasicLivingDeduction: calculateBasicLivingDeduction,
    applyDeductionDependencies: applyDeductionDependencies,
    validateMutualExclusion: validateMutualExclusion
  };
}());
