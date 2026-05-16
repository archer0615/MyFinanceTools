# Canonical Architecture

## Rules
- Single-page application only
- Offline-first execution
- Centralized calculation engine
- Unidirectional data flow
- Renderer isolation required

## Notes（補充）
Renderer 不可直接修改 financial state。

## Canonical Layers

```text
Input
  ↓
Validation
  ↓
Normalized State
  ↓
Calculation Engine
  ↓
Result Model
  ↓
Renderer
```