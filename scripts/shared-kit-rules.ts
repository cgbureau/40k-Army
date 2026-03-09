export interface SharedKitRule {
  pattern: RegExp;
  kit?: string;
  kitFromUnit?: boolean;
}

export const SHARED_KIT_RULES: SharedKitRule[] = [
  { pattern: /_the_/, kitFromUnit: true },
  { pattern: /^captain_/, kit: "space-marine-captain" },
  { pattern: /^chaplain_/, kit: "space-marine-chaplain" },
  { pattern: /^apothecary_/, kit: "space-marine-apothecary" },
  { pattern: /^ancient_/, kit: "space-marine-ancient" },
  { pattern: /^death_company_marines/, kit: "death-company-marines" },
  { pattern: /^land_speeder/, kit: "land-speeder" },
  { pattern: /^wolf_guard/, kit: "wolf-guard" },
  { pattern: /^deathwatch_terminator/, kit: "terminators" },
  { pattern: /^deathwing_terminator/, kit: "terminators" },
  { pattern: /^relic_terminator/, kit: "terminators" },
  { pattern: /death_company/, kit: "assault-intercessors" },
  { pattern: /_assassin$/, kitFromUnit: true },
  { pattern: /dreadnought/, kit: "dreadnought" },
  { pattern: /predator/, kit: "space-marine-predator-annihilator" },
  { pattern: /land_raider/, kit: "space-marine-land-raider-crusader" }
];
