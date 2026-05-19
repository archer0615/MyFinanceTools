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

  function normalizePersonDeductions(source) {
    const input = source || {};
    return {
      insurance: n(input.insurance),
      nationalHealthInsurance: n(input.nationalHealthInsurance),
      medical: n(input.medical),
      childbirth: n(input.childbirth),
      donationGeneral: n(input.donationGeneral),
      donationPolitical: n(input.donationPolitical),
      donationPublic: n(input.donationPublic),
      disasterLoss: n(input.disasterLoss)
    };
  }

  function normalizeDependent(source, index) {
    const input = source || {};
    return {
      id: input.id || "dependent-" + (index + 1),
      name: input.name || "",
      relation: input.relation || "child",
      birthYear: input.birthYear || "",
      salaryIncome: n(input.salaryIncome),
      professionalIncome: n(input.professionalIncome),
      dividendIncome: n(input.dividendIncome),
      interestIncome: n(input.interestIncome),
      otherIncome: n(input.otherIncome),
      deductions: normalizePersonDeductions(input),
      isSenior: input.isSenior === true,
      disabled: input.disabled === true,
      sameHousehold: input.sameHousehold !== false
    };
  }

  function normalizeDeductions(source) {
    const input = source || {};
    const mortgage = window.IncomeTaxApp.deductions.normalizeMortgageSchema(input);
    const taxpayer = normalizePersonDeductions(input.taxpayer);
    const spouse = normalizePersonDeductions(input.spouse);
    const dependentList = (input.dependents || []).map(function (dependent) {
      return normalizePersonDeductions(dependent);
    });
    const dependentTotals = dependentList.reduce(function (total, item) {
      return {
        insurance: n(total.insurance) + n(item.insurance),
        nationalHealthInsurance: n(total.nationalHealthInsurance) + n(item.nationalHealthInsurance),
        medical: n(total.medical) + n(item.medical),
        childbirth: n(total.childbirth) + n(item.childbirth),
        donationGeneral: n(total.donationGeneral) + n(item.donationGeneral),
        donationPolitical: n(total.donationPolitical) + n(item.donationPolitical),
        donationPublic: n(total.donationPublic) + n(item.donationPublic),
        disasterLoss: n(total.disasterLoss) + n(item.disasterLoss)
      };
    }, {});
    return {
      taxpayer: taxpayer,
      spouse: spouse,
      dependents: dependentList,
      insuranceSelf: n(input.insuranceSelf) + n(taxpayer.insurance),
      insuranceSpouse: n(input.insuranceSpouse) + n(spouse.insurance),
      insuranceDependents: n(input.insuranceDependents) + n(dependentTotals.insurance),
      nationalHealthInsurance: n(input.nationalHealthInsurance) + n(taxpayer.nationalHealthInsurance) + n(spouse.nationalHealthInsurance) + n(dependentTotals.nationalHealthInsurance),
      medical: n(input.medical) + n(taxpayer.medical) + n(spouse.medical) + n(dependentTotals.medical),
      childbirth: n(input.childbirth) + n(taxpayer.childbirth) + n(spouse.childbirth) + n(dependentTotals.childbirth),
      donationGeneral: n(input.donationGeneral) + n(taxpayer.donationGeneral) + n(spouse.donationGeneral) + n(dependentTotals.donationGeneral),
      donationPolitical: n(input.donationPolitical) + n(taxpayer.donationPolitical) + n(spouse.donationPolitical) + n(dependentTotals.donationPolitical),
      donationPublic: n(input.donationPublic) + n(taxpayer.donationPublic) + n(spouse.donationPublic) + n(dependentTotals.donationPublic),
      disasterLoss: n(input.disasterLoss) + n(taxpayer.disasterLoss) + n(spouse.disasterLoss) + n(dependentTotals.disasterLoss),
      isSelfUseResidence: mortgage.isSelfUseResidence === true,
      isOwnerOccupied: mortgage.isOwnerOccupied === true,
      hasHouseholdRegistration: mortgage.hasHouseholdRegistration === true,
      isRegisteredResidence: mortgage.isRegisteredResidence === true,
      isRented: mortgage.isRented === true,
      isRentalProperty: mortgage.isRentalProperty === true,
      mortgageInterest: n(mortgage.mortgageInterest),
      mortgageInterestExpense: n(mortgage.mortgageInterestExpense),
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
      dividendTaxMode: source.dividendTaxMode || "auto",
      persons: [
        normalizePerson(source.taxpayer, "taxpayer"),
        normalizePerson(source.spouse, "spouse")
      ],
      dependents: (source.dependents || []).map(normalizeDependent),
      deductions: normalizeDeductions(Object.assign({}, source.deductions, {
        dependents: source.dependents || []
      }))
    };
  }

  function toTaxEngineInput(household) {
    return {
      filingMode: household.filingMode,
      dividendTaxMode: household.dividendTaxMode,
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
