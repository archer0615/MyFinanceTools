(function () {
  function compareFilingStrategies(data, input) {
    return window.IncomeTaxApp.orchestration.evaluate(data, input);
  }

  window.IncomeTaxApp.strategy = {
    compareFilingStrategies: compareFilingStrategies
  };
}());
