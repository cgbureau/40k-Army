from __future__ import annotations

from kit_content_importer.importer import DEFAULT_SOURCES
from kit_content_importer.models import ImportedKitContentSource
from kit_content_importer.normalizer import normalize_imported_source


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
