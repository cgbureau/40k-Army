from __future__ import annotations

from pathlib import Path

from kit_content_importer.applyer import apply_normalized_kit_contents
from kit_content_importer.importer import DEFAULT_SOURCES
from kit_content_importer.models import ImportedKitContentSource, ImportedTcgCsvRow
from kit_content_importer.normalizer import normalize_imported_source, normalize_tcgcsv_row
from kit_content_importer.tests.test_normalizer import BLACK_TEMPLARS_MINISET_HTML


def test_applies_normalized_kit_content_to_typed_seed_datasets(tmp_path: Path) -> None:
    write_minimal_seed_workspace(tmp_path)
    normalized = normalize_imported_source(
        ImportedKitContentSource(
            source=DEFAULT_SOURCES[0],
            body=BLACK_TEMPLARS_MINISET_HTML,
        ),
    )
    tcgcsv_product = normalize_tcgcsv_row(
        ImportedTcgCsvRow(
            source_file="WarhammerPlasticBoxSetsProductsAndPrices.csv",
            source_kind="plastic_box_sets",
            row={
                "productId": "485892",
                "name": "Warhammer: 40K - Combat Patrol: Blood Angels",
                "cleanName": "Warhammer 40K Combat Patrol Blood Angels",
                "imageUrl": "https://tcgplayer-cdn.tcgplayer.com/product/485892_200w.jpg",
                "url": "https://cpt.tcgcsv.com/SmV5",
                "extGameSeries": "Warhammer: 40K",
                "extArmy": "Blood Angels",
                "extFaction": "The Imperium",
                "extMSRP": "140.00",
                "lowPrice": "",
                "midPrice": "",
                "highPrice": "",
                "marketPrice": "",
                "directLowPrice": "",
                "extShortCode": "41-25",
                "extPartCode": "99120101333",
                "extUPC": "",
                "extGTIN": "5011921131234",
            },
        ),
    )

    apply_normalized_kit_contents([normalized, tcgcsv_product], tmp_path)

    kits_shard = (
        tmp_path
        / "db/seed_config/seed/data/kits/kit_content/miniset/black_templars.data.ts"
    )
    tcgcsv_kits_shard = (
        tmp_path
        / "db/seed_config/seed/data/kits/tcgcsv/_index.data.ts"
    )
    kit_units_shard = (
        tmp_path
        / "db/seed_config/seed/data/kit_units/kit_content/miniset/black_templars.data.ts"
    )
    kit_prices_shard = (
        tmp_path
        / "db/seed_config/seed/data/kit_prices/tcgcsv/blood_angels.data.ts"
    )
    ids_path = tmp_path / "db/seed_config/seed/ids/generated_game_data.ids.ts"

    assert kits_shard.exists()
    assert tcgcsv_kits_shard.exists()
    assert kit_units_shard.exists()
    assert kit_prices_shard.exists()
    assert not (
        tmp_path / "data/normalized/kit-content-candidates/black_templars.json"
    ).exists()
    assert 'kitId("combat_patrol_black_templars_2025")' in kits_shard.read_text()
    assert 'kit_type_id: kitTypeId("combat_patrol")' in kits_shard.read_text()
    assert 'kitId("combat_patrol_blood_angels")' not in tcgcsv_kits_shard.read_text()
    assert 'kitPriceId("combat_patrol_blood_angels__tcgcsv_msrp_usd")' in (
        kit_prices_shard.read_text()
    )
    assert 'unitId("crusader_squad")' in kit_units_shard.read_text()
    assert 'source_kind: "miniset"' in kit_units_shard.read_text()
    assert (
        'source_url: "https://miniset.net/sets/gw-99120101428?language=en"'
        in kit_units_shard.read_text()
    )
    assert 'source_text: "10x Crusaders"' in kit_units_shard.read_text()
    assert 'review_status: "approved"' in kit_units_shard.read_text()
    assert "...kitContentImportedKitsDataset.records" in (
        tmp_path / "db/seed_config/seed/data/kits.data.ts"
    ).read_text()
    assert "...tcgCsvImportedKitsDataset.records" in (
        tmp_path / "db/seed_config/seed/data/kits.data.ts"
    ).read_text()
    assert './kits/tcgcsv/_index.data' in (
        tmp_path / "db/seed_config/seed/data/kits.data.ts"
    ).read_text()
    assert './kits/kit_content/_index.data' in (
        tmp_path / "db/seed_config/seed/data/kits.data.ts"
    ).read_text()
    assert "...kitContentImportedKitUnitsDataset.records" in (
        tmp_path / "db/seed_config/seed/data/kit_units.data.ts"
    ).read_text()
    assert './kit_units/kit_content/_index.data' in (
        tmp_path / "db/seed_config/seed/data/kit_units.data.ts"
    ).read_text()
    assert "...tcgCsvImportedKitPricesDataset.records" in (
        tmp_path / "db/seed_config/seed/data/kit_prices.data.ts"
    ).read_text()
    assert './kit_prices/tcgcsv/_index.data' in (
        tmp_path / "db/seed_config/seed/data/kit_prices.data.ts"
    ).read_text()
    assert '"combat_patrol_black_templars_2025"' in ids_path.read_text()
    assert (
        '"combat_patrol_black_templars_2025__crusader_squad__complete_unit"'
        in ids_path.read_text()
    )
    assert '"combat_patrol_blood_angels__tcgcsv_msrp_usd"' in ids_path.read_text()


