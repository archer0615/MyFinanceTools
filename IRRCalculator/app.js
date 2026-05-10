const STORAGE_KEY = "irr-calculator-state";
const LEGACY_STORAGE_KEY = "irr-calculator-cashflows";
const STORAGE_SCHEMA_VERSION = 2;
const {
  MS_PER_DAY,
  estimateXirr,
  calculatePortfolioIrr,
  annualizeReturn,
  calculateCagr,
  calculateTwrr,
  calculateMwrr,
  calculateVolatility,
  calculateMaxDrawdown,
  calculateSharpeRatio,
  calculateMeanAnnualized,
  calculateWeightedAnnualized,
  buildBatchConversionRows,
  pickAssetSortBasis,
  rankAssets,
} = globalThis.IRRCalculatorCore ?? {};
const DEFAULT_IRR_VIEW_MODE = "single";
const DEFAULT_ROWS = [
  { date: "", amount: "", note: "" },
  { date: "", amount: "", note: "" },
];
const DEFAULT_ASSET_ROWS = [
  { name: "", return1y: "", return3y: "", return5y: "", return10y: "", monthlyReturns: "" },
  { name: "", return1y: "", return3y: "", return5y: "", return10y: "", monthlyReturns: "" },
];
const DEFAULT_ASSET_SORT_BASIS = "return5y";
const DEFAULT_ASSET_CHART_FILTER = "all";
const DEFAULT_ASSET_SORT_WEIGHTS = {
  return1y: 1,
  return3y: 1,
  return5y: 1,
  return10y: 1,
};
const PRICE_CACHE_PREFIX = "irr-calculator-price-cache:";
const PRICE_CACHE_MAX_AGE_MS = 24 * 60 * 60 * 1000;
const ASSET_SORT_OPTIONS = [
  { key: "return1y", label: "1Y" },
  { key: "return3y", label: "3Y" },
  { key: "return5y", label: "5Y" },
  { key: "return10y", label: "10Y" },
  { key: "mean", label: "平均年化" },
  { key: "weighted", label: "加權分數" },
];
const SAMPLE_ROWS = [
  { date: "2021-01-15", amount: "-100000", note: "首次買進" },
  { date: "2021-07-20", amount: "3500", note: "現金股利" },
  { date: "2022-08-10", amount: "-50000", note: "加碼" },
  { date: "2023-07-25", amount: "4200", note: "現金股利" },
  { date: "2024-12-18", amount: "182000", note: "全部賣出" },
];

const elements = {
  cashflowBody: document.querySelector("#cashflow-body"),
  cashflowTemplate: document.querySelector("#cashflow-row-template"),
  addRowButton: document.querySelector("#add-row-button"),
  sampleButton: document.querySelector("#sample-button"),
  importCashflowsButton: document.querySelector("#import-cashflows-button"),
  exportCashflowsButton: document.querySelector("#export-cashflows-button"),
  exportReportButton: document.querySelector("#export-report-button"),
  exportPdfButton: document.querySelector("#export-pdf-button"),
  clearStorageButton: document.querySelector("#clear-storage-button"),
  calculateButton: document.querySelector("#calculate-button"),
  cashflowsFileInput: document.querySelector("#cashflows-file-input"),
  status: document.querySelector("#status"),
  irrViewMode: document.querySelector("#irr-view-mode"),
  irrValue: document.querySelector("#irr-value"),
  portfolioIrrValue: document.querySelector("#portfolio-irr-value"),
  totalInvested: document.querySelector("#total-invested"),
  totalReturned: document.querySelector("#total-returned"),
  netCashflow: document.querySelector("#net-cashflow"),
  cagrValue: document.querySelector("#cagr-value"),
  twrValue: document.querySelector("#twr-value"),
  mwrrValue: document.querySelector("#mwrr-value"),
  resultSummary: document.querySelector("#result-summary"),
  returnSampleButton: document.querySelector("#return-sample-button"),
  convertReturnButton: document.querySelector("#convert-return-button"),
  periodYears: document.querySelector("#period-years"),
  totalReturnRate: document.querySelector("#total-return-rate"),
  startingValue: document.querySelector("#starting-value"),
  annualizedReturn: document.querySelector("#annualized-return"),
  endingValue: document.querySelector("#ending-value"),
  profitValue: document.querySelector("#profit-value"),
  conversionLabel: document.querySelector("#conversion-label"),
  conversionStatus: document.querySelector("#conversion-status"),
  conversionSummary: document.querySelector("#conversion-summary"),
  batchSampleButton: document.querySelector("#batch-sample-button"),
  exportBatchButton: document.querySelector("#export-batch-button"),
  batchConvertButton: document.querySelector("#batch-convert-button"),
  batchStartingValue: document.querySelector("#batch-starting-value"),
  return1y: document.querySelector("#return-1y"),
  return3y: document.querySelector("#return-3y"),
  return5y: document.querySelector("#return-5y"),
  return10y: document.querySelector("#return-10y"),
  batchStatus: document.querySelector("#batch-status"),
  batchResultBody: document.querySelector("#batch-result-body"),
  batchSummary: document.querySelector("#batch-summary"),
  returnChart: document.querySelector("#return-chart"),
  addAssetButton: document.querySelector("#add-asset-button"),
  assetSampleButton: document.querySelector("#asset-sample-button"),
  importAssetsButton: document.querySelector("#import-assets-button"),
  exportAssetsButton: document.querySelector("#export-assets-button"),
  compareAssetsButton: document.querySelector("#compare-assets-button"),
  assetSortBasis: document.querySelector("#asset-sort-basis"),
  assetChartFilter: document.querySelector("#asset-chart-filter"),
  benchmarkAsset: document.querySelector("#benchmark-asset"),
  weight1y: document.querySelector("#weight-1y"),
  weight3y: document.querySelector("#weight-3y"),
  weight5y: document.querySelector("#weight-5y"),
  weight10y: document.querySelector("#weight-10y"),
  assetBody: document.querySelector("#asset-body"),
  assetsFileInput: document.querySelector("#assets-file-input"),
  assetTemplate: document.querySelector("#asset-row-template"),
  assetStatus: document.querySelector("#asset-status"),
  assetResultBody: document.querySelector("#asset-result-body"),
  assetChart: document.querySelector("#asset-chart"),
  assetSummary: document.querySelector("#asset-summary"),
  formulaSummary: document.querySelector("#formula-summary"),
  errorHintSummary: document.querySelector("#error-hint-summary"),
  chartLogicSummary: document.querySelector("#chart-logic-summary"),
};

