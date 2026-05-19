type CurrencyCode = "TWD" | "USD";

interface InvestmentInput {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  annualReturn: number;
  volatility: number;
  dividendYield: number;
  expenseRatio?: number;
}

interface EtfPreset {
  ticker: string;
  displayName: string;
  cagr: number;
  dividendYield: number;
  expenseRatio: number;
  volatility: number;
  currency: CurrencyCode;
  region: string;
  category: string;
  inceptionYear: number;
  dividendMonths: number[];
}

interface PortfolioHolding extends EtfPreset {
  allocation: number;
}

interface PortfolioMetrics {
  weightedCagr: number;
  weightedDividendYield: number;
  weightedExpenseRatio: number;
  weightedVolatility: number;
  holdings: PortfolioHolding[];
  holdingCount: number;
  totalAllocation: number;
  currencyAllocation: Record<string, number>;
}

interface YearlyPoint {
  year: number;
  value: number;
  contribution?: number;
  returnRate?: number;
}

interface RiskMetrics {
  cagr: number;
  maxDrawdown: number;
  volatility: number;
  annualizedReturn: number;
  realReturnAfterInflation: number;
  dividendCagr: number;
  sharpeRatio: number;
  sortinoRatio: number;
}

interface Diagnostic {
  severity: "error" | "warning" | "info";
  code: string;
  message: string;
}
