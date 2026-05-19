function formatCurrency(value) {
  return `NT$ ${Math.round(value).toLocaleString("zh-TW")}`;
}

function formatCurrencyByCode(value, currency) {
  const prefix = currency === "USD" ? "US$" : "NT$";
  const locale = currency === "USD" ? "en-US" : "zh-TW";
  return `${prefix} ${Math.round(value).toLocaleString(locale)}`;
}

function formatPercent(value) {
  return `${(value * 100).toFixed(2)}%`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function setProgress(value) {
  const element = document.getElementById("progress");
  if (element) element.value = value;
}

function replaceChildren(id, children) {
  const element = document.getElementById(id);
  if (!element) return;
  element.replaceChildren(...children);
}

function createElement(tagName, options = {}) {
  const element = document.createElement(tagName);
  if (options.className) element.className = options.className;
  if (options.text !== undefined) element.textContent = options.text;
  if (options.dataset) {
    Object.entries(options.dataset).forEach(([key, value]) => {
      element.dataset[key] = value;
    });
  }
  return element;
}
