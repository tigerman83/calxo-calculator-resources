import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const out = new URL("datasets/conversion-reference/", root);
await mkdir(out, { recursive: true });
const nist = "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors";
const noaa = "https://oceanservice.noaa.gov/facts/nautical-mile-knot.html";
// Integer ratios express exact definitions. Expected values are computed with
// rational arithmetic, independently of the JavaScript implementation under test.
const lengths = { m: [1, 1], km: [1000, 1], cm: [1, 100], mm: [1, 1000], in: [127, 5000], ft: [381, 1250], yd: [1143, 1250], mi: [201168, 125], nmi: [1852, 1] };
const speeds = { "m/s": [1, 1], "km/h": [5, 18], mph: [1397, 3125], "ft/s": [381, 1250], "yd/s": [1143, 1250], kn: [463, 900] };
const inputs = [[0, 1], [1, 10], [1, 2], [1, 1], [22, 1], [100, 1]];
const rows = [];
for (const [quantity, factors] of [["length", lengths], ["speed", speeds]]) {
  for (const [from, [fn, fd]] of Object.entries(factors)) {
    for (const [to, [tn, td]] of Object.entries(factors)) {
      if (from === to) continue;
      for (const [vn, vd] of inputs) {
        let numerator = BigInt(vn) * BigInt(fn) * BigInt(td);
        let denominator = BigInt(vd) * BigInt(fd) * BigInt(tn);
        const gcd = (a, b) => b === 0n ? a : gcd(b, a % b);
        const divisor = gcd(numerator, denominator);
        numerator /= divisor; denominator /= divisor;
        rows.push({ case_id: `${quantity}-${from}-${to}-${vn}-${vd}`, quantity,
          input_value: vn / vd, from_unit: from, to_unit: to,
          expected_numerator: String(numerator), expected_denominator: String(denominator),
          expected_value: Number(numerator) / Number(denominator),
          absolute_tolerance: 1e-10, relative_tolerance: 1e-12,
          source_url: from === "nmi" || to === "nmi" || from === "kn" || to === "kn" ? noaa : nist });
      }
    }
  }
}
const fields = Object.keys(rows[0]);
const csv = value => /[",\n]/.test(String(value)) ? `"${String(value).replaceAll('"', '""')}"` : String(value);
await writeFile(new URL("conversion-cases.json", out), JSON.stringify(rows, null, 2) + "\n");
await writeFile(new URL("conversion-cases.csv", out), fields.join(",") + "\n" + rows.map(row => fields.map(field => csv(row[field])).join(",")).join("\n") + "\n");
const descriptions = {
  case_id: "Unique deterministic case identifier.", quantity: "length or speed.",
  input_value: "Non-negative input magnitude in from_unit.", from_unit: "Case-sensitive source unit symbol.",
  to_unit: "Case-sensitive destination unit symbol.", expected_numerator: "Exact rational result numerator, stored as a decimal integer string in JSON.",
  expected_denominator: "Exact positive rational result denominator, stored as a decimal integer string in JSON.",
  expected_value: "Floating-point approximation of numerator divided by denominator, not a measurement.",
  absolute_tolerance: "Absolute tolerance for binary floating-point comparisons.", relative_tolerance: "Relative tolerance for binary floating-point comparisons.",
  source_url: "Primary reference for the unit definitions. Generated cases are authored by Calxo, not supplied by that organization."
};
await writeFile(new URL("data-dictionary.json", out), JSON.stringify(descriptions, null, 2) + "\n");
const readme = await readFile(new URL("README.md", out), "utf8");
await writeFile(new URL("dataset-metadata.template.json", out), JSON.stringify({
  title: "Calxo Unit Conversion Reference Cases",
  subtitle: "Exact rational examples for length and speed conversion validation",
  id: "REPLACE_WITH_KAGGLE_USERNAME/calxo-unit-conversion-reference-cases",
  licenses: [{ name: "other" }], description: readme,
  resources: [{ path: "conversion-cases.csv", description: "612 synthetic reference cases; independently computed rational expected values.", schema: { fields: fields.map(name => ({ name, description: descriptions[name], type: ["input_value", "expected_value", "absolute_tolerance", "relative_tolerance"].includes(name) ? "numeric" : "string" })) } }]
}, null, 2) + "\n");
console.log(`Generated ${rows.length} reference cases in ${fileURLToPath(out)}`);
