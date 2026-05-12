function roundCurrency(value) {
  const n = Number.isFinite(Number(value)) ? Number(value) : 0;
  const rounded = Math.round((n + Number.EPSILON) * 100) / 100;
  return Math.abs(rounded) < 0.005 ? 0 : rounded;
}

function clamp(value, min, max) {
  const n = Number(value);
  return Math.min(max == null ? Number.MAX_SAFE_INTEGER : max, Math.max(min, Number.isFinite(n) ? n : 0));
}

function addMonths(monthIndex) {
  const start = new Date();
  const date = new Date(start.getFullYear(), start.getMonth() + monthIndex, 1);
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0");
}

function monthlyRateAt(rates, monthIndex, offset) {
  var passed = 0;
  for (var i = 0; i < rates.length; i += 1) {
    passed += Math.max(0, Number(rates[i].months) || 0);
    if (monthIndex <= passed) return Math.max(0, (Number(rates[i].rate) + (offset || 0)) / 100 / 12);
  }
  var last = rates[rates.length - 1] || { rate: 0 };
  return Math.max(0, (Number(last.rate) + (offset || 0)) / 100 / 12);
}

function annuityPayment(principal, monthlyRate, months) {
  principal = roundCurrency(principal);
  months = Math.max(0, Math.round(months));
  if (principal <= 0 || months <= 0) return 0;
  if (monthlyRate <= 0) return roundCurrency(principal / months);
  var factor = Math.pow(1 + monthlyRate, months);
  return roundCurrency(principal * monthlyRate * factor / (factor - 1));
}

function cloneLoan(loan) {
  return {
    id: loan.id,
    name: loan.name || "房貸",
    amount: clamp(loan.amount, 0),
    years: clamp(loan.years, 1),
    graceMonths: clamp(loan.graceMonths, 0),
    method: loan.method || "annuity",
    prepayMode: loan.prepayMode || "reducePayment",
    rates: (loan.rates || []).map(function (r) { return { months: clamp(r.months, 1), rate: Number(r.rate) || 0 }; }),
    prepays: (loan.prepays || []).map(function (p) { return { month: Math.round(clamp(p.month, 1)), amount: roundCurrency(clamp(p.amount, 0)) }; })
  };
}

function buildSchedule(rawLoan, rateOffset) {
  var loan = cloneLoan(rawLoan);
  var errors = [];
  var totalMonths = Math.round(loan.years * 12);
  var graceMonths = Math.min(Math.round(loan.graceMonths), totalMonths);
  var balance = roundCurrency(loan.amount);
  var rows = [];
  var prepaysByMonth = {};
  var rateMonths = loan.rates.reduce(function (sum, r) { return sum + clamp(r.months, 0); }, 0);
  var payment = 0;
  var fixedPrincipal = totalMonths > graceMonths ? roundCurrency(balance / (totalMonths - graceMonths)) : balance;
  var lastRate = null;
  var firstContractPayment = 0;
  var originalInterest = 0;

  if (!loan.rates.length) loan.rates.push({ months: totalMonths, rate: 0 });
  if (balance <= 0) errors.push(loan.name + "：貸款金額不可小於或等於 0");
  if (rateMonths < totalMonths) errors.push(loan.name + "：利率月數不足，已自動延伸最後利率");
  loan.prepays.forEach(function (p) { prepaysByMonth[p.month] = roundCurrency((prepaysByMonth[p.month] || 0) + p.amount); });

  for (var m = 1; m <= totalMonths && balance > 0; m += 1) {
    var rate = monthlyRateAt(loan.rates, m, rateOffset || 0);
    var remaining = totalMonths - m + 1;
    var inGrace = m <= graceMonths;
    if (loan.method === "annuity" && (payment <= 0 || lastRate !== rate || m === graceMonths + 1)) {
      payment = annuityPayment(balance, rate, remaining);
      if (!firstContractPayment && !inGrace) firstContractPayment = payment;
    }
    lastRate = rate;

    var interest = roundCurrency(balance * rate);
    var principal = 0;
    var normalPayment = interest;
    if (!inGrace) {
      if (loan.method === "equalPrincipal") {
        principal = Math.min(balance, fixedPrincipal);
        normalPayment = roundCurrency(principal + interest);
      } else {
        principal = Math.min(balance, Math.max(0, roundCurrency(payment - interest)));
        if (remaining === 1 || balance < payment) principal = balance;
        normalPayment = roundCurrency(principal + interest);
      }
    }

    var prepay = Math.min(roundCurrency(prepaysByMonth[m] || 0), Math.max(0, roundCurrency(balance - principal)));
    if ((prepaysByMonth[m] || 0) > prepay) errors.push(loan.name + "：第 " + m + " 月提前還款超過剩餘本金，已調整");
    balance = roundCurrency(balance - principal - prepay);
    if (balance < 0.01) balance = 0;

    if (prepay > 0 && balance > 0 && loan.prepayMode === "reducePayment") {
      payment = annuityPayment(balance, rate, Math.max(1, totalMonths - m));
      fixedPrincipal = roundCurrency(balance / Math.max(1, totalMonths - m));
    }

    rows.push({
      loanId: loan.id,
      loanName: loan.name,
      month: m,
      date: addMonths(m - 1),
      payment: roundCurrency(normalPayment + prepay),
      normalPayment: normalPayment,
      principal: roundCurrency(principal + prepay),
      interest: interest,
      prepay: prepay,
      balance: balance,
      contractPayment: firstContractPayment || normalPayment
    });
    originalInterest = roundCurrency(originalInterest + interest);
  }

  return { rows: rows, errors: errors, totalMonths: totalMonths, payoffMonths: rows.length };
}

