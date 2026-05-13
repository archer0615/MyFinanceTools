(function () {
  function serializeStateToUrl(state) {
    const params = new URLSearchParams();
    params.set("year", state.currentYear || "");
    params.set("filingMode", state.filingMode || "auto");
    Object.keys(state.taxpayer || {}).forEach(function (key) {
      params.set(key, state.taxpayer[key]);
    });
    Object.keys(state.spouse || {}).forEach(function (key) {
      params.set("spouse" + key.charAt(0).toUpperCase() + key.slice(1), state.spouse[key]);
    });
    Object.keys(state.deductions || {}).forEach(function (key) {
      params.set(key, state.deductions[key]);
    });
    return window.location.pathname + "?" + params.toString();
  }

  function loadStateFromUrl(state) {
    const params = new URLSearchParams(window.location.search);
    if (!params.size) {
      return false;
    }
    state.currentYear = params.get("year") || state.currentYear;
    state.filingMode = params.get("filingMode") || state.filingMode;
    Object.keys(state.taxpayer || {}).forEach(function (key) {
      if (params.has(key)) {
        state.taxpayer[key] = Number(params.get(key)) || 0;
      }
    });
    Object.keys(state.spouse || {}).forEach(function (key) {
      const name = "spouse" + key.charAt(0).toUpperCase() + key.slice(1);
      if (params.has(name)) {
        state.spouse[key] = Number(params.get(name)) || 0;
      }
    });
    Object.keys(state.deductions || {}).forEach(function (key) {
      if (params.has(key)) {
        if (typeof state.deductions[key] === "boolean") {
          state.deductions[key] = params.get(key) === "true";
        } else {
          state.deductions[key] = Number(params.get(key)) || 0;
        }
      }
    });
    return true;
  }

  window.IncomeTaxApp.share = {
    serializeStateToUrl: serializeStateToUrl,
    loadStateFromUrl: loadStateFromUrl
  };
}());
