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
      this.renderAxes(context, rect.width, rect.height);
      this.renderPrimarySeries(context, this.resolvePrimarySeries(datasets), rect.width, rect.height, viewport);
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

  renderPrimarySeries(context, series, width, height, viewport) {
    const points = series.points || [];
    const maxValue = Math.max(...points.map((point) => point.value), 1);
    context.strokeStyle = series.color || "#2563eb";
    context.lineWidth = 2;
    context.beginPath();
    points.forEach((point, index) => {
      const x = 32 + viewport.panX + ((width - 56) / Math.max(points.length - 1, 1)) * index * viewport.zoom;
      const y = height - 24 - (point.value / maxValue) * (height - 48);
      if (index === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    });
    context.stroke();
  }
}