function combineRows(rows) {
  var byMonth = {};
  rows.forEach(function (row) {
    var item = byMonth[row.month] || { month: row.month, date: row.date, payment: 0, principal: 0, interest: 0, prepay: 0, balance: 0 };
    item.payment = roundCurrency(item.payment + row.payment);
    item.principal = roundCurrency(item.principal + row.principal);
    item.interest = roundCurrency(item.interest + row.interest);
    item.prepay = roundCurrency(item.prepay + row.prepay);
    byMonth[row.month] = item;
  });
  return Object.keys(byMonth).map(Number).sort(function (a, b) { return a - b; }).map(function (month) {
    var item = byMonth[month];
    item.balance = roundCurrency(rows.filter(function (r) { return r.month === month; }).reduce(function (sum, r) { return sum + r.balance; }, 0));
    return item;
  });
}

function calculatePlan(plan, rateOffset) {
  var scheduleSets = (plan.loans || []).map(function (loan) { return buildSchedule(loan, rateOffset || 0); });
  var rows = [].concat.apply([], scheduleSets.map(function (s) { return s.rows; }));
  var combined = combineRows(rows);
  var totalPrincipal = roundCurrency((plan.loans || []).reduce(function (sum, loan) { return sum + clamp(loan.amount, 0); }, 0));
  var totalInterest = roundCurrency(rows.reduce(function (sum, row) { return sum + row.interest; }, 0));
  var totalPaid = roundCurrency(rows.reduce(function (sum, row) { return sum + row.payment; }, 0));
  return {
    rows: rows,
    combined: combined,
    errors: [].concat.apply([], scheduleSets.map(function (s) { return s.errors; })),
    totalPrincipal: totalPrincipal,
    totalInterest: totalInterest,
    totalPaid: totalPaid,
    firstPayment: combined[0] ? combined[0].payment : 0,
    payoffDate: combined.length ? combined[combined.length - 1].date : "-",
    payoffMonths: combined.length,
    originalMonths: Math.max.apply(null, [0].concat((plan.loans || []).map(function (loan) { return Math.round(clamp(loan.years, 1) * 12); })))
  };
}

