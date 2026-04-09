## Adeptus Custodes 

Multi-Unit Box (Shared Kit Issue)
Talons of the Emperor (Valerian + Aleya)
- 2 characters from 1 box
- Currently mapped correctly to same kit
- System charges per unit (incorrect long-term)

3. Telemon Dreadnought (Multi-Part Kit)

Current mapping:
- Body + 2 arms (separate kit entries)

Issue:
- Not treated as a single purchasable entity
- User could get incorrect pricing depending on configuration


---

## Adeptus Mechanicus

- Cybernetica Datasmith
  → built from Kastelan Robots kit
  → shared kit dependency

- Combat Patrol: Adeptus Mechanicus
  → bundle box containing multiple units
  → not currently used in pricing logic

---  

## Aeldari

- Combat Patrol: Aeldari
  → bundle box

- Combat Patrol: Aeldari Corsairs
  → bundle box

- Eldritch Raiders Battleforce
  → large bundle box

- Fire Prism / Night Spinner / Firestorm
  → multiple vehicle variants from same chassis kit

- Wave Serpent / Falcon
  → multiple vehicle builds from same kit
  
---    

## Astra Militarum


- Combat Patrol
  → bundle kit
  → ignore for now, note for V3

- Kill Teams (Kasrkin, Ratlings, Aquilons)
  → standalone kits but alt game system
  → currently fine, but note

---     

## Chaos Daemons

- Spearhead: Blades of Khorne
  → bundle box

--- 

## Chaos Knights

- Questoris Knights (Abominant / Desecrator / Rampager / Despoiler)
  → multiple unit builds from same kit

- War Dog variants (Brigand / Karnivore / Stalker / Huntsman / Executioner)
  → multiple unit builds from same kit

- Knight Moirax
  → multiple weapon loadouts from same base kit (FW)

---

## Chaos Space Marines

- Warpforged (Venomcrawler + Obliterators)
  → multiple units from same kit

- Red Corsairs Battleforce
  → bundle box

- Combat Patrol variants
  → bundle boxes

---  

## Death Guard

- Chosen of Mortarion
  → multiple units from one kit

- Lord Felthius / Tainted Cohort
  → character + terminators from one kit

- Foetid Bloat Drone
  → variant builds from same kit

---   

## Drukhari

- Combat Patrol: Drukhari
  → bundle box

---   

## Genestealer Cults

- Astra Militarum integration
  → large number of cross-faction kits included
  → treated as valid purchasable kits (not allied)

- Tyranid crossover
  → only Genestealers included as purchasable
  → all other Tyranid units should be marked allied

- Broodcoven
  → multi-unit kit (Patriarch + Primus + Magus)
  → important for future bundle logic

- Combat Patrol: Genestealer Cults
  → bundle box

---     

## Grey Knights

*Seems like these have been treated as a CHAPTER

- Land Raider / Storm vehicles
  → shared Space Marine kits
  → require allied tagging

- Dreadnought
  → no dedicated GK kit
  → treated as allied (Space Marine source)

- Servitors
  → no direct kit
  → treated as allied

- Combat Patrol: Grey Knights
  → bundle box

---  

## Imperial Agents

- Rogue Trader Entourage
  → multiple units from one kit

- Exaction Squad variants (Exaction / Subductor / Vigilant)
  → multiple units from one kit

- Inquisitorial Agents / Aquila Kill Team
  → multiple units from one kit

- Combat Patrol: Imperial Agents
  → bundle box

---   

## Leagues of Votann

- Ironkin Steeljacks (weapon variants)
  → multiple unit builds from same kit

- Combat Patrol: Leagues of Votann
  → bundle box

- Maelstrom Battalion
  → bundle box

---   

## Orks

- Mek Gunz variants
  → multiple weapon builds from same kit

- Combat Patrol: Orks
  → bundle box

--- 

## Necrons

Royal Court sprue / box composition issue:
- canoptek_reanimator
- skorpekh_lord
- plasmancer
- cryptothralls

All map to:
- Necrons-Royal-Court-2021

Data mapping is correct for V2.4.
Shared-sprue / de-duplicated pricing is a V3 composition problem.

--- 

## SpaceMarines

Sternguard Veterans:
- Come with own 5 model kit
- Also appear in Company Heroes kit
- For now, only mapped to base Sternguard Veterans kit

Heroes of the Chapter:
- Contains lots of other units, like Chaplain, Bladeguard Veterans, Eradicators. These are all mapped to their base kit.
- Some units dont have a base kit, such as Judicar and Bladeguard Ancient. These can only be purchased in this combo box.


BLACK TEMPLARS:
- "combat-patrol-black-templars-2025"

BLOOD ANGELS:
- "blood-angels-terminator-librarian-2014" exists, but we only have one unit for "librarian_in_terminator_armour" which is mapped to BASE SPACE MARINES kit
- "combat-patrol-blood-angels-2024"
- "blood-angels-baal-predator" has been mapped to Baal predator, I think this is okay.

DARK ANGELS:
- Ravenwing Black Knights is missing from Kit file. So "dark-angels-ravenwing-bike-squadron" currently maps to Black Knights despite some difference
- "dark-angels-interrogator-chaplain-2017" doesnt have a unit to map to, also no unit found on WAHAPEDIA
- "combat-patrol-dark-angels-2024"

DEATHWATCH:
- "kill-team-deathwatch-2025" has not been mapped
- DW units noted, but no kits to map to:
"deathwatch_terminator_squad"
"deathwatch_veterans"

IRON HANDS:
- Only two kits in kit file
- Some units appearing with iron in, I am not sure if related:
"iron_priest_on_thunderwolf"
"ironclad_dreadnought"



SPACEWOLVES:
- SpWolves Venerable Dreadnought UNIT does not currently exist
- "combat-patrol-space-wolves-2025"




---


## Tau

- Crisis suits
  → variant builds from same kit
  → currently fine, but note

---

## Thousand Sons

- Exalted Sorcerers
  → multi-build box (disc + foot)
  → needs grouped logic (V3)

---

## Tyranids

- Horrors of the Hive
  → multiple units from one kit (Screamer-Killer + Neurotyrant)
  → currently mapped per unit, but shared box

- Sporocyst kit (Sporocyst / Mucolid Spores / Tyrannocyte / Spore Mines)
  → multiple units and sub-units from one kit
  → includes variable model counts (e.g. Spore Mines)
  → currently mapped individually, but shared box

- Combat Patrol: Tyranid Assault Brood
  → bundle box containing multiple units
  → not currently used in pricing logic  

