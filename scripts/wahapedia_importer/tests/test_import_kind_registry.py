import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from scripts.wahapedia_importer.contracts.import_kind import ImportKindSpec, load_import_kinds

VALID_STATUSES = {"supported", "partial", "experimental", "disabled"}

KNOWN_KINDS = {
    "rules-sources",
    "faction-data",
    "kit-units",
    "kit-unit-price-allocations",
    "abilities",
    "keywords",
}


def test_all_kinds_load() -> None:
    specs = load_import_kinds()
    assert isinstance(specs, list), "load_import_kinds() must return a list"
    assert len(specs) > 0, "registry must contain at least one import kind"
    for spec in specs:
        assert isinstance(spec, ImportKindSpec), f"expected ImportKindSpec, got {type(spec)}"


def test_every_kind_has_status() -> None:
    specs = load_import_kinds()
    for spec in specs:
        assert spec.status in VALID_STATUSES, (
            f"kind '{spec.name}' has invalid status '{spec.status}'; "
            f"must be one of {VALID_STATUSES}"
        )


def test_every_kind_with_normalize_has_apply_or_noted() -> None:
    specs = load_import_kinds()
    for spec in specs:
        if spec.normalize_handler is not None:
            has_apply = spec.apply_handler is not None
            has_note = bool(spec.notes and spec.notes.strip())
            assert has_apply or has_note, (
                f"kind '{spec.name}' has a normalize_handler but no apply_handler "
                f"and no notes explaining the omission"
            )


def test_known_kinds_present() -> None:
    specs = load_import_kinds()
    names = {spec.name for spec in specs}
    missing = KNOWN_KINDS - names
    assert not missing, f"expected import kinds not found in registry: {missing}"


def test_record_groups_non_empty_for_normalize_kinds() -> None:
    specs = load_import_kinds()
    for spec in specs:
        if spec.normalize_handler is not None:
            assert len(spec.record_groups) > 0, (
                f"kind '{spec.name}' has a normalize_handler but record_groups is empty"
            )
