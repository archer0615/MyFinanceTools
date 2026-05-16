# Architecture Laws

## Immutable Rules
- Household is canonical root aggregate
- Tax calculation engine is preserved
- Aggregation logic is centralized
- UI cannot perform calculations
- Hidden mutable global state is forbidden
- Scenario enumeration must be deterministic
- Explainability must be reproducible

## Notes（補充）
所有新功能都需符合上述 immutable rules。
