# Kit Table Cleanup Rules

Strict rules for cleaning up faction tables in `docs/kit_unit_status.md`.
Process ONE faction per pass. Commit after each faction.

## ABSOLUTE PROHIBITIONS

1. **NEVER touch these sections** (already hand-edited by the user):
   - Adepta Sororitas
   - Adeptus Custodes
   - Black Templars
   - Blood Angels
2. **NEVER delete a row** unless it is a confirmed duplicate (see dedup rules).
   Rows move between tables; they do not disappear. Every unit name present
   before the pass must be present after the pass (in one table or the other),
   except exact-duplicate rows.
3. **NEVER edit any section other than the one faction being processed.**
4. **NEVER modify data the user has entered**: prices with USD/CAD/AUD detail,
   tinyurls, model counts, or notes text. Only the removals listed below are allowed.

## COLUMN STRUCTURE (verify, fix if wrong)

- Kits table: `Kit | Unit(s) | Prices | Models (Manually Added) | Warhammer Kit URL (Manually Added) | Notes`
- Units with no kit data table: `Unit | Notes`

## CELL CLEANUP

- Remove every `—` and `-` placeholder from all cells. Cells become empty (just `| |`).
- Remove every `(unconfirmed)` suffix from unit names.
- Remove all GW-import price strings of the form `£NN / €NN` (with optional `/ $NN`)
  from factions the user has not edited. These are auto-imported and unwanted.
  (User-entered prices look like `$43.50` or `$43.50USD,$54CAD,...` — KEEP those.
  When in doubt: if the row also has a tinyurl, the price is user-entered — keep it.)

## ROW REMOVAL / MOVES

- **Wrong-faction rows**: Adeptus Custodes kits (Vexilus Praetor, Custodian Guard,
  Allarus, etc.) appear scattered in other factions' Kits tables. Delete them from
  the wrong faction's table. They already exist in the Adeptus Custodes section —
  verify before deleting; if not present there, report instead of deleting.
- **Legends**: any row marked `(Legends)` belongs ONLY in "Units with no kit data".
  If a Legends unit is in the Kits table, move the unit name to the no-kit table
  and remove the kit row (if the kit row maps only to that Legends unit).
- **Fortifications** (e.g. Aegis Defence Line, Webway Gate, Battle Sanctum,
  Hammerfall Bunker if present in Kits): move the unit to "Units with no kit data".
  Treat like Legends.
- **Space Marine "Upgrades and Transfers" rows**: delete from all Space Marine
  faction Kits tables (kit names matching "Upgrades", "Upgrades and Transfers",
  "Primaris Upgrades", transfer sheets).

## DEDUPLICATION (Kits tables only)

Two rows are duplicates when they reference the same physical GW kit. Patterns:

1. **Same kit name twice** (e.g. two `Craftworlds Jain Zar...` rows): merge into one
   row, keeping the row with more filled-in data (unit name, price, URL).
2. **One row has unit `—`/empty, the other has the real unit** (e.g. `Eldar
   Wraithguard` with empty unit + same kit with `Wraithguard`): keep the row with
   the unit name, delete the empty one.
3. **Unit vs Unit (Legends)** (e.g. `Prince Yriel` and `Prince Yriel (Legends)`):
   keep the non-Legends row in Kits; the Legends unit name goes to the no-kit table.
4. **Same kit, different kit-name spellings** (e.g. `Astra Militarum Hydra` vs
   `Hydra`; `Astra Militarum Cadians` vs `Astra Militarum Cadian Shock Troops`):
   merge into one row. Prefer the fuller GW product name.

## ALTERNATE-BUILD KITS (these are NOT duplicates — expand them)

A kit that builds multiple different units gets ONE ROW PER UNIT, same kit name
in each row. Examples:

- Aeldari `Vyper/Starfang`: two rows, kit name identical, unit `Vyper` in one,
  `Starfang Squadron` in the other.
- AdMech `Adeptus Mechanicus Archaeopter`: three rows — Fusilave, Stratoraptor,
  Transvector.
- AdMech alternate-build kits: Electro Priests (Corpuscarii/Fulgurite), Ironstrider
  (Ironstrider Ballistarii / Sydonian Dragoons with taser lances / Sydonian Dragoons
  with radium jezzails), Kataphron Battle Servitors (Breachers/Destroyers), Pteraxii
  (Skystalkers/Sterylizors), Serberys Raiders (Raiders/Sulphurhounds), Sicarians
  (Infiltrators/Ruststalkers), Skitarii (Rangers/Vanguard), Skorpius Disintegrator
  (Disintegrator/Dunerider).

## SORT ORDER (Kits tables)

1. **Character kits** — single named characters or generic character units
   (Captains, Lieutenants, Librarians, named heroes, etc.)
2. **Non-vehicle units** — infantry squads, mounted, swarms, monsters, battlesuits
3. **Vehicles** — tanks, transports, aircraft, walkers/dreadnoughts
4. **Multi-unit kits** — Combat Patrols, Battleforces, Start Collecting!,
   Apocalypse detachments, Kill Team boxes, army sets

Within each group: alphabetical by kit name.

## SORT ORDER (Units with no kit data)

Alphabetical by unit name.

## VERIFICATION (after each faction, before commit)

1. Count unit names before and after — no unit may vanish (except exact dupes
   and wrong-faction Custodes rows).
2. Confirm protected sections are byte-identical (`git diff` must show no
   changes in their line ranges).
3. Confirm column headers match the spec.
4. Confirm no `—`, no `(unconfirmed)`, no `£NN / €NN` prices remain in the faction.
