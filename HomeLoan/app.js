const App = (() => {
  const STORAGE_KEY = "homeloan.v1";
  const SNAPSHOT_KEY = "homeloan.snapshots.v1";
  const DB_NAME = "homeloan-db";
  const DB_VERSION = 1;
  const SNAPSHOT_STORE = "snapshots";
  const money = new Intl.NumberFormat("zh-TW", { style: "currency", currency: "TWD", maximumFractionDigits: 0 });
  const number = new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 0 });
  const $ = (id) => document.getElementById(id);

  const defaultLoan = (name = "房貸方案") => ({
    id: crypto.randomUUID(),
    name,
    amount: 12000000,
    years: 30,
    graceMonths: 0,
    method: "annuity",
    prepayMode: "reducePayment",
    collapsed: false,
    rates: [{ months: 360, rate: 2.1 }],
    prepays: []
  });

  const BANK_TEMPLATES = {
    qingan: {
      name: "青安貸款",
      amount: 10000000,
      years: 40,
      graceMonths: 60,
      method: "annuity",
      prepayMode: "reducePayment",
      rates: [
        { months: 24, rate: 1.775 },
        { months: 456, rate: 2.275 }
      ]
    },
    firstHome: {
      name: "首購貸款",
      amount: 12000000,
      years: 30,
      graceMonths: 24,
      method: "annuity",
      prepayMode: "reducePayment",
      rates: [
        { months: 12, rate: 2.05 },
        { months: 348, rate: 2.35 }
      ]
    },
    standard: {
      name: "一般房貸",
      amount: 12000000,
      years: 30,
      graceMonths: 0,
      method: "annuity",
      prepayMode: "reducePayment",
      rates: [{ months: 360, rate: 2.5 }]
    }
  };

  const state = {
    activePlan: 0,
    plans: [{
      id: crypto.randomUUID(),
      name: "方案 A",
      loans: [defaultLoan("主要房貸")],
      dsr: { income: 90000, creditLoan: 0, carLoan: 0, cardDebt: 0 },
      cashFlow: { bonus: 0, growth: 2, etf: 10000, rent: 0, child: 0 },
      rateCycles: [{ year: 1, rate: 2.1 }, { year: 3, rate: 2.5 }, { year: 6, rate: 2.2 }],
      stressTest: {},
      compareScenarios: [],
      refinanceHistory: []
    }]
  };
  let snapshotCache = [];
  let scheduleCache = [];
  let isRestoringHistory = false;
  let calcWorker = null;
  let calcRequestId = 0;
  let latestAppliedRequestId = 0;
  const pendingCalcs = new Map();
  const history = { stack: [], pointer: -1, limit: 80 };
  const virtualTable = { rowHeight: 37, overscan: 8 };

  const clamp = (value, min, max = Number.MAX_SAFE_INTEGER) => Math.min(max, Math.max(min, Number(value) || 0));
  const roundCurrency = (value) => {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) return 0;
    const rounded = Math.round((numeric + Number.EPSILON) * 100) / 100;
    return Math.abs(rounded) < 0.005 ? 0 : rounded;
  };
  const roundMoney = roundCurrency;
  const activePlan = () => state.plans[state.activePlan];
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const stateClone = () => (typeof structuredClone === "function" ? structuredClone(state) : clone(state));
  const restoreState = (snapshot) => {
    state.activePlan = snapshot.activePlan;
    state.plans = snapshot.plans;
    state.plans.forEach(normalizePlan);
  };
  const pushHistory = () => {
    if (isRestoringHistory) return;
    history.stack = history.stack.slice(0, history.pointer + 1);
    history.stack.push(stateClone());
    if (history.stack.length > history.limit) history.stack.shift();
    history.pointer = history.stack.length - 1;
    updateHistoryButtons();
  };
  const updateHistoryButtons = () => {
    if ($("undoBtn")) $("undoBtn").disabled = history.pointer <= 0;
    if ($("redoBtn")) $("redoBtn").disabled = history.pointer >= history.stack.length - 1;
  };
  const undo = () => {
    if (history.pointer <= 0) return;
    isRestoringHistory = true;
    history.pointer -= 1;
    restoreState(stateCloneFromHistory());
    render({ skipHistory: true });
    isRestoringHistory = false;
    updateHistoryButtons();
  };
  const redo = () => {
    if (history.pointer >= history.stack.length - 1) return;
    isRestoringHistory = true;
    history.pointer += 1;
    restoreState(stateCloneFromHistory());
    render({ skipHistory: true });
    isRestoringHistory = false;
    updateHistoryButtons();
  };
  const stateCloneFromHistory = () => (typeof structuredClone === "function" ? structuredClone(history.stack[history.pointer]) : clone(history.stack[history.pointer]));
  const addMonths = (start, monthIndex) => {
    const date = new Date(start.getFullYear(), start.getMonth() + monthIndex, 1);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
  };

  const initWorker = () => {
    try {
      calcWorker = new Worker("worker.js");
      calcWorker.onmessage = event => {
        const message = event.data || {};
        const requestId = message.requestId || message.payload?.requestId;
        const pending = pendingCalcs.get(requestId);
        if (!pending || message.type !== "RESULT") return;
        pendingCalcs.delete(requestId);
        pending.resolve(message.payload);
      };
      calcWorker.onerror = () => {
        calcWorker = null;
        pendingCalcs.forEach(item => item.reject(new Error("Worker failed")));
        pendingCalcs.clear();
      };
    } catch {
      calcWorker = null;
    }
  };

  const calculatePlanAsync = (plan, rateOffset = 0) => {
    if (!calcWorker) return Promise.resolve({ result: calculatePlan(plan, rateOffset), worker: false });
    const requestId = ++calcRequestId;
    return new Promise(resolve => {
      pendingCalcs.set(requestId, {
        resolve: payload => resolve({ ...(payload || {}), worker: true, requestId }),
        reject: () => resolve({ result: calculatePlan(plan, rateOffset), worker: false, requestId })
      });
      calcWorker.postMessage({ type: "CALCULATE", requestId, payload: { plan, rateOffset, requestId } });
      window.setTimeout(() => {
        const pending = pendingCalcs.get(requestId);
        if (!pending) return;
        pendingCalcs.delete(requestId);
        pending.reject();
      }, 1200);
    });
  };

  const monthlyRateAt = (rates, monthIndex) => {
    let passed = 0;
    for (const item of rates) {
      passed += Math.max(0, Number(item.months) || 0);
      if (monthIndex <= passed) return (Number(item.rate) || 0) / 100 / 12;
    }
    const last = rates[rates.length - 1] || { rate: 0 };
    return (Number(last.rate) || 0) / 100 / 12;
  };

  const annuityPayment = (principal, monthlyRate, months) => {
    if (principal <= 0 || months <= 0) return 0;
    if (monthlyRate === 0) return roundCurrency(principal / months);
    const factor = Math.pow(1 + monthlyRate, months);
    return roundCurrency(principal * monthlyRate * factor / (factor - 1));
  };

  const applyBankTemplate = (templateKey) => {
    const template = BANK_TEMPLATES[templateKey];
    if (!template) return;
    const loan = activePlan().loans[0] || defaultLoan(template.name);
    Object.assign(loan, {
      name: template.name,
      amount: template.amount,
      years: template.years,
      graceMonths: template.graceMonths,
      method: template.method,
      prepayMode: template.prepayMode,
      rates: clone(template.rates),
      collapsed: false
    });
    if (!Array.isArray(loan.prepays)) loan.prepays = [];
    if (!activePlan().loans.length) activePlan().loans.push(loan);
  };

  const buildSchedule = (loan, rateOffset = 0) => {
    const errors = [];
    const totalMonths = Math.round(clamp(loan.years, 1) * 12);
    let balance = roundMoney(clamp(loan.amount, 0));
    const graceMonths = Math.min(Math.round(clamp(loan.graceMonths, 0)), totalMonths);
    const prepays = [...loan.prepays]
      .map(p => ({ month: Math.round(clamp(p.month, 1)), amount: roundMoney(clamp(p.amount, 0)) }))
      .sort((a, b) => a.month - b.month);
    const rows = [];
    let fixedPrincipal = totalMonths > graceMonths ? roundCurrency(balance / (totalMonths - graceMonths)) : balance;
    let payment = 0;
    let lastRate = null;
    let lockedPayment = 0;

    if (balance <= 0) errors.push(`${loan.name}：貸款金額不可小於或等於 0`);
    if (loan.years <= 0) errors.push(`${loan.name}：年限不可為 0`);
    if (loan.rates.some(r => Number(r.rate) + rateOffset < 0)) errors.push(`${loan.name}：利率不可負數`);
    const rateMonths = loan.rates.reduce((sum, r) => sum + clamp(r.months, 0), 0);
    if (rateMonths < totalMonths) errors.push(`${loan.name}：利率月數不足，已自動延伸最後利率`);

    for (let month = 1; month <= totalMonths && balance > 0.005; month += 1) {
      const rate = Math.max(0, monthlyRateAt(loan.rates.map(r => ({ ...r, rate: Number(r.rate) + rateOffset })), month));
      const interest = roundMoney(balance * rate);
      const remainingAfterThis = totalMonths - month + 1;
      const inGrace = month <= graceMonths;
      if (loan.method === "annuity" && (payment === 0 || (!lockedPayment && lastRate !== rate) || month === graceMonths + 1)) {
        payment = annuityPayment(balance, rate, remainingAfterThis);
      }
      if (loan.method === "annuity" && loan.prepayMode === "shortenTerm" && prepayAhead(prepays, month) && !lockedPayment && !inGrace) {
        lockedPayment = payment;
      }
      if (lockedPayment) payment = lockedPayment;
      lastRate = rate;

      let principal = 0;
      let pay = interest;
      if (!inGrace) {
        if (loan.method === "equalPrincipal") {
          principal = roundCurrency(Math.min(balance, fixedPrincipal));
          if (remainingAfterThis === 1 || balance < principal) principal = balance;
          pay = roundCurrency(principal + interest);
        } else {
          principal = roundCurrency(Math.min(balance, Math.max(0, payment - interest)));
          if (remainingAfterThis === 1 || balance < payment) principal = balance;
          pay = roundCurrency(principal + interest);
        }
      }

      let prepay = prepays.filter(p => p.month === month).reduce((sum, p) => sum + p.amount, 0);
      if (prepay > balance - principal) {
        if (prepay > 0) errors.push(`${loan.name}：第 ${month} 月提前還款超過剩餘本金，已調整`);
        prepay = Math.max(0, balance - principal);
      }

      balance = roundMoney(balance - principal - prepay);
      if (balance < 0.01) balance = 0;
      if (prepay > 0 && loan.prepayMode === "reducePayment") {
        payment = annuityPayment(balance, rate, Math.max(1, totalMonths - month));
        fixedPrincipal = roundCurrency(balance / Math.max(1, totalMonths - month));
      }
      if (prepay > 0 && loan.prepayMode === "shortenTerm" && !lockedPayment && !inGrace) {
        lockedPayment = payment;
      }

      rows.push({
        loanId: loan.id,
        loanName: loan.name,
        month,
        date: addMonths(new Date(), month - 1),
        payment: roundMoney(pay + prepay),
        normalPayment: roundMoney(pay),
        principal: roundMoney(principal + prepay),
        interest,
        prepay,
        balance
      });
    }
    return { rows, errors };
  };

  const prepayAhead = (prepays, month) => prepays.some(item => item.month === month);

  const calculatePlan = (plan, rateOffset = 0) => {
    const schedules = plan.loans.map(loan => buildSchedule(loan, rateOffset));
    const errors = schedules.flatMap(item => item.errors);
    const rows = schedules.flatMap(item => item.rows);
    const byMonth = new Map();
    rows.forEach(row => {
      const current = byMonth.get(row.month) || { month: row.month, date: row.date, payment: 0, normalPayment: 0, principal: 0, interest: 0, prepay: 0, balance: 0 };
      current.payment = roundCurrency(current.payment + row.payment);
      current.normalPayment = roundCurrency(current.normalPayment + row.normalPayment);
      current.principal = roundCurrency(current.principal + row.principal);
      current.interest = roundCurrency(current.interest + row.interest);
      current.prepay = roundCurrency(current.prepay + row.prepay);
      byMonth.set(row.month, current);
    });
    const combined = [...byMonth.values()].sort((a, b) => a.month - b.month);
    combined.forEach(row => {
      row.balance = roundCurrency(rows.filter(item => item.month === row.month).reduce((sum, item) => sum + item.balance, 0));
    });
    const totalPrincipal = roundCurrency(plan.loans.reduce((sum, loan) => sum + clamp(loan.amount, 0), 0));
    const totalInterest = roundCurrency(rows.reduce((sum, row) => sum + row.interest, 0));
    const totalPaid = roundCurrency(rows.reduce((sum, row) => sum + row.payment, 0));
    return {
      rows,
      combined,
      errors,
      totalPrincipal,
      totalInterest,
      totalPaid,
      firstPayment: combined[0]?.payment || 0,
      payoffDate: combined.at(-1)?.date || "-"
    };
  };

  const withoutPrepays = (plan) => {
    const copy = clone(plan);
    copy.loans = copy.loans.map(loan => ({ ...loan, prepays: [] }));
    return copy;
  };

  const calculatePrepayImpact = (plan, result) => {
    const hasPrepays = plan.loans.some(loan => (loan.prepays || []).some(item => clamp(item.amount, 0) > 0));
    if (!hasPrepays) return { interestSaved: 0, monthsEarly: 0, yearsEarly: 0, newPayment: 0, payoffDate: result.payoffDate };
    const baseline = calculatePlan(withoutPrepays(plan));
    const interestSaved = roundCurrency(baseline.totalInterest - result.totalInterest);
    const monthsEarly = Math.max(0, baseline.combined.length - result.combined.length);
    const reducePaymentRows = result.rows.filter(row => {
      const loan = plan.loans.find(item => item.id === row.loanId);
      return loan?.prepayMode === "reducePayment" && row.prepay > 0;
    });
    const lastReducePayment = reducePaymentRows.at(-1);
    const nextPayment = lastReducePayment ? result.combined.find(row => row.month > lastReducePayment.month)?.normalPayment || 0 : 0;
    return {
      interestSaved,
      monthsEarly,
      yearsEarly: roundCurrency(monthsEarly / 12),
      newPayment: nextPayment,
      payoffDate: result.payoffDate
    };
  };

  const planWithRateCycles = (plan) => {
    const cycles = [...(plan.rateCycles || [])]
      .map(item => ({ year: Math.max(1, Math.round(clamp(item.year, 1))), rate: Number(item.rate) || 0 }))
      .sort((a, b) => a.year - b.year);
    if (!cycles.length) return plan;
    const clonePlan = clone(plan);
    clonePlan.loans = clonePlan.loans.map(loan => {
      const totalYears = clamp(loan.years, 1);
      const validCycles = cycles.filter(item => item.year <= totalYears);
      const source = validCycles.length ? validCycles : [{ year: 1, rate: loan.rates?.[0]?.rate || 0 }];
      return {
        ...loan,
        rates: source.map((item, index) => {
          const next = source[index + 1];
          const endYear = next ? next.year : totalYears + 1;
          return { months: Math.max(1, Math.round((endYear - item.year) * 12)), rate: item.rate };
        })
      };
    });
    return clonePlan;
  };

  const optimizePrepay = (plan, annualAmount) => {
    const amount = roundCurrency(clamp(annualAmount, 0));
    if (amount <= 0) return { year: "-", saving: 0, strategy: "請輸入每年可額外還款", mode: "-" };
    const base = calculatePlan(plan);
    let best = { year: "-", saving: 0, strategy: "無明顯效益", mode: "-" };
    const maxYears = Math.max(1, Math.ceil(base.combined.length / 12));
    for (let year = 1; year <= maxYears; year += 1) {
      ["shortenTerm", "reducePayment"].forEach(mode => {
        const scenario = clone(plan);
        scenario.loans = scenario.loans.map(loan => ({
          ...loan,
          prepayMode: mode,
          prepays: [...(loan.prepays || []), { month: year * 12, amount }]
        }));
        const result = calculatePlan(scenario);
        const saving = roundCurrency(base.totalInterest - result.totalInterest);
        if (saving > best.saving) {
          best = {
            year,
            saving,
            mode,
            strategy: mode === "shortenTerm" ? "縮短年限" : "降低月付"
          };
        }
      });
    }
    return best;
  };

  const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  const load = () => {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (data?.plans?.length) Object.assign(state, data);
      state.plans.forEach(normalizePlan);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const normalizePlan = (plan) => {
    plan.dsr ||= { income: 90000, creditLoan: 0, carLoan: 0, cardDebt: 0 };
    plan.cashFlow ||= { bonus: 0, growth: 2, etf: 10000, rent: 0, child: 0 };
    plan.rateCycles ||= [{ year: 1, rate: 2.1 }, { year: 3, rate: 2.5 }, { year: 6, rate: 2.2 }];
    plan.stressTest ||= {};
    plan.compareScenarios ||= [];
    plan.refinanceHistory ||= [];
    return plan;
  };

  const openDb = () => new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error("IndexedDB not available"));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(SNAPSHOT_STORE)) db.createObjectStore(SNAPSHOT_STORE, { keyPath: "id" });
      ["compareScenarios", "refinanceHistory", "stressTestHistory", "cashFlowSimulations"].forEach(store => {
        if (!db.objectStoreNames.contains(store)) db.createObjectStore(store, { keyPath: "id" });
      });
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });

  const idbGetAll = async (storeName) => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const request = db.transaction(storeName, "readonly").objectStore(storeName).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  };

  const idbPutAll = async (storeName, items) => {
    const db = await openDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(storeName, "readwrite");
      const store = tx.objectStore(storeName);
      store.clear();
      items.forEach(item => store.put(item));
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  };

  const loadSnapshotsFromStorage = () => {
    try {
      const items = JSON.parse(localStorage.getItem(SNAPSHOT_KEY));
      return Array.isArray(items) ? items : [];
    } catch {
      localStorage.removeItem(SNAPSHOT_KEY);
      return [];
    }
  };

  const loadSnapshots = () => snapshotCache;

  const syncSnapshotsFromDb = async () => {
    try {
      const dbItems = await idbGetAll(SNAPSHOT_STORE);
      snapshotCache = dbItems.length ? dbItems.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt))) : loadSnapshotsFromStorage();
      if (!dbItems.length && snapshotCache.length) await idbPutAll(SNAPSHOT_STORE, snapshotCache);
    } catch {
      snapshotCache = loadSnapshotsFromStorage();
    }
  };

  const saveSnapshots = (items) => {
    snapshotCache = items;
    localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(items.map(item => ({ id: item.id, name: item.name, createdAt: item.createdAt, updatedAt: item.updatedAt }))));
    idbPutAll(SNAPSHOT_STORE, items).catch(() => localStorage.setItem(SNAPSHOT_KEY, JSON.stringify(items)));
  };

  const createSnapshot = (name) => {
    const now = new Date().toISOString();
    const plan = normalizePlan(clone(activePlan()));
    const snapshots = loadSnapshots();
    snapshots.unshift({
      id: crypto.randomUUID(),
      name: name || `${plan.name} ${new Date().toLocaleString("zh-TW")}`,
      loans: clone(plan.loans),
      settings: { activePlan: state.activePlan, dsr: clone(plan.dsr) },
      compareScenarios: clone(state.plans),
      stressTest: clone(plan.stressTest),
      cashFlow: clone(plan.cashFlow),
      rateCycles: clone(plan.rateCycles),
      refinanceHistory: clone(plan.refinanceHistory),
      createdAt: now,
      updatedAt: now
    });
    saveSnapshots(snapshots);
  };

  const loadSnapshot = (id) => {
    const snapshot = loadSnapshots().find(item => item.id === id);
    if (!snapshot) return;
    activePlan().loans = clone(snapshot.loans || []);
    activePlan().dsr = clone(snapshot.settings?.dsr || activePlan().dsr);
    activePlan().cashFlow = clone(snapshot.cashFlow || activePlan().cashFlow);
    activePlan().rateCycles = clone(snapshot.rateCycles || activePlan().rateCycles || []);
    activePlan().stressTest = clone(snapshot.stressTest || {});
    activePlan().compareScenarios = clone(snapshot.compareScenarios || []);
    activePlan().refinanceHistory = clone(snapshot.refinanceHistory || []);
  };

  const deleteSnapshot = (id) => saveSnapshots(loadSnapshots().filter(item => item.id !== id));

  const renameSnapshot = (id) => {
    const snapshots = loadSnapshots();
    const snapshot = snapshots.find(item => item.id === id);
    if (!snapshot) return;
    const name = prompt("Snapshot 名稱", snapshot.name);
    if (!name) return;
    snapshot.name = name;
    snapshot.updatedAt = new Date().toISOString();
    saveSnapshots(snapshots);
  };

  const copySnapshot = (id) => {
    const snapshots = loadSnapshots();
    const snapshot = snapshots.find(item => item.id === id);
    if (!snapshot) return;
    const now = new Date().toISOString();
    snapshots.unshift({ ...clone(snapshot), id: crypto.randomUUID(), name: `${snapshot.name} 副本`, createdAt: now, updatedAt: now });
    saveSnapshots(snapshots);
  };

  const renderLoanList = () => {
    $("loanList").innerHTML = activePlan().loans.map(loan => `
      <article class="loan-card ${loan.collapsed ? "collapsed" : ""}" data-loan="${loan.id}">
        <div class="loan-head">
          <div class="loan-title"><strong>${escapeHtml(loan.name)}</strong><span>${money.format(loan.amount)} / ${loan.years} 年 / 寬限 ${loan.graceMonths} 月</span></div>
          <div class="loan-actions">
            <button data-action="toggle">${loan.collapsed ? "展開" : "收合"}</button>
            <button data-action="copy">複製</button>
            <button data-action="delete" class="danger">刪除</button>
          </div>
        </div>
        <div class="loan-body">
          <div class="form-grid">
            <label>貸款名稱<input data-field="name" value="${escapeAttr(loan.name)}"></label>
            <label>貸款金額<input data-field="amount" type="number" min="0" step="10000" value="${loan.amount}"></label>
            <label>年限<input data-field="years" type="number" min="1" step="1" value="${loan.years}"></label>
            <label>寬限期（月）<input data-field="graceMonths" type="number" min="0" step="1" value="${loan.graceMonths}"></label>
            <label>還款方式<select data-field="method"><option value="annuity">本息平均</option><option value="equalPrincipal">本金平均</option></select></label>
            <label>提前還款模式<select data-field="prepayMode"><option value="reducePayment">減少月付</option><option value="shortenTerm">縮短年限</option></select></label>
          </div>
          <div class="subsection">
            <div class="subsection-title">利率階段<button data-action="addRate">新增利率</button></div>
            <div class="row-list">${loan.rates.map((rate, index) => `
              <div class="rate-row" data-rate="${index}">
                <label>月數<input data-rate-field="months" type="number" min="1" step="1" value="${rate.months}"></label>
                <label>年利率 %<input data-rate-field="rate" type="number" min="0" step="0.01" value="${rate.rate}"></label>
                <button data-action="deleteRate" class="danger">刪除</button>
              </div>`).join("")}</div>
          </div>
          <div class="subsection">
            <div class="subsection-title">提前還款<button data-action="addPrepay">新增提前還款</button></div>
            <div class="row-list">${loan.prepays.map((prepay, index) => `
              <div class="prepay-row" data-prepay="${index}">
                <label>月份<input data-prepay-field="month" type="number" min="1" step="1" value="${prepay.month}"></label>
                <label>金額<input data-prepay-field="amount" type="number" min="0" step="10000" value="${prepay.amount}"></label>
                <button data-action="deletePrepay" class="danger">刪除</button>
              </div>`).join("")}</div>
          </div>
        </div>
      </article>
    `).join("");
    activePlan().loans.forEach(loan => {
      const card = document.querySelector(`[data-loan="${loan.id}"]`);
      if (card) {
        card.querySelector('[data-field="method"]').value = loan.method;
        card.querySelector('[data-field="prepayMode"]').value = loan.prepayMode;
      }
    });
  };

  const renderSummary = (result) => {
    $("totalPrincipal").textContent = money.format(result.totalPrincipal);
    $("monthlyPayment").textContent = money.format(result.firstPayment);
    $("totalInterest").textContent = money.format(result.totalInterest);
    $("totalPaid").textContent = money.format(result.totalPaid);
    $("payoffDate").textContent = result.payoffDate;
    $("errors").hidden = result.errors.length === 0;
    $("errors").innerHTML = result.errors.map(error => `<div>${escapeHtml(error)}</div>`).join("");
  };

  const renderSchedule = (combined) => {
    scheduleCache = combined;
    const tableWrap = $("virtualTable");
    if (combined.length <= 1000) {
      $("scheduleBody").innerHTML = combined.map(row => `
      <tr><td>${row.month}</td><td>${row.date}</td><td>${money.format(row.payment)}</td><td>${money.format(row.principal)}</td><td>${money.format(row.interest)}</td><td>${money.format(row.prepay)}</td><td>${money.format(row.balance)}</td></tr>
    `).join("");
      return;
    }
    renderVirtualRows(tableWrap.scrollTop || 0);
  };

  const renderVirtualRows = (scrollTop = 0) => {
    const tableWrap = $("virtualTable");
    if (!tableWrap || scheduleCache.length <= 1000) return;
    const visibleCount = Math.ceil(tableWrap.clientHeight / virtualTable.rowHeight) + virtualTable.overscan * 2;
    const start = Math.max(0, Math.floor(scrollTop / virtualTable.rowHeight) - virtualTable.overscan);
    const end = Math.min(scheduleCache.length, start + visibleCount);
    const topHeight = start * virtualTable.rowHeight;
    const bottomHeight = Math.max(0, (scheduleCache.length - end) * virtualTable.rowHeight);
    const rows = scheduleCache.slice(start, end).map(row => `
      <tr><td>${row.month}</td><td>${row.date}</td><td>${money.format(row.payment)}</td><td>${money.format(row.principal)}</td><td>${money.format(row.interest)}</td><td>${money.format(row.prepay)}</td><td>${money.format(row.balance)}</td></tr>
    `).join("");
    $("scheduleBody").innerHTML = `
      <tr class="virtual-spacer"><td colspan="7" style="height:${topHeight}px"></td></tr>
      ${rows}
      <tr class="virtual-spacer"><td colspan="7" style="height:${bottomHeight}px"></td></tr>
    `;
  };

  const drawLineChart = (canvas, data, color, fill = false) => {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#d9dee7";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i += 1) {
      const y = 24 + i * ((h - 48) / 3);
      ctx.beginPath(); ctx.moveTo(34, y); ctx.lineTo(w - 14, y); ctx.stroke();
    }
    if (!data.length) return;
    const max = Math.max(...data, 1);
    const xFor = i => 34 + (i / Math.max(1, data.length - 1)) * (w - 52);
    const yFor = v => h - 24 - (v / max) * (h - 52);
    ctx.beginPath();
    data.forEach((v, i) => i ? ctx.lineTo(xFor(i), yFor(v)) : ctx.moveTo(xFor(i), yFor(v)));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
    if (fill) {
      ctx.lineTo(w - 18, h - 24); ctx.lineTo(34, h - 24); ctx.closePath();
      ctx.fillStyle = `${color}22`;
      ctx.fill();
    }
  };

  const drawMultiLineChart = (canvas, series) => {
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#d9dee7";
    ctx.lineWidth = 1;
    for (let i = 0; i < 4; i += 1) {
      const y = 24 + i * ((h - 58) / 3);
      ctx.beginPath(); ctx.moveTo(34, y); ctx.lineTo(w - 14, y); ctx.stroke();
    }
    const maxLen = Math.max(1, ...series.map(item => item.data.length));
    const max = Math.max(1, ...series.flatMap(item => item.data));
    const xFor = i => 34 + (i / Math.max(1, maxLen - 1)) * (w - 52);
    const yFor = v => h - 34 - (v / max) * (h - 68);
    series.forEach(item => {
      ctx.beginPath();
      item.data.forEach((v, i) => i ? ctx.lineTo(xFor(i), yFor(v)) : ctx.moveTo(xFor(i), yFor(v)));
      ctx.strokeStyle = item.color;
      ctx.lineWidth = 2.5;
      ctx.stroke();
    });
    series.forEach((item, index) => {
      const x = 36 + index * 110;
      ctx.fillStyle = item.color;
      ctx.fillRect(x, h - 20, 14, 4);
      ctx.fillStyle = "#65717f";
      ctx.font = "12px Segoe UI";
      ctx.fillText(item.name, x + 20, h - 14);
    });
  };

  const drawRatioChart = (canvas, rows) => {
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const principal = rows.reduce((sum, row) => sum + row.principal, 0);
    const interest = rows.reduce((sum, row) => sum + row.interest, 0);
    const total = Math.max(1, principal + interest);
    const bars = [{ label: "本金", value: principal, color: "#1f6feb" }, { label: "利息", value: interest, color: "#c83232" }];
    bars.forEach((bar, index) => {
      const y = 58 + index * 64;
      ctx.fillStyle = "#eef2f7";
      ctx.fillRect(96, y, canvas.width - 130, 26);
      ctx.fillStyle = bar.color;
      ctx.fillRect(96, y, (canvas.width - 130) * (bar.value / total), 26);
      ctx.fillStyle = "#18202a";
      ctx.font = "14px Segoe UI";
      ctx.fillText(bar.label, 34, y + 18);
      ctx.fillText(`${Math.round(bar.value / total * 100)}%`, canvas.width - 60, y + 18);
    });
  };

  const renderCharts = (result) => {
    const annualCashFlow = simulateAnnualCashFlow(result);
    const rateCycleResult = calculatePlan(planWithRateCycles(activePlan()));
    drawLineChart($("paymentChart"), result.combined.map(r => r.payment), "#1f6feb", true);
    drawRatioChart($("ratioChart"), result.combined);
    drawLineChart($("balanceChart"), result.combined.map(r => r.balance), "#147a42", false);
    drawLineChart($("prepayChart"), result.combined.map(r => r.prepay), "#a86500", true);
    drawLineChart($("interestChart"), result.combined.map((r, i) => result.combined.slice(0, i + 1).reduce((sum, row) => sum + row.interest, 0)), "#b42318", true);
    drawLineChart($("cashChart"), annualCashFlow.map(r => r.disposable), "#126b43", true);
    drawLineChart($("debtRatioChart"), annualCashFlow.map(r => r.dsr), "#9a6700", false);
    drawLineChart($("rateCyclePaymentChart"), rateCycleResult.combined.map(r => r.payment), "#5b5fc7", true);
    drawLineChart($("rateCycleInterestChart"), rateCycleResult.combined.map((r, i) => rateCycleResult.combined.slice(0, i + 1).reduce((sum, row) => sum + row.interest, 0)), "#8f3a84", true);
  };

  const renderStress = (result) => {
    $("stressGrid").innerHTML = [0.5, 1, 2].map(offset => {
      const stressed = calculatePlan(activePlan(), offset);
      const diff = stressed.firstPayment - result.firstPayment;
      const pct = result.firstPayment ? diff / result.firstPayment * 100 : 0;
      return `<article class="stress-card"><span>利率 +${offset}%</span><strong>${money.format(stressed.firstPayment)}</strong><span>增加 ${money.format(diff)} / ${pct.toFixed(1)}%</span></article>`;
    }).join("");
  };

  const renderPlans = () => {
    $("planTabs").innerHTML = state.plans.map((plan, index) => `<button class="${index === state.activePlan ? "active" : ""}" data-plan="${index}">${escapeHtml(plan.name)}</button>`).join("");
    const base = calculatePlan(state.plans[0]);
    const colors = ["#1f6feb", "#147a42", "#b42318", "#9a6700", "#5b5fc7"];
    const planResults = state.plans.map(plan => calculatePlan(plan));
    drawMultiLineChart($("comparePaymentChart"), state.plans.map((plan, index) => ({ name: plan.name, color: colors[index % colors.length], data: planResults[index].combined.map(row => row.payment) })));
    drawMultiLineChart($("compareInterestChart"), state.plans.map((plan, index) => ({ name: plan.name, color: colors[index % colors.length], data: planResults[index].combined.map((row, rowIndex) => planResults[index].combined.slice(0, rowIndex + 1).reduce((sum, item) => sum + item.interest, 0)) })));
    $("comparison").innerHTML = state.plans.map(plan => {
      const result = calculatePlan(plan);
      return `<article class="compare-card"><span>${escapeHtml(plan.name)}</span><strong>${money.format(result.firstPayment)}</strong><span>月付差 ${money.format(result.firstPayment - base.firstPayment)}</span><br><span>總利息差 ${money.format(result.totalInterest - base.totalInterest)}</span><br><span>清償 ${result.payoffDate}</span></article>`;
    }).join("");
  };

  const renderDsr = (result) => {
    const dsr = activePlan().dsr;
    const cashFlow = activePlan().cashFlow || {};
    $("incomeInput").value = dsr.income;
    $("creditLoanInput").value = dsr.creditLoan;
    $("carLoanInput").value = dsr.carLoan;
    $("cardDebtInput").value = dsr.cardDebt;
    $("bonusInput").value = cashFlow.bonus || 0;
    $("growthInput").value = cashFlow.growth || 0;
    $("etfInput").value = cashFlow.etf || 0;
    $("rentInput").value = cashFlow.rent || 0;
    $("childInput").value = cashFlow.child || 0;
    if ($("rateCycleList")) {
      $("rateCycleList").innerHTML = (activePlan().rateCycles || []).map((item, index) => `
        <div class="rate-cycle-row" data-rate-cycle="${index}">
          <label>年份<input data-rate-cycle-field="year" type="number" min="1" step="1" value="${item.year}"></label>
          <label>利率 %<input data-rate-cycle-field="rate" type="number" min="0" step="0.01" value="${item.rate}"></label>
          <button data-rate-cycle-action="delete" class="danger">刪除</button>
        </div>
      `).join("");
    }
    const ratio = dsr.income > 0 ? (result.firstPayment + clamp(dsr.creditLoan, 0) + clamp(dsr.carLoan, 0) + clamp(dsr.cardDebt, 0)) / dsr.income * 100 : 0;
    const level = ratio < 35 ? ["安全", "safe"] : ratio < 50 ? ["注意", "warn"] : ["風險偏高", "risk"];
    $("dsrBadge").textContent = `${ratio.toFixed(1)}%`;
    $("dsrLevel").textContent = level[0];
    $("dsrLevel").className = `dsr-level ${level[1]}`;
  };

  const simulateAnnualCashFlow = (result) => {
    const plan = activePlan();
    const cashFlow = plan.cashFlow || {};
    const years = Math.max(1, Math.ceil(result.combined.length / 12));
    return Array.from({ length: years }, (_, index) => {
      const year = index + 1;
      const income = roundCurrency(((clamp(plan.dsr.income, 0) * 12) + clamp(cashFlow.bonus, 0)) * Math.pow(1 + (Number(cashFlow.growth) || 0) / 100, index) + clamp(cashFlow.rent, 0) * 12);
      const mortgage = roundCurrency(result.combined.slice(index * 12, index * 12 + 12).reduce((sum, row) => sum + row.normalPayment, 0));
      const invest = roundCurrency(clamp(cashFlow.etf, 0) * 12);
      const child = roundCurrency(clamp(cashFlow.child, 0) * 12);
      const disposable = roundCurrency(income - mortgage - invest - child);
      const dsr = income ? roundCurrency(mortgage / income * 100) : 0;
      return { year, income, mortgage, invest, child, disposable, dsr, risk: dsr > 60 ? "高風險現金流" : "可控" };
    });
  };

  const analyzeRisks = (result) => {
    const risks = [];
    const plan = activePlan();
    const monthlyIncome = clamp(plan.dsr.income, 0);
    const debt = clamp(plan.dsr.creditLoan, 0) + clamp(plan.dsr.carLoan, 0) + clamp(plan.dsr.cardDebt, 0);
    const dsr = monthlyIncome ? (result.firstPayment + debt) / monthlyIncome * 100 : 0;
    const stressed = calculatePlan(plan, 1);
    const paymentJump = result.firstPayment ? (stressed.firstPayment - result.firstPayment) / result.firstPayment * 100 : 0;
    const longLoan = plan.loans.some(loan => clamp(loan.years, 0) >= 40);
    const graceRisk = plan.loans.some(loan => clamp(loan.graceMonths, 0) > 0);
    const prepayTotal = result.combined.reduce((sum, row) => sum + row.prepay, 0);
    const prepaySavingSignal = prepayTotal > 0 && prepayTotal < result.totalPrincipal * 0.02;

    if (dsr >= 60) risks.push({ level: "high", title: "DSR 過高", badge: "高風險", text: `目前 DSR 約 ${dsr.toFixed(1)}%，已超過 60%，現金流緩衝不足。`, action: "建議降低貸款金額、拉高自備款，或先降低其他債務。" });
    else if (dsr >= 45) risks.push({ level: "medium", title: "DSR 偏高", badge: "注意", text: `目前 DSR 約 ${dsr.toFixed(1)}%，接近高壓區間。`, action: "建議保留 6 至 12 個月房貸現金準備。" });

    if (graceRisk) risks.push({ level: "medium", title: "寬限期後月付上升", badge: "月付跳升", text: "方案含寬限期，寬限期結束後會開始攤還本金。", action: "建議用寬限期後月付重新檢查收入負擔。" });
    if (result.totalInterest > result.totalPrincipal * 0.7) risks.push({ level: "high", title: "總利息過高", badge: "成本偏高", text: `總利息已達本金約 ${(result.totalInterest / Math.max(1, result.totalPrincipal) * 100).toFixed(1)}%。`, action: "建議比較較短年期、提前還款或轉貸方案。" });
    else if (result.totalInterest > result.totalPrincipal * 0.5 || longLoan) risks.push({ level: "medium", title: "長年期利息壓力", badge: "長期成本", text: "長年期雖降低月付，但會明顯拉高總利息。", action: "建議用提前還款最佳化檢查第 3 至 10 年還款效益。" });
    if (paymentJump >= 10) risks.push({ level: "medium", title: "升息風險", badge: "+1% 壓力", text: `利率上升 1% 時，首月月付約增加 ${paymentJump.toFixed(1)}%。`, action: "建議確認升息後 DSR 仍低於可承受區間。" });
    if (prepaySavingSignal) risks.push({ level: "low", title: "提前還款效益偏低", badge: "效益有限", text: "目前提前還款金額占本金比例偏低，節省利息有限。", action: "建議集中於利率較高或剩餘年期較長的貸款。" });
    if (!risks.length) risks.push({ level: "low", title: "目前風險可控", badge: "可控", text: "主要指標未超過警示門檻。", action: "建議定期用升息與轉貸情境重新檢查。" });
    return risks;
  };

  const render = async (options = {}) => {
    renderLoanList();
    const planSnapshot = clone(activePlan());
    const requestId = ++calcRequestId;
    const payload = await calculatePlanAsync(planSnapshot);
    if (payload.requestId && payload.requestId < latestAppliedRequestId) return;
    latestAppliedRequestId = payload.requestId || requestId;
    const workerResult = payload.result || calculatePlan(planSnapshot);
    renderSummary(workerResult);
    renderDsr(workerResult);
    renderSchedule(workerResult.combined);
    renderCharts(workerResult);
    renderPlans();
    renderSimplePanels(workerResult);
    save();
    updateHistoryButtons();
  };

  const renderSimplePanels = (result) => {
    const annualCashFlow = simulateAnnualCashFlow(result);
    const cashRisk = annualCashFlow.some(row => row.dsr > 60);
    if ($("cashRiskBadge")) {
      $("cashRiskBadge").textContent = cashRisk ? "高風險現金流" : "可控";
      $("cashRiskBadge").className = `badge ${cashRisk ? "risk" : "safe"}`;
    }
    if ($("cashFlowSummary")) {
      const firstYear = annualCashFlow[0] || { income: 0, mortgage: 0, invest: 0, disposable: 0, dsr: 0 };
      const lastYear = annualCashFlow.at(-1) || firstYear;
      $("cashFlowSummary").innerHTML = `
        <article class="result-card"><span>首年總收入</span><strong>${money.format(firstYear.income)}</strong><span>含年終與被動收入</span></article>
        <article class="result-card"><span>首年房貸支出</span><strong>${money.format(firstYear.mortgage)}</strong><span>房貸收入比 ${firstYear.dsr.toFixed(1)}%</span></article>
        <article class="result-card"><span>首年可支配所得</span><strong>${money.format(firstYear.disposable)}</strong><span>扣除房貸、ETF、育兒</span></article>
        <article class="result-card"><span>末年可支配所得</span><strong>${money.format(lastYear.disposable)}</strong><span>已套用薪資成長率</span></article>
      `;
    }
    const prepayImpact = calculatePrepayImpact(activePlan(), result);
    if ($("interestSaved")) $("interestSaved").textContent = money.format(prepayImpact.interestSaved);
    if ($("riskPanel")) {
      $("riskPanel").innerHTML = analyzeRisks(result).map(r => `
        <article class="risk-card ${r.level}">
          <div><strong>${escapeHtml(r.title)}</strong><span class="risk-badge">${escapeHtml(r.badge)}</span></div>
          <span>${escapeHtml(r.text)}</span>
          <p>${escapeHtml(r.action)}</p>
        </article>
      `).join("");
    }
    if ($("optimizerResult")) {
      const best = optimizePrepay(activePlan(), Number($("extraAnnualInput")?.value) || 0);
      $("optimizerResult").innerHTML = `
        <article class="result-card"><span>最佳提前還款年份</span><strong>${best.year === "-" ? "-" : `第 ${best.year} 年`}</strong><span>${escapeHtml(best.strategy)}</span></article>
        <article class="result-card"><span>預估節省</span><strong>${money.format(best.saving)}</strong><span>相對目前方案總利息</span></article>
        <article class="result-card"><span>最佳策略</span><strong>${escapeHtml(best.strategy)}</strong><span>${best.mode === "shortenTerm" ? "月付不變、縮短期數" : best.mode === "reducePayment" ? "年限不變、降低月付" : "等待輸入"}</span></article>
        <article class="result-card"><span>提前幾年還清</span><strong>${prepayImpact.yearsEarly.toFixed(1)} 年</strong><span>shortenTerm 專用指標</span></article>
        <article class="result-card"><span>新月付</span><strong>${prepayImpact.newPayment ? money.format(prepayImpact.newPayment) : "-"}</strong><span>reducePayment 專用指標</span></article>
        <article class="result-card"><span>新清償日期</span><strong>${escapeHtml(prepayImpact.payoffDate)}</strong><span>重算後日期</span></article>
      `;
    }
    if ($("refiResult")) renderRefi();
    if ($("snapshotList")) {
      const snapshots = loadSnapshots();
      $("snapshotList").innerHTML = snapshots.length ? snapshots.map(item => `
        <article class="snapshot-card" data-snapshot="${item.id}">
          <strong>${escapeHtml(item.name)}</strong>
          <span>建立 ${new Date(item.createdAt).toLocaleString("zh-TW")}</span>
          <div class="snapshot-actions">
            <button data-snapshot-action="load">載入</button>
            <button data-snapshot-action="rename">重新命名</button>
            <button data-snapshot-action="copy">複製</button>
            <button data-snapshot-action="delete" class="danger">刪除</button>
          </div>
        </article>
      `).join("") : `<article class="snapshot-card"><strong>${escapeHtml(activePlan().name)}</strong><span>尚未建立 Snapshot</span></article>`;
    }
  };

  const renderRefi = () => {
    const firstLoan = activePlan().loans[0] || {};
    const balance = roundCurrency(Number($("refiBalance")?.value) || firstLoan.amount || 0);
    const oldRateValue = Number($("refiOldRate")?.value) || firstLoan.rates?.[0]?.rate || 2.1;
    const newRateValue = Number($("refiNewRate")?.value) || Math.max(0, oldRateValue - 0.2);
    const oldMonths = Math.round(clamp(Number($("refiOldYears")?.value) || firstLoan.years || 25, 1) * 12);
    const newMonths = Math.round(clamp(Number($("refiNewYears")?.value) || firstLoan.years || 30, 1) * 12);
    const penalty = roundCurrency(Number($("refiPenalty")?.value) || 0);
    const fee = roundCurrency(Number($("refiFee")?.value) || 0);
    const cost = roundCurrency(penalty + fee);
    const oldPay = annuityPayment(balance, oldRateValue / 100 / 12, oldMonths);
    const newPay = annuityPayment(balance, newRateValue / 100 / 12, newMonths);
    const oldInterest = roundCurrency(oldPay * oldMonths - balance);
    const newInterest = roundCurrency(newPay * newMonths - balance);
    const grossSaving = roundCurrency(oldInterest - newInterest);
    const netSaving = roundCurrency(grossSaving - cost);
    const monthlySaving = roundCurrency(oldPay - newPay);
    const breakEvenYears = monthlySaving > 0 && cost > 0 ? cost / monthlySaving / 12 : 0;
    const worth = grossSaving > cost;
    $("refiBadge").textContent = worth ? "值得轉貸" : "不建議轉貸";
    $("refiBadge").className = `badge ${worth ? "safe" : "warn"}`;
    $("refiResult").innerHTML = `
      <article class="result-card"><span>原貸款剩餘利息</span><strong>${money.format(oldInterest)}</strong><span>月付 ${money.format(oldPay)}</span></article>
      <article class="result-card"><span>新貸款總利息</span><strong>${money.format(newInterest)}</strong><span>月付 ${money.format(newPay)}</span></article>
      <article class="result-card"><span>轉貸總成本</span><strong>${money.format(cost)}</strong><span>違約金 + 手續費</span></article>
      <article class="result-card"><span>預估節省</span><strong>${money.format(netSaving)}</strong><span>利息差扣除轉貸成本</span></article>
      <article class="result-card"><span>回本時間</span><strong>${breakEvenYears ? breakEvenYears.toFixed(1) : "-"} 年</strong><span>以月付差估算</span></article>
      <article class="result-card"><span>建議</span><strong>${worth ? "值得轉貸" : "不建議轉貸"}</strong><span>${worth ? "節省利息高於轉貸成本" : "節省利息未高於轉貸成本"}</span></article>
    `;
  };

  const escapeHtml = (value) => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const escapeAttr = escapeHtml;

  const findLoan = (card) => activePlan().loans.find(loan => loan.id === card.closest("[data-loan]")?.dataset.loan);
  const bindEvents = () => {
    $("addLoanBtn").addEventListener("click", () => {
      pushHistory();
      activePlan().loans.push(defaultLoan(`房貸 ${activePlan().loans.length + 1}`));
      render();
    });
    $("addPlanBtn").addEventListener("click", () => {
      pushHistory();
      const clone = JSON.parse(JSON.stringify(activePlan()));
      clone.id = crypto.randomUUID();
      clone.name = `方案 ${String.fromCharCode(65 + state.plans.length)}`;
      clone.loans.forEach(loan => loan.id = crypto.randomUUID());
      state.plans.push(clone);
      state.activePlan = state.plans.length - 1;
      render();
    });
    $("resetBtn").addEventListener("click", () => {
      pushHistory();
      localStorage.removeItem(STORAGE_KEY);
      state.activePlan = 0;
      state.plans = [{ id: crypto.randomUUID(), name: "方案 A", loans: [defaultLoan("主要房貸")], dsr: { income: 90000, creditLoan: 0, carLoan: 0, cardDebt: 0 }, cashFlow: { bonus: 0, growth: 2, etf: 10000, rent: 0, child: 0 }, rateCycles: [{ year: 1, rate: 2.1 }, { year: 3, rate: 2.5 }, { year: 6, rate: 2.2 }], stressTest: {}, compareScenarios: [], refinanceHistory: [] }];
      render();
    });
    $("templateSelect").addEventListener("change", event => {
      pushHistory();
      applyBankTemplate(event.target.value);
      event.target.value = "";
      render();
    });
    ["saveSnapshotBtn", "loadSnapshotBtn", "createSnapshotBtn"].forEach(id => {
      const button = $(id);
      if (!button) return;
      button.addEventListener("click", () => {
        pushHistory();
        if (id === "saveSnapshotBtn" || id === "createSnapshotBtn") {
          createSnapshot($("snapshotName")?.value.trim());
          if ($("snapshotName")) $("snapshotName").value = "";
        }
        if (id === "loadSnapshotBtn") {
          const first = loadSnapshots()[0];
          if (first) loadSnapshot(first.id);
        }
        save();
        render();
      });
    });
    $("undoBtn").addEventListener("click", undo);
    $("redoBtn").addEventListener("click", redo);
    document.addEventListener("keydown", event => {
      const key = event.key.toLowerCase();
      if ((event.ctrlKey || event.metaKey) && key === "z" && !event.shiftKey) {
        event.preventDefault();
        undo();
      }
      if ((event.ctrlKey || event.metaKey) && ((key === "z" && event.shiftKey) || key === "y")) {
        event.preventDefault();
        redo();
      }
    });
    $("loanList").addEventListener("input", event => {
      const loan = findLoan(event.target);
      if (!loan) return;
      pushHistory();
      const field = event.target.dataset.field;
      if (field) loan[field] = event.target.type === "number" ? Number(event.target.value) : event.target.value;
      const rateField = event.target.dataset.rateField;
      if (rateField) loan.rates[Number(event.target.closest("[data-rate]").dataset.rate)][rateField] = Number(event.target.value);
      const prepayField = event.target.dataset.prepayField;
      if (prepayField) loan.prepays[Number(event.target.closest("[data-prepay]").dataset.prepay)][prepayField] = Number(event.target.value);
      render();
    });
    $("loanList").addEventListener("click", event => {
      const action = event.target.dataset.action;
      if (!action) return;
      const card = event.target.closest("[data-loan]");
      const loan = findLoan(event.target);
      if (!loan) return;
      pushHistory();
      if (action === "toggle") loan.collapsed = !loan.collapsed;
      if (action === "copy") activePlan().loans.push({ ...JSON.parse(JSON.stringify(loan)), id: crypto.randomUUID(), name: `${loan.name} 副本` });
      if (action === "delete") activePlan().loans = activePlan().loans.filter(item => item.id !== card.dataset.loan);
      if (action === "addRate") loan.rates.push({ months: 12, rate: loan.rates.at(-1)?.rate || 2.1 });
      if (action === "deleteRate" && loan.rates.length > 1) loan.rates.splice(Number(event.target.closest("[data-rate]").dataset.rate), 1);
      if (action === "addPrepay") loan.prepays.push({ month: 12, amount: 100000 });
      if (action === "deletePrepay") loan.prepays.splice(Number(event.target.closest("[data-prepay]").dataset.prepay), 1);
      if (!activePlan().loans.length) activePlan().loans.push(defaultLoan("主要房貸"));
      render();
    });
    ["incomeInput", "creditLoanInput", "carLoanInput", "cardDebtInput"].forEach(id => {
      $(id).addEventListener("input", () => {
        pushHistory();
        activePlan().dsr = {
          income: Number($("incomeInput").value),
          creditLoan: Number($("creditLoanInput").value),
          carLoan: Number($("carLoanInput").value),
          cardDebt: Number($("cardDebtInput").value)
        };
        render();
      });
    });
    ["bonusInput", "growthInput", "etfInput", "rentInput", "childInput"].forEach(id => {
      $(id).addEventListener("input", () => {
        pushHistory();
        activePlan().cashFlow = {
          bonus: Number($("bonusInput").value),
          growth: Number($("growthInput").value),
          etf: Number($("etfInput").value),
          rent: Number($("rentInput").value),
          child: Number($("childInput").value)
        };
        render();
      });
    });
    ["extraAnnualInput", "refiBalance", "refiOldRate", "refiOldYears", "refiNewRate", "refiNewYears", "refiPenalty", "refiFee"].forEach(id => {
      const input = $(id);
      if (input) input.addEventListener("input", () => {
        pushHistory();
        render();
      });
    });
    $("addRateCycleBtn").addEventListener("click", () => {
      pushHistory();
      const cycles = activePlan().rateCycles || [];
      const last = cycles.at(-1) || { year: 1, rate: activePlan().loans[0]?.rates?.[0]?.rate || 2.1 };
      cycles.push({ year: last.year + 1, rate: last.rate });
      activePlan().rateCycles = cycles;
      render();
    });
    $("rateCycleList").addEventListener("input", event => {
      const row = event.target.closest("[data-rate-cycle]");
      const field = event.target.dataset.rateCycleField;
      if (!row || !field) return;
      pushHistory();
      activePlan().rateCycles[Number(row.dataset.rateCycle)][field] = Number(event.target.value);
      render();
    });
    $("rateCycleList").addEventListener("click", event => {
      const row = event.target.closest("[data-rate-cycle]");
      if (!row || event.target.dataset.rateCycleAction !== "delete") return;
      pushHistory();
      activePlan().rateCycles.splice(Number(row.dataset.rateCycle), 1);
      render();
    });
    $("snapshotList").addEventListener("click", event => {
      const action = event.target.dataset.snapshotAction;
      const id = event.target.closest("[data-snapshot]")?.dataset.snapshot;
      if (!action || !id) return;
      pushHistory();
      if (action === "load") loadSnapshot(id);
      if (action === "rename") renameSnapshot(id);
      if (action === "copy") copySnapshot(id);
      if (action === "delete") deleteSnapshot(id);
      save();
      render();
    });
    $("planTabs").addEventListener("click", event => {
      if (event.target.dataset.plan) {
        pushHistory();
        state.activePlan = Number(event.target.dataset.plan);
        render();
      }
    });
    $("copyTableBtn").addEventListener("click", async () => {
      const rows = calculatePlan(activePlan()).combined;
      const text = [["月份", "日期", "月付", "本金", "利息", "剩餘本金"], ...rows.map(r => [r.month, r.date, r.payment, r.principal, r.interest, r.balance])].map(r => r.join("\t")).join("\n");
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
      }
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.left = "-9999px";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    });
    $("csvBtn").addEventListener("click", () => {
      const rows = calculatePlan(activePlan()).combined;
      const csv = "\ufeff" + [["月份", "日期", "月付", "本金", "利息", "剩餘本金"], ...rows.map(r => [r.month, r.date, r.payment, r.principal, r.interest, r.balance])].map(r => r.join(",")).join("\n");
      const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "home-loan-schedule.csv";
      link.click();
      URL.revokeObjectURL(url);
    });
    $("virtualTable").addEventListener("scroll", event => {
      if (scheduleCache.length > 1000) renderVirtualRows(event.currentTarget.scrollTop);
    });
  };

  const init = async () => {
    load();
    await syncSnapshotsFromDb();
    initWorker();
    bindEvents();
    pushHistory();
    render();
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
