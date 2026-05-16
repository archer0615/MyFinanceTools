# Phase 01 — Data Schema Expansion

## Tasks

- Add interestIncome
- Add mortgageInterestExpense
- Add isOwnerOccupied
- Add isRegisteredResidence
- Add isRentalProperty

## Compatibility Bridge

```js
const interestIncome = data.interestIncome || 0;
```

## Validation

- old data must not crash
- undefined fallback required