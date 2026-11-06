# Calxo Unit Conversion Reference Cases

Version 1.0.0, authored 2026-11-05 by Calxo AI.

This small synthetic reference dataset contains **612 length and speed conversion cases**. It is intended for teaching dimensional analysis, checking conversion implementations, and comparing floating-point results with exact rational answers. It is not observed navigation, travel, sports or customer data.

## Coverage and method

There are 432 length cases (9 source units x 8 different destinations x 6 inputs) and 180 speed cases (6 source units x 5 different destinations x 6 inputs). Inputs are 0, 0.1, 0.5, 1, 22 and 100. Identity conversions are omitted.

Length symbols: `m`, `km`, `cm`, `mm`, `in`, `ft`, `yd`, `mi`, `nmi`. Speed symbols: `m/s`, `km/h`, `mph`, `ft/s`, `yd/s`, `kn`.

The generator uses integer ratios and BigInt arithmetic to derive expected values independently of the library being checked. The exact answer is `expected_numerator / expected_denominator`. `expected_value` is only its binary floating-point approximation. Accept a numeric result when `abs(actual - expected) <= max(absolute_tolerance, relative_tolerance * abs(expected))`.

Definitions include 1 international nautical mile = 1852 m, 1 international yard = 0.9144 m, 1 international foot = 0.3048 m, 1 statute mile = 1609.344 m, and 1 knot = 1 nautical mile per hour. Hours have 3600 seconds. No US survey feet or historical miles are used.

Primary references: [NIST conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors) and [NOAA nautical miles and knots](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html). These references describe unit definitions; the generated examples are Calxo's work and are not endorsed by NIST or NOAA.

## Files and use

- `conversion-cases.csv`: portable tabular distribution.
- `conversion-cases.json`: the same cases as JSON; rational integer fields are strings.
- `data-dictionary.json`: field definitions.
- `validate-conversions.ipynb`: standard-library-only Python notebook. Locates the dataset locally or under Kaggle's `/kaggle/input` directory. Demonstrates validation, precision and an intentionally incorrect nautical-mile factor.
- `LICENSE`: MIT terms for this independently authored package, including the generated case collection and notebook.

The matching [open-source JavaScript library](https://github.com/tigerman83/calxo-calculator-resources) provides executable implementations. Calxo's [Formula Library](https://calxo.ai/formula-library) supplies wider formula context. For interactive exploration, try the [nautical miles to kilometers converter](https://calxo.ai/tools/nautical-miles-to-kilometers) or [yards per second to mph converter](https://calxo.ai/tools/yards-per-second-to-miles-per-hour).

## Limitations and licensing

This is a compact set of deterministic examples, not a comprehensive numerical test suite or an independent standards certification. Related rows share definitions, so a random train/test split would leak those relationships; this dataset is not suitable for claiming broad machine-learning generalization. It excludes negative values, invalid units, extreme magnitudes, temperatures and condition-dependent Mach conversions. Tolerances are for these example magnitudes and are not measurement uncertainties.

MIT applies to this package only. It does not relicense Calxo's separate archived Formula Library dataset, website, or referenced standards. Corrections can be reported in the public GitHub repository.

Reproduce from the repository root with `node scripts/build-conversion-dataset.mjs`. Run the JavaScript comparison with `node --test javascript/tests/conversion-dataset.test.js`.
