# Architecture Laws

## Immutable Rules
- Calculations must be deterministic
- Renderers must remain stateless
- State mutation must be centralized
- Rounding must be explicit
- No framework runtime allowed

## Forbidden
- hidden mutation
- async financial calculation
- reactive orchestration
- event-bus coupling