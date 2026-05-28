from __future__ import annotations

import sys
from pathlib import Path
from types import SimpleNamespace

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from scripts.wahapedia_importer.normalizers.rules_sources import (
    _canonical_rules_faction_slug,
    _classify_rules_source_type,
    _rules_faction_slug_for_source,
    _rules_faction_source_semantics,
    _rules_source_name,
    _rules_source_slug,
    _rules_source_version_slug,
)


def make_candidate(rules_source_type: str, source_book_name: str = "") -> SimpleNamespace:
    return SimpleNamespace(rules_source_type=rules_source_type, source_book_name=source_book_name)


class TestClassifyRulesSourceType:
    @pytest.mark.parametrize(
        "book_name, kind, source_url, expected",
        [
            ("Munitorum Field Manual", "", None, "munitorum_field_manual"),
            ("Balance Dataslate", "", None, "balance_dataslate"),
            ("Warhammer Legends: Space Marines", "Legends", None, "legends"),
            ("Blood Angels", "Codex Supplement", None, "codex_supplement"),
            ("Space Marines", "Codex", None, "codex"),
            ("Faction Pack: Blood Angels", "", None, "faction_pack"),
            ("Combat Patrol", "Combat Patrol", None, "combat_patrol"),
            ("Boarding Actions", "Expansion", None, "expansion"),
            ("Some Unknown Book", "Unknown Kind", None, "other"),
        ],
    )
    def test_classify_rules_source_type_known_patterns(
        self, book_name: str, kind: str, source_url: str | None, expected: str
    ) -> None:
        result = _classify_rules_source_type(book_name, kind, source_url)
        assert result == expected


class TestRulesFactionSourceSemantics:
    @pytest.mark.parametrize(
        "rules_source_type, expected_relationship, expected_scope",
        [
            ("munitorum_field_manual", "points", "global"),
            ("balance_dataslate", "errata_faq", "global"),
            ("codex", "primary", "exclusive"),
            ("faction_pack", "errata_faq", "exclusive"),
            ("combat_patrol", "combat_patrol", "exclusive"),
            ("expansion", "supplement", "global"),
            ("other", "supplement", "exclusive"),
        ],
    )
    def test_rules_faction_source_semantics_returns_relationship_and_scope(
        self,
        rules_source_type: str,
        expected_relationship: str,
        expected_scope: str,
    ) -> None:
        candidate = make_candidate(rules_source_type)
        relationship, scope = _rules_faction_source_semantics(candidate)
        assert relationship == expected_relationship
        assert scope == expected_scope


class TestRulesSourceSlug:
    @pytest.mark.parametrize(
        "source_type, book_name, edition, version_slug, expected",
        [
            (
                "balance_dataslate",
                "Balance Dataslate",
                "10e",
                "v3_4",
                "balance_dataslate_10e_v3_4",
            ),
            (
                "codex",
                "Space Marines",
                "10e",
                None,
                "codex_space_marines_10e",
            ),
            (
                "faction_pack",
                "Blood Angels",
                "10e",
                "v1_1",
                "faction_pack_blood_angels_10e_v1_1",
            ),
        ],
    )
    def test_rules_source_slug_formats(
        self,
        source_type: str,
        book_name: str,
        edition: str,
        version_slug: str | None,
        expected: str,
    ) -> None:
        result = _rules_source_slug(
            source_type=source_type,
            book_name=book_name,
            edition=edition,
            version_slug=version_slug,
        )
        assert result == expected


class TestRulesSourceVersionSlug:
    @pytest.mark.parametrize(
        "version, expected",
        [
            (None, None),
            ("3.4", "v3_4"),
            ("v1.1", "v1_1"),
        ],
    )
    def test_rules_source_version_slug_formatting(
        self, version: str | None, expected: str | None
    ) -> None:
        result = _rules_source_version_slug(version)
        assert result == expected


class TestCanonicalRulesFactionSlug:
    @pytest.mark.parametrize(
        "slug, expected",
        [
            (None, None),
            ("emperor_s_children", "emperors_children"),
            ("t_au_empire", "tau_empire"),
            ("space_marines", "space_marines"),
        ],
    )
    def test_canonical_rules_faction_slug_aliases(
        self, slug: str | None, expected: str | None
    ) -> None:
        result = _canonical_rules_faction_slug(slug)
        assert result == expected
