import {
  compoundInterest,
  convertLength,
  convertSpeed,
  convertTemperature,
  machToKilometersPerSecond,
  percentageChange,
  percentageOf
} from "../javascript/src/index.js";

console.log(percentageOf(15, 240)); // 36
console.log(percentageChange(80, 100)); // 25
console.log(compoundInterest({ principal: 10_000, annualRatePercent: 8, years: 5, compoundsPerYear: 12 }));
console.log(convertLength(1, "mi", "km")); // 1.609344
console.log(convertLength(10, "nmi", "km")); // approximately 18.52
console.log(convertSpeed(22, "yd/s", "mph")); // approximately 45
console.log(machToKilometersPerSecond(2, 343)); // approximately 0.686; assumed sound speed: 343 m/s
console.log(convertTemperature(32, "F", "C")); // approximately 0
