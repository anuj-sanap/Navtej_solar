from pathlib import Path
import ast
import re
import openpyxl

workbook_path = Path("public/Solar_Calculator_1_to_20kW.xlsx")
config_path = Path("src/lib/calculator/config.ts")

workbook = openpyxl.load_workbook(workbook_path, data_only=True)
sheet = workbook["Solar Calculator"]
rows = list(sheet.iter_rows(min_row=2, values_only=True))
config_text = config_path.read_text(encoding="utf-8")
row_matches = re.findall(r"\{ systemSizeKw: .*? co2ReductionTonnesPerYear: .*? \},", config_text)

if len(rows) != 20 or len(row_matches) != 20:
    raise SystemExit(f"Expected 20 workbook and config rows, found {len(rows)} and {len(row_matches)}.")

keys = [
    "systemSizeKw", "estimatedCostInr", "panelCount", "inverterCapacityKw",
    "dailyGenerationKwh", "monthlyGenerationKwh", "yearlyGenerationKwh",
    "roofAreaSqFt", "annualSavingInr", "paybackYears", "co2ReductionTonnesPerYear",
]

for workbook_row, config_row in zip(rows, row_matches):
    values = [ast.literal_eval(value) for value in re.findall(r"(?:systemSizeKw|estimatedCostInr|panelCount|inverterCapacityKw|dailyGenerationKwh|monthlyGenerationKwh|yearlyGenerationKwh|roofAreaSqFt|annualSavingInr|paybackYears|co2ReductionTonnesPerYear): ([^,}]+)", config_row)]
    expected = dict(zip(keys, values))
    actual = dict(zip(keys, workbook_row))
    for key in keys:
        if actual[key] != expected[key]:
            raise SystemExit(f"Mismatch at {key} for {actual['systemSizeKw']} kW: workbook={actual[key]!r}, config={expected[key]!r}")

print("Verified all 20 system-size rows against the Excel workbook.")
