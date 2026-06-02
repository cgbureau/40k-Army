from __future__ import annotations

from pathlib import Path

from kit_content_importer.applyer import apply_normalized_kit_contents
from kit_content_importer.importer import DEFAULT_SOURCES
from kit_content_importer.models import ImportedKitContentSource
from kit_content_importer.normalizer import normalize_imported_source
from kit_content_importer.tests.test_normalizer import BLACK_TEMPLARS_MINISET_HTML


def test_applies_normalized_kit_content_to_typed_seed_datasets(tmp_path: Path) -> None:
    write_minimal_seed_workspace(tmp_path)
    normalized = normalize_imported_source(
        ImportedKitContentSource(
            source=DEFAULT_SOURCES[0],
            body=BLACK_TEMPLARS_MINISET_HTML,
        ),
    )

    apply_normalized_kit_contents([normalized], tmp_path)

    kits_shard = (
        tmp_path
        / "db/seed_config/seed/data/kits/kit_content_imported.data.ts"
    )
    kit_units_shard = (
        tmp_path
        / "db/seed_config/seed/data/kit_units/kit_content_imported.data.ts"
    )
    ids_path = tmp_path / "db/seed_config/seed/ids/generated_game_data.ids.ts"

    assert kits_shard.exists()
    assert kit_units_shard.exists()
    assert not (
        tmp_path / "data/normalized/kit-content-candidates/black_templars.json"
    ).exists()
    assert 'kitId("combat_patrol_black_templars_2025")' in kits_shard.read_text()
    assert 'kit_type_id: kitTypeId("combat_patrol")' in kits_shard.read_text()
    assert 'unitId("crusader_squad")' in kit_units_shard.read_text()
    assert "...kitContentImportedKitsDataset.records" in (
        tmp_path / "db/seed_config/seed/data/kits.data.ts"
    ).read_text()
    assert "...kitContentImportedKitUnitsDataset.records" in (
        tmp_path / "db/seed_config/seed/data/kit_units.data.ts"
    ).read_text()
    assert '"combat_patrol_black_templars_2025"' in ids_path.read_text()
    assert (
        '"combat_patrol_black_templars_2025__crusader_squad__complete_unit"'
        in ids_path.read_text()
    )


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
    (ids_root / "generated_game_data.ids.ts").write_text(
        "\n".join(
            [
                'type KitSeedSlug =',
                '  | "existing_kit";',
                "",
                "const kitSeedIds: Record<KitSeedSlug, string> = {",
                '  existing_kit: "01K00000000000000000000000",',
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
            ],
        ),
    )
