import type {
  ModelConfig,
  SeedDataset,
} from "../../../types/_index.types";
import { modelId } from "../../ids";

/**
 * Physical model identities owned by `blood_angels`.
 * Generated from BSData model selection entries.
 */

export const AstorathModel: ModelConfig = {
  id: modelId("astorath"),
  model_slug: "astorath",
  model_name: "Astorath",
};


export const BaalPredatorModel: ModelConfig = {
  id: modelId("baal_predator"),
  model_slug: "baal_predator",
  model_name: "Baal Predator",
};


export const BloodAngelsCaptainModel: ModelConfig = {
  id: modelId("blood_angels_captain"),
  model_slug: "blood_angels_captain",
  model_name: "Blood Angels Captain",
};


export const BrotherCorbuloLegendsModel: ModelConfig = {
  id: modelId("brother_corbulo_legends"),
  model_slug: "brother_corbulo_legends",
  model_name: "Brother Corbulo (Legends)",
};


export const CaptainTychoLegendsModel: ModelConfig = {
  id: modelId("captain_tycho_legends"),
  model_slug: "captain_tycho_legends",
  model_name: "Captain Tycho (Legends)",
};


export const ChiefLibrarianMephistonModel: ModelConfig = {
  id: modelId("chief_librarian_mephiston"),
  model_slug: "chief_librarian_mephiston",
  model_name: "Chief Librarian Mephiston",
};


export const CommanderDanteModel: ModelConfig = {
  id: modelId("commander_dante"),
  model_slug: "commander_dante",
  model_name: "Commander Dante",
};


export const DeathCompanyCaptainModel: ModelConfig = {
  id: modelId("death_company_captain"),
  model_slug: "death_company_captain",
  model_name: "Death Company Captain",
};


export const DeathCompanyCaptainWithJumpPackModel: ModelConfig = {
  id: modelId("death_company_captain_with_jump_pack"),
  model_slug: "death_company_captain_with_jump_pack",
  model_name: "Death Company Captain with Jump Pack",
};


export const DeathCompanyDreadnoughtModel: ModelConfig = {
  id: modelId("death_company_dreadnought"),
  model_slug: "death_company_dreadnought",
  model_name: "Death Company Dreadnought",
};


export const DeathCompanyDreadnoughtWithMagnaGrappleLegendsModel: ModelConfig = {
  id: modelId("death_company_dreadnought_with_magna_grapple_legends"),
  model_slug: "death_company_dreadnought_with_magna_grapple_legends",
  model_name: "Death Company Dreadnought with Magna-Grapple (Legends)",
};


export const DeathCompanyIntercessorModel: ModelConfig = {
  id: modelId("death_company_intercessor"),
  model_slug: "death_company_intercessor",
  model_name: "Death Company Intercessor",
};


export const DeathCompanyMarineModel: ModelConfig = {
  id: modelId("death_company_marine"),
  model_slug: "death_company_marine",
  model_name: "Death Company Marine",
};


export const DeathCompanyMarineWAlternateWeaponsModel: ModelConfig = {
  id: modelId("death_company_marine_w_alternate_weapons"),
  model_slug: "death_company_marine_w_alternate_weapons",
  model_name: "Death Company Marine w/ alternate weapons",
};


export const DeathCompanyMarineWBoltRifleModel: ModelConfig = {
  id: modelId("death_company_marine_w_bolt_rifle"),
  model_slug: "death_company_marine_w_bolt_rifle",
  model_name: "Death Company Marine w/Bolt Rifle",
};


export const DeathCompanyMarineWEvisceratorModel: ModelConfig = {
  id: modelId("death_company_marine_w_eviscerator"),
  model_slug: "death_company_marine_w_eviscerator",
  model_name: "Death Company Marine w/Eviscerator",
};


export const FuriosoDreadnoughtLegendsModel: ModelConfig = {
  id: modelId("furioso_dreadnought_legends"),
  model_slug: "furioso_dreadnought_legends",
  model_name: "Furioso Dreadnought (Legends)",
};


