from __future__ import annotations

import argparse
import sys
from pathlib import Path

from .collect import collect_wahapedia_data, list_faction_slugs
from .normalize_seed import normalize_wahapedia_manifest

COLLECT_TARGETS = [
    ("abilities", "Abilities from unit datasheets"),
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
        choices=["unit-abilities", "units", "faction", "core-rules"],
    )
    collect_parser.add_argument("--edition", required=True)
    collect_parser.add_argument("--faction")
    collect_parser.add_argument("--work-root")
    collect_parser.add_argument("--output")
    collect_parser.add_argument("--refresh", action="store_true")
    collect_parser.add_argument("--limit", type=int)
    collect_parser.add_argument("--throttle-seconds", type=float, default=0.2)

    normalize_parser = subparsers.add_parser("normalize")
    normalize_parser.add_argument("kind", choices=["abilities"])
    normalize_parser.add_argument("--manifest", required=True)
    normalize_parser.add_argument("--work-root")
    normalize_parser.add_argument("--output")
    normalize_parser.add_argument("--emit-seed-ts", action="store_true")
    normalize_parser.add_argument("--include-unit-abilities", action="store_true")

    args = parser.parse_args(argv)
    command = " ".join(sys.argv if argv is None else ["wahapedia-importer", *argv])

    if args.command_name == "prompt":
        return interactive_prompt()
    if args.command_name == "collect":
        path = collect_wahapedia_data(
            kind=args.kind,
            edition=args.edition,
            faction=args.faction,
            work_root=args.work_root,
            output=args.output,
            refresh=args.refresh,
            limit=args.limit,
            throttle_seconds=args.throttle_seconds,
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

    collect_kind = "unit-abilities" if target == "abilities" else target
    faction: str | None = None
    if collect_kind in {"unit-abilities", "units", "faction"}:
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

    if target == "abilities":
        should_normalize = _choose(
            "Normalize abilities now",
            [("yes", "Yes"), ("no", "No")],
        )
        if should_normalize == "yes":
            emit_seed = _choose(
                "Generate TS seed snippet",
                [("yes", "Yes"), ("no", "No")],
            )
            include_unit_abilities = _choose(
                "Include unit_abilities candidates",
                [("no", "No"), ("yes", "Yes")],
            )
            normalize_command = _prompt_command(
                "normalize",
                "abilities",
                manifest=manifest_path,
                emit_seed_ts=emit_seed == "yes",
                include_unit_abilities=include_unit_abilities == "yes",
            )
            output_path = normalize_wahapedia_manifest(
                manifest=str(manifest_path),
                kind="abilities",
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
