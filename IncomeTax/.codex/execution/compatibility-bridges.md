# COMPATIBILITY BRIDGES

## Required Fallbacks

```js
const interestIncome = data.interestIncome || 0;
```

## Renderer Safety

```js
if (result.savingsDeduction != null)
```

## Migration Strategy

```txt
legacy calculation
+ extended deductions
```

temporary coexistence is allowed.