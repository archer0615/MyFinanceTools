function simulateLeverageInvestment(input, loan) {
  const principal = Math.max(Number(loan.principal) || 0, 0);
  const annualInterestRate = Math.max(Number(loan.annualInterestRate) || 0, 0);
  const years = Math.max(Number(loan.years) || input.years || 1, 1);
  const monthlyPayment = calculateMonthlyLoanPayment(principal, annualInterestRate, years);
  const monthlyInvestmentRate = Math.pow(1 + input.annualReturn + input.dividendYield, 1 / 12) - 1;
  const monthlyInterestRate = annualInterestRate / 12;
  const months = Math.max(input.years * 12, 1);
  const points = [];
  let debt = principal;
  let investmentValue = input.initialAmount + principal;
  let totalInterest = 0;
  let totalPaid = 0;

  for (let month = 1; month <= months; month += 1) {
    const interest = debt * monthlyInterestRate;
    const payment = debt > 0 ? Math.min(monthlyPayment, debt + interest) : 0;
    const principalPaid = Math.max(payment - interest, 0);
    debt = Math.max(debt - principalPaid, 0);
    totalInterest += interest;
    totalPaid += payment;
    investmentValue = investmentValue * (1 + monthlyInvestmentRate) + input.monthlyContribution;

    if (month % 12 === 0) {
      points.push({
        year: month / 12,
        investmentValue,
        debt,
        netWorth: investmentValue - debt,
        totalInterest,
        totalPaid
      });
    }
  }

  const finalPoint = points.at(-1) || { investmentValue, debt, netWorth: investmentValue - debt, totalInterest, totalPaid };
  return {
    points,
    metrics: {
      finalInvestmentValue: finalPoint.investmentValue,
      finalDebt: finalPoint.debt,
      finalNetWorth: finalPoint.netWorth,
      totalInterest,
      totalPaid,
      leverageRatio: input.initialAmount > 0 ? (input.initialAmount + principal) / input.initialAmount : 0,
      netReturnAfterInterest: finalPoint.netWorth - input.initialAmount - input.monthlyContribution * months - totalInterest
    }
  };
}

function calculateMonthlyLoanPayment(principal, annualInterestRate, years) {
  const months = Math.max(years * 12, 1);
  const monthlyRate = annualInterestRate / 12;
  if (principal <= 0) return 0;
  if (monthlyRate === 0) return principal / months;
  return principal * monthlyRate / (1 - (1 + monthlyRate) ** -months);
}