def write_minimal_seed_workspace(root: Path) -> None:
    data_root = root / "db/seed_config/seed/data"
    ids_root = root / "db/seed_config/seed/ids"
    data_root.mkdir(parents=True)
    ids_root.mkdir(parents=True)
    (data_root / "kits.data.ts").write_text(
        "\n".join(
            [
                'import type { KitConfig, SeedDataset } from "../../types/_index.types";',
                'import { kitId, kitTypeId } from "../ids";',
                "",
                'export const kitsDataset: SeedDataset<"kits"> = {',
                '  table: "kits",',
                "  records: [",
                '    { id: kitId("combat_patrol_blood_angels") },',
                "  ] satisfies KitConfig[],",
                "};",
                "",
            ],
        ),
    )
    (data_root / "kit_units.data.ts").write_text(
        "\n".join(
            [
                'import type { KitUnitConfig, SeedDataset } from "../../types/_index.types";',
                'import { kitId, kitUnitId, unitId } from "../ids";',
                "",
                'export const kitUnitsDataset: SeedDataset<"kit_units"> = {',
                '  table: "kit_units",',
                "  records: [",
                "  ] satisfies KitUnitConfig[],",
                "};",
                "",
            ],
        ),
    )
    (data_root / "kit_prices.data.ts").write_text(
        "\n".join(
            [
                'import type { KitPriceConfig, SeedDataset } from "../../types/_index.types";',
                "",
                'export const kitPricesDataset: SeedDataset<"kit_prices"> = {',
                '  table: "kit_prices",',
                "  records: [",
                "  ] satisfies KitPriceConfig[],",
                "};",
                "",
            ],
        ),
    )
    (ids_root / "generated_game_data.ids.ts").write_text(
        "\n".join(
            [
                'type KitSeedSlug =',
                '  | "existing_kit"',
                '  | "combat_patrol_blood_angels";',
                "",
                "const kitSeedIds: Record<KitSeedSlug, string> = {",
                '  existing_kit: "01K00000000000000000000000",',
                '  combat_patrol_blood_angels: "01K00000000000000000000002",',
                "};",
                "",
                "export const kitId = (slug: KitSeedSlug): string => {",
                "  return kitSeedIds[slug];",
                "};",
                "",
                'type KitUnitSeedSlug =',
                '  | "existing_kit__existing_unit__complete_unit";',
                "",
                "const kitUnitSeedIds: Record<KitUnitSeedSlug, string> = {",
                '  "existing_kit__existing_unit__complete_unit": "01K00000000000000000000001",',
                "};",
                "",
                "export const kitUnitId = (slug: KitUnitSeedSlug): string => {",
                "  return kitUnitSeedIds[slug];",
                "};",
                "",
                'type KitUnitPriceAllocationSeedSlug =',
                '  | "existing_kit__existing_unit";',
                "",
                "const kitUnitPriceAllocationSeedIds: Record<",
                "  KitUnitPriceAllocationSeedSlug,",
                "  string",
                "> = {",
                '  "existing_kit__existing_unit": "01K00000000000000000000003",',
                "};",
                "",
                "export const kitUnitPriceAllocationId = (",
                "  slug: KitUnitPriceAllocationSeedSlug,",
                "): string => {",
                "  return kitUnitPriceAllocationSeedIds[slug];",
                "};",
                "",
            ],
        ),
    )
