import type { SeedDataset, UnitConfig } from "../../../../types/_index.types";
import { unitId } from "../../../ids";

/**
 * 10th edition unit rows owned by `genestealer_cults`.
 */

export const AberrantsUnit: UnitConfig = {
  id: unitId("aberrants"),
  unit_name: "Aberrants",
  unit_slug: "aberrants",
  is_legends: false,
};


export const AbominantUnit: UnitConfig = {
  id: unitId("abominant"),
  unit_name: "Abominant",
  unit_slug: "abominant",
  is_legends: false,
};


export const AchillesRidgerunnersUnit: UnitConfig = {
  id: unitId("achilles_ridgerunners"),
  unit_name: "Achilles Ridgerunners",
  unit_slug: "achilles_ridgerunners",
  is_legends: false,
};


export const AcolyteHybridsWithAutopistolsUnit: UnitConfig = {
  id: unitId("acolyte_hybrids_with_autopistols"),
  unit_name: "Acolyte Hybrids with Autopistols",
  unit_slug: "acolyte_hybrids_with_autopistols",
  is_legends: false,
};


export const AcolyteHybridsWithHandFlamersUnit: UnitConfig = {
  id: unitId("acolyte_hybrids_with_hand_flamers"),
  unit_name: "Acolyte Hybrids with Hand Flamers",
  unit_slug: "acolyte_hybrids_with_hand_flamers",
  is_legends: false,
};


export const AcolyteIconwardUnit: UnitConfig = {
  id: unitId("acolyte_iconward"),
  unit_name: "Acolyte Iconward",
  unit_slug: "acolyte_iconward",
  is_legends: false,
};


export const AtalanJackalsUnit: UnitConfig = {
  id: unitId("atalan_jackals"),
  unit_name: "Atalan Jackals",
  unit_slug: "atalan_jackals",
  is_legends: false,
};


export const BenefictusUnit: UnitConfig = {
  id: unitId("benefictus"),
  unit_name: "Benefictus",
  unit_slug: "benefictus",
  is_legends: false,
};


export const BiophagusUnit: UnitConfig = {
  id: unitId("biophagus"),
  unit_name: "Biophagus",
  unit_slug: "biophagus",
  is_legends: false,
};


export const ClamavusUnit: UnitConfig = {
  id: unitId("clamavus"),
  unit_name: "Clamavus",
  unit_slug: "clamavus",
  is_legends: false,
};


export const CultGuerrillaCrucibleUnit: UnitConfig = {
  id: unitId("cult_guerrilla_crucible"),
  unit_name: "Cult Guerrilla [Crucible]",
  unit_slug: "cult_guerrilla_crucible",
  is_legends: false,
};


export const CultInsurrectionistCrucibleUnit: UnitConfig = {
  id: unitId("cult_insurrectionist_crucible"),
  unit_name: "Cult Insurrectionist [Crucible]",
  unit_slug: "cult_insurrectionist_crucible",
  is_legends: false,
};


export const GoliathRockgrinderUnit: UnitConfig = {
  id: unitId("goliath_rockgrinder"),
  unit_name: "Goliath Rockgrinder",
  unit_slug: "goliath_rockgrinder",
  is_legends: false,
};


export const GoliathTruckUnit: UnitConfig = {
  id: unitId("goliath_truck"),
  unit_name: "Goliath Truck",
  unit_slug: "goliath_truck",
  is_legends: false,
};


export const HybridMetamorphsUnit: UnitConfig = {
  id: unitId("hybrid_metamorphs"),
  unit_name: "Hybrid Metamorphs",
  unit_slug: "hybrid_metamorphs",
  is_legends: false,
};


export const JackalAlphusUnit: UnitConfig = {
  id: unitId("jackal_alphus"),
  unit_name: "Jackal Alphus",
  unit_slug: "jackal_alphus",
  is_legends: false,
};


export const KelermorphUnit: UnitConfig = {
  id: unitId("kelermorph"),
  unit_name: "Kelermorph",
  unit_slug: "kelermorph",
  is_legends: false,
};


export const LocusUnit: UnitConfig = {
  id: unitId("locus"),
  unit_name: "Locus",
  unit_slug: "locus",
  is_legends: false,
};


export const MagusUnit: UnitConfig = {
  id: unitId("magus"),
  unit_name: "Magus",
  unit_slug: "magus",
  is_legends: false,
};


export const NeophyteHybridsUnit: UnitConfig = {
  id: unitId("neophyte_hybrids"),
  unit_name: "Neophyte Hybrids",
  unit_slug: "neophyte_hybrids",
  is_legends: false,
};


export const NexosUnit: UnitConfig = {
  id: unitId("nexos"),
  unit_name: "Nexos",
  unit_slug: "nexos",
  is_legends: false,
};


export const PatriarchUnit: UnitConfig = {
  id: unitId("patriarch"),
  unit_name: "Patriarch",
  unit_slug: "patriarch",
  is_legends: false,
};


export const PrimusUnit: UnitConfig = {
  id: unitId("primus"),
  unit_name: "Primus",
  unit_slug: "primus",
  is_legends: false,
};


export const PurestrainGenestealersUnit: UnitConfig = {
  id: unitId("purestrain_genestealers"),
  unit_name: "Purestrain Genestealers",
  unit_slug: "purestrain_genestealers",
  is_legends: false,
};


export const ReductusSaboteurUnit: UnitConfig = {
  id: unitId("reductus_saboteur"),
  unit_name: "Reductus Saboteur",
  unit_slug: "reductus_saboteur",
  is_legends: false,
};


export const SanctusUnit: UnitConfig = {
  id: unitId("sanctus"),
  unit_name: "Sanctus",
  unit_slug: "sanctus",
  is_legends: false,
};


export const TectonicFragdrillUnit: UnitConfig = {
  id: unitId("tectonic_fragdrill"),
  unit_name: "Tectonic Fragdrill (Legends)",
  unit_slug: "tectonic_fragdrill",
  is_legends: false,
};


export const VoiceOfThePatriarchCrucibleUnit: UnitConfig = {
  id: unitId("voice_of_the_patriarch_crucible"),
  unit_name: "Voice of the Patriarch [Crucible]",
  unit_slug: "voice_of_the_patriarch_crucible",
  is_legends: false,
};


export const genestealerCultsUnits10e: SeedDataset<"units"> = {
  table: "units",
  records: [
    AberrantsUnit,
    AbominantUnit,
    AchillesRidgerunnersUnit,
    AcolyteHybridsWithAutopistolsUnit,
    AcolyteHybridsWithHandFlamersUnit,
    AcolyteIconwardUnit,
    AtalanJackalsUnit,
    BenefictusUnit,
    BiophagusUnit,
    ClamavusUnit,
    CultGuerrillaCrucibleUnit,
    CultInsurrectionistCrucibleUnit,
    GoliathRockgrinderUnit,
    GoliathTruckUnit,
    HybridMetamorphsUnit,
    JackalAlphusUnit,
    KelermorphUnit,
    LocusUnit,
    MagusUnit,
    NeophyteHybridsUnit,
    NexosUnit,
    PatriarchUnit,
    PrimusUnit,
    PurestrainGenestealersUnit,
    ReductusSaboteurUnit,
    SanctusUnit,
    TectonicFragdrillUnit,
    VoiceOfThePatriarchCrucibleUnit,
  ] satisfies UnitConfig[],
};
