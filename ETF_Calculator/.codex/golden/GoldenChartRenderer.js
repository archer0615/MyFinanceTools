export class ChartRenderer {
  render(ctx, datasets, scales) {
    requestAnimationFrame(() => {
      this.renderAxes(ctx, scales);
      this.renderDatasets(ctx, datasets, scales);
    });
  }
}
