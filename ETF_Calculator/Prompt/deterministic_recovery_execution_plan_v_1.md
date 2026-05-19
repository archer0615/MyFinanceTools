# EXECUTION OVERVIEW

本文件基於 recovery specification 建立 deterministic incremental recovery execution plan。

目標：

在不破壞既有稅務計算核心的前提下，將系統從「tax form calculator」演進為「household tax optimization workspace」。

核心原則：

1. preserve stable architecture
2. isolate refactor scope
3. maintain deterministic calculation behavior
4. avoid uncontrolled rewrites
5. incrementally evolve UI and orchestration layers
6. preserve backward compatibility during migration

---

# STABLE CORE PRESERVATION

以下區域視為 stable core。

禁止直接重寫。

## Stable Components

- tax calculation engine
- dependency eligibility engine
- yearly tax rule datasets
- filing strategy calculator
- centralized application state

## Protection Constraints

所有 recovery phase 必須遵守：

- calculation engine API contract 不可破壞
- rule dataset structure 不可大規模修改
- deterministic output behavior 必須保持一致
- 所有 orchestration layer 必須位於 calculation core 外圍
- UI 不得重新嵌入 tax logic

---

# REFACTOR BOUNDARIES

## Allowed Refactor Surface

### UI Layer

允許：

- workspace 化
- panel 化
- orchestration recovery
- state slicing
- intake flow redesign

禁止：

- tax computation embedded in components
- duplicated aggregation logic
- local shadow calculation systems

---

## State Layer

允許：

- normalized household state
- derived selectors
- scenario orchestration state
- migration adapters

禁止：

- hidden mutable global stores
- duplicated financial aggregates
- implicit synchronization

---

## Domain Layer

允許：

- household domain model
- scenario graph
- explanation model
- ranking model

禁止：

- replacing tax rule engine
- speculative DSL redesign
- generalized inference engine rewrite

---

# TARGET RECOVERY STRUCTURE

```text
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
```

---

# PHASE PLAN

# Phase 1 — Household Modeling Recovery

## Objective

建立 person-centric normalized household model。

將 aggregation responsibility 從 UI/user 移轉至 system。

## Primary Deliverables

### 1. Household Domain Model

```text
Household
 └─ Person[]
```

```text
Person
- identity
- relation
- income
- insurance
- medical
- education
- deductions
- dependency eligibility
```

---

### 2. Normalized State Structure

建議：

```text
household
personsById
personOrder
derivedFinancialViews
scenarioInputs
```

避免：

- nested mutable giant form state
- duplicated subtotal state
- manually synchronized aggregates

---

### 3. Aggregation Recovery

系統負責：

- household insurance aggregation
- deduction aggregation
- income category aggregation
- dependent eligibility rollups

UI 不再要求使用者自行總結。

---

## Safe Migration Strategy

建立 compatibility adapter：

```text
HouseholdModel
→ LegacyTaxInputAdapter
→ ExistingCalculationEngine
```

先保留舊 calculation input contract。

禁止直接修改 engine input structure。

---

## Validation Checkpoints

### Validation A

同一 household data：

- old flow output
- new adapter output

必須完全一致。

### Validation B

所有 aggregate values：

- deterministic
- reproducible
- selector-derived only

---

## Rollback Safety

保留：

- legacy form pipeline
- legacy intake mapping

新 household model 失敗時可回退。

---

# Phase 2 — Workspace Recovery

## Objective

從 giant-form interaction 遷移至 workspace-oriented orchestration UI。

---

## Target Panels

### Household Panel

功能：

- household overview
- relationship structure
- member navigation
- filing overview

---

### Person Editor Panel

功能：

- person-level finance editing
- deduction editing
- dependency visibility
- validation diagnostics

---

### Scenario Analysis Panel

功能：

- joint vs separate comparison
- scenario enumeration results
- tax delta comparison
- optimization ranking

---

### Tax Knowledge Panel

功能：

- rule explanation
- deduction explanation
- eligibility explanation
- validation guidance

---

## UI Refactor Constraints

允許：

- component decomposition
- workflow orchestration
- view-model selectors

禁止：

- direct engine invocation from deep components
- duplicated financial calculations in UI
- giant shared mutable component state

---

## Migration Sequence

### Step 1

Introduce read-only workspace shell。

### Step 2

Embed existing form into workspace container。

### Step 3

Incrementally replace legacy form sections。

### Step 4

Remove obsolete form orchestration layer。

---

## Validation Checkpoints

### Validation A

Workspace UI 必須：

- support existing filing flows
- preserve current output parity

### Validation B

Cognitive load reduction：

- fewer visible simultaneous fields
- improved member-centric navigation

---

# Phase 3 — Scenario Enumeration Recovery

## Objective

建立合法且 deterministic 的 scenario enumeration system。

---

## Core Capability

支援：

- joint vs separate filing
- dependent allocation combinations
- filing optimization ranking

---

## New Components

### Scenario Generator

輸入：

```text
HouseholdModel
TaxRules
EligibilityConstraints
```

輸出：

```text
Scenario[]
```

---

### Constraint Validator

負責：

- legality checks
- dependency exclusivity
- filing consistency
- rule conflict detection

---

### Optimization Ranker

負責：

- tax burden ranking
- savings comparison
- scenario ordering

---

## Critical Constraint

Scenario layer：

只能 orchestration。

不得重新實作 tax calculation。

所有結果仍必須透過：

```text
Existing Tax Calculation Engine
```

---

## Deterministic Enumeration Rules

必須：

- stable ordering
- reproducible output
- identical input → identical scenario ordering

禁止：

