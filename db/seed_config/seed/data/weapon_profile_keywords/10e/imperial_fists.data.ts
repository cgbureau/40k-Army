import type {
  SeedDataset,
  WeaponProfileKeywordConfig,
} from "../../../../types/_index.types";
import { keywordId, weaponProfileId, weaponProfileKeywordId } from "../../../ids";

/**
 * 10th edition weapon profile keyword rows owned by `imperial_fists`.
 * Generated from BSData weapon profile keywords.
 */

export const ArtificerGravGun10eCodexSpaceMarines10eAntiVehicleWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("artificer_grav_gun__10e__codex_space_marines_10e__anti_vehicle"),
  weapon_profile_id: weaponProfileId("artificer_grav_gun__10e__codex_space_marines_10e"),
  keyword_id: keywordId("anti_vehicle"),
  keyword_parameter: "2+",
};


export const DornsArrow10eCodexSpaceMarines10eRapidFireWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("dorns_arrow__10e__codex_space_marines_10e__rapid_fire"),
  weapon_profile_id: weaponProfileId("dorns_arrow__10e__codex_space_marines_10e"),
  keyword_id: keywordId("rapid_fire"),
  keyword_parameter: "2",
};


export const DornsArrow10eCodexSpaceMarines10eSustainedHitsWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("dorns_arrow__10e__codex_space_marines_10e__sustained_hits"),
  weapon_profile_id: weaponProfileId("dorns_arrow__10e__codex_space_marines_10e"),
  keyword_id: keywordId("sustained_hits"),
  keyword_parameter: "1",
};


export const FistOfDorn10eCodexSpaceMarines10eDevastatingWoundsWeaponProfileKeyword: WeaponProfileKeywordConfig = {
  id: weaponProfileKeywordId("fist_of_dorn__10e__codex_space_marines_10e__devastating_wounds"),
  weapon_profile_id: weaponProfileId("fist_of_dorn__10e__codex_space_marines_10e"),
  keyword_id: keywordId("devastating_wounds"),
  keyword_parameter: null,
};


export const imperialFistsWeaponProfileKeywords10e: SeedDataset<"weapon_profile_keywords"> = {
  table: "weapon_profile_keywords",
  records: [
    ArtificerGravGun10eCodexSpaceMarines10eAntiVehicleWeaponProfileKeyword,
    DornsArrow10eCodexSpaceMarines10eRapidFireWeaponProfileKeyword,
    DornsArrow10eCodexSpaceMarines10eSustainedHitsWeaponProfileKeyword,
    FistOfDorn10eCodexSpaceMarines10eDevastatingWoundsWeaponProfileKeyword,
  ] satisfies WeaponProfileKeywordConfig[],
};
