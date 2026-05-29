from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .apply_seed import (
    apply_abilities_seed,
    apply_faction_data_seed,
    apply_kit_unit_price_allocations_seed,
    apply_kit_units_seed,
    apply_keywords_seed,
    apply_rules_sources_seed,
    apply_unit_datasheets_seed,
)
from .collect import collect_wahapedia_data, list_faction_slugs
from .normalize_seed import normalize_wahapedia_manifest

COLLECT_TARGETS = [
    ("abilities", "Abilities from unit datasheets"),
    ("keywords", "Keywords from unit datasheets"),
    ("rules-sources", "Rules source publications"),
    ("unit-abilities", "Unit ability source pages"),
    ("units", "Unit source pages"),
    ("faction", "Faction and detachment source page"),
    ("core-rules", "Core rules source page"),
]

EDITIONS = [
    ("10e", "10th Edition"),
    ("11e", "11th Edition"),
]


def main(argv: list[str] | None = None) -> int:
    if argv is None and len(sys.argv) == 1:
        return interactive_prompt()

    parser = argparse.ArgumentParser(
        prog="wahapedia-importer",
        description="Collect and normalize Wahapedia data for 40karmy seed work.",
    )
    subparsers = parser.add_subparsers(dest="command_name", required=True)

    subparsers.add_parser("prompt")

    collect_parser = subparsers.add_parser("collect")
    collect_parser.add_argument(
        "kind",
        choices=[
            "abilities",
            "keywords",
            "rules-sources",
            "unit-abilities",
            "units",
            "faction",
            "core-rules",
        ],
    )
    collect_parser.add_argument("--edition", required=True)
    collect_parser.add_argument("--faction")
    collect_parser.add_argument("--work-root")
    collect_parser.add_argument("--output")
    collect_parser.add_argument("--refresh", action="store_true")
    collect_parser.add_argument("--limit", type=int)
    collect_parser.add_argument("--throttle-seconds", type=float, default=0.2)
    collect_parser.add_argument("--max-workers", type=int, default=4)

    normalize_parser = subparsers.add_parser("normalize")
    normalize_parser.add_argument(
        "kind",
        choices=[
            "abilities",
            "keywords",
            "rules-sources",
            "faction-data",
            "kit-units",
            "kit-unit-price-allocations",
            "unit-datasheets",
        ],
    )
    normalize_parser.add_argument("--manifest", required=True)
    normalize_parser.add_argument("--work-root")
    normalize_parser.add_argument("--output")
    normalize_parser.add_argument("--emit-seed-ts", action="store_true")
    normalize_parser.add_argument("--include-unit-abilities", action="store_true")

    apply_parser = subparsers.add_parser("apply")
    apply_parser.add_argument(
        "kind",
        choices=[
            "abilities",
            "keywords",
            "rules-sources",
            "faction-data",
            "kit-units",
            "kit-unit-price-allocations",
            "unit-datasheets",
        ],
    )
    apply_parser.add_argument("--normalized", required=True, nargs="+")

    args = parser.parse_args(argv)
    command = " ".join(sys.argv if argv is None else ["wahapedia-importer", *argv])

    if args.command_name == "prompt":
        return interactive_prompt()
    if args.command_name == "collect":
        collect_kind = "unit-abilities" if args.kind in {"abilities", "keywords"} else args.kind
        path = collect_wahapedia_data(
            kind=collect_kind,
            edition=args.edition,
            faction=args.faction,
            work_root=args.work_root,
            output=args.output,
            refresh=args.refresh,
            limit=args.limit,
            throttle_seconds=args.throttle_seconds,
            max_workers=args.max_workers,
            command=command,
        )
    elif args.command_name == "normalize":
        path = normalize_wahapedia_manifest(
            manifest=args.manifest,
            kind=args.kind,
            work_root=args.work_root,
            output=args.output,
            emit_seed_ts=args.emit_seed_ts,
            include_unit_abilities=args.include_unit_abilities,
            command=command,
        )
    elif args.command_name == "apply":
        if args.kind == "abilities":
            paths = apply_abilities_seed(normalized=args.normalized[0])
        elif args.kind == "keywords":
            paths = apply_keywords_seed(normalized=args.normalized[0])
        elif args.kind == "rules-sources":
            paths = apply_rules_sources_seed(normalized=args.normalized)
        elif args.kind == "kit-units":
            paths = apply_kit_units_seed(normalized=args.normalized)
        elif args.kind == "kit-unit-price-allocations":
            paths = apply_kit_unit_price_allocations_seed(normalized=args.normalized)
        elif args.kind == "unit-datasheets":
            paths = apply_unit_datasheets_seed(normalized=args.normalized)
        else:
            paths = apply_faction_data_seed(normalized=args.normalized)
        for path in paths:
            print(path)
        return 0
    else:
        parser.error(f"Unsupported command: {args.command_name}")
        return 2

    print(path)
    return 0


