#!/usr/bin/env python3
"""
Transform docs/kit_unit_status.md to new column structure.

Kits tables: Kit | Unit(s) | Prices | Models (Manually Added) | Warhammer Kit URL (Manually Added) | Notes
No-kit tables: Unit | Notes

HAS KIT annotated rows are moved from no-kit tables into the corresponding Kits table.
Sections without a Kits table get one created if they have HAS KIT rows.
"""

import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
MARKDOWN_FILE = REPO_ROOT / "docs" / "kit_unit_status.md"

KITS_HEADER = "| Kit | Unit(s) | Prices | Models (Manually Added) | Warhammer Kit URL (Manually Added) | Notes |"
KITS_SEP = "| --- | ------- | ------ | ----------------------- | ---------------------------------- | ----- |"
NOKIT_HEADER = "| Unit | Notes |"
NOKIT_SEP = "| ---- | ----- |"


def is_table_row(line: str) -> bool:
    return line.strip().startswith("|")


def is_sep_row(line: str) -> bool:
    s = line.strip()
    return bool(s) and s.startswith("|") and bool(re.match(r"^\|[\s\-|]+\|$", s))


def parse_cells(line: str) -> list[str]:
    parts = line.split("|")
    return [p.strip() for p in parts[1:-1]]


def col_count(line: str) -> int:
    return len(parse_cells(line)) if is_table_row(line) else 0


def extract_has_kit(line: str) -> str | None:
    m = re.search(r"<!-- HAS KIT: (.+?) -->", line)
    return m.group(1).strip() if m else None


def transform_kits_table(table_lines: list[str], extra_rows: list[tuple[str, str]]) -> list[str]:
    """
    Add URL + Notes columns if 4-col; leave 6-col tables alone.
    Append extra_rows (kit_name, unit_name) at the end.
    """
    if not table_lines:
        if extra_rows:
            result = [KITS_HEADER, KITS_SEP]
            for kit_name, unit_name in extra_rows:
                result.append(f"| {kit_name} | {unit_name} | — | — | — | — |")
            return result
        return []

    # Determine current column count from first non-sep table row
    first_data = next((l for l in table_lines if is_table_row(l) and not is_sep_row(l)), "")
    n_cols = col_count(first_data)

    result = []
    if n_cols == 6:
        # Already correct — keep as-is, just append extra rows
        result = list(table_lines)
    else:
        # Rebuild with 2 extra columns
        for line in table_lines:
            if not is_table_row(line):
                result.append(line)
                continue
            if is_sep_row(line):
                result.append(KITS_SEP)
                continue
            cells = parse_cells(line)
            if not cells:
                result.append(line)
                continue
            # Header row detection: first cell contains "Kit"
            if cells[0].strip().lower() == "kit":
                cells.append("Warhammer Kit URL (Manually Added)")
                cells.append("Notes")
            else:
                cells.append("—")
                cells.append("—")
            result.append("| " + " | ".join(cells) + " |")

    # Append HAS KIT rows
    for kit_name, unit_name in extra_rows:
        result.append(f"| {kit_name} | {unit_name} | — | — | — | — |")

    return result


def transform_nokit_table(table_lines: list[str]) -> tuple[list[str], list[tuple[str, str]]]:
    """
    Reduce no-kit table to Unit | Notes.
    Returns (new_table_lines, has_kit_rows).
    """
    if not table_lines:
        return [], []

    has_kit_rows = []
    remaining = []
    has_notes_col = False
    header_done = False
    sep_done = False

    for line in table_lines:
        if not is_table_row(line):
            continue
        if not header_done:
            header_done = True
            has_notes_col = col_count(line) >= 7
            continue
        if not sep_done:
            sep_done = True
            continue

        kit = extract_has_kit(line)
        cells = parse_cells(line)
        unit = cells[0].strip() if cells else "—"

        notes = "—"
        if has_notes_col and len(cells) >= 7:
            n = cells[6].strip()
            if n:
                notes = n

        if kit:
            has_kit_rows.append((kit, unit))
        else:
            remaining.append((unit, notes))

    result = [NOKIT_HEADER, NOKIT_SEP]
    for unit, notes in remaining:
        result.append(f"| {unit} | {notes} |")

    return result, has_kit_rows


