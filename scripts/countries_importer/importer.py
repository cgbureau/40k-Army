from __future__ import annotations

import json
from collections.abc import Callable, Iterable
from typing import Any
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from .models import ImportedCountriesBatch


REST_COUNTRIES_V4_BASE_URL = "https://restcountries.com/v4/all"

# REST Countries v4 currently caps `fields` queries at 10 fields, so every
# batch after the first carries `cca3` for merge identity.
COUNTRY_FIELD_BATCHES: tuple[tuple[str, ...], ...] = (
    (
        "cca2",
        "cca3",
        "ccn3",
        "name",
        "unMember",
        "region",
        "subregion",
        "continents",
        "tld",
        "timezones",
    ),
    (
        "cca3",
        "flag",
        "population",
        "currencies",
        "languages",
        "car",
        "postalCode",
        "geolocation",
        "government",
        "gdp",
    ),
    (
        "cca3",
        "hdi",
    ),
)


def fetch_json(url: str) -> list[dict[str, Any]]:
    request = Request(
        url,
        headers={
            "Accept": "application/json",
            "User-Agent": "40karmy-country-seed-importer/1.0",
        },
    )
    with urlopen(request, timeout=30) as response:
        return json.load(response)


def import_country_batches(
    *,
    fields_batches: Iterable[tuple[str, ...]] = COUNTRY_FIELD_BATCHES,
    fetcher: Callable[[str], list[dict[str, Any]]] = fetch_json,
) -> list[ImportedCountriesBatch]:
    batches: list[ImportedCountriesBatch] = []

    for fields in fields_batches:
        query = urlencode({"fields": ",".join(fields)})
        url = f"{REST_COUNTRIES_V4_BASE_URL}?{query}"
        batches.append(ImportedCountriesBatch(fields=fields, rows=fetcher(url)))

    return batches
