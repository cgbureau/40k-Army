import type {
  SeedDataset,
  WeaponProfileKeywordConfig,
} from "../../../../types/_index.types";
import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../../../ids";

/**
 * 10th edition weapon profile keyword rows owned by `salamanders`.
 * Generated from BSData weapon profile keywords.
 */

export const Drakkis10eCodexSpaceMarines10eIgnoresCoverWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("drakkis__10e__codex_space_marines_10e__ignores_cover"),
  weapon_profile_id: weaponProfileId("drakkis__10e__codex_space_marines_10e"),
  keyword_id: keywordId("ignores_cover"),
  keyword_parameter: null,
};


export const Drakkis10eCodexSpaceMarines10ePistolWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("drakkis__10e__codex_space_marines_10e__pistol"),
  weapon_profile_id: weaponProfileId("drakkis__10e__codex_space_marines_10e"),
  keyword_id: keywordId("pistol"),
  keyword_parameter: null,
};


export const Drakkis10eCodexSpaceMarines10eTorrentWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("drakkis__10e__codex_space_marines_10e__torrent"),
  weapon_profile_id: weaponProfileId("drakkis__10e__codex_space_marines_10e"),
  keyword_id: keywordId("torrent"),
  keyword_parameter: null,
};


export const GauntletOfTheForge10eCodexSpaceMarines10eIgnoresCoverWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("gauntlet_of_the_forge__10e__codex_space_marines_10e__ignores_cover"),
  weapon_profile_id: weaponProfileId("gauntlet_of_the_forge__10e__codex_space_marines_10e"),
  keyword_id: keywordId("ignores_cover"),
  keyword_parameter: null,
};


export const GauntletOfTheForge10eCodexSpaceMarines10ePistolWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("gauntlet_of_the_forge__10e__codex_space_marines_10e__pistol"),
  weapon_profile_id: weaponProfileId("gauntlet_of_the_forge__10e__codex_space_marines_10e"),
  keyword_id: keywordId("pistol"),
  keyword_parameter: null,
};


export const GauntletOfTheForge10eCodexSpaceMarines10eTorrentWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("gauntlet_of_the_forge__10e__codex_space_marines_10e__torrent"),
  weapon_profile_id: weaponProfileId("gauntlet_of_the_forge__10e__codex_space_marines_10e"),
  keyword_id: keywordId("torrent"),
  keyword_parameter: null,
};


export const SpearOfVulkan10eCodexSpaceMarines10eDevastatingWoundsWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("spear_of_vulkan__10e__codex_space_marines_10e__devastating_wounds"),
  weapon_profile_id: weaponProfileId("spear_of_vulkan__10e__codex_space_marines_10e"),
  keyword_id: keywordId("devastating_wounds"),
  keyword_parameter: null,
};


export const salamandersWeaponProfileKeywords10e: SeedDataset<"weapon_profile_keywords"> = {
  table: "weapon_profile_keywords",
  records: [
    Drakkis10eCodexSpaceMarines10eIgnoresCoverWeaponProfileKeyword,
    Drakkis10eCodexSpaceMarines10ePistolWeaponProfileKeyword,
    Drakkis10eCodexSpaceMarines10eTorrentWeaponProfileKeyword,
    GauntletOfTheForge10eCodexSpaceMarines10eIgnoresCoverWeaponProfileKeyword,
    GauntletOfTheForge10eCodexSpaceMarines10ePistolWeaponProfileKeyword,
    GauntletOfTheForge10eCodexSpaceMarines10eTorrentWeaponProfileKeyword,
    SpearOfVulkan10eCodexSpaceMarines10eDevastatingWoundsWeaponProfileKeyword,
  ] satisfies WeaponProfileKeywordConfig[],
};
