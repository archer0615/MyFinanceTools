(function () {
  let currentData = null;
  let renderFrame = null;

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
    result.planning = window.IncomeTaxApp.planning.evaluatePlanning(getTaxDataStore(), currentData, input);
    result.viewModel = window.IncomeTaxApp.planning.buildResultViewModel(result, result.planning);
    window.IncomeTaxApp.state.result = result;
    window.IncomeTaxApp.storage.saveState(window.IncomeTaxApp.state);
    scheduleRender(result);
    refreshSpouseVisibility();
  }

  function scheduleRender(result) {
    if (renderFrame) {
      window.cancelAnimationFrame(renderFrame);
    }
    renderFrame = window.requestAnimationFrame(function () {
      renderFrame = null;
      window.IncomeTaxApp.ui.renderResult(result);
    });
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

  function bindYearDataToggle() {
    const button = document.getElementById("yearDataToggle");
    if (!button) {
      return;
    }
    button.addEventListener("click", function () {
      window.IncomeTaxApp.ui.toggleYearData();
    });
  }

  function bindDependents(form) {
    document.getElementById("addDependent").addEventListener("click", function () {
      window.IncomeTaxApp.state.dependents.push({
        name: "",
        relation: "child",
        birthYear: "",
        salaryIncome: 0,
        professionalIncome: 0,
        dividendIncome: 0,
        interestIncome: 0,
        otherIncome: 0,
        insurance: 0,
        nationalHealthInsurance: 0,
        medical: 0,
        childbirth: 0,
        donationGeneral: 0,
        donationPolitical: 0,
        donationPublic: 0,
        disasterLoss: 0,
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
      window.IncomeTaxApp.state.dependents[index][field] = event.target.type === "checkbox"
        ? event.target.checked
        : event.target.type === "number"
          ? window.IncomeTaxApp.engine.toNumber(event.target.value)
          : event.target.value;
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

  function bindScenarioActions(form) {
    const saveButton = document.getElementById("quickSaveScenario");
    const loadButton = document.getElementById("loadSavedScenario");
    const deleteButton = document.getElementById("deleteSavedScenario");
    if (saveButton) {
      saveButton.addEventListener("click", function () {
        window.IncomeTaxApp.storage.saveScenario("quick", window.IncomeTaxApp.ui.getInput(form));
      });
    }
    if (loadButton) {
      loadButton.addEventListener("click", function () {
        const saved = window.IncomeTaxApp.storage.loadScenario("quick");
        if (!saved) {
          return;
        }
        window.IncomeTaxApp.state = Object.assign(window.IncomeTaxApp.state, saved);
        window.IncomeTaxApp.ui.setFormValues(form, window.IncomeTaxApp.state);
        window.IncomeTaxApp.ui.renderDependents(window.IncomeTaxApp.state.dependents || []);
        calculateAndRender();
      });
    }
    if (deleteButton) {
      deleteButton.addEventListener("click", function () {
        window.IncomeTaxApp.storage.deleteScenario("quick");
      });
    }
    form.querySelectorAll("input[type=\"range\"]").forEach(function (slider) {
      slider.addEventListener("input", function () {
        window.IncomeTaxApp.ui.syncScenarioOutputs(form);
        calculateAndRender();
      });
    });
    form.querySelectorAll(".scenario-preset").forEach(function (button) {
      button.addEventListener("click", function () {
        window.IncomeTaxApp.ui.applyScenarioPreset(form, button.dataset.preset);
        calculateAndRender();
      });
    });
  }

  function bindCombinationSorting() {
    document.querySelectorAll(".table-sort").forEach(function (button) {
      button.addEventListener("click", function () {
        const planning = window.IncomeTaxApp.state.result && window.IncomeTaxApp.state.result.planning;
        if (!planning) {
          return;
        }
        window.IncomeTaxApp.ui.renderCombinationRows(planning.combinations, button.dataset.sort);
      });
    });
  }

  function bindCombinationFilters() {
    ["filterRecommended", "filterRefund", "filterLowTax", "filterFivePercent", "combinationSearch"].forEach(function (id) {
      const element = document.getElementById(id);
      if (!element) {
        return;
      }
      element.addEventListener("input", function () {
        const planning = window.IncomeTaxApp.state.result && window.IncomeTaxApp.state.result.planning;
        if (planning) {
          window.IncomeTaxApp.ui.renderCombinationRows(planning.combinations, "payableTax");
        }
      });
    });
  }

  function bindCombinationPaging() {
    ["combinationPrevPage", "combinationNextPage"].forEach(function (id) {
      const element = document.getElementById(id);
      if (!element) {
        return;
      }
      element.addEventListener("click", function () {
        const planning = window.IncomeTaxApp.state.result && window.IncomeTaxApp.state.result.planning;
        const direction = id === "combinationNextPage" ? 1 : -1;
        window.IncomeTaxApp.ui.changeCombinationPage(direction);
        if (planning) {
          window.IncomeTaxApp.ui.renderCombinationRows(planning.combinations, "payableTax");
        }
      });
    });
  }

  function bindStrategyWorkspace() {
    const sort = document.getElementById("strategySortMode");
    if (!sort) {
      return;
    }
    sort.addEventListener("change", function () {
      const planning = window.IncomeTaxApp.state.result && window.IncomeTaxApp.state.result.planning;
      if (planning) {
        window.IncomeTaxApp.ui.renderStrategyWorkspace(planning.strategyWorkspace, sort.value);
      }
    });
  }

  function init() {
    const form = document.getElementById("taxForm");
    const yearSelect = document.getElementById("taxYear");
    try {
      const taxData = getTaxDataStore();
      const availableYears = Object.keys(taxData.years).map(Number).sort(function (a, b) { return a - b; });
      window.IncomeTaxApp.storage.loadState(window.IncomeTaxApp.state);
      currentData = loadTaxData(window.IncomeTaxApp.state.currentYear || taxData.currentYear);
      window.IncomeTaxApp.state.forecast = Object.assign({
        forecastMode: false,
        forecastYear: currentData.meta.year,
        salaryGrowthRate: 0,
        dividendGrowthRate: 0,
        interestGrowthRate: 0
      }, window.IncomeTaxApp.state.forecast || {});
      window.IncomeTaxApp.state.forecast.forecastYear = currentData.meta.year;
      applyTheme(window.IncomeTaxApp.state.theme);
      populateYears(yearSelect, availableYears, currentData.meta.year);
      window.IncomeTaxApp.ui.setFormValues(form, window.IncomeTaxApp.state);
      window.IncomeTaxApp.ui.renderDependents(window.IncomeTaxApp.state.dependents);
      window.IncomeTaxApp.ui.renderVersion(currentData);
      window.IncomeTaxApp.ui.renderYearData(currentData);
      window.IncomeTaxApp.ui.syncYearDataToggle();
      window.IncomeTaxApp.ui.syncScenarioOutputs(form);
      calculateAndRender();
      window.IncomeTaxApp.ui.setError(false);
    } catch (error) {
      window.IncomeTaxApp.ui.setError(true);
      return;
    }

    bindDependents(form);
    bindScenarioActions(form);
    bindCombinationSorting();
    bindCombinationFilters();
    bindCombinationPaging();
    bindStrategyWorkspace();
    bindYearDataToggle();
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
