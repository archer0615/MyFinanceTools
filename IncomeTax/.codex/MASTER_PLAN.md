# MASTER PLAN

## Execution Model

```txt
incremental deterministic refactor
```

## Canonical Execution Order

```txt
Phase 1 → Phase 2 → Phase 3 → Phase 4
        → Phase 5 → Phase 6 → Phase 7
        → Phase 8 → Phase 9
```

## System Objectives

- Add interest income support
- Add savings deduction orchestration
- Correct mortgage deduction rules
- Introduce deduction dependency system
- Separate validation from calculation
- Upgrade deduction breakdown rendering

## Architecture Preservation

Preserve:

- HTML/CSS/JS only
- file:// compatibility
- GitHub Pages compatibility
- existing calculation flow

## Required Integration Path

```txt
UI Input
  ↓
tax-engine
  ↓
deduction-engine
  ↓
applyDeductionDependencies()
  ↓
result renderer
```