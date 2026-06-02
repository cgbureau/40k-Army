#!/usr/bin/env python3
"""Sync unit_models and models seed data from local BSData catalogs."""

from __future__ import annotations

import argparse
import json
import re
from collections import OrderedDict
from pathlib import Path
from typing import Iterable

from bsdata_expected_counts import (
    BsDataIndex,
    expected_models,
    expected_unit_models,
)

DEFAULT_BSDATA_ROOT = Path(__file__).resolve().parents[1].parent / "wh40k-10e"
REPO_ROOT = Path(__file__).resolve().parents[1]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
UNIT_MODELS_OUTPUT_PATH = DATA_ROOT / "unit_models.data.ts"
UNIT_MODELS_SHARD_ROOT = DATA_ROOT / "unit_models/10e"
MODELS_OUTPUT_PATH = DATA_ROOT / "models.data.ts"
MODELS_SHARD_ROOT = DATA_ROOT / "models"


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--bsdata-root", default=str(DEFAULT_BSDATA_ROOT))
    args = parser.parse_args()

    index = BsDataIndex(Path(args.bsdata_root))
    expected_unit_model_records = expected_unit_models(index, REPO_ROOT)
    unit_models_by_slug: "OrderedDict[str, dict[str, str | int]]" = OrderedDict()

    for record in expected_unit_model_records:
        unit_models_by_slug.setdefault(str(record["unit_model_slug"]), record)

    model_records = expected_models(index, REPO_ROOT)

    previous_unit_model_count = (
        count_seed_records(UNIT_MODELS_OUTPUT_PATH, "UnitModelConfig")
        + count_seed_records(UNIT_MODELS_SHARD_ROOT, "UnitModelConfig")
    )
    previous_model_count = count_seed_records(
        MODELS_OUTPUT_PATH,
        "ModelConfig",
    ) + count_seed_records(MODELS_SHARD_ROOT, "ModelConfig")

    write_unit_model_files(group_records_by_owner(unit_models_by_slug.values()))
    write_model_files(group_records_by_owner(model_records))

    print(
        {
            "unit_models": len(unit_models_by_slug),
            "previous_unit_models": previous_unit_model_count,
            "unit_model_faction_memberships": len(expected_unit_model_records),
            "models": len(model_records),
            "previous_models": previous_model_count,
        },
    )


def group_records_by_owner(
    records: Iterable[dict[str, str | int]],
) -> "OrderedDict[str, list[dict[str, str | int]]]":
    groups: "OrderedDict[str, list[dict[str, str | int]]]" = OrderedDict()

    for record in records:
        owner_slug = str(record["source_owner_slug"])
        groups.setdefault(owner_slug, []).append(record)

    return OrderedDict(sorted(groups.items()))


def count_seed_records(path: Path, config_name: str) -> int:
    if not path.exists():
        return 0

    if path.is_file():
        return len(re.findall(fr"{config_name} = \{{", path.read_text()))

    return sum(
        count_seed_records(file_path, config_name)
        for file_path in path.rglob("*.data.ts")
    )


def write_unit_model_files(
    groups: "OrderedDict[str, list[dict[str, str | int]]]",
) -> None:
    UNIT_MODELS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in UNIT_MODELS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (UNIT_MODELS_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_unit_model_shard_file(owner_slug, records),
        )

    (UNIT_MODELS_SHARD_ROOT / "_index.unit_models.data.ts").write_text(
        render_unit_model_edition_index(groups),
    )
    (UNIT_MODELS_SHARD_ROOT.parent / "_index.unit_models.data.ts").write_text(
        'export * from "./10e/_index.unit_models.data";\n',
    )
    UNIT_MODELS_OUTPUT_PATH.write_text(render_unit_model_root_file())


def write_model_files(
    groups: "OrderedDict[str, list[dict[str, str | int]]]",
) -> None:
    MODELS_SHARD_ROOT.mkdir(parents=True, exist_ok=True)

    for existing_path in MODELS_SHARD_ROOT.glob("*.data.ts"):
        existing_path.unlink()

    for owner_slug, records in groups.items():
        (MODELS_SHARD_ROOT / f"{owner_slug}.data.ts").write_text(
            render_model_shard_file(owner_slug, records),
        )

    (MODELS_SHARD_ROOT / "_index.models.data.ts").write_text(
        render_model_index(groups),
    )
    MODELS_OUTPUT_PATH.write_text(render_model_root_file())


def render_unit_model_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { unitModels10e } from "./unit_models/10e/_index.unit_models.data";',
            "",
            "/**",
            " * Typed seed dataset for the `unit_models` table.",
            " */",
            'export const unitModelsDataset: SeedDataset<"unit_models"> = {',
            '  table: "unit_models",',
            "  records: [...unitModels10e],",
            "};",
            "",
        ],
    )


