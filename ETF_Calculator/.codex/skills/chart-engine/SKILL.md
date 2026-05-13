# Chart Engine Skill

## Goal

建立高效能 chart engine。

---

# Step Order

1. 建立 coordinate system
2. 建立 viewport system
3. 建立 canvas layering
4. 建立 render pipeline
5. 建立 tooltip system
6. 建立 zoom / pan
7. 建立 crosshair
8. 建立 partial redraw

---

# Requirements

必須：

- requestAnimationFrame
- partial redraw
- viewport transform
- retina support

禁止：

- full redraw
- DOM-based chart
- state mutation

---

# Done Criteria

- zoom 正常
- pan 正常
- tooltip 不閃爍
- FPS 穩定