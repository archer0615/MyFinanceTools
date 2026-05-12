(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
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
    const mortgageInterest = Math.min(n(deduction.mortgageInterest), 300000);
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
        rentSpecial: rentSpecial
      }
    };
  }

  window.IncomeTaxApp.deductions = {
    calculateItemizedDeduction: calculateItemizedDeduction
  };
}());
