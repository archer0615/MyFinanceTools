# State System

## Single Source of Truth

所有資料只能存在 central state。

禁止 duplicated state。

---

## State Lifecycle

input change
→ validate
→ normalize
→ update state
→ debounce
→ simulation
→ render
→ sync storage
→ sync URL

---

## Immutable State

state update 必須建立新 object。

禁止 mutable nested state。

---

## URL Sync

使用：

- URLSearchParams
- history.replaceState

---

## LocalStorage

保存：

- ETF 設定
- Monte Carlo 設定
- theme
- current tab