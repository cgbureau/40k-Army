"""Parse a single Wahapedia unit-datasheet HTML page.

All public functions accept raw HTML and return plain dicts or lists of dicts.
They are pure functions with no I/O so they can be tested in isolation.
"""
from __future__ import annotations

import re
from html import unescape
from typing import Any


# ---------------------------------------------------------------------------
# Unit name
# ---------------------------------------------------------------------------

def parse_unit_name(html: str) -> str | None:
    """Return the unit name from the dsH2Header div, or None if not found."""
    match = re.search(
        r'class="dsH2Header"[^>]*>\s*<div>(?P<name>[^<]+)</div>',
        html,
    )
    if not match:
        return None
    return _clean_text(match.group("name"))


# ---------------------------------------------------------------------------
# Model profiles (stat blocks)
# ---------------------------------------------------------------------------

def parse_model_profiles(html: str, unit_name: str | None = None) -> list[dict[str, Any]]:
    """Return one dict per model profile block found on the datasheet.

    Each dict has:
        model_name  : str  — e.g. "GRETCHIN", "RUNTHERD"
        base_size   : str | None  — e.g. "25mm"
        stats       : dict[str, str]  — keyed by stat label, e.g. {"M": "6\"", "T": "2"}

    Single-model vehicles have no dsModelName span in their profile block.
    Pass unit_name as a fallback so those units still produce a profile record.
    """
    results: list[dict[str, Any]] = []

    # Stat labels only appear in the first profile block; subsequent blocks
    # reuse the same column order.
    stat_labels: list[str] = []
    first_block = True

    for block_match in re.finditer(
        r'class="dsProfileBaseWrap"(?P<block>.*?)(?=class="dsProfileBaseWrap"|class="ds2col\b)',
        html,
        flags=re.DOTALL,
    ):
        block = block_match.group("block")

        name_match = re.search(r'class="dsModelName[^"]*"[^>]*>([^<]+)', block)
        # Single-model vehicles omit the dsModelName span; fall back to unit_name.
        if name_match:
            model_name = _clean_text(name_match.group(1))
        elif unit_name:
            model_name = unit_name.upper()
        else:
            continue

        base_match = re.search(
            r'class="dsModelBase[^"]*"[^>]*>\(&#8960;(?P<size>[^)]+)\)', block
        )
        base_size = _clean_text(base_match.group("size")) if base_match else None

        if first_block:
            stat_labels = re.findall(r'class="dsCharName"[^>]*>([^<]+)', block)
            first_block = False

        stat_values = re.findall(r'class="dsCharValue[^"]*"[^>]*>([^<]+)', block)

        stats: dict[str, str] = {}
        for label, value in zip(stat_labels, stat_values):
            stats[_clean_text(label)] = _clean_text(value)

        if stats:
            results.append(
                {"model_name": model_name, "base_size": base_size, "stats": stats}
            )

    return results


# ---------------------------------------------------------------------------
# Weapon tables
# ---------------------------------------------------------------------------

