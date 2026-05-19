(function () {
  function filingLabel(type) {
    return type === "joint" ? "夫妻合併申報" : "單獨申報";
  }

  function dividendLabel(type) {
    return type === "separate" ? "分離課稅" : "合併計稅";
  }

  function enumerateScenarios(data, household) {
    const input = window.IncomeTaxApp.household.toTaxEngineInput(household);
    const scenarios = [
      Object.assign({}, window.IncomeTaxApp.engine.calculateTax(data, input, "separate", "combined"), { key: "separate-combined", filingType: "separate", dividendMode: "combined" }),
      Object.assign({}, window.IncomeTaxApp.engine.calculateTax(data, input, "joint", "combined"), { key: "joint-combined", filingType: "joint", dividendMode: "combined" }),
      Object.assign({}, window.IncomeTaxApp.engine.calculateTax(data, input, "separate", "separate"), { key: "separate-dividend-separate", filingType: "separate", dividendMode: "separate" }),
      Object.assign({}, window.IncomeTaxApp.engine.calculateTax(data, input, "joint", "separate"), { key: "joint-dividend-separate", filingType: "joint", dividendMode: "separate" })
    ];
    if (input.dividendTaxMode === "combined" || input.dividendTaxMode === "separate") {
      return scenarios.filter(function (scenario) { return scenario.dividendMode === input.dividendTaxMode; });
    }
    return scenarios;
  }

  function rankScenarios(scenarios) {
    return scenarios.slice().sort(function (a, b) {
      if (a.finalTax !== b.finalTax) {
        return a.finalTax - b.finalTax;
      }
      return a.key.localeCompare(b.key);
    });
  }

  function explain(best, separate, joint) {
    const saving = Math.abs(separate.taxAmount - joint.taxAmount);
    const deductionAdvantage = best.deductions.itemized - best.deductions.standard;
    const mortgageExpense = window.IncomeTaxApp.engine.toNumber(best.deductions.mortgageInterestExpense || best.deductions.itemizedBreakdown.mortgageInterestExpense);
    const mortgageDeduction = window.IncomeTaxApp.engine.toNumber(best.deductions.mortgageInterest);
    const savingsDeduction = window.IncomeTaxApp.engine.toNumber(best.deductions.savings);
    const mortgageAnalysisBody = savingsDeduction > 0 && mortgageExpense > 0
      ? "因已有儲蓄投資特別扣除額，房貸利息扣除額將減少。實際可扣金額：" + window.IncomeTaxApp.utils.formatCurrency(mortgageDeduction)
      : "房貸利息列舉扣除會先扣除儲蓄投資特別扣除額，再適用上限。";
    const dividendMode = best.selectedDividendTaxMode || best.dividendMode;
    const dividendBody = dividendMode === "separate"
      ? "分離課稅較有利，已採用 28% 單一稅率。"
      : "合併計稅較有利，已套用股利抵減稅額。";
    return [
      {
        title: "標準扣除與列舉扣除",
        body: (deductionAdvantage > 0 ? "列舉扣除額較有利，可多扣除：" : "標準扣除額較有利，可多扣除：") + window.IncomeTaxApp.utils.formatCurrency(Math.abs(deductionAdvantage))
      },
      {
        title: "合併申報與單獨申報",
        body: "建議使用：" + filingLabel(joint.taxAmount < separate.taxAmount ? "joint" : "separate") + "；可少繳：" + window.IncomeTaxApp.utils.formatCurrency(saving)
      },
      {
        title: "股利課稅方式",
        body: best.dividendIncome > 0 ? dividendBody : "無股利所得，不影響本次試算。"
      },
      {
        title: "股利退稅判斷",
        body: best.refundAmount > 0 ? "因股利可抵減稅額，本年度可能產生退稅。" : "目前無股利抵減造成的退稅。"
      },
      {
        title: "房貸利息與儲蓄扣除",
        body: mortgageDeduction === 0 && savingsDeduction > 0 && mortgageExpense > 0
          ? "儲蓄投資特別扣除額已抵減房貸利息扣除空間。"
          : mortgageAnalysisBody
      },
      {
        title: "最佳申報方式",
        body: filingLabel(best.filingType) + " + " + best.deductions.mode + "；預估節省：" + window.IncomeTaxApp.utils.formatCurrency(saving)
      }
    ];
  }

  function evaluate(data, input) {
    const household = window.IncomeTaxApp.household.create(input);
    const taxInput = window.IncomeTaxApp.household.toTaxEngineInput(household);
    const scenarios = enumerateScenarios(data, household);
    const ranked = rankScenarios(scenarios);
    const separate = rankScenarios(scenarios.filter(function (scenario) { return scenario.filingType === "separate"; }))[0];
    const joint = rankScenarios(scenarios.filter(function (scenario) { return scenario.filingType === "joint"; }))[0];
    const recommendedFiling = joint.finalTax < separate.finalTax ? "joint" : "separate";
    const activeType = taxInput.filingMode === "auto" ? recommendedFiling : taxInput.filingMode;
    const activeResult = rankScenarios(scenarios.filter(function (scenario) { return scenario.filingType === activeType; }))[0] || ranked[0];

    return {
      household: household,
      recommended: recommendedFiling,
      recommendedLabel: filingLabel(activeType),
      saving: Math.abs(separate.finalTax - joint.finalTax),
      activeResult: activeResult,
      inputData: taxInput,
      strategies: {
        separate: separate,
        joint: joint
      },
      analysis: explain(activeResult, separate, joint),
      strategyComparison: {
        bestStrategy: ranked[0].key,
        savedTax: ranked[ranked.length - 1].finalTax - ranked[0].finalTax,
        scenarios: ranked
      },
      diagnostics: window.IncomeTaxApp.validation ? window.IncomeTaxApp.validation.validate(taxInput, activeResult) : [],
      visualization: {
        scenarioCount: ranked.length,
        bestScenario: ranked[0].key
      }
    };
  }

  window.IncomeTaxApp.orchestration = {
    enumerateScenarios: enumerateScenarios,
    rankScenarios: rankScenarios,
    evaluate: evaluate
  };
}());
