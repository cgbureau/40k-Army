from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache
from pathlib import Path
from typing import Any

import yaml

REGISTRY_PATH = Path(__file__).resolve().parents[1] / "config" / "import_kinds.yaml"


@dataclass(frozen=True)
class ImportKindSpec:
    name: str
    collect_kind: str | None
    normalize_handler: str | None
    apply_handler: str | None
    record_groups: tuple[str, ...]
    required_page_kinds: tuple[str, ...]
    generated_tables: tuple[str, ...]
    owning_collection: str | None
    status: str  # supported | partial | experimental | disabled
    notes: str


@lru_cache(maxsize=None)
def load_import_kinds() -> list[ImportKindSpec]:
    """Load the import kind registry from config/import_kinds.yaml."""
    raw = yaml.safe_load(REGISTRY_PATH.read_text(encoding="utf-8"))
    if not isinstance(raw, dict) or "import_kinds" not in raw:
        raise ValueError(
            f"import_kinds.yaml must be a mapping with a top-level 'import_kinds' key. "
            f"Got: {type(raw).__name__}"
        )
    entries = raw["import_kinds"]
    return [
        ImportKindSpec(
            name=entry["name"],
            collect_kind=entry.get("collect_kind"),
            normalize_handler=entry.get("normalize_handler"),
            apply_handler=entry.get("apply_handler"),
            record_groups=tuple(entry.get("record_groups") or []),
            required_page_kinds=tuple(entry.get("required_page_kinds") or []),
            generated_tables=tuple(entry.get("generated_tables") or []),
            owning_collection=entry.get("owning_collection"),
            status=entry.get("status", "partial"),
            notes=entry.get("notes", ""),
        )
        for entry in entries
    ]


def get_import_kind(name: str) -> ImportKindSpec | None:
    """Look up an import kind spec by CLI name. Returns None if not found."""
    for spec in load_import_kinds():
        if spec.name == name:
            return spec
    return None
