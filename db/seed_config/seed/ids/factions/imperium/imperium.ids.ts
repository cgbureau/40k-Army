type SuperFactionSeedSlug = "imperium";

const superFactionSeedIds: Record<SuperFactionSeedSlug, string> = {
  imperium: "01KEKQQ141PWE8EKVJZ7Y8K31N",
};

export const superFactionId = (slug: SuperFactionSeedSlug): string => {
  return superFactionSeedIds[slug];
};

type RulesFactionSeedSlug = "space_marines" | "blood_angels";

const rulesFactionSeedIds: Record<RulesFactionSeedSlug, string> = {
  space_marines: "01KBNY9118455676VGTFPCBHJ9",
  blood_angels: "01KEER7ZGKWJN71ZHR9TVTR0RT",
};

export const rulesFactionId = (slug: RulesFactionSeedSlug): string => {
  return rulesFactionSeedIds[slug];
};

type RulesFactionSourceSeedSlug =
  | "blood_angels__codex_space_marines_10e"
  | "blood_angels__codex_supplement_blood_angels_10e"
  | "blood_angels__faction_pack_blood_angels_10e_v1_1"
  | "blood_angels__balance_dataslate_10e_v3_4"
  | "blood_angels__munitorum_field_manual_10e_v4_3"
  | "blood_angels__chapter_approved_tournament_companion_10e_2026_02"
  | "blood_angels__combat_patrol_blood_angels_sanguinary_spearhead_10e"
  | "blood_angels__combat_patrol_blood_angels_strike_force_marcellos_10e"
  | "blood_angels__combat_patrol_space_marines_strike_force_octavius_10e"
  | "blood_angels__combat_patrol_space_marines_strike_team_solarien_10e";

const rulesFactionSourceSeedIds: Record<RulesFactionSourceSeedSlug, string> = {
  blood_angels__codex_space_marines_10e: "01KWYDZSRKHPKJDQHMG74N2BSY",
  blood_angels__codex_supplement_blood_angels_10e:
    "01KSTTRJXSPH3KJBZT0PKV6KYF",
  blood_angels__faction_pack_blood_angels_10e_v1_1:
    "01KCJ99KVBAERK804KMP0BX3VR",
  blood_angels__balance_dataslate_10e_v3_4:
    "01KZADTGTTCERPHYY29FN86ATN",
  blood_angels__munitorum_field_manual_10e_v4_3:
    "01KQ106JC445D7HBQQQ7AYAX0D",
  blood_angels__chapter_approved_tournament_companion_10e_2026_02:
    "01KES24ZXR6T0C7FSQ99ZB2T4W",
  blood_angels__combat_patrol_blood_angels_sanguinary_spearhead_10e:
    "01KD6XGAXQD2XYWFKC0KHCBHWW",
  blood_angels__combat_patrol_blood_angels_strike_force_marcellos_10e:
    "01KK4NJB1RD6MV2649Q9EXT1V7",
  blood_angels__combat_patrol_space_marines_strike_force_octavius_10e:
    "01KWXYX2BV0BHK8ARN2AE6JARW",
  blood_angels__combat_patrol_space_marines_strike_team_solarien_10e:
    "01KGS4N9D421Q8VW1VD5V0PP6T",
};

export const rulesFactionSourceId = (
  slug: RulesFactionSourceSeedSlug,
): string => {
  return rulesFactionSourceSeedIds[slug];
};
