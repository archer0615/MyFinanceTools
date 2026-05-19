(function () {
  const key = "income-tax-state-v3";

  function saveState(state) {
    try {
      localStorage.setItem(key, JSON.stringify({
        filingMode: state.filingMode,
        dividendTaxMode: state.dividendTaxMode,
        disclosureMode: state.disclosureMode,
        forecast: state.forecast,
        householdMembers: state.householdMembers,
        scenarioOverrides: state.scenarioOverrides,
        taxpayer: state.taxpayer,
        spouse: state.spouse,
        dependents: state.dependents,
        deductions: state.deductions,
        theme: state.theme
      }));
    } catch (error) {
      return false;
    }
    return true;
  }

  function loadState(state) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        Object.assign(state, JSON.parse(raw));
      }
    } catch (error) {
      return false;
    }
    return true;
  }

  function scenarioKey(name) {
    return key + ":scenario:" + (name || "default");
  }

  function saveScenario(name, scenario) {
    try {
      localStorage.setItem(scenarioKey(name), JSON.stringify({
        name: name || "default",
        updatedAt: new Date().toISOString(),
        scenario: scenario || {}
      }));
      return true;
    } catch (error) {
      return false;
    }
  }

  function loadScenario(name) {
    try {
      const raw = localStorage.getItem(scenarioKey(name));
      return raw ? JSON.parse(raw).scenario : null;
    } catch (error) {
      return null;
    }
  }

  function deleteScenario(name) {
    try {
      localStorage.removeItem(scenarioKey(name));
      return true;
    } catch (error) {
      return false;
    }
  }

  window.IncomeTaxApp.storage = {
    saveState: saveState,
    loadState: loadState,
    saveScenario: saveScenario,
    loadScenario: loadScenario,
    deleteScenario: deleteScenario
  };
}());
