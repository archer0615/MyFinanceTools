# 使用指南

## 新專案流程

1. 閱讀 `.codex/BOOTSTRAP.md`
2. 執行 `MASTER_PLAN.md`
3. 依 phase 開發
4. 每階段執行 review

## Recovery Workflow

若專案已 drift：

1. 執行 `RECOVERY_BOOTSTRAP.md`
2. 停止新增功能
3. 重建 deterministic state flow
4. 修正 calculation isolation

## Autonomous Workflow

系統採用 phase execution：

```text
Task Queue
    ↓
Implementation
    ↓
Review
    ↓
Recovery if needed
```