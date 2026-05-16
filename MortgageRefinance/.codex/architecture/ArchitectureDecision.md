# Architecture Decisions

## Rules
- No framework adoption
- No build pipeline
- No dependency injection
- No event bus

## Notes（補充）
此專案必須可直接透過 file:// 執行。

所有 financial logic 必須同步且 deterministic。