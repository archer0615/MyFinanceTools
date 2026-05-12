(function () {
  function drawBar(canvas, values, labels) {
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const max = Math.max(1, ...values);
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#e6f4f7";
    ctx.fillRect(0, 0, width, height);
    values.forEach(function (value, index) {
      const barWidth = width / values.length - 18;
      const barHeight = Math.round((height - 42) * value / max);
      const x = 10 + index * (barWidth + 18);
      const y = height - barHeight - 24;
      ctx.fillStyle = index === 0 ? "#176b87" : "#8a5a44";
      ctx.fillRect(x, y, barWidth, barHeight);
      ctx.fillStyle = "#17202a";
      ctx.font = "12px system-ui";
      ctx.fillText(labels[index], x, height - 8);
    });
  }

  function render(result) {
    const active = result.activeResult;
    drawBar(document.getElementById("effectiveRateChart"), [active.effectiveRate * 100, active.marginalRate * 100], ["有效", "邊際"]);
    drawBar(document.getElementById("taxBracketChart"), [active.taxableIncome, active.bracket.max || active.taxableIncome], ["淨額", "級距"]);
    drawBar(document.getElementById("yearComparisonChart"), [result.strategies.separate.taxAmount, result.strategies.joint.taxAmount], ["單獨", "合併"]);
  }

  window.IncomeTaxApp.charts = {
    render: render
  };
}());
