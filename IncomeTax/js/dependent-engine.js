(function () {
  function calculateDependentDeduction(data, dependents) {
    const deductions = data.deductions;
    const result = {
      count: dependents.length,
      seniorCount: 0,
      disabledCount: 0,
      exemption: 0,
      disability: 0
    };
    dependents.forEach(function (dependent) {
      const senior = Boolean(dependent.isSenior);
      result.exemption += senior ? deductions.seniorExemption : deductions.personalExemption;
      if (senior) {
        result.seniorCount += 1;
      }
      if (dependent.disabled) {
        result.disabledCount += 1;
        result.disability += deductions.disability || 0;
      }
    });
    return result;
  }

  window.IncomeTaxApp.dependents = {
    calculateDependentDeduction: calculateDependentDeduction
  };
}());
