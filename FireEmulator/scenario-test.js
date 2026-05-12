const fs = require("fs");
const vm = require("vm");

const source = fs.readFileSync("worker.js", "utf8");
const start = source.indexOf("function futureValue");
const end = source.indexOf("function fitCanvas");
const calculationCode = `${source.slice(start, end)}
this.futureValue = futureValue;
this.project = project;
this.findExtraMonthly = findExtraMonthly;`;

const sandbox = { Math, Number };
vm.createContext(sandbox);
vm.runInContext(calculationCode, sandbox);

const scenarios = [
  ["基準情境", { age: 35, targetRetireAge: 55, currentAssets: 3000000, monthlyInvest: 30000, annualReturn: 5, inflation: 2, monthlyExpense: 60000 }],
  ["高資產低支出", { age: 40, targetRetireAge: 50, currentAssets: 20000000, monthlyInvest: 20000, annualReturn: 4, inflation: 2, monthlyExpense: 50000 }],
  ["低資產高支出", { age: 30, targetRetireAge: 45, currentAssets: 500000, monthlyInvest: 10000, annualReturn: 4, inflation: 3, monthlyExpense: 90000 }],
  ["零支出", { age: 35, targetRetireAge: 50, currentAssets: 0, monthlyInvest: 0, annualReturn: 5, inflation: 2, monthlyExpense: 0 }],
  ["退休年齡小於目前年齡", { age: 60, targetRetireAge: 55, currentAssets: 5000000, monthlyInvest: 10000, annualReturn: 3, inflation: 2, monthlyExpense: 40000 }],
  ["負報酬壓力", { age: 50, targetRetireAge: 60, currentAssets: 10000000, monthlyInvest: 20000, annualReturn: -2, inflation: 3, monthlyExpense: 70000 }]
];

let failed = false;

for (const [name, input] of scenarios) {
  const result = sandbox.project(input);
  const extra = sandbox.findExtraMonthly(input);
  const passed = Number.isFinite(result.retirementAsset)
    && Number.isFinite(result.swr)
    && Number.isFinite(extra)
    && extra >= 0
    && result.retirementAge >= input.age;

  if (!passed) failed = true;

  console.log([
    passed ? "PASS" : "FAIL",
    name,
    `可退休=${result.retirementAge}歲`,
    `退休資產=${Math.round(result.retirementAsset).toLocaleString("zh-TW")}`,
    `耗盡=${result.depleteAge ? `${result.depleteAge}歲` : "未耗盡"}`,
    `SWR=${(result.swr * 100).toFixed(2)}%`,
    `建議增加=${Math.round(extra).toLocaleString("zh-TW")}/月`
  ].join(" | "));
}

process.exit(failed ? 1 : 0);
