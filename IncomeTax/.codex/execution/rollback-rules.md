# ROLLBACK RULES

## Rules

- Every phase must rollback independently.
- Preserve legacy deduction path until validation passes.
- Validation engine must remain removable.

## Safe Rollback

UI rollback:

```txt
remove added fields only
```

Engine rollback:

```txt
disable new integration path
```