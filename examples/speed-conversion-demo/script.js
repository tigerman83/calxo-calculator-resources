/* Copyright 2026 Calxo AI. MIT license; see the repository LICENSE. */
(() => {
  "use strict";
  const form = document.querySelector("#conversion-form");
  const speed = document.querySelector("#speed");
  const direction = document.querySelector("#direction");
  const error = document.querySelector("#error");
  const answer = document.querySelector("#answer");
  const unit = document.querySelector("#result-unit");
  const formula = document.querySelector("#formula");
  const raw = document.querySelector("#raw-result");
  const reverse = document.querySelector("#reverse");
  const display = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });
  let calculation = null;

  function calculate() {
    const value = speed.valueAsNumber;
    const forward = direction.value === "yds-mph";
    calculation = null;
    const invalid = speed.value.trim() === "" || !Number.isFinite(value) || value < 0;
    const result = invalid ? NaN : value * (forward ? 3600 / 1760 : 1760 / 3600);
    if (invalid || !Number.isFinite(result)) {
      error.textContent = invalid ? "Enter a finite speed of zero or greater." : "This result is outside the finite number range. Try a smaller input.";
      error.hidden = false;
      speed.setAttribute("aria-invalid", "true");
      answer.textContent = "—";
      unit.textContent = "";
      formula.textContent = "Enter a valid speed to see the calculation.";
      raw.textContent = "Unavailable";
      reverse.disabled = true;
      return;
    }
    calculation = result;
    error.hidden = true;
    error.textContent = "";
    speed.removeAttribute("aria-invalid");
    answer.textContent = display.format(result);
    unit.textContent = forward ? "mph" : "yd/s";
    raw.textContent = String(result);
    formula.textContent = forward
      ? `${value} yd/s × 3,600 s/h ÷ 1,760 yd/mi = ${result} mph`
      : `${value} mi/h × 1,760 yd/mi ÷ 3,600 s/h = ${result} yd/s`;
    reverse.disabled = false;
  }
  form.addEventListener("submit", event => { event.preventDefault(); calculate(); });
  speed.addEventListener("input", calculate);
  direction.addEventListener("change", calculate);
  reverse.addEventListener("click", () => {
    if (calculation === null) return;
    speed.value = String(calculation);
    direction.value = direction.value === "yds-mph" ? "mph-yds" : "yds-mph";
    calculate();
  });
  document.querySelector("#sports-example").addEventListener("click", () => {
    speed.value = "8";
    direction.value = "yds-mph";
    calculate();
  });
  calculate();
})();
