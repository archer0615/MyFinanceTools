# DEDUCTION ARCHITECTURE

## Canonical Deduction Flow

```txt
calculateSavingsDeduction()
  ↓
calculateMortgageDeduction()
  ↓
applyDeductionDependencies()
```

## Constraints

- deterministic execution only
- centralized deduction orchestration
- no scattered deduction logic