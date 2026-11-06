"""Prepare allowlisted Kaggle uploads. No network access or credentials required."""
import argparse
import json
import re
import shutil
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument("username", help="Confirmed Kaggle account username")
parser.add_argument("--apache-notebook", action="store_true", help="Prepare the separately authorized Apache 2.0 Kaggle notebook copy")
args = parser.parse_args()
if not re.fullmatch(r"[a-zA-Z0-9_-]{1,50}", args.username):
    parser.error("Expected a Kaggle account username, not a URL or credential.")
root = Path(__file__).resolve().parents[1]
source = root / "datasets/conversion-reference"
destination = root / "dist/kaggle/dataset"
notebook_dir = root / "dist/kaggle/notebook"
destination.mkdir(parents=True, exist_ok=True)
notebook_dir.mkdir(parents=True, exist_ok=True)
files = ["conversion-cases.csv", "conversion-cases.json", "data-dictionary.json", "README.md", "LICENSE", "validate-conversions.ipynb"]
for name in files:
    shutil.copyfile(source / name, destination / name)
metadata = json.loads((source / "dataset-metadata.template.json").read_text(encoding="utf-8"))
metadata["id"] = f"{args.username}/calxo-unit-conversion-reference-cases"
(destination / "dataset-metadata.json").write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")
notebook = json.loads((source / "validate-conversions.ipynb").read_text(encoding="utf-8"))
if args.apache_notebook:
    for cell in notebook["cells"]:
        if cell["cell_type"] != "markdown":
            continue
        text = "".join(cell["source"])
        text = text.replace("Calxo AI, 2026-11-05. MIT license.", "Copyright 2026 Calxo AI. This Kaggle-hosted notebook copy is licensed under the [Apache License, Version 2.0](https://www.apache.org/licenses/LICENSE-2.0). You may not use this copy except in compliance with that license. It is provided on an AS IS basis, without warranties or conditions of any kind. The attached reference dataset and its original downloadable notebook retain their MIT license.")
        text = text.replace("MIT applies to these authored examples and notebook, not to Calxo's separately licensed Formula Library archive.", "This Kaggle-hosted notebook copy is available under Apache 2.0. The reference dataset and original notebook download retain MIT licensing. Calxo's separately archived Formula Library dataset has its own reuse terms.")
        cell["source"] = text.splitlines(keepends=True)
(notebook_dir / "validate-conversions.ipynb").write_text(json.dumps(notebook, indent=2) + "\n", encoding="utf-8")
kernel = {"id": f"{args.username}/validate-calxo-unit-conversions", "title": "Validate Calxo Unit Conversions", "code_file": "validate-conversions.ipynb", "language": "python", "kernel_type": "notebook", "is_private": not args.apache_notebook, "enable_gpu": False, "enable_internet": False, "dataset_sources": [metadata["id"]], "competition_sources": [], "kernel_sources": []}
(notebook_dir / "kernel-metadata.json").write_text(json.dumps(kernel, indent=2) + "\n", encoding="utf-8")
expected = set(files + ["dataset-metadata.json"])
unexpected = {p.name for p in destination.iterdir()} - expected
if unexpected:
    raise RuntimeError(f"Unexpected files in upload directory: {sorted(unexpected)}. Inspect before publishing.")
print(f"Prepared dataset and notebook uploads for {args.username}. Nothing uploaded.")
