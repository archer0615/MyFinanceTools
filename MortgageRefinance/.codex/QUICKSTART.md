# QUICKSTART

## Rules
- Open index.html directly
- No npm
- No localhost
- No build tools

## Recommended Structure

```text
/index.html
/js
  calculation/
  storage/
  ui/
  validation/
```

## Startup Sequence

```text
Initialize State
    ↓
Restore localStorage
    ↓
Bind UI
    ↓
Wait for manual calculation
```