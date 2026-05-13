# Financial Engine

## Investment Modes

- DCA
- Lump Sum
- Loan Investment

---

## Precision Math

禁止：

monthlyRate = annualReturn / 12

必須：

monthlyRate =
Math.pow(1 + annualReturn, 1 / 12) - 1;

---

## Portfolio Allocation

支援：

- 2 ~ 5 ETFs
- allocation percentage
- rebalancing

---

## Risk Metrics

需計算：

- Max Drawdown
- Volatility
- Sharpe Ratio
- Sortino Ratio
- Calmar Ratio

---

## Benchmark

支援：

- cash
- fixed deposit
- SP500