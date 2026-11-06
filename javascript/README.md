# Calxo Calculator Resources

Seven dependency-free JavaScript functions for percentages, compound interest, length, speed, temperature, and Mach conversion. Supports Node.js 22 and 24. ESM only.

## Installation

```sh
npm install @rakeshvetal/calculator-resources
```

For source development and tests, use the [GitHub repository](https://github.com/tigerman83/calxo-calculator-resources#install-and-use).

```js
import {
  percentageOf, percentageChange, compoundInterest,
  convertLength, convertSpeed, convertTemperature,
  machToKilometersPerSecond
} from "@rakeshvetal/calculator-resources";

percentageOf(15, 240); // 36
percentageChange(80, 100); // 25
compoundInterest({ principal: 1000, annualRatePercent: 5, years: 2, compoundsPerYear: 1 }); // 1102.5
convertLength(10, "nmi", "km"); // approximately 18.52
convertSpeed(22, "yd/s", "mph"); // approximately 45
convertTemperature(-10, "C", "F"); // approximately 14
machToKilometersPerSecond(2, 343); // approximately 0.686 km/s, assuming sound speed 343 m/s
```

## API and inputs

| Function | Inputs and result |
| --- | --- |
| `percentageOf(percentage, value)` | Returns `percentage / 100 * value`. Negative finite inputs are permitted. |
| `percentageChange(oldValue, newValue)` | Returns `(newValue - oldValue) / oldValue * 100`. Rejects zero baseline. Uses the signed denominator for negative baselines. |
| `compoundInterest({principal, annualRatePercent, years, compoundsPerYear = 12})` | Returns future balance, including principal. Principal, nominal annual percentage rate and years must be non-negative; frequency is a positive integer. Zero rate or duration returns principal. Fractional years are permitted. |
| `convertLength(value, fromUnit, toUnit)` | Non-negative lengths. Units: `m`, `km`, `cm`, `mm`, `in`, `ft`, `yd`, `mi`, `nmi`. |
| `convertSpeed(value, fromUnit, toUnit)` | Non-negative speed magnitudes. Units: `m/s`, `km/h`, `mph`, `ft/s`, `yd/s`, `kn`. |
| `convertTemperature(value, fromUnit, toUnit)` | Units: `C`, `F`, `K`. Rejects temperatures below absolute zero. |
| `machToKilometersPerSecond(mach, speedOfSoundMetersPerSecond)` | Non-negative Mach and explicitly supplied positive sound speed. Returns km/s. |

Numeric inputs must be finite numbers. Unit symbols are case-sensitive. Invalid inputs throw `TypeError` or `RangeError`; non-finite outputs throw `RangeError`.

## Precision and scope

Results are unrounded IEEE 754 numbers. Round at display time. This is not a decimal accounting library. Compound interest models a single fixed principal with no contributions, withdrawals, tax, fees or changing rate. Mach requires an assumption about local sound speed; 343 m/s is an example, not a universal constant. The library does not estimate that sound speed.

## Interactive tools and sources

For readers who prefer a web interface, Calxo provides a [nautical miles to kilometers converter](https://calxo.ai/tools/nautical-miles-to-kilometers), a [yards per second to mph converter](https://calxo.ai/tools/yards-per-second-to-miles-per-hour), and a [compound interest calculator](https://calxo.ai/compound-interest-calculator). These functions are independent reference implementations, not the website's production source.

Definition references: [NOAA nautical miles and knots](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html), [NIST conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors), and [NASA Mach number](https://www.grc.nasa.gov/www/k-12/airplane/mach.html).

## License and development

MIT. Copyright 2026 Calxo AI. Source, automated tests and contribution instructions are in the [GitHub repository](https://github.com/tigerman83/calxo-calculator-resources). The license covers this standalone code; Calxo's separate formula dataset has its own reuse terms.
