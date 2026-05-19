class ChartRenderer {
  render(canvas, datasets, viewport) {
    if (!canvas) return;
    requestAnimationFrame(() => {
      const rect = canvas.getBoundingClientRect();
      const ratio = window.devicePixelRatio || 1;
      canvas.width = rect.width * ratio;
      canvas.height = rect.height * ratio;
      const context = canvas.getContext("2d");
      if (!context) return;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      context.clearRect(0, 0, rect.width, rect.height);
      if (datasets.dedicatedChart && datasets.dedicatedChart.series.length) {
        this.renderDedicatedChart(context, datasets.dedicatedChart, rect.width, rect.height, viewport);
        return;
      }
      this.renderAxes(context, rect.width, rect.height);
      const maxValue = this.resolveMaxValue(datasets);
      this.renderMonteCarloBands(context, datasets.monteCarlo, rect.width, rect.height, viewport, maxValue);
      this.renderMonteCarloPaths(context, datasets.monteCarlo, rect.width, rect.height, viewport, maxValue);
      this.renderSeriesList(context, datasets.overlaySeries || [], rect.width, rect.height, viewport, maxValue);
      this.renderPrimarySeries(context, this.resolvePrimarySeries(datasets), rect.width, rect.height, viewport, maxValue);
      this.renderTimelineMarkers(context, datasets.timelineMarkers || [], this.resolvePrimarySeries(datasets).points || [], rect.width, rect.height, viewport, maxValue);
      this.renderLegend(context, datasets, rect.width);
    });
  }

  renderAxes(context, width, height) {
    context.strokeStyle = "#d8dee8";
    context.lineWidth = 1;
    for (let index = 0; index < 6; index += 1) {
      const y = 24 + ((height - 48) / 5) * index;
      context.beginPath();
      context.moveTo(32, y);
      context.lineTo(width - 24, y);
      context.stroke();
    }
  }

  resolvePrimarySeries(datasets) {
    if (datasets.primarySeries) return datasets.primarySeries;
    return { points: datasets.points || [], color: "#2563eb" };
  }

  resolveMaxValue(datasets) {
    const values = [];
    const addPoints = (points, key = "value") => (points || []).forEach((point) => values.push(point[key] || 0));
    addPoints(datasets.primarySeries && datasets.primarySeries.points);
    (datasets.overlaySeries || []).forEach((series) => addPoints(series.points));
    if (datasets.monteCarlo && Array.isArray(datasets.monteCarlo.percentilePaths)) {
      addPoints(datasets.monteCarlo.percentilePaths, "p90");
    }
    return Math.max(...values, 1);
  }

  renderPrimarySeries(context, series, width, height, viewport, maxValue) {
    const points = series.points || [];
    context.strokeStyle = series.color || "#2563eb";
    context.lineWidth = 2;
    context.setLineDash(series.style === "dashed" ? [7, 5] : series.style === "dotted" ? [2, 5] : []);
    context.beginPath();
    points.forEach((point, index) => {
      const x = 32 + viewport.panX + ((width - 56) / Math.max(points.length - 1, 1)) * index * viewport.zoom;
      const y = height - 24 - (point.value / maxValue) * (height - 48);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  }

  renderSeriesList(context, seriesList, width, height, viewport, maxValue) {
    seriesList.forEach((series) => {
      context.save();
      context.globalAlpha = 0.72;
      this.renderPrimarySeries(context, series, width, height, viewport, maxValue);
      context.restore();
    });
  }

  renderMonteCarloPaths(context, monteCarlo, width, height, viewport, maxValue) {
    if (!monteCarlo || !Array.isArray(monteCarlo.paths)) return;
    monteCarlo.paths.slice(0, 24).forEach((points) => {
      context.save();
      context.globalAlpha = 0.08;
      this.renderPrimarySeries(context, { points, color: "#475569" }, width, height, viewport, maxValue);
      context.restore();
    });
  }

  renderMonteCarloBands(context, monteCarlo, width, height, viewport, maxValue) {
    if (!monteCarlo || !Array.isArray(monteCarlo.percentilePaths) || monteCarlo.percentilePaths.length === 0) return;
    const points = monteCarlo.percentilePaths;
    const xFor = (index) => 32 + viewport.panX + ((width - 56) / Math.max(points.length - 1, 1)) * index * viewport.zoom;
    const yFor = (value) => height - 24 - (value / maxValue) * (height - 48);

    context.fillStyle = "rgba(37, 99, 235, 0.14)";
    context.beginPath();
    points.forEach((point, index) => {
      const x = xFor(index);
      const y = yFor(point.p90);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    [...points].reverse().forEach((point, reverseIndex) => {
      const index = points.length - 1 - reverseIndex;
      context.lineTo(xFor(index), yFor(point.p10));
    });
    context.closePath();
    context.fill();

    context.strokeStyle = "#0f766e";
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => {
      const x = xFor(index);
      const y = yFor(point.p50);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
    context.setLineDash([]);
  }

  renderLegend(context, datasets, width) {
    const items = [
      ["#2563eb", "資產走勢"],
      ...(datasets.monteCarlo ? [["#0f766e", "Monte Carlo P50"]] : []),
      ...(datasets.overlaySeries || []).slice(0, 4).map((series) => [series.color, series.label])
    ];
    context.font = "12px sans-serif";
    items.forEach(([color, label], index) => {
      const x = Math.min(width - 132, 40 + index * 120);
      context.fillStyle = color;
      context.fillRect(x, 10, 10, 10);
      context.fillStyle = "#64748b";
      context.fillText(label, x + 14, 19);
    });
  }

  renderTimelineMarkers(context, markers, points, width, height, viewport, maxValue) {
    if (!markers.length || !points.length) return;
    context.save();
    context.font = "12px sans-serif";
    markers.forEach((marker) => {
      const index = Math.max(0, points.findIndex((point) => point.year === marker.year));
      const x = 32 + viewport.panX + ((width - 56) / Math.max(points.length - 1, 1)) * index * viewport.zoom;
      const y = height - 24 - (marker.value / maxValue) * (height - 48);
      context.strokeStyle = "rgba(100, 116, 139, 0.55)";
      context.setLineDash([4, 6]);
      context.beginPath();
      context.moveTo(x, 24);
      context.lineTo(x, height - 24);
      context.stroke();
      context.setLineDash([]);
      context.fillStyle = "#64748b";
      context.fillText(marker.label, Math.min(x + 6, width - 88), Math.max(36, y - 8));
    });
    context.restore();
  }

  renderDedicatedChart(context, chart, width, height, viewport) {
    this.renderAxes(context, width, height);
    const maxValue = Math.max(...chart.series.flatMap((series) => series.points.map((point) => point.value)), 1);
    this.renderSeriesList(context, chart.series, width, height, viewport, maxValue);
    context.font = "13px sans-serif";
    context.fillStyle = "#64748b";
    context.fillText(chart.title, 40, 20);
    this.renderLegend(context, { overlaySeries: chart.series }, width);
  }
}
