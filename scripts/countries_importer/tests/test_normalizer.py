from __future__ import annotations

from countries_importer.models import ImportedCountriesBatch
from countries_importer.normalizer import normalize_country_batches


def test_normalizes_merged_v4_country_batches() -> None:
    countries = normalize_country_batches(
        [
            ImportedCountriesBatch(
                fields=("cca2", "cca3", "name"),
                rows=[
                    {
                        "cca2": "US",
                        "cca3": "USA",
                        "ccn3": "840",
                        "name": {
                            "common": "United States",
                            "official": "United States of America",
                            "nativeName": [
                                {
                                    "lang": "eng",
                                    "official": "United States of America",
                                    "common": "United States",
                                },
                            ],
                        },
                        "unMember": True,
                        "region": "Americas",
                        "subregion": "North America",
                        "continents": ["North America"],
                        "tld": [".us"],
                        "timezones": ["UTC-10:00", "UTC-05:00"],
                    },
                ],
            ),
            ImportedCountriesBatch(
                fields=("cca3", "flag", "geolocation"),
                rows=[
                    {
                        "cca3": "USA",
                        "flag": {"emoji": "\ud83c\uddfa\ud83c\uddf8"},
                        "population": 341784857,
                        "currencies": [
                            {
                                "code": "USD",
                                "name": "United States dollar",
                                "symbol": "$",
                            },
                        ],
                        "languages": [
                            {
                                "iso639_1": "en",
                                "iso639_2": "eng",
                                "name": "English",
                                "nativeName": "English",
                            },
                        ],
                        "car": {"signs": ["USA"], "side": "right"},
                        "postalCode": {
                            "format": "#####-####",
                            "regex": "^\\d{5}(-\\d{4})?$",
                        },
                        "geolocation": {"latitude": 38.0, "longitude": -97.0},
                        "government": {"type": "Federal Presidential system"},
                        "gdp": {"total": 28750956130000},
                    },
                ],
            ),
            ImportedCountriesBatch(
                fields=("cca3", "hdi"),
                rows=[{"cca3": "USA", "hdi": 0.938}],
            ),
        ],
    )

    assert len(countries) == 1
    country = countries[0]
    assert country.id == "US"
    assert country.cca2 == "US"
    assert country.cca3 == "USA"
    assert country.name_common == "United States"
    assert country.name_native == [
        {
            "lang": "eng",
            "official": "United States of America",
            "common": "United States",
        },
    ]
    assert country.latlng == [38.0, -97.0]
    assert country.currencies[0]["code"] == "USD"
    assert country.postal_code["format"] == "#####-####"
    assert country.hdi == 0.938
