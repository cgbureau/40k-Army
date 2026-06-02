from __future__ import annotations

import re
from datetime import datetime
from html import unescape
from urllib.parse import urlparse

from .models import (
    ImportedKitContentSource,
    ImportedTcgCsvRow,
    KitContentItem,
    NormalizedKitContent,
    NormalizedKitPrice,
    NormalizedKitUnit,
)


UNIT_ALIASES: dict[tuple[str, str], str] = {
    ("black_templars", "emperors_champion"): "emperors_champion",
    ("black_templars", "bladeguard_veterans"): "bladeguard_veteran_squad",
    ("black_templars", "sword_brethren"): "sword_brethren_squad",
    ("black_templars", "crusaders"): "crusader_squad",
}

TCGCSV_FACTION_ALIASES: dict[str, str] = {
    "craftworlds": "aeldari",
    "dark_angles": "dark_angels",
    "dark_eldar": "drukhari",
    "dark_eldar_drukhari": "drukhari",
    "eldar": "aeldari",
    "eldar_craftworlds": "aeldari",
    "harlequin": "aeldari",
    "harlequins": "aeldari",
    "necron": "necrons",
    "daemonifuge": "imperial_agents",
    "officio_assassinorum": "imperial_agents",
    "ordo_xenos": "imperial_agents",
    "skitarii": "adeptus_mechanicus",
    "space_marine": "space_marines",
    "tau": "tau_empire",
    "the_imperium": "unassigned",
    "vanguard_space_marines": "space_marines",
    "xenos_threat": "unassigned",
}

TCGCSV_DISPLAY_FACTION_PREFIXES: tuple[tuple[str, str], ...] = (
    ("Adepta Sororitas", "adepta_sororitas"),
    ("Adeptus Custodes", "adeptus_custodes"),
    ("Adeptus Mechanicus", "adeptus_mechanicus"),
    ("Adeptus Astartes", "space_marines"),
    ("Aeldari", "aeldari"),
    ("Astra Militarum", "astra_militarum"),
    ("Black Templars", "black_templars"),
    ("Blood Angels", "blood_angels"),
    ("Chaos Daemons", "chaos_daemons"),
    ("Chaos Knights", "chaos_knights"),
    ("Chaos Space Marines", "chaos_space_marines"),
    ("Chaos Space Marine", "chaos_space_marines"),
    ("Craftworlds", "aeldari"),
    ("Dark Angels", "dark_angels"),
    ("Dark Eldar", "drukhari"),
    ("Death Guard", "death_guard"),
    ("Deathwatch", "deathwatch"),
    ("Drukhari", "drukhari"),
    ("Eldar", "aeldari"),
    ("Genestealer Cults", "genestealer_cults"),
    ("Grey Knights", "grey_knights"),
    ("Harlequin", "aeldari"),
    ("Imperial Fists", "imperial_fists"),
    ("Imperial Knights", "imperial_knights"),
    ("Necrons", "necrons"),
    ("Necron", "necrons"),
    ("Orks", "orks"),
    ("Ork", "orks"),
    ("Space Marines", "space_marines"),
    ("Space Marine", "space_marines"),
    ("Space Wolves", "space_wolves"),
    ("T'au Empire", "tau_empire"),
    ("Tau Empire", "tau_empire"),
    ("Thousand Sons", "thousand_sons"),
    ("Tyranids", "tyranids"),
    ("Tyranid", "tyranids"),
    ("Ultramarines", "ultramarines"),
    ("White Scars", "white_scars"),
    ("World Eaters", "world_eaters"),
)

EXCLUDED_TCGCSV_FACTION_SLUGS = {
    "beasts_of_chaos",
    "ossiarch_bonereapers",
}

EXCLUDED_TCGCSV_DISPLAY_PREFIXES = (
    "Adeptus Titanicus",
    "Aeronautica Imperialis",
    "Blood Bowl",
    "Horus Heresy",
    "Necromunda",
)


