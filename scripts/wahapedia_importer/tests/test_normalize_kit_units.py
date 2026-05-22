import pytest
from scripts.wahapedia_importer.normalize_seed import _extract_kit_units, KitUnitCandidate


class TestExtractKitUnits:
    """Test suite for _extract_kit_units function."""

    def test_valid_single_record(self):
        """Test extracting a valid single kit unit record."""
        manifest_data = {
            "records": {
                "kit_units": [
                    {
                        "kit_slug": "some_kit",
                        "unit_slug": "some_unit",
                        "unit_count": 1,
                        "model_count": 5,
                        "component_type": "complete_unit",
                    }
                ]
            }
        }

        result = _extract_kit_units(manifest_data)

        assert len(result) == 1
        candidate = result[0]
        assert isinstance(candidate, KitUnitCandidate)
        assert candidate.seed_id_key == "some_kit__some_unit__complete_unit"
        assert candidate.kit_slug == "some_kit"
        assert candidate.unit_slug == "some_unit"
        assert candidate.unit_count == 1
        assert candidate.model_count == 5
        assert candidate.component_type == "complete_unit"

    def test_defaults_component_type_to_complete_unit(self):
        """Test that component_type defaults to complete_unit when omitted."""
        manifest_data = {
            "records": {
                "kit_units": [
                    {
                        "kit_slug": "kit_with_default",
                        "unit_slug": "default_unit",
                        "unit_count": 2,
                        "model_count": 10,
                        # component_type is intentionally omitted
                    }
                ]
            }
        }

        result = _extract_kit_units(manifest_data)

        assert len(result) == 1
        candidate = result[0]
        assert candidate.component_type == "complete_unit"
        assert candidate.seed_id_key == "kit_with_default__default_unit__complete_unit"

    def test_multi_component_type(self):
        """Test extracting records with different component types."""
        manifest_data = {
            "records": {
                "kit_units": [
                    {
                        "kit_slug": "multi_kit",
                        "unit_slug": "multi_unit",
                        "unit_count": 1,
                        "model_count": 5,
                        "component_type": "complete_unit",
                    },
                    {
                        "kit_slug": "multi_kit",
                        "unit_slug": "multi_unit",
                        "unit_count": 1,
                        "model_count": 3,
                        "component_type": "alternate_build",
                    },
                ]
            }
        }

        result = _extract_kit_units(manifest_data)

        assert len(result) == 2

        # Results are sorted by seed_id_key
        complete_unit = result[0]
        alternate_build = result[1]

        assert complete_unit.component_type == "alternate_build"
        assert alternate_build.component_type == "complete_unit"
        assert complete_unit.seed_id_key != alternate_build.seed_id_key

    def test_missing_optional_effective_date(self):
        """Test that missing optional fields like effective_date are handled correctly."""
        manifest_data = {
            "records": {
                "kit_units": [
                    {
                        "kit_slug": "sparse_kit",
                        "unit_slug": "sparse_unit",
                        "unit_count": 1,
                        "model_count": 4,
                        # effective_date and superseded_date are intentionally omitted
                    }
                ]
            }
        }

        result = _extract_kit_units(manifest_data)

        assert len(result) == 1
        candidate = result[0]
        assert candidate.effective_date is None
        assert candidate.superseded_date is None
        assert candidate.created_at is not None
        assert candidate.updated_at is None
