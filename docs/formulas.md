# Formula reference

All functions are in `javascript/src/index.js`. Inputs and outputs are JavaScript numbers. The library does not round results.

## Percentage of a value

`percentageOf(p, x) = (p / 100) × x`

Example: 15% of 240 is `(15 / 100) × 240 = 36`.

## Percentage change

`percentageChange(old, new) = ((new − old) / old) × 100`

The signed old value is the denominator, matching the standard percentage-change convention used by the corresponding Calxo tool. A zero baseline is undefined and rejected.

Example: change from 80 to 100 is `((100 − 80) / 80) × 100 = 25%`.

## Compound interest

`A = P × (1 + r / n)^(n × t)`

- `P`: starting principal
- `r`: nominal annual rate as a decimal (`annualRatePercent / 100`)
- `n`: compounding periods per year
- `t`: term in years
- `A`: future value before display rounding

Example: 10,000 at 8% nominal annual interest, compounded monthly for five years, is approximately 14,898.457083.

The implementation assumes a fixed rate and principal, with no contributions or withdrawals. Principal, annual rate and duration must be non-negative. A zero principal returns zero; a zero rate or zero duration returns the principal. Compounding frequency must still be a positive integer.

## Length conversion

Length values are converted through meters: `targetValue = sourceValue × sourceToMeters / targetToMeters`.

Exact factors used: 1 km = 1,000 m; 1 cm = 0.01 m; 1 mm = 0.001 m; 1 in = 0.0254 m; 1 ft = 0.3048 m; 1 yd = 0.9144 m; 1 mi = 1,609.344 m; 1 nmi = 1,852 m.

For example, `convertLength(10, "nmi", "km")` returns approximately 18.52. Compare values in the [nautical miles to kilometers converter](https://calxo.ai/tools/nautical-miles-to-kilometers).

## Speed conversion

`targetValue = sourceValue × sourceToMetersPerSecond / targetToMetersPerSecond`

Supported factors in meters/second: `m/s` = 1; `km/h` = 1/3.6; `mph` = 0.44704; `ft/s` = 0.3048; `yd/s` = 0.9144; `kn` = 1,852/3,600.

For example, 22 yards/second is 45 miles/hour. One knot is one nautical mile/hour. These functions return speed magnitudes and reject negative input. Try different values with the [yards per second to mph converter](https://calxo.ai/tools/yards-per-second-to-miles-per-hour).

## Mach to kilometers per second

`speed in km/s = Mach number × supplied speed of sound in m/s / 1000`

For example, `machToKilometersPerSecond(2, 343)` returns approximately 0.686 km/s. If the applicable speed of sound is 300 m/s instead, the same Mach number gives 0.6 km/s. The function requires a positive explicit speed-of-sound input and does not infer temperature, altitude, pressure or medium. Check the assumptions on the [interactive Mach converter](https://calxo.ai/tools/mach-to-kilometers-per-second) when comparing results.

Definitions: [NOAA on nautical miles and knots](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html); [NASA Glenn on Mach number and sound speed](https://www.grc.nasa.gov/www/k-12/airplane/mach.html). Only the definitions and underlying mathematical relationships are used; no source implementation is reproduced.

## Temperature conversion

The implementation converts the input to Celsius and then to the target unit:

- `C = (F − 32) × 5 / 9`
- `C = K − 273.15`
- `F = C × 9 / 5 + 32`
- `K = C + 273.15`

Temperatures below absolute zero are rejected.
