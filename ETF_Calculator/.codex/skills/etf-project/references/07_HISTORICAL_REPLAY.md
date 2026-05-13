# Historical Replay

## Requirements

需支援：

- real historical replay
- regime simulation
- correlation matrix

---

## Historical Events

- dotcom bubble
- 2008 crisis
- COVID crash
- rate hike bear market

---

## Historical Data

使用：

- local JSON
- historicalData.js

禁止：

- API
- backend
- realtime fetch

---

## Data Format

const historicalData = {
  SP500: [
    { year: 2000, return: -0.09 }
  ]
};