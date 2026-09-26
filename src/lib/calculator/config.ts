export type SolarPackage = {
  systemSizeKw: number;
  estimatedCostInr: number;
  panelCount: number;
  inverterCapacityKw: number;
  dailyGenerationKwh: number;
  monthlyGenerationKwh: number;
  yearlyGenerationKwh: number;
  roofAreaSqFt: number;
  annualSavingInr: number;
  paybackYears: number;
  co2ReductionTonnesPerYear: number;
};

export const solarCalculatorConfig = {
  sourceWorkbook: "public/Solar_Calculator_1_to_20kW.xlsx",
  sourceSheets: ["Solar Calculator", "Assumptions"],
  minSystemSizeKw: 1,
  maxSystemSizeKw: 20,
  assumptions: {
    panelRatingW: 550,
    generationKwhPerKwPerDay: 4,
    monthlyGenerationKwhPerKw: 120,
    yearlyGenerationKwhPerKw: 1460,
    electricityTariffInrPerKwh: 8,
    roofAreaSqFtPerKw: 80,
    co2FactorKgPerKwh: 0.7,
  },
  unavailableFeatures: {
    subsidy: true,
    regionalTariffs: true,
    pinAndDiscomLookup: true,
    billToUnitsConversion: true,
    installationAndStructureBreakdown: true,
    loanTerms: true,
    manualSystemSizeRules: true,
    environmentalEquivalents: true,
    longTermProjection: true,
    roofWarningThreshold: true,
    leadDatabaseChoice: true,
    loginRequirement: true,
    vidyutIntegration: true,
  },
  packages: [
    { systemSizeKw: 1, estimatedCostInr: 80000, panelCount: 2, inverterCapacityKw: 1, dailyGenerationKwh: 4, monthlyGenerationKwh: 120, yearlyGenerationKwh: 1460, roofAreaSqFt: 80, annualSavingInr: 11680, paybackYears: 6.849315068493151, co2ReductionTonnesPerYear: 1.022 },
    { systemSizeKw: 2, estimatedCostInr: 150000, panelCount: 4, inverterCapacityKw: 2, dailyGenerationKwh: 8, monthlyGenerationKwh: 240, yearlyGenerationKwh: 2920, roofAreaSqFt: 160, annualSavingInr: 23360, paybackYears: 6.421232876712328, co2ReductionTonnesPerYear: 2.044 },
    { systemSizeKw: 3, estimatedCostInr: 220000, panelCount: 6, inverterCapacityKw: 3, dailyGenerationKwh: 12, monthlyGenerationKwh: 360, yearlyGenerationKwh: 4380, roofAreaSqFt: 240, annualSavingInr: 35040, paybackYears: 6.278538812785389, co2ReductionTonnesPerYear: 3.066 },
    { systemSizeKw: 4, estimatedCostInr: 250000, panelCount: 8, inverterCapacityKw: 4, dailyGenerationKwh: 16, monthlyGenerationKwh: 480, yearlyGenerationKwh: 5840, roofAreaSqFt: 320, annualSavingInr: 46720, paybackYears: 5.351027397260274, co2ReductionTonnesPerYear: 4.087999999999999 },
    { systemSizeKw: 5, estimatedCostInr: 290000, panelCount: 10, inverterCapacityKw: 5, dailyGenerationKwh: 20, monthlyGenerationKwh: 600, yearlyGenerationKwh: 7300, roofAreaSqFt: 400, annualSavingInr: 58400, paybackYears: 4.965753424657534, co2ReductionTonnesPerYear: 5.11 },
    { systemSizeKw: 6, estimatedCostInr: 330000, panelCount: 11, inverterCapacityKw: 6, dailyGenerationKwh: 24, monthlyGenerationKwh: 720, yearlyGenerationKwh: 8760, roofAreaSqFt: 480, annualSavingInr: 70080, paybackYears: 4.708904109589041, co2ReductionTonnesPerYear: 6.132 },
    { systemSizeKw: 7, estimatedCostInr: 370000, panelCount: 13, inverterCapacityKw: 7, dailyGenerationKwh: 28, monthlyGenerationKwh: 840, yearlyGenerationKwh: 10220, roofAreaSqFt: 560, annualSavingInr: 81760, paybackYears: 4.525440313111546, co2ReductionTonnesPerYear: 7.154 },
    { systemSizeKw: 8, estimatedCostInr: 410000, panelCount: 15, inverterCapacityKw: 8, dailyGenerationKwh: 32, monthlyGenerationKwh: 960, yearlyGenerationKwh: 11680, roofAreaSqFt: 640, annualSavingInr: 93440, paybackYears: 4.387842465753424, co2ReductionTonnesPerYear: 8.175999999999998 },
    { systemSizeKw: 9, estimatedCostInr: 450000, panelCount: 17, inverterCapacityKw: 9, dailyGenerationKwh: 36, monthlyGenerationKwh: 1080, yearlyGenerationKwh: 13140, roofAreaSqFt: 720, annualSavingInr: 105120, paybackYears: 4.280821917808219, co2ReductionTonnesPerYear: 9.198 },
    { systemSizeKw: 10, estimatedCostInr: 490000, panelCount: 19, inverterCapacityKw: 10, dailyGenerationKwh: 40, monthlyGenerationKwh: 1200, yearlyGenerationKwh: 14600, roofAreaSqFt: 800, annualSavingInr: 116800, paybackYears: 4.195205479452055, co2ReductionTonnesPerYear: 10.22 },
    { systemSizeKw: 11, estimatedCostInr: 530000, panelCount: 20, inverterCapacityKw: 11, dailyGenerationKwh: 44, monthlyGenerationKwh: 1320, yearlyGenerationKwh: 16060, roofAreaSqFt: 880, annualSavingInr: 128480, paybackYears: 4.125155666251556, co2ReductionTonnesPerYear: 11.242 },
    { systemSizeKw: 12, estimatedCostInr: 570000, panelCount: 22, inverterCapacityKw: 12, dailyGenerationKwh: 48, monthlyGenerationKwh: 1440, yearlyGenerationKwh: 17520, roofAreaSqFt: 960, annualSavingInr: 140160, paybackYears: 4.066780821917808, co2ReductionTonnesPerYear: 12.264 },
    { systemSizeKw: 13, estimatedCostInr: 610000, panelCount: 24, inverterCapacityKw: 13, dailyGenerationKwh: 52, monthlyGenerationKwh: 1560, yearlyGenerationKwh: 18980, roofAreaSqFt: 1040, annualSavingInr: 151840, paybackYears: 4.017386722866175, co2ReductionTonnesPerYear: 13.286 },
    { systemSizeKw: 14, estimatedCostInr: 650000, panelCount: 26, inverterCapacityKw: 14, dailyGenerationKwh: 56, monthlyGenerationKwh: 1680, yearlyGenerationKwh: 20440, roofAreaSqFt: 1120, annualSavingInr: 163520, paybackYears: 3.97504892367906, co2ReductionTonnesPerYear: 14.308 },
    { systemSizeKw: 15, estimatedCostInr: 690000, panelCount: 28, inverterCapacityKw: 15, dailyGenerationKwh: 60, monthlyGenerationKwh: 1800, yearlyGenerationKwh: 21900, roofAreaSqFt: 1200, annualSavingInr: 175200, paybackYears: 3.938356164383562, co2ReductionTonnesPerYear: 15.33 },
    { systemSizeKw: 16, estimatedCostInr: 730000, panelCount: 30, inverterCapacityKw: 16, dailyGenerationKwh: 64, monthlyGenerationKwh: 1920, yearlyGenerationKwh: 23360, roofAreaSqFt: 1280, annualSavingInr: 186880, paybackYears: 3.90625, co2ReductionTonnesPerYear: 16.352 },
    { systemSizeKw: 17, estimatedCostInr: 770000, panelCount: 31, inverterCapacityKw: 17, dailyGenerationKwh: 68, monthlyGenerationKwh: 2040, yearlyGenerationKwh: 24820, roofAreaSqFt: 1360, annualSavingInr: 198560, paybackYears: 3.877921031426269, co2ReductionTonnesPerYear: 17.374 },
    { systemSizeKw: 18, estimatedCostInr: 810000, panelCount: 33, inverterCapacityKw: 18, dailyGenerationKwh: 72, monthlyGenerationKwh: 2160, yearlyGenerationKwh: 26280, roofAreaSqFt: 1440, annualSavingInr: 210240, paybackYears: 3.852739726027397, co2ReductionTonnesPerYear: 18.396 },
    { systemSizeKw: 19, estimatedCostInr: 850000, panelCount: 35, inverterCapacityKw: 19, dailyGenerationKwh: 76, monthlyGenerationKwh: 2280, yearlyGenerationKwh: 27740, roofAreaSqFt: 1520, annualSavingInr: 221920, paybackYears: 3.830209084354722, co2ReductionTonnesPerYear: 19.418 },
    { systemSizeKw: 20, estimatedCostInr: 890000, panelCount: 37, inverterCapacityKw: 20, dailyGenerationKwh: 80, monthlyGenerationKwh: 2400, yearlyGenerationKwh: 29200, roofAreaSqFt: 1600, annualSavingInr: 233600, paybackYears: 3.809931506849315, co2ReductionTonnesPerYear: 20.44 },
  ] satisfies SolarPackage[],
} as const;

export type SolarCalculatorConfig = typeof solarCalculatorConfig;
