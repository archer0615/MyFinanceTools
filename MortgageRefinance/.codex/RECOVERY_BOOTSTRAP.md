# RECOVERY BOOTSTRAP

## Rules
- Stop feature expansion immediately
- Analyze architecture drift first
- Recover deterministic boundaries

## Recovery Workflow

```text
Detect Drift
    ↓
Freeze Architecture
    ↓
Refactor State Isolation
    ↓
Refactor Calculation Engine
    ↓
Re-run Review
```

## Drift Indicators
- Renderer mutates calculation state
- Hidden local state
- Implicit recalculation
- Non-deterministic rounding