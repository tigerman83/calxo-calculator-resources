import test from "node:test";
import assert from "node:assert/strict";
import {
  compoundInterest,
  convertLength,
  convertSpeed,
  convertTemperature,
  machToKilometersPerSecond,
  percentageChange,
  percentageOf
} from "../src/index.js";

const closeTo = (actual, expected, tolerance = 1e-10) => {
  assert.ok(Math.abs(actual - expected) <= tolerance, `${actual} is not within ${tolerance} of ${expected}`);
};

test("percentageOf handles ordinary, zero, and negative values", () => {
  assert.equal(percentageOf(15, 240), 36);
  assert.equal(percentageOf(0, 240), 0);
  assert.equal(percentageOf(-10, 50), -5);
  assert.throws(() => percentageOf(Infinity, 1), TypeError);
  assert.throws(() => percentageOf(200, Number.MAX_VALUE), RangeError);
});

test("percentageChange uses the signed old value as the baseline and rejects zero", () => {
  assert.equal(percentageChange(80, 100), 25);
  assert.equal(percentageChange(100, 80), -20);
  assert.equal(percentageChange(-80, -100), 25);
  assert.throws(() => percentageChange(0, 10), RangeError);
});

test("compoundInterest calculates fixed-principal compounding without rounding", () => {
  closeTo(compoundInterest({ principal: 10_000, annualRatePercent: 8, years: 5, compoundsPerYear: 12 }), 14_898.45708306, 0.00001);
  assert.equal(compoundInterest({ principal: 500, annualRatePercent: 0, years: 20 }), 500);
  assert.equal(compoundInterest({ principal: 500, annualRatePercent: 8, years: 0 }), 500);
  assert.equal(compoundInterest({ principal: 500, annualRatePercent: 0, years: Number.MAX_VALUE }), 500);
  assert.equal(compoundInterest({ principal: 0, annualRatePercent: 1e308, years: 1e308 }), 0);
  assert.throws(() => compoundInterest({ principal: -1, annualRatePercent: 8, years: 1 }), RangeError);
  assert.throws(() => compoundInterest({ principal: 1, annualRatePercent: -1, years: 1 }), RangeError);
  assert.throws(() => compoundInterest({ principal: 1, annualRatePercent: 8, years: 1, compoundsPerYear: 0 }), RangeError);
  assert.throws(() => compoundInterest({ principal: 1, annualRatePercent: 8, years: 1, compoundsPerYear: 1.5 }), RangeError);
  assert.throws(() => compoundInterest({ principal: 1, annualRatePercent: 1e308, years: 1e308 }), RangeError);
});

test("convertLength supports documented metric and customary units", () => {
  assert.equal(convertLength(1, "mi", "km"), 1.609344);
  assert.equal(convertLength(1.5, "m", "cm"), 150);
  closeTo(convertLength(12, "in", "ft"), 1);
  assert.equal(convertLength(0, "m", "ft"), 0);
  assert.equal(convertLength(Number.MAX_VALUE, "mi", "mi"), Number.MAX_VALUE);
  assert.throws(() => convertLength(1, "m", "parsec"), RangeError);
  assert.throws(() => convertLength(-1, "m", "cm"), RangeError);
  assert.throws(() => convertLength(1, "parsec", "m"), RangeError);
  assert.throws(() => convertLength(NaN, "m", "cm"), TypeError);
});

test("nautical miles use the international 1,852 meter definition", () => {
  closeTo(convertLength(1, "nmi", "km"), 1.852);
  closeTo(convertLength(10, "nmi", "km"), 18.52);
  closeTo(convertLength(0.5, "nmi", "m"), 926);
  closeTo(convertLength(18.52, "km", "nmi"), 10);
  assert.equal(convertLength(0, "nmi", "km"), 0);
});

