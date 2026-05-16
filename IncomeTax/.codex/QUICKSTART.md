# QUICKSTART

## Deterministic Execution

Follow:

```txt
phase-01.md
→ phase-02.md
→ phase-03.md
...
```

## Do Not

- Skip phases
- Merge unrelated migrations
- Replace legacy calculation path early
- Remove compatibility bridges before validation

## Validation Priority

Preserve:

- no NaN
- no negative deductions
- file:// compatibility
- pure functions