def render_model_root_file() -> str:
    return "\n".join(
        [
            'import type { SeedDataset } from "../../types/_index.types";',
            'import { models } from "./models/_index.models.data";',
            "",
            "/**",
            " * Typed seed dataset for the `models` table.",
            " */",
            'export const modelsDataset: SeedDataset<"models"> = {',
            '  table: "models",',
            "  records: [...models],",
            "};",
            "",
        ],
    )


def render_unit_model_shard_file(
    owner_slug: str,
    records: list[dict[str, str | int]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['unit_model_slug']))}UnitModel"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}UnitModels10e"

    lines = [
        "import type {",
        "  SeedDataset,",
        "  UnitModelConfig,",
        '} from "../../../../types/_index.types";',
        'import { modelId, unitId, unitModelId } from "../../../ids";',
        "",
        "/**",
        f" * 10th edition unit model rows owned by `{owner_slug}`.",
        " * Generated from BSData model selection entries.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: UnitModelConfig = {{",
                f'  id: unitModelId({ts_string(str(record["unit_model_slug"]))}),',
                f'  unit_id: unitId({ts_string(str(record["unit_slug"]))}),',
                f'  model_id: modelId({ts_string(str(record["model_slug"]))}),',
                f'  minimum_model_count: {record["minimum_model_count"]},',
                f'  maximum_model_count: {record["maximum_model_count"]},',
                "  effective_date: null,",
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "unit_models", const_names, "UnitModelConfig"))

    return "\n".join(lines)


def render_model_shard_file(
    owner_slug: str,
    records: list[dict[str, str | int]],
) -> str:
    const_names = [
        f"{identifier_pascal_case(str(record['model_slug']))}Model"
        for record in records
    ]
    dataset_name = f"{identifier_camel_case(owner_slug)}Models"

    lines = [
        "import type {",
        "  ModelConfig,",
        "  SeedDataset,",
        '} from "../../../types/_index.types";',
        'import { modelId } from "../../ids";',
        "",
        "/**",
        f" * Physical model identities owned by `{owner_slug}`.",
        " * Generated from BSData model selection entries.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: ModelConfig = {{",
                f'  id: modelId({ts_string(str(record["model_slug"]))}),',
                f'  model_slug: {ts_string(str(record["model_slug"]))},',
                f'  model_name: {ts_string(str(record["model_name"]))},',
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "models", const_names, "ModelConfig"))

    return "\n".join(lines)


def render_unit_model_edition_index(
    groups: "OrderedDict[str, list[dict[str, str | int]]]",
) -> str:
    imports = [
        'import type { UnitModelConfig } from "../../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}UnitModels10e"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const unitModels10e = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies UnitModelConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_model_index(
    groups: "OrderedDict[str, list[dict[str, str | int]]]",
) -> str:
    imports = [
        'import type { ModelConfig } from "../../../types/_index.types";',
    ]
    dataset_names = []

    for owner_slug in groups:
        dataset_name = f"{identifier_camel_case(owner_slug)}Models"
        dataset_names.append(dataset_name)
        imports.append(f'import {{ {dataset_name} }} from "./{owner_slug}.data";')

    lines = [
        *imports,
        "",
        "export const models = [",
    ]
    lines.extend(f"  ...{dataset_name}.records," for dataset_name in dataset_names)
    lines.extend(
        [
            "] satisfies ModelConfig[];",
            "",
        ],
    )

    return "\n".join(lines)


def render_dataset(
    dataset_name: str,
    table_name: str,
    const_names: list[str],
    config_name: str,
) -> list[str]:
    lines = [
        f'export const {dataset_name}: SeedDataset<"{table_name}"> = {{',
        f'  table: "{table_name}",',
        "  records: [",
    ]
    lines.extend(f"    {const_name}," for const_name in const_names)
    lines.extend(
        [
            f"  ] satisfies {config_name}[],",
            "};",
            "",
        ],
    )
    return lines


def ts_string(value: str) -> str:
    return json.dumps(value)


def identifier_pascal_case(slug: str) -> str:
    parts = re.findall(r"[a-zA-Z0-9]+", slug)
    identifier = "".join(part[:1].upper() + part[1:] for part in parts)

    if not identifier or identifier[0].isdigit():
        return f"Seed{identifier}"

    return identifier


def identifier_camel_case(slug: str) -> str:
    identifier = identifier_pascal_case(slug)
    return identifier[:1].lower() + identifier[1:]


if __name__ == "__main__":
    main()