const currencyFormatter = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat("zh-TW", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function setStatus(message, type = "") {
  if (!elements.status) {
    return;
  }

  elements.status.textContent = message;
  elements.status.classList.remove("success", "error");
  if (type) {
    elements.status.classList.add(type);
  }
}

function formatCurrency(value) {
  return currencyFormatter.format(value);
}

function formatPercent(value) {
  return `${percentFormatter.format(value)}%`;
}

function setMetricValue(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function setSecondaryFeatureState() {
  return;
}

function ensureInlineMessage(input) {
  if (!(input instanceof HTMLElement)) {
    return null;
  }

  const container = input.parentElement;
  if (!container) {
    return null;
  }

  let message = container.querySelector(".inline-message");
  if (!(message instanceof HTMLElement)) {
    message = document.createElement("span");
    message.className = "inline-message";
    message.style.display = "none";
    message.style.color = "#b42318";
    message.style.fontSize = "0.82rem";
    message.style.marginTop = "0.35rem";
    message.style.lineHeight = "1.4";
    message.style.display = "none";
    container.appendChild(message);
  }

  return message;
}

function setInputError(input, message) {
  if (!(input instanceof HTMLElement)) {
    return;
  }

  const inlineMessage = ensureInlineMessage(input);
  input.classList.add("error");
  input.setAttribute("aria-invalid", "true");

  if (inlineMessage) {
    inlineMessage.textContent = message;
    inlineMessage.classList.add("error");
    inlineMessage.style.display = "block";
  }
}

function clearInputError(input) {
  if (!(input instanceof HTMLElement)) {
    return;
  }

  const inlineMessage = ensureInlineMessage(input);
  input.classList.remove("error");
  input.removeAttribute("aria-invalid");

  if (inlineMessage) {
    inlineMessage.textContent = "";
    inlineMessage.classList.remove("error");
    inlineMessage.style.display = "none";
  }
}

function readInputValue(input) {
  return input instanceof HTMLInputElement ? input.value.trim() : "";
}

function validateCashflowRow(row) {
  const dateInput = row.querySelector(".date-input");
  const amountInput = row.querySelector(".amount-input");
  const noteInput = row.querySelector(".note-input");
  const dateValue = readInputValue(dateInput);
  const amountValue = readInputValue(amountInput);
  const noteValue = readInputValue(noteInput);
  const hasAnyValue = Boolean(dateValue || amountValue || noteValue);
  let valid = true;

  if (!hasAnyValue) {
    clearInputError(dateInput);
    clearInputError(amountInput);
    return true;
  }

  if (!dateValue) {
    setInputError(dateInput, "日期為必填。");
    valid = false;
  } else {
    clearInputError(dateInput);
  }

  if (amountValue === "") {
    setInputError(amountInput, "金額為必填。");
    valid = false;
  } else if (parseAnyNumber(amountValue) === null) {
    setInputError(amountInput, "金額必須是有效數字。");
    valid = false;
  } else {
    clearInputError(amountInput);
  }

  return valid;
}

function validateCashflowInputs() {
  return getRows().every((row) => validateCashflowRow(row));
}

function validateSingleReturnInputs() {
  const yearsValue = readInputValue(elements.periodYears);
  const startingValueText = readInputValue(elements.startingValue);
  const totalReturnText = readInputValue(elements.totalReturnRate);
  const hasAnyValue = Boolean(yearsValue || startingValueText || totalReturnText);
  let valid = true;

  if (!hasAnyValue) {
    clearInputError(elements.periodYears);
    clearInputError(elements.startingValue);
    return true;
  }

  if (parsePositiveNumber(yearsValue) === null) {
    setInputError(elements.periodYears, "期間年數必須大於 0。");
    valid = false;
  } else {
    clearInputError(elements.periodYears);
  }

  if (parsePositiveNumber(startingValueText) === null) {
    setInputError(elements.startingValue, "期初金額必須大於 0。");
    valid = false;
  } else {
    clearInputError(elements.startingValue);
  }

  return valid;
}

function getBatchPeriodInputs() {
  return [
    elements.return1y,
    elements.return3y,
    elements.return5y,
    elements.return10y,
  ].filter((input) => input instanceof HTMLInputElement);
}

function validateBatchInputs() {
  const periodInputs = getBatchPeriodInputs();
  const hasAnyPeriodValue = periodInputs.some((input) => input.value.trim() !== "");
  const hasRelatedValue = hasAnyPeriodValue || readInputValue(elements.batchStartingValue) !== "";

  if (!hasRelatedValue) {
    periodInputs.forEach((input) => clearInputError(input));
    return true;
  }

  if (hasAnyPeriodValue) {
    periodInputs.forEach((input) => clearInputError(input));
    return true;
  }

  periodInputs.forEach((input) => setInputError(input, "至少需填入一個期間報酬率。"));
  return false;
}

function createRow(values = {}) {
  if (!elements.cashflowBody || !elements.cashflowTemplate) {
    return;
  }

  const fragment = elements.cashflowTemplate.content.cloneNode(true);
  const row = fragment.querySelector("tr");
  const dateInput = row.querySelector(".date-input");
  const amountInput = row.querySelector(".amount-input");
  const noteInput = row.querySelector(".note-input");

  dateInput.value = values.date ?? "";
  amountInput.value = values.amount ?? "";
  noteInput.value = values.note ?? "";

  elements.cashflowBody.appendChild(row);
  validateCashflowRow(row);
}

function getRows() {
  return [...document.querySelectorAll("#cashflow-body tr")];
}

function ensureMinimumRows() {
  if (getRows().length > 0) {
    return;
  }

  DEFAULT_ROWS.forEach((row) => createRow(row));
}

function getFormState() {
  return getRows().map((row) => ({
    date: row.querySelector(".date-input")?.value ?? "",
    amount: row.querySelector(".amount-input")?.value ?? "",
    note: row.querySelector(".note-input")?.value ?? "",
  }));
}

function getSingleReturnState() {
  return {
    periodYears: elements.periodYears?.value ?? "",
    totalReturnRate: elements.totalReturnRate?.value ?? "",
    startingValue: elements.startingValue?.value ?? "",
  };
}

function getBatchState() {
  return {
    startingValue: elements.batchStartingValue?.value ?? "",
    return1y: elements.return1y?.value ?? "",
    return3y: elements.return3y?.value ?? "",
    return5y: elements.return5y?.value ?? "",
    return10y: elements.return10y?.value ?? "",
  };
}

function getAssetFormState() {
  return getAssetRows().map((row) => {
    const inputs = row.querySelectorAll("input");
    return {
      name: inputs[0]?.value ?? "",
      return1y: inputs[1]?.value ?? "",
      return3y: inputs[2]?.value ?? "",
      return5y: inputs[3]?.value ?? "",
      return10y: inputs[4]?.value ?? "",
      monthlyReturns: inputs[5]?.value ?? "",
    };
  });
}

function getAssetSortBasisState() {
  return elements.assetSortBasis?.value ?? DEFAULT_ASSET_SORT_BASIS;
}

function getAssetChartFilterState() {
  return elements.assetChartFilter?.value ?? DEFAULT_ASSET_CHART_FILTER;
}

function getAssetSortWeightsState() {
  return {
    return1y: readInputValue(elements.weight1y) || String(DEFAULT_ASSET_SORT_WEIGHTS.return1y),
    return3y: readInputValue(elements.weight3y) || String(DEFAULT_ASSET_SORT_WEIGHTS.return3y),
    return5y: readInputValue(elements.weight5y) || String(DEFAULT_ASSET_SORT_WEIGHTS.return5y),
    return10y: readInputValue(elements.weight10y) || String(DEFAULT_ASSET_SORT_WEIGHTS.return10y),
  };
}

function getAppState() {
  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    cashflows: getFormState(),
    irrViewMode: elements.irrViewMode?.value ?? DEFAULT_IRR_VIEW_MODE,
    singleReturn: getSingleReturnState(),
    batch: getBatchState(),
    assetSortBasis: getAssetSortBasisState(),
    assetChartFilter: getAssetChartFilterState(),
    benchmarkAsset: elements.benchmarkAsset?.value ?? "",
    assetSortWeights: getAssetSortWeightsState(),
    assets: getAssetFormState(),
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(getAppState()));
  } catch {
    // Storage is optional in privacy-restricted browsers.
  }
}

function setIrrViewMode(value = DEFAULT_IRR_VIEW_MODE) {
  if (!elements.irrViewMode) {
    return;
  }

  const allowed = ["single", "portfolio", "compare"];
  elements.irrViewMode.value = allowed.includes(value) ? value : DEFAULT_IRR_VIEW_MODE;
  updateIrrCompareView();
}

function clearRows() {
  if (elements.cashflowBody) {
    elements.cashflowBody.innerHTML = "";
  }
}

function clearAssetRows() {
  if (elements.assetBody) {
    elements.assetBody.innerHTML = "";
  }
}

function setSingleReturnState(values = {}) {
  if (elements.periodYears) {
    elements.periodYears.value = values.periodYears ?? "";
  }
  if (elements.totalReturnRate) {
    elements.totalReturnRate.value = values.totalReturnRate ?? "";
  }
  if (elements.startingValue) {
    elements.startingValue.value = values.startingValue ?? "";
  }

  validateSingleReturnInputs();
}

function setBatchState(values = {}) {
  if (elements.batchStartingValue) {
    elements.batchStartingValue.value = values.startingValue ?? "";
  }
  if (elements.return1y) {
    elements.return1y.value = values.return1y ?? "";
  }
  if (elements.return3y) {
    elements.return3y.value = values.return3y ?? "";
  }
  if (elements.return5y) {
    elements.return5y.value = values.return5y ?? "";
  }
  if (elements.return10y) {
    elements.return10y.value = values.return10y ?? "";
  }

  validateBatchInputs();
}

function setAssetSortBasisState(value = DEFAULT_ASSET_SORT_BASIS) {
  if (!elements.assetSortBasis) {
    return;
  }

  const allowed = ASSET_SORT_OPTIONS.some((option) => option.key === value);
  elements.assetSortBasis.value = allowed ? value : DEFAULT_ASSET_SORT_BASIS;
}

function setAssetChartFilterState(value = DEFAULT_ASSET_CHART_FILTER) {
  if (!elements.assetChartFilter) {
    return;
  }

  const allowed = ["all", "return1y", "return3y", "return5y", "return10y"];
  elements.assetChartFilter.value = allowed.includes(value) ? value : DEFAULT_ASSET_CHART_FILTER;
}

function setAssetSortWeightsState(weights = {}) {
  if (elements.weight1y) {
    elements.weight1y.value = weights.return1y ?? String(DEFAULT_ASSET_SORT_WEIGHTS.return1y);
  }
  if (elements.weight3y) {
    elements.weight3y.value = weights.return3y ?? String(DEFAULT_ASSET_SORT_WEIGHTS.return3y);
  }
  if (elements.weight5y) {
    elements.weight5y.value = weights.return5y ?? String(DEFAULT_ASSET_SORT_WEIGHTS.return5y);
  }
  if (elements.weight10y) {
    elements.weight10y.value = weights.return10y ?? String(DEFAULT_ASSET_SORT_WEIGHTS.return10y);
  }
}

function restoreCashflowRows(rows) {
  clearRows();
  rows.forEach((row) => createRow(row));
  ensureMinimumRows();
}

function restoreAssetRows(rows) {
  clearAssetRows();
  rows.forEach((row) => createAssetRow(row));
  ensureMinimumAssetRows();
}