export const GabrielSethLegendsModel: ModelConfig = {
  id: modelId("gabriel_seth_legends"),
  model_slug: "gabriel_seth_legends",
  model_name: "Gabriel Seth (Legends)",
};


export const IntercessorWAlternatePistolModel: ModelConfig = {
  id: modelId("intercessor_w_alternate_pistol"),
  model_slug: "intercessor_w_alternate_pistol",
  model_name: "Intercessor w/ alternate pistol",
};


export const IntercessorWMeleeWeaponModel: ModelConfig = {
  id: modelId("intercessor_w_melee_weapon"),
  model_slug: "intercessor_w_melee_weapon",
  model_name: "Intercessor w/ melee weapon",
};


export const LemartesModel: ModelConfig = {
  id: modelId("lemartes"),
  model_slug: "lemartes",
  model_name: "Lemartes",
};


export const LibrarianDreadnoughtLegendsModel: ModelConfig = {
  id: modelId("librarian_dreadnought_legends"),
  model_slug: "librarian_dreadnought_legends",
  model_name: "Librarian Dreadnought (Legends)",
};


export const SanguinaryGuardModel: ModelConfig = {
  id: modelId("sanguinary_guard"),
  model_slug: "sanguinary_guard",
  model_name: "Sanguinary Guard",
};


export const SanguinaryPriestModel: ModelConfig = {
  id: modelId("sanguinary_priest"),
  model_slug: "sanguinary_priest",
  model_name: "Sanguinary Priest",
};


export const SanguinaryPriestOnBikeLegendsModel: ModelConfig = {
  id: modelId("sanguinary_priest_on_bike_legends"),
  model_slug: "sanguinary_priest_on_bike_legends",
  model_name: "Sanguinary Priest on Bike (Legends)",
};


export const SanguinaryPriestWithJumpPackLegendsModel: ModelConfig = {
  id: modelId("sanguinary_priest_with_jump_pack_legends"),
  model_slug: "sanguinary_priest_with_jump_pack_legends",
  model_name: "Sanguinary Priest with Jump Pack (Legends)",
};


export const TheSanguinorModel: ModelConfig = {
  id: modelId("the_sanguinor"),
  model_slug: "the_sanguinor",
  model_name: "The Sanguinor",
};


export const TychoTheLostLegendsModel: ModelConfig = {
  id: modelId("tycho_the_lost_legends"),
  model_slug: "tycho_the_lost_legends",
  model_name: "Tycho the Lost (Legends)",
};


export const bloodAngelsModels: SeedDataset<"models"> = {
  table: "models",
  records: [
    AstorathModel,
    BaalPredatorModel,
    BloodAngelsCaptainModel,
    BrotherCorbuloLegendsModel,
    CaptainTychoLegendsModel,
    ChiefLibrarianMephistonModel,
    CommanderDanteModel,
    DeathCompanyCaptainModel,
    DeathCompanyCaptainWithJumpPackModel,
    DeathCompanyDreadnoughtModel,
    DeathCompanyDreadnoughtWithMagnaGrappleLegendsModel,
    DeathCompanyIntercessorModel,
    DeathCompanyMarineModel,
    DeathCompanyMarineWAlternateWeaponsModel,
    DeathCompanyMarineWBoltRifleModel,
    DeathCompanyMarineWEvisceratorModel,
    FuriosoDreadnoughtLegendsModel,
    GabrielSethLegendsModel,
    IntercessorWAlternatePistolModel,
    IntercessorWMeleeWeaponModel,
    LemartesModel,
    LibrarianDreadnoughtLegendsModel,
    SanguinaryGuardModel,
    SanguinaryPriestModel,
    SanguinaryPriestOnBikeLegendsModel,
    SanguinaryPriestWithJumpPackLegendsModel,
    TheSanguinorModel,
    TychoTheLostLegendsModel,
  ] satisfies ModelConfig[],
};
