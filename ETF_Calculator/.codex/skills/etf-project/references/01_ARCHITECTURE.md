# System Architecture

## Layers

UI Layer
↓
State Layer
↓
Simulation Layer
↓
Render Layer
↓
Storage Layer

---

## Modules

- app controller
- state manager
- simulation engine
- historical replay engine
- monte carlo engine
- chart renderer
- tooltip manager
- storage manager
- export manager
- worker manager

---

## Rules

禁止：

- spaghetti code
- UI 直接操作 simulation engine
- chart renderer 修改 state

---

## File Structure

/project

- index.html
- style.css
- script.js
- worker.js
- historicalData.js