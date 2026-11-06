"""Create and execute the portable, standard-library-only reference notebook."""
import contextlib
import io
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
cells = []

def markdown(text):
    cells.append({"cell_type": "markdown", "id": f"cell-{len(cells)}", "metadata": {}, "source": text.splitlines(keepends=True)})

def code(text):
    cells.append({"cell_type": "code", "id": f"cell-{len(cells)}", "metadata": {}, "source": text.splitlines(keepends=True), "execution_count": None, "outputs": []})

markdown("""# Validate length and speed conversions with rational reference values

Calxo AI, 2026-11-05. MIT license.

This notebook uses 612 synthetic reference cases, exact rational answers, and only Python's standard library. It compares a separate Python conversion implementation with the reference data, demonstrates an incorrect factor, and shows why presentation rounding belongs at the end.

These examples are authored by Calxo. They are not measured observations or a complete certification suite. See the dataset README for sources, coverage and limitations.
""")
code('''import csv
import math
from collections import Counter
from fractions import Fraction
from pathlib import Path

local_paths = [Path("conversion-cases.csv"), Path("datasets/conversion-reference/conversion-cases.csv")]
data_path = next((p for p in local_paths if p.is_file()), None)
if data_path is None:
    matches = list(Path("/kaggle/input").rglob("conversion-cases.csv")) if Path("/kaggle/input").exists() else []
    if len(matches) != 1:
        raise FileNotFoundError("Attach the Calxo conversion dataset, or run beside conversion-cases.csv. Multiple matches require selecting one explicitly.")
    data_path = matches[0]
with data_path.open(newline="", encoding="utf-8") as stream:
    rows = list(csv.DictReader(stream))
assert len(rows) == 612
assert len({row["case_id"] for row in rows}) == len(rows)
print("Cases:", len(rows))
print("Coverage:", dict(Counter(row["quantity"] for row in rows)))
''')
markdown("""## Check a separate implementation

Each factor is expressed in meters or meters/second. NIST documents international customary conversions; NOAA explains nautical miles and knots. The reference answers were produced with rational arithmetic rather than by running the JavaScript library. Both implementations still depend on the same unit definitions, so this is not evidence of independent standards certification.
""")
code('''length_factors = {"m": 1, "km": 1000, "cm": 0.01, "mm": 0.001, "in": 0.0254, "ft": 0.3048, "yd": 0.9144, "mi": 1609.344, "nmi": 1852}
speed_factors = {"m/s": 1, "km/h": 1 / 3.6, "mph": 0.44704, "ft/s": 0.3048, "yd/s": 0.9144, "kn": 1852 / 3600}

def convert_case(row):
    factors = length_factors if row["quantity"] == "length" else speed_factors
    return float(row["input_value"]) * factors[row["from_unit"]] / factors[row["to_unit"]]

failures = []
for row in rows:
    expected_fraction = Fraction(int(row["expected_numerator"]), int(row["expected_denominator"]))
    expected = float(expected_fraction)
    assert float(row["expected_value"]) == expected
    if not math.isclose(convert_case(row), expected, rel_tol=float(row["relative_tolerance"]), abs_tol=float(row["absolute_tolerance"])):
        failures.append(row["case_id"])
assert not failures, failures
print("Independent Python implementation passed all 612 cases.")
''')
markdown("""## Detect a plausible mistake

Using the statute-mile factor 1.609344 for nautical miles produces an incorrect answer. The case below is a small check that distinguishes the two units.
""")
code('''case = next(row for row in rows if row["from_unit"] == "nmi" and row["to_unit"] == "km" and float(row["input_value"]) == 1)
expected = Fraction(int(case["expected_numerator"]), int(case["expected_denominator"]))
wrong_result = 1.609344
assert not math.isclose(wrong_result, float(expected), rel_tol=float(case["relative_tolerance"]), abs_tol=float(case["absolute_tolerance"]))
print("One nautical mile, exact rational kilometers:", expected)
print("Correct:", float(expected), "km; incorrect statute-mile result:", wrong_result, "km")
''')
markdown("""## Round for display

The exact conversion definition does not make a measured distance exact. Keep the unrounded calculation when chaining operations, then choose display precision to suit the input.
""")
code('''distance = Fraction(1, 10) * Fraction(1852, 1000)
print("0.1 nmi in kilometers:", float(distance))
print("Display to two decimal places:", f"{float(distance):.2f}")
print("Back-conversion from rounded display:", float(Fraction("0.19") / Fraction(1852, 1000)), "nmi")
''')
markdown("""## Explore and reproduce

For interactive examples, use Calxo's [nautical miles to kilometers converter](https://calxo.ai/tools/nautical-miles-to-kilometers). The [Formula Library](https://calxo.ai/formula-library) provides wider formula context; the [GitHub project](https://github.com/tigerman83/calxo-calculator-resources) includes a standalone JavaScript implementation and tests.

References: [NIST conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors) and [NOAA nautical miles and knots](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html).

This small deterministic set has no train/test split and is not a machine-learning performance benchmark. It excludes invalid inputs and extreme magnitudes. MIT applies to these authored examples and notebook, not to Calxo's separately licensed Formula Library archive.
""")

namespace = {}
import os
os.chdir(root)
count = 0
for cell in cells:
    if cell["cell_type"] != "code":
        continue
    count += 1
    capture = io.StringIO()
    with contextlib.redirect_stdout(capture):
        exec(compile("".join(cell["source"]), f"notebook-cell-{count}", "exec"), namespace)
    cell["execution_count"] = count
    cell["outputs"] = [{"output_type": "stream", "name": "stdout", "text": capture.getvalue().splitlines(keepends=True)}]
notebook = {"cells": cells, "metadata": {"kernelspec": {"display_name": "Python 3", "language": "python", "name": "python3"}, "language_info": {"name": "python"}}, "nbformat": 4, "nbformat_minor": 5}
path = root / "datasets/conversion-reference/validate-conversions.ipynb"
path.write_text(json.dumps(notebook, indent=2) + "\n", encoding="utf-8")
print(f"Created notebook and executed {count} code cells successfully.")
