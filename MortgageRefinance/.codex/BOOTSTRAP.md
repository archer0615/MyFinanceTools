# BOOTSTRAP

## Rules
- Read MASTER_PLAN.md before implementation
- Follow deterministic calculation rules
- Preserve offline-first execution
- Maintain file:// compatibility
- Keep all logic framework-free

## Notes（補充）
此專案的最高優先級為 deterministic financial calculations。

禁止：
- reactive frameworks
- async-heavy orchestration
- hidden state mutation

## Execution Flow

```text
Read MASTER_PLAN.md
    ↓
Implement phase-by-phase
    ↓
Run ArchitectureReview.md
    ↓
Run deterministic verification
```