(function () {
  "use strict";

  var elements = {
    loanBalance: document.getElementById("loanBalance"),
    loanRate: document.getElementById("loanRate"),
    loanYears: document.getElementById("loanYears"),
    etfReturn: document.getElementById("etfReturn"),
    inflationRate: document.getElementById("inflationRate"),
    taxRate: document.getElementById("taxRate"),
    errorMessage: document.getElementById("errorMessage"),
    recommendation: document.getElementById("recommendation"),
    interestSaved: document.getElementById("interestSaved"),
    etfFutureValue: document.getElementById("etfFutureValue"),
    netDifference: document.getElementById("netDifference"),
    realReturn: document.getElementById("realReturn"),
    assetChart: document.getElementById("assetChart"),
    interestChart: document.getElementById("interestChart")
  };

  var moneyFormatter = new Intl.NumberFormat("zh-TW", {
    style: "currency",
    currency: "TWD",
    maximumFractionDigits: 0
  });

  function readNumber(input) {
    return Number(input.value);
  }

  function percentToDecimal(value) {
    return value / 100;
  }

  function formatMoney(value) {
    return moneyFormatter.format(Math.round(value));
  }

  function formatPercent(value) {
    return (value * 100).toFixed(2) + "%";
  }

  function clearInvalidState() {
    Object.keys(elements).forEach(function (key) {
      if (elements[key] && elements[key].classList) {
        elements[key].classList.remove("invalid");
      }
    });
  }

  function validateInputs(data) {
    var errors = [];

    if (!Number.isFinite(data.loanBalance) || data.loanBalance <= 0) {
      errors.push("房貸餘額需大於 0");
      elements.loanBalance.classList.add("invalid");
    }

    if (!Number.isFinite(data.loanRate) || data.loanRate < 0) {
      errors.push("房貸利率不可小於 0");
      elements.loanRate.classList.add("invalid");
    }

    if (!Number.isFinite(data.loanYears) || data.loanYears <= 0) {
      errors.push("剩餘年限需大於 0");
      elements.loanYears.classList.add("invalid");
    }

    if (!Number.isFinite(data.etfReturn) || data.etfReturn <= -100) {
      errors.push("ETF 年化報酬需大於 -100%");
      elements.etfReturn.classList.add("invalid");
    }

    if (!Number.isFinite(data.inflationRate) || data.inflationRate <= -100) {
      errors.push("通膨率需大於 -100%");
      elements.inflationRate.classList.add("invalid");
    }

    if (!Number.isFinite(data.taxRate) || data.taxRate < 0 || data.taxRate > 100) {
      errors.push("稅率需介於 0% 到 100%");
      elements.taxRate.classList.add("invalid");
    }

    return errors;
  }

  function getInputData() {
    return {
      loanBalance: readNumber(elements.loanBalance),
      loanRate: readNumber(elements.loanRate),
      loanYears: readNumber(elements.loanYears),
      etfReturn: readNumber(elements.etfReturn),
      inflationRate: readNumber(elements.inflationRate),
      taxRate: readNumber(elements.taxRate)
    };
  }

  // 本息平均攤還月付金。
  function calculateMonthlyPayment(principal, annualRate, years) {
    var months = Math.round(years * 12);
    var monthlyRate = annualRate / 12;

    if (monthlyRate === 0) {
      return principal / months;
    }

    return principal * monthlyRate * Math.pow(1 + monthlyRate, months) /
      (Math.pow(1 + monthlyRate, months) - 1);
  }

  function calculateLoanInterest(principal, annualRate, years) {
    var months = Math.round(years * 12);
    var monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
    var totalPaid = monthlyPayment * months;

    return Math.max(totalPaid - principal, 0);
  }

  function calculateRealReturn(etfReturn, inflationRate) {
    return ((1 + etfReturn) / (1 + inflationRate)) - 1;
  }

  function calculateEtfFutureValue(principal, realReturn, taxRate, years) {
    var grossValue = principal * Math.pow(1 + realReturn, years);
    var gain = grossValue - principal;
    var taxableGain = Math.max(gain, 0);

    return grossValue - taxableGain * taxRate;
  }

  function buildYearlySeries(data) {
    var years = Math.round(data.loanYears);
    var principal = data.loanBalance;
    var loanRate = percentToDecimal(data.loanRate);
    var realReturn = calculateRealReturn(
      percentToDecimal(data.etfReturn),
      percentToDecimal(data.inflationRate)
    );
    var taxRate = percentToDecimal(data.taxRate);
    var totalInterest = calculateLoanInterest(principal, loanRate, years);
    var yearlyInterestSaved = years > 0 ? totalInterest / years : 0;
    var assetSeries = [];
    var interestSeries = [];

    for (var year = 0; year <= years; year += 1) {
      var etfValue = calculateEtfFutureValue(principal, realReturn, taxRate, year);
      var loanSaved = yearlyInterestSaved * year;

      assetSeries.push({
        year: year,
        etf: etfValue,
        loan: loanSaved
      });

      interestSeries.push({
        year: year,
        value: loanSaved
      });
    }

    return {
      assetSeries: assetSeries,
      interestSeries: interestSeries,
      totalInterest: totalInterest,
      realReturn: realReturn,
      etfFutureValue: calculateEtfFutureValue(principal, realReturn, taxRate, years)
    };
  }

  function calculateResult(data) {
    var series = buildYearlySeries(data);
    var loanRate = percentToDecimal(data.loanRate);
    var netDifference = series.etfFutureValue - series.totalInterest;
    var recommendEtf = series.realReturn > loanRate;

    return {
      interestSaved: series.totalInterest,
      etfFutureValue: series.etfFutureValue,
      netDifference: netDifference,
      realReturn: series.realReturn,
      recommendation: recommendEtf ? "ETF 投資" : "提前還貸",
      assetSeries: series.assetSeries,
      interestSeries: series.interestSeries
    };
  }

  function setCanvasSize(canvas) {
    var ratio = window.devicePixelRatio || 1;
    var rect = canvas.getBoundingClientRect();

    canvas.width = Math.max(Math.floor(rect.width * ratio), 1);
    canvas.height = Math.max(Math.floor((rect.height || canvas.clientHeight) * ratio), 1);

    return {
      width: canvas.width,
      height: canvas.height,
      ratio: ratio
    };
  }

  function drawAxes(ctx, width, height, padding) {
    ctx.strokeStyle = "#2d3844";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();
  }

  function drawGrid(ctx, width, height, padding) {
    var rows = 4;

    ctx.strokeStyle = "rgba(154, 168, 183, 0.16)";
    ctx.lineWidth = 1;

    for (var index = 0; index <= rows; index += 1) {
      var y = padding.top + ((height - padding.top - padding.bottom) / rows) * index;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
  }

  function plotLine(ctx, points, color) {
    if (!points.length) {
      return;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    points.forEach(function (point, index) {
      if (index === 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.stroke();
  }

  function getChartPoints(series, valueKey, width, height, padding, maxValue) {
    var maxYear = Math.max(series[series.length - 1].year, 1);
    var chartWidth = width - padding.left - padding.right;
    var chartHeight = height - padding.top - padding.bottom;

    return series.map(function (item) {
      return {
        x: padding.left + (item.year / maxYear) * chartWidth,
        y: height - padding.bottom - (item[valueKey] / maxValue) * chartHeight
      };
    });
  }

  function drawAssetChart(series) {
    var canvas = elements.assetChart;
    var size = setCanvasSize(canvas);
    var ctx = canvas.getContext("2d");
    var padding = { top: 26, right: 22, bottom: 34, left: 58 };
    var maxValue = Math.max.apply(null, series.map(function (item) {
      return Math.max(item.etf, item.loan);
    }));

    maxValue = Math.max(maxValue, 1);
    ctx.clearRect(0, 0, size.width, size.height);
    drawGrid(ctx, size.width, size.height, padding);
    drawAxes(ctx, size.width, size.height, padding);
    plotLine(ctx, getChartPoints(series, "etf", size.width, size.height, padding, maxValue), "#42c6a3");
    plotLine(ctx, getChartPoints(series, "loan", size.width, size.height, padding, maxValue), "#6da8ff");
  }

  function drawInterestChart(series) {
    var canvas = elements.interestChart;
    var size = setCanvasSize(canvas);
    var ctx = canvas.getContext("2d");
    var padding = { top: 24, right: 22, bottom: 32, left: 58 };
    var maxValue = Math.max.apply(null, series.map(function (item) {
      return item.value;
    }));

    maxValue = Math.max(maxValue, 1);
    ctx.clearRect(0, 0, size.width, size.height);
    drawGrid(ctx, size.width, size.height, padding);
    drawAxes(ctx, size.width, size.height, padding);
    plotLine(ctx, getChartPoints(series, "value", size.width, size.height, padding, maxValue), "#f2c94c");
  }

  function renderResult(result) {
    elements.recommendation.textContent = result.recommendation;
    elements.interestSaved.textContent = formatMoney(result.interestSaved);
    elements.etfFutureValue.textContent = formatMoney(result.etfFutureValue);
    elements.netDifference.textContent = formatMoney(result.netDifference);
    elements.realReturn.textContent = formatPercent(result.realReturn);
    drawAssetChart(result.assetSeries);
    drawInterestChart(result.interestSeries);
  }

  function renderEmptyState(message) {
    elements.errorMessage.textContent = message;
    elements.recommendation.textContent = "請修正輸入";
    elements.interestSaved.textContent = "NT$0";
    elements.etfFutureValue.textContent = "NT$0";
    elements.netDifference.textContent = "NT$0";
    elements.realReturn.textContent = "0.00%";
  }

  function update() {
    clearInvalidState();
    var data = getInputData();
    var errors = validateInputs(data);

    if (errors.length) {
      renderEmptyState(errors.join("、"));
      return;
    }

    elements.errorMessage.textContent = "";
    renderResult(calculateResult(data));
  }

  function bindEvents() {
    [
      elements.loanBalance,
      elements.loanRate,
      elements.loanYears,
      elements.etfReturn,
      elements.inflationRate,
      elements.taxRate
    ].forEach(function (input) {
      input.addEventListener("input", update);
    });

    window.addEventListener("resize", update);
  }

  bindEvents();
  update();
}());
