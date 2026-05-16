# Architecture Review

## Drift Detection
- Detect renderer/business logic coupling
- Detect hidden state mutation
- Detect duplicated amortization logic
- Detect async calculation paths

## Review Checklist
- Can index.html run directly?
- Are all calculations deterministic?
- Is rounding centralized?
- Is every rate transition explicit?
- Is localStorage recovery safe?