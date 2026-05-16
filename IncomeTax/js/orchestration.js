(function () {
  function filingLabel(type) {
    return type === "joint" ? "夫妻合併申報" : "單獨申報";
  }

  function dividendLabel(type) {
    return type === "separated" ? "股利分離課稅" : "股利合併課稅";
  }

  function enumerateScenarios(data, household) {
    const input = window.IncomeTaxApp.household.toTaxEngineInput(household);
    const separate = window.IncomeTaxApp.engine.calculateTax(data, input, "separate");
    const joint = window.IncomeTaxApp.engine.calculateTax(data, input, "joint");
    const dividendTax = Math.round(window.IncomeTaxApp.household.aggregate(household, { spouseIncluded: true }).dividendIncome * 0.28);
    return [
      Object.assign({}, separate, { key: "separate-merged", filingType: "separate", dividendMode: "merged" }),
      Object.assign({}, joint, { key: "joint-merged", filingType: "joint", dividendMode: "merged" }),
      Object.assign({}, separate, { key: "separate-dividend-separated", filingType: "separate", dividendMode: "separated", taxAmount: separate.taxAmount + dividendTax }),
      Object.assign({}, joint, { key: "joint-dividend-separated", filingType: "joint", dividendMode: "separated", taxAmount: joint.taxAmount + dividendTax })
    ];
  }

  function rankScenarios(scenarios) {
    return scenarios.slice().sort(function (a, b) {
      if (a.taxAmount !== b.taxAmount) {
        return a.taxAmount - b.taxAmount;
      }
      return a.key.localeCompare(b.key);
    });
  }

  function explain(best, separate, joint) {
    const saving = Math.abs(separate.taxAmount - joint.taxAmount);
    const deductionAdvantage = best.deductions.itemized - best.deductions.standard;
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
        body: "目前最佳情境：" + dividendLabel(best.dividendMode) + "。"
      },
      {
        title: "房貸利息與儲蓄扣除",
        body: best.deductions.savings > 0 && best.deductions.itemizedBreakdown.mortgageInterestPaid > 0
          ? "因已有儲蓄投資特別扣除額，房貸利息扣除額將減少。實際可扣金額：" + window.IncomeTaxApp.utils.formatCurrency(best.deductions.mortgageInterest)
          : "房貸利息列舉扣除會先扣除儲蓄投資特別扣除額，再適用上限。"
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
    const separate = scenarios.find(function (scenario) { return scenario.key === "separate-merged"; });
    const joint = scenarios.find(function (scenario) { return scenario.key === "joint-merged"; });
    const recommendedFiling = joint.taxAmount < separate.taxAmount ? "joint" : "separate";
    const activeType = taxInput.filingMode === "auto" ? recommendedFiling : taxInput.filingMode;
    const activeResult = scenarios.find(function (scenario) {
      return scenario.filingType === activeType && scenario.dividendMode === "merged";
    }) || ranked[0];

    return {
      household: household,
      recommended: recommendedFiling,
      recommendedLabel: filingLabel(activeType),
      saving: Math.abs(separate.taxAmount - joint.taxAmount),
      activeResult: activeResult,
      inputData: taxInput,
      strategies: {
        separate: separate,
        joint: joint
      },
      analysis: explain(activeResult, separate, joint),
      strategyComparison: {
        bestStrategy: ranked[0].key,
        savedTax: ranked[ranked.length - 1].taxAmount - ranked[0].taxAmount,
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
