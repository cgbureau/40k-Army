import { describe, expect, it } from "vitest";

import {
  rulesFactionsDataset,
  rulesFactionSourcesDataset,
  rulesSourcesDataset,
} from "../data/_index.data";

type RulesFactionSourceRecord =
  (typeof rulesFactionSourcesDataset.records)[number];

const EXPECTED_RULES_FACTION_SOURCE_COUNTS = {
  adepta_sororitas: 8,
  adeptus_custodes: 7,
  adeptus_mechanicus: 7,
  aeldari: 7,
  astra_militarum: 10,
  black_templars: 3,
  blood_angels: 3,
  chaos_daemons: 8,
  chaos_knights: 8,
  chaos_space_marines: 12,
  dark_angels: 3,
  death_guard: 6,
  deathwatch: 1,
  drukhari: 8,
  emperors_children: 7,
  genestealer_cults: 12,
  grey_knights: 7,
  imperial_agents: 8,
  imperial_fists: 2,
  imperial_knights: 7,
  iron_hands: 2,
  leagues_of_votann: 7,
  necrons: 8,
  orks: 9,
  raven_guard: 2,
  salamanders: 2,
  space_marines: 11,
  space_wolves: 3,
  tau_empire: 7,
  thousand_sons: 7,
  tyranids: 9,
  ultramarines: 3,
  white_scars: 2,
  world_eaters: 6,
} as const;

const CURATED_SOURCE_EXPECTATIONS = [
  {
    factionSlug: "space_marines",
    sourceSlug: "boxset_warhammer_40_000_dawn_of_war_onslaught_10e",
    relationship: "supplement",
    scope: "exclusive",
  },
  {
    factionSlug: "space_marines",
    sourceSlug: "expansion_500_worlds_dread_incursions_10e",
    relationship: "supplement",
    scope: "global",
  },
  {
    factionSlug: "necrons",
    sourceSlug: "expansion_500_worlds_dread_incursions_10e",
    relationship: "supplement",
    scope: "global",
  },
  {
    factionSlug: "astra_militarum",
    sourceSlug: "expansion_death_korps_of_krieg_10e",
    relationship: "supplement",
    scope: "global",
  },
  {
    factionSlug: "emperors_children",
    sourceSlug: "white_dwarf_boarding_actions_sublime_strike_10e",
    relationship: "supplement",
    scope: "exclusive",
  },
  {
    factionSlug: "blood_angels",
    sourceSlug: "codex_space_marines_10e",
    relationship: "primary",
    scope: "shared_base",
  },
  {
    factionSlug: "blood_angels",
    sourceSlug: "codex_supplement_blood_angels_10e",
    relationship: "supplement",
    scope: "exclusive",
  },
  {
    factionSlug: "genestealer_cults",
    sourceSlug: "faction_pack_astra_militarum_10e_v1_6",
    relationship: "errata_faq",
    scope: "exclusive",
  },
  {
    factionSlug: "genestealer_cults",
    sourceSlug: "faction_pack_tyranids_10e_v1_4",
    relationship: "errata_faq",
    scope: "exclusive",
  },
  {
    factionSlug: "imperial_knights",
    sourceSlug: "faction_pack_adeptus_mechanicus_10e_v1_1",
    relationship: "errata_faq",
    scope: "exclusive",
  },
  {
    factionSlug: "chaos_space_marines",
    sourceSlug: "faction_pack_death_guard_10e_v1_1",
    relationship: "errata_faq",
    scope: "exclusive",
  },
  {
    factionSlug: "deathwatch",
    sourceSlug: "faction_pack_deathwatch_10e_v1_2",
    relationship: "errata_faq",
    scope: "exclusive",
  },
] as const;

describe("curated rules_faction_sources coverage", () => {
  it("resolves every faction/source reference and has no duplicate pairs", () => {
    const { pairKeys, unresolvedRecords } = buildRulesFactionSourcePairs();

    expect(unresolvedRecords).toEqual([]);
    expect(new Set(pairKeys).size).toBe(pairKeys.length);
  });

  it("locks the curated source-count target by faction", () => {
    const counts = countRulesFactionSourcesByFactionSlug();

    expect(counts).toEqual(EXPECTED_RULES_FACTION_SOURCE_COUNTS);
    expect(Object.values(counts).reduce((sum, count) => sum + count, 0)).toBe(
      212,
    );
  });

  it("preserves manually reviewed source relationship and scope semantics", () => {
    const recordsByPair = buildRulesFactionSourceRecordMap();

    for (const expectation of CURATED_SOURCE_EXPECTATIONS) {
      const key = `${expectation.factionSlug}__${expectation.sourceSlug}`;
      const record = recordsByPair.get(key);

      expect(record, key).toBeDefined();
      expect(record?.source_relationship).toBe(expectation.relationship);
      expect(record?.source_scope).toBe(expectation.scope);
    }
  });
});

function buildRulesFactionSourcePairs(): {
  pairKeys: string[];
  unresolvedRecords: string[];
} {
  const factionSlugById = buildFactionSlugById();
  const sourceSlugById = buildSourceSlugById();
  const pairKeys: string[] = [];
  const unresolvedRecords: string[] = [];

  for (const record of rulesFactionSourcesDataset.records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);
    const sourceSlug = sourceSlugById.get(record.rules_source_id);

    if (!factionSlug || !sourceSlug) {
      unresolvedRecords.push(record.id);
      continue;
    }

    pairKeys.push(`${factionSlug}__${sourceSlug}`);
  }

  return { pairKeys, unresolvedRecords };
}

function countRulesFactionSourcesByFactionSlug(): Record<string, number> {
  const factionSlugById = buildFactionSlugById();
  const counts: Record<string, number> = {};

  for (const record of rulesFactionSourcesDataset.records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);

    if (!factionSlug) {
      continue;
    }

    counts[factionSlug] = (counts[factionSlug] ?? 0) + 1;
  }

  return Object.fromEntries(Object.entries(counts).sort());
}

function buildRulesFactionSourceRecordMap(): Map<
  string,
  RulesFactionSourceRecord
> {
  const factionSlugById = buildFactionSlugById();
  const sourceSlugById = buildSourceSlugById();
  const recordsByPair = new Map<string, RulesFactionSourceRecord>();

  for (const record of rulesFactionSourcesDataset.records) {
    const factionSlug = factionSlugById.get(record.rules_faction_id);
    const sourceSlug = sourceSlugById.get(record.rules_source_id);

    if (factionSlug && sourceSlug) {
      recordsByPair.set(`${factionSlug}__${sourceSlug}`, record);
    }
  }

  return recordsByPair;
}

function buildFactionSlugById(): Map<string, string> {
  return new Map(
    rulesFactionsDataset.records.map((record) => [
      record.id,
      record.rules_faction_slug,
    ]),
  );
}

function buildSourceSlugById(): Map<string, string> {
  return new Map(
    rulesSourcesDataset.records.map((record) => [
      record.id,
      record.rules_source_slug,
    ]),
  );
}
