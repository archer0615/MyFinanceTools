# Canonical Architecture

Household Workspace UI
↓
Normalized Household Model
↓
Scenario Enumeration Engine
↓
Validation Diagnostics Layer
↓
Existing Tax Calculation Engine
↓
Scenario Result Set
↓
Optimization Ranking Engine
↓
Comparative Reasoning Engine
↓
Visualization Layer

## Rules
- UI orchestrates only
- Engines remain deterministic
- Aggregation belongs to orchestration layer
- Scenario generation must be reproducible

## Notes（補充）
既有 tax engine 屬於 stable core，不應被 rewrite。