def parse_weapons(html: str) -> list[dict[str, Any]]:
    """Return one dict per weapon row (wTable2_short) on the datasheet.

    Each dict has:
        weapon_name     : str
        weapon_type     : "ranged" | "melee"
        range           : str
        attacks         : str
        skill           : str   — BS for ranged, WS for melee
        strength        : str
        armor_penetration : int
        damage          : str
        keywords        : list[dict]  — each: {keyword_name, keyword_parameter}
    """
    results: list[dict[str, Any]] = []
    current_type = "ranged"

    # Walk through ranged/melee section markers and weapon rows together
    # by scanning the weapon-table area of the page.
    ds_start = html.find('class="dsH2Header"')
    if ds_start < 0:
        return results
    # Weapon tables sit in the main datasheet section before the keywords block
    kw_start = html.find('class="ds2colKW', ds_start)
    table_html = html[ds_start:kw_start] if kw_start > 0 else html[ds_start:]

    for token_match in re.finditer(
        r'(?P<ranged>class="dsRangedIcon")|'
        r'(?P<melee>class="dsMeleeIcon")|'
        r'(?P<row>class="wTable2_short pad2626")',
        table_html,
        flags=re.DOTALL,
    ):
        if token_match.group("ranged"):
            current_type = "ranged"
            continue
        if token_match.group("melee"):
            current_type = "melee"
            continue

        # It's a weapon row — grab the surrounding <tr> context
        row_start = table_html.rfind("<tr", 0, token_match.start())
        row_end = table_html.find("</tr>", token_match.start()) + 5
        row_html = table_html[row_start:row_end]

        name_cell_match = re.search(
            r'class="wTable2_short pad2626"[^>]*>(.*?)</td>',
            row_html,
            flags=re.DOTALL,
        )
        if not name_cell_match:
            continue

        name_cell = name_cell_match.group(1)
        weapon_name = _extract_weapon_name(name_cell)
        keywords = _extract_weapon_keywords(name_cell)

        # Remaining stat cells: Range, A, BS/WS, S, AP, D
        stat_cells = re.findall(
            r'class="ct pad2626"[^>]*>\s*([^<]+?)\s*</div>', row_html
        )
        if len(stat_cells) < 6:
            continue

        try:
            ap_raw = stat_cells[4].strip()
            ap_int = int(ap_raw) if ap_raw not in ("N/A", "-", "") else 0
        except ValueError:
            ap_int = 0

        results.append(
            {
                "weapon_name": weapon_name,
                "weapon_type": current_type,
                "range": stat_cells[0].strip(),
                "attacks": stat_cells[1].strip(),
                "skill": stat_cells[2].strip(),
                "strength": stat_cells[3].strip(),
                "armor_penetration": ap_int,
                "damage": stat_cells[5].strip(),
                "keywords": keywords,
            }
        )

    return results


def _extract_weapon_name(cell_html: str) -> str:
    """Strip keyword tags and HTML to get the bare weapon name."""
    # Remove the kwb2 span (weapon keywords) entirely
    clean = re.sub(r'<span class="kwb2[^"]*".*?</span>\s*</span>', "", cell_html, flags=re.DOTALL)
    # Remove any remaining tags
    clean = re.sub(r"<[^>]+>", "", clean)
    return _clean_text(clean)


def _extract_weapon_keywords(cell_html: str) -> list[dict[str, str | None]]:
    """Extract bracketed weapon keywords like [PISTOL] or [SUSTAINED HITS 1].

    Returns a list of dicts with keyword_name and keyword_parameter (nullable).
    """
    keywords: list[dict[str, str | None]] = []
    # Each kwbu span holds one word of the keyword; they group inside a kwb2 span
    for kw_block in re.finditer(
        r'class="kwb2[^"]*".*?</span>\s*</span>',
        cell_html,
        flags=re.DOTALL,
    ):
        parts = re.findall(r'class="tt kwbu"[^>]*>([^<]+)', kw_block.group())
        if not parts:
            continue
        words = [_clean_text(p) for p in parts]
        # Trailing numeric/threshold tokens are the parameter
        # e.g. ["sustained", "hits", "1"] → name="sustained hits", param="1"
        # e.g. ["anti", "infantry", "4+"] → name="anti infantry", param="4+"
        param: str | None = None
        if words and re.match(r"^\d+\+?$", words[-1]):
            param = words[-1]
            words = words[:-1]
        keyword_name = " ".join(words).lower()
        keywords.append({"keyword_name": keyword_name, "keyword_parameter": param})

    return keywords


# ---------------------------------------------------------------------------
# Unit composition, equipment assignments, and points
# ---------------------------------------------------------------------------

