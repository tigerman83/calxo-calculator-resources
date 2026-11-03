# Rounding and precision

The functions return JavaScript IEEE 754 double-precision numbers and do not round. This preserves intermediate precision for callers who need further calculations. Binary floating-point cannot represent every decimal fraction exactly, so values such as 0.1 may have a small representation error.

For display, round only at the presentation boundary and choose a number of decimal places appropriate to the use case. Do not treat display rounding as a change to the underlying calculation. Tests compare values with a tolerance where binary floating-point representation makes exact equality unsuitable.

These utilities are not a decimal accounting or financial ledger library. For monetary posting, apply the relevant currency's minor-unit rules and product or jurisdiction requirements outside this package.
