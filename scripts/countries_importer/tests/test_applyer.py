from __future__ import annotations

from pathlib import Path

from countries_importer.applyer import apply_normalized_countries
from countries_importer.models import NormalizedCountry


def test_applies_normalized_countries_to_typed_seed_dataset(tmp_path: Path) -> None:
    country = NormalizedCountry(
        id="US",
        cca2="US",
        cca3="USA",
        ccn3="840",
        name_common="United States",
        name_official="United States of America",
        name_native=[
            {
                "lang": "eng",
                "official": "United States of America",
                "common": "United States",
            },
        ],
        un_member=True,
        region="Americas",
        subregion="North America",
        continents=["North America"],
        tld=[".us"],
        timezones=["UTC-10:00", "UTC-05:00"],
        flag={"emoji": "\ud83c\uddfa\ud83c\uddf8"},
        population=341784857,
        currencies=[{"code": "USD", "name": "United States dollar", "symbol": "$"}],
        languages=[
            {
                "iso639_1": "en",
                "iso639_2": "eng",
                "name": "English",
                "nativeName": "English",
            },
        ],
        car={"signs": ["USA"], "side": "right"},
        postal_code={"format": "#####-####", "regex": "^\\d{5}(-\\d{4})?$"},
        latlng=[38.0, -97.0],
        government={"type": "Federal Presidential system"},
        gdp={"total": 28750956130000},
        hdi=0.938,
    )

    apply_normalized_countries([country], tmp_path)

    output = (
        tmp_path / "db/seed_config/seed/data/countries.data.ts"
    ).read_text()

    assert 'export const countriesDataset: SeedDataset<"countries">' in output
    assert 'id: "US"' in output
    assert 'cca2: "US"' in output
    assert 'cca3: "USA"' in output
    assert 'latlng: [38.0, -97.0]' in output
    assert '"code": "USD"' in output
    assert "satisfies CountryConfig[]" in output
