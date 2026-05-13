(function () {
  let currentData = null;

  function getTaxDataStore() {
    if (!window.IncomeTaxApp || !window.IncomeTaxApp.data || !window.IncomeTaxApp.data.years) {
      throw new Error("Tax data is not loaded");
    }
    return window.IncomeTaxApp.data;
  }

  function loadTaxData(year) {
    const data = getTaxDataStore().years[String(year)];
    if (!data) {
      throw new Error("Tax data is not available for " + year);
    }
    return data;
  }

  function populateYears(select, availableYears, currentYear) {
    select.innerHTML = "";
    availableYears.forEach(function (year) {
      const option = document.createElement("option");
      option.value = String(year);
      option.textContent = String(year);
      option.selected = year === currentYear;
      select.appendChild(option);
    });
  }

  function refreshSpouseVisibility() {
    const mode = document.getElementById("filingMode").value;
    document.getElementById("spouseSection").hidden = mode === "single";
  }

  function calculateAndRender() {
    if (!currentData) {
      return;
    }
    const form = document.getElementById("taxForm");
    const input = window.IncomeTaxApp.ui.getInput(form);
    window.IncomeTaxApp.state = Object.assign(window.IncomeTaxApp.state, input);
    window.IncomeTaxApp.state.currentYear = currentData.meta.year;
    window.IncomeTaxApp.state.formData = input;
    const result = window.IncomeTaxApp.strategy.compareFilingStrategies(currentData, input);
    window.IncomeTaxApp.state.result = result;
    window.IncomeTaxApp.storage.saveState(window.IncomeTaxApp.state);
    window.IncomeTaxApp.ui.renderResult(result);
    refreshSpouseVisibility();
  }

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("dark-theme", isDark);
    const button = document.getElementById("themeToggle");
    button.setAttribute("aria-pressed", String(isDark));
    button.textContent = isDark ? "淺色主題" : "深色主題";
  }

  function changeYear(year) {
    currentData = loadTaxData(year);
    window.IncomeTaxApp.state.currentYear = Number(year);
    window.IncomeTaxApp.ui.renderVersion(currentData);
    window.IncomeTaxApp.ui.renderYearData(currentData);
    calculateAndRender();
  }

  function bindDependents(form) {
    document.getElementById("addDependent").addEventListener("click", function () {
      window.IncomeTaxApp.state.dependents.push({
        name: "",
        relation: "child",
        birthYear: "",
        isSenior: false,
        disabled: false,
        sameHousehold: true
      });
      window.IncomeTaxApp.ui.renderDependents(window.IncomeTaxApp.state.dependents);
      calculateAndRender();
    });
    document.getElementById("dependentsList").addEventListener("input", function (event) {
      const card = event.target.closest(".dependent-card");
      if (!card) {
        return;
      }
      const index = Array.prototype.indexOf.call(card.parentNode.children, card);
      const field = event.target.dataset.field;
      window.IncomeTaxApp.state.dependents[index][field] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
      calculateAndRender();
    });
    document.getElementById("dependentsList").addEventListener("click", function (event) {
      if (!event.target.classList.contains("remove-dependent")) {
        return;
      }
      window.IncomeTaxApp.state.dependents.splice(Number(event.target.dataset.index), 1);
      window.IncomeTaxApp.ui.renderDependents(window.IncomeTaxApp.state.dependents);
      calculateAndRender();
    });
    form.addEventListener("input", calculateAndRender);
  }

  function init() {
    const form = document.getElementById("taxForm");
    const yearSelect = document.getElementById("taxYear");
    try {
      const taxData = getTaxDataStore();
      const availableYears = Object.keys(taxData.years).map(Number).sort(function (a, b) { return a - b; });
      window.IncomeTaxApp.storage.loadState(window.IncomeTaxApp.state);
      currentData = loadTaxData(window.IncomeTaxApp.state.currentYear || taxData.currentYear);
      applyTheme(window.IncomeTaxApp.state.theme);
      populateYears(yearSelect, availableYears, currentData.meta.year);
      window.IncomeTaxApp.ui.setFormValues(form, window.IncomeTaxApp.state);
      window.IncomeTaxApp.ui.renderDependents(window.IncomeTaxApp.state.dependents);
      window.IncomeTaxApp.ui.renderVersion(currentData);
      window.IncomeTaxApp.ui.renderYearData(currentData);
      calculateAndRender();
      window.IncomeTaxApp.ui.setError(false);
    } catch (error) {
      window.IncomeTaxApp.ui.setError(true);
      return;
    }

    bindDependents(form);
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      calculateAndRender();
    });
    yearSelect.addEventListener("change", function (event) {
      try {
        changeYear(event.target.value);
        window.IncomeTaxApp.ui.setError(false);
      } catch (error) {
        window.IncomeTaxApp.ui.setError(true);
      }
    });
    document.getElementById("themeToggle").addEventListener("click", function () {
      window.IncomeTaxApp.state.theme = window.IncomeTaxApp.state.theme === "dark" ? "light" : "dark";
      applyTheme(window.IncomeTaxApp.state.theme);
      window.IncomeTaxApp.storage.saveState(window.IncomeTaxApp.state);
    });
  }

  document.addEventListener("DOMContentLoaded", init);
}());