function simulateCashFlow(plan, result) {
  var cash = plan.cashFlow || {};
  var annual = [];
  var years = Math.max(1, Math.ceil((result.combined || []).length / 12));
  for (var y = 1; y <= years; y += 1) {
    var income = roundCurrency(((cash.income || plan.dsr.income || 0) * 12 + (cash.bonus || 0)) * Math.pow(1 + (Number(cash.growth) || 0) / 100, y - 1) + (cash.rent || 0) * 12);
    var mortgage = roundCurrency(result.combined.slice((y - 1) * 12, y * 12).reduce(function (sum, r) { return sum + r.normalPayment; }, 0));
    var invest = roundCurrency((cash.etf || 0) * 12);
    var child = roundCurrency((cash.child || 0) * 12);
    var disposable = roundCurrency(income - mortgage - invest - child);
    var dsr = income > 0 ? roundCurrency(mortgage / income * 100) : 0;
    annual.push({ year: y, income: income, mortgage: mortgage, invest: invest, disposable: disposable, dsr: dsr, risk: dsr > 60 ? "高風險現金流" : "可控" });
  }
  return annual;
}

function refinance(input) {
  var balance = roundCurrency(clamp(input.balance, 0));
  var oldMonths = Math.round(clamp(input.oldYears, 1) * 12);
  var newMonths = Math.round(clamp(input.newYears, 1) * 12);
  var oldPay = annuityPayment(balance, (Number(input.oldRate) || 0) / 100 / 12, oldMonths);
  var newPay = annuityPayment(balance, (Number(input.newRate) || 0) / 100 / 12, newMonths);
  var oldInterest = roundCurrency(oldPay * oldMonths - balance);
  var newInterest = roundCurrency(newPay * newMonths - balance);
  var cost = roundCurrency(clamp(input.penalty, 0) + clamp(input.fee, 0));
  var saving = roundCurrency(oldInterest - newInterest);
  return { oldInterest: oldInterest, newInterest: newInterest, cost: cost, netSaving: roundCurrency(saving - cost), breakEvenYears: oldPay > newPay ? roundCurrency(cost / (oldPay - newPay) / 12) : 0, worth: saving > cost };
}

function optimizePrepay(plan, annualAmount) {
  var best = { year: "-", saving: 0, strategy: "無額外還款" };
  var base = calculatePlan(plan, 0);
  var maxYears = Math.max(1, Math.ceil(base.payoffMonths / 12));
  for (var year = 1; year <= maxYears; year += 1) {
    ["shortenTerm", "reducePayment"].forEach(function (mode) {
      var clone = JSON.parse(JSON.stringify(plan));
      clone.loans.forEach(function (loan) {
        loan.prepayMode = mode;
        loan.prepays = (loan.prepays || []).concat([{ month: year * 12, amount: annualAmount }]);
      });
      var test = calculatePlan(clone, 0);
      var saving = roundCurrency(base.totalInterest - test.totalInterest);
      if (saving > best.saving) best = { year: year, saving: saving, strategy: mode === "shortenTerm" ? "縮短年限" : "降低月付" };
    });
  }
  return best;
}

function rateSimulation(plan, cycles) {
  var clone = JSON.parse(JSON.stringify(plan));
  clone.loans.forEach(function (loan) {
    loan.rates = (cycles || []).map(function (c, index, arr) {
      var next = arr[index + 1];
      return { months: Math.max(12, ((next ? next.year : loan.years + 1) - c.year) * 12), rate: c.rate };
    });
  });
  return calculatePlan(clone, 0);
}

self.onmessage = function (event) {
  var data = event.data || {};
  if (data.type !== "CALCULATE") return;
  var payload = data.payload || {};
  var requestId = data.requestId || payload.requestId || 0;
  var plan = payload.plan || { loans: [], dsr: {}, cashFlow: {} };
  var result = calculatePlan(plan, payload.rateOffset || 0);
  var response = {
    result: result,
    stress: [0.5, 1, 2].map(function (offset) { return { offset: offset, result: calculatePlan(plan, offset) }; }),
    cashFlow: simulateCashFlow(plan, result),
    refinance: refinance(payload.refinance || {}),
    optimizer: optimizePrepay(plan, clamp(payload.extraAnnual, 0)),
    rateSimulation: rateSimulation(plan, payload.rateCycles || [])
  };
  response.requestId = requestId;
  self.postMessage({ type: "RESULT", requestId: requestId, payload: response });
};