def normalize_imported_sources(
    imported_sources: list[ImportedKitContentSource],
) -> list[NormalizedKitContent]:
    return [normalize_imported_source(imported) for imported in imported_sources]


def normalize_imported_source(imported: ImportedKitContentSource) -> NormalizedKitContent:
    if imported.source.source_kind != "miniset":
        raise ValueError(f"Unsupported kit content source: {imported.source.source_kind}")

    text = html_to_text(imported.body)
    display_name = extract_display_name(imported.body)
    official_url = extract_official_url(imported.body)
    model_count = extract_int(text, r"Miniatures in set:\s*(\d+)")
    release_date_text = extract_text(text, r"Released:\s*([^\n]+)")
    release_date = normalize_date(release_date_text)
    content_items = extract_content_items(text)
    quality_flags: list[str] = []
    content_quantity_sum = sum(item.quantity for item in content_items)

    if model_count is None:
        raise ValueError(f"Missing model count for {imported.source.url}")
    if content_quantity_sum == model_count:
        quality_flags.append("quantity_sum_matches_model_count")
    else:
        quality_flags.append("quantity_sum_mismatch_model_count")

    kit_seed_slug = snake_slug(imported.source.kit_slug)
    kit_units = [
        normalized_kit_unit(
            faction_slug=imported.source.faction_slug,
            kit_seed_slug=kit_seed_slug,
            item=item,
        )
        for item in content_items
    ]

    return NormalizedKitContent(
        kit_seed_slug=kit_seed_slug,
        kit_slug=imported.source.kit_slug,
        kit_name=display_name,
        display_name=display_name,
        faction_slug=imported.source.faction_slug,
        kit_type_slug=kit_type_slug(display_name, kit_units),
        model_count=model_count,
        gw_slug=slug_from_url(official_url),
        gw_short_slug=None,
        gw_year=year_from_slug(imported.source.kit_slug),
        gw_product_url=official_url,
        gw_image_url=None,
        gw_product_code=None,
        gw_short_code=None,
        product_gtin=None,
        tcgcsv_product_id=None,
        tcgcsv_product_url=None,
        release_date=release_date,
        source_url=imported.source.url,
        source_kind=imported.source.source_kind,
        content_items=content_items,
        kit_units=kit_units,
        kit_prices=[],
        quality_flags=quality_flags,
    )


def normalize_tcgcsv_rows(
    imported_rows: list[ImportedTcgCsvRow],
) -> list[NormalizedKitContent]:
    by_kit_slug: dict[str, ImportedTcgCsvRow] = {}

    for imported in imported_rows:
        display_name = tcgcsv_display_name(imported.row)
        if display_name is None:
            continue
        if not is_supported_tcgcsv_product(display_name, imported.row):
            continue

        kit_slug = snake_slug(display_name).replace("_", "-")
        existing = by_kit_slug.get(kit_slug)

        if existing is None or tcgcsv_row_sort_key(imported.row) < tcgcsv_row_sort_key(existing.row):
            by_kit_slug[kit_slug] = imported

    return [
        normalize_tcgcsv_row(imported)
        for _, imported in sorted(by_kit_slug.items())
    ]


