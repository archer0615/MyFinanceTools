# Performance

## Performance Budget

Monte Carlo 1000 simulations：

- under 2 seconds

FPS target：

- 60 FPS

Memory budget：

- under 200MB

---

## Optimization

需使用：

- debounce
- requestAnimationFrame
- dirty rectangle redraw

---

## Dataset Virtualization

大量 simulation path：

- path sampling
- aggregation
- viewport culling

---

## Adaptive Rendering

低 FPS 時：

- reduce redraw frequency
- reduce visible paths