def interactive_prompt() -> int:
    print("Wahapedia importer\n")
    target = _choose("Data to collect", COLLECT_TARGETS)
    edition = _choose("Edition", EDITIONS)
    refresh = _choose("Refresh cached pages", [("no", "No"), ("yes", "Yes")]) == "yes"
    limit_choice = _choose(
        "Page limit",
        [
            ("none", "No limit"),
            ("3", "3 pages"),
            ("10", "10 pages"),
            ("50", "50 pages"),
        ],
    )
    limit = None if limit_choice == "none" else int(limit_choice)

    collect_kind = "unit-abilities" if target in {"abilities", "keywords"} else target
    faction: str | None = None
    if collect_kind in {"unit-abilities", "units", "faction", "rules-sources"}:
        faction_slugs = list_faction_slugs(edition=edition, refresh=refresh)
        faction = _choose(
            "Faction",
            [(slug, slug.replace("-", " ").title()) for slug in faction_slugs],
        )

    command = _prompt_command(
        "collect",
        collect_kind,
        edition=edition,
        faction=faction,
        refresh=refresh,
        limit=limit,
    )
    manifest_path = collect_wahapedia_data(
        kind=collect_kind,
        edition=edition,
        faction=faction,
        refresh=refresh,
        limit=limit,
        command=command,
    )
    print(f"\nManifest written: {manifest_path}")

    if target in {"abilities", "keywords", "rules-sources"}:
        should_normalize = _choose(
            f"Normalize {target} now",
            [("yes", "Yes"), ("no", "No")],
        )
        if should_normalize == "yes":
            emit_seed = _choose(
                "Generate TS seed snippet",
                [("yes", "Yes"), ("no", "No")],
            )
            include_unit_abilities = "no"
            if target == "abilities":
                include_unit_abilities = _choose(
                    "Include unit_abilities candidates",
                    [("no", "No"), ("yes", "Yes")],
                )
            normalize_command = _prompt_command(
                "normalize",
                target,
                manifest=manifest_path,
                emit_seed_ts=emit_seed == "yes",
                include_unit_abilities=include_unit_abilities == "yes",
            )
            output_path = normalize_wahapedia_manifest(
                manifest=str(manifest_path),
                kind=target,
                emit_seed_ts=emit_seed == "yes",
                include_unit_abilities=include_unit_abilities == "yes",
                command=normalize_command,
            )
            print(f"Normalized output written: {output_path}")

    return 0


def _choose(title: str, options: list[tuple[str, str]]) -> str:
    print(title)
    for index, (_, label) in enumerate(options, start=1):
        print(f"  {index}. {label}")
    while True:
        choice = input("Select a number: ").strip()
        if choice.isdigit():
            index = int(choice)
            if 1 <= index <= len(options):
                print()
                return options[index - 1][0]
        print(f"Enter a number from 1 to {len(options)}.")


def _prompt_command(command: str, kind: str, **kwargs: object) -> str:
    parts = ["python3", "scripts/wahapedia_importer.py", command, kind]
    for key, value in kwargs.items():
        if value is None or value is False:
            continue
        flag = f"--{key.replace('_', '-')}"
        if value is True:
            parts.append(flag)
        else:
            parts.extend([flag, str(Path(value) if isinstance(value, Path) else value)])
    return " ".join(parts)


if __name__ == "__main__":
    raise SystemExit(main())
