# prompt.md

# CURRENT SYSTEM OVERVIEW

## System Identity

Existing project is a Taiwan income tax calculation system with:

- deterministic tax calculation engine
- dependency eligibility engine
- yearly tax rule datasets
- filing strategy comparison capability
- centralized application state
- front-end-only architecture

The system has already evolved beyond a simple calculator prototype.

Current architecture maturity:

recoverable mid-maturity analytical tax system

The project should NOT be rewritten.

The project should evolve through deterministic recovery-oriented refactoring.

# EXISTING ARCHITECTURE

## Existing Stable Core

The following components are considered stable and must be preserved:

- tax calculation engine
- dependency rule engine
- yearly tax rule data
- filing strategy calculation
- centralized deterministic state

# IDENTIFIED DRIFT

## 1. Tax-Form-Centric UI Drift

Current UI structure follows:

tax-engine-centric interaction model

instead of:

human-centric household financial workflow

## 2. Aggregation Responsibility Drift

Current system requires users to manually aggregate:

- insurance
- deductions
- household totals
- financial categories

This responsibility should belong to the system.

## 3. Household Modeling Deficiency

Current architecture is still partially deduction-centric.

Target architecture:

person-centric household model

## 4. Scenario Orchestration Incompleteness

Current system only partially supports:

joint vs separate filing comparison

Missing:

dependent allocation combinations

# RECOVERY OBJECTIVES

## Primary Objective

Transform system from:

tax form calculator

into:

household tax optimization workspace

# TARGET ARCHITECTURE

Household Workspace UI
↓
Normalized Household Model
↓
Scenario Enumeration Engine
↓
Validation Diagnostics Layer
↓
Existing Tax Calculation Engine
↓
Scenario Result Set
↓
Optimization Ranking Engine
↓
Comparative Reasoning Engine
↓
Visualization Layer

# TARGET DOMAIN MODEL

Household
 └─ Person[]

Person
- identity
- relation
- income
- insurance
- medical
- education
- deductions
- dependency eligibility

# WORKSPACE UI REQUIREMENTS

Target interaction model:

workspace-oriented orchestration UI

Recommended structure:

- Household Panel
- Person Editor Panel
- Scenario Analysis Panel
- Tax Knowledge Panel

# RECOVERY PHASE STRATEGY

## Phase 1 — Household Modeling Recovery

- normalized household model
- person-centric intake structure
- system-managed aggregation

## Phase 2 — Workspace Recovery

- replace giant form interaction
- build analytical workspace
- reduce cognitive overload

## Phase 3 — Scenario Enumeration Recovery

- dependent allocation combinations
- optimization ranking
- legality-aware comparison

## Phase 4 — Explainability Recovery

- comparative reasoning
- structured explanation generation
- savings attribution analysis

## Phase 5 — Visualization Recovery

- visible tax knowledge
- analytical comparison visualization
- transparency enhancement

# FORBIDDEN RECOVERY PATTERNS

- full rewrite
- uncontrolled state duplication
- calculation logic inside UI
- hidden global mutable state
- speculative microservice migration
- premature rule-engine generalization
- framework-driven redesign

# SUCCESS CRITERIA

Users can naturally:

- create household members
- edit person-level financial data
- compare filing combinations
- understand savings reasons
- inspect tax rules visually

Without needing tax expertise.