def parse_composition(html: str) -> dict[str, Any]:
    """Parse the UNIT COMPOSITION section.

    Returns:
        configs         : list[dict]  — each: {model_counts: dict[name, count], total_models: int}
        equipment       : dict[str, list[str]]  — model_name → list of weapon names
        point_costs     : list[dict]  — each: {model_count: int, points: int}
    """
    ds_start = html.find('class="dsH2Header"')
    if ds_start < 0:
        return {"configs": [], "equipment": {}, "point_costs": []}

    comp_start = html.find("UNIT COMPOSITION", ds_start)
    if comp_start < 0:
        return {"configs": [], "equipment": {}, "point_costs": []}

    # Bound the composition block by the keyword columns that follow it.
    kw_start = html.find('class="ds2colKW', comp_start)
    comp_block = html[comp_start:kw_start] if kw_start > 0 else html[comp_start:]

    configs = _parse_composition_configs(comp_block)
    equipment = _parse_equipment_assignments(comp_block)
    point_costs = _parse_point_costs(comp_block)

    return {"configs": configs, "equipment": equipment, "point_costs": point_costs}


def _parse_composition_configs(comp_html: str) -> list[dict[str, Any]]:
    """Parse OR-separated composition configurations from the composition div."""
    configs: list[dict[str, Any]] = []

    for li_match in re.finditer(r"<li[^>]*><b>([^<]+)</b></li>", comp_html):
        text = _clean_text(li_match.group(1))
        model_counts = _parse_model_count_text(text)
        if model_counts:
            total = sum(model_counts.values())
            configs.append({"model_counts": model_counts, "total_models": total})

    return configs


def _parse_model_count_text(text: str) -> dict[str, int]:
    """Parse "1 Runtherd and 10 Gretchin" → {"Runtherd": 1, "Gretchin": 10}."""
    result: dict[str, int] = {}
    for part in re.split(r"\band\b", text, flags=re.IGNORECASE):
        part = part.strip()
        count_match = re.match(r"^(\d+)\s+(.+)$", part)
        if count_match:
            count = int(count_match.group(1))
            name = count_match.group(2).strip()
            # Wahapedia pluralises model names when count > 1 (e.g. "2 Runtherds").
            # Strip the trailing 's' so configs use a consistent singular key.
            if count > 1 and name.endswith("s") and not name.endswith("ss"):
                name = name[:-1]
            result[name] = count
    return result


def _parse_equipment_assignments(comp_html: str) -> dict[str, list[str]]:
    """Parse equipment lines from the composition block.

    Handles two patterns:
    - "Every Runtherd is equipped with: slugga; Runtherd tools."  (multi-model units)
    - "This model is equipped with: storm bolter; armoured tracks."  (single-model vehicles)

    The key for "This model" entries is None (resolved by the caller to the unit name).
    """
    equipment: dict[str | None, list[str]] = {}
    plain = re.sub(r"<[^>]+>", " ", comp_html)
    plain = re.sub(r"\s+", " ", plain)

    # Multi-model pattern: "Every <ModelName> is equipped with: ..."
    for match in re.finditer(
        r"Every\s+(?P<model>[A-Z][^.]+?)\s+is equipped with:\s*(?P<weapons>[^.]+)\.",
        plain,
        flags=re.IGNORECASE,
    ):
        model_name = match.group("model").strip()
        weapons = [w.strip() for w in re.split(r";|,", match.group("weapons")) if w.strip()]
        equipment[model_name] = weapons

    # Single-model pattern: "This model is equipped with: ..."
    this_match = re.search(
        r"This model is equipped with:\s*(?P<weapons>[^.]+)\.",
        plain,
        flags=re.IGNORECASE,
    )
    if this_match and None not in equipment:
        weapons = [w.strip() for w in re.split(r";|,", this_match.group("weapons")) if w.strip()]
        equipment[None] = weapons  # type: ignore[index]

    return equipment  # type: ignore[return-value]


def _parse_point_costs(comp_block: str) -> list[dict[str, int]]:
    """Parse all PriceTag rows within the composition block."""
    costs: list[dict[str, int]] = []
    for row_match in re.finditer(r"<tr[^>]*>(.*?)</tr>", comp_block, flags=re.DOTALL):
        row = row_match.group(1)
        models_match = re.search(r"<td[^>]*>(\d+)\s+models?</td>", row)
        price_match = re.search(r'class="PriceTag"[^>]*>(\d+)', row)
        if models_match and price_match:
            costs.append(
                {
                    "model_count": int(models_match.group(1)),
                    "points": int(price_match.group(1)),
                }
            )
    return costs


