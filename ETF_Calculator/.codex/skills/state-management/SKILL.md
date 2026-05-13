# State Management Skill

## Goal

建立 centralized state system。

---

# Rules

所有 UI：

只能從 central state 讀取。

禁止：

- duplicated state
- mutable nested state
- DOM as source of truth

---

# Lifecycle

input
→ validate
→ normalize
→ update state
→ render
→ sync

---

# Done Criteria

- state sync 正常
- 無 infinite loop
- render 不重複