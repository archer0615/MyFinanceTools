function simulateTaxImpact(input, taxConfig) {
  const dividendTaxRate = Math.max(Number(taxConfig.dividendTaxRate) || 0, 0);
  const capitalGainsTaxRate = Math.max(Number(taxConfig.capitalGainsTaxRate) || 0, 0);
  const estateTaxRate = Math.max(Number(taxConfig.estateTaxRate) || 0, 0);
  const estateExemption = Math.max(Number(taxConfig.estateExemption) || 0, 0);
  const taxableInput = { ...input, dividendYield: input.dividendYield * (1 - dividendTaxRate) };
  const beforeTaxPoints = calculateCompoundGrowth(input);
  const afterDividendTaxPoints = calculateCompoundGrowth(taxableInput);
  const finalBeforeTax = beforeTaxPoints.at(-1) || { value: 0, contribution: 0 };
  const finalAfterDividendTax = afterDividendTaxPoints.at(-1) || { value: 0, contribution: 0 };
  const capitalGain = Math.max(finalAfterDividendTax.value - finalAfterDividendTax.contribution, 0);
  const capitalGainsTax = capitalGain * capitalGainsTaxRate;
  const estateTax = Math.max(finalAfterDividendTax.value - estateExemption, 0) * estateTaxRate;
  const finalAfterTaxValue = Math.max(finalAfterDividendTax.value - capitalGainsTax - estateTax, 0);

  return {
    beforeTaxPoints,
    afterDividendTaxPoints,
    metrics: {
      finalBeforeTaxValue: finalBeforeTax.value,
      finalAfterDividendTaxValue: finalAfterDividendTax.value,
      finalAfterTaxValue,
      dividendTaxDrag: finalBeforeTax.value - finalAfterDividendTax.value,
      capitalGainsTax,
      estateTax,
      totalTaxDrag: finalBeforeTax.value - finalAfterTaxValue,
      effectiveTaxDragRate: finalBeforeTax.value > 0 ? (finalBeforeTax.value - finalAfterTaxValue) / finalBeforeTax.value : 0
    }
  };
}
