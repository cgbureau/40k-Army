from __future__ import annotations

import hashlib
import json
import re
from pathlib import Path

from .models import NormalizedKitContent, NormalizedKitPrice


REPO_ROOT = Path(__file__).resolve().parents[2]
DATA_ROOT = REPO_ROOT / "db/seed_config/seed/data"
KITS_ROOT_PATH = DATA_ROOT / "kits.data.ts"
KIT_UNITS_ROOT_PATH = DATA_ROOT / "kit_units.data.ts"
KIT_PRICES_ROOT_PATH = DATA_ROOT / "kit_prices.data.ts"
KITS_CONTENT_GENERATED_PATH = DATA_ROOT / "kits/kit_content_imported.data.ts"
KITS_TCGCSV_GENERATED_PATH = DATA_ROOT / "kits/tcgcsv/_index.data.ts"
KIT_UNITS_GENERATED_PATH = DATA_ROOT / "kit_units/kit_content_imported.data.ts"
KIT_PRICES_TCGCSV_GENERATED_PATH = DATA_ROOT / "kit_prices/tcgcsv/_index.data.ts"
GENERATED_IDS_PATH = REPO_ROOT / "db/seed_config/seed/ids/generated_game_data.ids.ts"

CROCKFORD_BASE32 = "0123456789ABCDEFGHJKMNPQRSTVWXYZ"


def apply_normalized_kit_contents(
    contents: list[NormalizedKitContent],
    repo_root: Path = REPO_ROOT,
) -> None:
    data_root = repo_root / "db/seed_config/seed/data"
    kits_path = data_root / "kits.data.ts"
    kit_units_path = data_root / "kit_units.data.ts"
    kit_prices_path = data_root / "kit_prices.data.ts"
    generated_content_kits_path = data_root / "kits/kit_content_imported.data.ts"
    generated_tcgcsv_kits_path = data_root / "kits/tcgcsv/_index.data.ts"
    generated_kit_units_path = data_root / "kit_units/kit_content_imported.data.ts"
    generated_kit_prices_path = data_root / "kit_prices/tcgcsv/_index.data.ts"
    ids_path = repo_root / "db/seed_config/seed/ids/generated_game_data.ids.ts"

    replace_in_file(
        kits_path,
        './kits/tcgcsv_imported.data',
        './kits/tcgcsv/_index.data',
    )
    replace_in_file(
        kit_prices_path,
        './kit_prices/tcgcsv_imported.data',
        './kit_prices/tcgcsv/_index.data',
    )
    remove_stale_generated_file(data_root / "kits/tcgcsv_imported.data.ts")
    remove_stale_generated_file(data_root / "kit_prices/tcgcsv_imported.data.ts")

    content_kits = [content for content in contents if not is_tcgcsv_content(content)]
    tcgcsv_contents = [content for content in contents if is_tcgcsv_content(content)]
    existing_kit_seed_slugs = read_existing_root_kit_seed_slugs(kits_path)
    existing_kit_seed_slug_set = set(existing_kit_seed_slugs)
    generated_content_seed_slugs = {content.kit_seed_slug for content in content_kits}
    tcgcsv_kits = [
        content
        for content in tcgcsv_contents
        if content.kit_seed_slug not in existing_kit_seed_slug_set
        and content.kit_seed_slug not in generated_content_seed_slugs
    ]
    price_groups = group_tcgcsv_prices_by_faction(tcgcsv_contents)
    kit_prices = [price for prices in price_groups.values() for price in prices]

    generated_content_kits_path.parent.mkdir(parents=True, exist_ok=True)
    generated_kit_units_path.parent.mkdir(parents=True, exist_ok=True)

    generated_content_kits_path.write_text(
        render_kits_dataset(
            contents=content_kits,
            dataset_name="kitContentImportedKitsDataset",
            description="Imported purchasable kit rows from source-backed kit content pages.",
        ),
        encoding="utf-8",
    )
    write_grouped_kits_dataset(
        root_path=generated_tcgcsv_kits_path.parent,
        contents_by_group=group_tcgcsv_contents_by_faction(tcgcsv_kits),
    )
    generated_kit_units_path.write_text(
        render_kit_units_dataset(content_kits),
        encoding="utf-8",
    )
    write_grouped_kit_prices_dataset(
        root_path=generated_kit_prices_path.parent,
        prices_by_group=price_groups,
    )

    ensure_root_dataset_spread(
        path=kits_path,
        import_line='import { kitContentImportedKitsDataset } from "./kits/kit_content_imported.data";',
        spread_line="    ...kitContentImportedKitsDataset.records,",
        config_name="KitConfig",
    )
    ensure_root_dataset_spread(
        path=kits_path,
        import_line='import { tcgCsvImportedKitsDataset } from "./kits/tcgcsv/_index.data";',
        spread_line="    ...tcgCsvImportedKitsDataset.records,",
        config_name="KitConfig",
    )
    ensure_root_dataset_spread(
        path=kit_units_path,
        import_line='import { kitContentImportedKitUnitsDataset } from "./kit_units/kit_content_imported.data";',
        spread_line="    ...kitContentImportedKitUnitsDataset.records,",
        config_name="KitUnitConfig",
    )
    ensure_root_dataset_spread(
        path=kit_prices_path,
        import_line='import { tcgCsvImportedKitPricesDataset } from "./kit_prices/tcgcsv/_index.data";',
        spread_line="    ...tcgCsvImportedKitPricesDataset.records,",
        config_name="KitPriceConfig",
    )
    update_generated_ids(
        ids_path,
        existing_kit_seed_slugs,
        [*content_kits, *tcgcsv_kits],
        content_kits,
        kit_prices,
    )


