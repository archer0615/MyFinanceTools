(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
  }

  function normalizePerson(source, role) {
    const input = source || {};
    return {
      id: role,
      role: role,
      salaryIncome: n(input.salaryIncome),
      professionalIncome: n(input.professionalIncome),
      dividendIncome: n(input.dividendIncome),
      interestIncome: n(input.interestIncome),
      otherIncome: n(input.otherIncome)
    };
  }

  function normalizeDependent(source, index) {
    const input = source || {};
    return {
      id: input.id || "dependent-" + (index + 1),
      name: input.name || "",
      relation: input.relation || "child",
      birthYear: input.birthYear || "",
      isSenior: input.isSenior === true,
      disabled: input.disabled === true,
      sameHousehold: input.sameHousehold !== false
    };
  }

  function normalizeDeductions(source) {
    const input = source || {};
    return {
      insuranceSelf: n(input.insuranceSelf),
      insuranceSpouse: n(input.insuranceSpouse),
      insuranceDependents: n(input.insuranceDependents),
      nationalHealthInsurance: n(input.nationalHealthInsurance),
      medical: n(input.medical),
      childbirth: n(input.childbirth),
      donationGeneral: n(input.donationGeneral),
      donationPolitical: n(input.donationPolitical),
      donationPublic: n(input.donationPublic),
      disasterLoss: n(input.disasterLoss),
      isSelfUseResidence: input.isSelfUseResidence === true,
      hasHouseholdRegistration: input.hasHouseholdRegistration === true,
      isRented: input.isRented === true,
      mortgageInterest: n(input.mortgageInterest),
      rent: n(input.rent),
      longTermCareCount: n(input.longTermCareCount),
      preschoolChildren: n(input.preschoolChildren),
      educationCount: n(input.educationCount)
    };
  }

  function create(input) {
    const source = input || {};
    return {
      filingMode: source.filingMode || "auto",
      persons: [
        normalizePerson(source.taxpayer, "taxpayer"),
        normalizePerson(source.spouse, "spouse")
      ],
      dependents: (source.dependents || []).map(normalizeDependent),
      deductions: normalizeDeductions(source.deductions)
    };
  }

  function toTaxEngineInput(household) {
    return {
      filingMode: household.filingMode,
      taxpayer: household.persons[0],
      spouse: household.persons[1],
      dependents: household.dependents,
      deductions: household.deductions
    };
  }

  function aggregate(household, options) {
    const spouseIncluded = options && options.spouseIncluded === true;
    const persons = spouseIncluded ? household.persons : household.persons.slice(0, 1);
    return {
      personCount: persons.length,
      dependentCount: household.dependents.length,
      grossIncome: persons.reduce(function (total, person) {
        return total + window.IncomeTaxApp.engine.sumIncome(person);
      }, 0),
      interestIncome: persons.reduce(function (total, person) {
        return total + n(person.interestIncome);
      }, 0),
      dividendIncome: persons.reduce(function (total, person) {
        return total + n(person.dividendIncome);
      }, 0)
    };
  }

  window.IncomeTaxApp.household = {
    create: create,
    toTaxEngineInput: toTaxEngineInput,
    aggregate: aggregate
  };
}());
