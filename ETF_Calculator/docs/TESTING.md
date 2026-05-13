# Testing

- Backend unit tests：`backend/tests/test_simulation_service.py`
- Frontend unit tests：`frontend/lib/finance/financial-engine.test.ts`
- Integration criteria：frontend API client payload must match backend simulation schema
- Debug mode：`debug=true` 顯示 FPS、render timing、simulation timing、worker status
- Failure recovery：simulation error 不得造成 blank screen、chart freeze、app crash
