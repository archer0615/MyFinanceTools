const STORAGE_VERSION = 1;

let renderCallback = () => {};
let saveStatusCallback = () => {};
let backupStatusCallback = () => {};

function configureStorage(options) {
  renderCallback = options.render ?? renderCallback;
  saveStatusCallback = options.updateSaveStatus ?? saveStatusCallback;
  backupStatusCallback = options.updateBackupStatus ?? backupStatusCallback;
}

function buildStoragePayload(data) {
  return {
    version: STORAGE_VERSION,
    data,
  };
}

function isVersionedPayload(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && "version" in value && "data" in value;
}

function migrateLegacyState(legacyState) {
  return {
    version: STORAGE_VERSION,
    data: legacyState,
  };
}

const migrations = {
  1: (payload) => payload,
};

function migrateStoragePayload(parsed) {
  if (!isVersionedPayload(parsed)) {
    return migrateLegacyState(parsed);
  }

  const version = Number(parsed.version) || 1;
  const migration = migrations[version];

  if (!migration) {
    throw new Error(`Unsupported storage version: ${parsed.version}`);
  }

  const migrated = migration(parsed);
  return buildStoragePayload(migrated.data);
}

function normalizeLoadedState(parsed) {
  const migratedPayload = migrateStoragePayload(parsed);
  const defaults = createDefaultState();
  const loaded = migratedPayload.data || {};
  const assets = Array.isArray(loaded.assets)
    ? loaded.assets.map((asset) => createDefaultAsset(asset))
    : defaults.assets;
  const debts = Array.isArray(loaded.debts)
    ? loaded.debts.map((debt) => createDefaultDebt(debt))
    : defaults.debts;
  const events = Array.isArray(loaded.events)
    ? loaded.events.map((eventItem) => createDefaultEvent(eventItem))
    : defaults.events;
  const transactions = Array.isArray(loaded.transactions)
    ? loaded.transactions.map((transaction) => createDefaultTransaction(transaction))
    : defaults.transactions;

  return {
    ...defaults,
    ...loaded,
    assets,
    debts,
    events,
    transactions,
    pledge: { ...defaults.pledge, ...(loaded.pledge || {}) },
    cashflow: { ...defaults.cashflow, ...(loaded.cashflow || {}) },
    repayment: { ...defaults.repayment, ...(loaded.repayment || {}) },
    loanAnalysis: { ...defaults.loanAnalysis, ...(loaded.loanAnalysis || {}) },
    incomeExpense: { ...defaults.incomeExpense, ...(loaded.incomeExpense || {}) },
    budgets: Array.isArray(loaded.budgets) ? loaded.budgets.map((budget) => createDefaultBudget(budget)) : defaults.budgets,
    goal: { ...defaults.goal, ...(loaded.goal || {}) },
    onboarding: { ...defaults.onboarding, ...(loaded.onboarding || {}) },
    scenario: { ...defaults.scenario, ...(loaded.scenario || {}) },
    scenarioPlans: Array.isArray(loaded.scenarioPlans) ? loaded.scenarioPlans : defaults.scenarioPlans,
    fire: { ...defaults.fire, ...(loaded.fire || {}) },
    ui: { ...defaults.ui, ...(loaded.ui || {}) },
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(buildStoragePayload(state)));
    saveStatusCallback("資料已自動保存到本機瀏覽器。");
  } catch (error) {
    saveStatusCallback("本機保存失敗，請改用匯出 JSON 備份。");
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      saveStatusCallback("目前使用預設資料。");
      return false;
    }

    const parsed = JSON.parse(raw);
    syncState(state, normalizeLoadedState(parsed));
    saveStatusCallback("已載入上次保存的本機資料。");
    return true;
  } catch (error) {
    saveStatusCallback("本機資料讀取失敗，已改用預設資料。");
    return false;
  }
}

function exportState() {
  const blob = new Blob([JSON.stringify(buildStoragePayload(state), null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const dateStamp = new Date().toISOString().slice(0, 10);

  link.href = url;
  link.download = `ledgerflow-planner-${dateStamp}.json`;
  link.click();

  URL.revokeObjectURL(url);
  backupStatusCallback("已匯出 JSON 備份。");
}

function importStateFromFile(file) {
  const reader = new FileReader();

  reader.addEventListener("load", () => {
    try {
      const parsed = JSON.parse(String(reader.result || "{}"));
      syncState(state, normalizeLoadedState(parsed));
      renderCallback();
      saveState();
      backupStatusCallback("已從 JSON 匯入資料。");
    } catch (error) {
      backupStatusCallback("匯入失敗，請確認檔案為有效 JSON。");
    }
  });

  reader.readAsText(file);
}

function resetState() {
  if (!window.confirm("確定要重設為預設資料？目前輸入會被覆蓋，建議先匯出 JSON 備份。")) {
    backupStatusCallback("已取消重設。");
    return;
  }

  syncState(state, createDefaultState());
  renderCallback();
  saveState();
  backupStatusCallback("已重設為預設資料，建議重新匯出備份。");
}

window.FinancePlannerStorage = {
  configureStorage,
  saveState,
  loadState,
  exportState,
  importStateFromFile,
  resetState,
};

Object.assign(window, window.FinancePlannerStorage);
