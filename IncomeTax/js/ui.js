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

  function numberFromForm(formData, name) {
    return window.IncomeTaxApp.engine.toNumber(formData.get(name));
  }

  function getInput(form) {
    const formData = new FormData(form);
    return {
      filingMode: formData.get("filingMode") || "auto",
      taxpayer: {
        salaryIncome: numberFromForm(formData, "salaryIncome"),
        professionalIncome: numberFromForm(formData, "professionalIncome"),
        dividendIncome: numberFromForm(formData, "dividendIncome"),
        otherIncome: numberFromForm(formData, "otherIncome")
      },
      spouse: {
        salaryIncome: numberFromForm(formData, "spouseSalaryIncome"),
        professionalIncome: numberFromForm(formData, "spouseProfessionalIncome"),
        dividendIncome: numberFromForm(formData, "spouseDividendIncome"),
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
      spouseOtherIncome: state.spouse.otherIncome
    });
    Object.keys(values).forEach(function (key) {
      if (form.elements[key] !== undefined) {
        form.elements[key].value = values[key];
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
      "免稅額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.exemption),
      "標準扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.standard),
      "列舉扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.itemized),
      "薪資扣除額：" + window.IncomeTaxApp.utils.formatCurrency(active.deductions.salary),
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
    renderResult: renderResult,
    setError: setError
  };
}());
