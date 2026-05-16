export function runScenarioPipeline(household) {
  const normalized = normalizeHousehold(household)
  const scenarios = enumerateScenarios(normalized)
  const validated = validateScenarios(scenarios)
  const calculated = validated.map(runTaxEngine)
  return rankScenarios(calculated)
}
