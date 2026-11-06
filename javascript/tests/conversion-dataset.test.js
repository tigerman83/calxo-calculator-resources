import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { convertLength, convertSpeed } from "../src/index.js";

test("length and speed implementations match 612 independent rational reference cases", async () => {
  const rows = JSON.parse(await readFile(new URL("../../datasets/conversion-reference/conversion-cases.json", import.meta.url), "utf8"));
  assert.equal(rows.length, 612);
  assert.equal(new Set(rows.map(row => row.case_id)).size, rows.length);
  for (const row of rows) {
    const convert = row.quantity === "length" ? convertLength : convertSpeed;
    const expected = Number(row.expected_numerator) / Number(row.expected_denominator);
    assert.equal(row.expected_value, expected);
    const actual = convert(row.input_value, row.from_unit, row.to_unit);
    const tolerance = Math.max(row.absolute_tolerance, row.relative_tolerance * Math.abs(expected));
    assert.ok(Math.abs(actual - expected) <= tolerance, `${row.case_id}: ${actual} versus ${expected}`);
  }
  const nautical = rows.find(row => row.from_unit === "nmi" && row.to_unit === "km" && row.input_value === 1);
  assert.equal(nautical.expected_value, 1.852);
  assert.equal(nautical.expected_numerator, "463");
  assert.equal(nautical.expected_denominator, "250");
});
