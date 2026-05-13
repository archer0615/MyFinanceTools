# 台灣綜所稅工具 - 利息所得 / 房貸利息 / 扣除額規則修正 SPEC

目前專案：

- 扣除額計算可能不完整
- 利息所得尚未完整支援
- 房貸利息扣除額規則可能錯誤
- 扣除額彼此依賴關係尚未處理

請直接修改現有專案。

不要重建。

維持：

- 純 HTML/CSS/JS
- GitHub Pages compatible
- file:// compatible
- 無 framework
- 無 npm

---

# 第一部分：利息所得

新增：

```text
利息所得
```

---

# UI

建立：

```text
銀行利息
郵局利息
定存利息
```

可合併為：

```text
利息所得
```

---

# tax-engine

新增：

```js
interestIncome
```

---

# 第二部分：儲蓄投資特別扣除額

建立：

```js
calculateSavingsDeduction()
```

規則：

```text
儲蓄投資特別扣除額
=
min(利息所得, 270000)
```

---

# deduction breakdown

結果頁顯示：

```text
儲蓄投資特別扣除額
```

---

# 第三部分：房貸利息扣除額修正

目前房貸利息邏輯不完整。

請修正。

---

# 正確名稱

```text
購屋借款利息列舉扣除額
```

---

# UI

新增：

```text
是否自用住宅
是否設戶籍
是否出租
房貸利息支出
```

---

# deduction-engine

建立：

```js
calculateMortgageDeduction()
```

---

# 規則

## 1. 必須自用住宅

若：

```text
出租
營業
投資
```

不可扣除。

---

# 2. 必須設戶籍

否則不可扣除。

---

# 3. 上限 300000

```js
Math.min(...)
```

---

# 4. 必須扣除儲蓄投資特別扣除額

正確公式：

```text
房貸利息扣除額
=
房貸利息
-
儲蓄投資特別扣除額
```

然後：

```text
上限 300000
```

---

# 範例

```text
利息所得：150000
房貸利息：280000
```

則：

```text
房貸可扣：
130000
```

不是：

```text
280000
```

---

# 第四部分：扣除額依賴規則

目前扣除額彼此獨立。

需建立：

```text
deduction dependency system
```

---

# 新增

```js
applyDeductionDependencies()
```

---

# 規則

## 房貸利息

依賴：

```text
儲蓄投資特別扣除額
```

---

# 房租 vs 房貸

建立：

```js
validateMutualExclusion()
```

避免：

同時不合理扣除。

---

# 第五部分：扣除額 validation

建立：

```text
validation-engine.js
```

新增：

---

# 1. 房貸 validation

若：

```text
非自用住宅
```

顯示：

```text
購屋借款利息需為自用住宅
```

---

# 2. 房租 validation

若：

```text
已有房貸
```

顯示：

```text
可能不可同時適用
```

---

# 3. 利息 validation

若：

```text
利息所得 > 270000
```

顯示：

```text
超過儲蓄投資特別扣除額上限
```

---

# 第六部分：結果頁升級

新增：

```text
利息所得
儲蓄投資特別扣除額
房貸利息扣除額
```

並顯示：

```text
實際可扣金額
```

---

# 第七部分：節稅分析

新增：

```text
因已有儲蓄投資特別扣除額，
房貸利息扣除額將減少。
```

---

# 第八部分：data schema

新增：

```json
{
  "deductions": {
    "savings": {
      "limit": 270000
    },

    "mortgageInterest": {
      "limit": 300000
    }
  }
}
```

---

# 第九部分：最終目標

修正：

- 利息所得
- 儲蓄投資特別扣除額
- 房貸利息列舉扣除額
- deduction dependency

使專案更接近：

```text
真實台灣綜所稅規則
```