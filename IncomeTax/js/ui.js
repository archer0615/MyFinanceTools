(function () {
  const relationOptions = [
    ["child", "子女"],
    ["parent", "父母"],
    ["grandparent", "祖父母"],
    ["sibling", "兄弟姊妹"],
    ["other", "其他親屬"]
  ];

  function renderVersion(data) {
    document.getElementById("versionInfo").textContent = "Tax Tool v1.2.0 / Schema v" + data.meta.schemaVersion + " / Data Year " + data.meta.year + " / 最後更新：" + data.meta.updatedAt;
    document.getElementById("sourceInfo").textContent = "資料來源：" + data.meta.source;
  }

  function renderYearData(data) {
    const deductions = data.deductions || {};
    const deductionRows = [
      ["免稅額", deductions.personalExemption],
      ["70 歲以上免稅額", deductions.seniorExemption],
      ["標準扣除額（單身）", deductions.standardSingle],
      ["標準扣除額（夫妻）", deductions.standardMarried],
      ["薪資所得特別扣除額", deductions.salary],
      ["身心障礙特別扣除額", deductions.disability],
      ["教育學費特別扣除額", deductions.education],
      ["儲蓄投資特別扣除額上限", deductions.savings && deductions.savings.limit],
      ["每人基本生活所需費用", deductions.basicLivingExpense && deductions.basicLivingExpense.perPerson],
      ["購屋借款利息列舉扣除額上限", deductions.mortgageInterest && deductions.mortgageInterest.limit],
      ["房租支出特別扣除額", deductions.rent],
      ["幼兒學前特別扣除額", deductions.preschool],
      ["長期照顧特別扣除額", deductions.longTermCare]
    ];
    document.getElementById("yearDeductionData").innerHTML = deductionRows.map(function (row) {
      return escapeHtml(row[0]) + "：" + window.IncomeTaxApp.utils.formatCurrency(row[1] || 0);
    }).join("<br>");
    document.getElementById("yearBracketData").innerHTML = data.taxBrackets.map(function (bracket) {
      const max = bracket.max === null ? "以上" : window.IncomeTaxApp.utils.formatCurrency(bracket.max);
      return window.IncomeTaxApp.utils.formatCurrency(bracket.min) + " - " + max
        + "：" + window.IncomeTaxApp.utils.formatPercent(bracket.rate)
        + "，累進差額 " + window.IncomeTaxApp.utils.formatCurrency(bracket.quickDeduction);
    }).join("<br>");
  }

  function numberFromForm(formData, name) {
    return window.IncomeTaxApp.engine.toNumber(formData.get(name));
  }

  function boolFromForm(formData, name) {
    return formData.get(name) === "on";
  }

  function getInput(form) {
    const formData = new FormData(form);
    return {
      filingMode: formData.get("filingMode") || "auto",
      taxpayer: {
        salaryIncome: numberFromForm(formData, "salaryIncome"),
        professionalIncome: numberFromForm(formData, "professionalIncome"),
        dividendIncome: numberFromForm(formData, "dividendIncome"),
        interestIncome: numberFromForm(formData, "interestIncome"),
        otherIncome: numberFromForm(formData, "otherIncome")
      },
      spouse: {
        salaryIncome: numberFromForm(formData, "spouseSalaryIncome"),
        professionalIncome: numberFromForm(formData, "spouseProfessionalIncome"),
        dividendIncome: numberFromForm(formData, "spouseDividendIncome"),
        interestIncome: numberFromForm(formData, "spouseInterestIncome"),
        otherIncome: numberFromForm(formData, "spouseOtherIncome")
      },
      dependents: window.IncomeTaxApp.state.dependents,
      deductions: {
        insuranceSelf: numberFromForm(formData, "insuranceSelf"),
        insuranceSpouse: numberFromForm(formData, "insuranceSpouse"),
        insuranceDependents: numberFromForm(formData, "insuranceDependents"),
        nationalHealthInsurance: numberFromForm(formData, "nationalHealthInsurance"),
        medical: numberFromForm(formData, "medical"),
        childbirth: numberFromForm(formData, "childbirth"),
        donationGeneral: numberFromForm(formData, "donationGeneral"),
        donationPolitical: numberFromForm(formData, "donationPolitical"),
        donationPublic: numberFromForm(formData, "donationPublic"),
        disasterLoss: numberFromForm(formData, "disasterLoss"),
        isSelfUseResidence: boolFromForm(formData, "isSelfUseResidence"),
        hasHouseholdRegistration: boolFromForm(formData, "hasHouseholdRegistration"),
        isRented: boolFromForm(formData, "isRented"),
        mortgageInterest: numberFromForm(formData, "mortgageInterest"),
        rent: numberFromForm(formData, "rent"),
        longTermCareCount: numberFromForm(formData, "longTermCareCount"),
        preschoolChildren: numberFromForm(formData, "preschoolChildren"),
        educationCount: numberFromForm(formData, "educationCount")
      }
    };
  }

  function setFormValues(form, state) {
    const values = Object.assign({}, state.taxpayer, state.deductions, {
      filingMode: state.filingMode,
      spouseSalaryIncome: state.spouse.salaryIncome,
      spouseProfessionalIncome: state.spouse.professionalIncome,
      spouseDividendIncome: state.spouse.dividendIncome,
      spouseInterestIncome: state.spouse.interestIncome,
      spouseOtherIncome: state.spouse.otherIncome
    });
    Object.keys(values).forEach(function (key) {
      if (form.elements[key] !== undefined) {
        if (form.elements[key].type === "checkbox") {
          form.elements[key].checked = values[key] === true || values[key] === "true";
        } else {
          form.elements[key].value = values[key];
        }
      }
    });
  }

  function renderDependents(dependents) {
    const list = document.getElementById("dependentsList");
    list.innerHTML = "";
    dependents.forEach(function (dependent, index) {
      const card = document.createElement("div");
      card.className = "dependent-card";
      card.innerHTML = [
        "<label>姓名<input data-field=\"name\" value=\"" + escapeHtml(dependent.name || "") + "\"></label>",
        "<label>出生年<input data-field=\"birthYear\" type=\"number\" min=\"1900\" max=\"2100\" value=\"" + escapeHtml(dependent.birthYear || "") + "\"></label>",
        "<label>身份類型<select data-field=\"relation\">" + relationOptions.map(function (option) {
          return "<option value=\"" + option[0] + "\"" + (dependent.relation === option[0] ? " selected" : "") + ">" + option[1] + "</option>";
        }).join("") + "</select></label>",
        "<label class=\"check\"><input data-field=\"isSenior\" type=\"checkbox\"" + (dependent.isSenior ? " checked" : "") + ">是否滿 70 歲</label>",
        "<label class=\"check\"><input data-field=\"disabled\" type=\"checkbox\"" + (dependent.disabled ? " checked" : "") + ">是否身心障礙</label>",
        "<label class=\"check\"><input data-field=\"sameHousehold\" type=\"checkbox\"" + (dependent.sameHousehold ? " checked" : "") + ">是否同戶籍</label>",
        "<button class=\"secondary-button remove-dependent\" type=\"button\" data-index=\"" + index + "\">刪除</button>"
      ].join("");
      list.appendChild(card);
    });
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" }[char];
    });
  }

  function renderResult(result) {
    const active = result.activeResult;
    document.getElementById("bestStrategy").textContent = result.recommendedLabel;
    document.getElementById("grossIncome").textContent = window.IncomeTaxApp.utils.formatCurrency(active.grossIncome);
    document.getElementById("totalDeductions").textContent = window.IncomeTaxApp.utils.formatCurrency(active.totalDeductions);
    document.getElementById("taxableIncome").textContent = window.IncomeTaxApp.utils.formatCurrency(active.taxableIncome);
    document.getElementById("taxAmount").textContent = window.IncomeTaxApp.utils.formatCurrency(active.taxAmount);
    document.getElementById("effectiveRate").textContent = window.IncomeTaxApp.utils.formatPercent(active.effectiveRate);
    document.getElementById("marginalRate").textContent = window.IncomeTaxApp.utils.formatPercent(active.marginalRate);
    document.getElementById("deductionBreakdown").innerHTML = [
      "利息所得：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.interestIncome),
      "免稅額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.exemption),
      "標準扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.standard),
      "列舉扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.itemized),
      "基本生活費總額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.basicLiving.total),
      "基本生活費差額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.basicLivingDifference),
      "薪資扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.salary),
      "儲蓄投資特別扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.savings),
      "房貸利息扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.mortgageInterest),
      "房租扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.rent),
      "教育扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.education),
      "長照扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.longTermCare),
      "扣除方式：" + active.deductions.mode
    ].join("<br>");
    document.getElementById("dependentSummary").innerHTML = [
      "扶養人數：" + active.deductions.dependent.count,
      "老人扶養：" + active.deductions.dependent.seniorCount,
      "身障扶養：" + active.deductions.dependent.disabledCount
    ].join("<br>");
    const validation = window.IncomeTaxApp.validation ? window.IncomeTaxApp.validation.validate(result.inputData || {}, active) : [];
    document.getElementById("validationMessages").innerHTML = validation.length
      ? validation.map(function (message) { return "<div>" + escapeHtml(message) + "</div>"; }).join("")
      : "無";
    document.getElementById("taxSavingAnalysis").innerHTML = window.IncomeTaxApp.utils.analysis(result.analysis);
    if (window.IncomeTaxApp.charts) {
      window.IncomeTaxApp.charts.render(result);
    }
  }

  function setError(visible) {
    document.getElementById("errorMessage").hidden = !visible;
  }

  window.IncomeTaxApp.ui = {
    getInput: getInput,
    setFormValues: setFormValues,
    renderDependents: renderDependents,
    renderVersion: renderVersion,
    renderYearData: renderYearData,
    renderResult: renderResult,
    setError: setError
  };
}());
