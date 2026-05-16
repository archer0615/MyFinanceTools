# TAX DOMAIN RULES

## Savings Deduction

```txt
min(interestIncome, 270000)
```

## Mortgage Deduction

```txt
mortgageInterestExpense
- savings deduction
```

capped at:

```txt
300000
```

## Invalid Conditions

- rental property
- no registered residence
- non-owner-occupied property