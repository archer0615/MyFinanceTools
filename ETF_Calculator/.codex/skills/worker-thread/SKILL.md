# Worker Thread Skill

## Goal

建立 Web Worker simulation architecture。

---

# Requirements

Worker 負責：

- Monte Carlo
- random generation
- percentile calculation

Main thread：

- render only

---

# Avoid

- blocking UI
- heavy main-thread compute

---

# Done Criteria

- UI 不 freeze
- worker 可 terminate
- simulation 正常