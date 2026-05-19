function simulateFirePlan(input, fireConfig) {
  const targetAmount = Math.max(Number(fireConfig.targetAmount) || 0, 0);
  const monthlyExpenses = Math.max(Number(fireConfig.monthlyExpenses) || 0, 0);
  const monthlyPassiveIncomeGoal = Math.max(Number(fireConfig.monthlyPassiveIncomeGoal) || monthlyExpenses, 0);
  const safeWithdrawalRate = Math.max(Number(fireConfig.safeWithdrawalRate) || 0.04, 0.001);
  const inflationRate = Math.max(Number(fireConfig.inflationRate) || 0, 0);
  const retirementAge = Math.max(Number(fireConfig.retirementAge) || 0, 0);
  const currentAge = Math.max(Number(fireConfig.currentAge) || 0, 0);
  const derivedTarget = targetAmount || monthlyPassiveIncomeGoal * 12 / safeWithdrawalRate;
  const accumulation = calculateCompoundGrowth(input);
  const firePoint = accumulation.find((point) => point.value >= derivedTarget) || null;
  const withdrawal = simulateRetirementWithdrawal({
    initialValue: firePoint ? firePoint.value : (accumulation.at(-1) || { value: input.initialAmount }).value,
    annualReturn: input.annualReturn,
    dividendYield: input.dividendYield,
    volatility: input.volatility,
    monthlyExpenses,
    inflationRate,
    years: 40
  });

  return {
    targetAmount: derivedTarget,
    fireDateYear: firePoint ? firePoint.year : null,
    estimatedFireAge: firePoint && currentAge ? currentAge + firePoint.year : null,
    targetRetirementAge: retirementAge || null,
    accumulation,
    withdrawal,
    metrics: {
      successProbability: withdrawal.success ? 1 : 0,
      depletionYear: withdrawal.depletionYear,
      finalRetirementValue: withdrawal.points.at(-1) ? withdrawal.points.at(-1).value : 0,
      targetGap: firePoint ? 0 : derivedTarget - ((accumulation.at(-1) || { value: 0 }).value)
    },
    reverseCalculation: calculateFireReversePlan(input, {
      targetAmount: derivedTarget,
      currentAge,
      retirementAge,
      monthlyPassiveIncomeGoal,
      safeWithdrawalRate
    })
  };
}

function calculateFireReversePlan(input, config) {
  const yearsToRetirement = Math.max((config.retirementAge || 0) - (config.currentAge || 0), 1);
  const monthlyRate = Math.pow(1 + input.annualReturn + input.dividendYield, 1 / 12) - 1;
  const months = yearsToRetirement * 12;
  const futureInitial = (input.initialAmount || 0) * ((1 + monthlyRate) ** months);
  const annuityFactor = monthlyRate === 0
    ? months
    : (((1 + monthlyRate) ** months - 1) / monthlyRate);
  const requiredMonthlyContribution = Math.max((config.targetAmount - futureInitial) / annuityFactor, 0);
  const currentMonthlyContribution = input.monthlyContribution || 0;
  const targetCagr = solveRequiredAnnualReturn(input.initialAmount || 0, currentMonthlyContribution, config.targetAmount, months);

  return {
    requiredCapital: config.targetAmount,
    monthlyPassiveIncomeGoal: config.monthlyPassiveIncomeGoal,
    requiredMonthlyContribution,
    targetCagr,
    targetFireAge: (config.currentAge || 0) + yearsToRetirement
  };
}

function solveRequiredAnnualReturn(initialAmount, monthlyContribution, targetAmount, months) {
  let low = -0.99;
  let high = 1;
  for (let index = 0; index < 60; index += 1) {
    const mid = (low + high) / 2;
    const monthlyRate = Math.pow(1 + mid, 1 / 12) - 1;
    const futureValue = calculateFutureValue(initialAmount, monthlyContribution, monthlyRate, months);
    if (futureValue >= targetAmount) high = mid;
    else low = mid;
  }
  return high;
}

function calculateFutureValue(initialAmount, monthlyContribution, monthlyRate, months) {
  if (monthlyRate === 0) return initialAmount + monthlyContribution * months;
  return initialAmount * ((1 + monthlyRate) ** months)
    + monthlyContribution * (((1 + monthlyRate) ** months - 1) / monthlyRate);
}

function simulateRetirementWithdrawal(config) {
  const monthlyRate = Math.pow(1 + config.annualReturn + config.dividendYield, 1 / 12) - 1;
  const points = [];
  let value = config.initialValue;
  let monthlyExpense = config.monthlyExpenses;
  let depletionYear = null;

  for (let month = 1; month <= config.years * 12; month += 1) {
    if (month > 1 && month % 12 === 1) monthlyExpense *= 1 + config.inflationRate;
    value = Math.max(value * (1 + monthlyRate) - monthlyExpense, 0);
    if (value <= 0 && depletionYear === null) depletionYear = Math.ceil(month / 12);
    if (month % 12 === 0) {
      points.push({ year: month / 12, value, annualWithdrawal: monthlyExpense * 12 });
    }
  }

  return {
    points,
    depletionYear,
    success: depletionYear === null
  };
}
