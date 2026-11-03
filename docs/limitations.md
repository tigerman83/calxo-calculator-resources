# Limitations

- Percentage calculations are arithmetic helpers. They do not determine which denominator or comparison period is appropriate for a particular business metric.
- Percentage change rejects a zero old value. For a negative old value the signed denominator can reverse the direction compared with a positive baseline; a domain-specific metric may define a different denominator.
- Compound interest supports a non-negative principal, non-negative nominal annual rate, non-negative duration in years, and a positive integer compounding frequency. It excludes recurring cash flows, fees, taxes, inflation, variable rates, day-count conventions, and investment risk.
- Length conversion supports only `m`, `km`, `cm`, `mm`, `in`, `ft`, `yd`, `mi`, and `nmi`; values must be non-negative.
- Speed conversion supports only `m/s`, `km/h`, `mph`, `ft/s`, `yd/s`, and `kn`; it converts speed magnitudes, not signed velocities.
- Mach conversion requires a positive caller-supplied speed of sound in meters/second and a non-negative Mach number. It does not model atmospheric conditions or determine the speed of sound. There is no universal fixed Mach-to-speed factor.
- Temperature conversion supports only `C`, `F`, and `K` and rejects values below absolute zero.
- Results use JavaScript floating-point arithmetic and are not rounded.
- The additional live calculator links in the README do not imply that the website's health, travel, currency, date or loan-calculator implementations are included here.
- The package provides calculations for general informational use. It is not professional financial, medical, tax, legal, engineering, or safety advice.
