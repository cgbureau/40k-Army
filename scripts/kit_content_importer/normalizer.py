from __future__ import annotations

import re
from datetime import datetime
from html import unescape
from urllib.parse import urlparse

from .models import (
    ImportedKitContentSource,
    KitContentItem,
    NormalizedKitContent,
    NormalizedKitUnit,
)


UNIT_ALIASES: dict[tuple[str, str], str] = {
    ("black_templars", "emperors_champion"): "emperors_champion",
    ("black_templars", "bladeguard_veterans"): "bladeguard_veteran_squad",
    ("black_templars", "sword_brethren"): "sword_brethren_squad",
    ("black_templars", "crusaders"): "crusader_squad",
}


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
        release_date=release_date,
        source_url=imported.source.url,
        source_kind=imported.source.source_kind,
        content_items=content_items,
        kit_units=kit_units,
        quality_flags=quality_flags,
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


def slug_from_url(url: str | None) -> str | None:
    if not url:
        return None
    return urlparse(url).path.rstrip("/").split("/")[-1] or None


def year_from_slug(slug: str) -> int | None:
    match = re.search(r"(20\d{2})$", slug)
    return int(match.group(1)) if match else None


def snake_slug(value: str) -> str:
    return re.sub(r"_+", "_", re.sub(r"[^A-Za-z0-9]+", "_", value.replace("'", ""))).strip("_").lower()


def normalize_whitespace(value: str) -> str:
    return re.sub(r"\s+", " ", value).strip()
