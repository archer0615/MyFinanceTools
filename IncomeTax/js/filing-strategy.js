(function () {
  function label(type) {
    return type === "joint" ? "夫妻合併申報" : "單獨申報";
  }

  function compareFilingStrategies(data, input) {
    const separate = window.IncomeTaxApp.engine.calculateTax(data, input, "separate");
    const joint = window.IncomeTaxApp.engine.calculateTax(data, input, "joint");
    const recommended = joint.taxAmount < separate.taxAmount ? "joint" : "separate";
    const activeType = input.filingMode === "auto" ? recommended : input.filingMode;
    const activeResult = activeType === "joint" ? joint : separate;
    const saving = Math.abs(separate.taxAmount - joint.taxAmount);
    const deductionAdvantage = activeResult.deductions.itemized - activeResult.deductions.standard;
    const analysis = [
      {
        title: "標準扣除與列舉扣除",
        body: (deductionAdvantage > 0 ? "列舉扣除額較有利，可多扣除：" : "標準扣除額較有利，可多扣除：") + window.IncomeTaxApp.utils.formatCurrency(Math.abs(deductionAdvantage))
      },
      {
        title: "合併申報與單獨申報",
        body: "建議使用：" + label(recommended) + "；可少繳：" + window.IncomeTaxApp.utils.formatCurrency(saving)
      },
      {
        title: "股利合併課稅與分離課稅",
        body: "本工具以綜合所得合併課稅估算，股利分離課稅需另依 28% 稅率與可抵減稅額比較。"
      },
      {
        title: "房貸利息與儲蓄扣除",
        body: activeResult.deductions.savings > 0 && activeResult.deductions.itemizedBreakdown.mortgageInterestPaid > 0
          ? "因已有儲蓄投資特別扣除額，房貸利息扣除額將減少。實際可扣金額：" + window.IncomeTaxApp.utils.formatCurrency(activeResult.deductions.mortgageInterest)
          : "房貸利息列舉扣除會先扣除儲蓄投資特別扣除額，再適用上限。"
      },
      {
        title: "最佳申報方式",
        body: label(recommended) + " + " + activeResult.deductions.mode + "；預估節省：" + window.IncomeTaxApp.utils.formatCurrency(saving)
      }
    ];

    const strategyComparison = window.IncomeTaxApp.engine.compareTaxStrategies(data, input);
    return {
      recommended: recommended,
      recommendedLabel: label(activeType),
      saving: saving,
      activeResult: activeResult,
      inputData: input,
      strategies: {
        separate: separate,
        joint: joint
      },
      analysis: analysis,
      strategyComparison: strategyComparison
    };
  }

  window.IncomeTaxApp.strategy = {
    compareFilingStrategies: compareFilingStrategies
  };
}());
