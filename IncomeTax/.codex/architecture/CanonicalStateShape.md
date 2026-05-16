# Canonical State Shape

```ts
type Household = {
  members: Person[]
  filingScenarios: Scenario[]
  diagnostics: Diagnostic[]
}

type Person = {
  identity: Identity
  relation: Relation
  income: Income[]
  insurance: Insurance[]
  medical: Medical[]
  education: Education[]
  deductions: Deduction[]
  dependencyEligibility: Eligibility[]
}
```

## Rules
- Household is root aggregate
- Person is canonical financial unit
- UI state must not duplicate engine state