- random ranking
- heuristic mutation
- hidden prioritization logic

---

## Validation Checkpoints

### Validation A

所有 scenario：

- legally valid
- reproducible
- engine-compatible

### Validation B

Best scenario：

必須可追溯：

- why selected
- why alternatives lost

---

# Phase 4 — Explainability Recovery

## Objective

建立 comparative reasoning layer。

讓使用者理解：

- 為何某方案最佳
- 節稅來源
- dependency impact
- deduction impact

---

## Required Explanation Types

### Savings Attribution

例如：

```text
Scenario B saved NT$23,000 because:
- dependent allocation shift
- medical deduction concentration
- lower marginal tax exposure
```

---

### Rule Explanation

例如：

```text
Dependent eligibility rejected because:
- income threshold exceeded
- filing conflict detected
```

---

### Comparative Explanation

例如：

```text
Scenario C worse than Scenario A because:
- duplicated deduction opportunity lost
- progressive rate increased
```

---

## Architecture Constraint

Explanation layer：

只能 consume:

```text
ScenarioResultSet
ValidationDiagnostics
CalculationOutputs
```

禁止：

- recalculating taxes
- hidden inference engine
- AI-generated rule mutation

---

## Validation Checkpoints

所有 explanation 必須：

- deterministic
- traceable
- derivable from calculation outputs
- reproducible

---

# Phase 5 — Visualization Recovery

## Objective

建立透明化 analytical visualization layer。

---

## Recommended Visualizations

### Filing Comparison Matrix

顯示：

- tax owed
- deductions used
- dependency allocation
- effective tax rate

---

### Savings Waterfall

顯示：

- where savings originated
- marginal improvements
- deduction impact

---

### Household Financial Overview

顯示：

- person-level summaries
- aggregated categories
- deduction concentration

---

### Eligibility Diagnostics View

顯示：

- accepted/rejected dependency rules
- validation failures
- filing conflicts

---

## Visualization Constraints

Visualization layer：

只能讀取：

```text
Derived selectors
Scenario results
Explanation outputs
```

不得：

- mutate domain state
- execute tax logic
- maintain parallel aggregates

---

# TASK GRAPH

```text
Phase 1
 ├─ Household domain model
 ├─ Normalized state recovery
 ├─ Aggregation selectors
 ├─ Legacy adapter bridge
 └─ Output parity validation

Phase 2
 ├─ Workspace shell
 ├─ Panel decomposition
 ├─ Person editor migration
 ├─ Scenario panel introduction
 └─ Legacy form extraction

Phase 3
 ├─ Scenario generator
 ├─ Constraint validator
 ├─ Enumeration orchestration
 ├─ Ranking engine
 └─ Scenario reproducibility validation

Phase 4
 ├─ Explanation model
 ├─ Savings attribution
 ├─ Comparative reasoning
 └─ Diagnostics generation

Phase 5
 ├─ Comparison visualization
 ├─ Financial overview visualization
 ├─ Eligibility diagnostics UI
 └─ Transparency refinement
```

---

# MIGRATION STRATEGY

## Core Strategy

採用：

```text
Strangler-Fig Incremental Recovery
```

原則：

- preserve stable core
- progressively replace orchestration layers
- isolate migration boundaries
- maintain reversible evolution

---

## Compatibility Bridges

### Bridge A — Legacy Tax Input Adapter

```text
HouseholdModel
→ LegacyCalculationInput
```

---

### Bridge B — Legacy Form Coexistence

允許：

```text
Workspace UI
 +
Embedded Legacy Form
```

暫時共存。

---

### Bridge C — Derived Selector Layer

所有 aggregate values：

必須透過 selector derived。

避免 duplicated writable state。

---

# VALIDATION CHECKPOINTS

## Critical Regression Gates

### Gate 1 — Tax Output Parity

新舊系統輸出：

必須完全一致。

---

### Gate 2 — Deterministic Reproducibility

同輸入：

必須得到相同：

- scenario ordering
- tax output
- explanations
- rankings

---

### Gate 3 — Legal Constraint Integrity

所有 scenario：

必須符合：

- dependency legality
- filing constraints
- deduction constraints

---

### Gate 4 — State Integrity

禁止：

- duplicated writable totals
- hidden synchronization
- derived state mutation

---

# RISK ANALYSIS

## High Risk Areas

### Risk 1 — Hidden Calculation Duplication

風險：

UI layer 開始重新計算 deductions/totals。

Containment：

- selector-only derivation
- centralized calculation ownership

---

### Risk 2 — State Explosion

風險：

scenario state 與 UI state 混雜。

Containment：

- isolated orchestration state
- normalized entity structure
- immutable scenario snapshots

---

### Risk 3 — Engine Contract Drift

風險：

新 household model 直接侵入 calculation engine。

Containment：

- compatibility adapter layer
- engine isolation boundary

---

### Risk 4 — Premature Explainability Complexity

風險：

建立過度抽象 reasoning system。

Containment：

- explanation templates
- deterministic attribution rules
- output-derived reasoning only

---

# ROLLBACK STRATEGY

## Rollback Principle

所有 migration phase 必須：

- independently reversible
- feature-flag controlled
- adapter-isolated

---

## Recommended Rollback Controls

### Feature Flags

```text
ENABLE_WORKSPACE_UI
ENABLE_SCENARIO_ENUMERATION
ENABLE_EXPLANATION_LAYER
ENABLE_VISUALIZATION_LAYER
```

---

### Parallel Pipeline Preservation

暫時保留：

- legacy form pipeline
- legacy orchestration path
- old intake flow

直到 parity validation 通過。

---

# E