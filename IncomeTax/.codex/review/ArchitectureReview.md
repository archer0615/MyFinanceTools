# Architecture Review

## Drift Detection
- Detect duplicated aggregation logic
- Detect renderer/business logic coupling
- Detect hidden mutable state
- Detect deduction-centric regressions

## Review Questions
- Is household model canonical?
- Are totals centrally orchestrated?
- Are scenarios reproducible?
- Is UI orchestration-only?

## Failure Conditions
- Calculation logic inside components
- Multiple competing state authorities
- Scenario side effects
