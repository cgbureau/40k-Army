from __future__ import annotations

from typing import Any

from .models import ImportedCountriesBatch, NormalizedCountry


def normalize_country_batches(
    batches: list[ImportedCountriesBatch],
) -> list[NormalizedCountry]:
    rows_by_cca3: dict[str, dict[str, Any]] = {}

    for batch in batches:
        for row in batch.rows:
            cca3 = required_string(row, "cca3")
            rows_by_cca3.setdefault(cca3, {}).update(row)

    return [
        normalize_country(row)
        for row in sorted(rows_by_cca3.values(), key=lambda item: item["cca2"])
    ]


def normalize_country(row: dict[str, Any]) -> NormalizedCountry:
    name = required_dict(row, "name")
    geolocation = row.get("geolocation")
    latitude = 0.0
    longitude = 0.0

    if isinstance(geolocation, dict):
        latitude = float(geolocation.get("latitude", 0.0))
        longitude = float(geolocation.get("longitude", 0.0))

    cca2 = required_string(row, "cca2").upper()

    return NormalizedCountry(
        id=cca2,
        cca2=cca2,
        cca3=required_string(row, "cca3").upper(),
        ccn3=optional_string(row.get("ccn3")),
        name_common=required_string(name, "common"),
        name_official=required_string(name, "official"),
        name_native=name.get("nativeName"),
        un_member=bool(row.get("unMember", False)),
        region=required_string(row, "region"),
        subregion=optional_string(row.get("subregion")),
        continents=string_list(row.get("continents")),
        tld=string_list(row.get("tld")),
        timezones=string_list(row.get("timezones")),
        flag=row.get("flag") or {},
        population=int(row.get("population") or 0),
        currencies=row.get("currencies") or [],
        languages=row.get("languages") or [],
        car=row.get("car") or {},
        postal_code=non_empty_json_or_none(row.get("postalCode")),
        latlng=[latitude, longitude],
        government=non_empty_json_or_none(row.get("government")),
        gdp=non_empty_json_or_none(row.get("gdp")),
        hdi=float(row["hdi"]) if row.get("hdi") is not None else None,
    )


def required_dict(row: dict[str, Any], key: str) -> dict[str, Any]:
    value = row.get(key)
    if not isinstance(value, dict):
        raise ValueError(f"Expected `{key}` to be an object")
    return value


def required_string(row: dict[str, Any], key: str) -> str:
    value = row.get(key)
    if not isinstance(value, str) or not value:
        raise ValueError(f"Expected `{key}` to be a non-empty string")
    return value


def optional_string(value: Any) -> str | None:
    return value if isinstance(value, str) and value else None


def string_list(value: Any) -> list[str]:
    if not isinstance(value, list):
        return []
    return [item for item in value if isinstance(item, str)]


def non_empty_json_or_none(value: Any) -> Any:
    if value in ({}, [], ""):
        return None
    return value
