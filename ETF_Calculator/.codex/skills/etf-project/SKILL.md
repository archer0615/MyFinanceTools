---
name: etf-project
description: ETF Calculator enterprise-grade fullstack workflow orchestrator
version: 1.0.0
author: Brankung
---

# ETF Calculator Master Workflow

This skill orchestrates the complete ETF Calculator implementation lifecycle.

The agent MUST strictly follow the execution phases and MUST NOT skip phases.

# Global Execution Rules

- Always execute tasks sequentially
- Never parallelize major phases
- Never skip references
- Always validate implementation before moving to next phase
- Always summarize completed phase before continuing

# Required Reference Files

Read these files in exact order:

1. references/00_EXECUTION_ORDER.md
2. references/01_ARCHITECTURE.md
3. references/02_CODING_RULES.md
4. references/03_STATE_SYSTEM.md
5. references/04_CHART_ENGINE.md
6. references/05_FINANCIAL_ENGINE.md
7. references/06_MONTE_CARLO_ENGINE.md
8. references/07_HISTORICAL_REPLAY.md
9. references/08_UI_PRODUCTIZATION.md
10. references/09_PERFORMANCE.md
11. references/10_TESTING.md
12. references/11_LOCALIZATION.md

# Technical Stack

## Frontend

- Next.js
- React
- TypeScript
- TailwindCSS
- shadcn/ui
- Zustand
- React Query
- Zod

## Backend

- FastAPI
- Python 3.12+
- uv
- SQLAlchemy
- Alembic
- pytest
- Ruff
- mypy

## Infrastructure

- Docker
- Docker Compose
- GitHub Actions compatible structure

# Required Folder Structure

```text
frontend/
backend/
shared/
docs/
```

# Execution Phases

## Phase 1 — Repository Initialization

Tasks:

1. Verify git repository
2. Create frontend folder
3. Create backend folder
4. Create shared folder
5. Create docs folder

## Phase 2 — Architecture Setup

Read:

- references/00_EXECUTION_ORDER.md
- references/01_ARCHITECTURE.md
- references/02_CODING_RULES.md

Tasks:

1. Setup frontend architecture
2. Setup backend architecture
3. Setup repository pattern
4. Setup service layer

## Phase 3 — Frontend Core Setup

Read:

- references/03_STATE_SYSTEM.md

Tasks:

1. Initialize Next.js
2. Configure TypeScript strict mode
3. Configure TailwindCSS
4. Configure Zustand
5. Configure API client

## Phase 4 — Backend Core Setup

Tasks:

1. Initialize FastAPI
2. Configure uv
3. Configure Ruff
4. Configure mypy
5. Setup API routers
6. Setup database layer

## Phase 5 — Financial Engine Implementation

Read:

- references/04_CHART_ENGINE.md
- references/05_FINANCIAL_ENGINE.md
- references/06_MONTE_CARLO_ENGINE.md
- references/07_HISTORICAL_REPLAY.md

Tasks:

1. Implement ETF return calculator
2. Implement compound growth engine
3. Implement dividend reinvestment engine
4. Implement Monte Carlo engine
5. Implement historical replay engine

## Phase 6 — Dashboard UI Productization

Read:

- references/08_UI_PRODUCTIZATION.md

Tasks:

1. Create dashboard layout
2. Create ETF simulation page
3. Create chart components
4. Create responsive layouts

## Phase 7 — Performance Optimization

Read:

- references/09_PERFORMANCE.md

Tasks:

1. Implement memoization
2. Implement lazy loading
3. Implement caching
4. Optimize rendering

## Phase 8 — Testing

Read:

- references/10_TESTING.md

Tasks:

1. Add pytest
2. Add backend unit tests
3. Add frontend tests
4. Add integration tests

## Phase 9 — Localization

Read:

- references/11_LOCALIZATION.md

Tasks:

1. Setup i18n
2. Add Traditional Chinese
3. Add English

## Phase 10 — Docker & Deployment

Tasks:

1. Create frontend Dockerfile
2. Create backend Dockerfile
3. Create docker-compose.yml

# Final Verification Checklist

Verify:

- Frontend builds successfully
- Backend builds successfully
- Docker works
- Tests pass
- No lint errors
- No TypeScript errors

# Forbidden Behaviors

The agent MUST NOT:

- Skip references
- Skip validations
- Ignore testing
- Ignore linting
- Hardcode financial assumptions

# Success Criteria

The project is complete only if:

- All phases completed
- All validations passed
- Frontend operational
- Backend operational
- Docker operational