test("speed conversion checks familiar metric, customary and nautical equivalents", () => {
  closeTo(convertSpeed(22, "yd/s", "mph"), 45);
  closeTo(convertSpeed(60, "mph", "m/s"), 26.8224);
  closeTo(convertSpeed(36, "km/h", "m/s"), 10);
  closeTo(convertSpeed(10, "kn", "km/h"), 18.52);
  closeTo(convertSpeed(1, "ft/s", "m/s"), 0.3048);
  closeTo(convertSpeed(0.5, "yd/s", "m/s"), 0.4572);
  assert.equal(convertSpeed(0, "mph", "kn"), 0);
  assert.equal(convertSpeed(Number.MAX_VALUE, "mph", "mph"), Number.MAX_VALUE);
});

test("speed conversion round trips retain precision across supported units", () => {
  const units = ["m/s", "km/h", "mph", "ft/s", "yd/s", "kn"];
  for (const unit of units) {
    const converted = convertSpeed(12.345, "m/s", unit);
    closeTo(convertSpeed(converted, unit, "m/s"), 12.345);
  }
});

test("speed conversion rejects invalid values, unit names, and non-finite results", () => {
  assert.throws(() => convertSpeed(-1, "mph", "m/s"), RangeError);
  assert.throws(() => convertSpeed(NaN, "mph", "m/s"), TypeError);
  assert.throws(() => convertSpeed(Infinity, "mph", "m/s"), TypeError);
  assert.throws(() => convertSpeed("10", "mph", "m/s"), TypeError);
  assert.throws(() => convertSpeed(1, "mach", "m/s"), RangeError);
  assert.throws(() => convertSpeed(1, "m/s", "MPH"), RangeError);
  assert.throws(() => convertSpeed(1, "__proto__", "m/s"), RangeError);
  assert.throws(() => convertSpeed(Number.MAX_VALUE, "m/s", "km/h"), RangeError);
});

test("Mach conversion uses the explicit local speed of sound", () => {
  closeTo(machToKilometersPerSecond(2, 343), 0.686);
  closeTo(machToKilometersPerSecond(2, 300), 0.6);
  closeTo(machToKilometersPerSecond(0.5, 340), 0.17);
  assert.equal(machToKilometersPerSecond(0, 343), 0);
  assert.throws(() => machToKilometersPerSecond(1), TypeError);
  assert.throws(() => machToKilometersPerSecond(-1, 343), RangeError);
  assert.throws(() => machToKilometersPerSecond(1, 0), RangeError);
  assert.throws(() => machToKilometersPerSecond(1, -343), RangeError);
  assert.throws(() => machToKilometersPerSecond(Infinity, 343), TypeError);
  assert.throws(() => machToKilometersPerSecond(1, NaN), TypeError);
  assert.throws(() => machToKilometersPerSecond(Number.MAX_VALUE, Number.MAX_VALUE), RangeError);
});

test("convertTemperature supports Celsius, Fahrenheit, and Kelvin", () => {
  closeTo(convertTemperature(32, "F", "C"), 0);
  closeTo(convertTemperature(100, "C", "F"), 212);
  closeTo(convertTemperature(-10, "C", "F"), 14);
  closeTo(convertTemperature(37.5, "C", "F"), 99.5);
  closeTo(convertTemperature(0, "C", "K"), 273.15);
  closeTo(convertTemperature(-273.15, "C", "K"), 0);
  closeTo(convertTemperature(-459.67, "F", "K"), 0);
  closeTo(convertTemperature(273.15, "K", "C"), 0);
  closeTo(convertTemperature(0, "K", "C"), -273.15);
  assert.throws(() => convertTemperature(-1, "K", "C"), RangeError);
  assert.throws(() => convertTemperature(-300, "C", "F"), RangeError);
  assert.throws(() => convertTemperature(-459.68, "F", "K"), RangeError);
  assert.throws(() => convertTemperature(20, "R", "C"), RangeError);
  assert.throws(() => convertTemperature(20, "C", "R"), RangeError);
  assert.throws(() => convertTemperature(Infinity, "C", "F"), TypeError);
});
