# Worked conversion examples

These examples run entirely from the standalone JavaScript source. Results are unrounded numbers; the displayed examples below use appropriate decimal precision.

## Nautical miles to kilometers

Use the international nautical mile, which is exactly 1,852 meters. It differs from the statute mile, which is 1,609.344 meters.

```js
import { convertLength } from "../javascript/src/index.js";

convertLength(10, "nmi", "km"); // approximately 18.52
convertLength(18.52, "km", "nmi"); // approximately 10
```

Unit cancellation: `10 nmi × 1852 m/nmi × 1 km/1000 m = 18.52 km`.

Use the [online nautical-mile converter](https://calxo.ai/tools/nautical-miles-to-kilometers) for an interactive check. This is a distance conversion, not route planning or navigation advice.

## Yards per second to miles per hour

One mile contains 1,760 yards; an hour contains 3,600 seconds.

```js
import { convertSpeed } from "../javascript/src/index.js";

convertSpeed(22, "yd/s", "mph"); // approximately 45
convertSpeed(36, "km/h", "m/s"); // approximately 10
convertSpeed(10, "kn", "km/h"); // approximately 18.52
```

Unit cancellation: `22 yd/s × 3600 s/h × 1 mi/1760 yd = 45 mph`.

The [online yards/second to mph converter](https://calxo.ai/tools/yards-per-second-to-miles-per-hour) lets readers compare other inputs. The `kn` symbol means knots: nautical miles per hour.

## Mach and the speed of sound

Mach number is a ratio of an object's speed to the local speed of sound. The applicable sound speed depends on the medium and conditions, so it must be supplied explicitly.

```js
import { machToKilometersPerSecond } from "../javascript/src/index.js";

machToKilometersPerSecond(2, 343); // approximately 0.686 km/s
machToKilometersPerSecond(2, 300); // approximately 0.6 km/s
```

For the first example: `2 × 343 m/s × 1 km/1000 m = 0.686 km/s`. The second demonstrates why a fixed universal Mach conversion would be misleading. The 343 m/s value is an example assumption, not a sound speed computed by this library.

For interactive comparison, use the [Calxo Mach converter](https://calxo.ai/tools/mach-to-kilometers-per-second) and review that page's assumptions.

## Run the complete example

From the repository root:

```sh
node examples/usage.js
```

The code snippets above use paths relative to a script stored in `examples/`. See [rounding and precision](rounding-and-precision.md) before using rounded output in later calculations.

Definition references: [NOAA: nautical miles and knots](https://oceanservice.noaa.gov/facts/nautical-mile-knot.html) and [NASA Glenn: Mach number](https://www.grc.nasa.gov/www/k-12/airplane/mach.html).
