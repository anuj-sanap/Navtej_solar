import { solarCalculatorConfig, type SolarPackage } from "./config";

export type SolarCalculation = SolarPackage & {
  source: string;
  estimateNotice: string;
};

export function calculateSolar(systemSizeKw: number): SolarCalculation {
  if (!Number.isInteger(systemSizeKw) || systemSizeKw < solarCalculatorConfig.minSystemSizeKw || systemSizeKw > solarCalculatorConfig.maxSystemSizeKw) {
    throw new Error(`System size must be a whole number from ${solarCalculatorConfig.minSystemSizeKw} to ${solarCalculatorConfig.maxSystemSizeKw} kW.`);
  }

  const solarPackage = solarCalculatorConfig.packages.find((item) => item.systemSizeKw === systemSizeKw);
  if (!solarPackage) throw new Error("That system size is not available in the Excel package table.");

  return {
    ...solarPackage,
    source: "Solar_Calculator_1_to_20kW.xlsx",
    estimateNotice: "Estimated values taken from the workbook package table. A site survey and utility confirmation are required for a final proposal.",
  };
}

export function getSolarPackage(systemSizeKw: number) {
  return solarCalculatorConfig.packages.find((item) => item.systemSizeKw === systemSizeKw);
}
