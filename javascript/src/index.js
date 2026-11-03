const LENGTH_TO_METERS = Object.freeze({
  m: 1,
  km: 1_000,
  cm: 0.01,
  mm: 0.001,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1_609.344,
  nmi: 1_852
});

const SPEED_TO_METERS_PER_SECOND = Object.freeze({
  "m/s": 1,
  "km/h": 1 / 3.6,
  mph: 0.44704,
  "ft/s": 0.3048,
  "yd/s": 0.9144,
  kn: 1_852 / 3_600
});

const TEMPERATURE_UNITS = new Set(["C", "F", "K"]);

function finiteNumber(name, value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new TypeError(`${name} must be a finite number.`);
  }
}

function finiteResult(name, value) {
  if (!Number.isFinite(value)) {
    throw new RangeError(`${name} result is outside the finite number range.`);
  }
  return value;
}

/** Return percentage% of value, without rounding the result. */
export function percentageOf(percentage, value) {
  finiteNumber("percentage", percentage);
  finiteNumber("value", value);
  return finiteResult("percentageOf", (percentage / 100) * value);
}

/** Return percentage change from oldValue to newValue; oldValue cannot be zero. */
export function percentageChange(oldValue, newValue) {
  finiteNumber("oldValue", oldValue);
  finiteNumber("newValue", newValue);
  if (oldValue === 0) {
    throw new RangeError("oldValue must not be zero for percentage change.");
  }
  return finiteResult("percentageChange", ((newValue - oldValue) / oldValue) * 100);
}

/**
 * Calculate a fixed principal's future value with nominal annual compounding.
 * annualRatePercent is expressed as a percentage (for example, 8 means 8%).
 */
export function compoundInterest({ principal, annualRatePercent, years, compoundsPerYear = 12 }) {
  finiteNumber("principal", principal);
  finiteNumber("annualRatePercent", annualRatePercent);
  finiteNumber("years", years);
  finiteNumber("compoundsPerYear", compoundsPerYear);

  if (principal < 0) throw new RangeError("principal must be zero or greater.");
  if (annualRatePercent < 0) throw new RangeError("annualRatePercent must be zero or greater.");
  if (years < 0) throw new RangeError("years must be zero or greater.");
  if (!Number.isInteger(compoundsPerYear) || compoundsPerYear <= 0) {
    throw new RangeError("compoundsPerYear must be a positive integer.");
  }

  if (principal === 0 || annualRatePercent === 0 || years === 0) return principal;

  const periods = compoundsPerYear * years;
  const periodicRate = (annualRatePercent / 100) / compoundsPerYear;
  return finiteResult("compoundInterest", principal * (1 + periodicRate) ** periods);
}

/** Convert a non-negative length between the units documented in README.md. */
export function convertLength(value, fromUnit, toUnit) {
  finiteNumber("value", value);
  if (value < 0) throw new RangeError("value must be zero or greater for a length.");
  if (!Object.hasOwn(LENGTH_TO_METERS, fromUnit)) {
    throw new RangeError(`Unsupported source length unit: ${String(fromUnit)}.`);
  }
  if (!Object.hasOwn(LENGTH_TO_METERS, toUnit)) {
    throw new RangeError(`Unsupported target length unit: ${String(toUnit)}.`);
  }

  const result = value * (LENGTH_TO_METERS[fromUnit] / LENGTH_TO_METERS[toUnit]);
  return finiteResult("convertLength", result);
}

/** Convert a non-negative speed magnitude between documented fixed units. */
export function convertSpeed(value, fromUnit, toUnit) {
  finiteNumber("value", value);
  if (value < 0) throw new RangeError("value must be zero or greater for a speed.");
  if (typeof fromUnit !== "string" || !Object.hasOwn(SPEED_TO_METERS_PER_SECOND, fromUnit)) {
    throw new RangeError(`Unsupported source speed unit: ${String(fromUnit)}.`);
  }
  if (typeof toUnit !== "string" || !Object.hasOwn(SPEED_TO_METERS_PER_SECOND, toUnit)) {
    throw new RangeError(`Unsupported target speed unit: ${String(toUnit)}.`);
  }

  const result = value * (SPEED_TO_METERS_PER_SECOND[fromUnit] / SPEED_TO_METERS_PER_SECOND[toUnit]);
  return finiteResult("convertSpeed", result);
}

/** Convert Mach to km/s using a caller-supplied positive speed of sound in m/s. */
export function machToKilometersPerSecond(mach, speedOfSoundMetersPerSecond) {
  finiteNumber("mach", mach);
  finiteNumber("speedOfSoundMetersPerSecond", speedOfSoundMetersPerSecond);
  if (mach < 0) throw new RangeError("mach must be zero or greater.");
  if (speedOfSoundMetersPerSecond <= 0) {
    throw new RangeError("speedOfSoundMetersPerSecond must be greater than zero.");
  }

  return finiteResult("machToKilometersPerSecond", mach * (speedOfSoundMetersPerSecond / 1_000));
}

/** Convert between Celsius (C), Fahrenheit (F), and Kelvin (K). */
export function convertTemperature(value, fromUnit, toUnit) {
  finiteNumber("value", value);
  if (!TEMPERATURE_UNITS.has(fromUnit)) {
    throw new RangeError(`Unsupported source temperature unit: ${String(fromUnit)}.`);
  }
  if (!TEMPERATURE_UNITS.has(toUnit)) {
    throw new RangeError(`Unsupported target temperature unit: ${String(toUnit)}.`);
  }

  const celsius = fromUnit === "C" ? value : fromUnit === "F" ? ((value - 32) * 5) / 9 : value - 273.15;
  if (celsius < -273.15) throw new RangeError("Temperature cannot be below absolute zero.");

  const result = toUnit === "C" ? celsius : toUnit === "F" ? (celsius * 9) / 5 + 32 : celsius + 273.15;
  return finiteResult("convertTemperature", result);
}
