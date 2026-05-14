function bindChartInteractions(getState, updateViewport) {
  const canvas = document.getElementById("chartCanvas");
  if (!canvas) return;
  let isPanning = false;
  let lastX = 0;

  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    const delta = event.deltaY < 0 ? 0.1 : -0.1;
    updateViewport((viewport) => ({
      ...viewport,
      zoom: Math.min(4, Math.max(1, viewport.zoom + delta))
    }));
  });

  canvas.addEventListener("pointerdown", (event) => {
    isPanning = true;
    lastX = event.clientX;
    canvas.setPointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointermove", (event) => {
    const state = getState();
    updateTooltip(event, state.charts.dataset || [], state.charts.viewport);
    if (!isPanning) return;
    const deltaX = event.clientX - lastX;
    lastX = event.clientX;
    updateViewport((viewport) => ({ ...viewport, panX: viewport.panX + deltaX }));
  });

  canvas.addEventListener("pointerup", (event) => {
    isPanning = false;
    canvas.releasePointerCapture(event.pointerId);
  });

  canvas.addEventListener("pointerleave", () => {
    isPanning = false;
    const tooltip = document.getElementById("tooltip");
    if (tooltip) tooltip.hidden = true;
  });
}

function updateTooltip(event, points, viewport) {
  const canvas = document.getElementById("chartCanvas");
  const tooltip = document.getElementById("tooltip");
  if (!canvas || !tooltip || points.length === 0) return;
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const index = screenXToPointIndex(x, rect.width, points.length, viewport);
  const point = points[index];
  if (!point) return;
  tooltip.hidden = false;
  tooltip.style.left = `${Math.min(rect.width - 180, Math.max(8, x + 12))}px`;
  tooltip.style.top = `${Math.max(8, event.clientY - rect.top - 42)}px`;
  tooltip.textContent = `年度 ${point.year}｜總資產 ${formatCurrency(point.value)}｜報酬率 ${formatPercent(point.returnRate)}`;
}

function screenXToPointIndex(x, width, pointCount, viewport) {
  const chartWidth = width - 56;
  const worldX = (x - 32 - viewport.panX) / viewport.zoom;
  const ratio = Math.min(1, Math.max(0, worldX / chartWidth));
  return Math.min(pointCount - 1, Math.max(0, Math.round(ratio * (pointCount - 1))));
}
