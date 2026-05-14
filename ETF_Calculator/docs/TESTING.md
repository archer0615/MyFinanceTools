# Testing

- Unit tests：`npm test`
- Browser smoke：`npm run test:browser`
- Core coverage：compound growth, risk metrics, Monte Carlo batching, historical replay
- State coverage：legacy migration, canonical derived dataset update
- URL coverage：load and save round-trip fields
- Export coverage：PNG download link generation
- Error recovery：worker failure writes `ui.error`
- Browser smoke coverage：file:// render, canvas size, historical replay UI, Monte Carlo completion, console errors
- Offline criteria：file:// works, no CDN, no fetch(), no backend, no console errors
