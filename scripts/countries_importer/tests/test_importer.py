from __future__ import annotations

from countries_importer.importer import import_country_batches


def test_imports_country_batches_with_field_queries() -> None:
    requested_urls: list[str] = []

    def fetcher(url: str) -> list[dict[str, object]]:
        requested_urls.append(url)
        return [{"cca3": "USA"}]

    batches = import_country_batches(
        fields_batches=(("cca2", "cca3"), ("cca3", "hdi")),
        fetcher=fetcher,
    )

    assert [batch.fields for batch in batches] == [("cca2", "cca3"), ("cca3", "hdi")]
    assert requested_urls == [
        "https://restcountries.com/v4/all?fields=cca2%2Ccca3",
        "https://restcountries.com/v4/all?fields=cca3%2Chdi",
    ]
