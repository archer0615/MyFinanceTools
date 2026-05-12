(function () {
  window.IncomeTaxApp = window.IncomeTaxApp || {};

  function formatNumber(value) {
    const rounded = String(Math.round(Number(value) || 0));
    return rounded.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function formatCurrency(value) {
    return formatNumber(value);
  }

  function formatPercent(value) {
    return ((Number(value) || 0) * 100).toFixed(2) + "%";
  }

  function analysis(items) {
    return items.map(function (item) {
      return "<p><strong>" + item.title + "</strong><br>" + item.body + "</p>";
    }).join("");
  }

  window.IncomeTaxApp.utils = Object.assign(window.IncomeTaxApp.utils || {}, {
    formatCurrency: formatCurrency,
    formatPercent: formatPercent,
    formatNumber: formatNumber,
    analysis: analysis
  });
}());
