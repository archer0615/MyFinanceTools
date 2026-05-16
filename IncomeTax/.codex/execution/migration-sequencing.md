# MIGRATION SEQUENCING

## Required Sequence

1. Expand schema
2. Add isolated functions
3. Add compatibility bridges
4. Introduce orchestration layer
5. Upgrade renderer
6. Enable validation integration

## Forbidden

- destructive migration first
- simultaneous architecture replacement
- rewrite-based integration