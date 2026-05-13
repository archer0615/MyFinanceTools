# ETF 投資模擬器架構

- UI Layer：`frontend/index.html`、`frontend/style.css`
- State Layer：`frontend/script.js` central state
- Simulation Layer：financial engine、historical replay、monte carlo worker
- Render Layer：canvas renderer、tooltip、crosshair
- Storage Layer：URLSearchParams、localStorage

## Repository Pattern

- `createRepository(storageKey)` 封裝 `localStorage`
- UI 不直接存取 storage
- State update 後由 repository persist

## Service Layer

- `createServiceLayer(stateManager)` 封裝 state mutation
- UI 只能呼叫 service
- simulation engine 回傳 pure result

## Backend Boundary

Reference `02_CODING_RULES.md` 禁止 backend 與 API，因此 `backend/` 僅保留架構邊界文件，不啟動服務。
