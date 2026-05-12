(function () {
  window.IncomeTaxApp = window.IncomeTaxApp || {};
  window.IncomeTaxApp.state = {
    currentYear: null,
    formData: {},
    filingMode: "auto",
    taxpayer: {
      salaryIncome: 800000,
      professionalIncome: 0,
      dividendIncome: 0,
      otherIncome: 0
    },
    spouse: {
      salaryIncome: 0,
      professionalIncome: 0,
      dividendIncome: 0,
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
      mortgageInterest: 0,
      rent: 0,
      longTermCareCount: 0,
      preschoolChildren: 0,
      educationCount: 0
    },
    result: {},
    comparison: null,
    theme: "light"
  };
}());
