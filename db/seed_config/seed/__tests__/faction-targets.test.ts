import { describe, expect, it } from "vitest";
import {
  rulesFactionsDataset,
  rulesFactionSourcesDataset,
  rulesFactionUnitsDataset,
} from "../data/_index.data";

const TARGET_RULES_FACTION_SLUGS = [
  "adepta_sororitas",
  "adeptus_custodes",
  "adeptus_mechanicus",
  "astra_militarum",
  "grey_knights",
  "imperial_agents",
  "imperial_knights",
  "space_marines",
  "black_templars",
  "blood_angels",
  "dark_angels",
  "deathwatch",
  "imperial_fists",
  "iron_hands",
  "raven_guard",
  "salamanders",
  "space_wolves",
  "ultramarines",
  "white_scars",
  "chaos_daemons",
  "chaos_knights",
  "chaos_space_marines",
  "death_guard",
  "emperors_children",
  "thousand_sons",
  "world_eaters",
  "aeldari",
  "drukhari",
  "genestealer_cults",
  "leagues_of_votann",
  "necrons",
  "orks",
  "tau_empire",
  "tyranids",
] as const;

const EXCLUDED_RULES_FACTION_SLUGS = [
  "adeptus_titanicus",
  "titanicus_traitoris",
  "iron_warriors",
  "red_corsairs",
  "ynnari",
  "unaligned_forces",
] as const;

describe("40karmy target rules factions", () => {
  it("matches the documented 34-faction target list", () => {
    const actualSlugs = rulesFactionsDataset.records.map(
      (record) => record.rules_faction_slug,
    );

    expect(actualSlugs).toHaveLength(34);
    expect(new Set(actualSlugs)).toEqual(new Set(TARGET_RULES_FACTION_SLUGS));

    for (const excludedSlug of EXCLUDED_RULES_FACTION_SLUGS) {
      expect(actualSlugs).not.toContain(excludedSlug);
    }
  });

  it("has at least one unit mapping for every target faction", () => {
    const mappedFactionSlugs = new Set(
      rulesFactionUnitsDataset.records.map((record) => {
        const prefix = record.rules_faction_unit_slug.split("__")[0];
        return prefix;
      }),
    );

    for (const factionSlug of TARGET_RULES_FACTION_SLUGS) {
      expect(mappedFactionSlugs).toContain(factionSlug);
    }

    for (const excludedSlug of EXCLUDED_RULES_FACTION_SLUGS) {
      expect(mappedFactionSlugs).not.toContain(excludedSlug);
    }
  });

  it("has source applicability only for target factions", () => {
    const sourcedFactionSlugs = new Set(
      rulesFactionSourcesDataset.records.map((record) => {
        const faction = rulesFactionsDataset.records.find(
          (rulesFaction) => rulesFaction.id === record.rules_faction_id,
        );
        return faction?.rules_faction_slug;
      }),
    );

    expect(sourcedFactionSlugs).not.toContain(undefined);

    for (const factionSlug of TARGET_RULES_FACTION_SLUGS) {
      expect(sourcedFactionSlugs).toContain(factionSlug);
    }

    for (const excludedSlug of EXCLUDED_RULES_FACTION_SLUGS) {
      expect(sourcedFactionSlugs).not.toContain(excludedSlug);
    }
  });
});
