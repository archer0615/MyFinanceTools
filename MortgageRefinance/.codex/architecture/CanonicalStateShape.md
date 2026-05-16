# Canonical State Shape

```js
const appState = {
  existingLoans: [],
  refinanceLoan: {},
  refinanceCosts: {},
  calculationResults: {},
  uiState: {}
};
```

## Rules
- No hidden state
- No duplicated derived values
- No renderer-owned business state