def normalize_tcgcsv_row(imported: ImportedTcgCsvRow) -> NormalizedKitContent:
    display_name = tcgcsv_display_name(imported.row)
    if display_name is None:
        raise ValueError(f"Missing TCGCSV display name in {imported.source_file}")

    kit_slug = snake_slug(display_name).replace("_", "-")
    kit_seed_slug = snake_slug(display_name)
    product_id = clean_string(imported.row.get("productId"))
    product_url = clean_string(imported.row.get("url"))
    image_url = clean_string(imported.row.get("imageUrl"))
    part_code = clean_string(imported.row.get("extPartCode"))
    short_code = clean_string(imported.row.get("extShortCode"))
    gtin = clean_string(imported.row.get("extGTIN")) or clean_string(imported.row.get("extUPC"))

    return NormalizedKitContent(
        kit_seed_slug=kit_seed_slug,
        kit_slug=kit_slug,
        kit_name=display_name,
        display_name=display_name,
        faction_slug=tcgcsv_faction_slug(imported.row, display_name),
        kit_type_slug=tcgcsv_kit_type_slug(display_name),
        model_count=None,
        gw_slug=None,
        gw_short_slug=None,
        gw_year=None,
        gw_product_url=None,
        gw_image_url=image_url,
        gw_product_code=part_code,
        gw_short_code=short_code,
        product_gtin=gtin,
        tcgcsv_product_id=product_id,
        tcgcsv_product_url=product_url,
        release_date=None,
        source_url=product_url or imported.source_file,
        source_kind=f"tcgcsv:{imported.source_kind}",
        content_items=[],
        kit_units=[],
        kit_prices=tcgcsv_price_observations(
            kit_seed_slug=kit_seed_slug,
            product_url=product_url,
            row=imported.row,
        ),
        quality_flags=["catalog_contents_unknown"],
    )


def normalized_kit_unit(
    *,
    faction_slug: str,
    kit_seed_slug: str,
    item: KitContentItem,
) -> NormalizedKitUnit:
    unit_slug = UNIT_ALIASES.get((faction_slug, item.normalized_name))

    if unit_slug is None:
        raise ValueError(
            f"No unit alias for {item.name!r} in faction {faction_slug!r}",
        )

    return NormalizedKitUnit(
        seed_id_key=f"{kit_seed_slug}__{unit_slug}__complete_unit",
        kit_seed_slug=kit_seed_slug,
        unit_slug=unit_slug,
        unit_count=1,
        model_count=item.quantity,
        component_type="complete_unit",
        source_name=item.name,
    )


def extract_content_items(text: str) -> list[KitContentItem]:
    items: list[KitContentItem] = []

    for line in text.splitlines():
        clean_line = normalize_whitespace(line).lstrip("-\u2013\u2014 ").strip()
        match = re.match(r"^(\d+)\s*x\s+(.+?)\.?$", clean_line, flags=re.IGNORECASE)
        if not match:
            continue

        name = clean_content_name(match.group(2))
        if not name:
            continue

        items.append(
            KitContentItem(
                quantity=int(match.group(1)),
                name=name,
                normalized_name=snake_slug(name),
                source_text=f"{match.group(1)}x {name}",
            ),
        )

    return items


def html_to_text(html: str) -> str:
    with_breaks = re.sub(r"<br\s*/?>", "\n", html, flags=re.IGNORECASE)
    with_paragraphs = re.sub(r"</p\s*>", "\n", with_breaks, flags=re.IGNORECASE)
    without_tags = re.sub(r"<[^>]+>", "", with_paragraphs)
    lines = [
        normalize_whitespace(line)
        for line in unescape(without_tags).splitlines()
        if normalize_whitespace(line)
    ]
    return "\n".join(lines)


def extract_display_name(html: str) -> str:
    match = re.search(
        r'<h1[^>]*id="page-title"[^>]*>(?P<name>.*?)</h1>',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    )
    if not match:
        raise ValueError("Missing Miniset page title")
    return normalize_whitespace(unescape(re.sub(r"<[^>]+>", "", match.group("name"))))


def extract_official_url(html: str) -> str | None:
    match = re.search(r'href="(?P<url>https://www\.warhammer\.com/[^"]+)"', html)
    return match.group("url") if match else None


def extract_int(text: str, pattern: str) -> int | None:
    match = re.search(pattern, text, flags=re.IGNORECASE)
    return int(match.group(1)) if match else None


def extract_text(text: str, pattern: str) -> str | None:
    match = re.search(pattern, text, flags=re.IGNORECASE)
    return normalize_whitespace(match.group(1)) if match else None


def normalize_date(value: str | None) -> str | None:
    if not value:
        return None
    try:
        return datetime.strptime(value, "%d %B %Y").date().isoformat()
    except ValueError:
        return None


