# Error Handling Contract

## Rules
- Validation errors remain local
- Invalid input must not crash rendering
- Corrupted localStorage must auto-reset

## Forbidden
- silent calculation failure
- hidden fallback mutation