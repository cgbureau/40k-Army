import type {
  SeedDataset,
  WeaponProfileKeywordConfig,
} from "../../../../types/_index.types";
import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../../../ids";

/**
 * 10th edition weapon profile keyword rows owned by `raven_guard`.
 * Generated from BSData weapon profile keywords.
 */

export const Blackout10eCodexSpaceMarines10ePistolWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("blackout__10e__codex_space_marines_10e__pistol"),
  weapon_profile_id: weaponProfileId("blackout__10e__codex_space_marines_10e"),
  keyword_id: keywordId("pistol"),
  keyword_parameter: null,
};


export const Blackout10eCodexSpaceMarines10ePrecisionWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("blackout__10e__codex_space_marines_10e__precision"),
  weapon_profile_id: weaponProfileId("blackout__10e__codex_space_marines_10e"),
  keyword_id: keywordId("precision"),
  keyword_parameter: null,
};


export const ClawsOfSeverax10eCodexSpaceMarines10eSustainedHitsWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("claws_of_severax__10e__codex_space_marines_10e__sustained_hits"),
  weapon_profile_id: weaponProfileId("claws_of_severax__10e__codex_space_marines_10e"),
  keyword_id: keywordId("sustained_hits"),
  keyword_parameter: "2",
};


export const ClawsOfSeverax10eCodexSpaceMarines10eTwinLinkedWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("claws_of_severax__10e__codex_space_marines_10e__twin_linked"),
  weapon_profile_id: weaponProfileId("claws_of_severax__10e__codex_space_marines_10e"),
  keyword_id: keywordId("twin_linked"),
  keyword_parameter: null,
};


export const TheRavensTalons10eCodexSpaceMarines10ePrecisionWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("the_ravens_talons__10e__codex_space_marines_10e__precision"),
  weapon_profile_id: weaponProfileId("the_ravens_talons__10e__codex_space_marines_10e"),
  keyword_id: keywordId("precision"),
  keyword_parameter: null,
};


export const TheRavensTalons10eCodexSpaceMarines10eTwinLinkedWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("the_ravens_talons__10e__codex_space_marines_10e__twin_linked"),
  weapon_profile_id: weaponProfileId("the_ravens_talons__10e__codex_space_marines_10e"),
  keyword_id: keywordId("twin_linked"),
  keyword_parameter: null,
};


export const ravenGuardWeaponProfileKeywords10e: SeedDataset<"weapon_profile_keywords"> = {
  table: "weapon_profile_keywords",
  records: [
    Blackout10eCodexSpaceMarines10ePistolWeaponProfileKeyword,
    Blackout10eCodexSpaceMarines10ePrecisionWeaponProfileKeyword,
    ClawsOfSeverax10eCodexSpaceMarines10eSustainedHitsWeaponProfileKeyword,
    ClawsOfSeverax10eCodexSpaceMarines10eTwinLinkedWeaponProfileKeyword,
    TheRavensTalons10eCodexSpaceMarines10ePrecisionWeaponProfileKeyword,
    TheRavensTalons10eCodexSpaceMarines10eTwinLinkedWeaponProfileKeyword,
  ] satisfies WeaponProfileKeywordConfig[],
};
