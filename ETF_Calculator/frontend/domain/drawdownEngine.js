const CRASH_SCENARIOS = {
  custom: { label: "自訂壓力", crashYear: 3, drawdown: -0.3, recoveryYears: 4, volatilityShock: 1.2 },
  "2008": { label: "2008 金融海嘯", crashYear: 3, drawdown: -0.55, recoveryYears: 5, volatilityShock: 1.8 },
  covid: { label: "COVID 崩跌", crashYear: 2, drawdown: -0.35, recoveryYears: 1, volatilityShock: 1.5 },
  dotcom: { label: "網路泡沫", crashYear: 3, drawdown: -0.49, recoveryYears: 7, volatilityShock: 1.7 }
};

function simulateCrashScenario(input, scenarioConfig) {
  const scenario = typeof scenarioConfig === "string"
    ? CRASH_SCENARIOS[scenarioConfig]
    : { ...CRASH_SCENARIOS.custom, ...(scenarioConfig || {}) };
  const basePoints = calculateCompoundGrowth(input);
  const crashedPoints = basePoints.map((point) => {
    const shockMultiplier = calculateCrashMultiplier(point.year, scenario);
    return {
      ...point,
      value: point.value * shockMultiplier,
      shockMultiplier
    };
  });
  const drawdownSeries = calculateDrawdownSeries(crashedPoints);
  const maxDrawdownPoint = drawdownSeries.reduce((maxPoint, point) => (
    point.drawdown > maxPoint.drawdown ? point : maxPoint
  ), { year: 0, drawdown: 0 });
  const recoveryPoint = drawdownSeries.find((point) => point.year > maxDrawdownPoint.year && point.drawdown <= 0.001);
  const periods = identifyDrawdownPeriods(drawdownSeries);
  const worstPeriods = [...periods].sort((a, b) => b.maxDrawdown - a.maxDrawdown).slice(0, 3);

  return {
    scenario,
    points: crashedPoints,
    drawdownSeries,
    periods,
    worstPeriods,
    metrics: {
      maxDrawdown: maxDrawdownPoint.drawdown,
      recoveryDuration: recoveryPoint ? recoveryPoint.year - maxDrawdownPoint.year : null,
      underwaterDuration: drawdownSeries.filter((point) => point.drawdown > 0.001).length,
      longestUnderwaterDuration: periods.reduce((max, period) => Math.max(max, period.duration), 0)
    }
  };
}

function calculateCrashMultiplier(year, scenario) {
  if (year < scenario.crashYear) return 1;
  if (year === scenario.crashYear) return 1 + scenario.drawdown;
  const yearsSinceCrash = year - scenario.crashYear;
  if (yearsSinceCrash >= scenario.recoveryYears) return 1;
  const recoveryProgress = yearsSinceCrash / scenario.recoveryYears;
  return 1 + scenario.drawdown * (1 - recoveryProgress);
}

function calculateDrawdownSeries(points) {
  let peak = 0;
  return points.map((point) => {
    peak = Math.max(peak, point.value);
    return {
      year: point.year,
      value: point.value,
      drawdown: peak > 0 ? (peak - point.value) / peak : 0
    };
  });
}

function identifyDrawdownPeriods(drawdownSeries) {
  const periods = [];
  let active = null;

  drawdownSeries.forEach((point) => {
    if (point.drawdown > 0.001 && !active) {
      active = {
        startYear: point.year,
        troughYear: point.year,
        recoveryYear: null,
        maxDrawdown: point.drawdown,
        duration: 1
      };
      return;
    }

    if (point.drawdown > 0.001 && active) {
      active.duration += 1;
      if (point.drawdown > active.maxDrawdown) {
        active.maxDrawdown = point.drawdown;
        active.troughYear = point.year;
      }
      return;
    }

    if (point.drawdown <= 0.001 && active) {
      active.recoveryYear = point.year;
      periods.push(active);
      active = null;
    }
  });

  if (active) periods.push(active);
  return periods;
}
