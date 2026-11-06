# Calxo Calculator Resources

Open-source formulas, reusable calculation examples, and tests for practical calculators.

Calxo Calculator Resources is a collection of calculation utilities and reference implementations for developers who want to understand, test, or integrate common calculations into their own applications.

Website: [Calxo AI](https://calxo.ai/)

## Why these implementations exist

These implementations are designed for developers who need transparent, testable calculation logic. Calxo.ai provides interactive versions of selected calculations for users who prefer to work through a web interface.

## Scope

The JavaScript package includes seven standalone functions for percentages, compound interest, length and speed conversion, temperature conversion, and Mach conversion with an explicit speed-of-sound input. It has no third-party dependencies.

| Function | Formula or behavior | Live Calxo tool |
| --- | --- | --- |
| `percentageOf(percentage, value)` | `percentage / 100 × value` | [Try the online percentage calculator](https://calxo.ai/percentage-calculator) |
| `percentageChange(oldValue, newValue)` | `(new − old) / old × 100`; rejects a zero baseline | [Calculate percentage change online](https://calxo.ai/percentage-change-calculator) |
| `compoundInterest(options)` | `P × (1 + r/n)^(n×t)` with fixed principal and rate | [Explore the compound interest calculator](https://calxo.ai/compound-interest-calculator) |
| `convertLength(value, fromUnit, toUnit)` | Metric, customary and nautical lengths; 1 nmi = 1.852 km | [Convert nautical miles to kilometers](https://calxo.ai/tools/nautical-miles-to-kilometers) |
| `convertSpeed(value, fromUnit, toUnit)` | Metric, customary and nautical speed units | [Convert yards per second to miles per hour](https://calxo.ai/tools/yards-per-second-to-miles-per-hour) |
| `machToKilometersPerSecond(mach, speedOfSoundMetersPerSecond)` | `Mach × local sound speed / 1000`; caller supplies sound speed | [Explore Mach to kilometers per second](https://calxo.ai/tools/mach-to-kilometers-per-second) |
| `convertTemperature(value, fromUnit, toUnit)` | Celsius, Fahrenheit and Kelvin; rejects below absolute zero | [Explore Calxo's unit converters](https://calxo.ai/unit-converters) |

These links point to the matching live calculator pages verified during preparation. The repository formulas are independent reference implementations and are not imported from Calxo's production application.

For worked unit-cancellation examples and the assumptions behind Mach conversion, see [conversion examples](docs/conversion-examples.md).

## More interactive calculators on Calxo AI

These selected tools are available on the website. Their complete implementations are not included in this source package.

| Live tool | Use case |
| --- | --- |
| [BMI calculator](https://calxo.ai/bmi-calculator) | Explore BMI inputs and the accompanying age and sex guidance. BMI is a screening metric, not a diagnosis. |
| [Calories burned on stairs](https://calxo.ai/calories-burned-stairs-calculator) | Estimate activity calories for climbing, descending, or mixed stair activity. |
| [Drive time calculator](https://calxo.ai/drive-time-calculator) | Estimate journey time from entered distance, average speed and planned stops. |
| [Ideal weight calculator](https://calxo.ai/ideal-weight-calculator) | Compare formula-based weight estimates and their limitations. |
| [Test score percentile calculator](https://calxo.ai/test-score-percentile-calculator) | Estimate a normal-distribution percentile from a score, mean and standard deviation. |
| [EMI calculator](https://calxo.ai/emi-calculator) | Estimate fixed monthly loan payments and interest. |
| [Currency converter](https://calxo.ai/currency-converter) | Convert currencies using the live tool's displayed exchange rates. |
| [Days from today calculator](https://calxo.ai/days-from-today-calculator) | Find the calendar date a specified number of days from today. |

## Install and use

Supports Node.js 22 and 24. Install the [npm package](https://www.npmjs.com/package/@rakeshvetal/calculator-resources):

```sh
npm install @rakeshvetal/calculator-resources
```

```js
import { convertLength, convertSpeed } from "@rakeshvetal/calculator-resources";

convertLength(10, "nmi", "km"); // approximately 18.52
convertSpeed(22, "yd/s", "mph"); // approximately 45
```

For development, use a checkout of this repository.

From the repository root, import the standalone source directly. No third-party runtime dependencies are needed.

```js
import {
  compoundInterest,
  convertLength,
  convertSpeed,
  convertTemperature,
  machToKilometersPerSecond,
  percentageChange,
  percentageOf
} from "./javascript/src/index.js";

percentageOf(15, 240); // 36
percentageChange(80, 100); // 25
compoundInterest({ principal: 10_000, annualRatePercent: 8, years: 5, compoundsPerYear: 12 });
convertLength(1, "mi", "km"); // 1.609344
convertLength(10, "nmi", "km"); // approximately 18.52
convertSpeed(22, "yd/s", "mph"); // approximately 45
machToKilometersPerSecond(2, 343); // approximately 0.686 km/s, assuming sound travels at 343 m/s
convertTemperature(32, "F", "C"); // approximately 0
```

To run the example from a checkout:

```sh
cd javascript
npm ci
cd ..
node examples/usage.js
```

## Supported units and inputs

| Function | Supported units or input domain |
| --- | --- |
| `convertLength` | `m`, `km`, `cm`, `mm`, `in`, `ft`, `yd`, `mi`, `nmi`; non-negative length |
| `convertSpeed` | `m/s`, `km/h`, `mph`, `ft/s`, `yd/s`, `kn`; non-negative speed magnitude |
| `convertTemperature` | `C`, `F`, `K`; temperature at or above absolute zero |
| `machToKilometersPerSecond` | Non-negative Mach number and positive sound speed in meters/second; returns kilometers/second |

Every numeric input must be finite. Unit symbols are case-sensitive. Invalid values, unsupported units, and non-finite results throw `TypeError` or `RangeError`. Mach is not a fixed speed unit: the example's 343 m/s is an assumption, and other conditions require a different sound-speed input.

`annualRatePercent` uses percentage points (enter `8` for 8%). Compound interest accepts only non-negative principal, rate, and duration; a zero rate or zero duration returns the principal unchanged. `compoundsPerYear` defaults to 12 and must be a positive integer. `years` can be fractional. Percentage change uses the signed old value as denominator; an old value of zero is rejected.

## Precision and limitations

Calculations return unrounded IEEE 754 numbers. Round only when displaying results; see [rounding and precision](docs/rounding-and-precision.md). The library is not a decimal accounting package. The compound-interest function models one starting principal at a fixed nominal annual rate, without deposits, withdrawals, fees, taxes, inflation, or variable returns. See [formula details](docs/formulas.md) and [known limitations](docs/limitations.md).

## Test

```sh
cd javascript
npm ci
npm run check
npm test
```

Tests use Node's built-in test runner; no API keys, services, or secrets are required. GitHub Actions runs syntax checks, tests and the example on Node.js 22 and 24 for pushes to `main` and pull requests.

## Contributing

Bug reports, corrected formulas, clearer assumptions, and focused test cases are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening an issue or pull request. Please explain the formula and provide reproducible input/output examples for calculation changes.

## License and citation

Code is released under the [MIT License](LICENSE). See [CITATION.cff](CITATION.cff) for citation metadata. The license applies to this standalone repository only; it does not apply to Calxo.ai's website or private production source.

## Related formula data

The independently authored [conversion reference dataset](datasets/conversion-reference/README.md) includes 612 synthetic length and speed cases, exact rational expected values, primary definition references, and a runnable Python notebook. It is a compact teaching and validation resource, separate from the wider formula archive below.

The [npm release](https://www.npmjs.com/package/@rakeshvetal/calculator-resources) is version 0.1.0. The [Kaggle dataset](https://www.kaggle.com/datasets/rakeshvetal83/calxo-unit-conversion-reference-cases) provides the conversion reference data and MIT notebook download. A separately hosted [executed Kaggle notebook](https://www.kaggle.com/code/rakeshvetal83/validate-calxo-unit-conversions) is available under Apache 2.0. See [npm release instructions](docs/npm-release.md) and [Kaggle release instructions](docs/kaggle-release.md).

The companion [Calxo Formula Library](https://github.com/tigerman83/calxo-formula-library) contains structured formula data, worked examples and data dictionaries. That dataset has its own reuse terms; this repository supplies independently written executable examples under MIT.
