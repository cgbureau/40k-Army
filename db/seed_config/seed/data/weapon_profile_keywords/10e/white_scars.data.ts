import type {
  SeedDataset,
  WeaponProfileKeywordConfig,
} from "../../../../types/_index.types";
import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../../../ids";

/**
 * 10th edition weapon profile keyword rows owned by `white_scars`.
 * Generated from BSData weapon profile keywords.
 */

export const Moonfang10eCodexSpaceMarines10eDevastatingWoundsWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("moonfang__10e__codex_space_marines_10e__devastating_wounds"),
  weapon_profile_id: weaponProfileId("moonfang__10e__codex_space_marines_10e"),
  keyword_id: keywordId("devastating_wounds"),
  keyword_parameter: null,
};


export const Moonfang10eCodexSpaceMarines10ePrecisionWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("moonfang__10e__codex_space_marines_10e__precision"),
  weapon_profile_id: weaponProfileId("moonfang__10e__codex_space_marines_10e"),
  keyword_id: keywordId("precision"),
  keyword_parameter: null,
};


export const Stormtooth10eCodexSpaceMarines10eAntiMonsterWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("stormtooth__10e__codex_space_marines_10e__anti_monster"),
  weapon_profile_id: weaponProfileId("stormtooth__10e__codex_space_marines_10e"),
  keyword_id: keywordId("anti_monster"),
  keyword_parameter: "4+",
};


export const Stormtooth10eCodexSpaceMarines10eAntiVehicleWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("stormtooth__10e__codex_space_marines_10e__anti_vehicle"),
  weapon_profile_id: weaponProfileId("stormtooth__10e__codex_space_marines_10e"),
  keyword_id: keywordId("anti_vehicle"),
  keyword_parameter: "4+",
};


export const Stormtooth10eCodexSpaceMarines10eLanceWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("stormtooth__10e__codex_space_marines_10e__lance"),
  weapon_profile_id: weaponProfileId("stormtooth__10e__codex_space_marines_10e"),
  keyword_id: keywordId("lance"),
  keyword_parameter: null,
};


export const whiteScarsWeaponProfileKeywords10e: SeedDataset<"weapon_profile_keywords"> = {
  table: "weapon_profile_keywords",
  records: [
    Moonfang10eCodexSpaceMarines10eDevastatingWoundsWeaponProfileKeyword,
    Moonfang10eCodexSpaceMarines10ePrecisionWeaponProfileKeyword,
    Stormtooth10eCodexSpaceMarines10eAntiMonsterWeaponProfileKeyword,
    Stormtooth10eCodexSpaceMarines10eAntiVehicleWeaponProfileKeyword,
    Stormtooth10eCodexSpaceMarines10eLanceWeaponProfileKeyword,
  ] satisfies WeaponProfileKeywordConfig[],
};
