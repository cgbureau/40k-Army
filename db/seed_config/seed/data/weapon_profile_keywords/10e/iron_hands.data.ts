import type {
  SeedDataset,
  WeaponProfileKeywordConfig,
} from "../../../../types/_index.types";
import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../../../ids";

/**
 * 10th edition weapon profile keyword rows owned by `iron_hands`.
 * Generated from BSData weapon profile keywords.
 */

export const GorgonsWrath10eCodexSpaceMarines10eSustainedHitsWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("gorgons_wrath__10e__codex_space_marines_10e__sustained_hits"),
  weapon_profile_id: weaponProfileId("gorgons_wrath__10e__codex_space_marines_10e"),
  keyword_id: keywordId("sustained_hits"),
  keyword_parameter: "2",
};


export const MedusanManipuli10eCodexSpaceMarines10eExtraAttacksWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("medusan_manipuli__10e__codex_space_marines_10e__extra_attacks"),
  weapon_profile_id: weaponProfileId("medusan_manipuli__10e__codex_space_marines_10e"),
  keyword_id: keywordId("extra_attacks"),
  keyword_parameter: null,
};


export const ironHandsWeaponProfileKeywords10e: SeedDataset<"weapon_profile_keywords"> = {
  table: "weapon_profile_keywords",
  records: [
    GorgonsWrath10eCodexSpaceMarines10eSustainedHitsWeaponProfileKeyword,
    MedusanManipuli10eCodexSpaceMarines10eExtraAttacksWeaponProfileKeyword,
  ] satisfies WeaponProfileKeywordConfig[],
};