def clean_content_name(value: str) -> str:
    return normalize_whitespace(re.sub(r"[;,.]+$", "", value))


def kit_type_slug(display_name: str, kit_units: list[NormalizedKitUnit]) -> str:
    if display_name.lower().startswith("combat patrol:"):
        return "combat_patrol"
    return "single_faction_multi_unit" if len(kit_units) > 1 else "single_faction_single_unit"


def tcgcsv_display_name(row: dict[str, str]) -> str | None:
    raw_name = clean_string(row.get("name")) or clean_string(row.get("cleanName"))
    if raw_name is None:
        return None

    return normalize_whitespace(
        re.sub(
            r"^Warhammer(?:\s*:\s*|\s+)40K\s*[-:]\s*",
            "",
            raw_name,
            flags=re.IGNORECASE,
        ),
    )


def is_supported_tcgcsv_product(display_name: str, row: dict[str, str]) -> bool:
    faction_slug = tcgcsv_faction_slug(row, display_name)
    if faction_slug in EXCLUDED_TCGCSV_FACTION_SLUGS:
        return False

    return not display_name.startswith(EXCLUDED_TCGCSV_DISPLAY_PREFIXES)


def tcgcsv_faction_slug(row: dict[str, str], display_name: str | None = None) -> str:
    if display_name:
        display_name_lower = display_name.lower()
        for prefix, faction_slug in TCGCSV_DISPLAY_FACTION_PREFIXES:
            if display_name_lower.startswith(prefix.lower()):
                return faction_slug

    source_slug = snake_slug(row.get("extArmy") or row.get("extFaction") or "")
    return TCGCSV_FACTION_ALIASES.get(source_slug, source_slug)


def tcgcsv_kit_type_slug(display_name: str) -> str:
    if display_name.lower().startswith("combat patrol:"):
        return "combat_patrol"
    return "catalog_product_unknown_contents"


def tcgcsv_price_observations(
    *,
    kit_seed_slug: str,
    product_url: str | None,
    row: dict[str, str],
) -> list[NormalizedKitPrice]:
    price_fields = [
        ("extMSRP", "tcgcsv_msrp_usd"),
        ("lowPrice", "tcgcsv_low_usd"),
        ("midPrice", "tcgcsv_mid_usd"),
        ("highPrice", "tcgcsv_high_usd"),
        ("marketPrice", "tcgcsv_market_usd"),
        ("directLowPrice", "tcgcsv_direct_low_usd"),
    ]
    prices: list[NormalizedKitPrice] = []

    for field_name, price_source in price_fields:
        price = normalize_price(row.get(field_name))
        if price is None:
            continue

        prices.append(
            NormalizedKitPrice(
                seed_id_key=f"{kit_seed_slug}__{price_source}",
                kit_seed_slug=kit_seed_slug,
                currency="usd",
                price=price,
                price_source=price_source,
                price_source_url=product_url,
                observed_date=None,
            ),
        )

    return prices


def normalize_price(value: str | None) -> str | None:
    clean_value = clean_string(value)
    if clean_value is None:
        return None

    try:
        parsed = float(clean_value)
    except ValueError:
        return None

    if parsed <= 0:
        return None

    return f"{parsed:.2f}"


def tcgcsv_row_sort_key(row: dict[str, str]) -> tuple[str, str]:
    return (clean_string(row.get("extPartCode")) or "", clean_string(row.get("productId")) or "")


def slug_from_url(url: str | None) -> str | None:
    if not url:
        return None
    return urlparse(url).path.rstrip("/").split("/")[-1] or None


def year_from_slug(slug: str) -> int | None:
    match = re.search(r"(20\d{2})$", slug)
    return int(match.group(1)) if match else None


def clean_string(value: str | None) -> str | None:
    if value is None:
        return None
    clean_value = normalize_whitespace(value)
    return clean_value or None


def snake_slug(value: str) -> str:
    return re.sub(r"_+", "_", re.sub(r"[^A-Za-z0-9]+", "_", value.replace("'", ""))).strip("_").lower()


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()
