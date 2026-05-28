from __future__ import annotations

import dataclasses
import typing
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[3]))

from scripts.wahapedia_importer.normalize_seed import KitUnitPriceAllocationCandidate
from scripts.wahapedia_importer.apply_seed import KitUnitPriceAllocationSeedRecord


class TestKitUnitPriceAllocationCandidateFieldTypes:
    def test_kit_unit_price_allocation_candidate_has_float_fields(self) -> None:
        # Use get_type_hints to resolve string annotations (PEP 563 / from __future__ import annotations)
        hints = typing.get_type_hints(KitUnitPriceAllocationCandidate)
        assert hints["allocation_ratio"] == float
        assert "float" in str(hints["reference_price"])

    def test_allocation_ratio_is_exactly_float_not_str(self) -> None:
        record = KitUnitPriceAllocationCandidate(
            seed_id_key="test_kit__test_unit",
            kit_unit_price_allocation_slug="test_kit__test_unit",
            kit_slug="test_kit",
            unit_slug="test_unit",
            allocation_ratio=0.4211,
            reference_price=40.0,
            reference_currency="usd",
            allocation_basis="standalone_msrp",
            effective_date=None,
            superseded_date=None,
            created_at="2026-01-01T00:00:00Z",
            updated_at=None,
        )
        assert isinstance(record.allocation_ratio, float)
        assert isinstance(record.reference_price, float)


class TestKitUnitPriceAllocationSeedRecordFieldTypes:
    def test_kit_unit_price_allocation_seed_record_has_float_fields(self) -> None:
        # Use get_type_hints to resolve string annotations (PEP 563 / from __future__ import annotations)
        hints = typing.get_type_hints(KitUnitPriceAllocationSeedRecord)
        assert hints["allocation_ratio"] == float
        assert "float" in str(hints["reference_price"])

    def test_allocation_ratio_is_exactly_float_not_str(self) -> None:
        record = KitUnitPriceAllocationSeedRecord(
            seed_id_key="test_kit__test_unit",
            kit_unit_price_allocation_slug="test_kit__test_unit",
            kit_slug="test_kit",
            unit_slug="test_unit",
            allocation_ratio=0.4211,
            reference_price=40.0,
            reference_currency="usd",
            allocation_basis="standalone_msrp",
            effective_date=None,
            superseded_date=None,
        )
        assert isinstance(record.allocation_ratio, float)
        assert isinstance(record.reference_price, float)


class TestAllocationRatioRendering:
    def _make_record(
        self,
        allocation_ratio: float = 0.4211,
        reference_price: float | None = 40.0,
    ) -> KitUnitPriceAllocationSeedRecord:
        return KitUnitPriceAllocationSeedRecord(
            seed_id_key="test_kit__test_unit",
            kit_unit_price_allocation_slug="test_kit__test_unit",
            kit_slug="test_kit",
            unit_slug="test_unit",
            allocation_ratio=allocation_ratio,
            reference_price=reference_price,
            reference_currency="USD",
            allocation_basis="standalone_msrp",
            effective_date=None,
            superseded_date=None,
        )

    def test_allocation_ratio_renders_as_bare_number(self) -> None:
        record = self._make_record(allocation_ratio=0.4211, reference_price=40.0)

        rendered_ratio = f"  allocation_ratio: {record.allocation_ratio},"
        assert rendered_ratio == "  allocation_ratio: 0.4211,", f"Got: {rendered_ratio!r}"

        rendered_price = f"  reference_price: {record.reference_price if record.reference_price is not None else 'null'},"
        assert rendered_price == "  reference_price: 40.0,", f"Got: {rendered_price!r}"

        assert '"' not in rendered_ratio
        assert '"' not in rendered_price

    def test_allocation_ratio_null_reference_price_renders_as_null(self) -> None:
        record = self._make_record(allocation_ratio=0.5, reference_price=None)

        rendered_price = f"  reference_price: {record.reference_price if record.reference_price is not None else 'null'},"
        assert rendered_price == "  reference_price: null,", f"Got: {rendered_price!r}"

        rendered_ratio = f"  allocation_ratio: {record.allocation_ratio},"
        assert rendered_ratio == "  allocation_ratio: 0.5,", f"Got: {rendered_ratio!r}"

        assert '"' not in rendered_price
        assert '"' not in rendered_ratio