function safeJsonParse(raw, fallback = null) {
  if (typeof raw !== "string" || !raw.trim()) {
    return fallback;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function normalizeStoredRows(rows, defaults) {
  return Array.isArray(rows) && rows.length ? rows : defaults;
}

function migrateState(state) {
  if (!state || typeof state !== "object") {
    return null;
  }

  const schemaVersion = Number.isInteger(state.schemaVersion) ? state.schemaVersion : 1;
  if (schemaVersion > STORAGE_SCHEMA_VERSION) {
    return null;
  }

  return {
    schemaVersion: STORAGE_SCHEMA_VERSION,
    cashflows: normalizeStoredRows(state.cashflows, DEFAULT_ROWS),
    irrViewMode: state.irrViewMode ?? DEFAULT_IRR_VIEW_MODE,
    singleReturn: state.singleReturn ?? {},
    batch: state.batch ?? {},
    assetSortBasis: state.assetSortBasis ?? DEFAULT_ASSET_SORT_BASIS,
    assetChartFilter: state.assetChartFilter ?? DEFAULT_ASSET_CHART_FILTER,
    benchmarkAsset: state.benchmarkAsset ?? "",
    assetSortWeights: state.assetSortWeights ?? DEFAULT_ASSET_SORT_WEIGHTS,
    assets: normalizeStoredRows(state.assets, DEFAULT_ASSET_ROWS),
  };
}

function removeStorageItem(key) {
  try {
    localStorage.removeItem(key);
  } catch {
    // Storage removal is best-effort.
  }
}

function restoreState() {
  let raw = null;
  try {
    raw = localStorage.getItem(STORAGE_KEY);
  } catch {
    return false;
  }

  if (!raw) {
    return restoreLegacyState();
  }

  try {
    const state = migrateState(safeJsonParse(raw));
    if (!state) {
      removeStorageItem(STORAGE_KEY);
      return false;
    }

    restoreCashflowRows(state.cashflows);
    setIrrViewMode(state.irrViewMode);
    setSingleReturnState(state.singleReturn);
    setBatchState(state.batch);
    setAssetSortBasisState(state.assetSortBasis);
    setAssetChartFilterState(state.assetChartFilter);
    setAssetSortWeightsState(state.assetSortWeights);
    if (elements.benchmarkAsset) {
      elements.benchmarkAsset.value = state.benchmarkAsset ?? "";
    }
    restoreAssetRows(state.assets);
    saveState();
    return true;
  } catch {
    removeStorageItem(STORAGE_KEY);
    return false;
  }
}

function restoreLegacyState() {
  let raw = null;
  try {
    raw = localStorage.getItem(LEGACY_STORAGE_KEY);
  } catch {
    return false;
  }

  if (!raw) {
    return false;
  }

  try {
    const rows = safeJsonParse(raw);
    if (!Array.isArray(rows) || !rows.length) {
      return false;
    }

    restoreCashflowRows(rows);
    setIrrViewMode();
    setSingleReturnState();
    setBatchState();
    setAssetSortBasisState();
    setAssetChartFilterState();
    setAssetSortWeightsState();
    if (elements.benchmarkAsset) {
      elements.benchmarkAsset.value = "";
    }
    restoreAssetRows(DEFAULT_ASSET_ROWS);
    saveState();
    removeStorageItem(LEGACY_STORAGE_KEY);
    return true;
  } catch {
    removeStorageItem(LEGACY_STORAGE_KEY);
    return false;
  }
}

function fillSample() {
  restoreCashflowRows(SAMPLE_ROWS);
  saveState();
  calculateIrr();
}

function resetAllInputs() {
  restoreCashflowRows(DEFAULT_ROWS);
  setIrrViewMode();
  setSingleReturnState();
  setBatchState();
  setAssetSortBasisState();
  setAssetChartFilterState();
  setAssetSortWeightsState();
  if (elements.benchmarkAsset) {
    elements.benchmarkAsset.value = "";
  }
  restoreAssetRows(DEFAULT_ASSET_ROWS);
}

function clearSavedState() {
  try {
    Object.keys(localStorage)
      .filter((key) => key === STORAGE_KEY || key === LEGACY_STORAGE_KEY || key.startsWith(PRICE_CACHE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  } catch {
    // Clearing app storage is best-effort.
  }
  resetAllInputs();
  resetResultDisplay();
  resetConversionDisplay();
  resetBatchDisplay();
  resetChartDisplay();
  resetAssetDisplay();
  setStatus("已完成完整清除與重設，所有輸入、比較結果與圖表都已清空。", "success");
}

function shouldAutoCalculateIrr() {
  return getRows().some((row) =>
    Boolean(row.querySelector(".date-input")?.value)
    || Boolean(row.querySelector(".amount-input")?.value)
    || Boolean(row.querySelector(".note-input")?.value)
  );
}

function shouldAutoConvertSingleReturn() {
  return Boolean(
    elements.periodYears?.value?.trim()
    && elements.totalReturnRate?.value?.trim()
    && elements.startingValue?.value?.trim(),
  );
}

function shouldAutoConvertBatch() {
  const hasStartingValue = Boolean(elements.batchStartingValue?.value?.trim());
  const hasAnyPeriod = buildBatchPeriods().some((period) => String(period.value).trim() !== "");
  return hasStartingValue && hasAnyPeriod;
}

function shouldAutoCompareAssets() {
  const filledAssets = getAssetRows().filter((row) => {
    const inputs = row.querySelectorAll("input");
    return [...inputs].some((input) => input.value.trim() !== "");
  });
  return filledAssets.length >= 2;
}

function rerunSavedCalculations() {
  if (shouldAutoCalculateIrr()) {
    calculateIrr();
  }
  if (shouldAutoConvertSingleReturn()) {
    convertSingleReturn();
  }
  if (shouldAutoConvertBatch()) {
    convertBatchReturns();
  }
  if (shouldAutoCompareAssets()) {
    compareAssets();
  }
}

function setFormulaSummary(message) {
  if (elements.formulaSummary) {
    elements.formulaSummary.textContent = message;
  }
}

function setErrorHintSummary(message) {
  if (elements.errorHintSummary) {
    elements.errorHintSummary.textContent = message;
  }
}

function setChartLogicSummary(message) {
  if (elements.chartLogicSummary) {
    elements.chartLogicSummary.textContent = message;
  }
}

function escapeCsvValue(value) {
  const text = String(value ?? "");
  if (text.includes("\"") || text.includes(",") || text.includes("\n")) {
    return `"${text.replaceAll("\"", "\"\"")}"`;
  }
  return text;
}

function buildCsvContent(rows) {
  return `\uFEFF${rows.map((row) => row.map(escapeCsvValue).join(",")).join("\n")}`;
}

function downloadCsv(filename, rows) {
  const blob = new Blob([buildCsvContent(rows)], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8;") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function extractTableRows(tbody, expectedLength) {
  return [...(tbody?.querySelectorAll("tr") ?? [])]
    .map((row) => [...row.querySelectorAll("td")].map((cell) => cell.textContent?.trim() ?? ""))
    .filter((row) => row.length === expectedLength);
}

function buildHtmlTable(headers, rows) {
  if (!rows.length) {
    return '<p class="report-empty">目前沒有可輸出的表格資料。</p>';
  }

  const headMarkup = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const bodyMarkup = rows
    .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
    .join("");

  return `
    <table class="report-table">
      <thead>
        <tr>${headMarkup}</tr>
      </thead>
      <tbody>
        ${bodyMarkup}
      </tbody>
    </table>
  `;
}

function cloneChartMarkup(chartElement) {
  const html = chartElement?.innerHTML?.trim();
  return html
    ? `<div class="report-chart">${html}</div>`
    : '<p class="report-empty">目前沒有可輸出的圖表資料。</p>';
}

function generateReportHTML() {
  const batchRows = extractTableRows(elements.batchResultBody, 5);
  const assetRows = extractTableRows(elements.assetResultBody, 10);
  const irrMetrics = [
    ["現金流 IRR", elements.irrValue?.textContent?.trim() ?? "-"],
    ["組合 IRR", elements.portfolioIrrValue?.textContent?.trim() ?? "-"],
    ["CAGR", elements.cagrValue?.textContent?.trim() ?? "-"],
    ["TWR", elements.twrValue?.textContent?.trim() ?? "-"],
    ["MWRR", elements.mwrrValue?.textContent?.trim() ?? "-"],
    ["總投入", elements.totalInvested?.textContent?.trim() ?? "-"],
    ["總回收", elements.totalReturned?.textContent?.trim() ?? "-"],
    ["淨現金流", elements.netCashflow?.textContent?.trim() ?? "-"],
  ];
  const irrSummary = elements.resultSummary?.textContent?.trim() ?? "尚無 IRR 摘要。";
  const batchSummary = elements.batchSummary?.textContent?.trim() ?? "尚無批次換算摘要。";
  const assetSummary = elements.assetSummary?.textContent?.trim() ?? "尚無多標的比較摘要。";

  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>IRR Calculator Report</title>
  <style>
    body { font-family: "Segoe UI", Arial, sans-serif; margin: 0; padding: 32px; color: #0f172a; background: #f8fafc; }
    .report { max-width: 1120px; margin: 0 auto; display: grid; gap: 24px; }
    .report-section { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; padding: 24px; box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06); }
    .report-title { margin: 0 0 8px; font-size: 2rem; }
    .report-subtitle { margin: 0; color: #475569; }
    .report-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; margin-top: 18px; }
    .report-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 14px 16px; }
    .report-card span { display: block; color: #64748b; font-size: 0.9rem; margin-bottom: 6px; }
    .report-card strong { font-size: 1.1rem; }
    .report-table { width: 100%; border-collapse: collapse; margin-top: 14px; }
    .report-table th, .report-table td { border-bottom: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; font-size: 0.95rem; }
    .report-table th { background: #f8fafc; }
    .report-chart { display: grid; gap: 10px; margin-top: 14px; }
    .report-chart .chart-row { display: grid; align-items: center; }
    .report-chart .chart-label, .report-chart .chart-value { font-size: 0.92rem; }
    .report-chart .chart-track { height: 12px; border-radius: 999px; background: #e2e8f0; overflow: hidden; }
    .report-chart .chart-bar { height: 100%; border-radius: 999px; background: linear-gradient(90deg, #0f766e, #14b8a6); }
    .report-chart .chart-group { display: grid; gap: 10px; padding: 14px 0; border-bottom: 1px solid #e2e8f0; }
    .report-empty { color: #64748b; margin: 0; }
    @media (max-width: 800px) { .report-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } body { padding: 18px; } }
  </style>
</head>
<body>
  <main class="report">
    <section class="report-section">
      <h1 class="report-title">IRR Calculator Report</h1>
      <p class="report-subtitle">匯出時間：${escapeHtml(new Date().toLocaleString("zh-TW"))}</p>
    </section>
    <section class="report-section">
      <h2>IRR Summary</h2>
      <p>${escapeHtml(irrSummary)}</p>
      <div class="report-grid">
        ${irrMetrics.map(([label, value]) => `<article class="report-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></article>`).join("")}
      </div>
      <div class="report-chart">
        <h3>綜合圖表</h3>
        ${cloneChartMarkup(elements.returnChart)}
      </div>
    </section>
    <section class="report-section">
      <h2>Batch Table</h2>
      <p>${escapeHtml(batchSummary)}</p>
      ${buildHtmlTable(["期間", "總報酬", "年化報酬率", "期末金額", "獲利金額"], batchRows)}
    </section>
    <section class="report-section">
      <h2>Asset Ranking</h2>
      <p>${escapeHtml(assetSummary)}</p>
      ${buildHtmlTable(["排序", "標的", "1 年年化", "3 年年化", "5 年年化", "10 年年化", "Alpha", "波動率", "最大回撤", "夏普值"], assetRows)}
      <div class="report-chart">
        <h3>多標的圖表</h3>
        ${cloneChartMarkup(elements.assetChart)}
      </div>
    </section>
  </main>
</body>
</html>`;
}

function downloadReportHTML() {
  const html = generateReportHTML();
  downloadTextFile("irr-report.html", html, "text/html;charset=utf-8;");
  setStatus("已匯出 HTML 報表。", "success");
}

function exportReportPDF() {
  const reportWindow = window.open("", "_blank", "noopener,noreferrer");
  if (!reportWindow) {
    setStatus("無法開啟列印視窗，請確認瀏覽器未封鎖彈出視窗。", "error");
    return;
  }

  const reportHtml = generateReportHTML()
    .replace("</head>", `
      <style>
        @page { size: A4; margin: 12mm; }
        @media print {
          body { background: #ffffff !important; padding: 0 !important; }
          .report { gap: 16px !important; }
          .report-section { box-shadow: none !important; break-inside: avoid; page-break-inside: avoid; }
          .report-chart .chart-group { break-inside: avoid; page-break-inside: avoid; }
        }
      </style>
    </head>`);

  reportWindow.document.open();
  reportWindow.document.write(reportHtml);
  reportWindow.document.close();

  reportWindow.addEventListener("load", () => {
    reportWindow.focus();
    reportWindow.print();
  }, { once: true });

  setStatus("已開啟 PDF 列印視窗。", "success");
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        cell += "\"";
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(cell);
      cell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    cell += char;
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows.filter((currentRow) => currentRow.some((value) => value.trim() !== ""));
}

function normalizeKey(value) {
  return String(value ?? "").trim().toLowerCase().replaceAll(/[\s_%()-]/g, "");
}

function readFileText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ""));
    reader.onerror = () => reject(new Error("檔案讀取失敗。"));
    reader.readAsText(file, "utf-8");
  });
}

function parseImportedRows(text, type) {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new Error("匯入檔案是空的。");
  }

  if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
    return parseImportedJson(trimmed, type);
  }

  return parseImportedCsv(trimmed, type);
}

function parseImportedJson(text, type) {
  const parsed = JSON.parse(text);
  if (type === "cashflows") {
    const rows = Array.isArray(parsed) ? parsed : parsed.cashflows;
    return normalizeCashflowImportRows(rows);
  }

  const rows = Array.isArray(parsed) ? parsed : parsed.assets;
  return normalizeAssetImportRows(rows);
}

function parseImportedCsv(text, type) {
  const [headerRow, ...dataRows] = parseCsv(text);
  if (!headerRow || !dataRows.length) {
    throw new Error("CSV 至少需要標題列與一筆資料。");
  }

  const normalizedHeaders = headerRow.map(normalizeKey);
  const objects = dataRows.map((row) => {
    const entry = {};
    normalizedHeaders.forEach((header, index) => {
      entry[header] = row[index]?.trim() ?? "";
    });
    return entry;
  });

  return type === "cashflows"
    ? normalizeCashflowImportRows(objects)
    : normalizeAssetImportRows(objects);
}

function pickFirst(source, keys) {
  for (const key of keys) {
    const value = source[key];
    if (value !== undefined) {
      return value;
    }
  }
  return "";
}

function normalizeCashflowImportRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("找不到可匯入的現金流資料。");
  }

  const normalized = rows
    .map((row) => {
      const normalizedRow = Object.fromEntries(
        Object.entries(row ?? {}).map(([key, value]) => [normalizeKey(key), value]),
      );
      return {
        date: String(pickFirst(normalizedRow, ["date", "日期"])).trim(),
        amount: String(pickFirst(normalizedRow, ["amount", "cashflow", "現金流", "金額"])).trim(),
        note: String(pickFirst(normalizedRow, ["note", "memo", "remark", "備註"])).trim(),
      };
    })
    .filter((row) => row.date || row.amount || row.note);

  if (!normalized.length) {
    throw new Error("現金流匯入後沒有可用資料。");
  }

  const missing = normalized.find((row) => !row.date || !row.amount);
  if (missing) {
    throw new Error("現金流資料缺欄位：每列都需要日期與現金流金額。");
  }

  return normalized;
}

function normalizeAssetImportRows(rows) {
  if (!Array.isArray(rows) || !rows.length) {
    throw new Error("找不到可匯入的標的資料。");
  }

  const normalized = rows
    .map((row) => {
      const normalizedRow = Object.fromEntries(
        Object.entries(row ?? {}).map(([key, value]) => [normalizeKey(key), value]),
      );
      return {
        name: String(pickFirst(normalizedRow, ["name", "asset", "symbol", "標的", "標的名稱"])).trim(),
        return1y: String(pickFirst(normalizedRow, ["return1y", "1y", "1year", "近1年", "近1年報酬"])).trim(),
        return3y: String(pickFirst(normalizedRow, ["return3y", "3y", "3year", "近3年", "近3年報酬"])).trim(),
        return5y: String(pickFirst(normalizedRow, ["return5y", "5y", "5year", "近5年", "近5年報酬"])).trim(),
        return10y: String(pickFirst(normalizedRow, ["return10y", "10y", "10year", "近10年", "近10年報酬"])).trim(),
        monthlyReturns: String(pickFirst(normalizedRow, ["monthlyreturns", "monthly", "monthreturns", "月報酬", "月報酬序列"])).trim(),
      };
    })
    .filter((row) => row.name || row.return1y || row.return3y || row.return5y || row.return10y || row.monthlyReturns);

  if (!normalized.length) {
    throw new Error("標的匯入後沒有可用資料。");
  }

  const missingName = normalized.find((row) => !row.name);
  if (missingName) {
    throw new Error("標的資料缺欄位：每列都需要標的名稱。");
  }

  const missingReturn = normalized.find((row) =>
    !row.return1y && !row.return3y && !row.return5y && !row.return10y
  );
  if (missingReturn) {
    throw new Error("標的資料缺欄位：每列至少需要一個期間報酬。");
  }

  return normalized;
}

function exportCashflows() {
  const rows = getFormState().filter((row) => row.date || row.amount || row.note);
  if (!rows.length) {
    setStatus("沒有可匯出的現金流資料。", "error");
    return;
  }

  downloadCsv("irr-cashflows.csv", [
    ["日期", "現金流", "備註"],
    ...rows.map((row) => [row.date, row.amount, row.note]),
  ]);
  setStatus(`已匯出 ${rows.length} 筆現金流 CSV。`, "success");
}

function exportBatchResults() {
  const rows = [...(elements.batchResultBody?.querySelectorAll("tr") ?? [])]
    .map((row) => [...row.querySelectorAll("td")].map((cell) => cell.textContent?.trim() ?? ""))
    .filter((row) => row.length === 5);

  if (!rows.length) {
    if (elements.batchStatus) {
      elements.batchStatus.textContent = "請先完成批次換算，才能匯出 CSV。";
    }
    return;
  }

  downloadCsv("irr-batch-results.csv", [
    ["期間", "總報酬", "年化報酬率", "期末金額", "獲利金額"],
    ...rows,
  ]);
  elements.batchStatus.textContent = `已匯出 ${rows.length} 筆批次換算 CSV。`;
}

function exportAssetResults() {
  const rows = [...(elements.assetResultBody?.querySelectorAll("tr") ?? [])]
    .map((row) => [...row.querySelectorAll("td")].map((cell) => cell.textContent?.trim() ?? ""))
    .filter((row) => row.length === 10);

  if (!rows.length) {
    if (elements.assetStatus) {
      elements.assetStatus.textContent = "請先完成多標的比較，才能匯出 CSV。";
    }
    return;
  }

  downloadCsv("irr-asset-comparison.csv", [
    ["排序", "標的", "1 年年化", "3 年年化", "5 年年化", "10 年年化", "Alpha", "波動率", "最大回撤", "夏普值"],
    ...rows,
  ]);
  elements.assetStatus.textContent = `已匯出 ${rows.length} 筆多標的比較 CSV。`;
}

async function importCashflowsFromFile(file) {
  const text = await readFileText(file);
  const rows = parseImportedRows(text, "cashflows");
  restoreCashflowRows(rows);
  saveState();
  calculateIrr();
}

async function importAssetsFromFile(file) {
  const text = await readFileText(file);
  const rows = parseImportedRows(text, "assets");
  restoreAssetRows(rows);
  saveState();
  compareAssets();
}

function resetResultDisplay() {
  setMetricValue(elements.irrValue, "-");
  setMetricValue(elements.portfolioIrrValue, "-");
  setMetricValue(elements.totalInvested, "-");
  setMetricValue(elements.totalReturned, "-");
  setMetricValue(elements.netCashflow, "-");
  setMetricValue(elements.cagrValue, "-");
  setMetricValue(elements.twrValue, "-");
  setMetricValue(elements.mwrrValue, "-");
  if (elements.resultSummary) {
    elements.resultSummary.textContent = "IRR 會在這裡顯示。若遇到無法收斂，通常是現金流方向不足或資料日期不合理。";
  }
  setFormulaSummary("公式摘要會顯示在這裡。");
  setErrorHintSummary("若計算失敗，這裡會顯示常見原因與排查方向。");
  updateIrrCompareView();
}

function resetConversionDisplay() {
  setMetricValue(elements.annualizedReturn, "-");
  setMetricValue(elements.endingValue, "-");
  setMetricValue(elements.profitValue, "-");
  setMetricValue(elements.conversionLabel, "-");
  if (elements.conversionSummary) {
    elements.conversionSummary.textContent = "區間報酬換算結果會顯示在這裡。";
  }
  if (elements.conversionStatus) {
    elements.conversionStatus.textContent = "若標的頁只有「近五年報酬」，可在這裡換算成年化報酬率。";
  }
  setFormulaSummary("公式摘要會顯示在這裡。");
}

function resetBatchDisplay() {
  if (elements.batchResultBody) {
    elements.batchResultBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">尚未進行批次換算</td>
      </tr>
    `;
  }
  if (elements.batchSummary) {
    elements.batchSummary.textContent = "批次換算結果會顯示在這裡。";
  }
  if (elements.batchStatus) {
    elements.batchStatus.textContent = "可只填部分期間；系統只會換算你有填的欄位。";
  }
  setFormulaSummary("公式摘要會顯示在這裡。");
}

function resetChartDisplay() {
  if (!elements.returnChart) {
    return;
  }

  elements.returnChart.className = "return-chart empty-chart";
  elements.returnChart.innerHTML = '<p class="chart-empty">尚無資料可繪圖，先做單筆或批次換算。</p>';
  setChartLogicSummary("年化比較圖會收集單筆換算、批次換算與多標的比較的可用年化值；沒有結果時不繪圖。");
}

function resetAssetDisplay() {
  if (elements.assetResultBody) {
    elements.assetResultBody.innerHTML = `
      <tr>
        <td colspan="10" class="empty-cell">尚未進行多標的比較</td>
      </tr>
    `;
  }
  if (elements.assetStatus) {
    elements.assetStatus.textContent = "至少輸入兩個標的，才能看出比較差異。";
  }
  if (elements.assetSummary) {
    elements.assetSummary.textContent = "多標的比較結果會顯示在這裡。";
  }
  if (elements.assetChart) {
    elements.assetChart.className = "return-chart empty-chart";
    elements.assetChart.innerHTML = '<p class="chart-empty">尚無多標的比較圖，先完成標的比較。</p>';
  }
  setChartLogicSummary("多標的比較可指定 1Y、3Y、5Y、10Y、平均年化或加權分數作為排序依據；缺值時會自動 fallback。");
}

function createAssetRow(values = {}) {
  if (!elements.assetBody || !elements.assetTemplate) {
    return;
  }

  const fragment = elements.assetTemplate.content.cloneNode(true);
  const row = fragment.querySelector("tr");
  const inputs = row.querySelectorAll("input");

  inputs[0].value = values.name ?? "";
  inputs[1].value = values.return1y ?? "";
  inputs[2].value = values.return3y ?? "";
  inputs[3].value = values.return5y ?? "";
  inputs[4].value = values.return10y ?? "";
  inputs[5].value = values.monthlyReturns ?? "";

  elements.assetBody.appendChild(row);
}

function mapTickerToYahooSymbol(ticker) {
  const normalized = String(ticker ?? "").trim().toUpperCase();
  if (!normalized) {
    return "";
  }

  if (/^\d{4}$/.test(normalized)) {
    return `${normalized}.TW`;
  }
  if (/^\d{5}$/.test(normalized)) {
    return `${normalized}.TWO`;
  }

  const aliases = {
    "0050": "0050.TW",
    "0056": "0056.TW",
    "006208": "006208.TW",
    SPY: "SPY",
    QQQ: "QQQ",
    VTI: "VTI",
  };

  return aliases[normalized] ?? normalized;
}

function findClosestHistoricalValue(series, targetTimestamp) {
  const candidates = series
    .filter((item) => Number.isFinite(item.timestamp) && Number.isFinite(item.close) && item.timestamp <= targetTimestamp)
    .sort((left, right) => right.timestamp - left.timestamp);

  return candidates[0] ?? null;
}

function calculatePeriodReturnsFromSeries(series) {
  const latest = [...series]
    .filter((item) => Number.isFinite(item.timestamp) && Number.isFinite(item.close))
    .sort((left, right) => right.timestamp - left.timestamp)[0];

  if (!latest) {
    throw new Error("找不到可用的收盤價資料。");
  }

  const periods = [
    { key: "return1y", years: 1 },
    { key: "return3y", years: 3 },
    { key: "return5y", years: 5 },
    { key: "return10y", years: 10 },
  ];

  return Object.fromEntries(periods.map((period) => {
    const targetTimestamp = latest.timestamp - (period.years * 365 * MS_PER_DAY);
    const historical = findClosestHistoricalValue(series, targetTimestamp);
    if (!historical || historical.close === 0) {
      return [period.key, ""];
    }

    const totalReturnRate = ((latest.close / historical.close) - 1) * 100;
    return [period.key, totalReturnRate.toFixed(2)];
  }));
}

function calculateMonthlyReturnsFromSeries(series) {
  const ordered = [...series]
    .filter((item) => Number.isFinite(item.timestamp) && Number.isFinite(item.close) && item.close > 0)
    .sort((left, right) => left.timestamp - right.timestamp);

  const returns = [];
  for (let index = 1; index < ordered.length; index += 1) {
    const previous = ordered[index - 1].close;
    const current = ordered[index].close;
    if (previous > 0 && current > 0) {
      returns.push((((current / previous) - 1) * 100).toFixed(2));
    }
  }

  return returns.join(",");
}

function getCachedTickerData(symbol) {
  try {
    const raw = localStorage.getItem(`${PRICE_CACHE_PREFIX}${symbol}`);
    if (!raw) {
      return null;
    }

    const cached = JSON.parse(raw);
    if (!cached || Date.now() - cached.savedAt > PRICE_CACHE_MAX_AGE_MS) {
      return null;
    }

    return cached.data;
  } catch {
    return null;
  }
}

function setCachedTickerData(symbol, data) {
  try {
    localStorage.setItem(`${PRICE_CACHE_PREFIX}${symbol}`, JSON.stringify({
      savedAt: Date.now(),
      data,
    }));
  } catch {
    // Cache failure should not block manual or fetched calculations.
  }
}

async function fetchTickerReturns(ticker) {
  const symbol = mapTickerToYahooSymbol(ticker);
  if (!symbol) {
    throw new Error("請先輸入 ticker。");
  }

  const cached = getCachedTickerData(symbol);
  if (cached) {
    return {
      ...cached,
      cached: true,
    };
  }

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?range=10y&interval=1mo&includeAdjustedClose=true`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`股票資料讀取失敗：${response.status}`);
  }

  const payload = await response.json();
  const result = payload?.chart?.result?.[0];
  const timestamps = result?.timestamp ?? [];
  const adjustedCloses = result?.indicators?.adjclose?.[0]?.adjclose
    ?? result?.indicators?.quote?.[0]?.close
    ?? [];

  if (!timestamps.length || !adjustedCloses.length) {
    throw new Error("股票資料不足，無法計算期間報酬。");
  }

  const series = timestamps.map((timestamp, index) => ({
    timestamp: timestamp * 1000,
    close: adjustedCloses[index],
  }));

  const data = {
    symbol,
    returns: calculatePeriodReturnsFromSeries(series),
    monthlyReturns: calculateMonthlyReturnsFromSeries(series),
  };
  setCachedTickerData(symbol, data);
  return {
    ...data,
    cached: false,
  };
}

async function autofillAssetReturns(row) {
  const tickerInput = row?.querySelector(".asset-name-input");
  const return1yInput = row?.querySelector(".asset-return-1y-input");
  const return3yInput = row?.querySelector(".asset-return-3y-input");
  const return5yInput = row?.querySelector(".asset-return-5y-input");
  const return10yInput = row?.querySelector(".asset-return-10y-input");
  const monthlyReturnsInput = row?.querySelector(".asset-monthly-returns-input");
  const ticker = tickerInput?.value?.trim() ?? "";

  if (!ticker) {
    if (elements.assetStatus) {
      elements.assetStatus.textContent = "請先輸入 ticker。";
    }
    return;
  }

  if (elements.assetStatus) {
    elements.assetStatus.textContent = `正在抓取 ${ticker} 的歷史報酬資料...`;
  }

  try {
    const { symbol, returns, monthlyReturns, cached } = await fetchTickerReturns(ticker);
    if (return1yInput) {
      return1yInput.value = returns.return1y;
    }
    if (return3yInput) {
      return3yInput.value = returns.return3y;
    }
    if (return5yInput) {
      return5yInput.value = returns.return5y;
    }
    if (return10yInput) {
      return10yInput.value = returns.return10y;
    }
    if (monthlyReturnsInput) {
      monthlyReturnsInput.value = monthlyReturns;
    }

    saveState();
    if (elements.assetStatus) {
      elements.assetStatus.textContent = `已${cached ? "使用快取" : "抓取"} ${symbol} 的 1Y / 3Y / 5Y / 10Y 報酬與月報酬序列。`;
    }
    if (shouldAutoCompareAssets()) {
      compareAssets();
    }
  } catch (error) {
    if (elements.assetStatus) {
      elements.assetStatus.textContent = `股票資料抓取失敗：${error instanceof Error ? error.message : "未知錯誤。"}`;
    }
  }
}

function getAssetRows() {
  return [...document.querySelectorAll("#asset-body tr")];
}

function ensureMinimumAssetRows() {
  if (getAssetRows().length > 0) {
    return;
  }

  createAssetRow();
  createAssetRow();
}

function parseCashflows() {
  const parsedRows = getRows().map((row, index) => {
    const date = row.querySelector(".date-input")?.value.trim() ?? "";
    const amountText = row.querySelector(".amount-input")?.value.trim() ?? "";
    const note = row.querySelector(".note-input")?.value.trim() ?? "";
    const amount = amountText === "" ? null : Number(amountText);

    return {
      index,
      date,
      amount,
      amountText,
      note,
    };
  });

  const nonEmptyRows = parsedRows.filter((row) => row.date || row.amountText || row.note);
  if (!nonEmptyRows.length) {
    return { valid: false, message: "請至少輸入一筆現金流資料。" };
  }

  for (const row of nonEmptyRows) {
    if (!row.date) {
      return { valid: false, message: `第 ${row.index + 1} 列缺少日期。` };
    }
    if (row.amountText === "") {
      return { valid: false, message: `第 ${row.index + 1} 列缺少現金流金額。` };
    }
    if (Number.isNaN(row.amount)) {
      return { valid: false, message: `第 ${row.index + 1} 列金額格式不正確。` };
    }
  }

  const cashflows = nonEmptyRows
    .map((row) => ({
      ...row,
      time: new Date(`${row.date}T00:00:00`).getTime(),
    }))
    .sort((left, right) => left.time - right.time);

  if (cashflows.some((row) => Number.isNaN(row.time))) {
    return { valid: false, message: "資料內含無效日期，請重新檢查。" };
  }

  const hasNegative = cashflows.some((row) => row.amount < 0);
  const hasPositive = cashflows.some((row) => row.amount > 0);

  if (!hasNegative || !hasPositive) {
    return { valid: false, message: "IRR 需要至少一筆負數投入與一筆正數回收。" };
  }

  return { valid: true, cashflows };
}

function buildResultSummary(cashflows, irr) {
  const firstDate = cashflows[0].date;
  const lastDate = cashflows[cashflows.length - 1].date;
  const holdingDays = Math.round((cashflows[cashflows.length - 1].time - cashflows[0].time) / MS_PER_DAY);
  const invested = cashflows
    .filter((row) => row.amount < 0)
    .reduce((sum, row) => sum + Math.abs(row.amount), 0);
  const returned = cashflows
    .filter((row) => row.amount > 0)
    .reduce((sum, row) => sum + row.amount, 0);

  return `已依 ${firstDate} 到 ${lastDate} 的 ${cashflows.length} 筆現金流計算 XIRR，持有期間約 ${holdingDays} 天；總投入 ${formatCurrency(invested)}，總回收 ${formatCurrency(returned)}，年化報酬率約 ${formatPercent(irr * 100)}。`;
}

function buildPortfolioGroups(cashflows) {
  const groups = new Map();

  cashflows.forEach((cashflow) => {
    const assetKey = cashflow.note || "未分類標的";
    const current = groups.get(assetKey) ?? [];
    current.push({
      amount: cashflow.amount,
      time: cashflow.time,
    });
    groups.set(assetKey, current);
  });

  return [...groups.values()];
}

function updateIrrCompareView() {
  const mode = elements.irrViewMode?.value ?? DEFAULT_IRR_VIEW_MODE;
  if (elements.irrValue?.closest(".metric-card")) {
    elements.irrValue.closest(".metric-card").style.display = mode === "portfolio" ? "none" : "";
  }
  if (elements.portfolioIrrValue?.closest(".metric-card")) {
    elements.portfolioIrrValue.closest(".metric-card").style.display = mode === "single" ? "none" : "";
  }
}

function calculatePortfolioIrrView(cashflows) {
  const portfolioGroups = buildPortfolioGroups(cashflows);
  return calculatePortfolioIrr(portfolioGroups);
}

function calculateIrr() {
  validateCashflowInputs();
  const result = parseCashflows();

  if (!result.valid) {
    resetResultDisplay();
    setStatus(result.message, "error");
    return;
  }

  const { cashflows } = result;
  const irr = estimateXirr(cashflows);
  const portfolioIrr = calculatePortfolioIrrView(cashflows);
  const cagr = calculateCagr(cashflows);
  const twr = calculateTwrr(cashflows);
  const mwrr = calculateMwrr(cashflows);
  const invested = cashflows
    .filter((row) => row.amount < 0)
    .reduce((sum, row) => sum + Math.abs(row.amount), 0);
  const returned = cashflows
    .filter((row) => row.amount > 0)
    .reduce((sum, row) => sum + row.amount, 0);
  const net = cashflows.reduce((sum, row) => sum + row.amount, 0);

  setMetricValue(elements.totalInvested, formatCurrency(invested));
  setMetricValue(elements.totalReturned, formatCurrency(returned));
  setMetricValue(elements.netCashflow, formatCurrency(net));
  setMetricValue(
    elements.portfolioIrrValue,
    portfolioIrr === null || !Number.isFinite(portfolioIrr) ? "-" : formatPercent(portfolioIrr * 100),
  );
  setMetricValue(elements.cagrValue, cagr === null || !Number.isFinite(cagr) ? "-" : formatPercent(cagr));
  setMetricValue(elements.twrValue, twr === null || !Number.isFinite(twr) ? "-" : formatPercent(twr));
  setMetricValue(elements.mwrrValue, mwrr === null || !Number.isFinite(mwrr) ? "-" : formatPercent(mwrr));

  if (irr === null || !Number.isFinite(irr)) {
    setMetricValue(elements.irrValue, "-");
    if (elements.resultSummary) {
      elements.resultSummary.textContent = "無法計算 IRR。常見原因是資料跨度過短、現金流分布特殊，或在目前假設下找不到可收斂解。";
    }
    setFormulaSummary("XIRR 以 XNPV(r)=0 為目標，先用 Newton-Raphson，再退回二分法搜尋可收斂解。");
    setErrorHintSummary("可能原因：1. 全部都是投入或全部都是回收。2. 現金流日期過度集中，解對利率變化不敏感。3. 金流分布可能存在多重 IRR 或在目前區間內無解。");
    setStatus("計算失敗：找不到可收斂的 XIRR 解。", "error");
    saveState();
    updateIrrCompareView();
    return;
  }

  setMetricValue(elements.irrValue, formatPercent(irr * 100));
  if (elements.resultSummary) {
    elements.resultSummary.textContent = `${buildResultSummary(cashflows, irr)} CAGR ${cagr === null ? "-" : formatPercent(cagr)}、TWR ${twr === null ? "-" : formatPercent(twr)}、MWRR ${mwrr === null ? "-" : formatPercent(mwrr)}。`;
  }
  setFormulaSummary("XIRR 公式摘要：XNPV(r)=Σ[Ci/(1+r)^ti]=0。系統先以 Newton-Raphson 迭代，若導數不穩定或超出可用區間，會改用二分法逼近。");
  setErrorHintSummary("若未來出現失敗，先檢查是否同時有負數投入與正數回收、日期是否合理、以及是否存在極端或過度接近的現金流。");
  setStatus(
    portfolioIrr !== null && Number.isFinite(portfolioIrr)
      ? `計算完成：單一 IRR ${formatPercent(irr * 100)}，組合 IRR ${formatPercent(portfolioIrr * 100)}。`
      : `計算完成：XIRR 約 ${formatPercent(irr * 100)}。`,
    "success",
  );
  renderReturnChart();
  saveState();
  updateIrrCompareView();
}

function formatAssetAnnualized(value) {
  return value === null ? "-" : formatPercent(value);
}

function parseMonthlyReturnSeries(text) {
  const trimmed = String(text ?? "").trim();
  if (!trimmed) {
    return [];
  }

  return trimmed
    .split(/[,\n;，、\s]+/)
    .map((value) => value.trim())
    .filter(Boolean)
    .map((value) => Number(value) / 100)
    .filter((value) => Number.isFinite(value));
}

function calculateAssetRiskMetrics(monthlyReturns) {
  const series = parseMonthlyReturnSeries(monthlyReturns);
  return {
    volatility: calculateVolatility(series, 12),
    maxDrawdown: calculateMaxDrawdown(series),
    sharpe: calculateSharpeRatio(series, 0, 12),
    count: series.length,
  };
}

function formatSignedPercent(value) {
  if (value === null || !Number.isFinite(value)) {
    return "-";
  }
  return `${value >= 0 ? "+" : ""}${formatPercent(value)}`;
}

function formatNumber(value) {
  if (value === null || !Number.isFinite(value)) {
    return "-";
  }
  return percentFormatter.format(value);
}

function parsePercentText(text) {
  const value = parseAnyNumber(String(text ?? "").replace("%", "").replace("+", "").trim());
  return value === null ? null : value;
}

function buildChartDataset() {
  const dataset = [];
  const cashflowIrr = parsePercentText(elements.irrValue?.textContent);
  const portfolioIrr = parsePercentText(elements.portfolioIrrValue?.textContent);
  const singleAnnualized = elements.annualizedReturn?.textContent ?? "-";

  if (cashflowIrr !== null) {
    dataset.push({ label: "單一標的 IRR", value: cashflowIrr });
  }

  if (portfolioIrr !== null) {
    dataset.push({ label: "組合 IRR", value: portfolioIrr });
  }

  if (singleAnnualized !== "-") {
    const numeric = parsePercentText(singleAnnualized);
    if (numeric !== null) {
      dataset.push({ label: elements.conversionLabel?.textContent || "單筆換算", value: numeric });
    }
  }

  if (elements.batchResultBody) {
    const rows = [...elements.batchResultBody.querySelectorAll("tr")];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length !== 5) {
        return;
      }
      const label = cells[0].textContent?.trim() ?? "";
      const value = parsePercentText(cells[2].textContent);
      if (label && value !== null) {
        dataset.push({ label, value });
      }
    });
  }

  if (elements.assetResultBody) {
    const rows = [...elements.assetResultBody.querySelectorAll("tr")];
    rows.forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 6) {
        return;
      }

      const assetName = cells[1].textContent?.trim() ?? "";
      const prioritizedPeriods = [
        { label: "5Y", valueText: cells[4].textContent?.trim() ?? "" },
        { label: "3Y", valueText: cells[3].textContent?.trim() ?? "" },
        { label: "1Y", valueText: cells[2].textContent?.trim() ?? "" },
        { label: "10Y", valueText: cells[5].textContent?.trim() ?? "" },
      ];
      const chosen = prioritizedPeriods.find((period) => period.valueText && period.valueText !== "-");
      if (!assetName || !chosen) {
        return;
      }

      const value = parsePercentText(chosen.valueText);
      if (value !== null) {
        dataset.push({ label: `${assetName} ${chosen.label}`, value });
      }
    });
  }

  return dataset;
}

function renderReturnChart() {
  if (!elements.returnChart) {
    return;
  }

  const dataset = buildChartDataset();
  if (!dataset.length) {
    resetChartDisplay();
    return;
  }

  const maxValue = Math.max(...dataset.map((item) => Math.abs(item.value)), 0.01);
  elements.returnChart.className = "return-chart";
  elements.returnChart.innerHTML = dataset
    .map((item) => {
      const width = Math.max((Math.abs(item.value) / maxValue) * 100, 4);
      return `
        <div class="chart-row">
          <span class="chart-label">${escapeHtml(item.label)}</span>
          <div class="chart-track">
            <div class="chart-bar" style="width: ${width}%"></div>
          </div>
          <span class="chart-value">${formatPercent(item.value)}</span>
        </div>
      `;
    })
    .join("");
}

function parsePositiveNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parseAnyNumber(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return null;
  }
  return parsed;
}

function convertSingleReturn() {
  const inputsValid = validateSingleReturnInputs();
  const years = parsePositiveNumber(elements.periodYears?.value);
  const totalReturnRate = parseAnyNumber(elements.totalReturnRate?.value);
  const startingValue = parsePositiveNumber(elements.startingValue?.value);

  if (!inputsValid || years === null) {
    resetConversionDisplay();
    elements.conversionStatus.textContent = "請輸入大於 0 的期間年數。";
    return;
  }

  if (totalReturnRate === null) {
    resetConversionDisplay();
    elements.conversionStatus.textContent = "請輸入有效的總報酬率。";
    return;
  }

  if (startingValue === null) {
    resetConversionDisplay();
    elements.conversionStatus.textContent = "請輸入大於 0 的期初金額。";
    return;
  }

  const annualized = annualizeReturn(totalReturnRate, years);
  if (annualized === null) {
    resetConversionDisplay();
    elements.conversionStatus.textContent = "總報酬率過低，無法換算成年化報酬。";
    return;
  }

  const ending = startingValue * (1 + totalReturnRate / 100);
  const profit = ending - startingValue;

  setMetricValue(elements.annualizedReturn, formatPercent(annualized));
  setMetricValue(elements.endingValue, formatCurrency(ending));
  setMetricValue(elements.profitValue, formatCurrency(profit));
  setMetricValue(elements.conversionLabel, `${years} 年持有`);
  elements.conversionStatus.textContent = `換算完成：${years} 年總報酬 ${formatPercent(totalReturnRate)}，年化約 ${formatPercent(annualized)}。`;
  elements.conversionSummary.textContent = `以單筆買進持有假設計算，期初 ${formatCurrency(startingValue)} 經過 ${years} 年後約為 ${formatCurrency(ending)}，獲利 ${formatCurrency(profit)}。`;
  renderReturnChart();
  saveState();
}

function buildBatchPeriods() {
  return [
    { label: "近 1 年", years: 1, value: elements.return1y?.value ?? "" },
    { label: "近 3 年", years: 3, value: elements.return3y?.value ?? "" },
    { label: "近 5 年", years: 5, value: elements.return5y?.value ?? "" },
    { label: "近 10 年", years: 10, value: elements.return10y?.value ?? "" },
  ];
}

function renderBatchRows(rows) {
  if (!elements.batchResultBody) {
    return;
  }

  if (!rows.length) {
    resetBatchDisplay();
    return;
  }

  elements.batchResultBody.innerHTML = rows
    .map(
      (row) => `
        <tr>
          <td>${escapeHtml(row.label)}</td>
          <td>${formatPercent(row.totalReturnRate)}</td>
          <td>${formatPercent(row.annualizedReturn)}</td>
          <td>${formatCurrency(row.endingValue)}</td>
          <td>${formatCurrency(row.profitValue)}</td>
        </tr>
      `,
    )
    .join("");
}

function convertBatchReturns() {
  const periodInputsValid = validateBatchInputs();
  const startingValue = parsePositiveNumber(elements.batchStartingValue?.value);
  if (startingValue === null) {
    resetBatchDisplay();
    elements.batchStatus.textContent = "請輸入大於 0 的期初金額。";
    renderReturnChart();
    return;
  }

  const rows = buildBatchPeriods()
    .filter((period) => String(period.value).trim() !== "")
    .map((period) => {
      const totalReturnRate = parseAnyNumber(period.value);
      if (totalReturnRate === null) {
        return { ...period, invalid: true };
      }

      const annualizedReturn = annualizeReturn(totalReturnRate, period.years);
      if (annualizedReturn === null) {
        return { ...period, invalid: true };
      }

      const endingValue = startingValue * (1 + totalReturnRate / 100);
      return {
        label: period.label,
        years: period.years,
        totalReturnRate,
        annualizedReturn,
        endingValue,
        profitValue: endingValue - startingValue,
      };
    });

  if (!periodInputsValid || !rows.length) {
    resetBatchDisplay();
    elements.batchStatus.textContent = "請至少填入一個期間的總報酬率。";
    renderReturnChart();
    return;
  }

  const invalidRow = rows.find((row) => row.invalid);
  if (invalidRow) {
    resetBatchDisplay();
    elements.batchStatus.textContent = `${invalidRow.label} 報酬率無效，請重新檢查。`;
    renderReturnChart();
    return;
  }

  renderBatchRows(rows);

  const best = rows.reduce((current, row) =>
    row.annualizedReturn > current.annualizedReturn ? row : current,
  );

  elements.batchStatus.textContent = `批次換算完成：共 ${rows.length} 個期間，最高年化為 ${best.label} 的 ${formatPercent(best.annualizedReturn)}。`;
  elements.batchSummary.textContent = `以期初 ${formatCurrency(startingValue)} 試算，${best.label} 的年化報酬最高，約 ${formatPercent(best.annualizedReturn)}。`;
  renderReturnChart();
  saveState();
}

function fillReturnSample() {
  elements.periodYears.value = "5";
  elements.totalReturnRate.value = "50";
  elements.startingValue.value = "100000";
  saveState();
  convertSingleReturn();
}

function fillBatchSample() {
  elements.batchStartingValue.value = "100000";
  elements.return1y.value = "12";
  elements.return3y.value = "28";
  elements.return5y.value = "50";
  elements.return10y.value = "120";
  saveState();
  convertBatchReturns();
}

function parseAssetRows() {
  const assets = getAssetRows()
    .map((row, index) => {
      const inputs = row.querySelectorAll("input");
      return {
        index,
        name: inputs[0]?.value.trim() ?? "",
        return1y: inputs[1]?.value.trim() ?? "",
        return3y: inputs[2]?.value.trim() ?? "",
        return5y: inputs[3]?.value.trim() ?? "",
        return10y: inputs[4]?.value.trim() ?? "",
        monthlyReturns: inputs[5]?.value.trim() ?? "",
      };
    })
    .filter((asset) => asset.name || asset.return1y || asset.return3y || asset.return5y || asset.return10y || asset.monthlyReturns);

  if (assets.length < 2) {
    return { valid: false, message: "請至少輸入兩個標的。"};
  }

  const parsed = assets.map((asset) => {
    const periods = [
      { key: "return1y", years: 1 },
      { key: "return3y", years: 3 },
      { key: "return5y", years: 5 },
      { key: "return10y", years: 10 },
    ];

    const annualized = {};
    let hasAnyReturn = false;

    for (const period of periods) {
      const text = asset[period.key];
      if (!text) {
        annualized[period.key] = null;
        continue;
      }

      const totalReturn = parseAnyNumber(text);
      if (totalReturn === null) {
        return { valid: false, message: `${asset.name || `第 ${asset.index + 1} 列`} 的報酬率格式不正確。` };
      }

      const annualizedValue = annualizeReturn(totalReturn, period.years);
      if (annualizedValue === null) {
        return { valid: false, message: `${asset.name || `第 ${asset.index + 1} 列`} 的報酬率無法換算。` };
      }

      annualized[period.key] = annualizedValue;
      hasAnyReturn = true;
    }

    if (!asset.name) {
      return { valid: false, message: `第 ${asset.index + 1} 列缺少標的名稱。` };
    }

    if (!hasAnyReturn) {
      return { valid: false, message: `${asset.name} 至少要填一個期間報酬。` };
    }

    return {
      valid: true,
      name: asset.name,
      annualized,
      monthlyReturns: asset.monthlyReturns,
    };
  });

  const invalid = parsed.find((item) => !item.valid);
  if (invalid) {
    return invalid;
  }

  return { valid: true, assets: parsed };
}

function getAssetSortPreference(selectedBasis = DEFAULT_ASSET_SORT_BASIS) {
  const fallbackOrder = ["return5y", "return3y", "return1y", "return10y"];
  return [
    selectedBasis,
    ...fallbackOrder.filter((key) => key !== selectedBasis),
  ];
}

function getParsedAssetSortWeights() {
  const rawWeights = getAssetSortWeightsState();
  return Object.fromEntries(
    Object.entries(rawWeights).map(([key, value]) => [key, parseAnyNumber(value) ?? DEFAULT_ASSET_SORT_WEIGHTS[key]]),
  );
}

function pickSortBasisForAsset(
  annualized,
  selectedBasis = DEFAULT_ASSET_SORT_BASIS,
  weights = DEFAULT_ASSET_SORT_WEIGHTS,
) {
  const selectedOption = ASSET_SORT_OPTIONS.find((option) => option.key === selectedBasis);

  if (selectedBasis === "mean") {
    const meanValue = calculateMeanAnnualized(annualized);
    if (meanValue !== null) {
      return {
        key: "mean",
        label: "平均年化",
        value: meanValue,
        isFallback: false,
      };
    }
  }

  if (selectedBasis === "weighted") {
    const weightedValue = calculateWeightedAnnualized(annualized, weights);
    if (weightedValue !== null) {
      return {
        key: "weighted",
        label: "加權分數",
        value: weightedValue,
        isFallback: false,
      };
    }
  }

  const preference = getAssetSortPreference(selectedBasis);

  for (const key of preference) {
    const value = annualized[key];
    if (value !== null) {
      const option = ASSET_SORT_OPTIONS.find((item) => item.key === key);
      return {
        key,
        label: option?.label ?? key,
        value,
        isFallback: key !== selectedBasis,
      };
    }
  }

  return {
    key: selectedBasis,
    label: selectedOption?.label ?? selectedBasis,
    value: Number.NEGATIVE_INFINITY,
    isFallback: true,
  };
}

function renderAssetResults(rows) {
  if (!elements.assetResultBody) {
    return;
  }

  elements.assetResultBody.innerHTML = rows
    .map(
      (row, index) => `
        <tr>
          <td>${index + 1}</td>
          <td>${escapeHtml(row.name)}</td>
          <td>${formatAssetAnnualized(row.annualized.return1y)}</td>
          <td>${formatAssetAnnualized(row.annualized.return3y)}</td>
          <td>${formatAssetAnnualized(row.annualized.return5y)}</td>
          <td>${formatAssetAnnualized(row.annualized.return10y)}</td>
          <td>${formatSignedPercent(row.alpha)}</td>
          <td title="以月報酬序列估算年化波動率；至少需要 2 筆月報酬。">${formatAssetAnnualized(row.risk.volatility)}</td>
          <td title="以月報酬序列累積後估算最大高點回落幅度。">${formatAssetAnnualized(row.risk.maxDrawdown)}</td>
          <td title="以月報酬序列與 0% 無風險利率估算；至少需要 2 筆月報酬。">${formatNumber(row.risk.sharpe)}</td>
        </tr>
      `,
    )
    .join("");
}

function buildAssetChartDataset(rows) {
  const periods = [
    { key: "return1y", label: "1Y" },
    { key: "return3y", label: "3Y" },
    { key: "return5y", label: "5Y" },
    { key: "return10y", label: "10Y" },
  ];

  return rows.map((row) => ({
    label: row.name,
    sortBasis: row.sortBasis,
    series: [
      ...periods.map((period) => ({
        key: period.key,
        label: period.label,
        value: row.annualized[period.key],
      })),
      {
        key: "alpha",
        label: "Alpha",
        value: row.alpha,
      },
    ],
  }));
}

function filterAssetChartDataset(dataset, filterKey = DEFAULT_ASSET_CHART_FILTER) {
  if (filterKey === "all") {
    return dataset;
  }

  return dataset.map((row) => ({
    ...row,
    series: row.series.filter((series) => series.key === filterKey),
  }));
}

function renderAssetChart(rows) {
  if (!elements.assetChart) {
    return;
  }

  if (!rows.length) {
    elements.assetChart.className = "return-chart empty-chart";
    elements.assetChart.innerHTML = '<p class="chart-empty">尚無多標的比較圖，先完成標的比較。</p>';
    return;
  }

  const filterKey = getAssetChartFilterState();
  const dataset = filterAssetChartDataset(buildAssetChartDataset(rows), filterKey);
  const allValues = dataset
    .flatMap((row) => row.series.map((series) => series.value))
    .filter((value) => value !== null);
  const maxValue = Math.max(...allValues.map((value) => Math.abs(value)), 0.01);

  elements.assetChart.className = "return-chart";
  elements.assetChart.innerHTML = dataset
    .map((row) => {
      const seriesMarkup = row.series
        .map((series) => {
          if (series.value === null) {
            return `
              <div class="chart-row" style="grid-template-columns: 56px minmax(0, 1fr) 72px; gap: 0.6rem;">
                <span class="chart-label">${escapeHtml(series.label)}</span>
                <div class="chart-track" style="opacity: 0.35;"></div>
                <span class="chart-value">-</span>
              </div>
            `;
          }

          const width = Math.max((Math.abs(series.value) / maxValue) * 100, 4);
          return `
            <div class="chart-row" style="grid-template-columns: 56px minmax(0, 1fr) 72px; gap: 0.6rem;">
              <span class="chart-label">${escapeHtml(series.label)}</span>
              <div class="chart-track">
                <div class="chart-bar" style="width: ${width}%"></div>
              </div>
              <span class="chart-value">${formatPercent(series.value)}</span>
            </div>
          `;
        })
        .join("");

      return `
        <div class="chart-group" style="display: grid; gap: 0.7rem; padding: 0.9rem 0; border-bottom: 1px solid rgba(148, 163, 184, 0.18);">
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 1rem;">
            <span class="chart-label" style="max-width: none; font-size: 0.98rem;">${escapeHtml(row.label)}</span>
            <span class="chart-value" style="min-width: auto;">排序依據：${escapeHtml(row.sortBasis.label)}</span>
          </div>
          <div class="chart-multi-series" style="display: grid; gap: 0.45rem;">
            ${seriesMarkup}
          </div>
        </div>
      `;
    })
    .join("");
}

function compareAssets() {
  const result = parseAssetRows();
  if (!result.valid) {
    resetAssetDisplay();
    elements.assetStatus.textContent = result.message;
    return;
  }

  const selectedBasis = getAssetSortBasisState();
  const weights = getParsedAssetSortWeights();
  const selectedLabel = ASSET_SORT_OPTIONS.find((option) => option.key === selectedBasis)?.label ?? "5Y";
  const rowsWithMetrics = [...result.assets]
    .map((asset) => {
      const sortBasis = pickSortBasisForAsset(asset.annualized, selectedBasis, weights);
      return {
        ...asset,
        sortBasis,
        sortValue: sortBasis.value,
        risk: calculateAssetRiskMetrics(asset.monthlyReturns),
      };
    });
  const benchmarkName = elements.benchmarkAsset?.value?.trim() ?? "";
  const benchmark = benchmarkName
    ? rowsWithMetrics.find((asset) => asset.name.toLowerCase() === benchmarkName.toLowerCase())
    : null;
  const ranked = rowsWithMetrics
    .map((asset) => ({
      ...asset,
      alpha: benchmark && Number.isFinite(asset.sortValue) && Number.isFinite(benchmark.sortValue)
        ? asset.sortValue - benchmark.sortValue
        : null,
    }))
    .sort((left, right) => right.sortValue - left.sortValue);
  renderAssetResults(ranked);
  renderAssetChart(ranked);
  renderReturnChart();

  const leader = ranked[0];
  const fallbackCount = ranked.filter((asset) => asset.sortBasis.isFallback).length;
  elements.assetStatus.textContent = `比較完成：共 ${ranked.length} 個標的，主排序依據為 ${selectedLabel}${benchmark ? `，benchmark 為 ${benchmark.name}。` : "。"}${fallbackCount ? ` 其中 ${fallbackCount} 個標的使用 fallback。` : ""}`;
  const riskReadyCount = ranked.filter((asset) => asset.risk.count >= 2).length;
  elements.assetSummary.textContent = `${leader.name} 目前排名第 1，採用 ${leader.sortBasis.label} ${selectedBasis === "weighted" ? `分數約 ${percentFormatter.format(leader.sortBasis.value)}` : `年化報酬約 ${formatPercent(leader.sortBasis.value)}` }。${benchmark ? `相對 ${benchmark.name} 的 alpha 為 ${formatSignedPercent(leader.alpha)}。` : ""}風險指標改用月報酬序列計算，目前 ${riskReadyCount}/${ranked.length} 個標的有足夠資料。`;
  saveState();
}

function fillAssetSample() {
  clearAssetRows();

  [
    { name: "0050", return1y: "18", return3y: "35", return5y: "72", return10y: "185", monthlyReturns: "2.1,-1.2,3.4,1.1,-0.8,2.6,0.9,1.8,-2.0,2.4,1.5,0.7" },
    { name: "0056", return1y: "11", return3y: "24", return5y: "48", return10y: "110", monthlyReturns: "1.2,0.4,-0.6,1.1,0.8,1.0,-1.1,1.6,0.5,0.9,-0.4,1.3" },
    { name: "SPY", return1y: "22", return3y: "41", return5y: "88", return10y: "210", monthlyReturns: "2.8,-2.4,3.1,1.7,0.6,2.9,-1.6,2.2,1.0,-0.9,3.4,1.8" },
  ].forEach((asset) => createAssetRow(asset));

  saveState();
  compareAssets();
}

function handleCashflowBodyClick(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("remove-button")) {
    return;
  }

  const rows = getRows();
  if (rows.length <= 1) {
    rows[0]?.querySelectorAll("input").forEach((input) => {
      input.value = "";
    });
  } else {
    target.closest("tr")?.remove();
  }

  ensureMinimumRows();
  validateCashflowInputs();
  saveState();
}

function handleCashflowBodyInput(event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }
  const row = event.target.closest("tr");
  if (row) {
    validateCashflowRow(row);
  }
  saveState();
}

function handleCashflowBodyKeydown(event) {
  if (!(event.target instanceof HTMLInputElement)) {
    return;
  }

  if (event.key === "Enter") {
    event.preventDefault();
    calculateIrr();
  }
}

function init() {
  if (!globalThis.IRRCalculatorCore || typeof estimateXirr !== "function") {
    setStatus("計算核心載入失敗，請確認 calculator-core.js 與 app.js 位於 index.html 同一資料夾。", "error");
    return;
  }

  if (!elements.cashflowBody || !elements.cashflowTemplate) {
    return;
  }

  setSecondaryFeatureState();

  if (!restoreState()) {
    resetAllInputs();
  }

  ensureMinimumRows();
  ensureMinimumAssetRows();
  resetResultDisplay();
  resetConversionDisplay();
  resetBatchDisplay();
  resetChartDisplay();
  resetAssetDisplay();

  elements.addRowButton?.addEventListener("click", () => {
    createRow();
    saveState();
  });
  elements.sampleButton?.addEventListener("click", fillSample);
  elements.importCashflowsButton?.addEventListener("click", () => {
    elements.cashflowsFileInput?.click();
  });
  elements.exportCashflowsButton?.addEventListener("click", exportCashflows);
  elements.exportReportButton?.addEventListener("click", downloadReportHTML);
  elements.exportPdfButton?.addEventListener("click", exportReportPDF);
  elements.clearStorageButton?.addEventListener("click", clearSavedState);
  elements.calculateButton?.addEventListener("click", calculateIrr);
  elements.irrViewMode?.addEventListener("change", () => {
    updateIrrCompareView();
    saveState();
  });
  elements.returnSampleButton?.addEventListener("click", fillReturnSample);
  elements.convertReturnButton?.addEventListener("click", convertSingleReturn);
  elements.batchSampleButton?.addEventListener("click", fillBatchSample);
  elements.exportBatchButton?.addEventListener("click", exportBatchResults);
  elements.batchConvertButton?.addEventListener("click", convertBatchReturns);
  elements.addAssetButton?.addEventListener("click", () => {
    createAssetRow();
    saveState();
  });
  elements.assetSampleButton?.addEventListener("click", fillAssetSample);
  elements.importAssetsButton?.addEventListener("click", () => {
    elements.assetsFileInput?.click();
  });
  elements.exportAssetsButton?.addEventListener("click", exportAssetResults);
  elements.compareAssetsButton?.addEventListener("click", compareAssets);
  elements.assetSortBasis?.addEventListener("change", () => {
    saveState();
    if (shouldAutoCompareAssets()) {
      compareAssets();
    }
  });
  elements.benchmarkAsset?.addEventListener("input", () => {
    saveState();
    if (shouldAutoCompareAssets()) {
      compareAssets();
    }
  });
  elements.assetChartFilter?.addEventListener("change", () => {
    saveState();
    if (shouldAutoCompareAssets()) {
      compareAssets();
    }
  });
  [
    elements.weight1y,
    elements.weight3y,
    elements.weight5y,
    elements.weight10y,
  ].forEach((input) => {
    input?.addEventListener("input", () => {
      saveState();
      if (shouldAutoCompareAssets() && getAssetSortBasisState() === "weighted") {
        compareAssets();
      }
    });
  });
  elements.cashflowBody?.addEventListener("click", handleCashflowBodyClick);
  elements.cashflowBody?.addEventListener("input", handleCashflowBodyInput);
  elements.cashflowBody?.addEventListener("keydown", handleCashflowBodyKeydown);
  elements.assetBody?.addEventListener("click", (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.classList.contains("fetch-asset-button")) {
      autofillAssetReturns(target.closest("tr"));
      return;
    }

    if (!(target instanceof HTMLElement) || !target.classList.contains("remove-asset-button")) {
      return;
    }

    const rows = getAssetRows();
    if (rows.length <= 1) {
      rows[0]?.querySelectorAll("input").forEach((input) => {
        input.value = "";
      });
    } else {
      target.closest("tr")?.remove();
    }

    ensureMinimumAssetRows();
    saveState();
  });

  [
    elements.periodYears,
    elements.totalReturnRate,
    elements.startingValue,
    elements.batchStartingValue,
    elements.return1y,
    elements.return3y,
    elements.return5y,
    elements.return10y,
  ].forEach((input) => {
    input?.addEventListener("input", () => {
      if (
        input === elements.periodYears
        || input === elements.totalReturnRate
        || input === elements.startingValue
      ) {
        validateSingleReturnInputs();
      }

      if (
        input === elements.batchStartingValue
        || input === elements.return1y
        || input === elements.return3y
        || input === elements.return5y
        || input === elements.return10y
      ) {
        validateBatchInputs();
      }

      saveState();
    });
  });

  elements.assetBody?.addEventListener("input", (event) => {
    if (event.target instanceof HTMLInputElement) {
      saveState();
    }
  });

  elements.assetBody?.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.classList.contains("asset-name-input")) {
      autofillAssetReturns(target.closest("tr"));
    }
  });

  elements.cashflowsFileInput?.addEventListener("change", async (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
      return;
    }

    try {
      await importCashflowsFromFile(input.files[0]);
      setStatus(`已匯入現金流檔案：${input.files[0].name}。`, "success");
    } catch (error) {
      setStatus(`現金流匯入失敗：${error instanceof Error ? error.message : "格式不正確。"}`, "error");
    } finally {
      input.value = "";
    }
  });

  elements.assetsFileInput?.addEventListener("change", async (event) => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || !input.files?.[0]) {
      return;
    }

    try {
      await importAssetsFromFile(input.files[0]);
      if (elements.assetStatus) {
        elements.assetStatus.textContent = `已匯入標的檔案：${input.files[0].name}，並完成比較。`;
      }
    } catch (error) {
      if (elements.assetStatus) {
        elements.assetStatus.textContent = `標的匯入失敗：${error instanceof Error ? error.message : "格式不正確。"}`;
      }
    } finally {
      input.value = "";
    }
  });

  [elements.periodYears, elements.totalReturnRate, elements.startingValue].forEach((input) => {
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        convertSingleReturn();
      }
    });
  });

  [
    elements.batchStartingValue,
    elements.return1y,
    elements.return3y,
    elements.return5y,
    elements.return10y,
  ].forEach((input) => {
    input?.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        convertBatchReturns();
      }
    });
  });

  [
    elements.assetBody,
  ].forEach((container) => {
    container?.addEventListener("keydown", (event) => {
      if (event.target instanceof HTMLInputElement && event.key === "Enter") {
        event.preventDefault();
        compareAssets();
      }
    });
  });

  rerunSavedCalculations();
  updateIrrCompareView();
  validateCashflowInputs();
  validateSingleReturnInputs();
  validateBatchInputs();
}

try {
  init();
} catch (error) {
  setStatus(`初始化失敗：${error instanceof Error ? error.message : "未知錯誤。"}`, "error");
}