# ---------------------------------------------------------------------------
# Leader eligibility (LED BY section)
# ---------------------------------------------------------------------------

def parse_led_by(html: str) -> list[dict[str, str]]:
    """Return one dict per leader unit listed in the LED BY section.

    Each dict has:
        leader_unit_name : str
        leader_unit_url  : str  — relative Wahapedia path
        is_legends       : bool
    """
    results: list[dict[str, str]] = []

    led_by_idx = html.find("LED BY")
    if led_by_idx < 0:
        return results

    # Grab the dsAbility div that follows the LED BY header
    div_start = html.find('<div class="dsAbility">', led_by_idx)
    if div_start < 0:
        return results
    div_end = _find_closing_div(html, div_start)
    section = html[div_start:div_end]

    for li_match in re.finditer(r"<li(?P<attrs>[^>]*)>(?P<content>.*?)</li>", section, flags=re.DOTALL):
        content = li_match.group("content")
        link_match = re.search(r'href="(?P<url>[^"]+)"[^>]*>(?P<name>[^<]+)', content)
        if not link_match:
            continue
        is_legends = "sLegendary" in li_match.group("attrs") or "logo2" in content
        results.append(
            {
                "leader_unit_name": _clean_text(link_match.group("name")),
                "leader_unit_url": link_match.group("url"),
                "is_legends": is_legends,
            }
        )

    return results


# ---------------------------------------------------------------------------
# Keywords (unit and faction)
# ---------------------------------------------------------------------------

def parse_keywords(html: str) -> list[dict[str, str]]:
    """Return keyword dicts from the KEYWORDS and FACTION KEYWORDS sections.

    Each dict has keyword_name and keyword_section ("keywords" | "faction_keywords").
    This supplements the existing text-based keyword parser with HTML-class-based
    extraction that handles linked keyword tooltips.
    """
    results: list[dict[str, str]] = []

    kw_section = html.find('class="ds2colKW')
    if kw_section < 0:
        return results
    kw_end = html.find("</div>", html.find("</div>", html.find("</div>", kw_section + 1) + 1) + 1)
    kw_html = html[kw_section:kw_end + 10000]  # generous window

    left_match = re.search(r'class="dsLeftСolKW"[^>]*>(.*?)class="dsRightСolKW"', kw_html, flags=re.DOTALL)
    right_match = re.search(r'class="dsRightСolKW"[^>]*>(.*?)$', kw_html, flags=re.DOTALL)

    if left_match:
        for kw in _extract_kw_names(left_match.group(1)):
            results.append({"keyword_name": kw, "keyword_section": "keywords"})

    if right_match:
        for kw in _extract_kw_names(right_match.group(1)):
            results.append({"keyword_name": kw, "keyword_section": "faction_keywords"})

    return results


def _extract_kw_names(html: str) -> list[str]:
    # Keywords are either plain text or wrapped in tooltip spans
    plain = re.sub(r"<[^>]+>", " ", html)
    plain = re.sub(r"\s+", " ", plain).strip()
    # Strip section headers
    plain = re.sub(r"^KEYWORDS\s*|^FACTION KEYWORDS\s*", "", plain, flags=re.IGNORECASE)
    return [kw.strip() for kw in plain.split(",") if kw.strip() and len(kw.strip()) < 60]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _clean_text(value: str) -> str:
    value = unescape(value)
    value = re.sub(r"<[^>]+>", "", value)
    return re.sub(r"\s+", " ", value).strip()


def _find_closing_div(html: str, open_pos: int) -> int:
    """Return the position just after the closing </div> matching the <div> at open_pos."""
    depth = 0
    pos = open_pos
    while pos < len(html):
        open_match = re.search(r"<div\b", html[pos:])
        close_match = re.search(r"</div>", html[pos:])
        if not close_match:
            break
        open_offset = open_match.start() if open_match else len(html)
        close_offset = close_match.start()
        if open_offset < close_offset:
            depth += 1
            pos += open_offset + 4
        else:
            if depth == 0:
                return pos + close_offset + 6
            depth -= 1
            pos += close_offset + 6
    return len(html)
