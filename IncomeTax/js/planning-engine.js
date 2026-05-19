(function () {
  function n(value) {
    return window.IncomeTaxApp.engine.toNumber(value);
  }

  function rate(value) {
    const number = Number(value || 0);
    return Number.isFinite(number) ? number / 100 : 0;
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value || {}));
  }

  function getTaxRuleSnapshot(taxData, forecastYear) {
    const years = taxData.years || {};
    const target = years[String(forecastYear)];
    if (target) {
      target.meta = Object.assign({}, target.meta, {
        forecastSourceType: "official",
        forecastSourceYear: forecastYear
      });
      return target;
    }
    const current = years[String(taxData.currentYear)] || years[Object.keys(years).sort().pop()];
    const snapshot = clone(current);
    snapshot.meta = Object.assign({}, snapshot.meta, {
      year: forecastYear,
      source: (snapshot.meta && snapshot.meta.source ? snapshot.meta.source + "；" : "") + "預估年度沿用最新正式資料快照",
      forecastSourceType: "snapshot",
      forecastSourceYear: current.meta && current.meta.year
    });
    return snapshot;
  }

  function projectPersonIncome(person, forecast) {
    const source = person || {};
    const settings = forecast || {};
    return Object.assign({}, source, {
      salaryIncome: Math.round(n(source.salaryIncome) * (1 + rate(settings.salaryGrowthRate))),
      dividendIncome: Math.round(n(source.dividendIncome) * (1 + rate(settings.dividendGrowthRate))),
      interestIncome: Math.round(n(source.interestIncome) * (1 + rate(settings.interestGrowthRate)))
    });
  }

  function projectNextYearIncome(input, forecast) {
    const source = clone(input);
    return Object.assign({}, source, {
      taxpayer: projectPersonIncome(source.taxpayer, forecast),
      spouse: projectPersonIncome(source.spouse, forecast),
      forecastMode: true,
      forecastYear: n(forecast && forecast.forecastYear) || ((forecast && forecast.currentYear) ? n(forecast.currentYear) + 1 : null)
    });
  }

  function applyScenarioProjection(input, scenarioOverrides) {
    const source = clone(input);
    const overrides = scenarioOverrides || {};
    const projected = Object.assign({}, source, {
      taxpayer: Object.assign({}, source.taxpayer),
      spouse: Object.assign({}, source.spouse),
      deductions: Object.assign({}, source.deductions),
      dependents: (source.dependents || []).slice()
    });
    if (overrides.salaryChange !== undefined) {
      projected.taxpayer.salaryIncome = n(projected.taxpayer.salaryIncome) + n(overrides.salaryChange);
    }
    if (overrides.dividendChange !== undefined) {
      projected.taxpayer.dividendIncome = n(projected.taxpayer.dividendIncome) + n(overrides.dividendChange);
    }
    if (overrides.interestChange !== undefined) {
      projected.taxpayer.interestIncome = n(projected.taxpayer.interestIncome) + n(overrides.interestChange);
    }
    if (overrides.mortgageInterestChange !== undefined) {
      projected.deductions.mortgageInterest = n(projected.deductions.mortgageInterest) + n(overrides.mortgageInterestChange);
      projected.deductions.mortgageInterestExpense = projected.deductions.mortgageInterest;
    }
    if (Array.isArray(overrides.dependents)) {
      projected.dependents = overrides.dependents;
    }
    return projected;
  }

  function applyRealtimeScenario(taxStore, currentData, input, scenarioOverrides) {
    const scenarioInput = applyScenarioProjection(input, scenarioOverrides || {});
    const filingType = scenarioInput.filingMode === "joint" ? "joint" : "separate";
    const data = currentData || getTaxRuleSnapshot(taxStore, taxStore.currentYear);
    return {
      input: scenarioInput,
      result: window.IncomeTaxApp.engine.calculateTax(data, scenarioInput, filingType, scenarioInput.dividendTaxMode || "auto")
    };
  }

  function calculateTaxDelta(baseResult, compareResult) {
    const base = baseResult || {};
    const next = compareResult || {};
    const payableTaxDelta = n(next.payableTax) - n(base.payableTax);
    const refundDelta = n(next.refundAmount) - n(base.refundAmount);
    const effectiveRateDelta = Number(next.effectiveRate || 0) - Number(base.effectiveRate || 0);
    const bracketDelta = (next.bracket && next.bracket.rate || 0) - (base.bracket && base.bracket.rate || 0);
    const deductionDelta = n(next.totalDeductions) - n(base.totalDeductions);
    return {
      payableTaxDelta: payableTaxDelta,
      refundDelta: refundDelta,
      effectiveRateDelta: effectiveRateDelta,
      bracketDelta: bracketDelta,
      deductionDelta: deductionDelta,
      payableTax: payableTaxDelta,
      refundAmount: refundDelta,
      effectiveRate: effectiveRateDelta,
      taxBracket: bracketDelta,
      deductions: deductionDelta
    };
  }

  function generateDeltaExplanation(delta) {
    const messages = [];
    if (!delta) {
      return messages;
    }
    if (delta.payableTax > 0) {
      messages.push("應補稅增加 " + delta.payableTax + "。");
    }
    if (delta.refundAmount > 0) {
      messages.push("退稅增加 " + delta.refundAmount + "。");
    }
    if (delta.taxBracket > 0) {
      messages.push("稅率級距提高。");
    }
    if (delta.taxBracket < 0) {
      messages.push("稅率級距下降。");
    }
    if (delta.deductions > 0) {
      messages.push("扣除額增加。");
    }
    return messages.length ? messages : ["方案差異不大。"];
  }

  const strategyRegistry = [];

  function registerStrategy(name, handler) {
    strategyRegistry.push({ name: name, handler: handler });
    return strategyRegistry.slice();
  }

  function rankStrategies(strategies, objective) {
    return (strategies || []).slice().sort(function (a, b) {
      if (objective === "maxRefund") {
        return n(b.refundAmount) - n(a.refundAmount) || n(a.payableTax) - n(b.payableTax);
      }
      if (objective === "minEffectiveRate") {
        return Number(a.effectiveRate || 0) - Number(b.effectiveRate || 0) || n(a.payableTax) - n(b.payableTax);
      }
      return n(a.payableTax) - n(b.payableTax) || n(b.refundAmount) - n(a.refundAmount) || Number(a.effectiveRate || 0) - Number(b.effectiveRate || 0);
    });
  }

  function deriveTaxState(input, scenarioOverrides) {
    return {
      base: clone(input),
      scenario: applyScenarioProjection(input, scenarioOverrides || {}),
      forecast: input && input.forecast || {},
      optimization: input && input.optimization || {}
    };
  }

  function toggleExperienceMode(mode) {
    return mode === "advanced" ? "advanced" : "beginner";
  }

  function memberId(index) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return alphabet[index] || "M" + (index + 1);
  }

  function relationshipFromRelation(relation) {
    if (relation === "grandparent") {
      return "grandparent";
    }
    if (relation === "parent") {
      return "parent";
    }
    if (relation === "child") {
      return "child";
    }
    return relation || "dependent";
  }

  function buildHouseholdMembers(input) {
    const source = input || {};
    const members = [
      { id: "A", name: "本人", relationship: "self", income: clone(source.taxpayer), deductions: {}, dependents: [], canBeClaimed: false },
      { id: "B", name: "配偶", relationship: "spouse", income: clone(source.spouse), deductions: {}, dependents: [], canBeClaimed: false }
    ];
    (source.dependents || []).forEach(function (dependent, index) {
      members.push({
        id: dependent.id || memberId(index + 2),
        name: dependent.name || ("扶養親屬" + (index + 1)),
        relationship: relationshipFromRelation(dependent.relation),
        income: {
          salaryIncome: n(dependent.salaryIncome),
          professionalIncome: n(dependent.professionalIncome),
          dividendIncome: n(dependent.dividendIncome),
          interestIncome: n(dependent.interestIncome),
          otherIncome: n(dependent.otherIncome)
        },
        deductions: {
          insurance: n(dependent.insurance),
          nationalHealthInsurance: n(dependent.nationalHealthInsurance),
          medical: n(dependent.medical),
          childbirth: n(dependent.childbirth),
          donationGeneral: n(dependent.donationGeneral),
          donationPolitical: n(dependent.donationPolitical),
          donationPublic: n(dependent.donationPublic),
          disasterLoss: n(dependent.disasterLoss)
        },
        dependents: [],
        canBeClaimed: true,
        birthYear: dependent.birthYear,
        isSenior: dependent.isSenior,
        disabled: dependent.disabled,
        sameHousehold: dependent.sameHousehold
      });
    });
    return members;
  }

  function defaultHouseholdMembers(input) {
    return buildHouseholdMembers(input);
  }

  function generateFilingCombinations(members) {
    const list = (members || []).slice(0, 10);
    const primary = list.find(function (member) { return member.relationship === "self"; }) || list[0];
    if (!primary) {
      return [];
    }
    const spouse = list.find(function (member) { return member.relationship === "spouse"; });
    const claimable = list.filter(function (member) {
      return member.id !== primary.id && (!spouse || member.id !== spouse.id) && member.canBeClaimed !== false;
    });
    const combinations = [];
    [false, true].forEach(function (includeSpouse) {
      const spouseIds = includeSpouse && spouse ? [spouse.id] : [];
      const total = Math.pow(2, claimable.length);
      for (let mask = 0; mask < total; mask += 1) {
        const ids = [primary.id].concat(spouseIds);
        claimable.forEach(function (member, index) {
          if (mask & (1 << index)) {
            ids.push(member.id);
          }
        });
        combinations.push(ids);
      }
    });
    return combinations;
  }

  function dependentFromMember(member) {
    return {
      id: member.id,
      name: member.name,
      relation: member.relationship === "grandparent" ? "grandparent" : "parent",
      birthYear: member.birthYear || 1950,
      isSenior: member.isSenior !== false,
      disabled: member.disabled === true,
      sameHousehold: member.sameHousehold !== false
    };
  }

  function buildInputForCombination(baseInput, members, combination) {
    const byId = {};
    (members || []).forEach(function (member) { byId[member.id] = member; });
    const ids = combination || [];
    const spouseIncluded = ids.indexOf("B") >= 0;
    const dependentIds = ids.filter(function (id) { return id !== "A" && id !== "B"; });
    const dependentIncome = dependentIds.reduce(function (total, id) {
      const income = byId[id] && byId[id].income || {};
      return {
        salaryIncome: n(total.salaryIncome) + n(income.salaryIncome),
        professionalIncome: n(total.professionalIncome) + n(income.professionalIncome),
        dividendIncome: n(total.dividendIncome) + n(income.dividendIncome),
        interestIncome: n(total.interestIncome) + n(income.interestIncome),
        otherIncome: n(total.otherIncome) + n(income.otherIncome)
      };
    }, {});
    const taxpayerBase = Object.assign({}, baseInput.taxpayer, byId.A && byId.A.income);
    const taxpayer = {
      salaryIncome: n(taxpayerBase.salaryIncome) + n(dependentIncome.salaryIncome),
      professionalIncome: n(taxpayerBase.professionalIncome) + n(dependentIncome.professionalIncome),
      dividendIncome: n(taxpayerBase.dividendIncome) + n(dependentIncome.dividendIncome),
      interestIncome: n(taxpayerBase.interestIncome) + n(dependentIncome.interestIncome),
      otherIncome: n(taxpayerBase.otherIncome) + n(dependentIncome.otherIncome)
    };
    const spouse = spouseIncluded ? Object.assign({}, baseInput.spouse, byId.B && byId.B.income) : {
      salaryIncome: 0,
      professionalIncome: 0,
      dividendIncome: 0,
      interestIncome: 0,
      otherIncome: 0
    };
    const dependents = dependentIds.map(function (id) {
      return dependentFromMember(byId[id]);
    });
    const selectedDependentDeductions = dependentIds.map(function (id) {
      return byId[id] && byId[id].deductions || {};
    });
    return Object.assign({}, baseInput, {
      filingMode: spouseIncluded ? "joint" : "single",
      taxpayer: taxpayer,
      spouse: spouse,
      dependents: dependents,
      deductions: Object.assign({}, baseInput.deductions, {
        spouse: spouseIncluded ? baseInput.deductions.spouse : {},
        dependents: selectedDependentDeductions
      })
    });
  }

  function formatCombinationName(members, combination) {
    const byId = {};
    (members || []).forEach(function (member) { byId[member.id] = member; });
    return (combination || []).map(function (id) {
      return byId[id] && byId[id].name ? byId[id].name : id;
    }).join(" + ");
  }

  function bracketLabel(result) {
    return result && result.bracket ? Math.round(result.bracket.rate * 100) + "%" : "-";
  }

  function simulateCombinationTax(data, baseInput, members, combination) {
    const input = buildInputForCombination(baseInput, members, combination);
    const filingType = combination.indexOf("B") >= 0 ? "joint" : "separate";
    const result = window.IncomeTaxApp.engine.calculateTax(data, input, filingType, input.dividendTaxMode || "auto");
    return {
      combinationId: combination.join("+"),
      combinationName: formatCombinationName(members, combination),
      members: combination,
      taxBracket: bracketLabel(result),
      taxableIncome: result.taxableIncome,
      payableTax: result.payableTax,
      refundAmount: result.refundAmount,
      effectiveRate: result.effectiveRate,
      result: result
    };
  }

  function rankCombinationResults(results) {
    return (results || []).slice().sort(function (a, b) {
      if (a.payableTax !== b.payableTax) {
        return a.payableTax - b.payableTax;
      }
      if (a.refundAmount !== b.refundAmount) {
        return b.refundAmount - a.refundAmount;
      }
      if (a.effectiveRate !== b.effectiveRate) {
        return a.effectiveRate - b.effectiveRate;
      }
      return a.combinationName.localeCompare(b.combinationName);
    }).map(function (item, index) {
      return Object.assign({}, item, {
        recommendation: index === 0 ? "最佳方案" : index === 1 ? "次佳方案" : "高稅負方案"
      });
    });
  }

  function simulateMultiYearTax(taxStore, input, startYear, yearCount, scenarioOverrides) {
    const count = Math.max(3, Math.min(5, n(yearCount) || 5));
    const firstYear = n(startYear) || taxStore.currentYear;
    const projectedInput = applyScenarioProjection(input, scenarioOverrides || {});
    const filingType = projectedInput.filingMode === "joint" ? "joint" : "separate";
    const results = [];
    for (let offset = 0; offset < count; offset += 1) {
      const year = firstYear + offset;
      const data = getTaxRuleSnapshot(taxStore, year);
      const result = window.IncomeTaxApp.engine.calculateTax(data, projectedInput, filingType, projectedInput.dividendTaxMode || "auto");
      results.push({
        year: year,
        payableTax: result.payableTax,
        refundAmount: result.refundAmount,
        taxBracket: bracketLabel(result),
        effectiveRate: result.effectiveRate,
        result: result
      });
    }
    return results;
  }

  function generateTaxExplanation(currentResult, projectedResult) {
    const messages = [];
    if (!currentResult || !projectedResult) {
      return messages;
    }
    if (projectedResult.payableTax > currentResult.payableTax) {
      messages.push("因所得或扣除條件變動，稅負增加。");
    }
    if (projectedResult.refundAmount > currentResult.refundAmount) {
      messages.push("因抵減或扣除增加，退稅增加。");
    }
    if (projectedResult.bracket && currentResult.bracket && projectedResult.bracket.rate < currentResult.bracket.rate) {
      messages.push("稅率由 " + bracketLabel(currentResult) + " 降至 " + bracketLabel(projectedResult) + "。");
    }
    return messages.length ? messages : ["目前情境與基準試算差異有限。"];
  }

  function optimizeTaxStrategy(results, objective, constraints) {
    const filtered = (results || []).filter(function (item) {
      if (constraints && constraints.noNewDependents && item.members && item.members.length > 2) {
        return false;
      }
      return true;
    });
    return filtered.slice().sort(function (a, b) {
      if (objective === "maxRefund") {
        return b.refundAmount - a.refundAmount || a.payableTax - b.payableTax;
      }
      if (objective === "minEffectiveRate") {
        return a.effectiveRate - b.effectiveRate || a.payableTax - b.payableTax;
      }
      return a.payableTax - b.payableTax || b.refundAmount - a.refundAmount;
    })[0] || null;
  }

  function generateRecommendationReasons(best, baseline) {
    const reasons = [];
    if (!best) {
      return reasons;
    }
    if (baseline && best.payableTax < baseline.payableTax) {
      reasons.push({
        type: "saving",
        priority: "high",
        message: "此方案應納稅額較基準方案降低 " + (n(baseline.payableTax) - n(best.payableTax)) + " 元。",
        confidence: "high"
      });
    }
    if (best.refundAmount > 0) {
      reasons.push({
        type: "refund",
        priority: "medium",
        message: "此方案可產生退稅 " + n(best.refundAmount) + " 元。",
        confidence: "medium"
      });
    }
    if (baseline && best.result && baseline.result && best.result.bracket.rate < baseline.result.bracket.rate) {
      reasons.push({
        type: "bracket",
        priority: "high",
        message: "稅率由 " + bracketLabel(baseline.result) + " 降至 " + bracketLabel(best.result) + "。",
        confidence: "high"
      });
    }
    return reasons.length ? reasons : [{
      type: "stability",
      priority: "medium",
      message: "此方案整體稅負較穩定。",
      confidence: "medium"
    }];
  }

  function scoreRecommendations(results) {
    return (results || []).map(function (item) {
      const risk = item.recommendation === "高稅負方案" ? 30 : 5;
      const complexity = item.members && item.members.length > 2 ? 10 : 3;
      const taxSavingsScore = Math.max(0, 1000000 - n(item.payableTax)) + n(item.refundAmount);
      const score = taxSavingsScore - Math.round(Number(item.effectiveRate || 0) * 100000) - (risk * 1000) - (complexity * 500);
      const category = risk >= 30 ? "warning" : score > 930000 ? "highly recommended" : score > 820000 ? "recommended" : "informational";
      const categoryLabel = {
        "highly recommended": "高度推薦",
        recommended: "推薦",
        informational: "資訊",
        warning: "注意"
      }[category];
      return Object.assign({}, item, {
        recommendationScore: score,
        recommendationCategory: category,
        recommendationCategoryLabel: categoryLabel,
        confidence: score > 900000 ? "high" : score > 700000 ? "medium" : "low",
        scoreFactors: {
          taxSavings: taxSavingsScore,
          risk: risk,
          complexity: complexity,
          confidence: score > 900000 ? 90 : score > 700000 ? 70 : 45
        }
      });
    });
  }

  function filterCombinationResults(results, filters) {
    const options = filters || {};
    const query = String(options.query || "").trim();
    return (results || []).filter(function (item) {
      if (options.onlyRecommended && item.recommendation !== "最佳方案" && item.recommendationCategory !== "highly recommended") {
        return false;
      }
      if (options.onlyRefund && n(item.refundAmount) <= 0) {
        return false;
      }
      if (options.onlyLowTax && n(item.payableTax) > 0) {
        return false;
      }
      if (options.onlyFivePercent && item.taxBracket !== "5%") {
        return false;
      }
      if (query && String(item.combinationName || "").indexOf(query) < 0) {
        return false;
      }
      return true;
    });
  }

  function classifyCombination(item) {
    if (!item) {
      return "不推薦";
    }
    if (item.recommendation === "最佳方案") {
      return "最低稅負";
    }
    if (n(item.refundAmount) > 0) {
      return "高退稅";
    }
    if (item.recommendationCategory === "warning") {
      return "高風險";
    }
    return item.recommendation === "高稅負方案" ? "不推薦" : "最低稅負";
  }

  function buildStrategyWorkspace(results) {
    const rows = (results || []).map(function (item) {
      return Object.assign({}, item, {
        strategyName: item.combinationName || item.combinationId,
        category: classifyCombination(item)
      });
    });
    return {
      minTax: rankStrategies(rows, "minTax")[0] || null,
      maxRefund: rankStrategies(rows, "maxRefund")[0] || null,
      minEffectiveRate: rankStrategies(rows, "minEffectiveRate")[0] || null,
      rows: rankStrategies(rows, "minTax").slice(0, 12)
    };
  }

  function rankTaxImpactFactors(baseResult, compareResult) {
    const delta = calculateTaxDelta(baseResult, compareResult);
    return [
      { label: "應補稅", impact: Math.abs(delta.payableTax) },
      { label: "退稅", impact: Math.abs(delta.refundAmount) },
      { label: "扣除額", impact: Math.abs(delta.deductions) },
      { label: "有效稅率", impact: Math.round(Math.abs(delta.effectiveRate) * 100000) },
      { label: "稅率級距", impact: Math.round(Math.abs(delta.taxBracket) * 100000) }
    ].sort(function (a, b) { return b.impact - a.impact; });
  }

  function generateSmartWarnings(result) {
    const warnings = [];
    if (result && result.dividendTaxCredit >= 72000) {
      warnings.push("股利抵減接近上限。");
    }
    if (result && result.bracket && result.bracket.max && result.taxableIncome > result.bracket.max * 0.92) {
      warnings.push("即將進入更高級距。");
    }
    return warnings;
  }

  function simulateTimelineForecast(taxStore, input, assumptions) {
    const source = assumptions || {};
    const results = [];
    let projected = clone(input);
    const startYear = n(source.startYear) || taxStore.currentYear;
    for (let index = 0; index < 5; index += 1) {
      projected = Object.assign({}, projected, {
        taxpayer: projectPersonIncome(projected.taxpayer, {
          salaryGrowthRate: source.salaryGrowthRate || source.salaryGrowth || 0,
          dividendGrowthRate: source.dividendGrowthRate || source.dividendGrowth || 0,
          interestGrowthRate: source.interestGrowthRate || source.inflationRate || 0
        })
      });
      const data = getTaxRuleSnapshot(taxStore, startYear + index);
      const result = window.IncomeTaxApp.engine.calculateTax(data, projected, projected.filingMode === "joint" ? "joint" : "separate", projected.dividendTaxMode || "auto");
      results.push({
        year: startYear + index,
        result: result,
        payableTax: result.payableTax,
        refundAmount: result.refundAmount,
        effectiveRate: result.effectiveRate,
        bracket: bracketLabel(result)
      });
    }
    return results;
  }

  function buildResultViewModel(result, planning) {
    const source = result || {};
    const active = source.activeResult || {};
    const plan = planning || source.planning || {};
    return {
      summary: {
        payableTax: n(active.payableTax),
        refundAmount: n(active.refundAmount),
        finalTaxState: active.finalTaxState,
        grossIncome: n(active.grossIncome),
        taxableIncome: n(active.taxableIncome),
        totalDeductions: n(active.totalDeductions),
        effectiveRate: active.effectiveRate || 0,
        marginalRate: active.marginalRate || 0,
        bestStrategy: source.recommendedLabel || "-"
      },
      recommendation: {
        primary: (plan.recommendation || []).slice(0, 4),
        reasons: plan.recommendationReasons || [],
        intelligence: (plan.combinations || []).slice(0, 3)
      },
      comparison: {
        delta: plan.delta || null,
        base: plan.deltaBase || null,
        compare: plan.deltaCompare || null,
        impactFactors: plan.impactFactors || []
      },
      forecast: {
        dashboard: plan.dashboard || null,
        timeline: plan.timelineForecast || [],
        multiYear: plan.multiYearResults || []
      },
      warnings: {
        validation: source.diagnostics || [],
        smart: plan.smartWarnings || []
      }
    };
  }

  function generateRecommendations(activeResult, planning) {
    const messages = [];
    if (activeResult && activeResult.selectedDividendTaxMode === "combined" && activeResult.dividendIncome > 0) {
      messages.push("目前採合併計稅較有利。");
    }
    if (planning && planning.combinations && planning.combinations[0] && planning.combinations[0].members.length > 1) {
      messages.push("新增扶養親屬後可能降低稅率或稅負。");
    }
    if (activeResult && activeResult.dividendTaxCredit >= 72000) {
      messages.push("股利抵減已接近上限。");
    }
    return messages.length ? messages : ["目前資料已採用最低稅負方向試算。"];
  }

  function buildForecastDashboard(currentResult, multiYearResults) {
    const rows = multiYearResults || [];
    const totalPayable = rows.reduce(function (total, row) { return total + n(row.payableTax); }, 0);
    const maxRateRow = rows.slice().sort(function (a, b) {
      return (b.result.bracket.rate || 0) - (a.result.bracket.rate || 0);
    })[0];
    const bestYear = rows.slice().sort(function (a, b) {
      return a.payableTax - b.payableTax || b.refundAmount - a.refundAmount;
    })[0];
    return {
      currentPayableTax: currentResult ? currentResult.payableTax : 0,
      nextYearPayableTax: rows[1] ? rows[1].payableTax : rows[0] && rows[0].payableTax,
      averagePayableTax: rows.length ? Math.round(totalPayable / rows.length) : 0,
      highestRateYear: maxRateRow ? maxRateRow.year : null,
      bestSavingYear: bestYear ? bestYear.year : null
    };
  }

  function analyzeBestCombination(best, baseline) {
    if (!best) {
      return [];
    }
    const messages = [];
    if (baseline && best.result.bracket.rate < baseline.result.bracket.rate) {
      messages.push("納入扶養後，可降至 " + bracketLabel(best.result) + " 稅率級距。");
    }
    if (best.members.indexOf("B") < 0) {
      messages.push("配偶分開申報較有利。");
    }
    if (best.members.indexOf("G") >= 0) {
      messages.push("加入祖母扶養後，扣除額增加。");
    }
    if (!messages.length) {
      messages.push("目前最佳方案為 " + best.combinationName + "。");
    }
    return messages;
  }

  function evaluatePlanning(taxStore, currentData, input) {
    const forecast = input.forecast || {};
    const selectedYear = currentData.meta && currentData.meta.year;
    const forecastYear = n(forecast.forecastYear) || selectedYear || taxStore.currentYear;
    const forecastInput = Object.assign({}, input, {
      forecastMode: true,
      forecastYear: forecastYear
    });
    const forecastData = getTaxRuleSnapshot(taxStore, forecastYear);
    const forecastResult = window.IncomeTaxApp.engine.calculateTax(forecastData, forecastInput, forecastInput.filingMode === "joint" ? "joint" : "separate", forecastInput.dividendTaxMode || "auto");
    const members = buildHouseholdMembers(input);
    const combinations = generateFilingCombinations(members);
    const rankedCombinations = rankCombinationResults(combinations.map(function (combination) {
      return simulateCombinationTax(currentData, input, members, combination);
    }));
    const baseline = rankedCombinations.find(function (item) { return item.combinationId === "A"; });
    const multiYearResults = simulateMultiYearTax(taxStore, input, selectedYear || taxStore.currentYear, 5, input.scenarioOverrides || {});
    const dashboard = buildForecastDashboard(forecastResult, multiYearResults);
    const baseResult = baseline && baseline.result;
    const bestResult = rankedCombinations[0] && rankedCombinations[0].result;
    const delta = calculateTaxDelta(baseResult, bestResult);
    const scoredCombinations = scoreRecommendations(rankedCombinations).map(function (item) {
      return Object.assign({}, item, { category: classifyCombination(item) });
    });
    const strategyWorkspace = buildStrategyWorkspace(scoredCombinations);
    const realtimeScenario = applyRealtimeScenario(taxStore, currentData, input, input.scenarioOverrides || {});
    const timelineForecast = simulateTimelineForecast(taxStore, input, {
      startYear: selectedYear || taxStore.currentYear,
      salaryGrowthRate: forecast.salaryGrowthRate,
      dividendGrowthRate: forecast.dividendGrowthRate,
      interestGrowthRate: forecast.inflationRate || forecast.interestGrowthRate
    });
    return {
      forecastYear: forecastYear,
      forecastInput: forecastInput,
      forecastResult: forecastResult,
      members: members,
      combinations: scoredCombinations,
      strategyWorkspace: strategyWorkspace,
      multiYearResults: multiYearResults,
      dashboard: dashboard,
      delta: delta,
      deltaBase: baseResult,
      deltaCompare: bestResult,
      deltaExplanation: generateDeltaExplanation(delta),
      scenarioResult: realtimeScenario.result,
      timelineForecast: timelineForecast,
      impactFactors: rankTaxImpactFactors(baseResult, bestResult),
      smartWarnings: generateSmartWarnings(forecastResult),
      recommendation: analyzeBestCombination(rankedCombinations[0], baseline)
        .concat(generateRecommendations(forecastResult, { combinations: rankedCombinations })),
      recommendationReasons: generateRecommendationReasons(rankedCombinations[0], baseline)
    };
  }

  window.IncomeTaxApp.planning = {
    getTaxRuleSnapshot: getTaxRuleSnapshot,
    projectNextYearIncome: projectNextYearIncome,
    applyScenarioProjection: applyScenarioProjection,
    applyRealtimeScenario: applyRealtimeScenario,
    calculateTaxDelta: calculateTaxDelta,
    generateDeltaExplanation: generateDeltaExplanation,
    registerStrategy: registerStrategy,
    rankStrategies: rankStrategies,
    toggleExperienceMode: toggleExperienceMode,
    deriveTaxState: deriveTaxState,
    defaultHouseholdMembers: defaultHouseholdMembers,
    buildHouseholdMembers: buildHouseholdMembers,
    formatCombinationName: formatCombinationName,
    generateFilingCombinations: generateFilingCombinations,
    simulateCombinationTax: simulateCombinationTax,
    rankCombinationResults: rankCombinationResults,
    simulateMultiYearTax: simulateMultiYearTax,
    generateTaxExplanation: generateTaxExplanation,
    optimizeTaxStrategy: optimizeTaxStrategy,
    generateRecommendationReasons: generateRecommendationReasons,
    scoreRecommendations: scoreRecommendations,
    filterCombinationResults: filterCombinationResults,
    classifyCombination: classifyCombination,
    buildStrategyWorkspace: buildStrategyWorkspace,
    rankTaxImpactFactors: rankTaxImpactFactors,
    generateSmartWarnings: generateSmartWarnings,
    simulateTimelineForecast: simulateTimelineForecast,
    buildResultViewModel: buildResultViewModel,
    generateRecommendations: generateRecommendations,
    buildForecastDashboard: buildForecastDashboard,
    analyzeBestCombination: analyzeBestCombination,
    evaluatePlanning: evaluatePlanning
  };
}());
