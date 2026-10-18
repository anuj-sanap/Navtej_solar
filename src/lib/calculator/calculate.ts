import { solarCalculatorConfig, type SolarPackage } from "./config";

export type SolarCalculation = SolarPackage & {
  source: string;
  estimateNotice: string;
  monthlyBillInr?: number;
  annualBillInr?: number;
  monthlyUnitsConsumedKwh?: number;
  solarMonthlySavingInr?: number;
  newMonthlyBillInr?: number;
  annualBillSavingsInr?: number;
  billReductionPercent?: number;
  paybackYearsWithBill?: number;
  recommendedSystemSizeKw?: number;
};

/**
 * Calculates the optimal recommended system size (1 to 20 kW)
 * based on the user's monthly electricity bill.
 */
export function getRecommendedSystemSize(monthlyBillInr: number): number {
  if (!monthlyBillInr || monthlyBillInr <= 0) return 3;
  const tariff = solarCalculatorConfig.assumptions.electricityTariffInrPerKwh || 8;
  const monthlyUnits = monthlyBillInr / tariff;
  const genPerKwMonthly = solarCalculatorConfig.assumptions.monthlyGenerationKwhPerKw || 120;
  const rawKw = monthlyUnits / genPerKwMonthly;
  const roundedKw = Math.round(rawKw);
  return Math.max(
    solarCalculatorConfig.minSystemSizeKw,
    Math.min(solarCalculatorConfig.maxSystemSizeKw, roundedKw || 1)
  );
}

export function calculateSolar(systemSizeKw: number, monthlyBillInr?: number): SolarCalculation {
  if (!Number.isInteger(systemSizeKw) || systemSizeKw < solarCalculatorConfig.minSystemSizeKw || systemSizeKw > solarCalculatorConfig.maxSystemSizeKw) {
    throw new Error(`System size must be a whole number from ${solarCalculatorConfig.minSystemSizeKw} to ${solarCalculatorConfig.maxSystemSizeKw} kW.`);
  }

  const solarPackage = solarCalculatorConfig.packages.find((item) => item.systemSizeKw === systemSizeKw);
  if (!solarPackage) throw new Error("That system size is not available in the Excel package table.");

  let billMetrics: Partial<SolarCalculation> = {};
  if (monthlyBillInr && monthlyBillInr > 0) {
    const tariff = solarCalculatorConfig.assumptions.electricityTariffInrPerKwh || 8;
    const monthlyUnitsConsumedKwh = Math.round(monthlyBillInr / tariff);
    const annualBillInr = Math.round(monthlyBillInr * 12);
    const monthlySolarValue = Math.round(solarPackage.monthlyGenerationKwh * tariff);
    const solarMonthlySavingInr = Math.min(monthlyBillInr, monthlySolarValue);
    const newMonthlyBillInr = Math.max(0, monthlyBillInr - monthlySolarValue);
    const annualBillSavingsInr = solarMonthlySavingInr * 12;
    const billReductionPercent = Math.min(100, Math.round((solarMonthlySavingInr / monthlyBillInr) * 100));
    const paybackYearsWithBill = annualBillSavingsInr > 0
      ? solarPackage.estimatedCostInr / annualBillSavingsInr
      : solarPackage.paybackYears;
    const recommendedSystemSizeKw = getRecommendedSystemSize(monthlyBillInr);

    billMetrics = {
      monthlyBillInr,
      annualBillInr,
      monthlyUnitsConsumedKwh,
      solarMonthlySavingInr,
      newMonthlyBillInr,
      annualBillSavingsInr,
      billReductionPercent,
      paybackYearsWithBill,
      recommendedSystemSizeKw,
    };
  }

  return {
    ...solarPackage,
    ...billMetrics,
    source: "Solar_Calculator_1_to_20kW.xlsx",
    estimateNotice: "Estimated values taken from the workbook package table. A site survey and utility confirmation are required for a final proposal.",
  };
}

export function getSolarPackage(systemSizeKw: number) {
  return solarCalculatorConfig.packages.find((item) => item.systemSizeKw === systemSizeKw);
}
