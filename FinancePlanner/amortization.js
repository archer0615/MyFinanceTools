function calculateMonthlyPayment(principal, annualRate, totalMonths) {
  const normalizedPrincipal = Math.max(0, Number(principal) || 0);
  const normalizedMonths = Math.max(0, Math.floor(Number(totalMonths) || 0));
  const monthlyRate = Math.max(0, Number(annualRate) || 0) / 100 / 12;

  if (normalizedPrincipal <= 0 || normalizedMonths <= 0) {
    return 0;
  }

  if (monthlyRate === 0) {
    return normalizedPrincipal / normalizedMonths;
  }

  return normalizedPrincipal * monthlyRate / (1 - (1 + monthlyRate) ** (-normalizedMonths));
}

function generateAmortizationSchedule(debts, extraBudget = 0) {
  const normalizedExtraBudget = Math.max(0, Number(extraBudget) || 0);
  const workingDebts = debts
    .filter((debt) => Number(debt.balance) > 0)
    .map((debt) => {
      const balance = Math.max(0, Number(debt.balance) || 0);
      const remainingMonths = Math.max(1, Math.floor(Number(debt.remainingMonths) || 0) || 1);
      const scheduledPayment = calculateMonthlyPayment(balance, debt.rate, remainingMonths);
      const minimumPayment = Math.max(0, Number(debt.minimumPayment) || 0);

      return {
        id: debt.id,
        name: debt.name,
        rate: Math.max(0, Number(debt.rate) || 0),
        balance,
        remainingMonths,
        scheduledPayment: Math.max(scheduledPayment, minimumPayment),
      };
    });

  const schedule = [];
  let totalInterest = 0;
  let month = 0;
  const maxMonths = 600;

  while (month < maxMonths && workingDebts.some((debt) => debt.balance > 0.01)) {
    month += 1;
    let extraPool = normalizedExtraBudget;
    const monthlyEntries = [];

    for (const debt of workingDebts) {
      if (debt.balance <= 0.01) {
        continue;
      }

      const openingBalance = debt.balance;
      const monthlyRate = debt.rate / 100 / 12;
      const interest = openingBalance * monthlyRate;
      const balanceWithInterest = openingBalance + interest;
      const scheduledPrincipal = Math.min(balanceWithInterest, Math.max(0, debt.scheduledPayment - interest));
      const basePayment = Math.min(balanceWithInterest, interest + scheduledPrincipal);

      debt.balance = balanceWithInterest - basePayment;
      totalInterest += interest;

      monthlyEntries.push({
        debtId: debt.id,
        debtName: debt.name,
        openingBalance,
        interest,
        principalPaid: scheduledPrincipal,
        extraPaid: 0,
        payment: basePayment,
        endingBalance: debt.balance,
      });
    }

    for (const entry of monthlyEntries) {
      if (extraPool <= 0.01) {
        break;
      }

      const debt = workingDebts.find((item) => item.id === entry.debtId);
      if (!debt || debt.balance <= 0.01) {
        continue;
      }

      const extraPaid = Math.min(debt.balance, extraPool);
      debt.balance -= extraPaid;
      extraPool -= extraPaid;
      entry.extraPaid += extraPaid;
      entry.principalPaid += extraPaid;
      entry.payment += extraPaid;
      entry.endingBalance = debt.balance;
    }

    schedule.push({
      month,
      entries: monthlyEntries,
    });
  }

  return {
    months: schedule.length,
    totalInterest,
    schedule,
  };
}

window.FinancePlannerAmortization = {
  calculateMonthlyPayment,
  generateAmortizationSchedule,
};

Object.assign(window, window.FinancePlannerAmortization);
