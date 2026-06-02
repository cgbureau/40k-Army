from __future__ import annotations

from dataclasses import dataclass, field


KitContentSourceKind = str


@dataclass(frozen=True)
class KitContentSource:
    faction_slug: str
    kit_slug: str
    source_kind: KitContentSourceKind
    url: str


@dataclass(frozen=True)
class ImportedKitContentSource:
    source: KitContentSource
    body: str


@dataclass(frozen=True)
class ImportedTcgCsvRow:
    source_file: str
    source_kind: str
    row: dict[str, str]


@dataclass(frozen=True)
class KitContentItem:
    quantity: int
    name: str
    normalized_name: str
    source_text: str


@dataclass(frozen=True)
class NormalizedKitUnit:
    seed_id_key: str
    kit_seed_slug: str
    unit_slug: str
    unit_count: int
    model_count: int
    component_type: str
    source_name: str


@dataclass(frozen=True)
class NormalizedKitPrice:
    seed_id_key: str
    kit_seed_slug: str
    currency: str
    price: str
    price_source: str
    price_source_url: str | None
    observed_date: str | None


@dataclass(frozen=True)
class NormalizedKitContent:
    kit_seed_slug: str
    kit_slug: str
    kit_name: str
    display_name: str
    faction_slug: str
    kit_type_slug: str
    model_count: int | None
    gw_slug: str | None
    gw_short_slug: str | None
    gw_year: int | None
    gw_product_url: str | None
    gw_image_url: str | None
    gw_product_code: str | None
    gw_short_code: str | None
    product_gtin: str | None
    tcgcsv_product_id: str | None
    tcgcsv_product_url: str | None
    release_date: str | None
    source_url: str
    source_kind: KitContentSourceKind
    content_items: list[KitContentItem] = field(default_factory=list)
    kit_units: list[NormalizedKitUnit] = field(default_factory=list)
    kit_prices: list[NormalizedKitPrice] = field(default_factory=list)
    quality_flags: list[str] = field(default_factory=list)
