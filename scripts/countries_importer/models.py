from __future__ import annotations

from dataclasses import dataclass
from typing import Any


JsonObject = dict[str, Any]


@dataclass(frozen=True)
class ImportedCountriesBatch:
    fields: tuple[str, ...]
    rows: list[JsonObject]


@dataclass(frozen=True)
class NormalizedCountry:
    id: str
    cca2: str
    cca3: str
    ccn3: str | None
    name_common: str
    name_official: str
    name_native: Any
    un_member: bool
    region: str
    subregion: str | None
    continents: list[str]
    tld: list[str]
    timezones: list[str]
    flag: Any
    population: int
    currencies: Any
    languages: Any
    car: Any
    postal_code: Any
    latlng: list[float]
    government: Any
    gdp: Any
    hdi: float | None
