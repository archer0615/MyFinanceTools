# Execution Batching Pattern

## Rules
- Full calculation only after manual trigger
- No realtime recalculation
- No debounce orchestration

## Execution

```text
User Click
    ↓
Validate
    ↓
Calculate
    ↓
Render
```