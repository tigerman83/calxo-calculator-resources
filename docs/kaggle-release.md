# Publish the conversion resource on Kaggle

The release consists of a dataset and a separate notebook attached to that dataset. Uploading an `.ipynb` as a dataset file alone does not publish it as a runnable Kaggle Notebook.

## First release status, 2026-11-05

The [dataset is public](https://www.kaggle.com/datasets/rakeshvetal83/calxo-unit-conversion-reference-cases) under MIT. The six anonymously downloaded files matched the local originals, and the public description includes methodology, sources, limitations and contextual Calxo links.

The [companion notebook is public](https://www.kaggle.com/code/rakeshvetal83/validate-calxo-unit-conversions). The owner approved Apache 2.0 for the Kaggle-hosted copy, and version 2 includes the corresponding notice. Its Kaggle Save & Run All completed successfully in 21 seconds. Verification in a separate, signed-out browser confirmed version 2, all four cell outputs, 612 passing conversion cases, the Apache 2.0 license, and contextual links to the Calxo converter and Formula Library. The dataset and original downloadable notebook retain MIT licensing.

## Prepare

Confirm the Kaggle username, then run from the repository root:

```sh
node scripts/build-conversion-dataset.mjs
python scripts/build-conversion-notebook.py
python scripts/prepare-kaggle-release.py YOUR_KAGGLE_USERNAME
```

The last command creates `dist/kaggle/dataset/` with only the data, dictionary, README, license and notebook, plus real dataset metadata for that owner. It also creates `dist/kaggle/notebook/` with the executable notebook and kernel metadata linking to the intended dataset slug. It does not upload anything.

After explicit approval of Apache 2.0 for the separately hosted notebook, add `--apache-notebook` to the last command. This changes the hosted notebook's license notices and prepares it for public sharing. The dataset files and original MIT notebook are preserved. Without this flag the notebook metadata defaults to private.

The API metadata uses Kaggle's `other` license option and identifies MIT in the description and included LICENSE. Kaggle's current browser interface also offers MIT directly; select MIT when publishing through that interface. This preserves the existing repository license; it does not change the license of the separate Formula Library archive.

## Publish with Kaggle's interface

1. Sign into the confirmed Kaggle account and create a new public dataset named **Calxo Unit Conversion Reference Cases**.
2. Upload the data files from `dist/kaggle/dataset/`. Use slug `calxo-unit-conversion-reference-cases`. Select MIT in the browser's license selector and confirm the license file is present. Add the prepared README description to the dataset's About section after creation. The API fallback remains “Other (specified in description)” with MIT identified in the description.
3. Check the CSV preview, all 11 columns, the 612-row count, description links and visibility after processing.
4. Create a Notebook, import `validate-conversions.ipynb`, and attach the new dataset. Run all cells, then save a public executed version. No internet access, GPU or third-party Python packages are needed.
5. Verify that another visitor can open both the dataset and the notebook. Record both public URLs.

Alternatively, with the official Kaggle CLI installed and authenticated locally:

```sh
kaggle datasets create -p dist/kaggle/dataset --public
kaggle kernels push -p dist/kaggle/notebook
```

Wait for the dataset upload to finish before pushing the notebook. Review the processed notebook and its output afterward. For updates use dataset versioning rather than creating duplicate datasets. Do not put Kaggle credentials in this repository.

Official references: [dataset metadata](https://github.com/Kaggle/kaggle-cli/blob/main/docs/datasets_metadata.md), [dataset commands](https://github.com/Kaggle/kaggle-cli/blob/main/docs/datasets.md), and [kernel commands](https://github.com/Kaggle/kaggle-cli/blob/main/docs/kernels.md).
