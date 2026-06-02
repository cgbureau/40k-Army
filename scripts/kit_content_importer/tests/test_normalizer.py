from __future__ import annotations

from kit_content_importer.importer import DEFAULT_SOURCES
from kit_content_importer.models import ImportedKitContentSource, ImportedTcgCsvRow
from kit_content_importer.normalizer import normalize_imported_source, normalize_tcgcsv_row


BLACK_TEMPLARS_MINISET_HTML = """
<html>
  <body>
    <h1 class="title" id="page-title">Combat Patrol: Black Templars</h1>
    <a href="https://www.warhammer.com/en-WW/shop/combat-patrol-black-templars-2025">Link to Set</a>
    <div class="text-inner-container expanded" data-lang="en">
      <p><strong>This boxed set builds 19 multipart plastic Black Templars miniatures:</strong><br />
      &ndash; 1x Emperor's Champion<br />
      &ndash; 3x Bladeguard Veterans<br />
      &ndash; 5x Sword Brethren<br />
      &ndash; 10x Crusaders</p>
    </div>
    <div id="set_main_info">
      <b>Released:</b> 9 August 2025<br />
      <b>Miniatures in set:</b> 19<br />
      <b>id:</b> gw-99120101428
    </div>
  </body>
</html>
"""


def test_normalizes_miniset_black_templars_combat_patrol_to_typed_seed_inputs() -> None:
    source = DEFAULT_SOURCES[0]
    content = normalize_imported_source(
        ImportedKitContentSource(source=source, body=BLACK_TEMPLARS_MINISET_HTML),
    )

    assert content.kit_seed_slug == "combat_patrol_black_templars_2025"
    assert content.kit_slug == "combat-patrol-black-templars-2025"
    assert content.display_name == "Combat Patrol: Black Templars"
    assert content.model_count == 19
    assert content.kit_type_slug == "combat_patrol"
    assert content.release_date == "2025-08-09"
    assert content.gw_product_url == "https://www.warhammer.com/en-WW/shop/combat-patrol-black-templars-2025"
    assert content.quality_flags == ["quantity_sum_matches_model_count"]
    assert [(item.quantity, item.name) for item in content.content_items] == [
        (1, "Emperor's Champion"),
        (3, "Bladeguard Veterans"),
        (5, "Sword Brethren"),
        (10, "Crusaders"),
    ]
    assert [(unit.unit_slug, unit.model_count) for unit in content.kit_units] == [
        ("emperors_champion", 1),
        ("bladeguard_veteran_squad", 3),
        ("sword_brethren_squad", 5),
        ("crusader_squad", 10),
    ]


def test_normalizes_tcgcsv_product_to_catalog_kit_and_price_inputs() -> None:
    content = normalize_tcgcsv_row(
        ImportedTcgCsvRow(
            source_file="WarhammerPlasticBoxSetsProductsAndPrices.csv",
            source_kind="plastic_box_sets",
            row={
                "productId": "485892",
                "name": "Warhammer: 40K - Combat Patrol: Blood Angels",
                "cleanName": "Warhammer 40K Combat Patrol Blood Angels",
                "imageUrl": "https://tcgplayer-cdn.tcgplayer.com/product/485892_200w.jpg",
                "url": "https://cpt.tcgcsv.com/SmV5",
                "extGameSeries": "Warhammer: 40K",
                "extArmy": "Blood Angels",
                "extFaction": "The Imperium",
                "extMSRP": "140.00",
                "lowPrice": "",
                "midPrice": "",
                "highPrice": "",
                "marketPrice": "",
                "directLowPrice": "",
                "extShortCode": "41-25",
                "extPartCode": "99120101333",
                "extUPC": "",
                "extGTIN": "5011921131234",
            },
        ),
    )

    assert content.kit_seed_slug == "combat_patrol_blood_angels"
    assert content.kit_slug == "combat-patrol-blood-angels"
    assert content.display_name == "Combat Patrol: Blood Angels"
    assert content.model_count is None
    assert content.kit_type_slug == "combat_patrol"
    assert content.gw_image_url == "https://tcgplayer-cdn.tcgplayer.com/product/485892_200w.jpg"
    assert content.gw_product_code == "99120101333"
    assert content.gw_short_code == "41-25"
    assert content.product_gtin == "5011921131234"
    assert content.tcgcsv_product_id == "485892"
    assert content.tcgcsv_product_url == "https://cpt.tcgcsv.com/SmV5"
    assert content.quality_flags == ["catalog_contents_unknown"]
    assert [(price.seed_id_key, price.price) for price in content.kit_prices] == [
        ("combat_patrol_blood_angels__tcgcsv_msrp_usd", "140.00"),
    ]