def render_kits_dataset(
    *,
    contents: list[NormalizedKitContent],
    dataset_name: str,
    description: str,
    type_import_path: str = "../../../types/_index.types",
    ids_import_path: str = "../../ids",
) -> str:
    const_names = [f"{identifier_pascal_case(content.kit_seed_slug)}Kit" for content in contents]
    lines = [
        "import type {",
        "  KitConfig,",
        "  SeedDataset,",
        f'}} from "{type_import_path}";',
        f'import {{ kitId, kitTypeId }} from "{ids_import_path}";',
        "",
        "/**",
        f" * {description}",
        " * Generated by scripts/kit_content_importer/applyer.py.",
        " */",
        "",
    ]

    for content, const_name in zip(contents, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: KitConfig = {{",
                f'  id: kitId({ts_string(content.kit_seed_slug)}),',
                f'  kit_slug: {ts_string(content.kit_slug)},',
                f'  kit_name: {ts_string(content.kit_name)},',
                f'  display_name: {ts_string(content.display_name)},',
                f'  gw_slug: {ts_nullable_string(content.gw_slug)},',
                f'  gw_short_slug: {ts_nullable_string(content.gw_short_slug)},',
                f"  gw_year: {content.gw_year if content.gw_year is not None else 'null'},",
                f"  model_count: {content.model_count if content.model_count is not None else 'null'},",
                f'  kit_type_id: kitTypeId({ts_string(content.kit_type_slug)}),',
                f'  gw_product_url: {ts_nullable_string(content.gw_product_url)},',
                f'  gw_image_url: {ts_nullable_string(content.gw_image_url)},',
                f'  gw_product_code: {ts_nullable_string(content.gw_product_code)},',
                f'  gw_short_code: {ts_nullable_string(content.gw_short_code)},',
                f'  product_gtin: {ts_nullable_string(content.product_gtin)},',
                f'  tcgcsv_product_id: {ts_nullable_string(content.tcgcsv_product_id)},',
                f'  tcgcsv_product_url: {ts_nullable_string(content.tcgcsv_product_url)},',
                f"  release_date: {ts_nullable_date(content.release_date)},",
                "  discontinued_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(render_dataset(dataset_name, "kits", const_names, "KitConfig"))
    return "\n".join(lines)


def write_grouped_kits_dataset(
    *,
    root_path: Path,
    contents_by_group: dict[str, list[NormalizedKitContent]],
) -> None:
    reset_generated_directory(root_path)
    dataset_imports: list[tuple[str, str]] = []

    for group_slug, contents in sorted(contents_by_group.items()):
        dataset_name = f"tcgCsvImportedKits{identifier_pascal_case(group_slug)}Dataset"
        file_name = f"{group_slug}.data.ts"
        (root_path / file_name).write_text(
            render_kits_dataset(
                contents=contents,
                dataset_name=dataset_name,
                description=f"Imported purchasable kit rows from TCGCSV catalog data for {group_slug}.",
                type_import_path="../../../../types/_index.types",
                ids_import_path="../../../ids",
            ),
            encoding="utf-8",
        )
        dataset_imports.append((dataset_name, file_name))

    (root_path / "_index.data.ts").write_text(
        render_grouped_dataset_index(
            table_name="kits",
            config_name="KitConfig",
            dataset_name="tcgCsvImportedKitsDataset",
            dataset_imports=dataset_imports,
            type_import_path="../../../../types/_index.types",
        ),
        encoding="utf-8",
    )


def render_kit_units_dataset(contents: list[NormalizedKitContent]) -> str:
    records = [unit for content in contents for unit in content.kit_units]
    const_names = [f"{identifier_pascal_case(record.seed_id_key)}KitUnit" for record in records]
    lines = [
        "import type {",
        "  KitUnitConfig,",
        "  SeedDataset,",
        '} from "../../../types/_index.types";',
        'import { kitId, kitUnitId, unitId } from "../../ids";',
        "",
        "/**",
        " * Imported kit-to-unit rows from source-backed kit content pages.",
        " * Generated by scripts/kit_content_importer/applyer.py.",
        " */",
        "",
    ]

    for record, const_name in zip(records, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: KitUnitConfig = {{",
                f'  id: kitUnitId({ts_string(record.seed_id_key)}),',
                f'  kit_id: kitId({ts_string(record.kit_seed_slug)}),',
                f'  unit_id: unitId({ts_string(record.unit_slug)}),',
                f"  unit_count: {record.unit_count},",
                f"  model_count: {record.model_count},",
                f'  component_type: {ts_string(record.component_type)},',
                "  effective_date: null,",
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        render_dataset(
            "kitContentImportedKitUnitsDataset",
            "kit_units",
            const_names,
            "KitUnitConfig",
        ),
    )
    return "\n".join(lines)


def render_kit_prices_dataset(
    prices: list[NormalizedKitPrice],
    *,
    dataset_name: str = "tcgCsvImportedKitPricesDataset",
    description: str = "Imported kit price rows from TCGCSV catalog data.",
    type_import_path: str = "../../../types/_index.types",
    ids_import_path: str = "../../ids",
) -> str:
    const_names = [f"{identifier_pascal_case(price.seed_id_key)}KitPrice" for price in prices]
    lines = [
        "import type {",
        "  KitPriceConfig,",
        "  SeedDataset,",
        f'}} from "{type_import_path}";',
        f'import {{ kitId, kitPriceId }} from "{ids_import_path}";',
        "",
        "/**",
        f" * {description}",
        " * Generated by scripts/kit_content_importer/applyer.py.",
        " */",
        "",
    ]

    for price, const_name in zip(prices, const_names, strict=True):
        lines.extend(
            [
                f"export const {const_name}: KitPriceConfig = {{",
                f'  id: kitPriceId({ts_string(price.seed_id_key)}),',
                f'  kit_id: kitId({ts_string(price.kit_seed_slug)}),',
                f'  currency: {ts_string(price.currency)},',
                f'  price: {ts_string(price.price)},',
                f'  price_source: {ts_string(price.price_source)},',
                f'  price_source_url: {ts_nullable_string(price.price_source_url)},',
                f"  observed_date: {ts_nullable_date(price.observed_date)},",
                "  superseded_date: null,",
                "};",
                "",
                "",
            ],
        )

    lines.extend(
        render_dataset(
            dataset_name,
            "kit_prices",
            const_names,
            "KitPriceConfig",
        ),
    )
    return "\n".join(lines)


def write_grouped_kit_prices_dataset(
    *,
    root_path: Path,
    prices_by_group: dict[str, list[NormalizedKitPrice]],
) -> None:
    reset_generated_directory(root_path)
    dataset_imports: list[tuple[str, str]] = []

    for group_slug, prices in sorted(prices_by_group.items()):
        dataset_name = f"tcgCsvImportedKitPrices{identifier_pascal_case(group_slug)}Dataset"
        file_name = f"{group_slug}.data.ts"
        (root_path / file_name).write_text(
            render_kit_prices_dataset(
                prices,
                dataset_name=dataset_name,
                description=f"Imported kit price rows from TCGCSV catalog data for {group_slug}.",
                type_import_path="../../../../types/_index.types",
                ids_import_path="../../../ids",
            ),
            encoding="utf-8",
        )
        dataset_imports.append((dataset_name, file_name))

    (root_path / "_index.data.ts").write_text(
        render_grouped_dataset_index(
            table_name="kit_prices",
            config_name="KitPriceConfig",
            dataset_name="tcgCsvImportedKitPricesDataset",
            dataset_imports=dataset_imports,
            type_import_path="../../../../types/_index.types",
        ),
        encoding="utf-8",
    )


def render_grouped_dataset_index(
    *,
    table_name: str,
    config_name: str,
    dataset_name: str,
    dataset_imports: list[tuple[str, str]],
    type_import_path: str,
) -> str:
    lines = [
        "import type {",
        f"  {config_name},",
        "  SeedDataset,",
        f'}} from "{type_import_path}";',
    ]
    lines.extend(
        f'import {{ {import_name} }} from "./{file_name.removesuffix(".ts")}";'
        for import_name, file_name in dataset_imports
    )
    lines.extend(
        [
            "",
            "/**",
            " * Aggregates TCGCSV generated seed shards.",
            " * Generated by scripts/kit_content_importer/applyer.py.",
            " */",
            f'export const {dataset_name}: SeedDataset<"{table_name}"> = {{',
            f'  table: "{table_name}",',
            "  records: [",
        ],
    )
    lines.extend(
        f"    ...{import_name}.records,"
        for import_name, _ in dataset_imports
    )
    lines.extend(
        [
            f"  ] satisfies {config_name}[],",
            "};",
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


def ensure_root_dataset_spread(
    *,
    path: Path,
    import_line: str,
    spread_line: str,
    config_name: str,
) -> None:
    text = path.read_text(encoding="utf-8")

    if import_line not in text:
        import_matches = list(re.finditer(r'^import .+;\n', text, flags=re.MULTILINE))
        if import_matches:
            insert_at = import_matches[-1].end()
            text = f"{text[:insert_at]}{import_line}\n{text[insert_at:]}"
        else:
            text = f"{import_line}\n{text}"

    if spread_line not in text:
        inline_empty_records = f"records: [] satisfies {config_name}[]"
        if inline_empty_records in text:
            text = text.replace(
                inline_empty_records,
                f"records: [\n{spread_line}\n  ] satisfies {config_name}[]",
            )
        else:
            text = text.replace(
                f"  ] satisfies {config_name}[],",
                f"{spread_line}\n  ] satisfies {config_name}[],",
            )

    path.write_text(text, encoding="utf-8")


def replace_in_file(path: Path, old: str, new: str) -> None:
    text = path.read_text(encoding="utf-8")
    if old not in text:
        return
    path.write_text(text.replace(old, new), encoding="utf-8")


def remove_stale_generated_file(path: Path) -> None:
    if path.exists():
        path.unlink()


def update_generated_ids(
    ids_path: Path,
    existing_kit_seed_slugs: list[str],
    kit_contents: list[NormalizedKitContent],
    unit_contents: list[NormalizedKitContent],
    kit_prices: list[NormalizedKitPrice],
) -> None:
    text = ids_path.read_text(encoding="utf-8")
    text = ensure_kit_price_id_section(text)
    kit_keys = [*existing_kit_seed_slugs, *[content.kit_seed_slug for content in kit_contents]]
    kit_unit_keys = [unit.seed_id_key for content in unit_contents for unit in content.kit_units]
    kit_price_keys = [price.seed_id_key for price in kit_prices]

    text = rewrite_id_section(
        text=text,
        type_name="KitSeedSlug",
        const_name="kitSeedIds",
        namespace="kit",
        keys=dedupe_preserve_order(kit_keys),
    )

    for key in kit_unit_keys:
        text = ensure_union_member(text, "KitUnitSeedSlug", key)
        text = ensure_record_entry(text, "kitUnitSeedIds", key, deterministic_ulid("kit_unit", key))

    text = rewrite_id_section(
        text=text,
        type_name="KitPriceSeedSlug",
        const_name="kitPriceSeedIds",
        namespace="kit_price",
        keys=dedupe_preserve_order(kit_price_keys),
    )

    ids_path.write_text(text, encoding="utf-8")


def ensure_kit_price_id_section(text: str) -> str:
    if "type KitPriceSeedSlug" in text:
        return text

    insert_after = re.search(
        r"export const kitUnitPriceAllocationId = \([\s\S]*?\n\};\n",
        text,
    )
    if not insert_after:
        raise ValueError("Missing kit unit price allocation ID section")

    section = """

type KitPriceSeedSlug = never;

const kitPriceSeedIds: Record<KitPriceSeedSlug, string> = {
};

export const kitPriceId = (slug: KitPriceSeedSlug): string => {
  return kitPriceSeedIds[slug];
};
"""
    return f"{text[:insert_after.end()]}{section}{text[insert_after.end():]}"


def ensure_union_member(text: str, type_name: str, key: str) -> str:
    member = f'  | "{key}"'
    if member in text:
        return text

    pattern = re.compile(rf"type {type_name} =(?P<body>.*?);", flags=re.DOTALL)
    match = pattern.search(text)
    if not match:
        raise ValueError(f"Missing {type_name} union")

    body = match.group("body")
    replacement_body = f"\n{member}" if body.strip() == "never" else f"{body}\n{member}"
    replacement = f"type {type_name} ={replacement_body};"
    return text[: match.start()] + replacement + text[match.end() :]


def rewrite_id_section(
    *,
    text: str,
    type_name: str,
    const_name: str,
    namespace: str,
    keys: list[str],
) -> str:
    existing_values = read_existing_record_values(text, const_name)
    type_pattern = re.compile(rf"type {type_name} =(?P<body>.*?);", flags=re.DOTALL)
    record_pattern = re.compile(
        rf"const {const_name}: Record<[^>]+, string> = \{{(?P<body>.*?)\n\}};",
        flags=re.DOTALL,
    )
    type_match = type_pattern.search(text)
    record_match = record_pattern.search(text)

    if not type_match or not record_match:
        raise ValueError(f"Missing {type_name}/{const_name} ID section")

    if keys:
        type_replacement = f"type {type_name} =\n" + "\n".join(
            f'  | "{key}"' for key in keys
        ) + ";"
    else:
        type_replacement = f"type {type_name} = never;"

    record_lines = [
        f'  "{key}": "{existing_values.get(key) or deterministic_ulid(namespace, key)}",'
        for key in keys
    ]
    record_replacement = (
        f"const {const_name}: Record<{record_type_name(const_name)}, string> = {{\n"
        + "\n".join(record_lines)
        + ("\n" if record_lines else "")
        + "};"
    )

    text = text[: type_match.start()] + type_replacement + text[type_match.end() :]
    record_match = record_pattern.search(text)
    if not record_match:
        raise ValueError(f"Missing rewritten {const_name} record")
    return text[: record_match.start()] + record_replacement + text[record_match.end() :]


def read_existing_record_values(text: str, const_name: str) -> dict[str, str]:
    pattern = re.compile(
        rf"const {const_name}: Record<[^>]+, string> = \{{(?P<body>.*?)\n\}};",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        return {}

    values: dict[str, str] = {}
    for entry in re.finditer(r'["\']?([^"\'\s:]+)["\']?:\s*"([^"]+)"', match.group("body")):
        values[entry.group(1)] = entry.group(2)
    return values


def ensure_record_entry(text: str, const_name: str, key: str, value: str) -> str:
    pattern = re.compile(
        rf"const {const_name}: Record<[^>]+, string> = \{{(?P<body>.*?)\n\}};",
        flags=re.DOTALL,
    )
    match = pattern.search(text)
    if not match:
        raise ValueError(f"Missing {const_name} record")

    body = match.group("body")
    if re.search(rf'["\']?{re.escape(key)}["\']?:\s*"', body):
        return text

    entry = f'\n  "{key}": "{value}",'
    replacement = f"const {const_name}: Record<{record_type_name(const_name)}, string> = {{{body}{entry}\n}};"
    return text[: match.start()] + replacement + text[match.end() :]


def record_type_name(const_name: str) -> str:
    return {
        "kitSeedIds": "KitSeedSlug",
        "kitUnitSeedIds": "KitUnitSeedSlug",
        "kitPriceSeedIds": "KitPriceSeedSlug",
    }[const_name]


def read_existing_root_kit_seed_slugs(path: Path) -> list[str]:
    text = path.read_text(encoding="utf-8")
    return re.findall(r'id:\s*kitId\("([^"]+)"\)', text)


def dedupe_preserve_order(values: list[str]) -> list[str]:
    seen: set[str] = set()
    deduped: list[str] = []
    for value in values:
        if value in seen:
            continue
        seen.add(value)
        deduped.append(value)
    return deduped


def group_tcgcsv_contents_by_faction(
    contents: list[NormalizedKitContent],
) -> dict[str, list[NormalizedKitContent]]:
    groups: dict[str, list[NormalizedKitContent]] = {}
    for content in contents:
        group_slug = content.faction_slug or "unassigned"
        groups.setdefault(group_slug, []).append(content)
    return groups


def group_tcgcsv_prices_by_faction(
    contents: list[NormalizedKitContent],
) -> dict[str, list[NormalizedKitPrice]]:
    groups: dict[str, list[NormalizedKitPrice]] = {}
    for content in contents:
        group_slug = content.faction_slug or "unassigned"
        groups.setdefault(group_slug, []).extend(content.kit_prices)
    return groups


def reset_generated_directory(path: Path) -> None:
    if path.exists():
        for existing_file in path.glob("*.data.ts"):
            existing_file.unlink()
    else:
        path.mkdir(parents=True, exist_ok=True)


def is_tcgcsv_content(content: NormalizedKitContent) -> bool:
    return content.source_kind.startswith("tcgcsv:")


def deterministic_ulid(namespace: str, seed: str) -> str:
    digest = hashlib.sha256(f"{namespace}:{seed}".encode("utf-8")).digest()
    value = int.from_bytes(digest, "big")
    chars: list[str] = []
    for _ in range(23):
        chars.append(CROCKFORD_BASE32[value & 31])
        value >>= 5
    return "01K" + "".join(reversed(chars))


def ts_string(value: str) -> str:
    return json.dumps(value)


def ts_nullable_string(value: str | None) -> str:
    return "null" if value is None else ts_string(value)


def ts_nullable_date(value: str | None) -> str:
    return "null" if value is None else f"new Date({ts_string(value)})"


def identifier_pascal_case(slug: str) -> str:
    parts = re.findall(r"[a-zA-Z0-9]+", slug)
    identifier = "".join(part[:1].upper() + part[1:] for part in parts)
    return f"Seed{identifier}" if not identifier or identifier[0].isdigit() else identifier
