# SELF REVIEW PROMPT

## Review Checklist
- Is every calculation deterministic?
- Is rounding centralized?
- Does any renderer mutate state?
- Does any logic depend on async timing?
- Can the app run via file:// only?
- Is localStorage recovery safe?