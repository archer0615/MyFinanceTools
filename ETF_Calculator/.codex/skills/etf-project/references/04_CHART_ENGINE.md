# Chart Engine

## Canvas Requirements

- retina support
- devicePixelRatio scaling
- responsive canvas

---

## Coordinate System

需支援：

- world space
- screen space
- viewport transform
- zoom scale
- pan offset

---

## Interaction

需支援：

- zoom
- pan
- crosshair
- tooltip

---

## Layering

Canvas 必須分層：

1. background grid
2. axis
3. chart line
4. hover layer
5. tooltip overlay

---

## Render Lifecycle

state update
→ dirty detection
→ partial redraw
→ tooltip update
→ animation frame commit