def find_table_block(lines: list[str], start: int) -> tuple[int, int]:
    """Find the contiguous block of table rows starting at or after `start`."""
    i = start
    while i < len(lines) and not is_table_row(lines[i]):
        i += 1
    if i >= len(lines):
        return -1, -1
    table_start = i
    while i < len(lines) and is_table_row(lines[i]):
        i += 1
    return table_start, i


def process_section(lines: list[str]) -> list[str]:
    """
    Process a single section (everything from one ## header to the next).
    - Finds the Kits table and no-kit table
    - Extracts HAS KIT rows from no-kit, adds them to Kits table
    - Transforms both tables to new column format
    """
    kits_table_start = -1
    kits_table_end = -1
    nokit_table_start = -1
    nokit_table_end = -1

    # Identify which tables are kits vs no-kit by looking at preceding ### headers
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.strip().startswith("###"):
            if "Units with no kit" in line:
                ts, te = find_table_block(lines, i + 1)
                if ts != -1:
                    nokit_table_start = ts
                    nokit_table_end = te
            elif "Kits" in line:
                ts, te = find_table_block(lines, i + 1)
                if ts != -1:
                    kits_table_start = ts
                    kits_table_end = te
        i += 1

    # Extract and transform no-kit table
    has_kit_rows: list[tuple[str, str]] = []
    new_nokit_lines: list[str] = []
    if nokit_table_start != -1:
        nokit_lines = lines[nokit_table_start:nokit_table_end]
        new_nokit_lines, has_kit_rows = transform_nokit_table(nokit_lines)

    # Transform kits table (add columns + append HAS KIT rows)
    new_kits_lines: list[str] = []
    if kits_table_start != -1:
        kits_lines = lines[kits_table_start:kits_table_end]
        new_kits_lines = transform_kits_table(kits_lines, has_kit_rows)
    elif has_kit_rows:
        # No kits table exists — create one from HAS KIT rows only
        new_kits_lines = transform_kits_table([], has_kit_rows)

    # Reassemble section
    result = []
    i = 0
    while i < len(lines):
        if kits_table_start != -1 and i == kits_table_start:
            # Emit transformed kits table
            result.extend(new_kits_lines)
            i = kits_table_end
        elif kits_table_start == -1 and has_kit_rows and i == nokit_table_start:
            # No kits table: emit the new one just before the no-kit table heading
            # (Actually we need to insert before the ### heading — handled below)
            result.extend(new_nokit_lines)
            i = nokit_table_end
        elif nokit_table_start != -1 and i == nokit_table_start:
            result.extend(new_nokit_lines)
            i = nokit_table_end
        else:
            result.append(lines[i])
            i += 1

    # If we created a new kits table (section had no ### Kits heading), we need to inject it
    # Just before the ### ... Units with no kit heading
    if kits_table_start == -1 and has_kit_rows and nokit_table_start != -1:
        # Find the ### heading line index for the no-kit section
        nokit_heading_idx = None
        for j, line in enumerate(result):
            if line.strip().startswith("###") and "Units with no kit" in line:
                nokit_heading_idx = j
                break
        if nokit_heading_idx is not None:
            # Find the section name from ## header
            section_name = ""
            for line in lines:
                if line.startswith("## "):
                    section_name = line[3:].strip()
                    break
            kits_heading = f"### {section_name} Kits\n"
            insert_lines = [f"### {section_name} Kits", ""] + new_kits_lines + [""]
            result = result[:nokit_heading_idx] + insert_lines + result[nokit_heading_idx:]

    return result


def main():
    text = MARKDOWN_FILE.read_text()
    lines = text.split("\n")

    # Split into top-level sections at ## headers (preserve non-section preamble)
    sections: list[list[str]] = []
    current: list[str] = []

    for line in lines:
        if line.startswith("## ") and current:
            sections.append(current)
            current = [line]
        else:
            current.append(line)
    if current:
        sections.append(current)

    # Process each section
    output_lines: list[str] = []
    for section in sections:
        processed = process_section(section)
        output_lines.extend(processed)

    result = "\n".join(output_lines)
    MARKDOWN_FILE.write_text(result)
    print(f"Written {MARKDOWN_FILE}")


if __name__ == "__main__":
    main()
