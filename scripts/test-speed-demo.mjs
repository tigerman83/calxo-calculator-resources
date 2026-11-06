import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";

// Run the actual UI script against minimal DOM controls. This checks behavior;
// it does not substitute for browser layout, keyboard or accessibility review.
class Control {
  constructor(value = "") { this.value = value; this.handlers = {}; this.attributes = {}; }
  get valueAsNumber() { return this.value === "" ? NaN : Number(this.value); }
  addEventListener(name, callback) { this.handlers[name] = callback; }
  setAttribute(name, value) { this.attributes[name] = value; }
  removeAttribute(name) { delete this.attributes[name]; }
  fire(name) { this.handlers[name]({ preventDefault() {} }); }
}
const ids = ["conversion-form", "speed", "direction", "error", "answer", "result-unit", "formula", "raw-result", "reverse", "sports-example"];
const controls = Object.fromEntries(ids.map(id => [`#${id}`, new Control()]));
controls["#speed"].value = "22";
controls["#direction"].value = "yds-mph";
const script = await readFile(new URL("../examples/speed-conversion-demo/script.js", import.meta.url), "utf8");
vm.runInNewContext(script, { document: { querySelector: selector => controls[selector] }, Intl });
const speed = controls["#speed"];
const direction = controls["#direction"];
const near = (value, target) => assert.ok(Math.abs(Number(value) - target) < 1e-10);
near(controls["#raw-result"].textContent, 45);
assert.equal(controls["#answer"].textContent, "45");
controls["#reverse"].fire("click");
assert.equal(direction.value, "mph-yds");
near(controls["#raw-result"].textContent, 22);
speed.value = "0.5"; speed.fire("input"); near(controls["#raw-result"].textContent, 0.5 * 1760 / 3600);
speed.value = "0"; speed.fire("input"); assert.equal(controls["#answer"].textContent, "0");
for (const invalid of ["", "-1", "abc", "Infinity"]) {
  speed.value = invalid; speed.fire("input");
  assert.equal(controls["#error"].hidden, false);
  assert.equal(controls["#reverse"].disabled, true);
  assert.equal(controls["#answer"].textContent, "—");
}
direction.value = "yds-mph";
speed.value = String(Number.MAX_VALUE); speed.fire("input");
assert.match(controls["#error"].textContent, /finite number range/);
controls["#sports-example"].fire("click");
assert.equal(controls["#answer"].textContent, "16.363636");
assert.equal(controls["#error"].hidden, true);
controls["#reverse"].fire("click"); near(controls["#raw-result"].textContent, 8);
const markup = await readFile(new URL("../examples/speed-conversion-demo/index.html", import.meta.url), "utf8");
assert.match(markup, /label for="speed"/);
assert.match(markup, /aria-live="polite"/);
assert.match(markup, /https:\/\/calxo.ai\/tools\/yards-per-second-to-miles-per-hour/);
console.log("Speed demo passed: anchors, fractions, reverse precision, zero, invalid values, overflow and error recovery. Browser layout review remains separate.");
