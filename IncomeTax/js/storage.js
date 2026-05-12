(function () {
  const key = "income-tax-state-v3";

  function saveState(state) {
    try {
      localStorage.setItem(key, JSON.stringify({
        filingMode: state.filingMode,
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

  window.IncomeTaxApp.storage = {
    saveState: saveState,
    loadState: loadState
  };
}());
