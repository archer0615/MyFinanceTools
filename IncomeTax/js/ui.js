(function () {
  let combinationPage = 0;
  const combinationPageSize = 24;
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
    document.getElementById("yearBracketData").innerHTML = [
      "<div class=\"table-scroll\"><table class=\"tax-bracket-table\">",
      "<thead><tr><th>級距</th><th>所得淨額範圍</th><th>稅率</th><th>累進差額</th></tr></thead>",
      "<tbody>",
      data.taxBrackets.map(function (bracket, index) {
        const max = bracket.max === null ? "以上" : window.IncomeTaxApp.utils.formatCurrency(bracket.max);
        return "<tr>"
          + "<td>" + (index + 1) + "</td>"
          + "<td>" + window.IncomeTaxApp.utils.formatCurrency(bracket.min) + " - " + max + "</td>"
          + "<td>" + window.IncomeTaxApp.utils.formatPercent(bracket.rate) + "</td>"
          + "<td>" + window.IncomeTaxApp.utils.formatCurrency(bracket.quickDeduction) + "</td>"
          + "</tr>";
      }).join(""),
      "</tbody></table></div>"
    ].join("");
  }

  function toggleYearData() {
    const button = document.getElementById("yearDataToggle");
    const content = document.getElementById("yearDataContent");
    if (!button || !content) {
      return;
    }
    const nextHiddenState = !content.hidden;
    content.hidden = nextHiddenState;
    syncYearDataToggle();
  }

  function syncYearDataToggle() {
    const button = document.getElementById("yearDataToggle");
    const content = document.getElementById("yearDataContent");
    if (!button || !content) {
      return;
    }
    const expanded = !content.hidden;
    button.setAttribute("aria-expanded", String(expanded));
    const label = button.querySelector("span:first-child");
    if (label) {
      label.textContent = expanded ? "收合年度資料" : "年度資料";
    } else {
      button.textContent = expanded ? "收合" : "展開";
    }
  }

  function numberFromForm(formData, name) {
    return window.IncomeTaxApp.engine.toNumber(formData.get(name));
  }

  function boolFromForm(formData, name) {
    return formData.get(name) === "on";
  }

  function money(value) {
    return window.IncomeTaxApp.utils.formatCurrency(window.IncomeTaxApp.engine.toNumber(value));
  }

  function personDeductionsFromForm(formData, prefix) {
    return {
      insurance: numberFromForm(formData, prefix + "Insurance"),
      nationalHealthInsurance: numberFromForm(formData, prefix + "NationalHealthInsurance"),
      medical: numberFromForm(formData, prefix + "Medical"),
      childbirth: numberFromForm(formData, prefix + "Childbirth"),
      donationGeneral: numberFromForm(formData, prefix + "DonationGeneral"),
      donationPolitical: numberFromForm(formData, prefix + "DonationPolitical"),
      donationPublic: numberFromForm(formData, prefix + "DonationPublic"),
      disasterLoss: numberFromForm(formData, prefix + "DisasterLoss")
    };
  }

  function getInput(form) {
    const formData = new FormData(form);
    return {
      filingMode: formData.get("filingMode") || "auto",
      dividendTaxMode: formData.get("dividendTaxMode") || "auto",
      disclosureMode: formData.get("disclosureMode") || "beginner",
      forecast: {
        forecastMode: boolFromForm(formData, "forecastMode"),
        forecastYear: numberFromForm(formData, "forecastYear"),
        salaryGrowthRate: numberFromForm(formData, "salaryGrowthRate"),
        dividendGrowthRate: numberFromForm(formData, "dividendGrowthRate"),
        interestGrowthRate: numberFromForm(formData, "interestGrowthRate"),
        inflationRate: numberFromForm(formData, "inflationRate")
      },
      householdMembers: window.IncomeTaxApp.state.householdMembers || [],
      scenarioOverrides: {
        salaryChange: numberFromForm(formData, "scenarioSalaryChange") + numberFromForm(formData, "scenarioSalarySlider"),
        dividendChange: numberFromForm(formData, "scenarioDividendChange") + numberFromForm(formData, "scenarioDividendSlider"),
        interestChange: numberFromForm(formData, "scenarioInterestChange") + numberFromForm(formData, "scenarioInterestSlider"),
        mortgageInterestChange: numberFromForm(formData, "scenarioMortgageInterestChange") + numberFromForm(formData, "scenarioMortgageSlider")
      },
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
        taxpayer: personDeductionsFromForm(formData, "taxpayer"),
        spouse: personDeductionsFromForm(formData, "spouse"),
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
        isOwnerOccupied: boolFromForm(formData, "isSelfUseResidence"),
        hasHouseholdRegistration: boolFromForm(formData, "hasHouseholdRegistration"),
        isRegisteredResidence: boolFromForm(formData, "hasHouseholdRegistration"),
        isRented: boolFromForm(formData, "isRented"),
        isRentalProperty: boolFromForm(formData, "isRented"),
        mortgageInterest: numberFromForm(formData, "mortgageInterest"),
        mortgageInterestExpense: numberFromForm(formData, "mortgageInterest"),
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
      dividendTaxMode: state.dividendTaxMode || "auto",
      disclosureMode: state.disclosureMode || "beginner",
      forecastMode: state.forecast && state.forecast.forecastMode,
      forecastYear: state.forecast && state.forecast.forecastYear,
      salaryGrowthRate: state.forecast && state.forecast.salaryGrowthRate,
      dividendGrowthRate: state.forecast && state.forecast.dividendGrowthRate,
      interestGrowthRate: state.forecast && state.forecast.interestGrowthRate,
      inflationRate: state.forecast && state.forecast.inflationRate,
      scenarioSalaryChange: state.scenarioOverrides && state.scenarioOverrides.salaryChange,
      scenarioDividendChange: state.scenarioOverrides && state.scenarioOverrides.dividendChange,
      scenarioInterestChange: state.scenarioOverrides && state.scenarioOverrides.interestChange,
      scenarioMortgageInterestChange: state.scenarioOverrides && state.scenarioOverrides.mortgageInterestChange,
      scenarioSalarySlider: state.scenarioOverrides && state.scenarioOverrides.salarySlider,
      scenarioDividendSlider: state.scenarioOverrides && state.scenarioOverrides.dividendSlider,
      scenarioInterestSlider: state.scenarioOverrides && state.scenarioOverrides.interestSlider,
      scenarioMortgageSlider: state.scenarioOverrides && state.scenarioOverrides.mortgageSlider,
      spouseSalaryIncome: state.spouse.salaryIncome,
      spouseProfessionalIncome: state.spouse.professionalIncome,
      spouseDividendIncome: state.spouse.dividendIncome,
      spouseInterestIncome: state.spouse.interestIncome,
      spouseOtherIncome: state.spouse.otherIncome
    });
    if (state.deductions && state.deductions.taxpayer) {
      Object.assign(values, {
        taxpayerInsurance: state.deductions.taxpayer.insurance,
        taxpayerNationalHealthInsurance: state.deductions.taxpayer.nationalHealthInsurance,
        taxpayerMedical: state.deductions.taxpayer.medical,
        taxpayerChildbirth: state.deductions.taxpayer.childbirth,
        taxpayerDonationGeneral: state.deductions.taxpayer.donationGeneral,
        taxpayerDonationPolitical: state.deductions.taxpayer.donationPolitical,
        taxpayerDonationPublic: state.deductions.taxpayer.donationPublic,
        taxpayerDisasterLoss: state.deductions.taxpayer.disasterLoss
      });
    }
    if (state.deductions && state.deductions.spouse) {
      Object.assign(values, {
        spouseInsurance: state.deductions.spouse.insurance,
        spouseNationalHealthInsurance: state.deductions.spouse.nationalHealthInsurance,
        spouseMedical: state.deductions.spouse.medical,
        spouseChildbirth: state.deductions.spouse.childbirth,
        spouseDonationGeneral: state.deductions.spouse.donationGeneral,
        spouseDonationPolitical: state.deductions.spouse.donationPolitical,
        spouseDonationPublic: state.deductions.spouse.donationPublic,
        spouseDisasterLoss: state.deductions.spouse.disasterLoss
      });
    }
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
        "<label>薪資所得<input data-field=\"salaryIncome\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.salaryIncome || 0) + "\"></label>",
        "<label>執行業務所得<input data-field=\"professionalIncome\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.professionalIncome || 0) + "\"></label>",
        "<label>股利所得<input data-field=\"dividendIncome\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.dividendIncome || 0) + "\"></label>",
        "<label>利息所得<input data-field=\"interestIncome\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.interestIncome || 0) + "\"></label>",
        "<label>其他所得<input data-field=\"otherIncome\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.otherIncome || 0) + "\"></label>",
        "<label>保險費<input data-field=\"insurance\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.insurance || 0) + "\"></label>",
        "<label>全民健保費<input data-field=\"nationalHealthInsurance\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.nationalHealthInsurance || 0) + "\"></label>",
        "<label>醫療費<input data-field=\"medical\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.medical || 0) + "\"></label>",
        "<label>生育費<input data-field=\"childbirth\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.childbirth || 0) + "\"></label>",
        "<label>一般捐贈<input data-field=\"donationGeneral\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.donationGeneral || 0) + "\"></label>",
        "<label>政治獻金<input data-field=\"donationPolitical\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.donationPolitical || 0) + "\"></label>",
        "<label>公益團體捐贈<input data-field=\"donationPublic\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.donationPublic || 0) + "\"></label>",
        "<label>災害損失金額<input data-field=\"disasterLoss\" type=\"number\" min=\"0\" step=\"1\" value=\"" + escapeHtml(dependent.disasterLoss || 0) + "\"></label>",
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
    const vm = result.viewModel || window.IncomeTaxApp.planning.buildResultViewModel(result, result.planning);
    document.getElementById("bestStrategy").textContent = vm.summary.bestStrategy;
    document.getElementById("grossIncome").textContent = money(vm.summary.grossIncome);
    document.getElementById("totalDeductions").textContent = money(vm.summary.totalDeductions);
    document.getElementById("taxableIncome").textContent = money(vm.summary.taxableIncome);
    document.getElementById("taxAmount").textContent = vm.summary.finalTaxState === "refund" ? "退稅 " + money(vm.summary.refundAmount) : money(vm.summary.payableTax);
    document.getElementById("savingAmount").textContent = money(result.saving);
    document.getElementById("effectiveRate").textContent = window.IncomeTaxApp.utils.formatPercent(vm.summary.effectiveRate);
    document.getElementById("marginalRate").textContent = window.IncomeTaxApp.utils.formatPercent(vm.summary.marginalRate);
    document.getElementById("deductionBreakdown").innerHTML = [
      "<section class=\"breakdown-group\"><h4>所得</h4><p>利息所得：<strong>" + money(active.deductions.interestIncome) + "</strong></p></section>",
      "<section class=\"breakdown-group\"><h4>扣除額</h4><p>免稅額：<strong>" + money(active.deductions.exemption) + "</strong></p><p>標準扣除額：<strong>" + money(active.deductions.standard) + "</strong></p><p>列舉扣除額：<strong>" + money(active.deductions.itemized) + "</strong></p><p>基本生活費差額：<strong>" + money(active.deductions.basicLivingDifference) + "</strong></p></section>",
      "<section class=\"breakdown-group\"><h4>股利課稅</h4><p>股利所得：<strong>" + money(active.dividendIncome) + "</strong></p><p>股利課稅方式：<strong>" + escapeHtml(active.selectedDividendTaxMode === "separate" ? "分離課稅（較有利）" : "合併計稅（較有利）") + "</strong></p><p>股利可抵減稅額：<strong>" + money(active.dividendTaxCredit) + "</strong></p><p>分離課稅稅額：<strong>" + money(active.separateDividendTax) + "</strong></p><p>應補稅：<strong>" + money(active.payableTax) + "</strong></p><p>退稅金額：<strong>" + money(active.refundAmount) + "</strong></p></section>",
      "<section class=\"breakdown-group\"><h4>有效節稅</h4><p>儲蓄投資特別扣除額：<strong>" + money(active.deductions.savings) + "</strong></p><p>房貸利息支出：<strong>" + money(active.deductions.mortgageInterestExpense || active.deductions.itemizedBreakdown.mortgageInterestExpense) + "</strong></p><p>房貸利息實際可扣：<strong>" + money(active.deductions.mortgageInterest) + "</strong></p><p>房租扣除額：<strong>" + money(active.deductions.rent) + "</strong></p></section>",
      "<section class=\"breakdown-group\"><h4>其他扣除</h4><p>薪資扣除額：<strong>" + money(active.deductions.salary) + "</strong></p><p>教育扣除額：<strong>" + money(active.deductions.education) + "</strong></p><p>長照扣除額：<strong>" + money(active.deductions.longTermCare) + "</strong></p><p>扣除方式：<strong>" + escapeHtml(active.deductions.mode) + "</strong></p></section>"
    ].join("");
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
    renderPlanning(result.planning, vm);
    document.body.dataset.mode = window.IncomeTaxApp.planning.toggleExperienceMode(result.inputData && result.inputData.disclosureMode);
    if (window.IncomeTaxApp.charts) {
      window.IncomeTaxApp.charts.render(result);
    }
  }

  function renderPlanning(planning, viewModel) {
    if (!planning) {
      return;
    }
    const vm = viewModel || {};
    const forecast = planning.forecastResult || {};
    document.getElementById("forecastSummary").innerHTML = [
      "試算年度：" + escapeHtml(planning.forecastYear),
      "資料來源：" + escapeHtml(forecast.meta && forecast.meta.forecastSourceType === "official" ? "已載入年度資料" : "沿用最新正式年度資料快照"),
      "快照年度：" + escapeHtml(forecast.meta && forecast.meta.forecastSourceYear ? forecast.meta.forecastSourceYear : planning.forecastYear),
      "應納稅額：" + money(forecast.payableTax),
      "退稅：" + money(forecast.refundAmount),
      "稅率級距：" + escapeHtml(forecast.bracket ? Math.round(forecast.bracket.rate * 100) + "%" : "-")
    ].join("<br>");
    document.getElementById("householdMemberSummary").innerHTML = planning.members.map(function (member) {
      const income = member.income || {};
      const totalIncome = window.IncomeTaxApp.engine.toNumber(income.salaryIncome)
        + window.IncomeTaxApp.engine.toNumber(income.professionalIncome)
        + window.IncomeTaxApp.engine.toNumber(income.dividendIncome)
        + window.IncomeTaxApp.engine.toNumber(income.interestIncome)
        + window.IncomeTaxApp.engine.toNumber(income.otherIncome);
      return escapeHtml(member.name + " / " + member.relationship + " / 所得 " + window.IncomeTaxApp.utils.formatCurrency(totalIncome));
    }).join("<br>");
    document.getElementById("forecastDashboard").innerHTML = [
      "今年稅負：" + money(planning.dashboard.currentPayableTax),
      "明年預估：" + money(planning.dashboard.nextYearPayableTax),
      "五年平均稅負：" + money(planning.dashboard.averagePayableTax),
      "最高稅率年度：" + escapeHtml(planning.dashboard.highestRateYear || "-"),
      "最佳節稅年度：" + escapeHtml(planning.dashboard.bestSavingYear || "-")
    ].join("<br>");
    renderScenarioRealtimeSummary(planning.scenarioResult);
    const maxTax = Math.max.apply(null, planning.multiYearResults.map(function (row) { return window.IncomeTaxApp.engine.toNumber(row.payableTax); }).concat([1]));
    document.getElementById("multiYearTrend").innerHTML = planning.multiYearResults.map(function (row) {
      const width = Math.max(4, Math.round(window.IncomeTaxApp.engine.toNumber(row.payableTax) / maxTax * 100));
      return "<div class=\"trend-row\"><span>" + escapeHtml(row.year) + "</span><div><i style=\"width:" + width + "%\"></i></div><strong>" + money(row.payableTax) + "</strong></div>";
    }).join("");
    renderTimelineForecast(planning.timelineForecast || []);
    renderStrategyWorkspace(planning.strategyWorkspace, document.getElementById("strategySortMode") ? document.getElementById("strategySortMode").value : "minTax");
    document.getElementById("combinationRecommendation").innerHTML = window.IncomeTaxApp.utils.analysis(planning.recommendation.map(function (body) {
      return { title: "最佳申報建議", body: body };
    }));
    renderRecommendationInsights(planning.recommendationReasons || []);
    renderRecommendationIntelligence(vm.recommendation ? vm.recommendation.intelligence : planning.combinations || []);
    const deltaBase = planning.deltaBase || {};
    const deltaCompare = planning.deltaCompare || {};
    document.getElementById("deltaComparison").innerHTML = [
      "<div class=\"table-scroll\"><table class=\"tax-bracket-table\">",
      "<thead><tr><th>項目</th><th>原方案</th><th>新方案</th><th>差異</th></tr></thead>",
      "<tbody>",
      "<tr><td>應補稅</td><td>" + money(deltaBase.payableTax) + "</td><td>" + money(deltaCompare.payableTax) + "</td><td>" + money(planning.delta.payableTaxDelta) + "</td></tr>",
      "<tr><td>退稅</td><td>" + money(deltaBase.refundAmount) + "</td><td>" + money(deltaCompare.refundAmount) + "</td><td>" + money(planning.delta.refundDelta) + "</td></tr>",
      "<tr><td>有效稅率</td><td>" + window.IncomeTaxApp.utils.formatPercent(deltaBase.effectiveRate || 0) + "</td><td>" + window.IncomeTaxApp.utils.formatPercent(deltaCompare.effectiveRate || 0) + "</td><td>" + window.IncomeTaxApp.utils.formatPercent(planning.delta.effectiveRateDelta) + "</td></tr>",
      "<tr><td>稅率級距</td><td>" + escapeHtml(deltaBase.bracket ? Math.round(deltaBase.bracket.rate * 100) + "%" : "-") + "</td><td>" + escapeHtml(deltaCompare.bracket ? Math.round(deltaCompare.bracket.rate * 100) + "%" : "-") + "</td><td>" + window.IncomeTaxApp.utils.formatPercent(planning.delta.bracketDelta) + "</td></tr>",
      "<tr><td>扣除額</td><td>" + money(deltaBase.totalDeductions) + "</td><td>" + money(deltaCompare.totalDeductions) + "</td><td>" + money(planning.delta.deductionDelta) + "</td></tr>",
      "</tbody></table></div>",
      "<p>" + escapeHtml(planning.deltaExplanation.join(" ")) + "</p>"
    ].join("");
    document.getElementById("taxImpactFactors").innerHTML = planning.impactFactors.map(function (item) {
      return escapeHtml(item.label) + "：" + money(item.impact);
    }).join("<br>");
    document.getElementById("smartWarnings").innerHTML = planning.smartWarnings.length
      ? planning.smartWarnings.map(escapeHtml).join("<br>")
      : "無";
    document.getElementById("interactiveTaxBreakdown").innerHTML = [
      "課稅所得：" + money(forecast.taxableIncome),
      "總扣除額：" + money(forecast.totalDeductions),
      "股利抵減：" + money(forecast.dividendTaxCredit),
      "分離課稅：" + money(forecast.separateDividendTax),
      "級距：" + escapeHtml(forecast.bracket ? Math.round(forecast.bracket.rate * 100) + "%" : "-")
    ].join("<br>");
    renderCombinationRows(planning.combinations, "payableTax");
  }

  function renderScenarioRealtimeSummary(result) {
    const summary = document.getElementById("scenarioRealtimeSummary");
    if (!summary || !result) {
      return;
    }
    summary.innerHTML = [
      "<span>稅率 " + escapeHtml(result.bracket ? Math.round(result.bracket.rate * 100) + "%" : "-") + "</span>",
      "<span>退稅 " + money(result.refundAmount) + "</span>",
      "<span>應納稅額 " + money(result.payableTax) + "</span>",
      "<span>有效稅率 " + window.IncomeTaxApp.utils.formatPercent(result.effectiveRate) + "</span>"
    ].join("");
  }

  function renderTimelineForecast(rows) {
    const panel = document.getElementById("timelineForecastPanel");
    if (!panel) {
      return;
    }
    const maxTax = Math.max.apply(null, rows.map(function (row) { return window.IncomeTaxApp.engine.toNumber(row.payableTax); }).concat([1]));
    const maxRefund = Math.max.apply(null, rows.map(function (row) { return window.IncomeTaxApp.engine.toNumber(row.refundAmount); }).concat([1]));
    panel.innerHTML = rows.map(function (row) {
      const taxWidth = Math.max(4, Math.round(window.IncomeTaxApp.engine.toNumber(row.payableTax) / maxTax * 100));
      const refundWidth = Math.max(4, Math.round(window.IncomeTaxApp.engine.toNumber(row.refundAmount) / maxRefund * 100));
      return "<section class=\"timeline-row\">"
        + "<strong>" + escapeHtml(row.year) + "</strong>"
        + "<div><span>稅負</span><i style=\"width:" + taxWidth + "%\"></i><b>" + money(row.payableTax) + "</b></div>"
        + "<div><span>稅率</span><i style=\"width:" + Math.max(4, Math.round((row.effectiveRate || 0) * 100)) + "%\"></i><b>" + window.IncomeTaxApp.utils.formatPercent(row.effectiveRate) + "</b></div>"
        + "<div><span>退稅</span><i style=\"width:" + refundWidth + "%\"></i><b>" + money(row.refundAmount) + "</b></div>"
        + "<em>" + escapeHtml(row.bracket || "-") + "</em>"
        + "</section>";
    }).join("");
  }

  function syncScenarioOutputs(form) {
    ["scenarioSalarySlider", "scenarioDividendSlider", "scenarioInterestSlider", "scenarioMortgageSlider"].forEach(function (name) {
      const input = form.elements[name];
      const output = document.querySelector("output[data-for=\"" + name + "\"]");
      if (input && output) {
        output.textContent = money(input.value);
      }
    });
  }

  function applyScenarioPreset(form, preset) {
    const sliders = {
      promotion: { scenarioSalarySlider: 120000 },
      halfDividend: { scenarioDividendSlider: -Math.round(numberFromForm(new FormData(form), "dividendIncome") / 2) },
      addDependent: { scenarioSalarySlider: 0 },
      moreMortgage: { scenarioMortgageSlider: 60000 }
    };
    const selected = sliders[preset] || {};
    Object.keys(selected).forEach(function (name) {
      if (form.elements[name]) {
        form.elements[name].value = selected[name];
      }
    });
    syncScenarioOutputs(form);
  }

  function renderRecommendationInsights(reasons) {
    const panel = document.getElementById("recommendationInsightPanel");
    if (!panel) {
      return;
    }
    const groups = [
      { label: "高影響", priorities: ["high"] },
      { label: "中影響", priorities: ["medium"] },
      { label: "注意事項", priorities: ["low", "warning"] }
    ];
    panel.innerHTML = groups.map(function (group) {
      const items = reasons.filter(function (reason) {
        return group.priorities.indexOf(reason.priority) >= 0;
      });
      return "<section class=\"breakdown-group\"><h4>" + escapeHtml(group.label) + "</h4>"
        + (items.length ? items.map(function (reason) {
          return "<p><span>" + escapeHtml(reason.message) + "</span><strong>" + escapeHtml(reason.confidence) + "</strong></p>";
        }).join("") : "<p><span>無</span><strong>-</strong></p>")
        + "</section>";
    }).join("");
  }

  function renderCombinationRows(combinations, sortKey) {
    const recommendedOnly = document.getElementById("filterRecommended") && document.getElementById("filterRecommended").checked;
    const refundOnly = document.getElementById("filterRefund") && document.getElementById("filterRefund").checked;
    const lowTaxOnly = document.getElementById("filterLowTax") && document.getElementById("filterLowTax").checked;
    const fiveOnly = document.getElementById("filterFivePercent") && document.getElementById("filterFivePercent").checked;
    const query = document.getElementById("combinationSearch") ? document.getElementById("combinationSearch").value.trim() : "";
    const rows = window.IncomeTaxApp.planning.filterCombinationResults(combinations || [], {
      onlyRecommended: recommendedOnly,
      onlyRefund: refundOnly,
      onlyLowTax: lowTaxOnly,
      onlyFivePercent: fiveOnly,
      query: query
    }).slice().sort(function (a, b) {
      if (sortKey === "combinationName" || sortKey === "taxBracket") {
        return String(a[sortKey] || "").localeCompare(String(b[sortKey] || ""));
      }
      return window.IncomeTaxApp.engine.toNumber(a[sortKey]) - window.IncomeTaxApp.engine.toNumber(b[sortKey]);
    });
    const pageCount = Math.max(1, Math.ceil(rows.length / combinationPageSize));
    combinationPage = Math.max(0, Math.min(combinationPage, pageCount - 1));
    const start = combinationPage * combinationPageSize;
    const visibleRows = rows.slice(start, start + combinationPageSize);
    updateCombinationPageStatus(rows.length, pageCount);
    window.requestAnimationFrame(function () {
      document.getElementById("combinationResults").innerHTML = visibleRows.map(function (item) {
      const taxState = item.refundAmount > 0 ? "退稅 " + money(item.refundAmount) : "應補稅 " + money(item.payableTax);
      return "<tr class=\"" + (item.recommendation === "最佳方案" ? "best-row" : "") + "\">"
        + "<td>" + escapeHtml(item.combinationName || item.combinationId) + "</td>"
        + "<td>" + escapeHtml(item.taxBracket) + "</td>"
        + "<td>" + money(item.taxableIncome) + "</td>"
        + "<td>" + taxState + "</td>"
        + "<td>" + window.IncomeTaxApp.utils.formatPercent(item.effectiveRate) + "</td>"
        + "<td>" + window.IncomeTaxApp.engine.toNumber(item.recommendationScore) + " / " + escapeHtml(item.confidence) + "</td>"
        + "<td>" + escapeHtml(item.category || item.recommendationCategoryLabel || item.recommendationCategory || item.recommendation) + "</td>"
        + "</tr>";
      }).join("");
    });
  }

  function updateCombinationPageStatus(total, pageCount) {
    const status = document.getElementById("combinationPageStatus");
    const prev = document.getElementById("combinationPrevPage");
    const next = document.getElementById("combinationNextPage");
    if (status) {
      status.textContent = "第 " + (combinationPage + 1) + " / " + pageCount + " 頁，共 " + total + " 筆";
    }
    if (prev) {
      prev.disabled = combinationPage <= 0;
    }
    if (next) {
      next.disabled = combinationPage >= pageCount - 1;
    }
  }

  function changeCombinationPage(direction) {
    combinationPage = Math.max(0, combinationPage + direction);
  }

  function renderRecommendationIntelligence(combinations) {
    const panel = document.getElementById("recommendationIntelligence");
    if (!panel) {
      return;
    }
    const top = (combinations || []).slice(0, 3);
    panel.innerHTML = top.length ? top.map(function (item) {
      const factors = item.scoreFactors || {};
      return "<section class=\"breakdown-group\">"
        + "<h4>" + escapeHtml(item.combinationName || item.combinationId) + "</h4>"
        + "<p><span>分類</span><strong>" + escapeHtml(item.recommendationCategoryLabel || item.recommendationCategory || "-") + "</strong></p>"
        + "<p><span>tax savings</span><strong>" + money(factors.taxSavings) + "</strong></p>"
        + "<p><span>risk</span><strong>" + escapeHtml(factors.risk || 0) + "</strong></p>"
        + "<p><span>complexity</span><strong>" + escapeHtml(factors.complexity || 0) + "</strong></p>"
        + "<p><span>confidence</span><strong>" + escapeHtml(factors.confidence || 0) + "</strong></p>"
        + "</section>";
    }).join("") : "無";
  }

  function renderStrategyWorkspace(workspace, sortMode) {
    const summary = document.getElementById("strategyWorkspaceSummary");
    const body = document.getElementById("strategyWorkspaceRows");
    if (!summary || !body || !workspace) {
      return;
    }
    summary.innerHTML = [
      "最低稅負：" + escapeHtml(workspace.minTax ? workspace.minTax.strategyName : "-"),
      "最大退稅：" + escapeHtml(workspace.maxRefund ? workspace.maxRefund.strategyName : "-"),
      "最低有效稅率：" + escapeHtml(workspace.minEffectiveRate ? workspace.minEffectiveRate.strategyName : "-")
    ].join("<br>");
    const rows = window.IncomeTaxApp.planning.rankStrategies(workspace.rows || [], sortMode || "minTax");
    body.innerHTML = rows.map(function (item) {
      return "<tr class=\"" + (item.recommendation === "最佳方案" ? "best-row" : "") + "\">"
        + "<td>" + escapeHtml(item.strategyName) + "</td>"
        + "<td>" + money(item.payableTax) + "</td>"
        + "<td>" + money(item.refundAmount) + "</td>"
        + "<td>" + window.IncomeTaxApp.utils.formatPercent(item.effectiveRate) + "</td>"
        + "<td>" + escapeHtml(item.category || item.recommendationCategoryLabel || item.recommendationCategory || item.recommendation) + "</td>"
        + "</tr>";
    }).join("");
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
    toggleYearData: toggleYearData,
    syncYearDataToggle: syncYearDataToggle,
    syncScenarioOutputs: syncScenarioOutputs,
    applyScenarioPreset: applyScenarioPreset,
    renderResult: renderResult,
    renderCombinationRows: renderCombinationRows,
    changeCombinationPage: changeCombinationPage,
    renderStrategyWorkspace: renderStrategyWorkspace,
    setError: setError
  };
}());
